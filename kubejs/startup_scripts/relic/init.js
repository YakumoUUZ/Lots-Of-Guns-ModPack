//priority: -1
//注册遗物物品
StartupEvents.registry("item", event => {
    for (const relicName in global.relicMap) {
        let relic = global.relicMap[relicName];
        event
        .create(relic.id)
        .rarity(relic.rarity)
        .texture(relic.texture)
        .tag('relic')
        .translationKey(`item.kubejs.relic.${relic.name}`)
    }
});

//重载startup脚本时, 读取玩家的relic数量
if(global.playerSetRelicCount){
    Utils.server.playerList.players.forEach(player => {
        global.readRelicsFromNbt(player)
    })
}