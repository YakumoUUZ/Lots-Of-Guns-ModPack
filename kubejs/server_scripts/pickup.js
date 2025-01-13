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

