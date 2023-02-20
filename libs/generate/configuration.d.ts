/*
*/
declare namespace Configuration {
	const enum attrFields {
		type = 0,			/*属性类型*/
		value = 1,
	}
	type attr = [number, number];

	const enum scene_copy_marryFields {
		mapId = 0,			/*地图ID*/
		ware = 1,			/*第XX波*/
		occ = 2,			/*怪物ID*/
		awardTips = 3,			/*奖励Tips*/
		award = 4,			/*击杀波数奖励*/
	}
	type scene_copy_marry = [number, number, number, Array<Items>, Array<Items>];

	const enum attrWeightFields {
		id = 0,
		weight = 1,
	}
	type attrWeight = [number, number];

	const enum mapFields {
		id = 0,			/*进程编号*/
		sMapId = 1,			/*单人地图ID,可同时在多个map上*/
		mMapId = 2,			/*多人地图ID,只能在一个map上*/
	}
	type map = [number, Array<number>, Array<number>];


	type aa = [string, string];

	const enum map_crossFields {
		id = 0,			/*进程编号*/
		sMapId = 1,			/*单人地图ID,可同时在多个map上*/
		mMapId = 2,			/*多人地图ID,只能在一个map上*/
	}
	type map_cross = [number, Array<number>, Array<number>];

	const enum map_cross_tFields {
		id = 0,			/*进程编号*/
		sMapId = 1,			/*单人地图ID,可同时在多个map上*/
		mMapId = 2,			/*多人地图ID,只能在一个map上*/
	}
	type map_cross_t = [number, Array<number>, Array<number>];

	const enum PosFields {
		x = 0,			/*X坐标*/
		y = 1,			/*Y坐标*/
	}
	type Pos = [number, number];

	/*道具*/
	const enum ItemsFields {
		itemId = 0,
		count = 1,
	}
	type Items = [number, number];

	const enum PairFields {
		first = 0,
		second = 1,
	}
	type Pair = [number, number];

	const enum sceneFields {
		mapId = 0,			/*地图ID*/
		name = 1,			/*场景名*/
		judgeType = 2,			/*副本结算方式 0:击败BOSS结算奖励 1:在副本待上XX时间结算奖励 2:击杀所有怪物 3:无/常开*/
		limitTime = 3,			/*限时 0:没有限制 XX:XX时间后失败或者XX时间后结束并结算奖励*/
		entryPos = 4,			/*[x#y]#[x#y]入口*/
		res = 5,			/*地图资源:xxx.bin*/
		direction = 6,			/*朝向 0:随机  1:西北 2:北 3:东北 4:西 5:东 6:西南 7:南 8:东南*/
		type = 7,			/*0:挂机场景 1:天关副本 2:大荒古塔 3:单人BOSS副本*/
		reliveTime = 8,			/*复活时间*/
		reliveGold = 9,			/*需要的代币券*/
		reliveType = 10,			/*复活类型 0:不需要弹窗不需要消耗 1:每秒消耗需要的代币券 2:消耗固定的代币券*/
		sound = 11,			/*音效文件*/
		sprintType = 12,			/*冲刺类型 0:不冲 1:冲冲冲*/
		transformDoorPos = 13,  /*传送门位置*/
		pathNode = 14,          /*场景寻路坐标*/
		sceneEffect = 15,          /*地图特效动画*/
	}
	type scene = [number, string, number, number, Array<Pos>, string, number, number, number, number, number, string, number, Array<Pos>, Array<Pos>, string];

	const enum scene_commonFields {
		mapId = 0,			/*地图ID*/
		areaId = 1,			/*区域ID*/
		occ = 2,			/*怪物ID*/
		monsterCount = 3,	/*怪物数量*/
	}
	type scene_common = [number, number, number, number];

	const enum scene_copy_tianguanFields {
		mapId = 0,			/*地图ID*/
		level = 1,			/*关数、层数或者怪物波数*/
		occ = 2,			/*怪物ID*/
		killWare = 3,			/*当前关数需要砍怪物波数*/
		tipsAward = 4,			/*奖励展示 [itemId#count]#[itemId#count]*/
		award = 5,			/*当前关数奖励 [itemId#count]#[itemId#count]*/
		awardNameRes = 6,			/*奖励名称美术字资源*/
	}
	type scene_copy_tianguan = [number, number, number, number, Array<Items>, Array<Items>, string];

	const enum scene_copy_dahuangFields {
		mapId = 0,			/*地图ID*/
		level = 1,			/*关数、层数或者怪物波数*/
		occ = 2,			/*怪物ID*/
		tipsAward = 3,			/*奖励展示 [itemId#count]#[itemId#count]*/
		award = 4,			/*当前关数奖励 [itemId#count]#[itemId#count]*/
		bigAward = 5,			/*当前关数大奖 [itemId#count]#[itemId#count]*/
		recommendFighting = 6,			/*推荐战力*/
		awardNameRes = 7,			/*奖励名称美术字资源*/
	}
	type scene_copy_dahuang = [number, number, number, Array<Items>, Array<Items>, Array<Items>, number, string];

	const enum scene_copy_single_bossFields {
		mapId = 0,			/*地图ID*/
		level = 1,			/*关数、层数或者怪物波数*/
		occ = 2,			/*怪物ID*/
		eraLevel = 3,			/*最低觉醒等级*/
		actorLevel = 4,			/*最低角色等级*/
		tipsAward = 5,			/*奖励展示 [itemId#count]#[itemId#count]*/
		eraTips = 6,			/*觉醒等级Tips*/
	}
	type scene_copy_single_boss = [number, number, number, number, number, Array<Items>, string];

	const enum scene_copy_eraFields {
		mapId = 0,			/*地图ID*/
		level = 1,			/*0 101 102 ...*/
		occ = 2,			/*怪物ID*/
		unlockTips = 3,			/*解锁提示*/
	}
	type scene_copy_era = [number, number, number, string];

	const enum InspireFields {
		index = 0,			/*次数*/
		count = 1,			/*消耗金钱*/
		per = 2,			/*单次属性增加百分比*/
	}
	type Inspire = [number, number, number];

	const enum scene_multi_bossFields {
		mapId = 0,			/*地图ID*/
		level = 1,			/*关数、层数或者怪物波数*/
		occ = 2,			/*怪物ID*/
		eraLevel = 3,			/*最低觉醒等级*/
		actorLevel = 4,			/*最低角色等级*/
		eraTips = 5,			/*觉醒等级Tips*/
		tipsAward = 6,			/*奖励展示 [itemId#count]#[itemId#count]*/
		firstRankAward = 7,			/*排名第一奖励 itemId#count*/
		killAward = 8,			/*击杀奖励 itemId#count*/
		hurtRank = 9,			/*伤害排行数量*/
		joinAward = 10,			/*参与奖励 packageId#packageId*/
	}
	type scene_multi_boss = [number, number, number, number, number, string, Array<Items>, Items, Items, number, Array<number>];

	const enum scene_copy_shilianFields {
		mapId = 0,			/*地图ID*/
		level = 1,			/*难度等级*/
		ware = 2,			/*第XX波*/
		occ = 3,			/*怪物ID*/
	}
	type scene_copy_shilian = [number, number, number, number];

	const enum JoinAwardFields {
		param = 0,			/*排名、伤害*/
		award = 1,
	}
	type JoinAward = [number, Array<Items>];

	const enum scene_cross_bossFields {
		mapId = 0,			/*地图ID*/
		level = 1,			/*关数、层数或者怪物波数*/
		occ = 2,			/*怪物ID*/
		eraLevelSection = 3,			/*觉醒区间 level#level*/
		eraTips = 4,			/*觉醒等级Tips*/
		joinAwards = 5,			/*参与奖励 [hurt#[[itemId#count]#[itemId#count]]]#[hurt#[[itemId#count]#[itemId#count]]]*/
		tipsJoinAwards = 6,			/*参与奖励展示 [itemId#count]#[itemId#count]*/
		tipsKillAwards = 7,			/*击杀奖励展示 [itemId#count]#[itemId#count]*/
		rankAwards = 8,			/*排名奖励 [rank#[[itemId#count]#[itemId#count]]]#[rank#[[itemId#count]#[itemId#count]]]*/
		tipsRankAwards = 9,			/*排名奖励展示 [itemId#count]#[itemId#count]*/
		hurtRank = 10,			/*伤害排行数量*/
		revive = 11,			/*复活整点时间 [时#时#时]*/
	}
	type scene_cross_boss = [number, number, number, Array<number>, string, Array<JoinAward>, Array<Items>, Array<Items>, Array<JoinAward>, Array<Items>, number, Array<number>];

	const enum scene_home_bossFields {
		mapId = 0,			/*地图ID*/
		level = 1,			/*层数*/
		areaId = 2,			/*区域ID*/
		occ = 3,			/*怪物ID*/
		levelTips = 4,			/*层数  体验层 第二层...*/
		vip = 5,			/*最低VIP等级*/
		eraLv = 6,			/*觉醒等级区间*/
		dropTips = 7,			/*珍惜掉落 [itemId#count]#[itemId#count]*/
		equipTips = 8,			/*装备阶级*/
		bossFight = 9,			/*BOSS 战力*/
		npcBox = 10,			/*NPC 宝箱ID*/
		boxAwardTips = 11,			/*宝箱珍品Tips [itemId#count]#[itemId#count]*/
		boxPos = 12,			/*宝箱坐标*/
		awardByLayer = 13,			/*每层掉落奖励预览 [itemId#count]#[itemId#count]*/
		Moneyconsumption = 14,			/*非vip进入消耗 [itemId#count]#[itemId#count]*/
	}
	type scene_home_boss = [number, number, number, number, string, number, Array<number>, Array<Items>, string, number, number, Array<Items>, Pos, Array<Items>, Items];

	const enum scene_copy_teamFields {
		mapId = 0,			/*地图ID*/
		ware = 1,			/*第XX波*/
		occ = 2,			/*怪物ID*/
		awardTips = 3,			/*奖励Tips*/
		award = 4,			/*击杀波数奖励*/
	}
	type scene_copy_team = [number, number, number, Array<Items>, Array<Items>];

	const enum scene_temple_bossFields {
		mapId = 0,			/*地图ID*/
		level = 1,			/*关数、层数或者怪物波数*/
		areaId = 2,			/*区域ID*/
		occ = 3,			/*怪物ID*/
		eraLevel = 4,			/*最低觉醒等级*/
		eraTips = 5,			/*觉醒等级Tips*/
		tipsAward = 6,			/*BOSS奖励展示 [itemId#count]#[itemId#count]*/
		firstRankAward = 7,			/*归属奖励 itemId#count*/
		killAward = 8,			/*击杀奖励 itemId#count*/
		joinAward = 9,			/*参与奖励 packageId#packageId*/
		strength = 10,			/*消耗体力值*/
		tipsXiaoGuaiAward = 11,			/*小怪奖励展示 [itemId#count]#[itemId#count]*/
	}
	type scene_temple_boss = [number, number, number, number, number, string, Array<Items>, Items, Items, Array<number>, number, Array<Items>];

	const enum scene_xuanhuo_arenaFields {
		mapId = 0,			/*地图ID*/
		level = 1,			/*关数、层数或者怪物波数*/
		areaId = 2,			/*区域ID*/
		occ = 3,			/*怪物ID*/
		eraLevel = 4,			/*最低觉醒等级*/
		eraTips = 5,			/*觉醒等级Tips*/
		tipsAward = 6,			/*BOSS奖励展示 [itemId#count]#[itemId#count]*/
		firstRankAward = 7,			/*归属奖励 itemId#count*/
		killAward = 8,			/*击杀奖励 itemId#count*/
		joinAward = 9,			/*参与奖励 packageId#packageId*/
		strength = 10,			/*消耗体力值*/
		tipsXiaoGuaiAward = 11,			/*小怪奖励展示 [itemId#count]#[itemId#count]*/
	}
	type scene_xuanhuo_arena = [number, number, number, number, number, string, Array<Items>, Items, Items, Array<number>, number, Array<Items>];

	const enum ShiLianStarFields {
		star = 0,			/*星级*/
		awards = 1,			/*奖励*/
	}
	type ShiLianStar = [number, Array<number>];

	const enum shilianFields {
		level = 0,			/*难度*/
		actorLevel = 1,			/*升级下一难度的角色等级要求*/
		rideTipAwards = 2,			/*精灵展示奖励 [itemId#count]#[itemId#count]*/
		petTipAwards = 3,			/*宠物展示奖励 [itemId#count]#[itemId#count]*/
		shenbingTipAwards = 4,			/*神兵展示奖励 [itemId#count]#[itemId#count]*/
		wingTipAwards = 5,			/*仙翼展示奖励 [itemId#count]#[itemId#count]*/
		fashionTipAwards = 6,			/*时装展示奖励 [itemId#count]#[itemId#count]*/
		guanghuanTipAwards = 7,			/*光环展示奖励 [itemId#count]#[itemId#count]*/
		tianzhuTipAwards = 8,			/*天珠展示奖励 [itemId#count]#[itemId#count]*/
		xilianTipAwards = 9,			/*洗炼展示奖励 [itemId#count]#[itemId#count]*/
		levelName = 10,			/*难度等级名称*/
	}
	type shilian = [number, number, Array<Items>, Array<Items>, Array<Items>, Array<Items>, Array<Items>, Array<Items>, Array<Items>, Array<Items>, string];

	const enum monsterFields {
		occ = 0,			/*怪物ID*/
		level = 1,			/*等级*/
		name = 2,			/*名字*/
		atkDistance = 3,			/*攻击距离*/
		bossType = 4,			/*BOSS 类型*/
		attr = 5,			/*属性*/
	}
	type monster = [number, number, string, number, number, Array<attr>];


	const enum monster_onhook_attrFields {
		level = 0,			/*天关等级*/
		skill = 1,			/*技能列表*/
		attr = 2,			/*属性*/
	}
	type monster_onhook_attr = [number, Array<number>, Array<attr>];

	const enum monster_level_attrFields {
		level = 0,			/*天关等级*/
		skill = 1,			/*技能列表*/
		awardCopper = 2,			/*哥布林王国奖励*/
		awardZQ = 3,			/*泰拉矿场奖励*/
	}
	type monster_level_attr = [number, Array<number>, number, number];

	const enum humanFields {
		ai = 0,			/*角色AI*/
		level = 1,			/*等级*/
		exp = 2,			/*经验*/
		sight = 3,			/*视野半径*/
		atkDistance = 4,			/*攻击距离*/
	}
	type human = [number, number, number, number, number];

	const enum robot_attrFields {
		ai = 0,			/*角色AI*/
		id = 1,			/*机器人ID*/
		level = 2,			/*等级*/
		sight = 3,			/*视野半径*/
		atkDistance = 4,			/*攻击距离*/
	}
	type robot_attr = [number, number, number, number, number];

	const enum skillFields {
		id = 0,				/*技能ID*/
		name = 1,			/*技能名*/
		skillType = 2,		/*类型 0:普攻 1:主动 2:永久被动 3:轮询被动 4:触发被动*/
		petSkill = 3,		/*非0即宠物技能*/
		cd = 4,				/*cd*/
		rangeType = 5,   	/*范围类型 1:自身周围 2:目标周围 */
		radius = 6,			/*半径(像素): -1:全图 */
		randomCount = 7,	/*随机个数 -1:全部 */
		param = 8,			/*技能参数: 效果类型#数值#效果类型#数值	*/
		des = 9,			/*描述*/
		icon = 10,			/*图标*/
		fight = 11,			/*战力*/
		shortDes = 12,		/*精简说明*/
	}
	type skill = [number, string, number, number, number, number, number, number, Array<number>, string, string, number, string];

	const enum skillTrainFields {
		id = 0,			/*技能ID*/
		name = 1,			/*技能名*/
		level = 2,			/*技能等级*/
		zq = 3,			/*消耗魔力*/
		fighting = 4,			/*战力*/
		show_condition = 5,			/*前端显示技能开启条件*/
		sort = 6,			/*升级顺序 1-8*/
		type = 7,			/*类型 0主动 1大荒 2古神 3觉醒*/
		short_des = 8,			/*秘术激活时显示描述*/
	}
	type skillTrain = [number, string, number, number, number, string, number, number, string];

	const enum effectFields {
		id = 0,			/*BUFF ID*/
		name = 1,			/*BUFF名*/
		desc = 2,			/*描述*/
		icon = 3,			/*图标*/
	}
	type effect = [number, string, string, string];

	/*道具权值*/
	const enum weightItemFields {
		itemId = 0,
		count = 1,
		data = 2,
	}
	type weightItem = [number, number, number];

	const enum packageFields {
		id = 0,			/*掉落包ID*/
		items = 1,			/*道具列表 id#count#data*/
	}
	type package = [number, Array<weightItem>];

	const enum dropFields {
		occ = 0,			/*怪物ID*/
		packages = 1,			/*packageId#packageId*/
	}
	type drop = [number, Array<number>];

	const enum item_materialFields {
		itemId = 0,			/*道具ID*/
		name = 1,			/*礼包名*/
		useLvl = 2,			/*使用等级*/
		vipLvl = 3,			/*VIP等级限制*/
		overlap = 4,			/*叠加数量*/
		sale = 5,			/*出售价格*/
		shortcutUse = 6,			/*快捷使用*/
		des = 7,			/*描述*/
		ico = 8,			/*图标ID*/
		fixGiftbag = 9,			/*礼包固定内容*/
		values = 10,			/*参数 value#value*/
		itemSourceId = 11,			/*道具来源ID id#id#id#id*/
		canUse = 12,			/*能否使用 0不能 1能 其它为功能id*/
		shortcutBuy = 13,			/*快捷购买*/
		price = 14,			/*价格  货币类型#货币价格*/
		isPiece = 15,			/*是否为碎片*/
		isChat = 16,			/*是否可以在聊天中发送  0：不可，1：可以*/
		showId = 17,			/*模型ID/图片ID*/
		isMove = 18,			/*展示模型、图片 是否 上下动  0否 1是*/
		isModel = 19,			/*是否模型(0模型1特效2图片)*/
		customClipId = 20,			/*道具展示特效ID*/
		layerNum = 21,			/*特效展示层级 0 道具图标和道具底图之间 1 图标的最上层*/
		xingJiNum = 22,			/*星级id 1开始 不配没有星级*/
	}
	type item_material = [number, string, number, number, number, number, number, string, string, Array<number>, Array<number>, Array<number>, number, number, Array<number>, number, number, number, number, number, number, number, number];

	const enum item_stoneFields {
		itemId = 0,			/*仙石ID*/
		name = 1,			/*仙石名*/
		overlap = 2,			/*叠加数量*/
		sale = 3,			/*出售价格*/
		des = 4,			/*描述*/
		ico = 5,			/*图标ID*/
		itemSourceId = 6,			/*仙石来源Id id#id#id#id*/
		shortcutBuy = 7,			/*快捷购买*/
		isChat = 8,			/*是否可以在聊天中发送  0：不可，1：可以*/
		showId = 9,			/*模型ID/图片ID*/
		isMove = 10,			/*展示模型、图片 是否 上下动  0否 1是*/
		isModel = 11,			/*是否模型(0模型1特效2图片)*/
		customClipId = 12,			/*道具展示特效ID*/
		layerNum = 13,			/*特效展示层级 0 道具图标和道具底图之间 1 图标的最上层*/
		xingJiNum = 14,			/*星级id 1开始 不配没有星级*/
	}
	type item_stone = [number, string, number, number, string, string, Array<number>, number, number, number, number, number, number, number, number];

	const enum item_equipFields {
		itemId = 0,			/*装备ID*/
		name = 1,			/*装备名*/
		overlap = 2,			/*叠加数量*/
		sale = 3,			/*出售价格*/
		era = 4,			/*觉醒要求*/
		wearLvl = 5,			/*穿戴等级*/
		fight = 6,			/*战力*/
		des = 7,			/*描述*/
		ico = 8,			/*图标ID*/
		baseAttr = 9,			/*基础属性 [id#value]#[id#value]*/
		advisePurpleAttr = 10,			/*推荐紫色属性 id#id*/
		adviseOrangeAttr = 11,			/*推荐橙色属性 id#id*/
		smelt = 12,			/*熔炼收益 熔炼经验值#金币#强化石*/
		notGeneratedScore = 13,			/*未生成装备评分*/
		itemSourceId = 14,			/*装备来源Id id#id#id#id*/
		isChat = 15,			/*是否可以在聊天中发送  0：不可，1：可以*/
		showId = 16,			/*模型ID/图片ID*/
		isMove = 17,			/*展示模型、图片 是否 上下动  0否 1是*/
		isModel = 18,			/*是否模型(0模型1特效2图片)*/
		customClipId = 19,			/*道具展示特效ID*/
		layerNum = 20,			/*特效展示层级 0 道具图标和道具底图之间 1 图标的最上层*/
		xingJiNum = 21,			/*星级id 1开始 不配没有星级*/
		xingXingShow = 22,			/*星星显示 1-4颗星星 不配没有星星*/
	}
	type item_equip = [number, string, number, number, number, number, number, string, string, Array<attr>, Array<number>, Array<number>, Array<number>, Array<number>, Array<number>, number, number, number, number, number, number, number, number];

	const enum equip_attr_poolFields {
		id = 0,			/*装备属性ID*/
		name = 1,			/*属性名*/
		type = 2,			/*属性类型*/
		value = 3,			/*属性值*/
		quality = 4,			/*品质*/
	}
	type equip_attr_pool = [number, string, number, number, number];

	const enum idCountFields {
		id = 0,
		count = 1,
	}
	type idCount = [number, number];

	const enum idNameFields {
		id = 0,
		name = 1,
	}
	type idName = [number, string];

