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
ForgeEvents.onEvent("net.minecraftforge.event.entity.living.LivingHurtEvent", e => tryCatch(global.onLivingHurtEvent, e));
ForgeEvents.onEvent("com.tacz.guns.api.event.common.EntityHurtByGunEvent$Pre", e => tryCatch(global.onEntityHurtByGunEvent, e));
ForgeEvents.onEvent("com.tacz.guns.api.event.common.GunReloadEvent", e => tryCatch(global.onGunReloadEvent, e));
ForgeEvents.onEvent("com.tacz.guns.api.event.server.AmmoHitBlockEvent", e => tryCatch(global.onAmmoHitBlockEvent, e));
//#endregion

global.eventList = [
    "onEntityHurtByGun",
    "onPlayerAmmoHitEntity",
    "onPlayerAmmoHitBlock",
    "onPlayerHurtEntity",
    "onEntityHurtPlayer",
    "onPlayerKillEntity",
    "onItemPickupPre",
    "onCoinsPickup",
    "onPlayerGetRelic",
    "onPlayerLoseRelic",
    "onPlayerAddRelic",
    "onPlayerRemoveRelic",
];

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
    // console.log(`postEvent: ${eventName} to ${player} with data ${data}`);
    //全局事件
    if (global.commonEventsMap[eventName] && Object.keys(global.commonEventsMap[eventName]).length > 0) {
        for (const handlerId in global.commonEventsMap[eventName]) {
            global.commonEventsMap[eventName][handlerId](data);
        }
    }
    //玩家事件
    let playerEvents = global.playerEventsMap[player];
    if (!(playerEvents && playerEvents[eventName])) return;
    if (playerEvents[eventName] && playerEvents[eventName].length > 0) {
        for (const relicName of playerEvents[eventName]) {
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
