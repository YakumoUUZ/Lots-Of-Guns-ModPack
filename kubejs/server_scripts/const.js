//priority: 1000
const $ProjectileUtil = Java.loadClass("net.minecraft.world.entity.projectile.ProjectileUtil");
const $ItemEntity = Java.loadClass("net.minecraft.world.entity.item.ItemEntity");
const $StructurePlaceSettings = Java.loadClass("net.minecraft.world.level.levelgen.structure.templatesystem.StructurePlaceSettings");
const $RandomSource = Java.loadClass("net.minecraft.util.RandomSource");
const $String = Java.loadClass("java.lang.String");
const NetworkHooks = Java.loadClass("net.minecraftforge.network.NetworkHooks");
const RandomCardRewards = Java.loadClass("org.hiedacamellia.randomcardrewards.RandomCardRewards");
const RCRCardMenuProvider = Java.loadClass("org.hiedacamellia.randomcardrewards.common.menu.RCRCardMenuProvider");
const CardPool = Java.loadClass("org.hiedacamellia.randomcardrewards.core.card.CardPool");
const RCRCard = Java.loadClass("org.hiedacamellia.randomcardrewards.core.card.RCRCard");
const CardContent = Java.loadClass("org.hiedacamellia.randomcardrewards.core.card.CardContent");
const CardPoolManager = Java.loadClass("org.hiedacamellia.randomcardrewards.core.card.CardPoolManager");

global.isServerReady = true;

for (const relicName in global.relicMap) {
    let relic = global.relicMap[relicName];
    if (!relic.item) relic.item = Item.of(relic.id);
}
