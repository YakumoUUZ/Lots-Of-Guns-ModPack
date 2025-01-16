//使用需要将kubejs/probe/generated/constants.d.ts中的declare const global整个删除
class PlayerCoin {
    constructor(player: Internal.Player);
    get(): number;
    add(amount: number): void;
}

declare const global: {
    PlayerCoin: typeof PlayerCoin;
    eventList: ["onPlayerGetRelic", "onPlayerLoseRelic", "onPlayerAddRelic", "onPlayerRemoveRelic", "onPlayerKillEntity"];
    playerGetItem(player: Internal.Player, item: Internal.ItemStack, [slot]: number): boolean | Internal.ItemEntity;
    spawnItem(level: Internal.ServerLevel, item: Internal.ItemStack, pos: Vec3d, [random]: any): Internal.ItemEntity;
    readRelicsFromNbt(player: Internal.Player): void;
    getRelicName(id: string): string;
    getRelicId(relicName: string): string;
    playerSetRelicCount(player: Internal.Player, relicName: string, count: number): number;
    playerAddRelic(player: Internal.Player, relicName: string, [count]: number): number;
    playerRemoveRelic(player: Internal.Player, relicName: string, [count]: number): number;
    playerGetRelic(player: Internal.Player, relicName: string): void;
    playerLoseRelic(player: Internal.Player, relicName: string): voi;
    getPlayerRelic(player: Internal.Player, relicName: string): number;
    postEvent(player: Internal.Player, eventName: string, data: any): void;
    getPlayerRelicMap(player: Internal.Player): { [relicName: string]: number };
    loadStructure(level: Internal.ServerLevel, name: string, pos: BlockPos, [settings]: any): void;
    spawnPedestal(level: Internal.ServerLevel, pos: BlockPos, data:{type:string, item:Internal.ItemStack, price?:number, id?:string}): Internal.BlockContainerJS;
    testFunc(player: Internal.Player): void;
    spawn_wave: {};
    door_action: {};
    playerEventsMap: { [uuid: string]: { [eventName: string]: { [relicName: string]: number } } };
    pedestalsTypeIconMap: { normal: Internal.ItemStack; firstWeapon: Internal.ItemStack; shop: Internal.ItemStack; readonly: Internal.ItemStack };
    pedestalsTypeList: ["normal", "firstWeapon", "shop", "readonly"];
    coinsMap: { "minecraft:emerald": 1.0; "minecraft:diamond": 5.0 };
    relicPrefix: "kubejs:relic_";
    playerRelicsMap: { [uuid: string]: { [relicName: string]: number } };
    relicMap: {
        piranha_sushi: {
            name: "piranha_sushi";
            id: Internal.ConsString;
            rarity: "common";
            texture: "minecraft:item/diamond";
            item: Internal.ItemStack;
            sushi: Internal.ItemStack;
        };
    };
    onItemPickUpEvent: {};
    build_room: {};
    room_function: {};
};