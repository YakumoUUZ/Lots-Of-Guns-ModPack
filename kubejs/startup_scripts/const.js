//priority: 1000
const $KeyMapping = Java.loadClass("net.minecraft.client.KeyMapping");
const $GLFWkey = Java.loadClass("org.lwjgl.glfw.GLFW");
const $Minecraft = Java.loadClass("net.minecraft.client.Minecraft");
const $InputConstants$Type = Java.loadClass("com.mojang.blaze3d.platform.InputConstants$Type");
const $SoundEvents = Java.loadClass("net.minecraft.sounds.SoundEvents");
const $ItemEntity = Java.loadClass("net.minecraft.world.entity.item.ItemEntity");
const $String = Java.loadClass("java.lang.String");
const $AbstractGunItem = Java.loadClass("com.tacz.guns.api.item.gun.AbstractGunItem");
const $ModernKineticGunScriptAPI = Java.loadClass("com.tacz.guns.item.ModernKineticGunScriptAPI");
const $BlockEntity = Java.loadClass("net.minecraft.world.level.block.entity.BlockEntity")

global.PackId = "kubejs:";

global.coinsMap = {
	"minecraft:emerald": 1,
	"minecraft:diamond": 5,
};

global.pedestalsTypeIconMap = {};

global.pedestalsTypeItemMap = {
	normal: "pedestals:pedestal",
	giver: "pedestals:smooth_stone_pedestal",
	firstWeapon: "pedestals:polished_diorite_pedestal",
	shop: "pedestals:cherry_planks_pedestal",
	readonly: "pedestals:quartz_pedestal",
};

global.pedestalsTagItemMap = {
	weapon: "pedestals:bamboo_planks_pedestal",
	relic: "pedestals:birch_planks_pedestal",
	consumables: "pedestals:jungle_planks_pedestal",
};

global.pedestalsTypeList = {};

const poisonDamages = {
	"attributeslib:bleeding": true,
}

/**
 *
 * @param {Internal.StartupEventJS} event
 */
function postInit(event) {
	global.pedestalsTypeIconMap = {
		normal: Item.of("pedestals:pedestal"),
		giver: Item.of("minecraft:glow_item_frame"),
		firstWeapon: Item.of("tacz:modern_kinetic_gun", { GunId: "tacz:m1911" }),
		shop: Item.of("minecraft:emerald"),
		readonly: Item.of("minecraft:item_frame"),
	};

	global.pedestalsTypeList = Object.keys(global.pedestalsTypeIconMap);
}

if (global.isServerReady) postInit();

StartupEvents.postInit(postInit);
