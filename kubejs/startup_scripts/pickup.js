let $SoundEvents = Java.loadClass("net.minecraft.sounds.SoundEvents");

/**
 *
 * @param {Internal.EntityItemPickupEvent} event
 */
global.itemPickUp = function (event) {
    let entity = event.item;
    let item = entity.item;
    let player = event.entity;
    if (!(item.hasTag("autopickup") || entity.tags.contains("pickup"))) {
        event.setCanceled(true);
        return;
    }
    //重置标签,防止未拾取时的问题
    if (entity.tags.contains("pickup")) entity.removeTag("pickup");
    //处理金币拾取
    let itemId = item.getItem().id;
    console.log("Picked up " + itemId);
    if (global.coinsMap[itemId]) {
        let coin = new global.PlayerCoin(player);
        coin.add(global.coinsMap[itemId]);
        item.setCount(0);
        //todo 音效不知道为什么没效果
        player.playSound($SoundEvents.EXPERIENCE_ORB_PICKUP, 1, 1);
        player.level.runCommandSilent(`playsound minecraft:entity.player.levelup entity ${player.getUsername().toString()}`)
        console.log("Coins: " + coin.get());
    }
};

function tryCatch(fun, args) {
    try {
        fun(args);
    } catch (error) {
        console.error(error);
    }
}

ForgeEvents.onEvent("net.minecraftforge.event.entity.player.EntityItemPickupEvent", e => tryCatch(global.itemPickUp, e));
