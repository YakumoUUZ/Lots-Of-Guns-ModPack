//#region forge events
function tryCatch(fun, args) {
    try {
        fun(args);
    } catch (error) {
        console.error(error);
    }
}

ForgeEvents.onEvent("net.minecraftforge.event.entity.player.EntityItemPickupEvent", e => tryCatch(global.onItemPickUpEvent, e));
ForgeEvents.onEvent("net.minecraftforge.event.entity.player.ItemTooltipEvent", e => tryCatch(global.onItemTooltipEvent, e));
//#endregion

global.eventList = ["onPlayerGetRelic", "onPlayerLoseRelic", "onPlayerAddRelic", "onPlayerRemoveRelic", "onPlayerKillEntity"];

global.commonEventsMap = {};
global.playerEventsMap = {};

/**
 * 推送事件
 * @param {Internal.Player} player
 * @param {string} eventName
 * @param {*} data
 */
global.postEvent = function (player, eventName, data) {
    if (!(player instanceof $String)) player = player.stringUuid;
    console.log(`postEvent: ${eventName} to ${player} with data ${data}`);
    //全局事件
    if (global.commonEventsMap[eventName] && Object.keys(global.commonEventsMap[eventName]).length > 0) {
        for (const handlerId in global.commonEventsMap[eventName]) {
            global.commonEventsMap[eventName][handlerId](data);
        }
    }
    //玩家事件
    let playerEvents = global.playerEventsMap[player];
    if (!(playerEvents && playerEvents[eventName])) return;
    if (playerEvents[eventName] && Object.keys(playerEvents[eventName]).length > 0) {
        for (const relicName in playerEvents[eventName]) {
            global.relicMap[relicName][eventName](data);
        }
    }
};

/**
 * 注册全局事件
 * @param {string} eventName 
 * @param {string} handlerId 
 * @param {function({}):void} handler 
 * @returns 
 */
global.addCommonEventHandler = function (eventName, handlerId, handler) {
    if (!global.commonEventsMap[eventName]) global.commonEventsMap[eventName] = {};
    if (global.commonEventsMap[eventName][handlerId]) return;
    global.commonEventsMap[eventName][handlerId] = handler;
};
