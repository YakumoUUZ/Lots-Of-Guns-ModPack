//玩家金币类 金币指令注册
//#region PlayerCoin
/**
 * @class
 * @param {Internal.Player} player
 */
global.PlayerCoin = function (player) {
    this.player = player;
    this.data = this.player.persistentData;
    if (!this?.data?.coin) this.data.coin = 0;
};

global.PlayerCoin.prototype = {
    get: function () {
        return this.data.coin;
    },
    add: function (count) {
        this.data.coin = this.data.coin + count;
        updateCoinCount(this.player);
    },
    set: function (count) {
        this.data.coin = count;
        updateCoinCount(this.player);
    },
};

ServerEvents.commandRegistry(event => {
    const { commands: Commands, arguments: Arguments } = event;
    event.register(
        Commands.literal("coins")
            .executes(ctx => {
                let player = ctx.source.playerOrException;
                let playerName = player.getName().getString();
                let coin = new global.PlayerCoin(player).get();
                player.tell(`${playerName} has ${coin} coins`);
                return coin;
            })
            .then(
                Commands.literal("add")
                    .requires(src => src.hasPermission(Commands.LEVEL_ADMINS))
                    .then(
                        Commands.argument("count", Arguments.INTEGER.create(event)).executes(ctx => {
                            let player = ctx.source.playerOrException;
                            let coin = new global.PlayerCoin(player);
                            coin.add(Arguments.INTEGER.getResult(ctx, "count"));
                            return coin.get();
                        })
                    )
            )
            .then(
                Commands.literal("set")
                    .requires(src => src.hasPermission(Commands.LEVEL_ADMINS))
                    .then(
                        Commands.argument("count", Arguments.INTEGER.create(event)).executes(ctx => {
                            let player = ctx.source.playerOrException;
                            let coin = new global.PlayerCoin(player);
                            coin.set(Arguments.INTEGER.getResult(ctx, "count"));
                            return coin.get();
                        })
                    )
            )
    );
});
//#endregion

/**
 * 加载结构
 * @param {Internal.ServerLevel} level
 * @param {String} name
 * @param {BlockPos} pos
 */
global.loadStructure = function (level, name, pos, settings) {
    let structureManager = level.getStructureManager();
    let structure = structureManager.get(name);
    if (!structure.present) {
        console.error(`Structure ${name} not found`);
        return;
    }
    let structureSettings = new $StructurePlaceSettings();
    if (settings) {
        if (settings.mirror) structureSettings.setMirror(settings.mirror);
        if (settings.rotation) structureSettings.setRotation(settings.rotation);
        if (settings.ignoreEntities) structureSettings.setIgnoreEntities(settings.ignoreEntities);
    }
    structure.get().placeInWorld(level, pos, pos, structureSettings, $RandomSource.create(level.getSeed()), 2);
};

/**
 * 生成物品实体
 * @param {Internal.Level} level
 * @param {Internal.ItemStack} item
 * @param {Vec3d} pos
 * @param {*} random
 * @returns {Internal.ItemEntity}
 */
global.spawnItem = function (level, item, pos, random) {
    let entity;
    let x = pos.x(),
        y = pos.y(),
        z = pos.z();
    if (random === true) {
        entity = new $ItemEntity(level, x, y, z, item);
    } else if (random) {
        entity = new $ItemEntity(level, x, y, z, item, random.x(), random.y(), random.z());
    } else {
        entity = new $ItemEntity(level, x, y, z, item, 0, 0, 0);
    }
    entity.spawn();
    return entity;
};

/**
 *
 * @param {Internal.Player} player
 * @param {Internal.SoundEvent_} sound
 * @param {Vec3d} pos
 * @param {number} volume
 * @param {number} pitch
 */
global.playSound = function (player, sound, pos, volume, pitch) {
    pos = pos || player.position();
    volume = volume || 1;
    pitch = pitch || 1;
    player.level.playSound(null, pos.x(), pos.y(), pos.z(), sound, player.getSoundSource(), volume, pitch);
};

//测试用
//#region test
ItemEvents.firstRightClicked("stick", event => {
    if (event.hand != "MAIN_HAND") return;
    let player = event.player;
    let item = player.mainHandItem;
    /** @type {Internal.ServerLevel} */
    const level = player.level;
    let pos = player.rayTrace(player.getEntityReach()).block?.pos;
    if (!pos) return;
    // global.spawnPedestal(player.level, pos.above(), {type: "normal",item: global.getRandomRelic("common").item.copy()});
    // global.loadStructure(level, "kubejs:entrance", pos);
    // level.getBlock(pos).set("air");
    // global.playerRelicsMap[player.stringUuid] = {};
    // player.persistentData.remove("relic");
    // global.playerRemoveRelic(player, "piranha_sushi");
    // console.log(global.getPlayerRelicMap(player));
    // global.playSound(player, "entity.player.levelup")
    player.swing();
});

/**
 * @param {Internal.Player} player
 */
global.testFunc = function (player) {
    let itemStack = player.mainHandItem;
    // itemStack.nbt.remove("DummyAmmo")
    // itemStack.nbt.putInt("DummyAmmo", 9999)
    console.log(global.getRandomRelic("common"));
    // console.log(player.stringUuid instanceof $String);
    // console.log(global.getPlayerRelicMap(player));
};

ServerEvents.commandRegistry(event => {
    const { commands: Commands, arguments: Arguments } = event;
    event.register(
        Commands.literal("test").executes(ctx => {
            try {
                let player = ctx.source.playerOrException;
                global.testFunc(player);
            } catch (e) {
                console.error(e);
            }
            return 1;
        })
    );
    event.register(
        Commands.literal("getplayerdata").executes(ctx => {
            let player = ctx.source.playerOrException;
            player.tell(player.persistentData);
            console.log(player.persistentData);
            return 1;
        })
    );
});
//#endregion
