function VampireFang() {
    Relic.call(this, "VampireFang");
}

inherit(VampireFang, Relic);

VampireFang.prototype.value = function (player) {
    return this.lvl(player) * 0.1;
};

VampireFang.prototype.onPlayerHurtEntity = function (data) {
    let { player, amount } = data;
    player.heal(amount * this.value(player));
};

initRelic(VampireFang);
