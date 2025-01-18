//priority: 1000
const $ProjectileUtil = Java.loadClass("net.minecraft.world.entity.projectile.ProjectileUtil");
const $ItemEntity = Java.loadClass("net.minecraft.world.entity.item.ItemEntity");
const $StructurePlaceSettings = Java.loadClass("net.minecraft.world.level.levelgen.structure.templatesystem.StructurePlaceSettings");
const $RandomSource = Java.loadClass("net.minecraft.util.RandomSource");
const $String = Java.loadClass("java.lang.String");

global.isServerReady = true;

for (const relicName in global.relicMap) {
    let relic = global.relicMap[relicName];
    if (!relic.item) relic.item = Item.of(relic.id);
}
