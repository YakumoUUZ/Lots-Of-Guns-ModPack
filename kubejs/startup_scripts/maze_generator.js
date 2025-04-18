StartupEvents.registry("block", (event) => {
	event
		.create("data_block")
		.textureAll("minecraft:block/iron_block")
		.displayName("数据方块")
		.unbreakable()
		.blockEntity((entityInfo) => {}); //仅做数据保存 没有功能

	event
		.create("room_core")
		.textureAll("minecraft:block/diamond_block")
		.displayName("房间核心")
		.unbreakable()
		.blockEntity((entityInfo) => {
			entityInfo.serverTick(1, 0, (entity) => {
				global.room_function(entity);
			});
		});

	/*
    event.create("maze_generator")
    .textureAll("minecraft:block/diamond_block")
    .displayName("地图生成器")
    .unbreakable()
    .blockEntity((entityInfo) => {
        entityInfo.serverTick(1, 0, (entity) => {
            global.maze_generate(entity)
        })
    })
*/
});

/**
 * 房间核心tick方法
 * @param {Internal.BlockEntity} entity
 */
global.room_function = function (entity) {
	let data = entity.persistentData;
	let level = entity.getLevel();

    let mazeList = ["1a_entrance_1"];
    let mazeRandom = Math.floor(Math.random() * mazeList.length);
    let mazeSelected = mazeList[mazeRandom];

    if (data.getInt("disabled") == 1 || level.getDimension() != "dimdungeons:dungeon_dimension") return;

    let stage = data.getInt("stage");
    //初始房间核心(无数据), 生成入口房间
    if (stage == 0) {
        global.build_room(level, mazeSelected, entity);
        return;
    }
    let type = data.getString("roomtype");
    let rlist = data.room_list;
    //如果是入口房间, 生成第一个房间, 并开门
    if (type == "entrance") {
        global.build_room(level, rlist[stage], entity);
        global.door_action(level, entity, true);
        return;
    }
    //如果是敌人房间, 刷新敌人波次, 波次结束开门
    if (type == "enemy") {
        if (entity.tick % 10 != 0) return;
        let flag = data.getInt("flag");
        let pos = entity.getBlockPos();
        let rng = data.detect_range;
        // let AABBrng = new AABB.of(pos.getX() + rng[0], pos.getY() + rng[2], pos.getZ() + rng[4], pos.getX() + rng[1], pos.getY() + rng[3], pos.getZ() + rng[5]);
        let AABBrng = AABB.ofBlocks(pos.offset(rng[0], rng[2], rng[4]), pos.offset(rng[1], rng[3], rng[5]));
        let entitylist = level.getEntitiesWithin(AABBrng).filter(i => i.isAlive() && i.isLiving());
        //玩家检测范围缩小一格, 防止关门时玩家在门中
        let players = entitylist.filter(i => i.isPlayer() && AABBrng.inflate(-1, 0, -1).contains(i.position()));
        let enemies = entitylist.filter(i => !i.isPlayer());
        //刷新第一波
        if (flag == 0 && players.length > 0) {
            global.door_action(level, entity, false);
            global.spawn_wave(level, entity, 1); // 波数以1为起始
            data.putInt("flag", 1);
        }
        //波次结束
        if (flag > 0 && enemies.length == 0) {
            data.putInt("flag", flag + 1);
            let isspawnvalid = global.spawn_wave(level, entity, flag + 1);
            if (isspawnvalid == -1) {
                global.build_room(level, rlist[stage], entity);
                global.door_action(level, entity, true);
                // level.server.scheduleInTicks(1, () => {level.getBlock(entity.blockPos).set('air')})
            }
        }
    }
    /*
    let pos=entity.getBlockPos();

    let rng = new AABB.of(pos.getX()-1, pos.getY(), pos.getZ()-1, pos.getX()+2, pos.getY()+3, pos.getZ()+2);
    let entitylist = level.getEntitiesWithin(rng);
    */
};
/**
 * 构建房间
 * @param {Internal.LevelKJS} level
 * @param {String} name
 * @param {Internal.BlockEntity} entity
 */
