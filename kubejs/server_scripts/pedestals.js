BlockEvents.rightClicked(event => {
    if (event.block && event.block.id.startsWith("pedestals:")) event.cancel();
});

ItemEvents.firstRightClicked(event => {
    if (event.hand != "MAIN_HAND") return;
    /** @type {Internal.ServerPlayer} */
    let player = event.player;
    let block = player.rayTrace(player.getBlockReach()).block;
    if (!(block && block.id.startsWith("pedestals:"))) return;
    pedestalInteract(player, block);
});

function menuItem(item, name) {
    return item.setHoverName(Text.of(name)).withNBT({ chestMenuItem: true, HideFlags: 63 });
}

/**
 *  打开展示台设置界面
 * @param {Internal.ServerPlayer} player
 * @param {Internal.BlockContainerJS} block
 */
function pedestalStettingGUI(player, block) {
    player.openChestGUI(Text.translate("gui.kubejs.pedestalSetting.title"), 2, gui => {
        let pedestalItemSlot = gui.getSlot(0, 1);
        let pedestalTypeSlot = gui.getSlot(2, 1);
        let priceSlot = gui.getSlot(4, 1);
        let priceActionSlot = gui.getSlot(5, 1);
        let pricePerActionList = [1, 5, 10, 20, 50, 100, 200, 500, 1000];
        let pricePerActionIndex = 0;
        pedestalItemSlot.setItem(block.inventory.getStackInSlot(0));
        gui.playerSlots = true;

        function pedestalType() {
            return block.entity.persistentData.getString("pedestalType");
        }
        //刷新界面
        function refresh() {
            pedestalTypeSlot.setItem(menuItem(global.pedestalsTypeIconMap[pedestalType()].copy(), `Current Type: ${pedestalType()}`));
            if (pedestalType() == "shop") {
                if (!block.entity.persistentData.contains("price")) block.entity.persistentData.putInt("price", 1);
                priceSlot.setItem(menuItem(Item.of("minecraft:emerald"), `price: ${block.entity.persistentData.getInt("price")}`));
                priceActionSlot.setItem(menuItem(Item.of("minecraft:emerald"), `price pre action: ${pricePerActionList[pricePerActionIndex]}`));
            } else {
                priceSlot.setItem(Item.empty);
                priceActionSlot.setItem(Item.empty);
            }
        }
        refresh();
        //设置展示架的类型
        for (let index = 0; index < global.pedestalsTypeList.length; index++) {
            let type = global.pedestalsTypeList[index];
            gui.button(index, 0, menuItem(global.pedestalsTypeIconMap[type], type), type, () => {
                block.inventory.setStackInSlot(0, Item.empty);
                block = global.spawnPedestal(player.level, block.pos, { type: type, item: pedestalItemSlot.getItem() });
                refresh();
            });
        }
        //设置展示架上的物品
        pedestalItemSlot.setLeftClicked(e => {
            pedestalItemSlot.setItem(Item.empty);
            block.inventory.setStackInSlot(0, Item.empty);
        });
        gui.inventoryClicked = function (clickEvent) {
            pedestalItemSlot.setItem(clickEvent.item);
            block.inventory.setStackInSlot(0, clickEvent.item);
        };
        //价格相关的操作
        function addPriceFun(factor) {
            return e => {
                if (block.entity.persistentData.pedestalType != "shop") return;
                block.entity.persistentData.price += factor * pricePerActionList[pricePerActionIndex];
                priceSlot.getItem().setHoverName(Text.of(`price: ${block.entity.persistentData.getInt("price")}`));
            };
        }
        function indexMove(step) {
            return e => {
                pricePerActionIndex = (pricePerActionIndex + step + pricePerActionList.length) % pricePerActionList.length;
                priceActionSlot.getItem().setHoverName(Text.of(`price pre action: ${pricePerActionList[pricePerActionIndex]}`));
            };
        }
        priceSlot.setLeftClicked(addPriceFun(1));
        priceSlot.setRightClicked(addPriceFun(-1));
        priceActionSlot.setLeftClicked(indexMove(1));
        priceActionSlot.setRightClicked(indexMove(-1));
    });
}

