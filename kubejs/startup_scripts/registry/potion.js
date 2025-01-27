//priority: 1000
StartupEvents.registry("mob_effect", (event) => {
	// 眩晕 - 减去离谱量的移速、重力、攻速、伤害、游泳速度
	event
		.create(global.PackId + "stun")
		.harmful()
		.color(Color.WHITE)
		.modifyAttribute("minecraft:generic.movement_speed", "49C7CA2B-BDB2-4ED3-8434-42482456322F", -100, "addition")
		.modifyAttribute("forge:entity_gravity", "84B7CA2B-BDB2-4ED8-9643-11556874233F", 100, "addition")
		.modifyAttribute("minecraft:generic.attack_speed", "15S5F6C8-BDB2-4ED8-8723-11556874233F", -100, "addition")
		.modifyAttribute("minecraft:generic.attack_damage", "9833SA9F-BDB2-4ED8-9643-11556874233F", -100, "addition")
		.modifyAttribute("forge:swim_speed", "7433SA9F-BDB2-4ED8-9643-11557536412F", -100, "addition");
});
