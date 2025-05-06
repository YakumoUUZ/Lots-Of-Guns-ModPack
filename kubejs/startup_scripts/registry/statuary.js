StartupEvents.registry("block", (event) => {
	// [name,hight]
	let namE = [
		["default", 40],
		["cyber", 39],
		["crimson_blade", 40],
		["w", 42],
		["hamster_hunter", 44],
	];
	namE.forEach(([nmae, hi]) => {
		event
			.create(global.PackId + "statuary_" + nmae, "animatable") // 用的geckojs
			.soundType("stone")
			.waterlogged()
			.tag(`${global.PackId}statuary_${nmae}`)
			.defaultGeoModel()
			.box(1, 0, 2, 15, 16, 13, true) // 在上面会出现单向bug
			.box(1, 16, 2, 15, 32, 13, true)
			//.box(1, 32, 2, 15, hi, 13, true) // 不是16倍数就会出现bug
			.property(BlockProperties.FACING) // 可以旋转
			.placementState((c) => {
				c.set(BlockProperties.FACING, c.getHorizontalDirection().getOpposite()); // 放置的时候设置properties是面朝方向的反方向
			})
			.geoModel((g) => {
				g.autoGlowing = true; // 开启自发光
			});
	});
});
