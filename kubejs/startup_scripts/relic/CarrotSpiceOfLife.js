function CarrotSpiceOfLife() {
    Relic.call(this, "CarrotSpiceOfLife");
}

inherit(CarrotSpiceOfLife, Relic);

function valueChanged(data) {
    /** @type {Internal.ServerPlayer} */
    let player = data.player;
    let count = this.lvl(player);
    if (count > 0) {
        player.modifyAttribute("generic.max_health", this.name, 0.1 * count, "multiply_base");
    } else {
        player.removeAttribute("generic.max_health", this.name);
    }
}

CarrotSpiceOfLife.prototype.onPlayerAddRelic = valueChanged;
CarrotSpiceOfLife.prototype.onPlayerRemoveRelic = valueChanged;

initRelic(CarrotSpiceOfLife);
