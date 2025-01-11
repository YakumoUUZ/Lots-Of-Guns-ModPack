BlockEvents.rightClicked(event => {
    if (!event.block.id.startsWith("pedestals:")) return;
    event.cancel();
});
