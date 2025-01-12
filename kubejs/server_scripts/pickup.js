const $ProjectileUtil = Java.loadClass("net.minecraft.world.entity.projectile.ProjectileUtil");
const $ItemEntity = Java.loadClass("net.minecraft.world.entity.item.ItemEntity");

const autoPickUpItems = ["minecraft:emerald"];

ServerEvents.tags("item", event => {
    for (const item of autoPickUpItems) {
        event.add("autopickup", item);
    }
    for (const item in global.coinsMap) {
        event.add("autopickup", item);
    }
    event.add("weapon", "tacz:modern_kinetic_gun");
});

ItemEvents.firstRightClicked(event => {
    if (event.hand != "MAIN_HAND") return;
    const player = event.player;
    const hitResult = $ProjectileUtil.getHitResultOnViewVector(player, () => true, player.reachDistance);
    /** @type {Internal.Entity} */
    const entity = hitResult.entity;
    if (!entity || !(entity instanceof $ItemEntity) || entity.tags.contains("pickup")) return;
    entity.addTag("pickup");
    entity.setNoPickUpDelay();
    entity.playerTouch(player);
    player.swing();
});

BlockEvents.rightClicked(event => {
    if (event.block?.id.startsWith("pedestals:")) event.cancel();
});

ItemEvents.firstRightClicked(event => {
    if (event.hand != "MAIN_HAND") return;
    /** @type {Internal.ServerPlayer} */
    let player = event.player;
    let block = player.rayTrace(player.getEntityReach()).block;
    if (!(block?.id.startsWith("pedestals:"))) return;
    pedestalInteract(block, player);
});

/**
 * @param {Internal.BlockContainerJS} block
 * @param {Internal.ServerPlayer} player
 */
function pedestalInteract(block, player) {
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
        player.openChestGUI(Text.translate("gui.kubejs.pedestalSetting.title"), 2, gui => {
            let pedestalItemSlot = gui.getSlot(0, 1);
            let pedestalTypeSlot = gui.getSlot(2, 1);
            let priceSlot = gui.getSlot(4, 1);
            let priceActionSlot = gui.getSlot(5, 1);
            let pricePerActionList = [1, 5, 10, 20, 50, 100, 200, 500, 1000];
            let pricePerActionIndex = 0;
            pedestalItemSlot.setItem(pedestalItem);
            gui.playerSlots = true;
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
