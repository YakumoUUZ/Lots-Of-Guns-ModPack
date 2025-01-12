StartupEvents.registry("block", event => {
    event
        .create("data_block")
        .textureAll("minecraft:block/iron_block")
        .displayName("数据方块")
        .unbreakable()
        .blockEntity(entityInfo => {}); //仅做数据保存 没有功能

    event
        .create("room_core")
        .textureAll("minecraft:block/diamond_block")
        .displayName("房间核心")
        .unbreakable()
        .blockEntity(entityInfo => {
            entityInfo.serverTick(1, 0, entity => {
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
 *
 * @param {$BlockEntity_} entity
 */
global.room_function = function (entity) {
    let data = entity.persistentData;
    let level = entity.getLevel();

    if (data.getInt("disabled") == 1 || level.getDimension() != "dimdungeons:dungeon_dimension") return;
    let stage = data.getInt("stage");
    if (stage == 0) {
        global.build_room(level, "example_entrance_1", entity);
        return;
    }
    let type = data.getString("roomtype");
    let rlist = data.room_list;
    if (type == "entrance") {
        global.build_room(level, rlist[stage], entity);
        global.door_action(level, entity, true);
    }
    if (type == "enemy") {
        if (entity.tick % 10 != 0) return;
        let flag = data.getInt("flag");
        let pos = entity.getBlockPos();
        let rng = data.detect_range;
        let AABBrng = new AABB.of(pos.getX() + rng[0], pos.getY() + rng[2], pos.getZ() + rng[4], pos.getX() + rng[1], pos.getY() + rng[3], pos.getZ() + rng[5]);
        let entitylist = level.getEntitiesWithin(AABBrng).filter(i => i.isAlive() && i.isLiving());
        let players = entitylist.filter(i => i.isPlayer());
        let enemies = entitylist.filter(i => !i.isPlayer());
        if (flag == 0 && players.length > 0) {
            global.door_action(level, entity, false);
            global.spawn_wave(level, entity, 1); // 波数以1为起始
            data.putInt("flag", 1);
        }
        if (flag > 0 && enemies.length == 0) {
            data.putInt("flag", flag + 1);
            let isspawnvalid = global.spawn_wave(level, entity, flag + 1);
            if (isspawnvalid == -1) {
                global.build_room(level, rlist[stage], entity);
                global.door_action(level, entity, true);
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
 *
 * @param {$LevelKJS_} level
 * @param {String} name
 * @param {$BlockEntity_} entity
 */
global.build_room = function (level, name, entity) {
    let data = entity.persistentData;
    data.putInt("disabled", 1);
    let rlist = data.room_list;
    let stage = data.getInt("stage") + 1;
    console.log(name);
    let roomdata = JsonIO.read(`./dungeon_json/${name}.json`) || {};
    console.log("???");
    let pos_shift = [roomdata.block_shift.x - data.getInt("dx"), roomdata.block_shift.z];
    let pos = entity.getBlockPos();
    let target_pos = [pos.getX() + pos_shift[0], pos.getY(), pos.getZ() - roomdata.chunk_size.z * 16 + pos_shift[1]];

    let strblock = level.getBlock(target_pos[0], target_pos[1] - 1, target_pos[2]);
    strblock.set("minecraft:structure_block");
    strblock.mergeEntityData({ name: `kubejs:${name}`, posY: 2 });
    let powerblock = level.getBlock(target_pos[0], target_pos[1] - 2, target_pos[2]);
    powerblock.set("minecraft:redstone_block");
    strblock.set("minecraft:air");
    powerblock.set("minecraft:air");
    let new_core = level.getBlock(target_pos[0], target_pos[1], target_pos[2]);
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
 *
 * @param {$LevelKJS_} level
 * @param {$BlockEntity_} entity
 * @param {Boolean} isopen
 */
global.door_action = function (level, entity, isopen) {
    let data = entity.persistentData;
    let name = data.getString("name");
    let roomdata = JsonIO.read(`./dungeon_json/${name}.json`) || {};
    let doordata = roomdata.door_data;
    let pos = entity.getBlockPos();
    console.log(doordata);
    for (const door of doordata) {
        let targetpos = door.pos;
        targetpos[0] += pos.getX();
        targetpos[1] += pos.getY();
        targetpos[2] += pos.getZ();
        level.spawnParticles(
            "minecraft:campfire_signal_smoke",
            false,
            targetpos[0] + 0.5,
            targetpos[1] + door.height / 2,
            targetpos[2] + 0.5,
            0.5,
            door.height / 2,
            0.5,
            4 * door.height,
            0.01
        );
        for (let j = 0; j < door.height; j++) {
            let targetblock = level.getBlock(targetpos[0], targetpos[1], targetpos[2]);
            console.log(targetblock.pos.toString());
            if (!isopen) {
                targetblock.set(door.block);
            } else {
                targetblock.set("minecraft:air");
            }
            targetpos[1] += 1;
        }
    }
};

/**
 *
 * @param {$LevelKJS_} level
 * @param {$BlockEntity_} entity
 * @param {integer} wave
 */
global.spawn_wave = function (level, entity, wave) {
    let data = entity.persistentData;
    let name = data.getString("name");
    let roomdata = JsonIO.read(`./dungeon_json/${name}.json`) || {};
    if (wave > roomdata.waves) return -1;
    let wavedata = roomdata.wave_data[wave - 1];
    let pos = entity.getBlockPos();
    for (const wave of wavedata) {
        let targetpos = wave.pos;
        targetpos[0] += pos.getX();
        targetpos[1] += pos.getY();
        targetpos[2] += pos.getZ();
        level.spawnParticles("minecraft:poof", false, targetpos[0] + 0.5, targetpos[1] + 1, targetpos[2] + 0.5, 0.5, 1, 0.5, 10, 0.01);
        let target = level.createEntity(wave.type);
        target.setPosition(targetpos[0] + 0.5, targetpos[1] + 0.1, targetpos[2] + 0.5);
        target.spawn();
    }
    return 1;
};
