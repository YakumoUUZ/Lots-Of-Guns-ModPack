/**
 *
 * @param {Internal.CompoundTag} tag
 * @param {Internal.BlockAccessor} accessor
 */
global.blockEntityJade = function (tag, accessor) {
    let blockEntity = accessor.getBlockEntity();
    let block = accessor.getBlock();
    if (!blockEntity || !block.id.startsWith("pedestals:")) return;
    let data = blockEntity.persistentData;
    /** @type {Internal.ItemStack} */
    let item = blockEntity.level.getBlock(accessor.position).inventory.getStackInSlot(0);
    let { pedestalType, price } = data;
    tag.putString("type", pedestalType);
    if (price) tag.putInt("price", price);
    tag.putString("item", item.serializeNBT().toString());
    console.log(tag)
};

JadeEvents.onCommonRegistration(event => {
    event.blockDataProvider("kubejs:pedestalblock", $BlockEntity).setCallback((tag, accessor) => global.blockEntityJade(tag, accessor));
});

