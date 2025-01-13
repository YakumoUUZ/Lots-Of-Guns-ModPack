//priority: -1
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