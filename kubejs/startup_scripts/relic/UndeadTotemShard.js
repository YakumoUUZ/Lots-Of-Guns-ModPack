function UndeadTotemShard() {
    Relic.call(this, "UndeadTotemShard");
}

inherit(UndeadTotemShard, Relic);

UndeadTotemShard.prototype.value = function (player) {
    return 1 - Math.pow(1.0625, -this.lvl(player));
};

UndeadTotemShard.prototype.onEntityHurtPlayer = function (data) {
    if (Math.random() < this.value(data.player)) {
        data.event.cancel();
    }
};

initRelic(UndeadTotemShard);
