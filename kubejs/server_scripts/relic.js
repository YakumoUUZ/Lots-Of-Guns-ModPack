function addRelic(player, relicName, count) {
    console.log(`Adding ${relicName} x ${count || 1} to ${player.name}`);
    if (!global.relicMap[relicName]) {
        player.tell("Invalid relic name");
        return 0;
    }
    global.plyerAddRelic(player, relicName, count);
    player.tell(`${relicName}: ${global.getPlayerRelic(player.stringUuid, relicName)}`);
    return 1;
}

function removeRelic(player, relicName, count) {
    console.log(`Removing ${relicName} x ${count || 1} from ${player.name}`);
    if (!global.relicMap[relicName]) {
        player.tell("Invalid relic name");
        return 0;
    }
    global.playerRemoveRelic(player, relicName, count);
    player.tell(`${relicName}: ${global.getPlayerRelic(player.stringUuid, relicName)}`);
    return 1;
}

function setRelicCount(player, relicName, count) {
    console.log(`Setting ${relicName} count to ${count} for ${player.name}`);
    if (!global.relicMap[relicName]) {
        player.tell("Invalid relic name");
        return 0;
    }
    global.playerSetRelicCount(player, relicName, count);
    player.tell(`${relicName}: ${global.getPlayerRelic(player.stringUuid, relicName)}`);
    return 1;
}

ServerEvents.commandRegistry(event => {
    const { commands: Commands, arguments: Arguments } = event;
    event.register(
        Commands.literal("relic")
            .executes(ctx => {
                let player = ctx.source.playerOrException;
                let playerRelics = global.getPlayerRelicMap(player.stringUuid);
                if (Object.keys(playerRelics).length == 0) {
                    player.tell("You don't have any relics");
                    return 0;
                }
                for (const relicName in playerRelics) {
                    player.tell(`${relicName}: ${playerRelics[relicName]}`);
                }
                return 1;
            })
            .then(
                Commands.literal("add")
                    .requires(src => src.hasPermission(Commands.LEVEL_ADMINS))
                    .then(
                        Commands.argument("relic name", Arguments.STRING.create(event))
                            .suggests((ctx, builder) => {
                                for (const relicName in global.relicMap) {
                                    builder.suggest(relicName);
                                }
                                return builder.buildFuture();
                            })
                            .executes(ctx => {
                                let player = ctx.source.playerOrException;
                                let relicName = Arguments.STRING.getResult(ctx, "relic name");
                                return addRelic(player, relicName);
                            })
                            .then(
                                Commands.argument("count", Arguments.INTEGER.create(event)).executes(ctx => {
                                    let player = ctx.source.playerOrException;
                                    let relicName = Arguments.STRING.getResult(ctx, "relic name");
                                    let count = Arguments.INTEGER.getResult(ctx, "count");
                                    return setRelicCount(player, relicName, count);
                                })
                            )
                    )
            )
            .then(
                Commands.literal("set")
                    .requires(src => src.hasPermission(Commands.LEVEL_ADMINS))
                    .then(
                        Commands.argument("relic name", Arguments.STRING.create(event))
                            .suggests((ctx, builder) => {
                                for (const relicName in global.relicMap) {
                                    builder.suggest(relicName);
                                }
                                return builder.buildFuture();
                            })
                            .then(
                                Commands.argument("count", Arguments.INTEGER.create(event)).executes(ctx => {
                                    let player = ctx.source.playerOrException;
                                    let relicName = Arguments.STRING.getResult(ctx, "relic name");
                                    let count = Arguments.INTEGER.getResult(ctx, "count");
                                    return addRelic(player, relicName, count);
                                })
                            )
                    )
            )
            .then(
                Commands.literal("remove")
                    .requires(src => src.hasPermission(Commands.LEVEL_ADMINS))
                    .then(
                        Commands.argument("relic name", Arguments.STRING.create(event))
                            .suggests((ctx, builder) => {
                                let player = ctx.source.playerOrException;
                                let playerRelics = global.getPlayerRelicMap(player.stringUuid);
                                for (const relicName in playerRelics) {
                                    builder.suggest(relicName);
                                }
                                return builder.buildFuture();
                            })
                            .executes(ctx => {
                                let player = ctx.source.playerOrException;
                                let relicName = Arguments.STRING.getResult(ctx, "relic name");
                                return removeRelic(player, relicName);
                            })
                            .then(
                                Commands.argument("count", Arguments.INTEGER.create(event)).executes(ctx => {
                                    let player = ctx.source.playerOrException;
                                    let relicName = Arguments.STRING.getResult(ctx, "relic name");
                                    let count = Arguments.INTEGER.getResult(ctx, "count");
                                    return removeRelic(player, relicName, count);
                                })
                            )
                    )
            )
            .then(
                Commands.literal("removeall")
                    .requires(src => src.hasPermission(Commands.LEVEL_ADMINS))
                    .executes(ctx => {
                        let player = ctx.source.playerOrException;
                        global.playerRelicsMap[player.stringUuid] = {};
                        player.persistentData.remove("relic");
                        player.tell("All relics removed");
                        return 1;
                    })
            )
    );
});

