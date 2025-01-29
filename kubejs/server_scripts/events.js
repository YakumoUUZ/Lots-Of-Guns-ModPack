/**
 *
 * @param {Internal.EntityHurtByGunEvent} event
 */
global.onEntityHurtByGunEvent = function (event) {
    let { attacker } = event;
    let data = {
        event: event,
        amount: event.amount,
        entity: event.hurtEntity,
        attacker: attacker,
        bullet: event.bullet,
    };
    global.postEvent(attacker, "onEntityHurtByGun", data);
    if (attacker.isPlayer()) {
        global.postEvent(attacker, "onPlayerAmmoHitEntity", data);
    }
};

/**
 * @param {Internal.AmmoHitBlockEvent} event
 */
global.onAmmoHitBlockEvent = function (event) {
    let player = event.ammo.getOwner();
    if (!player.isPlayer()) return;
    let blockPos = event.hitResult.blockPos;
    global.postEvent(player, "onPlayerAmmoHitBlock", { player: player, blockPos: blockPos, event: event, bullet: event.ammo });
};

/**
 * @param {Internal.LivingHurtEvent} event
 */
global.onLivingHurtEvent = function(event) {
    let {
        entity,
        amount,
        source: { actual: attacker },
    } = event;
    if (attacker.isPlayer()) {
        global.postEvent(attacker, "onPlayerHurtEntity", { player: attacker, entity: entity, amount: amount, event: event });
    }
    if (entity.isPlayer()) {
        global.postEvent(entity, "onEntityHurtPlayer", { player: entity, entity: attacker, amount: amount, event: event });
    }
};

//监听实体死亡事件
EntityEvents.death(event => {
    let player = event.source.actual;
    if (!player.isPlayer()) return;
    global.postEvent(player, "onPlayerKillEntity", { player: player, event: event });
});

global.onGunReloadEvent = function (event) {
    event.gunItemStack.nbt.putInt("DummyAmmo", 9999);
};
