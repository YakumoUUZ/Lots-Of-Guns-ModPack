//priority: -1
//注册遗物物品
StartupEvents.registry("item", event => {
    for (const relicName in global.relicMap) {
        let relic = global.relicMap[relicName];
        let builder = event
            .create(relic.id)
            // .translationKey(`item.kubejs.relic.${relic.name}`) 不知为何无效
            .rarity(relic.rarity)
            .tag("relic");
        if (relic.texture) builder.texture(relic.texture);
        if (!relic.item) relic.item = Item.of(relic.id);
    }
});

//重载startup脚本时, 读取玩家的relic数量
if (global.isServerReady) {
    Utils.server.playerList.players.forEach(player => {
        global.readRelicsFromNbt(player);
    });
}
