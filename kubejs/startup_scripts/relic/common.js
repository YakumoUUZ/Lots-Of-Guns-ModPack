//priority: 100
global.relicPrefix = "kubejs:relic_";
global.relicMap = {};

global.playerRelicsMap = {};

/**
 *
 * @param {string} str
 */
function toIdCase(str) {
    let newStr = [];
    for (let char of str) {
        if (char.match(/[A-Z]/)) {
            if (newStr.length == 0) newStr.push(char.toLowerCase());
            else newStr.push("_" + char.toLowerCase());
        } else {
            newStr.push(char);
        }
    }
    return newStr.join("");
}

//遗物基类
function Relic(name) {
    this.name = toIdCase(name);
    this.id = global.relicPrefix + this.name;
    this.rarity = "common";
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
    let relics = player.persistentData.relic;
    for (let relicName in relics) {
        let relicLvl = relics[relicName];
        global.playerSetRelicCount(player, relicName, relicLvl);
    }
};

/**
 * 玩家添加遗物方法,默认数量1
 * @param {Internal.Player} player
 * @param {String} relicName
 * @param {Number} [count]
 * @returns {Number} count
 */
global.playerAddRelic = function (player, relicName, count) {
    relicName = global.getRelicName(relicName);
    count = count || 1;
    let playerRelics = global.getPlayerRelicMap(player);
    if (!playerRelics[relicName]) global.playerGetRelic(player, relicName);
    playerRelics[relicName] += count;
    player.persistentData.relic.putInt(relicName, playerRelics[relicName]);
    global.postEvent(player, "onPlayerAddRelic", { player: player, relicName: relicName, count: count });
    return count;
};

/**
 * 玩家移除遗物方法,默认全部
 * @param {Internal.Player} player
 * @param {String} relicName
 * @param {Number} [count]
 * @returns {Number} count
 */
global.playerRemoveRelic = function (player, relicName, count) {
    relicName = global.getRelicName(relicName);
    let playerRelics = global.getPlayerRelicMap(player);
    if (!playerRelics[relicName]) return 0;
    let relicCount = global.getPlayerRelic(player, relicName);
    count = count ? Math.min(relicCount, count) : relicCount;
    playerRelics[relicName] -= count;
    player.persistentData.relic.putInt(relicName, playerRelics[relicName]);
    global.postEvent(player, "onPlayerRemoveRelic", { player: player, relicName: relicName, count: count });

    if (playerRelics[relicName] <= 0) global.playerLoseRelic(player, relicName);
    return count;
};

/**
 * 玩家设置遗物数量方法
 * @param {Internal.Player} player
 * @param {String} relicName
 * @param {Number} count
 * @returns {Number} count
 */
global.playerSetRelicCount = function (player, relicName, count) {
    let playerRelicCount = global.getPlayerRelic(player, relicName);
    if (playerRelicCount > count) global.playerRemoveRelic(player, relicName, playerRelicCount - count);
    else if (playerRelicCount < count) global.playerAddRelic(player, relicName, count - playerRelicCount);
    else {
        player.persistentData.relic.putInt(relicName, global.getPlayerRelicMap(player)[relicName]);
    }
    return playerRelicCount - count;
};

/**
 * 玩家获得遗物方法
 * @param {Internal.Player} player
 * @param {String} relicName
 */
global.playerGetRelic = function (player, relicName) {
    relicName = global.getRelicName(relicName);
    let playerRelics = global.getPlayerRelicMap(player);
    playerRelics[relicName] = 0;
    if (!player.persistentData.contains("relic")) player.persistentData.merge({ relic: {} });
    player.persistentData.relic.putInt(relicName, 0);

    let relic = global.relicMap[relicName];
    let uuid = player.stringUuid;
    if (!global.playerEventsMap[uuid]) global.playerEventsMap[uuid] = {};
    let eventMap = global.playerEventsMap[uuid];
    for (const eventName of global.eventList) {
        if (relic[eventName]) {
            if (!eventMap[eventName]) eventMap[eventName] = {};
            eventMap[eventName][relicName] = true;
        }
    }
    global.postEvent(player, "onPlayerGetRelic", { player: player, relicName: relicName });
};

/**
 * 玩家失去遗物方法
 * @param {Internal.Player} player
 * @param {String} relicName
 */
global.playerLoseRelic = function (player, relicName) {
    relicName = global.getRelicName(relicName);
    let playerRelics = global.getPlayerRelicMap(player);
    delete playerRelics[relicName];
    player.persistentData.relic.remove(relicName);

    let relic = global.relicMap[relicName];
    let uuid = player.stringUuid;
    let eventMap = global.playerEventsMap[uuid];
    for (const eventName of global.eventList) {
        if (relic[eventName]) {
            if (!eventMap[eventName]) continue;
            delete eventMap[eventName][relicName];
        }
    }
    global.postEvent(player, "onPlayerLoseRelic", { player: player, relicName: relicName });
};
