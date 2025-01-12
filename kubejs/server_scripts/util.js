let $StructurePlaceSettings = Java.loadClass("net.minecraft.world.level.levelgen.structure.templatesystem.StructurePlaceSettings");
let $RandomSource = Java.loadClass("net.minecraft.util.RandomSource");

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
        return this.data.getInt("coin");
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

/**
 *
 * @param {Internal.ServerLevel} level
 * @param {String} name
 * @param {Internal.BlockPos} pos
 */
global.loadStructure = function (level, name, pos) {
    let structureManager = level.getStructureManager();
    let structure = structureManager.get(name);
    if (!structure.present) {
        console.error(`Structure ${name} not found`);
        return;
    }
    structure.get().placeInWorld(level, pos, pos, new $StructurePlaceSettings(), $RandomSource.create(level.getSeed()), 2);
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

ItemEvents.firstRightClicked("stick", event => {
    if (event.hand != "MAIN_HAND") return;
    const player = event.player;
    /** @type {Internal.ServerLevel} */
    const level = player.level;
    let pos = player.rayTrace(player.getEntityReach()).block?.pos;
    if (!pos) return;
    // global.loadStructure(level, "kubejs:entrance", pos);
    level.getBlock(pos).set('air')
    console.log(AABB.ofBlock(pos));
    player.swing();
});

ServerEvents.commandRegistry(event => {
    const { commands: Commands, arguments: Arguments } = event;
    event.register(
        Commands.literal("test").executes(ctx => {
            try {
                let player = ctx.source.playerOrException;
            } catch (e) {
                console.error(e);
            }
            return 1;
        })
    );
});
