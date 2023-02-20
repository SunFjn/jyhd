// /**
//  * 通用事件类型
//  */
// module modules.common {
//     export class CommonEventType {
//         public static RESIZE_UI: string = "RESIZE_UI";
//
//         // 登录成功
//         public static LOGIN_SUCCESS: string = "LOGIN_SUCCESS";
//         // 更新服务器列表
//         public static SERVER_LIST_UPDATE: string = "SERVER_LIST_UPDATE";
//         // 选择服务器
//         public static SELECT_SERVER: string = "SELECT_SERVER";
//
//         // 创角失败
//         public static CREATE_ROLE_FAIL: string = "CREATE_ROLE_FAIL";
//
//         // 打开面板或弹窗（windowmanager调用open的时候发送）
//         public static PANEL_OPEN: string = "PANEL_OPEN";
//         // 关闭面板或弹窗（windowmanager调用close的时候发送）
//         public static PANEL_CLOSE: string = "PANEL_CLOSE";
//
//         // 面板打开事件（添加到舞台时发送）
//         public static PANEL_OPENED: string = "PANEL_OPENED";
//         // 面板关闭事件（从舞台移除时发送）
//         public static PANEL_CLOSED: string = "PANEL_CLOSED";
//
//         // -----------------------------------------  场景 -------------------------------
//         // 进入场景
//         public static SCENE_ENTER: string = "SCENE_ENTER";
//         // 入屏添加道具
//         public static SCENE_ADD_ITEMS: string = "SCENE_ADD_ITEMS";
//         // 入屏添加玩家
//         public static SCENE_ADD_HUMANS: string = "SCENE_ADD_HUMANS";
//         // 入屏添加怪物
//         public static SCENE_ADD_MONSTERS: string = "SCENE_ADD_MONSTERS";
//         // 入屏添加NPC
//         public static SCENE_ADD_NPCS: string = "SCENE_ADD_NPCS";
//         // 离屏删除道具
//         public static SCENE_REMOVE_ITEMS: string = "SCENE_REMOVE_ITEMS";
//         // 离屏删除玩家
//         public static SCENE_REMOVE_HUMANS: string = "SCENE_REMOVE_HUMANS";
//         // 离屏删除怪物
//         public static SCENE_REMOVE_MONSTERS: string = "SCENE_REMOVE_MONSTERS";
//         // 离屏删除NPC
//         public static SCENE_REMOVE_NPCS: string = "SCENE_REMOVE_NPCS";
//         // 采集状态更新
//         public static SCENE_NPC_GATHER_STATE_UPDATE: string = "SCENE_NPC_GATHER_STATE_UPDATE";
//         // 触发的NPC更新
//         public static SCENE_TRIGGERED_NPC_UPDATE: string = "SCENE_TRIGGERED_NPC_UPDATE";
//         // 采集结束
//         public static SCENE_GATHER_END: string = "SCENE_GATHER_END";
//         // -----------------------------------------  场景 -------------------------------
//
//         // -----------------------------------------  玩家 ----------------------------------
//         // 基本属性更新
//         public static PLAYER_BASE_ATTR_UPDATE: string = "PLAYER_BASE_ATTR_UPDATE";
//         // 客户端准备完成
//         public static PLAYER_CLIENT_READY: string = "PLAYER_CLIENT_READY";
//         // 总属性更新
//         public static PLAYER_TOTAL_ATTR_UPDATE: string = "PLAYER_TOTAL_ATTR_UPDATE";
//         // 更新等级
//         public static PLAYER_UPDATE_LEVEL: string = "PLAYER_UPDATE_LEVEL";
//         // 更新经验
//         public static PLAYER_UPDATE_EXP: string = "PLAYER_UPDATE_EXP";
//         // 更新货币
//         public static PLAYER_UPDATE_MONEY: string = "PLAYER_UPDATE_MONEY";
//         // 更新魔力
//         public static PLAYER_UPDATE_ZQ: string = "PLAYER_UPDATE_ZQ";
//         // 更新天梯荣誉
//         public static PLAYER_UPDATE_HONOR: string = "PLAYER_UPDATE_HONOR";
//         // 更新战力
//         public static PLAYER_UPDATE_FIGHT: string = "PLAYER_UPDATE_FIGHT";
//         // 装备数据初始化
//         public static PLAYER_EQUIPS_INITED: string = "PLAYER_EQUIPS_INITED";
//         // 穿戴装备
//         public static PLAYER_WEAR_EQUIP: string = "PLAYER_WEAR_EQUIP";
//         // 穿戴多个装备
//         public static PLAYER_WEAR_EQUIPS: string = "PLAYER_WEAR_EQUIPS";
//         //更新转升等级
//         public static PLAYER_BORN_LEV: string = "PLAYER_BORN_LEV";
//         // 更新玩家血量
//         public static PLAYER_UPDATE_HP: string = "PLAYER_UPDATE_HP";
//         // 更新玩家总血量
//         public static PLAYER_UPDATE_MAX_HP: string = "PLAYER_UPDATE_MAX_HP";
//         //获取玩家离线收益
//         public static GET_OUTLINE_INFO_REPLY: string = "GET_OUTLINE_INFO_REPLY";
//         // 更新PK模式PK
//         public static PLAYER_UPDATE_PK_MODE: string = "PLAYER_UPDATE_PK_MODE";
//         // 选择目标变化
//         public static PLAYER_TARGET_CHANGE: string = "PLAYER_TARGET_CHANGE";
//         // 触发NPC
//         public static PLAYER_TRIGGER_NPC: string = "PLAYER_TRIGGER_NPC";
//         // -----------------------------------------  玩家 ----------------------------------
//
//         // -----------------------------------------  背包 -------------------------------
//         // 背包数据初始化
//         public static BAG_DATA_INITED: string = "BAG_DATA_GOT";
//         // 增加
//         public static BAG_ADD_ITEM: string = "BAG_ADD_ITEM";
//         // 改变数量
//         public static BAG_CHANGE_NUM: string = "BAG_CHANGE_NUM";
//         // 删除
//         public static BAG_REMOVE_ITEM: string = "BAG_REMOVE_ITEM";
//         // 背包更新
//         public static BAG_UPDATE: string = "BAG_UPDATE";
//         // 熔炼更新
//         public static SMELT_UPDATE: string = "SMELT_UPDATE";
//         //熔炼成功提示
//         public static SMELT_SUCCEED: string = "SMELT_SUCCEED";
//         // 切换熔炼条件
//         public static SELECT_SMELT_UPDATE: string = "SELECT_SMELT_UPDATE";
//
//
//         // -----------------------------------------  背包 -------------------------------
//
//         // -----------------------------------------  任务 -------------------------------
//         // 任务信息更新
//         public static TASK_UPDATED: string = "TASK_UPDATED";
//         // -----------------------------------------  任务 -------------------------------
//
//         // -----------------------------------------  邮件 -------------------------------
//         // 单个邮件更新
//         public static EMAIL_SINGLE_UPDATE: string = "EMAIL_SINGLE_UPDATE";
//         // 邮件列表更新
//         public static EMAIL_LIST_UPDATE: string = "EMAIL_LIST_UPDATE";
//         // -----------------------------------------  邮件 -------------------------------
//
//         // -----------------------------------------  宠物 -------------------------------
//         // 宠物更新
//         public static MAGIC_PET_INITED: string = "MAGIC_PET_INITED";
//         // 宠物更新
//         public static MAGIC_PET_UPDATE: string = "MAGIC_PET_UPDATE";
//         //宠物更换外观
//         public static MAGIC_PET_RANK_SHOWID: string = "MAGIC_PET_RANK_SHOWID";
//         //宠物幻化更换外观
//         public static MAGIC_PET_HUANHUA_SHOWID: string = "MAGIC_PET_HUANHUA_SHOWID";
//
//         // -----------------------------------------  宠物 -------------------------------
//
//         // -----------------------------------------  天关 -------------------------------
//         // 更新层数
//         public static MISSION_UPDATE_LV: string = "MISSION_UPDATE_LV";
//         // 更新波数
//         public static MISSION_UPDATE_WARE: string = "MISSION_UPDATE_WARE";
//         // 更新已领奖层数
//         public static MISSION_UPDATE_AWARD_LV: string = "MISSION_UPDATE_AWARD_LV";
//         // 更新排行榜
//         public static MISSION_UPDATE_RANK: string = "MISSION_UPDATE_RANK";
//         // 自动
//         public static MISSION_UPDATE_AUTO: string = "MISSION_UPDATE_AUTO";
//         //更新玩家移动地点
//         public static MISSION_MOVE_POS_UPDATE: string = "MISSION_MOVE_POS_UPDATE";
//         // -----------------------------------------  天关 -------------------------------
//
//         // -----------------------------------------  副本 -------------------------------
//         // 副本结算
//         public static DUNGEON_RESULT: string = "DUNGEON_RESULT";
//         // 副本鼓舞
//         public static DUNGEON_INSPIRE_UPDATE: string = "DUNGEON_INSPIRE_UPDATE";
//         // 副本次数、难度更新
//         public static DUNGEON_TIMES_UPDATE: string = "DUNGEON_TIMES_UPDATE";
//         // 副本开始战斗广播
//         public static DUNGEON_BROADCAST_BEGIN_COMBAT: string = "DUNGEON_BROADCAST_BEGIN_COMBAT";
//         // 副本结束战斗广播
//         public static DUNGEON_BROADCAST_END_COMBAT: string = "DUNGEON_BROADCAST_END_COMBAT";
//         // 副本怪物波数广播
//         public static DUNGEON_BROADCAST_COPY_MONSTER_WARE: string = "DUNGEON_BROADCAST_COPY_MONSTER_WARE";
//         // 副本收益广播
//         public static DUNGEON_BROADCAST_COPY_INCOME: string = "DUNGEON_BROADCAST_COPY_INCOME";
//         // 副本星级广播
//         public static DUNGEON_BROADCAST_COPY_STAR: string = "DUNGEON_BROADCAST_COPY_STAR";
//         // 副本更新收益记录
//         public static DUNGEON_UPDATE_INCOME_RECORD: string = "DUNGEON_UPDATE_INCOME_RECORD";
//         // 副本更新参与奖励
//         public static DUNGEON_UPDATE_JOIN_AWARD: string = "DUNGEON_UPDATE_JOIN_AWARD";
//         // BOSS信息更新
//         public static DUNGEON_BOSS_UPDATE: string = "DUNGEON_BOSS_UPDATE";
//         // BOSS伤害排行更新
//         public static DUNGEON_BOSS_RANKS_UPDATE: string = "DUNGEON_BOSS_RANKS_UPDATE";
//         // BOSS次数更新
//         public static DUNGEON_BOSS_TIMES_UPDATE: string = "DUNGEON_BOSS_TIMES_UPDATE";
//         // 添加BOSS TIP
//         public static DUNGEON_BOSS_REVIVE_TIP: string = "DUNGEON_BOSS_REVIVE_TIP";
//         // BOSS死亡重生推送
//         public static DUNGEON_BOSS_DEAD_REVIVE: string = "DUNGEON_BOSS_DEAD_REVIVE";
//         // 更新场景状态
//         public static DUNGEON_SCENE_STATE_UPDATE: string = "DUNGEON_SCENE_STATE_UPDATE";
//         // -----------------------------------------  副本 -------------------------------
//
//         // -----------------------------------------  金身 -------------------------------
//         //金身初始化
//         public static GOLD_BODY_INITED: string = "GOLD_BODY_INITED";
//         //金身更新
//         public static GOLD_BODY_UPDATE: string = "GOLD_BODY_UPDATE";
//         // //金身修炼
//         // public static GOLD_BODY_REFINE: string = "GOLD_BODY_REFINE";
//         // //不败金身修炼
//         // public static GOLD_BODY_RISE: string = "GOLD_BODY_RISE";
//         // -----------------------------------------  金身 -------------------------------
//
//         // -----------------------------------------  签到 -------------------------------
//         //获取签到信息
//         public static GET_SIGN: string = "GET_SIGN";
//         //签到返回
//         public static SIGN_REPLY: string = "SIGN_REPLY";
//         // -----------------------------------------  签到 -------------------------------
//
//         // -----------------------------------------  单人boss -------------------------------
//         //获取单人BOSS
//         public static GET_SINGLE_BOSS: string = "GET_SINGLE_BOSS";
//         //更新单人BOSS
//         public static UPDATE_SINGLE_BOSS: string = "UPDATE_SINGLE_BOSS";
//         // -----------------------------------------  单人boss -------------------------------
//
//         // -----------------------------------------  功能开启 -------------------------------
//         // 功能开启更新
//         public static FUNC_OPEN_UPDATE: string = "FUNC_OPEN_UPDATE";
//         // -----------------------------------------  功能开启 -------------------------------
//
//
//         // -----------------------------------------  七日礼 -------------------------------
//         public static SEVEN_GIFT_UPDATA: string = "SEVEN_GIFT_UPDATA";
//         // -----------------------------------------  七日礼 -------------------------------
//
//
//         // -----------------------------------------  仙石 -------------------------------
//         public static STONE_UPDATA: string = "STONE_UPDATA";
//         public static UP_MASTER: string = "UP_MASTER";
//         public static UP_EFFECT: string = "UP_EFFECT";
//         public static ONEKEY_UP_EFFECT: string = "ONEKEY_UP_EFFECT";
//         public static GET_EQUIP: string = "GET_EQUIP";
//         public static DESTORY_DIA: string = "DESTORY_DIA";
//         public static SELECT_PIT: string = "SELECT_PIT";
//         // -----------------------------------------  仙石 -------------------------------
//
//
//         // -----------------------------------------  精灵 -------------------------------
//         public static MAGIC_WEAPON_UPDATE: string = "MAGIC_WEAPON_UPDATE";
//         public static MAGIC_WEAPON_HUANHUA_SHOWID: string = "MAGIC_WEAPON_HUANHUA_SHOWID";
//         // -----------------------------------------  精灵 -------------------------------
//
//         // -----------------------------------------  多人BOSS -------------------------------
//         // BOSS关注数组更新
//         public static MULTI_BOSS_FOLLOWS_UPDATE: string = "MULTI_BOSS_FOLLOWS_UPDATE";
//         // -----------------------------------------  多人BOSS -------------------------------
//
//         // -----------------------------------------  觉醒 -------------------------------
//         public static BORN_UPDATE: string = "BORN_UPDATE";
//         // -----------------------------------------  觉醒 -------------------------------
//
//         //-----------------------------------------大荒------------------------------
//         public static UPDATE_COPY_DAHUANG: string = "UPDATE_COPY_DAHUANG";
//         public static GET_COPY_DAHUANG: string = "GET_COPY_DAHUANG";
//
//         // ----------------------------------------- 技能系统 -------------------------------
//         //技能初始化
//         public static SKILL_INITED: string = "SKILL_INITED";
//         //技能更新
//         public static SKILL_UPDATE: string = "SKILL_UPDATE";
//         //技能界面打开
//         public static MAGIC_ART_OPEN: string = "MAGIC_ART_OPEN";
//         // ----------------------------------------- 技能系统 -------------------------------
//
//         // ----------------------------------------- 圣物系统 -------------------------------
//         //圣物信息更新
//         public static UPDATE_AMULET_INFO_REPLAY: string = "UPDATE_AMULET_INFO_REPLAY";
//         //获取圣物信息
//         public static GET_AMULET_INFO_REPLAY: string = "GET_AMULET_INFO_REPLAY";
//         //升级圣物返回
//         public static REFINE_AMULET_REPLAY: string = "REFINE_AMULET_REPLAY";
//         // ----------------------------------------- 圣物系统 -------------------------------
//
//         //----------------------------------------- 强化 -------------------------------
//         public static INTENSIVE_UPDATE: string = "INTENSIVE_UPDATE";
//         public static INTENSIVE_SUCCESS: string = "INTENSIVE_SUCCESS";
//         public static UPGRADE_SUCCESS: string = "UPGRADE_SUCCESS";
//         //----------------------------------------- 强化 -------------------------------
//         // ----------------------------------------- 合成分解 -------------------------------
//         //合成返回
//         public static COMPOSE_REPLY: string = "COMPOSE_REPLY";
//         //分解返回
//         public static RESOLVE_REPLY: string = "RESOLVE_REPLY";
//         //添加装备
//         public static ADD_EQUIP: string = "ADD_EQUIP";
//         public static UNLOAD_EQUIP: string = "UNLOAD_EQUIP";
//         // ----------------------------------------- 合成分解 -------------------------------
//
//         //----------------------------------------- 红点事件 -------------------------------
//         // 红点事件
//         public static RED_POINT: string = "RED_POINT";
//         //----------------------------------------- 红点 -------------------------------
//
//         //----------------------------------------- 历练 -------------------------------
//         public static LILIAN_UPDATA: string = "LILIAN_UPDATA";
//         public static LILIAN_UPGRADE: string = "LILIAN_UPGRADE";
//         //----------------------------------------- 历练 -------------------------------
//
//
//         //----------------------------------------- 在线礼包 -------------------------------
//         public static UPDATE_ONLINE_REWARD_REPLY: string = "UPDATE_ONLINE_REWARD_REPLY";
//         public static AWARD_REPLY: string = "AWARD_REPLY";
//         //----------------------------------------- 在线礼包 -------------------------------
//
//
//         // ---------------------------------------- 成就系统 -------------------------------
//
//         //成就更新
//         public static MAGIC_POSITION_UPDATE: string = "MAGIC_POSITION_UPDATE";
//         //成就任务更新
//         public static MAGIC_POSITION_TASK_UPDATE: string = "MAGIC_POSITION_TASK_UPDATE";
//         //成就领取奖励
//         public static MAGIC_POSITION_GET_AWARD: string = "MAGIC_POSITION_GET_AWARD";
//         // ---------------------------------------- 成就系统 -------------------------------
//
//         //----------------------------------------- 三界BOSS -------------------------------
//         // 副本更新BOSS排行记录
//         public static THREE_WORLDS_UPDATE_BOSS_RANK_RECORD: string = "THREE_WORLDS_UPDATE_BOSS_RANK_RECORD";
//         //----------------------------------------- 三界BOSS -------------------------------
//
//
//         // ---------------------------------------- 排行榜 -------------------------------
//         public static RANK_UPDATE: string = "RANK_UPDATE";
//         public static GET_ACTOR_RANK_SHOW_REPLY: string = "GET_ACTOR_RANK_SHOW_REPLY";
//         public static GET_ACTOR_RANK_DATA_REPLY: string = "GET_ACTOR_RANK_DATA_REPLY";
//
//         // ---------------------------------------- 幻武系统 -------------------------------
//         public static SHENBING_UPDATE: string = "SHENBING_UPDATE";
//         public static SBSHENGJI_UPDATE: string = "SBSHENGJI_UPDATE";
//         public static SBFUHUN_UPDATA: string = "SBFUHUN_UPDATA";
//         public static SBHUANHUA_UPDATA: string = "SBHUANHUA_UPDATA";
//         public static SBCHANGE_HUANHUA: string = "SBCHANGE_HUANHUA";
//
//         // ---------------------------------------- 幻武系统 -------------------------------
//         // ---------------------------------------- 翅膀系统 -------------------------------
//         public static WING_UPDATE: string = "WING_UPDATE";
//         public static XYSHENGJI_UPDATE: string = "XYSHENGJI_UPDATE";
//         public static XYFUHUN_UPDATA: string = "SBFUHUN_UPDATA";
//         public static XYHUANHUA_UPDATA: string = "XYHUANHUA_UPDATA";
//         public static XYCHANGE_HUANHUA: string = "XYCHANGE_HUANHUA";
//         // ---------------------------------------- 翅膀系统 -------------------------------
//
//
//         // ---------------------------------------- Boss之家系统 -------------------------------
//
//         //boss之家更新boss归属者
//         public static BOSS_HOME_OWN_UPDATE: string = "BOSS_HOME_OWN_UPDATE";
//         //boss之家玩家入屏离屏信息
//         public static BOSS_HOME_SHOW_PLAYER_INFO: string = "BOSS_HOME_SHOW_PLAYER_INFO";
//         //boss之家更新次数信息
//         public static BOSS_HOME_UPDATE_TIMES: string = "BOSS_HOME_UPDATE_TIMES";
//         //boss之家更新攻击信息
//         public static BOSS_HOME_ATTACK_UPDATE: string = "BOSS_HOME_ATTACK_UPDATE";
//         //boss之家更新玩家移动地点
//         public static BOSS_HOME_MOVE_POS_UPDATE: string = "BOSS_HOME_MOVE_POS_UPDATE";
//         // ---------------------------------------- Boss之家系统 -------------------------------
//
//         // ---------------------------------------- 探索 -------------------------------
//         //探索返回
//         public static RUN_XUNBAO_REPLY: string = "RUN_XUNBAO_REPLY";
//         public static TASK_XUNBAO_ALL_REPLY: string = "TASK_XUNBAO_ALL_REPLY";
//         public static TASK_XUNBAO_LIST_REPLY: string = "TASK_XUNBAO_LIST_REPLY";
//         public static SEVER_BROADCAST_LIST: string = "SEVER_BROADCAST_LIST";
//         public static SELF_BROADCAST_LIST: string = "SELF_BROADCAST_LIST";
//         public static TIME_LEFT: string = "TIME_LEFT";
//         public static UPDATE_XUNBAOINFO: string = "BLESSING_UPDATE";
//         public static XUNBAO_EFFECT: string = "XUNBAO_EFFECT";
//         public static XUNBAO_EXCHANGE_REPLY: string = "XUNBAO_EXCHANGE_REPLY";
//         public static XUNBAO_HINTLIST: string = "XUNBAO_HINTLIST";
//
//
//         // ---------------------------------------- 探索 -------------------------------
//
//         // ----------------------------------------- 月卡 -------------------------------
//         public static GET_MONTH_CARD_INFO_REPLY: string = "GET_MONTH_CARD_INFO_REPLY";
//         public static GET_MONTH_CARD_REWARD_REPLY: string = "GET_MONTH_CARD_REWARD_REPLY";
//         public static UPDATE_MONTH_CARD_INFO: string = "UPDATE_MONTH_CARD_INFO";
//         public static BUY_MALL_ITEM_REPLY: string = "BUY_MALL_ITEM_REPLY";
//         // ----------------------------------------- 月卡 -------------------------------
//
//
//         // ---------------------------------------- 组队副本 -------------------------------
//
//         //组队副本更新挑战次数
//         public static TEAM_BATTLE_TIMES_UPDATE: string = "TEAM_BATTLE_TIMES_UPDATE";
//         //组队副本更新最高纪录
//         public static TEAM_BATTLE_MAX_RECORD: string = "TEAM_BATTLE_MAX_RECORD";
//         //组队副本更新匹配玩家
//         public static TEAM_BATTLE_MATCH_UPDATE: string = "TEAM_BATTLE_MATCH_UPDATE";
//         //组队副本更新匹配状态
//         public static TEAM_BATTLE_MATCH_STATE_UPDATE: string = "TEAM_BATTLE_MATCH_STATE_UPDATE";
//         //组队副本更新挑战波次
//         public static TEAM_BATTLE_LEVEL_UPDATE: string = "TEAM_BATTLE_LEVEL_UPDATE";
//         // ---------------------------------------- 组队副本 -------------------------------
//
//         // ---------------------------------------- 商城 -------------------------------
//         //购买返回
//         public static PURCHASE_REPLY: string = "PURCHASE_REPLY";
//         public static GET_MALLINFO: string = "GET_MALLINFO";
//         public static UPDATE_MALLINFO: string = "UPDATE_MALLINFO";
//         // ---------------------------------------- 商城 -------------------------------
//
//         // ---------------------------------------- VIP -------------------------------
//         //VIP更新信息
//         public static VIP_UPDATE: string = "VIP_UPDATE";
//         //VIP成功获取奖励
//         public static VIP_GET_REWARD: string = "VIP_GET_REWARD";
//         //特权信息更新
//         public static UPDATE_PRIVILEGE: string = "UPDATE_PRIVILEGE";
//         // ---------------------------------------- VIP -------------------------------
//         // ---------------------------------------- 首充 -------------------------------
//         public static FIRST_PAY_UPDATE: string = "FIRST_PAY_UPDATE";
//         // ---------------------------------------- 首充 -------------------------------
//         // ---------------------------------------- 充值系统 -------------------------------
//         public static GET_RECHARGE_INFO_REPLY: string = "GET_RECHARGE_INFO_REPLY";
//         public static UPDATE_RECHARGE_INFO: string = "UPDATE_RECHARGE_INFO";
//         // ---------------------------------------- 充值系统 -------------------------------
//
//         // ---------------------------------------- Buff -------------------------------
//         public static UPDATE_BUFF_LIST: string = "UPDATE_BUFF_LIST";
//         public static BUFF_NUMBER: string = "BUFF_NUMBER";
//         // ---------------------------------------- Buff -------------------------------
//
//         //-----------------------------------------扫荡挂机------------------------------
//         public static SWEEPING_UPDATE: string = "SWEEPING_UPDATE";
//         //-----------------------------------------扫荡挂机------------------------------
//
//         //-----------------------------------------每日降妖------------------------------
//         public static DAILY_DEMON_UPDATE: string = "DAILY_DEMON_UPDATE";
//         //-----------------------------------------每日降妖------------------------------
//
//         //-----------------------------------------未央幻境------------------------------
//         public static RUNE_COPY_UPDATE: string = "RUNE_COPY_UPDATE";
//         public static DIAL_UPDATE: string = "DIAL_UPDATE";
//         public static DIAL_RESULT_UPDATE: string = "DIAL_RESULT_UPDATE";
//         //-----------------------------------------未央幻境------------------------------
//
//         //-----------------------------------------玉荣系统------------------------------
//         public static RUNE_UPDATE: string = "RUNE_UPDATE";
//         public static RUNE_INALY_SUCCEED: string = "RUNE_INALY_SUCCEED";  //镶嵌成功
//         public static RUNE_INALY_SELECT: string = "RUNE_INALY_SELECT";  //切换选中
//         public static RUNE_RESOLVE_SUCCEED: string = "RUNE_RESOLVE_SUCCEED";  //切换选中
//         //-----------------------------------------玉荣系统------------------------------
//
//         //----------------------------------------- 九天之巅 ------------------------------
//         // 九天之巅排行榜更新
//         public static NINE_RANKS_UPDATE: string = "NINE_RANKS_UPDATE";
//         // 九天之巅个人信息更新
//         public static NINE_COPY_INFO_UPDATE: string = "NINE_COPY_INFO_UPDATE";
//         // 搜索对象更新
//         public static NINE_SEARCH_OBJ_UPDATE: string = "NINE_SEARCH_OBJ_UPDATE";
//         // 更新采集对象
//         public static NINE_GATHER_OBJ_UPDATE: string = "NINE_GATHER_OBJ_UPDATE";
//         // 更新积分
//         public static NINE_SCORE_UPDATE: string = "NINE_SCORE_UPDATE";
//         // 击败信息更新
//         public static NINE_DEFEAT_UPDATE: string = "NINE_DEFEAT_UPDATE";
//         //----------------------------------------- 九天之巅 ------------------------------
//
//         //-----------------------------------------日充豪礼------------------------------
//         public static DAY_PAY_UPDATE: string = "DAY_PAY_UPDATE";
//         //-----------------------------------------日充豪礼------------------------------
//
//         //-----------------------------------------累充豪礼------------------------------
//         public static CUMULATE_PAY_UPDATE: string = "CUMULATE_PAY_UPDATE";
//         //-----------------------------------------累充豪礼------------------------------
//
//         //-----------------------------------------连充豪礼------------------------------
//         public static CONTINUE_PAY_UPDATE: string = "CONTINUE_PAY_UPDATE";
//         //-----------------------------------------连充豪礼------------------------------
//
//
//         //-----------------------------------------聊天------------------------------
//         public static CHAT_UPDATE: string = "CHAT_UPDATE";
//         public static CHAT_BLACK_LIST_UPDATE: string = "CHAT_BLACK_LIST_UPDATE";
//         public static CHECKED_FACE: string = "CHECKED_FACE";
//         public static SELECT_CHAT_CHANNEL: string = "SELECT_CHAT_CHANNEL";
//         public static OTHER_PLAYER_INFO: string = "OTHER_PLAYER_INFO";
//         public static SEND_RESULT: string = "SEND_RESULT";
//         //-----------------------------------------聊天------------------------------
//
//         //-----------------------------------------零元购------------------------------
//         public static ZERO_BUY_UPDATE: string = "ZERO_BUY_UPDATE";
//         //-----------------------------------------零元购------------------------------
//
//         //-----------------------------------------消费赠礼------------------------------
//         public static CONSUME_REWARD_UPDATE: string = "CONSUME_REWARD_UPDATE";
//         //-----------------------------------------消费赠礼------------------------------
//         //-----------------------------------------投资返利------------------------------
//         public static INVEST_REWARD_UPDATE: string = "INVEST_REWARD_UPDATE";
//         //-----------------------------------------投资返利------------------------------
//
//         //-----------------------------------------仙府-家园------------------------------
//         public static XIANFU_SHENGJI_UPDATE: string = "XIANFU_SHENGJI_UPDATE";
//         public static XIANFU_BUILD_UPDATE: string = "XIANFU_BUILD_UPDATE";
//         public static SELECT_XIANFU_AREA: string = "SELECT_XIANFU_AREA";
//         public static HAND_BOOK_UPDATE: string = "HAND_BOOK_UPDATE";
//         public static XIANFU_TASK_UPDATE: string = "XIANFU_TASK_UPDATE";
//         public static XIANFU_EVENT_UPDATE: string = "XIANFU_EVENT_UPDATE";
//         public static XIANFU_WIND_WATER_UPTATE: string = "XIANFU_WIND_WATER_UPTATE";
//         public static XIANFU_AREA_UPTATE: string = "XIANFU_AREA_UPTATE";
//         public static XIANFU_ALL_RP_EVENT: string = "XIANFU_ALL_RP_EVENT";
//         //-----------------------------------------仙府-家园------------------------------
//
//         //-----------------------------------------宠物法阵------------------------------
//         public static FZHUANHUA_UPDATA: string = "FZHUANHUA_UPDATA";
//         public static FZCHANGE_HUANHUA: string = "FZCHANGE_HUANHUA";
//         //-----------------------------------------宠物法阵------------------------------
//
//         //-----------------------------------------精灵法阵------------------------------
//         public static WEAPONFZHUANHUA_UPDATA: string = "WEAPONFZHUANHUA_UPDATA";
//         public static WEAPONFZCHANGE_HUANHUA: string = "WEAPONFZCHANGE_HUANHUA";
//         //-----------------------------------------精灵法阵------------------------------
//
//         //-----------------------------------------开服冲榜下------------------------------
//         public static SPRINT_RANK_TASK_UPDATE: string = "SPRINT_RANK_TASK_UPDATE";
//         //-----------------------------------------开服冲榜下------------------------------
//
//         //-----------------------------------------开服冲榜上------------------------------
//         public static SPRINT_RANK_UPDATE: string = "SPRINT_RANK_UPDATE";
//         //-----------------------------------------开服冲榜上------------------------------
//
//         //-----------------------------------------  天梯  ------------------------------
//         // 更新天梯积分
//         public static LADDER_SCORE_UPDATE: string = "LADDER_SCORE_UPDATE";
//         // 更新天梯参与奖励状态
//         public static LADDER_JOIN_AWARD_UPDATE: string = "LADDER_JOIN_AWARD_UPDATE";
//         // 更新天梯功勋奖励状态
//         public static LADDER_FEAT_AWARD_UPDATE: string = "LADDER_FEAT_AWARD_UPDATE";
//         // 更新次数
//         public static LADDER_TIMES_UPDATE: string = "LADDER_TIMES_UPDATE";
//         // 更新天梯信息
//         public static LADDER_INFO_UPDATE: string = "LADDER_INFO_UPDATE";
//         // 更新天梯排行
//         public static LADDER_RANKS_UPDATE: string = "LADDER_RANKS_UPDATE";
//         // 更新天梯自动匹配
//         public static LADDER_AUTO_MATCH_UPDATE: string = "LADDER_AUTO_MATCH_UPDATE";
//         //-----------------------------------------  天梯  ------------------------------
//
//         //-----------------------------------------活动列表刷新界面------------------------------
//         public static UPDATE_ACTIVITY_STATE: string = "UPDATE_ACTIVITY_STATE";
//         //-----------------------------------------活动列表刷新界面------------------------------
//
//         //-----------------------------------------充值转盘刷新界面------------------------------
//         public static PAYREWARD_UPDATE: string = "PAYREWARD_UPDATE";
//         public static PAYREWARD_RUNREPLY: string = "PAYREWARD_RUNREPLY";
//         public static PAY_REWARD_EFFECT: string = "PAY_REWARD_EFFECT";
//         public static PAYREWARD_OPENRECORD: string = "PAYREWARD_OPENRECORD";
//         public static PAYREWARD_BROADCAST_LIST: string = "PAYREWARD_BROADCAST_LIST";
//         //-----------------------------------------充值转盘刷新界面------------------------------
//
//         //-----------------------------------------古神问道------------------------------
//         public static GUSHEN: string = "GUSHEN";
//         //-----------------------------------------古神问道------------------------------
//
//         //-----------------------------------------  活动预告  ------------------------------
//         public static ACTIVITY_PRE_SCENE_UPDATE: string = "ACTIVITY_PRE_SCENE_UPDATE";
//         //-----------------------------------------  活动预告  ------------------------------
//
//         //-----------------------------------------  天降财宝  ------------------------------
//         public static DAY_DROP_TREASURE_GATHERCOUNT_UPDATE: string = "DAY_DROP_TREASURE_GATHERCOUNT_UPDATE";
//         public static DAY_DROP_TREASURE_UADATETIME_UPDATE: string = "DAY_DROP_TREASURE_UADATETIME_UPDATE";
//         public static DAY_DROP_TREASURE_CAIJILOSE: string = "DAY_DROP_TREASURE_CAIJILOSE";
//         //-----------------------------------------  天降财宝  ------------------------------
//
//         //-----------------------------------------全民狂欢------------------------------
//         public static KUANGHUAN: string = "KUANGHUAN";
//         //-----------------------------------------全民狂欢------------------------------
//
//         //-----------------------------------------  昆仑瑶池  ------------------------------
//         public static KUNLUN_REWARD_EFFECT: string = "KUNLUN_REWARD_EFFECT";
//         public static KUNLUN_UPDATE: string = "KUNLUN_UPDATE";
//         public static KUNLUN_ZHUAN: string = "KUNLUN_ZHUAN";
//         public static KUNLUN_SHOWSOAP: string = "KUNLUN_SHOWSOAP";
//         public static KUNLUN_GETDROPRECORD: string = "KUNLUN_GETDROPRECORD";
//         public static KUNLUN_SHOUYI: string = "KUNLUN_SHOUYI";
//         public static KUNLUN_BAG_ADD_ITEM: string = "KUNLUN_BAG_ADD_ITEM";
//         public static KUNLUN_STATE_UPDATE: string = "KUNLUN_STATE_UPDATE";
//         //-----------------------------------------每日累充------------------------------
//         public static CUMULATE_PAY2_UPDATE: string = "CUMULATE_PAY_UPDATE";
//
//         //-----------------------------------------每日累充------------------------------
//
//
//         //-----------------------------------------云梦秘境------------------------------
//         public static YUNMENGMIJING_UPDATE: string = "YUNMENGMIJING_UPDATE";
//         //-----------------------------------------云梦秘境------------------------------
//
//         //-----------------------------------------特惠礼包------------------------------
//         public static DISCOUNT_GIFT_UPDATE: string = "DISCOUNT_GIFT_UPDATE";
//         public static DISCOUNT_GIFT_TIMER: string = "DISCOUNT_GIFT_TIMER";
//         //-----------------------------------------特惠礼包------------------------------
//
//         //-----------------------------------------仙女护送------------------------------
//         public static FAIRY_UPDATE: string = "FAIRY_UPDATE";
//         public static FAIRY_LOG_UPDATE: string = "FAIRY_LOG_UPDATE";
//         public static CURR_LOOK_PLAYER_UPDATE: string = "CURR_LOOK_PLAYER_UPDATE";
//         //-----------------------------------------累计消费 每日------------------------------
//         public static DAY_CONSUME_REWARD_UPDATE: string = "DAY_CONSUME_REWARD_UPDATE";
//
//         //-----------------------------------------  奇遇  ------------------------------
//         // 更新正在进行中的事件列表
//         public static ADVENTURE_EVENT_LIST_UPDATE: string = "ADVENTURE_EVENT_LIST_UPDATE";
//         // 更新下一次事件触发时间戳
//         public static ADVENTURE_NEXT_TRIGGER_TIME_UPDATE: string = "ADVENTURE_NEXT_TRIGGER_TIME_UPDATE";
//         // 更新探险次数
//         public static ADVENTURE_YUNLI_UPDATE: string = "ADVENTURE_YUNLI_UPDATE";
//         // 更新奇遇点
//         public static ADVENTURE_POINT_UPDATE: string = "ADVENTURE_POINT_UPDATE";
//         // 更新兑换提醒列表
//         public static ADVENTURE_HINT_LIST_UPDATE: string = "ADVENTURE_HINT_LIST_UPDATE";
//         // 更新单个奇遇事件
//         public static ADVENTURE_EVENT_UPDATE: string = "ADVENTURE_EVENT_UPDATE";
//         // 奇遇掉落更新
//         public static ADVENTURE_DROP_ITEMS_UPDATE: string = "ADVENTURE_DROP_ITEMS_UPDATE";
//         // 奇遇是否有新事件更新
//         public static ADVENTURE_HAS_NEW_EVENT_UPDATE: string = "ADVENTURE_HAS_NEW_EVENT_UPDATE";
//         //-----------------------------------------  奇遇  ------------------------------
//
//         //-----------------------------------------  新手引导  ------------------------------
//         // 初始化剩余的新手引导
//         public static GUIDE_REST_INITED: string = "GUIDE_REST_INITED";
//         // 完成一个引导
//         public static GUIDE_COMPLETE: string = "GUIDE_COMPLETE";
//         // 注册一个UI
//         public static GUIDE_REGISTE_UI: string = "GUIDE_REGISTE_UI";
//         // 删除一个UI
//         public static GUIDE_REMOVE_UI: string = "GUIDE_REMOVE_UI";
//         // 点击目标
//         public static GUIDE_CLICK_TARGET: string = "GUIDE_CLICK_TARGET";
//         // 倒计时结束
//         public static GUIDE_CD_COMPLETE: string = "GUIDE_CD_COMPLETE";
//         // 更新当前引导
//         public static GUIDE_CUR_UPDATE: string = "GUIDE_CUR_UPDATE";
//         //-----------------------------------------  界面变强提示 ------------------------------
//         public static TIPBIANQIANG_UPDATE: string = "TIPBIANQIANG_UPDATE";
//
//         constructor() {
//
//         }
//     }
// }