/**
 * @param {Internal.ServerPlayer} player
 * @param {Internal.BlockContainerJS} block
 */
function pedestalInteract(player, block) {
    let inventory = block.inventory;
    let pedestalItem = inventory.getStackInSlot(0);
    function pedestalType() {
        return block.entity.persistentData.getString("pedestalType");
    }
    if (!block.entity.persistentData.contains("pedestalType")) {
        block.entity.persistentData.putString("pedestalType", global.pedestalsTypeList[0]);
    }
    //如果是创造模式并且蹲下, 打开设置界面
    if (player.isCreative() && player.isCrouching()) {
        // player.openGUI(gui => {})
        pedestalStettingGUI(player, block);
        return;
    }
    //根据展示台类型执行相应的操作
    if (pedestalItem.isEmpty()) return;
    switch (pedestalType()) {
        case global.pedestalsTypeList[0]: {
            let itemEntity = global.playerGetItem(player, pedestalItem);
            if (itemEntity) {
                inventory.setStackInSlot(0, itemEntity?.item || Item.empty);
                if (itemEntity.discard) itemEntity.discard();
            }
            break;
        }
        case global.pedestalsTypeList[1]: {
            let item = pedestalItem.copy();
            if (item.item.activateKeyLevel1 && !item.nbt?.key_activated) item.item.activateKeyLevel1(player.server, item, 4);
            global.playerGetItem(player, item);
            break;
        }
        case global.pedestalsTypeList[2]: {
            let weapon = player.inventory.find("#weapon");
            if (weapon >= 0) {
                player.inventory.removeItem(weapon, 1);
                global.playerGetItem(player, pedestalItem, weapon);
            } else {
                global.playerGetItem(player, pedestalItem);
            }
            break;
        }
        case global.pedestalsTypeList[3]: {
            let price = block.entity.persistentData.getInt("price");
            let playerCoin = new global.PlayerCoin(player);
            if (playerCoin.get() >= price) {
                playerCoin.add(-price);
                block.inventory.setStackInSlot(0, Item.empty);
                global.spawnPedestal(player.level, block.pos, { type: global.pedestalsTypeList[0], item: pedestalItem });
                // block.entity.persistentData.pedestalType = global.pedestalsTypeList[0];
                // pedestalInteract(player, block);
            } else {
                player.sendSystemMessage(Text.translate("warning.kubejs.notEnoughCoins").red(), true);
            }
            break;
        }
    }
    player.swing();
}

/**
 * 生成展示台方法
 * @param {Internal.LevelKJS} level
 * @param {BlockPos} pos
 * @param {{type:string, item:Internal.ItemStack, price?:number, id?:string}} data
 * @returns {Internal.BlockContainerJS} block
 */
global.spawnPedestal = function (level, pos, data) {
    let block = level.getBlock(pos);
    let { type, item, price, id } = data;
    if (!type || !item) {
        console.error(`spawnPedestal: type: ${type}, item: ${item}, price: ${price}, id: ${id}`);
    }
    if (!id) {
        if (type != global.pedestalsTypeList[0]) {
            id = global.pedestalsTypeItemMap[type];
        } else {
            for (let tag in global.pedestalsTagItemMap) {
                if (item.hasTag(tag)) {
                    id = global.pedestalsTagItemMap[tag];
                    break;
                }
            }
        }
    }
    block.set(id || global.pedestalsTypeItemMap[global.pedestalsTypeList[0]]);
    block.entity.persistentData.putString("pedestalType", type);
    block.inventory.setStackInSlot(0, item);
    if (price) block.entity.persistentData.putInt("price", price);
    return block;
};