	const enum item_composeFields {
		id = 0,			/*唯一id*/
		itemId = 1,			/*合成的物品id*/
		name = 2,			/*合成类型名字*/
		tClass = 3,			/*大类[id#name]*/
		sClass = 4,			/*小类[id#name]*/
		needItemId = 5,			/*消耗材料id+数量/消耗材料id+概率[id#count]#[id#count]*/
		params = 6,			/*材料+数量/数量+概率[id#count]#[id#count]*/
		tips = 7,			/*提示字段*/
		retTips = 8,			/*提示字段*/
		alertType = 9,				/*弹窗类型*/
	}
	type item_compose = [number, number, idName, idName, idName, Array<idCount>, Array<idCount>, string, Array<idCount>, number];

	const enum item_resolveFields {
		itemId = 0,			/*分解的物品id*/
		tClass = 1,			/*大类[id#name]*/
		name = 2,			/*中类名字*/
		sClass = 3,			/*小类[id#name]*/
		resolveItems = 4,			/*分解物品[id#count]#[id#count]*/
	}
	type item_resolve = [number, idName, idName, idName, Array<idCount>];

	const enum item_smeltFields {
		level = 0,			/*等级*/
		exp = 1,			/*升级经验*/
		fighting = 2,			/*战力*/
		attack = 3,			/*攻击力*/
		hp = 4,			/*生命*/
	}
	type item_smelt = [number, number, number, number, number];

	const enum onhook_dropFields {
		promoteLevel = 0,			/*觉醒等级*/
		dropItemInterval = 1,			/*掉落装备间隔 XX秒*/
		dropLZInterval = 2,			/*掉落龙珠间隔 XX秒*/
		packages = 3,			/*装备包 packageId#packageId*/
		packages_lz = 4,			/*龙珠包 packageId#packageId*/
		lz = 5,			/*龙珠数量 itemId#count*/
		equip = 6,			/*装备数量 itemId#count*/
		copper = 7,			/*熔炼金币 itemId#count*/
		stone = 8,			/*熔炼强化石 itemId#count*/
		smeltExp = 9,			/*熔炼经验 itemId#count*/
	}
	type onhook_drop = [number, number, number, Array<number>, Array<number>, Array<number>, Array<number>, Array<number>, Array<number>, Array<number>];

	const enum onhook_incomeFields {
		level = 0,			/*关卡*/
		exp = 1,			/*每小时经验*/
		coin = 2,			/*每小时金币*/
		zq = 3,			/*每小时魔力值*/
	}
	type onhook_income = [number, number, number, number];

	const enum TaskNodeFields {
		taskType = 0,			/*任务类型*/
		param = 1,			/*任务参数*/
	}
	type TaskNode = [number, Array<number>];

	const enum TaskMoneyFields {
		type = 0,			/*货币类型*/
		count = 1,			/*货币数量*/
	}
	type TaskMoney = [number, number];

	const enum taskFields {
		taskId = 0,			/*任务ID*/
		name = 1,			/*任务名*/
		nextId = 2,			/*下一个任务*/
		nodes = 3,			/*任务节点*/
		moneys = 4,			/*奖励货币 [类型#货币数量]#[类型#货币数量] 1:代币券 2:绑元 3:金币*/
		items = 5,			/*奖励道具 [道具ID#道具数量]*/
		skipActionId = 6,			/*跳转功能Id*/
		describe = 7,			/*任务描述*/
		guideFinishToHook = 8,  /*引导任务做完从副本出来后需要关闭的哪个界面*/
	}
	type task = [string, string, string, Array<TaskNode>, Array<TaskMoney>, Array<Items>, number, string, number];

	const enum EraNodeFields {
		eraType = 0,			/*条件类型*/
		param = 1,			/*任务参数*/
		skipId = 2,			/*跳转id*/
	}
	type EraNode = [number, number, number];

	const enum eraFields {
		level = 0,			/*觉醒等级 102表示1转2重*/
		name = 1,			/*名称*/
		tasklist = 2,			/*任务列表 任务ID#任务ID*/
		items = 3,			/*奖励道具 [道具ID#道具数量]*/
		fighting = 4,			/*战力*/
		attack = 5,			/*攻击力*/
		hp = 6,			/*生命*/
		defense = 7,			/*防御*/
		eraDan = 8,			/*觉醒道具 [道具ID#道具数量]*/
		tips = 9,			/*觉醒奖励提示*/
	}
	type era = [number, string, Array<number>, Array<Items>, number, number, number, number, Array<Items>, string];

	const enum era_taskFields {
		id = 0,			/*任务ID*/
		name = 1,			/*名称*/
		nodes = 2,			/*觉醒条件 类型#数量#跳转id 0人物等级 1仙石 2大荒 3金身 4强化 5圣物属性 6组队副本 7哥布林王国 8泰拉矿场 9boss */
		items = 3,			/*奖励道具 [道具ID#道具数量]*/
		arg = 4,			/*参数*/
	}
	type era_task = [number, string, EraNode, Array<Items>, Array<number>];

	const enum blendFields {
		name = 0,			/*name*/
		id = 1,			/*id*/
		intParam = 2,			/*数值参数*/
		stringParam = 3,			/*字符串参数*/
		des = 4,			/*描述*/
	}
	type blend = [string, number, Array<number>, Array<string>, string];

	const enum petFeedFields {
		level = 0,			/*培养等级*/
		exp = 1,			/*经验*/
		items = 2,			/*消耗道具 道具ID#道具数量#增加经验值*/
		skill = 3,			/*技能 技能id#等级#战力*/
		fighting = 4,			/*战力*/
		attrs = 5,			/*属性 [id#value]#[id#value]*/
	}
	type petFeed = [number, number, Array<number>, Array<number>, number, Array<attr>];

	const enum petRankFields {
		star = 0,			/*星级*/
		blessing = 1,			/*需要祝福值*/
		items = 2,			/*消耗道具 道具ID#道具数量#增加祝福值*/
		showId = 3,			/*外观id*/
		skill = 4,			/*技能 技能id#等级#战力*/
		fighting = 5,			/*战力*/
		attrs = 6,			/*属性 [id#value]#[id#value]*/
	}
	type petRank = [number, number, Array<number>, number, Array<number>, number, Array<attr>];

	const enum petMagicShowFields {
		showId = 0,			/*外观id*/
		star = 1,			/*星级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		fighting = 3,			/*战力*/
		getWay = 4,			/*获取途径*/
		attrs = 5,			/*属性 [id#value]#[id#value]*/
	}
	type petMagicShow = [number, number, Array<number>, number, string, Array<attr>];

	const enum petRefineFields {
		type = 0,			/*类型*/
		level = 1,			/*等级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		fighting = 3,			/*战力*/
		humanLevel = 4,			/*人物等级*/
		attrs = 5,			/*属性 [id#value]#[id#value]*/
	}
	type petRefine = [number, number, Array<number>, number, number, Array<attr>];

	const enum pet_fazhenFields {
		showId = 0,			/*外观id*/
		level = 1,			/*阶级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		fighting = 3,			/*战力*/
		getWay = 4,			/*获取途径*/
		quality = 5,			/*品质*/
		attrs = 6,			/*属性 [id#value]#[id#value]*/
	}
	type pet_fazhen = [number, number, Array<number>, number, string, number, Array<attr>];

	const enum rideFeedFields {
		level = 0,			/*培养等级*/
		exp = 1,			/*经验*/
		items = 2,			/*消耗道具 道具ID#道具数量#增加经验值*/
		skill = 3,			/*技能 技能id#等级#战力*/
		fighting = 4,			/*战力*/
		attrs = 5,			/*属性 [id#value]#[id#value]*/
	}
	type rideFeed = [number, number, Array<number>, Array<number>, number, Array<attr>];

	const enum rideRankFields {
		star = 0,			/*星级*/
		blessing = 1,			/*需要祝福值*/
		items = 2,			/*消耗道具 道具ID#道具数量#增加祝福值*/
		showId = 3,			/*外观id*/
		skill = 4,			/*技能 技能id#等级#战力*/
		fighting = 5,			/*战力*/
		attrs = 6,			/*属性 [id#value]#[id#value]*/
	}
	type rideRank = [number, number, Array<number>, number, Array<number>, number, Array<attr>];

	const enum rideMagicShowFields {
		showId = 0,			/*外观id*/
		star = 1,			/*星级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		fighting = 3,			/*战力*/
		getWay = 4,			/*获取途径*/
		attrs = 5,			/*属性 [id#value]#[id#value]*/
	}
	type rideMagicShow = [number, number, Array<number>, number, string, Array<attr>];

	const enum rideRefineFields {
		type = 0,			/*类型*/
		level = 1,			/*等级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		fighting = 3,			/*战力*/
		humanLevel = 4,			/*人物等级*/
		attrs = 5,			/*属性 [id#value]#[id#value]*/
	}
	type rideRefine = [number, number, Array<number>, number, number, Array<attr>];

	const enum ride_fazhenFields {
		showId = 0,			/*外观id*/
		level = 1,			/*阶级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		fighting = 3,			/*战力*/
		getWay = 4,			/*获取途径*/
		quality = 5,			/*品质*/
		attrs = 6,			/*属性 [id#value]#[id#value]*/
	}
	type ride_fazhen = [number, number, Array<number>, number, string, number, Array<attr>];

	const enum soulRefineFields {
		type = 0,			/*类型*/
		level = 1,			/*修炼等级*/
		name = 2,			/*名字*/
		resBaseId = 3,			/*底图id*/
		resTypeId = 4,			/*类型图id*/
		resRuneId = 5,			/*玉荣图id*/
		copper = 6,			/*消耗金币*/
		promoteLevel = 7,			/*人物转身等级 高2位表示转低两位表示重*/
		fighting = 8,			/*战力*/
		attrs = 9,			/*属性 [id#value]#[id#value]*/
	}
	type soulRefine = [number, number, string, string, string, string, number, number, number, Array<attr>];

	const enum soulRiseFields {
		level = 0,			/*等级*/
		count = 1,			/*需要金身数量*/
		refineLevel = 2,			/*金身等级*/
		fighting = 3,			/*战力*/
		attrs = 4,			/*属性 [id#value]#[id#value]*/
	}
	type soulRise = [number, number, number, number, Array<attr>];

	const enum amuletRefineFields {
		id = 0,			/*id*/
		color = 1,			/*品质 2-5*/
		level = 2,			/*等级*/
		items = 3,			/*消耗道具 道具ID#道具数量*/
		universalId = 4,			/*万能圣物道具id*/
		cultivation = 5,			/*修为值*/
		fighting = 6,			/*战力*/
		attrs = 7,			/*属性 [id#value]#[id#value]*/
		r_attrs = 8,			/*属性 [id#value]#[id#value]*/
	}
	type amuletRefine = [number, number, number, Array<number>, number, number, number, Array<attr>, Array<attr>];

	const enum amuletRiseFields {
		level = 0,			/*等级*/
		cultivation = 1,			/*修为值*/
		maxSkillLevel = 2,			/*技能最大等级*/
		skillDamage = 3,			/*技能伤害*/
		cultivatText = 4,			/*修为名称*/
		cultivatIcon = 5,			/*修为图片*/
	}
	type amuletRise = [number, number, number, number, string, number];

	// 龙骨动画外观
	const enum ExteriorSKFields {
		id = 0,				/*外观ID*/
		path = 1,			/*外观路径*/
		name = 2,			/*外观名称*/
		icon = 3,			/*外观图标*/
		quality = 4,			/*品质*/
		get_way = 5,			/*来源*/
		effect_bg = 6,			/*当前会作为主骨骼的背景特效展示*/
		deviationX = 7,			/*X轴坐标偏移量*/
		deviationY = 8,			/*Y轴坐标偏移量*/
		scale = 9,			/*缩放比例,默认1为原始大小不缩放*/
		xingJiNum = 10,			/*星级id 1开始 不配没有星级*/
		title = 11,				/* 称号偏移 */
		portrayal = 12			/* 全身像 */
	}
	type ExteriorSK = [number, string, string, number, number, number, number, number, number, number, number, number, string];

	const enum SkillEffectFields {
		id = 0,			/*技能ID*/
		type = 1,			/*技能类型，0为单体，1为AOE*/
		shake_rate = 2,			/*震屏概率*/
		shake_delay = 3,			/*震屏时机*/
		hurts = 4,			/*伤害段，飘字和闪白出现时机，相对技能开始时间，单位毫秒，比如0#1000*/
		action = 5,			/*动作名*/
		self_type = 6,			/*自身特效是否跟随旋转，0为否，1为是*/
		self_fb = 7,			/*自身前景特效名*/
		self_bg = 8,			/*自身后景特效名*/
		target_fb = 9,			/*目标前景特效名*/
		target_bg = 10,			/*目标后景特效名*/
		missile = 11,			/*发射物特效*/
		sound = 12,			/*音效文件*/
		delay = 13,
	}
	type SkillEffect = [number, number, number, number, Array<number>, string, number, string, string, string, string, string, string, number];

	const enum erorr_codeFields {
		error_code = 0,			/*错误码*/
		msg_ZN = 1,			/*错误码对应的中文消息*/
	}
	type erorr_code = [number, string];

	const enum MapPathFields {
		id = 0,			/*地图ID*/
		path = 1,			/*怪点寻路路径，格式  [起始ID#目标ID1#目标ID2#目标ID...]#...*/
		hasBg = 2,			/*是否有背景，0无1有*/
	}
	type MapPath = [number, Array<Array<number>>, number];

	const enum MonsterResFields {
		id = 0,			/*怪物ID*/
		type = 1,			/*怪物类型，0为普通怪，1为BOSS*/
		name = 2,			/*怪物名称*/
		radius = 3,			/*怪物体积半径*/
		res = 4,			/*怪物资源文件*/
		icon = 5,			/*图标*/
		level = 6,			/*等级*/
		scale = 7,			/*缩放系数*/
		hpNum = 8,			/*怪物血条数量*/
		show = 9,			/*出场效果，0为没有，1为普通出场效果*/
		showEffect = 10,			/*出场特效*/
		local = 11,			/*原地特效*/
		items = 12,			/*奖励道具 [道具ID#道具数量]*/
		side = 13,			/*怪物朝向1为向右-1为向左*/
		title = 14,			/*称号偏移*/
	}
	type MonsterRes = [number, number, string, number, number, string, number, number, number, number, Array<string>, string, Array<Items>, number, number];

	const enum PetResFields {
		id = 0,						/*宠物id*/
		name = 1,					/*宠物名称*/
		pet_type = 2,				/*宠物类型，0-近战 1-远程*/
		effectId = 3,				/*远程宠物攻击头上特效id*/
		attack_radius = 4,			/*近战宠寻路到当前攻击的怪的的半径值*/
		attack_point_X = 5,			/*远程宠物攻击发射点X偏移量*/
		attack_point_Y = 6,			/*远程宠物攻击发射点Y偏移量*/
		radius = 7,					/*宠寻路到主人的半径值*/
		attack_speed = 8,			/*远程宠物子弹（普攻）的移动速度*/
		bullet_offset_y = 9,		/*远程宠物子弹起点相对于特效的y偏移量，x保持一致*/
		bullet_name = 10,			/*远程宠物子弹图片名字*/
	}
	type PetRes = [number, string, number, number, number, number, number, number, number, number, string];

	const enum npcFields {
		id = 0,			/*NPC ID*/
		res = 1,			/*外观ID*/
		pos = 2,			/*在场景中的位置(x#y)*/
		radius = 3,			/*体积半径*/
		name = 4,			/*名字*/
		scale = 5,			/*缩放*/
		funId = 6,			/*功能ID*/
		distance = 7,			/*显示触发距离*/
		hide = 8,			/*名字是否隐藏 1隐藏*/
		action = 9,			/*播放动作名 为空默认*/

	}
	type npc = [number, number, Pos, number, string, number, number, number, number, string];

	const enum NameLibraryFields {
		id = 0,			/*类型ID(0为姓，1为符号，2为男前缀，3为女前缀， 4为男后缀，5为女后缀)*/
		names = 1,			/*名字数组*/
	}
	type NameLibrary = [number, Array<string>];

	/*签到道具*/
	const enum sign_itemsFields {
		itemId = 0,
		count = 1,
	}
	type sign_items = [number, number];

	const enum sign_rewardFields {
		count = 0,			/*签到次数*/
		level = 1,			/*觉醒次数*/
		tipsAward = 2,			/*签到奖励 [itemId:count]#[itemId:count]*/
		addAward = 3,			/*累签奖励 [itemId:count]#[itemId:count]*/
		icon = 4,			/*累计签到图标*/
	}
	type sign_reward = [number, number, Array<sign_items>, Array<sign_items>, string];

	const enum ActionNodeFields {
		type = 0,			/*1:角色等级 2:天关关数 3:开服天数 4:VIP 10:自定义*/
		param = 1,			/*等级、关数、天数*/
	}
	type ActionNode = [number, number];

	const enum action_openFields {
		name = 0,			/*功能*/
		id = 1,			/*功能ID*/
		posType = 2,			/*存放类型*/
		index = 3,			/*排序下标*/
		tips = 4,			/*未开启提示*/
		hidden = 5,			/*运营按钮收回时是否隐藏 0:隐藏 1:显示*/
		uiName = 6,			/*ui资源名称*/
		subfunctions = 7,			/*子功能id*/
		isSubfunction = 8,			/*此功能是否为子功能 0:非子功能(入口或者其他) 1:子功能*/
	}
	type action_open = [string, number, number, number, Array<Array<string>>, number, string, Array<number>, number];

	const enum get_wayFields {
		id = 0,			/*ID*/
		icon = 1,			/*图标*/
		desc = 2,			/*描述*/
		params = 3,			/*参数 类型#参数*/
	}
	type get_way = [number, string, string, Array<number>];

	const enum seven_dayFields {
		day = 0,			/*创号天数*/
		award = 1,			/*奖励 [itemId:count]#[itemId:count]*/
		name = 2,			/*奖励名称*/
		iconID = 3,			/*奖励图案ID模型ID*/
		isModel = 4,			/*是否模型(0模型1特效2图片)*/
		isMove = 5,			/*是否上下缓动*/
		isTeXiao = 6,			/*是否有特效 0 没有 1有*/
	}
	type seven_day = [number, Array<Items>, string, number, number, number, number];

	const enum open_rewardFields {
		id = 0,			/*礼包id*/
		award = 1,			/*奖励 [itemId:count]#[itemId:count]*/
		name = 2,			/*礼包名称*/
		cost = 3,			/*消耗品[id:count]*/
		iconID = 4,			/*礼包图案ID模型ID*/
		isModel = 5,			/*是否模型(0模型1特效2图片)*/
		isMove = 6,			/*是否上下缓动*/
		isTeXiao = 7,			/*是否有特效 0 没有 1有*/
		flagImg = 8,			/*标记外观资源*/
		fight = 9,			/*战力值*/
	}
	type open_reward = [number, Array<Items>, string, Items, number, number, number, number, string, number];

	const enum half_monthFields {
		day = 0,			/*创号天数*/
		award = 1,			/*奖励 [itemId:count]#[itemId:count]*/
		name = 2,			/*奖励名称*/
		iconID = 3,			/*奖励图案ID模型ID*/
		isModel = 4,			/*是否模型(0模型1特效2图片)*/
		isMove = 5,			/*是否上下缓动*/
		isTeXiao = 6,			/*是否有特效 0 没有 1有*/
	}
	type half_month = [number, Array<Items>, string, number, number, number, number];

	const enum gemRefineFields {
		id = 0,			/*id*/
		next_id = 1,			/*下一级id*/
		name = 2,			/*名字*/
		type = 3,			/*类型 1青龙 2白虎 3朱雀 4玄武*/
		color = 4,			/*品质*/
		level = 5,			/*等级*/
		refine_count = 6,			/*升级需要数量*/
		fighting = 7,			/*战力*/
		attrs = 8,			/*属性 [id#value]#[id#value]*/
	}
	type gemRefine = [number, number, string, number, number, number, number, number, Array<attr>];

	const enum gemRiseFields {
		level = 0,			/*等级*/
		refine_level = 1,			/*仙石总等级*/
		fighting = 2,			/*战力*/
		attrs = 3,			/*属性 [id#value]#[id#value]*/
	}
	type gemRise = [number, number, number, Array<attr>];

	const enum strongRefineFields {
		part = 0,			/*部位*/
		level = 1,			/*等级*/
		items = 2,			/*奖励道具 [道具ID#道具数量]*/
		fighting = 3,			/*战力*/
		copper = 4,			/*消耗金币*/
		attrs = 5,			/*属性 [id#value]#[id#value]*/
	}
	type strongRefine = [number, number, Array<Items>, number, number, Array<attr>];

	const enum strongRiseFields {
		level = 0,			/*等级*/
		type = 1,			/*类型 0大师 1神匠*/
		refineLevel = 2,			/*需要强化等级*/
		fighting = 3,			/*战力*/
		attrs = 4,			/*属性 [id#value]#[id#value]*/
	}
	type strongRise = [number, number, number, number, Array<attr>];

	const enum zhuhunFields {
		part = 0,			/*部位*/
		level = 1,			/*等级*/
		exp = 2,			/*升级经验*/
		items = 3,			/*道具 [道具ID#经验]*/
		fighting = 4,			/*战力*/
		attrs = 5,			/*属性 [id#value]#[id#value]*/
	}
	type zhuhun = [number, number, number, Array<Items>, number, Array<attr>];

