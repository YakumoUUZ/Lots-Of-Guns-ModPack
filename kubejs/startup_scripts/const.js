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