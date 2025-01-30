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
global.onLivingHurtEvent = function (event) {
    let {
        entity,
        source: { actual: attacker },
    } = event;
    let data = {
        event: event,
        source: event.source,
        amount: event.amount,
        damageType: event.source.type().msgId(),
    };
    if (attacker && attacker.isPlayer()) {
        data.player = attacker;
        data.entity = entity;
        global.postEvent(attacker, "onPlayerHurtEntity", data);
    }
    if (entity.isPlayer()) {
        data.player = entity;
        data.entity = attacker;
        global.postEvent(entity, "onEntityHurtPlayer", data);
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
