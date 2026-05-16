package com.wiikwq.integro;

import com.mojang.logging.LogUtils;
import net.minecraftforge.api.distmarker.Dist;
import net.minecraftforge.client.event.RegisterKeyMappingsEvent;
import net.minecraftforge.event.TickEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;
import org.slf4j.Logger;

@Mod(Integro.MODID)
public class Integro {
    public static final String MODID = "integro";
    public static final String MOD_VERSION = "1.0-SNAPSHOT";
    public static final String MINECRAFT_VERSION = "1.20.1";
    public static final Logger LOGGER = LogUtils.getLogger();

    public Integro() {
        LOGGER.info("Integro Bridge loaded");
    }

    @Mod.EventBusSubscriber(modid = MODID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
    public static class ClientModEvents {
        @SubscribeEvent
        public static void registerKeys(RegisterKeyMappingsEvent event) {
            IntegroKeys.register(event);
        }
    }

    @Mod.EventBusSubscriber(modid = MODID, value = Dist.CLIENT)
    public static class ClientForgeEvents {
        @SubscribeEvent
        public static void onClientTick(TickEvent.ClientTickEvent event) {
            if (event.phase == TickEvent.Phase.END) {
                IntegroKeys.handleTick();
            }
        }
    }
}