/**
 * @param {Internal.Player} player
 * @param {String} relicName
 * @param {Number} count
 */
global.plyerAddRelic = function (player, relicName, count) {
    relicName = global.getRelicName(relicName);
    count = count || 1;
    let playerRelics = global.getPlayerRelicMap(player);
    if (!playerRelics[relicName]) global.playerGetRelic(player, relicName);
    playerRelics[relicName] += count;
    player.persistentData.relic.putInt(relicName, playerRelics[relicName]);
    global.postEvent(player, "onPlayerAddRelic", { player: player, relicName: relicName, count: count });
    return count;
};

/**
 * @param {Internal.Player} player
 * @param {String} relicName
 * @param {Number} count
 */
global.playerRemoveRelic = function (player, relicName, count) {
    relicName = global.getRelicName(relicName);
    let playerRelics = global.getPlayerRelicMap(player);
    if (!playerRelics[relicName]) return 0;
    let relicCount = global.getPlayerRelic(player, relicName);
    count = Math.min(relicCount, count || 1);
    playerRelics[relicName] -= count;
    player.persistentData.relic.putInt(relicName, playerRelics[relicName]);
    if (playerRelics[relicName] <= 0) global.playerLoseRelic(player, relicName);

    global.postEvent(player, "onPlayerRemoveRelic", { player: player, relicName: relicName, count: count });
    return count;
};

/**
 * @param {Internal.Player} player
 * @param {String} relicName
 * @param {Number} count
 */
global.playerSetRelicCount = function (player, relicName, count) {
    let playerRelicCount = global.getPlayerRelic(player, relicName);
    if (playerRelicCount > count) global.playerRemoveRelic(player, relicName, playerRelicCount - count);
    else if (playerRelicCount < count) global.playerAddRelic(player, relicName, count - playerRelicCount);
    return playerRelicCount - count;
};

/**
 * @param {Internal.Player} player
 * @param {String} relicName
 */
global.playerGetRelic = function (player, relicName) {
    relicName = global.getRelicName(relicName);
    let playerRelics = global.getPlayerRelicMap(player);
    playerRelics[relicName] = 0;
    if (!player.persistentData.contains("relic")) player.persistentData.merge({ relic: {} });
    player.persistentData.relic.putInt(relicName, 0);

    let relic = global.relicMap[relicName];
    let uuid = player.stringUuid;
    if (!global.playerEventsMap[uuid]) global.playerEventsMap[uuid] = {};
    let eventMap = global.playerEventsMap[uuid];
    for (const eventName of global.eventList) {
        if (relic[eventName]) {
            if (!eventMap[eventName]) eventMap[eventName] = {};
            eventMap[eventName][relicName] = true;
        }
    }
    global.postEvent(player, "onPlayerGetRelic", { player: player, relicName: relicName });
};

/**
 * @param {Internal.Player} player
 * @param {String} relicName
 */
global.playerLoseRelic = function (player, relicName) {
    relicName = global.getRelicName(relicName);
    let playerRelics = global.getPlayerRelicMap(player);
    delete playerRelics[relicName];
    player.persistentData.relic.remove(relicName);

    let relic = global.relicMap[relicName];
    let uuid = player.stringUuid;
    let eventMap = global.playerEventsMap[uuid];
    for (const eventName of global.eventList) {
        if (relic[eventName]) {
            if (!eventMap[eventName]) continue;
            delete eventMap[eventName][relicName];
        }
    }
    global.postEvent(player, "onPlayerLoseRelic", { player: player, relicName: relicName });
};

EntityEvents.death(event => {
    let player = event.source.actual;
    if (!player.isPlayer()) return;
    global.postEvent(player, "onPlayerKillEntity", { player: player, event: event });
});
