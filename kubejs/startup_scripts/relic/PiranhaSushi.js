function PiranhaSushi() {
    Relic.call(this, "PiranhaSushi");
    this.sushi = "kubejs:piranha_sushi_healitem";
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
    let value = parseFloat(this.value(player).toFixed(1));
    let number = Math.floor(value);
    number += Math.random() < value - number ? 1 : 0;
    if (number > 10) {
        global.spawnItem(player.level, Item.of(this.sushi, number), event.entity.position(), true);
    } else {
        for (let i = 0; i < number; i++) {
            global.spawnItem(player.level, Item.of(this.sushi), event.entity.position(), true);
        }
    }
};

PiranhaSushi.prototype.init = function () {
    global.addCommonEventHandler("onItemPickupPre", "PiranhaSushi", data => {
        if (data.item.id == this.sushi) {
            data.player.heal(data.item.count);
            data.item = null;
        }
    });
};

initRelic(PiranhaSushi);
