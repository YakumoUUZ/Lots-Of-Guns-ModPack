/**
 * 
 * @param {Internal.EntityHurtByGunEvent} event 
 */
global.onEntityHurtByGunEvent = function(event){
    global.postEvent(event.attacker, "onEntityHurtByGun", {event: event})
}

//监听实体死亡事件
EntityEvents.death(event => {
    let player = event.source.actual;
    if (!player.isPlayer()) return;
    global.postEvent(player, "onPlayerKillEntity", { player: player, event: event });
});

global.onGunReloadEvent = function(event){
    event.gunItemStack.nbt.putInt("DummyAmmo", 9999)
}