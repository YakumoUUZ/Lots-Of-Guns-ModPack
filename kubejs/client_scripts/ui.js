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
