//priority: 100
global.relicPrefix = "kubejs:relic_";
global.relicMap = {};
global.eventList = ["onPlayerGetRelic", "onPlayerLoseRelic", "onPlayerAddRelic", "onPlayerRemoveRelic", "onPlayerKillEntity"];

global.playerEventsMap = {};

global.playerRelicsMap = {};

//遗物基类
function Relic(name) {
    this.name = name;
    this.id = global.relicPrefix + name;
    this.rarity = "common";
    this.texture = "minecraft:item/diamond";
}

//获取遗物等级
Relic.prototype.lvl = function (player) {
    return global.getPlayerRelic(player, this.name) || 0;
};

//继承
function inherit(child, parent) {
    let prototype = object(parent.prototype);
    prototype.constructor = child;
    child.prototype = prototype;
}

// 这个函数的作用可以理解为复制了一份父类的原型对象
// 如果直接将子类的原型对象赋值为父类原型对象
// 那么修改子类原型对象其实就相当于修改了父类的原型对象
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}

/**
 * 根据名称获取遗物id
 * @param {string} relicName 
 * @returns {string} id
 */
global.getRelicId = function (relicName) {
    return global.relicMap[relicName].id;
};

/**
 * 根据id获取遗物名称
 * @param {string} relicId 
 * @returns {string} name
 */
global.getRelicName = function (relicId) {
    if (relicId.startsWith(global.relicPrefix)) relicId = relicId.substring(global.relicPrefix.length());
    return relicId;
};

/**
 * 获取玩家的遗物表
 * @param {Internal.Player} player 
 * @returns {{string: number}}
 */
global.getPlayerRelicMap = function (player) {
    if (!(player instanceof $String)) player = player.stringUuid;
    if (!global.playerRelicsMap[player]) global.playerRelicsMap[player] = {};
    return global.playerRelicsMap[player];
};

/**
 * 获取玩家的遗物数量
 * @param {Internal.Player} player 
 * @param {string} relicName 
 * @returns {number} number
 */
global.getPlayerRelic = function (player, relicName) {
    let playerRelics = global.getPlayerRelicMap(player);
    return playerRelics[relicName] || 0;
};

/**
 * 初始化遗物
 * @param {*} relicClass 
 */
function initRelic(relicClass) {
    let relic = new relicClass();
    global.relicMap[relic.name] = relic;
}

/**
 * 从nbt中读取玩家的遗物信息
 * @param {Internal.Player} player 
 */
global.readRelicsFromNbt = function (player) {
    if (!player.persistentData.contains("relic")) return;
    let relics = player.persistentData.relic
    for (let relicName in relics){
        let relicLvl = relics[relicName];
        global.playerSetRelicCount(player, relicName, relicLvl)
    }
}

/**
 * 推送事件
 * @param {Internal.Player} player 
 * @param {string} eventName 
 * @param {*} data 
 */
global.postEvent = function (player, eventName, data) {
    if (!(player instanceof $String)) player = player.stringUuid;
    console.log(`postEvent: ${eventName} to ${player} with data ${data}`);
    let playerEvents = global.playerEventsMap[player];
    if (!(playerEvents && playerEvents[eventName])) return;
    if (playerEvents[eventName] && Object.keys(playerEvents[eventName]).length > 0) {
        for (const relicName in playerEvents[eventName]) {
            global.relicMap[relicName][eventName](data);
        }
    }
};
