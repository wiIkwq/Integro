package dev.integro.bridge;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.logging.Level;

import org.bukkit.Bukkit;
import org.bukkit.plugin.java.JavaPlugin;

public final class IntegroBridgePlugin extends JavaPlugin {
    private HttpClient client;
    private WebSocket webSocket;
    private final AtomicBoolean stopping = new AtomicBoolean(false);

    @Override
    public void onEnable() {
        saveDefaultConfig();
        client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
        connect();
    }

    @Override
    public void onDisable() {
        stopping.set(true);
        if (webSocket != null) {
            webSocket.sendClose(WebSocket.NORMAL_CLOSURE, "Plugin disabled");
        }
    }

    private void connect() {
        String apiUrl = getConfig().getString("apiUrl", "");
        String token = getConfig().getString("bridgeToken", "");

        if (apiUrl.isBlank() || token.isBlank() || token.equals("replace-with-worker-bridge-token")) {
            getLogger().warning("IntegroBridge is not configured. Set apiUrl and bridgeToken in config.yml.");
            return;
        }

        client.newWebSocketBuilder()
            .header("Authorization", "Bearer " + token)
            .connectTimeout(Duration.ofSeconds(10))
            .buildAsync(URI.create(apiUrl), new BridgeListener())
            .whenComplete((socket, throwable) -> {
                if (throwable != null) {
                    getLogger().log(Level.WARNING, "Failed to connect to Integro API", throwable);
                    scheduleReconnect();
                    return;
                }
                webSocket = socket;
                getLogger().info("Connected to Integro API.");
            });
    }

    private void scheduleReconnect() {
        if (stopping.get()) return;
        long delay = Math.max(1, getConfig().getLong("reconnectSeconds", 5)) * 20L;
        Bukkit.getScheduler().runTaskLater(this, this::connect, delay);
    }

    private void executeCommands(String purchaseId, List<CommandStep> steps) {
        AtomicInteger remaining = new AtomicInteger(steps.size());
        AtomicBoolean failed = new AtomicBoolean(false);
        AtomicReference<String> message = new AtomicReference<>("");
        long cumulativeDelay = 0L;

        for (CommandStep step : steps) {
            cumulativeDelay += step.delayTicks();
            Bukkit.getScheduler().runTaskLater(this, () -> {
                try {
                    boolean ok = Bukkit.dispatchCommand(Bukkit.getConsoleSender(), step.command());
                    if (!ok) {
                        failed.set(true);
                        message.compareAndSet("", "Command returned false: " + step.command());
                    }
                } catch (RuntimeException exception) {
                    failed.set(true);
                    message.compareAndSet("", exception.getMessage());
                    getLogger().log(Level.WARNING, "Command execution failed: " + step.command(), exception);
                } finally {
                    if (remaining.decrementAndGet() == 0) {
                        sendResult(purchaseId, failed.get() ? "failed" : "completed", message.get());
                    }
                }
            }, cumulativeDelay);
        }
    }

    private void sendResult(String purchaseId, String status, String message) {
        if (webSocket == null) return;
        String safeMessage = message == null ? "" : message.replace("\\", "\\\\").replace("\"", "\\\"");
        String payload = "{\"type\":\"result\",\"id\":\"" + purchaseId + "\",\"status\":\"" + status + "\",\"message\":\"" + safeMessage + "\"}";
        webSocket.sendText(payload, true);
    }

    private final class BridgeListener implements WebSocket.Listener {
        private final StringBuilder buffer = new StringBuilder();

        @Override
        public void onOpen(WebSocket webSocket) {
            WebSocket.Listener.super.onOpen(webSocket);
            webSocket.request(1);
        }

        @Override
        public CompletionStage<?> onText(WebSocket webSocket, CharSequence data, boolean last) {
            buffer.append(data);
            if (last) {
                handleMessage(buffer.toString());
                buffer.setLength(0);
            }
            webSocket.request(1);
            return null;
        }

        @Override
        public CompletionStage<?> onClose(WebSocket webSocket, int statusCode, String reason) {
            IntegroBridgePlugin.this.webSocket = null;
            if (!stopping.get()) {
                getLogger().warning("Integro API disconnected: " + statusCode + " " + reason);
                scheduleReconnect();
            }
            return null;
        }

