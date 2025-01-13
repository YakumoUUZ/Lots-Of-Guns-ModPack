//防止展示台交互和显示问题
BlockEvents.rightClicked(event => {
    if (!event.block.id.startsWith("pedestals:")) return;
    event.cancel();
});
