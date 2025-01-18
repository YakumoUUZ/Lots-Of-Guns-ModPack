function CarrotSpiceOfLife() {
    Relic.call(this, "carrot_spice_of_life");
}

inherit(CarrotSpiceOfLife, Relic);

function valueChanged(data) {
    /** @type {Internal.ServerPlayer} */
    let player = data.player;
    let count = this.lvl(player);
    if (count > 0) {
        let value = 0.1 * count;
        player.modifyAttribute("generic.max_health", this.name, value, "multiply_base");
    } else {
        player.removeAttribute("generic.max_health", this.name);
    }
}

CarrotSpiceOfLife.prototype.onPlayerAddRelic = valueChanged;
CarrotSpiceOfLife.prototype.onPlayerRemoveRelic = valueChanged;

initRelic(CarrotSpiceOfLife);
