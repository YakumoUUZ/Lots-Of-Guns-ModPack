function FuriousCocktail() {
    Relic.call(this, "FuriousCocktail");
    this.priority = -1;
}

inherit(FuriousCocktail, Relic);

FuriousCocktail.prototype.value = function (player) {
    return this.lvl(player) * 0.3 + 1.7;
};

FuriousCocktail.prototype.onPlayerHurtEntity = function (data) {
    // console.log(data.damageType, data.event.amount)
    if (poisonDamages[data.damageType]) return;

    /** @type {{player:Internal.Player, entity:Internal.LivingEntity, source:Internal.LivingHurtEvent.source}} */
    let { entity, player, event } = data;

    let i = 0; // 声明一个变量用来算有多少记录好的效果在实体上
    let potList = ["minecraft:slowness", "minecraft:poison", "attributeslib:bleeding", "kubejs:stun"]; // 我想不到更好的写这个列表的方式

    potList.forEach(pot => {
        if (entity.hasEffect(pot)) {
            i += 1;
        }
    });
    if (i >= 4) {
        event.amount *= this.value(player);
        // console.log("Furious Cocktail applied effect to " + event.amount);
    }
};

initRelic(FuriousCocktail);
