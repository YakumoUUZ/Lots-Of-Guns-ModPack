/**
 *
 * @param {Internal.EntityHurtByGunEvent} event
 */
global.onEntityHurtByGunEvent = function (event) {
    let { attacker, amount, hurtEntity } = event;
    global.postEvent(attacker, "onEntityHurtByGun", { player: attacker, damage: amount, entity: hurtEntity, event: event });
    if (attacker.isPlayer()) {
        global.postEvent(attacker, "onPlayerAmmoHitEntity", { player: attacker, damage: amount, entity: hurtEntity, event: event });
    }
};

EntityEvents.hurt(event => {
    let {entity, damage, source: {actual: attacker}} = event;
    if (attacker.isPlayer()) {
        global.postEvent(attacker, "onPlayerHurtEntity", { player: attacker, damage: damage, event: event });
    }
    if (entity.isPlayer()) {
        global.postEvent(entity, "onEntityHurtPlayer", { player: entity, damage: damage, event: event });
    }
});

//监听实体死亡事件
EntityEvents.death(event => {
    let player = event.source.actual;
    if (!player.isPlayer()) return;
    global.postEvent(player, "onPlayerKillEntity", { player: player, event: event });
});

global.onGunReloadEvent = function (event) {
    event.gunItemStack.nbt.putInt("DummyAmmo", 9999);
};

/**
 * @param {Internal.AmmoHitBlockEvent} event
 */
global.onAmmoHitBlockEvent = function (event) {
    let player = event.ammo.getOwner();
    if (!player.isPlayer()) return;
    let blockPos = event.hitResult.blockPos;
    global.postEvent(player, "onPlayerAmmoHitBlock", { player: player, blockPos: blockPos, event: event });
};
