//使用需要将kubejs/probe/generated/constants.d.ts中的declare const global整个删除
class PlayerCoin {
    constructor(player: Internal.Player);
    get(): number;
    add(amount: number): void;
}

declare const global: {
    PlayerCoin: typeof PlayerCoin;
    eventList: [
        "onPlayerGetRelic",
        "onPlayerLoseRelic",
        "onPlayerAddRelic",
        "onPlayerRemoveRelic",
        "onPlayerHurtEntity",
        "onEntityHurtPlayer",
        "onPlayerKillEntity",
        "onEntityHurtByGun",
        "onPlayerAmmoHitEntity",
        "onPlayerAmmoHitBlock",
        "onItemPickupPre",
        "onCoinsPickup"
    ];
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
    playSound(player: Internal.Player, sound: Internal.SoundEvent_, [pos]: Vec3d, [volume]: number, [pitch]: number): void;
    spawnPedestal(
        level: Internal.ServerLevel,
        pos: BlockPos,
        data: { type: string; item: Internal.ItemStack; price?: number; id?: string }
    ): Internal.BlockContainerJS;
    testFunc(player: Internal.Player): void;
    playerEventsMap: { [uuid: string]: { [eventName: string]: { [relicName: string]: number } } };
    pedestalsTypeList: ["normal", "giver", "firstWeapon", "shop", "readonly"];
    pedestalsTypeIconMap: {
        normal: Internal.ItemStack;
        giver: Internal.ItemStack;
        firstWeapon: Internal.ItemStack;
        shop: Internal.ItemStack;
        readonly: Internal.ItemStack;
    };
    pedestalsTagItemMap: {
        weapon: "pedestals:bamboo_planks_pedestal";
        relic: "pedestals:birch_planks_pedestal";
        consumables: "pedestals:jungle_planks_pedestal";
    };
    coinsMap: { "minecraft:emerald": 1.0; "minecraft:diamond": 5.0 };
    playerRelicsMap: { [uuid: string]: { [relicName: string]: number } };
    relicMap: {
        carrot_spice_of_life: { name: "carrot_spice_of_life"; id: Internal.ConsString; rarity: "common"; item: Internal.ItemStack };
        cola_mentos: { name: "cola_mentos"; id: Internal.ConsString; rarity: "common"; item: Internal.ItemStack };
        feeding_machine_servant: { name: "feeding_machine_servant"; id: Internal.ConsString; rarity: "common"; item: Internal.ItemStack };
        pillager_flag: { name: "pillager_flag"; id: Internal.ConsString; rarity: "common"; item: Internal.ItemStack };
        piranha_sushi: { name: "piranha_sushi"; id: Internal.ConsString; rarity: "common"; sushi: "kubejs:piranha_sushi_healitem"; item: Internal.ItemStack };
        undead_totem_shard: { name: "undead_totem_shard"; id: Internal.ConsString; rarity: "common"; item: Internal.ItemStack };
        vampire_fang: { name: "vampire_fang"; id: Internal.ConsString; rarity: "common"; item: Internal.ItemStack };
    };
    
    spawn_wave: {};
    door_action: {};
    build_room: {};
    room_function: {};

    pedestalsTypeItemMap: {
        normal: "pedestals:pedestal";
        giver: "pedestals:smooth_stone_pedestal";
        firstWeapon: "pedestals:polished_diorite_pedestal";
        shop: "pedestals:cherry_planks_pedestal";
        readonly: "pedestals:quartz_pedestal";
    };

    setField: {};
    toRawClass: {};
    loadRawClass: {};
    getDeclaredField: {};
    getField: {};

    commonEventsMap: {};
    addCommonEventHandler: {};
    relicRarityMap: { common: { 1: null; 2: null; 3: null; 4: null; 5: null; 6: null; 0: null } };
    getRandomRelic(rarity: string): Internal.ItemStack;
    isServerReady: true;
    onGunReloadEvent({}): void;
    onItemPickUpEvent({}): void;
    onItemTooltipEvent({}): void;
    onEntityHurtByGunEvent({}): void;
    onAmmoHitBlockEvent({}): void;
};
