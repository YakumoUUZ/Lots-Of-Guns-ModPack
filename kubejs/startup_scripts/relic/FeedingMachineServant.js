function FeedingMachineServant() {
    Relic.call(this, "FeedingMachineServant");
}

inherit(FeedingMachineServant, Relic);

FeedingMachineServant.prototype.value = function (player) {
    return 1 - Math.pow(1.125, -this.lvl(player));
};

FeedingMachineServant.prototype.onPlayerKillEntity = function (data) {
    if (Math.random() < this.value(data.player)) {
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
    }
};

initRelic(FeedingMachineServant);
