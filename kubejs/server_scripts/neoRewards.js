ServerEvents.recipes((event) => {
	// 数据驱动，所以我直接custom了不像之前那么写（也许比之前的更坏？
	/**
	 * @param {Internal.String} id
	 */
	function cardRegisterItem(id) {
		let json = {
			type: "randomcardrewards:card",
			content: {
				type: "item",
				content: `kubejs:relic_${id}`,
				i1: 1,
				i2: 0,
			},
			id: `randomcardrewards:${id}_card`,
			meta: {
				descriptionKey: `item.kubejs.relic_${id}.description`,
				id: `randomcardrewards:${id}_card`,
				nameKey: `item.kubejs.relic_${id}`,
				texture: `kubejs:item/relic_${id}`,
			},
		};
		return json;
	}

	let relicCard = [];
	for (let relicName in global.relicMap) {
		event.custom(cardRegisterItem(relicName)).id("randomcardrewards:" + relicName); // 配方id没用，但是加一个配方id会好管理很多罢（
		relicCard.push(`randomcardrewards:${relicName}_card`);
	}

	event
		.custom({
			type: "randomcardrewards:card_pool",
			id: "randomcardrewards:pool",
			pool: relicCard,
		})
		.id("randomcardrewards:relic_pool");
});
RCREvents.cardInvokePre((e) => {
	// 这块没改太多，改了个Events就好了
	if (e.card.content().type() == "item") {
		global.playerGetItem(e.player, Item.of(e.card.content().content()));
		e.setCanceled(true);
	}
});
/**打开奖励窗口
 * @param {Internal.Player} player
 * @param {Internal.Integer} count
 * @param {Internal.CardPool} pool
 */
global.openCardRewardsScreen = function (player, count, pool) {
	// 这块用API了
	let dePool = RandomCardRewardsAPI.createTmpCardPoolFromPoolRandomly(pool, count);
	// de发音和the很像（憋笑
	RandomCardRewardsAPI.rewardPlayerTmpPool(player, dePool);
};

// 这事测试的部分
/* PlayerEvents.chat((event) => {
	global.openCardRewardsScreen(event.player, 5, "randomcardrewards:pool");
}); */
