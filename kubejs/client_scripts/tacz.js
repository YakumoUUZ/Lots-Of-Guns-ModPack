//删除reload键
/* let reloadKeyName = 'key.tacz.reload.desc'

let ALLKEYS = global.getField($KeyMapping, 'f_90809_', true)
let KEY_TACZ_RELOAD = ALLKEYS.remove(reloadKeyName)
if (KEY_TACZ_RELOAD) {
    let key = KEY_TACZ_RELOAD.getKey()
    global.setField(key, "value", -1)
    console.log(key)
}
let keys = []
for (let key of $Minecraft.instance.options.keyMappings) {
    if (key.getName() != reloadKeyName) {
        keys.push(key)
    }
}
$Minecraft.instance.options.keyMappings = keys

 */