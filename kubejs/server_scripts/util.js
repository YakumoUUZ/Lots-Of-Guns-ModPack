/**
 * @class
 * @param {Internal.Player} player
 */
global.PlayerCoin = function (player) {
    this.player = player;
    this.data = this.player.persistentData;
    if (!this?.data?.coin) this.data.coin = 0;
}

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

ServerEvents.commandRegistry(event => {
    const { commands: Commands, arguments: Arguments } = event;
    event.register(
        Commands.literal("coins")
            .executes(ctx => {
                let player = ctx.source.playerOrException;
                let playerName = player.getName().getString();
                let coin = new PlayerCoin(player).get();
                player.tell(`${playerName} has ${coin} coins`);
                return coin;
            })
            .then(
                Commands.literal("add")
                    .requires(src => src.hasPermission(Commands.LEVEL_ADMINS))
                    .then(
                        Commands.argument("count", Arguments.INTEGER.create(event)).executes(ctx => {
                            let player = ctx.source.playerOrException;
                            let coin = new PlayerCoin(player);
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
                            let coin = new PlayerCoin(player);
                            coin.set(Arguments.INTEGER.getResult(ctx, "count"));
                            return coin.get();
                        })
                    )
            )
    );
});
