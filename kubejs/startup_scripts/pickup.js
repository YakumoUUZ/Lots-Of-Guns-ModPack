/**
 * 
 * @param {Internal.EntityItemPickupEvent} event 
*/ 
global.itemPickUp = function(event){
    var entity = event.item
    var item = entity.item;
    console.log(event.result.toString())
    if (!(item.hasTag("autopickup") || entity.tags.contains('pickup'))) event.setCanceled(true);
}

ForgeEvents.onEvent('net.minecraftforge.event.entity.player.EntityItemPickupEvent', e => global.itemPickUp(e))