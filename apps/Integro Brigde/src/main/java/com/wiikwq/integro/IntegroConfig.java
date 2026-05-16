package com.wiikwq.integro;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import net.minecraftforge.fml.loading.FMLPaths;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public final class IntegroConfig {
    private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();
    private static final Path PATH = FMLPaths.CONFIGDIR.get().resolve("integro-bridge.json");

    public String apiBase = "https://integro.bohdan.lol";
    public String bridgeToken = "";

    public static IntegroConfig load() {
        try {
            if (Files.notExists(PATH)) {
                IntegroConfig config = new IntegroConfig();
                config.save();
                return config;
            }
            String raw = Files.readString(PATH, StandardCharsets.UTF_8);
            IntegroConfig config = GSON.fromJson(raw, IntegroConfig.class);
            return config == null ? new IntegroConfig() : config;
        } catch (Exception error) {
            Integro.LOGGER.warn("Failed to load Integro config", error);
            return new IntegroConfig();
        }
    }

    public void save() {
        try {
            Files.createDirectories(PATH.getParent());
            Files.writeString(PATH, GSON.toJson(this), StandardCharsets.UTF_8);
        } catch (IOException error) {
            Integro.LOGGER.warn("Failed to save Integro config", error);
        }
    }
}
