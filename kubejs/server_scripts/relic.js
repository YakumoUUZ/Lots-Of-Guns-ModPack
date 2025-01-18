/**
 * 添加遗物,默认数量1
 * @param {Internal.Player} player 
 * @param {string} relicName 
 * @param  {number} [count]
 * @returns {number} count
 */
function addRelic(player, relicName, count) {
    console.log(`Adding ${relicName} x ${count || 1} to ${player.name}`);
    if (!global.relicMap[relicName]) {
        player.tell("Invalid relic name");
        return 0;
    }
    let number = global.playerAddRelic(player, relicName, count);
    player.tell(`${relicName}: ${global.getPlayerRelic(player.stringUuid, relicName)}`);
    return number;
}

/**
 * 移除遗物,默认全部
 * @param {Internal.Player} player 
 * @param {string} relicName 
 * @param {number} [count] 
 * @returns {number} count
 */
function removeRelic(player, relicName, count) {
    console.log(`Removing ${relicName} x ${count || "all"} from ${player.name}`);
    if (!global.relicMap[relicName]) {
        player.tell("Invalid relic name");
        return 0;
    }
    let number = global.playerRemoveRelic(player, relicName, count);
    player.tell(`${relicName}: ${global.getPlayerRelic(player.stringUuid, relicName)}`);
    return number;
}

/**
 * 设置遗物数量
 * @param {Internal.Player} player 
 * @param {string} relicName 
 * @param {number} count 
 * @returns {number} count
 */
function setRelicCount(player, relicName, count) {
    console.log(`Setting ${relicName} count to ${count} for ${player.name}`);
    if (!global.relicMap[relicName]) {
        player.tell("Invalid relic name");
        return 0;
    }
    let number = global.playerSetRelicCount(player, relicName, count);
    player.tell(`${relicName}: ${global.getPlayerRelic(player.stringUuid, relicName)}`);
    return number;
}

/**
 * 移除所有遗物
 * @param {Internal.Player} player 
 * @returns {number} count
 */
function removeAllRelics(player) {
    console.log(`Removing all relics from ${player.name}`);
    let playerRelics = global.getPlayerRelicMap(player.stringUuid);
    let count = 0;
    for (const relicName in playerRelics) {
        count += global.playerRemoveRelic(player, relicName);
    }
    player.tell("All relics removed");
    return count;
}

//指令注册
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
                                    return addRelic(player, relicName, count);
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
                        return removeAllRelics(player);
                    })
            )
    );
});

//玩家登入时,读取nbt设置遗物
PlayerEvents.loggedIn(event => {
    global.readRelicsFromNbt(event.player);
});

