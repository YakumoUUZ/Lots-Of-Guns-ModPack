function PiranhaSushi() {
    Relic.call(this, "piranha_sushi");
    this.item = Item.of("golden_apple");
    this.sushi = Item.of("apple");
}

inherit(PiranhaSushi, Relic);

PiranhaSushi.prototype.value = function (player) {
    return this.lvl(player) * 0.3 + 0.2;
};

PiranhaSushi.prototype.onPlayerKillEntity = function (data) {
    /** @type {Internal.LivingEntityDeathEventJS} */
    let event = data.event;
    /** @type {Internal.Player} */
    let player = data.player;
    let value = parseFloat(this.value(player.stringUuid).toFixed(1));
    let number = Math.floor(value);
    number += Math.random() < value - number ? 1 : 0;
    if (number > 10) {
        global.spawnItem(player.level, this.sushi.copyWithCount(number), event.entity.position(), true);
    } else {
        for (let i = 0; i < number; i++) {
            global.spawnItem(player.level, this.sushi.copy(), event.entity.position(), true);
        }
    }
};

initRelic(PiranhaSushi);
