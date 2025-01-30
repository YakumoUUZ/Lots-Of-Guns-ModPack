function ColaMentos() {
    Relic.call(this, "ColaMentos");
    this.explodePower = 3;
}

inherit(ColaMentos, Relic);

ColaMentos.prototype.onPlayerAmmoHitEntity = function (data) {
    /** @type {{attacker:Internal.Player, entity:Internal.LivingEntity, entity:Internal.Entity}} */
    let { attacker: player, entity } = data;
    if (this.chanceFired(player)) {
        player.level.explode(player, entity.x, entity.y + 1, entity.z, this.explodePower, "none");
    }
};

ColaMentos.prototype.onPlayerAmmoHitBlock = function (data) {
    /** @type {{player:Internal.Player, blockPos:BlockPos, bullet:Internal.Entity}} */
    let { player, blockPos } = data;
    if (this.chanceFired(player)) {
        player.level.explode(player, blockPos.x + 0.5, blockPos.y + 0.5, blockPos.z + 0.5, this.explodePower, "none");
    }
};

initRelic(ColaMentos);
