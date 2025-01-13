const autoPickUpItems = ["minecraft:emerald"];

ServerEvents.tags("item", event => {
    for (const item of autoPickUpItems) {
        event.add("autopickup", item);
    }
    for (const item in global.coinsMap) {
        event.add("autopickup", item);
    }
    event.add("weapon", "tacz:modern_kinetic_gun");
});

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

