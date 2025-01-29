function FuriousCocktail() {
    Relic.call(this, "FuriousCocktail");
}

inherit(FuriousCocktail, Relic);

FuriousCocktail.prototype.value = function (player) {
    return this.lvl(player) * 0.1 + 1; // !!我懒了的数值策划部分 加伤倍数 -- 设置部分，我懒得写算法了，下面也随手写了个乘法
};

FuriousCocktail.prototype.onPlayerHurtEntity = function (data) {
    /** @type {{player:Internal.Player, entity:Internal.LivingEntity}} */
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
    }
};

initRelic(FuriousCocktail);
