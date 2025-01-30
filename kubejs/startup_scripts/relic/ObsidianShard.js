//requires: attributeslib
function ObsidianShard() {
	Relic.call(this, "ObsidianShard");
}

inherit(ObsidianShard, Relic);

ObsidianShard.prototype.onPlayerHurtEntity = function (data) {
	if (poisonDamages[data.damageType]) return;
	let config = {
		time: 5, // 单位是秒
		amp: 0, // 等级
		amb: false, // 是否是环境效果（信标给予的）
		particle: true, // 要不要粒子
	};
	/** @type {{player:Internal.Player, entity:Internal.LivingEntity}} */
	let { entity } = data;
	entity.potionEffects.add("attributeslib:bleeding", config.time * 20, config.amp, config.amb, config.particle);
};

initRelic(ObsidianShard);
