/* let relicCards = [];
for (let relicName in global.relicMap) {
    let cardId = RandomCardRewards.rl(relicName);
    let card = new RCRCard(cardId, `item.kubejs.relic_${relicName}`, "descriptionKey", RandomCardRewards.rl("empty"), CardContent["item(java.lang.String)"](global.relicMap[relicName].id));
    relicCards.push(card);

}

let relicRewardsPoolRl = RandomCardRewards.rl("relic_rewards");
let relicRewardsPool = new CardPool(relicCards, relicRewardsPoolRl);
CardPoolManager.addCardPool(relicRewardsPoolRl, relicRewardsPool);

global.openCardRewardsScreen = function (player) {
    NetworkHooks.openScreen(player, new RCRCardMenuProvider(relicRewardsPoolRl));
};

randomcardrewards.cardInvokePre(e => {
    if(e.card.content().type() == "item"){
        global.playerGetItem(e.player, Item.of(e.card.content().content()))
        e.setCanceled(true);
    }
})
 */
