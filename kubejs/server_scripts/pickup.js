const autoPickUpItems = ["minecraft:emerald"];

//给物品添加标签
ServerEvents.tags("item", event => {
    for (const item of autoPickUpItems) {
        event.add("autopickup", item);
    }
    for (const item in global.coinsMap) {
        event.add("autopickup", item);
    }
    event.add("weapon", "tacz:modern_kinetic_gun");
});

//监听右键点击物品实体事件
//给点击的物品实体添加pickup标签，设置无拾取延迟，并让玩家与物品实体碰撞
ItemEvents.firstRightClicked(event => {
    if (event.hand != "MAIN_HAND") return;
    const player = event.player;
    const hitResult = $ProjectileUtil.getHitResultOnViewVector(player, () => true, player.reachDistance);
    /** @type {Internal.Entity} */
    const entity = hitResult.entity;
    if (!entity || !(entity instanceof $ItemEntity) || entity.tags.contains("pickup")) return;
    entity.addTag("pickup");
    entity.setNoPickUpDelay();
    entity.playerTouch(player);
    player.swing();
});

/**
 * 玩家获得物品
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
    //如果是金币
    if (global.coinsMap[itemId]) {
        let coin = new global.PlayerCoin(player);
        coin.add(global.coinsMap[itemId] * item.getCount());
        //TODO 音效不知道为什么没效果
        // player.level.playSound(player, player, player.getSoundSource(), "minecraft:entity.player.levelup", 1, 1);
        // player.level.runCommandSilent(`playsound minecraft:entity.player.levelup player ${player.getUsername().toString()}`);
        // console.log("Coins: " + coin.get());
        return true;
    }
    //如果是遗物
    if (item.hasTag("relic")) {
        global.playerAddRelic(player, itemId, item.getCount());
        return true;
    }
    //如果是武器
    if (item.hasTag("weapon")) {
        if (player.inventory.count("#weapon") < 2) {
            //玩家武器小于上限,直接拾取
            player.inventory.add(slot, item.copy().withNBT({ DummyAmmo: NBT.intTag(9999) }));
            return true;
        } else if (player.mainHandItem.hasTag("weapon")) {
            //玩家武器达到上限,并且手持武器,将手持武器掉落,然后获得新武器
            let itemEntity = global.spawnItem(player.level, player.mainHandItem.copy(), player.position());
            player.inventory.removeFromSelected(true);
            player.inventory.add(player.inventory.selected, item.copy().withNBT({ DummyAmmo: NBT.intTag(9999) }));
            return itemEntity;
        } else {
            //玩家武器达到上限,并且没有手持武器,提示武器上限
            player.sendSystemMessage(Text.translate("warning.kubejs.tooManyWeapons", (2).toString()).red(), true);
            return false;
        }
    }
    //其他物品
    player.inventory.add(slot, item.copy());
    return true;
};

/**
 *  监听玩家拾取物品事件
 * @param {Internal.EntityItemPickupEvent} event
 */
global.onItemPickUpEvent = function (event) {
    let entity = event.item;
    let item = entity.item;
    /** @type {Internal.ServerPlayer} */
    let player = event.entity;
    //如果没有自动拾取标签,只有当右键物品实体时拾取
    if (!(item.hasTag("autopickup") || entity.tags.contains("pickup"))) {
        event.setCanceled(true);
        return;
    }
    //重置标签,防止未拾取时的问题
    if (entity.tags.contains("pickup")) entity.removeTag("pickup");
    //处理玩家获得物品
    let itemId = item.id;
    console.log("Picked up " + itemId);
    if (!global.playerGetItem(player, item)) {
        event.setCanceled(true);
    } else {
        item.count = 0;
    }
};