	const enum shihunFields {
		sClass = 0,			/*小类（1开始)*/
		tClass = 1,			/*大类（1攻 2守)*/
		level = 2,			/*等级*/
		items = 3,			/*消耗道具 道具ID#道具数量*/
		parts = 4,			/*装备部位(xx#xx#xx)*/
		maxZhuhunLv = 5,			/*铸魂等级(上限)*/
		fighting = 6,			/*战力*/
		attrs = 7,			/*属性 [id#value]#[id#value]*/
	}
	type shihun = [number, number, number, Array<number>, Array<number>, number, number, Array<attr>];

	const enum emailFields {
		id = 0,			/*邮件id*/
		title = 1,			/*邮件标题*/
		content = 2,			/*邮件内容*/
	}
	type email = [number, string, string];

	const enum gmFields {
		id = 0,
		level = 1,			/*设置等级*/
		items = 2,			/*道具 [itemId#count]#[itemId#count]*/
		skills = 3,			/*技能列表 id#id*/
		tianguanLevel = 4,			/*增加天关等级*/
	}
	type gm = [number, number, Array<Items>, Array<number>, number];

	const enum online_rewardFields {
		id = 0,			/*id*/
		eraLevel = 1,			/*觉醒等级*/
		grade = 2,			/*档次 从1开始*/
		time = 3,			/*在线时间 秒*/
		reward = 4,			/*道具 [itemId#count]#[itemId#count]*/
		openDay = 5,			/*开服第几天*/
		showId = 6,			/*模型ID/图片ID*/
		isMove = 7,			/*展示模型、图片 是否 上下动  0否 1是*/
		isModel = 8,			/*是否模型(0模型1特效2图片)*/
	}
	type online_reward = [number, number, number, number, Array<Items>, number, number, number, number];

	const enum lilian_taskFields {
		id = 0,			/*id*/
		type = 1,			/*类型*/
		name = 2,			/*任务名字*/
		condition = 3,			/*条件*/
		exp = 4,			/*奖励经验*/
		openLevel = 5,			/*开放等级*/
		isRecord = 6,			/*未开放前是否记录进度 0不记录 1记录*/
		skipId = 7,			/*跳转面板的Id[id#参数]*/
	}
	type lilian_task = [number, number, string, number, number, number, number, Array<number>];

	const enum lilian_dayFields {
		id = 0,			/*id*/
		eraLevel = 1,			/*觉醒等级*/
		grade = 2,			/*档次 从1开始*/
		maxExp = 3,			/*最大经验值*/
		reward = 4,			/*道具 [itemId#count]#[itemId#count]*/
		nullBox = 5,	/**用于前端展示的空宝箱 */
	}
	type lilian_day = [number, number, number, number, Array<Items>, number];

	const enum lilian_riseFields {
		riseLevel = 0,			/*重数 101表示1阶1重*/
		maxExp = 1,			/*最大经验值*/
		reward = 2,			/*道具 [itemId#count]#[itemId#count]*/
		fighting = 3,			/*战力*/
		attack = 4,			/*攻击力*/
		hp = 5,			/*生命*/
		name = 6,			/*活跃值名*/
		medal = 7,/*勋章图片名*/
	}
	type lilian_rise = [number, number, Array<Items>, number, number, number, string, string];

	const enum xianwei_taskFields {
		id = 0,			/*id*/
		nextId = 1,			/*下一个id 0表示没有下一个了*/
		type = 2,			/*类型*/
		name = 3,			/*名字*/
		condition = 4,			/*条件 param1#param2*/
		reward = 5,			/*升阶奖励 [itemId#count]#[itemId#count]*/
		openLevel = 6,			/*开放等级*/
		tianguanLv = 7,			/*天关等级*/
		isHead = 8,			/*是否首个任务 0否 1是*/
		headIndex = 9,			/*头id(任意数字，区分多条支线，不可修改)*/
		rank = 10,			/*排序优先级*/
		skipId = 11,			/*跳转面板的Id[id#参数]*/
		taskCondition = 12,			/*前端显示任务条件*/
	}
	type xianwei_task = [number, number, number, string, Array<number>, Array<Items>, number, number, number, number, number, Array<number>, number];

	const enum xianwei_riseFields {
		id = 0,			/*id*/
		name = 1,			/*名字*/
		maxExp = 2,			/*最大仙力值*/
		reward = 3,			/*升阶奖励 [itemId#count]#[itemId#count]*/
		wages = 4,			/*每日俸禄 [itemId#count]#[itemId#count]*/
		fighting = 5,			/*战力*/
		attack = 6,			/*攻击力*/
		hp = 7,			/*生命*/
		defense = 8,			/*防御*/
		res = 9,			/*图标名*/
		resName = 10,			/*称号资源名*/
	}
	type xianwei_rise = [number, string, number, Array<Items>, Array<Items>, number, number, number, number, string, string];

	const enum kuanghai_taskFields {
		id = 0,			/*任务id*/
		nextId = 1,			/*下一个id 0表示没有下一个了*/
		type = 2,			/*类型*/
		name = 3,			/*名字*/
		condition = 4,			/*条件*/
		exp = 5,			/*嗨点*/
		isHead = 6,			/*是否首个任务 0否 1是*/
		rank = 7,			/*排序优先级*/
		skipId = 8,			/*跳转面板的Id[id#参数]*/
		taskCondition = 9,			/*前端显示任务条件*/
	}
	type kuanghai_task = [number, number, number, string, number, number, number, number, Array<number>, number];

	const enum kuanghai2_taskFields {
		id = 0,			/*任务id*/
		nextId = 1,			/*下一个id 0表示没有下一个了*/
		type = 2,			/*类型*/
		name = 3,			/*名字*/
		condition = 4,			/*条件*/
		exp = 5,			/*嗨点*/
		isHead = 6,			/*是否首个任务 0否 1是*/
		rank = 7,			/*排序优先级*/
		skipId = 8,			/*跳转面板的Id[id#参数]*/
		taskCondition = 9,			/*前端显示任务条件*/
		reward = 10,			/*任务奖励物品*/
		taskType = 11,			/*前端显示任务Tab*/
		taskPoint = 12,			/*直接完成消耗点数*/
	}
	type kuanghai2_task = [number, number, number, string, number, number, number, number, Array<number>, number, Array<Items>, number, number];

	const enum kuanghai_riseFields {
		id = 0,			/*活动id(从1开始)*/
		name = 1,			/*名字*/
		grade = 2,			/*档次(从1开始)*/
		condition = 3,			/*条件*/
		reward = 4,			/*每档奖励 [itemId#count]#[itemId#count]*/
		taskList = 5,			/*首任务列表(taskId#taskId)*/
	}

	type kuanghai_rise = [number, string, number, number, Array<Items>, Array<number>];


	const enum kuanghai2_riseFields {
		id = 0,			/*活动id(从1开始)*/
		name = 1,			/*名字*/
		grade = 2,			/*档次(从1开始)*/
		condition = 3,			/*条件*/
		reward = 4,			/*每档奖励 [itemId#count]#[itemId#count]*/
		taskList = 5,			/*首任务列表(taskId#taskId)*/
		finalReward = 6,			/*全部任务完成额外奖励 [itemId#count]#[itemId#count]*/
		rechargeNum = 7,			/*充值多少获得一点完成点*/
	}
	type kuanghai2_rise = [number, string, number, number, Array<Items>, Array<number>, Array<Items>, number];


	const enum marry_intimacyFields {
		level = 0,			/*培养等级*/
		exp = 1,			/*需要经验*/
		items = 2,			/*需求物品*/
		reward = 3,			/*奖励 [itemId#count]#[itemId#count]*/
	}
	type marry_intimacy = [number, number, Array<number>, Array<Items>];

	const enum marry_ringFields {
		level = 0,			/*等级*/
		exp = 1,			/*需要经验*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		attrs = 3,			/*属性 [id#value]#[id#value]*/
		fighting = 4,		/*战力*/
		skill = 5,			/*技能纯粹ID*/
	}
	type marry_ring = [number, number, Array<number>, Array<attr>, number, number];

	const enum marry_keepsakeFields {
		typeId = 0,			/*类型ID*/
		level = 1,			/*等级*/
		items = 2,			/*消耗道具 [道具ID#道具数量]#[道具ID#道具数量]*/
		attrs = 3,			/*属性 [id#value]#[id#value]*/
		fighting = 4,		/*战力*/
	}
	type marry_keepsake = [number, number, Array<Items>, Array<attr>, number];

	const enum marry_keepsake_gradeFields {
		typeId = 0,			/*类型ID*/
		level = 1,			/*等级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		attrs = 3,			/*属性 [id#value]#[id#value]*/
		fighting = 4,		/*战力*/
		skill = 5,			/*技能开启*/
		sskill = 6,          /*心有灵犀开启*/
	}
	type marry_keepsake_grade = [number, number, Items, Array<attr>, number, number, [number, number]];

	const enum marry_dollFields {
		typeId = 0,			/*类型ID*/
		level = 1,			/*等级*/
		exp = 2,			/*经验*/
		items = 3,			/*消耗道具 道具ID#道具数量*/
		fighting = 4,		/*战力*/
		attrs = 5,			/*属性 [id#value]#[id#value]*/
	}
	type marry_doll = [number, number, number, Items, number, Array<attr>];

	const enum marry_doll_gradeFields {
		typeId = 0,			/*类型ID*/
		level = 1,			/*等级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		attrs = 3,			/*属性 [id#value]#[id#value]*/
		fighting = 4,		/*战力*/
		getWay = 5,			/*获取途径*/
	}
	type marry_doll_grade = [number, number, Items, Array<attr>, number, string];

	const enum marry_doll_refineFields {
		typeId = 0,			/*类型ID*/
		level = 1,			/*等级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		fighting = 3,		/*战力*/
		doollLevel = 4,	 	/*仙娃总等级*/
		attrs = 5,			/*属性 [id#value]#[id#value]*/
	}
	type marry_doll_refine = [number, number, Items, number, number, Array<attr>];

	//姻缘 任务
	const enum marry_taskFields {
		id = 0,				/*任务id*/
		nextId = 1,			/*下一个id 0表示没有下一个了*/
		taskType = 2,		/*任务类型*/
		name = 3,			/*名字*/
		condition = 4,		/*条件*/
		isHead = 5,			/*是否首个任务 0否 1是*/
		rank = 6,			/*排序优先级*/
		skipId = 7,			/*跳转面板的Id*/
		taskCondition = 8,	/*前端显示任务条件*/
		reward = 9,			/*奖励物品*/
		type = 10,			/*0：每日 1：终身任务*/
	}
	//姻缘 任务
	type marry_task = [number, number, number, string, number, number, number, number, string, Array<Items>, number];

	const enum marry_packageFields {
		id = 0,				/*礼包id*/
		name = 1,			/*名称*/
		items = 2,			/*奖励*/
		originalPrice = 3,	/*原价*/
		realityPrice = 4,	/*现价*/
		ringID = 5,			/*戒指ID*/
	}
	type marry_package = [number, string, Array<Items>, Items, Items, number];

	const enum marry_doll_skillFields {
		typeId = 0,			/*类型ID*/
		skillId = 1,		/*技能ID*/
		age = 2,			/*仙龄限制*/
		order = 3,			/*阶数限制*/
		type = 4,			/*类别*/
	}
	type marry_doll_skill = [number, number, number, number, number];

	const enum marry_ring_skillFields {
		typeId = 0,			/*类型ID*/
		level = 1,			/*培养等级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
	}
	type marry_ring_skill = [number, number, Items];

	const enum marry_keepsake_skillFields {
		typeId = 0,			/*类型ID*/
		level = 1,			/*培养等级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
	}
	type marry_keepsake_skill = [number, number, Items];



	const enum shenbing_feedFields {
		level = 0,			/*培养等级*/
		items = 1,			/*消耗道具 道具ID#道具数量*/
		skill = 2,			/*技能 技能id#等级#战力*/
		fighting = 3,			/*战力*/
		attrs = 4,			/*属性 [id#value]#[id#value]*/
	}
	type shenbing_feed = [number, Array<number>, Array<number>, number, Array<attr>];



	/**至尊装备**/
	const enum zhizun_feedFields {
		id = 0,				/*培养ID*/
		level = 1,			/*培养等级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		skill = 3,			/*技能 技能id#等级#战力*/
		fighting = 4,		/*战力*/
		attrs = 5,			/*属性 [id#value]#[id#value]*/
	}
	type zhizun_feed = [number, number, Array<number>, Array<[number, number, number]>, number, Array<attr>];

	/**头像**/
	const enum headFields {
		id = 0,				/*头像ID*/
		name = 1,			/*头像名字*/
		desc = 2,			/*头像获取描述*/
		level = 3,			/*培养等级*/
		items = 4,			/*消耗道具 道具ID#道具数量*/
		fighting = 5,		/*战力*/
		attrs = 6,			/*属性 [id#value]#[id#value]*/
	}
	type head = [number, string, string, number, Items, number, Array<attr>];

	/**现金装备**/
	const enum cashEquipFields {
		id = 0,			/*唯一id*/
		itemId,			/*物品id*/
		name,			/*名称*/
		gold,			/*价值*/
		grant,			/*发放数量*/
		roll,			/*概率*/
		open,			/*启用*/
		desc,			/*获取描述*/
	}
	type cashEquip = [number, number, string, number, number, number, string];

	/**现金装备 存储类型**/
	const enum cashEquipDataFields {
		id = 0,				/*唯一id*/
		have,			/*拥有数量*/
		gold,			/*价值*/
	}
	type cashEquipData = [number, number, number];


	const enum shenbing_magicShowFields {
		showId = 0,			/*外观id*/
		level = 1,			/*阶级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		fighting = 3,			/*战力*/
		getWay = 4,			/*获取途径*/
		quality = 5,			/*品质*/
		attrs = 6,			/*属性 [id#value]#[id#value]*/
	}
	type shenbing_magicShow = [number, number, Array<number>, number, string, number, Array<attr>];

	const enum shenbing_refineFields {
		type = 0,			/*类型*/
		level = 1,			/*等级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		fighting = 3,			/*战力*/
		humanLevel = 4,			/*人物等级*/
		attrs = 5,			/*属性 [id#value]#[id#value]*/
	}
	type shenbing_refine = [number, number, Array<number>, number, number, Array<attr>];

	const enum wing_feedFields {
		level = 0,			/*培养等级*/
		items = 1,			/*消耗道具 道具ID#道具数量*/
		skill = 2,			/*技能 技能id#等级#战力*/
		fighting = 3,			/*战力*/
		attrs = 4,			/*属性 [id#value]#[id#value]*/
	}
	type wing_feed = [number, Array<number>, Array<number>, number, Array<attr>];

	const enum wing_magicShowFields {
		showId = 0,			/*外观id*/
		level = 1,			/*阶级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		fighting = 3,			/*战力*/
		getWay = 4,			/*获取途径*/
		quality = 5,			/*品质*/
		attrs = 6,			/*属性 [id#value]#[id#value]*/
	}
	type wing_magicShow = [number, number, Array<number>, number, string, number, Array<attr>];

	const enum wing_refineFields {
		type = 0,			/*类型*/
		level = 1,			/*等级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		fighting = 3,			/*战力*/
		humanLevel = 4,			/*人物等级*/
		attrs = 5,			/*属性 [id#value]#[id#value]*/
	}
	type wing_refine = [number, number, Array<number>, number, number, Array<attr>];

	const enum xunbao_operFields {
		type = 0,			/*探索类型 0装备 1巅峰 2至尊 3仙符*/
		grade = 1,			/*抽奖档次 0 1次 1 10次 2 50次*/
		condition = 2,			/*消耗道具 道具ID#道具数量*/
		reward = 3,			/*奖励代币 id#数量*/
		firstReward = 4,			/*第一次奖励 [itemId#count]#[itemId#count]*/
		times = 5,			/*抽奖次数 0  1  2 */
	}
	type xunbao_oper = [number, number, Array<number>, Array<number>, Array<Items>, number];

	/*权值信息*/
	const enum XunbaoNodeFields {
		itemId = 0,
		weight = 1,
		itemGrade = 2,
	}
	type XunbaoNode = [number, number, number];

	const enum xunbao_weightFields {
		type = 0,			/*探索类型 0装备 1巅峰 2至尊 3仙符*/
		grade = 1,			/*奖励档次(前闭后闭) min#max*/
		weights = 2,			/*权值信息 [itemId#权值#道具档次]#[itemId#权值#道具档次]*/
		showItem = 3,			/*展示道具 itemId#itemId*/
	}
	type xunbao_weight = [number, Array<number>, Array<XunbaoNode>, Array<number>];

	const enum xunbao_broadcastFields {
		type = 0,			/*探索类型 0装备 1巅峰 2至尊 3仙符*/
		name = 1,			/*随机名字 name#name*/
		item_1 = 2,			/*道具1 itemId#itemId*/
		item_2 = 3,			/*道具2 itemId#itemId*/
	}
	type xunbao_broadcast = [number, Array<string>, Array<number>, Array<number>];

	const enum xunbao_exchangeFields {
		id = 0,					/*兑换道具对应id  唯一id*/
		type = 1,				/*探索类型 0装备 1巅峰 2至尊 3仙符 6庆典*/
		exchangeItem = 2,		/*兑换道具 道具ID#道具数量*/
		condition = 3,			/*兑换所需代币 道具ID#道具数量*/
		sort = 4,				/*界面排序*/
		limitBuy = 5,			/*兑换限制*/
		alreadyCash = 6,		/*已购次数*/
	}
	type xunbao_exchange = [number, number, Array<number>, Array<number>, number, Array<number>, number];

	/*特权信息*/
	const enum PrivilegeNodeFields {
		type = 0,
		param1 = 1,
		param2 = 2,
	}
	type PrivilegeNode = [number, number, number];

	/*特权其它参数*/
	const enum PrivilegeParamFields {
		type = 0,
		param = 1,
	}
	type PrivilegeParam = [number, Array<Items>];

	const enum privilegeFields {
		type = 0,			/*类型 101月卡 0-15vip*/
		nodes = 1,			/*特权信息 [type#参数1#参数2]#[type#参数1#参数2]*/
		params = 2,			/*其他参数 参数1#参数2*/
		exp = 3,			/*vip升级经验 此字段只对vip有效*/
		reward = 4,			/*奖励 [itemId#count]#[itemId#count]*/
		addPower = 5,			/* 部分加成[string]#[string]*/
		allAddPower = 6,			/* 全部加成[string]#[string]*/
		bigRewardName = 7,			/*获得奖励名称图片索引(大奖励)*/
		bigReward = 8,			/*奖励索引(大奖励)*/
		bigRewardPower = 9,			/*奖励战力*/
		rechargesort = 10,			/*充值普通档位排序Id id#id#id#id*/
		isModel = 11,			/*是否模型(0模型1图片2法阵)*/
		isMove = 12,			/*是否上下缓动*/
		isTeXiao = 13,			/*是否有特效 0 没有 1有*/
		dayReward = 14,			/*每日可领取奖励 [itemId#count]#[itemId#count]*/
		tianGuanNum = 15,			/*vip的天关数提示（非SVIP）*/
	}
	type privilege = [number, Array<PrivilegeNode>, Array<PrivilegeParam>, number, Array<Items>, Array<string>, Array<string>, number, number, number, Array<number>, number, number, number, Array<Items>, number];

	const enum mallFields {
		id = 0,										/*唯一id*/
		itemId = 1,									/*道具id*/
		count = 2,									/*数量*/
		mallType = 3,								/*商城类型 0商城 10商店*/
		mallName = 4,								/*商城名字*/
		childMallType = 5,							/*子商城类型 1道具商城 2材料商城 3装备商城 4限购商城*/
		childMallName = 6,							/*子商城名字*/
		originalPrice = 7,							/*原价 itemId#数量*/
		realityPrice = 8,							/*现价 itemId#数量*/
		limitBuy = 9,								/*限购(0不限购 1每天 2每周) 类型#数量*/
		vip = 10,									/*vip条件 0表示不限制*/
		shortcut = 11,								/*是否弹出购买界面 0弹 1不弹*/
		desId = 12,									/*折扣id*/
		sortId = 13,								/*排序id*/
		discountBgId = 14,							/*折扣底图ID*/
		eraCondition = 15,							/*觉醒等级条件(era.xlsx表 level字段) eg:101#103  或者101#101*/
	}
	type mall = [number, number, number, number, string, number, string, Array<number>, Array<number>, Array<number>, number, number, number, number, number, Array<number>];

	const enum failure_strongerFields {
		level = 0,			/*等级*/
		strongSourceId = 1,			/*变强途径id id#id#id#id*/
		specialStrongId = 2,			/*特殊变强途径 id*/
	}
	type failure_stronger = [number, Array<number>, number];

	const enum broadcastFields {
		broadcastId = 0,			/*广播ID*/
		content = 1,			/*广播内容#参数#内容 参数使用数字代替从0开始*/
		link = 2,			/*超链接内容#跳转界面id*/
		type = 3,			/*1#2 在哪个频道显示 0：跑马灯  1：九州  2：本服  3：系统*/
		condition = 4,			/*触发广播的条件，比如达到多少级以上*/
	}
	type broadcast = [number, string, Array<string>, Array<number>, Array<number>];

	const enum robot_showFields {
		level = 0,			/*等级段*/
		fashion = 1,			/*时装 [id#id]#[id#id]*/
		wing = 2,			/*翅膀 [id#id]#[id#id]*/
		shengbing = 3,			/*神兵 [id#id]#[id#id]*/
		ride = 4,			/*精灵 [id#id]#[id#id]*/
		pet = 5,			/*宠物 [id#id]#[id#id]*/
		designation = 6,			/*称号 [id#id]#[id#id]*/
		riseId = 7,			/*仙位 [id#id]#[id#id]*/
		tianZhu = 8,			/*天珠 [id#id]#[id#id]*/
	}
	type robot_show = [number, Array<Array<number>>, Array<Array<number>>, Array<Array<number>>, Array<Array<number>>, Array<Array<number>>, Array<Array<number>>, Array<Array<number>>, Array<Array<number>>];