        @Override
        public void onError(WebSocket webSocket, Throwable error) {
            getLogger().log(Level.WARNING, "Integro WebSocket error", error);
        }

        private void handleMessage(String raw) {
            if (!raw.contains("\"type\":\"execute\"")) return;
            String purchaseId = extract(raw, "id");
            List<CommandStep> commands = extractCommands(raw);
            if (purchaseId.isBlank() || commands.isEmpty()) {
                getLogger().warning("Received invalid Integro execute payload.");
                return;
            }
            executeCommands(purchaseId, commands);
        }

        private List<CommandStep> extractCommands(String json) {
            List<CommandStep> commands = new ArrayList<>();
            int marker = json.indexOf("\"commands\":[");
            if (marker >= 0) {
                int start = json.indexOf('[', marker);
                int end = findMatchingBracket(json, start);
                if (start >= 0 && end > start) {
                    commands.addAll(extractCommandObjects(json.substring(start + 1, end)));
                }
            }

            if (commands.isEmpty()) {
                String command = extract(json, "command");
                if (!command.isBlank()) {
                    commands.add(new CommandStep(command, 0L));
                }
            }

            return commands;
        }

        private List<CommandStep> extractCommandObjects(String raw) {
            List<CommandStep> commands = new ArrayList<>();
            int depth = 0;
            int start = -1;
            boolean inString = false;
            boolean escaped = false;

            for (int i = 0; i < raw.length(); i++) {
                char ch = raw.charAt(i);
                if (escaped) {
                    escaped = false;
                    continue;
                }
                if (ch == '\\') {
                    escaped = true;
                    continue;
                }
                if (ch == '"') {
                    inString = !inString;
                    continue;
                }
                if (inString) continue;
                if (ch == '{') {
                    if (depth == 0) start = i;
                    depth++;
                } else if (ch == '}') {
                    depth--;
                    if (depth == 0 && start >= 0) {
                        String object = raw.substring(start, i + 1);
                        String command = extract(object, "command");
                        if (!command.isBlank()) {
                            long delayTicks = Math.max(0L, extractLong(object, "delayMs")) / 50L;
                            commands.add(new CommandStep(command, delayTicks));
                        }
                    }
                }
            }

            return commands;
        }

        private int findMatchingBracket(String raw, int start) {
            if (start < 0) return -1;
            int depth = 0;
            boolean inString = false;
            boolean escaped = false;
            for (int i = start; i < raw.length(); i++) {
                char ch = raw.charAt(i);
                if (escaped) {
                    escaped = false;
                    continue;
                }
                if (ch == '\\') {
                    escaped = true;
                    continue;
                }
                if (ch == '"') {
                    inString = !inString;
                    continue;
                }
                if (inString) continue;
                if (ch == '[') depth++;
                if (ch == ']') {
                    depth--;
                    if (depth == 0) return i;
                }
            }
            return -1;
        }

        private String extract(String json, String key) {
            String marker = "\"" + key + "\":\"";
            int start = json.indexOf(marker);
            if (start < 0) return "";
            start += marker.length();
            StringBuilder value = new StringBuilder();
            boolean escaped = false;
            for (int i = start; i < json.length(); i++) {
                char ch = json.charAt(i);
                if (escaped) {
                    value.append(switch (ch) {
                        case 'n' -> '\n';
                        case 'r' -> '\r';
                        case 't' -> '\t';
                        default -> ch;
                    });
                    escaped = false;
                    continue;
                }
                if (ch == '\\') {
                    escaped = true;
                    continue;
                }
                if (ch == '"') break;
                value.append(ch);
            }
            return value.toString();
        }

        private long extractLong(String json, String key) {
            String marker = "\"" + key + "\":";
            int start = json.indexOf(marker);
            if (start < 0) return 0L;
            start += marker.length();
            StringBuilder value = new StringBuilder();
            for (int i = start; i < json.length(); i++) {
                char ch = json.charAt(i);
                if (!Character.isDigit(ch)) break;
                value.append(ch);
            }
            if (value.length() == 0) return 0L;
            try {
                return Long.parseLong(value.toString());
            } catch (NumberFormatException exception) {
                return 0L;
            }
        }
    }

    private record CommandStep(String command, long delayTicks) {}
}
