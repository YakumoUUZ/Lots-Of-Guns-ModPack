function PillagerFlag() {
    Relic.call(this, "PillagerFlag");
}

inherit(PillagerFlag, Relic);

PillagerFlag.prototype.value = function (player) {
    return this.lvl(player) * 0.05 + 1.65;
};

PillagerFlag.prototype.onCoinsPickup = function (data) {
    data.count = data.count * this.value(data.player);
}

initRelic(PillagerFlag);