	const enum rechargeFields {
		index = 0,			/*档位*/
		name = 1,			/*档位名称*/
		price = 2,			/*档位价格*/
		describe = 3,			/*档位描述*/
		ico = 4,			/*图标ID*/
		baseId = 5,			/*底图id*/
		reward = 6,			/*奖励 [itemId#count]#[itemId#count]*/
		exReward = 7,			/*额外赠送奖励 [itemId#count]#[itemId#count]*/
		type = 8,			/*充值类型 0：特卖，1：普通*/
		sortId = 9,			/*排序id*/
		visible = 10,			/*档位购买后是否隐藏 0：隐藏，1：不隐藏*/
		descriptive = 11,			/*档位描述2*/
		conditions = 12,			/*购买条件*/
	}
	type recharge = [number, string, number, string, string, string, Array<Items>, Array<Items>, number, number, number, Array<[number, number]>];

	/*首充特殊奖励*/
	const enum FirstPayRewardFields {
		actionId = 0,			/*功能id*/
		unrealId = 1,			/*虚拟道具id*/
		itemId = 2,			/*材料道具id*/
	}
	type FirstPayReward = [number, number, number];

	const enum first_payFields {
		id = 0,				/*id*/
		type = 1,			/*档位*/
		day = 2,			/*天数*/
		money = 3,			/*金额*/
		reward = 4,			/*奖励[itemId#count]#[itemId#count]*/
		showReward = 5,		/*虚拟道具，暂时没用到*/
		showId = 6,			/*展示的外观id*/
		fighting = 7,		/*提示战力*/

		hintTime = 8,		/*检测间隔（毫秒）*/
		showDuration = 9,		/*弹框显示时长(毫秒)*/
		showTime = 10,		/*间隔多少时间弹框(毫秒)*/
		describe = 11,		/*幻化描述*/
		skinFighting = 12,		/*幻化提升战力*/
		sumCost = 13,		/*豪礼总价值(前端显示)*/
		givingYuanBao = 14,		/*额外获取多少代币券*/
		maxLv = 15,		/*提示框弹窗最低等级*/

	}
	type first_pay = [number, number, number, number, Array<Items>, Array<FirstPayReward>, number, number, number, number, number, string, number, number, number, number];

	const enum seven_activityFields {
		id = 0,				/*id*/
		day = 1,			/*天数*/
		taskType = 2,		/*任务类型*/
		describe = 3,		/*任务描述*/
		condition = 4,		/*领取条件*/
		items = 5,			/*奖励道具*/
		taskId = 6,			/*任务跳转id*/
	}
	type seven_activity = [number, number, number, string, number, Array<Items>, number];

	const enum seven_activityItemFields {
		id = 0,				/*id*/
		process = 1,		/*当前进度*/
		total = 2,			/*任务总进度*/
		describe = 3,		/*任务描述*/
		status = 4,			/*领取状态*/
		items = 5,			/*奖励道具*/
		taskId = 6,			/*任务跳转id*/
	}
	type seven_activityItem = [number, number, number, string, number, Array<Items>, number];

	const enum demon_order_giftItemFields {
		day = 0,
		freeItem = 1,
		items = 2,
		icon = 3,
		receives = 4,
		isUnlock = 5,
	}
	type demon_order_giftItem = [number, Array<Items>, Array<Items>, string, Array<number>, boolean];

	const enum hero_awardItemFields {
		id = 0,				/*id*/
		awardIcon = 1,			/*奖励图标*/
		awardNameIcon = 2,			/*奖励名称图标*/
		awardTxt = 3,			/*奖励描述*/
	}
	type hero_awardItem = [number, string, string, string];

	const enum hero_auraFields {
		payId = 0, 			/*充值挡位*/
		openDay = 1, 			/*开启天数*/
		openItems = 2, 			/*道具类型*/
		dayItems = 3,
		sanjie = 4,
		physicalStrength = 5,
		attackPer = 6,
		hpPer = 7,
		disDefensePer = 8,
		hitPer = 9,
		dodgePer = 10,
		critPer = 11,
		toughPer = 12,
		xianFuTime = 13,			/*仙府-家园产药时间上限*/
		treasureGathering = 14,			/*出产时间上限*/
	}
	type hero_aura = [number, number, Array<Items>, Array<Items>, Array<Items>, number, number, number, number, number, number, number, number, number, number];

	const enum demon_orderGiftFields {
		day = 0,
		rewards = 1,
		buyRewards = 2,
		isOpenService = 3,
		eraLevel = 4,
	}
	type demon_orderGift = [number, Array<Items>, Array<Items>];

	const enum day_payFields {
		id = 0,			/*id*/
		level = 1,			/*等级闭区间[minLevel#maxLevel]*/
		money_1 = 2,			/*充值金额*/
		worth_1 = 3,			/*价值*/
		reward_1 = 4,			/*奖励 [itemId#count]#[itemId#count]*/
		money_2 = 5,			/*充值金额*/
		worth_2 = 6,			/*价值*/
		reward_2 = 7,			/*奖励 [itemId#count]#[itemId#count]*/
		money_3 = 8,			/*充值金额*/
		worth_3 = 9,			/*价值*/
		reward_3 = 10,			/*奖励 [itemId#count]#[itemId#count]*/
		day = 11,			/*天数(0表示正常，1-7表示1-7天开服)*/
		enterTips = 12,			/*入口提示语#顔色*/
		oneTips = 13,			/*一档次提示语1#一档次提示语2#顔色*/
		twoTips = 14,			/*二档次提示语1#二档次提示语2#顔色*/
		threeTips = 15,			/*三档次提示语1#三档次提示语2#顔色*/
		oneShowDate = 16,			/*一档次(模型ID图片ID) , 是否模型(0模型1图片), (是否 上下动  0否 1是)*/
		twoShowDate = 17,			/*二档次(模型ID图片ID) , 是否模型(0模型1图片), (是否 上下动  0否 1是)*/
		threeShowDate = 18,			/*三档次(模型ID图片ID) , 是否模型(0模型1图片), (是否 上下动  0否 1是)*/
	}
	type day_pay = [number, Array<number>, number, number, Array<Items>, number, number, Array<Items>, number, number, Array<Items>, number, Array<string>, Array<string>, Array<string>, Array<string>, Array<number>, Array<number>, Array<number>];

	const enum cumulate_payFields {
		id = 0,			/*id*/
		money = 1,			/*累计金额*/
		reward = 2,			/*奖励 [itemId#count]#[itemId#count]*/
	}
	type cumulate_pay = [number, number, Array<Items>];

	const enum cumulate_pay2Fields {
		id = 0,			/*id*/
		money = 1,			/*累计金额*/
		serverDay = 2,			/*开服天数*/
		reward = 3,			/*奖励 [itemId#count]#[itemId#count]*/
	}
	type cumulate_pay2 = [number, number, number, Array<Items>];
	/** daw 新增数据结构 */
	const enum cumulate_pay3Fields {
		id = 0,			/*id*/
		money = 1,			/*累计金额*/
		serverDay = 2,			/*开服天数*/
		reward = 3,			/*奖励 [itemId#count]#[itemId#count]*/
	}
	type cumulate_pay3 = [number, number, number, Array<Items>];

	const enum continue_payFields {
		grade = 0,			/*档次(0-2)*/
		day = 1,			/*第几天(0-5)*/
		money = 2,			/*累计金额*/
		reward = 3,			/*奖励 [itemId#count]#[itemId#count]*/
	}
	type continue_pay = [number, number, number, Array<Items>];

	const enum celebration_continue_payFields {
		grade = 0,		/*档次(0-5)*/
		id = 1,			/*id*/
		money = 2,		/*金额*/
		serverDay = 3,	/*连续天数*/
		count = 4,		/*次数*/
		reward = 5,		/*奖励 [itemId#count]#[itemId#count]*/
	}
	type celebration_continue_pay = [number, number, number, number, number, Array<Items>];

	const enum zero_buyFields {
		grade = 0,			/*档次(0开始,不能删除,可以添加)*/
		xianyu = 1,			/*仙玉*/
		reward = 2,			/*奖励 [itemId#count]#[itemId#count]*/
		restDay = 3,			/*返还天数(1代表1天)*/
		extraReward = 4,			/*返还奖励 [itemId#count]#[itemId#count]*/
		model = 5,			/*模式(0正常显示,1显示倍数,2显示万单位)*/
	}
	type zero_buy = [number, number, Array<Items>, number, Array<Items>, number];

	const enum one_buyFields {
		id = 0,			/*礼包id*/
		grade = 1,			/*充值档位(11-20)*/
		reward = 2,			/*奖励 [itemId#count]#[itemId#count]*/
		level = 3,			/*等级闭区间[minLevel#maxLevel]*/
		originalPrice = 4,			/*原价*/
		isModel = 5,			/*是否模型(0模型1特效2图片)*/
		isMove = 6,			/*是否上下缓动*/
		isTeXiao = 7,			/*是否有特效 0 没有 1有*/
	}
	type one_buy = [number, number, Array<Items>, Array<number>, number, number, number, number];

	const enum consume_rewardFields {
		id = 0,			/*id*/
		gold = 1,			/*累计消耗代币券数*/
		reward = 2,			/*奖励 [itemId#count]#[itemId#count]*/
	}
	type consume_reward = [number, number, Array<Items>];

	const enum consume_reward2Fields {
		id = 0,			/*id*/
		gold = 1,			/*累计消耗代币券*/
		serverDay = 2,			/*开服天数*/
		reward = 3,			/*奖励 [itemId#count]#[itemId#count]*/
	}
	type consume_reward2 = [number, number, number, Array<Items>];

	const enum invest_rewardFields {
		taskId = 0,			/*任务id*/
		type = 1,			/*投资类型(0登录 1天关 2等级)*/
		condition = 2,			/*条件*/
		goldPrice = 3,			/*代币券价格*/
		reward = 4,			/*奖励 [itemId#count]#[itemId#count]*/
		restReward = 5,			/*返利金额*/
		timesReward = 6,			/*几倍返利*/
	}
	type invest_reward = [number, number, number, number, Array<Items>, number, number];

	const enum sprint_rank_taskFields {
		id = 0,			/*id (同一类任务id从小到大)*/
		nextId = 1,			/*下一个id 0表示没有下一个了*/
		type = 2,			/*类型*/
		serverDay = 3,			/*开服第几天(当天开服配1)*/
		endTm = 4,			/*持续时间(86400000表示一整天)*/
		name = 5,			/*名字*/
		condition = 6,			/*条件 param1#param2*/
		reward = 7,			/*奖励 [itemId#count]#[itemId#count]*/
		isHead = 8,			/*是否首个任务 0否 1是*/
	}
	type sprint_rank_task = [number, number, number, number, number, string, Array<number>, Array<Items>, number];

	const enum sprint_rankFields {
		type = 0,			/*类型*/
		serverDay = 1,			/*开服第几天(当天开服配1)*/
		endTm = 2,			/*持续时间(86400000表示一整天)*/
		grade = 3,			/*档次(0开始)*/
		condition = 4,			/*条件*/
		reward = 5,			/*奖励 [itemId#count]#[itemId#count]*/
		showId = 6,			/*模型ID图片ID*/
		isModel = 7,			/*是否模型(0模型1特效2图片)*/
		imageId = 8,			/*入口 模型ID图片ID*/
		skipId = 9,			/*跳转页面ID*/
		isModelRuKou = 10,			/*入口是否模型(0模型1特效2图片)*/
		isMove = 11,			/*界面里的奖励是否 上下动  0否 1是*/
		getWayId = 12,			/*途径ID*/
		isMoveRuKou = 13,			/*入口模型/图片是否上下移动*/
		gradeScope = 14,			/*档次名次范围*/
		tipsStr = 15,			/*获取奖励文字提示HTML格式*/
	}
	type sprint_rank = [number, number, number, number, number, Array<Items>, number, number, number, number, number, number, Array<number>, number, Array<number>, string];

	const enum feisheng_rank_taskFields {
		id = 0,			/*id (同一类任务id从小到大)*/
		nextId = 1,			/*下一个id 0表示没有下一个了*/
		type = 2,			/*类型*/
		name = 3,			/*名字*/
		condition = 4,			/*条件 param1#param2*/
		reward = 5,			/*奖励 [itemId#count]#[itemId#count]*/
		isHead = 6,			/*是否首个任务 0否 1是*/
	}
	type feisheng_rank_task = [number, number, number, string, Array<number>, Array<Items>, number];

	const enum feisheng_rankFields {
		type = 0,			/*类型(1开始)*/
		nextType = 1,			/*下一个类型*/
		isHead = 2,			/*是否第一个类型(0否 1是)*/
		endTm = 3,			/*持续时间(86400000表示一整天)*/
		grade = 4,			/*档次(0开始)*/
		condition = 5,			/*条件*/
		reward = 6,			/*奖励 [itemId#count]#[itemId#count]*/
		showId = 7,			/*模型ID图片ID*/
		isModel = 8,			/*是否模型(0模型1特效2图片)*/
		imageId = 9,			/*入口 模型ID图片ID*/
		skipId = 10,			/*跳转页面ID*/
		isModelRuKou = 11,			/*入口是否模型(0模型1特效2图片)*/
		isMove = 12,			/*界面里的奖励是否 上下动  0否 1是*/
		getWayId = 13,			/*途径ID*/
		gradeScope = 14,			/*档次名次范围*/
		ItemId = 15,			/*当前活动类型消耗道具的 道具ID*/
		nextName = 16,			/*明日活动名称*/
		isMoveRuKou = 17,			/*入口模型/图片是否上下移动*/
		tipsStr = 18,			/*获取奖励文字提示HTML格式*/
	}
	type feisheng_rank = [number, number, number, number, number, number, Array<Items>, number, number, number, number, number, number, Array<number>, Array<number>, number, string, number, string];

	/*充值转盘权值*/
	const enum PayRewardWeightNodeFields {
		index = 0,			/*编号(1-12)*/
		itemId = 1,			/*itemId*/
		count = 2,			/*数量*/
		weight = 3,			/*权值*/
	}
	type PayRewardWeightNode = [number, number, number, number];

	const enum pay_reward_weightFields {
		money = 0,			/*金额（多少金额获得一次抽奖)*/
		weight = 1,			/*奖励 [编号#itemId#数量#权值]#[编号#itemId#数量#权值]*/
	}
	type pay_reward_weight = [number, Array<PayRewardWeightNode>];

	const enum pay_reward_rewardFields {
		grade = 0,			/*档次（数字从小到大)*/
		condition = 1,			/*条件*/
		reward = 2,			/*奖励 [itemId#count]#[itemId#count]*/
	}
	type pay_reward_reward = [number, number, Array<Items>];

	const enum duobao_weightFields {
		id = 0,			/*id*/
		type = 1,			/*类型(类型#参数 类型:0开服天数(1-7) 1飞升榜(1-5))*/
		onceGold = 2,			/*抽奖一次代币券数*/
		moreGold = 3,			/*抽奖十次代币券数*/
		endTm = 4,			/*持续时间(86400000表示一整天)*/
		weight = 5,			/*奖励 [编号#itemId#数量#权值]#[编号#itemId#数量#权值]*/
	}
	type duobao_weight = [number, Array<number>, number, number, number, Array<PayRewardWeightNode>];

	const enum duobao_rewardFields {
		id = 0,			/*id*/
		type = 1,			/*类型(类型#参数 类型:0开服天数(1-7) 1飞升榜(1-5))*/
		grade = 2,			/*档次*/
		condition = 3,			/*条件*/
		reward = 4,			/*奖励 [itemId#count]#[itemId#count]*/
	}
	type duobao_reward = [number, Array<number>, number, number, Array<Items>];

	const enum duobao_rankFields {
		rankType = 0,			/*排行类型(0个人 1区服)*/
		type = 1,			/*类型(1开始)*/
		grade = 2,			/*档次(0开始)*/
		condition = 3,			/*条件*/
		conditionChar = 4,			/*玩家领取奖励条件(个人排行配0)*/
		endTm = 5,			/*持续时间(86400000表示一整天)*/
		reward = 6,			/*奖励 [itemId#count]#[itemId#count]*/
		gradeScope = 7,			/*档次名次范围*/
	}
	type duobao_rank = [number, number, number, number, number, number, Array<Items>, Array<number>];

	/*权值信息*/
	const enum JzduobaoNodeFields {
		itemId = 0,
		count = 1,
		weight = 2,
		itemGrade = 3,
		index = 4,
	}
	type JzduobaoNode = [number, number, number, number, number];

	const enum jzduobao_weightFields {
		grade = 0,			/*奖励档次(前闭后闭) min#max*/
		weights = 1,			/*权值信息 [itemId#数量#权值#道具档次#索引]#[itemId#数量#权值#道具档次#索引]*/
		showItem = 2,			/*展示道具 itemId#itemId*/
	}
	type jzduobao_weight = [Array<number>, Array<JzduobaoNode>, Array<number>];

	const enum jzduobao_rewardFields {
		id = 0,			/*id*/
		grade = 1,			/*档次*/
		condition = 2,			/*条件*/
		reward = 3,			/*奖励 [itemId#count]#[itemId#count]*/
	}
	type jzduobao_reward = [number, number, number, Array<Items>];

	const enum jzduobao_rankFields {
		rankType = 0,			/*排行类型(0个人 1区服)*/
		grade = 1,			/*档次(0开始)*/
		condition = 2,			/*条件*/
		conditionChar = 3,			/*玩家领取奖励条件(个人排行配0)*/
		reward = 4,			/*奖励 [itemId#count]#[itemId#count]*/
		gradeScope = 5,			/*档次名次范围*/
	}
	type jzduobao_rank = [number, number, number, number, Array<Items>, Array<number>];

	const enum GushenTaskNodeFields {
		taskType = 0,			/*任务类型*/
		param = 1,			/*任务参数*/
	}
	type GushenTaskNode = [number, Array<number>];

	const enum gushen_taskFields {
		taskId = 0,			/*任务ID*/
		type = 1,			/*古神类型*/
		name = 2,			/*任务名*/
		nodes = 3,			/*任务节点 #类型#[参数,参数]*/
		condition = 4,			/*达成条件*/
		reward = 5,			/*奖励 [itemId#count]#[itemId#count]*/
		skipActionId = 6,			/*跳转功能Id*/
		describe = 7,			/*任务描述*/
		taskCondition = 8,			/*前端显示达成条件*/
	}
	type gushen_task = [number, number, string, GushenTaskNode, number, Array<Items>, number, string, number];

	const enum gushenFields {
		type = 0,			/*古神类型*/
		condition = 1,			/*条件(#类型#参数 类型(0无 1等级 2前置秘术(id前四位)))*/
		reward = 2,			/*奖励 [itemId#count]#[itemId#count]*/
		name = 3,			/*秘术效果*/
		secretId = 4,			/*秘术ID*/
		secretName = 5,			/*激活前置秘术提示语*/
	}
	type gushen = [number, Array<number>, Array<Items>, string, number, string];

	const enum kuanghuanFields {
		taskId = 0,			/*任务ID*/
		type = 1,			/*狂欢类型(1-9)*/
		name = 2,			/*任务名*/
		condition = 3,			/*达成条件*/
		reward = 4,			/*奖励 [itemId#count]#[itemId#count]*/
		serverDay = 5,			/*开服第几天(0表示每天)*/
		skipActionId = 6,			/*跳转功能Id*/
		describe = 7,			/*任务描述*/
	}
	type kuanghuan = [number, number, string, number, Array<Items>, number, number, string];

	const enum discount_giftFields {
		id = 0,			/*唯一ID(不可修改)*/
		type = 1,			/*活动类型(1-7)*/
		name = 2,			/*活动礼包名*/
		serverDay = 3,			/*开服第几天(0表示每天)*/
		endTm = 4,			/*持续时间(86400000表示一整天)*/
		section = 5,			/*数量闭区间(#min#max)*/
		items = 6,			/*道具 [itemId#count]#[itemId#count]*/
		originalPrice = 7,			/*原价*/
		realPrice = 8,			/*实价*/
		onsale = 9,			/*折扣*/
	}
	type discount_gift = [number, number, string, number, number, Array<number>, Array<Items>, number, number, number];

	const enum everyday_rebateFields {
		id = 0,			/*id*/
		day = 1,			/*第几天(1开始)*/
		reward = 2,			/*奖励 [itemId#count]#[itemId#count]*/
		rewardOne = 3,			/*第一行展示奖励 [itemId#count]#[itemId#count]*/
		rewardTwo = 4,			/*第二行展示奖励 [itemId#count]#[itemId#count]*/
	}
	type everyday_rebate = [number, number, Array<Items>, Array<Items>, Array<Items>];

	const enum login_rewardFields {
		id = 0,			/*id*/
		vip = 1,			/*vip等级*/
		nextDayTips = 2,			/*明日提示(1是 0否)*/
		type = 3,			/*类型(类型#参数 类型:0开服天数(1-7) 1飞升榜(1-5))*/
		reward = 4,			/*奖励 [itemId#count]#[itemId#count]*/
	}
	type login_reward = [number, number, number, Array<number>, Array<Items>];

	const enum cumulate_pay_fsFields {
		id = 0,			/*id*/
		money = 1,			/*累计金额*/
		type = 2,			/*飞升榜类型*/
		reward = 3,			/*奖励 [itemId#count]#[itemId#count]*/
	}
	type cumulate_pay_fs = [number, number, number, Array<Items>];

