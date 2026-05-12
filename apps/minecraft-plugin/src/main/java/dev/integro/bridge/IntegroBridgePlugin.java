package dev.integro.bridge;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.time.Duration;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.atomic.AtomicBoolean;
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

    private void executeCommand(String purchaseId, String command) {
        Bukkit.getScheduler().runTask(this, () -> {
            try {
                boolean ok = Bukkit.dispatchCommand(Bukkit.getConsoleSender(), command);
                sendResult(purchaseId, ok ? "completed" : "failed", ok ? "" : "Command returned false");
            } catch (RuntimeException exception) {
                getLogger().log(Level.WARNING, "Command execution failed: " + command, exception);
                sendResult(purchaseId, "failed", exception.getMessage());
            }
        });
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
            String command = extract(raw, "command");
            if (purchaseId.isBlank() || command.isBlank()) {
                getLogger().warning("Received invalid Integro execute payload.");
                return;
            }
            executeCommand(purchaseId, command);
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
                    value.append(ch);
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
    }
}
