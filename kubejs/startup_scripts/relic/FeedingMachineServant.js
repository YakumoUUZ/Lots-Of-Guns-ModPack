function FeedingMachineServant() {
    Relic.call(this, "FeedingMachineServant");
    this.chanceFactor = 1.125;
}

inherit(FeedingMachineServant, Relic);

FeedingMachineServant.prototype.onPlayerKillEntity = function (data) {
    if (!this.chanceFired(data.player)) return;
    /** @type {Internal.Player} */
    let player = data.player;
    let gun = player.mainHandItem;
    if (gun && gun.item instanceof $AbstractGunItem) {
        let api = new $ModernKineticGunScriptAPI();
        api.setItemStack(gun);
        api.setShooter(player);
        api.setDataHolder(player.getDataHolder());
        gun.item.setCurrentAmmoCount(gun, api.getMaxAmmoCount());
        api.setAmmoInBarrel(true);
    }
};

initRelic(FeedingMachineServant);