	const enum pay_single_fsFields {
		id = 0,			/*id*/
		money = 1,			/*金额*/
		grade = 2,			/*充值档位*/
		type = 3,			/*飞升榜类型*/
		count = 4,			/*次数*/
		reward = 5,			/*奖励 [itemId#count]#[itemId#count]*/
	}
	type pay_single_fs = [number, number, number, number, number, Array<Items>];

	const enum ceremony_danbiFields {
		id = 0,			/*id*/
		money = 1,			/*金额*/
		grade = 2,			/*充值档位*/
		count = 3,			/*次数*/
		reward = 4,			/*奖励 [itemId#count]#[itemId#count]*/
	}
	type ceremony_danbi = [number, number, number, number, Array<Items>];

	const enum consume_reward_fsFields {
		id = 0,			/*id*/
		itemId = 1,			/*消耗道具Id*/
		count = 2,			/*消耗数量*/
		type = 3,			/*飞升榜类型*/
		reward = 4,			/*奖励 [itemId#count]#[itemId#count]*/
	}
	type consume_reward_fs = [number, number, number, number, Array<Items>];

	const enum rush_buy_fsFields {
		id = 0,			/*id*/
		price = 1,			/*代币券价格*/
		totalCount = 2,			/*总数量*/
		count = 3,			/*个人购买数量*/
		type = 4,			/*飞升榜类型*/
		reward = 5,			/*道具 [itemId#count]#[itemId#count]*/
		name = 6,			/*活动名*/
		discount = 7,			/*折扣*/
		originalPrice = 8,			/*原价*/
	}
	type rush_buy_fs = [number, number, number, number, number, Array<Items>, string, number, number];

	const enum discount_gift_fsFields {
		id = 0,			/*id*/
		price = 1,			/*代币券价格*/
		count = 2,			/*个人购买数量*/
		type = 3,			/*飞升榜类型*/
		vip = 4,			/*vip等级(#天数#vip等级#天数#vip等级)*/
		reward = 5,			/*道具 [itemId#count]#[itemId#count]*/
		discount = 6,			/*折扣*/
		originalPrice = 7,			/*原价*/
		limitId = 8,			/*限制图片ID（如果不是vip等级限制的  这里配置）*/
		discountBgId = 9,			/*折扣底图ID*/
	}
	type discount_gift_fs = [number, number, number, number, Array<number>, Array<Items>, number, number, number, number];

	const enum team_match_levelFields {
		level = 0,			/*等级*/
		range = 1,			/*[level#level]#[level#level]*/
		time = 2,			/*X秒拓展一次*/
		seg = 3,			/*天梯段位*/
		segRange = 4,			/*[seg#seg]#[seg#seg]*/
		segTime = 5,			/*X秒拓展一次*/
	}
	type team_match_level = [number, Array<Array<number>>, number, number, Array<Array<number>>, number];

	const enum item_runeFields {
		itemId = 0,			/*玉荣ID*/
		name = 1,			/*玉荣名*/
		overlap = 2,			/*叠加数量*/
		inlayNumber = 3,			/*可镶嵌序号 1#8 闭区间*/
		ico = 4,			/*图标ID*/
		layer = 5,			/*解锁层数*/
		isChat = 6,			/*是否可以在聊天中发送  0：不可，1：可以*/
		itemSourceId = 7,			/*道具来源ID id#id#id#id*/
		customClipId = 8,			/*道具展示特效ID*/
		layerNum = 9,			/*特效展示层级 0 道具图标和道具底图之间 1 图标的最上层*/
		xingJiNum = 10,			/*星级id 1开始 不配没有星级*/
	}
	type item_rune = [number, string, number, Array<number>, string, number, number, Array<number>, number, number, number];

	const enum runeRefineFields {
		id = 0,			/*id*/
		refineItem = 1,			/*升级需要道具  道具id#数量*/
		resolveItems = 2,			/*分解后得到的物品[id#count]#[id#count]*/
		fighting = 3,			/*战力*/
		attrs = 4,			/*属性 [id#value]#[id#value]*/
	}
	type runeRefine = [number, Items, Array<idCount>, number, Array<attr>];

	const enum scene_copy_runeFields {
		mapId = 0,			/*地图ID*/
		level = 1,			/*层数*/
		occ = 2,			/*怪物ID*/
		readyTime = 3,			/*场景开启后准备XX时间刷怪*/
		monsterCount = 4,			/*当前刷新怪物的个数*/
		waitDeadTime = 5,			/*等待XX时间移除尸体*/
		tipsAward = 6,			/*奖励展示 [itemId#count]#[itemId#count]*/
		bigAward = 7,			/*当前层数大奖 [itemId#count]#[itemId#count]*/
		everyDayAward = 8,			/*每日奖励  对应层数没配置，取上面一个奖励 [itemId#count]#[itemId#count]*/
		slotId = 9,			/*当前层数开启玉荣槽ID 前端表现*/
		childId = 10,			/*当前层数开启子类玉荣ID 前端表现*/
		recommendFighting = 11,			/*推荐战力 前端表现*/
	}
	type scene_copy_rune = [number, number, number, number, number, number, Array<Items>, Array<Items>, Array<Items>, number, number, number];

	const enum rune_dialFields {
		round = 0,			/*轮数  如果有的轮数不配，则取上一条*/
		items = 1,			/*奖励列表 ID#数量#权重  权重不要配小数点*/
	}
	type rune_dial = [number, Array<weightItem>];

	const enum rune_composeFields {
		id = 0,					/*玉荣ID*/
		mClass = 1,				/*大类*/
		sClass = 2,				/*小类*/
		needRunes = 3,			/*合成需要的玉荣 [模糊ID#数量]#[模糊ID#数量]*/
		needItems = 4,			/*合成需要的道具 道具ID#数量*/
	}
	type rune_compose = [number, [number, string], [number, string], Array<Pair>, Pair];

	const enum rune_collect_gradeFields {
		id = 0,					/**玉荣ID */
		level = 1,				/**等级 */
		refineItem = 2,			/**升级需要道具 模糊ID#count */
		resolveItems = 3,		/**拆解后得到的物品[id#count]#[id#count] */
		fighting = 4,			/**战力 */
		attrs = 5,				/**属性 [id#value]#[id#value] */
	}
	type rune_collect_grade = [number, number, Pair, Array<Pair>, number, Array<Pair>];

	const enum rune_collect_riseFields {
		level = 0,				/**等级 */
		describe = 1,			/**描述 */
		attrUp = 2,				/**属性加成 百分比 */
		fighting = 3,			/**提升的战力*/
	}
	type rune_collect_rise = [number, string, number, number];

	const enum xiangyaoFields {
		type = 0,			/*降妖类型 1:boss 0:小怪*/
		eraLevel = 1,			/*觉醒等级(0-7转)*/
		grade = 2,			/*档次*/
		param = 3,			/*杀怪数量*/
		reward = 4,			/*奖励 [物品Id#物品数量]#[物品Id#物品数量]*/
	}
	type xiangyao = [number, number, number, number, Array<Items>];

	const enum RankAwardFields {
		rank = 0,
		awards = 1,			/*当前关数排名奖励 [itemId#count]#[itemId#count]*/
	}
	type RankAward = [number, Array<Items>];

	const enum RankBoxFields {
		rank = 0,
		boxId = 1,
	}
	type RankBox = [number, number];

	const enum scene_copy_nineFields {
		mapId = 0,			/*地图ID*/
		level = 1,			/*层数*/
		occ = 2,			/*怪物ID#ID*/
		totalScore = 3,			/*进入下层总积分*/
		rankAward = 4,			/*[rank#[[id#count]#[id#count]]]#[rank#[[id#count]#[id#count]]]*/
		tipsAwards = 5,			/*[rank#[[id#count]#[id#count]]]#[rank#[[id#count]#[id#count]]]*/
		rankBox = 6,			/*宝箱NPC [[rank#id]#[rank#id]]*/
		gatherTime = 7,			/*采集时间 ms*/
		pos = 8,			/*宝箱坐标 [1#1]#[1#1]#[1#1]*/
	}
	type scene_copy_nine = [number, number, Array<number>, number, Array<RankAward>, Array<RankAward>, Array<RankBox>, number, Array<Pos>];

	const enum scene_copy_teamBattleFields {
		mapId = 0,				/*地图ID*/
		id = 1,					/*怪物id*/
		index = 2,				/*序号*/
		name = 3,				/*怪物名字*/
		score = 4,				/*获取积分*/
		gatherTime = 5,			/*采集时间 ms*/

	}
	type scene_copy_teamBattle = [number, number, number, string, number, number];

	const enum di_shu_cfgFields {
		Level = 0,   // 层数
		ItemList = 1,    // 每层奖励列表 [道具ID = #道具数量]
		Row = 2, // 行奖励 [道具ID = #道具数量]
		Ultimate = 3,    // 终极奖励 [道具ID = #道具数量]
		OpenCount = 4,   // 使用次数
		k1 = 5,
		RankingStart = 6,    // 排行奖励开始id = 
		RankingEnd = 7,  // 排行奖励结束id = 
		TaskCondition = 8,   // 上榜条件
		RankingAwds = 9, // 排行奖励
		k2 = 10,
		TaskType = 11,    // 任务类型 1,:个人 2,：全服
		Condition = 12,   // 领取条件
		TaskAwd = 13, // 每层奖励列表 [道具ID = #道具数量]
		k3 = 14,
		OpenTime = 15,    // 开始时间
		EndTime = 16, // 操作结束时间
		ShowEndTime = 17, // 展示结束时间
	}
	type di_shu_cfg = [
		string, Array<Items>, Array<Items>, Array<Items>, Array<Items>,
		null,
		number, number, number, Array<Items>,
		null,
		number, number, Array<Items>,
		null,
		Date, Date, Date
	];

	const enum di_shu_main_cfgFields {
		Level = 0,   // 层数
		ItemList = 1,    // 每层奖励列表 [道具ID = #道具数量]
		Row = 2, // 行奖励 [道具ID = #道具数量]
		Ultimate = 3,    // 终极奖励 [道具ID = #道具数量]
		OpenCount = 4,   // 使用次数
	}
	type di_shu_main_cfg = [Array<number>, Array<Items>, Array<Items>, Array<Items>, Array<Items>]

	const enum di_shu_rank_cfgFields {
		index = 0,  // 名次 = 
		TaskCondition = 1,   // 上榜条件
		RankingAwds = 2, // 排行奖励
	}
	type di_shu_rank_cfg = [number, number, Array<Items>]

	const enum di_shu_task_cfgFields {
		TaskType = 0,    // 任务类型 1,:个人 2,：全服
		Condition = 1,   // 领取条件
		TaskAwd = 2, // 每层奖励列表 [道具ID = #道具数量]
	}
	type di_shu_task_cfg = [number, number, Array<Items>]

	const enum chatExpressionFields {
		id = 0,			/*表情id*/
		type = 1,			/*表情类型  0：普通  1：高级*/
		name = 2,			/*表情名称*/
		iconId = 3,			/*图标Id*/
	}
	type chatExpression = [number, number, string, string];

	const enum XianfuNodeFields {
		type = 0,			/*类型*/
		value = 1,			/*值*/
		skipId = 2,			/*跳转id*/
	}
	type XianfuNode = [number, number, number];

	const enum xianfuFields {
		level = 0,			/*仙府-家园等级*/
		describe = 1,			/*解锁描述*/
		iconId = 2,			/*图标*/
		nodes = 3,			/*升级条件 [类型#数量#跳转id]#[类型#数量#跳转id] 0消耗药草值 1消耗财富值 2仙府-家园任务次数 3风水值 4积累药草值 5积累财富值*/
		buildId = 4,			/*解锁的建筑ID*/
		buildLevel = 5,			/*解锁的建筑等级*/
		buildShowId = 6,			/*建筑展示id*/
		buildType = 7,			/*建筑类型：0：手动产出，1：自动产出*/
		produce = 8,			/*自动产出[产出id#产出数量]  手动产出[炼制产物ID#炼制产物数量#消耗道具id#消耗道具数量#概率#失败产物ID#失败产物数量]*/
		animalId = 9,			/*激活的灵兽id 从1开始配，因为不填默认就是0*/
		animalShowId = 10,			/*灵兽npcId*/
		speak = 11,			/*灵兽行程语  语句1#语句2*/
	}
	type xianfu = [number, Array<string>, string, Array<XianfuNode>, number, number, number, number, Array<Array<number>>, number, number, Array<string>];

	const enum xianfu_travelFields {
		rangeId = 0,			/*范围id*/
		rangeName = 1,			/*范围名称*/
		animalLevel = 2,			/*所需灵兽等级*/
		extraItems = 3,			/*使用罗盘指定获得道具 罗盘id#购买道具id#购买道具数量#获得道具id#获得道具数量*/
		consume = 4,			/*游历所需消费的 道具id#数量*/
		time = 5,			/*游历时间 单位：毫秒*/
		exp = 6,			/*游历所获得经验*/
		amuletId = 7,			/*护身符id#购买道具id#购买道具数量  如果不需要可不填*/
		endPack = 8,			/*终点礼包 [道具id#道具数量#权值]*/
		passByPack = 9,			/*沿途礼包 [道具id#道具数量#权值]*/
		awardDescribe = 10,			/*游历奖励描述*/
		startStr = 11,			/*游历开始语句*/
		endStr = 12,			/*游历结束语句*/
		hintWords = 13,			/*购买道具提示语(罗盘 护身符)*/
	}
	type xianfu_travel = [number, string, number, Array<number>, Items, number, number, weightItem, Array<weightItem>, Array<weightItem>, Array<string>, string, string, Array<string>];

	const enum xianfu_illustrated_handbookFields {
		id = 0,			/*图鉴id*/
		ico = 1,			/*图标ID*/
		name = 2,			/*名字*/
		des = 3,			/*描述*/
		level = 4,			/*等级*/
		quality = 5,			/*品质 1-4*/
		items = 6,			/*升级或激活所需道具 itemId#count*/
		fighting = 7,			/*战力*/
		attrs = 8,			/*属性 [id#value]#[id#value]*/
	}
	type xianfu_illustrated_handbook = [number, string, string, string, number, number, Items, number, Array<attr>];

	const enum xianfu_animalFields {
		id = 0,			/*灵兽id*/
		level = 1,			/*等级*/
		exp = 2,			/*升级所需经验*/
		fighting = 3,			/*战力*/
		attrs = 4,			/*属性 [id#value]#[id#value]*/
	}
	type xianfu_animal = [number, number, number, number, Array<attr>];

	const enum xianfu_mallFields {
		fengshuiLevel = 0,			/*风水等级*/
		count = 1,			/*每个库抽取数量1#2#3*/
		itemLib = 2,			/*道具库，库的数量与上面抽取数量对应 [[商品唯一id#权值]#[商品唯一id#权值]]#[[商品唯一id#权值]#[商品唯一id#权值]]*/
	}
	type xianfu_mall = [number, Array<number>, Array<Array<Pair>>];

	const enum scene_homesteadFields {
		mapId = 0,			/*地图id*/
		level = 1,			/*风水等级*/
		wheel = 2,			/*第几轮*/
		waitDeadTime = 3,			/*尸体移除时间  单位：毫秒*/
		monster = 4,			/*配几个就几波 [布怪区域id#怪物id#怪物数量#出怪时间#区域id 单位：毫秒]*/
		bossOcc = 5,			/*boss只有一轮，[布怪区域id#boss#区域id]#[布怪区域id#boss#区域id]*/
		collect = 6,			/*区域id#采集物npc#采集物数量#采集物获得的道具id#采集物获得的道具数量#采集时间#区域id 单位：毫秒*/
		treasure = 7,			/*区域id#宝箱npc#宝箱数量#宝箱获得的道具id#宝箱获得的道具数量#采集时间#区域id 单位：毫秒*/
	}
	type scene_homestead = [number, number, number, number, Array<Array<number>>, Array<Array<number>>, Array<number>, Array<number>];

	const enum xianfu_monster_attrFields {
		level = 0,			/*人物等级*/
		type = 1,			/*属性使用类型 0小怪，1BOSS*/
		skill = 2,			/*技能列表*/
	}
	type xianfu_monster_attr = [number, number, Array<number>];

	const enum xianfu_taskFields {
		id = 0,			/*任务id*/
		type = 1,			/*任务类型  0使用建筑自动产出或炼制次数，1游历  2事件购买或击杀次数*/
		name = 2,			/*任务名*/
		value = 3,			/*任务参数  建筑产出或炼制：建筑id#次数  游历：次数，事件购买或击杀：事件id#数量*/
		award = 4,			/*[道具id#数量]#[道具id#数量]*/
		level = 5,			/*仙府-家园等级*/
	}
	type xianfu_task = [number, number, string, Pair, Array<Items>, number];

	const enum xianfu_fengshuiFields {
		level = 0,			/*风水等级  默认1级*/
		exp = 1,			/*下一级所需的经验值 即风水值*/
		name = 2,			/*等级名称*/
		attrPer = 3,			/*属性加成百分比（1.1=110%）*/
		nameRes = 4,			/*名字资源名称*/
		lvRes = 5,			/*等级资源名称*/
	}
	type xianfu_fengshui = [number, number, string, number, string, string];

	const enum xianfu_decorateFields {
		id = 0,			/*物件id*/
		items = 1,			/*升级所需要道具id#数量*/
		type = 2,			/*风水效果类型 0对指定建筑产出加成 1对所有建筑制作减少消耗% 2对所有建筑制作增加成功率% 3对所有建筑增加每日制作上限 4游历消费减少% 5游历经验增加% 6游历次数增加*/
		param = 3,			/*参数 对于类型0要配多个参数 建筑id#加成类型#加成参数值#额外值(暴击倍数) 加成类型：1固定点 2百分点 3暴击概率*/
		fengshuiValue = 4,			/*风水值*/
		fight = 5,			/*战力值*/
		nameRes = 6,			/*名字资源名称*/
		iconRes = 7,			/*图标资源名称*/
		attrs = 8,			/*属性 [id#value]#[id#value]*/
	}
	type xianfu_decorate = [number, Items, number, Array<number>, number, number, string, string, Array<attr>];

	const enum xianfu_skillFields {
		level = 0,			/*仙府-家园等级*/
		skill = 1,			/*技能id*/
		fight = 2,			/*战力*/
	}
	type xianfu_skill = [number, number, number];

	const enum xianfu_buildFields {
		id = 0,			/*建筑id*/
		level = 1,			/*建筑等级*/
		exp = 2,			/*升下一级所需经验*/
		buildShowId = 3,			/*建筑展示id*/
		attr = 4,			/*[属性类型#值]#[属性类型#值]...*/
		produce = 5,			/*[解锁炼制丹药id#炼制所得到经验#消耗道具id#消耗道具数量#概率#失败产物ID#失败产物数量#炼制所需时间]*/
		fight = 6,			/*战力*/
		name = 7,			/*炼金等级名称*/
	}
	type xianfu_build = [number, number, number, number, Array<attr>, Array<Array<number>>, number, string];

	const enum tiantiFields {
		id = 0,			/*段位*/
		name = 1,			/*段名*/
		totalScore = 2,			/*当前段位总积分*/
		SItemAwards = 3,			/*胜利奖励 [id#count]#[id#count]*/
		offlineSItemAwards = 4,			/*掉线胜利奖励 [id#count]#[id#count]*/
		FItemAwards = 5,			/*失败奖励 [id#count]#[id#count]*/
		offlineFItemAwards = 6,			/*掉线失败奖励 [id#count]#[id#count]*/
		honorAwards = 7,			/*每日荣誉奖励 [id#count]#[id#count]*/
		promoteAwards = 8,			/*晋升奖励 [id#count]#[id#count]*/
	}
	type tianti = [number, string, number, Array<Items>, Array<Items>, Array<Items>, Array<Items>, Array<Items>, Array<Items>];

	const enum tianti_awardsFields {
		feat = 0,			/*功勋*/
		featAwards = 1,			/*功勋奖励 [id#count]#[id#count]*/
		rankRange = 2,			/*排名范围 X#X*/
		rankAwards = 3,			/*排名奖励 [id#count]#[id#count]*/
		joinTimes = 4,
		joinAwards = 5,			/*参与奖励 [id#count]#[id#count]*/
		winTimes = 6,			/*连胜次数*/
		scoreItems = 7,			/*连胜积分道具 id#count*/
		offlineScoreItems = 8,			/*连胜积分道具 id#count*/
	}
	type tianti_awards = [number, Array<Items>, Pair, Array<Items>, number, Array<Items>, number, Items, Items];

	const enum JumpSegItemScoreFields {
		seg = 0,			/*阶数*/
		scoreItems = 1,			/*积分*/
	}
	type JumpSegItemScore = [number, Items];

	const enum scene_copy_tiantiFields {
		mapId = 0,			/*地图ID*/
		readyTime = 1,			/*场景开启后并且双方登录后准备XX时间开始战斗*/
		pos = 2,			/*AI寻路终点*/
		jumpSegItemScore = 3,			/*天梯跨阶胜利积分 [seg#[Item#Count]]#[seg#[Item#Count]]*/
		offlineJumpSegItemScore = 4,			/*掉线天梯跨阶胜利积分 [seg#[Item#Count]]#[seg#[Item#Count]]*/
	}
	type scene_copy_tianti = [number, number, Pos, Array<JumpSegItemScore>, Array<JumpSegItemScore>];

