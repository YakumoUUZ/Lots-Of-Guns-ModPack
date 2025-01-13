/**
 * @param {Internal.ServerPlayer} player
 * @param {Internal.ItemStack} item
 * @returns {boolean} success
 */
global.playerGetItem = function (player, item, slot) {
    if (!item) {
        console.error("No item");
        return false;
    }
    let itemId = item.id;
    slot = slot || -1;
    if (global.coinsMap[itemId]) {
        let coin = new global.PlayerCoin(player);
        coin.add(global.coinsMap[itemId] * item.getCount());
        //TODO 音效不知道为什么没效果
        console.log(player.level);
        console.log(Utils.getSound("minecraft:entity.player.levelup"));
        player.playSound(Utils.getSound("minecraft:entity.player.levelup"), 1, 1);
        // player.level.runCommandSilent(`playsound minecraft:entity.player.levelup player ${player.getUsername().toString()}`);
        // console.log("Coins: " + coin.get());
        return true;
    }
    if (item.hasTag("relic")) {
        global.playerAddRelic(player, itemId, item.getCount());
        return true;
    }
    if (item.hasTag("weapon")) {
        if (player.inventory.count("#weapon") < 2) {
            player.inventory.add(slot, item.copy());
            return true;
        } else if (player.mainHandItem.hasTag("weapon")) {
            global.spawnItem(player.level, player.x, player.y, player.z, player.mainHandItem.copy());
            player.inventory.removeFromSelected(true);
            player.inventory.add(player.inventory.selected, item.copy());
            return true;
        } else {
            player.sendSystemMessage(Text.translate("warning.kubejs.tooManyWeapons", (2).toString()).red(), true);
            return false;
        }
    } else {
        player.inventory.add(slot, item.copy());
    }
    return true;
};

/**
 *
 * @param {Internal.EntityItemPickupEvent} event
 */
global.itemPickUp = function (event) {
    let entity = event.item;
    let item = entity.item;
    /** @type {Internal.ServerPlayer} */
    let player = event.entity;
    if (!(item.hasTag("autopickup") || entity.tags.contains("pickup"))) {
        event.setCanceled(true);
        return;
    }
    //重置标签,防止未拾取时的问题
    if (entity.tags.contains("pickup")) entity.removeTag("pickup");
    //处理金币拾取
    let itemId = item.id;
    console.log("Picked up " + itemId);
    if (!global.playerGetItem(player, item)) {
        event.setCanceled(true);
    } else {
        item.count = 0;
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
