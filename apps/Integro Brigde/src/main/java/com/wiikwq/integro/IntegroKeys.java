package com.wiikwq.integro;

import com.mojang.blaze3d.platform.InputConstants;
import net.minecraft.client.KeyMapping;
import net.minecraftforge.client.event.RegisterKeyMappingsEvent;
import net.minecraftforge.client.settings.KeyConflictContext;
import org.lwjgl.glfw.GLFW;

public final class IntegroKeys {
    private static final KeyMapping START_STOP = new KeyMapping(
        "key.integro.start_stop",
        KeyConflictContext.IN_GAME,
        InputConstants.Type.KEYSYM,
        GLFW.GLFW_KEY_F8,
        "key.categories.integro"
    );

    private static final KeyMapping RECONNECT = new KeyMapping(
        "key.integro.reconnect",
        KeyConflictContext.IN_GAME,
        InputConstants.Type.KEYSYM,
        GLFW.GLFW_KEY_F9,
        "key.categories.integro"
    );

    private IntegroKeys() {
    }

    public static void register(RegisterKeyMappingsEvent event) {
        event.register(START_STOP);
        event.register(RECONNECT);
    }

    public static void handleTick() {
        while (START_STOP.consumeClick()) {
            IntegroBridgeClient.INSTANCE.toggle();
        }
        while (RECONNECT.consumeClick()) {
            IntegroBridgeClient.INSTANCE.reconnect();
        }
    }
}