global.build_room = function (level, name, entity) {
	let data = entity.persistentData;
	//将旧房间核心置为失效
	data.putInt("disabled", 1);
	let rlist = data.room_list;
	let stage = data.getInt("stage") + 1;
	console.log(name);
	let roomdata = JsonIO.read(`./dungeon_json/${name}.json`) || {};
	let pos = entity.getBlockPos();
	// let target_pos = [pos.getX() + pos_shift[0], pos.getY(), pos.getZ() - roomdata.chunk_size.z * 16 + pos_shift[1]];
	//新房间核心位置
	let target_pos = pos.offset(roomdata.block_shift.x - data.getInt("dx"), 0, roomdata.block_shift.z - roomdata.chunk_size.z * 16);
	/* 
    let strblock = level.getBlock(target_pos[0], target_pos[1] - 1, target_pos[2]);
    strblock.set("minecraft:structure_block");
    strblock.mergeEntityData({ name: `kubejs:${name}`, posY: 2 });
    let powerblock = level.getBlock(target_pos[0], target_pos[1] - 2, target_pos[2]);
    powerblock.set("minecraft:redstone_block");
    strblock.set("minecraft:air");
    powerblock.set("minecraft:air"); */
    global.loadStructure(level, `kubejs:${name}`, target_pos.offset(0, roomdata.block_shift.y + 1, 0)); // 这样偏移我觉得应该不会撞上建筑罢
    let new_core = level.getBlock(target_pos);
    new_core.set("minecraft:air");
    new_core.set("kubejs:room_core");

	let new_data = new_core.entity.persistentData;
	new_data.putString("roomtype", roomdata.roomtype);
	let range = [];
	for (let i = 0; i < 3; i++) {
		range.push(parseInt(roomdata.detect_range.from[i]));
		range.push(parseInt(roomdata.detect_range.to[i]));
	}
	console.log(range.join());
	new_data.detect_range = range;
	new_data.putInt("stage", stage);
	new_data.putString("name", name);
	new_data.putInt("dx", roomdata.block_shift.x);

	//如果是入口房间, 则生成房间列表
	if (roomdata.roomtype == "entrance") {
		let enemy_rooms = roomdata.theme_data.enemy_rooms;
		let room_list = [];

		let id_list = [];
		let weight_b = [];
		let weight = 0;
		for (const enemy_room of enemy_rooms) {
			weight += enemy_room.weight;
			weight_b.push(weight);
			id_list.push(enemy_room.id);
		}

		room_list.push(name);

		for (let i = 0; i < 6; i++) {
			// 先固定生成六个试一试咸淡
			let rnd = Math.random() * weight;
			for (let j = 0; j < weight_b.length; j++) {
				if (rnd <= weight_b[j]) {
					room_list.push(id_list[j]);
					break;
				}
			}
		}

		room_list.push(roomdata.theme_data.end_room);
		new_data.room_list = room_list;
	} else {
		new_data.room_list = rlist;
	}
};
/**
 * 开关门
 * @param {Internal.LevelKJS} level
 * @param {Internal.BlockEntity} entity
 * @param {Boolean} isopen
 */
global.door_action = function (level, entity, isopen) {
	let data = entity.persistentData;
	let name = data.getString("name");
	let roomdata = JsonIO.read(`./dungeon_json/${name}.json`) || {};
	let doordata = roomdata.door_data;
	let pos = entity.getBlockPos();
	// console.log(doordata);
	for (const door of doordata) {
		let targetpos = pos.offset(door.pos[0], door.pos[1] + 1, door.pos[2]);
		level.spawnParticles(
			"minecraft:campfire_signal_smoke",
			false,
			targetpos.x + 0.5,
			targetpos.y + door.height / 2,
			targetpos.z + 0.5,
			0.5,
			door.height / 2,
			0.5,
			4 * door.height,
			0.01
		);
		for (let j = 0; j < door.height; j++) {
			targetpos = targetpos.above();
			let targetblock = level.getBlock(targetpos);
			// console.log(targetblock.pos.toString());
			if (!isopen) {
				targetblock.set(door.block);
			} else {
				targetblock.set("minecraft:air");
			}
		}
	}
};

/**
 *
 * @param {Internal.LevelKJS} level
 * @param {Internal.BlockEntity} entity
 * @param {Integer} wave
 */
global.spawn_wave = function (level, entity, wave) {
	let data = entity.persistentData;
	let name = data.getString("name");
	let roomdata = JsonIO.read(`./dungeon_json/${name}.json`) || {};
	if (wave > roomdata.waves) return -1;
	let wavedata = roomdata.wave_data[wave - 1];
	let pos = entity.getBlockPos();
	for (const wave of wavedata) {
		let targetpos = pos.offset(wave.pos[0], wave.pos[1], wave.pos[2]);
		level.spawnParticles("minecraft:poof", false, targetpos.x + 0.5, targetpos.y + 1, targetpos.z + 0.5, 0.5, 1, 0.5, 10, 0.01);
		let target = level.createEntity(wave.type);
		target.setPosition(targetpos.x + 0.5, targetpos.y + 0.1, targetpos.z + 0.5);
		target.spawn();
	}
	return 1;
};
