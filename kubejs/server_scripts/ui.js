PlayerEvents.loggedIn(event => initCoinIcon(event.player));

/**
 *
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
            draw: "always",
        },
        CoinCount: {
            type: "text",
            text: "0",
            scale: 1.5,
            x: 20,
            y: 10,
            alignX: "left",
            alignY: "top",
            draw: "always",
        },
    });
}
