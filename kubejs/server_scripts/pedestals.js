BlockEvents.rightClicked(event => {
    let { player, block } = event;
    if (!(block && block.id.startsWith("pedestals:"))) return;
    pedestalInteract(player, block);
    event.cancel();
});

/**
 *
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
            pedestalTypeSlot.setItem(global.pedestalsTypeIconMap[pedestalType()].copy().setHoverName(Text.of(`Current Type: ${pedestalType()}`)));
            if (pedestalType() == "shop") {
                if (!block.entity.persistentData.contains("price")) block.entity.persistentData.putInt("price", 1);
                priceSlot.setItem(Item.of("minecraft:emerald").setHoverName(Text.of(`price: ${block.entity.persistentData.getInt("price")}`)));
                priceActionSlot.setItem(Item.of("minecraft:emerald").setHoverName(Text.of(`price pre action: ${pricePerActionList[pricePerActionIndex]}`)));
            } else {
                priceSlot.setItem(Item.empty);
                priceActionSlot.setItem(Item.empty);
            }
        }
        refresh();
        //设置展示架的类型
        for (let index = 0; index < global.pedestalsTypeList.length; index++) {
            let type = global.pedestalsTypeList[index];
            gui.button(index, 0, global.pedestalsTypeIconMap[type], type, () => {
                block.entity.persistentData.pedestalType = type;
                refresh();
            });
        }
        //设置展示架上的物品
        pedestalItemSlot.setLeftClicked(e => {
            pedestalItemSlot.setItem(Item.empty);
            inventory.setStackInSlot(0, Item.empty);
        });
        gui.inventoryClicked = function (clickEvent) {
            pedestalItemSlot.setItem(clickEvent.item);
            inventory.setStackInSlot(0, clickEvent.item);
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
        case global.pedestalsTypeList[0]:
            if (global.playerGetItem(player, pedestalItem)) {
                inventory.setStackInSlot(0, Item.empty);
            }
            break;
        case global.pedestalsTypeList[1]: {
            let weapon = player.inventory.find("#weapon");
            if (weapon > 0) {
                player.inventory.removeItem(weapon, 1);
                global.playerGetItem(player, pedestalItem, weapon);
            } else {
                global.playerGetItem(player, pedestalItem);
            }
            break;
        }
        case global.pedestalsTypeList[2]: {
            let price = block.entity.persistentData.getInt("price");
            let playerCoin = new global.PlayerCoin(player);
            if (playerCoin.get() >= price) {
                playerCoin.add(-price);
                block.entity.persistentData.pedestalType = global.pedestalsTypeList[0];
                pedestalInteract(block, player);
            } else {
                player.sendSystemMessage(Text.translate("warning.kubejs.notEnoughCoins").red(), true);
            }
            break;
        }
    }
    player.swing();
}

/**
 *
 * @param {Internal.LevelKJS} level
 * @param {BlockPos} pos
 * @param {{type:string, item:Internal.ItemStack, price:number, id:string}} data
 */
global.spawnPedestal = function (level, pos, data) {
    let block = level.getBlock(pos);
    let { type, item, price, id } = data;
    if (!type || !item) {
        console.error(`spawnPedestal: type: ${type}, item: ${item}, price: ${price}, id: ${id}`);
    }
    block.set(id || "pedestals:pedestal");
    block.entity.persistentData.putString("pedestalType", type);
    block.inventory.setStackInSlot(0, item);
    if (price) block.entity.persistentData.putInt("price", price);
};