	const enum activity_allFields {
		nameID = 0,			/*活动名称图片ID*/
		bgID = 1,			/*活动背景图片ID*/
		instructionsStr = 2,			/*活动说明（列： 活动时间:#00:00-23:50   两部分组成 #号隔开）*/
		instructionsOtherStr = 3,			/*额外活动说明(没有就不填)*/
		isHaveDouble = 4,			/*是否有双倍活动 0有 1没有*/
		reward = 5,			/*奖励 [itemId#count]#[itemId#count]*/
		type = 6,			/*活动类型，1为场景活动，2为功能开启*/
		params = 7,			/*活动参数，场景活动填场景类型(SceneTypeEx)，功能开启填功能ID(ActionOpenId)*/
		gotoType = 8,			/*跳转类型，1打开面板，2进入场景*/
		gotoParams = 9,			/*跳转参数，gotoType为1传功能ID(ActionOpenId)，gotoType为2传场景ID(SCENE_ID)*/
		instructionsID = 10,			/*活动说明ID(blend表的ID)*/
		actionOpenId = 11,			/*用来获取开启条件说明(ActionOpenId)*/
		activityName = 12,			/*活动名称*/
		sortID = 13,			/*排序ID（相同状态下，排序ID小的排在上面）*/
	}
	type activity_all = [number, number, string, string, number, Array<Items>, number, number, number, number, number, number, string, number];

	const enum scene_richesFields {
		level = 0,			/*人物等级*/
		xianlingreward = 1,			/*仙灵奖励 [itemId#count]#[itemId#count]*/
		xianfareward = 2,			/*仙法奖励 [itemId#count]#[itemId#count]*/
	}
	type scene_riches = [number, Array<Items>, Array<Items>];

	const enum adventureFields {
		id = 0,			/*大类id 0好赌  1仙女  2PK  3BOSS  4洞府  5袋子*/
		condition = 1,			/*条件*/
		chidle = 2,			/*[子类id#权重]#[子类id#权重]#[子类id#权重]*/
	}
	type adventure = [number, number, Array<Pair>];

	const enum adventure_childFields {
		id = 0,			/*子类id*/
		award = 1,			/*[道具id#数量#权值]#[道具id#数量#权值]*/
		tipsAward = 2,			/*奖励展示 [itemId#count]#[itemId#count]*/
		icon = 3,			/*事件名字图标*/
		des = 4,			/*事件描述*/
		baseId = 5,			/*底图id*/
	}
	type adventure_child = [number, Array<weightItem>, Array<Items>, string, string, string];

	const enum adventure_taskFields {
		taskId = 0,			/*任务id*/
		name = 1,			/*任务名*/
		nodes = 2,			/*任务节点*/
		skipActionId = 3,			/*跳转功能Id*/
		describe = 4,			/*任务描述*/
	}
	type adventure_task = [number, string, Array<TaskNode>, number, string];

	const enum scene_copy_cloudlandFields {
		mapId = 0,			/*地图ID*/
		areaId = 1,			/*区域ID*/
		occ = 2,			/*怪物ID*/
		joinAwards = 3,			/*参与奖励 packageId#packageId*/
		killerAward = 4,			/*击杀奖励 packageId#packageId*/
		awardTips = 5,			/*奖励预览*/
	}
	type scene_copy_cloudland = [number, number, number, Array<number>, Array<number>, Array<Items>];

	const enum scene_limittimeFields {
		id = 0,
		mapId = 1,			/*地图ID*/
		name = 2,			/*场景名*/
		seasonId = 3,			/*关联的赛季ID*/
		weeks = 4,			/*星期X 1#2#3#4#5#6#7*/
		noticeTime = 5,			/*预告时间 hour#min*/
		openTime = 6,			/*开启时间 hour#min*/
		closeTime = 7,			/*关闭时间 hour#min*/
		doubleOpenTime = 8,			/*双倍开启时间 hour#min*/
		doubleCloseTime = 9,			/*双倍关闭时间 hour#min*/
		levelNum = 10,			/*层数*/
		serverType = 11,			/*0:本服 1:本地跨服 2:总跨服*/
		commonScene = 12,			/*是否公共场景*/
	}
	type scene_limittime = [number, number, string, number, Array<number>, Pair, Pair, Pair, Pair, Pair, number, number, number];

	const enum season_mgrFields {
		id = 0,			/*赛季ID*/
		day = 1,			/*赛季天数 7的倍数*/
		openTime = 2,			/*新赛季开启时间*/
		closeTime = 3,			/*赛季结束时间*/
		serverType = 4,			/*0:本服 1:本地跨服 2:总跨服*/
	}
	type season_mgr = [number, number, Pair, Pair, number];

	const enum scene_swimmingFields {
		level = 0,			/*角色等级*/
		fixItem = 1,			/*固定道具  道具id#数量*/
		items = 2,			/*权重道具  [道具id#数量#权重]#[道具id#数量#权重]*/
	}
	type scene_swimming = [number, Items, Array<weightItem>];

	const enum fairyFields {
		id = 0,			/*仙女id*/
		name = 1,			/*仙女名字*/
		ico = 2,			/*图片*/
		weight = 3,			/*初始权值*/
		weightLib = 4,			/*刷新权值库 [仙女id#权值]#[仙女id#权值]*/
		time = 5,			/*护送所需时间  单位毫秒*/
		items = 6,			/*奖励道具[id#数量]#[id#数量]*/
		onceTime = 7,			/*单次过屏时间 单位毫秒*/
	}
	type fairy = [number, string, string, number, Array<Pair>, number, Array<Items>, number];

	const enum guideFields {
		id = 0,					/*引导ID*/
		triggerType = 1,		/*触发条件 [类型#参数1#参数2...]#[类型#参数1#参数2...]*/
		completeType = 2,		/*完成条件 [类型#参数1#参数2...]#[类型#参数1#参数2...]*/
		spriteId = 3,			/*箭头指向的精灵ID，由前端定义*/
		arrowDir = 4,			/*箭头方向，1上，2下，3左，4右*/
		lock = 5,				/*是否锁屏*/
		needTxt = 6,			/*是否文字提示*/
		txt = 7,				/*文字内容*/
		needGirl = 8,			/*是否需要引导妹子*/
		girlPos = 9,			/*引导妹子坐标*/
		talkPos = 10,			/*妹子对话框坐标*/
		talkContent = 11,		/*妹子对话内容*/
		nextId = 12,			/*下一引导id*/
		completeIds = 13,		/*同时完成的引导id*/
		layer = 14,				/*引导所在层级*/
		comment = 15,			/*备注*/
		allowPanel = 16,		/*允许的面板ID，除了允许的面板id，其它都关掉*/
		show = 17,				/*引导框是否隐藏*/
		side = 18,				/*引导妹子朝向1为向右-1为向左*/
		offsetW = 19,			/*对话框宽度偏移0为不改变单位为像素*/
		offsetH = 20,			/*对话框高度偏移0为不改变单位为像素*/
	}
	type guide = [number, Array<Array<number>>, Array<Array<number>>, number, number, number, number, string, string, Array<number>, Array<number>, string, number, Array<number>, number, string, Array<number>, number, number, number, number];

	const enum adventure_exchangeFields {
		id = 0,			/*兑换道具对应id  唯一id*/
		exchangeItem = 1,			/*兑换道具 道具ID#道具数量*/
		condition = 2,			/*兑换所需代币 道具ID#道具数量*/
		sort = 3,			/*界面排序*/
	}
	type adventure_exchange = [number, Array<number>, Array<number>, number];

	const enum tipsFields {
		type = 0,			/*提示类型(1开始)*/
		index = 1,			/*优先顺序*/
		name = 2,			/*功能名*/
		ImgId = 3,			/*图标ID*/
		gotoParams = 4,			/*跳转的功能id*/
	}
	type tips = [number, number, string, number, number];

	const enum action_previewFields {
		id = 0,			/*功能id*/
		enterIcon = 1,			/*功能入口图标id*/
		icon = 2,			/*功能图标id*/
		previewIcon = 3,			/*预览美术字图片*/
		award = 4,			/*奖励 [itemId#count]#[itemId#count]*/
		tips = 5,			/*开启条件说明*/
		tips1 = 6,			/*开启条件说明2*/
	}
	type action_preview = [number, string, string, string, Array<Items>, string, string];

	const enum online_reward_entranceFields {
		openDay = 0,			/*开服第几天*/
		showId = 1,			/*模型ID/图片ID*/
		isMove = 2,			/*展示模型、图片 是否 上下动  0否 1是*/
		isModel = 3,			/*是否模型(0模型1特效2图片)*/
	}
	type online_reward_entrance = [number, number, number, number];

	const enum designationFields {
		id = 0,
		name = 1,			/*称号名称*/
		src = 2,			/*称号图片ID*/
		type = 3,			/*类别*/
		typeName = 4,			/*类别名称*/
		level = 5,			/*称号等级*/
		attr = 6,			/*属性 [id#value]#[id#value]*/
		attrTips = 7,			/*属性Tips 攻击#100#生命#1000*/
		limitTime = 8,			/*限时天数 0:不限时*/
		limitTimeType = 9,			/*1:激活后开始计时 2:功能结算发放奖励时计时*/
		node = 10,			/*条件类型*/
		autoActive = 11,			/*1:自动激活 2:自动激活并穿戴*/
		condition = 12,			/*激活条件*/
		showProgress = 13,			/*是否显示进度 0/1*/
		atkNum = 14,			/*战力加成*/
	}
	type designation = [number, string, string, number, string, number, Array<attr>, Array<string>, number, number, any, number, string, number, number];

	const enum factionFields {
		level = 0,			/*等级*/
		exp = 1,			/*升下一级所需经验*/
		memerLimit = 2,			/*成员数量限制*/
		icon = 3,			/*图标*/
	}
	type faction = [number, number, number, string];

	/*战队配置*/
	const enum clanFields {
		level = 0,			/*等级*/
		exp = 1,			/*升下一级所需经验*/
		memerLimit = 2,		/*成员数量限制*/
		fighting = 3,		/*战力*/
		attr = 4,			/*当前等级加成属性配置 属性 [id#value]#[id#value]*/
		icon = 5,			/*图标*/
	}
	type clan = [number, number, number, number, Array<attr>, number];
	//战队技能
	const enum clan_skillFields {
		id = 0,				/*技能id*/
		level = 1,			/*开启该技能所需战队等级*/
		skillNumber = 2,	/*技能序号*/
	}
	type clan_skill = [number, number, number];
	//战队建设item
	const enum clan_buildFields {
		id = 0,					/*唯一id*/
		price = 1,				/*捐献消耗 [itemid#数量]*/
		reward = 2,				/*捐献获得奖励 [[itemid#数量]#[itemid#数量]]*/
		limitBuy = 3,			/*捐献限制 0不限制 1每天 2每周   类型#数量*/
		sortId = 4,				/*排序Id*/
	}
	type clan_build = [number, Items, Array<Items>, Array<number>, number];
	//战队等级奖励
	const enum clan_gradeAwardFields {
		level = 0,					/*战队等级*/
		award = 1,					/*等级奖励*/
		status = 2,					/*领取状态 1可领取 2已领取 3未激活*/
	}
	type clan_gradeAward = [number, Array<Items>, number];
	//战队建设item描述对象
	const enum clan_buildDescFields {
		price = 0,				/*捐献消耗 [itemid#数量]*/
		desc = 1,				/*捐献获取奖励的描述*/
		donateName = 2,			/*捐献物品的名字*/
		limitBuy = 3,			/*捐献限制*/
		sirtId = 4,				/*排序Id，可能会用到*/
		remainCount = 5,		/*剩余可捐献次数或者拥有的个数*/
		id = 6,					/*唯一id*/
	}
	type clan_buildDesc = [Items, string, string, Array<number>, number, number, number];
	//战队技能item属性
	const enum clan_skill_ItemFields {
		name = 0,												/*技能名字*/
		desc = 1,												/*技能描述*/
		iconId = 2,												/*技能图标id*/
		activeLevel = 3,										/*激活技能需要的战队等级*/
		id = 4,													/*技能id*/
	}
	type clan_skill_Item = [string, string, string, number, number];
	//玄火排行奖励-个人战队都一样
	const enum xuanhuoRankAwardFields {
		rank = 0,                                        		/*排名*/
		award = 1,                                		 		/*奖励*/
	}
	type xuanhuoRankAward = [number, Array<Items>];

	//玄火成就奖励
	const enum xuanhuoAchievementFields {
		taskId = 0,                                        		/*任务Id*/
		type = 1,                                		   		/*任务类型-共5大类*/
		name = 2,                                		   		/*任务名字*/
		describe = 3,                                	   		/*任务描述*/
		condition = 4,                                	   		/*任务条件*/
		isHead = 5,                                		   		/*是否为首个任务*/
		taskCondition = 6,                                 		/*前端显示达成条件*/
		items = 7,                                		   		/*奖励道具*/
		isRecord = 8,                                	   		/*未开放前是否记录进度*/
	}
	type xuanhuoAchievement = [number, number, string, string, number, number, number, Items, number];

	//玄火获取任务奖励
	const enum xuanhuoGetAwardFields {
		taskId = 0,                                        		/*任务Id*/
		type = 1,                                		   		/*任务类型-共5大类*/
		name = 2,                                		   		/*任务名字*/
		describe = 3,                                	   		/*任务描述*/
		condition = 4,                                	   		/*任务条件*/
		isHead = 5,                                		   		/*是否为首个任务*/
		taskCondition = 6,                                 		/*前端显示达成条件*/
		items = 7,                                		   		/*奖励道具*/
		isRecord = 8,                                	   		/*未开放前是否记录进度*/
	}
	type xuanhuoGetAward = [number, number, string, string, number, number, number, Array<Items>, number];

	//逐鹿成就奖励
	const enum zhuluAchievementAwardFields {
		taskId = 0,                                        		/*任务Id*/
		type = 1,                                		   		/*任务类型*/
		name = 2,                                		   		/*任务名字*/
		describe = 3,                                	   		/*任务描述*/
		condition = 4,                                	   		/*任务条件*/
		isHead = 5,                                		   		/*是否为首个任务*/
		taskCondition = 6,                                 		/*前端显示达成条件*/
		items = 7,                                		   		/*奖励道具*/
		isRecord = 8,                                	   		/*未开放前是否记录进度*/
	}
	type zhuluAchievementAward = [number, number, string, string, number, number, number, Items, number];

	//逐鹿首领战伤害奖励
	const enum zhuluHeaderDamageAwardFields {
		taskId = 0,                                        		/*任务Id*/
		name = 1,                                		   		/*任务名字*/
		describe = 2,                                	   		/*任务描述*/
		condition = 3,                                	   		/*任务条件*/
		isHead = 4,                                		   		/*是否为首个任务*/
		taskCondition = 5,                                 		/*前端显示达成条件*/
		items = 6,                                		   		/*奖励道具*/
	}
	type zhuluHeaderDamageAward = [number, string, string, number, number, number, Array<Items>];



	//逐鹿 巅峰战 争夺战排名奖励
	const enum zhuluWarRankAwardFields {
		id = 0,                                        			/*唯一id*/
		rank = 1,                                        		/*排名*/
		type = 2,                                		 		/*类型 1首领战 2巅峰战*/
		items = 3,                                		    	/*奖励道具*/
		blessing = 4,                                			/*福地奖励id*/
		blessedName = 5,                                		/*福地名字*/
	}
	type zhuluWarRankAward = [number, string, number, Array<Items>, number, string];

	//逐鹿福地挑战奖励展示
	const enum zhuluBlessedAwardDisplayFields {
		id = 0,                                        			/*唯一id*/
		type = 1,                                        		/*试炼类型*/
		name = 2,                                		 		/*试炼名字*/
		describe = 3,                                			/*描述*/
		award = 4,                                				/*完成奖励*/
	}
	type zhuluBlessedAwardDisplay = [number, number, string, string, Array<Items>];

	//九霄令奖励配置
	const enum jiuXiaoLingAwardFields {
		level = 0,                                        		/*等级*/
		condition = 1,                                        	/*条件（经验）*/
		award = 2,                                		 		/*普通奖励*/
		gold_award = 3,                                		    /*九霄金令奖励*/
		final_award = 4,                                		/*最高等级大奖*/
		status = 5,                                				/*领取状态-九霄令 0-未达成 1-可领取 2-已领取*/
		status_G = 6,                                			/*领取状态-九霄金令 0-未达成 1-可领取 2-已领取*/
	}
	type jiuXiaoLingAward = [number, number, Array<Items>, Array<Items>, Array<Items>, number, number];

	//九霄令任务配置
	const enum jiuXiaoLingTaskFields {
		id = 0,													/*任务id*/
		nextId = 1,												/*下一个任务id 0表示没有下一个了*/
		type = 2,												/*类型 1阶段任务 2赛季任务*/
		name = 3,												/*名字*/
		describe = 4,											/*描述*/
		taskId = 5,												/*任务id（服务器使用）*/
		skipId = 6,												/*跳转面板的Id[id#参数]*/
		condition = 7,											/*条件 param1#param2*/
		isHead = 8,												/*是否首个任务 0否 1是*/
		taskCondition = 9,										/*前端显示任务条件*/
		award_exp = 10,											/*奖励经验*/
		task_counts = 11,										/*任务次数*/
		isRecord = 12,											/*未开放前是否记录进度 0不记录 1记录*/
	}
	type jiuXiaoLingTask = [number, number, number, string, string, number, number, number, number, number, number, number, number];

	const enum faction_boxFields {
		level = 0,			/*仙盟等级*/
		greenAward = 1,			/*绿奖励 [itemId:count]#[itemId:count]*/
		blueAward = 2,			/*蓝奖励 [itemId:count]#[itemId:count]*/
		purpleAward = 3,			/*紫奖励 [itemId:count]#[itemId:count]*/
		orangeAward = 4,			/*橙奖励 [itemId:count]#[itemId:count]*/
		redAward = 5,			/*红奖励 [itemId:count]#[itemId:count]*/
	}
	type faction_box = [number, Array<Items>, Array<Items>, Array<Items>, Array<Items>, Array<Items>];

	const enum scene_copy_factionFields {
		index = 0,			/*第几只*/
		boosId = 1,			/*bossId*/
		award = 2,			/*杀死BOSS的奖励 [itemId:count]#[itemId:count]*/
	}
	type scene_copy_faction = [number, number, Array<Items>];

	const enum faction_boss_awardFields {
		level = 0,			/*仙盟等级*/
		value = 1,			/*伤害1#伤害2.。。。。*/
		award = 2,			/*累计伤害奖励，对应上面的伤害档 [[itemId:count]#[itemId:count]]#[[itemId:count]#[itemId:count]]*/
	}
	type faction_boss_award = [number, Array<number>, Array<Array<Items>>];

	//逐鹿首领战伤害奖励
	const enum fightTeam_boss_awardFields {
		taskId = 0,                                        		/*任务Id*/
		name = 1,                                		   		/*任务名字*/
		describe = 2,                                	   		/*任务描述*/
		condition = 3,                                	   		/*任务条件*/
		taskCondition = 4,                                 		/*前端显示达成条件*/
		items = 5,                                		   		/*奖励道具*/
	}
	type fightTeam_boss_award = [number, string, string, number, number, Array<Items>];

	//逐鹿争夺战积分奖励
	const enum fightTeam_score_awardFields {
		taskId = 0,                                        		/*任务Id*/
		name = 1,                                		   		/*任务名字*/
		describe = 2,                                	   		/*任务描述*/
		condition = 3,                                	   		/*任务条件*/
		taskCondition = 4,                                 		/*前端显示达成条件*/
		items = 5,                                		   		/*奖励道具*/
	}
	type fightTeam_score_award = [number, string, string, number, number, Array<Items>];



	const enum faction_skillFields {
		skillId = 0,			/*技能id*/
		items = 1,			/*升级所需道具*/
		level = 2,			/*所需仙盟等级*/
	}
	type faction_skill = [number, Items, number];

	type DaypayReward = [number, number];

	const enum CumulatepayRewardFields {
		id = 0,			/*档位*/
		state = 1,			/*状态(0不可领 1可领取 2已领取)*/
	}

	const enum arenaFields {
		rank = 0,			/*排名 X#Y*/
		robots = 1,			/*取值范围 [X#Y]#[X#Y]#[X#Y]*/
		winItems = 2,			/*胜利奖励 [itemId#count]#[itemId#count]*/
		failItems = 3,			/*失败奖励 [itemId#count]#[itemId#count]*/
		dailyItems = 4,			/*每日排名奖励 [itemId#count]#[itemId#count]*/
		goldPer = 5,			/*历史名次提升代币券系数*/
	}
	type arena = [Pair, Array<Pair>, Array<Items>, Array<Items>, Array<Items>, number];

	const enum arena_robotFields {
		rank = 0,			/*机器人排名 X#Y*/
		id = 1,			/*机器人人ID*/
	}
	type arena_robot = [Pair, number];

	const enum scene_copy_arenaFields {
		mapId = 0,			/*地图ID*/
		readyTime = 1,			/*场景开启后并且双方登录后准备XX时间开始战斗*/
		pos = 2,			/*AI寻路终点*/
	}
	type scene_copy_arena = [number, number, Pos];

	const enum fashion_feedFields {
		level = 0,			/*等级*/
		items = 1,			/*消耗道具 道具ID#道具数量*/
		skill = 2,			/*技能 技能id#等级#战力*/
		fighting = 3,			/*战力*/
		attrs = 4,			/*属性 [id#value]#[id#value]*/
	}
	type fashion_feed = [number, Array<number>, Array<number>, number, Array<attr>];

	const enum fashion_magicShowFields {
		showId = 0,			/*外观id*/
		level = 1,			/*阶级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		fighting = 3,			/*战力*/
		getWay = 4,			/*获取途径*/
		quality = 5,			/*品质*/
		attrs = 6,			/*属性 [id#value]#[id#value]*/
	}
	type fashion_magicShow = [number, number, Array<number>, number, string, number, Array<attr>];

