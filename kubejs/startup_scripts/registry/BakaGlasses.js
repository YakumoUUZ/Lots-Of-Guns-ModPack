ItemEvents.armorTierRegistry((event) => {
	// 调这里决定护甲参数
	event.add(global.PackId + "baka_glasses", (tier) => {
		tier.durabilityMultiplier = 70;
		tier.equipSound = "minecraft:item.armor.equip_chain";
		tier.slotProtections = [4, 7, 9, 4];
		tier.toughness = 5;
		tier.knockbackResistance = 0;
	});
});
// TODO 记得改贴图！！！！！
StartupEvents.registry("item", (event) => {
	event
		.create(global.PackId + "baka_glasses", "helmet")
		.tier(global.PackId + "baka_glasses")
		.tag("forge:armors");
});
if (Platform.isLoaded("tacz_fire_control_extension")) {
	ItemEvents.modification((event) => {
		event.modify(global.PackId + "baka_glasses", (item) => {
			item.addAttribute(
				"tacz_fire_control_extension:aim_cone_angle",
				"99C7EB2B-BDB2-4ED3-8994-42482686384F",
				"AimConeAngle",
				20, // 调这个决定自瞄参数
				"addition"
			);
		});
	});
}
