package com.wiikwq.integro;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import net.minecraft.ChatFormatting;
import net.minecraft.client.Minecraft;
import net.minecraft.network.chat.ClickEvent;
import net.minecraft.network.chat.Component;

import java.awt.Desktop;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.WebSocket;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

public final class IntegroBridgeClient {
    public static final IntegroBridgeClient INSTANCE = new IntegroBridgeClient();

    private final Gson gson = new Gson();
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(12)).build();
    private final ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor((task) -> {
        Thread thread = new Thread(task, "Integro Bridge");
        thread.setDaemon(true);
        return thread;
    });

    private IntegroConfig config = IntegroConfig.load();
    private volatile WebSocket socket;
    private volatile boolean connecting;
    private volatile boolean running;
    private volatile boolean heartbeatActive;
    private volatile ScheduledFuture<?> heartbeatTask;

    private IntegroBridgeClient() {
    }

    public void toggle() {
        if (running || connecting || socket != null) {
            stop();
        } else {
            start();
        }
    }

    public void reconnect() {
        stopSocket();
        start();
    }

    public void start() {
        if (connecting || socket != null) {
            chat("Bridge уже подключается или работает.", ChatFormatting.YELLOW);
            return;
        }
        running = true;
        if (config.bridgeToken == null || config.bridgeToken.isBlank()) {
            startDeviceLogin();
        } else {
            connectWebSocket(config.bridgeToken);
        }
    }

    public void stop() {
        running = false;
        stopSocket();
        chat("Bridge остановлен.", ChatFormatting.GRAY);
    }

    private void stopSocket() {
        WebSocket current = socket;
        socket = null;
        connecting = false;
        stopHeartbeat();
        if (current != null) {
            current.sendClose(WebSocket.NORMAL_CLOSURE, "Stopped");
        }
    }

    private void startDeviceLogin() {
        connecting = true;
        executor.execute(() -> {
            try {
                JsonObject body = new JsonObject();
                body.addProperty("deviceName", Minecraft.getInstance().getUser().getName());
                body.addProperty("modVersion", Integro.MOD_VERSION);
                body.addProperty("minecraftVersion", Integro.MINECRAFT_VERSION);

                HttpRequest request = HttpRequest.newBuilder(deviceStartUri())
                    .timeout(Duration.ofSeconds(15))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(gson.toJson(body)))
                    .build();
                HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
                JsonObject data = readData(response);
                String code = data.get("code").getAsString();
                String loginUrl = data.get("loginUrl").getAsString();
                long pollAfterMs = data.has("pollAfterMs") ? data.get("pollAfterMs").getAsLong() : 2500L;

                chatLink("Авторизуй Integro Bridge: " + code, loginUrl);
                openBrowser(loginUrl);
                pollDeviceCode(code, pollAfterMs);
            } catch (Exception error) {
                connecting = false;
                chat("Не удалось начать логин: " + error.getMessage(), ChatFormatting.RED);
                Integro.LOGGER.warn("Device login failed", error);
            }
        });
    }

    private void pollDeviceCode(String code, long delayMs) {
        executor.schedule(() -> {
            if (!running) {
                connecting = false;
                return;
            }
            try {
                HttpRequest request = HttpRequest.newBuilder(devicePollUri(code))
                    .timeout(Duration.ofSeconds(15))
                    .GET()
                    .build();
                HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
                JsonObject data = readData(response);
                String status = data.get("status").getAsString();
                if ("approved".equals(status)) {
                    String token = data.get("token").getAsString();
                    config.bridgeToken = token;
                    config.save();
                    chat("Логин подтвержден. Подключаю Bridge...", ChatFormatting.GREEN);
                    connectWebSocket(token);
                    return;
                }
                if ("denied".equals(status) || "expired".equals(status)) {
                    connecting = false;
                    String reason = data.has("reason") && !data.get("reason").isJsonNull()
                        ? data.get("reason").getAsString()
                        : "код устарел или доступ запрещен";
                    chat("Bridge не подключен: " + reason, ChatFormatting.RED);
                    return;
                }
                pollDeviceCode(code, delayMs);
            } catch (Exception error) {
                connecting = false;
                chat("Ошибка проверки логина: " + error.getMessage(), ChatFormatting.RED);
                Integro.LOGGER.warn("Device poll failed", error);
            }
        }, Math.max(1000L, delayMs), TimeUnit.MILLISECONDS);
    }

    private void connectWebSocket(String token) {
        connecting = true;
        http.newWebSocketBuilder()
            .header("Authorization", "Bearer " + token)
            .connectTimeout(Duration.ofSeconds(15))
            .buildAsync(bridgeUri(), new BridgeListener())
            .whenComplete((webSocket, error) -> {
                connecting = false;
                if (error != null) {
                    socket = null;
                    chat("Bridge не подключился: " + error.getMessage(), ChatFormatting.RED);
                    Integro.LOGGER.warn("WebSocket connect failed", error);
                    return;
                }
                socket = webSocket;
                startHeartbeat(webSocket);
                chat("Bridge online. Команды со стрима будут выполняться в Minecraft.", ChatFormatting.GREEN);
            });
    }

    private void startHeartbeat(WebSocket webSocket) {
        stopHeartbeat();
        heartbeatActive = true;
        heartbeatTask = executor.scheduleAtFixedRate(() -> {
            if (!running || socket != webSocket || !heartbeatActive) return;
            JsonObject ping = new JsonObject();
            ping.addProperty("type", "ping");
            ping.addProperty("time", System.currentTimeMillis());
            webSocket.sendText(gson.toJson(ping), true);
        }, 0L, 5L, TimeUnit.SECONDS);
    }

    private void stopHeartbeat() {
        heartbeatActive = false;
        ScheduledFuture<?> currentTask = heartbeatTask;
        heartbeatTask = null;
        if (currentTask != null) {
            currentTask.cancel(false);
        }
    }

    private void handleMessage(String raw) {
        try {
            JsonObject payload = JsonParser.parseString(raw).getAsJsonObject();
            String type = payload.has("type") ? payload.get("type").getAsString() : "";
            if ("hello".equals(type)) {
                return;
            }
            if ("execute".equals(type)) {
                executePurchase(payload);
            }
        } catch (Exception error) {
            Integro.LOGGER.warn("Invalid bridge message: {}", raw, error);
        }
    }

    private void executePurchase(JsonObject payload) {
        String id = payload.get("id").getAsString();
        List<CommandStep> steps = parseSteps(payload);
        executor.execute(() -> {
            try {
                for (CommandStep step : steps) {
                    if (step.delayMs > 0) {
                        Thread.sleep(step.delayMs);
                    }
                    runCommand(step.command);
                }
                sendResult(id, "completed", "");
            } catch (Exception error) {
                sendResult(id, "failed", error.getMessage());
            }
        });
    }

    private List<CommandStep> parseSteps(JsonObject payload) {
        List<CommandStep> steps = new ArrayList<>();
        if (payload.has("commands") && payload.get("commands").isJsonArray()) {
            JsonArray commands = payload.getAsJsonArray("commands");
            for (int index = 0; index < commands.size(); index += 1) {
                JsonObject item = commands.get(index).getAsJsonObject();
                String command = item.has("command") ? item.get("command").getAsString().trim() : "";
                long delayMs = item.has("delayMs") ? item.get("delayMs").getAsLong() : 0L;
                if (!command.isEmpty()) {
                    steps.add(new CommandStep(command, Math.max(0L, Math.min(600000L, delayMs))));
                }
            }
        }
        if (steps.isEmpty() && payload.has("command")) {
            steps.add(new CommandStep(payload.get("command").getAsString(), 0L));
        }
        return steps;
    }

    private void runCommand(String command) throws Exception {
        CountDownLatch latch = new CountDownLatch(1);
        AtomicReference<String> error = new AtomicReference<>("");
        Minecraft.getInstance().execute(() -> {
            try {
                Minecraft minecraft = Minecraft.getInstance();
                if (minecraft.player == null || minecraft.player.connection == null) {
                    error.set("Игрок не в мире");
                    return;
                }
                String clean = command.trim();
                if (clean.startsWith("/")) {
                    clean = clean.substring(1);
                }
                if (clean.isBlank()) {
                    error.set("Пустая команда");
                    return;
                }
                minecraft.player.connection.sendCommand(clean);
            } catch (Exception commandError) {
                error.set(commandError.getMessage());
            } finally {
                latch.countDown();
            }
        });

        if (!latch.await(5, TimeUnit.SECONDS)) {
            throw new IllegalStateException("Minecraft не ответил на выполнение команды");
        }
        if (!error.get().isBlank()) {
            throw new IllegalStateException(error.get());
        }
    }

    private void sendResult(String id, String status, String message) {
        WebSocket current = socket;
        if (current == null) return;
        JsonObject result = new JsonObject();
        result.addProperty("type", "result");
        result.addProperty("id", id);
        result.addProperty("status", status);
        result.addProperty("message", message == null ? "" : message);
        current.sendText(gson.toJson(result), true);
    }

    private JsonObject readData(HttpResponse<String> response) {
        JsonObject root = JsonParser.parseString(response.body()).getAsJsonObject();
        if (response.statusCode() >= 400 || root.has("ok") && !root.get("ok").getAsBoolean()) {
            String message = root.has("error")
                ? root.getAsJsonObject("error").get("message").getAsString()
                : "HTTP " + response.statusCode();
            throw new IllegalStateException(message);
        }
        return root.getAsJsonObject("data");
    }

    private URI deviceStartUri() {
        return URI.create(normalizedApiBase() + "/bridge/device/start");
    }

    private URI devicePollUri(String code) {
        return URI.create(normalizedApiBase() + "/bridge/device/poll?code=" + code);
    }

    private URI bridgeUri() {
        String base = normalizedApiBase();
        String websocketBase = base.startsWith("https://")
            ? "wss://" + base.substring("https://".length())
            : "ws://" + base.substring("http://".length());
        return URI.create(websocketBase + "/bridge/connect");
    }

    private String normalizedApiBase() {
        String value = config.apiBase == null || config.apiBase.isBlank()
            ? "https://integro.bohdan.lol"
            : config.apiBase.trim();
        while (value.endsWith("/")) {
            value = value.substring(0, value.length() - 1);
        }
        return value;
    }

    private void chat(String message, ChatFormatting color) {
        Minecraft.getInstance().execute(() -> {
            if (Minecraft.getInstance().player != null) {
                Minecraft.getInstance().player.sendSystemMessage(
                    Component.literal("[Integro] ").withStyle(ChatFormatting.AQUA)
                        .append(Component.literal(message).withStyle(color))
                );
            }
        });
    }

    private void chatLink(String message, String url) {
        Minecraft.getInstance().execute(() -> {
            if (Minecraft.getInstance().player != null) {
                Minecraft.getInstance().player.sendSystemMessage(
                    Component.literal("[Integro] ").withStyle(ChatFormatting.AQUA)
                        .append(Component.literal(message)
                            .withStyle((style) -> style
                                .withColor(ChatFormatting.GREEN)
                                .withUnderlined(true)
                                .withClickEvent(new ClickEvent(ClickEvent.Action.OPEN_URL, url))))
                );
            }
        });
    }

    private void openBrowser(String url) {
        try {
            if (Desktop.isDesktopSupported()) {
                Desktop.getDesktop().browse(URI.create(url));
            }
        } catch (Exception error) {
            Integro.LOGGER.debug("Could not open browser automatically", error);
        }
    }

    private record CommandStep(String command, long delayMs) {
    }

    private final class BridgeListener implements WebSocket.Listener {
        private final StringBuilder buffer = new StringBuilder();

        @Override
        public CompletionStage<?> onText(WebSocket webSocket, CharSequence data, boolean last) {
            buffer.append(data);
            if (last) {
                String message = buffer.toString();
                buffer.setLength(0);
                handleMessage(message);
            }
            webSocket.request(1);
            return null;
        }

        @Override
        public void onOpen(WebSocket webSocket) {
            webSocket.request(1);
        }

        @Override
        public CompletionStage<?> onClose(WebSocket webSocket, int statusCode, String reason) {
            if (socket == webSocket) {
                socket = null;
            }
            stopHeartbeat();
            if (running) {
                chat("Bridge отключился: " + reason, ChatFormatting.YELLOW);
            }
            return null;
        }

        @Override
        public void onError(WebSocket webSocket, Throwable error) {
            if (socket == webSocket) {
                socket = null;
            }
            stopHeartbeat();
            chat("Bridge ошибка: " + error.getMessage(), ChatFormatting.RED);
            Integro.LOGGER.warn("WebSocket error", error);
        }
    }
}
