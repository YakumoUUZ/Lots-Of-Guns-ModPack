function VampireFang() {
    Relic.call(this, "VampireFang");
}

inherit(VampireFang, Relic);

VampireFang.prototype.value = function (player) {
    return this.lvl(player) * 0.01;
};

VampireFang.prototype.onPlayerHurtEntity = function (data) {
    let { player, damage } = data;
    player.heal(damage * this.value(player));
};

initRelic(VampireFang);
