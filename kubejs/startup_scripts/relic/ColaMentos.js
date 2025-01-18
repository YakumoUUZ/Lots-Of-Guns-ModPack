function ColaMentos() {
    Relic.call(this, "ColaMentos");
}

inherit(ColaMentos, Relic);

ColaMentos.prototype.value = function (player) {
    return 1 - Math.pow(1.25, -this.lvl(player));
};

ColaMentos.prototype.onPlayerAmmoHitEntity = function (data) {
    /** @type {{player:Internal.Player, entity:Internal.LivingEntity}} */
    let { player, entity } = data;
    if (Math.random() < this.value(player)) {
        player.level.explode(player, entity.x, entity.y + 1, entity.z, 1.5, "none");
    }
};

ColaMentos.prototype.onPlayerAmmoHitBlock = function (data) {
    /** @type {{player:Internal.Player, blockPos:BlockPos}} */
    let { player, blockPos } = data;
    if (Math.random() < this.value(player)) {
        player.level.explode(player, blockPos.x + 0.5, blockPos.y + 1, blockPos.z + 0.5, 1.5, "none");
    }
};

initRelic(ColaMentos);
