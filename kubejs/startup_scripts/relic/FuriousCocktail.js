function FuriousCocktail() {
	Relic.call(this, "FuriousCocktail");
}

inherit(FuriousCocktail, Relic);

FuriousCocktail.prototype.onPlayerAmmoHitEntity = function (data) {
	/** @type {{player:Internal.Player, entity:Internal.LivingEntity,player:Internal.Player,}} */
	let { entity, damage, player } = data;

	let count = this.lvl(player);
	let multiply = count * 0.1; // !!我懒了的数值策划部分 加伤倍数 -- 设置部分，我懒得写算法了，下面也随手写了个乘法
	let i = 0; // 声明一个变量用来算有多少记录好的效果在实体上
	let potList = ["minecraft:slowness", "minecraft:poison", "attributeslib:bleeding", "kubejs:stun"]; // 我想不到更好的写这个列表的方式

	potList.forEach((pot) => {
		if (entity.hasEffect(pot)) {
			i += 1;
			//player.tell(`${pot},+1,${i}`);
		}
	});
	if (i >= 4) {
		entity.attack(damage * multiply); // !!WARN 假设玩家通过这个伤害一刀秒了怪，怪不会掉落物品,且该伤害只会在第二次击中后开始生效，如果有问题的话我也不知道咋改最好😋
		//player.tell("hit!!");
	}
};

initRelic(FuriousCocktail);
