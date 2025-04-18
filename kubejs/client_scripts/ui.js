/**
 *
 * @param {Internal.ItemTooltipEvent} event
 */
global.onItemTooltipEvent = function (event) {
    /** @type {{itemStack:Internal.ItemStack, toolTip:Internal.List<Internal.Component>}} */
    const { itemStack: item, toolTip: tooltip } = event;
    // 删除箱子菜单中的物品tooltips
    if (item.nbt && item.nbt.contains("chestMenuItem")) {
        for (let i = tooltip.size() - 1; i > 0; i--) {
            tooltip.removeLast();
        }
    }
};

/**
 *
 * @param {Internal.ITooltipWrapper} tooltip
 * @param {Internal.BlockAccessor} accessor
 * @param {Internal.IPluginConfig} pluginConfig
 * @returns
 */
global.blockEntityJadeClient = function (tooltip, accessor, pluginConfig) {
    let data = accessor.serverData;
    if (!data) return;
    let blockEntity = accessor.getBlockEntity();
    /** @type {Internal.ItemStack} */
    let item = accessor.level.getBlock(accessor.position).inventory.getStackInSlot(0);
    console.log(data)
    let { price } = data;
    let type = data.getString("type")
    tooltip.add([Text.of(item.displayName), Text.of("Type: " + type)]);
    if (price) tooltip.add([Text.of("Price: " + price)]);
};

// global.rayTraceCallback = function (hitResult, accessor, originalAccessor) {
//     console.log("rayTraceCallback");
//     let block = accessor.getBlock()
//     console.log(block.getClass(), block.getClass().getSuperclass(), block.getClass().getSuperclass().getSuperclass());
// };

JadeEvents.onClientRegistration(event => {
    // Register a new block component provider for the Brushable Block.
    event
        .block("kubejs:pedestalblock", $BaseEntityBlock)
        .tooltip((tooltip, accessor, pluginConfig) => global.blockEntityJadeClient(tooltip, accessor, pluginConfig));
    // event.addRayTraceCallback((hitResult, accessor, originalAccessor) => global.rayTraceCallback(hitResult, accessor, originalAccessor));
});