	const enum fashion_refineFields {
		type = 0,			/*类型*/
		level = 1,			/*等级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		fighting = 3,			/*战力*/
		humanLevel = 4,			/*人物等级*/
		attrs = 5,			/*属性 [id#value]#[id#value]*/
	}
	type fashion_refine = [number, number, Array<number>, number, number, Array<attr>];

	const enum guanghuan_feedFields {
		level = 0,			/*等级*/
		items = 1,			/*消耗道具 道具ID#道具数量*/
		skill = 2,			/*技能 技能id#等级#战力*/
		fighting = 3,			/*战力*/
		attrs = 4,			/*属性 [id#value]#[id#value]*/
	}
	type guanghuan_feed = [number, Array<number>, Array<number>, number, Array<attr>];

	const enum guanghuan_magicShowFields {
		showId = 0,			/*外观id*/
		level = 1,			/*阶级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		fighting = 3,			/*战力*/
		getWay = 4,			/*获取途径*/
		quality = 5,			/*品质*/
		attrs = 6,			/*属性 [id#value]#[id#value]*/
	}
	type guanghuan_magicShow = [number, number, Array<number>, number, string, number, Array<attr>];

	const enum guanghuan_refineFields {
		type = 0,			/*类型*/
		level = 1,			/*等级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		fighting = 3,			/*战力*/
		humanLevel = 4,			/*人物等级*/
		attrs = 5,			/*属性 [id#value]#[id#value]*/
	}
	type guanghuan_refine = [number, number, Array<number>, number, number, Array<attr>];

	const enum tianzhu_feedFields {
		level = 0,			/*等级*/
		items = 1,			/*消耗道具 道具ID#道具数量*/
		skill = 2,			/*技能 技能id#等级#战力*/
		fighting = 3,			/*战力*/
		attrs = 4,			/*属性 [id#value]#[id#value]*/
	}
	type tianzhu_feed = [number, Array<number>, Array<number>, number, Array<attr>];

	const enum tianzhu_magicShowFields {
		showId = 0,			/*外观id*/
		level = 1,			/*阶级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		fighting = 3,			/*战力*/
		getWay = 4,			/*获取途径*/
		quality = 5,			/*品质*/
		attrs = 6,			/*属性 [id#value]#[id#value]*/
	}
	type tianzhu_magicShow = [number, number, Array<number>, number, string, number, Array<attr>];

	const enum tianzhu_refineFields {
		type = 0,			/*类型*/
		level = 1,			/*等级*/
		items = 2,			/*消耗道具 道具ID#道具数量*/
		fighting = 3,			/*战力*/
		humanLevel = 4,			/*人物等级*/
		attrs = 5,			/*属性 [id#value]#[id#value]*/
	}
	type tianzhu_refine = [number, number, Array<number>, number, number, Array<attr>];

	const enum ColorWeightFields {
		min = 0,
		max = 1,
		weight = 2,
	}
	type ColorWeight = [number, number, number];

	const enum xilianFields {
		part = 0,			/*部位*/
		type = 1,			/*属性类型*/
		value = 2,			/*1-6品质 [min#max#weight]#[min#max#weight]*/
	}
	type xilian = [number, number, Array<ColorWeight>];

	const enum xilian_riseFields {
		level = 0,
		color = 1,			/*颜色品质*/
		count = 2,			/*数量*/
		fighting = 3,			/*战力*/
		attrs = 4,			/*属性 [id#value]#[id#value]*/
	}
	type xilian_rise = [number, number, number, number, Array<attr>];

	const enum shenqiFields {
		id = 0,			/*神器id，从1开始按顺序激活*/
		name = 1,			/*神器名*/
		fragment = 2,			/*碎片id itemId#itemId*/
		skillId = 3,			/*技能id*/
		fragmentAttr = 4,			/*属性id与碎片顺序对应 [属性类型#值#属性类型#值]#[属性类型#值#属性类型#值]*/
		skillStr = 5,			/*技能美术字*/
		fighting = 6,			/*碎片战力，与碎片顺序对应 战力1#战力2*/
		conditions = 7,			/*天关关卡#天关关卡*/
		showID = 8,			/*神器外观*/
	}
	type shenqi = [number, string, Array<number>, number, Array<Array<number>>, string, Array<number>, Array<number>, number];

	const enum attr_skillFields {
		id = 0,			/*属性类型*/
		name = 1,			/*属性名字*/
		isPercent = 2,			/*是否百分比*/
	}
	type attr_skill = [number, string, number];

	const enum attr_itemFields {
		id = 0,			/*属性类型*/
		name = 1,			/*属性名字*/
		isPercent = 2,			/*是否百分比*/
		quality = 3,			/*品质*/
	}
	type attr_item = [number, string, number, number];

	const enum attr_buffFields {
		id = 0,			/*属性类型*/
		name = 1,			/*属性名字*/
		isPercent = 2,			/*是否百分比*/
	}
	type attr_buff = [number, string, number];

	const enum equip_suitFields {
		id = 0,			/*套装id(ps:有大类修改时通知前端)*/
		name = 1,			/*套装名*/
		condition = 2,			/*解锁条件*/
		light = 3,			/*点亮条件 阶数#品质#星级*/
		attr = 4,			/*属性 [数量#属性id#属性id....]#[数量#属性id#属性id....]*/
		skillId = 5,			/*技能id*/
		fight = 6,			/*部位id#点亮战力*/
		attrs = 7,			/*属性 [属性类型#value]#[属性类型#value]*/
	}
	type equip_suit = [number, string, number, Array<number>, Array<Array<number>>, number, Array<Pair>, Array<attr>];

	const enum single_pay_jadeFields {
		id = 0,			/*id*/
		money = 1,			/*充值的钱*/
		index = 2,			/*档位*/
		award = 3,			/*奖励[itemId#数量]#[itemId#数量]*/
		count = 4,			/*可完成次数*/
	}
	type single_pay_jade = [number, number, number, Array<Items>, number];

	const enum single_pay_printFields {
		id = 0,			/*id*/
		money = 1,			/*充值的钱*/
		index = 2,			/*档位*/
		award = 3,			/*奖励[itemId#数量]#[itemId#数量]*/
		count = 4,			/*可完成次数*/
	}
	type single_pay_print = [number, number, number, Array<Items>, number];

	const enum week_single_payFields {
		id = 0,			/*id*/
		index = 1,			/*档位*/
		scope = 2,			/*周期范围x#y*/
		day = 3,			/*天数，星期1-7*/
		award = 4,			/*奖励[itemId#数量]#[itemId#数量]*/
		count = 5,			/*可完成次数*/
	}
	type week_single_pay = [number, number, Pair, number, Array<Items>, number];

	const enum week_loginFields {
		id = 0,			/*id*/
		vip = 1,			/*vip要求*/
		isTomorrow = 2,			/*是否明日可领，1是，0否*/
		scope = 3,			/*周期范围x#y*/
		day = 4,			/*天数，星期1-7*/
		award = 5,			/*奖励[itemId#数量]#[itemId#数量]*/
	}
	type week_login = [number, number, number, Pair, number, Array<Items>];

	const enum week_accumulateFields {
		id = 0,			/*id*/
		money = 1,			/*充值的钱*/
		scope = 2,			/*周期范围x#y*/
		day = 3,			/*天数，星期1-7*/
		award = 4,			/*奖励[itemId#数量]#[itemId#数量]*/
	}
	type week_accumulate = [number, number, Pair, number, Array<Items>];

	const enum week_consumeFields {
		id = 0,			/*id*/
		consume = 1,			/*消费的代币券*/
		scope = 2,			/*周期范围x#y*/
		day = 3,			/*天数，星期1-7*/
		award = 4,			/*奖励[itemId#数量]#[itemId#数量]*/
	}
	type week_consume = [number, number, Pair, number, Array<Items>];

	const enum consume_rankFields {
		scope = 0,			/*排名范围x#y 包含xy*/
		award = 1,			/*奖励[itemId#数量]#[itemId#数量]*/
		consume = 2,			/*上榜所需消耗代币券数*/
	}
	type consume_rank = [Pair, Array<Items>, number];

	const enum limit_packFields {
		level = 0,			/*等级*/
		time = 1,			/*停留时间*/
		items = 2,			/*无vip礼包内容[itemId#数量]#[itemId#数量]*/
		originalPrice = 3,			/*原价*/
		price = 4,			/*现价*/
		vipItems = 5,			/*vip礼包内容[itemId#数量]#[itemId#数量]*/
		vipOriginalPrice = 6,			/*原价*/
		vipPrice = 7,			/*现价*/
		vip = 8,			/*vip礼包所需vip等级*/
		discountIcon = 9,			/*普通礼包折扣图标*/
		VIPdiscountIcon = 10,			/*VIP礼包折扣图标*/
	}
	type limit_pack = [number, number, Array<Items>, number, number, Array<Items>, number, number, number, number, number];

	const enum fight_talismanFields {
		id = 0,				/*勋章ID*/
		name = 1,			/*勋章名称*/
		era = 2,			/*觉醒重数*/
		fighting = 3,			/*战力*/
		attrs = 4,			/*属性 [属性类型#value]#[属性类型#value]*/
	}
	type fight_talisman = [number, string, number, number, Array<attr>];

	const enum money_catFields {
		era = 0,			/*觉醒重数*/
		award = 1,			/*奖励[itemId#数量]#[itemId#数量]*/
	}
	type money_cat = [number, Array<Items>];

	const enum yugeFields {
		id = 0,			/*唯一id*/
		goods = 1,			/*商品itemId#数量*/
		weight = 2,			/*刷新权重*/
		originalPrice = 3,			/*原价*/
		price = 4,			/*现价*/
		desId = 5,			/*折扣id*/
		discountBgId = 6,			/*折扣底图ID*/
	}
	type yuge = [number, Items, number, number, number, number, number];

	const enum gauntletFields {
		id = 0,			/*原石id 0:手套属性，1001：心灵1级原石，1心灵2空间3时间4力量5灵魂6现实*/
		name = 1,			/*名字*/
		attrs = 2,			/*属性 [属性类型#value]#[属性类型#value]*/
		per = 3,			/*放大比例*/
		material = 4,			/*升级材料[itemId#数量]#[itemId#数量]*/
		desc = 5,			/*描述*/
		fight = 6,			/*战力*/
	}
	type gauntlet = [number, string, Array<attr>, number, Array<Items>, string, number];

	const enum xiandanFields {
		id = 0,			/*仙丹id  第4位阶数，第5、6位大类，第7、8位小类*/
		attrs = 1,			/*属性 [属性类型#value]#[属性类型#value]*/
		xianweiLimit = 2,			/*仙位服用上限[仙位id#上限]*/
		fight = 3,			/*战力*/
	}
	type xiandan = [number, Array<attr>, Array<Pair>, number];

	const enum xianfu_mall2Fields {
		id = 0,			/*唯一id*/
		goods = 1,			/*商品itemId#数量*/
		weight = 2,			/*刷新权重*/
		originalPrice = 3,			/*原价*/
		price = 4,			/*现价itemId#数量*/
		desId = 5,			/*折扣id*/
		discountBgId = 6,			/*折扣底图ID*/
	}
	type xianfu_mall2 = [number, Items, number, number, Items, number, number];

	const enum retrieve_resFields {
		mapId = 0,
		name = 1,			/*名字*/
		awardsTips = 2,			/*奖励展示 [XX#XX(限两个)]#[XX#XX(限两个)]*/
	}
	type retrieve_res = [number, string, Array<Items>];

	const enum retrieve_lilianFields {
		id = 0,
		name = 1,			/*名字*/
		exp = 2,			/*找回活跃值经验 X*/
	}
	type retrieve_lilian = [number, string, number];

	const enum prevent_foolFields {
		id = 0,			/*id(从1开始,依次递增)*/
		answer = 1,			/*答案(0,1)*/
		award = 2,			/*奖励[itemId#数量]#[itemId#数量]*/
		description = 3,			/*问题描述*/
		answer1 = 4,			/*答案1描述*/
		answer2 = 5,			/*答案2描述*/
		tipForAnswer1 = 6,			/*选择答案1提示*/
		tipForAnswer2 = 7,			/*选择答案2提示*/
	}
	type prevent_fool = [number, number, Array<Items>, string, string, string, string, string];

	const enum ceremonyGeocachingRankFields {
		days = 0,											/*开服第几天*/
		rank = 1,											/*排名*/
		describe = 2,										/*描述*/
		condition_show = 3,									/*前端显示达成条件*/
		items = 4,											/*排名奖励[itemId#数量]#[itemId#数量]*/
		condition = 5,										/*条件*/
		name = 6,											/*上榜玩家名字*/
		score = 7,											/*上榜玩家积分*/
	}
	type ceremonyGeocachingRank = [number, number, string, number, Array<Items>, number, string, number];

	const enum ceremonyGeocachingScoreAwardFields {
		days = 0,											/*开服第几天*/
		taskId = 1,											/*任务id*/
		name = 2,											/*任务名字*/
		describe = 3,										/*描述*/
		condition = 4,										/*条件*/
		isHead = 5,											/*是否为首个*/
		taskCondition = 6,									/*前端显示达成条件*/
		items = 7,											/*排名奖励[itemId#数量]#[itemId#数量]*/
		isRecord = 8,										/*是否记录*/
	}
	type ceremonyGeocachingScoreAward = [number, number, string, string, number, number, number, Array<Items>, number];


	const enum xunbao_continue_payFields {
		type = 0,		/*活动类型*/
		grade = 1,		/*档次(0-5)*/
		id = 2,			/*id*/
		money = 3,		/*金额*/
		serverDay = 4,	/*连续天数*/
		count = 5,		/*次数*/
		reward = 6,		/*奖励 [itemId#count]#[itemId#count]*/
	}
	type xunbao_continue_pay = [number, number, number, number, number, number, Array<Items>];

	const enum limit_xunbao_exchange_cfg_ItemField {
		id = 0,		/*物品ID*/
		count = 1,	/*物品数量*/
	}
	type limit_xunbao_exchange_cfg_Item = [number, number];

	const enum limit_xunbao_exchange_cfg_buyField {
		type = 0,		/*物品ID*/
		count = 1,	/*物品数量*/
	}
	type limit_xunbao_exchange_cfg_buy = [number, number];

	const enum limit_xunbao_exchange_cfgFields {
		id = 0,			/*兑换道具对应id  唯一id*/
		type = 1,		/*探索类型 1:钓鱼*/
		exchangeItem = 2,			/*兑换道具 道具ID#道具数量*/
		condition = 3,			/*兑换所需代币 道具ID#道具数量*/
		sort = 4,			/*界面排序*/
		limitBuy = 5,			/*限购(0不限购 1每天 2每周) 类型#数量*/
		shortcut = 6,			/*是否弹出购买界面 0弹 1不弹*/
	}
	type limit_xunbao_exchange_cfg = [number, number, limit_xunbao_exchange_cfg_Item, limit_xunbao_exchange_cfg_Item, number, limit_xunbao_exchange_cfg_buy, number];

	const enum fishing_cfg__gradeFields {
		min = 0,		/*min*/
		max = 1,			/*max*/
	}
	type fishing_cfg__grade = [number, number];

	const enum fishing_cfgFields {
		type = 0,		/*限时探索类型*/
		grade = 1,			/*幸运值#*/
		showItem = 2,		/*展示道具*/
		luckItem = 3,		/*幸运大奖*/
		nomalItem = 4,		/*普通奖品*/
	}
	type fishing_cfg = [number, fishing_cfg__grade, Array<Items>, Array<Items>, Array<Items>];

	const enum fish_gift_cfgFields {
		id = 0, 		/*礼包id*/
		type = 1,		/*活动类型 1:钓鱼*/
		recharge = 2,	/*充值档位id*/
		rewards = 3,	/*奖励*/
		level = 4,		/*等级闭区间(0#0 为无限制*/
		originalPrice = 5,	/*原价*/
		isModel = 6,		/*是否模型(0模型1特效2图片)*/
		isMove = 7,			/*是否上下缓动*/
		isTeXiao = 8,		/*是否有特效 0 没有 1有*/
		limitBuy = 9		/*限购(0不限购 1每天 2每周) 类型#数量*/
	}
	type fish_gift_cfg = [number, number, number, Array<Items>, Array<fishing_cfg__gradeFields>, number, number, number, number, limitBuy];

	const enum limitBuyField {
		type,    /*类型  限购(0不限购 1每天 2每周) */
		count,   /*数量*/
	}
	type limitBuy = [number, number];

	const enum limit_mall_cfgFields {
		id = 0,			/*唯一id*/
		itemId = 1,		/*道具id*/
		count = 2,		/*数量*/
		type = 3,		/*活动类型 1:钓鱼*/
		mallName = 4,	/*商城名字*/
		childMallType = 5,		/*mallType为大类，childMallType为小类 */
		childMallName = 6,		/*子商城名字*/
		originalPrice = 7,		/*原价 itemId#数量*/
		realityPrice = 8,		/*现价 itemId#数量*/
		limitBuy = 9,	/*限购(0不限购 1每天 2每周) 类型#数量*/
		svip = 10,		/*svip条件 0表示不限制*/
		shortcut = 11,	/*是否弹出购买界面 0弹 1不弹*/
		desId = 12,		/*折扣id*/
		sortId = 13,		/*排序id*/
		discountBgId = 14,		/*折扣底图ID*/
		eraCondition = 15,		/*觉醒等级条件(era.xlsx表 level字段) eg:101#103  或者101#101*/
	}
	type limit_mall_cfg = [number, number, number, number, string, number, string, Array<Items>, Array<Items>, limitBuy, number, number, number, number];

	const enum limit_xunbao_rankFields {
		type = 0,			/*活动类型*/
		rankType = 1,			/*排行类型(0个人 1区服)*/
		rank = 2,			/*排名*/
		condition = 3,			/*条件*/
		conditionChar = 4,			/*玩家领取奖励条件(个人排行配0)*/
		condition_show = 5,			/*前端显示条件*/
		Items = 6,			/*奖励*/
		describe = 7,			/*任务描述*/
	}
	type limit_xunbao_rank = [number, number, number, number, number, number, Array<Items>, string];

	const enum limit_xunbao_cumulative_task_cfgField {
		id = 0,     /*id*/
		nextId = 1,     /*下一个id 0表示没有下一个了*/
		type = 2,     /*活动类型 1钓鱼*/
		name = 3,     /*任务名字*/
		describe = 4,     /*任务描述*/
		taskId = 5,     /*任务ID*/
		skipId = 6,     /*跳转面板的Id[id#参数]*/
		condition = 7,     /*条件*/
		isHead = 8,     /*是否首个任务 0否 1是*/
		taskCondition = 9,     /*前端显示达成条件*/
		rewards = 10,     /*奖励 [itemId#count]#[itemId#count]*/
		award_exp = 11,     /*奖励经验*/
		task_counts = 12,     /*任务次数*/
		isRecord = 13,     /*未开放前是否记录进度 0不记录 1记录*/
		reStage = 14,     /*刷新阶段 0:活动结束*/
		smallType = 15,/* 活动类型中的小类(无小类 默认0)【id方式 type * 1000计算】 */
		recordType = 16,/* 任务记录类型(1:单值类型 2:细致记录类型) */

	}
	type limit_xunbao_cumulative_task_cfg = [number, number, number, string, string, number, Array<number>, number, number, number, Array<Items>, number, number, number, number, number, number];

	/* 累充豪礼 */
	const enum limit_cumulateFields {
		type = 0,		/*活动类型*/
		id = 1,			/*id*/
		money = 2,			/*累计金额*/
		reward = 3,			/*奖励 [itemId#count]#[itemId#count]*/
	}
	type limit_cumulate = [number, number, number, Array<Items>];

	/* 每日单充 */
	const enum limit_daysingleFields {
		type = 0,
		id = 1,			/*id*/
		money = 2,			/*金额*/
		grade = 3,			/*充值档位*/
		day = 4,				/* 活动天数 */
		isContinued = 5,  	/* 是否持续读取：0不读取、1读取(配合day使用:当天数N不存在时，使用指定天数的配置、以选择的最后一个为准) */
		count = 6,			/*次数*/
		reward = 7,			/*奖励 [itemId#count]#[itemId#count]*/
	}
	type limit_daysingle = [number, number, number, number, number, number, number, Array<Items>];

	/* 每日累充 */

	const enum limit_day_cumulateFields {
		type = 0,  /* 活动类型（2打地鼠） */
		id = 1,			/*id*/
		money = 2,			/*累计金额*/
		day = 3,				/* 活动天数 */
		isContinued = 4,	/* 是否持续读取：0不读取、1读取(配合day使用:当天数N不存在时，使用指定天数的配置、以选择的最后一个为准) */
		reward = 5,			/*奖励 [itemId#count]#[itemId#count]*/
		dayGrade  = 6,		/*开服天数档位（0#0表示 无开服天数限制）*/
	}
	type limit_day_cumulate = [number, number, number, number, number, Array<Items>, Array<number>];


	const enum exterior_suit_Field {
		id = 0,     /*id*/
		name = 1,     /*套装名*/
		quality = 2,     /*品质*/
		icon = 3,     /*图标*/
		partsId = 4,     /*套装部件id*/
		partsShowId = 5,     /*套装部件外观id*/
	}
	type exterior_suit = [number, string, number, string, Array<number>, Array<number>];

