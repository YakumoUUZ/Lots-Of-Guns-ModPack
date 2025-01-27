function TickReducer() {
	Relic.call(this, "TickReducer");
}

inherit(TickReducer, Relic);

TickReducer.prototype.onPlayerAmmoHitEntity = function (data) {
	let config = {
		time: 5, // 单位是秒
		amp: 0, // 等级
		amb: false, // 是否是环境效果（信标给予的）
		particle: true, // 要不要粒子
	};
	/** @type {{player:Internal.Player, entity:Internal.LivingEntity}} */
	let { entity } = data;
	entity.potionEffects.add("minecraft:slowness", config.time * 20, config.amp, config.amb, config.particle);
};

initRelic(TickReducer);
