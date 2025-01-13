//priority: 1000
const $SoundEvents = Java.loadClass("net.minecraft.sounds.SoundEvents");
const $ItemEntity = Java.loadClass("net.minecraft.world.entity.item.ItemEntity");
const $String = Java.loadClass("java.lang.String");

global.coinsMap = {
    "minecraft:emerald": 1,
    "minecraft:diamond": 5,
};

global.pedestalsTypeIconMap = {
    normal: Item.of("pedestals:pedestal"),
    firstWeapon: Item.of("tacz:modern_kinetic_gun", { GunId: "tacz:m1911" }),
    shop: Item.of("minecraft:emerald"),
    readonly: Item.of("minecraft:item_frame"),
};

global.pedestalsTypeList = Object.keys(global.pedestalsTypeIconMap);