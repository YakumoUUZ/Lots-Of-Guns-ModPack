function UndeadTotemShard() {
    Relic.call(this, "UndeadTotemShard");
    this.chanceFactor = 1.0625;
}

inherit(UndeadTotemShard, Relic);

UndeadTotemShard.prototype.onEntityHurtPlayer = function (data) {
    if (this.chanceFired(data.player)) {
        data.event.cancel();
    }
};

initRelic(UndeadTotemShard);