	const enum exterior_suit_feed_Field {
		id = 0,     /*套装id*/
		level = 1,     /*阶数*/
		condition = 2,     /*条件(套装id#套装内装备部件阶数）*/
		items = 3,     /*消耗道具 道具ID#道具数量*/
		quality = 4,     /*品质*/
		fighting = 5,     /*战力*/
		attrs = 6,     /*属性*/
	}
	type exterior_suit_feed = [number, number, Array<number>, Array<number>, number, number, Array<attr>];

	interface Types {
		"scene": scene;
		"scene_copy_tianguan": scene_copy_tianguan;
		"scene_copy_dahuang": scene_copy_dahuang;
		"scene_copy_single_boss": scene_copy_single_boss;
		"scene_copy_era": scene_copy_era;
		"scene_multi_boss": scene_multi_boss;
		"scene_copy_shilian": scene_copy_shilian;
		"scene_cross_boss": scene_cross_boss;
		"scene_home_boss": scene_home_boss;
		"scene_copy_team": scene_copy_team;
		"scene_temple_boss": scene_temple_boss;
		"shilian": shilian;
		"monster": monster;
		"human": human;
		"skill": skill;
		"skill_train": skillTrain;
		"effect": effect;
		"package": package;
		"item_material": item_material;
		"item_stone": item_stone;
		"item_equip": item_equip;
		"item_attr_pool": equip_attr_pool;
		"item_compose": item_compose;
		"item_resolve": item_resolve;
		"item_smelt": item_smelt;
		"onhook_drop": onhook_drop;
		"onhook_income": onhook_income;
		"task": task;
		"era": era;
		"era_task": era_task;
		"blend": blend;
		"pet_feed": petFeed;
		"pet_rank": petRank;
		"pet_magicshow": petMagicShow;
		"pet_refine": petRefine;
		"pet_fazhen": pet_fazhen;
		"pet_res": PetRes;
		"ride_feed": rideFeed;
		"ride_rank": rideRank;
		"ride_magicshow": rideMagicShow;
		"ride_refine": rideRefine;
		"ride_fazhen": ride_fazhen;
		"soul_refine": soulRefine;
		"soul_rise": soulRise;
		"amulet_refine": amuletRefine;
		"amulet_rise": amuletRise;
		"exterior_sk": ExteriorSK;
		"skill_effect": SkillEffect;
		"erorr_code": erorr_code;
		"map_path": MapPath;
		"monster_res": MonsterRes;
		"monster_res_name": MonsterRes;
		"monster_res_effect": MonsterRes;
		"monster_res_ex": MonsterRes;
		"npc": npc;
		"sign_reward": sign_reward;
		"action_open": action_open;
		"get_way": get_way;
		"seven_day": seven_day;
		"open_reward": open_reward;
		"half_month": half_month;
		"gem_refine": gemRefine;
		"gem_rise": gemRise;
		"strong_refine": strongRefine;
		"strong_rise": strongRise;
		"zhuhun": zhuhun;
		"shihun": shihun;
		"online_reward": online_reward;
		"lilian_task": lilian_task;
		"lilian_day": lilian_day;
		"lilian_rise": lilian_rise;
		"xianwei_task": xianwei_task;
		"xianwei_rise": xianwei_rise;
		"kuanghai_task": kuanghai_task;
		"kuanghai_rise": kuanghai_rise;
		"kuanghai2_task": kuanghai2_task;
		"kuanghai2_rise": kuanghai2_rise;
		"shenbing_feed": shenbing_feed;
		"shenbing_magicshow": shenbing_magicShow;
		"shenbing_refine": shenbing_refine;
		"wing_feed": wing_feed;
		"wing_magicshow": wing_magicShow;
		"wing_refine": wing_refine;
		"xunbao_oper": xunbao_oper;
		"xunbao_weight": xunbao_weight;
		"xunbao_exchange": xunbao_exchange;
		"privilege": privilege;
		"mall": mall;
		"failure_stronger": failure_stronger;
		"broadcast": broadcast;
		"recharge": recharge;
		"first_pay": first_pay;
		"day_pay": day_pay;
		"cumulate_pay": cumulate_pay;
		"cumulate_pay2": cumulate_pay2;
		"continue_pay": continue_pay;
		"zero_buy": zero_buy;
		"one_buy": one_buy;
		"consume_reward": consume_reward;
		"consume_reward2": consume_reward2;
		"invest_reward": invest_reward;
		"sprint_rank_task": sprint_rank_task;
		"sprint_rank": sprint_rank;
		"feisheng_rank_task": feisheng_rank_task;
		"feisheng_rank": feisheng_rank;
		"pay_reward_weight": pay_reward_weight;
		"pay_reward_reward": pay_reward_reward;
		"duobao_weight": duobao_weight;
		"duobao_reward": duobao_reward;
		"duobao_rank": duobao_rank;
		"jzduobao_weight": jzduobao_weight;
		"jzduobao_reward": jzduobao_reward;
		"jzduobao_rank": jzduobao_rank;
		"gushen_task": gushen_task;
		"gushen": gushen;
		"kuanghuan": kuanghuan;
		"discount_gift": discount_gift;
		"everyday_rebate": everyday_rebate;
		"login_reward": login_reward;
		"cumulate_pay_fs": cumulate_pay_fs;
		"pay_single_fs": pay_single_fs;
		"consume_reward_fs": consume_reward_fs;
		"rush_buy_fs": rush_buy_fs;
		"discount_gift_fs": discount_gift_fs;
		"item_rune": item_rune;
		"rune_refine": runeRefine;
		"scene_copy_rune": scene_copy_rune;
		"rune_dial": rune_dial;
		"rune_compose": rune_compose;
		"rune_collect_grade": rune_collect_grade;
		"rune_collect_rise": rune_collect_rise;
		"xiangyao": xiangyao;
		"scene_copy_nine": scene_copy_nine;
		"chat_expression": chatExpression;
		"xianfu": xianfu;
		"xianfu_travel": xianfu_travel;
		"xianfu_illustrated_handbook": xianfu_illustrated_handbook;
		"xianfu_animal": xianfu_animal;
		"scene_homestead": scene_homestead;
		"xianfu_task": xianfu_task;
		"xianfu_fengshui": xianfu_fengshui;
		"xianfu_decorate": xianfu_decorate;
		"xianfu_skill": xianfu_skill;
		"xianfu_build": xianfu_build;
		"tianti": tianti;
		"tianti_awards": tianti_awards;
		"activity_all": activity_all;
		"scene_riches": scene_riches;
		"adventure_child": adventure_child;
		"adventure_task": adventure_task;
		"scene_copy_cloudland": scene_copy_cloudland;
		"fairy": fairy;
		"guide": guide;
		"adventure_exchange": adventure_exchange;
		"tips": tips;
		"action_preview": action_preview;
		"online_reward_entrance": online_reward_entrance;
		"designation": designation;
		"faction": faction;
		"faction_box": faction_box;
		"scene_copy_faction": scene_copy_faction;
		"faction_boss_award": faction_boss_award;
		"faction_skill": faction_skill;
		"arena": arena;
		"fashion_feed": fashion_feed;
		"fashion_magicshow": fashion_magicShow;
		"fashion_refine": fashion_refine;
		"guanghuan_feed": guanghuan_feed;
		"guanghuan_magicShow": guanghuan_magicShow;
		"guanghuan_refine": guanghuan_refine;
		"tianzhu_feed": tianzhu_feed;
		"tianzhu_magicshow": tianzhu_magicShow;
		"tianzhu_refine": tianzhu_refine;
		"xilian_rise": xilian_rise;
		"shenqi": shenqi;
		"attr_skill": attr_skill;
		"attr_item": attr_item;
		"attr_buff": attr_buff;
		"equip_suit": equip_suit;
		"single_pay_jade": single_pay_jade;
		"single_pay_print": single_pay_print;
		"week_single_pay": week_single_pay;
		"week_login": week_login;
		"week_accumulate": week_accumulate;
		"week_consume": week_consume;
		"consume_rank": consume_rank;
		"limit_pack": limit_pack;
		"fight_talisman": fight_talisman;
		"money_cat": money_cat;
		"yuge": yuge;
		"gauntlet": gauntlet;
		"xiandan": xiandan;
		"xianfu_mall2": xianfu_mall2;
		"retrieve_res": retrieve_res;
		"retrieve_lilian": retrieve_lilian;
		"prevent_fool": prevent_fool;
		"exterior_suit": exterior_suit;
		"exterior_suit_feed": exterior_suit_feed;
	}

	interface Struct {
		"scene": Table<scene>;
		"scene_common": Array<scene_common>;
		"scene_copy_tianguan": Array<scene_copy_tianguan>;
		"monster_onhook_attr": Array<monster_onhook_attr>;
		"scene_copy_dahuang": Array<scene_copy_dahuang>;
		"scene_copy_single_boss": Array<scene_copy_single_boss>;
		"scene_copy_era": Array<scene_copy_era>;
		"scene_multi_boss": Array<scene_multi_boss>;
		"scene_copy_shilian": Array<scene_copy_shilian>;
		"scene_cross_boss": Array<scene_cross_boss>;
		"scene_home_boss": Array<scene_home_boss>;
		"scene_copy_team": Array<scene_copy_team>;
		"scene_temple_boss": Array<scene_temple_boss>;
		"scene_xuanhuo_arena": Array<scene_xuanhuo_arena>;
		"shilian": Array<shilian>;
		"monster": Array<monster>;
		"human": Array<human>;
		"skill": Array<skill>;
		"skill_train": Array<skillTrain>;
		"effect": Array<effect>;
		"package": Array<package>;
		"item_material": Table<item_material>;
		"item_stone": Table<item_stone>;
		"item_equip": Table<item_equip>;
		"item_attr_pool": Table<equip_attr_pool>;
		"item_compose": Array<item_compose>;
		"item_resolve": Array<item_resolve>;
		"item_smelt": Array<item_smelt>;
		"onhook_drop": Array<onhook_drop>;
		"onhook_income": Array<onhook_income>;
		"task": Array<task>;
		"era": Array<era>;
		"era_task": Array<era_task>;
		"blend": Array<blend>;
		"pet_feed": Array<petFeed>;
		"pet_rank": Array<petRank>;
		"pet_magicshow": Array<petMagicShow>;
		"pet_refine": Array<petRefine>;
		"pet_fazhen": Array<pet_fazhen>;
		"pet_res": Array<PetRes>;
		"ride_feed": Array<rideFeed>;
		"ride_rank": Array<rideRank>;
		"ride_magicshow": Array<rideMagicShow>;
		"ride_refine": Array<rideRefine>;
		"ride_fazhen": Array<ride_fazhen>;
		"soul_refine": Array<soulRefine>;
		"soul_rise": Array<soulRise>;
		"amulet_refine": Array<amuletRefine>;
		"amulet_rise": Array<amuletRise>;
		"cash_equip": Array<cashEquip>;
		"exterior_sk": Table<ExteriorSK>;
		"skill_effect": Table<SkillEffect>;
		"erorr_code": Table<erorr_code>;
		"map_path": Table<MapPath>;
		"monster_res": Table<MonsterRes>;
		"monster_res_name": Table<MonsterRes>;
		"monster_res_effect": Table<MonsterRes>;
		"monster_res_ex": Table<MonsterRes>;
		"npc": Array<npc>;
		"sign_reward": Array<sign_reward>;
		"action_open": Array<action_open>;
		"get_way": Table<get_way>;
		"seven_day": Array<seven_day>;
		"open_reward": Array<open_reward>;
		"half_month": Array<half_month>;
		"gem_refine": Array<gemRefine>;
		"gem_rise": Array<gemRise>;
		"strong_refine": Array<strongRefine>;
		"strong_rise": Array<strongRise>;
		"zhuhun": Array<zhuhun>;
		"shihun": Array<shihun>;
		"online_reward": Array<online_reward>;
		"lilian_task": Array<lilian_task>;
		"lilian_day": Array<lilian_day>;
		"lilian_rise": Array<lilian_rise>;
		"xianwei_task": Array<xianwei_task>;
		"xianwei_rise": Array<xianwei_rise>;
		"kuanghai_task": Array<kuanghai_task>;
		"kuanghai_rise": Array<kuanghai_rise>;
		"kuanghai2_task": Array<kuanghai2_task>;
		"kuanghai2_rise": Array<kuanghai2_rise>;
		"shenbing_feed": Array<shenbing_feed>;
		"zhizhun_feed": Array<zhizun_feed>;
		"shenbing_magicshow": Array<shenbing_magicShow>;
		"shenbing_refine": Array<shenbing_refine>;
		"wing_feed": Array<wing_feed>;
		"wing_magicshow": Array<wing_magicShow>;
		"wing_refine": Array<wing_refine>;
		"xunbao_oper": Array<xunbao_oper>;
		"xunbao_weight": Array<xunbao_weight>;
		"xunbao_exchange": Array<xunbao_exchange>;
		"privilege": Array<privilege>;
		"mall": Array<mall>;
		"failure_stronger": Array<failure_stronger>;
		"broadcast": Array<broadcast>;
		"recharge": Array<recharge>;
		"first_pay": Array<first_pay>;
		"weekly_tasks": Array<seven_activity>;
		"user_halo": Array<hero_aura>;
		"demon_order": Array<demon_orderGift>;
		"heroaura_item": Array<hero_awardItem>
		"day_pay": Array<day_pay>;
		"cumulate_pay": Array<cumulate_pay>;
		"cumulate_pay2": Array<cumulate_pay2>;
		"cumulate_pay3": Array<cumulate_pay3>;
		"continue_pay": Array<continue_pay>;
		"zero_buy": Array<zero_buy>;
		"one_buy": Array<one_buy>;
		"consume_reward": Array<consume_reward>;
		"consume_reward2": Array<consume_reward2>;
		"invest_reward": Array<invest_reward>;
		"sprint_rank_task": Array<sprint_rank_task>;
		"sprint_rank": Array<sprint_rank>;
		"feisheng_rank_task": Array<feisheng_rank_task>;
		"feisheng_rank": Array<feisheng_rank>;
		"pay_reward_weight": Array<pay_reward_weight>;
		"pay_reward_reward": Array<pay_reward_reward>;
		"duobao_weight": Array<duobao_weight>;
		"duobao_reward": Array<duobao_reward>;
		"duobao_rank": Array<duobao_rank>;
		"jzduobao_weight": Array<jzduobao_weight>;
		"jzduobao_reward": Array<jzduobao_reward>;
		"jzduobao_rank": Array<jzduobao_rank>;
		"gushen_task": Array<gushen_task>;
		"gushen": Array<gushen>;
		"kuanghuan": Array<kuanghuan>;
		"discount_gift": Array<discount_gift>;
		"everyday_rebate": Array<everyday_rebate>;
		"login_reward": Array<login_reward>;
		"cumulate_pay_fs": Array<cumulate_pay_fs>;
		"pay_single_fs": Array<pay_single_fs>;
		"ceremony_single_pay": Array<ceremony_danbi>;
		"consume_reward_fs": Array<consume_reward_fs>;
		"rush_buy_fs": Array<rush_buy_fs>;
		"discount_gift_fs": Array<discount_gift_fs>;
		"item_rune": Array<item_rune>;
		"rune_refine": Array<runeRefine>;
		"scene_copy_rune": Array<scene_copy_rune>;
		"rune_dial": Array<rune_dial>;
		"rune_compose": Table<rune_compose>;
		"rune_collect_grade": Array<rune_collect_grade>;
		"rune_collect_rise": Array<rune_collect_rise>;
		"xiangyao": Array<xiangyao>;
		"scene_copy_nine": Array<scene_copy_nine>;
		"chat_expression": Array<chatExpression>;
		"xianfu": Array<xianfu>;
		"xianfu_travel": Array<xianfu_travel>;
		"xianfu_illustrated_handbook": Array<xianfu_illustrated_handbook>;
		"xianfu_animal": Array<xianfu_animal>;
		"scene_homestead": Array<scene_homestead>;
		"xianfu_task": Array<xianfu_task>;
		"xianfu_fengshui": Array<xianfu_fengshui>;
		"xianfu_decorate": Array<xianfu_decorate>;
		"xianfu_skill": Array<xianfu_skill>;
		"xianfu_build": Array<xianfu_build>;
		"tianti": Array<tianti>;
		"tianti_awards": Array<tianti_awards>;
		"activity_all": Array<activity_all>;
		"scene_riches": Array<scene_riches>;
		"adventure_child": Array<adventure_child>;
		"adventure_task": Array<adventure_task>;
		"scene_copy_cloudland": Array<scene_copy_cloudland>;
		"fairy": Array<fairy>;
		"guide": Array<guide>;
		"adventure_exchange": Array<adventure_exchange>;
		"tips": Array<tips>;
		"action_preview": Array<action_preview>;
		"online_reward_entrance": Array<online_reward_entrance>;
		"designation": Array<designation>;
		"faction": Array<faction>;
		"faction_box": Array<faction_box>;
		"scene_copy_faction": Array<scene_copy_faction>;
		"faction_boss_award": Array<faction_boss_award>;
		"faction_skill": Array<faction_skill>;
		"fight_team": Array<clan>;
		"fight_team_skill": Array<clan_skill>;
		"fight_team_build": Array<clan_build>;
		"fight_team_level_award": Array<clan_gradeAward>;
		"xuanhuo_rank_fightteam_award": Array<xuanhuoRankAward>;
		"jiuxiaoling_award": Array<jiuXiaoLingAward>;
		"jiuxiaoling_task": Array<jiuXiaoLingTask>;
		"xuanhuo_rank_person_award": Array<xuanhuoRankAward>;
		"xuanhuo_achievement_award": Array<xuanhuoAchievement>;
		"xuanhuo_task_award": Array<xuanhuoGetAward>;
		"zhulu_achievement_award": Array<zhuluAchievementAward>;
		"zhulu_headerwar_damage_award": Array<zhuluHeaderDamageAward>;

		"zhulu_war_rank_award": Array<zhuluWarRankAward>;
		"zhulu_blessed_award_display": Array<zhuluBlessedAwardDisplay>;
		"arena": Array<arena>;
		"fashion_feed": Array<fashion_feed>;
		"fashion_magicshow": Array<fashion_magicShow>;
		"fashion_refine": Array<fashion_refine>;
		"guanghuan_feed": Array<guanghuan_feed>;
		"guanghuan_magicshow": Array<guanghuan_magicShow>;
		"guanghuan_refine": Array<guanghuan_refine>;
		"tianzhu_feed": Array<tianzhu_feed>;
		"tianzhu_magicshow": Array<tianzhu_magicShow>;
		"tianzhu_refine": Array<tianzhu_refine>;
		"xilian_rise": Array<xilian_rise>;
		"shenqi": Array<shenqi>;
		"attr_skill": Table<attr_skill>;
		"attr_item": Table<attr_item>;
		"attr_buff": Table<attr_buff>;
		"equip_suit": Array<equip_suit>;
		"single_pay_jade": Array<single_pay_jade>;
		"single_pay_print": Array<single_pay_print>;
		"week_single_pay": Array<week_single_pay>;
		"week_login": Array<week_login>;
		"week_accumulate": Array<week_accumulate>;
		"week_consume": Array<week_consume>;
		"consume_rank": Array<consume_rank>;
		"limit_pack": Array<limit_pack>;
		"fight_talisman": Array<fight_talisman>;
		"money_cat": Array<money_cat>;
		"yuge": Array<yuge>;
		"gauntlet": Array<gauntlet>;
		"xiandan": Array<xiandan>;
		"xianfu_mall2": Array<xianfu_mall2>;
		"retrieve_res": Table<retrieve_res>;
		"retrieve_lilian": Table<retrieve_lilian>;
		"prevent_fool": Array<prevent_fool>;
		"head": Array<head>;
		"ceremony_geocaching_rank": Array<ceremonyGeocachingRank>;
		"ceremony_geocaching_score_award": Array<ceremonyGeocachingScoreAward>;
		"celebration_continue_pay": Array<celebration_continue_pay>;

		"marry_doll": Array<marry_doll>;
		"marry_doll_grade": Array<marry_doll_grade>;
		"marry_keepsake_grade": Array<marry_keepsake_grade>;
		"marry_intimacy": Array<marry_intimacy>;
		"marry_keepsake": Array<marry_keepsake>;
		"marry_ring": Array<marry_ring>;
		"marry_doll_skill": Array<marry_doll_skill>;
		"marry_ring_skill": Array<marry_ring_skill>;
		"marry_keepsake_skill": Array<marry_keepsake_skill>;
		"marry_doll_refine": Array<marry_doll_refine>;
		"marry_task": Array<marry_task>;
		"marry_package": Array<marry_package>;
		"limit_xunbao_weight": Array<fishing_cfg>
		"limit_xunbao_cash_gift": Array<fish_gift_cfg>
		"limit_xunbao_mall": Array<limit_mall_cfg>
		"limit_xunbao_continue_pay": Array<xunbao_continue_pay>
		"limit_xunbao_exchange": Array<limit_xunbao_exchange_cfg>
		"limit_xunbao_rank": Array<limit_xunbao_rank>
		"limit_xunbao_cumulative_task": Array<limit_xunbao_cumulative_task_cfg>
		"fightTeam_boss_award": Array<fightTeam_boss_award>
		"zhulu_Integral_award": Array<fightTeam_score_award>
		"scene_copy_teamBattle": Array<scene_copy_teamBattle>
		"di_shu": Array<di_shu_cfg>
		"exterior_suit": Array<exterior_suit>
		"exterior_suit_feed": Array<exterior_suit_feed>

		"limit_xunbao_cumulate_pay": Array<limit_cumulate>
		"limit_xunbao_day_single_pay": Array<limit_daysingle>
		"limit_xunbao_day_cumulate_pay": Array<limit_day_cumulate>

	}
}