/**
 * @class
 * @param {Internal.Player} player
 */
function PlayerCoin(player) {
    this.player = player;
    this.data = this.player.persistentData;
    if (!this?.data?.coin) this.data.coin = 0;
}

PlayerCoin.prototype = {
    get: function () {
        return this.data.getInt("coin");
    },
    add: function (count) {
        this.data.coin = this.data.coin + count;
        updateCoinCount(this.player)
    },
    set: function (count) {
        this.data.coin = count;
        updateCoinCount(this.player)
    },
};

global.PlayerCoin = PlayerCoin;