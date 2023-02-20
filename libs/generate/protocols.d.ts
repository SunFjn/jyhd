/*
+----------+-----------+-----------+
|len:uint16|code:uint32|data:byte[]|
+----------+-----------+-----------+
*/
declare namespace Protocols {
	const enum ProtocolMask {
		getroupMask = 0x7000000,
		ServiceMask = 0xf00000,
	}

	const enum GroupType {
		User = 0x0,
		System = 0x1000000,
		Bg = 0x2000000,
	}

	const enum ServiceType {
		Client = 0x0,
		Nexus = 0x100000,
		Feature = 0x200000,
		Chat = 0x300000,
		Cross = 0x400000,
		Map = 0x500000,
		Bg = 0x600000,
		Center = 0x700000,
		CrossT = 0x800000,
		End = 0x900000,
		Unknown = 0xffffffff,
	}

	const enum PairFields {
		first = 0,
		second = 1,
	}
	type Pair = [number, number];

	const enum ThreeNumberFields {
		v1 = 0,
		v2 = 1,
		v3 = 2,
	}
	type ThreeNumber = [number, number, number];

	const enum SceneIdFields {
		mapId = 0,			/*所在场景*/
		copyId = 1,			/*副本Id*/
		level = 2,			/*场景层数*/
		factionId = 3,			/*仙盟id*/
	}
	type SceneId = [number, number, number, string];

	const enum KeyValueFields {
		key = 0,
		value = 1,
	}
	type KeyValue = [string, number];

	const enum PosFields {
		x = 0,			/*X 坐标*/
		y = 1,			/*Y 坐标*/
	}
	type Pos = [number, number];

	const enum SceneInfoFields {
		SceneId = 0,
		enterPos = 1,
		curPos = 2,
		direction = 3,			/*朝向*/
	}
	type SceneInfo = [SceneId, Pos, Pos, number];

	const enum TypesAttrFields {
		type = 0,
		value = 1,
	}
	type TypesAttr = [number, number];

	const enum HuamnBaseDataFields {
		name = 0,			/*角色名*/
		occ = 1,			/*职业*/
		eraLvl = 2,			/*觉醒等级*/
		eraNum = 3,			/*觉醒重数*/
		ai = 4,			/*AI*/
		level = 5,			/*level*/
		sight = 6,			/*视野*/
		atkDistance = 7,			/*攻击距离*/
		hp = 8,			/*剩余血量*/
		pgId = 9,			/*所在服ID 生成角色为0的ID*/
		vip = 10,
		createTime = 11,			/*创角时间*/
		factionId = 12,			/*帮派ID*/
		riseId = 13,			/*仙位id*/
		lilianLevel = 14,			/*历练等级*/
		fight = 15,			/*战力*/
		contribution = 16,			/*仙盟贡献值*/
		sbId = 17,			/*神兵id*/
		rideId = 18,			/*精灵id*/
		wingId = 19,			/*翅膀id*/
		fashionId = 20,			/*时装id*/
		tianZhuId = 21,			/*天珠id*/
		vipF = 22,
	}
	type HuamnBaseData = [string, number, number, number, number, number, number, number, number, number, number, number, string, number, number, number, number, number, number, number, number, number, number];

	const enum SkillFields {
		skillId = 0,			/*技能ID*/
		level = 1,			/*技能等级*/
	}
	type Skill = [number, number];

	/*属性*/
	const enum extendAttrFields {
		id = 0,			/*属性ID*/
		type = 1,			/*属性类型*/
		value = 2,			/*属性值*/
	}
	type extendAttr = [number, number, number];

	/*属性*/
	const enum TypeAttrFields {
		type = 0,			/*属性类型*/
		value = 1,			/*属性值*/
		color = 2,			/*颜色品质*/
	}
	type TypeAttr = [number, number, number];

	/*装备镶嵌的宝石*/
	const enum GemGridFields {
		itemId = 0,			/*宝石ID*/
		number = 1,			/*编号 0 1 2 3 4*/
	}
	type GemGrid = [number, number];

	const enum GemGridsFields {
		part = 0,			/*装备部位*/
		gems = 1,			/*仙石列表*/
	}
	type GemGrids = [number, Array<GemGrid>];

	const enum StrongGridsFields {
		part = 0,			/*装备部位*/
		level = 1,			/*等级*/
	}
	type StrongGrids = [number, number];

	const enum XilianSlotFields {
		num = 0,			/*编号槽 0~5*/
		attr = 1,			/*锻造属性*/
		min = 2,			/*当前颜色最小值*/
		max = 3,			/*当前颜色最大值*/
		isLock = 4,			/*是否勾选锁定*/
		state = 5,			/*XilianState 0:未开启 1:可开启 2:已开启*/
	}
	type XilianSlot = [number, TypeAttr, number, number, boolean, number];

	const enum XilianFields {
		part = 0,			/*部位*/
		slots = 1,
		score = 2,			/*锻造评分*/
	}
	type Xilian = [number, Array<XilianSlot>, number];

	const enum ZhuhunGridsFields {
		part = 0,			/*装备部位*/
		level = 1,			/*等级*/
		exp = 2,			/*经验*/
	}
	type ZhuhunGrids = [number, number, number];

	const enum ShihunGridsFields {
		sClass = 0,			/*类型*/
		level = 1,			/*等级*/
	}
	type ShihunGrids = [number, number];

	/*装备详细信息*/
	const enum IMsgFields {
		blueAttr = 0,			/*蓝色属性id*/
		purpleAttr = 1,			/*紫色属性id*/
		orangeAttr = 2,			/*橙色属性id*/
		xilianAttr = 3,			/*锻造属性*/
		gems = 4,			/*仙石*/
		strongLvl = 5,			/*强化等级*/
		baseScore = 6,			/*装备评分*/
		totalScore = 7,			/*综合评分*/
		zhuhunLvl = 8,			/*铸魂等级*/
	}
	type IMsg = [Array<extendAttr>, Array<extendAttr>, Array<extendAttr>, Array<TypeAttr>, GemGrids, number, number, number, number];

	/*道具*/
	const enum ItemFields {
		ItemId = 0,			/*道具ID*/
		count = 1,			/*数量*/
		uid = 2,			/*道具唯一ID*/
		iMsg = 3,			/*装备属性*/
	}
	type Item = [number, number, number, IMsg];

	const enum ItemsFields {
		ItemId = 0,			/*道具ID*/
		count = 1,			/*数量*/
	}
	type Items = [number, number];

	/*着装*/
	const enum PartItemFields {
		part = 0,			/*部位*/
		item = 1,			/*道具*/
	}
	type PartItem = [number, Item];

	/*道具操作*/
	const enum ItemOperFields {
		item = 0,			/*道具*/
		type = 1,			/*0:新增 1:增加数量 2:删除uid 3:减少数量 4:更新*/
	}
	type ItemOper = [Item, number];

	/*背包操作*/
	const enum BagOperFields {
		bagId = 0,			/*背包ID*/
		itemOpers = 1,			/*道具更新列表*/
		source = 2,			/*道具来源或去向*/
	}
	type BagOper = [number, Array<ItemOper>, number];

	/*外观*/
	const enum ActorShowFields {
		objId = 0,                                      /*角色ID*/
		occ = 1,                                        /*角色职业*/
		eraLvl = 2,                                     /*转生等级*/
		eraNum = 3,                                     /*转生重数*/
		level = 4,                                      /*等级*/
		name = 5,                                       /*角色名*/
		weapon = 6,                                     /*武器*/
		clothes = 7,                                    /*衣服*/
		pet = 8,                                        /*灵宠*/
		ride = 9,                                       /*仙器*/
		wing = 10,                                      /*羽翼*/
		factionId = 11,                                 /*帮派*/
		pgId = 12,                                      /*服ID 生成角色为0的ID*/
		fight = 13,                                     /*战力*/
		petFazhen = 14,                                 /*灵宠法阵*/
		rideFazhen = 15,                                /*仙器法阵*/
		runState = 16,                                  /*冲刺状态*/
		desgnation = 17,                                /*称号ID*/
		tianZhu = 18,                                   /*天珠ID*/
		factionName = 19,                               /*仙盟名字*/
		riseId = 20,                                    /*仙位id*/
		fightTeamId = 21,                               /*战队id*/
		fightTeamName = 22,                             /*战队名称*/
		fightTeamSkillHalo = 23,                        /*战队技能光环*/
		marryDoll = 24,                                 /*仙娃*/
		guanghuan = 25,                                 /**光环 */
		headImg = 26,                                   /**头像 */
	}
	type ActorShow = [number, number, number, number, number, string, number, number, number, number, number, string, number, number, number, number, boolean, number, number, string, number, string, string, Array<number>, number, number, number];

	/*角色排行外观*/
	const enum ActorRankShowFields {
		objId = 0,			/*角色ID*/
		fashion = 1,			/*时装*/
		shenbing = 2,			/*神兵*/
		wing = 3,			/*翅膀*/
		pet = 4,			/*宠物*/
		ride = 5,			/*精灵*/
		amulet = 6,			/*圣物属性*/
		occ = 7,			/*职业*/
		petStar = 8,			/*宠物星级*/
		rideStar = 9,			/*精灵星级*/
		tianZhu = 10,			/*天珠*/
	}
	type ActorRankShow = [number, number, number, number, number, number, number, number, number, number, number];

	/*角色排行外观*/
	const enum ActorCrossRankShowFields {
		objId = 0,			/*角色ID*/
	}
	type ActorCrossRankShow = [number];

	const enum TaskNodeFields {
		type = 0,			/*任务类型*/
		curNum = 1,			/*当前进度*/
		total = 2,			/*总进度*/
	}
	type TaskNode = [number, number, number];

	/*任务*/
	const enum SingleTaskFields {
		taskId = 0,			/*任务ID*/
		state = 1,			/*任务状态: 1:运行 2:达成*/
		nodes = 2,			/*子任务进度*/
	}
	type SingleTask = [string, number, Array<TaskNode>];

	const enum TaskOperFields {
		oper = 0,			/*1:添加 2:删除 3:更新进度、状态*/
		task = 1,
	}
	type TaskOper = [number, SingleTask];

	const enum SkillInfoFields {
		skillId = 0,			/*技能id*/
		level = 1,			/*技能等级*/
		point = 2,			/*技能点数*/
	}
	type SkillInfo = [number, number, number];

	/*宠物培养/精灵培养*/
	const enum PetFeedFields {
		level = 0,			/*培养等级*/
		exp = 1,			/*当前经验值*/
		skillList = 2,			/*技能列表*/
		fighting = 3,			/*战力*/
	}
	type PetFeed = [number, number, Array<SkillInfo>, number];

	/*宠物升阶/精灵升阶*/
	const enum PetRankFields {
		star = 0,			/*星级*/
		blessing = 1,			/*当前祝福值*/
		showList = 2,			/*所有升阶外观*/
		skillList = 3,			/*技能列表*/
		fighting = 4,			/*战力*/
	}
	type PetRank = [number, number, Array<number>, Array<SkillInfo>, number];

	const enum MagicShowInfoFields {
		showId = 0,			/*幻化id*/
		star = 1,			/*星级*/
	}
	type MagicShowInfo = [number, number];

	/*宠物幻化/精灵幻化*/
	const enum PetMagicShowFields {
		showList = 0,			/*幻化列表*/
		fighting = 1,			/*战力*/
		attr = 2,			/*总属性*/
	}
	type PetMagicShow = [Array<MagicShowInfo>, number, Array<TypesAttr>];

	const enum RefineInfoFields {
		type = 0,			/*修炼类型 0悟性,1潜能,2根骨,3灵体(精灵：0锐,1御,2攻,3迅)*/
		level = 1,			/*星级*/
	}
	type RefineInfo = [number, number];

	/*宠物修炼/精灵修炼*/
	const enum PetRefineFields {
		list = 0,			/*修炼列表*/
		fighting = 1,			/*战力*/
		attr = 2,			/*总属性*/
	}
	type PetRefine = [Array<RefineInfo>, number, Array<TypesAttr>];

	/*宠物法阵*/
	const enum PetFazhenFields {
		fazhenId = 0,			/*当前使用的法阵id，0表示没使用*/
		fazhenList = 1,			/*法阵列表*/
		fighting = 2,			/*战力*/
		attr = 3,			/*幻化总属性*/
	}
	type PetFazhen = [number, Array<MagicShowInfo>, number, Array<TypesAttr>];

	const enum SoulRefineInfoFields {
		type = 0,			/*类型*/
		level = 1,			/*等级*/
	}
	type SoulRefineInfo = [number, number];

	/*金身修炼*/
	const enum SoulRefineFields {
		list = 0,			/*金身列表*/
		fighting = 1,			/*战力*/
	}
	type SoulRefine = [Array<SoulRefineInfo>, number];

	/*不败金身修炼*/
	const enum SoulRiseFields {
		level = 0,			/*不败金身等级*/
		point = 1,			/*是否可以升级*/
	}
	type SoulRise = [number, boolean];

	const enum AmuletRefineInfoFields {
		id = 0,			/*圣物id*/
		level = 1,			/*等级*/
	}
	type AmuletRefineInfo = [number, number];

	/*圣物升级*/
	const enum AmuletRefineFields {
		list = 0,			/*圣物列表*/
		fighting = 1,			/*战力*/
	}
	type AmuletRefine = [Array<AmuletRefineInfo>, number];

	/*圣物属性*/
	const enum AmuletRiseFields {
		level = 0,			/*修为等级*/
		cultivation = 1,			/*当前修为*/
	}
	type AmuletRise = [number, number];

	const enum ActorRankFields {
		objId = 0,			/*玩家ID*/
		name = 1,			/*玩家名*/
		rank = 2,			/*排名*/
	}
	type ActorRank = [number, string, number];

	/*排行*/
	const enum RankFields {
		objId = 0,			/*玩家ID*/
		occ = 1,			/*职业*/
		name = 2,			/*玩家名*/
		vip = 3,			/*VIP*/
		rank = 4,			/*排名*/
		param = 5,
		vipF = 6,			/*VIPF*/
		headImg = 7,        /*头像id*/
	}
	type Rank = [number, number, string, number, number, number, number, number];

	const enum RankDataFields {
		objId = 0,			/*玩家ID*/
		param = 1,			/*排行数据*/
		type = 2,			/*排行类型 RankType*/
		rank = 3,			/*当前排行 0:未入榜*/
	}
	type RankData = [number, number, number, number];

	/*排行列表*/
	const enum RankListFields {
		type = 0,			/*排行类型 RankType*/
		ranks = 1,			/*排行*/
	}
	type RankList = [number, Array<Rank>];

	/*请求角色排行*/
	const enum ReqRankDataFields {
		objId = 0,			/*角色ID*/
		type = 1,			/*排行类型 RankType*/
	}
	type ReqRankData = [number, number];

	/*等级、层数排行*/
	const enum ActorRankLevelFields {
		actorRank = 0,
		level = 1,			/*等级、层数*/
	}
	type ActorRankLevel = [ActorRank, number];

	/*伤害排行*/
	const enum HurtRankFields {
		actorRank = 0,
		hurt = 1,			/*伤害累计*/
	}
	type HurtRank = [ActorRank, number];

	/*关卡、层数副本数据*/
	const enum LevelCopyDataFields {
		finishLevel = 0,			/*已完成层数*/
		award = 1,			/*可领的奖励层数*/
		bigAward = 2,			/*可领的大奖层数*/
	}
	type LevelCopyData = [number, Array<number>, Array<number>];

	/*关卡、层数副本数据*/
	const enum SV_LevelCopyDataFields {
		mapId = 0,
		finishLevel = 1,			/*已完成层数*/
		isFirst = 2,			/*是否第一次进入*/
	}
	type SV_LevelCopyData = [number, number, boolean];

	/*仙府-家园场景内数据*/
	const enum SV_HomesteadDataFields {
		isExit = 0,			/*是否中途退出*/
		wheel = 1,			/*轮数*/
		ware = 2,			/*波数*/
		list = 3,			/*场景内怪物数量*/
		hp = 4,			/*场景内怪物血量*/
		itemList = 5,			/*小怪奖励*/
	}
	type SV_HomesteadData = [boolean, number, number, Array<number>, Array<number>, Array<Pair>];

	/*仙府-家园家园副本数据*/
	const enum SV_XianFuCopyDataFields {
		level = 0,			/*仙府-家园等级*/
		buildList = 1,			/*开启的建筑列表id和等级*/
		eventId = 2,			/*事件id*/
		endTime = 3,			/*事件结束时间*/
		data = 4,			/*场景内数据*/
	}
	type SV_XianFuCopyData = [number, Array<Pair>, number, number, SV_HomesteadData];

	/*奇遇数据*/
	const enum SV_AdventureDataFields {
		id = 0,			/*大类id*/
		child = 1,			/*小类id*/
		value = 2,			/*复仇值*/
	}
	type SV_AdventureData = [number, number, number];

	/*仙盟数据*/
	const enum SV_FactionDataFields {
		id = 0,			/*仙盟id*/
		time = 1,			/*逗留时间*/
		copper = 2,			/*金币鼓舞次数*/
		gold = 3,			/*代币券鼓舞次数*/
	}
	type SV_FactionData = [string, number, number, number];

	/*副本数据*/
	const enum CopyDataFields {
		copyDatas = 0,			/*副本完成层数*/
		killMonsterWare = 1,			/*当前击杀怪物波数*/
		dropItemTime = 2,			/*挂机掉落道具更新时间 累计ms*/
		dropItemLZTime = 3,			/*挂机掉落龙珠更新时间 累计ms*/
		onhookIncomeTime = 4,			/*挂机收益更新时间 累计ms*/
		boxRemainTimes = 5,			/*开宝箱剩余次数*/
		teamCopyMaxWare = 6,			/*组队副本最大波数*/
		nineCopyScore = 7,			/*九天之巅当前层数积分*/
		nineCopyDeadTimes = 8,			/*九天之巅当前层数死亡次数*/
		homesteadData = 9,			/*家园副本数据*/
		tiantiSeg = 10,			/*天梯段位*/
		tiantiContinueWinTimes = 11,			/*天梯次数*/
		gatherCount = 12,			/*天降财宝采集次数*/
		cloudlandTimes = 13,			/*云梦秘境次数*/
		adventure = 14,			/*奇遇数据*/
		swimTime = 15,			/*瑶池逗留时间*/
		swimBuffTime = 16,			/*瑶池Buff时间*/
		fairyId = 17,			/*拦截的仙女id*/
		isDouble = 18,			/*是否双倍*/
		factionData = 19,			/*仙盟数据*/
		arenaRank = 20,			/*当前竞技场排名*/
		bestArenaRank = 21,			/*当前竞技场排名*/
	}
	type CopyData = [Array<SV_LevelCopyData>, number, number, number, number, number, number, number, number, SV_XianFuCopyData, number, number, number, number, SV_AdventureData, number, number, number, boolean, SV_FactionData, number, number];

	/*单人BOSS状态*/
	const enum SingleBossCopyFields {
		level = 0,			/*单人BOSS层数*/
		remainTimes = 1,			/*剩余次数*/
		reviveTime = 2,			/*BOSS复活时间*/
	}
	type SingleBossCopy = [number, number, number];

	/*功能开启*/
	const enum ActionOpenFields {
		id = 0,			/*功能ID*/
		state = 1,			/*功能状态 1:开启状态 2:关闭状态*/
		first = 2,			/*外层下标*/
		second = 3,			/*内层下标*/
	}
	type ActionOpen = [number, number, number, number];

	/*天数状态*/
	const enum GiftStateFields {
		day = 0,			/*天数*/
		state = 1,			/*礼包状态 1:已领*/
	}
	type GiftState = [number, number];

	/*购买状态*/
	const enum OpenGiftFields {
		rewardId = 0,			/*礼包Id*/
		state = 1,			/*礼包状态 1:已购买*/
	}
	type OpenGift = [number, number];

	/*在线礼包*/
	const enum OnlineRewardFields {
		id = 0,			/*id*/
		state = 1,			/*状态 0未达成 1可领取 2已领取*/
		time = 2,			/*剩余时间 秒*/
	}
	type OnlineReward = [number, number, number];

	/*收益*/
	const enum IncomeFields {
		type = 0,			/*收益类型 虚拟道具*/
		param = 1,			/*参数*/
		itemId = 2,
		additionType = 3,        /*加成类型*/
	}
	type Income = [number, number, number, number];

	/*邮件状态*/
	const enum EmailStateFields {
		uuid = 0,			/*唯一ID*/
		state = 1,			/*邮件状态 0:未读 1:已读 2:已领*/
	}
	type EmailState = [string, number];

	/*邮件*/
	const enum EmailFields {
		uuid = 0,			/*唯一ID*/
		title = 1,			/*唯一ID*/
		content = 2,			/*邮件内容*/
		own = 3,			/*所属*/
		create_time = 4,			/*创建时间*/
		state = 5,			/*邮件状态 0:未读 1:已读 2:已领*/
		items = 6,			/*附件*/
		end_time = 7,			/*邮件销毁时间*/
		source = 8,			/*来源*/
	}
	type Email = [string, string, string, number, number, number, Array<Item>, number, number];

	/*角色邮件信息*/
	const enum CharEmailListFields {
		actorId = 0,			/*角色id*/
		numberList = 1,			/*数字附加参数*/
		stringList = 2,			/*字符串附加参数*/
	}
	type CharEmailList = [number, Array<number>, Array<string>];

	const enum EmailListFields {
		pgId = 0,			/*服ID*/
		emailType = 1,			/*类型*/
		charList = 2,			/*角色列表*/
		source = 3,			/*来源*/
		params = 4,			/*邮件附加参数*/
	}
	type EmailList = [number, number, Array<CharEmailList>, number, Array<number>];

	const enum ItemsCenterFields {
		Items = 0,			/*道具列表*/
		source = 1,			/*来源*/
		uuid = 2,
	}
	type ItemsCenter = [Array<Item>, number, string];

	const enum UuidStateFields {
		uuid = 0,
		state = 1,
	}
	type UuidState = [string, number];

	/*关注BOSS*/
	const enum FollowBossFields {
		occ = 0,			/*BOSS id*/
		follow = 1,			/*true:关注 false:取消*/
	}
	type FollowBoss = [number, boolean];

	/*击杀记录*/
	const enum KillReocrdFields {
		killer = 0,			/*最后击杀者*/
	}
	type KillReocrd = [string];

	/*BOSS状态*/
	const enum BossStateFields {
		dead = 0,			/*是否死亡状态*/
		hpPer = 1,			/*当前血量比*/
		reviveTime = 2,			/*复活时间*/
		killerNum = 3,			/*当前击杀人数*/
		wudiTime = 4,			/*无敌剩余时间*/
		totalHpPer = 5,			/*三界BOSS使用,相对于上一次的血量比*/
	}
	type BossState = [boolean, number, number, number, number, number];

	/*BOSS信息*/
	const enum BossInfoFields {
		occ = 0,			/*BOSS id*/
		killRecord = 1,			/*击杀记录*/
		bossState = 2,			/*BOSS状态*/
		pos = 3,
	}
	type BossInfo = [number, KillReocrd, BossState, Pos];

	const enum DelSceneTimesFields {
		level = 0,			/*层数*/
		isDelTimes = 1,			/*当前进入是否扣除次数*/
	}
	type DelSceneTimes = [number, boolean];

	/*BOSS次数*/
	const enum BossTimesFields {
		sceneType = 0,			/*场景类型 SceneTypeEx*/
		totalTimes = 1,			/*总次数*/
		remainTimes = 2,			/*剩余次数*/
		recoverTime = 3,			/*到点恢复一次 ms*/
		delTimes = 4,
	}
	type BossTimes = [number, number, number, number, Array<DelSceneTimes>];

	/*击杀怪物*/
	const enum KillMonsterFields {
		killer = 0,			/*击杀者*/
		occ = 1,			/*id*/
		bossType = 2,			/*类型 0:普通怪 非0为BOSS类型*/
		count = 3,			/*数量*/
		sceneType = 4,
	}
	type KillMonster = [number, number, number, number, number];

	const enum SceneStateFields {
		mapId = 0,
		level = 1,
		state = 2,			/*true:开启 false:关闭*/
	}
	type SceneState = [number, number, boolean];

	const enum MoneyFields {
		copper = 0,
		gold = 1,
		bind_gold = 2,
	}
	type Money = [number, number, number];

	const enum InspireFields {
		type = 0,			/*鼓舞类型 1:金币鼓舞 2:代币券鼓舞*/
		times = 1,			/*鼓舞次数*/
		per = 2,			/*属性百分比*/
	}
	type Inspire = [number, number, number];

	const enum EraNodeFields {
		id = 0,			/*任务ID*/
		state = 1,			/*状态 0:未完成 1：完成 2：已领取*/
		progress = 2,			/*进度*/
	}
	type EraNode = [number, number, number];

	const enum CopyMonsterWareFields {
		totalWare = 0,			/*总波数 极限刷怪为0*/
		curWare = 1,			/*当前波数*/
		remainCount = 2,			/*当前波剩余数量*/
		killTotalCount = 3,			/*击杀总数量*/
	}
	type CopyMonsterWare = [number, number, number, number];

	const enum TeamCopyMonsterWareFields {
		curWare = 0,			/*当前波数*/
		state = 1,			/*false:不需要计时  true:需要计时*/
		jumpWare = 2,			/*跳跃波数*/
		finishWare = 3,			/*完成波数*/
		maxWare = 4,			/*最大波数*/
	}
	type TeamCopyMonsterWare = [number, boolean, number, number, number];

	const enum CopyTimesFields {
		mapId = 0,
		diffcultLevel = 1,			/*难度等级*/
		buyTimes = 2,			/*已购买次数*/
		maxRecord = 3,			/*最高纪录*/
		star = 4,			/*星级*/
		challengeTotalTimes = 5,			/*挑战总次数*/
		challengeRemainTimes = 6,			/*挑战剩余次数*/
		sweepTotalTimes = 7,			/*扫荡总次数*/
		sweepRemainTimes = 8,			/*扫荡剩余次数*/
		isPass = 9,			/*是否通关*/
		sweepTimes = 10,			/*当天扫荡过的次数*/
	}
	type CopyTimes = [number, number, number, number, number, number, number, number, number, boolean, number];

	const enum FinishCopyDataFields {
		mapId = 0,			/*场景ID*/
		finishLevel = 1,			/*已完成层数*/
		curStar = 2,			/*当前星级*/
		awardType = 3,			/*奖励类型*/
		awardCount = 4,			/*奖励数量*/
		success = 5,			/*是否成功*/
	}
	type FinishCopyData = [number, number, number, number, number, boolean];

	const enum BossJoinFields {
		objId = 0,
		actorLevel = 1,
		actorEraLevel = 2,
		ismvp = 3,			/*是否是MVP*/
		pgId = 4,
	}
	type BossJoin = [number, number, number, boolean, number];

	const enum BossJudgeFields {
		objId = 0,
		actorLevel = 1,
		actorEraLevel = 2,
		ismvp = 3,			/*是否是MVP*/
		isKiller = 4,			/*是否击杀者*/
		pgId = 5,
	}
	type BossJudge = [number, number, number, boolean, boolean, number];

	const enum InspireInfoFields {
		objId = 0,
		actorLevel = 1,
		actorEraLevel = 2,
		goldInspireNum = 3,			/*代币券鼓舞次数*/
		copperInspireNum = 4,			/*铜币鼓舞次数*/
		reliveTimes = 5,			/*复活次数*/
		pgId = 6,
	}
	type InspireInfo = [number, number, number, number, number, number, number];

	const enum BossRankRecordFields {
		actorRank = 0,
		hurt = 1,			/*伤害累计*/
		rankAward = 2,
	}
	type BossRankRecord = [ActorRank, number, Array<Item>];

	/*历练任务*/
	const enum LilianTaskNodeFields {
		id = 0,			/*id*/
		state = 1,			/*状态 0未达成 1可领取 2已领取*/
		progress = 2,			/*进度*/
	}
	type LilianTaskNode = [number, number, number];

	/*仙位任务*/
	const enum XianweiTaskNodeFields {
		id = 0,			/*id*/
		state = 1,			/*状态 0未达成 1可领取 2已领取*/
		progress = 2,			/*进度*/
	}
	type XianweiTaskNode = [number, number, number];

	/*单个阶层俸禄*/
	const enum XianweiWageNodeFields {
		riseId = 0,			/*id*/
		state = 1,			/*状态 0未达成 1可领取 2已领取*/
	}
	type XianweiWageNode = [number, number];

	/*狂嗨任务*/
	const enum KuanghaiTaskNodeFields {
		id = 0,			/*id*/
		state = 1,			/*状态 0未达成 1可领取 2已领取*/
		progress = 2,			/*进度*/
	}
	type KuanghaiTaskNode = [number, number, number];
	/*狂嗨任务 daw*/
	const enum Kuanghai2TaskNodeFields {
		id = 0,			/*id*/
		state = 1,			/*状态 0未达成 1可领取 2已领取*/
		progress = 2,			/*进度*/
	}
	type Kuanghai2TaskNode = [number, number, number];
	/*狂嗨档次*/
	const enum KuanghaiGradeNodeFields {
		grade = 0,			/*grade*/
		state = 1,			/*状态 0未达成 1可领取 2已领取*/
	}
	type KuanghaiGradeNode = [number, number];
	/*狂嗨2档次*/
	const enum Kuanghai2GradeNodeFields {
		grade = 0,			/*grade*/
		state = 1,			/*状态 0未达成 1可领取 2已领取*/
	}
	type Kuanghai2GradeNode = [number, number];
	/*奖励状态*/
	const enum AwardStateFields {
		index = 0,			/*序号 0~N*/
		state = 1,			/*状态 0未达成 1可领取 2已领取*/
	}
	type AwardState = [number, number];

	/*掉落归属*/
	const enum DropOwnFields {
		occ = 0,			/*BOSS id*/
		objId = 1,			/*拥有掉落归属的玩家*/
		name = 2,			/*拥有掉落归属的玩家名*/
	}
	type DropOwn = [number, number, string];

	/*珍品宝箱次数*/
	const enum BoxTimesFields {
		totalTimes = 0,			/*总次数*/
		remainTimes = 1,			/*剩余次数*/
		addTimes = 2,			/*添加的次数*/
	}
	type BoxTimes = [number, number, number];

	const enum XunbaoNoteFields {
		name = 0,			/*角色名*/
		itemId = 1,			/*物品id*/
		grade = 2,			/*物品等级*/
	}
	type XunbaoNote = [string, number, number];

	const enum LoginDataFields {
		objId = 0,			/*用户唯一id*/
		sceneInfo = 1,			/*登录场景*/
		baseData = 2,			/*基本信息*/
		skills = 3,			/*技能列表*/
		copyData = 4,			/*副本数据*/
		skillPer = 5,			/*技能系数*/
	}
	type LoginData = [number, SceneInfo, HuamnBaseData, Array<Skill>, CopyData, number];

	const enum TeamMemberFields {
		objId = 0,
		name = 1,			/*角色名*/
		occ = 2,			/*职业*/
		level = 3,			/*level*/
		pgId = 4,			/*服ID 生成角色为0的ID*/
		fight = 5,			/*战力*/
		ai = 6,			/*AI*/
		seg = 7,			/*段位*/
		leader = 8,			/*是否是队长*/
		show = 9,
		headImg = 10,		/*头像*/
	}
	type TeamMember = [number, string, number, number, number, number, number, number, boolean, ActorShow, number];

	const enum MallNodeFields {
		id = 0,			/*id*/
		limitCount = 1,			/*购买次数*/
	}
	type MallNode = [number, number];

	const enum TeamCopyTimesFields {
		totalTimes = 0,			/*总次数*/
		remainTimes = 1,			/*剩余次数*/
		addTimes = 2,			/*购买次数*/
		maxRecord = 3,			/*自己最高纪录*/
	}
	type TeamCopyTimes = [number, number, number, number];

	const enum TeamCopyRankFields {
		objId = 0,			/*玩家ID*/
		occ = 1,			/*职业*/
		name = 2,			/*玩家名*/
		pgId = 3,			/*pgId*/
		ware = 4,			/*最大波数*/
		fight = 5,			/*战力*/
	}
	type TeamCopyRank = [number, number, string, number, number, number];

	const enum RechargeInfoFields {
		index = 0,			/*充值档位*/
		count = 1,			/*充值次数*/
	}
	type RechargeInfo = [number, number];

	const enum RechargeOrderFields {
		orderId = 0,			/*订单号*/
		objId = 1,			/*玩家id*/
		index = 2,			/*充值档位*/
		money = 3,			/*充值人民币*/
		time = 4,			/*充值时间*/
		isFake = 5,			/*是否是假订单*/
	}
	type RechargeOrder = [string, number, number, number, number, boolean];

	const enum BuffFields {
		unique = 0,			/*唯一ID*/
		buffId = 1,			/*buff Id*/
		paramType = 2,			/*参数类型 1:加值 2:乘值(百分百比)*/
		param = 3,			/*buff值*/
		endTime = 4,			/*结束时间戳 -1:永久*/
	}
	type Buff = [number, number, number, number, number];

	const enum BuffOperFields {
		type = 0,			/*1: 添加 2:删除*/
		buffs = 1,
	}
	type BuffOper = [number, Array<Buff>];

	const enum ActorExtFields {
		level = 0,			/*等级*/
		fight = 1,			/*战力*/
		eraLevel = 2,			/*觉醒等级*/
		eraNum = 3,			/*觉醒重数*/
		tiantiSeg = 4,			/*天梯段位*/
	}
	type ActorExt = [number, number, number, number, number];

	const enum ReqImgDataFields {
		agentId = 0,
		type = 1,			/*类型 1:等级 2:战力 3:觉醒*/
		range = 2,			/*范围*/
	}
	type ReqImgData = [number, number, Pair];

	const enum ImgDataFields {
		baseData = 0,			/*基本信息*/
		skills = 1,			/*技能列表*/
		attr = 2,			/*机器人属性*/
		petAttr = 3,			/*宠物属性*/
		show = 4,
		skillPer = 5,			/*技能系数*/
		actorExt = 6,
		copyData = 7,
	}
	type ImgData = [HuamnBaseData, Array<Skill>, Array<TypesAttr>, Array<TypesAttr>, ActorShow, number, ActorExt, CopyData];

	const enum RobotLoginDataFields {
		loginData = 0,
		attr = 1,			/*机器人属性*/
		petAttr = 2,			/*宠物属性*/
		show = 3,
	}
	type RobotLoginData = [LoginData, Array<TypesAttr>, Array<TypesAttr>, ActorShow];

	const enum PrivilegeDataFields {
		id = 0,			/*对应特权id*/
		value = 1,
		exValue = 2,			/*额外参数，比如副本特权对应的副本id*/
	}
	type PrivilegeData = [number, number, number];

	const enum XunbaoHintFields {
		type = 0,			/*类型 0装备 1巅峰 2至尊 3仙符 4圣物*/
		hintList = 1,			/*勾选提醒id列表*/
	}
	type XunbaoHint = [number, Array<number>];

	const enum RuneSlotFields {
		id = 0,			/*玉荣槽序号id*/
		itemId = 1,			/*玉荣槽镶嵌玉荣id，0没镶嵌*/
	}
	type RuneSlot = [number, number];

	const enum XiangyaoReceivedTimesFields {
		monste = 0,			/*小怪领取次数*/
		boss = 1,			/*boss领取次数*/
	}
	type XiangyaoReceivedTimes = [number, number];

	const enum DaypayRewardFields {
		index = 0,			/*档位*/
		state = 1,			/*状态(0不可领 1可领取 2已领取)*/
	}
	type DaypayReward = [number, number];

	const enum CumulatepayRewardFields {
		id = 0,			/*档位*/
		state = 1,			/*状态(0不可领 1可领取 2已领取)*/
	}
	type limit_CumulateReward = [number, number];

	const enum limit_CumulateRewardFields {
		id = 0,			/*档位*/
		state = 1,			/*状态(0不可领 1可领取 2已领取)*/
	}
	type CumulatepayReward = [number, number];

	const enum PaySingleFSRewardFields {
		id = 0,			/*档位*/
		useCount = 1,			/*已领数量*/
		restCount = 2,			/*未领数量*/
	}
	type PaySingleFSReward = [number, number, number];

	const enum ConsumeRewardFSRewardFields {
		id = 0,			/*档位*/
		state = 1,			/*状态(0不可领 1可领取 2已领取)*/
	}
	type ConsumeRewardFSReward = [number, number];

	const enum CopySceneStateFields {
		sceneType = 0,			/*场景类型*/
		sceneName = 1,			/*场景名*/
		state = 2,			/*1:预告 2:开启 3:关闭*/
		time = 3,			/*到下一状态的时间戳*/
		double = 4,			/*是否双倍*/
		doubleStartTime = 5,			/*双倍开始时间*/
		doubleCloseTime = 6,			/*双倍结束时间*/
	}
	type CopySceneState = [number, string, number, number, boolean, number, number];

	const enum NineCopyFields {
		remainTimes = 0,			/*剩余次数*/
		totalTimes = 1,			/*总次数*/
		reEnterTime = 2,			/*可以重新进入时间戳*/
		isPass = 3,			/*是否已通关*/
	}
	type NineCopy = [number, number, number, boolean];

	const enum XuanhuoCopyFields {
		reEnterTime = 0,			/*可以重新进入时间戳*/
	}
	type XuanhuoCopy = [number];

	const enum NineRankFields {
		objId = 0,
		actorName = 1,			/*角色名*/
		sceneName = 2,			/*场景名*/
		level = 3,			/*层数*/
		rank = 4,			/*排名*/
	}
	type NineRank = [number, string, string, number, number];

	const enum ContinuepayRewardFields {
		grade = 0,			/*档位*/
		day = 1,			/*第几天*/
		state = 2,			/*状态(0不可领 1可领取 2已领取)*/
	}
	type ContinuepayReward = [number, number, number];

	const enum CeremonyContinuepayRewardFields {
		grade = 0,			/*档位*/
		day = 1,			/*第几天*/
		state = 2,			/*状态(0不可领 1可领取 2已领取)*/
	}
	type CeremonyContinuepayReward = [number, number, number];

	const enum ContinuepayProgressFields {
		grade = 0,			/*档位*/
		day = 1,			/*第几天*/
	}
	type ContinuepayProgress = [number, number];

	const enum ZeroBuyRewardFields {
		grade = 0,			/*档位*/
		state = 1,			/*状态(0不可领 1可领取 2已领取)*/
	}
	type ZeroBuyReward = [number, number];

	const enum ZeroBuyExtraRewardFields {
		grade = 0,			/*档位*/
		state = 1,			/*状态(0不可领 1可领取 2已领取)*/
		restTm = 2,			/*结束时间戳*/
	}
	type ZeroBuyExtraReward = [number, number, number];

	const enum OneBuyRewardFields {
		id = 0,			/*id*/
		grade = 1,			/*档位*/
		state = 2,			/*状态(0不可领 1可领取 2已领取)*/
	}
	type OneBuyReward = [number, number, number];

	const enum ConsumerewardRewardFields {
		id = 0,			/*档位*/
		state = 1,			/*状态(0不可领 1可领取 2已领取)*/
	}
	type ConsumerewardReward = [number, number];

	const enum InvestrewardRewardFields {
		taskId = 0,			/*任务Id*/
		state = 1,			/*状态(0不可领 1可领取 2已领取)*/
	}
	type InvestrewardReward = [number, number];

	const enum InvestrewardStateFields {
		type = 0,			/*投资类型(0登录 1天关 2等级)*/
		state = 1,			/*状态(0没有购买 1已购买)*/
	}
	type InvestrewardState = [number, number];

	const enum ChatPlayerInfoFields {
		agentId = 0,			/*玩家id,  0：系统发送*/
		image = 1,			/*头像id*/
		name = 2,			/*名字*/
		occ = 3,			/*职业*/
		level = 4,			/*等级*/
		vip = 5,			/*vip等级*/
		riseId = 6,			/*仙位id*/
		lilianLevel = 7,			/*历练等级*/
		fight = 8,			/*战力*/
		pgId = 9,			/*服务器id*/
		vipf = 10,			/*vip等级*/
	}
	type ChatPlayerInfo = [number, number, string, number, number, number, number, number, number, number, number];

	const enum SprintRankTaskNodeFields {
		type = 0,			/*活动类型*/
		taskId = 1,			/*当前任务id*/
		state = 2,			/*领取状态*/
		param = 3,			/*参数*/
		endFlag = 4,			/*活动结束标志 0开启中 1结束*/
		rankParam = 5,			/*排行参数*/
	}
	type SprintRankTaskNode = [number, number, number, number, number, number];

	const enum SprintRankInfoFields {
		rank = 0,			/*排名*/
		name = 1,			/*角色名*/
		param = 2,			/*排行参数*/
		objId = 3,			/*角色id*/
	}
	type SprintRankInfo = [number, string, number, number];

	const enum SprintRankNodeFields {
		type = 0,			/*活动类型*/
		restTm = 1,			/*剩余时间(毫秒)*/
		firstName = 2,			/*榜首玩家名*/
		nodeList = 3,			/*排名列表*/
		endFlag = 4,			/*标记(0未开启 1进行中 2已结束)*/
	}
	type SprintRankNode = [number, number, string, Array<SprintRankInfo>, number];

	const enum PayRewardNodeFields {
		grade = 0,			/*档次*/
		state = 1,			/*状态*/
	}
	type PayRewardNode = [number, number];

	const enum DuobaoNodeFields {
		id = 0,			/*id*/
		state = 1,			/*状态*/
	}
	type DuobaoNode = [number, number];

	const enum PayRewardNoteFields {
		itemId = 0,			/*itemId*/
		count = 1,			/*数量*/
		index = 2,			/*编号*/
	}
	type PayRewardNote = [number, number, number];

	const enum PayRewardNoteSvrFields {
		name = 0,			/*角色名*/
		itemId = 1,			/*itemId*/
		count = 2,			/*数量*/
	}
	type PayRewardNoteSvr = [string, number, number];

	const enum GushenTaskFields {
		taskId = 0,			/*taskId*/
		state = 1,			/*状态(0未达成 1可领取 2已领取*/
		param = 2,			/*进度参数*/
	}
	type GushenTask = [number, number, number];

	const enum GushenNoteFields {
		type = 0,			/*活动类型*/
		openState = 1,			/*活动状态(0未开启 1开启 2结束(奖励已领取))*/
		activeState = 2,			/*激活状态(0未达成 1可领取 2已领取)*/
		taskList = 3,			/*任务列表*/
		curProgress = 4,			/*当前完成任务数量*/
		maxProgress = 5,			/*总任务数量*/
	}
	type GushenNote = [number, number, number, Array<GushenTask>, number, number];

	const enum KuanghuanTaskFields {
		taskId = 0,			/*taskId*/
		state = 1,			/*状态(0未达成 1可领取 2已领取*/
		param = 2,			/*进度参数*/
	}
	type KuanghuanTask = [number, number, number];

	const enum KuanghuanNoteFields {
		type = 0,			/*活动类型*/
		restTm = 1,			/*剩余时间(毫秒)*/
		taskList = 2,			/*任务列表*/
	}
	type KuanghuanNote = [number, number, Array<KuanghuanTask>];

	const enum EverydayRebateNodeFields {
		day = 0,			/*天数*/
		state = 1,			/*状态*/
	}
	type EverydayRebateNode = [number, number];

	const enum LoginRewardNodeFields {
		id = 0,			/*id*/
		state = 1,			/*状态*/
	}
	type LoginRewardNode = [number, number];

	const enum DiscountGiftFSNodeFields {
		id = 0,			/*id*/
		count = 1,			/*数量*/
	}
	type DiscountGiftFSNode = [number, number];

	const enum FSRankInfoFields {
		type = 0,			/*活动类型*/
		restTm = 1,			/*剩余时间(毫秒)*/
		endFlag = 2,			/*当天活动是否结束(0未 1是)*/
	}
	type FSRankInfo = [number, number, number];

	const enum ChatContentFields {
		channel = 0,			/*聊天频道：0：跑马灯，1：九洲频道，2：本服  3：系统*/
		contentType = 1,			/*聊天类型：0：文字  1：快捷语句  2：高级表情  3：道具  4:广播*/
		contentId = 2,			/*内容id：对于快捷(对应blend表快捷语句数组下标)，高级（对应表情表id），广播使用（对应broadcast表id）*/
		content = 3,			/*聊天内容*/
		item = 4,			/*道具信息*/
		numParam = 5,			/*广播参数*/
		strParam = 6,			/*广播参数*/
		create_time = 7,			/*创建时间*/

	}
	type ChatContent = [number, number, number, string, Item, Array<number>, Array<string>, Array<number>];

	const enum ChatPackageFields {
		senderInfo = 0,			/*发送者信息*/
		content = 1,			/*发送内容*/
	}
	type ChatPackage = [ChatPlayerInfo, ChatContent];

	const enum BlackInfoFields {
		agentId = 0,			/*玩家id*/
		name = 1,			/*玩家名字*/
	}
	type BlackInfo = [number, string];

	const enum ChatPlayerDetailedInfoFields {
		agentId = 0,			/*玩家id*/
		image = 1,			/*头像id*/
		name = 2,			/*名字*/
		occ = 3,			/*职业*/
		level = 4,			/*等级*/
		eraLevel = 5,			/*觉醒等级*/
		vip = 6,			/*vip等级*/
		riseId = 7,			/*仙位id*/
		lilianLevel = 8,			/*历练等级*/
		fight = 9,			/*战力*/
		equips = 10,			/*穿戴装备*/
		sbCount = 11,			/*神兵激活数量*/
		sbFight = 12,			/*神兵总战力*/
		wingCount = 13,			/*仙翼激活数量*/
		wingFight = 14,			/*仙翼总战力*/
		rideCount = 15,			/*精灵激活数量*/
		rideFight = 16,			/*精灵总战力*/
		petCount = 17,			/*宠物激活数量*/
		petFight = 18,			/*宠物总战力*/
		fashionId = 19,			/*时装ID*/
		petId = 20,			/*宠物ID*/
		sbId = 21,			/*神兵ID*/
		wingId = 22,			/*仙翼ID*/
		rideId = 23,			/*精灵ID*/
		fashionCount = 24,			/*时装激活数量*/
		fashionFight = 25,			/*时装总战力*/
		tianZhuCount = 26,			/*天珠激活数量*/
		tianZhuFight = 27,			/*天珠总战力*/
		tianZhuId = 28,			/*天珠ID*/
	}
	type ChatPlayerDetailedInfo = [number, string, string, number, number, number, number, number, number, number, Array<Item>, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];

	const enum OpenSceneIdFields {
		mapId = 0,			/*所在场景*/
		level = 1,			/*场景层数*/
		tm = 2,			/*持续时间*/
	}
	type OpenSceneId = [number, number, number];

	const enum XianFuTaskFields {
		id = 0,			/*任务id*/
		value = 1,			/*当前进度值*/
		state = 2,			/*状态 0：未完成 1:已完成 2：已领取*/
	}
	type XianFuTask = [number, number, number];

	const enum TiantiScoreFields {
		seg = 0,			/*段位*/
		score = 1,			/*积分*/
		feat = 2,			/*功勋*/
		remainTimes = 3,			/*剩余次数*/
		beforeRank = 4,			/*上一次排名*/
		beforeEndTime = 5,			/*上一次结束时间*/
	}
	type TiantiScore = [number, number, number, number, number, number];

	const enum TiantiActorScoreFields {
		score = 0,
		objId = 1,
		name = 2,
		joinTimes = 3,
	}
	type TiantiActorScore = [TiantiScore, number, string, number];

	const enum TiantiTimesFields {
		joinSeasonTimes = 0,			/*本赛季参与次数*/
		winSeasonTimes = 1,			/*本赛季胜利次数*/
		joinTimes = 2,			/*当天参与次数*/
		continueWinTimes = 3,			/*当天连胜次数*/
		buyTimes = 4,			/*当天购买次数*/
	}
	type TiantiTimes = [number, number, number, number, number];

	const enum TiantiFields {
		score = 0,
		joinAwardStates = 1,			/*参与奖励状态*/
		featAwardStates = 2,			/*功勋奖励状态*/
		tiantiTimes = 3,
	}
	type Tianti = [TiantiScore, Array<AwardState>, Array<AwardState>, TiantiTimes];

	const enum TiantiRankFields {
		actorRank = 0,
		score = 1,			/*积分*/
	}
	type TiantiRank = [ActorRank, number];

	const enum SeasonStateFields {
		id = 0,
		state = 1,			/*SeasonState*/
		time = 2,			/*赛季时间戳*/
	}
	type SeasonState = [number, number, number];

	const enum CloudlandTimesFields {
		totalTimes = 0,			/*总次数*/
		remainTimes = 1,			/*剩余次数*/
		buyTimes = 2,			/*购买的次数*/
		addTimes = 3,			/*虚拟道具、卷轴加的次数*/
	}
	type CloudlandTimes = [number, number, number, number];

	const enum AdventureEventFields {
		key = 0,			/*事件key*/
		id = 1,			/*事件大类id*/
		child = 2,			/*事件小类id*/
		param = 3,			/*事件参数，复仇值  宝箱倒计时时间戳  任务进度值*/
		state = 4,			/*领取状态  0不可领取  1可领取  目前只有宝箱和任务用到*/
		awardIndex = 5,			/*可获得奖励下标 对应adventure_child配置表奖励下标  目前只有宝箱和任务完成时才会有值，平时为Null*/
		taskCount = 6,			/*当前完成的任务数量  只有仙女考验用到*/
		taskId = 7,			/*当前进行的任务id 只有仙女考验用到*/
	}
	type AdventureEvent = [number, number, number, number, number, Array<number>, number, number];

	const enum FairyLogFields {
		id = 0,			/*仙女id*/
		time = 1,			/*时间戳*/
		name = 2,			/*玩家名*/
		result = 3,			/*拦截结果 0失败，1成功*/
		awardPer = 4,			/*奖励扣除百分比*/
	}
	type FairyLog = [number, number, string, number, number];

	const enum FairyEscoreFields {
		id = 0,			/*仙女id*/
		agentId = 1,			/*玩家id*/
		level = 2,			/*玩家等级*/
		time = 3,			/*结束时间戳*/
		name = 4,			/*玩家名*/
		looting = 5,			/*被截次数*/
		isDouble = 6,			/*是否双倍*/
	}
	type FairyEscore = [number, number, number, number, string, number, boolean];

	const enum ChatServerDataFields {
		fairyLog = 0,			/*玩家护送仙女日志*/
		looting = 1,			/*被拦截次数*/
		per = 2,			/*拦截后扣除百分比*/
	}
	type ChatServerData = [Array<FairyLog>, number, number];

	const enum BgBroadcastFields {
		uuid = 0,			/*唯一id*/
		startTime = 1,			/*开始时间戳*/
		endTime = 2,			/*结束时间戳*/
		intervalTime = 3,			/*间隔时间 毫秒*/
		channel = 4,			/*频道 0：跑马灯  1：九州  2：本服  3：系统*/
		content = 5,			/*发送内容*/
	}
	type BgBroadcast = [string, number, number, number, Array<number>, string];

	const enum DesignationFields {
		id = 0,
		state = 1,			/*称号状态 1:未激活 2:可激活 3:已激活 4:穿戴中*/
		endTime = 2,			/*到期时间戳 0:无期限*/
		value = 3,			/*当前进度*/
		total = 4,			/*总进度*/
	}
	type Designation = [number, number, number, number, number];

	const enum SV_DesignationFields {
		id = 0,
		time = 1,			/*获得的时间*/
	}
	type SV_Designation = [number, number];

	const enum ChallengeObjFields {
		objId = 0,
		rank = 1,			/*排名*/
	}
	type ChallengeObj = [number, number];

	const enum ArenaObjFields {
		objId = 0,			/*id*/
		occ = 1,			/*职业*/
		name = 2,			/*玩家名*/
		fight = 3,			/*战力*/
		rank = 4,			/*排名*/
		show = 5,			/*外观*/
	}
	type ArenaObj = [number, number, string, number, number, ActorRankShow];

	const enum ArenaChallengeObjFields {
		result = 0,
		objId = 1,
		robotId = 2,
		isRobot = 3,			/*是否是机器人*/
		rank = 4,
		name = 5,
		occ = 6,
	}
	type ArenaChallengeObj = [number, number, number, boolean, number, string, number];

	const enum ArenaRankFields {
		rank = 0,
		name = 1,			/*玩家名*/
	}
	type ArenaRank = [number, string];

	const enum ChallengeRecordFields {
		objId = 0,
		name = 1,			/*敌方名*/
		enemyChallenger = 2,			/*敌方是否挑战者*/
		win = 3,			/*是否胜利*/
		beforeRank = 4,			/*挑战前排名*/
		afterRank = 5,			/*挑战后排名*/
		time = 6,			/*挑战结算时间*/
	}
	type ChallengeRecord = [number, string, boolean, boolean, number, number, number];

	const enum ArenaTimesFields {
		reEnterTime = 0,			/*可以重新进入时间戳*/
		totalTimes = 1,			/*总次数*/
		remainTimes = 2,			/*剩余次数*/
		buyTimes = 3,			/*购买的次数*/
		bestRank = 4,			/*历史最高排名*/
	}
	type ArenaTimes = [number, number, number, number, number];

	const enum FeishengRankInfoFields {
		rank = 0,			/*排名*/
		name = 1,			/*角色名*/
		param = 2,			/*排行参数*/
		objId = 3,			/*角色id*/
		grade = 4,			/*排名档次*/
		pgId = 5,			/*pgId*/
	}
	type FeishengRankInfo = [number, string, number, number, number, number];

	const enum DuobaoRankInfoFields {
		rank = 0,			/*排名*/
		name = 1,			/*角色名*/
		param = 2,			/*排行参数*/
		objId = 3,			/*角色id*/
		grade = 4,			/*排名档次*/
		pgId = 5,			/*pgId*/
	}
	type DuobaoRankInfo = [number, string, number, number, number, number];

	const enum FactionInfoFields {
		uuid = 0,			/*仙盟id*/
		name = 1,			/*仙盟名字*/
		leaderName = 2,			/*盟主名字*/
		level = 3,			/*仙盟等级*/
		memberNum = 4,			/*成员数量*/
		fight = 5,			/*限制战力*/
		title = 6,			/*招人语*/
		flagIndex = 7,			/*旗帜下标*/
	}
	type FactionInfo = [string, string, string, number, number, number, string, number];

	const enum FactionMemberFields {
		name = 0,			/*名字*/
		agentId = 1,
		level = 2,			/*等级*/
		occ = 3,			/*职业*/
		fight = 4,			/*战力*/
		pos = 5,			/*职位*/
		loginTime = 6,			/*上次登陆时间*/
		weekContribution = 7,			/*本周贡献*/
		state = 8,			/*是否在线  true在线*/
		vip = 9,			/*vip等级*/
		vipf = 10,
		headImg = 11,		/*头像*/
	}
	type FactionMember = [string, number, number, number, number, number, number, number, boolean, number, number, number];

	const enum FactionJoinFields {
		agentId = 0,			/*玩家id*/
		name = 1,			/*名字*/
		level = 2,			/*等级*/
		fight = 3,			/*战力*/
		time = 4,			/*申请时间*/
		vip = 5,
		vipf = 6,
	}
	type FactionJoin = [number, string, number, number, number, number, number];

	const enum FactionRankShowFields {
		name = 0,			/*名字*/
		vip = 1,			/*vip等级*/
		occ = 2,			/*职业*/
		sbId = 3,			/*神兵id*/
		rideId = 4,			/*精灵id*/
		wingId = 5,			/*翅膀id*/
		fashionId = 6,			/*时装id*/
		tianzhuId = 7,			/*天珠id*/
		vipf = 8,
	}
	type FactionRankShow = [string, number, number, number, number, number, number, number, number];

	const enum FactionRankFields {
		name = 0,			/*仙盟名字*/
		level = 1,			/*仙盟等级*/
		fight = 2,			/*仙盟战力*/
		flagIndex = 3,			/*旗子*/
	}
	type FactionRank = [string, number, number, number];

	const enum FactionBoxFields {
		id = 0,			/*宝箱id*/
		agentId = 1,			/*是哪个玩家的宝箱*/
		color = 2,			/*宝箱颜色 与枚举对应*/
		time = 3,			/*时间*/
		level = 4,			/*仙盟等级*/
		state = 5,			/*宝箱状态 与枚举对应*/
		occ = 6,			/*玩家职业*/
		name = 7,			/*玩家名字*/
		otherId = 8,			/*协助者id*/
	}
	type FactionBox = [string, number, number, number, number, number, number, string, number];

	const enum FactionAssistBoxFields {
		id = 0,			/*宝箱id*/
		name = 1,			/*玩家名字*/
		occ = 2,			/*玩家职业*/
		time = 3,			/*协助时间*/
		otherId = 4,			/*协助者id*/
	}
	type FactionAssistBox = [string, string, number, number, number];

	const enum FactionAddSpeedBoxFields {
		id = 0,			/*宝箱id*/
		time = 1,			/*加速时间*/
	}
	type FactionAddSpeedBox = [string, number];

	const enum FactionTurnRecordFields {
		name = 0,			/*玩家名*/
		index = 1,			/*道具索引*/
	}
	type FactionTurnRecord = [string, number];

	const enum ActorBaseAttrFields {
		name = 0,			/*玩家名字*/
		occ = 1,			/*角色职业 1 2*/
		eraLvl = 2,			/*觉醒等级*/
		eraNum = 3,			/*觉醒重数*/
		level = 4,			/*等级*/
		exp = 5,			/*当前经验*/
		gold = 6,			/*代币券*/
		bind_gold = 7,		/*绑元*/
		copper = 8,			/*金币*/
		zq = 9,				/*魔力*/
		tiantiHonor = 10,	/*天梯荣耀*/
		serverPgId = 11,	/*当前所在服务器ID*/
		selfPgId = 12,		/*创角服务器ID*/
		createTime = 13,	/*创角时间*/
		clanCoin = 14,		/*战队币*/
		headImg = 15,			/*头像*/
	}
	type ActorBaseAttr = [string, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];

	const enum XilianInfoFields {
		remianTimes = 0,			/*剩余免费次数*/
		xilians = 1,
		xilianRiseLevel = 2,			/*锻造大师等级*/
		xilianRisePoint = 3,			/*锻造大师是否可升级*/
	}
	type XilianInfo = [number, Array<Xilian>, number, boolean];

	const enum EquipSuitFields {
		id = 0,			/*套装id*/
		light = 1,			/*点亮部位*/
	}
	type EquipSuit = [number, Array<number>];

	/*排行*/
	const enum RankServerFields {
		pgId = 0,			/*服ID*/
		serverName = 1,			/**/
		type = 2,			/*排行类型 RankType*/
		rank = 3,			/*排名*/
		param = 4,
	}
	type RankServer = [number, string, number, number, number];

	/*服排行列表*/
	const enum RankServerListFields {
		type = 0,			/*排行类型 RankType*/
		ranks = 1,			/*排行*/
	}
	type RankServerList = [number, Array<RankServer>];

	const enum ConsumeRankFields {
		objId = 0,			/*玩家ID*/
		name = 1,			/*玩家名*/
		consume = 2,			/*消费代币券*/
		rank = 3,			/*排名*/
	}
	type ConsumeRank = [number, string, number, number];

	const enum TeamInviteFields {
		type = 0,			/*0: 仙盟*/
		teamId = 1,			/*队伍ID*/
		objId = 2,			/*玩家ID*/
		name = 3,			/*玩家名*/
		mapId = 4,			/*场景ID*/
		occ = 5,
	}
	type TeamInvite = [number, number, number, string, number, number];

	const enum FeedbackFields {
		uuid = 0,
		ask = 1,			/*提问*/
		reply = 2,			/*回复*/
		time = 3,			/*回复时间*/
		state = 4,			/*0:未看，1已看*/
	}
	type Feedback = [string, string, string, number, number];

	const enum CDKEYFields {
		gId = 0,			/*组id*/
		cdkeys = 1,			/*激活码*/
		startTime = 2,			/*生效时间*/
		endTime = 3,			/*过期时间*/
		items = 4,			/*道具id：数量*/
		useCount = 5,			/*使用次数*/
		type = 6,
	}
	type CDKEY = [number, Array<string>, number, number, Array<Pair>, number, number];

	const enum RankUpdateFields {
		oldRank = 0,			/*旧排行*/
		newRank = 1,			/*当前排行*/
		rankType = 2,			/*排行类型*/
		param = 3,			/*排行参数*/
		objId = 4,
	}
	type RankUpdate = [number, number, number, number, number];

	const enum RankJudageFields {
		agentId = 0,			/*玩家ID*/
		rank = 1,
	}
	type RankJudage = [number, number];

	const enum RankJudageTypeFields {
		rankType = 0,			/*排行类型*/
		records = 1,
	}
	type RankJudageType = [number, Array<RankJudage>];

	const enum TeamMemberOperFields {
		name = 0,			/*角色名*/
		oper = 1,			/*0:退出队伍 1:加入队伍 2:T出队伍*/
	}
	type TeamMemberOper = [string, number];

	const enum OnceRewardDataFields {
		data = 0,			/*数据*/
		id = 1,
	}
	type OnceRewardData = [string, number];

	const enum FeishengRankFields {
		rankType = 0,			/*排行类型*/
		rankTm = 1,			/*排行时间*/
		nodeList = 2,			/*排名列表*/
	}
	type FeishengRank = [number, number, Array<FeishengRankInfo>];

	const enum RetrieveFields {
		type = 0,			/*1:资源找回 2:活跃值找回*/
		id = 1,
		gold = 2,			/*单价*/
		times = 3,			/*可找回次数*/
	}
	type Retrieve = [number, number, number, number];

	const enum SceneRecordFields {
		sceneType = 0,
		times = 1,			/*开启次数*/
	}
	type SceneRecord = [number, number];

	/*通用返回*/
	const enum SV_CommonReplyFields {
		result = 0,
	}
	type SV_CommonReply = [number];

	/*添加用户到功能服返回*/
	const enum SV_LoginUserToFeatureReplyFields {
		result = 0,
		data = 1,
		baseAttr = 2,
	}
	type SV_LoginUserToFeatureReply = [number, LoginData, ActorBaseAttr];

	/*添加用户到场景服返回*/
	const enum SV_LoginUserToMapReplyFields {
		result = 0,
	}
	type SV_LoginUserToMapReply = [number];

	/*用户从Map下线返回*/
	const enum SV_LogoutUserOfMapReplyFields {
	}
	type SV_LogoutUserOfMapReply = null;

	/*服务器认证*/
	const enum SV_AuthServiceFields {
		type = 0,			/*服务类型*/
		handle = 1,			/*服务句柄*/
	}
	type SV_AuthService = [number, number];

	/*聊天服认证返回*/
	const enum SV_AuthChatReplyFields {
		result = 0,
		handle = 1,			/*服务句柄*/
	}
	type SV_AuthChatReply = [number, number];

	/*登录到聊天服*/
	const enum SV_LoginUserToChatOfFeatureFields {
		agentId = 0,			/*用户唯一id*/
		baseData = 1,			/*基本信息*/
	}
	type SV_LoginUserToChatOfFeature = [number, HuamnBaseData];

	/*登录到跨服*/
	const enum SV_LoginUserToCrossOfFeatureFields {
		agentId = 0,			/*用户唯一id*/
		baseData = 1,			/*基本信息*/
	}
	type SV_LoginUserToCrossOfFeature = [number, HuamnBaseData];

	/*登录到总副本*/
	const enum SV_LoginUserToCrossTOfFeatureFields {
		agentId = 0,			/*用户唯一id*/
		baseData = 1,			/*基本信息*/
	}
	type SV_LoginUserToCrossTOfFeature = [number, HuamnBaseData];

	/*获取玩家镜像数据*/
	const enum SV_GetActorImgDataFields {
		data = 0,
	}
	type SV_GetActorImgData = [ReqImgData];

	/*获取玩家镜像数据*/
	const enum SV_GetActorImgDataOfCrossFields {
		data = 0,
	}
	type SV_GetActorImgDataOfCross = [ReqImgData];

	/*获取玩家镜像数据返回*/
	const enum SV_GetActorImgDataOfFeatureReplyFields {
		data = 0,
	}
	type SV_GetActorImgDataOfFeatureReply = [ImgData];

	/*聊天返回*/
	const enum SV_ChatReplyFields {
		agentId = 0,
		result = 1,
	}
	type SV_ChatReply = [number, number];

	/*玩家已登陆上聊天服,同步存放在聊天服数据到功能服*/
	const enum SV_LoginChatFinishFields {
		agentId = 0,
		data = 1,
	}
	type SV_LoginChatFinish = [number, ChatServerData];

	/*请求玩家展示信息到chat服*/
	const enum SV_ReqChatInfoOfChatFields {
		agentId = 0,			/*用户唯一id*/
	}
	type SV_ReqChatInfoOfChat = [number];

	/*请求玩家展示信息返回*/
	const enum SV_ReqChatInfoOfFeatureReplyFields {
		info = 0,
	}
	type SV_ReqChatInfoOfFeatureReply = [ChatPlayerDetailedInfo];

	/*请求玩家展示信息返回从chat发过来转发给玩家*/
	const enum SV_ReqChatInfoToClientFields {
		agentId = 0,			/*用户唯一id*/
		result = 1,			/*错误码*/
		info = 2,
	}
	type SV_ReqChatInfoToClient = [number, number, ChatPlayerDetailedInfo];

	/*聊天记录从chat发过来转发给玩家*/
	const enum SV_ChatRecordToClientFields {
		agentId = 0,			/*用户唯一id*/
		channel = 1,			/*聊天频道：0：广播（系统），1：九洲频道，2：本服*/
		chatRecord = 2,			/*聊天记录*/
	}
	type SV_ChatRecordToClient = [number, number, Array<ChatPackage>];

	/*扣除高级聊天表情次数*/
	const enum SV_DelExpressionCountOfChatFields {
		agentId = 0,			/*用户唯一id*/
	}
	type SV_DelExpressionCountOfChat = [number];

	/*扣除高级聊天表情次数*/
	const enum SV_DelExpressionCountOfFeatureReplyFields {
		result = 0,
	}
	type SV_DelExpressionCountOfFeatureReply = [number];

	/*添加用户到中心服返回*/
	const enum SV_LoginUserToCenterReplyFields {
	}
	type SV_LoginUserToCenterReply = null;

	/*添加用户到中心服通知到Feature返回*/
	const enum SV_LoginUserToCenterSuccessReplyFields {
	}
	type SV_LoginUserToCenterSuccessReply = null;

	/*ping*/
	const enum SV_ServicePingFields {
	}
	type SV_ServicePing = null;

	/*注册地图*/
	const enum SV_RegisterMapFields {
		mapId = 0,
	}
	type SV_RegisterMap = [Array<number>];

	/*功能服回应玩家数据加载完成*/
	const enum SV_LoadComplateReplyFields {
	}
	type SV_LoadComplateReply = null;

	/*请求进入场景*/
	const enum SV_ReqEnterSceneFields {
		data = 0,
	}
	type SV_ReqEnterScene = [LoginData];

	/*回滚退出场景*/
	const enum SV_FallbackLogoutFields {
		objId = 0,			/*用户唯一id*/
	}
	type SV_FallbackLogout = [number];

	/*设置本地时间*/
	const enum SV_GM_SetLocalTimeToNexusFields {
		time = 0,			/*ms*/
	}
	type SV_GM_SetLocalTimeToNexus = [number];

	/*设置开服时间*/
	const enum SV_GM_SetOpenServerTimeToNexusFields {
		time = 0,			/*ms*/
	}
	type SV_GM_SetOpenServerTimeToNexus = [number];

	/*更新ActorExt表数据*/
	const enum SV_UpdateActorExtFields {
		agentId = 0,
		actorExt = 1,
	}
	type SV_UpdateActorExt = [number, ActorExt];

	/*更新九天排名*/
	const enum SV_UpdateNineCopyRankToNexusFields {
		ranks = 0,
	}
	type SV_UpdateNineCopyRankToNexus = [Array<NineRank>];

	/*检测改名*/
	const enum SV_CheckSetNameFields {
		name = 0,			/*角色名*/
	}
	type SV_CheckSetName = [string];

	/*更新玩家名*/
	const enum SV_UpdateNexusNameFields {
		agentID = 0,			/*角色ID*/
		oldName = 1,			/*旧名*/
		name = 2,			/*角色名*/
	}
	type SV_UpdateNexusName = [number, string, string];

	/*更新职业*/
	const enum SV_UpdateNexusOccFields {
		agentID = 0,			/*角色ID*/
		occ = 1,			/*职业*/
	}
	type SV_UpdateNexusOcc = [number, number];

	/*获取护送仙女列表推送客户端*/
	const enum SV_GetFairyEscortListToNexusFields {
		agentId = 0,
		escortList = 1,			/*玩家护送列表*/
	}
	type SV_GetFairyEscortListToNexus = [number, Array<FairyEscore>];

	/*添加仙女护送日志*/
	const enum SV_AddFairyEscortLogFields {
		agentId = 0,
		log = 1,			/*日志*/
		per = 2,			/*此次护送扣除奖励总的百分比*/
		looting = 3,			/*被拦截次数*/
	}
	type SV_AddFairyEscortLog = [number, FairyLog, number, number];

	/*更新其它仙女面板信息*/
	const enum SV_UpdateFairyPanelInfoToNexusFields {
		agentId = 0,
		targetId = 1,			/*更新的目标id*/
		looting = 2,			/*被拦截次数*/
		level = 3,			/*等级*/
	}
	type SV_UpdateFairyPanelInfoToNexus = [number, number, number, number];

	/*客户端认证*/
	const enum AuthClientFields {
		user = 0,			/*用户名*/
		platform = 1,			/*平台*/
		group = 2,			/*组*/
		sign = 3,			/*校验用*/
		timestamp = 4,			/*时间戳*/
		package = 5,
	}
	type AuthClient = [string, number, number, string, number, number];

	/*玩家登陆*/
	const enum ActorLoginFields {
		name = 0,			/*角色名*/
		occ = 1,			/*职业*/
	}
	type ActorLogin = [string, number];

	/*客户端加载完成*/
	const enum LoadComplateFields {
	}
	type LoadComplate = null;

	/*客户端登录完成*/
	const enum LoginCompleteFields {
	}
	type LoginComplete = null;

	/*ping*/
	const enum ClientPingFields {
	}
	type ClientPing = null;

	/*同步时间*/
	const enum SynTimeFields {
		time = 0,			/*ms*/
	}
	type SynTime = [number];

	/*跨服服认证返回*/
	const enum SV_AuthCrossReplyFields {
		result = 0,
		handle = 1,			/*服务句柄*/
	}
	type SV_AuthCrossReply = [number, number];

	/*添加用户到Cross返回*/
	const enum SV_LoginUserToCrossReplyFields {
		result = 0,
	}
	type SV_LoginUserToCrossReply = [number];

	/*添加用户到Cross返回*/
	const enum SV_LoginUserToCrossTReplyFields {
		result = 0,
	}
	type SV_LoginUserToCrossTReply = [number];

	/*注册地图*/
	const enum SV_RegisterMapToNexusFields {
		serverType = 0,			/*服务器类型 0:普通 1:跨服 2:总跨服*/
		mapId = 1,
	}
	type SV_RegisterMapToNexus = [number, Array<number>];

	/*跨服服认证返回*/
	const enum SV_AuthCrossTReplyFields {
		result = 0,
		handle = 1,			/*服务句柄*/
	}
	type SV_AuthCrossTReply = [number, number];

	/*机器人进入场景*/
	const enum SV_RobotEnterSceneFields {
		robotData = 0,			/*机器人数据*/
		mapId = 1,
	}
	type SV_RobotEnterScene = [RobotLoginData, number];

	/*客户端认证返回*/
	const enum AuthClientReplyFields {
		error = 0,			/*错误码*/
		actor = 1,			/*角色ID*/
		baseAttr = 2,
	}
	type AuthClientReply = [number, number, ActorBaseAttr];

	/*关闭客户端*/
	const enum CloseClientFields {
		error = 0,			/*错误码*/
	}
	type CloseClient = [number];

	/*玩家登陆返回*/
	const enum ActorLoginReplyFields {
		result = 0,			/*返回的错误码*/
		actor = 1,			/*角色ID*/
		baseAttr = 2,
	}
	type ActorLoginReply = [number, number, ActorBaseAttr];

	/*返回玩家基本属性*/
	const enum GetActorBaseAttrReplyFields {
		baseAttr = 0,
	}
	type GetActorBaseAttrReply = [ActorBaseAttr];

	/*更新血量*/
	const enum UpdateHpFields {
		curHp = 0,			/*当前血量*/
		maxHp = 1,			/*最大血量*/
		objId = 2,			/*玩家或怪物*/
	}
	type UpdateHp = [number, number, number];

	/*更新玩家总属性*/
	const enum UpdateTotalAttrFields {
		totalAttr = 0,			/*总属性*/
	}
	type UpdateTotalAttr = [Array<TypesAttr>];

	/*GM 指令返回*/
	const enum GMCommandReplyFields {
		result = 0,
	}
	type GMCommandReply = [number];

	/*更新经验*/
	const enum UpdateExpFields {
		curExp = 0,			/*当前经验*/
		addExp = 1,			/*增加经验*/
		source = 2,			/*来源*/
		level = 3,			/*当前等级*/
	}
	type UpdateExp = [number, number, number, number];

	/*更新等级*/
	const enum UpdateLevelFields {
		level = 0,			/*等级*/
	}
	type UpdateLevel = [number];

	/*穿戴装备返回*/
	const enum WearEquipReplyFields {
		result = 0,			/*非0失败*/
	}
	type WearEquipReply = [number];

	/*更新角色的穿戴装备*/
	const enum UpdateActorEquipFields {
		partItem = 0,			/*装备穿戴*/
	}
	type UpdateActorEquip = [Array<PartItem>];

	/*获取角色装备返回*/
	const enum GetActorEquipReplyFields {
		items = 0,
	}
	type GetActorEquipReply = [Array<Item>];

	/*获取任务返回*/
	const enum GetTaskReplyFields {
		tasks = 0,			/*任务列表*/
	}
	type GetTaskReply = [Array<SingleTask>];

	/*领取任务奖励返回*/
	const enum GetTaskAwardReplyFields {
		reuslt = 0,			/*非0失败*/
		taskId = 1,			/*任务ID*/
	}
	type GetTaskAwardReply = [number, string];

	/*更新任务*/
	const enum UpdateTaskFields {
		taskOpers = 0,
	}
	type UpdateTask = [Array<TaskOper>];

	/*更新货币*/
	const enum UpdateMoneyFields {
		gold = 0,			/*代币券*/
		bind_gold = 1,			/*绑元*/
		copper = 2,			/*金币*/
		source = 3,			/*来源*/
	}
	type UpdateMoney = [number, number, number, number];

	/*更新战力*/
	const enum UpdateFightFields {
		fight = 0,			/*战力*/
	}
	type UpdateFight = [number];

	/*请求进入场景返回*/
	const enum ReqEnterSceneReplyFields {
		result = 0,
	}
	type ReqEnterSceneReply = [number];

	/*副本结算奖励*/
	const enum CopyJudgeAwardFields {
		success = 0,			/*true: 成功 false: 失败*/
		items = 1,
		type = 2,			/*0:正常结算 1:最后一击 2:MVP 3:参与 4:排名结算 5:开宝箱*/
		occ = 3,
		name = 4,
		itemSources = 5,                /**对应 items 中道具来源，下标对应 值对应 ItemSource*/
	}
	type CopyJudgeAward = [boolean, Array<Item>, number, number, string, Array<number>];

	/*获取天关*/
	const enum GetCopyTianguanReplyFields {
		copyData = 0,			/*天关副本*/
		killMonsterWare = 1,			/*当前击杀怪物波数*/
	}
	type GetCopyTianguanReply = [LevelCopyData, number];

	/*领取副本奖励返回*/
	const enum GetCopyAwardReplyFields {
		result = 0,			/*非0失败*/
		mapId = 1,			/*地图ID*/
		level = 2,			/*层数、关卡数*/
	}
	type GetCopyAwardReply = [number, number, number];

	/*更新天关层数和奖励*/
	const enum UpdateTianguanCopyFields {
		copyData = 0,			/*天关副本*/
	}
	type UpdateTianguanCopy = [LevelCopyData];

	/*挂机场景更新当前击杀怪物波数*/
	const enum UpdateKillMonstetWareFields {
		count = 0,			/*当前击杀波数*/
	}
	type UpdateKillMonstetWare = [number];

	/*获取功能开启返回*/
	const enum GetActionOpenReplyFields {
		actions = 0,		/*功能ID*//*功能状态 1:开启状态 2:关闭状态*//*外层下标*//*内层下标*/
	}
	type GetActionOpenReply = [Array<ActionOpen>];

	/*更新功能开启*/
	const enum UpdateActionOpenFields {
		actions = 0,
	}
	type UpdateActionOpen = [Array<ActionOpen>];

	/*同步时间返回*/
	const enum SynTimeReplyFields {
		timeReq = 0,			/*客户端发送的时间 ms*/
		timeRep = 1,			/*服务端返回的时间 ms*/
	}
	type SynTimeReply = [number, number];

	/*获取排行榜返回*/
	const enum GetRankReplyFields {
		RankList = 0,
	}
	type GetRankReply = [Array<RankList>];

	/*获取大荒*/
	const enum GetCopyDahuangReplyFields {
		copyData = 0,			/*大荒副本*/
	}
	type GetCopyDahuangReply = [LevelCopyData];

	/*更新大荒层数和奖励*/
	const enum UpdateDahuangCopyFields {
		copyData = 0,			/*大荒副本*/
	}
	type UpdateDahuangCopy = [LevelCopyData];

	/*更新收益*/
	const enum UpdateIncomeFields {
		incomes = 0,
		source = 1,			/*来源*/
	}
	type UpdateIncome = [Array<Income>, number];

	/*更新觉醒*/
	const enum UpdateActorEraFields {
		eraLvl = 0,			/*觉醒等级*/
		eraNum = 1,			/*觉醒重数*/
	}
	type UpdateActorEra = [number, number];

	/*获取排行外观返回*/
	const enum GetActorRankShowReplyFields {
		show = 0,			/*角色排行外观*/
	}
	type GetActorRankShowReply = [ActorRankShow];

	/*采集返回*/
	const enum GatherReplyFields {
		result = 0,
	}
	type GatherReply = [number];


	/*获取探索全服记录返回*/
	const enum GetXunbaoServerBroadcastReplyFields {
		type = 0,			/*类型 0装备 1巅峰 2至尊 3仙符*/
		svrBroadcastList = 1,			/*全服记录*/
	}
	type GetXunbaoServerBroadcastReply = [number, Array<XunbaoNote>];

	/*获取角色排行榜数据*/
	const enum GetActorRankDataReplyFields {
		rankDatas = 0,
	}
	type GetActorRankDataReply = [Array<RankData>];

	/*更新buff列表*/
	const enum UpdateBuffListFields {
		opers = 0,
	}
	type UpdateBuffList = [Array<BuffOper>];

	/*更新角色状态*/
	const enum UpdateActorStateFields {
		objId = 0,			/**/
		acotrState = 1,			/*角色状态 ActorState:按位取*/
	}
	type UpdateActorState = [number, number];

	/*获取远古符阵*/
	const enum GetCopyRuneReplyFields {
		copyData = 0,			/*远古符阵副本*/
		isCanGetEveryDay = 1,			/*是否可领取每日奖励  true可领取，false不可领取*/
	}
	type GetCopyRuneReply = [LevelCopyData, boolean];

	/*更新远古符阵层数和奖励*/
	const enum UpdateRuneCopyFields {
		copyData = 0,			/*远古符阵副本*/
		isCanGetEveryDay = 1,			/*是否可领取每日奖励  true可领取，false不可领取*/
	}
	type UpdateRuneCopy = [LevelCopyData, boolean];

	/*领取远古符阵副本每日奖励返回*/
	const enum GetRuneEveryDayAwardReplyFields {
		result = 0,
	}
	type GetRuneEveryDayAwardReply = [number];

	/*获取远古符阵转盘回复*/
	const enum GetRuneDialReplyFields {
		alreadList = 0,			/*已领取的奖励序号*/
		dialCount = 1,			/*转盘可转次数*/
		round = 2,			/*当前转盘轮数*/
	}
	type GetRuneDialReply = [Array<number>, number, number];

	/*更新远古符阵转盘*/
	const enum UpdateRuneDialFields {
		alreadList = 0,			/*已领取的奖励序号*/
		dialCount = 1,			/*转盘可转次数*/
		round = 2,			/*当前转盘轮数*/
	}
	type UpdateRuneDial = [Array<number>, number, number];

	/*远古符阵转盘开始回复*/
	const enum StartRuneDialReplyFields {
		index = 0,			/*转盘开到的序号*/
		result = 1,			/*错误码*/
	}
	type StartRuneDialReply = [number, number];

	/*采集结束*/
	const enum GatherEndFields {
		result = 0,			/*错误码*/
	}
	type GatherEnd = [number];

	/*九天之巅副本结算奖励*/
	const enum NineCopyJudgeAwardFields {
		success = 0,			/*true: 成功 false: 失败*/
		ranks = 1,
		selfLevel = 2,			/*层数*/
		selfRank = 3,			/*排名*/
	}
	type NineCopyJudgeAward = [boolean, Array<NineRank>, number, number];

	/*获取当前在副本里面得到的奖励返回*/
	const enum GetInCopyAwardReplyFields {
		awardList = 0,			/*奖励列表 道具id：道具数量*/
	}
	type GetInCopyAwardReply = [Array<Pair>];

	/*获取所有完成的指引返回*/
	const enum GetGuideListReplyFields {
		list = 0,
	}
	type GetGuideListReply = [Array<number>];

	/*完成指引返回*/
	const enum FinishGuideReplyFields {
		id = 0,			/*完成的指引id*/
		code = 1,
	}
	type FinishGuideReply = [Array<number>, number];

	/*BOSS结算奖励*/
	const enum BossJudgeAwardFields {
		items = 0,
		occ = 1,			/*BOSS ID*/
		type = 2,			/*结算类型: AwardJudgeType*/
		actorOcc = 3,
		name = 4,
	}
	type BossJudgeAward = [Array<Item>, number, number, number, string];

	/*获取功能预览已领取的id返回*/
	const enum GetActionPreviesHaveReceivedReplyFields {
		list = 0,			/*已领取奖励的功能id*/
	}
	type GetActionPreviesHaveReceivedReply = [Array<number>];

	/*领取功能预览奖励返回*/
	const enum GetActionPreviesAwardReplyFields {
		result = 0,
	}
	type GetActionPreviesAwardReply = [number];

	/*获取开服第几天返回*/
	const enum GetServerDayReplyFields {
		day = 0,
	}
	type GetServerDayReply = [number];

	/*更新开服第几天*/
	const enum UpdateServerDayFields {
		day = 0,
	}
	type UpdateServerDay = [number];

	/*竞技场结算*/
	const enum ArenaJudgeAwardFields {
		success = 0,			/*true: 成功 false: 失败*/
		items = 1,
		curRank = 2,			/*当前排名*/
		maxRank = 3,			/*历史最高排名*/
		enemyRankChange = 4,			/*敌方排名是否有改变*/
		gold = 5,
	}
	type ArenaJudgeAward = [boolean, Array<Item>, number, number, boolean, number];

	/*敌方未进入*/
	const enum UpdateNotFoundEnemyFields {
	}
	type UpdateNotFoundEnemy = null;

	/*获取功能开启状态*/
	const enum GetActionStateReplyFields {
		actions = 0,
	}
	type GetActionStateReply = [Array<ActionOpen>];

	/*获取装备套装信息返回*/
	const enum GetEquipSuitReplyFields {
		idList = 0,			/*已激活的套装id*/
		light = 1,			/*未激活套装的点亮部位*/
	}
	type GetEquipSuitReply = [Array<number>, Array<EquipSuit>];

	/*点亮装备返回*/
	const enum LightenUpReplyFields {
		result = 0,
	}
	type LightenUpReply = [number];

	/*改名返回*/
	const enum SetNameReplyFields {
		result = 0,
	}
	type SetNameReply = [number];

	/*获取设置名字信息*/
	const enum GetSetNameInfoReplyFields {
		cd = 0,			/*cd限制(s)*/
		times = 1,			/*次数限制*/
	}
	type GetSetNameInfoReply = [number, number];

	/*更新名字*/
	const enum UpdateNameReplyFields {
		roleID = 0,			/*角色ID*/
		name = 1,			/*角色名*/
	}
	type UpdateNameReply = [number, string];

	/*更新职业*/
	const enum UpdateOccReplyFields {
		roleID = 0,			/*角色ID*/
		occ = 1,			/*职业*/
	}
	type UpdateOccReply = [number, number];

	const enum ItemShowFields {
		objId = 0,			/*唯一ID*/
		itemId = 1,			/*道具ID*/
		pos = 2,
	}
	type ItemShow = [number, number, Pos];

	const enum MonsterShowFields {
		objId = 0,			/*唯一ID*/
		occ = 1,			/*怪物ID*/
		speed = 2,			/*速度*/
		curHp = 3,			/*当前血量*/
		maxHp = 4,			/*最大血量*/
		pos = 5,
		desPos = 6,
		angle = 7,			/*朝向角度*/
		level = 8,			/*怪物等级*/
	}
	type MonsterShow = [number, number, number, number, number, Pos, Pos, number, number];

	const enum HumanShowFields {
		speed = 0,			/*速度*/
		curHp = 1,			/*当前血量*/
		maxHp = 2,			/*最大血量*/
		pos = 3,
		desPos = 4,
		actorShow = 5,
		angle = 6,			/*朝向角度*/
		isDead = 7,			/*是否死亡状态*/
	}
	type HumanShow = [number, number, number, Pos, Pos, ActorShow, number, boolean];

	const enum NpcShowFields {
		objId = 0,			/*唯一ID*/
		occ = 1,			/*NPC id*/
		childType = 2,			/*子类型  1:常规 2:采集物*/
		endTime = 3,			/*到点消失 0:永久*/
		pos = 4,
		own = 5,			/*归属*/
	}
	type NpcShow = [number, number, number, number, Pos, number];

	/*离开场景服*/
	const enum LeaveSceneFields {
		mapId = 0,			/*地图ID*/
		copyId = 1,			/*副本ID,唯一ID*/
	}
	type LeaveScene = [number, number];

	/*进入场景服*/
	const enum EnterSceneFields {
		mapId = 0,			/*地图ID*/
		copyId = 1,			/*副本ID,唯一ID*/
		revive = 2,			/*是否复活进入*/
		level = 3,			/*层数*/
	}
	type EnterScene = [number, number, boolean, number];

	/*广播入屏*/
	const enum BroadcastEnterScreenFields {
		items = 0,
		monsters = 1,
		humans = 2,
		npcs = 3,
	}
	type BroadcastEnterScreen = [Array<ItemShow>, Array<MonsterShow>, Array<HumanShow>, Array<NpcShow>];

	/*广播离屏*/
	const enum BroadcastLeaveScreenFields {
		objIds = 0,
	}
	type BroadcastLeaveScreen = [Array<number>];

	/*广播玩家移动*/
	const enum BroadcastMoveFields {
		objId = 0,			/*唯一ID*/
		speed = 1,			/*速度*/
		startPos = 2,
		endPos = 3,
		runState = 4,			/*冲刺状态*/
	}
	type BroadcastMove = [number, number, Pos, Pos, boolean];

	/*广播移动速度更新*/
	const enum UpDateSpeedFields {
		targetObjId = 0,
		speed = 1,
	}
	type UpDateSpeed = [number, number]

	const enum CombatHurtFields {
		targetObjId = 0,			/*受击者*/
		maxHp = 1,			/*最大血量*/
		curHp = 2,			/*当前血量*/
		hurt = 3,			/*伤害值*/
		hurtType = 4,			/*伤害类型 0:普通 1:暴击 3:闪避 4:反伤*/
		skillId = 5,			/*技能ID*/
		sourObjId = 6,			/*攻击者*/
		isPetAtk = 7,			/*是否是宠物攻击*/
		isDollAtk = 8,			/*是否是宠物攻击*/
	}
	type CombatHurt = [number, number, number, number, number, number, number, boolean, boolean];

	/*飘血*/
	const enum BroadcastHpFields {
		CombatHurts = 0,
	}
	type BroadcastHp = [Array<CombatHurt>];

	/*复活返回*/
	const enum ReqReviveReplyFields {
		result = 0,			/*复活结果*/
	}
	type ReqReviveReply = [number];

	/*广播复活*/
	const enum BroadcastReviveFields {
		objId = 0,			/*玩家ID*/
	}
	type BroadcastRevive = [number];

	/*玩家或怪物死亡*/
	const enum BroadcastDeadFields {
		objId = 0,			/*唯一ID*/
		killerId = 1,			/*被XX击杀*/
		killerType = 2,			/*类型 1:玩家 2:怪物*/
		killerName = 3,
		occ = 4,			/*死亡角色或者怪物ID*/
	}
	type BroadcastDead = [number, number, number, string, number];

	/*预备技能*/
	const enum BroadcastReadySkillFields {
		objId = 0,			/*唯一ID*/
		skillId = 1,			/*技能ID*/
		isPet = 2,			/*是否是宠物攻击*/
	}
	type BroadcastReadySkill = [number, number, boolean];

	/*释放技能*/
	const enum BroadcastPlaySkillFields {
		objId = 0,			/*唯一ID*/
		skillId = 1,			/*技能ID*/
		targetObjId = 2,			/*目标ID*/
		isPet = 3,			/*是否是宠物攻击*/
		isDoll = 3,			/*是否是仙娃攻击*/
	}
	type BroadcastPlaySkill = [number, number, number, boolean, boolean];

	/*广播角色外观*/
	const enum BroadcastActorShowFields {
		actorShow = 0,			/*角色外观*/
	}
	type BroadcastActorShow = [ActorShow];

	/*广播开始战斗*/
	const enum BroadcastBeginCombatFields {
		remainTime = 0,			/*战斗剩余时间 ms -1:不限时*/
	}
	type BroadcastBeginCombat = [number];

	/*广播结束战斗*/
	const enum BroadcastEndCombatFields {
	}
	type BroadcastEndCombat = null;

	/*广播怪物波数*/
	const enum BroadcastCopyMonsterWareFields {
		monsterWare = 0,			/*怪物波数*/
	}
	type BroadcastCopyMonsterWare = [CopyMonsterWare];

	/*广播副本收益*/
	const enum BroadcastCopyIncomeFields {
		curIncome = 0,			/*当前收益*/
		totalIncome = 1,			/*总收益*/
		monsterTotalCount = 2,			/*怪物总数量*/
	}
	type BroadcastCopyIncome = [Income, Income, number];

	/*广播副本星级*/
	const enum BroadcastCopyStarFields {
		curStar = 0,			/*当前星级*/
		remainTime = 1,			/*剩余XX时间降星*/
	}
	type BroadcastCopyStar = [number, number];

	/*更新收益记录*/
	const enum UpdateIncomeRecordFields {
		curIncome = 0,			/*当前收益*/
		recordMaxIncome = 1,			/*历史最高收益*/
	}
	type UpdateIncomeRecord = [Income, Income];

	/*获取副本次数返回*/
	const enum GetCopyTimesReplyFields {
		times = 0,			/*副本次数*/
	}
	type GetCopyTimesReply = [Array<CopyTimes>];

	/*更新副本次数*/
	const enum UpdateCopyTimesFields {
		times = 0,			/*副本次数*/
	}
	type UpdateCopyTimes = [CopyTimes];

	/*购买副本次数返回*/
	const enum BuyTimesReplyFields {
		result = 0,
	}
	type BuyTimesReply = [number];

	/*同场景传送*/
	const enum TransmitPosFields {
		pos = 0,			/*坐标点*/
	}
	type TransmitPos = [Pos];

	/*释放技能返回*/
	const enum PlaySkillReplyFields {
		result = 0,
	}
	type PlaySkillReply = [number];

	/*获取开启宝箱次数*/
	const enum GetOpenBoxTimesReplyFields {
		boxTimes = 0,
	}
	type GetOpenBoxTimesReply = [BoxTimes];

	/*更新开启宝箱次数*/
	const enum UpdateOpenBoxTimesFields {
		boxTimes = 0,
	}
	type UpdateOpenBoxTimes = [BoxTimes];

	/*更新PK模式*/
	const enum UpdatePKModeFields {
		pkMode = 0,			/*PK模式 0:和平 1:仙盟 2:阵容 3:队伍*/
	}
	type UpdatePKMode = [number];

	/*进入下一层返回*/
	const enum ReqEnterNextLevelReplyFields {
		result = 0,
	}
	type ReqEnterNextLevelReply = [number];

	/*敌人入侵*/
	const enum BroadcastEnemyInvadFields {
	}
	type BroadcastEnemyInvad = null;

	/*获取组队副本次数*/
	const enum GetTeamCopyTimesReplyFields {
		times = 0,
	}
	type GetTeamCopyTimesReply = [TeamCopyTimes];

	/*更新组队副本次数*/
	const enum UpdateTeamCopyTimesFields {
		times = 0,
	}
	type UpdateTeamCopyTimes = [TeamCopyTimes];

	/*获取组队副本排行返回*/
	const enum GetTeamCopyRankReplyFields {
		ranks = 0,
	}
	type GetTeamCopyRankReply = [Array<TeamCopyRank>];

	/*广播组队怪物波数*/
	const enum BroadcastTeamCopyMonsterWareFields {
		monsterWare = 0,			/*怪物波数*/
	}
	type BroadcastTeamCopyMonsterWare = [TeamCopyMonsterWare];

	/*切换地图、当前场景切换为副本 场景资源不变，刷出目标场景的怪物*/
	const enum UpdateChangeMapFields {
		mapId = 0,			/*挂机场景切换成副本的ID、恢复成挂机场景的ID*/
		level = 1,			/*层数*/
	}
	type UpdateChangeMap = [number, number];

	/*BOSS出生点*/
	const enum UpdateBossBirthPosFields {
		pos = 0,
	}
	type UpdateBossBirthPos = [Pos];

	/*更新掉落*/
	const enum UpdateDropItemFields {
		pos = 0,
		items = 1,
		dropObjId = 2,		/*掉落目标*/
	}
	type UpdateDropItem = [Pos, Array<Items>, number];

	/*广播场景状态*/
	const enum BroadcasSceneStateFields {
		states = 0,
	}
	type BroadcasSceneState = [Array<CopySceneState>];

	/*获取场景状态返回*/
	const enum GetSceneStateReplyFields {
		states = 0,
	}
	type GetSceneStateReply = [Array<CopySceneState>];

	/*场景晋级*/
	const enum ScenePromoteFields {
		mapId = 0,
		level = 1,
		selfRank = 2,			/*自己排名*/
	}
	type ScenePromote = [number, number, number];

	/*更新积分*/
	const enum UpdateScoreFields {
		score = 0,			/*当前积分*/
		addScore = 1,			/*添加的积分*/
	}
	type UpdateScore = [number, number];

	/*更新玄火数*/
	const enum updateXuanhuoNumFields {
		score = 0,			/*当前玄火数*/
		addScore = 1,		/*添加的玄火数*/
		retain = 2,			/*保留玄火数*/
	}
	type updateXuanhuoNum = [number, number, number];

	/*玄火副本场景玩家数据*/
	const enum XuanhuoHumanDataFields {
		objId = 0,			/*玩家ID*/
		name = 1,			/*名字*/
		num = 2,			/*玄火数量*/
		teamId = 3,			/*队伍id*/
	}
	type XuanhuoHumanData = [number, string, number, string];

	/*玄火副本场景队伍数据*/
	const enum XuanhuoTeamDataFields {
		teamId = 0,			/*队伍id*/
		teamName = 1,		/*队伍名字*/
		Num = 2,			/*玄火数量*/
	}
	type XuanhuoTeamData = [string, string, number];

	/*玄火副本场景玄火数据*/
	const enum XuanhuoCopyNumDataFields {
		Obj = 0,			/* 玩家 */
		Team = 1,			/* 队伍 */
		TeamLenght = 2		/* 战队进场人数 */
	}
	type XuanhuoCopyNumData = [Array<XuanhuoHumanData>, Array<XuanhuoTeamData>, number];
	/*玄火副本公告提示*/
	const enum BroadcastXuanhuoNoticeFields {
		name = 0,
		msg = 1,
		vulcanId = 2
	}
	type BroadcastXuanhuoNotice = [string, string, number];
	/*玄火争夺副本结算奖励*/
	const enum XuanhuoCopyJudgeAwardFields {
		items = 0,                                /*获得奖励物品数据*/
		exNum = 1,                                /*玄火兑换道具数量*/
		selfRank = 2,                        /*个人排名*/
		teamRank = 3,                        /*战队排名*/
	}
	type XuanhuoCopyJudgeAward = [Array<Item>, number, number, number];

	/*搜索对象返回*/
	const enum SpecifySearchObjReplyFields {
		objId = 0,
		pos = 1,			/*目标位置*/
		playerId = 2,			/*1:玩家*/
	}
	type SpecifySearchObjReply = [number, Pos, number];
	// 圣装 - 至尊装备

	/*获取至尊装备信息返回*/
	const enum ZhizhunInfoFields {
		id = 0,
		feedLevel = 1,				/*培养等级*/
		feedSkillList = 2,			/*技能列表*/
		feedFighting = 3,			/*战力*/
	}
	type ZhizhunInfo = [number, number, Array<SkillInfo>, number];
	const enum GetZhizhunInfoReplyFields {
		list = 0,
		specialSkill = 1,
	}
	type GetZhizhunInfoReply = [Array<ZhizhunInfo>, [number, number]];

	/*更新至尊装备信息*/
	const enum UpdateZhizhunInfoFields {
		list = 0,
		specialSkill = 1,
	}
	type UpdateZhizhunInfo = [Array<ZhizhunInfo>, [number, number]];

	/*圣装礼包信息返回*/
	const enum GetHolyRechargeInfoReplyFields {
	}
	type GetHolyRechargeInfoReply = Array<HolyRechargeInfoSingle>;




	/*单个圣装礼包信息*/
	const enum HolyRechargeInfoSingleFields {
		index = 0,			//档位ID
		type = 1,			//圣装类型
		state = 2,			//0：不显示 1：显示
		num = 3,			//剩余购买次数
	}
	type HolyRechargeInfoSingle = [number, number, number, number];

	// /*更新至尊装备信息*/
	// const enum UpdateZhizhunInfoFields {
	// 	feedLevel = 0,				/*培养等级*/
	// 	feedSkillList = 1,			/*技能列表*/
	// 	feedFighting = 2,			/*战力*/
	// }
	// type UpdateZhizhunInfo = [number, Array<SkillInfo>, number];

	/*培养返回*/
	const enum FeedZhizhunReplyFields {
		result = 0,			/*返回值*/
	}
	type FeedZhizhunReply = [number];

	/*激活/升级技能返回*/
	const enum AddZhizhunSkillLevelReplyFields {
		result = 0,			/*返回值*/
	}
	type AddZhizhunSkillLevelReply = [number];

	/*现金装备出售返回*/
	const enum SellCashEquipReplyFields {
		result = 0,			/*结果*/
		//money,				/*账户剩余金钱*/
		iteamId,			/*卖出Id*/
		count,				/*卖出数量*/
	}
	type SellCashEquipReply = [number, number, number];

	/*现金装备出售返回*/
	const enum CashEquipInfoReplyFields {
		showType = 0,                        /*显示类型*/
		remainNum = 1,                        /*剩余数量*/
	}
	type CashEquipInfoReply = [Array<[number, number]>];


	/*现金装备合成返回*/
	const enum MergeCashEquipReplyFields {
		result = 0,			/*结果*/
	}
	type MergeCashEquipReply = [number];


	/*超级vip 任务*/
	const enum GetCumulateSuperVipTaskFields {
		build = 0,  	  /*累积获得*/
		quota = 1,        /*指定目标 */
	}
	type GetCumulateSuperVipTask = [number, number];

	/*超级vip 返回数据*/
	const enum GetCumulateSuperVipReplyFields {
		dayTotalMoney = 0,                	  /*当日累计充值*/
		totalMoney = 1,                       /*累计金额*/
		getState = 2,                         /*获得状态红点 0:不可获取，1可获取*/
		showState = 3,                        /*显示入口状态 0不显示，1显示*/
	}
	type GetCumulateSuperVipReply = [GetCumulateSuperVipTask, GetCumulateSuperVipTask, number, number];

	/*定制称号 返回数据*/
	const enum GetCustomDesignationReplyFields {
		dayTotalMoney = 0,                	  /*当日累计充值*/
		totalMoney = 1,                       /*累计金额(时间段)*/
		getState = 2,                         /*获得状态*/
	}
	type GetCustomDesignationReply = [number, number, number];

	/*设置头像信息发返回*/
	const enum SetHeadImgReplyFields {
		result = 0,
		id,
	}
	type SetHeadImgReply = [number, number];

	const enum headImgDataFields {
		id = 0,				/*ID*/
		level = 1,			/*等级*/
		status = 2,			/*是否激活*/
	}
	type headImgData = [number, number, number];

	/*设置头像信息发返回*/
	const enum GetHeadImgListReplyFields {
		headData = 0,
	}
	type GetHeadImgListReply = [Array<headImgData>];


	/*设置头像信息发返回*/
	const enum ActiveHeadImgReplyFields {
		result = 0,
	}
	type ActiveHeadImgReply = [number];




	/*获取九天副本返回*/
	const enum GetNineCopyReplyFields {
		nineCopy = 0,
	}
	type GetNineCopyReply = [NineCopy];
	/*获取玄火副本返回*/
	const enum GetXuanhuoCopyReplyFields {
		reEnterTime = 0,                        /*可以重新进入时间戳*/
	}
	type GetXuanhuoCopyReply = [number];
	/*更新九天副本*/
	const enum UpdateNineCopyFields {
		nineCopy = 0,
	}
	type UpdateNineCopy = [NineCopy];

	/*获取九天排名返回*/
	const enum GetNineCopyRankReplyFields {
		ranks = 0,
	}
	type GetNineCopyRankReply = [Array<NineRank>];

	/*更新九天之巅采集宝箱*/
	const enum UpdateNineGatherBoxFields {
		objId = 0,			/*目标*/
		pos = 1,			/*宝箱坐标*/
	}
	type UpdateNineGatherBox = [number, Pos];

	/*搜索对象返回*/
	const enum ReqSearchObjReplyFields {
		objId = 0,
		pos = 1,			/*目标位置*/
		type = 2,			/*1:玩家 2:怪物 3:道具 4:NPC*/
	}
	type ReqSearchObjReply = [number, Pos, number];

	/*更新采集地点*/
	const enum UpdateGatherPosFields {
		objId = 0,
		pos = 1,
	}
	type UpdateGatherPos = [number, Pos];

	/*更新Npc*/
	const enum UpdateNpcFields {
		npcs = 0,
	}
	type UpdateNpc = [Array<NpcShow>];

	/*获取背包返回*/
	const enum GetBagReplyFields {
		bagId = 0,			/*背包ID*/
		items = 1,			/*道具列表*/
	}
	type GetBagReply = [number, Array<Item>];

	/*更新背包道具*/
	const enum UpdateBagFields {
		bags = 0,			/*背包更新*/
	}
	type UpdateBag = [Array<BagOper>];

	/*取探索仓库物品到背包返回*/
	const enum TaskXunbaoBagItemListReplyFields {
		result = 0,
	}
	type TaskXunbaoBagItemListReply = [number];

	/*取探索仓库所有返回*/
	const enum TaskXunbaoBagAllItemReplyFields {
		result = 0,
	}
	type TaskXunbaoBagAllItemReply = [number];

	/*使用物品返回*/
	const enum useBagItemReplyFields {
		result = 0,
	}
	type useBagItemReply = [number];

	/*特殊道具外观提示*/
	const enum UpdateBagItemShowFields {
		showId = 0,			/*外观id*/
	}
	type UpdateBagItemShow = [number];

	/*取仙玉探索仓库物品到背包返回*/
	const enum TaskXianYuXunbaoBagItemListReplyFields {
		result = 0,
	}
	type TaskXianYuXunbaoBagItemListReply = [number];

	/*取仙玉探索仓库所有返回*/
	const enum TaskXianYuXunbaoBagAllItemReplyFields {
		result = 0,
	}
	type TaskXianYuXunbaoBagAllItemReply = [number];

	/*获取宠物信息返回*/
	const enum GetPetInfoReplyFields {
		feed = 0,			/*培养*/
		rank = 1,			/*升阶*/
		magicShow = 2,			/*幻化*/
		refine = 3,			/*修炼*/
		fazhen = 4,			/*法阵*/
		curShowId = 5,			/*当前外观id*/
	}
	type GetPetInfoReply = [PetFeed, PetRank, PetMagicShow, PetRefine, PetFazhen, number];

	/*培养返回*/
	const enum FeedPetReplyFields {
		result = 0,			/*返回值*/
		level = 1,			/*当前等级*/
		exp = 2,			/*当前经验值*/
	}
	type FeedPetReply = [number, number, number];

	/*更新宠物信息*/
	const enum UpdatePetInfoFields {
		feed = 0,			/*培养*/
		rank = 1,			/*升阶*/
		magicShow = 2,			/*幻化*/
		refine = 3,			/*修炼*/
		fazhen = 4,			/*法阵*/
		curShowId = 5,			/*当前外观id*/
	}
	type UpdatePetInfo = [PetFeed, PetRank, PetMagicShow, PetRefine, PetFazhen, number];

	/*激活/升级技能返回*/
	const enum AddPetSkillLevelReplyFields {
		result = 0,			/*返回值*/
	}
	type AddPetSkillLevelReply = [number];

	/*升阶返回*/
	const enum RankPetReplyFields {
		result = 0,			/*返回值*/
		star = 1,			/*当前星级*/
		blessing = 2,			/*当前祝福值*/
	}
	type RankPetReply = [number, number, number];

	/*更换外观返回*/
	const enum ChangePetShowReplyFields {
		result = 0,			/*返回值*/
		showId = 1,			/*当前外观id*/
	}
	type ChangePetShowReply = [number, number];

	/*幻化激活/升星返回*/
	const enum RiseMagicShowReplyFields {
		result = 0,			/*返回值*/
	}
	type RiseMagicShowReply = [number];

	/*更换幻化返回*/
	const enum ChangeMagicShowReplyFields {
		result = 0,			/*返回值*/
		magicShowId = 1,			/*当前幻化id*/
	}
	type ChangeMagicShowReply = [number, number];

	/*修炼返回*/
	const enum RiseRefineReplyFields {
		result = 0,			/*返回值*/
	}
	type RiseRefineReply = [number];

	/*法阵激活/升级返回*/
	const enum AddPetFazhenReplyFields {
		result = 0,			/*返回值*/
	}
	type AddPetFazhenReply = [number];

	/*更换法阵返回*/
	const enum ChangePetFazhenReplyFields {
		result = 0,			/*返回值*/
		showId = 1,			/*当前法阵id*/
	}
	type ChangePetFazhenReply = [number, number];

	/*获取精灵信息返回*/
	const enum GetRideInfoReplyFields {
		feed = 0,			/*培养*/
		rank = 1,			/*升阶*/
		magicShow = 2,			/*幻化*/
		refine = 3,			/*修炼*/
		fazhen = 4,			/*法阵*/
		curShowId = 5,			/*当前外观id*/
	}
	type GetRideInfoReply = [PetFeed, PetRank, PetMagicShow, PetRefine, PetFazhen, number];

	/*培养返回*/
	const enum FeedRideReplyFields {
		result = 0,			/*返回值*/
		level = 1,			/*当前等级*/
		exp = 2,			/*当前经验值*/
	}
	type FeedRideReply = [number, number, number];

	/*更新精灵信息*/
	const enum UpdateRideInfoFields {
		feed = 0,			/*培养*/
		rank = 1,			/*升阶*/
		magicShow = 2,			/*幻化*/
		refine = 3,			/*修炼*/
		fazhen = 4,			/*法阵*/
		curShowId = 5,			/*当前外观id*/
	}
	type UpdateRideInfo = [PetFeed, PetRank, PetMagicShow, PetRefine, PetFazhen, number];

	/*激活/升级技能返回*/
	const enum AddRideSkillLevelReplyFields {
		result = 0,			/*返回值*/
	}
	type AddRideSkillLevelReply = [number];

	/*升阶返回*/
	const enum RankRideReplyFields {
		result = 0,			/*返回值*/
		star = 1,			/*当前星级*/
		blessing = 2,			/*当前祝福值*/
	}
	type RankRideReply = [number, number, number];

	/*更换外观返回*/
	const enum ChangeRideShowReplyFields {
		result = 0,			/*返回值*/
		showId = 1,			/*当前外观id*/
	}
	type ChangeRideShowReply = [number, number];

	/*幻化激活/升星返回*/
	const enum RiseRideMagicShowReplyFields {
		result = 0,			/*返回值*/
	}
	type RiseRideMagicShowReply = [number];

	/*更换幻化返回*/
	const enum ChangeRideMagicShowReplyFields {
		result = 0,			/*返回值*/
		magicShowId = 1,			/*当前幻化id*/
	}
	type ChangeRideMagicShowReply = [number, number];

	/*修炼返回*/
	const enum RiseRideRefineReplyFields {
		result = 0,			/*返回值*/
	}
	type RiseRideRefineReply = [number];

	/*法阵激活/升级返回*/
	const enum AddRideFazhenReplyFields {
		result = 0,			/*返回值*/
	}
	type AddRideFazhenReply = [number];

	/*更换法阵返回*/
	const enum ChangeRideFazhenReplyFields {
		result = 0,			/*返回值*/
		showId = 1,			/*当前法阵id*/
	}
	type ChangeRideFazhenReply = [number, number];

	/*获取返回*/
	const enum GetSoulInfoReplyFields {
		refine = 0,			/*金身修炼*/
		rise = 1,			/*不败金身修炼*/
		attr = 2,			/*总属性*/
	}
	type GetSoulInfoReply = [SoulRefine, SoulRise, Array<TypesAttr>];

	/*更新金身信息*/
	const enum UpdateSoulInfoFields {
		refine = 0,			/*金身修炼*/
		rise = 1,			/*不败金身修炼*/
		attr = 2,			/*总属性*/
	}
	type UpdateSoulInfo = [SoulRefine, SoulRise, Array<TypesAttr>];

	/*修炼返回*/
	const enum RefineSoulReplyFields {
		result = 0,			/*返回值*/
	}
	type RefineSoulReply = [number];

	/*修炼不败金身返回*/
	const enum RiseSoulReplyFields {
		result = 0,			/*返回值*/
	}
	type RiseSoulReply = [number];

	/*获取返回*/
	const enum GetAmuletInfoReplyFields {
		refine = 0,			/*圣物升级*/
		rise = 1,			/*圣物属性*/
	}
	type GetAmuletInfoReply = [AmuletRefine, AmuletRise];

	/*更新圣物信息*/
	const enum UpdateAmuletInfoFields {
		refine = 0,			/*圣物升级*/
		rise = 1,			/*圣物属性*/
	}
	type UpdateAmuletInfo = [AmuletRefine, AmuletRise];

	/*升级返回*/
	const enum RefineAmuletReplyFields {
		result = 0,			/*返回值*/
		curLevel = 1,			/*当前等级*/
	}
	type RefineAmuletReply = [number, number];

	/*获取返回*/
	const enum GetGemInfoReplyFields {
		list = 0,			/*格子列表*/
		riseLevel = 1,			/*仙石大师等级*/
		risePoint = 2,			/*仙石大师是否可以升级*/
		fighting = 3,			/*总战力*/
		gemLevel = 4,			/*仙石总等级*/
	}
	type GetGemInfoReply = [Array<GemGrids>, number, boolean, number, number];

	/*更新仙石信息*/
	const enum UpdateGemInfoFields {
		list = 0,			/*格子列表*/
		riseLevel = 1,			/*仙石大师等级*/
		risePoint = 2,			/*仙石大师是否可以升级*/
		fighting = 3,			/*总战力*/
		gemLevel = 4,			/*仙石总等级*/
	}
	type UpdateGemInfo = [Array<GemGrids>, number, boolean, number, number];

	/*镶嵌返回*/
	const enum InlayGemReplyFields {
		result = 0,			/*返回值*/
	}
	type InlayGemReply = [number];

	/*替换返回*/
	const enum ReplaceGemReplyFields {
		result = 0,			/*返回值*/
	}
	type ReplaceGemReply = [number];

	/*升级返回*/
	const enum RefineGemReplyFields {
		result = 0,			/*返回值*/
	}
	type RefineGemReply = [number];

	/*升级仙石大师返回*/
	const enum RiseGemReplyFields {
		result = 0,			/*返回值*/
	}
	type RiseGemReply = [number];

	/*一键操作返回*/
	const enum OneKeyRefineGemReplyFields {
		result = 0,			/*返回值*/
		type = 1,			/*操作类型： 0：镶嵌   1：替换  2： 升级*/
		part = 2,			/*仙石格子 0vip 1青龙 2白虎 3朱雀 4玄武*/
	}
	type OneKeyRefineGemReply = [number, number, Array<number>];

	/*获取角色技能返回*/
	const enum GetSkillsReplyFields {
		fighting = 0,			/*战力*/
		skills = 1,
		points = 2,			/*未激活技能列表*/
	}
	type GetSkillsReply = [number, Array<Skill>, Array<number>];

	/*更新角色技能*/
	const enum UpdateSkillFields {
		fighting = 0,			/*战力*/
		skills = 1,
		points = 2,			/*未激活技能列表*/
	}
	type UpdateSkill = [number, Array<Skill>, Array<number>];

	/*增加角色技能(用于任务)*/
	const enum AddSkillFields {
		skillId = 0,			/*技能ID*/
	}
	type AddSkill = [number];

	/*更新魔力*/
	const enum UpdateZQFields {
		count = 0,			/*魔力*/
		source = 1,			/*来源*/
	}
	type UpdateZQ = [number, number];

	/*升级技能返回*/
	const enum AddSkillLevelReplyFields {
		result = 0,			/*返回值*/
	}
	type AddSkillLevelReply = [number];

	/*一键升级技能返回*/
	const enum AddSkillLevelOfAllReplyFields {
		result = 0,			/*返回值*/
		skills = 1,			/*升级的技能列表*/
	}
	type AddSkillLevelOfAllReply = [number, Array<number>];

	/*激活技能返回*/
	const enum OpenSkillReplyFields {
		result = 0,			/*返回值*/
	}
	type OpenSkillReply = [number];

	/*获取签到信息返回*/
	const enum GetSignReplyFields {
		theNumber = 0,			/*本月签到次数*/
		accIndex = 1,			/*本月累计奖励已领取过的索引*/
		signTag = 2,			/*签到标记*/
		dayNumber = 3,			/*本月天数*/
		eraLevel = 4,			/*当前签到的觉醒等级*/
	}
	type GetSignReply = [number, Array<number>, boolean, number, number];

	/*签到返回*/
	const enum SignReplyFields {
		result = 0,
	}
	type SignReply = [number];

	/*扫荡副本返回*/
	const enum SweepCopyReplyFields {
		result = 0,
		mapId = 1,
	}
	type SweepCopyReply = [number, number];

	/*获取单人BOSS副本返回*/
	const enum GetSingleBossCopyReplyFields {
		singleBossCopys = 0,			/*单人BOSS副本列表*/
	}
	type GetSingleBossCopyReply = [Array<SingleBossCopy>];

	/*更新单人BOSS副本*/
	const enum UpdateSingleBossCopyFields {
		singleBossCopys = 0,			/*单人BOSS副本列表*/
	}
	type UpdateSingleBossCopy = [Array<SingleBossCopy>];

	/*获取BOSS返回*/
	const enum GetBossReplyFields {
		bossInfos = 0,			/*BOSS信息*/
	}
	type GetBossReply = [Array<BossInfo>];

	/*更新BOSS 死亡、重生推送*/
	const enum UpdateBossFields {
		bossInfos = 0,			/*BOSS信息*/
	}
	type UpdateBoss = [Array<BossInfo>];

	/*BOSS 伤害排行*/
	const enum UpdateBossHurtRackFields {
		hurtRank = 0,			/*BOSS信息*/
	}
	type UpdateBossHurtRack = [Array<HurtRank>];

	/*获取关注的BOSS返回*/
	const enum GetFollowBossReplyFields {
		follows = 0,			/*关注BOSS*/
	}
	type GetFollowBossReply = [Array<FollowBoss>];

	/*获取BOSS次数*/
	const enum GetBossTimesReplyFields {
		bossTimes = 0,			/*BOSS次数*/
	}
	type GetBossTimesReply = [Array<BossTimes>];

	/*更新BOSS次数*/
	const enum UpdateBossTimesFields {
		bossTimes = 0,			/*BOSS次数*/
	}
	type UpdateBossTimes = [BossTimes];

	/*鼓舞返回*/
	const enum ReqInspireReplyFields {
		result = 0,
	}
	type ReqInspireReply = [number];

	/*鼓舞*/
	const enum UpdateInspireFields {
		inspires = 0,			/*鼓舞*/
	}
	type UpdateInspire = [Array<Inspire>];

	/*进入公共BOSS时，BOSS已死亡且没有伤害记录则推送(寻路过程中BOSS死亡不会推送)*/
	const enum UpdateEnterLaterFields {
	}
	type UpdateEnterLater = null;

	/*获取BOSS排行记录*/
	const enum GetBossRankRecordReplyFields {
		occ = 0,			/*BOSS id*/
		rankRecords = 1,			/*排名奖励*/
		selfRank = 2,			/*自己排名, 0:上一次未参与*/
		selfHurt = 3,			/*总伤害*/
	}
	type GetBossRankRecordReply = [number, Array<BossRankRecord>, number, number];

	/**BOSS击杀信息*/
	const enum AutoSC_BossKillInfosFields {
		objId = 0,                                                              /**角色id*/
		name = 1,                                                               /**角色名字*/
	}
	type AutoSC_BossKillInfos = [number, string]                                /**BOSS击杀信息*/

	/*领取参与奖励*/
	const enum GetJoinAwardReplyFields {
		result = 0,
	}
	type GetJoinAwardReply = [number];

	/*更新参与奖励*/
	const enum UpdateJoinAwardFields {
		states = 0,
	}
	type UpdateJoinAward = [Array<AwardState>];

	/*更新BOSS状态*/
	const enum UpdateBossStateFields {
		states = 0,
	}
	type UpdateBossState = [Array<BossInfo>];

	/*更新BOSS掉落归属*/
	const enum UpdateBossDropOwnsFields {
		drop = 0,
	}
	type UpdateBossDropOwns = [Array<DropOwn>];

	/*获取多人BOSS是否第一次打，引导用*/
	const enum GetBossIsFirstReplyFields {
		isFirst = 0,
	}
	type GetBossIsFirstReply = [boolean];

	/*一键扫荡试炼副本*/
	const enum OneKeySweepShilianCopyReplyFields {
		result = 0,
	}
	type OneKeySweepShilianCopyReply = [number];

	/*一键挑战试炼副本*/
	const enum OneKeyChallengeShilianCopyReplyFields {
		result = 0,
	}
	type OneKeyChallengeShilianCopyReply = [number];

	/*获取七日礼*/
	const enum GetSevenDayReplyFields {
		day = 0,			/*当前天数*/
		dayStates = 1,			/*每天礼包状态 0:未领取 1:已领*/
	}
	type GetSevenDayReply = [number, Array<GiftState>];

	/*更新七日礼*/
	const enum UpdateSevenDayFields {
		day = 0,			/*当前天数*/
		dayStates = 1,			/*每天礼包状态 0:未领取 1:已领*/
	}
	type UpdateSevenDay = [number, Array<GiftState>];

	/*领取七日礼*/
	const enum GetSevenDayAwardReplyFields {
		result = 0,			/*错误码*/
	}
	type GetSevenDayAwardReply = [number];

	/*获取返回*/
	const enum GetOnlineRewardReplyFields {
		list = 0,			/*领奖励列表*/
	}
	type GetOnlineRewardReply = [Array<OnlineReward>];

	/*更新*/
	const enum UpdateOnlineRewardFields {
		list = 0,			/*领奖励列表*/
	}
	type UpdateOnlineReward = [Array<OnlineReward>];

	/*领取返回*/
	const enum GetOnlineRewardAwardReplyFields {
		result = 0,			/*错误码*/
	}
	type GetOnlineRewardAwardReply = [number];

	/*获取邮件数量返回*/
	const enum GetEmailCountReplyFields {
		uuids = 0,
	}
	type GetEmailCountReply = [Array<string>];

	/*获取邮件*/
	const enum GetEmailsReplyFields {
		emails = 0,
	}
	type GetEmailsReply = [Array<Email>];

	/*更新邮件状态*/
	const enum UpdateEmailsStateFields {
		states = 0,
	}
	type UpdateEmailsState = [Array<EmailState>];

	/*领取邮件附件返回*/
	const enum GetEmailsAttachReplyFields {
		result = 0,
	}
	type GetEmailsAttachReply = [number];

	/*删除邮件*/
	const enum UpdateDelEmailsFields {
		uuids = 0,
	}
	type UpdateDelEmails = [Array<string>];

	/*增加邮件*/
	const enum UpdateAddEmailsFields {
		emails = 0,
	}
	type UpdateAddEmails = [Array<Email>];

	/*删除邮件*/
	const enum DelEmailsReplyFields {
		result = 0,
	}
	type DelEmailsReply = [number];

	/*获取觉醒信息返回*/
	const enum GetEraInfoReplyFields {
		level = 0,			/*觉醒等级*/
		nodes = 1,
	}
	type GetEraInfoReply = [number, Array<EraNode>];

	/*更新觉醒信息*/
	const enum UpdateEraInfoFields {
		level = 0,			/*觉醒等级*/
		nodes = 1,
	}
	type UpdateEraInfo = [number, Array<EraNode>];

	/*觉醒返回*/
	const enum EraReplyFields {
		result = 0,
	}
	type EraReply = [number];

	/*觉醒boss返回*/
	const enum EraBossReplyFields {
		result = 0,
	}
	type EraBossReply = [number];

	/*觉醒丹觉醒*/
	const enum FastEraReplyFields {
		result = 0,
	}
	type FastEraReply = [number];

	/*领取任务奖励返回*/
	const enum DrawEraTaskReplyFields {
		result = 0,
	}
	type DrawEraTaskReply = [number];

	/*获取返回*/
	const enum GetStrongInfoReplyFields {
		list = 0,			/*格子列表*/
		riseLevel = 1,			/*强化大师等级*/
		risePoint = 2,			/*强化大师是否可以升级*/
		rise2Level = 3,			/*强化神匠等级*/
		rise2Point = 4,			/*强化神匠是否可以升级*/
		fighting = 5,			/*总战力*/
	}
	type GetStrongInfoReply = [Array<StrongGrids>, number, boolean, number, boolean, number];

	/*更新仙石信息*/
	const enum UpdateStrongInfoFields {
		list = 0,			/*格子列表*/
		riseLevel = 1,			/*强化大师等级*/
		risePoint = 2,			/*强化大师是否可以升级*/
		rise2Level = 3,			/*强化神匠等级*/
		rise2Point = 4,			/*强化神匠是否可以升级*/
		fighting = 5,			/*总战力*/
	}
	type UpdateStrongInfo = [Array<StrongGrids>, number, boolean, number, boolean, number];

	/*升级返回*/
	const enum RefineStrongReplyFields {
		result = 0,			/*返回值*/
	}
	type RefineStrongReply = [number];

	/*一键升级返回*/
	const enum RefineStrongOfAllReplyFields {
		result = 0,			/*返回值*/
		parts = 1,			/*升级的部位列表*/
	}
	type RefineStrongOfAllReply = [number, Array<number>];

	/*升级强化大师/神匠返回*/
	const enum RiseStrongReplyFields {
		result = 0,			/*返回值*/
	}
	type RiseStrongReply = [number];

	/*获取返回*/
	const enum GetZhuhunInfoReplyFields {
		zhuhunList = 0,			/*铸魂列表*/
		shihunList = 1,			/*噬魂列表*/
		fighting = 2,			/*总战力*/
	}
	type GetZhuhunInfoReply = [Array<ZhuhunGrids>, Array<ShihunGrids>, number];

	/*更新信息*/
	const enum UpdateZhuhunInfoFields {
		zhuhunList = 0,			/*铸魂列表*/
		shihunList = 1,			/*噬魂列表*/
		fighting = 2,			/*总战力*/
	}
	type UpdateZhuhunInfo = [Array<ZhuhunGrids>, Array<ShihunGrids>, number];

	/*铸魂返回*/
	const enum ZhuhunOperReplyFields {
		result = 0,			/*返回值*/
	}
	type ZhuhunOperReply = [number];

	/*一键铸魂返回*/
	const enum ZhuhunOperOneKeyReplyFields {
		result = 0,			/*返回值*/
		parts = 1,			/*升级的部位列表*/
	}
	type ZhuhunOperOneKeyReply = [number, Array<number>];

	/*噬魂返回*/
	const enum ShihunOperReplyFields {
		result = 0,			/*返回值*/
	}
	type ShihunOperReply = [number];

	/*一键噬魂返回*/
	const enum ShihunOperOneKeyReplyFields {
		result = 0,			/*返回值*/
	}
	type ShihunOperOneKeyReply = [number];

	/*合成返回*/
	const enum ComposeReplyFields {
		result = 0,			/*返回值*/
	}
	type ComposeReply = [number];

	/*分解返回*/
	const enum ResolveReplyFields {
		result = 0,			/*返回值*/
	}
	type ResolveReply = [number];

	/*获取熔炼信息返回*/
	const enum GetSmeltInfoReplyFields {
		level = 0,			/*等级*/
		exp = 1,			/*经验*/
	}
	type GetSmeltInfoReply = [number, number];

	/*熔炼返回*/
	const enum SmeltReplyFields {
		result = 0,			/*返回值*/
		level = 1,			/*等级*/
		curExp = 2,			/*当前经验*/
		exp = 3,			/*经验*/
		copper = 4,			/*金币*/
		stone = 5,			/*强化石数量*/
	}
	type SmeltReply = [number, number, number, number, number, number];

	/*获取历练信息返回*/
	const enum GetLilianInfoReplyFields {
		list = 0,			/*任务列表*/
		dayExp = 1,			/*日累计活跃值*/
		dayGrade = 2,			/*日累计档次*/
		dayState = 3,			/*日累计状态 0未达成 1可领取 2已领取*/
		riseLevel = 4,			/*升阶等级*/
		riseExp = 5,			/*升阶经验*/
	}
	type GetLilianInfoReply = [Array<LilianTaskNode>, number, number, number, number, number];

	/*更新历练整个信息*/
	const enum UpdateLilianAllFields {
		list = 0,			/*任务列表*/
		dayExp = 1,			/*日累计活跃值*/
		dayGrade = 2,			/*日累计档次*/
		dayState = 3,			/*日累计状态 0未达成 1可领取 2已领取*/
		riseLevel = 4,			/*升阶等级*/
		riseExp = 5,			/*升阶经验*/
	}
	type UpdateLilianAll = [Array<LilianTaskNode>, number, number, number, number, number];

	/*更新历练单个任务*/
	const enum UpdateLilianTaskFields {
		task = 0,			/*任务*/
	}
	type UpdateLilianTask = [LilianTaskNode];

	/*领取历练任务奖励返回*/
	const enum GetLilianTaskAwardReplyFields {
		result = 0,			/*返回值*/
	}
	type GetLilianTaskAwardReply = [number];

	/*领取历练日奖励*/
	const enum GetLilianDayAwardReplyFields {
		result = 0,			/*返回值*/
	}
	type GetLilianDayAwardReply = [number];

	/*获取历练信息返回*/
	const enum GetXianweiInfoReplyFields {
		list = 0,			/*任务列表*/
		wages = 1,			/*俸禄列表*/
		riseId = 2,			/*升阶id*/
		riseExp = 3,			/*升阶仙力值*/
	}
	type GetXianweiInfoReply = [Array<XianweiTaskNode>, Array<XianweiWageNode>, number, number];

	/*更新历练整个信息*/
	const enum UpdateXianweiAllFields {
		list = 0,			/*任务列表*/
		wages = 1,			/*俸禄列表*/
		riseId = 2,			/*升阶id*/
		riseExp = 3,			/*升阶仙力值*/
	}
	type UpdateXianweiAll = [Array<XianweiTaskNode>, Array<XianweiWageNode>, number, number];

	/*更新单个任务*/
	const enum UpdateXianweiTaskFields {
		task = 0,			/*任务*/
	}
	type UpdateXianweiTask = [XianweiTaskNode];

	/*领取任务奖励返回*/
	const enum GetXianweiTaskAwardReplyFields {
		result = 0,			/*返回值*/
	}
	type GetXianweiTaskAwardReply = [number];

	/*领取日奖励*/
	const enum GetXianweiDayAwardReplyFields {
		result = 0,			/*返回值*/
	}
	type GetXianweiDayAwardReply = [number];

	/*获取历练信息返回*/
	const enum GetKuanghaiInfoReplyFields {
		openState = 0,			/*活动状态(0关闭 1开启)*/
		taskList = 1,			/*任务列表*/
		gradeList = 2,			/*档次列表*/
		id = 3,			/*活动id*/
		exp = 4,			/*总嗨值*/
		restTm = 5,			/*剩余时间*/
	}

	type GetKuanghaiInfoReply = [number, Array<KuanghaiTaskNode>, Array<KuanghaiGradeNode>, number, number, number];

	/*获取历练信息返回*/
	const enum GetKuanghai2InfoReplyFields {
		openState = 0,			/*活动状态(0关闭 1开启)*/
		taskList = 1,			/*任务列表*/
		gradeList = 2,			/*档次列表*/
		id = 3,			/*活动id*/
		exp = 4,			/*总嗨值*/
		restTm = 5,			/*剩余时间*/
		isBuy = 6,			/*是否购买 0：未购买 1：已购买*/
		point = 7,			/*活动点数*/
		isFinish = 8,		/*是否领取最终奖励*/
	}
	type GetKuanghai2InfoReply = [number, Array<KuanghaiTaskNode>, Array<KuanghaiGradeNode>, number, number, number, number, number, number];

	/*更新单个任务*/
	const enum UpdateKuanghaiTaskFields {
		task = 0,			/*任务*/
	}
	type UpdateKuanghaiTask = [KuanghaiTaskNode];
	/*更新单个任务*/
	const enum UpdateKuanghai2TaskFields {
		task = 0,			/*任务*/
	}
	type UpdateKuanghai2Task = [KuanghaiTaskNode];
	/*领取任务奖励返回*/
	const enum GetKuanghaiTaskAwardReplyFields {
		result = 0,			/*返回值*/
	}
	type GetKuanghaiTaskAwardReply = [number];
	/*领取任务奖励返回*/
	const enum GetKuanghai2TaskAwardReplyFields {
		result = 0,			/*返回值*/
	}
	type GetKuanghai2TaskAwardReply = [number];
	/*领取奖励*/
	const enum GetKuanghaiAwardReplyFields {
		result = 0,			/*返回值*/
	}
	type GetKuanghaiAwardReply = [number];
	/*领取奖励*/
	const enum GetKuanghai2AwardReplyFields {
		result = 0,			/*返回值*/
	}
	type GetKuanghai2AwardReply = [number];
	/*领取奖励*/
	const enum JumpKuanghai2TaskReplyFields {
		result = 0,			/*返回值*/
	}
	type JumpKuanghai2TaskReply = [number];
	/*领取奖励*/
	const enum GetKuanghai2FinalRewardReplyFields {
		result = 0,			/*返回值*/
	}
	type GetKuanghai2FinalRewardReply = [number];


	/*获取神兵信息返回*/
	const enum GetShenbingInfoReplyFields {
		feedLevel = 0,			/*培养等级*/
		feedSkillList = 1,			/*技能列表*/
		feedFighting = 2,			/*战力*/
		curShowId = 3,			/*当前使用的幻化id，0表示没使用*/
		showList = 4,			/*幻化列表*/
		magicShowFighting = 5,			/*战力*/
		magicShowAttr = 6,			/*幻化总属性*/
		refineList = 7,			/*修炼列表*/
		refineFighting = 8,			/*战力*/
		refineAttr = 9,			/*修炼总属性*/
	}
	type GetShenbingInfoReply = [number, Array<SkillInfo>, number, number, Array<MagicShowInfo>, number, Array<TypesAttr>, Array<RefineInfo>, number, Array<TypesAttr>];

	/*更新信息*/
	const enum UpdateShenbingInfoFields {
		feedLevel = 0,			/*培养等级*/
		feedSkillList = 1,			/*技能列表*/
		feedFighting = 2,			/*战力*/
		curShowId = 3,			/*当前使用的幻化id，0表示没使用*/
		showList = 4,			/*幻化列表*/
		magicShowFighting = 5,			/*战力*/
		magicShowAttr = 6,			/*幻化总属性*/
		refineList = 7,			/*修炼列表*/
		refineFighting = 8,			/*战力*/
		refineAttr = 9,			/*修炼总属性*/
	}
	type UpdateShenbingInfo = [number, Array<SkillInfo>, number, number, Array<MagicShowInfo>, number, Array<TypesAttr>, Array<RefineInfo>, number, Array<TypesAttr>];

	/*培养返回*/
	const enum FeedShenbingReplyFields {
		result = 0,			/*返回值*/
	}
	type FeedShenbingReply = [number];

	/*激活/升级技能返回*/
	const enum AddShenbingSkillLevelReplyFields {
		result = 0,			/*返回值*/
	}
	type AddShenbingSkillLevelReply = [number];

	/*幻化激活/升级返回*/
	const enum AddShenbingMagicShowReplyFields {
		result = 0,			/*返回值*/
	}
	type AddShenbingMagicShowReply = [number];

	/*更换幻化返回*/
	const enum ChangeShenbingMagicShowReplyFields {
		result = 0,			/*返回值*/
		magicShowId = 1,			/*当前幻化id*/
	}
	type ChangeShenbingMagicShowReply = [number, number];

	/*修炼返回*/
	const enum AddShenbingRefineReplyFields {
		result = 0,			/*返回值*/
	}
	type AddShenbingRefineReply = [number];

	/*获取仙翼信息返回*/
	const enum GetWingInfoReplyFields {
		feedLevel = 0,			/*培养等级*/
		feedSkillList = 1,			/*技能列表*/
		feedFighting = 2,			/*战力*/
		curShowId = 3,			/*当前使用的幻化id，0表示没使用*/
		showList = 4,			/*幻化列表*/
		magicShowFighting = 5,			/*战力*/
		magicShowAttr = 6,			/*幻化总属性*/
		refineList = 7,			/*修炼列表*/
		refineFighting = 8,			/*战力*/
		refineAttr = 9,			/*修炼总属性*/
	}
	type GetWingInfoReply = [number, Array<SkillInfo>, number, number, Array<MagicShowInfo>, number, Array<TypesAttr>, Array<RefineInfo>, number, Array<TypesAttr>];

	/*更新信息*/
	const enum UpdateWingInfoFields {
		feedLevel = 0,			/*培养等级*/
		feedSkillList = 1,			/*技能列表*/
		feedFighting = 2,			/*战力*/
		curShowId = 3,			/*当前使用的幻化id，0表示没使用*/
		showList = 4,			/*幻化列表*/
		magicShowFighting = 5,			/*战力*/
		magicShowAttr = 6,			/*幻化总属性*/
		refineList = 7,			/*修炼列表*/
		refineFighting = 8,			/*战力*/
		refineAttr = 9,			/*修炼总属性*/
	}
	type UpdateWingInfo = [number, Array<SkillInfo>, number, number, Array<MagicShowInfo>, number, Array<TypesAttr>, Array<RefineInfo>, number, Array<TypesAttr>];

	/*培养返回*/
	const enum FeedWingReplyFields {
		result = 0,			/*返回值*/
	}
	type FeedWingReply = [number];

	/*激活/升级技能返回*/
	const enum AddWingSkillLevelReplyFields {
		result = 0,			/*返回值*/
	}
	type AddWingSkillLevelReply = [number];

	/*幻化激活/升级返回*/
	const enum AddWingMagicShowReplyFields {
		result = 0,			/*返回值*/
	}
	type AddWingMagicShowReply = [number];

	/*更换幻化返回*/
	const enum ChangeWingMagicShowReplyFields {
		result = 0,			/*返回值*/
		magicShowId = 1,			/*当前幻化id*/
	}
	type ChangeWingMagicShowReply = [number, number];

	/*修炼返回*/
	const enum AddWingRefineReplyFields {
		result = 0,			/*返回值*/
	}
	type AddWingRefineReply = [number];

	/*获取探索信息返回*/
	const enum GetXunbaoInfoReplyFields {
		type = 0,			/*类型 0装备 1巅峰 2至尊 3仙符 4圣物*/
		restTime = 1,			/*剩余时间（毫秒）*/
		blessing = 2,			/*祝福值*/
		coupon = 3,			/*代币*/
		selfBroadcastList = 4,			/*个人记录*/
		firstFlag = 5,			/*第一次额外奖励标记(0未领 1已领)*/
		isFree = 6,			/*是否可以免费抽一次*/
	}
	type GetXunbaoInfoReply = [number, number, number, number, Array<XunbaoNote>, number, boolean];

	/*获取勾选探索兑换提醒列表返回*/
	const enum GetXunBaoHintReplyFields {
		hintList = 0,			/*勾选提醒id列表*/
	}
	type GetXunBaoHintReply = [Array<XunbaoHint>];

	/*更新探索信息*/
	const enum UpdateXunbaoInfoFields {
		type = 0,			/*类型 0装备 1巅峰 2至尊 3仙符 4圣物*/
		blessing = 1,			/*祝福值*/
		coupon = 2,			/*代币*/
		firstFlag = 3,			/*第一次额外奖励标记(0未领 1已领)*/
		isFree = 4,			/*是否可以免费抽一次*/
	}
	type UpdateXunbaoInfo = [number, number, number, number, boolean];

	/*增加个人记录*/
	const enum AddXunbaoSelfBroadcastFields {
		type = 0,			/*类型 0装备 1巅峰 2至尊 3仙符 4圣物*/
		selfBroadcastList = 1,			/*个人记录*/
	}
	type AddXunbaoSelfBroadcast = [number, Array<XunbaoNote>];

	/*探索返回*/
	const enum RunXunbaoReplyFields {
		type = 0,			/*类型 0装备 1巅峰 2至尊 3仙符 4圣物*/
		result = 1,			/*返回值*/
		items = 2,			/*道具列表*/
		firstFlag = 3,			/*第一次额外奖励标记(0未领 1已领)*/
	}
	type RunXunbaoReply = [number, number, Array<number>, number];

	/*探索兑换结果返回*/
	const enum XunBaoExchangeReplyFields {
		result = 0,			/*返回值*/
		id = 1,             /*id*/
		limitCount = 2,     /*购买次数*/
	}
	type XunBaoExchangeReply = [number, number, number];

	/*离线挂机返回*/
	const enum GetOutlineInfoReplyFields {
		curLevel = 0,			/*当前等级*/
		newLevel = 1,			/*新等级*/
		tm = 2,			/*时间(秒)*/
		copper = 3,			/*金币*/
		exp = 4,			/*经验*/
		zq = 5,			/*魔力*/
		equipCount = 6,			/*装备数量*/
		lzCount = 7,			/*龙珠数量*/
	}
	type GetOutlineInfoReply = [number, number, number, number, number, number, number, number];

	/*返回*/
	const enum GetMonthCardInfoReplyFields {
		flag = 0,			/*开启标志 0未开启 1开启*/
		addCount = 1,			/*累计次数*/
		restDay = 2,			/*剩余天数*/
		rewardList = 3,			/*奖励状态列表(0-29)*/
	}
	type GetMonthCardInfoReply = [number, number, number, Array<number>];

	/*获取代币券周卡信息返回*/
	const enum GetWeekYuanbaoCardInfoReplyFields {
		endTm = 0,				/*到期时间*/
		flag = 1,				/*开启标志 0未开启 1开启*/
		isRenew = 2,			/*是否可以续费 0不可续费 1可续费*/
		isDayAward = 3,			/*是否已领取奖励（每天） 1可领取 2已领取*/
	}
	type GetWeekYuanbaoCardInfoReply = [number, number, number, number];

	/*福利周卡获取信息返回*/
	const enum GetWeekFuliCardInfoReplyFields {
		endTm = 0,				/*到期时间*/
		flag = 1,				/*开启标志 0未开启 1开启*/
		isRenew = 2,			/*是否可以续费 0不可续费 1可续费*/
		level = 3,				/*等级*/
		exp = 4,				/*当前经验*/
		nextExp = 5,			/*经验*/
		privilege1 = 6,			/*奖励数据*/
		isMax = 7,			/*周卡是否满级 0未满级 1满级*/
	}
	type GetWeekFuliCardInfoReply = [number, number, number, number, number, number, WeekFuliCardPrivilege1, number];

	/*福利周卡子参数*/
	const enum WeekFuliCardPrivilege1Fields {
		useCount = 0,				/*已领取次数*/
		restCount = 1,				/*可领奖次数*/
		totalNum = 2,				/*每日总数据量*/
		nextCount = 3,				/*下级奖励增加*/
		state = 4,					/*是否已领取奖励 0未达成 1可领取 2已领取*/
	}
	type WeekFuliCardPrivilege1 = [number, number, number, number, number];

	/*获取仙玉周卡信息返回*/
	const enum GetWeekXianyuCardInfoReplyFields {
		endTm = 0,				/*到期时间*/
		flag = 1,				/*开启标志 0未开启 1开启*/
		isRenew = 2,			/*是否可以续费 0不可续费 1可续费*/
		isDayAward = 3,			/*是否已领取奖励（每天） 1可领取 2已领取*/
	}
	type GetWeekXianyuCardInfoReply = [number, number, number, number];

	/*主角光环数据 返回*/
	const enum GetHeroAuraInfoReplyFields {
		isOpen = 0,				//是否开通
		endTime = 1,    		//结束时间
		upDayTime = 2,			//更新每日时间标识
		dayAwd = 3,				//每日奖励领取标识
		mergeFbCount = 4,		//是否合并副本次数
		openCount = 5,			//累计开通次数
	}
	type GetHeroAuraInfoReply = [number, number, number, number, number, number]

	/**请求是否合并副本次数 */
	const enum SetMergeHeroAuraFbCountFields {
		isMergeFbCount = 0, //设置是否合并副本次数  0不合并1合并
	}
	type SetMergeHeroAuraFbCount = [number] //设置是否合并副本次数

	/*魔神令消息返回*/
	const enum GetDemonOrderGiftInfoReplyFields {
		endTime = 0,		/*结束时间*/
		day = 1,			/*累计天数*/
		buy = 2,			/*是否 购买魔神令*/
		awardStates = 3,	/*奖励状态*/
	}
	type GetDemonOrderGiftInfoReply = [number, number, number, Array<DemonOrderGiftState>];

	/*魔神令消息子参数返回*/
	const enum DemonOrderGiftStateFields {
		day = 0,			/*天数*/
		state1 = 1,			/*普通奖励状态 0:未领取 1:可领取 2:已领取*/
		state2 = 2,			/*魔神令状态 0:未领取 1:可领取 2:已领取*/
	}
	type DemonOrderGiftState = [number, number, number];

	/*获取代币券周卡信息*/
	const enum GetWeekYuanbaoCardInfoFields {
	}
	type GetWeekYuanbaoCardInfo = null;

	/*获取福利周卡信息*/
	const enum GetWeekFuliCardInfoFields {
	}
	type GetWeekFuliCardInfo = null;

	/*获取仙玉周卡信息*/
	const enum GetWeekXianyuCardInfoFields {
	}
	type GetWeekXianyuCardInfo = null;

	/*获取主角光环信息*/
	const enum GetHeroAuraInfoFields {
	}
	type GetHeroAuraInfo = null;

	/*获取魔神令信息*/
	const enum GetDemonOrderGiftInfoFields {
	}
	type GetDemonOrderGiftInfo = null;

	/*代币券周卡奖励请求*/
	const enum GetWeekYuanbaoCardRewardFields {
	}
	type GetWeekYuanbaoCardReward = null;

	/*福利周卡奖励请求*/
	const enum GetWeekFuliCardRewardFields {
	}
	type GetWeekFuliCardReward = null;

	/*主角光环奖励请求*/
	const enum GetHeroAuraRewardFields {
	}
	type GetHeroAuraReward = null;

	/*魔神令奖励请求*/
	const enum GetDemonOrderGiftRewardFields {
	}
	type GetDemonOrderGiftReward = null;

	/*仙玉周卡奖励请求*/
	const enum GetWeekXianyuCardRewardFields {
	}
	type GetWeekXianyuCardReward = null;

	/*代币券周卡奖励领取返回*/
	const enum GetWeekYuanbaoCardRewardReplyFields {
		result = 0,			/*返回值*/
	}
	type GetWeekYuanbaoCardRewardReply = [number];

	/*仙玉周卡奖励领取返回*/
	const enum GetWeekXianyuCardRewardReplyFields {
		result = 0,			/*返回值*/
	}
	type GetWeekXianyuCardRewardReply = [number];

	/*福利周卡领取返回*/
	const enum GetWeekFuliCardRewardReplyFields {
		result = 0,			/*返回值*/
	}
	type GetWeekFuliCardRewardReply = [number];

	//主角光环领取返回
	const enum GetHeroAuraRewardReplyFields {
		Code = 0,// 错误码 notOpenUserHalo = 43230,    //主角光环未激活
	}
	type GetHeroAuraRewardReply = [number];

	/*魔神令奖励返回*/
	const enum GetDemonOrderGiftRewardReplyFields {
		result = 0,			/*错误码*/
	}
	type GetDemonOrderGiftRewardReply = [number];

	/*魔神令额外奖励返回*/
	const enum GetDemonOrderGiftExtraRewardReplyFields {
		exReward = 0,                        /*充值奖励*/
	}
	type GetDemonOrderGiftExtraRewardReply = [Array<Items>];

	/*更新*/
	const enum UpdateMonthCardInfoFields {
		flag = 0,			/*开启标志 0未开启 1开启*/
		addCount = 1,			/*累计次数*/
		restDay = 2,			/*剩余天数*/
		rewardList = 3,			/*奖励状态列表(0-29)*/
	}
	type UpdateMonthCardInfo = [number, number, number, Array<number>];

	/*购买返回*/
	const enum BuyMonthCardReplyFields {
		result = 0,			/*返回值*/
	}
	type BuyMonthCardReply = [number];

	/*每日奖励返回*/
	const enum GetMonthCardRewardReplyFields {
		result = 0,			/*返回值*/
	}
	type GetMonthCardRewardReply = [number];

	/*返回*/
	const enum GetZhizunCardInfoReplyFields {
		flag = 0,			/*开启标志 0未开启 1开启*/
		addCount = 1,			/*累计次数*/
		restDay = 2,			/*剩余天数*/
	}
	type GetZhizunCardInfoReply = [number, number, number];

	/*更新*/
	const enum UpdateZhizunCardInfoFields {
		flag = 0,			/*开启标志 0未开启 1开启*/
		addCount = 1,			/*累计次数*/
		restDay = 2,			/*剩余天数*/
	}
	type UpdateZhizunCardInfo = [number, number, number];

	/*购买返回*/
	const enum BuyZhizunCardReplyFields {
		result = 0,			/*返回值*/
	}
	type BuyZhizunCardReply = [number];

	/*返回*/
	const enum GetMallInfoReplyFields {
		nodeList = 0,			/*列表*/
	}
	type GetMallInfoReply = [Array<MallNode>];

	/*更新*/
	const enum UpdateMallInfoFields {
		nodeList = 0,			/*列表*/
	}
	type UpdateMallInfo = [Array<MallNode>];

	/*购买返回*/
	const enum BuyMallItemReplyFields {
		result = 0,			/*返回值*/
		id = 1,			/*id*/
		limitCount = 2,			/*购买次数*/
	}
	type BuyMallItemReply = [number, number, number];

	/*返回*/
	const enum GetVipInfoReplyFields {
		grade = 0,			/*等级*/
		curExp = 1,			/*当前经验*/
		rewardList = 2,			/*已领取的奖励列表*/
		dayRewardState = 3,			/*每日奖励是否领取 false：未领，true：已领*/
	}
	type GetVipInfoReply = [number, number, Array<number>, boolean];

	/*更新*/
	const enum UpdateVipInfoFields {
		grade = 0,			/*等级*/
		curExp = 1,			/*当前经验*/
		rewardList = 2,			/*已领取的奖励列表*/
		dayRewardState = 3,			/*每日奖励是否领取 false：未领，true：已领*/
	}
	type UpdateVipInfo = [number, number, Array<number>, boolean];

	/*领取奖励返回*/
	const enum GetVipRewardReplyFields {
		result = 0,			/*返回值*/
	}
	type GetVipRewardReply = [number];

	/*获取特权信息返回*/
	const enum GetPrivilegeReplyFields {
		privileList = 0,
	}
	type GetPrivilegeReply = [Array<PrivilegeData>];

	/*更新特权信息*/
	const enum UpdatePrivilegeFields {
		privileList = 0,
	}
	type UpdatePrivilege = [Array<PrivilegeData>];

	/*领取vip每日奖励返回*/
	const enum GetVipDayRewardReplyFields {
		result = 0,
	}
	type GetVipDayRewardReply = [number];

	/*返回*/
	const enum GetVipFInfoReplyFields {
		grade = 0,			/*等级*/
		curExp = 1,			/*当前经验*/
		rewardList = 2,			/*已领取的奖励列表*/
	}
	type GetVipFInfoReply = [number, number, Array<number>];

	/*更新*/
	const enum UpdateVipFInfoFields {
		grade = 0,			/*等级*/
		curExp = 1,			/*当前经验*/
		rewardList = 2,			/*已领取的奖励列表*/
	}
	type UpdateVipFInfo = [number, number, Array<number>];

	/*领取奖励返回*/
	const enum GetVipFRewardReplyFields {
		result = 0,			/*返回值*/
	}
	type GetVipFRewardReply = [number];

	/*更新聊天*/
	const enum UpdateChatFields {
		chatPack = 0,			/*聊天包*/
	}
	type UpdateChat = [ChatPackage];

	/*聊天结果返回*/
	const enum ChatReplyFields {
		result = 0,			/*错误码*/
	}
	type ChatReply = [number];

	/*获取聊天记录返回*/
	const enum GetChatRecordReplyFields {
		channel = 0,			/*聊天频道：0：跑马灯  1：九州  2：本服  3：系统*/
		chatRecord = 1,			/*聊天记录*/
	}
	type GetChatRecordReply = [number, Array<ChatPackage>];

	/*获取黑名单回复*/
	const enum GetBlackListReplyFields {
		blackList = 0,			/*黑名单列表*/
	}
	type GetBlackListReply = [Array<BlackInfo>];

	/*黑名单操作回复*/
	const enum BlackListOptReplyFields {
		result = 0,			/*错误码*/
	}
	type BlackListOptReply = [number];

	/*更新黑名单*/
	const enum UpdateBlackListFields {
		blackList = 0,			/*黑名单列表*/
	}
	type UpdateBlackList = [Array<BlackInfo>];

	/*获取聊天玩家展示详细信息返回*/
	const enum GetChatPlayerDetailedInfoReplyFields {
		result = 0,
		info = 1,			/*玩家聊天展示的详细信息*/
	}
	type GetChatPlayerDetailedInfoReply = [number, ChatPlayerDetailedInfo];

	/*获取聊天信息返回*/
	const enum GetChatInfoReplyFields {
		adExpreCount = 0,			/*高级表情使用次数*/
	}
	type GetChatInfoReply = [number];

	/*更新聊天信息*/
	const enum UpdateChatInfoFields {
		adExpreCount = 0,			/*高级表情使用次数*/
	}
	type UpdateChatInfo = [number];

	/*返回*/
	const enum GetRechargeInfoReplyFields {
		rechargeList = 0,			/*充值列表*/
		rechargeDay = 1,            /**每日需要重置的数据 */
	}
	type GetRechargeInfoReply = [Array<RechargeInfo>, Array<RechargeDayClear>];

	/*更新充值档位信息*/
	const enum UpdateRechargeInfoFields {
		index = 0,			/*充值档位*/
		count = 1,			/*充值次数*/
	}
	type UpdateRechargeInfo = [number, number];

	/**每日需要重置的数据 */
	const enum RechargeDayClearFields {
		index = 0,                        /*充值档位*/
		count = 1,                        /*是否充值*/
	}
	type RechargeDayClear = [number, number];

	/*返回*/
	const enum FirstPayInfoReplyFields {
		state = 0,                         /*状态 0未开启 1可领取 2已领取*/
		id = 1,                            /*配置id*/
	}
	type FirstPayInfoReply = [number, number];


	const enum GetFirstPayInfoReplyFields {
		state = 0,                        	/*状态 0未开启 1可领取 2已领取*/
		list = 1,                        	/*列表*/
		restTm = 2,                        	/*剩余时间*/
		totalMoney = 3,					   	/*充值的金额*/
		firstPay = 4					    /*是否首冲*/
	}
	type GetFirstPayInfoReply = [number, Array<[number, Array<[number, FirstPayInfoReply]>]>, number, number, number];



	/*更新充值档位信息*/
	const enum UpdateFirstPayInfoFields {
		state = 0,                        	/*状态 0不显示 1显示*/
		list = 1,                        	/*列表  【类型,[天，数据]】*/
		restTm = 2,                         /*剩余时间*/
		totalMoney = 3,					    /*充值的金额*/
		firstPay = 4					    /*是否首冲*/
	}
	type UpdateFirstPayInfo = [number, Array<[number, Array<[number, FirstPayInfoReply]>]>, number, number, number];

	/*获得新外观*/
	const enum UpdateFirstPayShowFields {
		actionId = 0,			/*功能id*/
		showId = 1,			/*外观id*/
	}
	type UpdateFirstPayShow = [number, number];

	/*获取奖励返回*/
	const enum GetFirstPayRewardReplyFields {
		result = 0,
	}
	type GetFirstPayRewardReply = [number];

	/*组队返回*/
	const enum ReqOrganizeTeamReplyFields {
		result = 0,
	}
	type ReqOrganizeTeamReply = [number];

	/*取消、退出组队*/
	const enum CancelOrganizeTeamReplyFields {
		resule = 0,
	}
	type CancelOrganizeTeamReply = [number];

	/*更新队伍成员*/
	const enum UpdateTeamMemberFields {
		members = 0,
	}
	type UpdateTeamMember = [Array<TeamMember>];

	/*匹配状态*/
	const enum UpdateTeamMatchStateFields {
		state = 0,			/*0:进行中 1:匹配成功*/
	}
	type UpdateTeamMatchState = [number];

	/*创建队伍*/
	const enum CreateTeamReplyFields {
		result = 0,
		mapId = 1,
	}
	type CreateTeamReply = [number, number];

	/*解散队伍*/
	const enum DestoryTeamReplyFields {
		result = 0,
	}
	type DestoryTeamReply = [number];

	/*邀请加入队伍*/
	const enum InviteJoinTeamReplyFields {
		result = 0,
	}
	type InviteJoinTeamReply = [number];

	/*接受入队、进入队伍*/
	const enum JoinTeamReplyFields {
		result = 0,
		mapId = 1,
	}
	type JoinTeamReply = [number, number];

	/*离开队伍*/
	const enum LeaveTeamReplyFields {
		result = 0,
	}
	type LeaveTeamReply = [number];

	/*踢出队伍*/
	const enum KickedTeamReplyFields {
		result = 0,
	}
	type KickedTeamReply = [number];

	/*更新添加队伍邀请*/
	const enum UpdateAddTeamInviteFields {
		invite = 0,
	}
	type UpdateAddTeamInvite = [TeamInvite];

	/*更新解散队伍*/
	const enum UpdateDestoryTeamFields {
	}
	type UpdateDestoryTeam = null;

	/*更新队伍成员*/
	const enum UpdateTeamMemberOperFields {
		oper = 0,
	}
	type UpdateTeamMemberOper = [TeamMemberOper];

	/*获取玉荣信息返回*/
	const enum GetRuneInfoReplyFields {
		slots = 0,			/*玉荣槽镶嵌列表*/
		exp = 1,			/*玉荣经验*/
		rflags = 2,			/*分解标记勾选列表*/
	}
	type GetRuneInfoReply = [Array<RuneSlot>, number, Array<number>];

	/*玉荣镶嵌返回*/
	const enum InlayRuneReplyFields {
		result = 0,			/*返回值*/
	}
	type InlayRuneReply = [number];

	/*玉荣合成预览返回*/
	const enum ComposeRunePreviewReplyFields {
		level = 0,			/*等级*/
	}
	type ComposeRunePreviewReply = [number];

	/*合成玉荣*/
	const enum ComposeRuneFields {
		id = 0,			/*合成ID*/
		uids = 1,		/*uids列表*/
	}
	type ComposeRune = [number, Array<number>];

	/*玉荣升级返回*/
	const enum RuneRefineReplyFields {
		result = 0,			/*返回值*/
	}
	type RuneRefineReply = [number];
	/*卸下玉荣返回*/
	const enum UnsnatchRunePlaceReplyFields {
		list = 0,                        /*卸下符文槽的位置列表*/
	}
	type UnsnatchRunePlaceReply = [Array<number>];

	/*更新玉荣信息*/
	const enum UpdateRuneInfoFields {
		slots = 0,			/*玉荣槽镶嵌列表*/
		exp = 1,			/*玉荣经验*/
	}
	type UpdateRuneInfo = [Array<RuneSlot>, number];

	/*分解返回*/
	const enum ResolveRuneReplyFields {
		result = 0,			/*返回值*/
	}
	type ResolveRuneReply = [number];


	/**玉荣收集箱 信息*/
	const enum RuneCollectGradeInfoFields {
		id = 0,			/*玉荣id*/
		level = 1,		/*等级*/
		grade = 2,		/*阶数*/
		stars = 3,		/*星数*/
		rpState = 4,	/*红点状态-前端特有*/
	}
	type RuneCollectGradeInfo = [number, number, number, number, boolean];
	/**玉荣收集箱 升级*/
	const enum RuneCollectRiseFields {
		level = 0,                       /*收集箱等级*/
		rate = 1,                        /*收集箱等级进度[当前满足数量,下一级需要数量]*/
		isMaxed = 2,         			 /*收集箱成就等级是否满级 0:未满级、1:已满级*/
	}
	type RuneCollectRise = [number, [number, number], number];

	const enum RuneCollectInfoReplyFields {
		refine = 0,			/*玉荣收集列表*/
		rise = 1,			/*收集箱等级*/
	}
	type RuneCollectInfoReply = [Array<RuneCollectGradeInfo>, RuneCollectRise];

	/**玉荣收集箱 获取单个信息返回*/
	const enum RuneCollectSingleInfoReplyFields {
		refine = 0,			/*单玉荣信息*/
		rise = 1,			/*收集箱等级*/
	}
	type RuneCollectSingleInfoReply = [RuneCollectGradeInfo, RuneCollectRise];

	/*玉荣收集箱 升级返回*/
	const enum RuneCollectUpLevelReplyFields {
		result = 0,		/*返回值*/
	}
	type RuneCollectUpLevelReply = [number];

	/*玉荣收集箱 收集专家升阶返回*/
	const enum RuneCollectUpJieReplyFields {
		result = 0,		/*返回值*/
	}
	type RuneCollectUpJieReply = [number];

	/*玉荣收集箱 拆解返回*/
	const enum RuneCollectDismantleReplyFields {
		result = 0,		/*返回值*/
	}
	type RuneCollectDismantleReply = [number];

	/*合成返回*/
	const enum ComposeRuneReplyFields {
		result = 0,			/*返回值*/
		id = 1,			/*id*/
	}
	type ComposeRuneReply = [number, number];

	/*挂机游荡返回*/
	const enum OneKeySweepingReplyFields {
		result = 0,			/*扫荡结果*/
	}
	type OneKeySweepingReply = [number];

	/*购买次数返回*/
	const enum BuysweepingtimesReplyFields {
		result = 0,			/*购买结果*/
	}
	type BuysweepingtimesReply = [number];

	/*获取扫荡信息返回*/
	const enum GetSweepingStateReplyFields {
		zq = 0,			/*魔力*/
		coin = 1,			/*金币*/
		exp = 2,			/*经验*/
		equip = 3,			/*装备数量*/
		lz = 4,			/*龙珠*/
		stone = 5,			/*强化石*/
		smeltExp = 6,			/*熔炼经验*/
	}
	type GetSweepingStateReply = [number, number, number, number, number, number, number];

	/*获取扫荡基本信息返回*/
	const enum GetSweepingBaseInfoReplyFields {
		availableTimes = 0,			/*剩余可用次数*/
		haveSweepingTimes = 1,			/*已扫荡次数*/
		boughtTimes = 2,			/*已购买vip扫荡次数*/
	}
	type GetSweepingBaseInfoReply = [number, number, number];

	/*更新扫荡信息返回*/
	const enum UpdateSweepingBaseInfoFields {
		availableTimes = 0,			/*剩余可用次数*/
		haveSweepingTimes = 1,			/*已扫荡次数*/
		boughtTimes = 2,			/*已购买vip扫荡次数*/
	}
	type UpdateSweepingBaseInfo = [number, number, number];

	/*获取正常挂机收益返回*/
	const enum GetSweepingIncomeReplyFields {
		zq = 0,			/*魔力*/
		coin = 1,			/*金币*/
		exp = 2,			/*经验*/
		equip = 3,			/*装备数量*/
		lz = 4,			/*龙珠*/
		stone = 5,			/*强化石*/
		smeltExp = 6,			/*熔炼经验*/
	}
	type GetSweepingIncomeReply = [number, number, number, number, number, number, number];

	/*更新降妖怪数据*/
	const enum updateXiangyaoDataReplyFields {
		killedMonsterNumber = 0,			/*击杀普通怪物数量*/
		killedBossNumber = 1,			/*击杀boss数量*/
		receiveMonsterTimes = 2,			/*小怪领取次数*/
		receiveBossTimes = 3,			/*boss领取次数*/
		monsterMaxTimes = 4,			/*小怪领取最大次数*/
		bossMaxTimes = 5,			/*boss领取最大次数*/
		eraLevel = 6,			/*觉醒等级*/
	}
	type updateXiangyaoDataReply = [number, number, number, number, number, number, number];

	/*领取降妖奖励返回*/
	const enum getXiangyaoRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type getXiangyaoRewardReply = [number];

	/*返回数据*/
	const enum GetDaypayInfoReplyFields {
		state = 0,			/*开启状态(0未开启 1预备 2开启)*/
		id = 1,			/*配置id*/
		totalMoney = 2,			/*充值金额*/
		rewardList = 3,			/*奖励列表*/
	}
	type GetDaypayInfoReply = [number, number, number, Array<DaypayReward>];

	/*更新数据*/
	const enum UpdateDaypayInfoFields {
		state = 0,			/*开启状态(0未开启 1预备 2开启)*/
		id = 1,			/*配置id*/
		totalMoney = 2,			/*充值金额*/
		rewardList = 3,			/*奖励列表*/
	}
	type UpdateDaypayInfo = [number, number, number, Array<DaypayReward>];

	/*领取奖励返回*/
	const enum GetDaypayRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetDaypayRewardReply = [number];

	/*返回数据*/
	const enum GetCumulatepayInfoReplyFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalMoney = 1,			/*充值金额*/
		rewardList = 2,			/*奖励列表*/
		endTime = 3,			/*活动结束时间(毫秒)*/
	}
	type GetCumulatepayInfoReply = [number, number, Array<CumulatepayReward>, number];

	/*更新数据*/
	const enum UpdateCumulatepayInfoFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalMoney = 1,			/*充值金额*/
		rewardList = 2,			/*奖励列表*/
		endTime = 3,			/*活动结束时间(毫秒)*/
	}
	type UpdateCumulatepayInfo = [number, number, Array<CumulatepayReward>, number];

	/*领取奖励返回*/
	const enum GetCumulatepayRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetCumulatepayRewardReply = [number];

	/*返回数据*/
	const enum GetCumulatepay2InfoReplyFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalMoney = 1,			/*充值金额*/
		rewardList = 2,			/*奖励列表*/
		restTm = 3,			/*剩余时间(毫秒)*/
		serverDay = 4,			/*开服第几天*/
	}
	type GetCumulatepay2InfoReply = [number, number, Array<CumulatepayReward>, number, number];

	/*更新数据*/
	const enum UpdateCumulatepay3InfoFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalMoney = 1,			/*充值金额*/
		rewardList = 2,			/*奖励列表*/
		restTm = 3,			/*剩余时间(毫秒)*/
		serverDay = 4,			/*开服第几天*/
	}
	type UpdateCumulatepay3Info = [number, number, Array<CumulatepayReward>, number, number];



	/*返回数据*/
	const enum GetCumulatepay3InfoReplyFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalMoney = 1,			/*充值金额*/
		rewardList = 2,			/*奖励列表*/
		restTm = 3,			/*剩余时间(毫秒)*/
		serverDay = 4,			/*开服第几天*/
	}
	type GetCumulatepay3InfoReply = [number, number, Array<CumulatepayReward>, number, number];

	/*更新数据*/
	const enum UpdateCumulatepay2InfoFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalMoney = 1,			/*充值金额*/
		rewardList = 2,			/*奖励列表*/
		restTm = 3,			/*剩余时间(毫秒)*/
		serverDay = 4,			/*开服第几天*/
	}
	type UpdateCumulatepay2Info = [number, number, Array<CumulatepayReward>, number, number];

	/*领取奖励返回*/
	const enum GetCumulatepay2RewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetCumulatepay2RewardReply = [number];
	/*领取奖励返回*/
	const enum GetCumulatepay3RewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetCumulatepay3RewardReply = [number];

	/*返回数据*/
	const enum GetContinuepayInfoReplyFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalMoney = 1,			/*充值金额*/
		rewardList = 2,			/*奖励列表*/
		endTime = 3,			/*活动结束时间(毫秒)*/
		progressList = 4,			/*每档进度*/
	}
	type GetContinuepayInfoReply = [number, number, Array<ContinuepayReward>, number, Array<ContinuepayProgress>];

	/*返回数据*/
	const enum GetCeremonyContinuepayInfoReplyFields {
		totalMoney = 0,			/*充值金额*/
		endTime = 1,			/*活动结束时间(毫秒)*/
		rewardList = 2,			/*奖励列表*/
		progressList = 3,		/*每档进度*/
	}
	type GetCeremonyContinuepayInfoReply = [number, number, Array<ContinuepayReward>, Array<ContinuepayProgress>];

	/*返回数据*/
	const enum GetDropCarnivalInfoReplyFields {
		endTm = 0,                                /*结束时间*/
	}
	type GetDropCarnivalInfoReply = [number];


	/*更新数据*/
	const enum UpdateContinuepayInfoFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalMoney = 1,			/*充值金额*/
		rewardList = 2,			/*奖励列表*/
		endTime = 3,			/*活动结束时间(毫秒)*/
		progressList = 4,			/*每档进度*/
	}
	type UpdateContinuepayInfo = [number, number, Array<ContinuepayReward>, number, Array<ContinuepayProgress>];

	/*领取奖励返回*/
	const enum GetContinuepayRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetContinuepayRewardReply = [number];

	/*领取奖励返回*/
	const enum GetCeremonyContinuepayRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetCeremonyContinuepayRewardReply = [number];

	/*返回数据*/
	const enum GetZeroBuyInfoReplyFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		rewardList = 1,			/*奖励列表*/
		extraRewardList = 2,			/*额外奖励列表*/
	}
	type GetZeroBuyInfoReply = [number, Array<ZeroBuyReward>, Array<ZeroBuyExtraReward>];

	/*更新数据*/
	const enum UpdateZeroBuyInfoFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		rewardList = 1,			/*奖励列表*/
		extraRewardList = 2,			/*额外奖励列表*/
	}
	type UpdateZeroBuyInfo = [number, Array<ZeroBuyReward>, Array<ZeroBuyExtraReward>];

	/*领取奖励返回*/
	const enum GetZeroBuyRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetZeroBuyRewardReply = [number];

	/*购买返回*/
	const enum GetZeroBuyBuyReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetZeroBuyBuyReply = [number];

	/*返回数据*/
	const enum GetOneBuyInfoReplyFields {
		rewardList = 0,			/*奖励列表*/
	}
	type GetOneBuyInfoReply = [Array<OneBuyReward>];

	/*更新数据*/
	const enum UpdateOneBuyInfoFields {
		rewardList = 0,			/*奖励列表*/
	}
	type UpdateOneBuyInfo = [Array<OneBuyReward>];

	/*领取奖励返回*/
	const enum GetOneBuyRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetOneBuyRewardReply = [number];

	/*返回数据*/
	const enum GetConsumeRewardInfoReplyFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalMoney = 1,			/*充值金额*/
		rewardList = 2,			/*奖励列表*/
		endTime = 3,			/*活动结束时间(毫秒)*/
	}
	type GetConsumeRewardInfoReply = [number, number, Array<ConsumerewardReward>, number];

	/*更新数据*/
	const enum UpdateConsumeRewardInfoFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalMoney = 1,			/*充值金额*/
		rewardList = 2,			/*奖励列表*/
		endTime = 3,			/*活动结束时间(毫秒)*/
	}
	type UpdateConsumeRewardInfo = [number, number, Array<ConsumerewardReward>, number];

	/*领取奖励返回*/
	const enum GetConsumeRewardRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetConsumeRewardRewardReply = [number];

	/*返回数据*/
	const enum GetConsumeReward2InfoReplyFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalGold = 1,			/*消费代币券*/
		rewardList = 2,			/*奖励列表*/
		restTm = 3,			/*剩余时间(毫秒)*/
		serverDay = 4,			/*开服第几天*/
	}
	type GetConsumeReward2InfoReply = [number, number, Array<ConsumerewardReward>, number, number];

	/*更新数据*/
	const enum UpdateConsumeReward2InfoFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalGold = 1,			/*消费代币券*/
		rewardList = 2,			/*奖励列表*/
		restTm = 3,			/*剩余时间(毫秒)*/
		serverDay = 4,			/*开服第几天*/
	}
	type UpdateConsumeReward2Info = [number, number, Array<ConsumerewardReward>, number, number];

	/*领取奖励返回*/
	const enum GetConsumeReward2RewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetConsumeReward2RewardReply = [number];

	/*返回数据*/
	const enum GetInvestRewardInfoReplyFields {
		state = 0,			/*开启状态(0未开启 1开启 2开启后关闭)*/
		loginCount = 1,			/*登录次数*/
		tianguanLevel = 2,			/*天关等级*/
		actorLevel = 3,			/*人物等级*/
		stateList = 4,			/*购买状态列表*/
		rewardList = 5,			/*奖励列表*/
	}
	type GetInvestRewardInfoReply = [number, number, number, number, Array<InvestrewardState>, Array<InvestrewardReward>];

	/*更新数据*/
	const enum UpdateInvestRewardInfoFields {
		state = 0,			/*开启状态(0未开启 1开启 2开启后关闭)*/
		loginCount = 1,			/*登录次数*/
		tianguanLevel = 2,			/*天关等级*/
		actorLevel = 3,			/*人物等级*/
		stateList = 4,			/*购买状态列表*/
		rewardList = 5,			/*奖励列表*/
	}
	type UpdateInvestRewardInfo = [number, number, number, number, Array<InvestrewardState>, Array<InvestrewardReward>];

	/*购买投资返回*/
	const enum BuyInvestRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type BuyInvestRewardReply = [number];

	/*领取奖励返回*/
	const enum GetInvestRewardRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetInvestRewardRewardReply = [number];

	/*返回数据*/
	const enum GetSprintRankTaskInfoReplyFields {
		openState = 0,			/*开启状态(0未开启 1开启 2开启后关闭)*/
		curType = 1,			/*当前活动类型*/
		taskList = 2,			/*任务列表*/
	}
	type GetSprintRankTaskInfoReply = [number, number, Array<SprintRankTaskNode>];

	/*更新数据*/
	const enum UpdateSprintRankTaskInfoFields {
		openState = 0,			/*开启状态(0未开启 1开启 2开启后关闭)*/
		curType = 1,			/*当前活动类型*/
		taskList = 2,			/*任务列表*/
	}
	type UpdateSprintRankTaskInfo = [number, number, Array<SprintRankTaskNode>];

	/*领取返回*/
	const enum GetSprintRankTaskRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetSprintRankTaskRewardReply = [number];

	/*返回数据*/
	const enum GetSprintRankAllInfoReplyFields {
		openState = 0,			/*开启状态(0未开启 1开启 2开启后关闭)*/
		curType = 1,			/*当前活动类型*/
		rankList = 2,			/*排行列表*/
	}
	type GetSprintRankAllInfoReply = [number, number, Array<SprintRankNode>];

	/*返回标签数据*/
	const enum GetSprintRankBaseInfoReplyFields {
		openState = 0,			/*开启状态(0未开启 1开启 2开启后关闭)*/
		type = 1,			/*活动类型*/
		restTm = 2,			/*剩余时间(毫秒)*/
		firstName = 3,			/*榜首玩家名*/
	}
	type GetSprintRankBaseInfoReply = [number, number, number, string];

	/*更新基本数据(只更新简单信息)*/
	const enum UpdateSprintRankBaseInfoFields {
		openState = 0,			/*开启状态(0未开启 1开启 2开启后关闭)*/
		type = 1,			/*活动类型*/
		restTm = 2,			/*剩余时间(毫秒)*/
		firstName = 3,			/*榜首玩家名*/
	}
	type UpdateSprintRankBaseInfo = [number, number, number, string];

	/*返回历史数据*/
	const enum GetSprintRankBeforeReplyFields {
		openState = 0,			/*开启状态(0未开启 1开启)*/
		type = 1,			/*活动类型*/
		tm = 2,			/*活动结束时间*/
		rankList = 3,			/*排行列表*/
	}
	type GetSprintRankBeforeReply = [number, number, number, Array<SprintRankInfo>];

	/*活动结束推送*/
	const enum UpdateSprintRankStateFields {
	}
	type UpdateSprintRankState = null;

	/*返回数据*/
	const enum GetPayRewardInfoReplyFields {
		openState = 0,			/*开启状态(0未开启 1开启 2开启后关闭)*/
		rewardCount = 1,			/*剩余抽奖次数*/
		caifu = 2,			/*财富值*/
		rewardList = 3,			/*财富值奖励列表*/
	}
	type GetPayRewardInfoReply = [number, number, number, Array<PayRewardNode>];

	/*更新数据*/
	const enum UpdatePayRewardInfoFields {
		openState = 0,			/*开启状态(0未开启 1开启 2开启后关闭)*/
		rewardCount = 1,			/*剩余抽奖次数*/
		caifu = 2,			/*财富值*/
		rewardList = 3,			/*财富值奖励列表*/
	}
	type UpdatePayRewardInfo = [number, number, number, Array<PayRewardNode>];

	/*转盘抽奖返回*/
	const enum PayRewardRunReplyFields {
		result = 0,			/*领取结果*/
		noteList = 1,			/*档次抽奖奖励*/
	}
	type PayRewardRunReply = [number, Array<PayRewardNote>];

	/*获取抽奖记录返回*/
	const enum GetPayRewardNotesReplyFields {
		noteList = 0,			/*玩家抽奖记录*/
	}
	type GetPayRewardNotesReply = [Array<PayRewardNote>];

	/*获取财富值奖励返回*/
	const enum GetPayRewardRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetPayRewardRewardReply = [number];

	/*获取全服记录返回*/
	const enum GetPayRewardServerBroadcastReplyFields {
		svrBroadcastList = 0,			/*全服记录*/
	}
	type GetPayRewardServerBroadcastReply = [Array<PayRewardNoteSvr>];

	/*返回数据*/
	const enum GetDuobaoInfoReplyFields {
		openState = 0,			/*开启状态(0未开启 1开启 2开启后关闭)*/
		type = 1,			/*榜类型*/
		param = 2,			/*参数*/
		score = 3,			/*积分*/
		endTm = 4,			/*结束时间*/
		rewardList = 5,			/*积分奖励列表*/
	}
	type GetDuobaoInfoReply = [number, number, number, number, number, Array<DuobaoNode>];

	/*更新数据*/
	const enum UpdateDuobaoInfoFields {
		openState = 0,			/*开启状态(0未开启 1开启 2开启后关闭)*/
		type = 1,			/*榜类型*/
		param = 2,			/*参数*/
		score = 3,			/*积分*/
		endTm = 4,			/*结束时间*/
		rewardList = 5,			/*积分奖励列表*/
	}
	type UpdateDuobaoInfo = [number, number, number, number, number, Array<DuobaoNode>];

	/*转盘抽奖返回*/
	const enum DuobaoRunReplyFields {
		result = 0,			/*领取结果*/
		noteList = 1,			/*档次抽奖奖励*/
	}
	type DuobaoRunReply = [number, Array<PayRewardNote>];

	/*获取抽奖记录返回*/
	const enum GetDuobaoNotesReplyFields {
		noteList = 0,			/*玩家抽奖记录*/
	}
	type GetDuobaoNotesReply = [Array<PayRewardNote>];

	/*获取积分奖励返回*/
	const enum GetDuobaoRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetDuobaoRewardReply = [number];

	/*获取全服记录返回*/
	const enum GetDuobaoServerBroadcastReplyFields {
		svrBroadcastList = 0,			/*全服记录*/
		totalScore = 1,			/*总积分*/
	}
	type GetDuobaoServerBroadcastReply = [Array<PayRewardNoteSvr>, number];

	/*返回夺宝排名*/
	const enum GetDuobaoRankInfoReplyFields {
		type = 0,			/*类型 0个人 1区服*/
		nodeList = 1,			/*排名列表*/
	}
	type GetDuobaoRankInfoReply = [number, Array<DuobaoRankInfo>];

	/*返回数据*/
	const enum GetJzduobaoInfoReplyFields {
		openState = 0,			/*开启状态(0未开启 1开启 2开启后关闭)*/
		uiState = 1,			/*界面开启状态(0未开启 1开启)*/
		score = 2,			/*积分*/
		jackpot = 3,			/*奖池*/
		endTm = 4,			/*结束时间*/
		rewardList = 5,			/*积分奖励列表*/
	}
	type GetJzduobaoInfoReply = [number, number, number, number, number, Array<DuobaoNode>];

	/*更新数据*/
	const enum UpdateJzduobaoInfoFields {
		openState = 0,			/*开启状态(0未开启 1开启 2开启后关闭)*/
		uiState = 1,			/*界面开启状态(0未开启 1开启)*/
		score = 2,			/*积分*/
		jackpot = 3,			/*奖池*/
		endTm = 4,			/*结束时间*/
		rewardList = 5,			/*积分奖励列表*/
	}
	type UpdateJzduobaoInfo = [number, number, number, number, number, Array<DuobaoNode>];

	/*转盘抽奖返回*/
	const enum JzduobaoRunReplyFields {
		result = 0,			/*领取结果*/
		noteList = 1,			/*档次抽奖奖励*/
	}
	type JzduobaoRunReply = [number, Array<PayRewardNote>];

	/*获取抽奖记录返回*/
	const enum GetJzduobaoNotesReplyFields {
		noteList = 0,			/*玩家抽奖记录*/
	}
	type GetJzduobaoNotesReply = [Array<PayRewardNote>];

	/*获取积分奖励返回*/
	const enum GetJzduobaoRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetJzduobaoRewardReply = [number];

	/*获取全服记录返回*/
	const enum GetJzduobaoServerBroadcastReplyFields {
		svrBroadcastList = 0,			/*全服记录*/
		totalScore = 1,			/*总积分*/
	}
	type GetJzduobaoServerBroadcastReply = [Array<PayRewardNoteSvr>, number];

	/*返回夺宝排名*/
	const enum GetJzduobaoRankInfoReplyFields {
		type = 0,			/*类型 0个人 1区服*/
		nodeList = 1,			/*排名列表*/
	}
	type GetJzduobaoRankInfoReply = [number, Array<DuobaoRankInfo>];

	/*更新奖池*/
	const enum UpdateJzduobaoJackpotFields {
		jackpot = 0,			/*奖池*/
	}
	type UpdateJzduobaoJackpot = [number];

	/*返回数据*/
	const enum GetGushenInfoReplyFields {
		openState = 0,			/*开启状态(0未开启 1开启 2待关闭 3已关闭)*/
		nodeList = 1,			/*活动列表*/
	}
	type GetGushenInfoReply = [number, Array<GushenNote>];

	/*更新数据*/
	const enum UpdateGushenInfoFields {
		openState = 0,			/*开启状态(0未开启 1开启 2待关闭 3已关闭)*/
		nodeList = 1,			/*活动列表*/
	}
	type UpdateGushenInfo = [number, Array<GushenNote>];

	/*获取任务奖励返回*/
	const enum GetGushenTaskRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetGushenTaskRewardReply = [number];

	/*获取激活奖励返回*/
	const enum GetGushenActiveRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetGushenActiveRewardReply = [number];

	/*返回数据*/
	const enum GetKuanghuanInfoReplyFields {
		openState = 0,			/*开启状态(0未开启 1开启 2关闭)*/
		nodeList = 1,			/*活动列表*/
	}
	type GetKuanghuanInfoReply = [number, Array<KuanghuanNote>];

	/*更新数据*/
	const enum UpdateKuanghuanInfoFields {
		openState = 0,			/*开启状态(0未开启 1开启 2关闭)*/
		nodeList = 1,			/*活动列表*/
	}
	type UpdateKuanghuanInfo = [number, Array<KuanghuanNote>];

	/*获取奖励返回*/
	const enum GetKuanghuanRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetKuanghuanRewardReply = [number];

	/*返回数据*/
	const enum GetDiscountGiftInfoReplyFields {
		openState = 0,			/*开启状态(0未开启 1开启 2关闭)*/
		type = 1,			/*活动类型*/
		id = 2,			/*当前折扣id*/
		restTm = 3,			/*剩余时间(小于等于0表示已结束)*/
		curCount = 4,			/*当前购买数量*/
		maxCount = 5,			/*最大数量*/
		endFlag = 6,			/*当天活动结束标记(0开启 1结束)*/
	}
	type GetDiscountGiftInfoReply = [number, number, number, number, number, number, number];

	/*更新数据*/
	const enum UpdateDiscountGiftInfoFields {
		openState = 0,			/*开启状态(0未开启 1开启 2关闭)*/
		type = 1,			/*活动类型*/
		id = 2,			/*当前折扣id*/
		restTm = 3,			/*剩余时间(小于等于0表示已结束)*/
		curCount = 4,			/*当前购买数量*/
		maxCount = 5,			/*最大数量*/
		endFlag = 6,			/*当天活动结束标记(0开启 1结束)*/
	}
	type UpdateDiscountGiftInfo = [number, number, number, number, number, number, number];

	/*购买返回*/
	const enum DiscountGiftBuyReplyFields {
		result = 0,			/*领取结果*/
	}
	type DiscountGiftBuyReply = [number];

	/*获取数据*/
	const enum GetHalfMonthInfoReplyFields {
		openState = 0,			/*开启状态(0未开启 1开启 2关闭)*/
		day = 1,			/*当前天数*/
		dayStates = 2,			/*每天礼包状态 0:未领取 1:已领*/
	}
	type GetHalfMonthInfoReply = [number, number, Array<GiftState>];

	/*更新数据*/
	const enum UpdateHalfMonthInfoFields {
		openState = 0,			/*开启状态(0未开启 1开启 2关闭)*/
		day = 1,			/*当前天数*/
		dayStates = 2,			/*每天礼包状态 0:未领取 1:已领*/
	}
	type UpdateHalfMonthInfo = [number, number, Array<GiftState>];

	/*领取*/
	const enum GetHalfMonthRewardReplyFields {
		result = 0,			/*错误码*/
	}
	type GetHalfMonthRewardReply = [number];

	/*返回数据*/
	const enum GetEverydayRebateInfoReplyFields {
		openState = 0,			/*开启状态(0未开启 1开启 2关闭)*/
		nodeList = 1,			/*列表*/
	}
	type GetEverydayRebateInfoReply = [number, Array<EverydayRebateNode>];

	/*更新数据*/
	const enum UpdateEverydayRebateInfoFields {
		openState = 0,			/*开启状态(0未开启 1开启 2关闭)*/
		nodeList = 1,			/*列表*/
	}
	type UpdateEverydayRebateInfo = [number, Array<EverydayRebateNode>];

	/*领取返回*/
	const enum GetEverydayRebateRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetEverydayRebateRewardReply = [number];

	/*返回数据*/
	const enum GetLoginRewardInfoReplyFields {
		type = 0,			/*榜单类型(0开服冲榜 1飞升榜)*/
		param = 1,			/*类型参数*/
		restTm = 2,			/*剩余时间*/
		nodeList = 3,			/*列表*/
	}
	type GetLoginRewardInfoReply = [number, number, number, Array<LoginRewardNode>];

	/*更新数据*/
	const enum UpdateLoginRewardInfoFields {
		type = 0,			/*榜单类型(0开服冲榜 1飞升榜)*/
		param = 1,			/*类型参数*/
		restTm = 2,			/*剩余时间*/
		nodeList = 3,			/*列表*/
	}
	type UpdateLoginRewardInfo = [number, number, number, Array<LoginRewardNode>];

	/*领取返回*/
	const enum GetLoginRewardRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetLoginRewardRewardReply = [number];

	/*返回数据*/
	const enum GetCumulatepayFSInfoReplyFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalMoney = 1,			/*充值金额*/
		rewardList = 2,			/*奖励列表*/
		fsInfo = 3,			/*飞升榜信息*/
	}
	type GetCumulatepayFSInfoReply = [number, number, Array<CumulatepayReward>, FSRankInfo];

	/*更新数据*/
	const enum UpdateCumulatepayFSInfoFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalMoney = 1,			/*充值金额*/
		rewardList = 2,			/*奖励列表*/
		fsInfo = 3,			/*飞升榜信息*/
	}
	type UpdateCumulatepayFSInfo = [number, number, Array<CumulatepayReward>, FSRankInfo];

	/*领取奖励返回*/
	const enum GetCumulatepayFSRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetCumulatepayFSRewardReply = [number];

	/*返回数据*/
	const enum GetPaySingleFSInfoReplyFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		rewardList = 1,			/*奖励列表*/
		fsInfo = 2,			/*飞升榜信息*/
	}
	type GetPaySingleFSInfoReply = [number, Array<PaySingleFSReward>, FSRankInfo];

	/*更新数据*/
	const enum UpdatePaySingleFSInfoFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		rewardList = 1,			/*奖励列表*/
		fsInfo = 2,			/*飞升榜信息*/
	}
	type UpdatePaySingleFSInfo = [number, Array<PaySingleFSReward>, FSRankInfo];

	/*领取奖励返回*/
	const enum GetPaySingleFSRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetPaySingleFSRewardReply = [number];

	/*获取数据*/
	const enum GetCeremonyDanbiInfoFields {
	}
	type GetCeremonyDanbiInfo = null;

	/*返回数据*/
	const enum GetCeremonyDanbiInfoReplyFields {
		rewardList = 0,		/*奖励列表*/
		endTime = 1,		/*活动结束时间(毫秒)*/
	}
	type GetCeremonyDanbiInfoReply = [Array<CeremonyDanbiReward>, number];

	/*奖励列表*/
	const enum CeremonyDanbiRewardFields {
		id = 0,			/*档位*/
		useCount = 1,			/*已领数量*/
		restCount = 2,			/*可领数量*/
	}
	type CeremonyDanbiReward = [number, number, number];

	/*领取奖励*/
	const enum GetCeremonyDanbiRewardFields {
		id = 0,			/*id*/
	}
	type GetCeremonyDanbiReward = [number];

	/*领取奖励返回*/
	const enum GetCeremonyDanbiRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetCeremonyDanbiRewardReply = [number];

	/*返回数据*/
	const enum GetConsumeRewardFSInfoReplyFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalCount = 1,			/*消耗数量*/
		rewardList = 2,			/*奖励列表*/
		fsInfo = 3,			/*飞升榜信息*/
	}
	type GetConsumeRewardFSInfoReply = [number, number, Array<ConsumeRewardFSReward>, FSRankInfo];

	/*更新数据*/
	const enum UpdateConsumeRewardFSInfoFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalCount = 1,			/*消耗数量*/
		rewardList = 2,			/*奖励列表*/
		fsInfo = 3,			/*飞升榜信息*/
	}
	type UpdateConsumeRewardFSInfo = [number, number, Array<ConsumeRewardFSReward>, FSRankInfo];

	/*领取奖励返回*/
	const enum GetConsumeRewardFSRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetConsumeRewardFSRewardReply = [number];

	/*返回数据*/
	const enum GetRushBuyFSInfoReplyFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalCount = 1,			/*总数量*/
		count = 2,			/*购买数量*/
		fsInfo = 3,			/*飞升榜信息*/
	}
	type GetRushBuyFSInfoReply = [number, number, number, FSRankInfo];

	/*更新数据*/
	const enum UpdateRushBuyFSInfoFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalCount = 1,			/*总数量*/
		count = 2,			/*购买数量*/
		fsInfo = 3,			/*飞升榜信息*/
	}
	type UpdateRushBuyFSInfo = [number, number, number, FSRankInfo];

	/*购买返回*/
	const enum BuyRushBuyFSReplyFields {
		result = 0,			/*领取结果*/
	}
	type BuyRushBuyFSReply = [number];

	/*返回数据*/
	const enum GetDiscountGiftFSInfoReplyFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		nodeList = 1,			/*记录列表*/
		fsInfo = 2,			/*飞升榜信息*/
	}
	type GetDiscountGiftFSInfoReply = [number, Array<DiscountGiftFSNode>, FSRankInfo];

	/*更新数据*/
	const enum UpdateDiscountGiftFSInfoFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		nodeList = 1,			/*记录列表*/
		fsInfo = 2,			/*飞升榜信息*/
	}
	type UpdateDiscountGiftFSInfo = [number, Array<DiscountGiftFSNode>, FSRankInfo];

	/*购买返回*/
	const enum BuyDiscountGiftFSReplyFields {
		result = 0,			/*领取结果*/
	}
	type BuyDiscountGiftFSReply = [number];

	/*获取仙府-家园信息返回*/
	const enum GetXianFuInfoReplyFields {
		level = 0,			/*仙府-家园等级*/
		lingqi = 1,			/*药草值*/
		riches = 2,			/*财富值*/
		fengShui = 3,			/*风水值*/
		taskCount = 4,			/*仙府-家园任务次数*/
		active = 5,			/*活跃值*/
		activeIndex = 6,			/*活跃值已领取的档位*/
		accLingqi = 7,			/*累计消耗药草值*/
		accRiches = 8,			/*累计消耗财富值*/
	}
	type GetXianFuInfoReply = [number, number, number, number, number, number, Array<number>, number, number];

	/*更新仙府-家园信息*/
	const enum UpdateXianFuInfoFields {
		level = 0,			/*仙府-家园等级*/
		taskCount = 1,			/*仙府-家园任务次数*/
		activeIndex = 2,			/*活跃值已领取的档位*/
	}
	type UpdateXianFuInfo = [number, number, Array<number>];

	/*获取建筑产出信息返回*/
	const enum GetBuildingInfoReplyFields {
		id = 0,			/*建筑id*/
		level = 1,			/*建筑等级*/
		time = 2,			/*持续时间 毫秒*/
		state = 3,			/*建筑状态 0：闲置 1:产出中 2：可领取*/
		output = 4,			/*产出*/
		addition = 5,			/*加成*/
		sum = 6,			/*总值*/
		indexList = 7,			/*制作道具序号及份数*/
		resultList = 8,			/*制作道具结果 序号及结果 0：成功  1：失败*/
		cd = 9,			/*剩余恢复时间 毫秒*/
		makeCount = 10,			/*已制作次数*/
		exp = 11,			/*经验*/
	}
	type GetBuildingInfoReply = [number, number, number, number, number, number, number, Array<Pair>, Array<Pair>, number, number, number];

	/*更新建筑产出信息*/
	const enum UpdateBuildingInfoFields {
		id = 0,			/*建筑id*/
		level = 1,			/*建筑等级*/
		time = 2,			/*持续时间 毫秒*/
		state = 3,			/*建筑状态 0：闲置 1:产出中 2：可领取*/
		output = 4,			/*产出*/
		addition = 5,			/*加成*/
		sum = 6,			/*总值*/
		indexList = 7,			/*制作道具序号及份数*/
		resultList = 8,			/*制作道具结果 序号及结果 0：成功  1：失败*/
		cd = 9,			/*剩余恢复时间 毫秒*/
		makeCount = 10,			/*已制作次数*/
		exp = 11,			/*经验*/
	}
	type UpdateBuildingInfo = [number, number, number, number, number, number, number, Array<Pair>, Array<Pair>, number, number, number];

	/*升级仙府-家园返回*/
	const enum UpgradeXianFuReplyFields {
		result = 0,			/*错误码*/
	}
	type UpgradeXianFuReply = [number];

	/*领取建筑产出奖励返回*/
	const enum GetBuildProduceAwardReplyFields {
		result = 0,			/*错误码*/
	}
	type GetBuildProduceAwardReply = [number];

	/*更新仙府-家园产出的币*/
	const enum UpdateProduceCoinFields {
		lingqi = 0,			/*药草值*/
		riches = 1,			/*财富值*/
		fengShui = 2,			/*风水值*/
		active = 3,			/*活跃值*/
		accLingqi = 4,			/*累计消耗药草值*/
		accRiches = 5,			/*累计消耗财富值*/
	}
	type UpdateProduceCoin = [number, number, number, number, number, number];

	/*制作道具返回*/
	const enum MakeItemReplyFields {
		result = 0,			/*错误码*/
	}
	type MakeItemReply = [number];

	/*获取灵兽游历信息返回*/
	const enum GetSpiritAnimalTravelReplyFields {
		id = 0,			/*灵兽*/
		level = 1,			/*灵兽等级*/
		exp = 2,			/*灵兽经验*/
		state = 3,			/*状态 0：闲置 1:游历中 2：游历回来，可领取*/
		time = 4,			/*游历倒计时，单位：毫秒*/
		rangeId = 5,			/*范围id*/
		travelCount = 6,			/*今天已游历次数*/
		extraId = 7,			/*风信子id*/
		isAmulet = 8,			/*是否使用护身符*/
		list = 9,			/*行程描述语列表*/
		passByPack = 10,			/*灵兽游历回来沿途礼包索引*/
		endPack = 11,			/*灵兽游历回来终点礼包索引*/
	}
	type GetSpiritAnimalTravelReply = [number, number, number, number, number, number, number, number, boolean, Array<number>, number, number];

	/*更新灵兽游历信息*/
	const enum UpdateSpiritAnimalTravelFields {
		id = 0,			/*灵兽*/
		level = 1,			/*灵兽等级*/
		exp = 2,			/*灵兽经验*/
		state = 3,			/*状态 0：闲置 1:游历中 2：游历回来，可领取*/
		time = 4,			/*游历倒计时，单位：毫秒*/
		rangeId = 5,			/*范围id*/
		travelCount = 6,			/*今天已游历次数*/
		extraId = 7,			/*风信子id*/
		isAmulet = 8,			/*是否使用护身符*/
		list = 9,			/*行程描述语列表*/
		passByPack = 10,			/*灵兽游历回来沿途礼包索引*/
		endPack = 11,			/*灵兽游历回来终点礼包索引*/
	}
	type UpdateSpiritAnimalTravel = [number, number, number, number, number, number, number, number, boolean, Array<number>, number, number];

	/*出发游历返回*/
	const enum TravelReplyFields {
		result = 0,
	}
	type TravelReply = [number];

	/*领取游历奖励返回*/
	const enum GetTravelAwardReplyFields {
		result = 0,
	}
	type GetTravelAwardReply = [number];

	/*购买食物返回*/
	const enum BuyFoodReplyFields {
		result = 0,
	}
	type BuyFoodReply = [number];

	/*立即完成游历返回*/
	const enum TravelFinishReplyFields {
		result = 0,
	}
	type TravelFinishReply = [number];

	/*获取图鉴返回*/
	const enum GetIllustratedHandbookReplyFields {
		list = 0,			/*激活的图鉴列表  图鉴id:等级*/
		resList = 1,			/*图鉴资源列表  图鉴资源id:数量*/
	}
	type GetIllustratedHandbookReply = [Array<Pair>, Array<Pair>];

	/*更新图鉴*/
	const enum UpdateIllustratedHandbookFields {
		list = 0,			/*激活的图鉴列表  图鉴id:等级*/
		resList = 1,			/*图鉴资源列表  图鉴资源id:数量*/
	}
	type UpdateIllustratedHandbook = [Array<Pair>, Array<Pair>];

	/*提升或激活图鉴*/
	const enum PromoteIllustratedHandbookReplyFields {
		result = 0,			/*错误码*/
	}
	type PromoteIllustratedHandbookReply = [number];

	/*仙府-家园事件*/
	const enum XianFuEventFields {
		eventId = 0,			/*事件id 在constants.d.ts 里面的XianFuEvent枚举*/
		isOpen = 1,			/*是否开启事件  true开  false关*/
		time = 2,			/*结束时间戳*/
		wheel = 3,			/*第几轮*/
		ware = 4,			/*第几波*/
	}
	type XianFuEvent = [number, boolean, number, number, number];

	/*获取仙府-家园神秘商品返回*/
	const enum GetXianFuMallReplyFields {
		result = 0,			/*错误码*/
		list = 1,			/*商城出售商品列表 商品id*/
	}
	type GetXianFuMallReply = [number, Array<number>];

	/*购买游历所需道具*/
	const enum BuyTravelItemReplyFields {
		result = 0,			/*错误码*/
	}
	type BuyTravelItemReply = [number];

	/*获取仙府-家园任务列表返回*/
	const enum GetXianFuTaskListReplyFields {
		taskList = 0,			/*任务列表*/
	}
	type GetXianFuTaskListReply = [Array<XianFuTask>];

	/*更新任务状态*/
	const enum UpdateXianFuTaskStateFields {
		taskList = 0,			/*任务列表*/
	}
	type UpdateXianFuTaskState = [Array<XianFuTask>];

	/*领取任务奖励返回*/
	const enum GetXianFuTaskAwardReplyFields {
		result = 0,			/*错误码*/
	}
	type GetXianFuTaskAwardReply = [number];

	/*领取活跃度奖励返回*/
	const enum GetXianFuActivaAwardReplyFields {
		result = 0,			/*错误码*/
	}
	type GetXianFuActivaAwardReply = [number];

	/*获取仙府-家园风水信息返回*/
	const enum GetXianFuFengShuiInfoReplyFields {
		level = 0,			/*风水等级*/
		decorateList = 1,			/*激活的物件列表*/
	}
	type GetXianFuFengShuiInfoReply = [number, Array<number>];

	/*更新仙府-家园风水信息*/
	const enum UpdateXianFuFengShuiInfoFields {
		level = 0,			/*风水等级*/
		decorateList = 1,			/*激活的物件列表*/
	}
	type UpdateXianFuFengShuiInfo = [number, Array<number>];

	/*升级或激活风水物件返回*/
	const enum UpgradeFengShuiDecorateReplyFields {
		result = 0,			/*错误码*/
	}
	type UpgradeFengShuiDecorateReply = [number];

	/*获取仙府-家园技能返回*/
	const enum GetXianFuSkillListReplyFields {
		skillList = 0,			/*技能列表*/
	}
	type GetXianFuSkillListReply = [Array<number>];

	/*提升或激活技能返回*/
	const enum PromoteXianFuSkillReplyFields {
		result = 0,
	}
	type PromoteXianFuSkillReply = [number];

	/*立即完成炼制返回*/
	const enum MakeItemFinishReplyFields {
		result = 0,
	}
	type MakeItemFinishReply = [number];

	/*获取仙府-家园商城信息返回*/
	const enum GetXianFuMall2InfoReplyFields {
		idList = 0,			/*玉阁商品id:状态 0：未购买，1已购买*/
		f5Time = 1,			/*下次刷新时间*/
	}
	type GetXianFuMall2InfoReply = [Array<Pair>, number];

	/*购买仙府-家园商城商品返回*/
	const enum BuyXianFuMall2GoodsReplyFields {
		result = 0,
	}
	type BuyXianFuMall2GoodsReply = [number];

	/*刷新仙府-家园商城返回*/
	const enum F5XianFuMall2ReplyFields {
		result = 0,
	}
	type F5XianFuMall2Reply = [number];

	/*获取天梯 (积分、功勋、剩余次数、奖励状态、参与次数)返回*/
	const enum GetTiantiReplyFields {
		tianti = 0,
	}
	type GetTiantiReply = [Tianti];

	/*更新天梯积分 (积分、功勋、剩余次数)*/
	const enum UpdateTiantiScoreFields {
		score = 0,
	}
	type UpdateTiantiScore = [TiantiScore];

	/*更新参与奖励状态*/
	const enum UpdateTiantiJoinAwardStatsFields {
		awardStates = 0,			/*十连胜奖励状态*/
	}
	type UpdateTiantiJoinAwardStats = [Array<AwardState>];

	/*更新功勋奖励状态*/
	const enum UpdateTiantiFeatAwardStatesFields {
		awardStates = 0,			/*更新功勋奖励状态*/
	}
	type UpdateTiantiFeatAwardStates = [Array<AwardState>];

	/*更新天梯次数*/
	const enum UpdateTiantiTimesFields {
		times = 0,
	}
	type UpdateTiantiTimes = [TiantiTimes];

	/*获取天梯排行返回*/
	const enum GetTiantiRankReplyFields {
		ranks = 0,
	}
	type GetTiantiRankReply = [Array<TiantiRank>];

	/*领取参与奖励返回*/
	const enum GetTiantiJoinAwardReplyFields {
		result = 0,
	}
	type GetTiantiJoinAwardReply = [number];

	/*领取功勋奖励返回*/
	const enum GetTiantiFeatAwardReplyFields {
		result = 0,
	}
	type GetTiantiFeatAwardReply = [number];

	/*更新天梯荣誉*/
	const enum UpdateTiantiHonorFields {
		honor = 0,
	}
	type UpdateTiantiHonor = [number];

	/*更新天梯积分奖励*/
	const enum UpdateTiantiScoreAwardFields {
		winScore = 0,			/*斗法积分*/
		jumpScore = 1,			/*越阶积分*/
		continueWinScore = 2,			/*连胜积分*/
		continueWinTimes = 3,			/*连胜次数*/
	}
	type UpdateTiantiScoreAward = [number, number, number, number];

	/*获取天降财宝信息返回*/
	const enum GetRichesInfoReplyFields {
		gatherCount = 0,			/*采集数量*/
	}
	type GetRichesInfoReply = [number];

	/*更新天降财宝信息*/
	const enum UpdateRichesInfoFields {
		gatherCount = 0,			/*采集数量*/
	}
	type UpdateRichesInfo = [number];

	/*更新天降财宝副本数据*/
	const enum UpdateRichesCopyFields {
		nextRefreshTime = 0,			/*下一波刷新时间戳*/
		close = 1,			/*副本关闭时间*/
	}
	type UpdateRichesCopy = [number, number];

	/*获取云梦秘境返回*/
	const enum GetCloudlandReplyFields {
		times = 0,
	}
	type GetCloudlandReply = [CloudlandTimes];

	/*更新云梦秘境*/
	const enum UpdateCloudlandFields {
		times = 0,
	}
	type UpdateCloudland = [CloudlandTimes];

	/*更新云梦秘境掉落记录*/
	const enum UpdateDropRecordFields {
		times = 0,
	}
	type UpdateDropRecord = [Array<Item>];

	/*获取奇遇信息返回*/
	const enum GetAdventureInfoReplyFields {
		eventList = 0,			/*正在进行中的事件列表*/
		nextTriggerTime = 1,			/*下一次事件触发时间戳*/
		yunli = 2,			/*探险次数*/
		point = 3,			/*奇遇点*/
	}
	type GetAdventureInfoReply = [Array<AdventureEvent>, number, number, number];

	/*更新奇遇信息*/
	const enum UpdateAdventureInfoFields {
		eventList = 0,			/*正在进行中的事件列表  key：事件小类id*/
		nextTriggerTime = 1,			/*下一次事件触发时间戳*/
		yunli = 2,			/*探险次数*/
		point = 3,			/*奇遇点*/
	}
	type UpdateAdventureInfo = [Array<AdventureEvent>, number, number, number];

	/*购买探险次数返回*/
	const enum BuyYumliReplyFields {
		result = 0,			/*错误码*/
	}
	type BuyYumliReply = [number];

	/*挑战操作返回*/
	const enum ChallengeReplyFields {
		code = 0,			/*错误码*/
	}
	type ChallengeReply = [number];

	/*领取奖励返回*/
	const enum GetAdventureAwardReplyFields {
		code = 0,			/*错误码*/
	}
	type GetAdventureAwardReply = [number];

	/*奇遇单个事件更新*/
	const enum UpdateAdventureEventFields {
		event = 0,
		operation = 1,			/*此次事件更新原因  0更新事件  1删除事件*/
		result = 2,			/*事件当前状态  0事件完成  1事件失败  2事件不变（只有猜拳用到，即平局）*/
	}
	type UpdateAdventureEvent = [AdventureEvent, number, number];

	/*获取兑换提醒列表返回*/
	const enum GetAdventureHintReplyFields {
		hintList = 0,			/*勾选提醒id列表*/
	}
	type GetAdventureHintReply = [Array<number>];

	/*奇遇兑换返回*/
	const enum AdventureExchangeReplyFields {
		code = 0,
	}
	type AdventureExchangeReply = [number];

	/*获取昆仑瑶池信息返回*/
	const enum GetSwimmingInfoReplyFields {
		time = 0,			/*已在场景内逗留时间  毫秒*/
		buffTime = 1,			/*buff剩余时间  毫秒*/
		count = 2,			/*已抓取肥皂次数*/
	}
	type GetSwimmingInfoReply = [number, number, number];

	/*获取肥皂信息*/
	const enum GetSoapInfoReplyFields {
		time = 0,			/*后端开始时间戳*/
		le = 1,			/*肥皂区域长度*/
		start = 2,			/*起始位置*/
	}
	type GetSoapInfoReply = [number, number, number];

	/*更新昆仑瑶池信息*/
	const enum UpdateSwimmingInfoFields {
		time = 0,			/*已在场景内逗留时间  毫秒*/
		buffTime = 1,			/*buff剩余时间  毫秒*/
		count = 2,			/*已抓取肥皂次数*/
	}
	type UpdateSwimmingInfo = [number, number, number];

	/*抓肥皂返回*/
	const enum GrabSoapReplyFields {
		code = 0,			/*错误码*/
		result = 1,			/*抓取结果  0没抓到  1抓到*/
	}
	type GrabSoapReply = [number, number];

	/*获取仙女信息返回*/
	const enum GetFairyInfoReplyFields {
		id = 0,			/*当前仙女id*/
		escort = 1,			/*已护送次数*/
		intercept = 2,			/*已拦截次数*/
		looting = 3,			/*被拦截次数*/
		state = 4,			/*状态 0闲置，1护送中，2护送结束*/
		isDouble = 5,			/*是否双倍加成*/
		endTime = 6,			/*护送结束时间戳*/
		per = 7,			/*被拦截后奖励百分比*/
	}
	type GetFairyInfoReply = [number, number, number, number, number, boolean, number, number];

	/*获取仙女护送日志返回*/
	const enum GetFairyLogReplyFields {
		logList = 0,
	}
	type GetFairyLogReply = [Array<FairyLog>];

	/*更新仙女护送日志*/
	const enum UpdateFairyLogFields {
		log = 0,
	}
	type UpdateFairyLog = [FairyLog];

	/*护送仙女返回*/
	const enum EscortFairyReplyFields {
		code = 0,			/*错误码*/
	}
	type EscortFairyReply = [number];

	/*拦截仙女返回*/
	const enum InterceptFairyReplyFields {
		code = 0,			/*错误码*/
	}
	type InterceptFairyReply = [number];

	/*刷新仙女返回*/
	const enum RefreshFairyReplyFields {
		code = 0,			/*错误码*/
	}
	type RefreshFairyReply = [number];

	/*选择最好的仙女返回*/
	const enum SelectFairyReplyFields {
		code = 0,			/*错误码*/
	}
	type SelectFairyReply = [number];

	/*更新仙女信息返回*/
	const enum UpdateFairyInfoFields {
		id = 0,			/*当前仙女id*/
		escort = 1,			/*已护送次数*/
		intercept = 2,			/*已拦截次数*/
		looting = 3,			/*被拦截次数*/
		state = 4,			/*状态 0闲置，1护送中，2护送结束*/
		isDouble = 5,			/*是否双倍加成*/
		endTime = 6,			/*护送结束时间戳*/
		per = 7,			/*被拦截后奖励百分比*/
	}
	type UpdateFairyInfo = [number, number, number, number, number, boolean, number, number];

	/*获取仙女护送列表返回*/
	const enum GetFairyEscortListReplyFields {
		escortList = 0,			/*玩家护送列表*/
	}
	type GetFairyEscortListReply = [Array<FairyEscore>];

	/*领取仙女护送奖励返回*/
	const enum GetFairyAwardReplyFields {
		code = 0,			/*错误码*/
	}
	type GetFairyAwardReply = [number];

	/*更新其它仙女面板信息*/
	const enum UpdateOtherFairyInfoFields {
		targetId = 0,			/*更新的目标id*/
		looting = 1,			/*被拦截次数*/
		level = 2,			/*等级*/
	}
	type UpdateOtherFairyInfo = [number, number, number];

	/*获取优先提示返回(用于失败界面)*/
	const enum GetTipsPriorInfoReplyFields {
		type = 0,			/*提示类型*/
	}
	type GetTipsPriorInfoReply = [number];

	/*获取称号*/
	const enum GetDesignationReplyFields {
		list = 0,
	}
	type GetDesignationReply = [Array<Designation>];

	/*更新称号*/
	const enum UpdateDesignationFields {
		list = 0,
	}
	type UpdateDesignation = [Array<Designation>];

	/*激活称号*/
	const enum ActiveDesignationReplyFields {
		result = 0,
	}
	type ActiveDesignationReply = [number];

	/*穿戴称号*/
	const enum WearDesignationReplyFields {
		result = 0,
	}
	type WearDesignationReply = [number];

	/*卸下称号*/
	const enum TakeoffDesignationReplyFields {
		result = 0,
	}
	type TakeoffDesignationReply = [number];

	/*获取排行榜返回*/
	const enum GetCrossRankReplyFields {
		RankList = 0,
	}
	type GetCrossRankReply = [Array<RankList>];

	/*获取排行外观返回*/
	const enum GetActorCrossRankShowReplyFields {
		show = 0,			/*角色排行外观*/
	}
	type GetActorCrossRankShowReply = [ActorCrossRankShow];

	/*获取角色排行榜数据*/
	const enum GetActorCrossRankDataReplyFields {
		rankDatas = 0,
	}
	type GetActorCrossRankDataReply = [Array<RankData>];

	/*获取竞技排行返回*/
	const enum GetArenaRankReplyFields {
		ranks = 0,			/*竞技排行*/
	}
	type GetArenaRankReply = [Array<ArenaRank>];

	/*获取竞技排行挑战记录*/
	const enum GetArenaChallengeRecordReplyFields {
		records = 0,
	}
	type GetArenaChallengeRecordReply = [Array<ChallengeRecord>];

	/*更新竞技排行挑战记录*/
	const enum UpdateArenaChallengeRecordFields {
		records = 0,
	}
	type UpdateArenaChallengeRecord = [Array<ChallengeRecord>];

	/*获取竞技场*/
	const enum GetArenaReplyFields {
		times = 0,
		objs = 1,
	}
	type GetArenaReply = [ArenaTimes, Array<ArenaObj>];

	/*更新竞技场次数*/
	const enum UpdateArenaTimeFields {
		times = 0,
	}
	type UpdateArenaTime = [ArenaTimes];

	/*更新竞技场挑战对象*/
	const enum UpdateArenaObjsFields {
		objs = 0,
	}
	type UpdateArenaObjs = [Array<ArenaObj>];

	/*刷新挑战对象*/
	const enum FlushArenaReplyFields {
		result = 0,
	}
	type FlushArenaReply = [number];

	/*重置入场CD*/
	const enum ResetEnterCDReplyFields {
		result = 0,
	}
	type ResetEnterCDReply = [number];

	/*返回数据*/
	const enum GetFeishengRankAllInfoReplyFields {
		openState = 0,			/*开启状态(0未开启 1开启 2开启后关闭)*/
		curType = 1,			/*当前活动类型*/
		restTm = 2,			/*剩余时间(毫秒)*/
		firstName = 3,			/*榜首玩家名*/
		nodeList = 4,			/*排名列表*/
		endFlag = 5,			/*标记(0未开启 1进行中 2已结束)*/
	}
	type GetFeishengRankAllInfoReply = [number, number, number, string, Array<FeishengRankInfo>, number];

	/*返回标签数据*/
	const enum GetFeishengRankBaseInfoReplyFields {
		openState = 0,			/*开启状态(0未开启 1开启 2开启后关闭)*/
		type = 1,			/*活动类型*/
		restTm = 2,			/*剩余时间(毫秒)*/
		firstName = 3,			/*榜首玩家名*/
	}
	type GetFeishengRankBaseInfoReply = [number, number, number, string];

	/*更新基本数据(只更新简单信息)*/
	const enum UpdateFeishengRankBaseInfoFields {
		openState = 0,			/*开启状态(0未开启 1开启 2开启后关闭)*/
		type = 1,			/*活动类型*/
		restTm = 2,			/*剩余时间(毫秒)*/
		firstName = 3,			/*榜首玩家名*/
	}
	type UpdateFeishengRankBaseInfo = [number, number, number, string];

	/*返回积分数据*/
	const enum GetFeishengRankTaskInfoReplyFields {
		curType = 0,			/*当前活动类型*/
		taskId = 1,			/*当前任务id*/
		state = 2,			/*领取状态*/
		param = 3,			/*参数*/
		endFlag = 4,			/*活动结束标志 0开启中 1结束*/
	}
	type GetFeishengRankTaskInfoReply = [number, number, number, number, number];

	/*更新积分数据*/
	const enum UpdateFeishengRankTaskInfoFields {
		curType = 0,			/*当前活动类型*/
		taskId = 1,			/*当前任务id*/
		state = 2,			/*领取状态*/
		param = 3,			/*参数*/
		endFlag = 4,			/*活动结束标志 0开启中 1结束*/
	}
	type UpdateFeishengRankTaskInfo = [number, number, number, number, number];

	/*领取返回*/
	const enum GetFeishengRankTaskRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type GetFeishengRankTaskRewardReply = [number];

	/*历史记录返回数据*/
	const enum GetFeishengRankBeforeReplyFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		type = 1,			/*活动类型*/
		tm = 2,			/*活动结束时间*/
		rankList = 3,			/*排名列表*/
	}
	type GetFeishengRankBeforeReply = [number, number, number, Array<FeishengRankInfo>];

	/*活动结束推送*/
	const enum UpdateFeishengRankStateFields {
	}
	type UpdateFeishengRankState = null;

	/*获取仙盟列表返回*/
	const enum GetFactionListReplyFields {
		list = 0,
	}
	type GetFactionListReply = [Array<FactionInfo>];

	/*创建仙盟返回*/
	const enum CreateFactionReplyFields {
		result = 0,
	}
	type CreateFactionReply = [number];

	/*获取仙盟信息返回*/
	const enum GetFactionInfoReplyFields {
		uuid = 0,			/*仙盟id*/
		name = 1,			/*仙盟名字*/
		flagIndex = 2,			/*旗子下标*/
		pos = 3,			/*玩家在仙盟中的职位 0：普通，1盟主，2副盟主，3护法*/
		member = 4,			/*仙盟成员信息*/
		sumFight = 5,			/*总战力*/
		notice = 6,			/*公告*/
		contribution = 7,			/*玩家的贡献*/
		rank = 8,			/*仙盟排名*/
		examine = 9,			/*true需要审批，false不用*/
		level = 10,
		exp = 11,
		limitFight = 12,			/*限制战力*/
		cd = 13,			/*广播CD*/
		bossIndex = 14,			/*当前第几只BOSS*/
		bossHp = 15,			/*boss被打了多少血*/
		count = 16,			/*副本内多少人*/
		title = 17,			/*招人标题*/
		bossMaxHp = 18,			/*boss最大血量*/
	}
	type GetFactionInfoReply = [string, string, number, number, Array<FactionMember>, number, string, number, number, boolean, number, number, number, number, number, number, number, string, number];

	/*申请加入仙盟返回*/
	const enum JoinFactionReplyFields {
		result = 0,
	}
	type JoinFactionReply = [number];

	/*获取仙盟申请加入列表*/
	const enum GetFactionJoinListReplyFields {
		code = 0,
		list = 1,
	}
	type GetFactionJoinListReply = [number, Array<FactionJoin>];

	/*更新仙盟申请加入列表*/
	const enum UpdateFactionJoinListFields {
		list = 0,
	}
	type UpdateFactionJoinList = [Array<FactionJoin>];

	/*审批返回*/
	const enum ExamineReplyFields {
		result = 0,
	}
	type ExamineReply = [number];

	/*解散返回*/
	const enum DissolutionReplyFields {
		result = 0,
	}
	type DissolutionReply = [number];

	/*广播招人返回*/
	const enum BroadcastRecruitReplyFields {
		result = 0,
	}
	type BroadcastRecruitReply = [number];

	/*退出仙盟返回*/
	const enum ExitFactionReplyFields {
		result = 0,
	}
	type ExitFactionReply = [number];

	/*踢人返回*/
	const enum KickReplyFields {
		result = 0,
	}
	type KickReply = [number];

	/*任职返回*/
	const enum SetPositionReplyFields {
		result = 0,
	}
	type SetPositionReply = [number];

	/*获取已申请加入的仙盟列表返回*/
	const enum GetFactionApplyListReplyFields {
		list = 0,
	}
	type GetFactionApplyListReply = [Array<string>];

	/*设置战力*/
	const enum SetFightReplyFields {
		result = 0,
	}
	type SetFightReply = [number];

	/*设置招人标题*/
	const enum SetTitleReplyFields {
		result = 0,
	}
	type SetTitleReply = [number];

	/*设置公告*/
	const enum SetNoticeReplyFields {
		result = 0,
	}
	type SetNoticeReply = [number];

	/*设置加入仙盟审批状态*/
	const enum SetExamineReplyFields {
		result = 0,
	}
	type SetExamineReply = [number];

	/*申请职位返回*/
	const enum ApplyForPosReplyFields {
		result = 0,
	}
	type ApplyForPosReply = [number];

	/*获取申请职位列表*/
	const enum GetApplyForPosListReplyFields {
		list = 0,			/*玩家id:申请的职位*/
	}
	type GetApplyForPosListReply = [Array<Pair>];

	/*申请职位审批结果返回*/
	const enum ApplyForPosResultReplyFields {
		result = 0,
	}
	type ApplyForPosResultReply = [number];

	/*自动邀请*/
	const enum AutoInvitationFields {
		id = 0,			/*仙盟id*/
		name = 1,			/*仙盟名字*/
	}
	type AutoInvitation = [string, string];

	/*获取仙盟排行榜返回*/
	const enum GetFactionRankListReplyFields {
		show = 0,			/*第一名那货的外观信息*/
		list = 1,
	}
	type GetFactionRankListReply = [FactionRankShow, Array<FactionRank>];

	/*被踢了通知*/
	const enum KickNotifyFields {
	}
	type KickNotify = null;

	/*获取宝箱相关信息返回*/
	const enum GetBoxInfoReplyFields {
		openCount = 0,			/*已开启次数*/
		freeCount = 1,			/*免费次数*/
		freeF5Count = 2,			/*免费刷新次数*/
		assistCount = 3,			/*已协助次数*/
		freeCountCD = 4,			/*免费次数恢复cd*/
	}
	type GetBoxInfoReply = [number, number, number, number, number];

	/*获取宝箱返回*/
	const enum GetBoxListReplyFields {
		list = 0,
	}
	type GetBoxListReply = [Array<FactionBox>];

	/*获取需要协助的宝箱返回*/
	const enum GetAssistBoxListReplyFields {
		list = 0,
		time = 1,			/*下次刷新时间*/
	}
	type GetAssistBoxListReply = [Array<FactionBox>, number];

	/*领取宝箱奖励返回*/
	const enum GetBoxAwardReplyFields {
		result = 0,
	}
	type GetBoxAwardReply = [number];

	/*挖宝箱返回*/
	const enum OpenBoxReplyFields {
		result = 0,
	}
	type OpenBoxReply = [number];

	/*请求协助返回*/
	const enum AskAssistReplyFields {
		result = 0,
	}
	type AskAssistReply = [number];

	/*刷新宝箱返回*/
	const enum F5BoxReplyFields {
		result = 0,
	}
	type F5BoxReply = [number];

	/*加速宝箱返回*/
	const enum AddSpeedBoxReplyFields {
		result = 0,
	}
	type AddSpeedBoxReply = [number];

	/*协助别人开宝箱返回*/
	const enum AssistOpenBoxReplyFields {
		result = 0,
	}
	type AssistOpenBoxReply = [number];

	/*获取仙盟副本信息返回*/
	const enum GetFactionCopyInfoReplyFields {
		time = 0,			/*剩余时间*/
	}
	type GetFactionCopyInfoReply = [number];

	/*获取伤害奖励列表*/
	const enum GetHurtAwardListReplyFields {
		hurt = 0,			/*伤害值*/
		list = 1,			/*已领取的奖励 从0开始*/
	}
	type GetHurtAwardListReply = [number, Array<number>];

	/*领取伤害奖励返回*/
	const enum GetHurtAwardReplyFields {
		result = 0,
	}
	type GetHurtAwardReply = [number];

	/*仙盟鼓舞返回*/
	const enum FactionReqInspireReplyFields {
		result = 0,
	}
	type FactionReqInspireReply = [number];

	/*仙盟全员鼓舞返回*/
	const enum FactionAllInspireReplyFields {
		result = 0,
	}
	type FactionAllInspireReply = [number];

	/*获取仙盟副本内数据返回*/
	const enum GetFactionCopyDataReplyFields {
		inspireBuffTime = 0,			/*全员鼓舞buff结束时间*/
		coinInspireCount = 1,			/*金币鼓舞次数*/
		goldInspireCount = 2,			/*代币券鼓舞次数*/
	}
	type GetFactionCopyDataReply = [number, number, number];
	/*获取玄火副本内数据返回*/
	const enum GetXuanhuoCopyDataReplyFields {
		inspireBuffTime = 0,			/* 全员鼓舞buff结束时间 */
		xuanhuoPower = 1,				/* 玄火之力  层数，结束时间 */
		xuanhuoFloorsNum = 2,			/* 玄火保底数 */
		onlineTime = 3,					/* 场景内在线时间 */
		vulcanId = 4
	}
	type GetXuanhuoCopyDataReply = [number, XuanhuoPower, number, number, number];
	/*玄火副本玄火之力*/
	const enum XuanhuoPowerFields {
		level = 0,						/*层数*/
		time = 1,						/*结束时间*/
	}
	type XuanhuoPower = [number, number];
	/*玄火争夺战队全员鼓舞返回*/
	const enum XuanhuoAllInspireReplyFields {
		result = 0,
	}
	type XuanhuoAllInspireReply = [number];



	/*获取仙盟技能返回*/
	const enum GetFactionSkillListReplyFields {
		skillList = 0,			/*技能列表*/
	}
	type GetFactionSkillListReply = [Array<number>];

	/*获取转盘信息返回*/
	const enum GetFactionTurnReplyFields {
		blessing = 0,			/*祝福值*/
		turnCount = 1,			/*今日已抽次数*/
		getCount = 2,			/*可领取次数*/
		freeCount = 3,			/*免费次数*/
	}
	type GetFactionTurnReply = [number, number, number, number];

	/*提升或激活技能返回*/
	const enum PromoteFactionSkillReplyFields {
		result = 0,
	}
	type PromoteFactionSkillReply = [number];

	/*仙盟转盘返回*/
	const enum FactionTurnReplyFields {
		result = 0,
		list = 1,			/*获得的奖励索引0开始*/
	}
	type FactionTurnReply = [number, Array<number>];

	/*仙盟转盘记录返回*/
	const enum GetFactionTurnRecordReplyFields {
		list = 0,
	}
	type GetFactionTurnRecordReply = [Array<FactionTurnRecord>];

	/*领取幸运值奖励返回*/
	const enum GetBlessAwardReplyFields {
		result = 0,
	}
	type GetBlessAwardReply = [number];

	/*增加仙盟副本时间*/
	const enum AddCopyTimeReplyFields {
		result = 0,
	}
	type AddCopyTimeReply = [number];

	/*更新仙盟申请加入列表*/
	const enum UpdateFactionApplyListFields {
		list = 0,
	}
	type UpdateFactionApplyList = [Array<string>];

	/*获取时装信息返回*/
	const enum GetFashionInfoReplyFields {
		feedLevel = 0,			/*培养等级*/
		feedSkillList = 1,			/*技能列表*/
		feedFighting = 2,			/*战力*/
		curShowId = 3,			/*当前使用的幻化id，0表示没使用*/
		showList = 4,			/*幻化列表*/
		magicShowFighting = 5,			/*战力*/
		magicShowAttr = 6,			/*幻化总属性*/
		refineList = 7,			/*修炼列表*/
		refineFighting = 8,			/*战力*/
		refineAttr = 9,			/*修炼总属性*/
	}
	type GetFashionInfoReply = [number, Array<SkillInfo>, number, number, Array<MagicShowInfo>, number, Array<TypesAttr>, Array<RefineInfo>, number, Array<TypesAttr>];

	/*更新信息*/
	const enum UpdateFashionInfoFields {
		feedLevel = 0,			/*培养等级*/
		feedSkillList = 1,			/*技能列表*/
		feedFighting = 2,			/*战力*/
		curShowId = 3,			/*当前使用的幻化id，0表示没使用*/
		showList = 4,			/*幻化列表*/
		magicShowFighting = 5,			/*战力*/
		magicShowAttr = 6,			/*幻化总属性*/
		refineList = 7,			/*修炼列表*/
		refineFighting = 8,			/*战力*/
		refineAttr = 9,			/*修炼总属性*/
	}
	type UpdateFashionInfo = [number, Array<SkillInfo>, number, number, Array<MagicShowInfo>, number, Array<TypesAttr>, Array<RefineInfo>, number, Array<TypesAttr>];

	/*培养返回*/
	const enum FeedFashionReplyFields {
		result = 0,			/*返回值*/
	}
	type FeedFashionReply = [number];

	/*激活/升级技能返回*/
	const enum AddFashionSkillLevelReplyFields {
		result = 0,			/*返回值*/
	}
	type AddFashionSkillLevelReply = [number];

	/*幻化激活/升级返回*/
	const enum AddFashionMagicShowReplyFields {
		result = 0,			/*返回值*/
	}
	type AddFashionMagicShowReply = [number];

	/*更换幻化返回*/
	const enum ChangeFashionMagicShowReplyFields {
		result = 0,			/*返回值*/
		magicShowId = 1,			/*当前幻化id*/
	}
	type ChangeFashionMagicShowReply = [number, number];

	/*修炼返回*/
	const enum AddFashionRefineReplyFields {
		result = 0,			/*返回值*/
	}
	type AddFashionRefineReply = [number];

	/*获取天珠信息返回*/
	const enum GetTianZhuInfoReplyFields {
		feedLevel = 0,			/*培养等级*/
		feedSkillList = 1,			/*技能列表*/
		feedFighting = 2,			/*战力*/
		curShowId = 3,			/*当前使用的幻化id，0表示没使用*/
		showList = 4,			/*幻化列表*/
		magicShowFighting = 5,			/*战力*/
		magicShowAttr = 6,			/*幻化总属性*/
		refineList = 7,			/*修炼列表*/
		refineFighting = 8,			/*战力*/
		refineAttr = 9,			/*修炼总属性*/
	}
	type GetTianZhuInfoReply = [number, Array<SkillInfo>, number, number, Array<MagicShowInfo>, number, Array<TypesAttr>, Array<RefineInfo>, number, Array<TypesAttr>];

	/*更新信息*/
	const enum UpdateTianZhuInfoFields {
		feedLevel = 0,			/*培养等级*/
		feedSkillList = 1,			/*技能列表*/
		feedFighting = 2,			/*战力*/
		curShowId = 3,			/*当前使用的幻化id，0表示没使用*/
		showList = 4,			/*幻化列表*/
		magicShowFighting = 5,			/*战力*/
		magicShowAttr = 6,			/*幻化总属性*/
		refineList = 7,			/*修炼列表*/
		refineFighting = 8,			/*战力*/
		refineAttr = 9,			/*修炼总属性*/
	}
	type UpdateTianZhuInfo = [number, Array<SkillInfo>, number, number, Array<MagicShowInfo>, number, Array<TypesAttr>, Array<RefineInfo>, number, Array<TypesAttr>];

	/*培养返回*/
	const enum FeedTianZhuReplyFields {
		result = 0,			/*返回值*/
	}
	type FeedTianZhuReply = [number];

	/*激活/升级技能返回*/
	const enum AddTianZhuSkillLevelReplyFields {
		result = 0,			/*返回值*/
	}
	type AddTianZhuSkillLevelReply = [number];

	/*幻化激活/升级返回*/
	const enum AddTianZhuMagicShowReplyFields {
		result = 0,			/*返回值*/
	}
	type AddTianZhuMagicShowReply = [number];

	/*更换幻化返回*/
	const enum ChangeTianZhuMagicShowReplyFields {
		result = 0,			/*返回值*/
		magicShowId = 1,			/*当前幻化id*/
	}
	type ChangeTianZhuMagicShowReply = [number, number];

	type FeedGuangHuan = null
	type GetGuangHuanInfo = null
	/*获取光环信息返回*/
	const enum GetGuangHuanInfoReplyFields {
		feedLevel = 0,                        /*培养等级*/
		feedSkillList = 1,                        /*技能列表*/
		feedFighting = 2,                        /*战力*/
		curShowId = 3,                        /*当前使用的幻化id，0表示没使用*/
		showList = 4,                        /*幻化列表*/
		magicShowFighting = 5,                        /*战力*/
		magicShowAttr = 6,                        /*幻化总属性*/
		refineList = 7,                        /*修炼列表*/
		refineFighting = 8,                        /*战力*/
		refineAttr = 9,                        /*修炼总属性*/
	}
	type GetGuangHuanInfoReply = [number, Array<SkillInfo>, number, number, Array<MagicShowInfo>, number, Array<TypesAttr>, Array<RefineInfo>, number, Array<TypesAttr>];

	const enum UpdateGuangHuanInfoFields {
		feedLevel = 0,                        /*培养等级*/
		feedSkillList = 1,                        /*技能列表*/
		feedFighting = 2,                        /*战力*/
		curShowId = 3,                        /*当前使用的幻化id，0表示没使用*/
		showList = 4,                        /*幻化列表*/
		magicShowFighting = 5,                        /*战力*/
		magicShowAttr = 6,                        /*幻化总属性*/
		refineList = 7,                        /*修炼列表*/
		refineFighting = 8,                        /*战力*/
		refineAttr = 9,                        /*修炼总属性*/
	}
	type UpdateGuangHuanInfo = [number, Array<SkillInfo>, number, number, Array<MagicShowInfo>, number, Array<TypesAttr>, Array<RefineInfo>, number, Array<TypesAttr>];

	/*培养返回*/
	const enum FeedGuangHuanReplyFields {
		result = 0,                        /*返回值*/
	}
	type FeedGuangHuanReply = [number];

	/*更换幻化外观*/
	const enum ChangeGuangHuanMagicShowFields {
		magicShowId = 0,                        /*幻化Id*/
	}
	type ChangeGuangHuanMagicShow = [number];

	/*更换幻化返回*/
	const enum ChangeGuangHuanMagicShowReplyFields {
		result = 0,                        /*返回值*/
		magicShowId = 1,                        /*当前幻化id*/
	}
	type ChangeGuangHuanMagicShowReply = [number, number];

	/*升级修炼*/
	const enum AddGuangHuanRefineFields {
		type = 0,                        /*修炼类型 0悟性,1潜能,2根骨,3灵体*/
	}
	type AddGuangHuanRefine = [number];                            /*光环升级修炼返回*/

	/*修炼返回*/
	const enum AddGuangHuanRefineReplyFields {
		result = 0,                        /*返回值*/
	}
	type AddGuangHuanRefineReply = [number];

	/*激活/升级幻化*/
	const enum AddGuangHuanMagicShowFields {
		magicShowId = 0,                        /*幻化Id*/
	}
	type AddGuangHuanMagicShow = [number];

	/*幻化激活/升级返回*/
	const enum AddGuangHuanMagicShowReplyFields {
		result = 0,                        /*返回值*/
	}
	type AddGuangHuanMagicShowReply = [number];

	/*激活/升级技能*/
	const enum AddGuangHuanSkillLevelFields {
		skillId = 0,                        /*技能id*/
	}
	type AddGuangHuanSkillLevel = [number];

	/*激活/升级技能返回*/
	const enum AddGuangHuanSkillLevelReplyFields {
		result = 0,                        /*返回值*/
	}
	type AddGuangHuanSkillLevelReply = [number];

	/*修炼返回*/
	const enum AddTianZhuRefineReplyFields {
		result = 0,			/*返回值*/
	}
	type AddTianZhuRefineReply = [number];

	/*获取锻造信息*/
	const enum GetXilianReplyFields {
		xilianInfo = 0,
	}
	type GetXilianReply = [XilianInfo];

	/*获取锻造信息*/
	const enum UpdateXilianFields {
		xilianInfo = 0,
	}
	type UpdateXilian = [XilianInfo];

	/*开启锻造*/
	const enum OpenXilianReplyFields {
		result = 0,
	}
	type OpenXilianReply = [number];

	/*装备锻造*/
	const enum EquipXilianReplyFields {
		result = 0,
	}
	type EquipXilianReply = [number];

	/*锁定锻造*/
	const enum LockXilianReplyFields {
		result = 0,
	}
	type LockXilianReply = [number];

	/*锻造大师升级*/
	const enum XilianRiseAddLevelReplyFields {
		result = 0,
	}
	type XilianRiseAddLevelReply = [number];

	/*获取神器信息返回*/
	const enum GetShenQiInfoReplyFields {
		fragmentList = 0,			/*碎片列表  itemId:数量*/
		shenQiList = 1,			/*已激活神器*/
		equipFragment = 2,			/*已放入的碎片*/
		totalAttr = 3,			/*总属性*/
	}
	type GetShenQiInfoReply = [Array<Pair>, Array<number>, Array<number>, Array<TypesAttr>];

	/*放入碎片返回*/
	const enum EquipFragmentReplyFields {
		result = 0,
	}
	type EquipFragmentReply = [number];

	/*激活神器返回*/
	const enum ActivateShenQiReplyFields {
		result = 0,
	}
	type ActivateShenQiReply = [number];

	/*更新碎片*/
	const enum UpdateFragmentListFields {
		fragmentList = 0,			/*碎片列表  itemId:数量*/
	}
	type UpdateFragmentList = [Array<Pair>];

	/*获取开服礼包*/
	const enum GetOpenRewardReplyFields {
		left_tick = 0,			/*剩余时间*/
		dayStates = 1,			/*每天礼包状态 0:未买 1:已买*/
	}
	type GetOpenRewardReply = [number, Array<OpenGift>];

	/*更新开服礼包*/
	const enum UpdateOpenRewardFields {
		left_tick = 0,			/*剩余时间*/
		dayStates = 1,			/*每天礼包状态 0:未买 1:已买*/
	}
	type UpdateOpenReward = [number, Array<OpenGift>];

	/*开服礼包*/
	const enum BuyOpenRewardReplyFields {
		result = 0,			/*错误码*/
	}
	type BuyOpenRewardReply = [number];

	/*获取单笔充值返魂玉返回*/
	const enum GetSinglePayJadeReplyFields {
		state = 0,			/*开启状态，true开，false关*/
		time = 1,			/*结束时间戳*/
		countList = 2,			/*[id,可领取数量，已充值数量]*/
	}
	type GetSinglePayJadeReply = [boolean, number, Array<ThreeNumber>];

	/*领取单笔充值返魂玉奖励返回*/
	const enum GetSinglePayJadeAwardReplyFields {
		result = 0,
	}
	type GetSinglePayJadeAwardReply = [number];

	/*获取单笔充值返圣印返回*/
	const enum GetSinglePayPrintReplyFields {
		state = 0,			/*开启状态，true开，false关*/
		time = 1,			/*结束时间戳*/
		countList = 2,			/*[id,可领取数量，已充值数量]*/
	}
	type GetSinglePayPrintReply = [boolean, number, Array<ThreeNumber>];

	/*领取单笔充值返圣印奖励返回*/
	const enum GetSinglePayPrintAwardReplyFields {
		result = 0,
	}
	type GetSinglePayPrintAwardReply = [number];

	/*获取周末狂欢-单笔信息*/
	const enum GetWeekSinglePayReplyFields {
		state = 0,			/*开启状态，true开，false关*/
		time = 1,			/*结束时间戳*/
		countList = 2,			/*[id,可领取数量，已充值数量]*/
	}
	type GetWeekSinglePayReply = [boolean, number, Array<ThreeNumber>];

	/*领取周末狂欢-单笔奖励返回*/
	const enum GetWeekSinglePayAwardReplyFields {
		result = 0,
	}
	type GetWeekSinglePayAwardReply = [number];

	/*获取周末狂欢-登陆信息返回*/
	const enum GetWeekLoginReplyFields {
		state = 0,			/*开启状态，true开，false关*/
		time = 1,			/*结束时间戳*/
		stateList = 2,			/*[id,状态：0不可领，1可领，2明日可领，3已领]*/
	}
	type GetWeekLoginReply = [boolean, number, Array<Pair>];

	/*领取周末狂欢-登陆奖励返回*/
	const enum GetWeekLoginAwardReplyFields {
		result = 0,
	}
	type GetWeekLoginAwardReply = [number];

	/*获取周末狂欢-累充信息返回*/
	const enum GetWeekAccumulateReplyFields {
		state = 0,			/*开启状态，true开，false关*/
		time = 1,			/*结束时间戳*/
		stateList = 2,			/*[id,状态：0不可领，1可领，2已领]*/
		money = 3,			/*累充的钱*/
	}
	type GetWeekAccumulateReply = [boolean, number, Array<Pair>, number];

	/*领取周末狂欢-累充奖励返回*/
	const enum GetWeekAccumulateAwardReplyFields {
		result = 0,
	}
	type GetWeekAccumulateAwardReply = [number];

	/*获取周末狂欢-消费信息返回*/
	const enum GetWeekConsumeReplyFields {
		state = 0,			/*开启状态，true开，false关*/
		time = 1,			/*结束时间戳*/
		stateList = 2,			/*[id,状态：0不可领，1可领，2已领,消费代币券数]*/
	}
	type GetWeekConsumeReply = [boolean, number, Array<ThreeNumber>];

	/*领取周末狂欢-消费奖励返回*/
	const enum GetWeekConsumeAwardReplyFields {
		result = 0,
	}
	type GetWeekConsumeAwardReply = [number];

	/*获取消费排行榜数据返回*/
	const enum GetConsumeRankReplyFields {
		time = 0,			/*结束时间*/
		rankList = 1,
	}
	type GetConsumeRankReply = [number, Array<ConsumeRank>];

	/*获取本次活动内消费代币券数量*/
	const enum GetConsumeCountReplyFields {
		count = 0,
	}
	type GetConsumeCountReply = [number];

	/*获取限时礼包信息返回*/
	const enum GetLimitPackInfoReplyFields {
		packState = 0,			/*[等级，非vip状态，vip礼包状态] 状态：0过期了，1已购买，其它数字表示剩下时间*/
	}
	type GetLimitPackInfoReply = [Array<ThreeNumber>];

	/*购买限时礼包*/
	const enum BuyLimitPackReplyFields {
		result = 0,
	}
	type BuyLimitPackReply = [number];

	/*获取意见反馈列表返回*/
	const enum GetFeedbackListReplyFields {
		list = 0,
	}
	type GetFeedbackListReply = [Array<Feedback>];

	/*更新意见反馈*/
	const enum UpdateFeedbackFields {
		info = 0,
	}
	type UpdateFeedback = [Feedback];

	/*发送意见反馈返回*/
	const enum SendFeedbackReplyFields {
		result = 0,
	}
	type SendFeedbackReply = [number];

	/*兑换激活码返回*/
	const enum ExchangeCdkeyReplyFields {
		items = 0,			/*奖励信息*/
		result = 1,
	}
	type ExchangeCdkeyReply = [Array<Item>, number];

	/*获取公告返回*/
	const enum GetNoticeReplyFields {
		notice = 0,
	}
	type GetNoticeReply = [string];

	/*获取邀请有礼返回*/
	const enum GetInviteGiftReplyFields {
		times = 0,			/*剩余次数*/
		cold = 1,			/*冷却限制*/
		state = 2,			/*领取状态*/
	}
	type GetInviteGiftReply = [number, number, number];

	/*邀请好友返回*/
	const enum InviteFriendReplyFields {
		result = 0,
	}
	type InviteFriendReply = [number];

	/*提取邀请有礼返回*/
	const enum DrawInviteGiftReplyFields {
		result = 0,
	}
	type DrawInviteGiftReply = [number];

	/*获取单次奖励返回*/
	const enum GetOnceRewardReplyFields {
		id = 0,			/*已领取ID*/
		data = 1,			/*奖励数据*/
	}
	type GetOnceRewardReply = [Array<number>, Array<OnceRewardData>];

	/*设置数据返回*/
	const enum SetOnceRewardDataReplyFields {
		id = 0,			/*奖励ID*/
		data = 1,			/*奖励数据*/
		result = 2,
	}
	type SetOnceRewardDataReply = [number, string, number];

	/*提取单次奖励返回*/
	const enum DrawOnceRewardReplyFields {
		id = 0,			/*已领取ID*/
		result = 1,
	}
	type DrawOnceRewardReply = [number, number];

	/*护符状态*/
	const enum UpdateTalismanStateFields {
		state = 0,			/*开启状态*/
	}
	type UpdateTalismanState = [Array<boolean>];

	/*护符信息返回*/
	const enum GetTalismanInfoReplyFields {
		activated_era = 0,                        /*已激活重数*/
		unactive_era = 1,                        /*可激活重数*/
		all_state = 2,                                /*所有勋章状态*/
	}
	type GetTalismanInfoReply = [Array<number>, Array<number>, Array<boolean>];

	/*激活返回*/
	const enum ActiveTalismanReplyFields {
		result = 0,
	}
	type ActiveTalismanReply = [number];

	/*护符状态*/
	const enum UpdateMoneyCatStateFields {
		state = 0,			/*开启状态*/
	}
	type UpdateMoneyCatState = [boolean];

	/*护符信息返回*/
	const enum GetMoneyCatInfoReplyFields {
		activated_era = 0,			/*已激活重数*/
		unactive_era = 1,			/*可激活重数*/
	}
	type GetMoneyCatInfoReply = [number, number];

	/*激活返回*/
	const enum ActiveMoneyCatReplyFields {
		result = 0,
	}
	type ActiveMoneyCatReply = [number];

	/*获取仙玉信息返回*/
	const enum GetXianYuInfoReplyFields {
		xianyu = 0,			/*当前拥有的仙玉值*/
		xianyuLimit = 1,			/*今日已获得的仙玉值*/
	}
	type GetXianYuInfoReply = [number, number];

	/*获取玉阁信息返回*/
	const enum GetYuGeInfoReplyFields {
		idList = 0,			/*玉阁商品id:状态 0：未购买，1已购买*/
		f5Time = 1,			/*下次刷新时间*/
	}
	type GetYuGeInfoReply = [Array<Pair>, number];

	/*购买玉阁商品返回*/
	const enum BuyYuGeGoodsReplyFields {
		result = 0,
	}
	type BuyYuGeGoodsReply = [number];

	/*刷新玉阁返回*/
	const enum F5YuGeReplyFields {
		result = 0,
	}
	type F5YuGeReply = [number];

	/*获取福缘信息返回*/
	const enum GetXianYuFuYuInfoReplyFields {
		fuyu = 0,
		stateList = 1,			/*已领取的档位*/
	}
	type GetXianYuFuYuInfoReply = [number, Array<number>];

	/*领取福缘值奖励返回*/
	const enum GetFuYuanAwardReplyFields {
		result = 0,
	}
	type GetFuYuanAwardReply = [number];

	/*手套信息返回*/
	const enum GetGauntletReplyFields {
		state = 0,			/*状态 -1：未开启，0：未领取，1：已领取*/
		jewels = 1,			/*宝石ID*/
		fight = 2,			/*战力*/
		jewel_index = 3,			/*原力购买界面 0:无法购买*/
		draw_index = 4,			/*原力领取界面 0：无法领取*/
	}
	type GetGauntletReply = [number, Array<Pair>, number, number, number];

	/*领取返回*/
	const enum DrawGauntletReplyFields {
		result = 0,
	}
	type DrawGauntletReply = [number];

	/*镶嵌返回*/
	const enum InlayGauntletReplyFields {
		result = 0,
	}
	type InlayGauntletReply = [number];

	/*获取拥有的仙丹列表返回*/
	const enum GetXianDanListReplyFields {
		idList = 0,			/*仙丹id：拥有的数量*/
	}
	type GetXianDanListReply = [Array<Pair>];

	/*获取仙丹信息返回*/
	const enum GetXianDanInfoReplyFields {
		type = 0,			/*子类*/
		useList = 1,			/*仙丹id：已使用数量*/
		useCount = 2,			/*今日使用次数*/
	}
	type GetXianDanInfoReply = [number, Array<Pair>, number];

	/*一键使用仙丹返回*/
	const enum OneKeyUseXianDanReplyFields {
		result = 0,
	}
	type OneKeyUseXianDanReply = [number];

	/*更新找回*/
	const enum UpdateRetrieveFields {
		resRetrieve = 0,			/*资源*/
		lilianRetrieve = 1,			/*历练*/
	}
	type UpdateRetrieve = [Array<Retrieve>, Array<Retrieve>];

	/*信息返回*/
	const enum GetPreventFoolReplyFields {
		id = 0,			/*id*/
	}
	type GetPreventFoolReply = [number];

	/*回答返回*/
	const enum AnswerPreventFoolReplyFields {
		result = 0,
	}
	type AnswerPreventFoolReply = [number];

	/*获取体力*/
	const enum GetStrengthRelpyFields {
		stength = 0,			/*体力值*/
		auto = 1,			/*自动体力*/
		addLimit,			/*增加上限*/
	}
	type GetStrengthRelpy = [number, number];

	/*更新体力*/
	const enum UpdateStrongInfoReplyFields {
		stength = 0,			/*体力*/
	}
	type UpdateStrongInfoReply = [number];

	/*领取圣殿奖励返回*/
	const enum PickTempRewardReplyFields {
		result = 0,			/*结果*/
	}
	type PickTempRewardReply = [number];

	/*使用体力丹返回*/
	const enum UseStrengthItemReplyFields {
		result = 0,			/*结果*/
	}
	type UseStrengthItemReply = [number];

	/*添加用户到功能服*/
	const enum SV_LoginUserToFeatureFields {
		id = 0,			/*用户id*/
		ip = 1,			/*ip*/
	}
	type SV_LoginUserToFeature = [number, string];

	/*功能服认证返回*/
	const enum SV_AuthFeatureReplyFields {
		result = 0,
		handle = 1,			/*服务句柄*/
	}
	type SV_AuthFeatureReply = [number, number];

	/*同步服务器到功能服*/
	const enum SV_SyncServiceToFeatureFields {
		cmd = 0,			/*操作命令*/
		type = 1,			/*服务类型*/
		handle = 2,			/*服务句柄*/
	}
	type SV_SyncServiceToFeature = [number, number, number];

	/*玩家下线*/
	const enum SV_LogoutUserOfFeatureFields {
		objId = 0,			/*玩家id*/
		force = 1,			/*是否强制下线*/
	}
	type SV_LogoutUserOfFeature = [number, boolean];

	/*更新服务器连接*/
	const enum SV_UpdateServerConnectToFeatureFields {
		type = 0,
	}
	type SV_UpdateServerConnectToFeature = [number];

	/*获取玩家镜像数据*/
	const enum SV_GetActorImgDataOfNexusFields {
		agentId = 0,
	}
	type SV_GetActorImgDataOfNexus = [number];

	/*用户已登录到中心服*/
	const enum SV_LoginUserToCenterSuccessFields {
		agentId = 0,
	}
	type SV_LoginUserToCenterSuccess = [number];

	/*挂机经验、金币、魔力收益*/
	const enum SV_OnhookIncomeFields {
		exp = 0,			/*经验*/
		coin = 1,			/*金币*/
		zq = 2,			/*魔力*/
		source = 3,			/*来源*/
	}
	type SV_OnhookIncome = [number, number, number, number];

	/*客户端加载完成*/
	const enum SV_LoadComplateToFeatureFields {
		agentId = 0,			/*玩家ID*/
	}
	type SV_LoadComplateToFeature = [number];

	/*客户端登录完成*/
	const enum SV_UserLoginCompleteFields {
		id = 0,
	}
	type SV_UserLoginComplete = [number];

	/*更新角色属性*/
	const enum SV_UpdateAttrToFeatureFields {
		attr = 0,			/*角色属性*/
	}
	type SV_UpdateAttrToFeature = [Array<TypesAttr>];

	/*更新战力*/
	const enum SV_UpdateFightToFeatureFields {
		fight = 0,			/*战力*/
	}
	type SV_UpdateFightToFeature = [number];

	/*请求进入场景返回*/
	const enum SV_ReqEnterSceneReplyFields {
		result = 0,
	}
	type SV_ReqEnterSceneReply = [number];

	/*返回上一个挂机场景*/
	const enum SV_FallbackToCommonSceneFields {
	}
	type SV_FallbackToCommonScene = null;

	/*更新、完成副本层数*/
	const enum SV_UpdateCopyDataFields {
		copyData = 0,			/*副本数据*/
	}
	type SV_UpdateCopyData = [FinishCopyData];

	/*挂机场景更新当前击杀怪物波数*/
	const enum SV_UpdateKillMonstetWareFields {
		count = 0,			/*当前击杀怪物波数*/
	}
	type SV_UpdateKillMonstetWare = [number];

	/*更新上一次挂机掉落的时间*/
	const enum SV_UpdateOnhookUpdateTimeFields {
		dropItemTm = 0,			/*挂机道具掉落时间 累计ms*/
		dropItemLZTm = 1,			/*挂机龙珠掉落时间 累计ms*/
		onhookIncomeTime = 2,			/*挂机收益掉落时间 累计ms*/
	}
	type SV_UpdateOnhookUpdateTime = [number, number, number];

	/*设置本地时间*/
	const enum SV_SetLocalTimeToFeatureFields {
		time = 0,			/*ms*/
	}
	type SV_SetLocalTimeToFeature = [number];

	/*击杀怪物*/
	const enum SV_KillMonsterFields {
		killMonster = 0,
	}
	type SV_KillMonster = [KillMonster];

	/*更新公共场景*/
	const enum SV_UpdateForeverSceneFields {
		sceneStates = 0,			/*公共场景状态*/
	}
	type SV_UpdateForeverScene = [Array<SceneState>];

	/*扣除金钱*/
	const enum SV_DelMoneyFields {
		money = 0,
		source = 1,			/*流水类型*/
	}
	type SV_DelMoney = [Money, number];

	/*Feature热更新*/
	const enum SV_HotupdateToFeatureFields {
		text = 0,
	}
	type SV_HotupdateToFeature = [Array<string>];

	/*Feature重新加载配置*/
	const enum SV_ReloadCfgToFeatureFields {
	}
	type SV_ReloadCfgToFeature = null;

	/*删除副本次数*/
	const enum SV_DelCopyTimesFields {
		mapId = 0,
		level = 1,
		times = 2,
	}
	type SV_DelCopyTimes = [number, number, number];

	/*同步坐标*/
	const enum SV_SynPosFields {
		pos = 0,
	}
	type SV_SynPos = [Pos];

	/*扣除开宝箱次数*/
	const enum SV_DelOpenBoxTimesFields {
	}
	type SV_DelOpenBoxTimes = null;

	/*扣除金钱*/
	const enum SV_DelItemsFields {
		items = 0,
		source = 1,			/*流水类型*/
	}
	type SV_DelItems = [Array<Items>, number];

	/*切换地图、当前场景切换为副本*/
	const enum SV_ChangeCopyReplyFields {
		result = 0,
	}
	type SV_ChangeCopyReply = [number];

	/*更新角色状态*/
	const enum SV_UpdateActorDeadFields {
		dead = 0,
	}
	type SV_UpdateActorDead = [boolean];

	/*广播场景状态*/
	const enum SV_BroadcastCopyStateFields {
		states = 0,
	}
	type SV_BroadcastCopyState = [Array<CopySceneState>];

	/*更新九天之巅积分*/
	const enum SV_UpdateNineCopyFields {
		level = 0,			/*当前层数*/
		score = 1,			/*积分*/
		deadTimes = 2,			/*当前层数死亡次数*/
	}
	type SV_UpdateNineCopy = [number, number, number];

	/*广播九天排名，跑马灯广播*/
	const enum SV_BroadcasNineCopyRankFields {
		rank = 0,			/*九天排名*/
	}
	type SV_BroadcasNineCopyRank = [NineRank];

	/*更新鼓舞次数*/
	const enum SV_UpdateInspireNumFields {
		mapId = 0,
		times = 1,
	}
	type SV_UpdateInspireNum = [number, number];

	/*击杀BOSS之家BOSS次数*/
	const enum SV_AddKillHomeBossNumFields {
		times = 0,
	}
	type SV_AddKillHomeBossNum = [number];

	/*仙府-家园事件完成*/
	const enum SV_XianFuEventFinishFields {
		data = 0,
	}
	type SV_XianFuEventFinish = [SV_HomesteadData];

	/*采集结束*/
	const enum SV_GatherEndFields {
		result = 0,			/*错误码*/
	}
	type SV_GatherEnd = [number];

	/*设置本地时间*/
	const enum SV_SetOpenServerTimeToFeatureFields {
		time = 0,			/*ms*/
	}
	type SV_SetOpenServerTimeToFeature = [number];

	/*BOSS之家BOSS归属次数*/
	const enum SV_AddOwnHomeBossNumFields {
		level = 0,			/*BOSS 等级*/
	}
	type SV_AddOwnHomeBossNum = [number];

	/*更新赛季时间*/
	const enum SV_BroadcastSeasonStateToFeatrueFields {
		state = 0,
	}
	type SV_BroadcastSeasonStateToFeatrue = [Array<SeasonState>];

	/*记录退出瑶池时间*/
	const enum SV_UpdateSwimmingTimeFields {
		time = 0,			/*退出时间*/
	}
	type SV_UpdateSwimmingTime = [number];

	/*登陆到聊天服完成，同步存放在聊天服的数据*/
	const enum SV_LoginChatFinishOfNexusFields {
		data = 0,
	}
	type SV_LoginChatFinishOfNexus = [ChatServerData];

	/*登录场景*/
	const enum SV_LoginSceneFinishFields {
		sceneId = 0,
	}
	type SV_LoginSceneFinish = [SceneId];

	/*参与击杀BOSS死亡*/
	const enum SV_JoinKillBossDeadFields {
		killMonster = 0,
	}
	type SV_JoinKillBossDead = [KillMonster];

	/*检测名字返回*/
	const enum SV_CheckNameReplyFields {
		ret = 0,
	}
	type SV_CheckNameReply = [number];

	/*扣除体力*/
	const enum SubStrengthFields {
		Items = 0,			/*道具列表*/
		strength = 1,			/*扣除体力*/
		source = 2,			/*来源*/
		uuid = 3,			/*bossUuid*/
	}
	type SubStrength = [Array<Item>, number, number, number];

	/*仙府-家园采集结束*/
	const enum SV_XianfuGatherEndFields {
		type = 0,			/*类型0:灵矿，1：宝矿*/
		result = 1,			/*错误码*/
	}
	type SV_XianfuGatherEnd = [number, number];

	/*开启记录*/
	const enum SV_BroadcastSceneRecordsFields {
		records = 0,			/*开启记录*/
	}
	type SV_BroadcastSceneRecords = [Array<SceneRecord>];

	/*添加道具*/
	const enum SV_AddItemsFields {
		Items = 0,			/*道具列表*/
		source = 1,			/*来源*/
	}
	type SV_AddItems = [Array<Item>, number];

	/*背包满则转邮件*/
	const enum SV_AddItemsOrToEmailFields {
		Items = 0,			/*道具列表*/
		source = 1,			/*来源*/
	}
	type SV_AddItemsOrToEmail = [Array<Item>, number];

	/*领取邮件附件*/
	const enum SV_GetEmailsAttachFields {
		items = 0,			/*道具列表*/
	}
	type SV_GetEmailsAttach = [Array<ItemsCenter>];

	/*添加代币券*/
	const enum SV_AddGoldFields {
		gold = 0,
		source = 1,			/*来源*/
	}
	type SV_AddGold = [number, number];

	/*添加临时背包道具*/
	const enum SV_AddTempItemsFields {
		Items = 0,			/*道具列表*/
		source = 1,			/*来源*/
	}
	type SV_AddTempItems = [Array<Item>, number];

	/*获取排行*/
	const enum SV_GetRankDataReplyFields {
		ranks = 0,			/*排行*/
	}
	type SV_GetRankDataReply = [Array<RankData>];

	/*获取排行*/
	const enum SV_GetCrossRankDataReplyFields {
		ranks = 0,			/*排行*/
	}
	type SV_GetCrossRankDataReply = [Array<RankData>];

	/*更新玩家排行*/
	const enum SV_UpdateActorRankFields {
		rankData = 0,
	}
	type SV_UpdateActorRank = [RankUpdate];

	/*请求组队返回*/
	const enum SV_ReqOrganizeTeamReplayFields {
		resule = 0,
	}
	type SV_ReqOrganizeTeamReplay = [number];

	/*取消组队返回*/
	const enum SV_CancelOrganizeTeamReplyFields {
		resule = 0,
	}
	type SV_CancelOrganizeTeamReply = [number];

	/*完成组队*/
	const enum SV_FinishOrganizeTeamFields {
		teamId = 0,
		index = 1,
	}
	type SV_FinishOrganizeTeam = [number, number];

	/*邀请加入队伍*/
	const enum SV_InviteJoinTeamReplyFields {
		result = 0,
	}
	type SV_InviteJoinTeamReply = [number];

	/*创建队伍*/
	const enum SV_CreateTeamReplyFields {
		result = 0,
		teamId = 1,
	}
	type SV_CreateTeamReply = [number, number];

	/*解散队伍*/
	const enum SV_DestoryTeamReplyFields {
		result = 0,
	}
	type SV_DestoryTeamReply = [number];

	/*接受入队、进入队伍*/
	const enum SV_JoinTeamReplyFields {
		result = 0,
	}
	type SV_JoinTeamReply = [number];

	/*离开队伍*/
	const enum SV_LeaveTeamReplyFields {
		result = 0,
	}
	type SV_LeaveTeamReply = [number];

	/*踢出队伍*/
	const enum SV_KickedTeamReplyFields {
		result = 0,
	}
	type SV_KickedTeamReply = [number];

	/*充值订单兑换*/
	const enum SV_RechargeOrderExchangeFields {
		orders = 0,			/*订单列表*/
	}
	type SV_RechargeOrderExchange = [Array<RechargeOrder>];

	/*请求聊天玩家详细信息*/
	const enum SV_ReqChatInfoFields {
		agentId = 0,			/*用户唯一id*/
	}
	type SV_ReqChatInfo = [number];

	/*扣除高级聊天表情次数*/
	const enum SV_DelExpressionCountFields {
		agentId = 0,			/*用户唯一id*/
	}
	type SV_DelExpressionCount = [number];

	/*获取角色天梯 (积分、功勋、剩余次数)返回*/
	const enum SV_GetTiantiOfFeatureReplyFields {
		tianti = 0,
	}
	type SV_GetTiantiOfFeatureReply = [TiantiScore];

	/*拦截仙女返回*/
	const enum SV_InterceptFairyReplyFields {
		code = 0,
		level = 1,			/*被拦截玩家等级*/
		fairyId = 2,			/*被拦截玩家的女神id*/
		isDouble = 3,			/*是否双倍*/
	}
	type SV_InterceptFairyReply = [number, number, number, boolean];

	/*添加拦截记录*/
	const enum SV_AddInterceptFairyOfFeatureFields {
		per = 0,			/*总扣除百分比*/
		looting = 1,			/*被拦截次数*/
		log = 2,
	}
	type SV_AddInterceptFairyOfFeature = [number, number, FairyLog];

	/*更新飞升榜信息*/
	const enum SV_UpdateFeishengRankInfoFields {
		curType = 0,			/*飞升榜类型*/
		startTm = 1,			/*开始时间*/
		endTm = 2,			/*结束时间*/
		endFlag = 3,			/*活动状态*/
	}
	type SV_UpdateFeishengRankInfo = [number, number, number, number];

	/*更新飞升榜抢购信息返回*/
	const enum SV_UpdateFeishengRushBuyInfoReplyFields {
		restCount = 0,			/*剩余数量*/
	}
	type SV_UpdateFeishengRushBuyInfoReply = [number];

	/*更新九州夺宝信息*/
	const enum SV_UpdateJzduobaoInfoToFeatureFields {
		state = 0,			/*开启状态*/
		jackpot = 1,			/*奖池代币券*/
	}
	type SV_UpdateJzduobaoInfoToFeature = [number, number];

	/*当天飞升榜结算*/
	const enum SV_UpdateFeishengRankEndFields {
		rankType = 0,			/*排行类型*/
		rankTm = 1,			/*排行时间*/
		nodeList = 2,			/*排名列表*/
	}
	type SV_UpdateFeishengRankEnd = [number, number, Array<FeishengRankInfo>];

	/*挑战竞技场*/
	const enum SV_ChallengeArenaReplyFields {
		obj = 0,
	}
	type SV_ChallengeArenaReply = [ArenaChallengeObj];

	/*获取竞技场排名*/
	const enum SV_GetArenaRankReplyFields {
		rank = 0,
	}
	type SV_GetArenaRankReply = [number];

	/*获取竞技场排名*/
	const enum SV_UpdateArenaRankFields {
		rank = 0,
	}
	type SV_UpdateArenaRank = [number];

	/*获取竞技场挑战对象*/
	const enum SV_GetArenaObjsReplyFields {
		objs = 0,
	}
	type SV_GetArenaObjsReply = [Array<ArenaObj>];

	/*创建仙盟*/
	const enum SV_CreateFactionFields {
	}
	type SV_CreateFaction = null;

	/*更新仙盟信息*/
	const enum SV_UpdateFactionInfoToFeatureFields {
		level = 0,
		id = 1,
		name = 2,
	}
	type SV_UpdateFactionInfoToFeature = [number, string, string];

	/*申请加入仙盟*/
	const enum SV_JoinApplyFields {
		uuid = 0,			/*仙盟id*/
		opt = 1,			/*0:请求加入，1：取消加入*/
	}
	type SV_JoinApply = [string, number];

	/*离线时被拒绝的仙盟*/
	const enum SV_JoinResultFields {
		uuid = 0,			/*仙盟id*/
	}
	type SV_JoinResult = [Array<string>];

	/*请求协助开宝箱返回*/
	const enum SV_AskAssistOpenBoxReplyFields {
		result = 0,
	}
	type SV_AskAssistOpenBoxReply = [number];

	/*刷新仙盟宝箱*/
	const enum SV_UpdateFactionBoxFields {
		time = 0,			/*更新时间*/
	}
	type SV_UpdateFactionBox = [number];

	/*协助别人开宝箱返回*/
	const enum SV_AssistOpenBoxReplyFields {
		result = 0,
		box = 1,
	}
	type SV_AssistOpenBoxReply = [number, FactionBox];

	/*其他人协助自己开宝箱返回*/
	const enum SV_OtherAssistOpenBoxFields {
		list = 0,
	}
	type SV_OtherAssistOpenBox = [Array<FactionAssistBox>];

	/*其他人加速宝箱*/
	const enum SV_OtherAddSpeedOpenBoxFields {
		list = 0,
	}
	type SV_OtherAddSpeedOpenBox = [Array<FactionAddSpeedBox>];

	/*对boss造成伤害*/
	const enum SV_AddFactionHurtFields {
		value = 0,
	}
	type SV_AddFactionHurt = [number];

	/*退出仙盟副本*/
	const enum SV_ExitFactionCopyFields {
		time = 0,
	}
	type SV_ExitFactionCopy = [number];

	/*更新称号时间*/
	const enum SV_UpdateDesignationTimeFields {
		designationType = 0,			/*称号类型*/
		updateTime = 1,
	}
	type SV_UpdateDesignationTime = [number, number];

	/*获取称号*/
	const enum SV_GetDesinationReplyFields {
		arr = 0,
	}
	type SV_GetDesinationReply = [Array<SV_Designation>];

	type AutoUF_ShowSuitInfo = []                                              /**获取外显套装数据*/
	/**激活外显套装*/
	const enum AutoUF_ShowSuitActivationFields {
		id = 0,                                                                 /**外显套装id*/
		type = 1,                                                               /**类型（1中级 2完美）*/
	}
	type AutoUF_ShowSuitActivation = [number, number]                           /**激活外显套装*/
	/**外显套装升级*/
	const enum AutoUF_ShowSuitUpLevelFields {
		id = 0,                                                                 /**外显套装id*/
	}
	type AutoUF_ShowSuitUpLevel = [number]                                     /**外显套装升级*/

	/**外显套装幻化*/
	const enum AutoUF_ShowSuitHallucinationFields {
		id = 0,                                                                 /**外显套装id*/
	}
	type AutoUF_ShowSuitHallucination = [number]                               /**外显套装幻化*/

	/**外显套装等级数据*/
	const enum AutoSC_ShowSuitLevelFields {
		id = 0,                                                                 /**外显套装id*/
		level = 1,                                                              /**等级*/
	}
	type AutoSC_ShowSuitLevel = [number, number]                                /**外显套装等级数据*/

	/**外显套装部位等级*/
	const enum AutoSC_ShowSuitPosLevelFields {
		id = 0,                                                                 /**外显套装id*/
		level = 1,                                                              /**等级*/
	}
	type AutoSC_ShowSuitPosLevel = [number, Array<number>]                      /**外显套装部位等级*/

	/**外显套装数据*/
	const enum AutoSC_ShowSuitInfoFields {
		level = 0,                                                              /**外显等级*/
		posLevel = 1,                                                           /**部位等级*/
		posHallucinationID = 2,                                                 /**外显套装部位幻化id*/
	}
	type AutoSC_ShowSuitPosHallucinationID = [number, number, number]            /**外显套装部位幻化id  0: 武器 1:皮肤 2:翅膀*/
	type AutoSC_ShowSuitInfo = [Array<AutoSC_ShowSuitLevel>, Array<AutoSC_ShowSuitPosLevel>, AutoSC_ShowSuitPosHallucinationID]/**外显套装数据*/
	type AutoSC_ShowSuitUpLevel = [ErrorCode, AutoSC_ShowSuitLevel]             /**外显套装等级更新*/
	type AutoSC_ShowSuitUpPosHallucination = [AutoSC_ShowSuitPosHallucinationID]/**幻化更新*/

	/*获取玩家基本属性*/
	const enum GetActorBaseAttrFields {
	}
	type GetActorBaseAttr = null;

	/*GM 指令*/
	const enum GMCommandFields {
		command = 0,			/*指令*/
	}
	type GMCommand = [string];

	/*获取角色装备*/
	const enum GetActorEquipFields {
	}
	type GetActorEquip = null;

	/*穿戴装备*/
	const enum WearEquipFields {
		uid = 0,			/*道具唯一ID*/
	}
	type WearEquip = [number];

	/*一键快速穿戴*/
	const enum FastWearEquipFields {
		uids = 0,
	}
	type FastWearEquip = [Array<number>];

	/*获取任务*/
	const enum GetTaskFields {
	}
	type GetTask = null;

	/*领取任务奖励*/
	const enum GetTaskAwardFields {
		taskId = 0,			/*任务ID*/
	}
	type GetTaskAward = [string];

	/*请求进入场景*/
	const enum ReqEnterSceneFields {
		mapId = 0,			/*地图ID*/
		level = 1,			/*层数*/
		params = 2,			/*参数*/
	}
	type ReqEnterScene = [number, number, Array<number>];

	/*获取天关副本*/
	const enum GetCopyTianguanFields {
	}
	type GetCopyTianguan = null;

	/*领取副本奖励*/
	const enum GetCopyAwardFields {
		mapId = 0,			/*地图ID*/
		level = 1,			/*层数、关卡数*/
		type = 2,			/*0:小奖 1:大奖*/
	}
	type GetCopyAward = [number, number, number];

	/*扫荡副本*/
	const enum SweepCopyFields {
		mapId = 0,			/*MapId*/
	}
	type SweepCopy = [number];

	/*获取功能开启*/
	const enum GetActionOpenFields {
	}
	type GetActionOpen = null;

	/*购买副本次数*/
	const enum BuyTimesFields {
		sceneType = 0,			/*5：哥布林王国，6：泰拉矿场，7：精灵副本，8：宠物副本  9：组队副本*/
	}
	type BuyTimes = [number];

	/*获取副本次数*/
	const enum GetCopyTimesFields {
	}
	type GetCopyTimes = null;

	/*获取开启宝箱次数*/
	const enum GetOpenBoxTimesFields {
	}
	type GetOpenBoxTimes = null;

	/*获取组队副本次数*/
	const enum GetTeamCopyTimesFields {
	}
	type GetTeamCopyTimes = null;

	/*获取远古符阵副本*/
	const enum GetCopyRuneFields {
	}
	type GetCopyRune = null;

	/*领取远古符阵副本每日奖励*/
	const enum GetRuneEveryDayAwardFields {
	}
	type GetRuneEveryDayAward = null;

	/*获取远古符阵转盘*/
	const enum GetRuneDialFields {
	}
	type GetRuneDial = null;

	/*远古符阵转盘开始*/
	const enum StartRuneDialFields {
	}
	type StartRuneDial = null;

	/*获取场景状态*/
	const enum GetSceneStateFields {
	}
	type GetSceneState = null;

	/*玩家某些操作(类似埋点)*/
	const enum RunActorOperFields {
		type = 0,			/*操作类型*/
		params = 1,			/*自定义参数*/
	}
	type RunActorOper = [number, Array<number>];

	/*获取所有完成的指引*/
	const enum GetGuideListFields {
	}
	type GetGuideList = null;

	/*完成指引*/
	const enum FinishGuideFields {
		id = 0,
	}
	type FinishGuide = [Array<number>];

	/*触发指引，后台记录用*/
	const enum TriggerGuideFields {
		id = 0,
	}
	type TriggerGuide = [Array<number>];

	/*获取功能预览已领取的id*/
	const enum GetActionPreviesHaveReceivedFields {
	}
	type GetActionPreviesHaveReceived = null;

	/*领取功能预览奖励*/
	const enum GetActionPreviesAwardFields {
		id = 0,			/*功能开启id*/
	}
	type GetActionPreviesAward = [number];

	/*获取开服第几天*/
	const enum GetServerDayFields {
	}
	type GetServerDay = null;

	/*获取功能开启状态*/
	const enum GetActionStateFields {
		list = 0,			/*功能id*/
	}
	type GetActionState = [Array<number>];

	/*获取装备套装信息*/
	const enum GetEquipSuitFields {
	}
	type GetEquipSuit = null;

	/*点亮部位*/
	const enum LightenUpFields {
		id = 0,			/*套装id*/
		grid = 1,			/*点亮的格子，对应部分看枚举EquipCategory*/
	}
	type LightenUp = [number, number];

	/*一键扫荡试炼副本*/
	const enum OneKeySweepShilianCopyFields {
	}
	type OneKeySweepShilianCopy = null;

	/*一键挑战试炼副本*/
	const enum OneKeyChallengeShilianCopyFields {
	}
	type OneKeyChallengeShilianCopy = null;

	/*获取设置名字信息*/
	const enum GetSetNameInfoFields {
	}
	type GetSetNameInfo = null;

	/*设置名字职业*/
	const enum SetNameOccFields {
		name = 0,			/*名字*/
		occ = 1,			/*职业*/
	}
	type SetNameOcc = [string, number];

	/*获取背包*/
	const enum GetBagFields {
		bagId = 0,			/*背包ID*/
	}
	type GetBag = [number];

	/*取探索仓库物品到背包*/
	const enum TaskXunbaoBagItemListFields {
		uids = 0,			/*uid列表*/
	}
	type TaskXunbaoBagItemList = [Array<number>];

	/*取探索仓库所有*/
	const enum TaskXunbaoBagAllItemFields {
	}
	type TaskXunbaoBagAllItem = null;

	/*使用背包物品*/
	const enum useBagItemFields {
		uid = 0,			/*uid*/
		itemId = 1,			/*itemId*/
		count = 2,			/*数量*/
		exValue = 3,			/*额外参数  比如N选一礼包中，传选中的itemId*/
	}
	type useBagItem = [number, number, number, number];

	/*取仙玉探索仓库物品到背包*/
	const enum TaskXianYuXunbaoBagItemListFields {
		uids = 0,			/*uid列表*/
	}
	type TaskXianYuXunbaoBagItemList = [Array<number>];

	/*取仙玉探索仓库所有*/
	const enum TaskXianYuXunbaoBagAllItemFields {
	}
	type TaskXianYuXunbaoBagAllItem = null;

	/*获取宠物*/
	const enum GetPetInfoFields {
	}
	type GetPetInfo = null;

	/*喂养宠物*/
	const enum FeedPetFields {
	}
	type FeedPet = null;

	/*升阶宠物*/
	const enum RankPetFields {
		isBuy = 0,			/*是否自动购买(1是 0否)*/
	}
	type RankPet = [number];

	/*激活/升级技能*/
	const enum AddPetSkillLevelFields {
		skillId = 0,			/*技能id*/
		skillType = 1,			/*技能类型 1培养技能 2升阶技能*/
	}
	type AddPetSkillLevel = [number, number];

	/*更换升阶外观*/
	const enum ChangePetShowFields {
		showId = 0,			/*升阶外观Id*/
	}
	type ChangePetShow = [number];

	/*激活/升星*/
	const enum RiseMagicShowFields {
		magicShowId = 0,			/*幻化Id*/
	}
	type RiseMagicShow = [number];

	/*更换幻化外观*/
	const enum ChangeMagicShowFields {
		magicShowId = 0,			/*幻化Id*/
	}
	type ChangeMagicShow = [number];

	/*升级修炼*/
	const enum RiseRefineFields {
		type = 0,			/*修炼类型 0悟性,1潜能,2根骨,3灵体*/
	}
	type RiseRefine = [number];

	/*激活/升级法阵*/
	const enum AddPetFazhenFields {
		fazhenId = 0,			/*法阵Id*/
	}
	type AddPetFazhen = [number];

	/*更换法阵外观*/
	const enum ChangePetFazhenFields {
		fazhenId = 0,			/*法阵Id*/
	}
	type ChangePetFazhen = [number];

	/*获取精灵*/
	const enum GetRideInfoFields {
	}
	type GetRideInfo = null;

	/*喂养精灵*/
	const enum FeedRideFields {
	}
	type FeedRide = null;

	/*升阶精灵*/
	const enum RankRideFields {
		isBuy = 0,			/*是否自动购买(1是 0否)*/
	}
	type RankRide = [number];

	/*激活/升级技能*/
	const enum AddRideSkillLevelFields {
		skillId = 0,			/*技能id*/
		skillType = 1,			/*技能类型 1培养技能 2升阶技能*/
	}
	type AddRideSkillLevel = [number, number];

	/*更换升阶外观*/
	const enum ChangeRideShowFields {
		showId = 0,			/*升阶外观Id*/
	}
	type ChangeRideShow = [number];

	/*激活/升星*/
	const enum RiseRideMagicShowFields {
		magicShowId = 0,			/*幻化Id*/
	}
	type RiseRideMagicShow = [number];

	/*更换幻化外观*/
	const enum ChangeRideMagicShowFields {
		magicShowId = 0,			/*幻化Id*/
	}
	type ChangeRideMagicShow = [number];

	/*升级修炼*/
	const enum RiseRideRefineFields {
		type = 0,			/*修炼类型 0锐,1御,2攻,3迅*/
	}
	type RiseRideRefine = [number];

	/*激活/升级法阵*/
	const enum AddRideFazhenFields {
		fazhenId = 0,			/*法阵Id*/
	}
	type AddRideFazhen = [number];

	/*更换法阵外观*/
	const enum ChangeRideFazhenFields {
		fazhenId = 0,			/*法阵Id*/
	}
	type ChangeRideFazhen = [number];

	/*获取金身*/
	const enum GetSoulInfoFields {
	}
	type GetSoulInfo = null;

	/*修炼金身*/
	const enum RefineSoulFields {
		type = 0,			/*修炼类型*/
	}
	type RefineSoul = [number];

	/*修炼不败金身*/
	const enum RiseSoulFields {
	}
	type RiseSoul = null;

	/*获取圣物*/
	const enum GetAmuletInfoFields {
	}
	type GetAmuletInfo = null;

	/*激活/升级圣物*/
	const enum RefineAmuletFields {
		id = 0,			/*圣物id*/
	}
	type RefineAmulet = [number];

	/*获取仙石*/
	const enum GetGemInfoFields {
	}
	type GetGemInfo = null;

	/*镶嵌仙石*/
	const enum InlayGemFields {
		part = 0,			/*装备格*/
		type = 1,			/*仙石槽类型 0vip 1青龙 2白虎 3朱雀 4玄武*/
		uid = 2,			/*背包物品uid*/
	}
	type InlayGem = [number, number, number];

	/*升级仙石*/
	const enum RefineGemFields {
		part = 0,			/*装备格*/
		type = 1,			/*仙石槽类型 0vip 1青龙 2白虎 3朱雀 4玄武*/
	}
	type RefineGem = [number, number];

	/*升级仙石大师*/
	const enum RiseGemFields {
	}
	type RiseGem = null;

	/*仙石一键操作*/
	const enum GemOneKeyOperationFields {
		part = 0,			/*装备格*/
		state = 1,			/*操作类型，0：一键镶嵌 1：一键替换 2：一键升级*/
	}
	type GemOneKeyOperation = [number, number];

	/*替换仙石*/
	const enum GemReplaceFields {
		part = 0,			/*装备格*/
		type = 1,			/*仙石槽类型 0vip 1青龙 2白虎 3朱雀 4玄武*/
		uid = 2,			/*背包物品uid*/
	}
	type GemReplace = [number, number, number];

	/*获取角色技能*/
	const enum GetSkillsFields {
	}
	type GetSkills = null;

	/*升级角色技能*/
	const enum AddSkillLevelFields {
		skillId = 0,			/*技能id*/
	}
	type AddSkillLevel = [number];

	/*一键升级角色技能*/
	const enum AddSkillLevelOfAllFields {
	}
	type AddSkillLevelOfAll = null;

	/*激活角色技能*/
	const enum OpenSkillFields {
		skillId = 0,			/*技能id*/
	}
	type OpenSkill = [number];

	/*获取签到信息*/
	const enum GetSignFields {
	}
	type GetSign = null;

	/*签到*/
	const enum SignFields {
	}
	type Sign = null;

	/*领取签到奖励*/
	const enum GetSignAwardFields {
		index = 0,			/*领取哪一档,从0开始*/
	}
	type GetSignAward = [number];

	/*获取单人BOSS副本*/
	const enum GetSingleBossCopyFields {
	}
	type GetSingleBossCopy = null;

	/*获取七日礼*/
	const enum GetSevenDayFields {
	}
	type GetSevenDay = null;

	/*领取七日礼*/
	const enum GetSevenDayAwardFields {
		day = 0,			/*天数*/
	}
	type GetSevenDayAward = [number];

	/*获取在线礼包*/
	const enum GetOnlineRewardFields {
	}
	type GetOnlineReward = null;

	/*领取*/
	const enum GetOnlineRewardAwardFields {
		id = 0,			/*id*/
	}
	type GetOnlineRewardAward = [number];

	/*获取大荒古塔*/
	const enum GetDahuangCopyFields {
	}
	type GetDahuangCopy = null;

	/*获取BOSS次数*/
	const enum GetBossTimesFields {
	}
	type GetBossTimes = null;

	/*获取关注的BOSS*/
	const enum GetFollowBossFields {
	}
	type GetFollowBoss = null;

	/*设置关注BOSS*/
	const enum SetFollowBossFields {
		follow = 0,			/*关注BOSS*/
	}
	type SetFollowBoss = [FollowBoss];

	/*获取多人BOSS是否第一次打，引导用*/
	const enum GetBossIsFirstFields {
	}
	type GetBossIsFirst = null;

	/*获取觉醒信息*/
	const enum GetEraInfoFields {
	}
	type GetEraInfo = null;

	/*觉醒*/
	const enum EraFields {
	}
	type Era = null;

	/*觉醒boss*/
	const enum EraBossFields {
	}
	type EraBoss = null;

	/*觉醒丹*/
	const enum FastEraFields {
	}
	type FastEra = null;

	/*领取任务奖励*/
	const enum DrawEraTaskFields {
		taskID = 0,			/*任务ID*/
	}
	type DrawEraTask = [number];

	/*获取强化*/
	const enum GetStrongInfoFields {
	}
	type GetStrongInfo = null;

	/*强化升级*/
	const enum RefineStrongFields {
		part = 0,			/*装备格*/
	}
	type RefineStrong = [number];

	/*一键强化升级*/
	const enum RefineStrongOfAllFields {
	}
	type RefineStrongOfAll = null;

	/*升级强化大师/神匠*/
	const enum RiseStrongFields {
		type = 0,			/*类型 0大师 1神匠*/
	}
	type RiseStrong = [number];

	/*获取数据*/
	const enum GetZhuhunInfoFields {
	}
	type GetZhuhunInfo = null;

	/*铸魂*/
	const enum ZhuhunOperFields {
		part = 0,			/*装备格*/
		itemId = 1,			/*材料id*/
	}
	type ZhuhunOper = [number, number];

	/*一键铸魂*/
	const enum ZhuhunOperOneKeyFields {
		itemId = 0,			/*材料id*/
	}
	type ZhuhunOperOneKey = [number];

	/*噬魂*/
	const enum ShihunOperFields {
		sClass = 0,			/*类型*/
	}
	type ShihunOper = [number];

	/*一键噬魂*/
	const enum ShihunOperOneKeyFields {
		sClass = 0,			/*类型*/
	}
	type ShihunOperOneKey = [number];

	/*合成*/
	const enum ComposeFields {
		id = 0,			/*唯一id*/
		uids = 1,			/*uid列表*/
		count = 2,			/*数量*/
	}
	type Compose = [number, Array<number>, number];

	/*一键合成*/
	const enum ComposeAllFields {
		type = 0, //一键合成的类型 1、徽章 2、装备 3、道具
	}
	type ComposeAll = [number];

	/*分解*/
	const enum ResolveFields {
		itemId = 0,			/*物品id*/
		uids = 1,			/*uid列表*/
		count = 2,			/*数量*/
	}
	type Resolve = [number, Array<number>, number];

	/*获取熔炼*/
	const enum GetSmeltInfoFields {
	}
	type GetSmeltInfo = null;

	/*熔炼*/
	const enum SmeltFields {
		uids = 0,			/*uid列表*/
	}
	type Smelt = [Array<number>];

	/*获取历练信息*/
	const enum GetLilianInfoFields {
	}
	type GetLilianInfo = null;

	/*领取历练任务奖励*/
	const enum GetLilianTaskAwardFields {
		id = 0,			/*任务id*/
	}
	type GetLilianTaskAward = [number];

	/*领取历练日奖励*/
	const enum GetLilianDayAwardFields {
	}
	type GetLilianDayAward = null;

	/*获取仙位信息*/
	const enum GetXianweiInfoFields {
	}
	type GetXianweiInfo = null;

	/*领取任务奖励*/
	const enum GetXianweiTaskAwardFields {
		id = 0,			/*任务id*/
	}
	type GetXianweiTaskAward = [number];

	/*领取日奖励*/
	const enum GetXianweiDayAwardFields {
		riseId = 0,			/*阶id*/
	}
	type GetXianweiDayAward = [number];

	/*获取狂嗨信息*/
	const enum GetKuanghaiInfoFields {
	}
	type GetKuanghaiInfo = null;
	/*获取狂嗨信息 daw*/
	const enum GetKuanghai2InfoFields {
	}
	type GetKuanghai2Info = null;
	/*领取任务奖励*/
	const enum GetKuanghaiTaskAwardFields {
		id = 0,			/*任务id*/
	}
	type GetKuanghaiTaskAward = [number];
	/*领取任务奖励*/
	const enum GetKuanghai2TaskAwardFields {
		id = 0,			/*任务id*/
	}
	type GetKuanghai2TaskAward = [number];
	/*领取奖励*/
	const enum GetKuanghaiAwardFields {
		grade = 0,			/*档次*/
	}
	type GetKuanghaiAward = [number];
	/*领取奖励*/
	const enum GetKuanghai2AwardFields {
		grade = 0,			/*档次*/
	}
	type GetKuanghai2Award = [number];
	/*领取奖励*/
	const enum JumpKuanghai2TaskFields {
		grade = 0,			/*档次*/
	}
	type JumpKuanghai2Task = [number];
	/*领取奖励*/
	const enum GetKuanghai2FinalRewardFields {

	}
	type GetKuanghai2FinalReward = [];

	/*获取神兵*/
	const enum GetShenbingInfoFields {
	}
	type GetShenbingInfo = null;

	/*喂养神兵*/
	const enum FeedShenbingFields {
	}
	type FeedShenbing = null;

	/*激活/升级技能*/
	const enum AddShenbingSkillLevelFields {
		skillId = 0,			/*技能id*/
	}
	type AddShenbingSkillLevel = [number];

	/*激活/升级幻化*/
	const enum AddShenbingMagicShowFields {
		magicShowId = 0,			/*幻化Id*/
	}
	type AddShenbingMagicShow = [number];

	/*更换幻化外观*/
	const enum ChangeShenbingMagicShowFields {
		magicShowId = 0,			/*幻化Id*/
	}
	type ChangeShenbingMagicShow = [number];

	/*升级修炼*/
	const enum AddShenbingRefineFields {
		type = 0,			/*修炼类型 0悟性,1潜能,2根骨,3灵体*/
	}
	type AddShenbingRefine = [number];

	/*获取仙翼*/
	const enum GetWingInfoFields {
	}
	type GetWingInfo = null;

	/*喂养仙翼*/
	const enum FeedWingFields {
	}
	type FeedWing = null;

	/*激活/升级技能*/
	const enum AddWingSkillLevelFields {
		skillId = 0,			/*技能id*/
	}
	type AddWingSkillLevel = [number];

	/*激活/升级幻化*/
	const enum AddWingMagicShowFields {
		magicShowId = 0,			/*幻化Id*/
	}
	type AddWingMagicShow = [number];

	/*更换幻化外观*/
	const enum ChangeWingMagicShowFields {
		magicShowId = 0,			/*幻化Id*/
	}
	type ChangeWingMagicShow = [number];

	/*升级修炼*/
	const enum AddWingRefineFields {
		type = 0,			/*修炼类型 0悟性,1潜能,2根骨,3灵体*/
	}
	type AddWingRefine = [number];

	/*获取探索信息*/
	const enum GetXunbaoInfoFields {
		type = 0,			/*类型 0装备 1巅峰 2至尊 3仙符*/
	}
	type GetXunbaoInfo = [number];

	/*探索*/
	const enum RunXunbaoFields {
		type = 0,			/*类型 0装备 1巅峰 2至尊 3仙符 4圣物*/
		grade = 1,			/*档次 0 1次 1 10次 2 50次*/
		isBuy = 2,			/*是否自动购买true 是  false 否*/
	}
	type RunXunbao = [number, number, boolean];

	/*探索兑换*/
	const enum XunBaoExchangeFields {
		type = 0,		/*类型 0装备 1巅峰 2至尊 3仙符 4圣物 5:仙玉 6:庆典*/
		id = 1,			/*兑换id*/
	}
	type XunBaoExchange = [number, number];

	/*获取勾选探索兑换提醒列表*/
	const enum GetXunBaoHintFields {
	}
	type GetXunBaoHint = null;

	/*勾选探索兑换提醒列表*/
	const enum XunBaoExchangeHintFields {
		type = 0,			/*类型 0装备 1巅峰 2至尊 3仙符 4圣物*/
		hintList = 1,			/*勾选id列表*/
	}
	type XunBaoExchangeHint = [number, Array<number>];

	// 获取探索兑换列表信息
	const enum XunBaoExchangeListFields {
		type = 0, /*类型 0装备 1巅峰 2至尊 3仙符 4圣物 5:仙玉 6:庆典*/
	}
	type XunBaoExchangeList = [number];

	/**探索兑换列表信息 */
	const enum XunBaoExchangeListNodeFields {
		id = 0, /**商品id */
		buyCount = 1, /**购买的商品数量 */
	}
	type XunBaoExchangeListNode = [number, number];

	// 获取探索兑换列表
	const enum XunBaoExchangeListReplyFields {
		type = 0, /**探索类型 */
		time = 1, /**探索兑换时间(-1:无限制) */
		listInfo = 2, /**探索兑换商品信息 */
	}
	type XunBaoExchangeListReply = [number, number, Array<XunBaoExchangeListNode>];


	/*获取离线挂机信息*/
	const enum GetOutlineInfoFields {
	}
	type GetOutlineInfo = null;

	/*获取信息*/
	const enum GetMonthCardInfoFields {
	}
	type GetMonthCardInfo = null;

	/*购买月卡*/
	const enum BuyMonthCardFields {
	}
	type BuyMonthCard = null;

	/*每日奖励*/
	const enum GetMonthCardRewardFields {
		day = 0,			/*第几天 0表示第一天*/
	}
	type GetMonthCardReward = [number];

	/*获取信息*/
	const enum GetZhizunCardInfoFields {
	}
	type GetZhizunCardInfo = null;

	/*购买*/
	const enum BuyZhizunCardFields {
	}
	type BuyZhizunCard = null;

	/*获取信息*/
	const enum GetMallInfoFields {
	}
	type GetMallInfo = null;

	/*购买*/
	const enum BuyMallItemFields {
		id = 0,			/*id*/
		count = 1,			/*数量*/
	}
	type BuyMallItem = [number, number];

	/*获取信息*/
	const enum GetVipInfoFields {
	}
	type GetVipInfo = null;

	/*获得奖励*/
	const enum GetVipRewardFields {
		grade = 0,			/*等级*/
	}
	type GetVipReward = [number];

	/*获取特权信息*/
	const enum GetPrivilegeFields {
	}
	type GetPrivilege = null;

	/*领取vip每日奖励*/
	const enum GetVipDayRewardFields {
	}
	type GetVipDayReward = null;

	/*获取信息*/
	const enum GetVipFInfoFields {
	}
	type GetVipFInfo = null;

	/*获得奖励*/
	const enum GetVipFRewardFields {
		grade = 0,			/*等级*/
	}
	type GetVipFReward = [number];

	/*获取充值信息*/
	const enum GetRechargeInfoFields {
	}
	type GetRechargeInfo = null;

	/*获取信息*/
	const enum GetFirstPayInfoFields {
	}
	type GetFirstPayInfo = null;

	/*获取奖励*/
	const enum GetFirstPayRewardFields {
		id = 0
	}
	type GetFirstPayReward = [number];

	/*组队*/
	const enum ReqOrganizeTeamFields {
		mapId = 0,			/*场景ID*/
	}
	type ReqOrganizeTeam = [number];

	/*取消组队*/
	const enum CancelOrganizeTeamFields {
	}
	type CancelOrganizeTeam = null;

	/*创建队伍*/
	const enum CreateTeamFields {
		mapId = 0,			/*场景ID*/
	}
	type CreateTeam = [number];

	/*解散队伍*/
	const enum DestoryTeamFields {
	}
	type DestoryTeam = null;

	/*邀请加入队伍*/
	const enum InviteJoinTeamFields {
		type = 0,			/*0: 仙盟*/
		objId = 1,			/*玩家ID 0: 所有在线玩家*/
		members = 2,			/*已有成员*/
	}
	type InviteJoinTeam = [number, number, Array<number>];

	/*接受入队、进入队伍*/
	const enum JoinTeamFields {
		mapId = 0,			/*场景ID*/
		teamId = 1,			/*队伍ID*/
	}
	type JoinTeam = [number, number];

	/*离开队伍*/
	const enum LeaveTeamFields {
	}
	type LeaveTeam = null;

	/*踢出队伍*/
	const enum KickedTeamFields {
		objId = 0,
	}
	type KickedTeam = [number];

	/*获取玉荣信息*/
	const enum GetRuneInfoFields {
	}
	type GetRuneInfo = null;

	/*镶嵌玉荣*/
	const enum InlayRuneFields {
		id = 0,			/*玉荣槽序号id*/
		uid = 1,			/*镶嵌的uid*/
	}
	type InlayRune = [number, number];

	/*合成玉荣预览*/
	const enum ComposeRunePreviewFields {
		id = 0,			/*合成ID*/
		uids = 1,		/*uids列表*/
	}
	type ComposeRunePreview = [number, Array<number>];

	const enum RuneCollectInfoFields {
	}
	type RuneCollectInfo = null;

	const enum RuneCollectSPLevelFields {
	}
	type RuneCollectSPLevel = null;

	/*升级*/
	const enum RuneCollectUpLevelFields {
		id = 0,			/*玉荣箱 玉荣id*/
	}
	type RuneCollectUpLevel = [number];

	/*拆解*/
	const enum RuneCollectDismantleFields {
		id = 0,			/*玉荣箱 玉荣id*/
	}
	type RuneCollectDismantle = [number];

	/*玉荣升级*/
	const enum RuneRefineFields {
		id = 0,			/*玉荣槽序号id*/
	}
	type RuneRefine = [number];

	/*分解玉荣*/
	const enum ResolveRuneFields {
		uids = 0,			/*分解的uid列表*/
	}
	type ResolveRune = [Array<Pair>];

	/*分解标记勾选*/
	const enum SetResolveRuneFlagFields {
		flags = 0,			/*勾选列表*/
	}
	type SetResolveRuneFlag = [Array<number>];



	/*一键扫荡*/
	const enum OneKeySweepingFields {
	}
	type OneKeySweeping = null;

	/*购买挂机扫荡次数*/
	const enum BuySweepingTimesFields {
	}
	type BuySweepingTimes = null;

	/*获取一键扫荡信息*/
	const enum GetSweepingStateFields {
	}
	type GetSweepingState = null;

	/*获取基本信息*/
	const enum GetSweepingBaseInfoFields {
	}
	type GetSweepingBaseInfo = null;

	/*获取正常挂机收益*/
	const enum GetSweepingIncomeFields {
	}
	type GetSweepingIncome = null;

	/*获取降妖数据*/
	const enum GetXiangyaoStateFields {
	}
	type GetXiangyaoState = null;

	/*领取奖励*/
	const enum GetXiangyaoRewardFields {
		type = 0,			/*降妖类型：1 boss 0  小怪*/
	}
	type GetXiangyaoReward = [number];

	/*获取数据*/
	const enum GetDaypayInfoFields {
	}
	type GetDaypayInfo = null;

	/*领取奖励*/
	const enum GetDaypayRewardFields {
		idx = 0,			/*第几档(0,1,2)*/
	}
	type GetDaypayReward = [number];

	/*获取数据*/
	const enum GetCumulatepayInfoFields {
	}
	type GetCumulatepayInfo = null;

	/*领取奖励*/
	const enum GetCumulatepayRewardFields {
		id = 0,			/*第几档*/
	}
	type GetCumulatepayReward = [number];

	/*获取数据*/
	const enum GetCumulatepay2InfoFields {
	}
	type GetCumulatepay2Info = null;
	/*获取数据*/
	const enum GetCumulatepay3InfoFields {
	}
	type GetCumulatepay3Info = null;
	/*领取奖励*/
	const enum GetCumulatepay2RewardFields {
		id = 0,			/*id*/
	}
	type GetCumulatepay2Reward = [number];
	/*领取奖励*/
	const enum GetCumulatepay3RewardFields {
		id = 0,			/*id*/
	}
	type GetCumulatepay3Reward = [number];

	/*--------------战队 starat--------------*/
	/*创建战队*/
	const enum CreateClanFields {
		name = 0,			/*战队名*/
		flagIndex = 1,		/*旗子总表下标*/
	}
	type CreateClan = [string, number];

	/*战队改名*/
	const enum ClanRenameFields {
		name = 0,			/*战队名*/
		flagIndex = 1,		/*旗子总表下标*/
	}
	type ClanRename = [string, number];
	/*申请加入战队*/
	const enum ApplyJoinClanFields {
		uuid = 0,			/*战队uuid*/
		opt = 1,			/*0-加入 1-取消加入*/
	}
	type ApplyJoinClan = [string, number];
	/*战队审批*/
	const enum ClanAuditFields {
		agendId = 0,
		result = 1,   /*0：拒绝，1同意*/
	}
	type ClanAudit = [number, number];
	/*战队解散*/
	const enum ClanDissolveFields {
		clanID = 0,   /*战队id*/
	}
	type ClanDissolve = [string];
	/*退出战队*/
	const enum ExitClanFields { }
	type ExitClan = null;
	/*战队踢人*/
	const enum ClanKickPersonFields {
		agentId = 0,
	}
	type ClanKickPerson = [number];
	/*战队加入战力设置*/
	const enum ClanJoinLimitSetFields {
		fight = 0,
	}
	type ClanJoinLimitSet = [number];
	/*设置加入战队审批状态*/
	const enum ClanJoioAuditStatusFields {
		state = 0,   /*true需要审批，false不用*/
	}
	type ClanJoioAuditStatus = [boolean];
	/*战队建设捐献请求*/
	const enum ClanBuildDataFields {
		itemId = 0,
	}
	type ClanBuildData = [number];

	/*获取数据-战队请求数据为null时可通用使用*/
	const enum GetClanDataCommonFields {
	}
	type GetClanDataCommon = null;
	/*战队等级奖励领取*/
	const enum ClanGetLevelRewardFields {
		level = 0
	}
	type ClanGetLevelReward = [number];
	/*已经申请过的战队列表*/
	const enum AppliedClanListFields {
	}
	type AppliedClanList = null;

	/*战队code返回通用处理*/
	const enum ClanCodeHandleReplyFields {
		result = 0,
	}
	type ClanCodeHandleReply = [number];

	/*战队币返回*/
	const enum ClanUpdateFightTeamCoinFields {
		result = 0,
	}
	type ClanUpdateFightTeamCoin = [number];

	/*战队光环刷新返回*/
	const enum ClanHaloRefreshReplyFields {
		code = 0,			/*code*/
		haloId = 1,			/*光环id*/
	}
	type ClanHaloRefresh = [number, number];

	/*已经申请过的战队列表的返回*/
	const enum UpdateClanAppliedListReplyFields {
		list = 0,
	}
	type UpdateClanAppliedListReply = [Array<string>];

	/*战队申请列表返回*/
	const enum ClanApplyListReplyFields {
		code = 0,
		list = 1
	}
	type ClanApplyListReply = [number, Array<any>];
	/*战队申请改变列表返回*/
	const enum ClanApplyListChangeReplyFields {
		list = 0
	}
	type ClanApplyListChangeReply = [Array<ClanApplyListMemberAttr>];
	/*战队申请列表返回成员属性*/
	const enum ClanApplyListMemberAttrFields {
		agentId = 0,
		name = 1,
		level = 2,
		fight = 3,
		time = 4,
		vip = 5,
		vipf = 6,
		occ = 7,
		headImg = 8,
	}
	type ClanApplyListMemberAttr = [number, string, number, number, string, number, number, number, number];


	/*战队成员基本属性类型*/
	const enum ClanActorBaseAttrFields {
		name = 0, 			/*名字*/
		agentId = 1, 		/*id*/
		level = 2, 			/*等级*/
		occ = 3, 			/*职业*/
		fight = 4, 			/*战力*/
		pos = 5, 			/*职位 0=普通 1=队长*/
		loginTime = 6, 		/*上次登陆时间*/
		contribution = 7, 	/*贡献*/
		state = 8, 			/*是否在线 true在线*/
		vip = 9, 			/*vip等级*/
		vipf = 10,			/*vipf*/
		headImg = 11,		/*头像*/
	}
	type ClanActorBaseAttr = [string, number, number, number, number, number, number, number, boolean, number, number, number];

	//战队等级奖励领取状态
	const enum MyClanGradeAwardGetStatusFields {
		list = 0 /*领取状态 1可领取 2已领取 3未激活*/
	}
	type MyClanGradeAwardGetStatus = [number]

	//战队建设
	const enum ClanBuildListFiedls {
		list = 0,
	}
	type ClanBuildList = [Array<Items>]

	//战队币和光环刷新返回
	const enum ClanBuildAndHalRefreshFiedls {
		refreshTime = 0,
		clanCoin = 1,//战队币
	}
	type ClanBuildAndHalRefresh = [number, number]

	type ClanGradeLevelList = [Array<number>]

	//战队返回参数类型
	const enum GetMyClanInfoReplyFields {
		uuid = 0, 				/*战队id*/
		name = 1, 				/*战队名字*/
		flagIndex = 2, 			/*战队图索引*/
		pos = 3, 				/*职位 0=普通 1=队长*/
		member = 4, 			/*战队成员信息*/
		sumFight = 5, 			/*战队总战力*/
		contribution = 6, 		/*玩家的贡献（战队币）*/
		rank = 7, 				/*战队排名*/
		auditStatus = 8, 		/*是否需要审批*/
		level = 9, 				/*战队等级*/
		exp = 10, 				/*战队经验*/
		limitFight = 11, 		/*战队加入最低战力*/
		fightTeamSkillHalo = 12,        /*战队光环技能id*/
	}
	type GetMyClanInfoReply = [string, string, number, number, Array<ClanActorBaseAttr>, string, number, number,
		boolean, number, number, string, number];

	/*战队列表中战队基本信息*/
	const enum ClanListItemInfoFields {
		uuid = 0,				/*战队id*/
		name = 1,				/*战队名字*/
		leaderName = 2,			/*队长名字*/
		level = 3,				/*战队等级*/
		memberNum = 4,			/*成员数量*/
		fightLimit = 5,			/*加入最低战力*/
		flagIndex = 6,			/*图腾下标*/
	}
	type ClanListItemInfo = [string, string, string, number, number, number, string];
	/*战队列表返回*/
	const enum AllClanListReplyFields {
		list = 0
	}
	type AllClanListReply = [Array<ClanListItemInfo>];
	type AllClanListArr = Array<ClanListItemInfo>;
	/*---------------战队 end----------------*/

	//玄火成就列表返回数据
	const enum XuanHuoAchievementListReplyFields {
		type = 0,                        /*各个成就 点数 [type,点数]*/
		list = 1,                        /*已领取的奖励 [任务ID,领取状态]*/
	}
	type XuanHuoAchievementListReply = [Array<Array<number>>, Array<Array<number>>]

	/*领取玄火成就奖励返回*/
	const enum XuanHuoAchievementAwardReplyFields {
		result = 0,
	}
	type XuanHuoAchievementAwardReply = [number];

	//逐鹿成就状态返回数据
	const enum ZhuLuAchievementReplyFields {
		type = 0,				/*任务类型*/
		taskId = 1,				/*任务id*/
		status = 2,				/*任务领取状态*/
		current = 3,			/*任务当前进度*/
	}
	type ZhuLuAchievementReply = [number, number, number, number]

	/*玄火副本内任务数据返回*/
	const enum XuanHuoGetAwardReplyFields {
		xuanhuoNum = 0,                        /* 玄火数 */
		list = 1,                                /*已领取的奖励 从0开始*/
	}
	type XuanHuoGetAwardReply = [number, Array<number>];

	//玄火成就显示
	const enum xuanhuoAchievementShowFields {
		taskId = 0,                                	   	   /*任务ID*/
		desc = 1,                                          /*任务描述*/
		current = 2,                                	   /*任务当前进度*/
		condition = 3,                                	   /*任务达成条件*/
		status = 4,                                		   /*任务领取状态*/
		Items = 5,                                		   /*任务达成的奖励*/
	}
	type xuanhuoAchievementShow = [number, string, number, number, number, Items];

	//玄火获取任务显示
	const enum xuanhuoGetAwardShowFields {
		taskId = 0,                                	   	   /*任务ID*/
		desc = 1,                                          /*任务描述*/
		current = 2,                                	   /*任务当前进度*/
		condition = 3,                                	   /*任务达成条件*/
		status = 4,                                		   /*任务领取状态*/
		Items = 5,                                		   /*任务达成的奖励列表*/
	}
	type xuanhuoGetAwardShow = [number, string, number, number, number, Array<Items>];

	//逐鹿成就显示
	const enum zhuluAchievementShowFields {
		taskId = 0,                                	   	   /*任务ID*/
		status = 1,                                		   /*任务领取状态*/
		current = 2,                                	   /*任务当前进度*/
	}
	type zhuluAchievementShow = [number, number, number];

	//逐鹿首领战伤害奖励显示
	const enum zhuluHeaderDamageAwardShowFields {
		taskId = 0,                                	   	   /*任务ID*/
		desc = 1,                                          /*任务描述*/
		current = 2,                                	   /*任务当前进度*/
		condition = 3,                                	   /*任务达成条件*/
		status = 4,                                		   /*任务领取状态*/
		Items = 5,                                		   /*任务达成的奖励列表*/
	}
	type zhuluHeaderDamageAwardShow = [number, string, number, number, number, Array<Items>];

	/*获取成就任务返回*/
	const enum GetAchievementInfoReplyFields {
		taskList = 0,			/*任务列表*/
	}
	type GetAchievementInfoReply = [Array<AchievementNode>];

	/*成就任务*/
	const enum AchievementNodeFields {
		id = 0,			/*id*/
		state = 1,			/*状态 0未达成 1可领取 2已领取*/
		progress = 2,			/*进度*/
	}
	type AchievementNode = [number, number, number];
	/*获取首领战副本信息返回*/
	const enum GetTeamChiefCopyInfoReplyFields {
		time = 0,			/*剩余时间*/
	}
	type GetTeamChiefCopyInfoReply = [number];
	/*获取争夺战时间返回*/
	const enum GetTeamBattleCopyTimeReplyFields {
		time = 0,			/*剩余时间*/
	}
	type GetTeamBattleCopyTimeReply = [number];
	/*获取战队逐鹿准备副本信息返回*/
	const enum GetTeamPrepareCopyInfoReplyFields {
		time = 0,			/*剩余时间*/
	}
	type GetTeamPrepareCopyInfoReply = [number];
	/*争夺战副本信息*/
	const enum teamBattleCopyInfoFields {
		copyStatus = 0,			/* 副本状态 0 准备 1进行 2休息 */
		open = 1,				/* 开启时间 */
		time = 2,				/* 距下阶段时间 0准备 1战斗 2休息*/
		node = 3,
	}
	type teamBattleCopyInfo = [number, number, [number, number, number], Array<teamBattleCopyNodeInfo>];

	/*争夺战副本 战斗节点信息*/
	const enum teamBattleCopyNodeInfoFields {
		node = 0,			/* 战斗节点队伍*/
		victory = 1,		/* 胜利者 */
	}
	type teamBattleCopyNodeInfo = [Array<FightTeamInfo>, Uuid];

	const enum FightTeamInfoFields {
		uuid = 0,			/*战队id*/
		name = 1,			/*战队名字*/
		leaderName = 2,			/*战队盟主名字*/
		level = 3,			/*战队等级*/
		memberNum = 4,			/*成员数量*/
		fight = 5,			/*限制战力*/
		flagIndex = 6,			/*旗帜下标*/
	}
	type FightTeamInfo = [string, string, string, number, number, number, number];

	/* 获取争夺战副本信息返回 */
	const enum GetTeamBattleCopyInfoReplyFields {
		status = 0,			/* -1 未开启 0 二七进9(半决赛) 1 九进3(决赛) 2 三进1(巅峰赛) 3 结算 */
		copyStatus = 1,		/* 副本状态 */
		copy = 2,			/* 阶段战斗信息 */
	}
	type GetTeamBattleCopyInfoReply = [number, number, Array<teamBattleCopyInfo>];

	/*获取数据*/
	const enum GetContinuepayInfoFields {
	}
	type GetContinuepayInfo = null;

	/*获取数据*/
	const enum GetCeremonyContinuepayInfoFields {
	}
	type GetCeremonyContinuepayInfo = null;

	/*获取数据*/
	const enum GetDropCarnivalInfoFields {
	}
	type GetDropCarnivalInfo = null;

	/*领取奖励*/
	const enum GetContinuepayRewardFields {
		grade = 0,			/*第几档*/
		day = 1,			/*第几天*/
	}
	type GetContinuepayReward = [number, number];

	/*领取奖励*/
	const enum GetCeremonyContinuepayRewardFields {
		grade = 0,			/*第几档*/
		day = 1,			/*第几天*/
	}
	type GetCeremonyContinuepayReward = [number, number];

	/*获取数据*/
	const enum GetZeroBuyInfoFields {
	}
	type GetZeroBuyInfo = null;

	/*领取奖励*/
	const enum GetZeroBuyRewardFields {
		grade = 0,			/*第几档*/
	}
	type GetZeroBuyReward = [number];

	/*购买*/
	const enum GetZeroBuyBuyFields {
		grade = 0,			/*第几档*/
	}
	type GetZeroBuyBuy = [number];

	/*获取数据*/
	const enum GetOneBuyInfoFields {
	}
	type GetOneBuyInfo = null;

	/*领取奖励*/
	const enum GetOneBuyRewardFields {
		grade = 0,			/*第几档*/
	}
	type GetOneBuyReward = [number];

	/*获取数据*/
	const enum GetConsumeRewardInfoFields {
	}
	type GetConsumeRewardInfo = null;

	/*领取奖励*/
	const enum GetConsumeRewardRewardFields {
		id = 0,			/*第几档*/
	}
	type GetConsumeRewardReward = [number];

	/*获取数据*/
	const enum GetConsumeReward2InfoFields {
	}
	type GetConsumeReward2Info = null;

	/*领取奖励*/
	const enum GetConsumeReward2RewardFields {
		id = 0,			/*id*/
	}
	type GetConsumeReward2Reward = [number];

	/*获取数据*/
	const enum GetInvestRewardInfoFields {
	}
	type GetInvestRewardInfo = null;

	/*投资*/
	const enum BuyInvestRewardFields {
		type = 0,			/*类型(0登录 1天关 2等级)*/
	}
	type BuyInvestReward = [number];

	/*领取奖励*/
	const enum GetInvestRewardRewardFields {
		taskId = 0,			/*任务id*/
	}
	type GetInvestRewardReward = [number];

	/*获取数据*/
	const enum GetSprintRankTaskInfoFields {
	}
	type GetSprintRankTaskInfo = null;

	/*领取奖励*/
	const enum GetSprintRankTaskRewardFields {
	}
	type GetSprintRankTaskReward = null;

	/*获取数据*/
	const enum GetPayRewardInfoFields {
	}
	type GetPayRewardInfo = null;

	/*转盘抽奖*/
	const enum PayRewardRunFields {
		flag = 0,			/*抽奖标记(0抽一次 1抽10次)*/
	}
	type PayRewardRun = [number];

	/*获取抽奖记录*/
	const enum GetPayRewardNotesFields {
	}
	type GetPayRewardNotes = null;

	/*获取财富值奖励*/
	const enum GetPayRewardRewardFields {
	}
	type GetPayRewardReward = null;

	/*获取数据*/
	const enum GetDuobaoInfoFields {
	}
	type GetDuobaoInfo = null;

	/*转盘抽奖*/
	const enum DuobaoRunFields {
		flag = 0,			/*抽奖标记(0抽一次 1抽10次)*/
	}
	type DuobaoRun = [number];

	/*获取抽奖记录*/
	const enum GetDuobaoNotesFields {
	}
	type GetDuobaoNotes = null;

	/*获取财富值奖励*/
	const enum GetDuobaoRewardFields {
	}
	type GetDuobaoReward = null;

	/*获取数据*/
	const enum GetJzduobaoInfoFields {
	}
	type GetJzduobaoInfo = null;

	/*转盘抽奖*/
	const enum JzduobaoRunFields {
		flag = 0,			/*抽奖标记(0抽一次 1抽10次)*/
	}
	type JzduobaoRun = [number];

	/*获取抽奖记录*/
	const enum GetJzduobaoNotesFields {
	}
	type GetJzduobaoNotes = null;

	/*获取财富值奖励*/
	const enum GetJzduobaoRewardFields {
	}
	type GetJzduobaoReward = null;

	/*获取数据*/
	const enum GetGushenInfoFields {
	}
	type GetGushenInfo = null;

	/*获取任务奖励*/
	const enum GetGushenTaskRewardFields {
		taskId = 0,			/*任务id*/
	}
	type GetGushenTaskReward = [number];

	/*获取激活奖励*/
	const enum GetGushenActiveRewardFields {
		type = 0,			/*活动类型*/
	}
	type GetGushenActiveReward = [number];

	/*获取数据*/
	const enum GetKuanghuanInfoFields {
	}
	type GetKuanghuanInfo = null;

	/*获取奖励*/
	const enum GetKuanghuanRewardFields {
		taskId = 0,			/*任务id*/
	}
	type GetKuanghuanReward = [number];

	/*获取数据*/
	const enum GetDiscountGiftInfoFields {
	}
	type GetDiscountGiftInfo = null;

	/*购买*/
	const enum DiscountGiftBuyFields {
	}
	type DiscountGiftBuy = null;

	/*获取数据*/
	const enum GetHalfMonthInfoFields {
	}
	type GetHalfMonthInfo = null;

	/*领取奖励*/
	const enum GetHalfMonthRewardFields {
		day = 0,			/*天数*/
	}
	type GetHalfMonthReward = [number];

	/*获取数据*/
	const enum GetEverydayRebateInfoFields {
	}
	type GetEverydayRebateInfo = null;

	/*领取奖励*/
	const enum GetEverydayRebateRewardFields {
		day = 0,			/*天数*/
	}
	type GetEverydayRebateReward = [number];

	/*获取数据*/
	const enum GetLoginRewardInfoFields {
	}
	type GetLoginRewardInfo = null;

	/*领取奖励*/
	const enum GetLoginRewardRewardFields {
		id = 0,			/*id*/
	}
	type GetLoginRewardReward = [number];

	/*获取数据*/
	const enum GetCumulatepayFSInfoFields {
	}
	type GetCumulatepayFSInfo = null;

	/*领取奖励*/
	const enum GetCumulatepayFSRewardFields {
		id = 0,			/*id*/
	}
	type GetCumulatepayFSReward = [number];

	/*获取数据*/
	const enum GetPaySingleFSInfoFields {
	}
	type GetPaySingleFSInfo = null;

	/*领取奖励*/
	const enum GetPaySingleFSRewardFields {
		id = 0,			/*id*/
	}
	type GetPaySingleFSReward = [number];

	/*获取数据*/
	const enum GetConsumeRewardFSInfoFields {
	}
	type GetConsumeRewardFSInfo = null;

	/*领取奖励*/
	const enum GetConsumeRewardFSRewardFields {
		id = 0,			/*id*/
	}
	type GetConsumeRewardFSReward = [number];

	/*获取数据*/
	const enum GetRushBuyFSInfoFields {
	}
	type GetRushBuyFSInfo = null;

	/*购买*/
	const enum BuyRushBuyFSFields {
	}
	type BuyRushBuyFS = null;

	/*获取数据*/
	const enum GetDiscountGiftFSInfoFields {
	}
	type GetDiscountGiftFSInfo = null;

	/*购买*/
	const enum BuyDiscountGiftFSFields {
		id = 0,			/*id*/
	}
	type BuyDiscountGiftFS = [number];

	/*获取黑名单*/
	const enum GetBlackListFields {
	}
	type GetBlackList = null;

	/*黑名单操作*/
	const enum BlackListOptFields {
		info = 0,			/*玩家信息*/
		opt = 1,			/*操作 ：1加入黑名单，2移除黑名单*/
	}
	type BlackListOpt = [BlackInfo, number];

	/*获取聊天信息*/
	const enum GetChatInfoFields {
	}
	type GetChatInfo = null;

	/*获取九天副本*/
	const enum GetNineCopyFields {
	}
	type GetNineCopy = null;
	/*获取九天副本*/
	const enum GetXuanhuoCopyFields {
	}
	type GetXuanhuoCopy = null;

	type GetXuanhuoCopyData = null;
	/*玄火争夺全员鼓舞*/
	const enum XuanhuoAllInspireFields {
	}
	type XuanhuoAllInspire = null;
	/*玄火副本内获取玄火奖励*/
	const enum XuanhuoGetTaskAwardFields {
	}
	type XuanhuoGetTaskAward = null;
	/*领取玄火副本任务奖励*/
	const enum GetXuanhuoTaskAwardFields {
		taskId = 0,
	}
	type GetXuanhuoTaskAward = [number];
	/*领取玄火成就奖励*/
	const enum GetXuanhuoAchiecemtnAwardFields {
		id = 0,					/*id*/
	}
	type GetXuanhuoAchiecemtnAward = [number];

	/*搜索对象*/
	const enum SpecifySearchObjFields {
		objid = 0,			/*1:玩家id*/
	}
	type SpecifySearchObj = [number];

	/*领取玄火成就列表*/
	const enum GetXuanhuoAchiecemtnAwardListFields {
	}
	type GetXuanhuoAchiecemtnAwardList = null;
	/*领取玄火副本内任务奖励返回*/
	const enum GetXuanhuoTaskAwardReplyFields {
		result = 0,                        /* 结果 code */
	}
	type GetXuanhuoTaskAwardReply = [number];

	//圣装 - 至尊装备 

	/*获取至尊*/
	const enum GetZhizhunInfoFields {
	}
	type GetZhizhunInfo = null;

	/*喂养至尊*/
	const enum FeedZhizhunFields {
		id = 0,
	}
	type FeedZhizhun = [number];

	/*至尊激活/升级技能*/
	const enum AddZhizhunSkillLevelFields {
		id = 0,					/*id*/
		skillId = 1,			/*技能id*/
	}
	type AddZhizhunSkillLevel = [number, number];
	/*圣装礼包信息*/
	const enum GetHolyRechargeInfoFields {
	}
	type GetHolyRechargeInfo = null;

	/*现金装备出售*/
	const enum SellCashEquipFields {
		iteamId = 1,                /*装备id*/
		count = 2,                        /*数量*/
	}
	type SellCashEquip = [number, number];


	/*现金装备信息*/
	const enum CashEquipInfoFields {

	}
	type CashEquipInfo = [];

	/*获取超级vip状态数据*/
	const enum SuperVipStatusRequestFields {
	}
	type SuperVipStatusRequest = null;
	/*定制称号*/
	const enum CustomDesignationRequestFields {
	}
	type CustomDesignationRequest = null;

	/*设置头像*/
	const enum SetHeadImgFields {
		headImg = 0,			/*头像id*/
	}
	type SetHeadImg = [number];

	/*获取已拥有头像列表*/
	const enum GetHeadImgListFields {

	}
	type GetHeadImgList = null;

	/*激活或升级头像*/
	const enum ActiveHeadImgFields {
		headImgId = 0,		/*头像id*/
		//type = 1,			/*1：激活 2：升级*/
	}
	type ActiveHeadImg = [number];


	/*九霄令*/
	const enum GetJiuXiaoLingAwardInfoFields { }
	type GetJiuXiaoLingAwardInfo = null;

	const enum GetJiuXiaoLingTaskInfoFields {
		type = 0, 			/* 获取数据类型 1:阶段任务、2:赛季任务*/
	}
	type GetJiuXiaoLingTaskInfo = [number];

	const enum GetJiuXiaoLingLevelAwardFields { }
	type GetJiuXiaoLingLevelAward = null;

	const enum GetJiuXiaoLingTaskExpAwardFields {
		id = 0,				/*任务id*/
		type = 1,	 		/*任务类型 1: 每日任务、2: 赛季任务*/
	}
	type GetJiuXiaoLingTaskExpAward = [number, number];

	const enum BuyJiuXiaoLingLevelFields {
		leve = 0,			/*购买等级*/
	}
	type BuyJiuXiaoLingLevel = [number];

	const enum GetJiuXiaoLingExtralExpPackageFields { }
	type GetJiuXiaoLingExtralExpPackage = null;

	const enum CeremonyGeocachingInfoFields { }
	type CeremonyGeocachingInfo = null;

	const enum CeremonyGeocachingGetAwardFields { }
	type CeremonyGeocachingGetAward = null;

	const enum CeremonyGeocachingGetRankFields { }
	type CeremonyGeocachingGetRank = null;

	const enum LitmitOneDiscountDateTimeRequestFields { }
	type LitmitOneDiscountDateTimeRequest = null;

	const enum CelebrationHuntRunFields {
		grade = 1,			/*档次 0 1次 1 10次 2 50次*/
	}
	type CelebrationHuntRun = [number];

	/*庆典探索返回探索排名*/
	const enum CelebrationHuntRankInfoFields {
		rank = 0,                        /*排名*/
		name = 1,                        /*角色名*/
		param = 2,                       /*排行参数*/
		objId = 3,                       /*角色id*/
		grade = 4,                       /*排名档次*/
		pgId = 5,                        /*pgId*/
	}
	type CelebrationHuntRankInfo = [number, string, number, number, number, number];
	const enum CelebrationHuntRankInfoReplyFields {
		type = 0,                        /*类型: 0:个人*/
		nodeList = 1,            		 /*排名列表*/
	}
	type CelebrationHuntRankInfoReply = [number, Array<CelebrationHuntRankInfo>];

	/*限时一折庆典商城 返回*/
	const enum CelebrationShopInfoReplyFields {
		endTm = 0,/*结束时间*/
	}
	type CelebrationShopInfoReply = [number];

	/*九霄令 等级奖励*/
	const enum JiuxiaoOrderGradeNodeFields {
		level = 0,				/*等级*/
		stateA = 1,				/*九霄令状态 0未达成 1可领取 2已领取*/
		stateGA = 2,			/*九霄金令状态 0未达成 1可领取 2已领取*/
	}
	type JiuxiaoOrderGradeNode = [number, number, number];

	/*返回数据 结果(奖励、基础信息)*/
	const enum JiuxiaoOrderInfoReplyFields {
		season = 0,				/*赛季数 */
		level = 1,			    /*等级*/
		exp = 2,				/*经验*/
		isBuy = 3,				/*是否购买 0-未买 1-购买*/
		actionDate = 4,			/*活动日期[开始时间戳,结束时间戳]*/
		finalAwards = 5,		/*最终大奖 获取状态 0未达成 1可领取 2已领取*/
		awardsList = 6,			/*奖励列表*/
	}
	type JiuxiaoOrderInfoReply = [number, number, number, number, Array<number>, number, Array<JiuxiaoOrderGradeNode>];

	/*九霄令 任务*/
	const enum JiuxiaoOrderTaskNodeFields {
		id = 0,					/*id*/
		state = 1,				/*状态 0未达成 1可领取 2已领取*/
		progress = 2,   		/*当前任务进度*/
		fulfilNum = 3,  		/*该任务完成次数*/
		totalNum = 4,  			/*该任务总次数  	 -前端新加*/
		totalProgress = 5,   	/*当前任务进度总进度  -前端新加*/
		taskType = 6,   		/*任务类型 0-阶段任务 1-赛季任务 -前端新加*/
		name = 7,   			/*任务名字 -前端新加*/
		desc = 8,   			/*任务描述 -前端新加*/
		exp = 9,   				/*任务经验 -前端新加*/
		skipId = 10,   			/*任务跳转功能id -前端新加*/
	}
	type JiuxiaoOrderTaskNode = [number, number, number, number, number, number, number, string, string, number, number];

	/*九霄令 经验包*/
	const enum JiuxiaoOrderExpWrapNodeFields {
		exp = 0,                /*经验 - 没啥屌用*/
		state = 1,              /*状态 0:未达成、1:可领取、2:已领取*/
		expWrapTime = 2,        /*经验包刷新时间戳(年月日)（零点）(7天)*/
	}
	type JiuxiaoOrderExpWrapNode = [number, number, number];

	/*返回数据 结果(每日任务)*/
	const enum JiuxiaoOrderDayTaskReplyFields {
		level = 0,			    /*等级*/
		exp = 1,				/*经验*/
		stageExp = 2,			/*阶段经验*/
		totalexp = 3,			/*总经验*/
		endTime = 4,			/*阶段结束时间*/
		expWrap = 5,			/*阶段经验包*/
		taskList = 6,			/*任务列表*/
	}
	type JiuxiaoOrderDayTaskReply = [number, number, number, number, number, JiuxiaoOrderExpWrapNode, Array<JiuxiaoOrderTaskNode>];

	/*返回数据 结果(赛季任务)*/
	const enum JiuxiaoOrderSeasonTaskReplyFields {
		level = 0,			    /*等级*/
		exp = 1,				/*经验*/
		taskNum = 2,			/*任务数*/
		totalNum = 3,			/*总任务数*/
		endTime = 4,			/*阶段结束时间*/
		taskList = 5,			/*任务列表*/
	}
	type JiuxiaoOrderSeasonTaskReply = [number, number, number, number, number, Array<JiuxiaoOrderTaskNode>];

	const enum JiuxiaoOrderGetRewardReplyFields {
		result = 0,				/*领取(奖励)结果*/
		list = 1,				/*领取(奖励)结果列表*/
	}
	type JiuxiaoOrderGetRewardReply = [number, Array<Items>];

	/*领取任务经验 返回*/
	const enum JiuxiaoOrderGettTaskRewardReplyFields {
		result = 0,				/*领取结果*/
	}
	type JiuxiaoOrderGettTaskRewardReply = [number];

	/*领取额外经验 返回*/
	const enum JiuxiaoOrderTakeExpWrapReplyFields {
		result = 0,				/*领取结果*/
	}
	type JiuxiaoOrderTakeExpWrapReply = [number];

	/*购买等级 返回*/
	const enum JiuxiaoOrderBuyLevelReplyFields {
		result = 0,				/*领取结果*/
	}
	type JiuxiaoOrderBuyLevelReply = [number];

	/*主动返回数据 单个任务*/
	const enum JiuxiaoOrderOneTaskReplyFields {
		type = 0,			    /*任务类型 1:每日、2:赛季*/
		id = 1,					/*id*/
		state = 2,				/*状态 0未达成 1可领取 2已领取*/
		progress = 3,   		/*进度*/
		fulfilNum = 4,  		/*完成次数*/
	}
	type JiuxiaoOrderOneTaskReply = [number, number, number, number, number];

	// 抽奖记录
	const enum XunbaoNote2Fields {
		itemId = 0,/*物品id*/
		grade = 1,/*物品等级*/
	}
	type XunbaoNote2 = [number, number];

	//积分奖励
	const enum CelebrationHuntScoreRewardFields {
		id = 0,						/*id*/
		state = 1,					/*状态 0-未领取 1-可领取 2-已领取*/
	}
	type CelebrationHuntScoreReward = [number, number];

	//积分奖励展示列表
	const enum CelebrationHuntScoreRewardShowFields {
		id = 0,						/*id*/
		desc = 1,					/*描述*/
		Items = 2,					/*达成奖励*/
	}
	type CelebrationHuntScoreRewardShow = [number, string, Items];


	const enum CelebrationHuntInfoReplyFields {
		score = 0,              /*积分*/
		endTm = 1,              /*结束时间*/
		rewardList = 2,         /*积分奖励列表*/
		noteList = 3,           /*玩家抽奖记录*/
	}
	type CelebrationHuntInfoReply = [number, number, Array<CelebrationHuntScoreReward>, Array<XunbaoNote2>];

	const enum CelebrationHuntRunReplyFields {
		result = 0,		/*抽奖结果*/
		list = 1,		/*列表 id*/
	}
	type CelebrationHuntRunReply = [number, Array<Array<number>>];

	const enum CelebrationHuntGetScoreRewardReplyFields {
		result = 0,	/*领取结果*/
	}
	type CelebrationHuntGetScoreRewardReply = [number];

	/*获取仙府-家园信息*/
	const enum GetXianFuInfoFields {
	}
	type GetXianFuInfo = null;

	/*获取建筑产出信息*/
	const enum GetBuildingInfoFields {
		id = 0,			/*建筑id*/
	}
	type GetBuildingInfo = [number];

	/*升级仙府-家园*/
	const enum UpgradeXianFuFields {
	}
	type UpgradeXianFu = null;

	/*领取建筑产出奖励*/
	const enum GetBuildProduceAwardFields {
		id = 0,			/*建筑id*/
	}
	type GetBuildProduceAward = [number];

	/*制作道具*/
	const enum MakeItemFields {
		id = 0,			/*建筑id*/
		indexList = 1,			/*制作道具序号及份数*/
	}
	type MakeItem = [number, Array<Pair>];

	/*获取灵兽游历信息*/
	const enum GetSpiritAnimalTravelFields {
		id = 0,			/*灵兽id*/
	}
	type GetSpiritAnimalTravel = [number];

	/*出发游历*/
	const enum TravelFields {
		id = 0,			/*灵兽id*/
		rangeId = 1,			/*范围id*/
		extraId = 2,			/*额外罗盘id*/
		isAmuletId = 3,			/*是否使用护身符*/
	}
	type Travel = [number, number, number, boolean];

	/*立即完成游历*/
	const enum TravelFinishFields {
		id = 0,			/*灵兽id*/
	}
	type TravelFinish = [number];

	/*领取游历奖励*/
	const enum GetTravelAwardFields {
		id = 0,			/*灵兽id*/
	}
	type GetTravelAward = [number];

	/*获取图鉴*/
	const enum GetIllustratedHandbookFields {
	}
	type GetIllustratedHandbook = null;

	/*提升或激活图鉴*/
	const enum PromoteIllustratedHandbookFields {
		id = 0,			/*图鉴id*/
	}
	type PromoteIllustratedHandbook = [number];

	/*获取仙府-家园神秘商品*/
	const enum GetXianFuMallFields {
	}
	type GetXianFuMall = null;

	/*购买游历所需道具*/
	const enum BuyTravelItemFields {
		travelId = 0,			/*游历id*/
		buyType = 1,			/*购买类型 0罗盘，1护身符*/
	}
	type BuyTravelItem = [number, number];

	/*获取仙府-家园任务列表*/
	const enum GetXianFuTaskListFields {
	}
	type GetXianFuTaskList = null;

	/*领取任务奖励*/
	const enum GetXianFuTaskAwardFields {
		taskId = 0,			/*任务id*/
	}
	type GetXianFuTaskAward = [number];

	/*领取活跃度奖励*/
	const enum GetXianFuActivaAwardFields {
		index = 0,			/*领取哪个档位 0开始*/
	}
	type GetXianFuActivaAward = [number];

	/*获取仙府-家园风水信息*/
	const enum GetXianFuFengShuiInfoFields {
	}
	type GetXianFuFengShuiInfo = null;

	/*升级或激活风水物件*/
	const enum UpgradeFengShuiDecorateFields {
		id = 0,			/*要激活或升级的物件id*/
	}
	type UpgradeFengShuiDecorate = [number];

	/*获取仙府-家园技能*/
	const enum GetXianFuSkillListFields {
	}
	type GetXianFuSkillList = null;

	/*提升或激活技能*/
	const enum PromoteXianFuSkillFields {
		skillId = 0,
	}
	type PromoteXianFuSkill = [number];

	/*立即完成炼制*/
	const enum MakeItemFinishFields {
		id = 0,			/*建筑id*/
	}
	type MakeItemFinish = [number];

	/*获取仙府-家园商城信息*/
	const enum GetXianFuMall2InfoFields {
	}
	type GetXianFuMall2Info = null;

	/*购买仙府-家园商城商品*/
	const enum BuyXianFuMall2GoodsFields {
		id = 0,			/*商品id*/
	}
	type BuyXianFuMall2Goods = [number];

	/*刷新仙府-家园商城*/
	const enum F5XianFuMall2Fields {
	}
	type F5XianFuMall2 = null;

	/* 获取天梯 (积分、功勋、剩余次数、奖励状态、参与次数)*/
	const enum GetTiantiFields {
	}
	type GetTianti = null;

	/*领取参与奖励*/
	const enum GetTiantiJoinAwardFields {
		index = 0,			/*档次*/
	}
	type GetTiantiJoinAward = [number];

	/*领取功勋奖励*/
	const enum GetTiantiFeatAwardFields {
		index = 0,			/*档次*/
	}
	type GetTiantiFeatAward = [number];

	/*获取天降财宝信息*/
	const enum GetRichesInfoFields {
	}
	type GetRichesInfo = null;

	/*获取云梦秘境*/
	const enum GetCloudlandFields {
	}
	type GetCloudland = null;

	/*获取奇遇信息*/
	const enum GetAdventureInfoFields {
	}
	type GetAdventureInfo = null;

	/*购买探险次数*/
	const enum BuyYumliFields {
	}
	type BuyYumli = null;

	/*挑战事件（前往击杀，接受任务，猜拳，解封印）*/
	const enum ChallengeFields {
		key = 0,			/*事件key*/
	}
	type Challenge = [number];

	/*领取奖励 宝箱和任务使用*/
	const enum GetAdventureAwardFields {
		key = 0,			/*事件key*/
	}
	type GetAdventureAward = [number];

	/*勾选兑换提醒列表*/
	const enum setAdventureHintFields {
		hintList = 0,			/*勾选id列表*/
	}
	type setAdventureHint = [Array<number>];

	/*获取勾选兑换列表*/
	const enum GetAdventureHintFields {
	}
	type GetAdventureHint = null;

	/*奇遇兑换*/
	const enum AdventureExchangeFields {
		id = 0,			/*兑换id*/
	}
	type AdventureExchange = [number];

	/*获取昆仑瑶池信息*/
	const enum GetSwimmingInfoFields {
	}
	type GetSwimmingInfo = null;

	/*获取肥皂信息*/
	const enum GetSoapInfoFields {
	}
	type GetSoapInfo = null;

	/*抓肥皂*/
	const enum GrabSoapFields {
		time = 0,			/*抓取的时候时间戳*/
	}
	type GrabSoap = [number];

	/*获取仙女信息*/
	const enum GetFairyInfoFields {
	}
	type GetFairyInfo = null;

	/*获取仙女护送日志*/
	const enum GetFairyLogFields {
	}
	type GetFairyLog = null;

	/*护送仙女*/
	const enum EscortFairyFields {
	}
	type EscortFairy = null;

	/*拦截仙女*/
	const enum InterceptFairyFields {
		agentId = 0,			/*拦截的玩家id*/
	}
	type InterceptFairy = [number];

	/*刷新仙女*/
	const enum RefreshFairyFields {
	}
	type RefreshFairy = null;

	/*选择最好的那个仙女*/
	const enum SelectFairyFields {
	}
	type SelectFairy = null;

	/*领取仙女护送奖励*/
	const enum GetFairyAwardFields {
	}
	type GetFairyAward = null;

	/*获取优先提示(用于失败界面)*/
	const enum GetTipsPriorInfoFields {
	}
	type GetTipsPriorInfo = null;

	/*获取称号*/
	const enum GetDesignationFields {
	}
	type GetDesignation = null;

	/*激活称号*/
	const enum ActiveDesignationFields {
		id = 0,
	}
	type ActiveDesignation = [number];

	/*穿戴称号*/
	const enum WearDesignationFields {
		id = 0,
	}
	type WearDesignation = [number];

	/*卸下称号*/
	const enum TakeoffDesignationFields {
		id = 0,
	}
	type TakeoffDesignation = [number];

	/*获取竞技*/
	const enum GetArenaFields {
	}
	type GetArena = null;

	/*刷新挑战对象*/
	const enum FlushArenaFields {
	}
	type FlushArena = null;

	/*重置入场CD*/
	const enum ResetEnterCDFields {
		mapId = 0,
		level = 1,
	}
	type ResetEnterCD = [number, number];

	/*获取已申请加入的仙盟列表*/
	const enum GetFactionApplyListFields {
	}
	type GetFactionApplyList = null;

	/*勾选今日邀请不再推送*/
	const enum SelectPushFields {
		isStop = 0,			/*true今日不再推送，false推送*/
	}
	type SelectPush = [boolean];

	/*获取宝箱相关信息*/
	const enum GetBoxInfoFields {
	}
	type GetBoxInfo = null;

	/*获取宝箱*/
	const enum GetBoxListFields {
	}
	type GetBoxList = null;

	/*领取宝箱奖励*/
	const enum GetBoxAwardFields {
		id = 0,			/*宝箱id*/
	}
	type GetBoxAward = [string];

	/*挖宝箱*/
	const enum OpenBoxFields {
		id = 0,			/*宝箱id*/
	}
	type OpenBox = [string];

	/*请求协助*/
	const enum AskAssistFields {
		id = 0,			/*宝箱id*/
	}
	type AskAssist = [string];

	/*刷新宝箱*/
	const enum F5BoxFields {
	}
	type F5Box = null;

	/*加速宝箱*/
	const enum AddSpeedBoxFields {
		id = 0,			/*宝箱id*/
		itemId = 1,			/*加速卡Id*/
	}
	type AddSpeedBox = [string, number];

	/*协助别人开宝箱*/
	const enum AssistOpenBoxFields {
		id = 0,			/*宝箱id*/
	}
	type AssistOpenBox = [string];

	/*获取仙盟副本信息*/
	const enum GetFactionCopyInfoFields {
	}
	type GetFactionCopyInfo = null;

	/*获取伤害奖励列表*/
	const enum GetHurtAwardListFields {
	}
	type GetHurtAwardList = null;

	/*领取伤害奖励*/
	const enum GetHurtAwardFields {
		index = 0,			/*领取哪一档，0开始*/
	}
	type GetHurtAward = [number];

	/*仙盟鼓舞*/
	const enum FactionReqInspireFields {
		type = 0,			/*0金币，1代币券*/
		auto = 1,
	}
	type FactionReqInspire = [number, boolean];


	/*获取仙盟技能*/
	const enum GetFactionSkillListFields {
	}
	type GetFactionSkillList = null;

	/*提升或激活技能*/
	const enum PromoteFactionSkillFields {
		skillId = 0,			/*技能id*/
	}
	type PromoteFactionSkill = [number];

	/*获取转盘信息*/
	const enum GetFactionTurnFields {
	}
	type GetFactionTurn = null;

	/*转转*/
	const enum FactionTurnFields {
		count = 0,			/*次数*/
	}
	type FactionTurn = [number];

	/*领取幸运值奖励*/
	const enum GetBlessAwardFields {
	}
	type GetBlessAward = null;

	/*增加仙盟副本时间*/
	const enum AddCopyTimeFields {
		itemId = 0,			/*诛仙令Id*/
		count = 1,			/*数量*/
	}
	type AddCopyTime = [number, number];

	/*获取时装信息*/
	const enum GetFashionInfoFields {
	}
	type GetFashionInfo = null;

	/*升级时装*/
	const enum FeedFashionFields {
	}
	type FeedFashion = null;

	/*激活/升级技能*/
	const enum AddFashionSkillLevelFields {
		skillId = 0,			/*技能id*/
	}
	type AddFashionSkillLevel = [number];

	/*激活/升级幻化*/
	const enum AddFashionMagicShowFields {
		magicShowId = 0,			/*幻化Id*/
	}
	type AddFashionMagicShow = [number];

	/*更换幻化外观*/
	const enum ChangeFashionMagicShowFields {
		magicShowId = 0,			/*幻化Id*/
	}
	type ChangeFashionMagicShow = [number];

	/*升级修炼*/
	const enum AddFashionRefineFields {
		type = 0,			/*修炼类型 看配置表*/
	}
	type AddFashionRefine = [number];

	/*获取天诛信息*/
	const enum GetTianZhuInfoFields {
	}
	type GetTianZhuInfo = null;

	/*升级时装*/
	const enum FeedTianZhuFields {
	}
	type FeedTianZhu = null;

	/*激活/升级技能*/
	const enum AddTianZhuSkillLevelFields {
		skillId = 0,			/*技能id*/
	}
	type AddTianZhuSkillLevel = [number];

	/*激活/升级幻化*/
	const enum AddTianZhuMagicShowFields {
		magicShowId = 0,			/*幻化Id*/
	}
	type AddTianZhuMagicShow = [number];

	/*更换幻化外观*/
	const enum ChangeTianZhuMagicShowFields {
		magicShowId = 0,			/*幻化Id*/
	}
	type ChangeTianZhuMagicShow = [number];

	/*升级修炼*/
	const enum AddTianZhuRefineFields {
		type = 0,			/*修炼类型 看配置表*/
	}
	type AddTianZhuRefine = [number];

	/*获取锻造信息*/
	const enum GetXilianFields {
	}
	type GetXilian = null;

	/*开启锻造*/
	const enum OpenXilianFields {
		part = 0,			/*部位*/
		num = 1,			/*编号 0-4*/
	}
	type OpenXilian = [number, number];

	/*装备锻造*/
	const enum EquipXilianFields {
		part = 0,			/*部位*/
		useGold = 1,			/*使用代币券*/
		type = 2,			/*0:没有消耗 1:消耗极品锻造石 2:消耗完美石锻造石*/
	}
	type EquipXilian = [number, boolean, number];

	/*锁定锻造编号槽*/
	const enum LockXilianFields {
		isLock = 0,			/*ture:锁定 false:解锁*/
		part = 1,			/*部位*/
		num = 2,			/*编号 0-4*/
	}
	type LockXilian = [boolean, number, number];

	/*锻造大师升级*/
	const enum XilianRiseAddLevelFields {
	}
	type XilianRiseAddLevel = null;

	/*获取神器信息*/
	const enum GetShenQiInfoFields {
	}
	type GetShenQiInfo = null;

	/*放入碎片*/
	const enum EquipFragmentFields {
		itemId = 0,			/*碎片id*/
	}
	type EquipFragment = [number];

	/*激活神器*/
	const enum ActivateShenQiFields {
	}
	type ActivateShenQi = null;

	/*开服礼包*/
	const enum GetOpenRewardFields {
	}
	type GetOpenReward = null;

	/*购买开服礼包*/
	const enum BuyOpenRewardFields {
		rewardId = 0,			/*礼包id*/
	}
	type BuyOpenReward = [number];

	/*获取单笔充值返魂玉*/
	const enum GetSinglePayJadeFields {
	}
	type GetSinglePayJade = null;

	/*领取单笔充值返魂玉奖励*/
	const enum GetSinglePayJadeAwardFields {
		id = 0,
	}
	type GetSinglePayJadeAward = [number];

	/*获取单笔充值返圣印*/
	const enum GetSinglePayPrintFields {
	}
	type GetSinglePayPrint = null;

	/*领取单笔充值返圣印奖励*/
	const enum GetSinglePayPrintAwardFields {
		id = 0,
	}
	type GetSinglePayPrintAward = [number];

	/*获取周末狂欢-单笔信息*/
	const enum GetWeekSinglePayFields {
	}
	type GetWeekSinglePay = null;

	/*领取周末狂欢-单笔奖励*/
	const enum GetWeekSinglePayAwardFields {
		id = 0,
	}
	type GetWeekSinglePayAward = [number];

	/*获取周末狂欢-登陆信息*/
	const enum GetWeekLoginFields {
	}
	type GetWeekLogin = null;

	/*领取周末狂欢-登陆奖励*/
	const enum GetWeekLoginAwardFields {
		id = 0,
	}
	type GetWeekLoginAward = [number];

	/*获取周末狂欢-累充信息*/
	const enum GetWeekAccumulateFields {
	}
	type GetWeekAccumulate = null;

	/*领取周末狂欢-累充奖励*/
	const enum GetWeekAccumulateAwardFields {
		id = 0,
	}
	type GetWeekAccumulateAward = [number];

	/*获取周末狂欢-消费信息*/
	const enum GetWeekConsumeFields {
	}
	type GetWeekConsume = null;

	/*领取周末狂欢-消费奖励*/
	const enum GetWeekConsumeAwardFields {
		id = 0,
	}
	type GetWeekConsumeAward = [number];

	/*获取本次活动内消费代币券数量*/
	const enum GetConsumeCountFields {
	}
	type GetConsumeCount = null;

	/*获取限时礼包信息*/
	const enum GetLimitPackInfoFields {
	}
	type GetLimitPackInfo = null;

	/*购买限时礼包*/
	const enum BuyLimitPackFields {
		level = 0,
		type = 1,			/*0:普通的,1:vip*/
	}
	type BuyLimitPack = [number, number];

	/*获取邀请礼包信息*/
	const enum GetInviteGiftFields {
	}
	type GetInviteGift = null;

	/*邀请好友*/
	const enum InviteFriendFields {
	}
	type InviteFriend = null;

	/*提取邀请礼包*/
	const enum DrawInviteGiftFields {
	}
	type DrawInviteGift = null;

	/*获取单次奖励*/
	const enum GetOnceRewardFields {
	}
	type GetOnceReward = null;

	/*提取单次奖励*/
	const enum DrawOnceRewardFields {
		id = 0,
	}
	type DrawOnceReward = [number];

	/*设置单次奖励数据*/
	const enum SetOnceRewardDataFields {
		data = 0,			/*数据*/
		id = 1,
	}
	type SetOnceRewardData = [string, number];

	/*护符状态*/
	const enum GetTalismanStateFields {
	}
	type GetTalismanState = null;

	/*护符信息*/
	const enum GetTalismanInfoFields {
	}
	type GetTalismanInfo = null;

	/*激活*/
	const enum ActiveTalismanFields {
		id = 0, 		 /*激活勋章类型*/
	}
	type ActiveTalisman = [number];

	/*招财猫状态*/
	const enum GetMoneyCatStateFields {
	}
	type GetMoneyCatState = null;

	/*招财猫信息*/
	const enum GetMoneyCatInfoFields {
	}
	type GetMoneyCatInfo = null;

	/*激活*/
	const enum ActiveMoneyCatFields {
	}
	type ActiveMoneyCat = null;

	/*获取仙玉信息*/
	const enum GetXianYuInfoFields {
	}
	type GetXianYuInfo = null;

	/*获取玉阁信息*/
	const enum GetYuGeInfoFields {
	}
	type GetYuGeInfo = null;

	/*购买玉阁商品*/
	const enum BuyYuGeGoodsFields {
		id = 0,			/*商品id*/
	}
	type BuyYuGeGoods = [number];

	/*刷新玉阁*/
	const enum F5YuGeFields {
	}
	type F5YuGe = null;

	/*获取福缘信息*/
	const enum GetXianYuFuYuInfoFields {
	}
	type GetXianYuFuYuInfo = null;

	/*领取福缘值奖励*/
	const enum GetFuYuanAwardFields {
		index = 0,			/*对应的档位*/
	}
	type GetFuYuanAward = [number];

	/*获取手套*/
	const enum GetGauntletFields {
	}
	type GetGauntlet = null;

	/*镶嵌*/
	const enum InlayGauntletFields {
		index = 0,			/*位置1,2,3,4,5,6*/
	}
	type InlayGauntlet = [number];

	/*领取*/
	const enum DrawGauntletFields {
	}
	type DrawGauntlet = null;

	/*获取拥有的仙丹列表*/
	const enum GetXianDanListFields {
	}
	type GetXianDanList = null;

	/*获取仙丹信息*/
	const enum GetXianDanInfoFields {
		type = 0,			/*子类类型*/
	}
	type GetXianDanInfo = [number];

	/*一键使用仙丹*/
	const enum OneKeyUseXianDanFields {
		type = 0,			/*子类类型*/
	}
	type OneKeyUseXianDan = [number];

	/*获取找回*/
	const enum GetRetrieveFields {
	}
	type GetRetrieve = null;
	const enum GetBossKillInfoFields {

	}
	type GetBossKillInfo = null;
	/*获取找回*/
	const enum RetrieveResFields {
		retrieve = 0,
	}
	type RetrieveRes = [Retrieve];

	/*获取信息*/
	const enum GetPreventFoolFields {
	}
	type GetPreventFool = null;

	/*回答*/
	const enum AnswerPreventFoolFields {
		answer = 0,			/*答案*/
	}
	type AnswerPreventFool = [number];

	/*获取体力*/
	const enum GetStrengthFields {
	}
	type GetStrength = null;

	/*设置自动体力*/
	const enum SetStrengthFields {
		auto = 0,			/*自动使用体力丹*/
	}
	type SetStrength = [number];

	/*领取圣殿奖励*/
	const enum PickTempRewardFields {
	}
	type PickTempReward = null;

	/*使用体力丹*/
	const enum UseStrengthItemFields {
		count = 0,			/*体力丹数量*/
	}
	type UseStrengthItem = [number];

	/*场景服认证返回*/
	const enum SV_AuthMapReplyFields {
		result = 0,
		handle = 1,			/*服务句柄*/
	}
	type SV_AuthMapReply = [number, number];

	/*Map热更新*/
	const enum SV_HotupdateToMapFields {
		text = 0,
	}
	type SV_HotupdateToMap = [Array<string>];

	/*Map重新加载配置*/
	const enum SV_ReloadCfgToMapFields {
	}
	type SV_ReloadCfgToMap = null;

	/*切换地图、当前场景切换为副本/恢复未原先场景*/
	const enum SV_ChangeCopyFields {
		mapId = 0,
	}
	type SV_ChangeCopy = [number];

	/*开启场景*/
	const enum SV_OpenCopySceneFields {
		sceneId = 0,
	}
	type SV_OpenCopyScene = [Array<OpenSceneId>];

	/*开启场景*/
	const enum SV_GetSceneStateOfMapReplyFields {
		sceneId = 0,
	}
	type SV_GetSceneStateOfMapReply = [Array<OpenSceneId>];

	/*关闭场景*/
	const enum SV_CloseCopySceneFields {
		sceneType = 0,
	}
	type SV_CloseCopyScene = [number];

	/*拦截仙女*/
	const enum SV_FairyInterceptFields {
		fairyId = 0,			/*拦截的仙女id*/
		isDouble = 1,			/*是否双倍*/
	}
	type SV_FairyIntercept = [number, boolean];

	/*更新场景层数*/
	const enum SV_UpdateSceneLevelFields {
		mapId = 0,
		level = 1,
	}
	type SV_UpdateSceneLevel = [number, number];

	/*更新名字*/
	const enum SV_UpdateMapNameFields {
		agentID = 0,			/*角色ID*/
		name = 1,			/*名字*/
	}
	type SV_UpdateMapName = [number, string];

	/*更新职业*/
	const enum SV_UpdateMapOccFields {
		agentID = 0,			/*角色ID*/
		occ = 1,			/*职业*/
	}
	type SV_UpdateMapOcc = [number, number];

	/*测试传送*/
	const enum SV_TransmitFields {
	}
	type SV_Transmit = null;

	/*退回挂机场景*/
	const enum SV_FallbackCommonSceneFields {
	}
	type SV_FallbackCommonScene = null;

	/*用户登录到场景服或者不同进程切换场景*/
	const enum SV_LoginUserToMapFields {
		data = 0,
	}
	type SV_LoginUserToMap = [LoginData];

	/*同一个进程中切换场景*/
	const enum SV_ChangeSceneFields {
		objId = 0,			/*用户唯一id*/
		sceneInfo = 1,			/*登录场景*/
	}
	type SV_ChangeScene = [number, SceneInfo];

	/*用户从Map下线*/
	const enum SV_LogoutUserOfMapFields {
		objId = 0,			/*用户唯一id*/
		force = 1,			/*是否强制下线*/
	}
	type SV_LogoutUserOfMap = [number, boolean];

	/*客户端加载完成,将玩家从缓存中放入场景中*/
	const enum SV_LoadComplateToMapFields {
		objId = 0,			/*玩家ID*/
	}
	type SV_LoadComplateToMap = [number];

	/*gate断线后将当前gate的玩家从场景登出*/
	const enum SV_LogoutCrossOfNexusFields {
		objId = 0,			/*玩家ID*/
		force = 1,			/*是否强制下线*/
	}
	type SV_LogoutCrossOfNexus = [number, boolean];

	/*机器人加入到场景*/
	const enum SV_LoginRobotToMapFields {
		robotData = 0,			/*机器人数据*/
	}
	type SV_LoginRobotToMap = [RobotLoginData];

	/*更新外观*/
	const enum SV_UpdateShowFields {
		actorShow = 0,			/*角色外观*/
	}
	type SV_UpdateShow = [ActorShow];

	/*更新角色属性*/
	const enum SV_UpdateAttrToMapFields {
		attr = 0,			/*角色属性*/
		basePerAttr = 1,			/*基础百分比属性*/
		modulePerAttr = 2,			/*模块百分比属性*/
	}
	type SV_UpdateAttrToMap = [Array<TypesAttr>, Array<TypesAttr>, Array<TypesAttr>];

	/*更新角色宠物属性*/
	const enum SV_UpdatePetAttrToMapFields {
		attr = 0,			/*角色属性*/
	}
	type SV_UpdatePetAttrToMap = [Array<TypesAttr>];

	/*更新角色技能*/
	const enum SV_UpdateSkillFields {
		skills = 0,			/*技能列表*/
		skillPer = 1,			/*技能系数*/
	}
	type SV_UpdateSkill = [Array<Skill>, number];

	/*更新角色等级*/
	const enum SV_UpdateActorLevelFields {
		level = 0,
	}
	type SV_UpdateActorLevel = [number];

	/*更新角色觉醒*/
	const enum SV_UpdateActorEraFields {
		eralevel = 0,
		eraNum = 1,
	}
	type SV_UpdateActorEra = [number, number];

	/*设置本地时间*/
	const enum SV_SetLocalTimeToMapFields {
		time = 0,			/*ms*/
	}
	type SV_SetLocalTimeToMap = [number];

	/*更新家园等级*/
	const enum SV_UpdateHomesteadLevelFields {
		level = 0,			/*等级*/
		buildList = 1,			/*开启的建筑ID*/
	}
	type SV_UpdateHomesteadLevel = [number, Array<Pair>];

	/*更新玩家坐标*/
	const enum SV_UpdateHumanPosFields {
		pos = 0,
	}
	type SV_UpdateHumanPos = [Pos];

	/*设置开服时间*/
	const enum SV_SetOpenServerTimeToMapFields {
		time = 0,			/*ms*/
	}
	type SV_SetOpenServerTimeToMap = [number];

	/*更新天降财宝采集数量*/
	const enum SV_RichesGatherCountFields {
		gatherCount = 0,
	}
	type SV_RichesGatherCount = [number];

	/*更新奇遇数据*/
	const enum SV_UpdateAdventureDataFields {
		data = 0,
	}
	type SV_UpdateAdventureData = [SV_AdventureData];

	/*更新昆仑瑶池*/
	const enum SV_UpdateSwimmingDataFields {
		swimBuffTime = 0,			/*瑶池Buff时间*/
	}
	type SV_UpdateSwimmingData = [number];

	/*请求公共BOSS信息*/
	const enum SV_GetBossFields {
	}
	type SV_GetBoss = null;

	/*请求公共场景*/
	const enum SV_GetForeverSceneFields {
	}
	type SV_GetForeverScene = null;

	/*扣除金钱*/
	const enum SV_DelMoneyReplyFields {
		result = 0,
	}
	type SV_DelMoneyReply = [number];

	/*扣除道具*/
	const enum SV_DelItemsReplyFields {
		result = 0,
	}
	type SV_DelItemsReply = [number];

	/*更新开启珍品宝箱次数*/
	const enum SV_UpdateBoxTimesFields {
		remainTimes = 0,			/*剩余次数*/
	}
	type SV_UpdateBoxTimes = [number];

	/*更新云梦秘境次数*/
	const enum SV_UpdateCloudlandTimesFields {
		remainTimes = 0,			/*剩余次数*/
	}
	type SV_UpdateCloudlandTimes = [number];

	/*仙府-家园事件触发*/
	const enum SV_XianFuEventTriggerFields {
		eventId = 0,			/*事件id*/
		fengShuiLevel = 1,			/*风水等级*/
		eventEndTime = 2,			/*事件结束时间*/
		data = 3,			/*家园数据*/
	}
	type SV_XianFuEventTrigger = [number, number, number, SV_HomesteadData];

	/*往背包添加道具返回*/
	const enum SV_AddItemsReplyFields {
		result = 0,
	}
	type SV_AddItemsReply = [number];

	/*交换排名返回*/
	const enum SV_SwapArenaRankReplyFields {
		atkObj = 0,			/*挑战者*/
		hitObj = 1,			/*被挑战者*/
		desChange = 2,			/*被挑战方排名是否有变动*/
	}
	type SV_SwapArenaRankReply = [ChallengeObj, ChallengeObj, boolean];

	/*更新竞技场排名*/
	const enum SV_UpdateArenaRankToMapFields {
		rank = 0,
		bestRank = 1,
	}
	type SV_UpdateArenaRankToMap = [number, number];

	/*请求仙盟副本信息*/
	const enum SV_AskFactionCopyInfoReplyFields {
		index = 0,
		hp = 1,
		id = 2,
		inspireTime = 3,			/*全员鼓舞时间*/
	}
	type SV_AskFactionCopyInfoReply = [number, number, string, number];

	/*更新仙盟信息*/
	const enum SV_UpdateFactionInfoToMapFields {
		data = 0,
	}
	type SV_UpdateFactionInfoToMap = [SV_FactionData];

	/*玩家移动*/
	const enum MoveFields {
		startPos = 0,
		endPos = 1,
		runState = 2,			/*冲刺状态*/
	}
	type Move = [Pos, Pos, boolean];

	/*复活*/
	const enum ReqReviveFields {
	}
	type ReqRevive = null;

	/*挂机场景请求刷新小怪*/
	const enum RequestRefeshMonsterFields {
		X = 0,			/*玩家要到的-x*/
		y = 1,			/*玩家要到的-y*/
		p_index = 1,	/*寻路点*/
	}
	type RequestRefeshMonster = [number, number, number];

	/*释放及技能*/
	const enum PlaySkillFields {
		targetId = 0,			/*目标唯一ID*/
		skillId = 1,			/*技能ID*/
	}
	type PlaySkill = [number, number];

	/*鼓舞*/
	const enum ReqInspireFields {
		type = 0,			/*1:金币鼓舞 2:代币券鼓舞*/
		auto = 1,
	}
	type ReqInspire = [number, boolean];

	/*领取参与奖励*/
	const enum GetJoinAwardFields {
	}
	type GetJoinAward = null;

	/*采集*/
	const enum GatherFields {
		gatherObjId = 0,			/*采集对象*/
		gatherType = 1,			/*0:普通 1:至尊*/
	}
	type Gather = [number, number];

	/*进入下一层*/
	const enum ReqEnterNextLevelFields {
	}
	type ReqEnterNextLevel = null;

	/*请求刷新BOSS*/
	const enum ReqFlushBossFields {
	}
	type ReqFlushBoss = null;

	/*搜索对象*/
	const enum ReqSearchObjFields {
		type = 0,			/*1:玩家 2:怪物 3:道具 4:NPC*/
	}
	type ReqSearchObj = [number];

	/*中断采集*/
	const enum GatherInterruptFields {
	}
	type GatherInterrupt = null;

	/*获取当前在副本里面得到的奖励*/
	const enum GetInCopyAwardFields {
	}
	type GetInCopyAward = null;

	/*仙盟全员鼓舞*/
	const enum FactionAllInspireFields {
	}
	type FactionAllInspire = null;

	/*获取仙盟副本内数据*/
	const enum GetFactionCopyDataFields {
	}
	type GetFactionCopyData = null;

	/*怪物击杀副本传送 */
	const enum KillMonsterCopyTransmitFields {
	}
	type KillMonsterCopyTransmit = null;

	/*怪物击杀副本传送 */
	const enum AdventureCopyTransmitFields {
	}
	type AdventureCopyTransmit = null;

	/*中心服认证返回*/
	const enum SV_AuthCenterReplyFields {
		result = 0,
		handle = 1,			/*服务句柄*/
	}
	type SV_AuthCenterReply = [number, number];

	/*设置本地时间*/
	const enum SV_SetLocalTimeToCenterFields {
		time = 0,			/*ms*/
	}
	type SV_SetLocalTimeToCenter = [number];

	/*Center热更新*/
	const enum SV_HotupdateToCenterFields {
		text = 0,
	}
	type SV_HotupdateToCenter = [Array<string>];

	/*chat重新加载配置*/
	const enum SV_ReloadCfgToCenterFields {
	}
	type SV_ReloadCfgToCenter = null;

	/*更新服务器连接*/
	const enum SV_UpdateServerConnectToCenterFields {
		type = 0,
	}
	type SV_UpdateServerConnectToCenter = [number];

	/*更新排行外观*/
	const enum SV_UpdateActorRankShowFields {
		show = 0,			/*排行榜外观*/
	}
	type SV_UpdateActorRankShow = [ActorRankShow];

	/*更新组队副本排行*/
	const enum SV_UpdateTeamCopyRankFields {
		ranks = 0,
	}
	type SV_UpdateTeamCopyRank = [Array<TeamCopyRank>];

	/*更新VIP等级*/
	const enum SV_UpdateVipLevelFields {
		level = 0,
		isFree = 1,
	}
	type SV_UpdateVipLevel = [number, boolean];

	/*更新九天排名*/
	const enum SV_UpdateNineCopyRankFields {
		ranks = 0,
	}
	type SV_UpdateNineCopyRank = [Array<NineRank>];

	/*设置本地时间*/
	const enum SV_SetOpenServerTimeToCenterFields {
		time = 0,			/*ms*/
	}
	type SV_SetOpenServerTimeToCenter = [number];

	/*重置全服活动*/
	const enum SV_ResetWelfareToCenterFields {
		type = 0,			/*活动类型*/
	}
	type SV_ResetWelfareToCenter = [number];

	/*获取赛季状态*/
	const enum SV_GetSeasonStateFromCenterFields {
	}
	type SV_GetSeasonStateFromCenter = null;

	/*获取场景状态*/
	const enum SV_GetSceneStateFromCenterFields {
	}
	type SV_GetSceneStateFromCenter = null;

	/*广播赛季时间*/
	const enum SV_BroadcastSeasonStateToCenterFields {
		state = 0,
	}
	type SV_BroadcastSeasonStateToCenter = [Array<SeasonState>];

	/*更新战力*/
	const enum SV_UpdateFightFields {
		fight = 0,
	}
	type SV_UpdateFight = [number];

	/*更新等级*/
	const enum SV_UpdateLevelFields {
		level = 0,
	}
	type SV_UpdateLevel = [number];

	/*更新名字*/
	const enum SV_UpdateCenterNameFields {
		agentID = 0,			/*角色ID*/
		name = 1,			/*名字*/
		factionID = 2,			/*仙盟ID*/
	}
	type SV_UpdateCenterName = [number, string, string];

	/*更新职业*/
	const enum SV_UpdateCenterOccFields {
		agentID = 0,			/*角色ID*/
		occ = 1,			/*职业*/
		factionID = 2,			/*仙盟ID*/
	}
	type SV_UpdateCenterOcc = [number, number, string];

	/*广播场景状态*/
	const enum SV_BroadcastCopyStateToCenterFields {
		states = 0,
	}
	type SV_BroadcastCopyStateToCenter = [Array<CopySceneState>];

	/*添加玩家到center*/
	const enum SV_LoginUserToCenterFields {
		agentId = 0,			/*用户唯一id*/
		baseData = 1,			/*基本信息*/
		ip = 2,
		account = 3,			/*帐号*/
	}
	type SV_LoginUserToCenter = [number, HuamnBaseData, string, string];

	/*客户端加载完成*/
	const enum SV_UserLoginCompleteToCenterFields {
		agentId = 0,			/*玩家id*/
	}
	type SV_UserLoginCompleteToCenter = [number];

	/*玩家下线*/
	const enum SV_LogoutUserOfCenterFields {
		agentId = 0,			/*玩家id*/
		force = 1,			/*是否强制下线*/
	}
	type SV_LogoutUserOfCenter = [number, boolean];

	/*领取邮件附件返回*/
	const enum SV_GetEmailsAttachReplyFields {
		states = 0,
		result = 1,
	}
	type SV_GetEmailsAttachReply = [Array<UuidState>, number];

	/*添加邮件*/
	const enum SV_AddEmailsFields {
		pgId = 0,			/*服ID*/
		emails = 1,
	}
	type SV_AddEmails = [number, Array<Email>];

	/*添加邮件*/
	const enum SV_CrossAddEmailsFields {
		pgId = 0,			/*服ID*/
		emails = 1,
	}
	type SV_CrossAddEmails = [number, Array<Email>];

	/*添加邮件*/
	const enum SV_CrossTAddEmailsFields {
		pgId = 0,			/*服ID*/
		emails = 1,
	}
	type SV_CrossTAddEmails = [number, Array<Email>];

	/*添加多封邮件*/
	const enum SV_CrossAddEmailsListFields {
		emails = 0,
	}
	type SV_CrossAddEmailsList = [EmailList];

	/*添加多封邮件*/
	const enum SV_CrossTAddEmailsListFields {
		emails = 0,
	}
	type SV_CrossTAddEmailsList = [EmailList];

	/*获取BOSS*/
	const enum SV_GetBossReplyFields {
		bossInfos = 0,			/*BOSS 信息*/
	}
	type SV_GetBossReply = [Array<BossInfo>];

	/*更新BOSS*/
	const enum SV_UpdateBossFields {
		bossInfos = 0,			/*BOSS 信息*/
	}
	type SV_UpdateBoss = [Array<BossInfo>];

	/*BOSS 参与*/
	const enum SV_BOSSJoinFields {
		mapId = 0,
		level = 1,
		joins = 2,			/*参与*/
	}
	type SV_BOSSJoin = [number, number, BossJoin];

	/*BOSS结算奖励*/
	const enum SV_BOSSJudgeAwardFields {
		mapId = 0,
		level = 1,
		judges = 2,			/*结算*/
	}
	type SV_BOSSJudgeAward = [number, number, Array<BossJudge>];

	/*更新鼓舞信息、死亡次数*/
	const enum SV_UpdateInspireInfoFields {
		mapId = 0,
		level = 1,
		inspires = 2,
	}
	type SV_UpdateInspireInfo = [number, number, Array<InspireInfo>];

	/*更新BOSS排名奖励*/
	const enum SV_UpdateBossRankAwardFields {
		occ = 0,			/*BOSS id*/
		rankRankRecords = 1,			/*排名记录*/
	}
	type SV_UpdateBossRankAward = [number, Array<BossRankRecord>];

	/*获取排行*/
	const enum SV_GetRankDataFields {
		rankType = 0,			/*获取排行*/
	}
	type SV_GetRankData = [number];

	/*更新排行数据*/
	const enum SV_UpdateRankDataFields {
		rankData = 0,			/*更新排行数据*/
	}
	type SV_UpdateRankData = [RankData];

	/*更新探索记录*/
	const enum SV_UpdateXunbaoNoteFields {
		type = 0,			/*类型 0装备 1巅峰 2至尊 3仙符*/
		svrNotes = 1,			/*全服记录*/
	}
	type SV_UpdateXunbaoNote = [number, Array<XunbaoNote>];

	/*充值订单兑换结果返回*/
	const enum SV_RechargeOrderExchangeReplyFields {
		orderStates = 0,
		result = 1,
	}
	type SV_RechargeOrderExchangeReply = [Array<UuidState>, number];

	/*广播天梯排名*/
	const enum SV_BroadcastTiantiRankFields {
		rank = 0,
	}
	type SV_BroadcastTiantiRank = [Array<TiantiRank>];

	/*获取天梯 (积分、功勋、剩余次数)*/
	const enum SV_GetTiantiOfFeatureFields {
		agentId = 0,
	}
	type SV_GetTiantiOfFeature = [number];

	/*更新天梯积分*/
	const enum SV_UpdateTiantiScoreFields {
		score = 0,
	}
	type SV_UpdateTiantiScore = [TiantiActorScore];

	/*更新充值转盘记录*/
	const enum SV_UpdatePayRewardNoteFields {
		svrNotes = 0,			/*全服记录*/
	}
	type SV_UpdatePayRewardNote = [Array<PayRewardNoteSvr>];

	/*添加竞技排行*/
	const enum SV_GetArenaObjsFields {
	}
	type SV_GetArenaObjs = null;

	/*添加竞技排行*/
	const enum SV_AddArenaRankFields {
	}
	type SV_AddArenaRank = null;

	/*交换排名*/
	const enum SV_SwapArenaRankFields {
		atkObj = 0,			/*挑战者*/
		hitObj = 1,			/*被挑战者*/
	}
	type SV_SwapArenaRank = [ChallengeObj, ChallengeObj];

	/*刷新挑战对象*/
	const enum SV_FlushArenaFields {
	}
	type SV_FlushArena = null;

	/*挑战竞技场*/
	const enum SV_ChallengeArenaFields {
		objId = 0,
	}
	type SV_ChallengeArena = [number];

	/*添加挑战记录*/
	const enum SV_AddChallengeRecordFields {
		records = 0,
	}
	type SV_AddChallengeRecord = [Array<ChallengeRecord>];

	/*获取竞技场排名*/
	const enum SV_GetArenaRankFields {
	}
	type SV_GetArenaRank = null;

	/*更新飞升榜信息*/
	const enum SV_UpdateFeishengRankInfoOfCenterFields {
		curType = 0,			/*飞升榜类型*/
		startTm = 1,			/*开始时间*/
		endTm = 2,			/*结束时间*/
		endFlag = 3,			/*活动状态*/
	}
	type SV_UpdateFeishengRankInfoOfCenter = [number, number, number, number];

	/*获取飞升榜抢购信息*/
	const enum SV_GetFeishengRushBuyInfoFields {
	}
	type SV_GetFeishengRushBuyInfo = null;

	/*更新飞升榜抢购信息*/
	const enum SV_UpdateFeishengRushBuyInfoFields {
		count = 0,			/*抢购数量*/
	}
	type SV_UpdateFeishengRushBuyInfo = [number];

	/*当天飞升榜结算*/
	const enum SV_UpdateFeishengRankEndOfCenterFields {
		rankType = 0,			/*排行类型*/
		rankTm = 1,			/*排行时间*/
		nodeList = 2,			/*排名列表*/
	}
	type SV_UpdateFeishengRankEndOfCenter = [number, number, Array<FeishengRankInfo>];

	/*更新夺宝记录*/
	const enum SV_UpdateDuobaoNoteFields {
		type = 0,			/*榜单类型*/
		svrNotes = 1,			/*全服记录*/
	}
	type SV_UpdateDuobaoNote = [number, Array<PayRewardNoteSvr>];

	/*更新夺宝积分*/
	const enum SV_UpdateDuobaoScoreFields {
		type = 0,			/*榜单类型*/
		actorId = 1,			/*角色id*/
		score = 2,			/*积分*/
	}
	type SV_UpdateDuobaoScore = [number, number, number];

	/*更新九州夺宝信息*/
	const enum SV_UpdateJzduobaoInfoToCenterFields {
		state = 0,			/*开启状态*/
		jackpot = 1,			/*奖池代币券*/
	}
	type SV_UpdateJzduobaoInfoToCenter = [number, number];

	/*更新九州夺宝记录*/
	const enum SV_UpdateJzduobaoNoteFields {
		svrNotes = 0,			/*全服记录*/
	}
	type SV_UpdateJzduobaoNote = [Array<PayRewardNoteSvr>];

	/*更新九州夺宝积分*/
	const enum SV_UpdateJzduobaoScoreFields {
		actorId = 0,			/*角色id*/
		score = 1,			/*积分*/
	}
	type SV_UpdateJzduobaoScore = [number, number];

	/*创建仙盟返回*/
	const enum SV_CreateFactionReplyFields {
		result = 0,
	}
	type SV_CreateFactionReply = [number];

	/*设置仙盟id返回*/
	const enum SV_SetFactionIdReplyFields {
		result = 0,
	}
	type SV_SetFactionIdReply = [number];

	/*申请加入仙盟返回*/
	const enum SV_JoinApplyReplyFields {
		result = 0,
	}
	type SV_JoinApplyReply = [number];

	/*自动邀请推送*/
	const enum SV_AutoInvitationPushFields {
		isFirst = 0,
	}
	type SV_AutoInvitationPush = [boolean];

	/*请求协助开宝箱*/
	const enum SV_AskAssistOpenBoxFields {
		id = 0,
		time = 1,
		color = 2,
		level = 3,
	}
	type SV_AskAssistOpenBox = [string, number, number, number];

	/*加速宝箱*/
	const enum SV_AddSpeedBoxFields {
		id = 0,
		time = 1,
		agentId = 2,
	}
	type SV_AddSpeedBox = [string, number, number];

	/*协助别人开宝箱*/
	const enum SV_AssistOpenBoxFields {
		id = 0,			/*宝箱id*/
	}
	type SV_AssistOpenBox = [string];

	/*更新仙盟副本信息*/
	const enum SV_UpdateFactionCopyFields {
		id = 0,			/*仙盟id*/
		hp = 1,			/*boss被打的伤害*/
		boosId = 2,
		isDie = 3,			/*是不是被打死了*/
		index = 4,
		inspireTime = 5,			/*全员鼓舞时间*/
		count = 6,			/*当前副本人数*/
	}
	type SV_UpdateFactionCopy = [string, number, number, boolean, number, number, number];

	/*请求仙盟副本信息*/
	const enum SV_AskFactionCopyInfoFields {
		id = 0,
	}
	type SV_AskFactionCopyInfo = [string];

	/*更新转盘记录*/
	const enum SV_UpdateTurnRecordFields {
		list = 0,
	}
	type SV_UpdateTurnRecord = [Array<number>];

	/*更新申请信息*/
	const enum SV_UpdateJoinInfoFields {
		list = 0,
	}
	type SV_UpdateJoinInfo = [Array<string>];

	/*增加仙盟经验*/
	const enum SV_AddFactionExpFields {
		exp = 0,
	}
	type SV_AddFactionExp = [number];

	/*GM设置仙盟经验*/
	const enum SV_GmSetFactionExpFields {
		exp = 0,
	}
	type SV_GmSetFactionExp = [number];

	/*增加贡献值*/
	const enum SV_AddContributionFields {
		contribution = 0,
	}
	type SV_AddContribution = [number];

	/*邀请加入队伍*/
	const enum SV_InviteJoinTeamFields {
		type = 0,			/*0: 仙盟*/
		teamId = 1,			/*队伍ID*/
		objId = 2,			/*玩家ID 0: 所有在线玩家*/
		mapId = 3,
		members = 4,			/*已有成员*/
	}
	type SV_InviteJoinTeam = [number, number, number, number, Array<number>];

	/*获取称号*/
	const enum SV_GetDesinationFields {
	}
	type SV_GetDesination = null;

	/*获取邮件数量*/
	const enum GetEmailCountFields {
	}
	type GetEmailCount = null;

	/*批量获取邮件*/
	const enum GetEmailsFields {
		uuids = 0,
	}
	type GetEmails = [Array<string>];

	/*读取邮件*/
	const enum ReadEmailsFields {
		uuid = 0,
	}
	type ReadEmails = [string];

	/*一键获取邮件附件*/
	const enum GetEmailsAttachAllFields {
	}
	type GetEmailsAttachAll = null;

	/*删除邮件*/
	const enum DelEmailsFields {
	}
	type DelEmails = null;

	/*领取一封邮件*/
	const enum GetEmailsAttachOnceFields {
		uuid = 0,
	}
	type GetEmailsAttachOnce = [string];

	/*获取排行*/
	const enum GetRankFields {
		rankType = 0,			/*排行类型 RankType*/
	}
	type GetRank = [number];

	/*获取排行榜返回*/
	const enum GetActorRankShowFields {
		objId = 0,			/*角色ID*/
	}
	type GetActorRankShow = [number];

	/*获取角色排行榜数据*/
	const enum GetActorRankDataFields {
		reqs = 0,
	}
	type GetActorRankData = [Array<ReqRankData>];

	/*获取BOSS*/
	const enum GetBossFields {
	}
	type GetBoss = null;

	/*获取BOSS*/
	const enum GetBossSingleFields {
		occ = 0,			/*公共BOSS ID*/
	}
	type GetBossSingle = [number];

	/*获取BOSS排行记录*/
	const enum GetBossRankRecordFields {
		occ = 0,			/*BOSS id*/
	}
	type GetBossRankRecord = [number];

	/*获取组队副本排行*/
	const enum GetTeamCopyRankFields {
	}
	type GetTeamCopyRank = null;

	/*获取探索全服记录*/
	const enum GetXunbaoServerBroadcastFields {
		type = 0,			/*类型 0装备 1巅峰 2至尊 3仙符*/
	}
	type GetXunbaoServerBroadcast = [number];

	/*获取九天排名*/
	const enum GetNineCopyRankFields {
	}
	type GetNineCopyRank = null;

	/*获取数据*/
	const enum GetSprintRankAllInfoFields {
	}
	type GetSprintRankAllInfo = null;

	/*获取基本数据(标签)*/
	const enum GetSprintRankBaseInfoFields {
	}
	type GetSprintRankBaseInfo = null;

	/*获取历史排名*/
	const enum GetSprintRankBeforeFields {
	}
	type GetSprintRankBefore = null;

	/*获取充值转盘全服记录*/
	const enum GetPayRewardServerBroadcastFields {
	}
	type GetPayRewardServerBroadcast = null;

	/*获取夺宝全服记录*/
	const enum GetDuobaoServerBroadcastFields {
	}
	type GetDuobaoServerBroadcast = null;

	/*获取九州夺宝全服记录*/
	const enum GetJzduobaoServerBroadcastFields {
	}
	type GetJzduobaoServerBroadcast = null;

	/*获取天梯排行*/
	const enum GetTiantiRankFields {
	}
	type GetTiantiRank = null;

	/*获取竞技排行*/
	const enum GetArenaRankFields {
	}
	type GetArenaRank = null;

	/*获取竞技挑战记录*/
	const enum GetArenaChallengeRecordFields {
	}
	type GetArenaChallengeRecord = null;

	/*获取仙盟列表*/
	const enum GetFactionListFields {
	}
	type GetFactionList = null;

	/*获取仙盟信息*/
	const enum GetFactionInfoFields {
	}
	type GetFactionInfo = null;

	/*创建仙盟*/
	const enum CreateFactionFields {
		name = 0,
		flagIndex = 1,			/*旗子总表下标*/
	}
	type CreateFaction = [string, number];

	/*申请加入仙盟*/
	const enum JoinFactionFields {
		uuid = 0,			/*要申请加入的仙盟id*/
		opt = 1,			/*0:请求加入，1：取消加入*/
	}
	type JoinFaction = [string, number];

	/*获取仙盟申请加入列表*/
	const enum GetFactionJoinListFields {
	}
	type GetFactionJoinList = null;

	/*审批*/
	const enum ExamineFields {
		agendId = 0,
		result = 1,			/*0：拒绝，1同意*/
	}
	type Examine = [number, number];

	/*解散*/
	const enum DissolutionFields {
	}
	type Dissolution = null;

	/*广播招人*/
	const enum BroadcastRecruitFields {
	}
	type BroadcastRecruit = null;

	/*退出仙盟*/
	const enum ExitFactionFields {
	}
	type ExitFaction = null;

	/*踢人*/
	const enum KickFields {
		agentId = 0,
	}
	type Kick = [number];

	/*设置职位*/
	const enum SetPositionFields {
		agentId = 0,
		pos = 1,			/*在仙盟中的职位 0：普通，1盟主，2副盟主，3护法*/
	}
	type SetPosition = [number, number];

	/*设置战力*/
	const enum SetFightFields {
		fight = 0,
	}
	type SetFight = [number];

	/*设置招人标题*/
	const enum SetTitleFields {
		title = 0,
	}
	type SetTitle = [string];

	/*设置公告*/
	const enum SetNoticeFields {
		Notice = 0,
	}
	type SetNotice = [string];

	/*设置加入仙盟审批状态*/
	const enum SetExamineFields {
		state = 0,			/*true需要审批，false不用*/
	}
	type SetExamine = [boolean];

	/*申请职位*/
	const enum ApplyForPosFields {
		pos = 0,			/*申请职位*/
	}
	type ApplyForPos = [number];

	/*获取申请职位列表*/
	const enum GetApplyForPosListFields {
	}
	type GetApplyForPosList = null;

	/*申请职位审批结果*/
	const enum ApplyForPosResultFields {
		agenId = 0,			/*被处理的玩家id*/
		pos = 1,			/*处理的职位*/
		result = 2,			/*处理结果，0：拒绝，1：同意*/
	}
	type ApplyForPosResult = [number, number, number];

	/*获取仙盟排行榜*/
	const enum GetFactionRankListFields {
	}
	type GetFactionRankList = null;

	/*获取需要协助的宝箱*/
	const enum GetAssistBoxListFields {
	}
	type GetAssistBoxList = null;

	/*获取仙盟转盘记录*/
	const enum GetFactionTurnRecordFields {
	}
	type GetFactionTurnRecord = null;

	/*获取意见反馈列表*/
	const enum GetFeedbackListFields {
	}
	type GetFeedbackList = null;

	/*发送意见反馈*/
	const enum SendFeedbackFields {
		type = 0,			/*反馈类型 1：游戏BUG，2：投诉反馈，3：游戏建议，4：其它意见*/
		str = 1,			/*反馈内容*/
	}
	type SendFeedback = [number, string];

	/*改变意见反馈查看状态*/
	const enum ChangeFeedbackStateFields {
		list = 0,			/*已看的key*/
	}
	type ChangeFeedbackState = [Array<string>];

	/*兑换激活码*/
	const enum ExchangeCdkeyFields {
		key = 0,
	}
	type ExchangeCdkey = [string];

	/*获取公告*/
	const enum GetNoticeFields {
	}
	type GetNotice = null;

	/*服务器认证*/
	const enum SV_AuthChatFields {
		type = 0,			/*服务类型*/
		handle = 1,			/*服务句柄*/
		pgId = 2,			/*platformId + groupId*/
	}
	type SV_AuthChat = [number, number, number];

	/*ping*/
	const enum SV_ChatServicePingFields {
	}
	type SV_ChatServicePing = null;

	/*Chat热更新*/
	const enum SV_HotupdateToChatFields {
		text = 0,
	}
	type SV_HotupdateToChat = [Array<string>];

	/*Chat重新加载配置*/
	const enum SV_ReloadCfgToChatFields {
	}
	type SV_ReloadCfgToChat = null;

	/*更新玩家等级*/
	const enum SV_UpdateActorLevelToChatFields {
		agentId = 0,			/*用户唯一id*/
		level = 1,			/*玩家等级*/
	}
	type SV_UpdateActorLevelToChat = [number, number];

	/*更新玩家仙位*/
	const enum SV_UpdateActorXianWeiLevelToChatFields {
		agentId = 0,			/*用户唯一id*/
		level = 1,			/*仙位等级*/
	}
	type SV_UpdateActorXianWeiLevelToChat = [number, number];

	/*更新仙盟信息*/
	const enum SV_UpdateFactionInfoFields {
		agentId = 0,			/*用户唯一id*/
		factionId = 1,			/*仙盟id*/
		isNewJoin = 2,			/*是否新加入*/
		isKick = 3,			/*是否被踢了*/
	}
	type SV_UpdateFactionInfo = [number, string, boolean, boolean];

	/*仙盟解散，删除记录*/
	const enum SV_FactionDissolutionFields {
		factionId = 0,			/*仙盟id*/
	}
	type SV_FactionDissolution = [string];

	/*更新名字*/
	const enum SV_UpdateChatNameFields {
		agentID = 0,			/*角色ID*/
		name = 1,			/*名字*/
	}
	type SV_UpdateChatName = [number, string];

	/*更新职业*/
	const enum SV_UpdateChatOccFields {
		agentID = 0,			/*角色ID*/
		occ = 1,			/*职业*/
	}
	type SV_UpdateChatOcc = [number, number];

	/*添加玩家到chat*/
	const enum SV_LoginUserToChatFields {
		agentId = 0,			/*用户唯一id*/
		account = 1,			/*用户帐号*/
		ip = 2,			/*ip地址*/
		package = 3,			/*包号*/
		baseData = 4,			/*基本信息*/
	}
	type SV_LoginUserToChat = [number, string, string, number, HuamnBaseData];

	/*玩家下线*/
	const enum SV_LogoutUserOfChatFields {
		agentId = 0,			/*用户唯一id*/
		force = 1,			/*是否强制下线*/
	}
	type SV_LogoutUserOfChat = [number, boolean];

	/*获取玩家镜像数据返回*/
	const enum SV_GetActorImgDataOfNexusReplyFields {
		result = 0,
		data = 1,
	}
	type SV_GetActorImgDataOfNexusReply = [number, ImgData];

	/*广播*/
	const enum SV_BroadcastChatFields {
		agentId = 0,			/*玩家Id*/
		broadcastType = 1,			/*广播类型0所有玩家，1单个玩家*/
		broadcastId = 2,			/*广播Id*/
		numParam = 3,			/*广播参数*/
		strParam = 4,			/*广播参数*/
	}
	type SV_BroadcastChat = [number, number, number, Array<number>, Array<string>];

	/*gm广播，测试用*/
	const enum SV_GmBroadcastChatFields {
		agentId = 0,			/*玩家Id*/
		content = 1,			/*广播内容*/
		broadcastType = 2,			/*广播类型0所有玩家，1单个玩家*/
		channel = 3,			/*频道*/
	}
	type SV_GmBroadcastChat = [number, string, number, number];

	/*更新聊天数据*/
	const enum SV_UpdateChatDataFields {
		agentId = 0,			/*玩家Id*/
		chatChannel = 1,			/*已开启的聊天频道*/
		chatType = 2,			/*已开启的聊天类型*/
		useCount = 3,			/*高级表情使用次数*/
		vip = 4,			/*vip等级*/
		vipf = 5,			/*vipf等级*/
	}
	type SV_UpdateChatData = [number, Array<number>, Array<number>, number, number, number];

	/*获取聊天玩家详细信息返回*/
	const enum SV_GetChatDetailedInfoReplyFields {
		result = 0,			/*错误码*/
		info = 1,
	}
	type SV_GetChatDetailedInfoReply = [number, ChatPlayerDetailedInfo];

	/*扣除高级表情次数返回*/
	const enum SV_DelExpressionCountReplyFields {
		result = 0,			/*错误码*/
	}
	type SV_DelExpressionCountReply = [number];

	/*设置禁言*/
	const enum SV_SetBlockSpeakFields {
		addAgentIdList = 0,			/*添加禁言id：结束时间*/
		delAgentIdList = 1,			/*删除禁言id*/
	}
	type SV_SetBlockSpeak = [Array<Pair>, Array<number>];

	/*更新护送信息*/
	const enum SV_UpdateFairyEscortInfoFields {
		agentId = 0,			/*玩家Id*/
		fairyId = 1,			/*仙女id*/
		endTime = 2,			/*结束时间*/
		looting = 3,			/*被截次数*/
		isDouble = 4,			/*是否双倍*/
	}
	type SV_UpdateFairyEscortInfo = [number, number, number, number, boolean];

	/*拦截仙女*/
	const enum SV_InterceptFairyFields {
		agentId = 0,			/*玩家Id*/
		interceptId = 1,			/*被拦截的玩家id*/
	}
	type SV_InterceptFairy = [number, number];

	/*拦截仙女结果*/
	const enum SV_InterceptResultFields {
		name = 0,			/*玩家名字*/
		interceptId = 1,			/*被拦截的玩家id*/
		result = 2,			/*0失败，1成功*/
		time = 3,
		awardPer = 4,			/*奖励扣除百分比*/
	}
	type SV_InterceptResult = [string, number, number, number, number];

	/*请求组队*/
	const enum SV_ReqOrganizeTeamFields {
		agentId = 0,
		mapId = 1,			/*mapId*/
		member = 2,
		attr = 3,
	}
	type SV_ReqOrganizeTeam = [number, number, TeamMember, Array<TypesAttr>];

	/*取消组队*/
	const enum SV_CancelOrganizeTeamFields {
		agentId = 0,
	}
	type SV_CancelOrganizeTeam = [number];

	/*创建队伍*/
	const enum SV_CreateTeamFields {
		mapId = 0,			/*场景ID*/
		member = 1,
		attr = 2,
	}
	type SV_CreateTeam = [number, TeamMember, Array<TypesAttr>];

	/*解散队伍*/
	const enum SV_DestoryTeamFields {
	}
	type SV_DestoryTeam = null;

	/*接受入队、进入队伍*/
	const enum SV_JoinTeamFields {
		mapId = 0,			/*mapId*/
		teamId = 1,			/*teamId*/
		member = 2,
		attr = 3,
	}
	type SV_JoinTeam = [number, number, TeamMember, Array<TypesAttr>];

	/*离开队伍*/
	const enum SV_LeaveTeamFields {
	}
	type SV_LeaveTeam = null;

	/*踢出队伍*/
	const enum SV_KickedTeamFields {
		objId = 0,
	}
	type SV_KickedTeam = [number];

	/*聊天*/
	const enum ChatFields {
		agentId = 0,			/*自身id*/
		content = 1,			/*聊天内容*/
	}
	type Chat = [number, ChatContent];

	/*获取聊天玩家详细信息*/
	const enum GetChatDetailedInfoFields {
		agentId = 0,			/*自身id*/
		targetId = 1,			/*要查看的目标id*/
		pgId = 2,			/*所在平台pgId*/
	}
	type GetChatDetailedInfo = [number, number, number];

	/*获取聊天记录*/
	const enum GetChatRecordFields {
		agentId = 0,			/*自身id*/
		channel = 1,			/*聊天频道：0：广播，1：九洲频道，2：本服  3:系统*/
	}
	type GetChatRecord = [number, number];

	/*获取仙女护送列表  返回数量取决于总表配置的显示上限*/
	const enum GetFairyEscortListFields {
		agentId = 0,			/*自身id*/
		num = 1,			/*请求数量  如果超出配置上限 只返回配置上限数*/
	}
	type GetFairyEscortList = [number, number];

	/*获取其它玩家仙女面板信息，同时会记录哪些玩家获取了，到时有拦截会推更新*/
	const enum GetFairyPanelInfoFields {
		agentId = 0,			/*自身id*/
		pgId = 1,			/*所在平台pgId*/
		targetId = 2,			/*查看的目标id*/
	}
	type GetFairyPanelInfo = [number, number, number];

	/*删除上面获取记录，到时有拦截不会再推更新*/
	const enum DelFairyPanelInfoRecordFields {
		agentId = 0,			/*自身id*/
		targetId = 1,			/*查看的目标id*/
	}
	type DelFairyPanelInfoRecord = [number, number];

	/*命令返回*/
	const enum Bg_CommondReplyFields {
		result = 0,
	}
	type Bg_CommondReply = [number];

	/*热更新*/
	const enum Bg_HotupdateFields {
		type = 0,			/*服务器类型*/
		text = 1,
	}
	type Bg_Hotupdate = [number, Array<string>];

	/*重新加载配置*/
	const enum Bg_ReloadCfgFields {
		type = 0,			/*服务器类型*/
	}
	type Bg_ReloadCfg = [number];

	/*封禁*/
	const enum Bg_BlockFields {
		type = 0,			/*1:封账号 2:封IP 3:禁言 4:封角色ID*/
		unblock = 1,			/*解封*/
		str = 2,
		id = 3,
		time = 4,			/*封禁时间 -1:永久 秒*/
		content = 5,			/*封禁内容*/
	}
	type Bg_Block = [number, boolean, Array<string>, Array<number>, number, string];

	/*下线*/
	const enum Bg_ForceLogoutFields {
		roleId = 0,
	}
	type Bg_ForceLogout = [Array<number>];

	/*后台广播*/
	const enum Bg_BroadcastFields {
		list = 0,
	}
	type Bg_Broadcast = [Array<BgBroadcast>];

	/*删除后台广播*/
	const enum Bg_DelBroadcastFields {
		uuid = 0,			/*唯一id*/
	}
	type Bg_DelBroadcast = [string];

	/*后台发邮件*/
	const enum Bg_AddEmailsFields {
		items = 0,			/*道具列表*/
		title = 1,			/*标题*/
		content = 2,			/*内容*/
		objIds = 3,			/*角色id 0:当前服所有玩家*/
	}
	type Bg_AddEmails = [Array<Items>, string, string, Array<number>];

	/*后台充值订单*/
	const enum Bg_RechargeOrderFields {
		orders = 0,			/*订单列表*/
	}
	type Bg_RechargeOrder = [Array<RechargeOrder>];

	/*后台回复意见反馈*/
	const enum Bg_FeebackReplyFields {
		uuid = 0,			/*id*/
		str = 1,			/*回复内容*/
		time = 2,			/*回复时间*/
	}
	type Bg_FeebackReply = [string, string, number];

	/*产生激活码*/
	const enum Bg_CDKEYProduceFields {
		list = 0,
	}
	type Bg_CDKEYProduce = [CDKEY];

	/*改变激活码状态*/
	const enum Bg_CDKEYStateFields {
		gId = 0,
		isDisable = 1,			/*是否禁用*/
	}
	type Bg_CDKEYState = [number, boolean];

	/*删除激活码*/
	const enum Bg_CDKEYDelFields {
		gId = 0,
	}
	type Bg_CDKEYDel = [number];

	/*更新公告*/
	const enum Bg_UpdateNoticeFields {
		content = 0,
	}
	type Bg_UpdateNotice = [string];

	/*gm指令*/
	const enum Bg_GMCommonToFeatureFields {
		objId = 0,			/*角色id*/
		cmd = 1,
	}
	type Bg_GMCommonToFeature = [number, string];

	/*Cross热更新*/
	const enum SV_HotupdateToCrossFields {
		text = 0,
	}
	type SV_HotupdateToCross = [Array<string>];

	/*Cross重新加载配置*/
	const enum SV_ReloadCfgToCrossFields {
	}
	type SV_ReloadCfgToCross = null;

	/*请求公共BOSS信息*/
	const enum SV_GetCrossBossFields {
	}
	type SV_GetCrossBoss = null;

	/*请求公共场景开放*/
	const enum SV_GetCrossForeverSceneFields {
	}
	type SV_GetCrossForeverScene = null;

	/*更新九天之巅战绩*/
	const enum SV_UpdateNineCopyGainsFields {
		ranks = 0,
	}
	type SV_UpdateNineCopyGains = [Array<NineRank>];

	/*获取九天之巅排名*/
	const enum SV_GetNineCopyRankFields {
	}
	type SV_GetNineCopyRank = null;

	/*获取赛季状态*/
	const enum SV_GetSeasonStateFromCrossFields {
	}
	type SV_GetSeasonStateFromCross = null;

	/*获取场景状态*/
	const enum SV_GetSceneStateFromCrossFields {
	}
	type SV_GetSceneStateFromCross = null;

	/*获取场景状态*/
	const enum SV_GetSceneStateFromCrossOfMapFields {
	}
	type SV_GetSceneStateFromCrossOfMap = null;

	/*更新名字*/
	const enum SV_UpdateCrossNameFields {
		agentID = 0,			/*角色ID*/
		name = 1,			/*名字*/
	}
	type SV_UpdateCrossName = [number, string];

	/*更新职业*/
	const enum SV_UpdateCrossOccFields {
		agentID = 0,			/*角色ID*/
		occ = 1,			/*职业*/
	}
	type SV_UpdateCrossOcc = [number, number];

	/*获取场景状态*/
	const enum SV_GetCopyStateFromCrossFields {
	}
	type SV_GetCopyStateFromCross = null;

	/*设置本地时间*/
	const enum SV_GM_SetLocalTimeToCrossFields {
		time = 0,			/*时间*/
	}
	type SV_GM_SetLocalTimeToCross = [number];

	/*重置飞升榜*/
	const enum SV_GM_ResetFeishengRankFields {
	}
	type SV_GM_ResetFeishengRank = null;

	/*重置九州夺宝*/
	const enum SV_GM_ResetJzDuobaoRankFields {
	}
	type SV_GM_ResetJzDuobaoRank = null;

	/*服务器认证*/
	const enum SV_AuthCrossFields {
		type = 0,			/*服务类型*/
		handle = 1,			/*服务句柄*/
		pgId = 2,
		serverTm = 3,			/*开服时间*/
	}
	type SV_AuthCross = [number, number, number, number];

	/*ping*/
	const enum SV_CrossServicePingFields {
	}
	type SV_CrossServicePing = null;

	/*注册地图*/
	const enum SV_RegisterMapToCrossFields {
		mapId = 0,
	}
	type SV_RegisterMapToCross = [Array<number>];

	/*添加用户到Cross*/
	const enum SV_LoginUserToCrossFields {
		objId = 0,
		baseData = 1,			/*基本信息*/
	}
	type SV_LoginUserToCross = [number, HuamnBaseData];

	/*登录到跨服场景*/
	const enum SV_LoginUserToCrossMapFields {
		data = 0,
	}
	type SV_LoginUserToCrossMap = [LoginData];

	/*登出跨服场景*/
	const enum SV_LogoutUserToCrossMapFields {
		objId = 0,
	}
	type SV_LogoutUserToCrossMap = [number];

	/*用户登出Cross*/
	const enum SV_LogoutUserToCrossFields {
		unique = 0,			/*玩家ID*/
		force = 1,			/*是否强制下线*/
	}
	type SV_LogoutUserToCross = [number, boolean];

	/*回滚退出场景*/
	const enum SV_FallbackLogoutCrossFields {
		objId = 0,			/*用户唯一id*/
	}
	type SV_FallbackLogoutCross = [number];

	/*用户登出Cross*/
	const enum SV_LogoutUserOfMapToCrossReplyFields {
	}
	type SV_LogoutUserOfMapToCrossReply = null;

	/*添加用户到场景服返回*/
	const enum SV_LoginUserToMapOfCrossReplyFields {
		result = 0,
	}
	type SV_LoginUserToMapOfCrossReply = [number];

	/*添加机器人到Cross*/
	const enum SV_LoginRobotToCrossFields {
		robotData = 0,			/*机器人数据*/
		mapId = 1,
	}
	type SV_LoginRobotToCross = [RobotLoginData, number];

	/*获取玩家镜像数据返回*/
	const enum SV_ReqOrganizeTeamToCrossFields {
		agentId = 0,
		mapId = 1,			/*mapId*/
		member = 2,
		attr = 3,
	}
	type SV_ReqOrganizeTeamToCross = [number, number, TeamMember, Array<TypesAttr>];

	/*获取玩家镜像数据返回*/
	const enum SV_CancelOrganizeTeamToCrossFields {
		agentId = 0,
	}
	type SV_CancelOrganizeTeamToCross = [number];

	/*获取玩家镜像数据返回*/
	const enum SV_GetActorImgDataToCrossOfNexusReplyFields {
		result = 0,
		data = 1,
	}
	type SV_GetActorImgDataToCrossOfNexusReply = [number, ImgData];

	/*添加用户到Cross*/
	const enum SV_LoginBogusUserToCrossFields {
		objId = 0,
		serverType = 1,
	}
	type SV_LoginBogusUserToCross = [number, number];

	/*用户登出Cross*/
	const enum SV_LogoutBogusUserToCrossFields {
		objId = 0,
		serverType = 1,
	}
	type SV_LogoutBogusUserToCross = [number, number];

	/*获取天梯排名*/
	const enum SV_GetTiantiRankFields {
	}
	type SV_GetTiantiRank = null;

	/*更新角色天梯积分*/
	const enum SV_CommitActorTiantiOfCenterFields {
		actor = 0,
	}
	type SV_CommitActorTiantiOfCenter = [TiantiRank];

	/*获取排行*/
	const enum SV_GetCrossRankDataFields {
		rankType = 0,			/*获取排行*/
	}
	type SV_GetCrossRankData = [number];

	/*更新排行数据*/
	const enum SV_UpdateCrossRankDataFields {
		rankData = 0,			/*更新排行数据*/
	}
	type SV_UpdateCrossRankData = [RankData];

	/*更新排行外观*/
	const enum SV_UpdateActorCrossRankShowFields {
		show = 0,			/*排行榜外观*/
	}
	type SV_UpdateActorCrossRankShow = [ActorCrossRankShow];

	/*更新VIP等级*/
	const enum SV_UpdateVipLevelToCrossFields {
		agentId = 0,
		level = 1,
	}
	type SV_UpdateVipLevelToCross = [number, number];

	/*更新消费排行数据*/
	const enum SV_UpdateCrossConsumeRankDataFields {
		consume = 0,
	}
	type SV_UpdateCrossConsumeRankData = [number];

	/*获取飞升榜信息*/
	const enum SV_GetFeishengRankInfoFields {
	}
	type SV_GetFeishengRankInfo = null;

	/*获取飞升榜信息*/
	const enum SV_GetFeishengRankInfoOfCenterFields {
	}
	type SV_GetFeishengRankInfoOfCenter = null;

	/*获取九州夺宝信息*/
	const enum SV_GetJzduobaoInfoFields {
	}
	type SV_GetJzduobaoInfo = null;

	/*获取九州夺宝信息(中心服)*/
	const enum SV_GetJzduobaoInfoOfCenterFields {
	}
	type SV_GetJzduobaoInfoOfCenter = null;

	/*更新九州夺宝信息*/
	const enum SV_UpdateJzduobaoInfoToCrossFields {
		jackpot = 0,			/*奖池代币券*/
	}
	type SV_UpdateJzduobaoInfoToCross = [number];

	/*更新服排行*/
	const enum SV_UpdateServerRankToCrossFields {
		rankData = 0,			/*更新排行数据*/
	}
	type SV_UpdateServerRankToCross = [RankServer];

	/*添加邮件*/
	const enum SV_CrossAddEmailsReplyFields {
		result = 0,
	}
	type SV_CrossAddEmailsReply = [number];

	/*获取排行*/
	const enum GetCrossRankFields {
		rankType = 0,			/*排行类型 RankType*/
	}
	type GetCrossRank = [number];

	/*获取排行榜返回*/
	const enum GetActorCrossRankShowFields {
		objId = 0,			/*角色ID*/
	}
	type GetActorCrossRankShow = [number];

	/*获取角色排行榜数据*/
	const enum GetActorCrossRankDataFields {
		reqs = 0,
	}
	type GetActorCrossRankData = [Array<ReqRankData>];

	/*获取数据*/
	const enum GetFeishengRankAllInfoFields {
	}
	type GetFeishengRankAllInfo = null;

	/*获取基本数据(标签)*/
	const enum GetFeishengRankBaseInfoFields {
	}
	type GetFeishengRankBaseInfo = null;

	/*获取积分数据*/
	const enum GetFeishengRankTaskInfoFields {
	}
	type GetFeishengRankTaskInfo = null;

	/*获取积分奖励*/
	const enum GetFeishengRankTaskRewardFields {
	}
	type GetFeishengRankTaskReward = null;

	/*获取历史排名*/
	const enum GetFeishengRankBeforeFields {
	}
	type GetFeishengRankBefore = null;

	/*获取夺宝排名数据*/
	const enum GetDuobaoRankInfoFields {
		type = 0,			/*类型 0个人 1区服*/
	}
	type GetDuobaoRankInfo = [number];

	/*获取九州夺宝排名数据*/
	const enum GetJzduobaoRankInfoFields {
		type = 0,			/*类型 0个人 1区服*/
	}
	type GetJzduobaoRankInfo = [number];

	/*获取消费排行榜数据*/
	const enum GetConsumeRankFields {
	}
	type GetConsumeRank = null;

	/*Cross热更新*/
	const enum SV_HotupdateToCrossTFields {
		text = 0,
	}
	type SV_HotupdateToCrossT = [Array<string>];

	/*Cross重新加载配置*/
	const enum SV_ReloadCfgToCrossTFields {
	}
	type SV_ReloadCfgToCrossT = null;

	/*请求公共BOSS信息*/
	const enum SV_GetCrossTBossFields {
	}
	type SV_GetCrossTBoss = null;

	/*请求公共场景开放*/
	const enum SV_GetCrossTForeverSceneFields {
	}
	type SV_GetCrossTForeverScene = null;

	/*获取组队副本排行*/
	const enum SV_GetTeamCopyRankFields {
	}
	type SV_GetTeamCopyRank = null;

	/*获取赛季状态*/
	const enum SV_GetSeasonStateFromCrossTFields {
	}
	type SV_GetSeasonStateFromCrossT = null;

	/*获取场景状态*/
	const enum SV_GetSceneStateFromCrossTFields {
	}
	type SV_GetSceneStateFromCrossT = null;

	/*获取场景状态*/
	const enum SV_GetSceneStateFromCrossTOfMapFields {
	}
	type SV_GetSceneStateFromCrossTOfMap = null;

	/*更新名字*/
	const enum SV_UpdateCrossTNameFields {
		agentID = 0,			/*角色ID*/
		name = 1,			/*名字*/
	}
	type SV_UpdateCrossTName = [number, string];

	/*更新职业*/
	const enum SV_UpdateCrossTOccFields {
		agentID = 0,			/*角色ID*/
		occ = 1,			/*职业*/
	}
	type SV_UpdateCrossTOcc = [number, number];

	/*获取场景状态*/
	const enum SV_GetCopyStateFromCrossTFields {
	}
	type SV_GetCopyStateFromCrossT = null;

	/*服务器认证*/
	const enum SV_AuthCrossTFields {
		type = 0,			/*服务类型*/
		handle = 1,			/*服务句柄*/
		pgId = 2,
	}
	type SV_AuthCrossT = [number, number, number];

	/*ping*/
	const enum SV_CrossTServicePingFields {
	}
	type SV_CrossTServicePing = null;

	/*注册地图*/
	const enum SV_RegisterMapToCrossTFields {
		mapId = 0,
	}
	type SV_RegisterMapToCrossT = [Array<number>];

	/*添加用户到Cross*/
	const enum SV_LoginUserToCrossTFields {
		objId = 0,
		baseData = 1,			/*基本信息*/
	}
	type SV_LoginUserToCrossT = [number, HuamnBaseData];

	/*登录到总跨服场景*/
	const enum SV_LoginUserToCrossTMapFields {
		data = 0,
	}
	type SV_LoginUserToCrossTMap = [LoginData];

	/*登出总跨服场景*/
	const enum SV_LogoutUserToCrossTMapFields {
		objId = 0,
	}
	type SV_LogoutUserToCrossTMap = [number];

	/*用户登出Cross*/
	const enum SV_LogoutUserToCrossTFields {
		unique = 0,			/*玩家ID*/
		force = 1,			/*是否强制下线*/
	}
	type SV_LogoutUserToCrossT = [number, boolean];

	/*回滚退出场景*/
	const enum SV_FallbackLogoutCrossTFields {
		objId = 0,			/*用户唯一id*/
	}
	type SV_FallbackLogoutCrossT = [number];

	/*用户登出Cross*/
	const enum SV_LogoutUserOfMapToCrossTReplyFields {
	}
	type SV_LogoutUserOfMapToCrossTReply = null;

	/*添加用户到场景服返回*/
	const enum SV_LoginUserToMapOfCrossTReplyFields {
		result = 0,
	}
	type SV_LoginUserToMapOfCrossTReply = [number];

	/*添加机器人到CrossT*/
	const enum SV_LoginRobotToCrossTFields {
		robotData = 0,			/*机器人数据*/
		mapId = 1,
	}
	type SV_LoginRobotToCrossT = [RobotLoginData, number];

	/*添加用户到CrossT*/
	const enum SV_LoginBogusUserToCrossTFields {
		objId = 0,
		serverType = 1,
	}
	type SV_LoginBogusUserToCrossT = [number, number];

	/*用户登出CrossT*/
	const enum SV_LogoutBogusUserToCrossTFields {
		objId = 0,
		serverType = 1,
	}
	type SV_LogoutBogusUserToCrossT = [number, number];

	/*更新组队通关波数*/
	const enum SV_UpdateTeamCopyWareFields {
		ware = 0,			/*击杀怪物波数*/
		ranks = 1,
	}
	type SV_UpdateTeamCopyWare = [number, Array<TeamCopyRank>];

	/*添加邮件*/
	const enum SV_CrossTAddEmailsReplyFields {
		result = 0,
	}
	type SV_CrossTAddEmailsReply = [number];

	/*发布姻缘墙*/
	const enum ReleaseMarryWallFields {
		msg = 0,				/* 姻缘留言 */
		cashGiftIndex = 1,		/* 心意礼下标 */
	}
	type ReleaseMarryWall = [string, number];

	/*获取姻缘列表*/
	const enum GetMarryWallListFields {
		name = 0,			/*搜索名字*/
	}
	type GetMarryWallList = [string];

	/*获取姻缘信息*/
	const enum GetMarryInfoFields {
	}
	type GetMarryInfo = null;

	/*姻缘解散*/
	const enum MarryDissolutionFields {
	}
	type MarryDissolution = null;

	/*姻缘结缘*/
	const enum CreateMarryFields {
		publisherId = 0,
	}
	type CreateMarry = [number];



	/*姻缘发布姻缘墙返回*/
	const enum ReleaseMarryWallFields {
		result = 0,
	}
	type ReleaseMarryWallReply = [number];

	/**姻缘墙列表返回*/
	const enum GetMarryWallListReplyFields {
		code = 0,
		list = 1,
	}
	type GetMarryWallListReply = [number, Array<MarryWallInfo>];

	/**
	* 姻缘  姻缘墙
	*/
	const enum MarryWallInfoFields {
		name,             // 名字
		level,            // 等级
		agentId,          // 用户ID
		time,             // 发布时间
		msg,              // 留言
		vip,              // vip
		occ,              // 职业 性别     
		vipf,             // vip等级
		headImg,          // 头像
		cashGift,         // 心意礼 代币券数量
	}
	type MarryWallInfo = [string, number, number, number, string, number, number, number, number, number];

	/*姻缘分离返回*/
	const enum MarryDissolutionReplyFields {
		result = 0,
	}
	type MarryDissolutionReply = [number];

	/*姻缘结缘返回*/
	const enum CreateMarryReplyFields {
		result = 0,
	}
	type CreateMarryReply = [number];

	/*获取姻缘信息返回*/
	const enum GetMarryInfoReplyFields {
		uuid = 0,			/*姻缘id*/
		level = 1,
		exp = 2,
		member = 3,			/*姻缘成员信息*/
		marryTime = 4,		/*结缘时间*/
	}
	type GetMarryInfoReply = [string, number, number, Array<MarryMember>, number];

	const enum MarryMemberFields {
		name = 0,						/*名字*/
		agentId = 1,
		level = 2,						/*等级*/
		occ = 3,						/*职业*/
		fight = 4,						/*战力*/
		loginTime = 5,					/*上次登录时间*/
		state = 6,						/*是否在线  true在线*/
		vip = 7,						/*vip等级*/
		vipf = 8,
		isPublisher = 9,
	}
	type MarryMember = [string, number, number, number, number, number, boolean, number, number, boolean];


	/*获取姻缘等级奖励领取列表*/
	const enum GetLevelAwardListFields {
	}
	type GetLevelAwardList = null;
	/*姻缘领取等级奖励*/
	const enum GetLevelAwardFields {
		level = 0,			/*领取哪一级奖励*/
	}
	type GetLevelAward = [number];
	/*获取姻缘等级领取记录列表*/
	const enum GetLevelAwardListReplyFields {
		list = 0,			/*已领取的奖励 从0开始*/
	}
	type GetLevelAwardListReply = [Array<number>];
	/*领取姻缘等级奖励返回*/
	const enum GetLevelAwardReplyFields {
		result = 0,
	}
	type GetLevelAwardReply = [number];


	/*激活/升级信物*/
	const enum AddMarryKeepsakeFields {
		id = 0,			/*id*/
	}
	type AddMarryKeepsake = [number];

	/*激活/升级信物*/
	const enum GradeMarryKeepsakeFields {
		id = 0,			/*id*/
	}
	type GradeMarryKeepsake = [number];

	/**义戒信息 */
	const enum GetMarryRingInfoFields {
	}
	type GetMarryRingInfo = null;

	/**仙娃信息 */
	const enum GetMarryDollInfoFields {
	}
	type GetMarryDollInfo = null;

	/*获取信物*/
	const enum GetMarryKeepsakeInfoFields {
	}
	type GetMarryKeepsakeInfo = null;

	/*信物升级技能*/
	const enum AddMarryKeepsakeGradeSkillLevelFields {
		skillId = 0,			/*技能id*/
	}
	type AddMarryKeepsakeGradeSkillLevel = [number];

	/*姻缘 获取姻缘任务信息*/
	const enum GetMarryTaskInfoFields {
	}
	type GetMarryTaskInfo = null;

	/*培养义戒*/
	const enum FeedMarryRingFields {
	}
	type FeedMarryRing = null;

	/*培养仙娃*/
	const enum FeedMarryDollFields {
		id = 0,			/*仙娃id*/
	}
	type FeedMarryDoll = [number];

	/*义戒升级技能*/
	const enum AddMarryRingFeedSkillLevelFields {
		skillId = 0,			/*技能id*/
	}
	type AddMarryRingFeedSkillLevel = [number];

	/*获取义戒信息返回*/
	const enum GetMarryRingInfoReplyFields {
		feed = 0,			/*培养*/
	}
	type GetMarryRingInfoReply = [MarryRingFeed];

	/*培养义戒返回*/
	const enum FeedMarryRingReplyFields {
		result = 0,			/*返回值*/
		level = 1,			/*当前等级*/
		exp = 2,			/*当前经验值*/
	}
	type FeedMarryRingReply = [number, number, number];

	/*获取仙娃信息返回*/
	const enum GetMarryDollInfoReplyFields {
		feed = 0,			/*培养 仙龄*/
		grade = 1,			/*进阶*/
		refine = 2,			/*进补*/
		curShowId = 3,		/*当前外观id*/
	}
	type GetMarryDollInfoReply = [MarryDollFeed, MarryDollGrade, MarryDollRefine, number];

	/*仙娃进阶*/
	const enum MarryDollGradeFields {
		showId = 0,				/*id*/
		gradeList = 1,			/*进阶列表*/
		fighting = 2,			/*战力*/
		attr = 3,				/*总属性*/
		skillList = 4,			/*技能列表*/
	}
	type MarryDollGrade = [number, Array<MagicShowInfo>, number, Array<TypesAttr>, Array<SkillInfo>];

	/*宠物修炼/精灵修炼*/
	const enum MarryDollRefineFields {
		list = 0,			/*进补列表*/
		fighting = 1,		/*战力*/
		attr = 2,			/*总属性*/
	}
	type MarryDollRefine = [Array<MarryDollRefineInfo>, number, Array<TypesAttr>];

	const enum MarryDollRefineInfoFields {
		type = 0,			/*进补类型 0朱果,1紫花槐,2金钱参,3七彩莲*/
		level = 1,			/*等级*/
	}
	type MarryDollRefineInfo = [number, number];

	/*戒指技能升级返回*/
	const enum AddMarryRingFeedSkillLevelReplyFields {
		result = 0,			/*返回值*/
	}
	type AddMarryRingFeedSkillLevelReply = [number];

	/*
	* 仙娃培养
	*/
	const enum MarryDollFeedFields {
		feedList = 0,			/*培养列表 id,经验*/
		expList = 1,			/*经验值列表 id,经验*/
		skillList = 2,			/*技能列表*/
		fighting = 3,			/*战力*/
		attr = 4,				/*属性*/
	}
	type MarryDollFeed = [Array<[number, number]>, Array<[number, number]>, Array<SkillInfo>, number, Array<TypesAttr>];

	/*义戒培养*/
	const enum MarryRingFeedFields {
		level = 0,			/*培养等级*/
		exp = 1,			/*当前经验值*/
		skillList = 2,		/*技能列表*/
		fighting = 3,		/*战力*/
	}
	type MarryRingFeed = [number, number, Array<SkillInfo>, number];

	/*获取姻缘信息返回*/
	const enum GetMarryTaskInfoReplyFields {
		dailyList = 0,				/*每日任务列表*/
		lifelongList = 1,			/*终身任务列表*/
		marryRingId = 2,
	}
	type GetMarryTaskInfoReply = [Array<MarryTaskNode>, Array<MarryTaskNode>, number];

	/*姻缘 任务*/
	const enum MarryTaskFields {
		id = 0,				/*id*/
		state = 1,			/*状态 0未达成 1可领取 2已领取*/
		progress = 2,		/*进度*/
		selfProgress = 3,	/*自己的进度*/
		otherProgress = 4,	/*别人的进度*/
	}
	type MarryTaskNode = [number, number, number, number, number];

	/*姻缘培养*/
	const enum FeedMarryFields {
	}
	type FeedMarry = null;
	/*培养姻缘返回*/
	const enum FeedMarryReplyFields {
		result = 0,			/*返回值*/
		level = 1,			/*当前等级*/
		exp = 2			/*当前经验值*/

	}
	type FeedMarryReply = [number, number, number];

	/*获取信物信息返回*/
	const enum GetMarryKeepsakeInfoReplyFields {
		feed = 0,			/*培养*/
		rank = 1,			/*升阶*/
	}
	type GetMarryKeepsakeInfoReply = [MarryKeepsakeFeed, MarryKeepsakeGrade];

	/*信物培养*/
	const enum MarryKeepsakeFeedFields {
		feedList = 0,			/*培养列表*/
		fighting = 1,			/*战力*/
		attr = 2,				/*总属性*/
	}
	type MarryKeepsakeFeed = [Array<MagicShowInfo>, number, Array<TypesAttr>];

	/*信物进阶*/
	const enum MarryKeepsakeGradeFields {
		gradeList = 0,			/*进阶列表*/
		fighting = 1,			/*战力*/
		attr = 2,				/*总属性*/
		gradeSkillList = 3,		/*进阶技能列表*/
		coupleGradeList = 4,	/*队友进阶列表*/
		heartLevel = 5,			/*心有灵犀等级*/
	}
	type MarryKeepsakeGrade = [Array<MarryInfo>, number, Array<TypesAttr>, Array<SkillInfo>, Array<MarryInfo>, Array<MarryInfo>];

	const enum MarryInfoFields {
		id = 0,				/*id*/
		level = 1,			/*等级*/
	}
	type MarryInfo = [number, number];


	/*进阶信物返回*/
	const enum AddMarryKeepsakeReplyFields {
		result = 0,			/*返回值*/
	}
	type AddMarryKeepsakeReply = [number];

	/*激活/升级信物返回*/
	const enum GradeMarryKeepsakeReplyFields {
		result = 0,			/*返回值*/
	}
	type GradeMarryKeepsakeReply = [number];

	/*信物技能升级返回*/
	const enum AddMarryKeepsakeGradeSkillLevelReplyFields {
		result = 0,			/*返回值*/
	}
	type AddMarryKeepsakeGradeSkillLevelReply = [number];

	/*培养仙娃返回*/
	const enum FeedMarryDollReplyFields {
		id = 0,				/*仙娃id*/
		result = 1,			/*返回值*/
		level = 2,			/*当前等级*/
		exp = 3,			/*当前经验值*/
	}
	type FeedMarryDollReply = [number, number, number, number];

	/*激活/升级仙娃*/
	const enum GradeMarryDollFields {
		id = 0,			/*id*/
	}
	type GradeMarryDoll = [number];
	/*激活/升级仙娃返回*/
	const enum GradeMarryDollReplyFields {
		result = 0,			/*返回值*/
	}
	type GradeMarryDollReply = [number];

	/*仙娃培养升级技能*/
	const enum AddMarryDollFeedSkillLevelFields {
		skillId = 0,			/*技能id*/
	}
	type AddMarryDollFeedSkillLevel = [number];

	/*仙娃进阶升级技能*/
	const enum AddMarryDollGradeSkillLevelFields {
		skillId = 0,			/*技能id*/
	}
	type AddMarryDollGradeSkillLevel = [number];

	/*仙娃进补*/
	const enum RiseMarryDollRefineFields {
		type = 0,			/*0朱果,1紫花槐,2金钱参,3七彩莲*/
	}
	type RiseMarryDollRefine = [number];

	/*更换仙娃外观*/
	const enum ChangeMarryDollShowFields {
		showId = 0,			/*外观Id*/
	}
	type ChangeMarryDollShow = [number];

	/*仙娃培养技能升级返回*/
	const enum AddMarryDollFeedSkillLevelReplyFields {
		result = 0,			/*返回值*/
	}
	type AddMarryDollFeedSkillLevelReply = [number];

	/*仙娃进阶技能升级返回*/
	const enum AddMarryDollGradeSkillLevelReplyFields {
		result = 0,			/*返回值*/
	}
	type AddMarryDollGradeSkillLevelReply = [number];

	/*仙娃进补返回*/
	const enum RiseMarryDollRefineReplyFields {
		result = 0,			/*返回值*/
	}
	type RiseMarryDollRefineReply = [number];

	/*更换仙娃外观返回*/
	const enum ChangeMarryDollShowReplyFields {
		result = 0,			/*返回值*/
		showId = 1,			/*当前外观id*/
	}
	type ChangeMarryDollShowReply = [number, number];

	/*获取姻缘副本次数*/
	const enum GetMarryCopyTimesReplyFields {
		times = 0,
	}
	type GetMarryCopyTimesReply = [MarryCopyTimes];

	/*更新姻缘副本次数*/
	const enum UpdateMarryCopyTimesFields {
		times = 0,
	}
	type UpdateMarryCopyTimes = [MarryCopyTimes];

	const enum MarryCopyTimesFields {
		totalTimes = 0,			/*总次数*/
		remainTimes = 1,		/*剩余次数*/
		maxRecord = 2			/*自己最高纪录*/
	}
	type MarryCopyTimes = [number, number, number];

	/*获取姻缘副本次数*/
	const enum GetMarryCopyTimesFields {
	}
	type GetMarryCopyTimes = null;

	/*购买姻缘礼包*/
	const enum BuyMarryPackageFields {
		id = 0,			/*礼包ID*/
	}
	type BuyMarryPackage = [number];
	/*姻缘任务 领取奖励*/
	const enum GetMarryTaskAwardFields {
		id = 0,			/*任务ID*/
	}
	/*姻缘任务 */
	type GetMarryTaskAward = [number];
	/*姻缘任务 领取奖励返回*/
	const enum GetMarryTaskAwardReplyFields {
		result = 0,			/*返回值*/
	}
	type GetMarryTaskAwardReply = [number];
	/*购买姻缘礼包返回*/
	const enum BuyMarryPackageReplyFields {
		result = 0,			/*购买结果*/
	}
	type BuyMarryPackageReply = [number];
	/*姻缘 更新单个任务 daw*/
	const enum UpdateMarryTaskFields {
		task = 0,			/*任务*/
	}
	type UpdateMarryTask = [MarryTaskNode];

	/*更新信物信息*/
	const enum UpdateMarryKeepsakeInfoFields {
		feed = 0,			/*培养*/
		rank = 1,			/*升阶*/
	}
	type UpdateMarryKeepsakeInfo = [MarryKeepsakeFeed, MarryKeepsakeGrade];

	/*更新义戒信息*/
	const enum UpdateMarryRingInfoFields {
		feed = 0,			/*培养*/
	}
	type UpdateMarryRingInfo = [MarryRingFeed];

	/*更新仙娃信息*/
	const enum UpdateMarryDollInfoFields {
		feed = 0,			/*仙龄 培养*/
		grade = 1,			/*进阶*/
		refine = 2,			/*修炼 进补*/
		curShowId = 3,		/*当前外观id*/
	}
	type UpdateMarryDollInfo = [MarryDollFeed, MarryDollGrade, MarryDollRefine, number];

	const enum MarryCopyMonsterWareFields {
		curWare = 0,			/*当前波数*/
		state = 1,			/*false:不需要计时  true:需要计时*/
		jumpWare = 2,			/*跳跃波数*/
		finishWare = 3,			/*完成波数*/
		maxWare = 4,			/*最大波数*/
	}
	type MarryCopyMonsterWare = [number, boolean, number, number, number];

	/*广播姻缘怪物波数*/
	const enum BroadcastMarryCopyMonsterWareFields {
		monsterWare = 0,			/*怪物波数*/
	}
	type BroadcastMarryCopyMonsterWare = [MarryCopyMonsterWare];



	const enum GetFishGiftInfoFields {
		bigType = 0,		/*活动大类*/
	}
	type GetFishGiftInfo = [number];

	const enum GetFishGiftInfoReply_rewardFields {
		id = 0,			/*id*/
		recharge = 1,	/*充值档次*/
		state = 2,		/*状态(0不可领 1可领取 2已领取)*/
	}
	type GetFishGiftInfoReply_reward = [number, number, number];

	const enum GetLimitGiftInfoReplyFields {
		bigType = 0,		/*活动大类*/
		rewardList = 1,		/*奖励列表*/
	}
	type GetLimitGiftInfoReply = [number, Array<GetFishGiftInfoReply_reward>];

	const enum GainFishGiftFields {
		bigType = 0,		/*活动大类*/
		recharge = 1,		/*充值档次*/
	}
	type GainFishGift = [number, number];


	const enum GainFishGiftReplyFields {
		bigType = 0,		/*活动大类*/
		result = 1,			/*领取结果*/
	}
	type GainFishGiftReply = [number, number];

	/*探索兑换*/
	const enum GainFishCkFields {
		bugType = 0,		/*类型 0装备 1巅峰 2至尊 3仙符 4圣物 5:仙玉 6:庆典*/
		id = 1,			/*兑换id*/
		count = 1,			/*兑换数量*/
	}
	type GainFishCk = [number, number, number];

	const enum LimitXunbaoRankInfoFields {
		rank = 0,			/*排名*/
		name = 1,			/*角色名*/
		param = 2,			/*排行积分*/
		objId = 3,			/*角色id*/
		pgId = 4,			/*pgId(服务器id)*/
		occ = 5,			/*职业*/
		vip = 6,			/*VIP*/
		vipF = 7,			/*VIPF*/
		headImg = 8,        /*头像id*/
	}
	type LimitXunbaoRankInfo = [number, string, number, number, number, number, number, number, number];

	const enum LimitXunbaoRankInfoReplyFields {
		bigType = 0,                /*活动大类*/
		type = 1,                   /*类型: 0:个人*/
		endTime = 2,                /*结束时间戳(毫秒)*/
		nodeList = 3,           	/*排名列表*/
	}
	type LimitXunbaoRankInfoReply = [number, number, number, Array<LimitXunbaoRankInfo>];

	/*增加个人记录*/
	const enum AddLimitXunbaoSelfBroadcastFields {
		type = 0,				/*类型*/
		selfBroadcastList = 1,	/*个人记录*/
	}
	type AddLimitXunbaoSelfBroadcast = [number, Array<LimitXunbaoNote>];


	/*更新探索信息*/
	const enum UpdateLimitXunbaoInfoFields {
		type = 0,			/*类型*/
		blessing = 1,		/*祝福值*/
		coupon = 2,			/*代币*/
	}


	type UpdateLimitXunbaoInfo = [number, number, number];


	/*获取寻宝全服记录(限时寻宝)*/
	const enum GetLimitXunbaoServerBroadcastFields {
		type = 0,                        /*类型*/
	}
	type GetLimitXunbaoServerBroadcast = [number];
	/*获取探索全服记录返回*/
	const enum GetLimitXunbaoServerBroadcastReplyFields {
		type = 0,						/*类型*/
		svrBroadcastList = 1,			/*全服记录*/
	}
	type GetLimitXunbaoServerBroadcastReply = [number, Array<LimitXunbaoNote>];
	/*获取探索信息返回*/
	const enum GetLimitXunbaoInfoReplyFields {
		type = 0,				/*类型(小类)*/
		endTime = 1,			/*结束时间戳 -1:无时间限制*/
		blessing = 2,			/*祝福值*/
		coupon = 3,				/*代币 兑换货币（不展示）*/
		selfBroadcastList = 4,	/*个人记录*/
		score = 5,				/*垂钓值 / 积分*/
	}
	type GetLimitXunbaoInfoReply = [number, number, number, number, Array<LimitXunbaoNote>, number];
	/*获取勾选探索兑换提醒列表返回*/
	const enum GetLimitXunBaoHintReplyFields {
		hintList = 0,		/*勾选提醒id列表*/
	}
	type GetLimitXunBaoHintReply = Array<LimitXunbaoHint>;

	/*探索返回*/
	const enum RunLimitXunbaoReplyFields {
		type = 0,			/*类型(小类)*/
		result = 1,			/*返回值*/
		blessing = 2,		/*祝福值*/
		items = 3,			/*道具列表*/
		score = 4			/*积分*/
	}
	type RunLimitXunbaoReply = [number, number, number, Array<Items>, number];

	// 获取探索兑换列表
	const enum LimitXunBaoExchangeListReplyFields {
		bigType = 0, 	/**探索类型(大类)*/
		time = 1, 		/**探索兑换时间(-1:无限制) */
		listInfo = 2, 	/**探索兑换商品信息 */
	}
	type LimitXunBaoExchangeListReply = [number, number, Array<LimitXunBaoExchangeListNode>];

	//提示列表
	const enum LimitXunbaoHintFields {
		bigType = 0, 		/**探索类型(大类)*/
		hintList = 1,		/*勾选提醒id列表*/
	}
	type LimitXunbaoHint = [number, Array<number>];


	/**探索兑换列表信息 */
	const enum LimitXunBaoExchangeListNodeFields {
		id = 0, /**商品id */
		buyCount = 1, /**购买的商品数量 */
	}
	type LimitXunBaoExchangeListNode = [number, number];


	const enum LimitXunBaoExchangeReplyFields {
		bugType = 0,                /*类型(大类)*/
		result = 1,                        /*返回值*/
		id = 2,                                /*id*/
		limitCount = 3,                /*兑换购买次数*/
	}
	type LimitXunBaoExchangeReply = [number, number, number, number];


	/*获取探索信息*/
	const enum GetLimitXunbaoInfoFields {
		type = 0,			/*类型(小类)*/
	}
	type GetLimitXunbaoInfo = [number];

	/********限时探索  参数--开始********/
	//个人
	const enum LimitXunbaoNoteFields {
		name = 0,			/*角色名*/
		itemId = 1,			/*物品id*/
		count = 2,			/*物品数量*/
		grade = 3,			/*物品等级*/
	}
	type LimitXunbaoNote = [string, number, number, number];

	const enum GetLimitXunBaoCumulativeTaskInfoReplyFields {
		bigType = 0,			/*活动类型类型(大类)*/
		endTime = 1,			/*活动结束时间戳(毫秒)*/
		totalValue = 2,			/*累积数量*/
		rewardList = 3,			/*奖励列表*/
		smallType = 4,       /* 活动类型的（大类）子类 */

	}
	type GetLimitXunBaoCumulativeTaskInfoReply = [number, number, number, Array<LimitXunBaoCumulativeTaskReward>, number];


	const enum LimitXunBaoCumulativeTaskRewardFields {
		id = 0,			/*档位*/
		state = 1,		/*状态(0不可领 1可领取 2已领取)*/
		fulfilNum = 2,	/*完成任务次数*/
		progress = 3,/* 进度值 */
	}
	type LimitXunBaoCumulativeTaskReward = [number, number, number, number];

	const enum GetLimitXunBaoCumulativeTaskRewardReplyFields {
		bigType = 0,	/*活动类型类型(大类)*/
		result = 1,		/*领取结果*/
		smallType = 2,       /* 活动类型的（大类）子类 */

	}
	type GetLimitXunBaoCumulativeTaskRewardReply = [number, number, number];

	const enum GetLimitXunBaoContinuePayInfoReplyFields {
		bigType = 0,			/*活动大类*/
		totalMoney = 1,			/*充值金额*/
		endTime = 2,			/*活动结束时间戳*/
		rewardList = 3,			/*奖励列表*/
		progressList = 4,		/*每档进度*/
	}
	type GetLimitXunBaoContinuePayInfoReply = [number, number, number, Array<LimitXunBaoContinuePayReward>, Array<LimitXunBaoContinuePayProgress>];

	const enum LimitXunBaoContinuePayProgressFields {
		grade = 0,			/*档位*/
		day = 1,			/*第几天*/
	}
	type LimitXunBaoContinuePayProgress = [number, number];

	const enum LimitXunBaoContinuePayRewardFields {
		grade = 0,			/*档位*/
		day = 1,			/*第几天*/
		state = 2,			/*状态(0不可领 1可领取 2已领取)*/
	}
	type LimitXunBaoContinuePayReward = [number, number, number];
	const enum GetLimitXunBaoContinuePayRewardReplyFields {
		bigType = 0,		/*活动大类*/
		result = 1,			/*领取结果*/
	}
	type GetLimitXunBaoContinuePayRewardReply = [number, number];


	const enum GetLimitXunBaoCashGiftInfoReplyFields {
		bigType = 0,		/*活动大类*/
		endTime = 1,		/*结束时间戳(毫秒)*/
		rewardList = 2,		/*奖励列表*/
	}
	type GetLimitXunBaoCashGiftInfoReply = [number, number, Array<LimitXunBaoCashGiftReward>];

	/*获取限时探索-领取现金礼包列表信息*/
	const enum LimitXunBaoCashGiftRewardFields {
		id = 0,					  /*id*/
		recharge = 1,			 /*充值档次*/
		state = 2,				/*状态(0不可领 1可领取 2已领取)*/
		useCount = 3,          /*已领取次数*/
		restCount = 4,        /*可领奖次数*/
	}
	type LimitXunBaoCashGiftReward = [number, number, number, number, number];

	const enum GetLimitXunBaoCashGiftRewardReplyFields {
		bigType = 0,		/*活动大类*/
		result = 1,			/*领取结果*/
	}
	type GetLimitXunBaoCashGiftRewardReply = [number, number];

	const enum GetLimitXunBaoMallInfoReplyFields {
		bigType = 0,	/*活动大类*/
		endTime = 1,        /*结束时间戳(毫秒)*/
		listInfo = 2,        /*列表*/
	}
	type GetLimitXunBaoMallInfoReply = [number, number, Array<GetLimitXunBaoMallNode>];

	/*返回数据信息*/
	const enum GetLimitXunBaoMallNodeFields {
		id = 0,			/*id*/
		limitCount = 1,	/*购买次数*/
	}
	type GetLimitXunBaoMallNode = [number, number];
	/*购买返回*/
	const enum BuyLimitXunBaoMallItemReplyFields {
		bigType = 0,	/*活动大类*/
		result = 1,		/*返回值*/
		id = 2,			/*id*/
		limitCount = 3,	/*购买次数*/
	}
	type BuyLimitXunBaoMallItemReply = [number, number, number, number];
	/*探索*/
	const enum RunLimitXunbaoFields {
		type = 0,			/*类型(小类)*/
		grade = 1,			/*档次 0 1次 1 10次 2 50次*/
		// isBuy = 2,			/*是否自动购买true是、false否(暂时不开放)*/
	}
	// type RunLimitXunbao = [number, number, boolean];
	type RunLimitXunbao = [number, number];

	/*探索兑换*/
	const enum LimitXunBaoExchangeFields {
		bugType = 0,		/*类型(大类)*/
		id = 1,				/*兑换id*/
		count = 2,			/*兑换数量*/
	}
	type LimitXunBaoExchange = [number, number, number];
	/*获取勾选探索兑换提醒列表*/
	const enum GetLimitXunBaoHintFields {
		bigType = 0,			/*类型（-1，全部类型）*/
	}
	type GetLimitXunBaoHint = [number];

	/*勾选探索兑换提醒列表*/
	const enum LimitXunBaoExchangeHintFields {
		bigType = 0,		/*活动类型类型(大类)*/
		hintList = 1,		/*勾选id列表,所有勾选的都要发过去*/
		retType = 2,		/*返回的勾选列表类型id（-1，全部类型）*/
	}
	type SetLimitXunBaoExchangeHint = [number, Array<number>, number];
	// 获取探索兑换列表信息
	const enum LimitXunBaoExchangeListFields {
		bigType = 0, /*类型(大类)*/
	}
	type LimitXunBaoExchangeList = [number];
	/*获取限时探索-累计任务列表*/
	const enum GetLimitXunBaoCumulatepayInfoFields {
		bigType = 0,		/*活动类型类型(大类)*/
	}
	const enum GetLimitXunBaoCumulativeTaskInfoFields {
		bigType = 0,		/*活动类型类型(大类)*/
		smallType = 1,       /* 活动类型的（大类）子类 */
	}
	type GetLimitXunBaoCumulativeTaskInfo = [number, number];

	/* 每日单笔 */
	const enum GetLimitXunBaoDaySinglePayInfoFields {
		bigType = 0,                        /*活动大类*/
	}
	type GetLimitXunBaoDaySinglePayInfo = [number];

	const enum GetLimitXunBaoDaySinglePayRewardFields {
		bigType = 0,                /*活动大类*/
		id = 1,                                /*任务id*/
	}
	type GetLimitXunBaoDaySinglePayReward = [number, number];

	/*获取限时探索-累计任务列表*/
	const enum GetLimitXunBaoCumulatepayRewardFields {
		bigType = 0,	/*活动类型类型(大类)*/
		id = 1,			/*任务id*/
	}
	const enum GetLimitXunBaoCumulativeTaskRewardFields {
		bigType = 0,   /* 活动类型的大类 */
		id = 1,/* 任务id */
		smallType = 2, /* 活动类型（大类）的子类 */
	}
	type GetLimitXunBaoCumulativeTaskReward = [number, number, number];

	/*获取限时探索-累充列表*/
	const enum GetLimitXunBaoContinuePayInfoFields {
		bigType = 0,			/*活动大类*/
	}
	type GetLimitXunBaoContinuePayInfo = [number];

	/*获取限时探索-领取累充奖励*/
	const enum GetLimitXunBaoContinuepayRewardFields {
		bigType = 0,		/*活动大类*/
		grade = 1,			/*第几档*/
		day = 2,			/*第几天*/
	}
	type GetLimitXunBaoContinuePayReward = [number, number, number];

	const enum GetLimitXunBaoCashGiftInfoFields {
		bigType = 0,		/*活动大类*/
	}
	type GetLimitXunBaoCashGiftInfo = [number];

	/*获取限时探索-领取现金礼包奖励*/
	const enum GetLimitXunBaoCashGiftRewardFields {
		bigType = 0,		/*活动大类*/
		recharge = 1,		/*充值档次*/
	}
	type GetLimitXunBaoCashGiftReward = [number, number];
	/*获取信息*/
	const enum GetLimitXunBaoMallInfoFields {
		bigType = 0,		/*活动大类*/
	}
	type GetLimitXunBaoMallInfo = [number];
	/*购买*/
	const enum BuyLimitXunBaoMallItemFields {
		bigType = 0,	/*活动大类*/
		id = 1,			/*id*/
		count = 2,		/*数量*/
	}
	type BuyLimitXunBaoMallItem = [number, number, number];

	/*获取限时探索排名数据*/
	const enum GetLimitXunbaoRankInfoFields {
		bigType = 0, /*类型(大类)*/
		type = 1,        /*类型 0个人 1区服*/
	}
	type GetLimitXunbaoRankInfo = [number, number];

	/*获取限时寻宝-每日累充列表*/
	const enum GetLimitXunBaoDayCumulatePayInfoFields {
		bigType = 0,                        /*活动大类*/
	}
	type GetLimitXunBaoDayCumulatePayInfo = [number];

	const enum GetLimitXunBaoDayCumulatePayInfoReplyFields {
		bigType = 0,                        /*活动大类*/
		totalMoney = 1,                        /*充值金额*/
		endTime = 2,                        /*活动结束时间戳*/
		useDay = 3,                                /*使用配置表天数*/
		rewardList = 4,                        /*奖励列表*/
	}
	type GetLimitXunBaoDayCumulatePayInfoReply = [number, number, number, number, Array<CumulatepayReward>];

	const enum GetLimitXunBaoCumulatePayInfoReplyFields {
		bigType = 0,                        /*活动大类*/
		totalMoney = 1,                        /*充值金额*/
		endTime = 2,                        /*活动结束时间戳*/
		rewardList = 3,                        /*奖励列表*/
	}
	type GetLimitXunBaoCumulatePayInfoReply = [number, number, number, Array<CumulatepayReward>];
	const enum daySinglePayRewardFields {
		id = 0,                                        /*档位id*/
		useCount = 1,                        /*已领数量*/
		restCount = 2,                        /*未领数量*/
	}
	type daySinglePayReward = [number, number, number];
	const enum GetLimitXunBaoDaySinglePayInfoReplyFields {
		bigType = 0,                        /*活动大类*/
		endTime = 1,                        /*活动结束时间戳*/
		useDay = 2,                                /*使用配置表天数*/
		rewardList = 3,                        /*奖励列表*/
	}
	type GetLimitXunBaoDaySinglePayInfoReply = [number, number, number, Array<daySinglePayReward>];

	const enum GetLimitXunBaoDaySinglePayRewardReplyFields {
		bigType = 0,                /*活动大类*/
		result = 1,                        /*领取结果*/
	}
	type GetLimitXunBaoDaySinglePayRewardReply = [number, number];

	/*获取限时寻宝-每日累充列表*/
	const enum GetLimitXunBaoDayCumulatePayRewardFields {
		bigType = 0,                /*活动大类*/
		id = 1,                                /*任务id*/
	}
	type GetLimitXunBaoDayCumulatePayReward = [number, number];

	const enum GetLimitXunBaoDayCumulatePayRewardReplyFields {
		bigType = 0,                /*活动大类*/
		result = 1,                        /*领取结果*/
	}
	type GetLimitXunBaoDayCumulatePayRewardReply = [number, number];

	//累消费
	const enum GetLimitXunBaoCumulatePayRewardFields {
		bigType = 0,                /*活动大类*/
		id = 1,                                /*任务id*/
	}
	type GetLimitXunBaoCumulatePayReward = [number, number];

	const enum GetLimitXunBaoCumulatePayRewardReplyFields {
		bigType = 0,                /*活动大类*/
		result = 1,                        /*领取结果*/
	}
	type GetLimitXunBaoCumulatePayRewardReply = [number, number];

	const enum GetLimitXunBaoCumulatePayInfoFields {
		bigType = 0,                        /*活动大类*/
	}
	type GetLimitXunBaoCumulatePayInfo = [number];

	/*获取数据*/
	const enum GetFishInfoFields {
		type = 0,			/*类型(小类)*/
	}
	type GetFishInfo = [number];

	const enum GetFishListReplyFields {
		name = 0,			/*角色名*/
		itemId = 1,			/*物品id*/
		count = 2,			/*物品数量*/
		grade = 3,			/*物品等级*/
	}
	type GetFishListReply = [string, number, number, number];

	/*获取数据*/
	const enum GainFishFields {
		type = 0,			/*类型(小类)*/
		grade = 1			/*档次 0 1次 1 10次 2 50次*/
	}
	type GainFish = [number, number];

	/*获取限时探索-累充列表*/
	const enum GetFishLinkInfoFields {
		bigType = 0,			/*活动大类*/
	}
	type GetFishLinkInfo = [number];

	/*七日活动-获取数据*/
	const enum GetSevenActivityDatasFields { }
	type GetSevenActivityDatas = null;

	/*七日活动-领取奖励*/
	const enum GetSevenActivityAwardFields {
		day = 0,    //天数
		id = 1,  //任务id
	}
	type GetSevenActivityAward = [number, number];

	/*设置副本自动鼓舞状态*/
	const enum SetAutoInspireFields {
		sceneType = 0,		/*场景类型 SceneTypeEx*/
		type = 1,			/*1:代币券 3:金币*/
		auto = 2,			/*1:自动 0:不自动*/
	}
	type SetAutoInspire = [number, number, boolean];

	/*获取自动鼓舞状态*/
	const enum GetAutoInspireFields {
	}
	type GetAutoInspire = null;

	// ###基础：
	const enum GetLimitLinkInfoReply_rewardFields {
		grade = 0,			/*档位*/
		day = 1,			/*第几天*/
		state = 2,			/*状态(0不可领 1可领取 2已领取)*/
	}
	type GetLimitLinkInfoReply_reward = [number, number, number];
	const enum GetFishLinkInfoReply_progressFields {
		grade = 0,			/*档位*/
		day = 1,			/*第几天*/
	}
	type GetFishLinkInfoReply_progress = [number, number];
	// ###整体：
	const enum GetLimitLinkInfoReplyFields {
		bigType = 0,			/*活动大类*/
		totalMoney = 1,			/*充值金额*/
		endTime = 2,			/*活动结束时间戳*/
		rewardList = 3,			/*奖励列表*/
		progressList = 4,		/*每档进度*/
	}
	type GetLimitLinkInfoReply = [number, number, number, Array<GetLimitLinkInfoReply_reward>, Array<GetFishLinkInfoReply_progress>];

	const enum GainFishLinkFields {
		bigType = 0,		/*活动大类*/
		grade = 1,			/*第几档*/
		day = 2,			/*第几天*/
	}
	type GainFishLink = [number, number, number];

	const enum GainFishLinkReplyFields {
		bigType = 0,		/*活动大类*/
		result = 1,			/*领取结果*/
	}
	type GainFishLinkReply = [number, number];

	// 七日活动领取奖励
	const enum SevenActivityGetAwardReplyFields {
		code = 0,  //错误码  43225-配置不存在
		day = 1,    //天数
		id = 2,  	//任务id
	}
	type SevenActivityGetAwardReply = [number, number, number];

	// 七天任务数据
	const enum SevenActivityTasksDataFields {
		count = 0,    			//完成进度
		isAwd = 1,  			//领取 标识  0不可领取  1可领取  2已领取
		id = 2,                	//任务id
		day = 3,        		//天数
	}
	type SevenActivityTasksData = [number, number, number, number]

	const enum SevenActivityBaseDatasReplyFields {
		endTime = 0, 					//结束时间
		tasksData = 1,					//任务数据
	}
	type SevenActivityBaseDatasReply = [number, Array<SevenActivityTasksData>]

	/*获取副本自动鼓舞返回*/
	const enum GetAutoInspireReplyFields {
		inspires = 0,			/*鼓舞副本*/
	}
	type GetAutoInspireReply = [Array<AutoInspire>];

	/*自动鼓舞*/
	const enum AutoInspireFields {
		sceneType = 0,		/*场景类型 SceneTypeEx*/
		copper = 1,			/*金币 1:自动 0:不自动*/
		gold = 2,			/*代币券 1:自动 0:不自动*/
	}
	type AutoInspire = [number, number, number];

	const enum ShiftMsgFields {
		targetObjId = 0,                        /*移动者*/
		startPos = 1,
		endPos = 2,
	}
	type ShiftMsg = [number, Pos, Pos]


	const enum AutoSC_DiShuTask_listFields {
		TaskType = 0,    // 任务类型 1,:个人 2,：全服
		Condition = 1,   // 领取条件
		TaskAwd = 2, // 每层奖励列表 [道具ID = #道具数量]
		id = 3,
		status = 4,
	}
	type AutoSC_DiShuTask_list = [number, number, Array<Items>, number, number]

	// 地鼠活动
	type AutoSC_DiShuTask = Array<number>                                      /**地鼠任务奖励领取标识 K值对应任务配置id V值=1已领取*/

	const enum AutoSC_DiShuItemFields {
		Type = 0,                                                               /**1未领取2已领取3无效道具*/
		id = 1,                                                                 /**道具id*/
		count = 2,                                                              /**道具数量*/
		violence = 3,                                                           /**暴击*/
	}
	type AutoSC_DiShuItem = [number, number, number, number]        /***/

	type AutoSC_DiShuInfo = Array<Array<AutoSC_DiShuItem>>                     /**地鼠2维数组列表*/
	/**终极奖励列表*/
	const enum AutoSC_DiShuTimateListFields {
		Num = 0,                                                                /**剩余选择次数*/
		Item = 1,                                                               /**道具消息*/
	}
	type AutoSC_DiShuTimateList = [number, Items]                               /**终极奖励列表*/

	/**地鼠活动数据*/
	const enum AutoSC_DiShuDataFields {
		Level = 0,                                                              /**层数*/
		DiShuData = 1,                                                          /**地鼠列表*/
		RowAwd = 2,                                                             /**行奖励领取标识*/
		Ultimate = 3,                                                           /**终极奖励*/
		DiShuTask = 4,                                                          /**地鼠任务数据[个人任务数据#全服任务数据]*/
		OpenCount = 5,                                                          /**打地鼠累积次数*/
		ItemCount = 6,                                                          /**消耗数量*/
		timateList = 7,                                                         /**终极奖励列表*/
		ServerCount = 8,                                                        /**全服打地鼠累积次数*/
		openTime = 9,                                                           /**开始时间*/
		getEndTime = 10,                                                        /**结束时间*/
		showEndTime = 11,                                                       /**显示结束时间*/
		isShow = 12,                                                            /**是否显示活动图标*/
	}
	type AutoSC_DiShuData = [number, AutoSC_DiShuInfo, Array<number>, AutoSC_DiShuItem, Array<AutoSC_DiShuTask>, number, number, Array<AutoSC_DiShuTimateList>, number, number, number, number, boolean]/**地鼠活动数据*/
	const enum AutoSC_DiShuOpenOpenFields {
		row = 0,
		line = 1,
		b = 2			/*是否暴击*/
	}
	type AutoSC_DiShuOpenOpen = [number, number, number];
	/**砸地鼠消息返回*/
	const enum AutoSC_DiShuOpenFields {
		ErrorCode = 0,                                                          /**返回码*/
		Open = 1,                                                               /**本次开启的列表坐标[x#y#是否暴击]*/
	}
	type AutoSC_DiShuOpen = [ErrorCode, Array<AutoSC_DiShuOpenOpen>]          /**砸地鼠消息返回*/

	const enum AutoSC_DiShuRowAwdRetFields {
		ErrorCode = 0,
		rowLine = 1
	}
	type AutoSC_DiShuRowAwdRet = [ErrorCode, number]                                   /**领取行奖励返回*/

	type AutoSC_DiShuUltimateAwdRet = [ErrorCode]                              /**领取终极奖励返回*/

	const enum RankUserBaseInfoFields {
		rank = 0,			/*排名*/
		name = 1,			/*角色名*/
		param = 2,			/*排行积分*/
		objId = 3,			/*角色id*/
		pgId = 4,			/*pgId(服务器id)*/
		occ = 5,			/*职业*/
		vip = 6,			/*VIP*/
		vipF = 7,			/*VIPF*/
	}
	type RankUserBaseInfo = [number, string, number, number, number, number, number, number];
	type RankUserBaseInfoList = [Array<RankUserBaseInfo>]
	type AutoSC_DiShuRankRet = [RankUserBaseInfoList]                          /**排行榜数据返回*/

	/**砸地鼠xy*/
	const enum AutoUF_DiShuOpenFields {
		x = 0,                                                                  /**x*/
		y = 1,                                                                  /**y*/
	}
	type AutoUF_DiShuOpen = [number, number]                                    /**砸地鼠xy*/

	type AutoUF_DiShuGetdata = []                                              /**获取地鼠活动配置*/

	type AutoUF_DiShuOpenAll = []                                              /**一键自动砸地鼠*/

	type AutoUF_DiShuRowAwd = [number]                                         /**领取行奖励[id]*/

	type AutoUF_DiShuUltimateAwd = []                                          /**领取终极奖励*/

	/**领取任务奖励*/
	const enum AutoUF_DiShuTaskAwdFields {
		type = 0,                                                               /**1个人奖励 2全服奖励*/
		id = 1,                                                                 /**奖励id*/
	}
	type AutoUF_DiShuTaskAwd = [number, number]                                 /**领取任务奖励*/

	type AutoUC_GetDiShuRank = []                                          /**领取终极奖励*/
	type AutoUF_SelectUltimate = [number]                                      /**选择终极奖励[索引]*/
	const enum AutoSC_SelectUltimateRetFields {
		ErrorCode = 0,
		index = 1,
	}
	type AutoSC_SelectUltimateRet = [ErrorCode, number]                                /**选择终极奖励返回*/

	const enum AutoSC_GetTaskAwdFields {
		ErrorCode = 0,                                                               /**1个人奖励 2全服奖励*/
		data = 1,                                                                 /**奖励id*/
	}
	type AutoSC_GetTaskAwd = [ErrorCode, AutoUF_DiShuTaskAwd]                          /**领取任务奖励返回*/

	/* 每日单笔 */
	/*获取数据*/
	// LimitXunBaoDaySinglePay
	// const enum Getlimit_day_singleInfoFields {
	// }
	// type Getlimit_day_singleInfo = null;

	// /*返回数据*/
	// const enum Getlimit_day_singleInfoReplyFields {
	// 	rewardList = 0,		/*奖励列表*/
	// 	endTime = 1,		/*活动结束时间(毫秒)*/
	// }
	// type Getlimit_day_singleInfoReply = [Array<limit_day_singleReward>, number];



	// /*奖励列表*/
	// const enum limit_day_singleRewardFields {
	// 	id = 0,			/*档位*/
	// 	useCount = 1,			/*已领数量*/
	// 	restCount = 2,			/*可领数量*/
	// }
	type limit_day_singleReward = [number, number, number];

	/*领取奖励*/
	const enum Getlimit_daysingleRewardFields {
		id = 0,			/*id*/
	}
	type Getlimit_daysingleReward = [number];

	/*领取奖励返回*/
	const enum Getlimit_daysingleRewardReplyFields {
		result = 0,			/*领取结果*/
	}
	type Getlimit_day_singleRewardReply = [number];


	/* 每日累充 */
	const enum LimitDayCumulateRewardFields {
		id = 0,			/*档位*/
		state = 1,			/*状态(0不可领 1可领取 2已领取)*/
	}
	type LimitDayCumulateReward = [number, number];

	/*更新数据*/
	const enum UpdateLimitDayCumulateInfoFields {
		state = 0,			/*开启状态(0未开启 1开启)*/
		totalMoney = 1,			/*充值金额*/
		rewardList = 2,			/*奖励列表*/
		restTm = 3,			/*剩余时间(毫秒)*/
		serverDay = 4,			/*开服第几天*/
	}
	type UpdateLimitDayCumulateInfo = [number, number, Array<CumulatepayReward>, number, number];

	const enum limit_cumulateRewardFields {
		index = 0,			/*档位*/
		state = 1,			/*状态(0不可领 1可领取 2已领取)*/
	}
	type limit_cumulateReward = [number, number];

	/*玩家传送*/
	const enum UserTransferFields {
		gatherObjId = 0,			/*传送目的 采集id*/
	}
	type UserTransfer = [number];

	/*更新采集状态*/
	const enum UpdateGatherInfoReplyFields {
		restult = 0,			/*当前状态 0开始采集 1开始运送 2运送完成 -1恢复默认*/
		pos = 1,
	}
	type UpdateGatherInfoReply = [number, Pos];
	/*更新争夺战积分*/
	const enum UpdateTeamBattleInfoFields {
		list = 0,			/*队伍*/
	}
	type UpdateTeamBattleInfo = [Array<copyTeamBattleInfo>];

	/*获取首领战排行榜返回*/
	const enum GetTeamChiefRankListReplyFields {
		status = 0,
		obj = 1,
		team = 2,
		rank = 3
	}
	type GetTeamChiefRankListReply = [number, Array<TeamChiefRank>, Array<TeamChiefRank>, [[number, number], [number, number]]];

	/*争夺战结束返回*/
	const enum TeamBattleCopyFinishReplyFields {
		list = 0,		/*名单列表*/
		teamScore = 1,
		rank = 2,		/*排名*/
	}
	type TeamBattleCopyFinishReply = [Array<TeamBattleRank>, number, number];


	const enum TeamBattleRankFields {
		name = 0,			/*名字*/
		score = 1,			/*积分*/
	}
	type TeamBattleRank = [string, number];

	/*更新争夺战积分info*/
	const enum copyTeamBattleInfoFields {
		name = 0,			/*名字*/
		score = 1,			/*当前积分*/
		maxScore = 2,		/*最大积分*/
		index = 3,			/*队伍位置*/
	}
	type copyTeamBattleInfo = [string, number, number, number];
	const enum TeamChiefRankFields {
		name = 0,			/*名字*/
		hurt = 1,			/*伤害*/

	}
	type TeamChiefRank = [string, number];

	/*首领战结束通知*/
	const enum ChiefCopyFinishReplyFields {

	}
	type ChiefCopyFinishReply = null;

	/*更新积分*/
	const enum UpdateTeanBattleScoreFields {
		addScore = 0,			/*添加的积分*/
	}
	type UpdateTeanBattleScore = [number];
	/*领取伤害奖励返回*/
	const enum GetTeamChiefHurtAwardReplyFields {
		result = 0,
	}
	type GetTeamChiefHurtAwardReply = [number];

	/*领取积分奖励返回*/
	const enum GetTeamChiefScoreAwardReplyFields {
		result = 0,
	}
	type GetTeamChiefScoreAwardReply = [number];

	/*更新复活*/
	const enum UpdateTeamBattleRebornFields {
		time = 0,			/*剩余时间*/
	}
	type UpdateTeamBattleReborn = [number];


	/*领取任务奖励返回*/
	const enum GetAchievementTaskAwardReplyFields {
		result = 0,			/*返回值*/
	}
	type GetAchievementTaskAwardReply = [number];

	/*玩家传送返回*/
	const enum UserTransferReplyFields {
		result = 0,
	}
	type UserTransferReply = [number];

	/*获取伤害奖励列表*/
	const enum GetTeamChiefHurtReplyFields {
		hurt = 0,			/*伤害值*/
		list = 1,			/*已领取的奖励 从0开始*/
	}
	type GetTeamChiefHurtReply = [number, Array<number>];


	/*获取积分奖励列表*/
	const enum GetTeamChiefScoreReplyFields {
		score = 0,			/*伤害值*/
		list = 1,			/*已领取的奖励 从0开始*/
	}
	type GetTeamChiefScoreReply = [number, Array<number>];

	/*成就任务*/
	const enum UpdateAchievementTaskFields {
		task = 0,			/*任务*/
	}
	type UpdateAchievementTask = [AchievementNode];

	/*获取伤害奖励列表*/
	const enum GetTeamChiefHurtAwardListFields {
	}
	type GetTeamChiefHurtAwardList = null;
	/*获取准备副本信息*/
	const enum GetTeamPrepareCopyInfoFields {
	}
	type GetTeamPrepareCopyInfo = null;

	/*领取伤害奖励*/
	const enum GetTeamChiefHurtAwardFields {
		index = 0,			/*领取哪一档，0开始*/
	}
	type GetTeamChiefHurtAward = [number];

	const enum GetAchievementInfoFields {
	}
	type GetAchievementInfo = null;

	/*领取任务奖励*/
	const enum GetAchievementTaskAwardFields {
		id = 0,			/*任务id*/
	}
	type GetAchievementTaskAward = [number];

	/*获取积分奖励列表*/
	const enum GetTeamChiefScoreAwardListFields {
	}
	type GetTeamChiefScoreAwardList = null;

	/*领取积分奖励*/
	const enum GetTeamChiefScoreAwardFields {
		index = 0,			/*领取哪一档，0开始*/
	}
	type GetTeamChiefScoreAward = [number];

	/*获取首领战副本信息*/
	const enum GetTeamChiefCopyInfoFields {
	}
	type GetTeamChiefCopyInfo = null;
	type GetTeamChiefRankList = null;
	type GetTeamBattleCopyStatus = null;

	const enum BroadcastDataFields {
		objId = 0,
		pos = 1,
		pixelPos = 2,
		desPos = 3,
	}
	type BroadcastData = [number, [number, number], [number, number], [number, number]];

	type GetTeamBattleWorshipInfo = null;
	type GetTeamBattleWorship = null;
	/* 获取膜拜信息 */
	const enum GetTeamBattleWorshipInfoReplyFields {
		teamName = 0,			/* 队伍名称 */
		leaderName = 1,			/* 队长名字 */
		leaderId = 2,			/* 队长ID */
		leaderPgId = 3,			/* 队长 服ID */
		is = 4,					/* 是否膜拜过 */
	}
	type GetTeamBattleWorshipInfoReply = [string, string, number, number, boolean];

	/* 获取膜拜结果 */
	const enum GetTeamBattleWorshipReplyFields {
		result = 0,			/* 结果 */
	}
	type GetTeamBattleWorshipReply = [number];


	/***************************************User命令***************************************/

	const enum UserNexusOpcode {
		AuthClient = 0x100000,			/*客户端认证*/
		ActorLogin = 0x100001,			/*玩家登陆*/
		LoadComplate = 0x100002,			/*客户端加载完成*/
		LoginComplete = 0x100003,			/*客户端登录完成*/
		ClientPing = 0x100064,			/*ping*/
		SynTime = 0x100065,			/*同步时间*/
	}

	const enum UserFeatureOpcode {
		GetActorBaseAttr = 0x200000,			/*获取玩家基本属性*/
		GMCommand = 0x200001,			/*GM 指令*/
		GetActorEquip = 0x200002,			/*获取角色装备*/
		WearEquip = 0x200003,			/*穿戴装备*/
		FastWearEquip = 0x200004,			/*一键快速穿戴*/
		GetTask = 0x200005,			/*获取任务*/
		GetTaskAward = 0x200006,			/*领取任务奖励*/
		ReqEnterScene = 0x200007,			/*请求进入场景*/
		GetCopyTianguan = 0x200008,			/*获取天关副本*/
		GetCopyAward = 0x200009,			/*领取副本奖励*/
		SweepCopy = 0x20000a,			/*扫荡副本*/
		GetActionOpen = 0x20000b,			/*获取功能开启*/
		BuyTimes = 0x20000c,			/*购买副本次数*/
		GetCopyTimes = 0x20000d,			/*获取副本次数*/
		GetOpenBoxTimes = 0x20000e,			/*获取开启宝箱次数*/
		GetTeamCopyTimes = 0x20000f,			/*获取组队副本次数*/
		GetCopyRune = 0x200010,			/*获取远古符阵副本*/
		GetRuneEveryDayAward = 0x200011,			/*领取远古符阵副本每日奖励*/
		GetRuneDial = 0x200012,			/*获取远古符阵转盘*/
		StartRuneDial = 0x200013,			/*远古符阵转盘开始*/
		GetSceneState = 0x200014,			/*获取场景状态*/
		RunActorOper = 0x200015,			/*玩家某些操作(类似埋点)*/
		GetGuideList = 0x200016,			/*获取所有完成的指引*/
		FinishGuide = 0x200017,			/*完成指引*/
		TriggerGuide = 0x200018,			/*触发指引，后台记录用*/
		GetActionPreviesHaveReceived = 0x200019,			/*获取功能预览已领取的id*/
		GetActionPreviesAward = 0x20001a,			/*领取功能预览奖励*/
		GetServerDay = 0x20001b,			/*获取开服第几天*/
		GetActionState = 0x20001c,			/*获取功能开启状态*/
		GetEquipSuit = 0x20001d,			/*获取装备套装信息*/
		LightenUp = 0x20001e,			/*点亮部位*/
		OneKeySweepShilianCopy = 0x20001f,			/*一键扫荡试炼副本*/
		OneKeyChallengeShilianCopy = 0x200020,			/*一键挑战试炼副本*/
		GetSetNameInfo = 0x200021,			/*获取设置名字信息*/
		SetNameOcc = 0x200022,			/*设置名字职业*/
		GetBag = 0x200064,			/*获取背包*/
		TaskXunbaoBagItemList = 0x200065,			/*取探索仓库物品到背包*/
		TaskXunbaoBagAllItem = 0x200066,			/*取探索仓库所有*/
		useBagItem = 0x200067,			/*使用背包物品*/
		TaskXianYuXunbaoBagItemList = 0x200068,			/*取仙玉探索仓库物品到背包*/
		TaskXianYuXunbaoBagAllItem = 0x200069,			/*取仙玉探索仓库所有*/
		GetPetInfo = 0x2000c8,			/*获取宠物*/
		FeedPet = 0x2000c9,			/*喂养宠物*/
		RankPet = 0x2000ca,			/*升阶宠物*/
		AddPetSkillLevel = 0x2000cb,			/*激活/升级技能*/
		ChangePetShow = 0x2000cc,			/*更换升阶外观*/
		RiseMagicShow = 0x2000cd,			/*激活/升星*/
		ChangeMagicShow = 0x2000ce,			/*更换幻化外观*/
		RiseRefine = 0x2000cf,			/*升级修炼*/
		AddPetFazhen = 0x2000d0,			/*激活/升级法阵*/
		ChangePetFazhen = 0x2000d1,			/*更换法阵外观*/
		GetRideInfo = 0x20012c,			/*获取精灵*/
		FeedRide = 0x20012d,			/*喂养精灵*/
		RankRide = 0x20012e,			/*升阶精灵*/
		AddRideSkillLevel = 0x20012f,			/*激活/升级技能*/
		ChangeRideShow = 0x200130,			/*更换升阶外观*/
		RiseRideMagicShow = 0x200131,			/*激活/升星*/
		ChangeRideMagicShow = 0x200132,			/*更换幻化外观*/
		RiseRideRefine = 0x200133,			/*升级修炼*/
		AddRideFazhen = 0x200134,			/*激活/升级法阵*/
		ChangeRideFazhen = 0x200135,			/*更换法阵外观*/
		GetSoulInfo = 0x200190,			/*获取金身*/
		RefineSoul = 0x200191,			/*修炼金身*/
		RiseSoul = 0x200192,			/*修炼不败金身*/
		GetAmuletInfo = 0x2001f4,			/*获取圣物*/
		RefineAmulet = 0x2001f5,			/*激活/升级圣物*/
		GetGemInfo = 0x200258,			/*获取仙石*/
		InlayGem = 0x200259,			/*镶嵌仙石*/
		RefineGem = 0x20025a,			/*升级仙石*/
		RiseGem = 0x20025b,			/*升级仙石大师*/
		GemOneKeyOperation = 0x20025c,			/*仙石一键操作*/
		GemReplace = 0x20025d,			/*替换仙石*/
		GetSkills = 0x2002bc,			/*获取角色技能*/
		AddSkillLevel = 0x2002bd,			/*升级角色技能*/
		AddSkillLevelOfAll = 0x2002be,			/*一键升级角色技能*/
		OpenSkill = 0x2002bf,			/*激活角色技能*/
		GetSign = 0x200320,			/*获取签到信息*/
		Sign = 0x200321,			/*签到*/
		GetSignAward = 0x200322,			/*领取签到奖励*/
		GetSingleBossCopy = 0x200323,			/*获取单人BOSS副本*/
		GetSevenDay = 0x200384,			/*获取七日礼*/
		GetSevenDayAward = 0x200385,			/*领取七日礼*/
		GetOnlineReward = 0x200578,			/*获取在线礼包*/
		GetOnlineRewardAward = 0x200579,			/*领取*/
		GetDahuangCopy = 0x2003e8,			/*获取大荒古塔*/
		GetBossTimes = 0x2003e9,			/*获取BOSS次数*/
		GetFollowBoss = 0x2003ea,			/*获取关注的BOSS*/
		SetFollowBoss = 0x2003eb,			/*设置关注BOSS*/
		GetBossIsFirst = 0x2003ec,			/*获取多人BOSS是否第一次打，引导用*/
		GetEraInfo = 0x20044c,			/*获取觉醒信息*/
		Era = 0x20044d,			/*觉醒*/
		EraBoss = 0x20044e,			/*觉醒boss*/
		FastEra = 0x20044f,			/*觉醒丹*/
		DrawEraTask = 0x200450,			/*领取任务奖励*/
		GetStrongInfo = 0x2004b0,			/*获取强化*/
		RefineStrong = 0x2004b1,			/*强化升级*/
		RefineStrongOfAll = 0x2004b2,			/*一键强化升级*/
		RiseStrong = 0x2004b3,			/*升级强化大师/神匠*/
		GetZhuhunInfo = 0x20190a,			/*获取数据*/
		ZhuhunOper = 0x20190b,			/*铸魂*/
		ZhuhunOperOneKey = 0x20190c,			/*一键铸魂*/
		ShihunOper = 0x20190d,			/*噬魂*/
		ShihunOperOneKey = 0x20190e,			/*一键噬魂*/
		Compose = 0x200514,			/*合成*/
		ComposeAll = 0x200518,			/*一键合成*/
		Resolve = 0x200515,			/*分解*/
		GetSmeltInfo = 0x200516,			/*获取熔炼*/
		Smelt = 0x200517,			/*熔炼*/
		GetLilianInfo = 0x2005dc,			/*获取历练信息*/
		GetLilianTaskAward = 0x2005dd,			/*领取历练任务奖励*/
		GetLilianDayAward = 0x2005de,			/*领取历练日奖励*/
		GetXianweiInfo = 0x200640,			/*获取仙位信息*/
		GetXianweiTaskAward = 0x200641,			/*领取任务奖励*/
		GetXianweiDayAward = 0x200642,			/*领取日奖励*/
		GetKuanghaiInfo = 0x202206,			/*获取狂嗨信息*/
		GetKuanghai2Info = 0x2021a8,			/*获取狂嗨信息*/
		GetKuanghaiTaskAward = 0x202207,			/*领取任务奖励*/
		GetKuanghai2TaskAward = 0x2021a9,			/*领取任务奖励*/
		GetKuanghaiAward = 0x202208,			/*领取奖励*/
		GetKuanghai2Award = 0x2021aa,			/*领取奖励 daw*/


		JumpKuanghai2Task = 0x2021ab,                        /*狂嗨2 daw 直接完成任务*/
		GetKuanghai2FinalReward = 0x2021ac,                        /*狂嗨2 daw 最终奖励*/



		GetShenbingInfo = 0x2006a4,			/*获取神兵*/
		FeedShenbing = 0x2006a5,			/*喂养神兵*/
		AddShenbingSkillLevel = 0x2006a6,			/*激活/升级技能*/
		AddShenbingMagicShow = 0x2006a7,			/*激活/升级幻化*/
		ChangeShenbingMagicShow = 0x2006a8,			/*更换幻化外观*/
		AddShenbingRefine = 0x2006a9,			/*升级修炼*/
		GetWingInfo = 0x200708,			/*获取仙翼*/
		FeedWing = 0x200709,			/*喂养仙翼*/
		AddWingSkillLevel = 0x20070a,			/*激活/升级技能*/
		AddWingMagicShow = 0x20070b,			/*激活/升级幻化*/
		ChangeWingMagicShow = 0x20070c,			/*更换幻化外观*/
		AddWingRefine = 0x20070d,			/*升级修炼*/
		GetXunbaoInfo = 0x20076c,			/*获取探索信息*/
		RunXunbao = 0x20076d,			/*探索*/
		XunBaoExchange = 0x20076e,			/*探索兑换*/
		GetXunBaoHint = 0x20076f,			/*获取勾选探索兑换提醒列表*/
		XunBaoExchangeHint = 0x200770,			/*勾选探索兑换提醒列表*/
		XunBaoExchangeList = 0x2021cd,			/*获取庆典探索兑换列表*/
		GetOutlineInfo = 0x2007d0,			/*获取离线挂机信息*/
		GetMonthCardInfo = 0x200834,			/*获取信息*/
		GetWeekYuanbaoCardInfo = 0x20224e,			/*代币券周卡 获取信息 请求消息号*/
		GetWeekFuliCardInfo = 0x202252,			/*福利周卡 获取信息 请求消息号*/
		GetWeekXianyuCardInfo = 0x202250,			/*仙玉周卡 获取信息 请求消息号*/
		GetHeroAuraInfo = 0x202752,			/**获取主角光环数据 */
		GetDemonOrderGiftInfo = 0x202256,							/*获取魔神令*/
		GetWeekYuanbaoCardReward = 0x20224f,			/*代币券周卡请求每日奖励*/
		GetWeekFuliCardReward = 0x202253,			/*福利周卡请求每日奖励*/
		GetWeekXianyuCardReward = 0x202251,			/*仙玉周卡请求每日奖励*/
		GetHeroAuraReward = 0x202753,			/**领取主角光环每日奖励 */
		GetDemonOrderGiftReward = 0x202257,						/*领取魔神令（一键领取）*/
		SetMergeHeroAuraFbCount = 0x202754,						/**是否合并副本次数 */
		BuyMonthCard = 0x200835,			/*购买月卡*/
		GetMonthCardReward = 0x200836,			/*每日奖励*/
		GetZhizunCardInfo = 0x201d56,			/*获取信息*/
		BuyZhizunCard = 0x201d57,			/*购买*/
		GetMallInfo = 0x200898,			/*获取信息*/
		BuyMallItem = 0x200899,			/*购买*/
		GetVipInfo = 0x2008fc,			/*获取信息*/
		GetVipReward = 0x2008fd,			/*获得奖励*/
		GetPrivilege = 0x2008fe,			/*获取特权信息*/
		GetVipDayReward = 0x2008ff,			/*领取vip每日奖励*/
		GetVipFInfo = 0x201dba,			/*获取信息*/
		GetVipFReward = 0x201dbb,			/*获得奖励*/
		GetRechargeInfo = 0x200960,			/*获取充值信息*/
		GetFirstPayInfo = 0x2009c4,			/*获取信息*/
		GetFirstPayReward = 0x2009c5,			/*获取奖励*/
		ReqOrganizeTeam = 0x200a28,			/*组队*/
		CancelOrganizeTeam = 0x200a29,			/*取消组队*/
		CreateTeam = 0x200a2a,			/*创建队伍*/
		DestoryTeam = 0x200a2b,			/*解散队伍*/
		InviteJoinTeam = 0x200a2c,			/*邀请加入队伍*/
		JoinTeam = 0x200a2d,			/*接受入队、进入队伍*/
		LeaveTeam = 0x200a2e,			/*离开队伍*/
		KickedTeam = 0x200a2f,			/*踢出队伍*/
		GetRuneInfo = 0x200a8c,			/*获取玉荣信息*/
		InlayRune = 0x200a8d,			/*镶嵌玉荣*/
		RuneComposePreview = 0x200a92,			/*玉荣合成预览*/
		RuneCompose = 0x200a91,			/*玉荣合成*/
		RuneCollectInfo = 0x202258,					/*获取搜集箱玉荣 */
		RuneCollectSPLevel = 0x20225b,					/*收集专家升阶 */
		RuneCollectUpLevel = 0x202259,				/*升级搜集箱中玉荣 */
		RuneCollectDismantle = 0x20225a,			/*拆解搜集箱中玉荣 */
		RuneRefine = 0x200a8e,			/*玉荣升级*/
		ResolveRune = 0x200a8f,			/*分解玉荣*/
		SetResolveRuneFlag = 0x200a90,			/*分解标记勾选*/
		ComposeRune = 0x200a91,			/*合成玉荣*/
		OneKeySweeping = 0x200af0,			/*一键扫荡*/
		BuySweepingTimes = 0x200af1,			/*购买挂机扫荡次数*/
		GetSweepingState = 0x200af2,			/*获取一键扫荡信息*/
		GetSweepingBaseInfo = 0x200af3,			/*获取基本信息*/
		GetSweepingIncome = 0x200af4,			/*获取正常挂机收益*/
		GetXiangyaoState = 0x200b54,			/*获取降妖数据*/
		GetXiangyaoReward = 0x200b55,			/*领取奖励*/
		GetDaypayInfo = 0x200bb8,			/*获取数据*/
		GetDaypayReward = 0x200bb9,			/*领取奖励*/
		GetCumulatepayInfo = 0x200c1c,			/*获取数据*/
		GetCumulatepayReward = 0x200c1d,			/*领取奖励*/
		GetCumulatepay2Info = 0x20119e,			/*获取数据*/
		GetCumulatepay2Reward = 0x20119f,			/*领取奖励*/
		GetContinuepayInfo = 0x200ce4,			/*获取数据*/
		GetContinuepayReward = 0x200ce5,			/*领取奖励*/
		GetZeroBuyInfo = 0x200d48,			/*获取数据*/
		GetZeroBuyReward = 0x200d49,			/*领取奖励*/
		GetZeroBuyBuy = 0x200d4a,			/*购买*/
		GetOneBuyInfo = 0x201e82,			/*获取数据*/
		GetOneBuyReward = 0x201e83,			/*领取奖励*/
		GetConsumeRewardInfo = 0x200dac,			/*获取数据*/
		GetConsumeRewardReward = 0x200dad,			/*领取奖励*/
		GetConsumeReward2Info = 0x201392,			/*获取数据*/
		GetConsumeReward2Reward = 0x201393,			/*领取奖励*/
		GetInvestRewardInfo = 0x200ed8,			/*获取数据*/
		BuyInvestReward = 0x200ed9,			/*投资*/
		GetInvestRewardReward = 0x200eda,			/*领取奖励*/
		GetSprintRankTaskInfo = 0x200f3c,			/*获取数据*/
		GetSprintRankTaskReward = 0x200f3d,			/*领取奖励*/
		GetPayRewardInfo = 0x200fa0,			/*获取数据*/
		PayRewardRun = 0x200fa1,			/*转盘抽奖*/
		GetPayRewardNotes = 0x200fa2,			/*获取抽奖记录*/
		GetPayRewardReward = 0x200fa3,			/*获取财富值奖励*/
		GetDuobaoInfo = 0x201a36,			/*获取数据*/
		DuobaoRun = 0x201a37,			/*转盘抽奖*/
		GetDuobaoNotes = 0x201a38,			/*获取抽奖记录*/
		GetDuobaoReward = 0x201a39,			/*获取财富值奖励*/
		GetJzduobaoInfo = 0x201c8e,			/*获取数据*/
		JzduobaoRun = 0x201c8f,			/*转盘抽奖*/
		GetJzduobaoNotes = 0x201c90,			/*获取抽奖记录*/
		GetJzduobaoReward = 0x201c91,			/*获取财富值奖励*/
		GetGushenInfo = 0x201004,			/*获取数据*/
		GetGushenTaskReward = 0x201005,			/*获取任务奖励*/
		GetGushenActiveReward = 0x201006,			/*获取激活奖励*/
		GetKuanghuanInfo = 0x201130,			/*获取数据*/
		GetKuanghuanReward = 0x201131,			/*获取奖励*/
		GetDiscountGiftInfo = 0x201266,			/*获取数据*/
		DiscountGiftBuy = 0x201267,			/*购买*/
		GetHalfMonthInfo = 0x2017de,			/*获取数据*/
		GetHalfMonthReward = 0x2017df,			/*领取奖励*/
		GetEverydayRebateInfo = 0x201842,			/*获取数据*/
		GetEverydayRebateReward = 0x201843,			/*领取奖励*/
		GetLoginRewardInfo = 0x2019d2,			/*获取数据*/
		GetLoginRewardReward = 0x2019d3,			/*领取奖励*/
		GetCumulatepayFSInfo = 0x201522,			/*获取数据*/
		GetCumulatepayFSReward = 0x201523,			/*领取奖励*/
		GetPaySingleFSInfo = 0x201586,			/*获取数据*/
		GetPaySingleFSReward = 0x201587,			/*领取奖励*/
		GetConsumeRewardFSInfo = 0x2015ea,			/*获取数据*/
		GetConsumeRewardFSReward = 0x2015eb,			/*领取奖励*/
		GetRushBuyFSInfo = 0x20164e,			/*获取数据*/
		BuyRushBuyFS = 0x20164f,			/*购买*/
		GetDiscountGiftFSInfo = 0x2016b2,			/*获取数据*/
		BuyDiscountGiftFS = 0x2016b3,			/*购买*/
		GetBlackList = 0x200c80,			/*获取黑名单*/
		BlackListOpt = 0x200c81,			/*黑名单操作*/
		GetChatInfo = 0x200c82,			/*获取聊天信息*/
		GetNineCopy = 0x200e74,			/*获取九天副本*/
		GetXianFuInfo = 0x200e10,			/*获取仙府-家园信息*/
		GetBuildingInfo = 0x200e11,			/*获取建筑产出信息*/
		UpgradeXianFu = 0x200e12,			/*升级仙府-家园*/
		GetBuildProduceAward = 0x200e13,			/*领取建筑产出奖励*/
		MakeItem = 0x200e14,			/*制作道具*/
		GetSpiritAnimalTravel = 0x200e15,			/*获取灵兽游历信息*/
		Travel = 0x200e16,			/*出发游历*/
		TravelFinish = 0x200e17,			/*立即完成游历*/
		GetTravelAward = 0x200e18,			/*领取游历奖励*/
		GetIllustratedHandbook = 0x200e19,			/*获取图鉴*/
		PromoteIllustratedHandbook = 0x200e1a,			/*提升或激活图鉴*/
		GetXianFuMall = 0x200e1b,			/*获取仙府-家园神秘商品*/
		BuyTravelItem = 0x200e1c,			/*购买游历所需道具*/
		GetXianFuTaskList = 0x200e1d,			/*获取仙府-家园任务列表*/
		GetXianFuTaskAward = 0x200e1e,			/*领取任务奖励*/
		GetXianFuActivaAward = 0x200e1f,			/*领取活跃度奖励*/
		GetXianFuFengShuiInfo = 0x200e20,			/*获取仙府-家园风水信息*/
		UpgradeFengShuiDecorate = 0x200e21,			/*升级或激活风水物件*/
		GetXianFuSkillList = 0x200e22,			/*获取仙府-家园技能*/
		PromoteXianFuSkill = 0x200e23,			/*提升或激活技能*/
		MakeItemFinish = 0x200e24,			/*立即完成炼制*/
		GetXianFuMall2Info = 0x200e25,			/*获取仙府-家园商城信息*/
		BuyXianFuMall2Goods = 0x200e26,			/*购买仙府-家园商城商品*/
		F5XianFuMall2 = 0x200e27,			/*刷新仙府-家园商城*/
		GetTianti = 0x201068,			/* 获取天梯 (积分、功勋、剩余次数、奖励状态、参与次数)*/
		GetTiantiJoinAward = 0x201069,			/*领取参与奖励*/
		GetTiantiFeatAward = 0x20106a,			/*领取功勋奖励*/
		GetRichesInfo = 0x2010cc,			/*获取天降财宝信息*/
		GetCloudland = 0x201194,			/*获取云梦秘境*/
		GetAdventureInfo = 0x201202,			/*获取奇遇信息*/
		BuyYumli = 0x201203,			/*购买探险次数*/
		Challenge = 0x201204,			/*挑战事件（前往击杀，接受任务，猜拳，解封印）*/
		GetAdventureAward = 0x201205,			/*领取奖励 宝箱和任务使用*/
		setAdventureHint = 0x201206,			/*勾选兑换提醒列表*/
		GetAdventureHint = 0x201207,			/*获取勾选兑换列表*/
		AdventureExchange = 0x201208,			/*奇遇兑换*/
		GetSwimmingInfo = 0x2012ca,			/*获取昆仑瑶池信息*/
		GetSoapInfo = 0x2012cb,			/*获取肥皂信息*/
		GrabSoap = 0x2012cc,			/*抓肥皂*/
		GetFairyInfo = 0x20132e,			/*获取仙女信息*/
		GetFairyLog = 0x20132f,			/*获取仙女护送日志*/
		EscortFairy = 0x201330,			/*护送仙女*/
		InterceptFairy = 0x201331,			/*拦截仙女*/
		RefreshFairy = 0x201332,			/*刷新仙女*/
		SelectFairy = 0x201333,			/*选择最好的那个仙女*/
		GetFairyAward = 0x201334,			/*领取仙女护送奖励*/
		GetTipsPriorInfo = 0x2013f6,			/*获取优先提示(用于失败界面)*/
		GetDesignation = 0x20145a,			/*获取称号*/
		ActiveDesignation = 0x20145b,			/*激活称号*/
		WearDesignation = 0x20145c,			/*穿戴称号*/
		TakeoffDesignation = 0x20145d,			/*卸下称号*/
		GetArena = 0x201716,			/*获取竞技*/
		FlushArena = 0x201717,			/*刷新挑战对象*/
		ResetEnterCD = 0x201718,			/*重置入场CD*/
		GetFactionApplyList = 0x2014be,			/*获取已申请加入的仙盟列表*/
		SelectPush = 0x2014bf,			/*勾选今日邀请不再推送*/
		GetBoxInfo = 0x2014c0,			/*获取宝箱相关信息*/
		GetBoxList = 0x2014c1,			/*获取宝箱*/
		GetBoxAward = 0x2014c2,			/*领取宝箱奖励*/
		OpenBox = 0x2014c3,			/*挖宝箱*/
		AskAssist = 0x2014c4,			/*请求协助*/
		F5Box = 0x2014c5,			/*刷新宝箱*/
		AddSpeedBox = 0x2014c6,			/*加速宝箱*/
		AssistOpenBox = 0x2014c7,			/*协助别人开宝箱*/
		GetFactionCopyInfo = 0x2014c8,			/*获取仙盟副本信息*/
		GetHurtAwardList = 0x2014c9,			/*获取伤害奖励列表*/
		GetHurtAward = 0x2014ca,			/*领取伤害奖励*/
		FactionReqInspire = 0x2014cb,			/*仙盟鼓舞*/
		GetFactionSkillList = 0x2014cc,			/*获取仙盟技能*/
		PromoteFactionSkill = 0x2014cd,			/*提升或激活技能*/
		GetFactionTurn = 0x2014ce,			/*获取转盘信息*/
		FactionTurn = 0x2014cf,			/*转转*/
		GetBlessAward = 0x2014d0,			/*领取幸运值奖励*/
		AddCopyTime = 0x2014d1,			/*增加仙盟副本时间*/
		GetFashionInfo = 0x20177a,			/*获取时装信息*/
		FeedFashion = 0x20177b,			/*升级时装*/
		AddFashionSkillLevel = 0x20177c,			/*激活/升级技能*/
		AddFashionMagicShow = 0x20177d,			/*激活/升级幻化*/
		ChangeFashionMagicShow = 0x20177e,			/*更换幻化外观*/
		AddFashionRefine = 0x20177f,			/*升级修炼*/
		GetTianZhuInfo = 0x2018a6,			/*获取天诛信息*/
		FeedTianZhu = 0x2018a7,			/*升级时装*/
		AddTianZhuSkillLevel = 0x2018a8,			/*激活/升级技能*/
		AddTianZhuMagicShow = 0x2018a9,			/*激活/升级幻化*/
		ChangeTianZhuMagicShow = 0x2018aa,			/*更换幻化外观*/
		AddTianZhuRefine = 0x2018ab,			/*升级修炼*/
		GetXilian = 0x201a9a,			/*获取锻造信息*/
		OpenXilian = 0x201a9b,			/*开启锻造*/
		EquipXilian = 0x201a9c,			/*装备锻造*/
		LockXilian = 0x201a9d,			/*锁定锻造编号槽*/
		XilianRiseAddLevel = 0x201a9e,			/*锻造大师升级*/
		GetShenQiInfo = 0x20196e,			/*获取神器信息*/
		EquipFragment = 0x20196f,			/*放入碎片*/
		ActivateShenQi = 0x201970,			/*激活神器*/
		GetOpenReward = 0x201afe,			/*开服礼包*/
		BuyOpenReward = 0x201aff,			/*购买开服礼包*/
		GetSinglePayJade = 0x201b62,			/*获取单笔充值返魂玉*/
		GetSinglePayJadeAward = 0x201b63,			/*领取单笔充值返魂玉奖励*/
		GetSinglePayPrint = 0x201b64,			/*获取单笔充值返圣印*/
		GetSinglePayPrintAward = 0x201b65,			/*领取单笔充值返圣印奖励*/
		GetWeekSinglePay = 0x201bc6,			/*获取周末狂欢-单笔信息*/
		GetWeekSinglePayAward = 0x201bc7,			/*领取周末狂欢-单笔奖励*/
		GetWeekLogin = 0x201bc8,			/*获取周末狂欢-登陆信息*/
		GetWeekLoginAward = 0x201bc9,			/*领取周末狂欢-登陆奖励*/
		GetWeekAccumulate = 0x201bca,			/*获取周末狂欢-累充信息*/
		GetWeekAccumulateAward = 0x201bcb,			/*领取周末狂欢-累充奖励*/
		GetWeekConsume = 0x201bcc,			/*获取周末狂欢-消费信息*/
		GetWeekConsumeAward = 0x201bcd,			/*领取周末狂欢-消费奖励*/
		GetConsumeCount = 0x201c2a,			/*获取本次活动内消费代币券数量*/
		GetLimitPackInfo = 0x201cf2,			/*获取限时礼包信息*/
		BuyLimitPack = 0x201cf3,			/*购买限时礼包*/
		GetInviteGift = 0x201cf4,			/*获取邀请礼包信息*/
		InviteFriend = 0x201cf5,			/*邀请好友*/
		DrawInviteGift = 0x201cf6,			/*提取邀请礼包*/
		GetOnceReward = 0x201e1e,			/*获取单次奖励*/
		DrawOnceReward = 0x201e1f,			/*提取单次奖励*/
		SetOnceRewardData = 0x201e20,			/*设置单次奖励数据*/
		GetTalismanState = 0x201ee6,			/*护符状态*/
		GetTalismanInfo = 0x201ee7,			/*护符信息*/
		ActiveTalisman = 0x201ee8,			/*激活*/
		GetMoneyCatState = 0x201f4a,			/*招财猫状态*/
		GetMoneyCatInfo = 0x201f4b,			/*招财猫信息*/
		ActiveMoneyCat = 0x201f4c,			/*激活*/
		GetXianYuInfo = 0x201fae,			/*获取仙玉信息*/
		GetYuGeInfo = 0x201faf,			/*获取玉阁信息*/
		BuyYuGeGoods = 0x201fb0,			/*购买玉阁商品*/
		F5YuGe = 0x201fb1,			/*刷新玉阁*/
		GetXianYuFuYuInfo = 0x201fb2,			/*获取福缘信息*/
		GetFuYuanAward = 0x201fb3,			/*领取福缘值奖励*/
		GetGauntlet = 0x202012,			/*获取手套*/
		InlayGauntlet = 0x202013,			/*镶嵌*/
		DrawGauntlet = 0x202014,			/*领取*/
		GetXianDanList = 0x202076,			/*获取拥有的仙丹列表*/
		GetXianDanInfo = 0x202077,			/*获取仙丹信息*/
		OneKeyUseXianDan = 0x202078,			/*一键使用仙丹*/
		GetRetrieve = 0x2020da,			/*获取找回*/
		RetrieveRes = 0x2020db,			/*获取找回*/
		GetPreventFool = 0x20213e,			/*获取信息*/
		AnswerPreventFool = 0x20213f,			/*回答*/
		GetStrength = 0x2021a2,			/*获取体力*/
		SetStrength = 0x2021a3,			/*设置自动体力*/
		PickTempReward = 0x2021a4,			/*领取圣殿奖励*/
		UseStrengthItem = 0x2021a5,			/*使用体力丹*/




		/**daw 新增消息号 */
		//植树迎春 
		GetCumulatepay3Info = 0x2021a6,                        /*植株迎春获取数据 daw*/
		GetCumulatepay3Reward = 0x2021a7,                        /*植株迎春领取奖励 daw*/

		/*战队相关请求接口*/
		CreateClanRequest = 0x70044d,    					/*创建战队*/
		GetAllClanListRequset = 0x70044e,    				/*获取所有战队列表*/
		GetAppliedClanListRequset = 0x2021ad,    			/*获取所有已经申请过的战队列表*/
		GetMyClanInfoRequset = 0x70044f,    				/*获取自己战队的信息*/
		GetClanRankingListRequest = 0x700458,    			/*获取战队排行榜*/
		GetAllClanApplyListRequset = 0x700451,    			/*获取战队申请加入列表*/
		JoinClanApplyRequset = 0x700450,    				/*申请加入战队*/
		JoinClanApplyAllRequset = 0x999999,    				/*一键申请所有可以加入的战队?????*/
		ClanAuditRequset = 0x700452,    					/*战队审核*/
		ClanDissolveRequset = 0x700453,    					/*战队解散*/
		ExitClanRequset = 0x700454,    						/*退出战队*/
		ClanKickPersonRequset = 0x700455,    				/*战队踢人*/
		SetJoinClanLimitRequset = 0x700456,    				/*设置加入战队最低战力*/
		SetJoinClanAuditStatusRequset = 0x700457,    		/*设置加入战队审批状态，是否需审批*/
		ClanBuildRequset = 0x2021ae,    					/*战队建设请求*/
		ClanRefreshHaloRequest = 0x2021b2,                  /*战队光环刷新*/
		ClanGetLevelRewardRequest = 0x2021b0,               /*战队等级奖励领取*/
		GetClanBuildListRequest = 0x2021af,               	/*获取战队建设可捐献列表*/
		GetClanGradeAwardRequest = 0x2021b1,               	/*获取战队等级奖励列表*/
		ClanHaloReplaceRequest = 0x700459,               	/*战队光环确认替换*/
		ClanRenameRequest = 0x70045a,               		/*战队改名*/
		//玄火
		GetXuanhuoCopy = 0x2021b3,                          /*获取玄火争夺副本*/
		GetXuanhuoCopyData = 0x50000e,                      /*获取玄火副本内数据*/
		XuanhuoAllInspire = 0x50000d,                       /*玄火全员鼓舞*/
		XuanhuoGetTaskAward = 0x50000f,                     /*获取玄火副本任务*/
		GetXuanhuoTaskAward = 0x500010,                     /*领取玄火任务奖励--指领取某个奖励*/
		GetXuanHuoAchievementAwardList = 0x2021b4,          /*获取玄火成就奖励列表*/
		GetXuanHuoAchievementAward = 0x2021b5,              /*领取玄火成就奖励*/
		SpecifySearchObj = 0x50001a,						/*玄火副本 远程搜索对象*/



		GetZhizhunInfo = 0x2021b6,							/*获取至尊*/
		FeedZhizhun = 0x2021b7,								/*喂养至尊*/
		AddZhizhunSkillLevel = 0x2021b8,					/*激活/升级技能*/
		GetHolyRechargeInfo = 0x2021b9,						/*圣装礼包信息*/

		SellCashEquip = 0x2021ba,                           /*出售现金装备*/
		CashEquipInfo = 0x2021bd,                           /*现金装备信息*/
		MergeCashEquip = 0x2021cb,                          /*合成现金装备*/

		SuperVipStatusRequest = 0x2021bb,                   /*获取超级vip状态数据*/
		CustomDesignationRequest = 0x2021bc,				/*定制称号*/

		SetHeadImg = 0x2021be,                              /*设置头像*/
		GetHeadImgList = 0x2021bf,                          /*获取拥有头像列表*/
		ActiveHeadImg = 0x2021c0,                           /*激活或升级头像*/

		GetJiuXiaoLingAwardInfo = 0x2021c1,					/*获取九霄令 奖励和基础信息*/
		GetJiuXiaoLingTaskInfo = 0x2021c2,					/*获取九霄令 任务信息*/
		GetJiuXiaoLingLevelAward = 0x2021c3,				/*领取奖励*/
		GetJiuXiaoLingTaskExpAward = 0x2021c4,				/*领取任务经验*/
		BuyJiuXiaoLingLevel = 0x2021c6,						/*购买等级*/
		GetJiuXiaoLingExtralExpPackage = 0x2021c5,			/*领取额外经验*/

		CeremonyGeocachingInfoRequest = 0x2021c7,			/*庆典探索基础信息*/
		CeremonyGeocachingDoRequest = 0x2021c8,				/*庆典探索(抽取)*/
		CeremonyGeocachingGetAwardRequest = 0x2021ca,		/*庆典探索领取积分奖励*/
		CeremonyGeocachingGetRankRequest = 0x40012d,		/*庆典探索排行榜*/
		LitmitOneDiscountDateTimeRequest = 0x2021cc,		/*限时一折时间获取*/
		GetCeremonyDanbiInfo = 0x2021d0,			/*庆典 单笔充值 获取数据*/
		GetCeremonyDanbiReward = 0x2021d1,			/*庆典 单笔充值 领取奖励*/
		GetCeremonyContinuepayInfo = 0x2021ce,			/*庆典 连充 获取数据*/
		GetCeremonyContinuepayReward = 0x2021cf,		/*庆典 连充 领取奖励*/
		GetDropCarnivalInfo = 0x202235,			/*开服 双倍 获取数据*/

		AddMarryKeepsake = 0x2021d2,						/*激活/升级信物*/
		GetMarryKeepsakeInfo = 0x2021d3,					/*获取信物信息*/
		GradeMarryKeepsake = 0x2021d4,						/*进阶信物*/
		AddMarryKeepsakeGradeSkillLevel = 0x2021d5,			/*信物升级技能*/



		GetMarryCopyTimes = 0x2021d6,						/*获取姻缘副本次数*/
		GetMarryTaskInfo = 0x2021d7,						/*获取姻缘任务信息*/
		GetLevelAwardList = 0x2021d8,						/*获取等级奖励列表*/
		GetLevelAward = 0x2021d9,							/*领取等级奖励*/
		FeedMarryRing = 0x2021da,							/*喂养仙义戒指*/
		FeedMarryDoll = 0x2021db,							/*喂养姻缘娃娃*/
		GetMarryRingInfo = 0x2021dc,						/*获取仙义戒指信息*/
		GetMarryDollInfo = 0x2021dd,						/*获取姻缘娃娃信息*/
		AddMarryRingFeedSkillLevel = 0x2021de,				/*激活/升级技能*/
		FeedMarry = 0x2021df,								/*喂养姻缘*/
		GradeMarryDoll = 0x2021e0,							/*进阶姻缘娃娃*/

		AddMarryDollFeedSkillLevel = 0x2021e1,				/*仙娃培养升级技能*/
		AddMarryDollGradeSkillLevel = 0x2021e2,				/*仙娃进阶升级技能*/
		RiseMarryDollRefine = 0x2021e3,						/*仙娃进补*/
		ChangeMarryDollShow = 0x2021e4,						/*更换仙娃娃展示*/
		BuyMarryPackage = 0x2021e5,							/*购买姻缘礼包*/
		GetMarryTaskAward = 0x2021e6,						/*领取姻缘任务奖励*/



		/**限时探索*/
		GetLimitXunbaoInfo = 0x202236,						/*限寻-获取限时探索信息*/
		RunLimitXunbao = 0x202237,							/*限寻-探索*/
		LimitXunBaoExchangeList = 0x202238,					/*限寻-兑换列表*/
		LimitXunBaoExchange = 0x202239,						/*限寻-兑换*/
		GetLimitXunBaoHint = 0x20223a,						/*限寻-获取勾选限兑换提醒列表*/
		SetLimitXunBaoExchangeHint = 0x20223b,				/*限寻-勾选兑换提醒列表*/
		GetLimitXunBaoCumulativeTaskInfo = 0x20223c,		/*限寻-获取累计任务信息*/
		GetLimitXunBaoCumulativeTaskReward = 0x20223d,		/*限寻-领取累计任务奖励*/
		GetLimitXunBaoContinuePayInfo = 0x20223e,		    /*限寻-获取累充任务信息*/
		GetLimitXunBaoContinuePayReward = 0x20223f,		    /*限寻-领取累充奖励*/
		GetLimitXunBaoCashGiftInfo = 0x202240,				/*限寻-获取现金礼包列表信息*/
		GetLimitXunBaoCashGiftReward = 0x202241,			/*限寻-领取现金礼包奖励*/
		GetLimitXunBaoMallInfo = 0x202242,					/*限寻-获取商城数据信息*/
		BuyLimitXunBaoMallItem = 0x202243,					/*限寻-购买商城道具*/
		GetLimitXunBaoDayCumulatePayInfo = 0x202244,                /*限寻-获取每日累充任务信息*/
		GetLimitXunBaoDayCumulatePayReward = 0x202245,                /*限寻-领取每日累充奖励*/
		GetLimitXunBaoCumulatePayInfo = 0x202246,                        /*限寻-获取累充豪礼任务信息*/
		GetLimitXunBaoCumulatePayReward = 0x202247,                        /*限寻-领取累充豪礼奖励*/
		GetLimitXunBaoDaySinglePayInfo = 0x202248,                        /*限寻-获取每日单笔任务信息*/
		GetLimitXunBaoDaySinglePayReward = 0x202249,                /*限寻-领取每日单笔奖励*/
		// 七日活动
		GetSevenActivityDatas = 0x202751,                  /*七日活动-任务数据获取*/
		GetSevenActivityAward = 0x202750,                   /*领取七天任务奖励*/

		/** 战队逐鹿 */
		GetTeamChiefCopyInfo = 0x2022af,						/*获取首领战副本信息*/
		GetTeamChiefHurtAwardList = 0x2022b0,					/*获取伤害奖励列表*/
		GetTeamPrepareCopyInfo = 0x2022b1,						/*获取准备副本信息*/
		GetTeamChiefHurtAward = 0x2022b2,						/*领取首领战奖励*/
		GetAchievementInfo = 0x2022b3,							/*获取成就信息*/
		GetAchievementTaskAward = 0x2022b4,						/*领取成就奖励*/

		GetTeamChiefScoreAwardList = 0x2022b7,					/*获取伤害奖励列表*/
		GetTeamChiefScoreAward = 0x2022b8,						/*领取争夺战积分奖励*/

		/**副本 自动鼓舞状态*/
		SetAutoInspire = 0x2022b5,								/*设置自动鼓舞状态 */
		GetAutoInspire = 0x2022b6,								/*返回自动鼓舞状态 */

		// 地鼠活动
		AutoUF_DiShuOpen = 0x0020275e,                                          /**砸地鼠xy id=2107230*/
		AutoUF_DiShuGetdata = 0x0020275f,                                       /**获取地鼠活动配置 id=2107231*/
		AutoUF_DiShuOpenAll = 0x00202760,                                       /**一键自动砸地鼠 id=2107232*/
		AutoUF_DiShuRowAwd = 0x00202761,                                        /**领取行奖励[id] id=2107233*/
		AutoUF_DiShuUltimateAwd = 0x00202762,                                   /**领取终极奖励 id=2107234*/
		AutoUF_DiShuTaskAwd = 0x00202763,                                       /**领取任务奖励 id=2107235*/
		AutoUC_GetDiShuRank = 0x00400132,                                       /**获取砸地鼠排行榜 id=4194610*/
		AutoUF_SelectUltimate = 0x00202764,                                     /**选择终极奖励 id=2107236*/

		//外显套装
		AutoUF_ShowSuitInfo = 0x00202765,             /**获取外显套装数据 id=2107237*/
		AutoUF_ShowSuitActivation = 0x00202766,       /**激活外显套装 id=2107238*/
		AutoUF_ShowSuitUpLevel = 0x00202767,          /**外显套装升级 id=2107239*/
		AutoUF_ShowSuitHallucination = 0x00202768,    /**外显套装幻化 id=2107240*/
		GetLimitXunbaoServerBroadcast = 0x70045b,                /*获取寻宝全服记录*/

		//光环
		GetGuangHuanInfo = 0x202756,        //获取光环数据
		FeedGuangHuan = 0x202755,           //升级
		ChangeGuangHuanMagicShow = 0x202757,         //幻化
		AddGuangHuanMagicShow = 0x202759,             /*激活/升级幻化*/
		AddGuangHuanRefine = 0x202758,               /*升级修炼*/
		AddGuangHuanSkillLevel = 0x20275a,           /**激活/升级技能 */

	}

	const enum UserChatOpcode {
		Chat = 0x300000,			/*聊天*/
		GetChatDetailedInfo = 0x300001,			/*获取聊天玩家详细信息*/
		GetChatRecord = 0x300002,			/*获取聊天记录*/
		GetFairyEscortList = 0x300064,			/*获取仙女护送列表  返回数量取决于总表配置的显示上限*/
		GetFairyPanelInfo = 0x300065,			/*获取其它玩家仙女面板信息，同时会记录哪些玩家获取了，到时有拦截会推更新*/
		DelFairyPanelInfoRecord = 0x300066,			/*删除上面获取记录，到时有拦截不会再推更新*/
	}

	const enum UserCrossOpcode {
		GetCrossRank = 0x400000,			/*获取排行*/
		GetActorCrossRankShow = 0x400001,			/*获取排行榜返回*/
		GetActorCrossRankData = 0x400002,			/*获取角色排行榜数据*/
		GetFeishengRankAllInfo = 0x400064,			/*获取数据*/
		GetFeishengRankBaseInfo = 0x400065,			/*获取基本数据(标签)*/
		GetFeishengRankTaskInfo = 0x400066,			/*获取积分数据*/
		GetFeishengRankTaskReward = 0x400067,			/*获取积分奖励*/
		GetFeishengRankBefore = 0x400068,			/*获取历史排名*/
		GetDuobaoRankInfo = 0x4000c8,			/*获取夺宝排名数据*/
		GetJzduobaoRankInfo = 0x4000c9,			/*获取九州夺宝排名数据*/
		GetConsumeRank = 0x40012c,			/*获取消费排行榜数据*/
		GetLimitXunbaoRankInfo = 0x40012e, 		/*获取限时探索排行榜*/
	}

	const enum UserMapOpcode {
		Move = 0x500000,			/*玩家移动*/
		RequestRefeshMonster = 0x50001c,			/*挂机场景请求刷新小怪*/
		ReqRevive = 0x500001,			/*复活*/
		PlaySkill = 0x500002,			/*释放及技能*/
		ReqInspire = 0x500003,			/*鼓舞*/
		GetJoinAward = 0x500004,			/*领取参与奖励*/
		Gather = 0x500005,			/*采集*/
		ReqEnterNextLevel = 0x500006,			/*进入下一层*/
		ReqFlushBoss = 0x500007,			/*请求刷新BOSS*/
		ReqSearchObj = 0x500008,			/*搜索对象*/
		GatherInterrupt = 0x500009,			/*中断采集*/
		GetInCopyAward = 0x50000a,			/*获取当前在副本里面得到的奖励*/
		FactionAllInspire = 0x50000b,			/*仙盟全员鼓舞*/
		GetFactionCopyData = 0x50000c,			/*获取仙盟副本内数据*/
		UserTransfer = 0x50001b,				/*战队逐鹿 申请传送*/
		KillMonsterCopyTransmit = 0x50001e,     /*怪物击杀副本传送 */
		AdventureCopyTransmit = 0x50001f,       /*游历副本传送 */

	}

	const enum UserCenterOpcode {
		GetEmailCount = 0x700000,			/*获取邮件数量*/
		GetEmails = 0x700001,			/*批量获取邮件*/
		ReadEmails = 0x700002,			/*读取邮件*/
		GetEmailsAttachAll = 0x700003,			/*一键获取邮件附件*/
		DelEmails = 0x700004,			/*删除邮件*/
		GetEmailsAttachOnce = 0x700005,			/*领取一封邮件*/
		GetRank = 0x700064,			/*获取排行*/
		GetActorRankShow = 0x700065,			/*获取排行榜返回*/
		GetActorRankData = 0x700066,			/*获取角色排行榜数据*/
		GetBoss = 0x7000c8,			/*获取BOSS*/
		GetBossSingle = 0x7000c9,			/*获取BOSS*/
		GetBossRankRecord = 0x7000ca,			/*获取BOSS排行记录*/
		GetBossKillInfo = 0x700530,                                        /**获取击杀信息 */
		GetTeamCopyRank = 0x7000cb,			/*获取组队副本排行*/
		GetXunbaoServerBroadcast = 0x70012c,			/*获取探索全服记录*/
		GetNineCopyRank = 0x700190,			/*获取九天排名*/
		GetSprintRankAllInfo = 0x7001f4,			/*获取数据*/
		GetSprintRankBaseInfo = 0x7001f5,			/*获取基本数据(标签)*/
		GetSprintRankBefore = 0x7001f6,			/*获取历史排名*/
		GetPayRewardServerBroadcast = 0x700258,			/*获取充值转盘全服记录*/
		GetDuobaoServerBroadcast = 0x700259,			/*获取夺宝全服记录*/
		GetJzduobaoServerBroadcast = 0x70025a,			/*获取九州夺宝全服记录*/
		GetTiantiRank = 0x7002bc,			/*获取天梯排行*/
		GetArenaRank = 0x700384,			/*获取竞技排行*/
		GetArenaChallengeRecord = 0x700385,			/*获取竞技挑战记录*/
		GetFactionList = 0x700320,			/*获取仙盟列表*/
		GetFactionInfo = 0x700321,			/*获取仙盟信息*/
		CreateFaction = 0x700322,			/*创建仙盟*/
		JoinFaction = 0x700323,			/*申请加入仙盟*/
		GetFactionJoinList = 0x700324,			/*获取仙盟申请加入列表*/
		Examine = 0x700325,			/*审批*/
		Dissolution = 0x700326,			/*解散*/
		BroadcastRecruit = 0x700327,			/*广播招人*/
		ExitFaction = 0x700328,			/*退出仙盟*/
		Kick = 0x700329,			/*踢人*/
		SetPosition = 0x70032a,			/*设置职位*/
		SetFight = 0x70032b,			/*设置战力*/
		SetTitle = 0x70032c,			/*设置招人标题*/
		SetNotice = 0x70032d,			/*设置公告*/
		SetExamine = 0x70032e,			/*设置加入仙盟审批状态*/
		ApplyForPos = 0x70032f,			/*申请职位*/
		GetApplyForPosList = 0x700330,			/*获取申请职位列表*/
		ApplyForPosResult = 0x700331,			/*申请职位审批结果*/
		GetFactionRankList = 0x700332,			/*获取仙盟排行榜*/
		GetAssistBoxList = 0x700333,			/*获取需要协助的宝箱*/
		GetFactionTurnRecord = 0x700334,			/*获取仙盟转盘记录*/
		GetFeedbackList = 0x7003e8,			/*获取意见反馈列表*/
		SendFeedback = 0x7003e9,			/*发送意见反馈*/
		ChangeFeedbackState = 0x7003ea,			/*改变意见反馈查看状态*/
		GetNotice = 0x7003eb,			/*获取公告*/
		ExchangeCdkey = 0x70044c,			/*兑换激活码*/

		//姻缘
		ReleaseMarryWall = 0x700526,				/*发布姻缘墙*/
		GetMarryWallList = 0x700527,				/*获取姻缘墙列表*/
		GetMarryInfo = 0x700528,					/*获取姻缘信息*/
		MarryDissolution = 0x700529,				/*姻缘解散*/
		CreateMarry = 0x70052a,						/*姻缘 结缘*/
		// 战队逐鹿
		GetTeamChiefRankList = 0x70052b,			/* 战队逐鹿 - 首领战 rank列表*/
		GetTeamBattleCopyStatus = 0x70052c,			/* 战队逐鹿 - 争夺战 当前状态*/
		GetTeamBattleWorshipInfo = 0x70052d,		/* 战队逐鹿 - 争夺战 膜拜信息*/
		GetTeamBattleWorship = 0x70052e,			/* 战队逐鹿 - 争夺战 获取膜拜奖励*/

	}

	/***************************************System命令***************************************/

	const enum SystemClientOpcode {
		AuthClientReply = 0x1000000,			/*客户端认证返回*/
		CloseClient = 0x1000001,			/*关闭客户端*/
		ActorLoginReply = 0x1000002,			/*玩家登陆返回*/
		GetActorBaseAttrReply = 0x1000064,			/*返回玩家基本属性*/
		UpdateHp = 0x1000065,			/*更新血量*/
		UpdateTotalAttr = 0x1000066,			/*更新玩家总属性*/
		GMCommandReply = 0x1000067,			/*GM 指令返回*/
		UpdateExp = 0x1000068,			/*更新经验*/
		UpdateLevel = 0x1000069,			/*更新等级*/
		WearEquipReply = 0x100006a,			/*穿戴装备返回*/
		UpdateActorEquip = 0x100006b,			/*更新角色的穿戴装备*/
		GetActorEquipReply = 0x100006c,			/*获取角色装备返回*/
		GetTaskReply = 0x100006d,			/*获取任务返回*/
		GetTaskAwardReply = 0x100006e,			/*领取任务奖励返回*/
		UpdateTask = 0x100006f,			/*更新任务*/
		UpdateMoney = 0x1000070,			/*更新货币*/
		UpdateFight = 0x1000071,			/*更新战力*/
		ReqEnterSceneReply = 0x1000072,			/*请求进入场景返回*/
		CopyJudgeAward = 0x1000073,			/*副本结算奖励*/
		GetCopyTianguanReply = 0x1000074,			/*获取天关*/
		GetCopyAwardReply = 0x1000075,			/*领取副本奖励返回*/
		UpdateTianguanCopy = 0x1000076,			/*更新天关层数和奖励*/
		UpdateKillMonstetWare = 0x1000077,			/*挂机场景更新当前击杀怪物波数*/
		GetActionOpenReply = 0x1000078,			/*获取功能开启返回*/
		UpdateActionOpen = 0x1000079,			/*更新功能开启*/
		SynTimeReply = 0x100007a,			/*同步时间返回*/
		GetRankReply = 0x100007b,			/*获取排行榜返回*/
		GetCopyDahuangReply = 0x100007c,			/*获取大荒*/
		UpdateDahuangCopy = 0x100007d,			/*更新大荒层数和奖励*/
		UpdateIncome = 0x100007e,			/*更新收益*/
		UpdateActorEra = 0x100007f,			/*更新觉醒*/
		GetActorRankShowReply = 0x1000080,			/*获取排行外观返回*/
		GatherReply = 0x1000081,			/*采集返回*/
		GetXunbaoServerBroadcastReply = 0x1000082,			/*获取探索全服记录返回*/
		GetActorRankDataReply = 0x1000083,			/*获取角色排行榜数据*/
		UpdateBuffList = 0x1000084,			/*更新buff列表*/
		UpdateActorState = 0x1000085,			/*更新角色状态*/
		GetCopyRuneReply = 0x1000086,			/*获取远古符阵*/
		UpdateRuneCopy = 0x1000087,			/*更新远古符阵层数和奖励*/
		GetRuneEveryDayAwardReply = 0x1000088,			/*领取远古符阵副本每日奖励返回*/
		GetRuneDialReply = 0x1000089,			/*获取远古符阵转盘回复*/
		UpdateRuneDial = 0x100008a,			/*更新远古符阵转盘*/
		StartRuneDialReply = 0x100008b,			/*远古符阵转盘开始回复*/
		GatherEnd = 0x100008c,			/*采集结束*/
		NineCopyJudgeAward = 0x100008d,			/*九天之巅副本结算奖励*/
		GetInCopyAwardReply = 0x100008e,			/*获取当前在副本里面得到的奖励返回*/
		GetGuideListReply = 0x100008f,			/*获取所有完成的指引返回*/
		FinishGuideReply = 0x1000090,			/*完成指引返回*/
		BossJudgeAward = 0x1000091,			/*BOSS结算奖励*/
		GetActionPreviesHaveReceivedReply = 0x1000092,			/*获取功能预览已领取的id返回*/
		GetActionPreviesAwardReply = 0x1000093,			/*领取功能预览奖励返回*/
		GetServerDayReply = 0x1000094,			/*获取开服第几天返回*/
		UpdateServerDay = 0x1000095,			/*更新开服第几天*/
		ArenaJudgeAward = 0x1000096,			/*竞技场结算*/
		UpdateNotFoundEnemy = 0x1000097,			/*敌方未进入*/
		GetActionStateReply = 0x1000098,			/*获取功能开启状态*/
		GetEquipSuitReply = 0x1000099,			/*获取装备套装信息返回*/
		LightenUpReply = 0x100009a,			/*点亮装备返回*/
		SetNameReply = 0x100009b,			/*改名返回*/
		GetSetNameInfoReply = 0x100009c,			/*获取设置名字信息*/
		UpdateNameReply = 0x100009d,			/*更新名字*/
		UpdateOccReply = 0x100009e,			/*更新职业*/
		LeaveScene = 0x10000c8,			/*离开场景服*/
		EnterScene = 0x10000c9,			/*进入场景服*/
		BroadcastEnterScreen = 0x10000ca,			/*广播入屏*/
		BroadcastLeaveScreen = 0x10000cb,			/*广播离屏*/
		BroadcastMove = 0x10000cc,			/*广播玩家移动*/
		BroadcastUpDateSpeed = 0x1002975,   /*广播移动速度更新*/
		BroadcastHp = 0x10000cd,			/*飘血*/
		ReqReviveReply = 0x10000ce,			/*复活返回*/
		BroadcastRevive = 0x10000cf,			/*广播复活*/
		BroadcastDead = 0x10000d0,			/*玩家或怪物死亡*/
		BroadcastReadySkill = 0x10000d1,			/*预备技能*/
		BroadcastPlaySkill = 0x10000d2,			/*释放技能*/
		BroadcastActorShow = 0x10000d3,			/*广播角色外观*/
		BroadcastBeginCombat = 0x10000d4,			/*广播开始战斗*/
		BroadcastEndCombat = 0x10000d5,			/*广播结束战斗*/
		BroadcastCopyMonsterWare = 0x10000d6,			/*广播怪物波数*/
		BroadcastCopyIncome = 0x10000d7,			/*广播副本收益*/
		BroadcastCopyStar = 0x10000d8,			/*广播副本星级*/
		UpdateIncomeRecord = 0x10000d9,			/*更新收益记录*/
		GetCopyTimesReply = 0x10000da,			/*获取副本次数返回*/
		UpdateCopyTimes = 0x10000db,			/*更新副本次数*/
		BuyTimesReply = 0x10000dc,			/*购买副本次数返回*/
		TransmitPos = 0x10000dd,			/*同场景传送*/
		PlaySkillReply = 0x10000de,			/*释放技能返回*/
		GetOpenBoxTimesReply = 0x10000df,			/*获取开启宝箱次数*/
		UpdateOpenBoxTimes = 0x10000e0,			/*更新开启宝箱次数*/
		UpdatePKMode = 0x10000e1,			/*更新PK模式*/
		ReqEnterNextLevelReply = 0x10000e2,			/*进入下一层返回*/
		BroadcastEnemyInvad = 0x10000e3,			/*敌人入侵*/
		GetTeamCopyTimesReply = 0x10000e4,			/*获取组队副本次数*/
		UpdateTeamCopyTimes = 0x10000e5,			/*更新组队副本次数*/
		GetTeamCopyRankReply = 0x10000e6,			/*获取组队副本排行返回*/
		BroadcastTeamCopyMonsterWare = 0x10000e7,			/*广播组队怪物波数*/
		UpdateChangeMap = 0x10000e8,			/*切换地图、当前场景切换为副本 场景资源不变，刷出目标场景的怪物*/
		UpdateBossBirthPos = 0x10000e9,			/*BOSS出生点*/
		UpdateDropItem = 0x10000ea,			/*更新掉落*/
		BroadcasSceneState = 0x10000eb,			/*广播场景状态*/
		GetSceneStateReply = 0x10000ec,			/*获取场景状态返回*/
		ScenePromote = 0x10000ed,			/*场景晋级*/
		UpdateScore = 0x10000ee,			/*更新积分*/
		UpdateXuanhuoNum = 0x100235d,			/*更新玄火数量返回*/
		GetNineCopyReply = 0x10000ef,			/*获取九天副本返回*/
		UpdateNineCopy = 0x10000f0,			/*更新九天副本*/
		GetNineCopyRankReply = 0x10000f1,			/*获取九天排名返回*/
		UpdateNineGatherBox = 0x10000f2,			/*更新九天之巅采集宝箱*/
		ReqSearchObjReply = 0x10000f3,			/*搜索对象返回*/
		UpdateGatherPos = 0x10000f4,			/*更新采集地点*/
		UpdateNpc = 0x10000f5,			/*更新Npc*/
		GetBagReply = 0x100012c,			/*获取背包返回*/
		UpdateBag = 0x100012d,			/*更新背包道具*/
		TaskXunbaoBagItemListReply = 0x100012e,			/*取探索仓库物品到背包返回*/
		TaskXunbaoBagAllItemReply = 0x100012f,			/*取探索仓库所有返回*/
		useBagItemReply = 0x1000130,			/*使用物品返回*/
		UpdateBagItemShow = 0x1000131,			/*特殊道具外观提示*/
		TaskXianYuXunbaoBagItemListReply = 0x1000132,			/*取仙玉探索仓库物品到背包返回*/
		TaskXianYuXunbaoBagAllItemReply = 0x1000133,			/*取仙玉探索仓库所有返回*/
		GetPetInfoReply = 0x1000190,			/*获取宠物信息返回*/
		FeedPetReply = 0x1000191,			/*培养返回*/
		UpdatePetInfo = 0x1000192,			/*更新宠物信息*/
		AddPetSkillLevelReply = 0x1000193,			/*激活/升级技能返回*/
		RankPetReply = 0x1000194,			/*升阶返回*/
		ChangePetShowReply = 0x1000195,			/*更换外观返回*/
		RiseMagicShowReply = 0x1000196,			/*幻化激活/升星返回*/
		ChangeMagicShowReply = 0x1000197,			/*更换幻化返回*/
		RiseRefineReply = 0x1000198,			/*修炼返回*/
		AddPetFazhenReply = 0x1000199,			/*法阵激活/升级返回*/
		ChangePetFazhenReply = 0x100019a,			/*更换法阵返回*/
		GetRideInfoReply = 0x10001f4,			/*获取精灵信息返回*/
		FeedRideReply = 0x10001f5,			/*培养返回*/
		UpdateRideInfo = 0x10001f6,			/*更新精灵信息*/
		AddRideSkillLevelReply = 0x10001f7,			/*激活/升级技能返回*/
		RankRideReply = 0x10001f8,			/*升阶返回*/
		ChangeRideShowReply = 0x10001f9,			/*更换外观返回*/
		RiseRideMagicShowReply = 0x10001fa,			/*幻化激活/升星返回*/
		ChangeRideMagicShowReply = 0x10001fb,			/*更换幻化返回*/
		RiseRideRefineReply = 0x10001fc,			/*修炼返回*/
		AddRideFazhenReply = 0x10001fd,			/*法阵激活/升级返回*/
		ChangeRideFazhenReply = 0x10001fe,			/*更换法阵返回*/
		GetSoulInfoReply = 0x1000258,			/*获取返回*/
		UpdateSoulInfo = 0x1000259,			/*更新金身信息*/
		RefineSoulReply = 0x100025a,			/*修炼返回*/
		RiseSoulReply = 0x100025b,			/*修炼不败金身返回*/
		GetAmuletInfoReply = 0x10002bc,			/*获取返回*/
		UpdateAmuletInfo = 0x10002bd,			/*更新圣物信息*/
		RefineAmuletReply = 0x10002be,			/*升级返回*/
		GetGemInfoReply = 0x1000320,			/*获取返回*/
		UpdateGemInfo = 0x1000321,			/*更新仙石信息*/
		InlayGemReply = 0x1000322,			/*镶嵌返回*/
		ReplaceGemReply = 0x1000323,			/*替换返回*/
		RefineGemReply = 0x1000324,			/*升级返回*/
		RiseGemReply = 0x1000325,			/*升级仙石大师返回*/
		OneKeyRefineGemReply = 0x1000326,			/*一键操作返回*/
		GetSkillsReply = 0x1000384,			/*获取角色技能返回*/
		UpdateSkill = 0x1000385,			/*更新角色技能*/
		AddSkill = 0x1000386,			/*增加角色技能(用于任务)*/
		UpdateZQ = 0x1000387,			/*更新魔力*/
		AddSkillLevelReply = 0x1000388,			/*升级技能返回*/
		AddSkillLevelOfAllReply = 0x1000389,			/*一键升级技能返回*/
		OpenSkillReply = 0x100038a,			/*激活技能返回*/
		GetSignReply = 0x10003e8,			/*获取签到信息返回*/
		SignReply = 0x10003e9,			/*签到返回*/
		SweepCopyReply = 0x10004b0,			/*扫荡副本返回*/
		GetSingleBossCopyReply = 0x10004b1,			/*获取单人BOSS副本返回*/
		UpdateSingleBossCopy = 0x10004b2,			/*更新单人BOSS副本*/
		GetBossReply = 0x10004b3,			/*获取BOSS返回*/
		UpdateBoss = 0x10004b4,			/*更新BOSS 死亡、重生推送*/
		UpdateBossHurtRack = 0x10004b5,			/*BOSS 伤害排行*/
		GetFollowBossReply = 0x10004b6,			/*获取关注的BOSS返回*/
		GetBossTimesReply = 0x10004b7,			/*获取BOSS次数*/
		UpdateBossTimes = 0x10004b8,			/*更新BOSS次数*/
		ReqInspireReply = 0x10004b9,			/*鼓舞返回*/
		UpdateInspire = 0x10004ba,			/*鼓舞*/
		UpdateEnterLater = 0x10004bb,			/*进入公共BOSS时，BOSS已死亡且没有伤害记录则推送(寻路过程中BOSS死亡不会推送)*/
		GetBossRankRecordReply = 0x10004bc,			/*获取BOSS排行记录*/
		AutoSC_BossKillInfos = 0x01002991,                                      /**BOSS击杀信息 id=16787857*/
		GetJoinAwardReply = 0x10004bd,			/*领取参与奖励*/
		UpdateJoinAward = 0x10004be,			/*更新参与奖励*/
		UpdateBossState = 0x10004bf,			/*更新BOSS状态*/
		UpdateBossDropOwns = 0x10004c0,			/*更新BOSS掉落归属*/
		GetBossIsFirstReply = 0x10004c1,			/*获取多人BOSS是否第一次打，引导用*/
		OneKeySweepShilianCopyReply = 0x10004c2,			/*一键扫荡试炼副本*/
		OneKeyChallengeShilianCopyReply = 0x10004c3,			/*一键挑战试炼副本*/
		GetSevenDayReply = 0x100044c,			/*获取七日礼*/
		UpdateSevenDay = 0x100044d,			/*更新七日礼*/
		GetSevenDayAwardReply = 0x100044e,			/*领取七日礼*/
		GetOnlineRewardReply = 0x10006a4,			/*获取返回*/
		UpdateOnlineReward = 0x10006a5,			/*更新*/
		GetOnlineRewardAwardReply = 0x10006a6,			/*领取返回*/
		GetEmailCountReply = 0x1000514,			/*获取邮件数量返回*/
		GetEmailsReply = 0x1000515,			/*获取邮件*/
		UpdateEmailsState = 0x1000516,			/*更新邮件状态*/
		GetEmailsAttachReply = 0x1000517,			/*领取邮件附件返回*/
		UpdateDelEmails = 0x1000518,			/*删除邮件*/
		UpdateAddEmails = 0x1000519,			/*增加邮件*/
		DelEmailsReply = 0x100051a,			/*删除邮件*/
		GetEraInfoReply = 0x1000578,			/*获取觉醒信息返回*/
		UpdateEraInfo = 0x1000579,			/*更新觉醒信息*/
		EraReply = 0x100057a,			/*觉醒返回*/
		EraBossReply = 0x100057b,			/*觉醒boss返回*/
		FastEraReply = 0x100057c,			/*觉醒丹觉醒*/
		DrawEraTaskReply = 0x100057d,			/*领取任务奖励返回*/
		GetStrongInfoReply = 0x10005dc,			/*获取返回*/
		UpdateStrongInfo = 0x10005dd,			/*更新仙石信息*/
		RefineStrongReply = 0x10005de,			/*升级返回*/
		RefineStrongOfAllReply = 0x10005df,			/*一键升级返回*/
		RiseStrongReply = 0x10005e0,			/*升级强化大师/神匠返回*/
		GetZhuhunInfoReply = 0x10019d2,			/*获取返回*/
		UpdateZhuhunInfo = 0x10019d3,			/*更新信息*/
		ZhuhunOperReply = 0x10019d4,			/*铸魂返回*/
		ZhuhunOperOneKeyReply = 0x10019d5,			/*一键铸魂返回*/
		ShihunOperReply = 0x10019d6,			/*噬魂返回*/
		ShihunOperOneKeyReply = 0x10019d7,			/*一键噬魂返回*/
		ComposeReply = 0x1000640,			/*合成返回*/
		ResolveReply = 0x1000641,			/*分解返回*/
		GetSmeltInfoReply = 0x1000642,			/*获取熔炼信息返回*/
		SmeltReply = 0x1000643,			/*熔炼返回*/
		GetLilianInfoReply = 0x1000708,			/*获取历练信息返回*/
		UpdateLilianAll = 0x1000709,			/*更新历练整个信息*/
		UpdateLilianTask = 0x100070a,			/*更新历练单个任务*/
		GetLilianTaskAwardReply = 0x100070b,			/*领取历练任务奖励返回*/
		GetLilianDayAwardReply = 0x100070c,			/*领取历练日奖励*/
		GetXianweiInfoReply = 0x100076c,			/*获取历练信息返回*/
		UpdateXianweiAll = 0x100076d,			/*更新历练整个信息*/
		UpdateXianweiTask = 0x100076e,			/*更新单个任务*/
		GetXianweiTaskAwardReply = 0x100076f,			/*领取任务奖励返回*/
		GetXianweiDayAwardReply = 0x1000770,			/*领取日奖励*/
		GetKuanghaiInfoReply = 0x1002396,			/*获取历练信息返回*/
		GetKuanghai2InfoReply = 0x1002339,			/*获取历练信息返回 daw*/
		UpdateKuanghaiTask = 0x1002397,			/*更新单个任务*/
		GetKuanghaiTaskAwardReply = 0x1002398,			/*领取任务奖励返回*/
		GetKuanghaiAwardReply = 0x1002399,			/*领取奖励*/
		GetShenbingInfoReply = 0x10007d0,			/*获取神兵信息返回*/
		UpdateShenbingInfo = 0x10007d1,			/*更新信息*/
		FeedShenbingReply = 0x10007d2,			/*培养返回*/
		AddShenbingSkillLevelReply = 0x10007d3,			/*激活/升级技能返回*/
		AddShenbingMagicShowReply = 0x10007d4,			/*幻化激活/升级返回*/
		ChangeShenbingMagicShowReply = 0x10007d5,			/*更换幻化返回*/
		AddShenbingRefineReply = 0x10007d6,			/*修炼返回*/
		GetWingInfoReply = 0x1000834,			/*获取仙翼信息返回*/
		UpdateWingInfo = 0x1000835,			/*更新信息*/
		FeedWingReply = 0x1000836,			/*培养返回*/
		AddWingSkillLevelReply = 0x1000837,			/*激活/升级技能返回*/
		AddWingMagicShowReply = 0x1000838,			/*幻化激活/升级返回*/
		ChangeWingMagicShowReply = 0x1000839,			/*更换幻化返回*/
		AddWingRefineReply = 0x100083a,			/*修炼返回*/
		GetXunbaoInfoReply = 0x1000898,			/*获取探索信息返回*/
		GetXunBaoHintReply = 0x1000899,			/*获取勾选探索兑换提醒列表返回*/
		GetXunBaoListReply = 0x100237f,			/*获取庆典兑换列表返回*/
		UpdateXunbaoInfo = 0x100089a,			/*更新探索信息*/
		AddXunbaoSelfBroadcast = 0x100089b,			/*增加个人记录*/
		RunXunbaoReply = 0x100089c,			/*探索返回*/
		XunBaoExchangeReply = 0x100089d,			/*探索兑换结果返回*/
		GetOutlineInfoReply = 0x10008fc,			/*离线挂机返回*/
		GetMonthCardInfoReply = 0x1000960,			/*返回*/
		UpdateMonthCardInfo = 0x1000961,			/*更新*/
		GetWeekYuanbaoCardInfoReply = 0x100246d,					/*代币券周卡 获取返回*/
		GetWeekFuliCardInfoReply = 0x1002471,					/*福利周卡 获取返回*/
		GetWeekXianyuCardInfoReply = 0x100246f,					/*仙玉周卡 获取返回*/
		GetHeroAuraInfoReply = 0x1002972,			/*主角光环数据 返回*/
		GetDemonOrderGiftInfoReply = 0x1002475,							/*获取魔神令 信息返回*/
		GetWeekYuanbaoCardRewardReply = 0x100246e,					/*代币券周卡 领取奖励返回*/
		GetWeekFuliCardRewardReply = 0x1002472,					/*福利周卡 领取奖励返回*/
		GetWeekXianyuCardRewardReply = 0x1002470,				/*仙玉周卡 领取奖励返回*/
		GetHeroAuraRewardReply = 0x1002973,			/*领取主角光环每日奖励 返回码*/
		GetDemonOrderGiftRewardReply = 0x1002476,					/*领取魔神令 奖励返回*/
		GetDemonOrderGiftExtraRewardReply = 0x1002477,                         /*购买魔神令 额外奖励返回*/
		BuyMonthCardReply = 0x1000962,			/*购买返回*/
		GetMonthCardRewardReply = 0x1000963,			/*每日奖励返回*/
		GetZhizunCardInfoReply = 0x1001e1e,			/*返回*/
		UpdateZhizunCardInfo = 0x1001e1f,			/*更新*/
		BuyZhizunCardReply = 0x1001e20,			/*购买返回*/
		GetMallInfoReply = 0x10009c4,			/*返回*/
		UpdateMallInfo = 0x10009c5,			/*更新*/
		BuyMallItemReply = 0x10009c6,			/*购买返回*/
		GetVipInfoReply = 0x1000a28,			/*返回*/
		UpdateVipInfo = 0x1000a29,			/*更新*/
		GetVipRewardReply = 0x1000a2a,			/*领取奖励返回*/
		GetPrivilegeReply = 0x1000a2b,			/*获取特权信息返回*/
		UpdatePrivilege = 0x1000a2c,			/*更新特权信息*/
		GetVipDayRewardReply = 0x1000a2d,			/*领取vip每日奖励返回*/
		GetVipFInfoReply = 0x1001f4a,			/*返回*/
		UpdateVipFInfo = 0x1001f4b,			/*更新*/
		GetVipFRewardReply = 0x1001f4c,			/*领取奖励返回*/
		UpdateChat = 0x1000a8c,			/*更新聊天*/
		ChatReply = 0x1000a8d,			/*聊天结果返回*/
		GetChatRecordReply = 0x1000a8e,			/*获取聊天记录返回*/
		GetBlackListReply = 0x1000a8f,			/*获取黑名单回复*/
		BlackListOptReply = 0x1000a90,			/*黑名单操作回复*/
		UpdateBlackList = 0x1000a91,			/*更新黑名单*/
		GetChatPlayerDetailedInfoReply = 0x1000a92,			/*获取聊天玩家展示详细信息返回*/
		GetChatInfoReply = 0x1000a93,			/*获取聊天信息返回*/
		UpdateChatInfo = 0x1000a94,			/*更新聊天信息*/
		GetRechargeInfoReply = 0x1000af0,			/*返回*/
		UpdateRechargeInfo = 0x1000af1,			/*更新充值档位信息*/
		GetFirstPayInfoReply = 0x1000b54,			/*返回*/
		UpdateFirstPayInfo = 0x1000b55,			/*更新充值档位信息*/
		UpdateFirstPayShow = 0x1000b56,			/*获得新外观*/
		GetFirstPayRewardReply = 0x1000b57,			/*获取奖励返回*/
		ReqOrganizeTeamReply = 0x1000bb8,			/*组队返回*/
		CancelOrganizeTeamReply = 0x1000bb9,			/*取消、退出组队*/
		UpdateTeamMember = 0x1000bba,			/*更新队伍成员*/
		UpdateTeamMatchState = 0x1000bbb,			/*匹配状态*/
		CreateTeamReply = 0x1000bbc,			/*创建队伍*/
		DestoryTeamReply = 0x1000bbd,			/*解散队伍*/
		InviteJoinTeamReply = 0x1000bbe,			/*邀请加入队伍*/
		JoinTeamReply = 0x1000bbf,			/*接受入队、进入队伍*/
		LeaveTeamReply = 0x1000bc0,			/*离开队伍*/
		KickedTeamReply = 0x1000bc1,			/*踢出队伍*/
		UpdateAddTeamInvite = 0x1000bc2,			/*更新添加队伍邀请*/
		UpdateDestoryTeam = 0x1000bc3,			/*更新解散队伍*/
		UpdateTeamMemberOper = 0x1000bc4,			/*更新队伍成员*/
		GetRuneInfoReply = 0x1000c1c,			/*获取玉荣信息返回*/
		InlayRuneReply = 0x1000c1d,			/*玉荣镶嵌返回*/
		RuneComposePreviewReply = 0x1000c22,			/*玉荣合成预览返回*/
		RuneComposeReply = 0x1000c21,			/*玉荣合成返回*/
		RuneRefineReply = 0x1000c1e,			/*玉荣升级返回*/
		UnsnatchRunePlaceReply = 0x100247d,			/*卸下玉荣槽的位置列表 */
		UpdateRuneInfo = 0x1000c1f,			/*更新玉荣信息*/
		ResolveRuneReply = 0x1000c20,			/*分解返回*/
		RuneCollectInfoReply = 0x1002478,			/*获取搜集箱玉荣返回 */
		RuneCollectUpJieReply = 0x100247c,			/*玉荣搜集箱收集专家升阶 */
		RuneCollectSingleInfoReply = 0x100247b,		/*玉荣收集箱获取单个信息 返回*/
		RuneCollectUpLevelReply = 0x1002479,		/*玉荣收集箱升级 返回*/
		RuneCollectDismantleReply = 0x100247a,		/*玉荣收集箱拆解 返回*/
		OneKeySweepingReply = 0x1000c80,			/*挂机游荡返回*/
		BuysweepingtimesReply = 0x1000c81,			/*购买次数返回*/
		GetSweepingStateReply = 0x1000c82,			/*获取扫荡信息返回*/
		GetSweepingBaseInfoReply = 0x1000c83,			/*获取扫荡基本信息返回*/
		UpdateSweepingBaseInfo = 0x1000c84,			/*更新扫荡信息返回*/
		GetSweepingIncomeReply = 0x1000c85,			/*获取正常挂机收益返回*/
		updateXiangyaoDataReply = 0x1000ce4,			/*更新降妖怪数据*/
		getXiangyaoRewardReply = 0x1000ce5,			/*领取降妖奖励返回*/
		GetDaypayInfoReply = 0x1000d48,			/*返回数据*/
		UpdateDaypayInfo = 0x1000d49,			/*更新数据*/
		GetDaypayRewardReply = 0x1000d4a,			/*领取奖励返回*/
		GetCumulatepayInfoReply = 0x1000dac,			/*返回数据*/
		UpdateCumulatepayInfo = 0x1000dad,			/*更新数据*/
		GetCumulatepayRewardReply = 0x1000dae,			/*领取奖励返回*/
		GetCumulatepay2InfoReply = 0x1001266,			/*返回数据*/
		UpdateCumulatepay2Info = 0x1001267,			/*更新数据*/
		GetCumulatepay2RewardReply = 0x1001268,			/*领取奖励返回*/
		GetContinuepayInfoReply = 0x1000e10,			/*返回数据*/
		UpdateContinuepayInfo = 0x1000e11,			/*更新数据*/
		GetContinuepayRewardReply = 0x1000e12,			/*领取奖励返回*/
		GetZeroBuyInfoReply = 0x1000e74,			/*返回数据*/
		UpdateZeroBuyInfo = 0x1000e75,			/*更新数据*/
		GetZeroBuyRewardReply = 0x1000e76,			/*领取奖励返回*/
		GetZeroBuyBuyReply = 0x1000e77,			/*购买返回*/
		GetOneBuyInfoReply = 0x1002012,			/*返回数据*/
		UpdateOneBuyInfo = 0x1002013,			/*更新数据*/
		GetOneBuyRewardReply = 0x1002014,			/*领取奖励返回*/
		GetConsumeRewardInfoReply = 0x1000ed8,			/*返回数据*/
		UpdateConsumeRewardInfo = 0x1000ed9,			/*更新数据*/
		GetConsumeRewardRewardReply = 0x1000eda,			/*领取奖励返回*/
		GetConsumeReward2InfoReply = 0x100145a,			/*返回数据*/
		UpdateConsumeReward2Info = 0x100145b,			/*更新数据*/
		GetConsumeReward2RewardReply = 0x100145c,			/*领取奖励返回*/
		GetInvestRewardInfoReply = 0x1000fa0,			/*返回数据*/
		UpdateInvestRewardInfo = 0x1000fa1,			/*更新数据*/
		BuyInvestRewardReply = 0x1000fa2,			/*购买投资返回*/
		GetInvestRewardRewardReply = 0x1000fa3,			/*领取奖励返回*/
		GetSprintRankTaskInfoReply = 0x1001004,			/*返回数据*/
		UpdateSprintRankTaskInfo = 0x1001005,			/*更新数据*/
		GetSprintRankTaskRewardReply = 0x1001006,			/*领取返回*/
		GetSprintRankAllInfoReply = 0x1001007,			/*返回数据*/
		GetSprintRankBaseInfoReply = 0x1001008,			/*返回标签数据*/
		UpdateSprintRankBaseInfo = 0x1001009,			/*更新基本数据(只更新简单信息)*/
		GetSprintRankBeforeReply = 0x100100a,			/*返回历史数据*/
		UpdateSprintRankState = 0x100100b,			/*活动结束推送*/
		GetFeishengRankTaskInfoReply = 0x100100c,			/*返回积分数据*/
		UpdateFeishengRankTaskInfo = 0x100100d,			/*更新积分数据*/
		GetFeishengRankTaskRewardReply = 0x100100e,			/*领取返回*/
		GetPayRewardInfoReply = 0x1001068,			/*返回数据*/
		UpdatePayRewardInfo = 0x1001069,			/*更新数据*/
		PayRewardRunReply = 0x100106a,			/*转盘抽奖返回*/
		GetPayRewardNotesReply = 0x100106b,			/*获取抽奖记录返回*/
		GetPayRewardRewardReply = 0x100106c,			/*获取财富值奖励返回*/
		GetPayRewardServerBroadcastReply = 0x100106d,			/*获取全服记录返回*/
		GetDuobaoInfoReply = 0x1001afe,			/*返回数据*/
		UpdateDuobaoInfo = 0x1001aff,			/*更新数据*/
		DuobaoRunReply = 0x1001b00,			/*转盘抽奖返回*/
		GetDuobaoNotesReply = 0x1001b01,			/*获取抽奖记录返回*/
		GetDuobaoRewardReply = 0x1001b02,			/*获取积分奖励返回*/
		GetDuobaoServerBroadcastReply = 0x1001b03,			/*获取全服记录返回*/
		GetDuobaoRankInfoReply = 0x1001b04,			/*返回夺宝排名*/
		GetJzduobaoInfoReply = 0x1001d56,			/*返回数据*/
		UpdateJzduobaoInfo = 0x1001d57,			/*更新数据*/
		JzduobaoRunReply = 0x1001d58,			/*转盘抽奖返回*/
		GetJzduobaoNotesReply = 0x1001d59,			/*获取抽奖记录返回*/
		GetJzduobaoRewardReply = 0x1001d5a,			/*获取积分奖励返回*/
		GetJzduobaoServerBroadcastReply = 0x1001d5b,			/*获取全服记录返回*/
		GetJzduobaoRankInfoReply = 0x1001d5c,			/*返回夺宝排名*/
		UpdateJzduobaoJackpot = 0x1001d5d,			/*更新奖池*/
		GetGushenInfoReply = 0x10010cc,			/*返回数据*/
		UpdateGushenInfo = 0x10010cd,			/*更新数据*/
		GetGushenTaskRewardReply = 0x10010ce,			/*获取任务奖励返回*/
		GetGushenActiveRewardReply = 0x10010cf,			/*获取激活奖励返回*/
		GetKuanghuanInfoReply = 0x10011f8,			/*返回数据*/
		UpdateKuanghuanInfo = 0x10011f9,			/*更新数据*/
		GetKuanghuanRewardReply = 0x10011fa,			/*获取奖励返回*/
		GetDiscountGiftInfoReply = 0x100132e,			/*返回数据*/
		UpdateDiscountGiftInfo = 0x100132f,			/*更新数据*/
		DiscountGiftBuyReply = 0x1001330,			/*购买返回*/
		GetHalfMonthInfoReply = 0x10018a6,			/*获取数据*/
		UpdateHalfMonthInfo = 0x10018a7,			/*更新数据*/
		GetHalfMonthRewardReply = 0x10018a8,			/*领取*/
		GetEverydayRebateInfoReply = 0x100190a,			/*返回数据*/
		UpdateEverydayRebateInfo = 0x100190b,			/*更新数据*/
		GetEverydayRebateRewardReply = 0x100190c,			/*领取返回*/
		GetLoginRewardInfoReply = 0x1001a9a,			/*返回数据*/
		UpdateLoginRewardInfo = 0x1001a9b,			/*更新数据*/
		GetLoginRewardRewardReply = 0x1001a9c,			/*领取返回*/
		GetCumulatepayFSInfoReply = 0x10016b2,			/*返回数据*/
		UpdateCumulatepayFSInfo = 0x10016b3,			/*更新数据*/
		GetCumulatepayFSRewardReply = 0x10016b4,			/*领取奖励返回*/
		GetPaySingleFSInfoReply = 0x10016b5,			/*返回数据*/
		UpdatePaySingleFSInfo = 0x10016b6,			/*更新数据*/
		GetPaySingleFSRewardReply = 0x10016b7,			/*领取奖励返回*/
		GetConsumeRewardFSInfoReply = 0x10016b8,			/*返回数据*/
		UpdateConsumeRewardFSInfo = 0x10016b9,			/*更新数据*/
		GetConsumeRewardFSRewardReply = 0x10016ba,			/*领取奖励返回*/
		GetRushBuyFSInfoReply = 0x1001716,			/*返回数据*/
		UpdateRushBuyFSInfo = 0x1001717,			/*更新数据*/
		BuyRushBuyFSReply = 0x1001718,			/*购买返回*/
		GetDiscountGiftFSInfoReply = 0x100177a,			/*返回数据*/
		UpdateDiscountGiftFSInfo = 0x100177b,			/*更新数据*/
		BuyDiscountGiftFSReply = 0x100177c,			/*购买返回*/
		GetXianFuInfoReply = 0x1000f3c,			/*获取仙府-家园信息返回*/
		UpdateXianFuInfo = 0x1000f3d,			/*更新仙府-家园信息*/
		GetBuildingInfoReply = 0x1000f3e,			/*获取建筑产出信息返回*/
		UpdateBuildingInfo = 0x1000f3f,			/*更新建筑产出信息*/
		UpgradeXianFuReply = 0x1000f40,			/*升级仙府-家园返回*/
		GetBuildProduceAwardReply = 0x1000f41,			/*领取建筑产出奖励返回*/
		UpdateProduceCoin = 0x1000f42,			/*更新仙府-家园产出的币*/
		MakeItemReply = 0x1000f43,			/*制作道具返回*/
		GetSpiritAnimalTravelReply = 0x1000f44,			/*获取灵兽游历信息返回*/
		UpdateSpiritAnimalTravel = 0x1000f45,			/*更新灵兽游历信息*/
		TravelReply = 0x1000f46,			/*出发游历返回*/
		GetTravelAwardReply = 0x1000f47,			/*领取游历奖励返回*/
		BuyFoodReply = 0x1000f48,			/*购买食物返回*/
		TravelFinishReply = 0x1000f49,			/*立即完成游历返回*/
		GetIllustratedHandbookReply = 0x1000f4a,			/*获取图鉴返回*/
		UpdateIllustratedHandbook = 0x1000f4b,			/*更新图鉴*/
		PromoteIllustratedHandbookReply = 0x1000f4c,			/*提升或激活图鉴*/
		XianFuEvent = 0x1000f4d,			/*仙府-家园事件*/
		GetXianFuMallReply = 0x1000f4e,			/*获取仙府-家园神秘商品返回*/
		BuyTravelItemReply = 0x1000f4f,			/*购买游历所需道具*/
		GetXianFuTaskListReply = 0x1000f50,			/*获取仙府-家园任务列表返回*/
		UpdateXianFuTaskState = 0x1000f51,			/*更新任务状态*/
		GetXianFuTaskAwardReply = 0x1000f52,			/*领取任务奖励返回*/
		GetXianFuActivaAwardReply = 0x1000f53,			/*领取活跃度奖励返回*/
		GetXianFuFengShuiInfoReply = 0x1000f54,			/*获取仙府-家园风水信息返回*/
		UpdateXianFuFengShuiInfo = 0x1000f55,			/*更新仙府-家园风水信息*/
		UpgradeFengShuiDecorateReply = 0x1000f56,			/*升级或激活风水物件返回*/
		GetXianFuSkillListReply = 0x1000f57,			/*获取仙府-家园技能返回*/
		PromoteXianFuSkillReply = 0x1000f58,			/*提升或激活技能返回*/
		MakeItemFinishReply = 0x1000f59,			/*立即完成炼制返回*/
		GetXianFuMall2InfoReply = 0x1000f5a,			/*获取仙府-家园商城信息返回*/
		BuyXianFuMall2GoodsReply = 0x1000f5b,			/*购买仙府-家园商城商品返回*/
		F5XianFuMall2Reply = 0x1000f5c,			/*刷新仙府-家园商城返回*/
		GetTiantiReply = 0x1001130,			/*获取天梯 (积分、功勋、剩余次数、奖励状态、参与次数)返回*/
		UpdateTiantiScore = 0x1001131,			/*更新天梯积分 (积分、功勋、剩余次数)*/
		UpdateTiantiJoinAwardStats = 0x1001132,			/*更新参与奖励状态*/
		UpdateTiantiFeatAwardStates = 0x1001133,			/*更新功勋奖励状态*/
		UpdateTiantiTimes = 0x1001134,			/*更新天梯次数*/
		GetTiantiRankReply = 0x1001135,			/*获取天梯排行返回*/
		GetTiantiJoinAwardReply = 0x1001136,			/*领取参与奖励返回*/
		GetTiantiFeatAwardReply = 0x1001137,			/*领取功勋奖励返回*/
		UpdateTiantiHonor = 0x1001138,			/*更新天梯荣誉*/
		UpdateTiantiScoreAward = 0x1001139,			/*更新天梯积分奖励*/
		GetRichesInfoReply = 0x1001194,			/*获取天降财宝信息返回*/
		UpdateRichesInfo = 0x1001195,			/*更新天降财宝信息*/
		UpdateRichesCopy = 0x1001196,			/*更新天降财宝副本数据*/
		GetCloudlandReply = 0x100125c,			/*获取云梦秘境返回*/
		UpdateCloudland = 0x100125d,			/*更新云梦秘境*/
		UpdateDropRecord = 0x100125e,			/*更新云梦秘境掉落记录*/
		GetAdventureInfoReply = 0x10012ca,			/*获取奇遇信息返回*/
		UpdateAdventureInfo = 0x10012cb,			/*更新奇遇信息*/
		BuyYumliReply = 0x10012cc,			/*购买探险次数返回*/
		ChallengeReply = 0x10012cd,			/*挑战操作返回*/
		GetAdventureAwardReply = 0x10012ce,			/*领取奖励返回*/
		UpdateAdventureEvent = 0x10012cf,			/*奇遇单个事件更新*/
		GetAdventureHintReply = 0x10012d0,			/*获取兑换提醒列表返回*/
		AdventureExchangeReply = 0x10012d1,			/*奇遇兑换返回*/
		GetSwimmingInfoReply = 0x1001392,			/*获取昆仑瑶池信息返回*/
		GetSoapInfoReply = 0x1001393,			/*获取肥皂信息*/
		UpdateSwimmingInfo = 0x1001394,			/*更新昆仑瑶池信息*/
		GrabSoapReply = 0x1001395,			/*抓肥皂返回*/
		GetFairyInfoReply = 0x10013f6,			/*获取仙女信息返回*/
		GetFairyLogReply = 0x10013f7,			/*获取仙女护送日志返回*/
		UpdateFairyLog = 0x10013f8,			/*更新仙女护送日志*/
		EscortFairyReply = 0x10013f9,			/*护送仙女返回*/
		InterceptFairyReply = 0x10013fa,			/*拦截仙女返回*/
		RefreshFairyReply = 0x10013fb,			/*刷新仙女返回*/
		SelectFairyReply = 0x10013fc,			/*选择最好的仙女返回*/
		UpdateFairyInfo = 0x10013fd,			/*更新仙女信息返回*/
		GetFairyEscortListReply = 0x10013fe,			/*获取仙女护送列表返回*/
		GetFairyAwardReply = 0x10013ff,			/*领取仙女护送奖励返回*/
		UpdateOtherFairyInfo = 0x1001400,			/*更新其它仙女面板信息*/
		GetTipsPriorInfoReply = 0x10014be,			/*获取优先提示返回(用于失败界面)*/
		GetDesignationReply = 0x1001522,			/*获取称号*/
		UpdateDesignation = 0x1001523,			/*更新称号*/
		ActiveDesignationReply = 0x1001524,			/*激活称号*/
		WearDesignationReply = 0x1001525,			/*穿戴称号*/
		TakeoffDesignationReply = 0x1001526,			/*卸下称号*/
		GetCrossRankReply = 0x1001586,			/*获取排行榜返回*/
		GetActorCrossRankShowReply = 0x1001587,			/*获取排行外观返回*/
		GetActorCrossRankDataReply = 0x1001588,			/*获取角色排行榜数据*/
		GetArenaRankReply = 0x10017de,			/*获取竞技排行返回*/
		GetArenaChallengeRecordReply = 0x10017df,			/*获取竞技排行挑战记录*/
		UpdateArenaChallengeRecord = 0x10017e0,			/*更新竞技排行挑战记录*/
		GetArenaReply = 0x10017e1,			/*获取竞技场*/
		UpdateArenaTime = 0x10017e2,			/*更新竞技场次数*/
		UpdateArenaObjs = 0x10017e3,			/*更新竞技场挑战对象*/
		FlushArenaReply = 0x10017e4,			/*刷新挑战对象*/
		ResetEnterCDReply = 0x10017e5,			/*重置入场CD*/
		GetFeishengRankAllInfoReply = 0x10015ea,			/*返回数据*/
		GetFeishengRankBaseInfoReply = 0x10015eb,			/*返回标签数据*/
		UpdateFeishengRankBaseInfo = 0x10015ec,			/*更新基本数据(只更新简单信息)*/
		GetFeishengRankBeforeReply = 0x10015ed,			/*历史记录返回数据*/
		UpdateFeishengRankState = 0x10015ee,			/*活动结束推送*/
		GetFactionListReply = 0x100164e,			/*获取仙盟列表返回*/
		CreateFactionReply = 0x100164f,			/*创建仙盟返回*/
		GetFactionInfoReply = 0x1001650,			/*获取仙盟信息返回*/
		JoinFactionReply = 0x1001651,			/*申请加入仙盟返回*/
		GetFactionJoinListReply = 0x1001652,			/*获取仙盟申请加入列表*/
		UpdateFactionJoinList = 0x1001653,			/*更新仙盟申请加入列表*/
		ExamineReply = 0x1001654,			/*审批返回*/
		DissolutionReply = 0x1001655,			/*解散返回*/
		BroadcastRecruitReply = 0x1001656,			/*广播招人返回*/
		ExitFactionReply = 0x1001657,			/*退出仙盟返回*/
		KickReply = 0x1001658,			/*踢人返回*/
		SetPositionReply = 0x1001659,			/*任职返回*/
		GetFactionApplyListReply = 0x100165a,			/*获取已申请加入的仙盟列表返回*/
		SetFightReply = 0x100165b,			/*设置战力*/
		SetTitleReply = 0x100165c,			/*设置招人标题*/
		SetNoticeReply = 0x100165d,			/*设置公告*/
		SetExamineReply = 0x100165e,			/*设置加入仙盟审批状态*/
		ApplyForPosReply = 0x100165f,			/*申请职位返回*/
		GetApplyForPosListReply = 0x1001660,			/*获取申请职位列表*/
		ApplyForPosResultReply = 0x1001661,			/*申请职位审批结果返回*/
		AutoInvitation = 0x1001662,			/*自动邀请*/
		GetFactionRankListReply = 0x1001663,			/*获取仙盟排行榜返回*/
		KickNotify = 0x1001664,			/*被踢了通知*/
		GetBoxInfoReply = 0x1001665,			/*获取宝箱相关信息返回*/
		GetBoxListReply = 0x1001666,			/*获取宝箱返回*/
		GetAssistBoxListReply = 0x1001667,			/*获取需要协助的宝箱返回*/
		GetBoxAwardReply = 0x1001668,			/*领取宝箱奖励返回*/
		OpenBoxReply = 0x1001669,			/*挖宝箱返回*/
		AskAssistReply = 0x100166a,			/*请求协助返回*/
		F5BoxReply = 0x100166b,			/*刷新宝箱返回*/
		AddSpeedBoxReply = 0x100166c,			/*加速宝箱返回*/
		AssistOpenBoxReply = 0x100166d,			/*协助别人开宝箱返回*/
		GetFactionCopyInfoReply = 0x100166e,			/*获取仙盟副本信息返回*/
		GetHurtAwardListReply = 0x100166f,			/*获取伤害奖励列表*/
		GetHurtAwardReply = 0x1001670,			/*领取伤害奖励返回*/
		FactionReqInspireReply = 0x1001671,			/*仙盟鼓舞返回*/
		FactionAllInspireReply = 0x1001672,			/*仙盟全员鼓舞返回*/
		GetFactionCopyDataReply = 0x1001673,			/*获取仙盟副本内数据返回*/
		GetFactionSkillListReply = 0x1001674,			/*获取仙盟技能返回*/
		GetFactionTurnReply = 0x1001675,			/*获取转盘信息返回*/
		PromoteFactionSkillReply = 0x1001676,			/*提升或激活技能返回*/
		FactionTurnReply = 0x1001677,			/*仙盟转盘返回*/
		GetFactionTurnRecordReply = 0x1001678,			/*仙盟转盘记录返回*/
		GetBlessAwardReply = 0x1001679,			/*领取幸运值奖励返回*/
		AddCopyTimeReply = 0x100167a,			/*增加仙盟副本时间*/
		UpdateFactionApplyList = 0x100167b,			/*更新仙盟申请加入列表*/
		GetFashionInfoReply = 0x1001842,			/*获取时装信息返回*/
		UpdateFashionInfo = 0x1001843,			/*更新信息*/
		FeedFashionReply = 0x1001844,			/*培养返回*/
		AddFashionSkillLevelReply = 0x1001845,			/*激活/升级技能返回*/
		AddFashionMagicShowReply = 0x1001846,			/*幻化激活/升级返回*/
		ChangeFashionMagicShowReply = 0x1001847,			/*更换幻化返回*/
		AddFashionRefineReply = 0x1001848,			/*修炼返回*/
		GetTianZhuInfoReply = 0x100196e,			/*获取天珠信息返回*/
		UpdateTianZhuInfo = 0x100196f,			/*更新信息*/
		FeedTianZhuReply = 0x1001970,			/*培养返回*/
		AddTianZhuSkillLevelReply = 0x1001971,			/*激活/升级技能返回*/
		AddTianZhuMagicShowReply = 0x1001972,			/*幻化激活/升级返回*/
		ChangeTianZhuMagicShowReply = 0x1001973,			/*更换幻化返回*/
		AddTianZhuRefineReply = 0x1001974,			/*修炼返回*/
		GetXilianReply = 0x1001b62,			/*获取锻造信息*/
		UpdateXilian = 0x1001b63,			/*获取锻造信息*/
		OpenXilianReply = 0x1001b64,			/*开启锻造*/
		EquipXilianReply = 0x1001b65,			/*装备锻造*/
		LockXilianReply = 0x1001b66,			/*锁定锻造*/
		XilianRiseAddLevelReply = 0x1001b67,			/*洗练大师升级*/
		GetShenQiInfoReply = 0x1001a36,			/*获取神器信息返回*/
		EquipFragmentReply = 0x1001a37,			/*放入碎片返回*/
		ActivateShenQiReply = 0x1001a38,			/*激活神器返回*/
		UpdateFragmentList = 0x1001a39,			/*更新碎片*/
		GetOpenRewardReply = 0x1001bc6,			/*获取开服礼包*/
		UpdateOpenReward = 0x1001bc7,			/*更新开服礼包*/
		BuyOpenRewardReply = 0x1001bc8,			/*开服礼包*/
		GetSinglePayJadeReply = 0x1001c2a,			/*获取单笔充值返魂玉返回*/
		GetSinglePayJadeAwardReply = 0x1001c2b,			/*领取单笔充值返魂玉奖励返回*/
		GetSinglePayPrintReply = 0x1001c2c,			/*获取单笔充值返圣印返回*/
		GetSinglePayPrintAwardReply = 0x1001c2d,			/*领取单笔充值返圣印奖励返回*/
		GetWeekSinglePayReply = 0x1001c8e,			/*获取周末狂欢-单笔信息*/
		GetWeekSinglePayAwardReply = 0x1001c8f,			/*领取周末狂欢-单笔奖励返回*/
		GetWeekLoginReply = 0x1001c90,			/*获取周末狂欢-登陆信息返回*/
		GetWeekLoginAwardReply = 0x1001c91,			/*领取周末狂欢-登陆奖励返回*/
		GetWeekAccumulateReply = 0x1001c92,			/*获取周末狂欢-累充信息返回*/
		GetWeekAccumulateAwardReply = 0x1001c93,			/*领取周末狂欢-累充奖励返回*/
		GetWeekConsumeReply = 0x1001c94,			/*获取周末狂欢-消费信息返回*/
		GetWeekConsumeAwardReply = 0x1001c95,			/*领取周末狂欢-消费奖励返回*/
		GetConsumeRankReply = 0x1001cf2,			/*获取消费排行榜数据返回*/
		GetConsumeCountReply = 0x1001cf3,			/*获取本次活动内消费代币券数量*/
		GetLimitPackInfoReply = 0x1001dba,			/*获取限时礼包信息返回*/
		BuyLimitPackReply = 0x1001dbb,			/*购买限时礼包*/
		GetFeedbackListReply = 0x1001e82,			/*获取意见反馈列表返回*/
		UpdateFeedback = 0x1001e83,			/*更新意见反馈*/
		SendFeedbackReply = 0x1001e84,			/*发送意见反馈返回*/
		ExchangeCdkeyReply = 0x1001ee6,			/*兑换激活码返回*/
		GetNoticeReply = 0x1001ee7,			/*获取公告返回*/
		GetInviteGiftReply = 0x1001ee8,			/*获取邀请有礼返回*/
		InviteFriendReply = 0x1001ee9,			/*邀请好友返回*/
		DrawInviteGiftReply = 0x1001eea,			/*提取邀请有礼返回*/
		GetOnceRewardReply = 0x1001fae,			/*获取单次奖励返回*/
		SetOnceRewardDataReply = 0x1001faf,			/*设置数据返回*/
		DrawOnceRewardReply = 0x1001fb0,			/*提取单次奖励返回*/
		UpdateTalismanState = 0x1002076,			/*护符状态*/
		GetTalismanInfoReply = 0x1002077,			/*护符信息返回*/
		ActiveTalismanReply = 0x1002078,			/*激活返回*/
		UpdateMoneyCatState = 0x10020da,			/*护符状态*/
		GetMoneyCatInfoReply = 0x10020db,			/*护符信息返回*/
		ActiveMoneyCatReply = 0x10020dc,			/*激活返回*/
		GetXianYuInfoReply = 0x100213e,			/*获取仙玉信息返回*/
		GetYuGeInfoReply = 0x100213f,			/*获取玉阁信息返回*/
		BuyYuGeGoodsReply = 0x1002140,			/*购买玉阁商品返回*/
		F5YuGeReply = 0x1002141,			/*刷新玉阁返回*/
		GetXianYuFuYuInfoReply = 0x1002142,			/*获取福缘信息返回*/
		GetFuYuanAwardReply = 0x1002143,			/*领取福缘值奖励返回*/
		GetGauntletReply = 0x10021a2,			/*手套信息返回*/
		DrawGauntletReply = 0x10021a3,			/*领取返回*/
		InlayGauntletReply = 0x10021a4,			/*镶嵌返回*/
		GetXianDanListReply = 0x1002206,			/*获取拥有的仙丹列表返回*/
		GetXianDanInfoReply = 0x1002207,			/*获取仙丹信息返回*/
		OneKeyUseXianDanReply = 0x1002208,			/*一键使用仙丹返回*/
		UpdateRetrieve = 0x100226a,			/*更新找回*/
		GetPreventFoolReply = 0x10022ce,			/*信息返回*/
		AnswerPreventFoolReply = 0x10022cf,			/*回答返回*/
		GetStrengthRelpy = 0x1002332,			/*获取体力*/
		UpdateStrongInfoReply = 0x1002333,			/*更新体力*/
		PickTempRewardReply = 0x1002334,			/*领取圣殿奖励返回*/
		UseStrengthItemReply = 0x1002335,			/*使用体力丹返回*/

		/**daw 新增消息号 */
		GetCumulatepay3InfoReply = 0x1002336,                        /*植株迎春返回数据 daw*/
		UpdateCumulatepay3Info = 0x1002337,                        /*植株迎春更新数据 daw*/
		GetCumulatepay3RewardReply = 0x1002338,                        /*植株迎春领取奖励返回 daw*/

		UpdateKuanghai2Task = 0x100233a,                        /*狂嗨2 daw 更新单个任务*/
		GetKuanghai2TaskAwardReply = 0x100233b,                /*狂嗨2 daw 领取任务奖励返回*/
		GetKuanghai2AwardReply = 0x100233c,                        /*狂嗨2 daw 领取奖励返回*/
		JumpKuanghai2TaskReply = 0x100233d,                        /*狂嗨2 daw 领取奖励返回*/
		GetKuanghai2FinalRewardReply = 0x100233e,        /*狂嗨2 daw 最终奖励 返回*/

		/*战队相关返回接口*/
		GetMyClanInfoReply = 0x1002341,								/*我的战队信息返回*/
		SetClanJoinLimitReply = 0x100234c,							/*设置战队最低加入限制返回*/
		SetClanAuditStatusReply = 0x100234d,						/*设置战队是否需要审批返回*/
		GetClanApplyListReply = 0x1002343,							/*获取战队申请列表返回*/
		GetAllClanListReply = 0x100233f,							/*获取所有战队列表*/
		ApplyJoinClanReply = 0x1002342,								/*申请加入战队返回*/
		CreateClanReply = 0x1002340,								/*创建战队返回*/
		ClanRankListReply = 0x100234e,								/*战队排行版返回*/
		DissolveClanReply = 0x1002349,								/*解散战队返回*/
		ClanKickMemberReply = 0x100234b,							/*战队踢人返回*/
		ExitClanReply = 0x100234a,									/*退出战队返回*/
		UpdateClanAppliedListReply2 = 0x1002346,                    /*更新申请过的战队列表*/
		UpdateClanAppliedListReply = 0x100234f,                     /*更新申请过的战队列表*/
		ClanAuditJoinReply = 0x1002348,                             /*加入战队审批返回*/
		ClanApplyListChangeReply = 0x1002344,                       /*战队申请列表改变返回*/
		ClanBuildReply = 0x1002350,                      			/*战队建设返回*/
		ClanRefreshHaloReply = 0x1002351,                           /*战队光环刷新返回*/
		ClanGetLevelRewardReply = 0x1002352,                        /*战队等级奖励领取返回*/
		ClanBuildListReply = 0x1002353,                        		/*战队建设可捐献列表返回*/
		ClanBuildAndHalRefreshReply = 0x1002356,                    /*战队建设和光环刷新返回*/
		ClanGradeLevelListReply = 0x1002354,                        /*战队等级奖励列表返回*/
		ClanHaloRefreshComfirmReply = 0x1002355,                    /*战队光环替换返回*/
		ClanUpdateFightTeamCoinReply = 0x1002357,                   /*更新战队币数据*/
		ClanRenameReply = 0x1002358,                   				/*战队改名*/



		GetXuanhuoCopyReply = 0x1002359,                            /*获取玄火副本返回*/
		GetXuanhuoCopyDataReply = 0x100235b,                        /*获取玄火副本内数据返回*/
		XuanhuoAllInspireReply = 0x100235a,                         /*玄火争夺全体鼓舞返回*/
		XuanhuoGetTaskAwardReply = 0x100235e,                       /*获取玄火副本内任务返回*/
		GetXuanhuoTaskAwardReply = 0x100235f,                       /*领取玄火副本内任务领取奖励返回*/
		GetXuanHuoAchievementAwardListReply = 0x1002360,            /*获取玄火成就列表返回*/
		GetXuanHuoAchievementAwardReply = 0x1002361,                /*领取玄火成就奖励返回*/
		updateXuanhuoHumanDataReply = 0x100235c,					/*更新玄火副本内玩家数据返回*/
		BroadcastXuanhuoNotice = 0x1002362,                         /*玄火副本公告提示*/
		XuanhuoCopyJudgeAward = 0x1002363,                          /*玄火争夺副本结算奖励*/
		SpecifySearchObjReply = 0x1002364,							/*搜索玄火对象返回*/

		UpdateZhizhunInfo = 0x1002365,								/*更新至尊信息*/
		FeedZhizhunReply = 0x1002366,								/*至尊培养返回*/
		AddZhizhunSkillLevelReply = 0x1002367,						/*至尊激活/升级技能返回*/
		GetZhizhunInfoReply = 0x1002368,							/*获取至尊信息返回*/
		GetHolyRechargeInfoReply = 0x1002369,						/*圣装礼包信息返回*/

		SellCashEquipReply = 0x100236a,                             /*出售现金装备返回*/
		CashEquipInfoReply = 0x100236d,          				    /*现金装备信息返回*/
		MergeCashEquipReply = 0x100237c,                     		/*合成现金装备返回*/

		GetCumulateSuperVipReply = 0x100236b,                      	/*获取超级vip返回*/
		GetCustomDesignationReply = 0x100236c, 						/*定制称号返回*/

		SetHeadImgReply = 0x100236e,                                /*设置头像返回*/
		GetHeadImgListReply = 0x100236f,                            /*获取拥有头像列表返回*/
		ActiveHeadImgReply = 0x1002370,                             /*激活或升级头像返回*/

		JiuXiaolingLevelAwardReply = 0x1002371,						/*九霄令获取奖励、基础信息 返回*/
		JiuXiaolingDailyTaskReply = 0x1002372,						/*九霄令日常任务 返回*/
		JiuXiaolingSeasonTaskReply = 0x1002373,						/*九霄令赛季任务 返回*/
		JiuXiaolingGetAwardReply = 0x1002375,						/*九霄令领取奖励 返回*/
		JiuXiaolingGetTaskExpReply = 0x1002376,						/*九霄令领取任务经验 返回*/
		JiuXiaolingBuyLevelReply = 0x1002377,						/*九霄令购买等级 返回*/
		JiuXiaolingGetExtralExpReply = 0x1002378,					/*九霄令领取额外经验 返回*/
		JiuXiaolingUpdateTaskReply = 0x1002374,						/*九霄令更新单个任务(每日、赛季) 返回*/

		CeremonyGeocachingInfoReply = 0x1002379,					/*庆典探索基本信息 返回*/
		CeremonyGeocachingDoReply = 0x100237b,						/*庆典探索抽奖结果 返回*/
		CeremonyGeocachingGetAwardReply = 0x100237a,				/*庆典探索获取积分奖励 返回*/
		CeremonyGeocachingGetRankReply = 0x100237d,					/*庆典探索获取积分奖励 返回*/
		LimitOneDiscountDateTimeReply = 0x100237e,					/*限时一折时间 返回*/
		GetCeremonyDanbiInfoReply = 0x1002382,						/*庆典探索 单笔充值 返回数据*/
		GetCeremonyDanbiRewardReply = 0x1002383,					/*庆典探索 单笔充值 领取奖励返回*/
		UpdateCeremonyDanbiInfo = 0x2021d0,							/*庆典探索 单笔充值 更新数据*/
		GetCeremonyContinuepayInfoReply = 0x1002380,				/*庆典探索 连充 返回数据*/
		GetCeremonyContinuepayRewardReply = 0x1002381,				/*庆典探索 连充 领取奖励返回*/
		GetDropCarnivalInfoReply = 0x1002384,						/*开服 双倍 返回数据*/


		//姻缘
		ReleaseMarryWallReply = 0x100244b,						/*发布姻缘墙 返回*/
		GetMarryWallListReply = 0x100244c,						/*获取姻缘墙列表 返回*/
		UpdateMarryRingInfo = 0x100244d,						/*更新义戒信息*/
		UpdateMarryKeepsakeInfo = 0x100244e,					/*更新信物信息*/
		AddMarryKeepsakeReply = 0x100244f,						/*激活/升级信物 返回*/
		GetMarryKeepsakeInfoReply = 0x1002450,					/*获取信物信息 返回*/
		GradeMarryKeepsakeReply = 0x1002451,					/*进阶信物 返回*/
		AddMarryKeepsakeGradeSkillLevelReply = 0x1002452,		/*升级信物技能 返回*/
		UpdateMarryDollInfo = 0x1002453,						/*更新仙娃信息*/
		GetMarryCopyTimesReply = 0x1002454,						/*获取姻缘副本次数*/
		UpdateMarryCopyTimes = 0x1002455,						/*更新姻缘副本次数*/
		GetMarryInfoReply = 0x1002456,							/*获取姻缘信息 返回*/
		MarryDissolutionReply = 0x1002457,						/*姻缘解散 返回*/
		CreateMarryReply = 0x1002458,							/*姻缘结缘 返回*/
		UpdateMarryTask = 0x1002459,							/*更新姻缘任务单个*/
		GetMarryTaskInfoReply = 0x100245a,						/*获取姻缘任务信息 返回*/
		GetLevelAwardListReply = 0x100245b,						/*获取姻缘等级奖励列表 返回*/
		GetLevelAwardReply = 0x100245c,							/*获取姻缘等级奖励 返回*/
		FeedMarryRingReply = 0x100245d,							/*培养姻缘义戒 返回*/
		FeedMarryDollReply = 0x100245e,							/*培养姻缘仙娃 返回*/
		GetMarryRingInfoReply = 0x100245f,						/*获取姻缘义戒信息 返回*/
		GetMarryDollInfoReply = 0x1002460,						/*获取姻缘仙娃信息 返回*/
		AddMarryRingFeedSkillLevelReply = 0x1002461,			/*培养姻缘戒指技能 返回*/
		FeedMarryReply = 0x1002462,								/*培养姻缘 返回*/
		GradeMarryDollReply = 0x1002463,						/*进阶姻缘仙娃 返回*/
		AddMarryDollFeedSkillLevelReply = 0x1002464,			/*培养姻缘仙娃技能 返回*/
		AddMarryDollGradeSkillLevelReply = 0x1002465,			/*升级姻缘仙娃技能 返回*/
		RiseMarryDollRefineReply = 0x1002466,					/*姻缘仙娃进补 返回*/
		ChangeMarryDollShowReply = 0x1002467,					/*更换姻缘仙娃展示 返回*/
		BroadcastMarryCopyMonsterWare = 0x1002468,				/*广播姻缘副本怪物波数*/
		BuyMarryPackageReply = 0x1002469,						/*购买姻缘礼包 返回*/
		GetMarryTaskAwardReply = 0x100246a,						/*获取姻缘任务奖励 返回*/




		/**限时探索**/
		AddLimitXunbaoSelfBroadcast = 0x1002385,			   /*限寻-增加个人探索记录*/
		UpdateLimitXunbaoInfo = 0x1002386,					   /*限寻-更新探索信息*/
		GetLimitXunbaoServerBroadcastReply = 0x1002387,		   /*限寻-获取探索全服记录 返回*/

		GetLimitXunbaoInfoReply = 0x1002388,				   /*限寻-获取探索信息 返回*/
		RunLimitXunbaoReply = 0x1002389,					   /*限寻-探索结果 返回*/
		LimitXunBaoExchangeReply = 0x100238a,				   /*限寻-兑换结果 返回*/
		LimitXunBaoExchangeListReply = 0x100238b,			   /*限寻-兑换列表 返回*/
		GetLimitXunBaoHintReply = 0x100238c,				   /*限寻-获取勾选兑换提醒列表 返回*/
		GetLimitXunBaoCumulativeTaskInfoReply = 0x100238d,	   /*限寻-获取累计任务信息 返回*/
		GetLimitXunBaoCumulativeTaskRewardReply = 0x100238e,   /*限寻-获取累计任务奖励 返回*/
		GetLimitXunBaoContinuePayInfoReply = 0x100238f,   	   /*限寻-获取连充任务信息 返回*/
		GetLimitXunBaoContinuePayRewardReply = 0x1002390,      /*限寻-获取连充任务奖励 返回*/
		GetLimitXunBaoCashGiftInfoReply = 0x1002391,   	   	   /*限寻-获取现金礼包信息 返回*/
		GetLimitXunBaoCashGiftRewardReply = 0x1002392,         /*限寻-获取现金礼包奖励 返回*/
		GetLimitXunBaoMallInfoReply = 0x1002393,         	   /*限寻-获取商城数据奖励 返回*/
		BuyLimitXunBaoMallItemReply = 0x1002394,         	   /*限寻-购买商城道具奖励 返回*/
		LimitXunbaoRankInfoReply = 0x1002395,			   	   /*限寻-排名 返回*/
		GetLimitXunBaoDayCumulatePayInfoReply = 0x100239a,     /*限寻-获取每日累充任务信息 返回*/
		GetLimitXunBaoDayCumulatePayRewardReply = 0x100239b,   /*限寻-获取每日累充奖励 返回*/
		GetLimitXunBaoCumulatePayInfoReply = 0x100239c,        /*限寻-获取累充豪礼任务信息 返回*/
		GetLimitXunBaoCumulatePayRewardReply = 0x100239d,      /*限寻-获取累充豪礼奖励 返回*/
		GetLimitXunBaoDaySinglePayInfoReply = 0x100239e,           /*限寻-获取每日单笔任务信息 返回*/
		GetLimitXunBaoDaySinglePayRewardReply = 0x100239f,     /*限寻-获取每日单笔奖励 返回*/

		SevenActivityAwdWeeklyTasksReply = 0x1002970,          /*七日活动-领取七天任务奖励 返回 */
		SevenActivityBaseDatasReply = 0x1002971,               /*七日活动-七天任务数据*/

		//副本自动鼓舞
		GetAutoInspireReply = 0x10024df,						/*获取副本自动鼓舞返回*/
		ShiftMsg = 0x1002974,                                   /* 技能位移 */


		/** 战队逐鹿 */
		//战队逐鹿 16786640 => 
		GetTeamChiefHurtReply = 0x10024d0,						/*获取伤害奖励列表返回*/
		ChiefCopyFinishReply = 0x10024d1,						/*战队逐鹿 副本结束通知*/
		GetTeamChiefCopyInfoReply = 0x10024d2,					/*战队逐鹿 副本信息返回*/
		GetTeamBattleCopyInfoReply = 0x10024d3,					/*战队逐鹿 争夺战 副本信息返回*/
		GetTeamPrepareCopyInfoReply = 0x10024d4,				/*战队逐鹿 准备副本信息返回*/
		UpdateGatherInfoReply = 0x10024d5,						/*战队逐鹿 采集状态更新*/
		UpdateTeamBattleInfo = 0x10024d6,						/*战队逐鹿 更新单场积分*/
		GetTeamChiefRankListReply = 0x10024d7,					/*战队逐鹿 首领战rank列表返回*/
		TeamBattleCopyFinishReply = 0x10024d8,					/*战队逐鹿 争夺战 副本完成通知*/
		UpdateTeanBattleScore = 0x10024d9,						/*战队逐鹿 积分数量*/
		GetTeamChiefHurtAwardReply = 0x10024da,					/*领取伤害奖励返回*/
		GetAchievementInfoReply = 0x10024db,					/*成就任务返回*/
		UpdateAchievementTask = 0x10024dc,						/*成就任务更新*/
		GetAchievementTaskAwardReply = 0x10024dd,				/*领取任务奖励返回*/
		UserTransferReply = 0x10024de,							/*传送返回*/
		UpdateTeamBattleReborn = 0x10024e0,						/*战队逐鹿 更新复活*/
		GetTeamBattleWorshipReply = 0x10024e1,					/*战队逐鹿 膜拜返回*/
		GetTeamBattleWorshipInfoReply = 0x10024e2,				/*战队逐鹿 膜拜信息返回*/

		GetTeamChiefScoreReply = 0x10024e3,						/*获取积分奖励列表返回*/
		GetTeamChiefScoreAwardReply = 0x10024e4,					/*领取积分奖励返回*/
		GetTeamBattleCopyTimeReply = 0x10024e5,					/*战队争夺战时间返回*/

		// 地鼠活动
		AutoSC_DiShuData = 0x0100297d,                                          /**地鼠活动数据 id=16787837*/
		AutoSC_DiShuOpen = 0x0100297e,                                          /**砸地鼠消息返回 id=16787838*/
		AutoSC_DiShuRowAwdRet = 0x0100297f,                                     /**领取行奖励返回 id=16787839*/
		AutoSC_DiShuUltimateAwdRet = 0x01002980,                                /**领取终极奖励返回 id=16787840*/
		AutoSC_DiShuRankRet = 0x01002981,                                       /**排行榜数据返回 id=16787841*/
		AutoSC_SelectUltimateRet = 0x01002982,                                  /**选择终极奖励返回 id=16787842*/
		AutoSC_GetTaskAwd = 0x01002983,                                         /**领取任务奖励返回 id=16787843*/

		//外显套装
		AutoSC_ShowSuitInfo = 0x01002984,             /**外显套装数据 id=16787844*/
		AutoSC_ShowSuitUpLevel = 0x01002985,          /**外显套装等级更新 id=16787845*/
		AutoSC_ShowSuitUpPosHallucination = 0x01002986,  /**幻化更新 id=16787846*/

		//光环
		GetGuangHuanInfoReply = 0x1002977,                                                //获取光环信息返回
		FeedGuangHuanReply = 0x1002976,                                                //升级返回
		UpdateGuangHuanInfo = 0x1002978,                                               /*光环更新信息*/
		ChangeGuangHuanMagicShowReply = 0x1002979,                                     /*光环幻化返回*/
		AddGuangHuanRefineReply = 0x100297a,                                           /*光环升级修炼返回*/
		AddGuangHuanMagicShowReply = 0x101297b,                                        /*激活/升级幻化返回*/
		AddGuangHuanSkillLevelReply = 0x101297e,                                       /*激活/升级技能返回*/

		BroadcastData = 0x01002987,                                   /* 测试用 */
	}

	const enum SystemNexusOpcode {
		SV_CommonReply = 0x1100064,			/*通用返回*/
		SV_ServicePing = 0x1100065,			/*ping*/
		SV_RegisterMap = 0x1100066,			/*注册地图*/
		SV_LoadComplateReply = 0x1100067,			/*功能服回应玩家数据加载完成*/
		SV_ReqEnterScene = 0x1100068,			/*请求进入场景*/
		SV_FallbackLogout = 0x1100069,			/*回滚退出场景*/
		SV_GM_SetLocalTimeToNexus = 0x110006a,			/*设置本地时间*/
		SV_GM_SetOpenServerTimeToNexus = 0x110006b,			/*设置开服时间*/
		SV_UpdateActorExt = 0x110006c,			/*更新ActorExt表数据*/
		SV_UpdateNineCopyRankToNexus = 0x110006d,			/*更新九天排名*/
		SV_CheckSetName = 0x110006e,			/*检测改名*/
		SV_UpdateNexusName = 0x110006f,			/*更新玩家名*/
		SV_UpdateNexusOcc = 0x1100070,			/*更新职业*/
		SV_LoginUserToFeatureReply = 0x1100000,			/*添加用户到功能服返回*/
		SV_LoginUserToMapReply = 0x1100001,			/*添加用户到场景服返回*/
		SV_LogoutUserOfMapReply = 0x1100002,			/*用户从Map下线返回*/
		SV_AuthService = 0x1100003,			/*服务器认证*/
		SV_AuthChatReply = 0x1100004,			/*聊天服认证返回*/
		SV_LoginUserToChatOfFeature = 0x1100005,			/*登录到聊天服*/
		SV_LoginUserToCrossOfFeature = 0x1100006,			/*登录到跨服*/
		SV_LoginUserToCrossTOfFeature = 0x1100007,			/*登录到总副本*/
		SV_GetActorImgData = 0x1100008,			/*获取玩家镜像数据*/
		SV_GetActorImgDataOfCross = 0x1100009,			/*获取玩家镜像数据*/
		SV_GetActorImgDataOfFeatureReply = 0x110000a,			/*获取玩家镜像数据返回*/
		SV_ChatReply = 0x110000b,			/*聊天返回*/
		SV_LoginChatFinish = 0x110000c,			/*玩家已登陆上聊天服,同步存放在聊天服数据到功能服*/
		SV_ReqChatInfoOfChat = 0x110000d,			/*请求玩家展示信息到chat服*/
		SV_ReqChatInfoOfFeatureReply = 0x110000e,			/*请求玩家展示信息返回*/
		SV_ReqChatInfoToClient = 0x110000f,			/*请求玩家展示信息返回从chat发过来转发给玩家*/
		SV_ChatRecordToClient = 0x1100010,			/*聊天记录从chat发过来转发给玩家*/
		SV_DelExpressionCountOfChat = 0x1100011,			/*扣除高级聊天表情次数*/
		SV_DelExpressionCountOfFeatureReply = 0x1100012,			/*扣除高级聊天表情次数*/
		SV_LoginUserToCenterReply = 0x1100013,			/*添加用户到中心服返回*/
		SV_LoginUserToCenterSuccessReply = 0x1100014,			/*添加用户到中心服通知到Feature返回*/
		SV_GetFairyEscortListToNexus = 0x11001f4,			/*获取护送仙女列表推送客户端*/
		SV_AddFairyEscortLog = 0x11001f5,			/*添加仙女护送日志*/
		SV_UpdateFairyPanelInfoToNexus = 0x11001f6,			/*更新其它仙女面板信息*/
		SV_AuthCrossReply = 0x11000c8,			/*跨服服认证返回*/
		SV_LoginUserToCrossReply = 0x11000c9,			/*添加用户到Cross返回*/
		SV_LoginUserToCrossTReply = 0x11000ca,			/*添加用户到Cross返回*/
		SV_RegisterMapToNexus = 0x11000cb,			/*注册地图*/
		SV_AuthCrossTReply = 0x11000cc,			/*跨服服认证返回*/
		SV_RobotEnterScene = 0x11000cd,			/*机器人进入场景*/


	}

	const enum SystemFeatureOpcode {
		SV_LoginUserToFeature = 0x1200000,			/*添加用户到功能服*/
		SV_AuthFeatureReply = 0x1200001,			/*功能服认证返回*/
		SV_SyncServiceToFeature = 0x1200002,			/*同步服务器到功能服*/
		SV_LogoutUserOfFeature = 0x1200003,			/*玩家下线*/
		SV_UpdateServerConnectToFeature = 0x1200004,			/*更新服务器连接*/
		SV_GetActorImgDataOfNexus = 0x1200005,			/*获取玩家镜像数据*/
		SV_LoginUserToCenterSuccess = 0x1200006,			/*用户已登录到中心服*/
		SV_OnhookIncome = 0x1200064,			/*挂机经验、金币、魔力收益*/
		SV_LoadComplateToFeature = 0x1200065,			/*客户端加载完成*/
		SV_UserLoginComplete = 0x1200066,			/*客户端登录完成*/
		SV_UpdateAttrToFeature = 0x1200067,			/*更新角色属性*/
		SV_UpdateFightToFeature = 0x1200068,			/*更新战力*/
		SV_ReqEnterSceneReply = 0x1200069,			/*请求进入场景返回*/
		SV_FallbackToCommonScene = 0x120006a,			/*返回上一个挂机场景*/
		SV_UpdateCopyData = 0x120006b,			/*更新、完成副本层数*/
		SV_UpdateKillMonstetWare = 0x120006c,			/*挂机场景更新当前击杀怪物波数*/
		SV_UpdateOnhookUpdateTime = 0x120006d,			/*更新上一次挂机掉落的时间*/
		SV_SetLocalTimeToFeature = 0x120006e,			/*设置本地时间*/
		SV_KillMonster = 0x120006f,			/*击杀怪物*/
		SV_UpdateForeverScene = 0x1200070,			/*更新公共场景*/
		SV_DelMoney = 0x1200071,			/*扣除金钱*/
		SV_HotupdateToFeature = 0x1200072,			/*Feature热更新*/
		SV_ReloadCfgToFeature = 0x1200073,			/*Feature重新加载配置*/
		SV_DelCopyTimes = 0x1200074,			/*删除副本次数*/
		SV_SynPos = 0x1200075,			/*同步坐标*/
		SV_DelOpenBoxTimes = 0x1200076,			/*扣除开宝箱次数*/
		SV_DelItems = 0x1200077,			/*扣除金钱*/
		SV_ChangeCopyReply = 0x1200078,			/*切换地图、当前场景切换为副本*/
		SV_UpdateActorDead = 0x1200079,			/*更新角色状态*/
		SV_BroadcastCopyState = 0x120007a,			/*广播场景状态*/
		SV_UpdateNineCopy = 0x120007b,			/*更新九天之巅积分*/
		SV_BroadcasNineCopyRank = 0x120007c,			/*广播九天排名，跑马灯广播*/
		SV_UpdateInspireNum = 0x120007d,			/*更新鼓舞次数*/
		SV_AddKillHomeBossNum = 0x120007e,			/*击杀BOSS之家BOSS次数*/
		SV_XianFuEventFinish = 0x120007f,			/*仙府-家园事件完成*/
		SV_GatherEnd = 0x1200080,			/*采集结束*/
		SV_SetOpenServerTimeToFeature = 0x1200081,			/*设置本地时间*/
		SV_AddOwnHomeBossNum = 0x1200082,			/*BOSS之家BOSS归属次数*/
		SV_BroadcastSeasonStateToFeatrue = 0x1200083,			/*更新赛季时间*/
		SV_UpdateSwimmingTime = 0x1200084,			/*记录退出瑶池时间*/
		SV_LoginChatFinishOfNexus = 0x1200085,			/*登陆到聊天服完成，同步存放在聊天服的数据*/
		SV_LoginSceneFinish = 0x1200086,			/*登录场景*/
		SV_JoinKillBossDead = 0x1200087,			/*参与击杀BOSS死亡*/
		SV_CheckNameReply = 0x1200088,			/*检测名字返回*/
		SubStrength = 0x1200089,			/*扣除体力*/
		SV_XianfuGatherEnd = 0x120008a,			/*仙府-家园采集结束*/
		SV_BroadcastSceneRecords = 0x120008b,			/*开启记录*/
		SV_AddItems = 0x12000c8,			/*添加道具*/
		SV_AddItemsOrToEmail = 0x12000c9,			/*背包满则转邮件*/
		SV_GetEmailsAttach = 0x12000ca,			/*领取邮件附件*/
		SV_AddGold = 0x12000cb,			/*添加代币券*/
		SV_AddTempItems = 0x12000cc,			/*添加临时背包道具*/
		SV_GetRankDataReply = 0x120012c,			/*获取排行*/
		SV_GetCrossRankDataReply = 0x120012d,			/*获取排行*/
		SV_UpdateActorRank = 0x120012e,			/*更新玩家排行*/
		SV_ReqOrganizeTeamReplay = 0x12001f4,			/*请求组队返回*/
		SV_CancelOrganizeTeamReply = 0x12001f5,			/*取消组队返回*/
		SV_FinishOrganizeTeam = 0x12001f6,			/*完成组队*/
		SV_InviteJoinTeamReply = 0x12001f7,			/*邀请加入队伍*/
		SV_CreateTeamReply = 0x12001f8,			/*创建队伍*/
		SV_DestoryTeamReply = 0x12001f9,			/*解散队伍*/
		SV_JoinTeamReply = 0x12001fa,			/*接受入队、进入队伍*/
		SV_LeaveTeamReply = 0x12001fb,			/*离开队伍*/
		SV_KickedTeamReply = 0x12001fc,			/*踢出队伍*/
		SV_RechargeOrderExchange = 0x1200190,			/*充值订单兑换*/
		SV_ReqChatInfo = 0x1200258,			/*请求聊天玩家详细信息*/
		SV_DelExpressionCount = 0x1200259,			/*扣除高级聊天表情次数*/
		SV_GetTiantiOfFeatureReply = 0x12002bc,			/*获取角色天梯 (积分、功勋、剩余次数)返回*/
		SV_InterceptFairyReply = 0x1200320,			/*拦截仙女返回*/
		SV_AddInterceptFairyOfFeature = 0x1200321,			/*添加拦截记录*/
		SV_UpdateFeishengRankInfo = 0x1200384,			/*更新飞升榜信息*/
		SV_UpdateFeishengRushBuyInfoReply = 0x1200385,			/*更新飞升榜抢购信息返回*/
		SV_UpdateJzduobaoInfoToFeature = 0x1200386,			/*更新九州夺宝信息*/
		SV_UpdateFeishengRankEnd = 0x1200387,			/*当天飞升榜结算*/
		SV_ChallengeArenaReply = 0x120044c,			/*挑战竞技场*/
		SV_GetArenaRankReply = 0x120044d,			/*获取竞技场排名*/
		SV_UpdateArenaRank = 0x120044e,			/*获取竞技场排名*/
		SV_GetArenaObjsReply = 0x120044f,			/*获取竞技场挑战对象*/
		SV_CreateFaction = 0x12003e8,			/*创建仙盟*/
		SV_UpdateFactionInfoToFeature = 0x12003e9,			/*更新仙盟信息*/
		SV_JoinApply = 0x12003ea,			/*申请加入仙盟*/
		SV_JoinResult = 0x12003eb,			/*离线时被拒绝的仙盟*/
		SV_AskAssistOpenBoxReply = 0x12003ec,			/*请求协助开宝箱返回*/
		SV_UpdateFactionBox = 0x12003ed,			/*刷新仙盟宝箱*/
		SV_AssistOpenBoxReply = 0x12003ee,			/*协助别人开宝箱返回*/
		SV_OtherAssistOpenBox = 0x12003ef,			/*其他人协助自己开宝箱返回*/
		SV_OtherAddSpeedOpenBox = 0x12003f0,			/*其他人加速宝箱*/
		SV_AddFactionHurt = 0x12003f1,			/*对boss造成伤害*/
		SV_ExitFactionCopy = 0x12003f2,			/*退出仙盟副本*/
		SV_UpdateDesignationTime = 0x12004b0,			/*更新称号时间*/
		SV_GetDesinationReply = 0x12004b1,			/*获取称号*/
	}

	const enum SystemChatOpcode {
		SV_AuthChat = 0x1300000,			/*服务器认证*/
		SV_ChatServicePing = 0x1300001,			/*ping*/
		SV_HotupdateToChat = 0x1300002,			/*Chat热更新*/
		SV_ReloadCfgToChat = 0x1300003,			/*Chat重新加载配置*/
		SV_UpdateActorLevelToChat = 0x1300004,			/*更新玩家等级*/
		SV_UpdateActorXianWeiLevelToChat = 0x1300005,			/*更新玩家仙位*/
		SV_UpdateFactionInfo = 0x1300006,			/*更新仙盟信息*/
		SV_FactionDissolution = 0x1300007,			/*仙盟解散，删除记录*/
		SV_UpdateChatName = 0x1300008,			/*更新名字*/
		SV_UpdateChatOcc = 0x1300009,			/*更新职业*/
		SV_LoginUserToChat = 0x1300064,			/*添加玩家到chat*/
		SV_LogoutUserOfChat = 0x1300065,			/*玩家下线*/
		SV_GetActorImgDataOfNexusReply = 0x1300066,			/*获取玩家镜像数据返回*/
		SV_BroadcastChat = 0x13000c8,			/*广播*/
		SV_GmBroadcastChat = 0x13000c9,			/*gm广播，测试用*/
		SV_UpdateChatData = 0x13000ca,			/*更新聊天数据*/
		SV_GetChatDetailedInfoReply = 0x13000cb,			/*获取聊天玩家详细信息返回*/
		SV_DelExpressionCountReply = 0x13000cc,			/*扣除高级表情次数返回*/
		SV_SetBlockSpeak = 0x13000cd,			/*设置禁言*/
		SV_UpdateFairyEscortInfo = 0x1300190,			/*更新护送信息*/
		SV_InterceptFairy = 0x1300191,			/*拦截仙女*/
		SV_InterceptResult = 0x1300192,			/*拦截仙女结果*/
		SV_ReqOrganizeTeam = 0x130012c,			/*请求组队*/
		SV_CancelOrganizeTeam = 0x130012d,			/*取消组队*/
		SV_CreateTeam = 0x130012e,			/*创建队伍*/
		SV_DestoryTeam = 0x130012f,			/*解散队伍*/
		SV_JoinTeam = 0x1300130,			/*接受入队、进入队伍*/
		SV_LeaveTeam = 0x1300131,			/*离开队伍*/
		SV_KickedTeam = 0x1300132,			/*踢出队伍*/
	}

	const enum SystemCrossOpcode {
		SV_HotupdateToCross = 0x1400064,			/*Cross热更新*/
		SV_ReloadCfgToCross = 0x1400065,			/*Cross重新加载配置*/
		SV_GetCrossBoss = 0x14000c8,			/*请求公共BOSS信息*/
		SV_GetCrossForeverScene = 0x14000c9,			/*请求公共场景开放*/
		SV_UpdateNineCopyGains = 0x14000ca,			/*更新九天之巅战绩*/
		SV_GetNineCopyRank = 0x14000cb,			/*获取九天之巅排名*/
		SV_GetSeasonStateFromCross = 0x14000cc,			/*获取赛季状态*/
		SV_GetSceneStateFromCross = 0x14000cd,			/*获取场景状态*/
		SV_GetSceneStateFromCrossOfMap = 0x14000ce,			/*获取场景状态*/
		SV_UpdateCrossName = 0x14000cf,			/*更新名字*/
		SV_UpdateCrossOcc = 0x14000d0,			/*更新职业*/
		SV_GetCopyStateFromCross = 0x14000d1,			/*获取场景状态*/
		SV_GM_SetLocalTimeToCross = 0x1400258,			/*设置本地时间*/
		SV_GM_ResetFeishengRank = 0x1400259,			/*重置飞升榜*/
		SV_GM_ResetJzDuobaoRank = 0x140025a,			/*重置九州夺宝*/
		SV_AuthCross = 0x1400000,			/*服务器认证*/
		SV_CrossServicePing = 0x1400001,			/*ping*/
		SV_RegisterMapToCross = 0x1400002,			/*注册地图*/
		SV_LoginUserToCross = 0x1400003,			/*添加用户到Cross*/
		SV_LoginUserToCrossMap = 0x1400004,			/*登录到跨服场景*/
		SV_LogoutUserToCrossMap = 0x1400005,			/*登出跨服场景*/
		SV_LogoutUserToCross = 0x1400006,			/*用户登出Cross*/
		SV_FallbackLogoutCross = 0x1400007,			/*回滚退出场景*/
		SV_LogoutUserOfMapToCrossReply = 0x1400008,			/*用户登出Cross*/
		SV_LoginUserToMapOfCrossReply = 0x1400009,			/*添加用户到场景服返回*/
		SV_LoginRobotToCross = 0x140000a,			/*添加机器人到Cross*/
		SV_ReqOrganizeTeamToCross = 0x140000b,			/*获取玩家镜像数据返回*/
		SV_CancelOrganizeTeamToCross = 0x140000c,			/*获取玩家镜像数据返回*/
		SV_GetActorImgDataToCrossOfNexusReply = 0x140000d,			/*获取玩家镜像数据返回*/
		SV_LoginBogusUserToCross = 0x140000e,			/*添加用户到Cross*/
		SV_LogoutBogusUserToCross = 0x140000f,			/*用户登出Cross*/
		SV_GetTiantiRank = 0x140012c,			/*获取天梯排名*/
		SV_CommitActorTiantiOfCenter = 0x140012d,			/*更新角色天梯积分*/
		SV_GetCrossRankData = 0x1400190,			/*获取排行*/
		SV_UpdateCrossRankData = 0x1400191,			/*更新排行数据*/
		SV_UpdateActorCrossRankShow = 0x1400192,			/*更新排行外观*/
		SV_UpdateVipLevelToCross = 0x1400193,			/*更新VIP等级*/
		SV_UpdateCrossConsumeRankData = 0x1400194,			/*更新消费排行数据*/
		SV_GetFeishengRankInfo = 0x14001f4,			/*获取飞升榜信息*/
		SV_GetFeishengRankInfoOfCenter = 0x14001f5,			/*获取飞升榜信息*/
		SV_GetJzduobaoInfo = 0x14001f6,			/*获取九州夺宝信息*/
		SV_GetJzduobaoInfoOfCenter = 0x14001f7,			/*获取九州夺宝信息(中心服)*/
		SV_UpdateJzduobaoInfoToCross = 0x14001f8,			/*更新九州夺宝信息*/
		SV_UpdateServerRankToCross = 0x14002bc,			/*更新服排行*/
		SV_CrossAddEmailsReply = 0x1400320,			/*添加邮件*/
	}

	const enum SystemMapOpcode {
		SV_AuthMapReply = 0x1500000,			/*场景服认证返回*/
		SV_HotupdateToMap = 0x1500001,			/*Map热更新*/
		SV_ReloadCfgToMap = 0x1500002,			/*Map重新加载配置*/
		SV_ChangeCopy = 0x1500003,			/*切换地图、当前场景切换为副本/恢复未原先场景*/
		SV_OpenCopyScene = 0x1500004,			/*开启场景*/
		SV_GetSceneStateOfMapReply = 0x1500005,			/*开启场景*/
		SV_CloseCopyScene = 0x1500006,			/*关闭场景*/
		SV_FairyIntercept = 0x1500007,			/*拦截仙女*/
		SV_UpdateSceneLevel = 0x1500008,			/*更新场景层数*/
		SV_UpdateMapName = 0x1500009,			/*更新名字*/
		SV_UpdateMapOcc = 0x150000a,			/*更新职业*/
		SV_Transmit = 0x150000b,			/*测试传送*/
		SV_FallbackCommonScene = 0x150000c,			/*退回挂机场景*/
		SV_LoginUserToMap = 0x1500064,			/*用户登录到场景服或者不同进程切换场景*/
		SV_ChangeScene = 0x1500065,			/*同一个进程中切换场景*/
		SV_LogoutUserOfMap = 0x1500066,			/*用户从Map下线*/
		SV_LoadComplateToMap = 0x1500067,			/*客户端加载完成,将玩家从缓存中放入场景中*/
		SV_LogoutCrossOfNexus = 0x1500068,			/*gate断线后将当前gate的玩家从场景登出*/
		SV_LoginRobotToMap = 0x1500069,			/*机器人加入到场景*/
		SV_UpdateShow = 0x15000c8,			/*更新外观*/
		SV_UpdateAttrToMap = 0x15000c9,			/*更新角色属性*/
		SV_UpdatePetAttrToMap = 0x15000ca,			/*更新角色宠物属性*/
		SV_UpdateSkill = 0x15000cb,			/*更新角色技能*/
		SV_UpdateActorLevel = 0x15000cc,			/*更新角色等级*/
		SV_UpdateActorEra = 0x15000cd,			/*更新角色觉醒*/
		SV_SetLocalTimeToMap = 0x15000ce,			/*设置本地时间*/
		SV_UpdateHomesteadLevel = 0x15000cf,			/*更新家园等级*/
		SV_UpdateHumanPos = 0x15000d0,			/*更新玩家坐标*/
		SV_SetOpenServerTimeToMap = 0x15000d1,			/*设置开服时间*/
		SV_RichesGatherCount = 0x15000d2,			/*更新天降财宝采集数量*/
		SV_UpdateAdventureData = 0x15000d3,			/*更新奇遇数据*/
		SV_UpdateSwimmingData = 0x15000d4,			/*更新昆仑瑶池*/
		SV_GetBoss = 0x150012c,			/*请求公共BOSS信息*/
		SV_GetForeverScene = 0x150012d,			/*请求公共场景*/
		SV_DelMoneyReply = 0x150012e,			/*扣除金钱*/
		SV_DelItemsReply = 0x150012f,			/*扣除道具*/
		SV_UpdateBoxTimes = 0x1500130,			/*更新开启珍品宝箱次数*/
		SV_UpdateCloudlandTimes = 0x1500131,			/*更新云梦秘境次数*/
		SV_XianFuEventTrigger = 0x1500190,			/*仙府-家园事件触发*/
		SV_AddItemsReply = 0x15001f4,			/*往背包添加道具返回*/
		SV_SwapArenaRankReply = 0x15002bc,			/*交换排名返回*/
		SV_UpdateArenaRankToMap = 0x15002bd,			/*更新竞技场排名*/
		SV_AskFactionCopyInfoReply = 0x1500258,			/*请求仙盟副本信息*/
		SV_UpdateFactionInfoToMap = 0x1500259,			/*更新仙盟信息*/
	}

	const enum SystemBgOpcode {
		Bg_CommondReply = 0x1600000,			/*命令返回*/
	}

	const enum SystemCenterOpcode {
		SV_AuthCenterReply = 0x1700000,			/*中心服认证返回*/
		SV_SetLocalTimeToCenter = 0x1700001,			/*设置本地时间*/
		SV_HotupdateToCenter = 0x1700002,			/*Center热更新*/
		SV_ReloadCfgToCenter = 0x1700003,			/*chat重新加载配置*/
		SV_UpdateServerConnectToCenter = 0x1700004,			/*更新服务器连接*/
		SV_UpdateActorRankShow = 0x1700005,			/*更新排行外观*/
		SV_UpdateTeamCopyRank = 0x1700006,			/*更新组队副本排行*/
		SV_UpdateVipLevel = 0x1700007,			/*更新VIP等级*/
		SV_UpdateNineCopyRank = 0x1700008,			/*更新九天排名*/
		SV_SetOpenServerTimeToCenter = 0x1700009,			/*设置本地时间*/
		SV_ResetWelfareToCenter = 0x170000a,			/*重置全服活动*/
		SV_GetSeasonStateFromCenter = 0x170000b,			/*获取赛季状态*/
		SV_GetSceneStateFromCenter = 0x170000c,			/*获取场景状态*/
		SV_BroadcastSeasonStateToCenter = 0x170000d,			/*广播赛季时间*/
		SV_UpdateFight = 0x170000e,			/*更新战力*/
		SV_UpdateLevel = 0x170000f,			/*更新等级*/
		SV_UpdateCenterName = 0x1700010,			/*更新名字*/
		SV_UpdateCenterOcc = 0x1700011,			/*更新职业*/
		SV_BroadcastCopyStateToCenter = 0x1700012,			/*广播场景状态*/
		SV_LoginUserToCenter = 0x1700064,			/*添加玩家到center*/
		SV_UserLoginCompleteToCenter = 0x1700065,			/*客户端加载完成*/
		SV_LogoutUserOfCenter = 0x1700066,			/*玩家下线*/
		SV_GetEmailsAttachReply = 0x17000c8,			/*领取邮件附件返回*/
		SV_AddEmails = 0x170012c,			/*添加邮件*/
		SV_CrossAddEmails = 0x170012d,			/*添加邮件*/
		SV_CrossTAddEmails = 0x170012e,			/*添加邮件*/
		SV_CrossAddEmailsList = 0x170012f,			/*添加多封邮件*/
		SV_CrossTAddEmailsList = 0x1700130,			/*添加多封邮件*/
		SV_GetBossReply = 0x1700190,			/*获取BOSS*/
		SV_UpdateBoss = 0x1700191,			/*更新BOSS*/
		SV_BOSSJoin = 0x1700192,			/*BOSS 参与*/
		SV_BOSSJudgeAward = 0x1700193,			/*BOSS结算奖励*/
		SV_UpdateInspireInfo = 0x1700194,			/*更新鼓舞信息、死亡次数*/
		SV_UpdateBossRankAward = 0x1700195,			/*更新BOSS排名奖励*/
		SV_GetRankData = 0x17001f4,			/*获取排行*/
		SV_UpdateRankData = 0x17001f5,			/*更新排行数据*/
		SV_UpdateXunbaoNote = 0x17001f6,			/*更新探索记录*/
		SV_RechargeOrderExchangeReply = 0x1700258,			/*充值订单兑换结果返回*/
		SV_BroadcastTiantiRank = 0x1700320,			/*广播天梯排名*/
		SV_GetTiantiOfFeature = 0x1700321,			/*获取天梯 (积分、功勋、剩余次数)*/
		SV_UpdateTiantiScore = 0x1700322,			/*更新天梯积分*/
		SV_UpdatePayRewardNote = 0x17002bc,			/*更新充值转盘记录*/
		SV_GetArenaObjs = 0x170044c,			/*添加竞技排行*/
		SV_AddArenaRank = 0x170044d,			/*添加竞技排行*/
		SV_SwapArenaRank = 0x170044e,			/*交换排名*/
		SV_FlushArena = 0x170044f,			/*刷新挑战对象*/
		SV_ChallengeArena = 0x1700450,			/*挑战竞技场*/
		SV_AddChallengeRecord = 0x1700451,			/*添加挑战记录*/
		SV_GetArenaRank = 0x1700452,			/*获取竞技场排名*/
		SV_UpdateFeishengRankInfoOfCenter = 0x17003e8,			/*更新飞升榜信息*/
		SV_GetFeishengRushBuyInfo = 0x17003e9,			/*获取飞升榜抢购信息*/
		SV_UpdateFeishengRushBuyInfo = 0x17003ea,			/*更新飞升榜抢购信息*/
		SV_UpdateFeishengRankEndOfCenter = 0x17003eb,			/*当天飞升榜结算*/
		SV_UpdateDuobaoNote = 0x17003ec,			/*更新夺宝记录*/
		SV_UpdateDuobaoScore = 0x17003ed,			/*更新夺宝积分*/
		SV_UpdateJzduobaoInfoToCenter = 0x17003ee,			/*更新九州夺宝信息*/
		SV_UpdateJzduobaoNote = 0x17003ef,			/*更新九州夺宝记录*/
		SV_UpdateJzduobaoScore = 0x17003f0,			/*更新九州夺宝积分*/
		SV_CreateFactionReply = 0x1700384,			/*创建仙盟返回*/
		SV_SetFactionIdReply = 0x1700385,			/*设置仙盟id返回*/
		SV_JoinApplyReply = 0x1700386,			/*申请加入仙盟返回*/
		SV_AutoInvitationPush = 0x1700387,			/*自动邀请推送*/
		SV_AskAssistOpenBox = 0x1700388,			/*请求协助开宝箱*/
		SV_AddSpeedBox = 0x1700389,			/*加速宝箱*/
		SV_AssistOpenBox = 0x170038a,			/*协助别人开宝箱*/
		SV_UpdateFactionCopy = 0x170038b,			/*更新仙盟副本信息*/
		SV_AskFactionCopyInfo = 0x170038c,			/*请求仙盟副本信息*/
		SV_UpdateTurnRecord = 0x170038d,			/*更新转盘记录*/
		SV_UpdateJoinInfo = 0x170038e,			/*更新申请信息*/
		SV_AddFactionExp = 0x170038f,			/*增加仙盟经验*/
		SV_GmSetFactionExp = 0x1700390,			/*GM设置仙盟经验*/
		SV_AddContribution = 0x1700391,			/*增加贡献值*/
		SV_InviteJoinTeam = 0x17004b0,			/*邀请加入队伍*/
		SV_GetDesination = 0x1700514,			/*获取称号*/
	}

	const enum SystemCrossTOpcode {
		SV_HotupdateToCrossT = 0x1800064,			/*Cross热更新*/
		SV_ReloadCfgToCrossT = 0x1800065,			/*Cross重新加载配置*/
		SV_GetCrossTBoss = 0x18000c8,			/*请求公共BOSS信息*/
		SV_GetCrossTForeverScene = 0x18000c9,			/*请求公共场景开放*/
		SV_GetTeamCopyRank = 0x18000ca,			/*获取组队副本排行*/
		SV_GetSeasonStateFromCrossT = 0x18000cb,			/*获取赛季状态*/
		SV_GetSceneStateFromCrossT = 0x18000cc,			/*获取场景状态*/
		SV_GetSceneStateFromCrossTOfMap = 0x18000cd,			/*获取场景状态*/
		SV_UpdateCrossTName = 0x18000ce,			/*更新名字*/
		SV_UpdateCrossTOcc = 0x18000cf,			/*更新职业*/
		SV_GetCopyStateFromCrossT = 0x18000d0,			/*获取场景状态*/
		SV_AuthCrossT = 0x1800000,			/*服务器认证*/
		SV_CrossTServicePing = 0x1800001,			/*ping*/
		SV_RegisterMapToCrossT = 0x1800002,			/*注册地图*/
		SV_LoginUserToCrossT = 0x1800003,			/*添加用户到Cross*/
		SV_LoginUserToCrossTMap = 0x1800004,			/*登录到总跨服场景*/
		SV_LogoutUserToCrossTMap = 0x1800005,			/*登出总跨服场景*/
		SV_LogoutUserToCrossT = 0x1800006,			/*用户登出Cross*/
		SV_FallbackLogoutCrossT = 0x1800007,			/*回滚退出场景*/
		SV_LogoutUserOfMapToCrossTReply = 0x1800008,			/*用户登出Cross*/
		SV_LoginUserToMapOfCrossTReply = 0x1800009,			/*添加用户到场景服返回*/
		SV_LoginRobotToCrossT = 0x180000a,			/*添加机器人到CrossT*/
		SV_LoginBogusUserToCrossT = 0x180000b,			/*添加用户到CrossT*/
		SV_LogoutBogusUserToCrossT = 0x180000c,			/*用户登出CrossT*/
		SV_UpdateTeamCopyWare = 0x180012c,			/*更新组队通关波数*/
		SV_CrossTAddEmailsReply = 0x1800190,			/*添加邮件*/
	}

	/***************************************Bg命令***************************************/

	const enum BgNexusOpcode {
		Bg_Hotupdate = 0x2100000,			/*热更新*/
		Bg_ReloadCfg = 0x2100001,			/*重新加载配置*/
		Bg_Block = 0x2100002,			/*封禁*/
		Bg_ForceLogout = 0x2100003,			/*下线*/
		Bg_Broadcast = 0x2100004,			/*后台广播*/
		Bg_DelBroadcast = 0x2100005,			/*删除后台广播*/
	}

	const enum BgFeatureOpcode {
		Bg_GMCommonToFeature = 0x2200000,			/*gm指令*/
	}

	const enum BgCenterOpcode {
		Bg_AddEmails = 0x2700000,			/*后台发邮件*/
		Bg_RechargeOrder = 0x2700001,			/*后台充值订单*/
		Bg_FeebackReply = 0x2700002,			/*后台回复意见反馈*/
		Bg_CDKEYProduce = 0x2700003,			/*产生激活码*/
		Bg_CDKEYState = 0x2700004,			/*改变激活码状态*/
		Bg_CDKEYDel = 0x2700005,			/*删除激活码*/
		Bg_UpdateNotice = 0x2700006,			/*更新公告*/
	}

	/***************************************命令类型***************************************/

	interface Types {
		/***************************************User命令***************************************/

		//UserNexusOpcode
		[UserNexusOpcode.AuthClient]: AuthClient,
		[UserNexusOpcode.ActorLogin]: ActorLogin,
		[UserNexusOpcode.LoadComplate]: LoadComplate,
		[UserNexusOpcode.LoginComplete]: LoginComplete,
		[UserNexusOpcode.ClientPing]: ClientPing,
		[UserNexusOpcode.SynTime]: SynTime,

		//UserFeatureOpcode
		[UserFeatureOpcode.GetActorBaseAttr]: GetActorBaseAttr,
		[UserFeatureOpcode.GMCommand]: GMCommand,
		[UserFeatureOpcode.GetActorEquip]: GetActorEquip,
		[UserFeatureOpcode.WearEquip]: WearEquip,
		[UserFeatureOpcode.FastWearEquip]: FastWearEquip,
		[UserFeatureOpcode.GetTask]: GetTask,
		[UserFeatureOpcode.GetTaskAward]: GetTaskAward,
		[UserFeatureOpcode.ReqEnterScene]: ReqEnterScene,
		[UserFeatureOpcode.GetCopyTianguan]: GetCopyTianguan,
		[UserFeatureOpcode.GetCopyAward]: GetCopyAward,
		[UserFeatureOpcode.SweepCopy]: SweepCopy,
		[UserFeatureOpcode.GetActionOpen]: GetActionOpen,
		[UserFeatureOpcode.BuyTimes]: BuyTimes,
		[UserFeatureOpcode.GetCopyTimes]: GetCopyTimes,
		[UserFeatureOpcode.GetOpenBoxTimes]: GetOpenBoxTimes,
		[UserFeatureOpcode.GetTeamCopyTimes]: GetTeamCopyTimes,
		[UserFeatureOpcode.GetCopyRune]: GetCopyRune,
		[UserFeatureOpcode.GetRuneEveryDayAward]: GetRuneEveryDayAward,
		[UserFeatureOpcode.GetRuneDial]: GetRuneDial,
		[UserFeatureOpcode.StartRuneDial]: StartRuneDial,
		[UserFeatureOpcode.GetSceneState]: GetSceneState,
		[UserFeatureOpcode.RunActorOper]: RunActorOper,
		[UserFeatureOpcode.GetGuideList]: GetGuideList,
		[UserFeatureOpcode.FinishGuide]: FinishGuide,
		[UserFeatureOpcode.TriggerGuide]: TriggerGuide,
		[UserFeatureOpcode.GetActionPreviesHaveReceived]: GetActionPreviesHaveReceived,
		[UserFeatureOpcode.GetActionPreviesAward]: GetActionPreviesAward,
		[UserFeatureOpcode.GetServerDay]: GetServerDay,
		[UserFeatureOpcode.GetActionState]: GetActionState,
		[UserFeatureOpcode.GetEquipSuit]: GetEquipSuit,
		[UserFeatureOpcode.LightenUp]: LightenUp,
		[UserFeatureOpcode.OneKeySweepShilianCopy]: OneKeySweepShilianCopy,
		[UserFeatureOpcode.OneKeyChallengeShilianCopy]: OneKeyChallengeShilianCopy,
		[UserFeatureOpcode.GetSetNameInfo]: GetSetNameInfo,
		[UserFeatureOpcode.SetNameOcc]: SetNameOcc,
		[UserFeatureOpcode.GetBag]: GetBag,
		[UserFeatureOpcode.TaskXunbaoBagItemList]: TaskXunbaoBagItemList,
		[UserFeatureOpcode.TaskXunbaoBagAllItem]: TaskXunbaoBagAllItem,
		[UserFeatureOpcode.useBagItem]: useBagItem,
		[UserFeatureOpcode.TaskXianYuXunbaoBagItemList]: TaskXianYuXunbaoBagItemList,
		[UserFeatureOpcode.TaskXianYuXunbaoBagAllItem]: TaskXianYuXunbaoBagAllItem,
		[UserFeatureOpcode.GetPetInfo]: GetPetInfo,
		[UserFeatureOpcode.FeedPet]: FeedPet,
		[UserFeatureOpcode.RankPet]: RankPet,
		[UserFeatureOpcode.AddPetSkillLevel]: AddPetSkillLevel,
		[UserFeatureOpcode.ChangePetShow]: ChangePetShow,
		[UserFeatureOpcode.RiseMagicShow]: RiseMagicShow,
		[UserFeatureOpcode.ChangeMagicShow]: ChangeMagicShow,
		[UserFeatureOpcode.RiseRefine]: RiseRefine,
		[UserFeatureOpcode.AddPetFazhen]: AddPetFazhen,
		[UserFeatureOpcode.ChangePetFazhen]: ChangePetFazhen,
		[UserFeatureOpcode.GetRideInfo]: GetRideInfo,
		[UserFeatureOpcode.FeedRide]: FeedRide,
		[UserFeatureOpcode.RankRide]: RankRide,
		[UserFeatureOpcode.AddRideSkillLevel]: AddRideSkillLevel,
		[UserFeatureOpcode.ChangeRideShow]: ChangeRideShow,
		[UserFeatureOpcode.RiseRideMagicShow]: RiseRideMagicShow,
		[UserFeatureOpcode.ChangeRideMagicShow]: ChangeRideMagicShow,
		[UserFeatureOpcode.RiseRideRefine]: RiseRideRefine,
		[UserFeatureOpcode.AddRideFazhen]: AddRideFazhen,
		[UserFeatureOpcode.ChangeRideFazhen]: ChangeRideFazhen,
		[UserFeatureOpcode.GetSoulInfo]: GetSoulInfo,
		[UserFeatureOpcode.RefineSoul]: RefineSoul,
		[UserFeatureOpcode.RiseSoul]: RiseSoul,
		[UserFeatureOpcode.GetAmuletInfo]: GetAmuletInfo,
		[UserFeatureOpcode.RefineAmulet]: RefineAmulet,
		[UserFeatureOpcode.GetGemInfo]: GetGemInfo,
		[UserFeatureOpcode.InlayGem]: InlayGem,
		[UserFeatureOpcode.RefineGem]: RefineGem,
		[UserFeatureOpcode.RiseGem]: RiseGem,
		[UserFeatureOpcode.GemOneKeyOperation]: GemOneKeyOperation,
		[UserFeatureOpcode.GemReplace]: GemReplace,
		[UserFeatureOpcode.GetSkills]: GetSkills,
		[UserFeatureOpcode.AddSkillLevel]: AddSkillLevel,
		[UserFeatureOpcode.AddSkillLevelOfAll]: AddSkillLevelOfAll,
		[UserFeatureOpcode.OpenSkill]: OpenSkill,
		[UserFeatureOpcode.GetSign]: GetSign,
		[UserFeatureOpcode.Sign]: Sign,
		[UserFeatureOpcode.GetSignAward]: GetSignAward,
		[UserFeatureOpcode.GetSingleBossCopy]: GetSingleBossCopy,
		[UserFeatureOpcode.GetSevenDay]: GetSevenDay,
		[UserFeatureOpcode.GetSevenDayAward]: GetSevenDayAward,
		[UserFeatureOpcode.GetOnlineReward]: GetOnlineReward,
		[UserFeatureOpcode.GetOnlineRewardAward]: GetOnlineRewardAward,
		[UserFeatureOpcode.GetDahuangCopy]: GetDahuangCopy,
		[UserFeatureOpcode.GetBossTimes]: GetBossTimes,
		[UserFeatureOpcode.GetFollowBoss]: GetFollowBoss,
		[UserFeatureOpcode.SetFollowBoss]: SetFollowBoss,
		[UserFeatureOpcode.GetBossIsFirst]: GetBossIsFirst,
		[UserFeatureOpcode.GetEraInfo]: GetEraInfo,
		[UserFeatureOpcode.Era]: Era,
		[UserFeatureOpcode.EraBoss]: EraBoss,
		[UserFeatureOpcode.FastEra]: FastEra,
		[UserFeatureOpcode.DrawEraTask]: DrawEraTask,
		[UserFeatureOpcode.GetStrongInfo]: GetStrongInfo,
		[UserFeatureOpcode.RefineStrong]: RefineStrong,
		[UserFeatureOpcode.RefineStrongOfAll]: RefineStrongOfAll,
		[UserFeatureOpcode.RiseStrong]: RiseStrong,
		[UserFeatureOpcode.GetZhuhunInfo]: GetZhuhunInfo,
		[UserFeatureOpcode.ZhuhunOper]: ZhuhunOper,
		[UserFeatureOpcode.ZhuhunOperOneKey]: ZhuhunOperOneKey,
		[UserFeatureOpcode.ShihunOper]: ShihunOper,
		[UserFeatureOpcode.ShihunOperOneKey]: ShihunOperOneKey,
		[UserFeatureOpcode.Compose]: Compose,
		[UserFeatureOpcode.ComposeAll]: ComposeAll,
		[UserFeatureOpcode.Resolve]: Resolve,
		[UserFeatureOpcode.GetSmeltInfo]: GetSmeltInfo,
		[UserFeatureOpcode.Smelt]: Smelt,
		[UserFeatureOpcode.GetLilianInfo]: GetLilianInfo,
		[UserFeatureOpcode.GetLilianTaskAward]: GetLilianTaskAward,
		[UserFeatureOpcode.GetLilianDayAward]: GetLilianDayAward,
		[UserFeatureOpcode.GetXianweiInfo]: GetXianweiInfo,
		[UserFeatureOpcode.GetXianweiTaskAward]: GetXianweiTaskAward,
		[UserFeatureOpcode.GetXianweiDayAward]: GetXianweiDayAward,
		[UserFeatureOpcode.GetKuanghaiInfo]: GetKuanghaiInfo,
		[UserFeatureOpcode.GetKuanghai2Info]: GetKuanghai2Info,
		[UserFeatureOpcode.GetKuanghaiTaskAward]: GetKuanghaiTaskAward,
		[UserFeatureOpcode.GetKuanghai2TaskAward]: GetKuanghai2TaskAward,
		[UserFeatureOpcode.GetKuanghaiAward]: GetKuanghaiAward,
		[UserFeatureOpcode.GetKuanghai2Award]: GetKuanghai2Award,/**daw */
		[UserFeatureOpcode.JumpKuanghai2Task]: JumpKuanghai2Task,/**daw */
		[UserFeatureOpcode.GetKuanghai2FinalReward]: GetKuanghai2FinalReward,/**daw */
		[UserFeatureOpcode.GetShenbingInfo]: GetShenbingInfo,
		[UserFeatureOpcode.FeedShenbing]: FeedShenbing,
		[UserFeatureOpcode.AddShenbingSkillLevel]: AddShenbingSkillLevel,
		[UserFeatureOpcode.AddShenbingMagicShow]: AddShenbingMagicShow,
		[UserFeatureOpcode.ChangeShenbingMagicShow]: ChangeShenbingMagicShow,
		[UserFeatureOpcode.AddShenbingRefine]: AddShenbingRefine,
		[UserFeatureOpcode.GetWingInfo]: GetWingInfo,
		[UserFeatureOpcode.FeedWing]: FeedWing,
		[UserFeatureOpcode.AddWingSkillLevel]: AddWingSkillLevel,
		[UserFeatureOpcode.AddWingMagicShow]: AddWingMagicShow,
		[UserFeatureOpcode.ChangeWingMagicShow]: ChangeWingMagicShow,
		[UserFeatureOpcode.AddWingRefine]: AddWingRefine,
		[UserFeatureOpcode.GetXunbaoInfo]: GetXunbaoInfo,
		[UserFeatureOpcode.RunXunbao]: RunXunbao,
		[UserFeatureOpcode.XunBaoExchange]: XunBaoExchange,
		[UserFeatureOpcode.GetXunBaoHint]: GetXunBaoHint,
		[UserFeatureOpcode.XunBaoExchangeHint]: XunBaoExchangeHint,
		[UserFeatureOpcode.XunBaoExchangeList]: XunBaoExchangeList,
		[UserFeatureOpcode.GetOutlineInfo]: GetOutlineInfo,
		[UserFeatureOpcode.GetMonthCardInfo]: GetMonthCardInfo,
		[UserFeatureOpcode.GetWeekYuanbaoCardInfo]: GetWeekYuanbaoCardInfo,
		[UserFeatureOpcode.GetWeekFuliCardInfo]: GetWeekFuliCardInfo,
		[UserFeatureOpcode.GetWeekXianyuCardInfo]: GetWeekXianyuCardInfo,
		[UserFeatureOpcode.GetHeroAuraInfo]: GetHeroAuraInfo,
		[UserFeatureOpcode.GetDemonOrderGiftInfo]: GetDemonOrderGiftInfo,
		[UserFeatureOpcode.GetWeekYuanbaoCardReward]: GetWeekYuanbaoCardReward,
		[UserFeatureOpcode.GetWeekFuliCardReward]: GetWeekFuliCardReward,
		[UserFeatureOpcode.GetWeekXianyuCardReward]: GetWeekXianyuCardReward,
		[UserFeatureOpcode.GetHeroAuraReward]: GetHeroAuraReward,
		[UserFeatureOpcode.SetMergeHeroAuraFbCount]: SetMergeHeroAuraFbCount,
		[UserFeatureOpcode.GetDemonOrderGiftReward]: GetDemonOrderGiftReward,
		[UserFeatureOpcode.BuyMonthCard]: BuyMonthCard,
		[UserFeatureOpcode.GetMonthCardReward]: GetMonthCardReward,
		[UserFeatureOpcode.GetZhizunCardInfo]: GetZhizunCardInfo,
		[UserFeatureOpcode.BuyZhizunCard]: BuyZhizunCard,
		[UserFeatureOpcode.GetMallInfo]: GetMallInfo,
		[UserFeatureOpcode.BuyMallItem]: BuyMallItem,
		[UserFeatureOpcode.GetVipInfo]: GetVipInfo,
		[UserFeatureOpcode.GetVipReward]: GetVipReward,
		[UserFeatureOpcode.GetPrivilege]: GetPrivilege,
		[UserFeatureOpcode.GetVipDayReward]: GetVipDayReward,
		[UserFeatureOpcode.GetVipFInfo]: GetVipFInfo,
		[UserFeatureOpcode.GetVipFReward]: GetVipFReward,
		[UserFeatureOpcode.GetRechargeInfo]: GetRechargeInfo,
		[UserFeatureOpcode.GetFirstPayInfo]: GetFirstPayInfo,
		[UserFeatureOpcode.GetFirstPayReward]: GetFirstPayReward,
		[UserFeatureOpcode.ReqOrganizeTeam]: ReqOrganizeTeam,
		[UserFeatureOpcode.CancelOrganizeTeam]: CancelOrganizeTeam,
		[UserFeatureOpcode.CreateTeam]: CreateTeam,
		[UserFeatureOpcode.DestoryTeam]: DestoryTeam,
		[UserFeatureOpcode.InviteJoinTeam]: InviteJoinTeam,
		[UserFeatureOpcode.JoinTeam]: JoinTeam,
		[UserFeatureOpcode.LeaveTeam]: LeaveTeam,
		[UserFeatureOpcode.KickedTeam]: KickedTeam,
		[UserFeatureOpcode.GetRuneInfo]: GetRuneInfo,
		[UserFeatureOpcode.InlayRune]: InlayRune,
		[UserFeatureOpcode.RuneComposePreview]: ComposeRunePreview,
		[UserFeatureOpcode.RuneCompose]: ComposeRune,
		[UserFeatureOpcode.RuneCollectInfo]: RuneCollectInfo,
		[UserFeatureOpcode.RuneCollectSPLevel]: RuneCollectSPLevel,
		[UserFeatureOpcode.RuneCollectDismantle]: RuneCollectDismantle,
		[UserFeatureOpcode.RuneCollectUpLevel]: RuneCollectUpLevel,
		[UserFeatureOpcode.RuneRefine]: RuneRefine,
		[UserFeatureOpcode.ResolveRune]: ResolveRune,
		[UserFeatureOpcode.SetResolveRuneFlag]: SetResolveRuneFlag,
		[UserFeatureOpcode.OneKeySweeping]: OneKeySweeping,
		[UserFeatureOpcode.BuySweepingTimes]: BuySweepingTimes,
		[UserFeatureOpcode.GetSweepingState]: GetSweepingState,
		[UserFeatureOpcode.GetSweepingBaseInfo]: GetSweepingBaseInfo,
		[UserFeatureOpcode.GetSweepingIncome]: GetSweepingIncome,
		[UserFeatureOpcode.GetXiangyaoState]: GetXiangyaoState,
		[UserFeatureOpcode.GetXiangyaoReward]: GetXiangyaoReward,
		[UserFeatureOpcode.GetDaypayInfo]: GetDaypayInfo,
		[UserFeatureOpcode.GetDaypayReward]: GetDaypayReward,
		[UserFeatureOpcode.GetCumulatepayInfo]: GetCumulatepayInfo,
		[UserFeatureOpcode.GetCumulatepayReward]: GetCumulatepayReward,
		[UserFeatureOpcode.GetCumulatepay2Info]: GetCumulatepay2Info,
		[UserFeatureOpcode.GetCumulatepay2Reward]: GetCumulatepay2Reward,

		[UserFeatureOpcode.GetCumulatepay3Info]: GetCumulatepay3Info,
		[UserFeatureOpcode.GetCumulatepay3Reward]: GetCumulatepay3Reward,

		/*战队*/
		[UserFeatureOpcode.CreateClanRequest]: CreateClan,
		[UserFeatureOpcode.ClanRenameRequest]: ClanRename,
		[UserFeatureOpcode.GetAllClanListRequset]: GetClanDataCommon,
		[UserFeatureOpcode.GetAppliedClanListRequset]: AppliedClanList,
		[UserFeatureOpcode.GetAllClanApplyListRequset]: GetClanDataCommon,
		[UserFeatureOpcode.GetMyClanInfoRequset]: GetClanDataCommon,
		[UserFeatureOpcode.GetClanRankingListRequest]: GetClanDataCommon,
		[UserFeatureOpcode.GetAllClanApplyListRequset]: GetClanDataCommon,
		[UserFeatureOpcode.ClanRefreshHaloRequest]: GetClanDataCommon,
		[UserFeatureOpcode.GetClanBuildListRequest]: GetClanDataCommon,
		[UserFeatureOpcode.GetClanGradeAwardRequest]: GetClanDataCommon,
		[UserFeatureOpcode.ClanHaloReplaceRequest]: GetClanDataCommon,
		[UserFeatureOpcode.ClanGetLevelRewardRequest]: ClanGetLevelReward,
		[UserFeatureOpcode.JoinClanApplyRequset]: ApplyJoinClan,
		[UserFeatureOpcode.ClanAuditRequset]: ClanAudit,
		[UserFeatureOpcode.ClanDissolveRequset]: ClanDissolve,
		[UserFeatureOpcode.ExitClanRequset]: ExitClan,
		[UserFeatureOpcode.ClanKickPersonRequset]: ClanKickPerson,
		[UserFeatureOpcode.SetJoinClanAuditStatusRequset]: ClanJoioAuditStatus,
		[UserFeatureOpcode.ClanBuildRequset]: ClanBuildData,
		[UserFeatureOpcode.SetJoinClanLimitRequset]: ClanJoinLimitSet,
		//玄火
		[UserFeatureOpcode.GetXuanhuoCopy]: GetXuanhuoCopy,
		[UserFeatureOpcode.GetXuanhuoCopyData]: GetXuanhuoCopyData,
		[UserFeatureOpcode.XuanhuoAllInspire]: XuanhuoAllInspire,
		[UserFeatureOpcode.XuanhuoGetTaskAward]: XuanhuoGetTaskAward,
		[UserFeatureOpcode.GetXuanhuoTaskAward]: GetXuanhuoTaskAward,
		[UserFeatureOpcode.GetXuanHuoAchievementAwardList]: GetXuanhuoAchiecemtnAwardList,
		[UserFeatureOpcode.GetXuanHuoAchievementAward]: GetXuanhuoAchiecemtnAward,
		[UserFeatureOpcode.SpecifySearchObj]: SpecifySearchObj,

		//至尊装备
		[UserFeatureOpcode.GetZhizhunInfo]: GetZhizhunInfo,
		[UserFeatureOpcode.FeedZhizhun]: FeedZhizhun,
		[UserFeatureOpcode.AddZhizhunSkillLevel]: AddZhizhunSkillLevel,
		[UserFeatureOpcode.GetHolyRechargeInfo]: GetHolyRechargeInfo,

		[UserFeatureOpcode.SellCashEquip]: SellCashEquip,
		[UserFeatureOpcode.CashEquipInfo]: CashEquipInfo,
		[UserFeatureOpcode.MergeCashEquip]: null,



		[UserFeatureOpcode.SuperVipStatusRequest]: SuperVipStatusRequest,
		[UserFeatureOpcode.CustomDesignationRequest]: CustomDesignationRequest,

		[UserFeatureOpcode.SetHeadImg]: SetHeadImg,
		[UserFeatureOpcode.GetHeadImgList]: GetHeadImgList,
		[UserFeatureOpcode.ActiveHeadImg]: ActiveHeadImg,

		[UserFeatureOpcode.GetJiuXiaoLingAwardInfo]: GetJiuXiaoLingAwardInfo,
		[UserFeatureOpcode.GetJiuXiaoLingTaskInfo]: GetJiuXiaoLingTaskInfo,
		[UserFeatureOpcode.GetJiuXiaoLingLevelAward]: GetJiuXiaoLingLevelAward,
		[UserFeatureOpcode.GetJiuXiaoLingTaskExpAward]: GetJiuXiaoLingTaskExpAward,
		[UserFeatureOpcode.BuyJiuXiaoLingLevel]: BuyJiuXiaoLingLevel,
		[UserFeatureOpcode.GetJiuXiaoLingExtralExpPackage]: GetJiuXiaoLingExtralExpPackage,

		[UserFeatureOpcode.CeremonyGeocachingDoRequest]: CelebrationHuntRun,
		[UserFeatureOpcode.CeremonyGeocachingGetAwardRequest]: CeremonyGeocachingGetAward,
		[UserFeatureOpcode.CeremonyGeocachingInfoRequest]: CeremonyGeocachingInfo,
		[UserFeatureOpcode.CeremonyGeocachingGetRankRequest]: CeremonyGeocachingGetRank,
		[UserFeatureOpcode.LitmitOneDiscountDateTimeRequest]: LitmitOneDiscountDateTimeRequest,

		[UserFeatureOpcode.GetContinuepayInfo]: GetContinuepayInfo,
		[UserFeatureOpcode.GetContinuepayReward]: GetContinuepayReward,
		[UserFeatureOpcode.GetZeroBuyInfo]: GetZeroBuyInfo,
		[UserFeatureOpcode.GetZeroBuyReward]: GetZeroBuyReward,
		[UserFeatureOpcode.GetZeroBuyBuy]: GetZeroBuyBuy,
		[UserFeatureOpcode.GetOneBuyInfo]: GetOneBuyInfo,
		[UserFeatureOpcode.GetOneBuyReward]: GetOneBuyReward,
		[UserFeatureOpcode.GetConsumeRewardInfo]: GetConsumeRewardInfo,
		[UserFeatureOpcode.GetConsumeRewardReward]: GetConsumeRewardReward,
		[UserFeatureOpcode.GetConsumeReward2Info]: GetConsumeReward2Info,
		[UserFeatureOpcode.GetConsumeReward2Reward]: GetConsumeReward2Reward,
		[UserFeatureOpcode.GetInvestRewardInfo]: GetInvestRewardInfo,
		[UserFeatureOpcode.BuyInvestReward]: BuyInvestReward,
		[UserFeatureOpcode.GetInvestRewardReward]: GetInvestRewardReward,
		[UserFeatureOpcode.GetSprintRankTaskInfo]: GetSprintRankTaskInfo,
		[UserFeatureOpcode.GetSprintRankTaskReward]: GetSprintRankTaskReward,
		[UserFeatureOpcode.GetPayRewardInfo]: GetPayRewardInfo,
		[UserFeatureOpcode.PayRewardRun]: PayRewardRun,
		[UserFeatureOpcode.GetPayRewardNotes]: GetPayRewardNotes,
		[UserFeatureOpcode.GetPayRewardReward]: GetPayRewardReward,
		[UserFeatureOpcode.GetDuobaoInfo]: GetDuobaoInfo,
		[UserFeatureOpcode.DuobaoRun]: DuobaoRun,
		[UserFeatureOpcode.GetDuobaoNotes]: GetDuobaoNotes,
		[UserFeatureOpcode.GetDuobaoReward]: GetDuobaoReward,
		[UserFeatureOpcode.GetJzduobaoInfo]: GetJzduobaoInfo,
		[UserFeatureOpcode.JzduobaoRun]: JzduobaoRun,
		[UserFeatureOpcode.GetJzduobaoNotes]: GetJzduobaoNotes,
		[UserFeatureOpcode.GetJzduobaoReward]: GetJzduobaoReward,
		[UserFeatureOpcode.GetGushenInfo]: GetGushenInfo,
		[UserFeatureOpcode.GetGushenTaskReward]: GetGushenTaskReward,
		[UserFeatureOpcode.GetGushenActiveReward]: GetGushenActiveReward,
		[UserFeatureOpcode.GetKuanghuanInfo]: GetKuanghuanInfo,
		[UserFeatureOpcode.GetKuanghuanReward]: GetKuanghuanReward,
		[UserFeatureOpcode.GetDiscountGiftInfo]: GetDiscountGiftInfo,
		[UserFeatureOpcode.DiscountGiftBuy]: DiscountGiftBuy,
		[UserFeatureOpcode.GetHalfMonthInfo]: GetHalfMonthInfo,
		[UserFeatureOpcode.GetHalfMonthReward]: GetHalfMonthReward,
		[UserFeatureOpcode.GetEverydayRebateInfo]: GetEverydayRebateInfo,
		[UserFeatureOpcode.GetEverydayRebateReward]: GetEverydayRebateReward,
		[UserFeatureOpcode.GetLoginRewardInfo]: GetLoginRewardInfo,
		[UserFeatureOpcode.GetLoginRewardReward]: GetLoginRewardReward,
		[UserFeatureOpcode.GetCumulatepayFSInfo]: GetCumulatepayFSInfo,
		[UserFeatureOpcode.GetCumulatepayFSReward]: GetCumulatepayFSReward,
		[UserFeatureOpcode.GetPaySingleFSInfo]: GetPaySingleFSInfo,
		[UserFeatureOpcode.GetPaySingleFSReward]: GetPaySingleFSReward,
		[UserFeatureOpcode.GetConsumeRewardFSInfo]: GetConsumeRewardFSInfo,
		[UserFeatureOpcode.GetConsumeRewardFSReward]: GetConsumeRewardFSReward,
		[UserFeatureOpcode.GetRushBuyFSInfo]: GetRushBuyFSInfo,
		[UserFeatureOpcode.BuyRushBuyFS]: BuyRushBuyFS,
		[UserFeatureOpcode.GetDiscountGiftFSInfo]: GetDiscountGiftFSInfo,
		[UserFeatureOpcode.BuyDiscountGiftFS]: BuyDiscountGiftFS,
		[UserFeatureOpcode.GetBlackList]: GetBlackList,
		[UserFeatureOpcode.BlackListOpt]: BlackListOpt,
		[UserFeatureOpcode.GetChatInfo]: GetChatInfo,
		[UserFeatureOpcode.GetNineCopy]: GetNineCopy,
		[UserFeatureOpcode.GetXianFuInfo]: GetXianFuInfo,
		[UserFeatureOpcode.GetBuildingInfo]: GetBuildingInfo,
		[UserFeatureOpcode.UpgradeXianFu]: UpgradeXianFu,
		[UserFeatureOpcode.GetBuildProduceAward]: GetBuildProduceAward,
		[UserFeatureOpcode.MakeItem]: MakeItem,
		[UserFeatureOpcode.GetSpiritAnimalTravel]: GetSpiritAnimalTravel,
		[UserFeatureOpcode.Travel]: Travel,
		[UserFeatureOpcode.TravelFinish]: TravelFinish,
		[UserFeatureOpcode.GetTravelAward]: GetTravelAward,
		[UserFeatureOpcode.GetIllustratedHandbook]: GetIllustratedHandbook,
		[UserFeatureOpcode.PromoteIllustratedHandbook]: PromoteIllustratedHandbook,
		[UserFeatureOpcode.GetXianFuMall]: GetXianFuMall,
		[UserFeatureOpcode.BuyTravelItem]: BuyTravelItem,
		[UserFeatureOpcode.GetXianFuTaskList]: GetXianFuTaskList,
		[UserFeatureOpcode.GetXianFuTaskAward]: GetXianFuTaskAward,
		[UserFeatureOpcode.GetXianFuActivaAward]: GetXianFuActivaAward,
		[UserFeatureOpcode.GetXianFuFengShuiInfo]: GetXianFuFengShuiInfo,
		[UserFeatureOpcode.UpgradeFengShuiDecorate]: UpgradeFengShuiDecorate,
		[UserFeatureOpcode.GetXianFuSkillList]: GetXianFuSkillList,
		[UserFeatureOpcode.PromoteXianFuSkill]: PromoteXianFuSkill,
		[UserFeatureOpcode.MakeItemFinish]: MakeItemFinish,
		[UserFeatureOpcode.GetXianFuMall2Info]: GetXianFuMall2Info,
		[UserFeatureOpcode.BuyXianFuMall2Goods]: BuyXianFuMall2Goods,
		[UserFeatureOpcode.F5XianFuMall2]: F5XianFuMall2,
		[UserFeatureOpcode.GetTianti]: GetTianti,
		[UserFeatureOpcode.GetTiantiJoinAward]: GetTiantiJoinAward,
		[UserFeatureOpcode.GetTiantiFeatAward]: GetTiantiFeatAward,
		[UserFeatureOpcode.GetRichesInfo]: GetRichesInfo,
		[UserFeatureOpcode.GetCloudland]: GetCloudland,
		[UserFeatureOpcode.GetAdventureInfo]: GetAdventureInfo,
		[UserFeatureOpcode.BuyYumli]: BuyYumli,
		[UserFeatureOpcode.Challenge]: Challenge,
		[UserFeatureOpcode.GetAdventureAward]: GetAdventureAward,
		[UserFeatureOpcode.setAdventureHint]: setAdventureHint,
		[UserFeatureOpcode.GetAdventureHint]: GetAdventureHint,
		[UserFeatureOpcode.AdventureExchange]: AdventureExchange,
		[UserFeatureOpcode.GetSwimmingInfo]: GetSwimmingInfo,
		[UserFeatureOpcode.GetSoapInfo]: GetSoapInfo,
		[UserFeatureOpcode.GrabSoap]: GrabSoap,
		[UserFeatureOpcode.GetFairyInfo]: GetFairyInfo,
		[UserFeatureOpcode.GetFairyLog]: GetFairyLog,
		[UserFeatureOpcode.EscortFairy]: EscortFairy,
		[UserFeatureOpcode.InterceptFairy]: InterceptFairy,
		[UserFeatureOpcode.RefreshFairy]: RefreshFairy,
		[UserFeatureOpcode.SelectFairy]: SelectFairy,
		[UserFeatureOpcode.GetFairyAward]: GetFairyAward,
		[UserFeatureOpcode.GetTipsPriorInfo]: GetTipsPriorInfo,
		[UserFeatureOpcode.GetDesignation]: GetDesignation,
		[UserFeatureOpcode.ActiveDesignation]: ActiveDesignation,
		[UserFeatureOpcode.WearDesignation]: WearDesignation,
		[UserFeatureOpcode.TakeoffDesignation]: TakeoffDesignation,
		[UserFeatureOpcode.GetArena]: GetArena,
		[UserFeatureOpcode.FlushArena]: FlushArena,
		[UserFeatureOpcode.ResetEnterCD]: ResetEnterCD,
		[UserFeatureOpcode.GetFactionApplyList]: GetFactionApplyList,
		[UserFeatureOpcode.SelectPush]: SelectPush,
		[UserFeatureOpcode.GetBoxInfo]: GetBoxInfo,
		[UserFeatureOpcode.GetBoxList]: GetBoxList,
		[UserFeatureOpcode.GetBoxAward]: GetBoxAward,
		[UserFeatureOpcode.OpenBox]: OpenBox,
		[UserFeatureOpcode.AskAssist]: AskAssist,
		[UserFeatureOpcode.F5Box]: F5Box,
		[UserFeatureOpcode.AddSpeedBox]: AddSpeedBox,
		[UserFeatureOpcode.AssistOpenBox]: AssistOpenBox,
		[UserFeatureOpcode.GetFactionCopyInfo]: GetFactionCopyInfo,
		[UserFeatureOpcode.GetHurtAwardList]: GetHurtAwardList,
		[UserFeatureOpcode.GetHurtAward]: GetHurtAward,
		[UserFeatureOpcode.FactionReqInspire]: FactionReqInspire,
		[UserFeatureOpcode.GetFactionSkillList]: GetFactionSkillList,
		[UserFeatureOpcode.PromoteFactionSkill]: PromoteFactionSkill,
		[UserFeatureOpcode.GetFactionTurn]: GetFactionTurn,
		[UserFeatureOpcode.FactionTurn]: FactionTurn,
		[UserFeatureOpcode.GetBlessAward]: GetBlessAward,
		[UserFeatureOpcode.AddCopyTime]: AddCopyTime,
		[UserFeatureOpcode.GetFashionInfo]: GetFashionInfo,
		[UserFeatureOpcode.FeedFashion]: FeedFashion,
		[UserFeatureOpcode.AddFashionSkillLevel]: AddFashionSkillLevel,
		[UserFeatureOpcode.AddFashionMagicShow]: AddFashionMagicShow,
		[UserFeatureOpcode.ChangeFashionMagicShow]: ChangeFashionMagicShow,
		[UserFeatureOpcode.AddFashionRefine]: AddFashionRefine,
		[UserFeatureOpcode.GetTianZhuInfo]: GetTianZhuInfo,
		[UserFeatureOpcode.FeedTianZhu]: FeedTianZhu,
		[UserFeatureOpcode.AddTianZhuSkillLevel]: AddTianZhuSkillLevel,
		[UserFeatureOpcode.AddTianZhuMagicShow]: AddTianZhuMagicShow,
		[UserFeatureOpcode.ChangeTianZhuMagicShow]: ChangeTianZhuMagicShow,
		[UserFeatureOpcode.AddTianZhuRefine]: AddTianZhuRefine,
		[UserFeatureOpcode.GetGuangHuanInfo]: GetGuangHuanInfo,
		[UserFeatureOpcode.FeedGuangHuan]: FeedGuangHuan,
		[UserFeatureOpcode.ChangeGuangHuanMagicShow]: ChangeGuangHuanMagicShow,
		[UserFeatureOpcode.AddGuangHuanMagicShow]: AddGuangHuanMagicShow,
		[UserFeatureOpcode.AddGuangHuanRefine]: AddGuangHuanRefine,
		[UserFeatureOpcode.AddGuangHuanSkillLevel]: AddGuangHuanSkillLevel,
		[UserFeatureOpcode.GetXilian]: GetXilian,
		[UserFeatureOpcode.OpenXilian]: OpenXilian,
		[UserFeatureOpcode.EquipXilian]: EquipXilian,
		[UserFeatureOpcode.LockXilian]: LockXilian,
		[UserFeatureOpcode.XilianRiseAddLevel]: XilianRiseAddLevel,
		[UserFeatureOpcode.GetShenQiInfo]: GetShenQiInfo,
		[UserFeatureOpcode.EquipFragment]: EquipFragment,
		[UserFeatureOpcode.ActivateShenQi]: ActivateShenQi,
		[UserFeatureOpcode.GetOpenReward]: GetOpenReward,
		[UserFeatureOpcode.BuyOpenReward]: BuyOpenReward,
		[UserFeatureOpcode.GetSinglePayJade]: GetSinglePayJade,
		[UserFeatureOpcode.GetSinglePayJadeAward]: GetSinglePayJadeAward,
		[UserFeatureOpcode.GetSinglePayPrint]: GetSinglePayPrint,
		[UserFeatureOpcode.GetSinglePayPrintAward]: GetSinglePayPrintAward,
		[UserFeatureOpcode.GetWeekSinglePay]: GetWeekSinglePay,
		[UserFeatureOpcode.GetWeekSinglePayAward]: GetWeekSinglePayAward,
		[UserFeatureOpcode.GetWeekLogin]: GetWeekLogin,
		[UserFeatureOpcode.GetWeekLoginAward]: GetWeekLoginAward,
		[UserFeatureOpcode.GetWeekAccumulate]: GetWeekAccumulate,
		[UserFeatureOpcode.GetWeekAccumulateAward]: GetWeekAccumulateAward,
		[UserFeatureOpcode.GetWeekConsume]: GetWeekConsume,
		[UserFeatureOpcode.GetWeekConsumeAward]: GetWeekConsumeAward,
		[UserFeatureOpcode.GetConsumeCount]: GetConsumeCount,
		[UserFeatureOpcode.GetLimitPackInfo]: GetLimitPackInfo,
		[UserFeatureOpcode.BuyLimitPack]: BuyLimitPack,
		[UserFeatureOpcode.GetInviteGift]: GetInviteGift,
		[UserFeatureOpcode.InviteFriend]: InviteFriend,
		[UserFeatureOpcode.DrawInviteGift]: DrawInviteGift,
		[UserFeatureOpcode.GetOnceReward]: GetOnceReward,
		[UserFeatureOpcode.DrawOnceReward]: DrawOnceReward,
		[UserFeatureOpcode.SetOnceRewardData]: SetOnceRewardData,
		[UserFeatureOpcode.GetTalismanState]: GetTalismanState,
		[UserFeatureOpcode.GetTalismanInfo]: GetTalismanInfo,
		[UserFeatureOpcode.ActiveTalisman]: ActiveTalisman,
		[UserFeatureOpcode.GetMoneyCatState]: GetMoneyCatState,
		[UserFeatureOpcode.GetMoneyCatInfo]: GetMoneyCatInfo,
		[UserFeatureOpcode.ActiveMoneyCat]: ActiveMoneyCat,
		[UserFeatureOpcode.GetXianYuInfo]: GetXianYuInfo,
		[UserFeatureOpcode.GetYuGeInfo]: GetYuGeInfo,
		[UserFeatureOpcode.BuyYuGeGoods]: BuyYuGeGoods,
		[UserFeatureOpcode.F5YuGe]: F5YuGe,
		[UserFeatureOpcode.GetXianYuFuYuInfo]: GetXianYuFuYuInfo,
		[UserFeatureOpcode.GetFuYuanAward]: GetFuYuanAward,
		[UserFeatureOpcode.GetGauntlet]: GetGauntlet,
		[UserFeatureOpcode.InlayGauntlet]: InlayGauntlet,
		[UserFeatureOpcode.DrawGauntlet]: DrawGauntlet,
		[UserFeatureOpcode.GetXianDanList]: GetXianDanList,
		[UserFeatureOpcode.GetXianDanInfo]: GetXianDanInfo,
		[UserFeatureOpcode.OneKeyUseXianDan]: OneKeyUseXianDan,
		[UserFeatureOpcode.GetRetrieve]: GetRetrieve,
		[UserFeatureOpcode.RetrieveRes]: RetrieveRes,
		[UserFeatureOpcode.GetPreventFool]: GetPreventFool,
		[UserFeatureOpcode.AnswerPreventFool]: AnswerPreventFool,
		[UserFeatureOpcode.GetStrength]: GetStrength,
		[UserFeatureOpcode.SetStrength]: SetStrength,
		[UserFeatureOpcode.PickTempReward]: PickTempReward,
		[UserFeatureOpcode.UseStrengthItem]: UseStrengthItem,
		[UserFeatureOpcode.GetCeremonyDanbiInfo]: GetCeremonyDanbiInfo,
		[UserFeatureOpcode.GetCeremonyDanbiReward]: GetCeremonyDanbiReward,
		[UserFeatureOpcode.GetCeremonyContinuepayInfo]: GetCeremonyContinuepayInfo,
		[UserFeatureOpcode.GetCeremonyContinuepayReward]: GetCeremonyContinuepayReward,
		[UserFeatureOpcode.GetDropCarnivalInfo]: GetDropCarnivalInfo,

		//姻缘
		[UserFeatureOpcode.AddMarryKeepsake]: AddMarryKeepsake,
		[UserFeatureOpcode.GetMarryKeepsakeInfo]: GetMarryKeepsakeInfo,
		[UserFeatureOpcode.GradeMarryKeepsake]: GradeMarryKeepsake,
		[UserFeatureOpcode.AddMarryKeepsakeGradeSkillLevel]: AddMarryKeepsakeGradeSkillLevel,
		[UserFeatureOpcode.GetMarryTaskInfo]: GetMarryTaskInfo,
		[UserFeatureOpcode.GetLevelAwardList]: GetLevelAwardList,
		[UserFeatureOpcode.GetLevelAward]: GetLevelAward,
		[UserFeatureOpcode.FeedMarryRing]: FeedMarryRing,
		[UserFeatureOpcode.FeedMarryDoll]: FeedMarryDoll,
		[UserFeatureOpcode.GetMarryRingInfo]: GetMarryRingInfo,
		[UserFeatureOpcode.GetMarryDollInfo]: GetMarryDollInfo,
		[UserFeatureOpcode.AddMarryRingFeedSkillLevel]: AddMarryRingFeedSkillLevel,
		[UserFeatureOpcode.FeedMarry]: FeedMarry,
		[UserFeatureOpcode.GradeMarryDoll]: GradeMarryDoll,

		[UserFeatureOpcode.AddMarryDollFeedSkillLevel]: AddMarryDollFeedSkillLevel,
		[UserFeatureOpcode.AddMarryDollGradeSkillLevel]: AddMarryDollGradeSkillLevel,
		[UserFeatureOpcode.RiseMarryDollRefine]: RiseMarryDollRefine,
		[UserFeatureOpcode.ChangeMarryDollShow]: ChangeMarryDollShow,

		[UserFeatureOpcode.GetMarryCopyTimes]: GetMarryCopyTimes,
		[UserFeatureOpcode.BuyMarryPackage]: BuyMarryPackage,
		[UserFeatureOpcode.GetMarryTaskAward]: GetMarryTaskAward,

		/**限时探索*/
		[UserFeatureOpcode.GetLimitXunbaoInfo]: GetLimitXunbaoInfo,
		[UserFeatureOpcode.RunLimitXunbao]: RunLimitXunbao,
		[UserFeatureOpcode.LimitXunBaoExchange]: LimitXunBaoExchange,
		[UserFeatureOpcode.GetLimitXunBaoHint]: GetLimitXunBaoHint,
		[UserFeatureOpcode.SetLimitXunBaoExchangeHint]: SetLimitXunBaoExchangeHint,
		[UserFeatureOpcode.LimitXunBaoExchangeList]: LimitXunBaoExchangeList,
		[UserFeatureOpcode.GetLimitXunBaoCumulativeTaskInfo]: GetLimitXunBaoCumulativeTaskInfo,
		[UserFeatureOpcode.GetLimitXunBaoCumulativeTaskReward]: GetLimitXunBaoCumulativeTaskReward,
		[UserFeatureOpcode.GetLimitXunBaoContinuePayInfo]: GetLimitXunBaoContinuePayInfo,
		[UserFeatureOpcode.GetLimitXunBaoContinuePayReward]: GetLimitXunBaoContinuePayReward,
		[UserFeatureOpcode.GetLimitXunBaoCashGiftInfo]: GetLimitXunBaoCashGiftInfo,
		[UserFeatureOpcode.GetLimitXunBaoCashGiftReward]: GetLimitXunBaoCashGiftReward,
		[UserFeatureOpcode.GetLimitXunBaoMallInfo]: GetLimitXunBaoMallInfo,
		[UserFeatureOpcode.BuyLimitXunBaoMallItem]: BuyLimitXunBaoMallItem,
		[UserFeatureOpcode.GetLimitXunBaoDayCumulatePayInfo]: GetLimitXunBaoDayCumulatePayInfo,
		[UserFeatureOpcode.GetLimitXunBaoDayCumulatePayReward]: GetLimitXunBaoDayCumulatePayReward,
		[UserFeatureOpcode.GetLimitXunBaoCumulatePayInfo]: GetLimitXunBaoCumulatePayInfo,
		[UserFeatureOpcode.GetLimitXunBaoCumulatePayReward]: GetLimitXunBaoCumulatePayReward,
		[UserFeatureOpcode.GetLimitXunBaoDaySinglePayInfo]: GetLimitXunBaoDaySinglePayInfo,
		[UserFeatureOpcode.GetLimitXunBaoDaySinglePayReward]: GetLimitXunBaoDaySinglePayReward,

		[UserFeatureOpcode.GetSevenActivityDatas]: GetSevenActivityDatas,
		[UserFeatureOpcode.GetSevenActivityAward]: GetSevenActivityAward,

		/** 战队逐鹿 */
		[UserFeatureOpcode.GetTeamChiefCopyInfo]: GetTeamChiefCopyInfo,
		[UserFeatureOpcode.GetTeamChiefHurtAwardList]: GetTeamChiefHurtAwardList,
		[UserFeatureOpcode.GetTeamPrepareCopyInfo]: GetTeamPrepareCopyInfo,
		[UserFeatureOpcode.GetTeamChiefHurtAward]: GetTeamChiefHurtAward,
		[UserFeatureOpcode.GetAchievementInfo]: GetAchievementInfo,
		[UserFeatureOpcode.GetAchievementTaskAward]: GetAchievementTaskAward,
		[UserFeatureOpcode.GetTeamChiefScoreAwardList]: GetTeamChiefScoreAwardList,
		[UserFeatureOpcode.GetTeamChiefScoreAward]: GetTeamChiefScoreAward,

		// 自动鼓舞
		[UserFeatureOpcode.GetAutoInspire]: GetAutoInspire,
		[UserFeatureOpcode.SetAutoInspire]: SetAutoInspire,

		// 地鼠
		[UserFeatureOpcode.AutoUF_DiShuOpen]: AutoUF_DiShuOpen,
		[UserFeatureOpcode.AutoUF_DiShuGetdata]: AutoUF_DiShuGetdata,
		[UserFeatureOpcode.AutoUF_DiShuOpenAll]: AutoUF_DiShuOpenAll,
		[UserFeatureOpcode.AutoUF_DiShuRowAwd]: AutoUF_DiShuRowAwd,
		[UserFeatureOpcode.AutoUF_DiShuUltimateAwd]: AutoUF_DiShuUltimateAwd,
		[UserFeatureOpcode.AutoUF_DiShuTaskAwd]: AutoUF_DiShuTaskAwd,
		[UserFeatureOpcode.AutoUC_GetDiShuRank]: AutoUC_GetDiShuRank,
		[UserFeatureOpcode.AutoUF_SelectUltimate]: AutoUF_SelectUltimate,

		//外显套装
		[UserFeatureOpcode.AutoUF_ShowSuitInfo]: AutoUF_ShowSuitInfo,
		[UserFeatureOpcode.AutoUF_ShowSuitActivation]: AutoUF_ShowSuitActivation,
		[UserFeatureOpcode.AutoUF_ShowSuitUpLevel]: AutoUF_ShowSuitUpLevel,
		[UserFeatureOpcode.AutoUF_ShowSuitHallucination]: AutoUF_ShowSuitHallucination,
		[UserFeatureOpcode.GetLimitXunbaoServerBroadcast]: GetLimitXunbaoServerBroadcast,

		//UserChatOpcode
		[UserChatOpcode.Chat]: Chat,
		[UserChatOpcode.GetChatDetailedInfo]: GetChatDetailedInfo,
		[UserChatOpcode.GetChatRecord]: GetChatRecord,
		[UserChatOpcode.GetFairyEscortList]: GetFairyEscortList,
		[UserChatOpcode.GetFairyPanelInfo]: GetFairyPanelInfo,
		[UserChatOpcode.DelFairyPanelInfoRecord]: DelFairyPanelInfoRecord,

		//UserCrossOpcode
		[UserCrossOpcode.GetCrossRank]: GetCrossRank,
		[UserCrossOpcode.GetActorCrossRankShow]: GetActorCrossRankShow,
		[UserCrossOpcode.GetActorCrossRankData]: GetActorCrossRankData,
		[UserCrossOpcode.GetFeishengRankAllInfo]: GetFeishengRankAllInfo,
		[UserCrossOpcode.GetFeishengRankBaseInfo]: GetFeishengRankBaseInfo,
		[UserCrossOpcode.GetFeishengRankTaskInfo]: GetFeishengRankTaskInfo,
		[UserCrossOpcode.GetFeishengRankTaskReward]: GetFeishengRankTaskReward,
		[UserCrossOpcode.GetFeishengRankBefore]: GetFeishengRankBefore,
		[UserCrossOpcode.GetDuobaoRankInfo]: GetDuobaoRankInfo,
		[UserCrossOpcode.GetJzduobaoRankInfo]: GetJzduobaoRankInfo,
		[UserCrossOpcode.GetConsumeRank]: GetConsumeRank,
		[UserCrossOpcode.GetLimitXunbaoRankInfo]: GetLimitXunbaoRankInfo,

		//UserMapOpcode
		[UserMapOpcode.Move]: Move,
		[UserMapOpcode.ReqRevive]: ReqRevive,
		[UserMapOpcode.RequestRefeshMonster]: RequestRefeshMonster,
		[UserMapOpcode.PlaySkill]: PlaySkill,
		[UserMapOpcode.ReqInspire]: ReqInspire,
		[UserMapOpcode.GetJoinAward]: GetJoinAward,
		[UserMapOpcode.Gather]: Gather,
		[UserMapOpcode.ReqEnterNextLevel]: ReqEnterNextLevel,
		[UserMapOpcode.ReqFlushBoss]: ReqFlushBoss,
		[UserMapOpcode.ReqSearchObj]: ReqSearchObj,
		[UserMapOpcode.GatherInterrupt]: GatherInterrupt,
		[UserMapOpcode.GetInCopyAward]: GetInCopyAward,
		[UserMapOpcode.FactionAllInspire]: FactionAllInspire,
		[UserMapOpcode.GetFactionCopyData]: GetFactionCopyData,
		[UserMapOpcode.KillMonsterCopyTransmit]: KillMonsterCopyTransmit,
		[UserMapOpcode.AdventureCopyTransmit]: AdventureCopyTransmit,
		[UserMapOpcode.UserTransfer]: UserTransfer,

		//UserCenterOpcode
		[UserCenterOpcode.GetEmailCount]: GetEmailCount,
		[UserCenterOpcode.GetEmails]: GetEmails,
		[UserCenterOpcode.ReadEmails]: ReadEmails,
		[UserCenterOpcode.GetEmailsAttachAll]: GetEmailsAttachAll,
		[UserCenterOpcode.DelEmails]: DelEmails,
		[UserCenterOpcode.GetEmailsAttachOnce]: GetEmailsAttachOnce,
		[UserCenterOpcode.GetRank]: GetRank,
		[UserCenterOpcode.GetActorRankShow]: GetActorRankShow,
		[UserCenterOpcode.GetActorRankData]: GetActorRankData,
		[UserCenterOpcode.GetBoss]: GetBoss,
		[UserCenterOpcode.GetBossSingle]: GetBossSingle,
		[UserCenterOpcode.GetBossRankRecord]: GetBossRankRecord,
		[UserCenterOpcode.GetBossKillInfo]: GetBossKillInfo,
		[UserCenterOpcode.GetTeamCopyRank]: GetTeamCopyRank,
		[UserCenterOpcode.GetXunbaoServerBroadcast]: GetXunbaoServerBroadcast,
		[UserCenterOpcode.GetNineCopyRank]: GetNineCopyRank,
		[UserCenterOpcode.GetSprintRankAllInfo]: GetSprintRankAllInfo,
		[UserCenterOpcode.GetSprintRankBaseInfo]: GetSprintRankBaseInfo,
		[UserCenterOpcode.GetSprintRankBefore]: GetSprintRankBefore,
		[UserCenterOpcode.GetPayRewardServerBroadcast]: GetPayRewardServerBroadcast,
		[UserCenterOpcode.GetDuobaoServerBroadcast]: GetDuobaoServerBroadcast,
		[UserCenterOpcode.GetJzduobaoServerBroadcast]: GetJzduobaoServerBroadcast,
		[UserCenterOpcode.GetTiantiRank]: GetTiantiRank,
		[UserCenterOpcode.GetArenaRank]: GetArenaRank,
		[UserCenterOpcode.GetArenaChallengeRecord]: GetArenaChallengeRecord,
		[UserCenterOpcode.GetFactionList]: GetFactionList,
		[UserCenterOpcode.GetFactionInfo]: GetFactionInfo,
		[UserCenterOpcode.CreateFaction]: CreateFaction,
		[UserCenterOpcode.JoinFaction]: JoinFaction,
		[UserCenterOpcode.GetFactionJoinList]: GetFactionJoinList,
		[UserCenterOpcode.Examine]: Examine,
		[UserCenterOpcode.Dissolution]: Dissolution,
		[UserCenterOpcode.BroadcastRecruit]: BroadcastRecruit,
		[UserCenterOpcode.ExitFaction]: ExitFaction,
		[UserCenterOpcode.Kick]: Kick,
		[UserCenterOpcode.SetPosition]: SetPosition,
		[UserCenterOpcode.SetFight]: SetFight,
		[UserCenterOpcode.SetTitle]: SetTitle,
		[UserCenterOpcode.SetNotice]: SetNotice,
		[UserCenterOpcode.SetExamine]: SetExamine,
		[UserCenterOpcode.ApplyForPos]: ApplyForPos,
		[UserCenterOpcode.GetApplyForPosList]: GetApplyForPosList,
		[UserCenterOpcode.ApplyForPosResult]: ApplyForPosResult,
		[UserCenterOpcode.GetFactionRankList]: GetFactionRankList,
		[UserCenterOpcode.GetAssistBoxList]: GetAssistBoxList,
		[UserCenterOpcode.GetFactionTurnRecord]: GetFactionTurnRecord,
		[UserCenterOpcode.GetFeedbackList]: GetFeedbackList,
		[UserCenterOpcode.SendFeedback]: SendFeedback,
		[UserCenterOpcode.ChangeFeedbackState]: ChangeFeedbackState,
		[UserCenterOpcode.GetNotice]: GetNotice,
		[UserCenterOpcode.ExchangeCdkey]: ExchangeCdkey,

		[UserCenterOpcode.GetMarryWallList]: GetMarryWallList,
		[UserCenterOpcode.ReleaseMarryWall]: ReleaseMarryWall,
		[UserCenterOpcode.GetMarryInfo]: GetMarryInfo,
		[UserCenterOpcode.MarryDissolution]: MarryDissolution,
		[UserCenterOpcode.CreateMarry]: CreateMarry,

		[UserCenterOpcode.GetTeamChiefRankList]: GetTeamChiefRankList,
		[UserCenterOpcode.GetTeamBattleCopyStatus]: GetTeamBattleCopyStatus,
		[UserCenterOpcode.GetTeamBattleWorshipInfo]: GetTeamBattleWorshipInfo,
		[UserCenterOpcode.GetTeamBattleWorship]: GetTeamBattleWorship,

		/***************************************System命令***************************************/

		//SystemClientOpcode
		[SystemClientOpcode.AuthClientReply]: AuthClientReply,
		[SystemClientOpcode.CloseClient]: CloseClient,
		[SystemClientOpcode.ActorLoginReply]: ActorLoginReply,
		[SystemClientOpcode.GetActorBaseAttrReply]: GetActorBaseAttrReply,
		[SystemClientOpcode.UpdateHp]: UpdateHp,
		[SystemClientOpcode.UpdateTotalAttr]: UpdateTotalAttr,
		[SystemClientOpcode.GMCommandReply]: GMCommandReply,
		[SystemClientOpcode.UpdateExp]: UpdateExp,
		[SystemClientOpcode.UpdateLevel]: UpdateLevel,
		[SystemClientOpcode.WearEquipReply]: WearEquipReply,
		[SystemClientOpcode.UpdateActorEquip]: UpdateActorEquip,
		[SystemClientOpcode.GetActorEquipReply]: GetActorEquipReply,
		[SystemClientOpcode.GetTaskReply]: GetTaskReply,
		[SystemClientOpcode.GetTaskAwardReply]: GetTaskAwardReply,
		[SystemClientOpcode.UpdateTask]: UpdateTask,
		[SystemClientOpcode.UpdateMoney]: UpdateMoney,
		[SystemClientOpcode.UpdateFight]: UpdateFight,
		[SystemClientOpcode.ReqEnterSceneReply]: ReqEnterSceneReply,
		[SystemClientOpcode.CopyJudgeAward]: CopyJudgeAward,
		[SystemClientOpcode.GetCopyTianguanReply]: GetCopyTianguanReply,
		[SystemClientOpcode.GetCopyAwardReply]: GetCopyAwardReply,
		[SystemClientOpcode.UpdateTianguanCopy]: UpdateTianguanCopy,
		[SystemClientOpcode.UpdateKillMonstetWare]: UpdateKillMonstetWare,
		[SystemClientOpcode.GetActionOpenReply]: GetActionOpenReply,
		[SystemClientOpcode.UpdateActionOpen]: UpdateActionOpen,
		[SystemClientOpcode.SynTimeReply]: SynTimeReply,
		[SystemClientOpcode.GetRankReply]: GetRankReply,
		[SystemClientOpcode.GetCopyDahuangReply]: GetCopyDahuangReply,
		[SystemClientOpcode.UpdateDahuangCopy]: UpdateDahuangCopy,
		[SystemClientOpcode.UpdateIncome]: UpdateIncome,
		[SystemClientOpcode.UpdateActorEra]: UpdateActorEra,
		[SystemClientOpcode.GetActorRankShowReply]: GetActorRankShowReply,
		[SystemClientOpcode.GatherReply]: GatherReply,
		[SystemClientOpcode.GetXunbaoServerBroadcastReply]: GetXunbaoServerBroadcastReply,
		[SystemClientOpcode.GetActorRankDataReply]: GetActorRankDataReply,
		[SystemClientOpcode.UpdateBuffList]: UpdateBuffList,
		[SystemClientOpcode.UpdateActorState]: UpdateActorState,
		[SystemClientOpcode.GetCopyRuneReply]: GetCopyRuneReply,
		[SystemClientOpcode.UpdateRuneCopy]: UpdateRuneCopy,
		[SystemClientOpcode.GetRuneEveryDayAwardReply]: GetRuneEveryDayAwardReply,
		[SystemClientOpcode.GetRuneDialReply]: GetRuneDialReply,
		[SystemClientOpcode.UpdateRuneDial]: UpdateRuneDial,
		[SystemClientOpcode.StartRuneDialReply]: StartRuneDialReply,
		[SystemClientOpcode.GatherEnd]: GatherEnd,
		[SystemClientOpcode.NineCopyJudgeAward]: NineCopyJudgeAward,
		[SystemClientOpcode.GetInCopyAwardReply]: GetInCopyAwardReply,
		[SystemClientOpcode.GetGuideListReply]: GetGuideListReply,
		[SystemClientOpcode.FinishGuideReply]: FinishGuideReply,
		[SystemClientOpcode.BossJudgeAward]: BossJudgeAward,
		[SystemClientOpcode.GetActionPreviesHaveReceivedReply]: GetActionPreviesHaveReceivedReply,
		[SystemClientOpcode.GetActionPreviesAwardReply]: GetActionPreviesAwardReply,
		[SystemClientOpcode.GetServerDayReply]: GetServerDayReply,
		[SystemClientOpcode.UpdateServerDay]: UpdateServerDay,
		[SystemClientOpcode.ArenaJudgeAward]: ArenaJudgeAward,
		[SystemClientOpcode.UpdateNotFoundEnemy]: UpdateNotFoundEnemy,
		[SystemClientOpcode.GetActionStateReply]: GetActionStateReply,
		[SystemClientOpcode.GetEquipSuitReply]: GetEquipSuitReply,
		[SystemClientOpcode.LightenUpReply]: LightenUpReply,
		[SystemClientOpcode.SetNameReply]: SetNameReply,
		[SystemClientOpcode.GetSetNameInfoReply]: GetSetNameInfoReply,
		[SystemClientOpcode.UpdateNameReply]: UpdateNameReply,
		[SystemClientOpcode.UpdateOccReply]: UpdateOccReply,
		[SystemClientOpcode.LeaveScene]: LeaveScene,
		[SystemClientOpcode.EnterScene]: EnterScene,
		[SystemClientOpcode.BroadcastEnterScreen]: BroadcastEnterScreen,
		[SystemClientOpcode.BroadcastLeaveScreen]: BroadcastLeaveScreen,
		[SystemClientOpcode.BroadcastMove]: BroadcastMove,
		[SystemClientOpcode.BroadcastUpDateSpeed]: UpDateSpeed,
		[SystemClientOpcode.BroadcastHp]: BroadcastHp,
		[SystemClientOpcode.ReqReviveReply]: ReqReviveReply,
		[SystemClientOpcode.BroadcastRevive]: BroadcastRevive,
		[SystemClientOpcode.BroadcastDead]: BroadcastDead,
		[SystemClientOpcode.BroadcastReadySkill]: BroadcastReadySkill,
		[SystemClientOpcode.BroadcastPlaySkill]: BroadcastPlaySkill,
		[SystemClientOpcode.BroadcastActorShow]: BroadcastActorShow,
		[SystemClientOpcode.BroadcastBeginCombat]: BroadcastBeginCombat,
		[SystemClientOpcode.BroadcastEndCombat]: BroadcastEndCombat,
		[SystemClientOpcode.BroadcastCopyMonsterWare]: BroadcastCopyMonsterWare,
		[SystemClientOpcode.BroadcastCopyIncome]: BroadcastCopyIncome,
		[SystemClientOpcode.BroadcastCopyStar]: BroadcastCopyStar,
		[SystemClientOpcode.UpdateIncomeRecord]: UpdateIncomeRecord,
		[SystemClientOpcode.GetCopyTimesReply]: GetCopyTimesReply,
		[SystemClientOpcode.UpdateCopyTimes]: UpdateCopyTimes,
		[SystemClientOpcode.BuyTimesReply]: BuyTimesReply,
		[SystemClientOpcode.TransmitPos]: TransmitPos,
		[SystemClientOpcode.PlaySkillReply]: PlaySkillReply,
		[SystemClientOpcode.GetOpenBoxTimesReply]: GetOpenBoxTimesReply,
		[SystemClientOpcode.UpdateOpenBoxTimes]: UpdateOpenBoxTimes,
		[SystemClientOpcode.UpdatePKMode]: UpdatePKMode,
		[SystemClientOpcode.ReqEnterNextLevelReply]: ReqEnterNextLevelReply,
		[SystemClientOpcode.BroadcastEnemyInvad]: BroadcastEnemyInvad,
		[SystemClientOpcode.GetTeamCopyTimesReply]: GetTeamCopyTimesReply,
		[SystemClientOpcode.UpdateTeamCopyTimes]: UpdateTeamCopyTimes,
		[SystemClientOpcode.GetTeamCopyRankReply]: GetTeamCopyRankReply,
		[SystemClientOpcode.BroadcastTeamCopyMonsterWare]: BroadcastTeamCopyMonsterWare,
		[SystemClientOpcode.GetXuanhuoCopyDataReply]: GetXuanhuoCopyDataReply,
		[SystemClientOpcode.XuanhuoAllInspireReply]: XuanhuoAllInspireReply,
		[SystemClientOpcode.XuanhuoGetTaskAwardReply]: XuanHuoGetAwardReply,
		[SystemClientOpcode.GetXuanhuoTaskAwardReply]: GetXuanhuoTaskAwardReply,
		[SystemClientOpcode.UpdateXuanhuoNum]: updateXuanhuoNum,
		[SystemClientOpcode.GetXuanHuoAchievementAwardListReply]: XuanHuoAchievementListReply,
		[SystemClientOpcode.GetXuanHuoAchievementAwardReply]: XuanHuoAchievementAwardReply,
		[SystemClientOpcode.updateXuanhuoHumanDataReply]: XuanhuoCopyNumData,
		[SystemClientOpcode.BroadcastXuanhuoNotice]: BroadcastXuanhuoNotice,
		[SystemClientOpcode.XuanhuoCopyJudgeAward]: XuanhuoCopyJudgeAward,
		[SystemClientOpcode.SpecifySearchObjReply]: SpecifySearchObjReply,

		// 圣装 - 至尊装备
		[SystemClientOpcode.GetZhizhunInfoReply]: GetZhizhunInfoReply,
		[SystemClientOpcode.FeedZhizhunReply]: FeedZhizhunReply,
		[SystemClientOpcode.AddZhizhunSkillLevelReply]: AddZhizhunSkillLevelReply,
		[SystemClientOpcode.UpdateZhizhunInfo]: UpdateZhizhunInfo,
		[SystemClientOpcode.GetHolyRechargeInfoReply]: GetHolyRechargeInfoReply,

		// 奇装 - 现金装备
		[SystemClientOpcode.SellCashEquipReply]: SellCashEquipReply,
		[SystemClientOpcode.CashEquipInfoReply]: CashEquipInfoReply,
		[SystemClientOpcode.MergeCashEquipReply]: MergeCashEquipReply,




		[SystemClientOpcode.GetCumulateSuperVipReply]: GetCumulateSuperVipReply,
		[SystemClientOpcode.GetCustomDesignationReply]: GetCustomDesignationReply,



		[SystemClientOpcode.SetHeadImgReply]: SetHeadImgReply,
		[SystemClientOpcode.GetHeadImgListReply]: GetHeadImgListReply,
		[SystemClientOpcode.ActiveHeadImgReply]: ActiveHeadImgReply,

		// 九霄令
		[SystemClientOpcode.JiuXiaolingLevelAwardReply]: JiuxiaoOrderInfoReply,
		[SystemClientOpcode.JiuXiaolingDailyTaskReply]: JiuxiaoOrderDayTaskReply,
		[SystemClientOpcode.JiuXiaolingSeasonTaskReply]: JiuxiaoOrderSeasonTaskReply,
		[SystemClientOpcode.JiuXiaolingGetAwardReply]: JiuxiaoOrderGetRewardReply,
		[SystemClientOpcode.JiuXiaolingGetTaskExpReply]: JiuxiaoOrderGettTaskRewardReply,
		[SystemClientOpcode.JiuXiaolingBuyLevelReply]: JiuxiaoOrderBuyLevelReply,
		[SystemClientOpcode.JiuXiaolingGetExtralExpReply]: JiuxiaoOrderTakeExpWrapReply,
		[SystemClientOpcode.JiuXiaolingUpdateTaskReply]: JiuxiaoOrderOneTaskReply,

		[SystemClientOpcode.CeremonyGeocachingDoReply]: CelebrationHuntRunReply,
		[SystemClientOpcode.CeremonyGeocachingGetAwardReply]: CelebrationHuntGetScoreRewardReply,
		[SystemClientOpcode.CeremonyGeocachingInfoReply]: CelebrationHuntInfoReply,
		[SystemClientOpcode.CeremonyGeocachingGetRankReply]: CelebrationHuntRankInfoReply,
		[SystemClientOpcode.LimitOneDiscountDateTimeReply]: CelebrationShopInfoReply,
		[SystemClientOpcode.GetCeremonyDanbiRewardReply]: GetCeremonyDanbiRewardReply,
		[SystemClientOpcode.GetCeremonyDanbiInfoReply]: GetCeremonyDanbiInfoReply,

		[SystemClientOpcode.UpdateChangeMap]: UpdateChangeMap,
		[SystemClientOpcode.UpdateBossBirthPos]: UpdateBossBirthPos,
		[SystemClientOpcode.UpdateDropItem]: UpdateDropItem,
		[SystemClientOpcode.BroadcasSceneState]: BroadcasSceneState,
		[SystemClientOpcode.GetSceneStateReply]: GetSceneStateReply,
		[SystemClientOpcode.ScenePromote]: ScenePromote,
		[SystemClientOpcode.UpdateScore]: UpdateScore,
		[SystemClientOpcode.GetNineCopyReply]: GetNineCopyReply,
		[SystemClientOpcode.GetXuanhuoCopyReply]: GetXuanhuoCopyReply,
		[SystemClientOpcode.UpdateNineCopy]: UpdateNineCopy,
		[SystemClientOpcode.GetNineCopyRankReply]: GetNineCopyRankReply,
		[SystemClientOpcode.UpdateNineGatherBox]: UpdateNineGatherBox,
		[SystemClientOpcode.ReqSearchObjReply]: ReqSearchObjReply,
		[SystemClientOpcode.UpdateGatherPos]: UpdateGatherPos,
		[SystemClientOpcode.UpdateNpc]: UpdateNpc,
		[SystemClientOpcode.GetBagReply]: GetBagReply,
		[SystemClientOpcode.UpdateBag]: UpdateBag,
		[SystemClientOpcode.TaskXunbaoBagItemListReply]: TaskXunbaoBagItemListReply,
		[SystemClientOpcode.TaskXunbaoBagAllItemReply]: TaskXunbaoBagAllItemReply,
		[SystemClientOpcode.useBagItemReply]: useBagItemReply,
		[SystemClientOpcode.UpdateBagItemShow]: UpdateBagItemShow,
		[SystemClientOpcode.TaskXianYuXunbaoBagItemListReply]: TaskXianYuXunbaoBagItemListReply,
		[SystemClientOpcode.TaskXianYuXunbaoBagAllItemReply]: TaskXianYuXunbaoBagAllItemReply,
		[SystemClientOpcode.GetPetInfoReply]: GetPetInfoReply,
		[SystemClientOpcode.FeedPetReply]: FeedPetReply,
		[SystemClientOpcode.UpdatePetInfo]: UpdatePetInfo,
		[SystemClientOpcode.AddPetSkillLevelReply]: AddPetSkillLevelReply,
		[SystemClientOpcode.RankPetReply]: RankPetReply,
		[SystemClientOpcode.ChangePetShowReply]: ChangePetShowReply,
		[SystemClientOpcode.RiseMagicShowReply]: RiseMagicShowReply,
		[SystemClientOpcode.ChangeMagicShowReply]: ChangeMagicShowReply,
		[SystemClientOpcode.RiseRefineReply]: RiseRefineReply,
		[SystemClientOpcode.AddPetFazhenReply]: AddPetFazhenReply,
		[SystemClientOpcode.ChangePetFazhenReply]: ChangePetFazhenReply,
		[SystemClientOpcode.GetRideInfoReply]: GetRideInfoReply,
		[SystemClientOpcode.FeedRideReply]: FeedRideReply,
		[SystemClientOpcode.UpdateRideInfo]: UpdateRideInfo,
		[SystemClientOpcode.AddRideSkillLevelReply]: AddRideSkillLevelReply,
		[SystemClientOpcode.RankRideReply]: RankRideReply,
		[SystemClientOpcode.ChangeRideShowReply]: ChangeRideShowReply,
		[SystemClientOpcode.RiseRideMagicShowReply]: RiseRideMagicShowReply,
		[SystemClientOpcode.ChangeRideMagicShowReply]: ChangeRideMagicShowReply,
		[SystemClientOpcode.RiseRideRefineReply]: RiseRideRefineReply,
		[SystemClientOpcode.AddRideFazhenReply]: AddRideFazhenReply,
		[SystemClientOpcode.ChangeRideFazhenReply]: ChangeRideFazhenReply,
		[SystemClientOpcode.GetSoulInfoReply]: GetSoulInfoReply,
		[SystemClientOpcode.UpdateSoulInfo]: UpdateSoulInfo,
		[SystemClientOpcode.RefineSoulReply]: RefineSoulReply,
		[SystemClientOpcode.RiseSoulReply]: RiseSoulReply,
		[SystemClientOpcode.GetAmuletInfoReply]: GetAmuletInfoReply,
		[SystemClientOpcode.UpdateAmuletInfo]: UpdateAmuletInfo,
		[SystemClientOpcode.RefineAmuletReply]: RefineAmuletReply,
		[SystemClientOpcode.GetGemInfoReply]: GetGemInfoReply,
		[SystemClientOpcode.UpdateGemInfo]: UpdateGemInfo,
		[SystemClientOpcode.InlayGemReply]: InlayGemReply,
		[SystemClientOpcode.ReplaceGemReply]: ReplaceGemReply,
		[SystemClientOpcode.RefineGemReply]: RefineGemReply,
		[SystemClientOpcode.RiseGemReply]: RiseGemReply,
		[SystemClientOpcode.OneKeyRefineGemReply]: OneKeyRefineGemReply,
		[SystemClientOpcode.GetSkillsReply]: GetSkillsReply,
		[SystemClientOpcode.UpdateSkill]: UpdateSkill,
		[SystemClientOpcode.AddSkill]: AddSkill,
		[SystemClientOpcode.UpdateZQ]: UpdateZQ,
		[SystemClientOpcode.AddSkillLevelReply]: AddSkillLevelReply,
		[SystemClientOpcode.AddSkillLevelOfAllReply]: AddSkillLevelOfAllReply,
		[SystemClientOpcode.OpenSkillReply]: OpenSkillReply,
		[SystemClientOpcode.GetSignReply]: GetSignReply,
		[SystemClientOpcode.SignReply]: SignReply,
		[SystemClientOpcode.SweepCopyReply]: SweepCopyReply,
		[SystemClientOpcode.GetSingleBossCopyReply]: GetSingleBossCopyReply,
		[SystemClientOpcode.UpdateSingleBossCopy]: UpdateSingleBossCopy,
		[SystemClientOpcode.GetBossReply]: GetBossReply,
		[SystemClientOpcode.UpdateBoss]: UpdateBoss,
		[SystemClientOpcode.UpdateBossHurtRack]: UpdateBossHurtRack,
		[SystemClientOpcode.GetFollowBossReply]: GetFollowBossReply,
		[SystemClientOpcode.GetBossTimesReply]: GetBossTimesReply,
		[SystemClientOpcode.UpdateBossTimes]: UpdateBossTimes,
		[SystemClientOpcode.ReqInspireReply]: ReqInspireReply,
		[SystemClientOpcode.UpdateInspire]: UpdateInspire,
		[SystemClientOpcode.UpdateEnterLater]: UpdateEnterLater,
		[SystemClientOpcode.GetBossRankRecordReply]: GetBossRankRecordReply,
		[SystemClientOpcode.AutoSC_BossKillInfos]: AutoSC_BossKillInfos,
		[SystemClientOpcode.GetJoinAwardReply]: GetJoinAwardReply,
		[SystemClientOpcode.UpdateJoinAward]: UpdateJoinAward,
		[SystemClientOpcode.UpdateBossState]: UpdateBossState,
		[SystemClientOpcode.UpdateBossDropOwns]: UpdateBossDropOwns,
		[SystemClientOpcode.GetBossIsFirstReply]: GetBossIsFirstReply,
		[SystemClientOpcode.OneKeySweepShilianCopyReply]: OneKeySweepShilianCopyReply,
		[SystemClientOpcode.OneKeyChallengeShilianCopyReply]: OneKeyChallengeShilianCopyReply,
		[SystemClientOpcode.GetSevenDayReply]: GetSevenDayReply,
		[SystemClientOpcode.UpdateSevenDay]: UpdateSevenDay,
		[SystemClientOpcode.GetSevenDayAwardReply]: GetSevenDayAwardReply,
		[SystemClientOpcode.GetOnlineRewardReply]: GetOnlineRewardReply,
		[SystemClientOpcode.UpdateOnlineReward]: UpdateOnlineReward,
		[SystemClientOpcode.GetOnlineRewardAwardReply]: GetOnlineRewardAwardReply,
		[SystemClientOpcode.GetEmailCountReply]: GetEmailCountReply,
		[SystemClientOpcode.GetEmailsReply]: GetEmailsReply,
		[SystemClientOpcode.UpdateEmailsState]: UpdateEmailsState,
		[SystemClientOpcode.GetEmailsAttachReply]: GetEmailsAttachReply,
		[SystemClientOpcode.UpdateDelEmails]: UpdateDelEmails,
		[SystemClientOpcode.UpdateAddEmails]: UpdateAddEmails,
		[SystemClientOpcode.DelEmailsReply]: DelEmailsReply,
		[SystemClientOpcode.GetEraInfoReply]: GetEraInfoReply,
		[SystemClientOpcode.UpdateEraInfo]: UpdateEraInfo,
		[SystemClientOpcode.EraReply]: EraReply,
		[SystemClientOpcode.EraBossReply]: EraBossReply,
		[SystemClientOpcode.FastEraReply]: FastEraReply,
		[SystemClientOpcode.DrawEraTaskReply]: DrawEraTaskReply,
		[SystemClientOpcode.GetStrongInfoReply]: GetStrongInfoReply,
		[SystemClientOpcode.UpdateStrongInfo]: UpdateStrongInfo,
		[SystemClientOpcode.RefineStrongReply]: RefineStrongReply,
		[SystemClientOpcode.RefineStrongOfAllReply]: RefineStrongOfAllReply,
		[SystemClientOpcode.RiseStrongReply]: RiseStrongReply,
		[SystemClientOpcode.GetZhuhunInfoReply]: GetZhuhunInfoReply,
		[SystemClientOpcode.UpdateZhuhunInfo]: UpdateZhuhunInfo,
		[SystemClientOpcode.ZhuhunOperReply]: ZhuhunOperReply,
		[SystemClientOpcode.ZhuhunOperOneKeyReply]: ZhuhunOperOneKeyReply,
		[SystemClientOpcode.ShihunOperReply]: ShihunOperReply,
		[SystemClientOpcode.ShihunOperOneKeyReply]: ShihunOperOneKeyReply,
		[SystemClientOpcode.ComposeReply]: ComposeReply,
		[SystemClientOpcode.ResolveReply]: ResolveReply,
		[SystemClientOpcode.GetSmeltInfoReply]: GetSmeltInfoReply,
		[SystemClientOpcode.SmeltReply]: SmeltReply,
		[SystemClientOpcode.GetLilianInfoReply]: GetLilianInfoReply,
		[SystemClientOpcode.UpdateLilianAll]: UpdateLilianAll,
		[SystemClientOpcode.UpdateLilianTask]: UpdateLilianTask,
		[SystemClientOpcode.GetLilianTaskAwardReply]: GetLilianTaskAwardReply,
		[SystemClientOpcode.GetLilianDayAwardReply]: GetLilianDayAwardReply,
		[SystemClientOpcode.GetXianweiInfoReply]: GetXianweiInfoReply,
		[SystemClientOpcode.UpdateXianweiAll]: UpdateXianweiAll,
		[SystemClientOpcode.UpdateXianweiTask]: UpdateXianweiTask,
		[SystemClientOpcode.GetXianweiTaskAwardReply]: GetXianweiTaskAwardReply,
		[SystemClientOpcode.GetXianweiDayAwardReply]: GetXianweiDayAwardReply,
		[SystemClientOpcode.GetKuanghaiInfoReply]: GetKuanghaiInfoReply,
		[SystemClientOpcode.GetKuanghai2InfoReply]: GetKuanghai2InfoReply,//daw
		[SystemClientOpcode.UpdateKuanghaiTask]: UpdateKuanghaiTask,
		[SystemClientOpcode.GetKuanghaiTaskAwardReply]: GetKuanghaiTaskAwardReply,
		[SystemClientOpcode.GetKuanghaiAwardReply]: GetKuanghaiAwardReply,
		[SystemClientOpcode.GetShenbingInfoReply]: GetShenbingInfoReply,
		[SystemClientOpcode.UpdateShenbingInfo]: UpdateShenbingInfo,
		[SystemClientOpcode.FeedShenbingReply]: FeedShenbingReply,
		[SystemClientOpcode.AddShenbingSkillLevelReply]: AddShenbingSkillLevelReply,
		[SystemClientOpcode.AddShenbingMagicShowReply]: AddShenbingMagicShowReply,
		[SystemClientOpcode.ChangeShenbingMagicShowReply]: ChangeShenbingMagicShowReply,
		[SystemClientOpcode.AddShenbingRefineReply]: AddShenbingRefineReply,
		[SystemClientOpcode.GetWingInfoReply]: GetWingInfoReply,
		[SystemClientOpcode.UpdateWingInfo]: UpdateWingInfo,
		[SystemClientOpcode.FeedWingReply]: FeedWingReply,
		[SystemClientOpcode.AddWingSkillLevelReply]: AddWingSkillLevelReply,
		[SystemClientOpcode.AddWingMagicShowReply]: AddWingMagicShowReply,
		[SystemClientOpcode.ChangeWingMagicShowReply]: ChangeWingMagicShowReply,
		[SystemClientOpcode.AddWingRefineReply]: AddWingRefineReply,
		[SystemClientOpcode.GetXunbaoInfoReply]: GetXunbaoInfoReply,
		[SystemClientOpcode.GetXunBaoHintReply]: GetXunBaoHintReply,
		[SystemClientOpcode.GetXunBaoListReply]: XunBaoExchangeListReply,
		[SystemClientOpcode.UpdateXunbaoInfo]: UpdateXunbaoInfo,
		[SystemClientOpcode.AddXunbaoSelfBroadcast]: AddXunbaoSelfBroadcast,
		[SystemClientOpcode.RunXunbaoReply]: RunXunbaoReply,
		[SystemClientOpcode.XunBaoExchangeReply]: XunBaoExchangeReply,
		[SystemClientOpcode.GetOutlineInfoReply]: GetOutlineInfoReply,
		[SystemClientOpcode.GetMonthCardInfoReply]: GetMonthCardInfoReply,
		[SystemClientOpcode.UpdateMonthCardInfo]: UpdateMonthCardInfo,
		[SystemClientOpcode.BuyMonthCardReply]: BuyMonthCardReply,
		[SystemClientOpcode.GetMonthCardRewardReply]: GetMonthCardRewardReply,
		[SystemClientOpcode.GetWeekYuanbaoCardInfoReply]: GetWeekYuanbaoCardInfoReply,
		[SystemClientOpcode.GetWeekFuliCardInfoReply]: GetWeekFuliCardInfoReply,
		[SystemClientOpcode.GetWeekXianyuCardInfoReply]: GetWeekXianyuCardInfoReply,
		[SystemClientOpcode.GetHeroAuraInfoReply]: GetHeroAuraInfoReply,
		[SystemClientOpcode.GetDemonOrderGiftInfoReply]: GetDemonOrderGiftInfoReply,
		[SystemClientOpcode.GetWeekYuanbaoCardRewardReply]: GetWeekYuanbaoCardRewardReply,
		[SystemClientOpcode.GetWeekFuliCardRewardReply]: GetWeekFuliCardRewardReply,
		[SystemClientOpcode.GetWeekXianyuCardRewardReply]: GetWeekXianyuCardRewardReply,
		[SystemClientOpcode.GetHeroAuraRewardReply]: GetHeroAuraRewardReply,
		[SystemClientOpcode.GetDemonOrderGiftRewardReply]: GetDemonOrderGiftRewardReply,
		[SystemClientOpcode.GetDemonOrderGiftExtraRewardReply]: GetDemonOrderGiftExtraRewardReply,
		[SystemClientOpcode.GetZhizunCardInfoReply]: GetZhizunCardInfoReply,
		[SystemClientOpcode.UpdateZhizunCardInfo]: UpdateZhizunCardInfo,
		[SystemClientOpcode.BuyZhizunCardReply]: BuyZhizunCardReply,
		[SystemClientOpcode.GetMallInfoReply]: GetMallInfoReply,
		[SystemClientOpcode.UpdateMallInfo]: UpdateMallInfo,
		[SystemClientOpcode.BuyMallItemReply]: BuyMallItemReply,
		[SystemClientOpcode.GetVipInfoReply]: GetVipInfoReply,
		[SystemClientOpcode.UpdateVipInfo]: UpdateVipInfo,
		[SystemClientOpcode.GetVipRewardReply]: GetVipRewardReply,
		[SystemClientOpcode.GetPrivilegeReply]: GetPrivilegeReply,
		[SystemClientOpcode.UpdatePrivilege]: UpdatePrivilege,
		[SystemClientOpcode.GetVipDayRewardReply]: GetVipDayRewardReply,
		[SystemClientOpcode.GetVipFInfoReply]: GetVipFInfoReply,
		[SystemClientOpcode.UpdateVipFInfo]: UpdateVipFInfo,
		[SystemClientOpcode.GetVipFRewardReply]: GetVipFRewardReply,
		[SystemClientOpcode.UpdateChat]: UpdateChat,
		[SystemClientOpcode.ChatReply]: ChatReply,
		[SystemClientOpcode.GetChatRecordReply]: GetChatRecordReply,
		[SystemClientOpcode.GetBlackListReply]: GetBlackListReply,
		[SystemClientOpcode.BlackListOptReply]: BlackListOptReply,
		[SystemClientOpcode.UpdateBlackList]: UpdateBlackList,
		[SystemClientOpcode.GetChatPlayerDetailedInfoReply]: GetChatPlayerDetailedInfoReply,
		[SystemClientOpcode.GetChatInfoReply]: GetChatInfoReply,
		[SystemClientOpcode.UpdateChatInfo]: UpdateChatInfo,
		[SystemClientOpcode.GetRechargeInfoReply]: GetRechargeInfoReply,
		[SystemClientOpcode.UpdateRechargeInfo]: UpdateRechargeInfo,
		[SystemClientOpcode.GetFirstPayInfoReply]: GetFirstPayInfoReply,
		[SystemClientOpcode.UpdateFirstPayInfo]: UpdateFirstPayInfo,
		[SystemClientOpcode.UpdateFirstPayShow]: UpdateFirstPayShow,
		[SystemClientOpcode.GetFirstPayRewardReply]: GetFirstPayRewardReply,
		[SystemClientOpcode.ReqOrganizeTeamReply]: ReqOrganizeTeamReply,
		[SystemClientOpcode.CancelOrganizeTeamReply]: CancelOrganizeTeamReply,
		[SystemClientOpcode.UpdateTeamMember]: UpdateTeamMember,
		[SystemClientOpcode.UpdateTeamMatchState]: UpdateTeamMatchState,
		[SystemClientOpcode.CreateTeamReply]: CreateTeamReply,
		[SystemClientOpcode.DestoryTeamReply]: DestoryTeamReply,
		[SystemClientOpcode.InviteJoinTeamReply]: InviteJoinTeamReply,
		[SystemClientOpcode.JoinTeamReply]: JoinTeamReply,
		[SystemClientOpcode.LeaveTeamReply]: LeaveTeamReply,
		[SystemClientOpcode.KickedTeamReply]: KickedTeamReply,
		[SystemClientOpcode.UpdateAddTeamInvite]: UpdateAddTeamInvite,
		[SystemClientOpcode.UpdateDestoryTeam]: UpdateDestoryTeam,
		[SystemClientOpcode.UpdateTeamMemberOper]: UpdateTeamMemberOper,
		[SystemClientOpcode.GetRuneInfoReply]: GetRuneInfoReply,
		[SystemClientOpcode.InlayRuneReply]: InlayRuneReply,
		[SystemClientOpcode.RuneComposeReply]: ComposeRuneReply,
		[SystemClientOpcode.RuneComposePreviewReply]: ComposeRunePreviewReply,
		[SystemClientOpcode.RuneRefineReply]: RuneRefineReply,
		[SystemClientOpcode.UnsnatchRunePlaceReply]: UnsnatchRunePlaceReply,
		[SystemClientOpcode.UpdateRuneInfo]: UpdateRuneInfo,
		[SystemClientOpcode.ResolveRuneReply]: ResolveRuneReply,
		[SystemClientOpcode.RuneCollectDismantleReply]: RuneCollectDismantleReply,
		[SystemClientOpcode.RuneCollectUpLevelReply]: RuneCollectUpLevelReply,
		[SystemClientOpcode.RuneCollectSingleInfoReply]: RuneCollectSingleInfoReply,
		[SystemClientOpcode.RuneCollectInfoReply]: RuneCollectInfoReply,
		[SystemClientOpcode.RuneCollectUpJieReply]: RuneCollectUpJieReply,
		[SystemClientOpcode.OneKeySweepingReply]: OneKeySweepingReply,
		[SystemClientOpcode.BuysweepingtimesReply]: BuysweepingtimesReply,
		[SystemClientOpcode.GetSweepingStateReply]: GetSweepingStateReply,
		[SystemClientOpcode.GetSweepingBaseInfoReply]: GetSweepingBaseInfoReply,
		[SystemClientOpcode.UpdateSweepingBaseInfo]: UpdateSweepingBaseInfo,
		[SystemClientOpcode.GetSweepingIncomeReply]: GetSweepingIncomeReply,
		[SystemClientOpcode.updateXiangyaoDataReply]: updateXiangyaoDataReply,
		[SystemClientOpcode.getXiangyaoRewardReply]: getXiangyaoRewardReply,
		[SystemClientOpcode.GetDaypayInfoReply]: GetDaypayInfoReply,
		[SystemClientOpcode.UpdateDaypayInfo]: UpdateDaypayInfo,
		[SystemClientOpcode.GetDaypayRewardReply]: GetDaypayRewardReply,
		[SystemClientOpcode.GetCumulatepayInfoReply]: GetCumulatepayInfoReply,
		[SystemClientOpcode.UpdateCumulatepayInfo]: UpdateCumulatepayInfo,
		[SystemClientOpcode.GetCumulatepayRewardReply]: GetCumulatepayRewardReply,
		[SystemClientOpcode.GetCumulatepay2InfoReply]: GetCumulatepay2InfoReply,
		[SystemClientOpcode.UpdateCumulatepay2Info]: UpdateCumulatepay2Info,
		[SystemClientOpcode.GetCumulatepay2RewardReply]: GetCumulatepay2RewardReply,
		/**daw 新增消息号 */
		[SystemClientOpcode.GetCumulatepay3InfoReply]: GetCumulatepay3InfoReply,
		[SystemClientOpcode.UpdateCumulatepay3Info]: UpdateCumulatepay3Info,
		[SystemClientOpcode.GetCumulatepay3RewardReply]: GetCumulatepay3RewardReply,

		[SystemClientOpcode.GetKuanghai2InfoReply]: GetKuanghai2InfoReply,
		[SystemClientOpcode.UpdateKuanghai2Task]: UpdateKuanghai2Task,
		[SystemClientOpcode.GetKuanghai2TaskAwardReply]: GetKuanghai2TaskAwardReply,
		[SystemClientOpcode.GetKuanghai2AwardReply]: GetKuanghai2AwardReply,
		[SystemClientOpcode.JumpKuanghai2TaskReply]: JumpKuanghai2TaskReply,
		[SystemClientOpcode.GetKuanghai2FinalRewardReply]: GetKuanghai2FinalRewardReply,

		/*战队返回 Types*/
		[SystemClientOpcode.GetMyClanInfoReply]: GetMyClanInfoReply,
		[SystemClientOpcode.SetClanJoinLimitReply]: ClanCodeHandleReply,
		[SystemClientOpcode.SetClanAuditStatusReply]: ClanCodeHandleReply,
		[SystemClientOpcode.ClanBuildReply]: ClanCodeHandleReply,
		[SystemClientOpcode.ClanRefreshHaloReply]: ClanHaloRefresh,
		[SystemClientOpcode.ClanGetLevelRewardReply]: ClanCodeHandleReply,
		[SystemClientOpcode.ClanBuildListReply]: ClanBuildList,
		[SystemClientOpcode.ClanBuildAndHalRefreshReply]: ClanBuildAndHalRefresh,
		[SystemClientOpcode.ClanGradeLevelListReply]: ClanGradeLevelList,
		[SystemClientOpcode.ApplyJoinClanReply]: ClanCodeHandleReply,
		[SystemClientOpcode.ClanRenameReply]: ClanCodeHandleReply,
		[SystemClientOpcode.CreateClanReply]: ClanCodeHandleReply,
		[SystemClientOpcode.ClanHaloRefreshComfirmReply]: ClanCodeHandleReply,
		[SystemClientOpcode.ClanUpdateFightTeamCoinReply]: ClanUpdateFightTeamCoin,
		[SystemClientOpcode.DissolveClanReply]: ClanCodeHandleReply,
		[SystemClientOpcode.ClanKickMemberReply]: ClanCodeHandleReply,
		[SystemClientOpcode.ExitClanReply]: ClanCodeHandleReply,
		[SystemClientOpcode.UpdateClanAppliedListReply]: UpdateClanAppliedListReply,
		[SystemClientOpcode.UpdateClanAppliedListReply2]: UpdateClanAppliedListReply,
		[SystemClientOpcode.ClanAuditJoinReply]: ClanCodeHandleReply,
		[SystemClientOpcode.GetClanApplyListReply]: ClanApplyListReply,
		[SystemClientOpcode.ClanApplyListChangeReply]: ClanApplyListChangeReply,
		[SystemClientOpcode.GetAllClanListReply]: AllClanListReply,


		[SystemClientOpcode.GetContinuepayInfoReply]: GetContinuepayInfoReply,
		[SystemClientOpcode.UpdateContinuepayInfo]: UpdateContinuepayInfo,
		[SystemClientOpcode.GetContinuepayRewardReply]: GetContinuepayRewardReply,
		[SystemClientOpcode.GetZeroBuyInfoReply]: GetZeroBuyInfoReply,
		[SystemClientOpcode.UpdateZeroBuyInfo]: UpdateZeroBuyInfo,
		[SystemClientOpcode.GetZeroBuyRewardReply]: GetZeroBuyRewardReply,
		[SystemClientOpcode.GetZeroBuyBuyReply]: GetZeroBuyBuyReply,
		[SystemClientOpcode.GetOneBuyInfoReply]: GetOneBuyInfoReply,
		[SystemClientOpcode.UpdateOneBuyInfo]: UpdateOneBuyInfo,
		[SystemClientOpcode.GetOneBuyRewardReply]: GetOneBuyRewardReply,
		[SystemClientOpcode.GetConsumeRewardInfoReply]: GetConsumeRewardInfoReply,
		[SystemClientOpcode.UpdateConsumeRewardInfo]: UpdateConsumeRewardInfo,
		[SystemClientOpcode.GetConsumeRewardRewardReply]: GetConsumeRewardRewardReply,
		[SystemClientOpcode.GetConsumeReward2InfoReply]: GetConsumeReward2InfoReply,
		[SystemClientOpcode.UpdateConsumeReward2Info]: UpdateConsumeReward2Info,
		[SystemClientOpcode.GetConsumeReward2RewardReply]: GetConsumeReward2RewardReply,
		[SystemClientOpcode.GetInvestRewardInfoReply]: GetInvestRewardInfoReply,
		[SystemClientOpcode.UpdateInvestRewardInfo]: UpdateInvestRewardInfo,
		[SystemClientOpcode.BuyInvestRewardReply]: BuyInvestRewardReply,
		[SystemClientOpcode.GetInvestRewardRewardReply]: GetInvestRewardRewardReply,
		[SystemClientOpcode.GetSprintRankTaskInfoReply]: GetSprintRankTaskInfoReply,
		[SystemClientOpcode.UpdateSprintRankTaskInfo]: UpdateSprintRankTaskInfo,
		[SystemClientOpcode.GetSprintRankTaskRewardReply]: GetSprintRankTaskRewardReply,
		[SystemClientOpcode.GetSprintRankAllInfoReply]: GetSprintRankAllInfoReply,
		[SystemClientOpcode.GetSprintRankBaseInfoReply]: GetSprintRankBaseInfoReply,
		[SystemClientOpcode.UpdateSprintRankBaseInfo]: UpdateSprintRankBaseInfo,
		[SystemClientOpcode.GetSprintRankBeforeReply]: GetSprintRankBeforeReply,
		[SystemClientOpcode.UpdateSprintRankState]: UpdateSprintRankState,
		[SystemClientOpcode.GetFeishengRankTaskInfoReply]: GetFeishengRankTaskInfoReply,
		[SystemClientOpcode.UpdateFeishengRankTaskInfo]: UpdateFeishengRankTaskInfo,
		[SystemClientOpcode.GetFeishengRankTaskRewardReply]: GetFeishengRankTaskRewardReply,
		[SystemClientOpcode.GetPayRewardInfoReply]: GetPayRewardInfoReply,
		[SystemClientOpcode.UpdatePayRewardInfo]: UpdatePayRewardInfo,
		[SystemClientOpcode.PayRewardRunReply]: PayRewardRunReply,
		[SystemClientOpcode.GetPayRewardNotesReply]: GetPayRewardNotesReply,
		[SystemClientOpcode.GetPayRewardRewardReply]: GetPayRewardRewardReply,
		[SystemClientOpcode.GetPayRewardServerBroadcastReply]: GetPayRewardServerBroadcastReply,
		[SystemClientOpcode.GetDuobaoInfoReply]: GetDuobaoInfoReply,
		[SystemClientOpcode.UpdateDuobaoInfo]: UpdateDuobaoInfo,
		[SystemClientOpcode.DuobaoRunReply]: DuobaoRunReply,
		[SystemClientOpcode.GetDuobaoNotesReply]: GetDuobaoNotesReply,
		[SystemClientOpcode.GetDuobaoRewardReply]: GetDuobaoRewardReply,
		[SystemClientOpcode.GetDuobaoServerBroadcastReply]: GetDuobaoServerBroadcastReply,
		[SystemClientOpcode.GetDuobaoRankInfoReply]: GetDuobaoRankInfoReply,
		[SystemClientOpcode.GetJzduobaoInfoReply]: GetJzduobaoInfoReply,
		[SystemClientOpcode.UpdateJzduobaoInfo]: UpdateJzduobaoInfo,
		[SystemClientOpcode.JzduobaoRunReply]: JzduobaoRunReply,
		[SystemClientOpcode.GetJzduobaoNotesReply]: GetJzduobaoNotesReply,
		[SystemClientOpcode.GetJzduobaoRewardReply]: GetJzduobaoRewardReply,
		[SystemClientOpcode.GetJzduobaoServerBroadcastReply]: GetJzduobaoServerBroadcastReply,
		[SystemClientOpcode.GetJzduobaoRankInfoReply]: GetJzduobaoRankInfoReply,
		[SystemClientOpcode.UpdateJzduobaoJackpot]: UpdateJzduobaoJackpot,
		[SystemClientOpcode.GetGushenInfoReply]: GetGushenInfoReply,
		[SystemClientOpcode.UpdateGushenInfo]: UpdateGushenInfo,
		[SystemClientOpcode.GetGushenTaskRewardReply]: GetGushenTaskRewardReply,
		[SystemClientOpcode.GetGushenActiveRewardReply]: GetGushenActiveRewardReply,
		[SystemClientOpcode.GetKuanghuanInfoReply]: GetKuanghuanInfoReply,
		[SystemClientOpcode.UpdateKuanghuanInfo]: UpdateKuanghuanInfo,
		[SystemClientOpcode.GetKuanghuanRewardReply]: GetKuanghuanRewardReply,
		[SystemClientOpcode.GetDiscountGiftInfoReply]: GetDiscountGiftInfoReply,
		[SystemClientOpcode.UpdateDiscountGiftInfo]: UpdateDiscountGiftInfo,
		[SystemClientOpcode.DiscountGiftBuyReply]: DiscountGiftBuyReply,
		[SystemClientOpcode.GetHalfMonthInfoReply]: GetHalfMonthInfoReply,
		[SystemClientOpcode.UpdateHalfMonthInfo]: UpdateHalfMonthInfo,
		[SystemClientOpcode.GetHalfMonthRewardReply]: GetHalfMonthRewardReply,
		[SystemClientOpcode.GetEverydayRebateInfoReply]: GetEverydayRebateInfoReply,
		[SystemClientOpcode.UpdateEverydayRebateInfo]: UpdateEverydayRebateInfo,
		[SystemClientOpcode.GetEverydayRebateRewardReply]: GetEverydayRebateRewardReply,
		[SystemClientOpcode.GetLoginRewardInfoReply]: GetLoginRewardInfoReply,
		[SystemClientOpcode.UpdateLoginRewardInfo]: UpdateLoginRewardInfo,
		[SystemClientOpcode.GetLoginRewardRewardReply]: GetLoginRewardRewardReply,
		[SystemClientOpcode.GetCumulatepayFSInfoReply]: GetCumulatepayFSInfoReply,
		[SystemClientOpcode.UpdateCumulatepayFSInfo]: UpdateCumulatepayFSInfo,
		[SystemClientOpcode.GetCumulatepayFSRewardReply]: GetCumulatepayFSRewardReply,
		[SystemClientOpcode.GetPaySingleFSInfoReply]: GetPaySingleFSInfoReply,
		[SystemClientOpcode.UpdatePaySingleFSInfo]: UpdatePaySingleFSInfo,
		[SystemClientOpcode.GetPaySingleFSRewardReply]: GetPaySingleFSRewardReply,
		[SystemClientOpcode.GetConsumeRewardFSInfoReply]: GetConsumeRewardFSInfoReply,
		[SystemClientOpcode.UpdateConsumeRewardFSInfo]: UpdateConsumeRewardFSInfo,
		[SystemClientOpcode.GetConsumeRewardFSRewardReply]: GetConsumeRewardFSRewardReply,
		[SystemClientOpcode.GetRushBuyFSInfoReply]: GetRushBuyFSInfoReply,
		[SystemClientOpcode.UpdateRushBuyFSInfo]: UpdateRushBuyFSInfo,
		[SystemClientOpcode.BuyRushBuyFSReply]: BuyRushBuyFSReply,
		[SystemClientOpcode.GetDiscountGiftFSInfoReply]: GetDiscountGiftFSInfoReply,
		[SystemClientOpcode.UpdateDiscountGiftFSInfo]: UpdateDiscountGiftFSInfo,
		[SystemClientOpcode.BuyDiscountGiftFSReply]: BuyDiscountGiftFSReply,
		[SystemClientOpcode.GetXianFuInfoReply]: GetXianFuInfoReply,
		[SystemClientOpcode.UpdateXianFuInfo]: UpdateXianFuInfo,
		[SystemClientOpcode.GetBuildingInfoReply]: GetBuildingInfoReply,
		[SystemClientOpcode.UpdateBuildingInfo]: UpdateBuildingInfo,
		[SystemClientOpcode.UpgradeXianFuReply]: UpgradeXianFuReply,
		[SystemClientOpcode.GetBuildProduceAwardReply]: GetBuildProduceAwardReply,
		[SystemClientOpcode.UpdateProduceCoin]: UpdateProduceCoin,
		[SystemClientOpcode.MakeItemReply]: MakeItemReply,
		[SystemClientOpcode.GetSpiritAnimalTravelReply]: GetSpiritAnimalTravelReply,
		[SystemClientOpcode.UpdateSpiritAnimalTravel]: UpdateSpiritAnimalTravel,
		[SystemClientOpcode.TravelReply]: TravelReply,
		[SystemClientOpcode.GetTravelAwardReply]: GetTravelAwardReply,
		[SystemClientOpcode.BuyFoodReply]: BuyFoodReply,
		[SystemClientOpcode.TravelFinishReply]: TravelFinishReply,
		[SystemClientOpcode.GetIllustratedHandbookReply]: GetIllustratedHandbookReply,
		[SystemClientOpcode.UpdateIllustratedHandbook]: UpdateIllustratedHandbook,
		[SystemClientOpcode.PromoteIllustratedHandbookReply]: PromoteIllustratedHandbookReply,
		[SystemClientOpcode.XianFuEvent]: XianFuEvent,
		[SystemClientOpcode.GetXianFuMallReply]: GetXianFuMallReply,
		[SystemClientOpcode.BuyTravelItemReply]: BuyTravelItemReply,
		[SystemClientOpcode.GetXianFuTaskListReply]: GetXianFuTaskListReply,
		[SystemClientOpcode.UpdateXianFuTaskState]: UpdateXianFuTaskState,
		[SystemClientOpcode.GetXianFuTaskAwardReply]: GetXianFuTaskAwardReply,
		[SystemClientOpcode.GetXianFuActivaAwardReply]: GetXianFuActivaAwardReply,
		[SystemClientOpcode.GetXianFuFengShuiInfoReply]: GetXianFuFengShuiInfoReply,
		[SystemClientOpcode.UpdateXianFuFengShuiInfo]: UpdateXianFuFengShuiInfo,
		[SystemClientOpcode.UpgradeFengShuiDecorateReply]: UpgradeFengShuiDecorateReply,
		[SystemClientOpcode.GetXianFuSkillListReply]: GetXianFuSkillListReply,
		[SystemClientOpcode.PromoteXianFuSkillReply]: PromoteXianFuSkillReply,
		[SystemClientOpcode.MakeItemFinishReply]: MakeItemFinishReply,
		[SystemClientOpcode.GetXianFuMall2InfoReply]: GetXianFuMall2InfoReply,
		[SystemClientOpcode.BuyXianFuMall2GoodsReply]: BuyXianFuMall2GoodsReply,
		[SystemClientOpcode.F5XianFuMall2Reply]: F5XianFuMall2Reply,
		[SystemClientOpcode.GetTiantiReply]: GetTiantiReply,
		[SystemClientOpcode.UpdateTiantiScore]: UpdateTiantiScore,
		[SystemClientOpcode.UpdateTiantiJoinAwardStats]: UpdateTiantiJoinAwardStats,
		[SystemClientOpcode.UpdateTiantiFeatAwardStates]: UpdateTiantiFeatAwardStates,
		[SystemClientOpcode.UpdateTiantiTimes]: UpdateTiantiTimes,
		[SystemClientOpcode.GetTiantiRankReply]: GetTiantiRankReply,
		[SystemClientOpcode.GetTiantiJoinAwardReply]: GetTiantiJoinAwardReply,
		[SystemClientOpcode.GetTiantiFeatAwardReply]: GetTiantiFeatAwardReply,
		[SystemClientOpcode.UpdateTiantiHonor]: UpdateTiantiHonor,
		[SystemClientOpcode.UpdateTiantiScoreAward]: UpdateTiantiScoreAward,
		[SystemClientOpcode.GetRichesInfoReply]: GetRichesInfoReply,
		[SystemClientOpcode.UpdateRichesInfo]: UpdateRichesInfo,
		[SystemClientOpcode.UpdateRichesCopy]: UpdateRichesCopy,
		[SystemClientOpcode.GetCloudlandReply]: GetCloudlandReply,
		[SystemClientOpcode.UpdateCloudland]: UpdateCloudland,
		[SystemClientOpcode.UpdateDropRecord]: UpdateDropRecord,
		[SystemClientOpcode.GetAdventureInfoReply]: GetAdventureInfoReply,
		[SystemClientOpcode.UpdateAdventureInfo]: UpdateAdventureInfo,
		[SystemClientOpcode.BuyYumliReply]: BuyYumliReply,
		[SystemClientOpcode.ChallengeReply]: ChallengeReply,
		[SystemClientOpcode.GetAdventureAwardReply]: GetAdventureAwardReply,
		[SystemClientOpcode.UpdateAdventureEvent]: UpdateAdventureEvent,
		[SystemClientOpcode.GetAdventureHintReply]: GetAdventureHintReply,
		[SystemClientOpcode.AdventureExchangeReply]: AdventureExchangeReply,
		[SystemClientOpcode.GetSwimmingInfoReply]: GetSwimmingInfoReply,
		[SystemClientOpcode.GetSoapInfoReply]: GetSoapInfoReply,
		[SystemClientOpcode.UpdateSwimmingInfo]: UpdateSwimmingInfo,
		[SystemClientOpcode.GrabSoapReply]: GrabSoapReply,
		[SystemClientOpcode.GetFairyInfoReply]: GetFairyInfoReply,
		[SystemClientOpcode.GetFairyLogReply]: GetFairyLogReply,
		[SystemClientOpcode.UpdateFairyLog]: UpdateFairyLog,
		[SystemClientOpcode.EscortFairyReply]: EscortFairyReply,
		[SystemClientOpcode.InterceptFairyReply]: InterceptFairyReply,
		[SystemClientOpcode.RefreshFairyReply]: RefreshFairyReply,
		[SystemClientOpcode.SelectFairyReply]: SelectFairyReply,
		[SystemClientOpcode.UpdateFairyInfo]: UpdateFairyInfo,
		[SystemClientOpcode.GetFairyEscortListReply]: GetFairyEscortListReply,
		[SystemClientOpcode.GetFairyAwardReply]: GetFairyAwardReply,
		[SystemClientOpcode.UpdateOtherFairyInfo]: UpdateOtherFairyInfo,
		[SystemClientOpcode.GetTipsPriorInfoReply]: GetTipsPriorInfoReply,
		[SystemClientOpcode.GetDesignationReply]: GetDesignationReply,
		[SystemClientOpcode.UpdateDesignation]: UpdateDesignation,
		[SystemClientOpcode.ActiveDesignationReply]: ActiveDesignationReply,
		[SystemClientOpcode.WearDesignationReply]: WearDesignationReply,
		[SystemClientOpcode.TakeoffDesignationReply]: TakeoffDesignationReply,
		[SystemClientOpcode.GetCrossRankReply]: GetCrossRankReply,
		[SystemClientOpcode.GetActorCrossRankShowReply]: GetActorCrossRankShowReply,
		[SystemClientOpcode.GetActorCrossRankDataReply]: GetActorCrossRankDataReply,
		[SystemClientOpcode.GetArenaRankReply]: GetArenaRankReply,
		[SystemClientOpcode.GetArenaChallengeRecordReply]: GetArenaChallengeRecordReply,
		[SystemClientOpcode.UpdateArenaChallengeRecord]: UpdateArenaChallengeRecord,
		[SystemClientOpcode.GetArenaReply]: GetArenaReply,
		[SystemClientOpcode.UpdateArenaTime]: UpdateArenaTime,
		[SystemClientOpcode.UpdateArenaObjs]: UpdateArenaObjs,
		[SystemClientOpcode.FlushArenaReply]: FlushArenaReply,
		[SystemClientOpcode.ResetEnterCDReply]: ResetEnterCDReply,
		[SystemClientOpcode.GetFeishengRankAllInfoReply]: GetFeishengRankAllInfoReply,
		[SystemClientOpcode.GetFeishengRankBaseInfoReply]: GetFeishengRankBaseInfoReply,
		[SystemClientOpcode.UpdateFeishengRankBaseInfo]: UpdateFeishengRankBaseInfo,
		[SystemClientOpcode.GetFeishengRankBeforeReply]: GetFeishengRankBeforeReply,
		[SystemClientOpcode.UpdateFeishengRankState]: UpdateFeishengRankState,
		[SystemClientOpcode.GetFactionListReply]: GetFactionListReply,
		[SystemClientOpcode.CreateFactionReply]: CreateFactionReply,
		[SystemClientOpcode.GetFactionInfoReply]: GetFactionInfoReply,
		[SystemClientOpcode.JoinFactionReply]: JoinFactionReply,
		[SystemClientOpcode.GetFactionJoinListReply]: GetFactionJoinListReply,
		[SystemClientOpcode.UpdateFactionJoinList]: UpdateFactionJoinList,
		[SystemClientOpcode.ExamineReply]: ExamineReply,
		[SystemClientOpcode.DissolutionReply]: DissolutionReply,
		[SystemClientOpcode.BroadcastRecruitReply]: BroadcastRecruitReply,
		[SystemClientOpcode.ExitFactionReply]: ExitFactionReply,
		[SystemClientOpcode.KickReply]: KickReply,
		[SystemClientOpcode.SetPositionReply]: SetPositionReply,
		[SystemClientOpcode.GetFactionApplyListReply]: GetFactionApplyListReply,
		[SystemClientOpcode.SetFightReply]: SetFightReply,
		[SystemClientOpcode.SetTitleReply]: SetTitleReply,
		[SystemClientOpcode.SetNoticeReply]: SetNoticeReply,
		[SystemClientOpcode.SetExamineReply]: SetExamineReply,
		[SystemClientOpcode.ApplyForPosReply]: ApplyForPosReply,
		[SystemClientOpcode.GetApplyForPosListReply]: GetApplyForPosListReply,
		[SystemClientOpcode.ApplyForPosResultReply]: ApplyForPosResultReply,
		[SystemClientOpcode.AutoInvitation]: AutoInvitation,
		[SystemClientOpcode.GetFactionRankListReply]: GetFactionRankListReply,
		[SystemClientOpcode.KickNotify]: KickNotify,
		[SystemClientOpcode.GetBoxInfoReply]: GetBoxInfoReply,
		[SystemClientOpcode.GetBoxListReply]: GetBoxListReply,
		[SystemClientOpcode.GetAssistBoxListReply]: GetAssistBoxListReply,
		[SystemClientOpcode.GetBoxAwardReply]: GetBoxAwardReply,
		[SystemClientOpcode.OpenBoxReply]: OpenBoxReply,
		[SystemClientOpcode.AskAssistReply]: AskAssistReply,
		[SystemClientOpcode.F5BoxReply]: F5BoxReply,
		[SystemClientOpcode.AddSpeedBoxReply]: AddSpeedBoxReply,
		[SystemClientOpcode.AssistOpenBoxReply]: AssistOpenBoxReply,
		[SystemClientOpcode.GetFactionCopyInfoReply]: GetFactionCopyInfoReply,
		[SystemClientOpcode.GetHurtAwardListReply]: GetHurtAwardListReply,
		[SystemClientOpcode.GetHurtAwardReply]: GetHurtAwardReply,
		[SystemClientOpcode.FactionReqInspireReply]: FactionReqInspireReply,
		[SystemClientOpcode.FactionAllInspireReply]: FactionAllInspireReply,
		[SystemClientOpcode.GetFactionCopyDataReply]: GetFactionCopyDataReply,
		[SystemClientOpcode.GetFactionSkillListReply]: GetFactionSkillListReply,
		[SystemClientOpcode.GetFactionTurnReply]: GetFactionTurnReply,
		[SystemClientOpcode.PromoteFactionSkillReply]: PromoteFactionSkillReply,
		[SystemClientOpcode.FactionTurnReply]: FactionTurnReply,
		[SystemClientOpcode.GetFactionTurnRecordReply]: GetFactionTurnRecordReply,
		[SystemClientOpcode.GetBlessAwardReply]: GetBlessAwardReply,
		[SystemClientOpcode.AddCopyTimeReply]: AddCopyTimeReply,
		[SystemClientOpcode.UpdateFactionApplyList]: UpdateFactionApplyList,
		[SystemClientOpcode.GetFashionInfoReply]: GetFashionInfoReply,
		[SystemClientOpcode.UpdateFashionInfo]: UpdateFashionInfo,
		[SystemClientOpcode.FeedFashionReply]: FeedFashionReply,
		[SystemClientOpcode.AddFashionSkillLevelReply]: AddFashionSkillLevelReply,
		[SystemClientOpcode.AddFashionMagicShowReply]: AddFashionMagicShowReply,
		[SystemClientOpcode.ChangeFashionMagicShowReply]: ChangeFashionMagicShowReply,
		[SystemClientOpcode.AddFashionRefineReply]: AddFashionRefineReply,
		[SystemClientOpcode.GetTianZhuInfoReply]: GetTianZhuInfoReply,
		[SystemClientOpcode.UpdateTianZhuInfo]: UpdateTianZhuInfo,
		[SystemClientOpcode.FeedTianZhuReply]: FeedTianZhuReply,
		[SystemClientOpcode.AddTianZhuSkillLevelReply]: AddTianZhuSkillLevelReply,
		[SystemClientOpcode.AddTianZhuMagicShowReply]: AddTianZhuMagicShowReply,
		[SystemClientOpcode.ChangeTianZhuMagicShowReply]: ChangeTianZhuMagicShowReply,
		[SystemClientOpcode.AddTianZhuRefineReply]: AddTianZhuRefineReply,
		[SystemClientOpcode.GetGuangHuanInfoReply]: GetGuangHuanInfoReply,
		[SystemClientOpcode.UpdateGuangHuanInfo]: UpdateGuangHuanInfo,
		[SystemClientOpcode.FeedGuangHuanReply]: FeedGuangHuanReply,
		[SystemClientOpcode.ChangeGuangHuanMagicShowReply]: ChangeGuangHuanMagicShowReply,
		[SystemClientOpcode.AddGuangHuanMagicShowReply]: AddGuangHuanMagicShowReply,
		[SystemClientOpcode.AddGuangHuanRefineReply]: AddGuangHuanRefineReply,
		[SystemClientOpcode.AddGuangHuanSkillLevelReply]: AddGuangHuanSkillLevelReply,
		[SystemClientOpcode.GetXilianReply]: GetXilianReply,
		[SystemClientOpcode.UpdateXilian]: UpdateXilian,
		[SystemClientOpcode.OpenXilianReply]: OpenXilianReply,
		[SystemClientOpcode.EquipXilianReply]: EquipXilianReply,
		[SystemClientOpcode.LockXilianReply]: LockXilianReply,
		[SystemClientOpcode.XilianRiseAddLevelReply]: XilianRiseAddLevelReply,
		[SystemClientOpcode.GetShenQiInfoReply]: GetShenQiInfoReply,
		[SystemClientOpcode.EquipFragmentReply]: EquipFragmentReply,
		[SystemClientOpcode.ActivateShenQiReply]: ActivateShenQiReply,
		[SystemClientOpcode.UpdateFragmentList]: UpdateFragmentList,
		[SystemClientOpcode.GetOpenRewardReply]: GetOpenRewardReply,
		[SystemClientOpcode.UpdateOpenReward]: UpdateOpenReward,
		[SystemClientOpcode.BuyOpenRewardReply]: BuyOpenRewardReply,
		[SystemClientOpcode.GetSinglePayJadeReply]: GetSinglePayJadeReply,
		[SystemClientOpcode.GetSinglePayJadeAwardReply]: GetSinglePayJadeAwardReply,
		[SystemClientOpcode.GetSinglePayPrintReply]: GetSinglePayPrintReply,
		[SystemClientOpcode.GetSinglePayPrintAwardReply]: GetSinglePayPrintAwardReply,
		[SystemClientOpcode.GetWeekSinglePayReply]: GetWeekSinglePayReply,
		[SystemClientOpcode.GetWeekSinglePayAwardReply]: GetWeekSinglePayAwardReply,
		[SystemClientOpcode.GetWeekLoginReply]: GetWeekLoginReply,
		[SystemClientOpcode.GetWeekLoginAwardReply]: GetWeekLoginAwardReply,
		[SystemClientOpcode.GetWeekAccumulateReply]: GetWeekAccumulateReply,
		[SystemClientOpcode.GetWeekAccumulateAwardReply]: GetWeekAccumulateAwardReply,
		[SystemClientOpcode.GetWeekConsumeReply]: GetWeekConsumeReply,
		[SystemClientOpcode.GetWeekConsumeAwardReply]: GetWeekConsumeAwardReply,
		[SystemClientOpcode.GetConsumeRankReply]: GetConsumeRankReply,
		[SystemClientOpcode.GetConsumeCountReply]: GetConsumeCountReply,
		[SystemClientOpcode.GetLimitPackInfoReply]: GetLimitPackInfoReply,
		[SystemClientOpcode.BuyLimitPackReply]: BuyLimitPackReply,
		[SystemClientOpcode.GetFeedbackListReply]: GetFeedbackListReply,
		[SystemClientOpcode.UpdateFeedback]: UpdateFeedback,
		[SystemClientOpcode.SendFeedbackReply]: SendFeedbackReply,
		[SystemClientOpcode.ExchangeCdkeyReply]: ExchangeCdkeyReply,
		[SystemClientOpcode.GetNoticeReply]: GetNoticeReply,
		[SystemClientOpcode.GetInviteGiftReply]: GetInviteGiftReply,
		[SystemClientOpcode.InviteFriendReply]: InviteFriendReply,
		[SystemClientOpcode.DrawInviteGiftReply]: DrawInviteGiftReply,
		[SystemClientOpcode.GetOnceRewardReply]: GetOnceRewardReply,
		[SystemClientOpcode.SetOnceRewardDataReply]: SetOnceRewardDataReply,
		[SystemClientOpcode.DrawOnceRewardReply]: DrawOnceRewardReply,
		[SystemClientOpcode.UpdateTalismanState]: UpdateTalismanState,
		[SystemClientOpcode.GetTalismanInfoReply]: GetTalismanInfoReply,
		[SystemClientOpcode.ActiveTalismanReply]: ActiveTalismanReply,
		[SystemClientOpcode.UpdateMoneyCatState]: UpdateMoneyCatState,
		[SystemClientOpcode.GetMoneyCatInfoReply]: GetMoneyCatInfoReply,
		[SystemClientOpcode.ActiveMoneyCatReply]: ActiveMoneyCatReply,
		[SystemClientOpcode.GetXianYuInfoReply]: GetXianYuInfoReply,
		[SystemClientOpcode.GetYuGeInfoReply]: GetYuGeInfoReply,
		[SystemClientOpcode.BuyYuGeGoodsReply]: BuyYuGeGoodsReply,
		[SystemClientOpcode.F5YuGeReply]: F5YuGeReply,
		[SystemClientOpcode.GetXianYuFuYuInfoReply]: GetXianYuFuYuInfoReply,
		[SystemClientOpcode.GetFuYuanAwardReply]: GetFuYuanAwardReply,
		[SystemClientOpcode.GetGauntletReply]: GetGauntletReply,
		[SystemClientOpcode.DrawGauntletReply]: DrawGauntletReply,
		[SystemClientOpcode.InlayGauntletReply]: InlayGauntletReply,
		[SystemClientOpcode.GetXianDanListReply]: GetXianDanListReply,
		[SystemClientOpcode.GetXianDanInfoReply]: GetXianDanInfoReply,
		[SystemClientOpcode.OneKeyUseXianDanReply]: OneKeyUseXianDanReply,
		[SystemClientOpcode.UpdateRetrieve]: UpdateRetrieve,
		[SystemClientOpcode.GetPreventFoolReply]: GetPreventFoolReply,
		[SystemClientOpcode.AnswerPreventFoolReply]: AnswerPreventFoolReply,
		[SystemClientOpcode.GetStrengthRelpy]: GetStrengthRelpy,
		[SystemClientOpcode.UpdateStrongInfoReply]: UpdateStrongInfoReply,
		[SystemClientOpcode.PickTempRewardReply]: PickTempRewardReply,
		[SystemClientOpcode.UseStrengthItemReply]: UseStrengthItemReply,
		[SystemClientOpcode.GetCeremonyContinuepayInfoReply]: GetCeremonyContinuepayInfoReply,
		[SystemClientOpcode.GetCeremonyContinuepayRewardReply]: GetCeremonyContinuepayRewardReply,
		[SystemClientOpcode.GetDropCarnivalInfoReply]: GetDropCarnivalInfoReply,

		//姻缘
		[SystemClientOpcode.ReleaseMarryWallReply]: ReleaseMarryWallReply,
		[SystemClientOpcode.GetMarryWallListReply]: GetMarryWallListReply,
		[SystemClientOpcode.GetMarryInfoReply]: GetMarryInfoReply,
		[SystemClientOpcode.MarryDissolutionReply]: MarryDissolutionReply,
		[SystemClientOpcode.CreateMarryReply]: CreateMarryReply,
		[SystemClientOpcode.GetLevelAwardListReply]: GetLevelAwardListReply,
		[SystemClientOpcode.GetLevelAwardReply]: GetLevelAwardReply,
		[SystemClientOpcode.GetMarryRingInfoReply]: GetMarryRingInfoReply,
		[SystemClientOpcode.GetMarryDollInfoReply]: GetMarryDollInfoReply,
		[SystemClientOpcode.AddMarryRingFeedSkillLevelReply]: AddMarryRingFeedSkillLevelReply,
		[SystemClientOpcode.FeedMarryRingReply]: FeedMarryRingReply,
		[SystemClientOpcode.GetMarryTaskInfoReply]: GetMarryTaskInfoReply,
		[SystemClientOpcode.FeedMarryReply]: FeedMarryReply,
		[SystemClientOpcode.GetMarryKeepsakeInfoReply]: GetMarryKeepsakeInfoReply,
		[SystemClientOpcode.GradeMarryKeepsakeReply]: GradeMarryKeepsakeReply,
		[SystemClientOpcode.AddMarryKeepsakeReply]: AddMarryKeepsakeReply,
		[SystemClientOpcode.FeedMarryDollReply]: FeedMarryDollReply,
		[SystemClientOpcode.GradeMarryDollReply]: GradeMarryDollReply,
		[SystemClientOpcode.AddMarryKeepsakeGradeSkillLevelReply]: AddMarryKeepsakeGradeSkillLevelReply,
		[SystemClientOpcode.AddMarryDollFeedSkillLevelReply]: AddMarryDollFeedSkillLevelReply,
		[SystemClientOpcode.AddMarryDollGradeSkillLevelReply]: AddMarryDollGradeSkillLevelReply,
		[SystemClientOpcode.RiseMarryDollRefineReply]: RiseMarryDollRefineReply,
		[SystemClientOpcode.ChangeMarryDollShowReply]: ChangeMarryDollShowReply,
		[SystemClientOpcode.BroadcastMarryCopyMonsterWare]: BroadcastMarryCopyMonsterWare,
		[SystemClientOpcode.GetMarryCopyTimesReply]: GetMarryCopyTimesReply,
		[SystemClientOpcode.UpdateMarryCopyTimes]: UpdateMarryCopyTimes,
		[SystemClientOpcode.BuyMarryPackageReply]: BuyMarryPackageReply,
		[SystemClientOpcode.GetMarryTaskAwardReply]: GetMarryTaskAwardReply,
		[SystemClientOpcode.UpdateMarryTask]: UpdateMarryTask,
		[SystemClientOpcode.UpdateMarryRingInfo]: UpdateMarryRingInfo,
		[SystemClientOpcode.UpdateMarryKeepsakeInfo]: UpdateMarryKeepsakeInfo,
		[SystemClientOpcode.UpdateMarryDollInfo]: UpdateMarryDollInfo,


		/**限时探索*/
		[SystemClientOpcode.AddLimitXunbaoSelfBroadcast]: AddLimitXunbaoSelfBroadcast,
		[SystemClientOpcode.UpdateLimitXunbaoInfo]: UpdateLimitXunbaoInfo,
		[SystemClientOpcode.GetLimitXunbaoServerBroadcastReply]: GetLimitXunbaoServerBroadcastReply,
		[SystemClientOpcode.GetLimitXunbaoInfoReply]: GetLimitXunbaoInfoReply,
		[SystemClientOpcode.GetLimitXunBaoHintReply]: GetLimitXunBaoHintReply,
		[SystemClientOpcode.RunLimitXunbaoReply]: RunLimitXunbaoReply,
		[SystemClientOpcode.LimitXunBaoExchangeListReply]: LimitXunBaoExchangeListReply,
		[SystemClientOpcode.LimitXunBaoExchangeReply]: LimitXunBaoExchangeReply,
		[SystemClientOpcode.GetLimitXunBaoCumulativeTaskInfoReply]: GetLimitXunBaoCumulativeTaskInfoReply,
		[SystemClientOpcode.GetLimitXunBaoCumulativeTaskRewardReply]: GetLimitXunBaoCumulativeTaskRewardReply,
		[SystemClientOpcode.GetLimitXunBaoContinuePayInfoReply]: GetLimitXunBaoContinuePayInfoReply,
		[SystemClientOpcode.GetLimitXunBaoContinuePayRewardReply]: GetLimitXunBaoContinuePayRewardReply,
		[SystemClientOpcode.GetLimitXunBaoCashGiftInfoReply]: GetLimitXunBaoCashGiftInfoReply,
		[SystemClientOpcode.GetLimitXunBaoCashGiftRewardReply]: GetLimitXunBaoCashGiftRewardReply,
		[SystemClientOpcode.GetLimitXunBaoMallInfoReply]: GetLimitXunBaoMallInfoReply,
		[SystemClientOpcode.BuyLimitXunBaoMallItemReply]: BuyLimitXunBaoMallItemReply,
		[SystemClientOpcode.LimitXunbaoRankInfoReply]: LimitXunbaoRankInfoReply,
		[SystemClientOpcode.GetLimitXunBaoDayCumulatePayInfoReply]: GetLimitXunBaoDayCumulatePayInfoReply,
		[SystemClientOpcode.GetLimitXunBaoDayCumulatePayRewardReply]: GetLimitXunBaoDayCumulatePayRewardReply,
		[SystemClientOpcode.GetLimitXunBaoCumulatePayInfoReply]: GetLimitXunBaoCumulatePayInfoReply,
		[SystemClientOpcode.GetLimitXunBaoCumulatePayRewardReply]: GetLimitXunBaoCumulatePayRewardReply,
		[SystemClientOpcode.SevenActivityAwdWeeklyTasksReply]: SevenActivityGetAwardReply,
		[SystemClientOpcode.SevenActivityBaseDatasReply]: SevenActivityBaseDatasReply,
		[SystemClientOpcode.GetLimitXunBaoDaySinglePayInfoReply]: GetLimitXunBaoDaySinglePayInfoReply,
		[SystemClientOpcode.GetLimitXunBaoDaySinglePayRewardReply]: GetLimitXunBaoDaySinglePayRewardReply,

		[SystemClientOpcode.GetAutoInspireReply]: GetAutoInspireReply,
		[SystemClientOpcode.ShiftMsg]: ShiftMsg,
		/** 战队逐鹿 */
		[SystemClientOpcode.GetTeamChiefHurtReply]: GetTeamChiefHurtReply,
		[SystemClientOpcode.ChiefCopyFinishReply]: ChiefCopyFinishReply,
		[SystemClientOpcode.GetTeamChiefCopyInfoReply]: GetTeamChiefCopyInfoReply,
		[SystemClientOpcode.GetTeamBattleCopyInfoReply]: GetTeamBattleCopyInfoReply,
		[SystemClientOpcode.GetTeamPrepareCopyInfoReply]: GetTeamPrepareCopyInfoReply,
		[SystemClientOpcode.UpdateGatherInfoReply]: UpdateGatherInfoReply,
		[SystemClientOpcode.UpdateTeamBattleInfo]: UpdateTeamBattleInfo,
		[SystemClientOpcode.GetTeamChiefRankListReply]: GetTeamChiefRankListReply,
		[SystemClientOpcode.TeamBattleCopyFinishReply]: TeamBattleCopyFinishReply,
		[SystemClientOpcode.UpdateTeanBattleScore]: UpdateTeanBattleScore,
		[SystemClientOpcode.GetTeamChiefHurtAwardReply]: GetTeamChiefHurtAwardReply,
		[SystemClientOpcode.UpdateAchievementTask]: UpdateAchievementTask,
		[SystemClientOpcode.GetAchievementInfoReply]: GetAchievementInfoReply,
		[SystemClientOpcode.GetAchievementTaskAwardReply]: GetAchievementTaskAwardReply,
		[SystemClientOpcode.UserTransferReply]: UserTransferReply,
		[SystemClientOpcode.UpdateTeamBattleReborn]: UpdateTeamBattleReborn,
		[SystemClientOpcode.GetTeamBattleWorshipReply]: GetTeamBattleWorshipReply,
		[SystemClientOpcode.GetTeamBattleWorshipInfoReply]: GetTeamBattleWorshipInfoReply,
		[SystemClientOpcode.GetTeamChiefScoreReply]: GetTeamChiefScoreReply,
		[SystemClientOpcode.GetTeamChiefScoreAwardReply]: GetTeamChiefScoreAwardReply,
		[SystemClientOpcode.GetTeamBattleCopyTimeReply]: GetTeamBattleCopyTimeReply,
		// 地鼠
		[SystemClientOpcode.AutoSC_DiShuData]: AutoSC_DiShuData,
		[SystemClientOpcode.AutoSC_DiShuOpen]: AutoSC_DiShuOpen,
		[SystemClientOpcode.AutoSC_DiShuRowAwdRet]: AutoSC_DiShuRowAwdRet,
		[SystemClientOpcode.AutoSC_DiShuUltimateAwdRet]: AutoSC_DiShuUltimateAwdRet,
		[SystemClientOpcode.AutoSC_DiShuRankRet]: AutoSC_DiShuRankRet,
		[SystemClientOpcode.AutoSC_SelectUltimateRet]: AutoSC_SelectUltimateRet,
		[SystemClientOpcode.AutoSC_GetTaskAwd]: AutoSC_GetTaskAwd,
		//外显套装
		[SystemClientOpcode.AutoSC_ShowSuitInfo]: AutoSC_ShowSuitInfo,
		[SystemClientOpcode.AutoSC_ShowSuitUpLevel]: AutoSC_ShowSuitUpLevel,
		[SystemClientOpcode.AutoSC_ShowSuitUpPosHallucination]: AutoSC_ShowSuitUpPosHallucination,


		[SystemClientOpcode.BroadcastData]: BroadcastData,



		//SystemNexusOpcode
		[SystemNexusOpcode.SV_CommonReply]: SV_CommonReply,
		[SystemNexusOpcode.SV_ServicePing]: SV_ServicePing,
		[SystemNexusOpcode.SV_RegisterMap]: SV_RegisterMap,
		[SystemNexusOpcode.SV_LoadComplateReply]: SV_LoadComplateReply,
		[SystemNexusOpcode.SV_ReqEnterScene]: SV_ReqEnterScene,
		[SystemNexusOpcode.SV_FallbackLogout]: SV_FallbackLogout,
		[SystemNexusOpcode.SV_GM_SetLocalTimeToNexus]: SV_GM_SetLocalTimeToNexus,
		[SystemNexusOpcode.SV_GM_SetOpenServerTimeToNexus]: SV_GM_SetOpenServerTimeToNexus,
		[SystemNexusOpcode.SV_UpdateActorExt]: SV_UpdateActorExt,
		[SystemNexusOpcode.SV_UpdateNineCopyRankToNexus]: SV_UpdateNineCopyRankToNexus,
		[SystemNexusOpcode.SV_CheckSetName]: SV_CheckSetName,
		[SystemNexusOpcode.SV_UpdateNexusName]: SV_UpdateNexusName,
		[SystemNexusOpcode.SV_UpdateNexusOcc]: SV_UpdateNexusOcc,
		[SystemNexusOpcode.SV_LoginUserToFeatureReply]: SV_LoginUserToFeatureReply,
		[SystemNexusOpcode.SV_LoginUserToMapReply]: SV_LoginUserToMapReply,
		[SystemNexusOpcode.SV_LogoutUserOfMapReply]: SV_LogoutUserOfMapReply,
		[SystemNexusOpcode.SV_AuthService]: SV_AuthService,
		[SystemNexusOpcode.SV_AuthChatReply]: SV_AuthChatReply,
		[SystemNexusOpcode.SV_LoginUserToChatOfFeature]: SV_LoginUserToChatOfFeature,
		[SystemNexusOpcode.SV_LoginUserToCrossOfFeature]: SV_LoginUserToCrossOfFeature,
		[SystemNexusOpcode.SV_LoginUserToCrossTOfFeature]: SV_LoginUserToCrossTOfFeature,
		[SystemNexusOpcode.SV_GetActorImgData]: SV_GetActorImgData,
		[SystemNexusOpcode.SV_GetActorImgDataOfCross]: SV_GetActorImgDataOfCross,
		[SystemNexusOpcode.SV_GetActorImgDataOfFeatureReply]: SV_GetActorImgDataOfFeatureReply,
		[SystemNexusOpcode.SV_ChatReply]: SV_ChatReply,
		[SystemNexusOpcode.SV_LoginChatFinish]: SV_LoginChatFinish,
		[SystemNexusOpcode.SV_ReqChatInfoOfChat]: SV_ReqChatInfoOfChat,
		[SystemNexusOpcode.SV_ReqChatInfoOfFeatureReply]: SV_ReqChatInfoOfFeatureReply,
		[SystemNexusOpcode.SV_ReqChatInfoToClient]: SV_ReqChatInfoToClient,
		[SystemNexusOpcode.SV_ChatRecordToClient]: SV_ChatRecordToClient,
		[SystemNexusOpcode.SV_DelExpressionCountOfChat]: SV_DelExpressionCountOfChat,
		[SystemNexusOpcode.SV_DelExpressionCountOfFeatureReply]: SV_DelExpressionCountOfFeatureReply,
		[SystemNexusOpcode.SV_LoginUserToCenterReply]: SV_LoginUserToCenterReply,
		[SystemNexusOpcode.SV_LoginUserToCenterSuccessReply]: SV_LoginUserToCenterSuccessReply,
		[SystemNexusOpcode.SV_GetFairyEscortListToNexus]: SV_GetFairyEscortListToNexus,
		[SystemNexusOpcode.SV_AddFairyEscortLog]: SV_AddFairyEscortLog,
		[SystemNexusOpcode.SV_UpdateFairyPanelInfoToNexus]: SV_UpdateFairyPanelInfoToNexus,
		[SystemNexusOpcode.SV_AuthCrossReply]: SV_AuthCrossReply,
		[SystemNexusOpcode.SV_LoginUserToCrossReply]: SV_LoginUserToCrossReply,
		[SystemNexusOpcode.SV_LoginUserToCrossTReply]: SV_LoginUserToCrossTReply,
		[SystemNexusOpcode.SV_RegisterMapToNexus]: SV_RegisterMapToNexus,
		[SystemNexusOpcode.SV_AuthCrossTReply]: SV_AuthCrossTReply,
		[SystemNexusOpcode.SV_RobotEnterScene]: SV_RobotEnterScene,

		//SystemFeatureOpcode
		[SystemFeatureOpcode.SV_LoginUserToFeature]: SV_LoginUserToFeature,
		[SystemFeatureOpcode.SV_AuthFeatureReply]: SV_AuthFeatureReply,
		[SystemFeatureOpcode.SV_SyncServiceToFeature]: SV_SyncServiceToFeature,
		[SystemFeatureOpcode.SV_LogoutUserOfFeature]: SV_LogoutUserOfFeature,
		[SystemFeatureOpcode.SV_UpdateServerConnectToFeature]: SV_UpdateServerConnectToFeature,
		[SystemFeatureOpcode.SV_GetActorImgDataOfNexus]: SV_GetActorImgDataOfNexus,
		[SystemFeatureOpcode.SV_LoginUserToCenterSuccess]: SV_LoginUserToCenterSuccess,
		[SystemFeatureOpcode.SV_OnhookIncome]: SV_OnhookIncome,
		[SystemFeatureOpcode.SV_LoadComplateToFeature]: SV_LoadComplateToFeature,
		[SystemFeatureOpcode.SV_UserLoginComplete]: SV_UserLoginComplete,
		[SystemFeatureOpcode.SV_UpdateAttrToFeature]: SV_UpdateAttrToFeature,
		[SystemFeatureOpcode.SV_UpdateFightToFeature]: SV_UpdateFightToFeature,
		[SystemFeatureOpcode.SV_ReqEnterSceneReply]: SV_ReqEnterSceneReply,
		[SystemFeatureOpcode.SV_FallbackToCommonScene]: SV_FallbackToCommonScene,
		[SystemFeatureOpcode.SV_UpdateCopyData]: SV_UpdateCopyData,
		[SystemFeatureOpcode.SV_UpdateKillMonstetWare]: SV_UpdateKillMonstetWare,
		[SystemFeatureOpcode.SV_UpdateOnhookUpdateTime]: SV_UpdateOnhookUpdateTime,
		[SystemFeatureOpcode.SV_SetLocalTimeToFeature]: SV_SetLocalTimeToFeature,
		[SystemFeatureOpcode.SV_KillMonster]: SV_KillMonster,
		[SystemFeatureOpcode.SV_UpdateForeverScene]: SV_UpdateForeverScene,
		[SystemFeatureOpcode.SV_DelMoney]: SV_DelMoney,
		[SystemFeatureOpcode.SV_HotupdateToFeature]: SV_HotupdateToFeature,
		[SystemFeatureOpcode.SV_ReloadCfgToFeature]: SV_ReloadCfgToFeature,
		[SystemFeatureOpcode.SV_DelCopyTimes]: SV_DelCopyTimes,
		[SystemFeatureOpcode.SV_SynPos]: SV_SynPos,
		[SystemFeatureOpcode.SV_DelOpenBoxTimes]: SV_DelOpenBoxTimes,
		[SystemFeatureOpcode.SV_DelItems]: SV_DelItems,
		[SystemFeatureOpcode.SV_ChangeCopyReply]: SV_ChangeCopyReply,
		[SystemFeatureOpcode.SV_UpdateActorDead]: SV_UpdateActorDead,
		[SystemFeatureOpcode.SV_BroadcastCopyState]: SV_BroadcastCopyState,
		[SystemFeatureOpcode.SV_UpdateNineCopy]: SV_UpdateNineCopy,
		[SystemFeatureOpcode.SV_BroadcasNineCopyRank]: SV_BroadcasNineCopyRank,
		[SystemFeatureOpcode.SV_UpdateInspireNum]: SV_UpdateInspireNum,
		[SystemFeatureOpcode.SV_AddKillHomeBossNum]: SV_AddKillHomeBossNum,
		[SystemFeatureOpcode.SV_XianFuEventFinish]: SV_XianFuEventFinish,
		[SystemFeatureOpcode.SV_GatherEnd]: SV_GatherEnd,
		[SystemFeatureOpcode.SV_SetOpenServerTimeToFeature]: SV_SetOpenServerTimeToFeature,
		[SystemFeatureOpcode.SV_AddOwnHomeBossNum]: SV_AddOwnHomeBossNum,
		[SystemFeatureOpcode.SV_BroadcastSeasonStateToFeatrue]: SV_BroadcastSeasonStateToFeatrue,
		[SystemFeatureOpcode.SV_UpdateSwimmingTime]: SV_UpdateSwimmingTime,
		[SystemFeatureOpcode.SV_LoginChatFinishOfNexus]: SV_LoginChatFinishOfNexus,
		[SystemFeatureOpcode.SV_LoginSceneFinish]: SV_LoginSceneFinish,
		[SystemFeatureOpcode.SV_JoinKillBossDead]: SV_JoinKillBossDead,
		[SystemFeatureOpcode.SV_CheckNameReply]: SV_CheckNameReply,
		[SystemFeatureOpcode.SubStrength]: SubStrength,
		[SystemFeatureOpcode.SV_XianfuGatherEnd]: SV_XianfuGatherEnd,
		[SystemFeatureOpcode.SV_BroadcastSceneRecords]: SV_BroadcastSceneRecords,
		[SystemFeatureOpcode.SV_AddItems]: SV_AddItems,
		[SystemFeatureOpcode.SV_AddItemsOrToEmail]: SV_AddItemsOrToEmail,
		[SystemFeatureOpcode.SV_GetEmailsAttach]: SV_GetEmailsAttach,
		[SystemFeatureOpcode.SV_AddGold]: SV_AddGold,
		[SystemFeatureOpcode.SV_AddTempItems]: SV_AddTempItems,
		[SystemFeatureOpcode.SV_GetRankDataReply]: SV_GetRankDataReply,
		[SystemFeatureOpcode.SV_GetCrossRankDataReply]: SV_GetCrossRankDataReply,
		[SystemFeatureOpcode.SV_UpdateActorRank]: SV_UpdateActorRank,
		[SystemFeatureOpcode.SV_ReqOrganizeTeamReplay]: SV_ReqOrganizeTeamReplay,
		[SystemFeatureOpcode.SV_CancelOrganizeTeamReply]: SV_CancelOrganizeTeamReply,
		[SystemFeatureOpcode.SV_FinishOrganizeTeam]: SV_FinishOrganizeTeam,
		[SystemFeatureOpcode.SV_InviteJoinTeamReply]: SV_InviteJoinTeamReply,
		[SystemFeatureOpcode.SV_CreateTeamReply]: SV_CreateTeamReply,
		[SystemFeatureOpcode.SV_DestoryTeamReply]: SV_DestoryTeamReply,
		[SystemFeatureOpcode.SV_JoinTeamReply]: SV_JoinTeamReply,
		[SystemFeatureOpcode.SV_LeaveTeamReply]: SV_LeaveTeamReply,
		[SystemFeatureOpcode.SV_KickedTeamReply]: SV_KickedTeamReply,
		[SystemFeatureOpcode.SV_RechargeOrderExchange]: SV_RechargeOrderExchange,
		[SystemFeatureOpcode.SV_ReqChatInfo]: SV_ReqChatInfo,
		[SystemFeatureOpcode.SV_DelExpressionCount]: SV_DelExpressionCount,
		[SystemFeatureOpcode.SV_GetTiantiOfFeatureReply]: SV_GetTiantiOfFeatureReply,
		[SystemFeatureOpcode.SV_InterceptFairyReply]: SV_InterceptFairyReply,
		[SystemFeatureOpcode.SV_AddInterceptFairyOfFeature]: SV_AddInterceptFairyOfFeature,
		[SystemFeatureOpcode.SV_UpdateFeishengRankInfo]: SV_UpdateFeishengRankInfo,
		[SystemFeatureOpcode.SV_UpdateFeishengRushBuyInfoReply]: SV_UpdateFeishengRushBuyInfoReply,
		[SystemFeatureOpcode.SV_UpdateJzduobaoInfoToFeature]: SV_UpdateJzduobaoInfoToFeature,
		[SystemFeatureOpcode.SV_UpdateFeishengRankEnd]: SV_UpdateFeishengRankEnd,
		[SystemFeatureOpcode.SV_ChallengeArenaReply]: SV_ChallengeArenaReply,
		[SystemFeatureOpcode.SV_GetArenaRankReply]: SV_GetArenaRankReply,
		[SystemFeatureOpcode.SV_UpdateArenaRank]: SV_UpdateArenaRank,
		[SystemFeatureOpcode.SV_GetArenaObjsReply]: SV_GetArenaObjsReply,
		[SystemFeatureOpcode.SV_CreateFaction]: SV_CreateFaction,
		[SystemFeatureOpcode.SV_UpdateFactionInfoToFeature]: SV_UpdateFactionInfoToFeature,
		[SystemFeatureOpcode.SV_JoinApply]: SV_JoinApply,
		[SystemFeatureOpcode.SV_JoinResult]: SV_JoinResult,
		[SystemFeatureOpcode.SV_AskAssistOpenBoxReply]: SV_AskAssistOpenBoxReply,
		[SystemFeatureOpcode.SV_UpdateFactionBox]: SV_UpdateFactionBox,
		[SystemFeatureOpcode.SV_AssistOpenBoxReply]: SV_AssistOpenBoxReply,
		[SystemFeatureOpcode.SV_OtherAssistOpenBox]: SV_OtherAssistOpenBox,
		[SystemFeatureOpcode.SV_OtherAddSpeedOpenBox]: SV_OtherAddSpeedOpenBox,
		[SystemFeatureOpcode.SV_AddFactionHurt]: SV_AddFactionHurt,
		[SystemFeatureOpcode.SV_ExitFactionCopy]: SV_ExitFactionCopy,
		[SystemFeatureOpcode.SV_UpdateDesignationTime]: SV_UpdateDesignationTime,
		[SystemFeatureOpcode.SV_GetDesinationReply]: SV_GetDesinationReply,

		//SystemChatOpcode
		[SystemChatOpcode.SV_AuthChat]: SV_AuthChat,
		[SystemChatOpcode.SV_ChatServicePing]: SV_ChatServicePing,
		[SystemChatOpcode.SV_HotupdateToChat]: SV_HotupdateToChat,
		[SystemChatOpcode.SV_ReloadCfgToChat]: SV_ReloadCfgToChat,
		[SystemChatOpcode.SV_UpdateActorLevelToChat]: SV_UpdateActorLevelToChat,
		[SystemChatOpcode.SV_UpdateActorXianWeiLevelToChat]: SV_UpdateActorXianWeiLevelToChat,
		[SystemChatOpcode.SV_UpdateFactionInfo]: SV_UpdateFactionInfo,
		[SystemChatOpcode.SV_FactionDissolution]: SV_FactionDissolution,
		[SystemChatOpcode.SV_UpdateChatName]: SV_UpdateChatName,
		[SystemChatOpcode.SV_UpdateChatOcc]: SV_UpdateChatOcc,
		[SystemChatOpcode.SV_LoginUserToChat]: SV_LoginUserToChat,
		[SystemChatOpcode.SV_LogoutUserOfChat]: SV_LogoutUserOfChat,
		[SystemChatOpcode.SV_GetActorImgDataOfNexusReply]: SV_GetActorImgDataOfNexusReply,
		[SystemChatOpcode.SV_BroadcastChat]: SV_BroadcastChat,
		[SystemChatOpcode.SV_GmBroadcastChat]: SV_GmBroadcastChat,
		[SystemChatOpcode.SV_UpdateChatData]: SV_UpdateChatData,
		[SystemChatOpcode.SV_GetChatDetailedInfoReply]: SV_GetChatDetailedInfoReply,
		[SystemChatOpcode.SV_DelExpressionCountReply]: SV_DelExpressionCountReply,
		[SystemChatOpcode.SV_SetBlockSpeak]: SV_SetBlockSpeak,
		[SystemChatOpcode.SV_UpdateFairyEscortInfo]: SV_UpdateFairyEscortInfo,
		[SystemChatOpcode.SV_InterceptFairy]: SV_InterceptFairy,
		[SystemChatOpcode.SV_InterceptResult]: SV_InterceptResult,
		[SystemChatOpcode.SV_ReqOrganizeTeam]: SV_ReqOrganizeTeam,
		[SystemChatOpcode.SV_CancelOrganizeTeam]: SV_CancelOrganizeTeam,
		[SystemChatOpcode.SV_CreateTeam]: SV_CreateTeam,
		[SystemChatOpcode.SV_DestoryTeam]: SV_DestoryTeam,
		[SystemChatOpcode.SV_JoinTeam]: SV_JoinTeam,
		[SystemChatOpcode.SV_LeaveTeam]: SV_LeaveTeam,
		[SystemChatOpcode.SV_KickedTeam]: SV_KickedTeam,

		//SystemCrossOpcode
		[SystemCrossOpcode.SV_HotupdateToCross]: SV_HotupdateToCross,
		[SystemCrossOpcode.SV_ReloadCfgToCross]: SV_ReloadCfgToCross,
		[SystemCrossOpcode.SV_GetCrossBoss]: SV_GetCrossBoss,
		[SystemCrossOpcode.SV_GetCrossForeverScene]: SV_GetCrossForeverScene,
		[SystemCrossOpcode.SV_UpdateNineCopyGains]: SV_UpdateNineCopyGains,
		[SystemCrossOpcode.SV_GetNineCopyRank]: SV_GetNineCopyRank,
		[SystemCrossOpcode.SV_GetSeasonStateFromCross]: SV_GetSeasonStateFromCross,
		[SystemCrossOpcode.SV_GetSceneStateFromCross]: SV_GetSceneStateFromCross,
		[SystemCrossOpcode.SV_GetSceneStateFromCrossOfMap]: SV_GetSceneStateFromCrossOfMap,
		[SystemCrossOpcode.SV_UpdateCrossName]: SV_UpdateCrossName,
		[SystemCrossOpcode.SV_UpdateCrossOcc]: SV_UpdateCrossOcc,
		[SystemCrossOpcode.SV_GetCopyStateFromCross]: SV_GetCopyStateFromCross,
		[SystemCrossOpcode.SV_GM_SetLocalTimeToCross]: SV_GM_SetLocalTimeToCross,
		[SystemCrossOpcode.SV_GM_ResetFeishengRank]: SV_GM_ResetFeishengRank,
		[SystemCrossOpcode.SV_GM_ResetJzDuobaoRank]: SV_GM_ResetJzDuobaoRank,
		[SystemCrossOpcode.SV_AuthCross]: SV_AuthCross,
		[SystemCrossOpcode.SV_CrossServicePing]: SV_CrossServicePing,
		[SystemCrossOpcode.SV_RegisterMapToCross]: SV_RegisterMapToCross,
		[SystemCrossOpcode.SV_LoginUserToCross]: SV_LoginUserToCross,
		[SystemCrossOpcode.SV_LoginUserToCrossMap]: SV_LoginUserToCrossMap,
		[SystemCrossOpcode.SV_LogoutUserToCrossMap]: SV_LogoutUserToCrossMap,
		[SystemCrossOpcode.SV_LogoutUserToCross]: SV_LogoutUserToCross,
		[SystemCrossOpcode.SV_FallbackLogoutCross]: SV_FallbackLogoutCross,
		[SystemCrossOpcode.SV_LogoutUserOfMapToCrossReply]: SV_LogoutUserOfMapToCrossReply,
		[SystemCrossOpcode.SV_LoginUserToMapOfCrossReply]: SV_LoginUserToMapOfCrossReply,
		[SystemCrossOpcode.SV_LoginRobotToCross]: SV_LoginRobotToCross,
		[SystemCrossOpcode.SV_ReqOrganizeTeamToCross]: SV_ReqOrganizeTeamToCross,
		[SystemCrossOpcode.SV_CancelOrganizeTeamToCross]: SV_CancelOrganizeTeamToCross,
		[SystemCrossOpcode.SV_GetActorImgDataToCrossOfNexusReply]: SV_GetActorImgDataToCrossOfNexusReply,
		[SystemCrossOpcode.SV_LoginBogusUserToCross]: SV_LoginBogusUserToCross,
		[SystemCrossOpcode.SV_LogoutBogusUserToCross]: SV_LogoutBogusUserToCross,
		[SystemCrossOpcode.SV_GetTiantiRank]: SV_GetTiantiRank,
		[SystemCrossOpcode.SV_CommitActorTiantiOfCenter]: SV_CommitActorTiantiOfCenter,
		[SystemCrossOpcode.SV_GetCrossRankData]: SV_GetCrossRankData,
		[SystemCrossOpcode.SV_UpdateCrossRankData]: SV_UpdateCrossRankData,
		[SystemCrossOpcode.SV_UpdateActorCrossRankShow]: SV_UpdateActorCrossRankShow,
		[SystemCrossOpcode.SV_UpdateVipLevelToCross]: SV_UpdateVipLevelToCross,
		[SystemCrossOpcode.SV_UpdateCrossConsumeRankData]: SV_UpdateCrossConsumeRankData,
		[SystemCrossOpcode.SV_GetFeishengRankInfo]: SV_GetFeishengRankInfo,
		[SystemCrossOpcode.SV_GetFeishengRankInfoOfCenter]: SV_GetFeishengRankInfoOfCenter,
		[SystemCrossOpcode.SV_GetJzduobaoInfo]: SV_GetJzduobaoInfo,
		[SystemCrossOpcode.SV_GetJzduobaoInfoOfCenter]: SV_GetJzduobaoInfoOfCenter,
		[SystemCrossOpcode.SV_UpdateJzduobaoInfoToCross]: SV_UpdateJzduobaoInfoToCross,
		[SystemCrossOpcode.SV_UpdateServerRankToCross]: SV_UpdateServerRankToCross,
		[SystemCrossOpcode.SV_CrossAddEmailsReply]: SV_CrossAddEmailsReply,

		//SystemMapOpcode
		[SystemMapOpcode.SV_AuthMapReply]: SV_AuthMapReply,
		[SystemMapOpcode.SV_HotupdateToMap]: SV_HotupdateToMap,
		[SystemMapOpcode.SV_ReloadCfgToMap]: SV_ReloadCfgToMap,
		[SystemMapOpcode.SV_ChangeCopy]: SV_ChangeCopy,
		[SystemMapOpcode.SV_OpenCopyScene]: SV_OpenCopyScene,
		[SystemMapOpcode.SV_GetSceneStateOfMapReply]: SV_GetSceneStateOfMapReply,
		[SystemMapOpcode.SV_CloseCopyScene]: SV_CloseCopyScene,
		[SystemMapOpcode.SV_FairyIntercept]: SV_FairyIntercept,
		[SystemMapOpcode.SV_UpdateSceneLevel]: SV_UpdateSceneLevel,
		[SystemMapOpcode.SV_UpdateMapName]: SV_UpdateMapName,
		[SystemMapOpcode.SV_UpdateMapOcc]: SV_UpdateMapOcc,
		[SystemMapOpcode.SV_Transmit]: SV_Transmit,
		[SystemMapOpcode.SV_FallbackCommonScene]: SV_FallbackCommonScene,
		[SystemMapOpcode.SV_LoginUserToMap]: SV_LoginUserToMap,
		[SystemMapOpcode.SV_ChangeScene]: SV_ChangeScene,
		[SystemMapOpcode.SV_LogoutUserOfMap]: SV_LogoutUserOfMap,
		[SystemMapOpcode.SV_LoadComplateToMap]: SV_LoadComplateToMap,
		[SystemMapOpcode.SV_LogoutCrossOfNexus]: SV_LogoutCrossOfNexus,
		[SystemMapOpcode.SV_LoginRobotToMap]: SV_LoginRobotToMap,
		[SystemMapOpcode.SV_UpdateShow]: SV_UpdateShow,
		[SystemMapOpcode.SV_UpdateAttrToMap]: SV_UpdateAttrToMap,
		[SystemMapOpcode.SV_UpdatePetAttrToMap]: SV_UpdatePetAttrToMap,
		[SystemMapOpcode.SV_UpdateSkill]: SV_UpdateSkill,
		[SystemMapOpcode.SV_UpdateActorLevel]: SV_UpdateActorLevel,
		[SystemMapOpcode.SV_UpdateActorEra]: SV_UpdateActorEra,
		[SystemMapOpcode.SV_SetLocalTimeToMap]: SV_SetLocalTimeToMap,
		[SystemMapOpcode.SV_UpdateHomesteadLevel]: SV_UpdateHomesteadLevel,
		[SystemMapOpcode.SV_UpdateHumanPos]: SV_UpdateHumanPos,
		[SystemMapOpcode.SV_SetOpenServerTimeToMap]: SV_SetOpenServerTimeToMap,
		[SystemMapOpcode.SV_RichesGatherCount]: SV_RichesGatherCount,
		[SystemMapOpcode.SV_UpdateAdventureData]: SV_UpdateAdventureData,
		[SystemMapOpcode.SV_UpdateSwimmingData]: SV_UpdateSwimmingData,
		[SystemMapOpcode.SV_GetBoss]: SV_GetBoss,
		[SystemMapOpcode.SV_GetForeverScene]: SV_GetForeverScene,
		[SystemMapOpcode.SV_DelMoneyReply]: SV_DelMoneyReply,
		[SystemMapOpcode.SV_DelItemsReply]: SV_DelItemsReply,
		[SystemMapOpcode.SV_UpdateBoxTimes]: SV_UpdateBoxTimes,
		[SystemMapOpcode.SV_UpdateCloudlandTimes]: SV_UpdateCloudlandTimes,
		[SystemMapOpcode.SV_XianFuEventTrigger]: SV_XianFuEventTrigger,
		[SystemMapOpcode.SV_AddItemsReply]: SV_AddItemsReply,
		[SystemMapOpcode.SV_SwapArenaRankReply]: SV_SwapArenaRankReply,
		[SystemMapOpcode.SV_UpdateArenaRankToMap]: SV_UpdateArenaRankToMap,
		[SystemMapOpcode.SV_AskFactionCopyInfoReply]: SV_AskFactionCopyInfoReply,
		[SystemMapOpcode.SV_UpdateFactionInfoToMap]: SV_UpdateFactionInfoToMap,

		//SystemBgOpcode
		[SystemBgOpcode.Bg_CommondReply]: Bg_CommondReply,

		//SystemCenterOpcode
		[SystemCenterOpcode.SV_AuthCenterReply]: SV_AuthCenterReply,
		[SystemCenterOpcode.SV_SetLocalTimeToCenter]: SV_SetLocalTimeToCenter,
		[SystemCenterOpcode.SV_HotupdateToCenter]: SV_HotupdateToCenter,
		[SystemCenterOpcode.SV_ReloadCfgToCenter]: SV_ReloadCfgToCenter,
		[SystemCenterOpcode.SV_UpdateServerConnectToCenter]: SV_UpdateServerConnectToCenter,
		[SystemCenterOpcode.SV_UpdateActorRankShow]: SV_UpdateActorRankShow,
		[SystemCenterOpcode.SV_UpdateTeamCopyRank]: SV_UpdateTeamCopyRank,
		[SystemCenterOpcode.SV_UpdateVipLevel]: SV_UpdateVipLevel,
		[SystemCenterOpcode.SV_UpdateNineCopyRank]: SV_UpdateNineCopyRank,
		[SystemCenterOpcode.SV_SetOpenServerTimeToCenter]: SV_SetOpenServerTimeToCenter,
		[SystemCenterOpcode.SV_ResetWelfareToCenter]: SV_ResetWelfareToCenter,
		[SystemCenterOpcode.SV_GetSeasonStateFromCenter]: SV_GetSeasonStateFromCenter,
		[SystemCenterOpcode.SV_GetSceneStateFromCenter]: SV_GetSceneStateFromCenter,
		[SystemCenterOpcode.SV_BroadcastSeasonStateToCenter]: SV_BroadcastSeasonStateToCenter,
		[SystemCenterOpcode.SV_UpdateFight]: SV_UpdateFight,
		[SystemCenterOpcode.SV_UpdateLevel]: SV_UpdateLevel,
		[SystemCenterOpcode.SV_UpdateCenterName]: SV_UpdateCenterName,
		[SystemCenterOpcode.SV_UpdateCenterOcc]: SV_UpdateCenterOcc,
		[SystemCenterOpcode.SV_BroadcastCopyStateToCenter]: SV_BroadcastCopyStateToCenter,
		[SystemCenterOpcode.SV_LoginUserToCenter]: SV_LoginUserToCenter,
		[SystemCenterOpcode.SV_UserLoginCompleteToCenter]: SV_UserLoginCompleteToCenter,
		[SystemCenterOpcode.SV_LogoutUserOfCenter]: SV_LogoutUserOfCenter,
		[SystemCenterOpcode.SV_GetEmailsAttachReply]: SV_GetEmailsAttachReply,
		[SystemCenterOpcode.SV_AddEmails]: SV_AddEmails,
		[SystemCenterOpcode.SV_CrossAddEmails]: SV_CrossAddEmails,
		[SystemCenterOpcode.SV_CrossTAddEmails]: SV_CrossTAddEmails,
		[SystemCenterOpcode.SV_CrossAddEmailsList]: SV_CrossAddEmailsList,
		[SystemCenterOpcode.SV_CrossTAddEmailsList]: SV_CrossTAddEmailsList,
		[SystemCenterOpcode.SV_GetBossReply]: SV_GetBossReply,
		[SystemCenterOpcode.SV_UpdateBoss]: SV_UpdateBoss,
		[SystemCenterOpcode.SV_BOSSJoin]: SV_BOSSJoin,
		[SystemCenterOpcode.SV_BOSSJudgeAward]: SV_BOSSJudgeAward,
		[SystemCenterOpcode.SV_UpdateInspireInfo]: SV_UpdateInspireInfo,
		[SystemCenterOpcode.SV_UpdateBossRankAward]: SV_UpdateBossRankAward,
		[SystemCenterOpcode.SV_GetRankData]: SV_GetRankData,
		[SystemCenterOpcode.SV_UpdateRankData]: SV_UpdateRankData,
		[SystemCenterOpcode.SV_UpdateXunbaoNote]: SV_UpdateXunbaoNote,
		[SystemCenterOpcode.SV_RechargeOrderExchangeReply]: SV_RechargeOrderExchangeReply,
		[SystemCenterOpcode.SV_BroadcastTiantiRank]: SV_BroadcastTiantiRank,
		[SystemCenterOpcode.SV_GetTiantiOfFeature]: SV_GetTiantiOfFeature,
		[SystemCenterOpcode.SV_UpdateTiantiScore]: SV_UpdateTiantiScore,
		[SystemCenterOpcode.SV_UpdatePayRewardNote]: SV_UpdatePayRewardNote,
		[SystemCenterOpcode.SV_GetArenaObjs]: SV_GetArenaObjs,
		[SystemCenterOpcode.SV_AddArenaRank]: SV_AddArenaRank,
		[SystemCenterOpcode.SV_SwapArenaRank]: SV_SwapArenaRank,
		[SystemCenterOpcode.SV_FlushArena]: SV_FlushArena,
		[SystemCenterOpcode.SV_ChallengeArena]: SV_ChallengeArena,
		[SystemCenterOpcode.SV_AddChallengeRecord]: SV_AddChallengeRecord,
		[SystemCenterOpcode.SV_GetArenaRank]: SV_GetArenaRank,
		[SystemCenterOpcode.SV_UpdateFeishengRankInfoOfCenter]: SV_UpdateFeishengRankInfoOfCenter,
		[SystemCenterOpcode.SV_GetFeishengRushBuyInfo]: SV_GetFeishengRushBuyInfo,
		[SystemCenterOpcode.SV_UpdateFeishengRushBuyInfo]: SV_UpdateFeishengRushBuyInfo,
		[SystemCenterOpcode.SV_UpdateFeishengRankEndOfCenter]: SV_UpdateFeishengRankEndOfCenter,
		[SystemCenterOpcode.SV_UpdateDuobaoNote]: SV_UpdateDuobaoNote,
		[SystemCenterOpcode.SV_UpdateDuobaoScore]: SV_UpdateDuobaoScore,
		[SystemCenterOpcode.SV_UpdateJzduobaoInfoToCenter]: SV_UpdateJzduobaoInfoToCenter,
		[SystemCenterOpcode.SV_UpdateJzduobaoNote]: SV_UpdateJzduobaoNote,
		[SystemCenterOpcode.SV_UpdateJzduobaoScore]: SV_UpdateJzduobaoScore,
		[SystemCenterOpcode.SV_CreateFactionReply]: SV_CreateFactionReply,
		[SystemCenterOpcode.SV_SetFactionIdReply]: SV_SetFactionIdReply,
		[SystemCenterOpcode.SV_JoinApplyReply]: SV_JoinApplyReply,
		[SystemCenterOpcode.SV_AutoInvitationPush]: SV_AutoInvitationPush,
		[SystemCenterOpcode.SV_AskAssistOpenBox]: SV_AskAssistOpenBox,
		[SystemCenterOpcode.SV_AddSpeedBox]: SV_AddSpeedBox,
		[SystemCenterOpcode.SV_AssistOpenBox]: SV_AssistOpenBox,
		[SystemCenterOpcode.SV_UpdateFactionCopy]: SV_UpdateFactionCopy,
		[SystemCenterOpcode.SV_AskFactionCopyInfo]: SV_AskFactionCopyInfo,
		[SystemCenterOpcode.SV_UpdateTurnRecord]: SV_UpdateTurnRecord,
		[SystemCenterOpcode.SV_UpdateJoinInfo]: SV_UpdateJoinInfo,
		[SystemCenterOpcode.SV_AddFactionExp]: SV_AddFactionExp,
		[SystemCenterOpcode.SV_GmSetFactionExp]: SV_GmSetFactionExp,
		[SystemCenterOpcode.SV_AddContribution]: SV_AddContribution,
		[SystemCenterOpcode.SV_InviteJoinTeam]: SV_InviteJoinTeam,
		[SystemCenterOpcode.SV_GetDesination]: SV_GetDesination,

		//SystemCrossTOpcode
		[SystemCrossTOpcode.SV_HotupdateToCrossT]: SV_HotupdateToCrossT,
		[SystemCrossTOpcode.SV_ReloadCfgToCrossT]: SV_ReloadCfgToCrossT,
		[SystemCrossTOpcode.SV_GetCrossTBoss]: SV_GetCrossTBoss,
		[SystemCrossTOpcode.SV_GetCrossTForeverScene]: SV_GetCrossTForeverScene,
		[SystemCrossTOpcode.SV_GetTeamCopyRank]: SV_GetTeamCopyRank,
		[SystemCrossTOpcode.SV_GetSeasonStateFromCrossT]: SV_GetSeasonStateFromCrossT,
		[SystemCrossTOpcode.SV_GetSceneStateFromCrossT]: SV_GetSceneStateFromCrossT,
		[SystemCrossTOpcode.SV_GetSceneStateFromCrossTOfMap]: SV_GetSceneStateFromCrossTOfMap,
		[SystemCrossTOpcode.SV_UpdateCrossTName]: SV_UpdateCrossTName,
		[SystemCrossTOpcode.SV_UpdateCrossTOcc]: SV_UpdateCrossTOcc,
		[SystemCrossTOpcode.SV_GetCopyStateFromCrossT]: SV_GetCopyStateFromCrossT,
		[SystemCrossTOpcode.SV_AuthCrossT]: SV_AuthCrossT,
		[SystemCrossTOpcode.SV_CrossTServicePing]: SV_CrossTServicePing,
		[SystemCrossTOpcode.SV_RegisterMapToCrossT]: SV_RegisterMapToCrossT,
		[SystemCrossTOpcode.SV_LoginUserToCrossT]: SV_LoginUserToCrossT,
		[SystemCrossTOpcode.SV_LoginUserToCrossTMap]: SV_LoginUserToCrossTMap,
		[SystemCrossTOpcode.SV_LogoutUserToCrossTMap]: SV_LogoutUserToCrossTMap,
		[SystemCrossTOpcode.SV_LogoutUserToCrossT]: SV_LogoutUserToCrossT,
		[SystemCrossTOpcode.SV_FallbackLogoutCrossT]: SV_FallbackLogoutCrossT,
		[SystemCrossTOpcode.SV_LogoutUserOfMapToCrossTReply]: SV_LogoutUserOfMapToCrossTReply,
		[SystemCrossTOpcode.SV_LoginUserToMapOfCrossTReply]: SV_LoginUserToMapOfCrossTReply,
		[SystemCrossTOpcode.SV_LoginRobotToCrossT]: SV_LoginRobotToCrossT,
		[SystemCrossTOpcode.SV_LoginBogusUserToCrossT]: SV_LoginBogusUserToCrossT,
		[SystemCrossTOpcode.SV_LogoutBogusUserToCrossT]: SV_LogoutBogusUserToCrossT,
		[SystemCrossTOpcode.SV_UpdateTeamCopyWare]: SV_UpdateTeamCopyWare,
		[SystemCrossTOpcode.SV_CrossTAddEmailsReply]: SV_CrossTAddEmailsReply,

		/***************************************Bg命令***************************************/

		//BgNexusOpcode
		[BgNexusOpcode.Bg_Hotupdate]: Bg_Hotupdate,
		[BgNexusOpcode.Bg_ReloadCfg]: Bg_ReloadCfg,
		[BgNexusOpcode.Bg_Block]: Bg_Block,
		[BgNexusOpcode.Bg_ForceLogout]: Bg_ForceLogout,
		[BgNexusOpcode.Bg_Broadcast]: Bg_Broadcast,
		[BgNexusOpcode.Bg_DelBroadcast]: Bg_DelBroadcast,

		//BgFeatureOpcode
		[BgFeatureOpcode.Bg_GMCommonToFeature]: Bg_GMCommonToFeature,

		//BgCenterOpcode
		[BgCenterOpcode.Bg_AddEmails]: Bg_AddEmails,
		[BgCenterOpcode.Bg_RechargeOrder]: Bg_RechargeOrder,
		[BgCenterOpcode.Bg_FeebackReply]: Bg_FeebackReply,
		[BgCenterOpcode.Bg_CDKEYProduce]: Bg_CDKEYProduce,
		[BgCenterOpcode.Bg_CDKEYState]: Bg_CDKEYState,
		[BgCenterOpcode.Bg_CDKEYDel]: Bg_CDKEYDel,
		[BgCenterOpcode.Bg_UpdateNotice]: Bg_UpdateNotice,




	}
}