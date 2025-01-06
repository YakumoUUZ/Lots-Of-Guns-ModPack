const $ProjectileUtil = Java.loadClass('net.minecraft.world.entity.projectile.ProjectileUtil')
const $ItemEntity = Java.loadClass('net.minecraft.world.entity.item.ItemEntity')

const autoPickUpItems = ["minecraft:emerald"];

ServerEvents.tags("item", event => {
    for (const item of autoPickUpItems) {
        event.add("autopickup", item);
    }
    for (const item in coinsMap) {
        event.add("autopickup", item);
    }
});

ItemEvents.firstRightClicked(event => {
    const player = event.player
    const hitResult = $ProjectileUtil.getHitResultOnViewVector(player, () => true, player.reachDistance)
    /** @type {Internal.Entity} */
    const entity = hitResult.entity
    if (!entity || !(entity instanceof $ItemEntity) || entity.tags.contains('pickup')) return
    entity.addTag('pickup')
    entity.setNoPickUpDelay()
    entity.playerTouch(player)
    player.swing()
})