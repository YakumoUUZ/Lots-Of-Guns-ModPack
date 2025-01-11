PlayerEvents.loggedIn(event => initCoinIcon(event.player));

function getCoin(player) {
    return (player.persistentData.getInt("coin") || 0).toString();
}

/**
 * @param {Internal.Player} player
 */
function initCoinIcon(player) {
    player.paint({
        CoinIcon: {
            type: "item",
            item: "minecraft:emerald",
            scale: 1.5,
            x: 10,
            y: 10,
            alignX: "left",
            alignY: "top",
            draw: "ingame",
        },
        CoinCount: {
            type: "text",
            text: getCoin(player),
            scale: 1.5,
            x: 20,
            y: 10,
            alignX: "left",
            alignY: "top",
            draw: "ingame",
        },
    });
}

/**
 * @param {Internal.Player} player
 */
function updateCoinCount(player) {
    player.paint({
        CoinCount: {
            text: getCoin(player),
        },
    });
}
