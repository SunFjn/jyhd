declare namespace ui {
    import EventDispatcher = Laya.EventDispatcher;
    import HeapElement = utils.collections.HeapElement;

    const enum WindowEnum {
        GM_MAP_VIEW = 600,               // GM 地图编辑器
        GM_MAP_ALERT = 601,              // GM 地图编辑器 弹窗
        GM_DEBUG_VIEW = 602,              // GM 功能调试

        // 主界面
        MAIN_PANEL = 0,
        // 主界面顶部面板
        TOP_PANEL = 1,
        // 主界面底部面板
        BOTTOM_PANEL = 2,
        // 主界面左上面板
        LEFT_TOP_PANEL = 3,
        // 主界面左下面板
        LEFT_BOTTOM_PANEL = 4,
        // 主界面右上面板
        RIGHT_TOP_PANEL = 5,
        // 主界面右下面板
        RIGHT_BOTTOM_PANEL = 6,
        // 角色面板
        PLAYER_PANEL = 7,
        // 创角面板
        CREATE_ROLE_PANEL = 8,
        // 背包面板
        BAG_PANEL = 9,
        // 宠物喂养面板
        MAGIC_PET_FEED_PANEL = 10,
        // 精灵幻化面板
        WEAPON_ILLUSION_PANEL = 11,
        // 通用文本框
        COMMON_TXT_ALERT = 12,
        // 获得道具弹框
        GOT_ITEM_ALERT = 13,
        // 背包道具使用弹框
        PROP_USE_ALERT = 15,
        //道具弹框
        PROP_ALERT = 16,
        // 装备穿戴弹框
        EQUIP_WEAR_ALERT = 17,
        // 背包装备弹框
        BAG_EQUIP_ALERT = 18,
        //未生成极品属性弹框
        /// NOT_GENERATED_ALERT,
        // 天关
        MISSION_PANEL = 19,
        // 邮件
        EMAIL_PANEL = 20,
        // 邮件详细面板
        EMAIL_DETAIL_PANEL = 21,
        // 结算胜利面板
        WIN_PANEL = 22,
        // 结算失败面板
        LOSE_PANEL = 23,
        // 宠物培养技能弹框
        MAGIC_PET_FEED_SKILL_ALERT = 24,
        // 宠物进阶技能弹框
        MAGIC_PET_UPGRADE_SKILL_ALERT = 25,
        // 总属性弹框
        ATTR_ALERT = 26,
        // 精灵喂养面板
        MAGIC_WEAPON_FEED_PANEL = 27,
        // 副本左下面板
        DUNGEON_LB_PANEL = 28,
        //福利面板
        WELFARE_PANEL = 29,
        //签到面板
        SIGN_PANEL = 30,
        //在线礼包
        ONLINE_PANEL = 31,
        //累计签到弹框
        SIGN_ADDITEM_PANEL = 32,
        //单人BOSS面板
        SINGLE_BOSS_PANEL = 33,
        //七日礼面板
        SEVEN_DAY_GIFT_PANEL = 34,
        //金身面板
        GOLD_BODY_PANEL = 35,
        //金身弹窗
        GOLD_BODY_UNDEATEN_ALERT = 36,
        //仙石面板
        STONE_PANEL = 37,
        //大荒
        BIG_TOWER = 38,
        //仙石大师弹框
        STONE_MASTER_DIALOG = 39,
        // 多人BOSS
        MULTI_BOSS_PANEL = 40,
        //觉醒面板
        BORN_PANEL = 41,
        //觉醒弹窗
        BORN_ALERT = 42,
        //熔炼面板
        // SMELTING_PANEL,
        //技能面板
        MAGIC_ART_PANEL = 43,
        //技能技能激活弹窗
        MAGIC_ART_GET_PANEL = 44,
        //血条面板
        HEALTH_POINT_PANEL = 45,
        //圣物面板
        TALISMAN_PANEL = 46,
        //圣物弹窗
        TALISMAN_DIALOG = 47,
        // 副本右下面板
        DUNGEON_RB_PANEL = 48,
        // MVP奖励弹框
        MVP_AWARD_ALERT = 49,
        // 最后一击弹框
        LAST_HIT_AWARD_ALERT = 50,
        // 鼓舞弹框
        INSPIRE_ALERT = 51,
        // 复活弹框
        REVIVE_ALERT = 52,
        //获取圣物弹窗
        TALISMAN_GET_ALERT = 53,
        //升级圣物弹窗
        TALISMAN_UP_ALERT = 54,
        //装备强化界面
        INTENSIVE_PANEL = 56,
        // 日常副本
        DAILY_DUNGEON_PANEL = 57,
        // 副本难度弹框
        DUNGEON_DEGREE_ALERT = 58,
        // VIP购买次数弹框
        VIP_TIMES_ALERT = 59,
        // 哥布林王国胜利结算弹框
        COIN_WIN_PANEL = 60,
        // 宠物副本胜利结算弹框
        PET_WIN_PANEL = 61,
        // 哥布林王国右下面板
        COIN_RB_PANEL = 62,
        // 宠物副本右下面板
        PET_RB_PANEL = 63,
        // 结束倒计时面板
        END_TIME_PANEL = 64,
        // 宠物副本左上面板
        PET_LT_PANEL = 65,
        //合成成功
        COMPOSE_SUCCESS_ALERT = 67,
        //装备合成弹框
        COMPOSE_EQUIP_ALERT = 68,
        //仙石合成弹框
        COMPOSE_STONE_ALERT = 69,
        //分解面板
        DECOMPOSE_ALERT = 70,
        DECOMPOSE_SUCCESS_ALERT = 71,
        //历练面板
        EXERCISE_PANEL = 72,
        //历练奖励弹框
        EXERCISE_ALERT = 73,
        // 副本进入特效
        DUNGEON_ENTER_EFFECT = 74,
        // 三界BOSS面板
        THREE_WORLDS_PANEL = 75,
        // 熔炼成功弹窗
        SMELT_SUCCESS_ALERT = 76,
        // 单项鼓舞弹窗
        SINGLE_INSPIRE_ALERT = 77,
        //仙位面板
        MAGIC_POSITION_PANEL = 78,
        //仙位升级弹窗
        MAGIC_POSITION_ALTER = 79,
        //boss之家面板
        BOSS_HOME_PANEL = 80,
        //珍宝开启弹窗
        BOX_OPEN_ALERT = 81,
        //离开场景倒计时弹窗
        LEAVE_SCENCE_ALERT = 82,
        //神兵升级面板
        IMMORTAL_SHENGJI_PANEL = 83,
        //神兵升级弹框
        IMMORTALS_UPGRADE_ALERT = 84,
        //未生成装备弹框
        NOT_GENERATED_ALERT = 85,
        //战力提升面板
        WAR_DISPLAY_PANEL = 86,
        //排行榜面板
        RANKING_LIST_PANEL = 87,
        // 三界BOSS伤害排行榜
        THREE_WORLDS_RANK_PANEL = 88,
        // 三界BOSS右下面板
        THREE_WORLDS_RB_PANEL = 89,
        //角色属性弹框
        PLAYER_ATTR_ALERT = 90,
        //仙翼升级面板
        WING_SHENGJI_PANEL = 91,
        //幻化激活弹框
        HUANHUAACT_ALERT = 92,
        //装备探索面板
        TREASURE_PANEL = 93,
        TREASURE_ALERT = 94,
        TREASURE_GET_ALERT = 95,
        //离线经验弹框
        OFFLINE_PROFIT_ALERT = 96,
        //组队副本面板
        TEAM_BATTLE_PANEL = 97,
        //组队副本匹配弹窗
        TEAM_BATTLE_MATCH_ALERT = 98,
        //组队副本奖励面板
        TEAM_BATTLE_AWARD_PANEL = 99,
        //月卡面板
        MONTH_CARD_PANEL = 100,
        //周卡面板
        WEEK_CARD_PANEL = 555,
        //仙玉周卡面板
        WEEK_XIANYU_PANEL = 556,
        //代币券周卡面板
        WEEK_YUANBAO_PANEL = 557,
        //主角光环
        HERO_AURA_PANEL = 558,
        //商城/商店面板
        STORE_ALERT = 103,
        //vip面板
        VIP_PANEL = 104,
        //vip弹窗
        VIP_ALERT = 105,
        //道具不足弹框
        LACK_PROP_ALERT = 106,
        //组队副本倒计时面板
        TEAM_BATTLE_TOP_PANEL = 107,
        // 熔炼面板
        SMELT_PANEL = 108,
        //兑换
        TREASURE_CHANGE = 109,
        //获得奖励弹窗
        BOX_AWARD_ALERT = 110,
        //充值系统面板
        RECHARGE_PANEL = 111,
        //Buff弹框
        BUFF_ALERT = 112,
        //圣物探索
        TREASURE_TALISMAN_PANEL = 113,
        TREASURE_BAG_PANEL = 114,
        //巅峰探索
        TREASURE_DIANFENG_PANEL = 115,
        //至尊探索
        TREASURE_ZHIZUN_PANEL = 116,
        //组队副本排行弹框
        TEAM_BATTLE_RANK_ALERT = 117,
        //首冲面板
        FIRST_PAY_PANEL = 118,
        //大荒层数面板
        BIG_TOWER_LEVEL_PANLE = 119,
        //神兵幻化面板
        IMMORTAL_HUANHUA_PANEL = 120,
        //神兵附魂面板
        IMMORTAL_FUHUN_PANEL = 121,
        //仙翼幻化面板
        WING_HUANHUA_PANEL = 122,
        //仙翼附魂面板
        WING_FUHUN_PANEL = 123,
        // 宠物进阶面板
        MAGIC_PET_RANK_PANEL = 124,
        // 宠物修炼面板
        MAGIC_PET_REFINE_PANEL = 125,
        // 精灵进阶面板
        MAGIC_WEAPON_RANK_PANEL = 126,
        // 精灵修炼面板
        MAGIC_WEAPON_REFINE_PANEL = 127,
        //限购商城面板
        LIMIT_STORE_PANEL = 128,
        //常用商城面板
        USUAL_STORE_PANEL = 129,
        //代币券商城面板【现在展示的是SVIP专属】
        GOLD_STORE_PANEL = 130,
        //vip商城面板【暂时没用到】
        VIP_STORE_PANEL = 131,
        //boss商城面板
        BOSS_STORE_PANEL = 132,
        //挂机扫荡
        LINE_CLEAR_OUT_ALERT = 133,
        //每日炼妖
        DAILY_DEMON_PANEL = 134,
        //玉荣镶嵌面板
        RUNE_INLAY_PANEL = 135,
        //玉荣总览弹框
        RUNE_ALL_ALERT = 136,
        //玉荣仓库弹框
        RUNE_BAG_ALERT = 137,
        // N选一礼包弹框
        MANUAL_GIFT_ALERT = 138,
        //远古符阵副本面板
        RUNE_COPY_PANEL = 139,
        //远古转盘弹框
        DIAL_ALERT = 140,
        //玉荣分解弹框
        RUNE_RESOLVE_ALERT = 141,
        // 天关遮罩面板
        MISSION_MASK_PANEL = 142,
        // 天关排行弹框
        MISSION_RANK_ALERT = 143,
        //累充面板
        CUMULATE_PAY_UPDATE = 144,
        //日充弹窗
        DAY_PAY_PANEL = 145,
        //聊天快捷提示短语面板
        CHAT_MARKED_WORDS_PANEL = 146,
        //九州聊天面板
        CHAT_JIUZHOU_PANEL = 147,
        //玉荣提示分解弹框
        RUNE_HINT_RESOLVE_ALERT = 148,
        //表情面板
        CHAT_FACE_PANEL = 149,
        //本服聊天面板
        CHAT_BENFU_PANEL = 150,
        //系统聊天面板
        CHAT_SYSTEM_PANEL = 151,
        //聊天黑名单
        CHAT_BLACK_LIST_PANEL = 152,
        //提示加入黑名单弹框
        JOIN_BLACK_LIST_HINT_ALERT = 153,
        //聊天查看其他玩家信息弹框
        OTHER_PLAYER_INFO_ALERT = 154,
        //消费赠礼面板
        CONSUME_REWARD_PANEL = 155,
        //连充面板
        CONTINUE_PAY_PANEL = 156,
        //零元购
        ZEROBUY_PANEL = 157,
        // 九天之巅面板
        NINE_PANEL = 158,
        // 九天之巅登顶奖励弹框
        NINE_TOP_AWARD_ALERT = 159,
        // 图片标题文本弹框
        IMG_TITLE_ALERT = 160,
        // 九天之巅副本中右下面板
        NINE_RB_PANEL = 161,
        // 九天之巅副本中击杀信息面板
        NINE_DEFEAT_PANEL = 162,
        // 九天之巅结算弹框
        NINE_RESULT_ALERT = 163,
        // 九天之巅被杀复活弹框
        NINE_KILLED_ALERT = 164,
        // 活动预告面板
        ACTIVITY_PRE_PANEL = 165,
        // 采集面板
        GATHER_PANEL = 166,
        // 九天之巅进入副本提示面板
        NINE_ENTER_TIP_PANEL = 167,
        // 宠物幻化面板
        PET_ILLUSION_PANEL = 168,
        //宠物法阵面板
        MAGIC_PET_FAZHEN_PANEL = 169,
        //仙府-家园升级面板
        XIANFU_SHENGJI_PANEL = 170,
        //仙府-家园左下面板
        XIANFU_LEFT_BOTTOM_PANEL = 171,
        //仙府-家园底部面板
        XIANFU_BOTTOM_PANEL = 172,
        //仙府-家园右下面板
        XIANFU_RIGHT_BOTTOM_PANEL = 173,
        //登录返利
        INVEST_LOGIN_PANEL = 174,
        //闯关返利
        INVEST_RECRUIT_PANEL = 175,
        //成长返利
        INVEST_GROWTH_PANEL = 176,
        //聚灵厅领取弹框
        JULING_ACCOUNT_ALERT = 177,
        //仙府-家园熔炼弹框
        XIANFU_SMELT_ALERT = 178,
        //精灵法阵面板
        MAGIC_WEAPON_FAZHEN_PANEL = 179,
        //开服冲榜精灵榜
        SPRINT_RANKTASK_XIANQI_PANEL = 180,
        //开服冲榜宠物榜
        SPRINT_RANKTASK_LINGCHONG_PANEL = 181,
        //开服冲榜神兵榜
        SPRINT_RANKTASK_SHENBING_PANEL = 182,
        //开服冲榜仙翼榜
        SPRINT_RANKTASK_XIANYI_PANEL = 183,
        //开服冲榜圣物榜
        SPRINT_RANKTASK_FABAO_PANEL = 184,
        //开服冲榜装备榜
        SPRINT_RANKTASK_EQUIPMENT_PANEL = 185,
        //开服冲榜战力榜
        SPRINT_RANKTASK_FIGHTING_PANEL = 186,
        //仙府-家园产出中面板
        XIANFU_SMELTING_ALERT = 187,
        // 仙府-家园宠物购买道具弹框
        XIANFU_PET_BUY_PROP_ALERT = 189,
        //仙府-家园宠物准备游历弹框
        XIANFU_PET_READY_GO_ALERT = 190,
        //开服冲榜榜单弹窗
        SPRINT_RANK_TASK_ALERT = 191,
        //仙府-家园游历中弹框
        XIANFU_PET_TRAVELING_ALERT = 192,
        //仙府-家园立即结束游历弹框
        XIANFU_PET_AT_ONCE_END_ALERT = 193,
        //活动列表
        ACTIVITY_ALL_PANEL = 194,
        //充值转盘
        PAY_REWARD_PANEL = 195,
        //充值转盘获取奖励弹窗
        PAYREWARD_ALERT = 196,
        //充值转盘 财气值奖励
        PAYREWARDRANK_ALERT = 197,
        //我的记录
        PAYREWARDMYRECORD_ALERT = 198,
        //仙府-家园蓝属性图鉴面板
        XIANFU_HAND_BOOK_BLUE_PANEL = 199,
        //仙府-家园紫属性图鉴面板
        XIANFU_HAND_BOOK_VIOLET_PANEL = 200,
        //仙府-家园橙属性图鉴面板
        XIANFU_HAND_BOOK_ORANGE_PANEL = 201,
        //仙府-家园红属性图鉴面板
        XIANFU_HAND_BOOK_RED_PANEL = 202,
        // 天梯面板
        LADDER_PANEL = 203,
        // 天梯每日荣誉奖励弹框
        HONOR_AWARD_ALERT = 204,
        // 天梯段位、排行奖励弹框
        LADDER_GRADE_AWARD_ALERT = 205,
        // 天梯排行弹框
        LADDER_RANK_ALERT = 206,
        // 天梯匹配弹框
        LADDER_MATCH_ALERT = 207,
        //仙府-家园总览面板
        XIANFU_PANDECT_PANEL = 208,
        //仙府-家园任务面板
        XIANFU_TASK_PANEL = 209,
        //古神问道面板
        GUSHEN_PANEL = 210,
        //仙府-家园风水面板
        XIANFU_WIND_WATER_PANEL = 211,
        // 通用道具弹框
        COMMON_ITEMS_ALERT = 212,
        // 天梯结算失败面板
        LADDER_LOSE_ALERT = 213,
        //天降圣物开始提示
        DAYDROP_TREASURE_TIP_PANLE = 214,
        //天降圣物采集面板
        DAYDROP_TREASURE_BOTTOM_PANLE = 215,
        //天降圣物右边提示面板
        DAYDROP_TREASURE_RIGHT_PANLE = 216,
        //天降圣物奖励预览弹框
        DAYDROP_TREASURE_REWARD_ALERT = 217,
        //天降圣物结算弹框
        DAYDROP_TREASURE_RESULT_ALERT = 218,
        //昆仑捡肥皂界面
        KUNLUN_GAME_PANLE = 219,
        //昆仑 BUFF 界面
        KUNLUN_BUFF_PANLE = 220,
        //昆仑 金币/经验 获取界面
        KUNLUN_GAIN_PANLE = 221,
        //云梦秘境BOSS列表界面
        YUNMENGMIJING_BOSS_PANLE = 222,
        //云梦秘境 右边显示面板
        YUNMENGMIJING_INFORMATIOM_PANLE = 223,
        //云梦秘境入口面板
        YUNMENGMIJING_PANLE = 224,
        //云梦秘境 结算弹框
        YUNMENGMIJING_RESULT_ALERT = 225,
        //云梦秘境 获得奖励弹框
        YUNMENGMIJING_REWARD_ALERT = 226,
        //护送仙女面板
        FAIRY_PANEL = 227,
        //护送仙女信息弹框
        FAIRY_SEND_ALERT = 228,
        //护送仙女选择弹框
        FAIRY_CHOOSE_ALERT = 229,
        //全民狂欢界面
        KUANGHUAN_PANLE = 230,
        //全民狂欢等级狂欢
        KUANGHUAN_LEVEL_PANLE = 231,
        //每日累充
        CUMULATE_PAY2_UPDATE = 232,
        //仙女护送日志面板
        FAIRY_LOG_ALERT = 234,
        //荣誉值商店
        HONOR_STORE_PANEL = 235,
        //查看别人装备弹框
        OTHER_EQUIP_ALERT = 236,
        //昆仑瑶池结算弹框
        KUNLUN_RESULT_ALERT = 237,
        //昆仑瑶池BUFF说明弹框
        KUNLUN_TIP_ALERT = 238,
        //昆仑瑶池奖励预览界面
        KUNLUN_REWARD_ALERT = 239,
        //仙女被拦截失败提示面板
        FAIRY_HOLD_SUCCEED_ALERT = 240,
        //消费赠礼 每日
        DAY_CONSUME_REWARD_PANEL = 241,
        //特惠礼包
        DISCOUNT_GIFT_PANEL = 242,
        //仙府-家园上方面板
        XIANFU_TOP_PANEL = 243,
        // 登录页
        LOGIN_PANEL = 244,
        // 登录页提示
        LOGIN_TIPS_ALERT = 2440,
        // 登录页公告
        LOGIN_NOTICE_ALERT = 2441,
        // 选服页
        SELECT_SERVER_PANEL = 245,
        // 奇遇面板
        ADVENTURE_PANEL = 246,
        // 奇遇猜拳弹框
        FINGER_GUESS_ALERT = 247,
        // 引导面板
        GUIDE_PANEL = 248,
        // 奇遇商店面板
        ADVENTURE_SHOP_PANEL = 249,
        // 奇遇探索副本中掉落道具统计面板
        ADVENTURE_MONSTER_PANEL = 250,
        //仙府-家园风水属性弹框
        XIANFU_FENGSHUI_ATT_ALERT = 251,
        //通用激活弹框
        COMMON_ACTIVE_ALERT = 252,
        //云梦秘境击杀 胜利弹窗
        YUNMENGMIJING_WIN_ALERT = 253,
        //云梦秘境击杀 最后一击弹窗
        YUNMENGMIJING_AWARD_ALERT = 254,
        //功能预览 弹窗
        ACTION_PREVIEW_ALERT = 255,
        //功能预览 入口
        ACTION_PREVIEW_PANEL = 256,
        //新功能开启弹窗
        ACTION_PREVIEW_NEW_ALERT = 257,
        //包含第一名的胜利结算面板
        FIRST_WIN_PANEL = 258,
        //装备合成无装备获取弹框
        COMPOSE_EQUIP_GET_ALERT = 259,
        //熔炼升级 弹窗
        SMELT_UPGRADE_ALERT = 260,
        //在线礼包入口
        ONLINE_ENTER_PANEL = 261,
        //加入仙盟面板
        FACTION_JOIN_PANEL = 262,
        //仙盟面板
        FACTION_PANEL = 263,
        //角色 称号
        PLAYER_TITLE_PANEL = 264,
        //确认创建仙盟弹框
        FACTION_CREATE_ALERT = 265,
        //仙盟申请加入列表弹框
        FACTION_ASK_ALERT = 266,
        //设置加入仙盟战力限制弹框
        FACTION_JOIN_LIMIT_SET_ALERT = 267,
        //仙盟成员列表面板
        FACTION_MEMBER_PANEL = 268,
        //仙盟福利面板
        FACTION_WEAL_PANEL = 269,
        //仙盟成员操作弹框
        FACTION_MEMBER_OPERA_ALERT = 270,
        //仙盟职位权限展示弹框
        FACTION_POST_LIMITS_ALERT = 271,
        //仙盟管理选项面板
        FACTION_MANAGE_PANEL = 272,
        //vip每日奖励弹窗
        VIP_MEIRI_AWARD_ALERT = 273,
        //通用输入弹框
        SET_INPUT_WORD_ALERT = 274,
        //仙盟自动邀请通知弹框
        FACTION_AUTO_INVITE_PANEL = 275,
        //仙盟聊天面板
        CHAT_FACTION_PANEL = 276,
        //宝藏列表
        BAOZANG_LIST_PANEL = 277,
        //我的宝藏
        BAOZANG_MINE_PANEL = 278,
        //协助宝藏
        BAOZANG_HELP_LIST_PANEL = 279,
        //仙盟副本
        FACTION_COPY_PANEL = 280,
        //仙盟任务
        FACTION_TASK_PANEL = 281,
        //飞升榜面板
        SOARING_RANK_PANEL = 282,
        //累计充值（飞升榜）
        SOARING_CUMULATEPAY_PANEL = 283,
        //消费赠礼 （飞升榜）
        SOARING_DAYCONSUMEREWARD_PANEL = 284,
        //抢购礼包（飞升榜）
        SOARING_PANICBUTINGGIFT_PANEL = 285,
        //单笔充值 （飞升榜）
        SOARING_SINGLEPAY_PANEL = 286,
        //特惠礼包（飞升榜）
        SOARING_SPECIALGIFT_PANEL = 287,
        //显示活动开启 提示弹窗
        ACTIVITY_ALL_ALERT = 288,
        // 竞技场面板
        ARENA_PANEL = 289,
        // 竞技场排行面板
        ARENA_RANK_ALERT = 290,
        // 竞技场挑战记录面板
        ARENA_RECORDS_ALERT = 291,
        // 竞技场胜利结算面板
        ARENA_WIN_ALERT = 292,
        // 竞技场失败结算面板
        ARENA_LOSE_ALERT = 293,
        //天天返利
        EVERYDAY_REBATE_PANEL = 294,
        //仙盟技能面板
        FACTION_SKILL_PANEL = 295,
        //仙盟副本右下面板
        FACTION_COPY_RB_PANEL = 296,
        //仙盟副本底部面板
        FACTION_COPY_BOTTOM_PANEL = 297,
        //宝藏加速弹框
        BAOZANG_SPEED_ALERT = 299,
        //仙盟十次抽奖弹框
        FACTION_TEN_ALERT = 300,
        //仙盟 鼓舞弹框
        FACTION_INSPIRE_ALERT = 301,
        //铸魂界面
        EQUIPMENT_ZUHUN_PANEL = 302,
        //噬魂弹框
        EQUIPMENT_SIHUN_ALERT = 303,
        //套装面板0
        EQUIP_SUIT_PANEL_0 = 304,
        //套装面板1
        EQUIP_SUIT_PANEL_1 = 305,
        //套装面板2
        EQUIP_SUIT_PANEL_2 = 306,
        //套装面板3
        EQUIP_SUIT_PANEL_3 = 307,
        //套装面板4
        EQUIP_SUIT_PANEL_4 = 308,
        //套装面板5
        EQUIP_SUIT_PANEL_5 = 309,
        //套装面板6
        EQUIP_SUIT_PANEL_6 = 310,
        //套装面板7
        EQUIP_SUIT_PANEL_7 = 311,
        //套装面板8
        EQUIP_SUIT_PANEL_8 = 312,
        //套装面板9
        EQUIP_SUIT_PANEL_9 = 313,
        //冲榜 飞升 夺宝
        ROTARYTABLE_SOARING_PANEL = 314,
        //冲榜 飞升 夺宝 获取奖励弹窗
        ROTARYTABLE_SOARING_REWARD_ALERT = 315,
        //冲榜 飞升 夺宝 财气值奖励
        ROTARYTABLE_SOARING_RANK_ALERT = 316,
        //冲榜 飞升 夺宝 我的记录
        ROTARYTABLE_SOARING_MYRECORD_ALERT = 317,
        // 飞升 夺宝  排行奖励 弹窗
        ROTARYTABLE_SOARING_RANKAWARD_ALERT = 318,
        // 时装升级面板
        FASHION_SHENG_JI_PANEL = 319,
        // 时装幻化面板
        FASHION_HUAN_HUA_PANEL = 320,
        // 时装附魂面板
        FASHION_FU_HUN_PANEL = 321,
        // 天珠升级面板
        TIAN_ZHU_SHENG_JI_PANEL = 322,
        // 天珠幻化面板
        TIAN_ZHU_HUAN_HUA_PANEL = 323,
        // 天珠附魂面板
        TIAN_ZHU_FU_HUN_PANEL = 324,
        // 半月礼
        HALF_MONTH_GIFT_PANEL = 325,
        // 洗炼
        XI_LIAN_PANEL = 326,
        //输入公告弹框
        FACTION_SET_NOTICE_ALERT = 327,
        //输入招人标题弹框
        FACTION_SET_TITLE_ALERT = 328,
        //单笔充值（炽星魔锤）
        CUMULATEPAY_SHENHUN = 329,
        //单笔充值（天竺）
        CUMULATEPAY_TAINZHU = 330,
        //宝藏刷新弹框
        BAOZANG_F5_ALERT = 331,
        //开服礼包
        OPEN_AWARD_PANEL = 332,
        //神器面板
        SHENQI_PANEL = 333,
        //神器总属性弹框
        SHENQI_ATTR_ALERT = 334,
        //九州 夺宝
        ROTARYTABLE_JIUZHOU_PANEL = 335,
        //九州夺宝 获取奖励弹窗
        ROTARYTABLE_JIUZHOU_REWARD_ALERT = 336,
        //九州 夺宝 财气值奖励
        ROTARYTABLE_JIUZHOU_RANK_ALERT = 337,
        //九州 夺宝 我的记录
        ROTARYTABLE_JIUZHOU_MYRECORD_ALERT = 338,
        //九州  排行奖励 弹窗
        ROTARYTABLE_JIUZHOU_RANKAWARD_ALERT = 339,
        //消费赠礼（周末狂欢)
        WEEK_CONSUME_PANEL = 340,
        //登录豪礼
        LOGIN_REWARD_PANEL = 341,
        //登录豪礼弹框
        LOGIN_REWARD_TIP_ALERT = 342,
        //套装获取途径弹框
        EQUIP_SUIT_GET_ALERT = 344,
        //神魂商城面板
        SHENHUN_STORE_PANEL = 345,
        //圣印商城面板
        SHENGYIN_STORE_PANEL = 346,
        //登录豪礼(周末狂欢)
        WEEK_LOGIN_PANEL = 347,
        //单笔充值(周末狂欢)
        SINGLE_PAY_PANEL = 348,
        //累计充值(周末狂欢)
        REPEAT_PAY_PANEL = 349,
        //意见反馈
        FEEDBACK_ALERT = 350,
        //至尊礼包
        ZHIZUN_PANEL = 351,
        //称号激活弹窗
        PLAYER_TITLE_ALERT = 352,
        //组队副本邀请弹框
        TEAM_COPY_INVITE_ALERT = 353,
        //组队副本小队弹框
        TEAM_COPY_ROOM_ALERT = 354,
        //组队副本被邀请弹框
        TEAM_COPY_ASK_ALERT = 355,
        //公告界面
        ANNOUNCEMENT_PANEL = 356,
        //限时礼包
        LIMIT_PACK_ALERT = 357,
        //战力狂欢
        KUANGHUAN_POWER_PANLE = 358,
        //消费排行
        PAY_RANK_PANEL = 359,
        //邀请有礼
        INVITATION_ALERT = 360,
        //宠物自动购买弹窗
        MAGICPET_AUTOMATICPAY_ALERT = 361,
        //精灵自动购买弹窗
        MAGICWEAPON_AUTOMATICPAY_ALERT = 362,
        //第一次登陆送VIP弹框
        FIRST_LOGIN_ALERT = 363,
        // 实名认证弹框
        REAL_NAME_ALERT = 364,
        // 关注公众号弹框
        OFFICIAL_ACCOUNT_ALERT = 365,
        //探索购买弹框
        STORE_SPECIAL_ALERT = 366,
        //新VIP界面
        VIP_NEW_PANEL = 367,
        //新VIP 弹窗
        VIP_NEW_ALERT = 368,
        //仙府-家园技能升级弹框
        XIANFU_SKILL_ALERT = 369,
        //仙府-家园丹炉属性弹框
        XIANFU_DANLU_ATTR_ALERT = 370,
        //仙府-家园炼制结束弹框
        XIANFU_SMELT_END_ALERT = 371,
        //一元秒杀
        ONE_BUY_PANEL = 372,
        //仙玉抽奖弹窗
        ZXIANYU_ALERT = 373,
        //仙玉背包界面
        ZXIANYU_BAG_PANEL = 374,
        //仙玉主界面
        ZXIANYU_PANEL = 375,
        //仙玉商店界面
        ZXIANYU_STORE_PANEL = 376,
        //仙玉抽奖界面
        ZXIANYU_TREASURE_PANEL = 377,
        //战力护符
        FIGHT_TALISMAN_ALERT = 378,
        //战力护符购买
        FIGHT_TALISMAN_BUY_ALERT = 379,
        //招财仙猫
        MONEY_CAT_ALERT = 380,
        //招财仙猫购买
        MONEY_CAT_BUY_ALERT = 381,

        //仙府-家园熔炼详情弹框
        XIANFU_SMELT_DETAILS_ALERT = 382,
        //仙丹面板
        XIAN_DAN_PAENL = 383,
        //觉醒成功弹框
        BORN_SUCCESS_ALERT = 384,
        //仙府-家园商店
        STORE_XIAN_FU_PANEL = 385,
        // 无限手套弹框
        GLOVES_PANEL = 386,
        // 无限手套购买弹框
        GLOVES_BUY_ALERT = 387,
        // 无限手套碑石购买弹框
        GLOVES_STONE_BUY_ALERT = 388,
        // 无限手套属性提示框
        GLOVES_TIPS_ALERT = 389,
        //仙玉 奖励展示
        ZXIANYU_ALL_AREARD_ALERT = 390,
        //仙丹获取途径弹框
        XIANFU_DANLU_GET_ALERT = 391,
        //VIP/SVIP升级弹窗
        VIP_SVIP_UP_ALERT = 392,
        //玉荣探索
        TREASURE_RUNE_PANEL = 393,
        //通用招财猫购买提示
        COMMON_TXT_CAT_ALERT = 394,
        // 改名换性弹框
        RENAME_PANEL = 395,
        //飞升榜 排名截止弹窗
        ROTARYTABLE_SOARING_RANK_JIEZHI_ALERT = 396,
        //开服冲榜 排名截止弹窗
        SPRINT_RANK_JIEZHI_ALERT = 397,
        //资源找回面板
        RES_BACK_PANEL = 398,
        //资源找回弹框
        RES_BACK_ALERT = 399,
        //圣域
        SHENGYU_BOSS_PANEL = 400,
        //激活码成功弹框
        ANNOUNCEMENT_ALERT = 401,
        //等级狂欢
        LEVEL_CARNIVAL_PANEL = 402,
        //副本狂欢
        COPY_CARNIVAL_PANEL = 403,
        //全民狂嗨
        THE_CARNIVAL_PANEL = 404,
        //圣域BOSS 玩家列表  BOSS列表界面
        SHENGYU_BOSS_ANDPLAYERLIST_PANEL = 405,
        //圣域BOSS 右侧信息
        SHENGYU_BOSS_INFORMATION_PANEL = 406,
        //圣域BOSS 左侧收益
        SHENGYU_BOSS_LEFT_PANEL = 407,
        //圣域BOSS 今日收益/奖励预览 弹窗
        SHENGYU_BOSS_SHOUYI_ALERT = 408,
        //归属者血条 boss面板
        BELONG_PANEL = 409,
        //boss之家背包奖励
        BOSS_HOME_AWARD_ALERT = 410,
        //防骗弹窗
        PREVENT_FOOL_ALERT = 411,
        //防骗面板
        PREVENT_FOOL_PANEL = 412,
        //通用获得奖励弹窗
        COMMON_HUO_DE_REWARD_ALERT = 413,
        // 至尊礼包购买弹框
        ZZTZ_BUY_ALERT = 414,
        //合成面板
        COMPOSE_PANEL = 66,
        //分解面板
        UNCOMPOSE_PANEL = 415,
        //虚祖秘药面板
        XUZU_SECRETMEDICINE_PANEL = 416,
        //炼金药剂面板
        XIANFU_SMELT_PANEL = 417,
        //家园仙丹面板
        INSIDE_XIAN_DAN_PAENL = 418,
        //家园虚祖秘药面板
        INSIDE_XUZU_SECRETMEDICINE_PANEL = 419,
        //秘籍弹窗
        MAGIC_ART_ALERT = 420,

        //套装面板10
        EQUIP_SUIT_PANEL_10 = 421,
        //套装面板11
        EQUIP_SUIT_PANEL_11 = 422,
        //套装面板12
        EQUIP_SUIT_PANEL_12 = 423,
        //套装面板13
        EQUIP_SUIT_PANEL_13 = 424,
        //套装面板14
        EQUIP_SUIT_PANEL_14 = 425,

        //断线重连提示框
        RECONNECT_ALERT = 1000,

        //区长分红
        Daw_UI_QUZHANG = 88001,
        //战力分红
        Daw_UI_ZHANLI = 88002,
        //战力分红历史
        Daw_UI_ZHANLIList = 88003,
        //daw新增转盘
        Daw_UI_Reward = 88004,
        //提现页面
        Daw_UI_TiXian = 88005,
        //提现历史
        Daw_UI_TiXianList = 88006,


        //每日累充 daw* 植树迎春
        CUMULATE_PAY3_UPDATE = 88101,
        //全民狂嗨2 daw 
        Mission_Party_PANEL = 88102,
        //全民狂嗨2 daw 大奖领取
        Mission_Party_Award_ALERT = 88103,
        //全民狂嗨2 宝箱领取
        Mission_Party_GET = 88104,

        //战队主页面
        CLAN_INDEX_PANEL = 88200,
        //战队福地页面
        CLAN_BLESSED_PANEL = 88201,
        //战队列表页面
        CLAN_LIST_PANEL = 88202,
        //创建战队弹窗
        CLAN_CREATE_ALERT = 88210,
        //战队申请列表弹窗
        CLAN_APPLY_LIST_ALERT = 88211,
        //战队最低加入战力设置
        CLAN_JOIN_LIMIT_ALERT = 88212,
        //战队排行榜弹窗
        CLAN_LIST_ALERT = 88213,
        //战队规则榜弹窗
        CLAN_RULE_ALERT = 88214,
        //战队特权
        CLAN_PRIVILEGE_ALERT = 88215,
        //战队建设
        CLAN_BUILD_ALERT = 88216,
        //战队等级奖励
        CLAN_GRADEAWARD_ALERT = 88217,
        //战队光环刷新花费提示
        CLAN_HALO_REFRESH_ALERT = 88218,
        //战队光环确认替换提示
        CLAN_HALO_CONFIRM_ALERT = 88219,
        //战队商店面板
        CLAN_STORE_PANEL = 88220,

        //战队竞技-玄火争夺
        XUANHUO_PANEL = 88221,

        //战队竞技-战队逐鹿
        ZHULU_PANEL = 88222,

        XUANHUO_ACHIEVEMENT_ALERT = 88240,
        XUANHUO_RANK_AWARD_ALERT = 88241,
        XUANHUO_GET_AWARD_ALERT = 88242,
        XUANHUO_LEFT_PANEL = 88251,
        XUANHUO_BOSS_ANDPLAYERLIST_PANEL = 88252,
        XUANHUO_RB_PANEL = 88253,
        XUANHUO_GWTips_PANEL = 88254,
        XUANHUO_RANK_COPY_ALERT = 88256,
        XUANHUO_tips_ALERT = 88257,
        XUANHUO_COPY_SETTLEMENT_ALERT = 88258,
        XUANHUO_LEVEL_BUFF_ALERT = 88259,
        // 复活弹框
        XUANHUO_REVIVE_ALERT = 88255,

        //逐鹿相关面板
        ZHULU_ACHIEVEMENT_AWARD_ALERT = 88270,
        ZHULU_WAR_RANK_AWARD_ALERT = 88271,
        ZHULU_HEADER_DAMAGE_AWARD_ALERT = 88272,
        ZHULU_HEADERWAR_RANK_ALERT = 88273,
        ZHULU_WAR_GUESS_ALERT = 88274,
        ZHULU_BLESSED_AWARD_DISPLAY_ALERT = 88275,
        ZHULU_KNEEL_ALERT = 88276,
        ZHULU_HEADER_SCORE_AWARD_ALERT = 88277,

        /*姻缘相关 面板id从88300开始*/
        //姻缘商店
        XIANYUAN_STORE_PANEL = 88325,

        /* 圣装 */
        LuxuryEquip_ZhiZun_PANEL = 88370,//圣装 - 至尊装备
        LuxuryEquip_ZhiZun_UPGRADE_ALERT = 88371, //圣装 - 至尊装备 技能升级
        LuxuryEquip_ZhiZun_GRADE_ALERT = 88372,//圣装 - 至尊装备 为我独尊
        /* 现金装备 */
        CashEquip_PANEL = 88373,//主界面
        CashEquip_ALERT = 88374,//物品弹窗
        CashEquip_Probability_Alert = 88375,//概率描述弹窗
        CashEquip_Money_Alert = 88376,//余额弹窗
        CashEquip_Sell_Alert = 88377,//出售装备 CashEquipSellAlert
        CashEquip_Share_Alert = 88378,//获得装备 CashEquipShareAlert
        CashEquip_Tips_Alert = 88379,//出售成功 CashEquipTipsAlert
        CashEquip_Sell_List_Alert = 88380,//出售明细 
        /* 姻缘 */
        MARRY_PANEL = 88381,                  // 姻缘
        MARRY_RING_PANEL = 88382,             // 义戒
        MARRY_KEEPSAKE_PANEL = 88383,         // 信物
        MARRY_CHILDREN_PANEL = 88384,         // 仙娃
        MARRY_IntimacyReward_Alert = 88385,   // 甜蜜度奖励
        MARRY_Separate_Alert = 88386,         // 分离
        MARRY_Wall_PANEL = 88387,             // 姻缘墙
        MARRY_KEEPSAKE_Up_PANEL = 88388,      // 信物
        MARRY_Task_PANEL = 88389,             // 姻缘任务
        MARRY_Copy_Alert = 88390,             // 姻缘 副本
        MARRY_CHILDREN_Up_PANEL = 88391,      // 仙娃 进阶
        MARRY_CHILDREN_Eat_PANEL = 88392,     // 仙娃 进补
        MARRY_CHILDREN_Skill_PANEL = 88393,   // 仙娃 技能
        MARRY_Engraving_Alert = 88394,        // 刻印
        MARRY_Resonance_Alert = 88395,        // 共鸣
        MARRY_Search_Alert = 88396,           // 搜索姻缘
        MARRY_Released_Alert = 88397,         // 发布姻缘
        MARRY_FEED_SKILL_ALERT = 88398,       // 培养技能弹框

        MARRY_BATTLE_TOP_PANEL = 500,         // 姻缘副本排行榜  //ID排序不够了 临时从500开始
        MARRY_BATTLE_AWARD_PANEL = 501,       // 姻缘副本奖励预览
        CHAT_MARRY_PANEL = 502,               // 姻缘聊天面板
        MARRY_GIFT_ALERT = 503,               // 姻缘结婚弹窗
        MARRY_MINDS_ALERT = 504,               // 姻缘心有灵犀弹窗

        //= 88385,         //信物进阶
        //= 88386,         //仙娃进阶
        //= 88387,         //仙娃进补
        //= 88388,         //仙娃 仙技
        //= 88389,         //姻缘墙
        //= 88390,         //分离
        //= 88391,         //任务
        //= 88392,         //规则描述
        //= 88393,         //阶段奖励
        //= 88394,         //共鸣
        //= 88395,         //刻印
        //= 88396,         //副本
        //= 88397,         //总加成
        //= 88398,         //仙技设置



        SUPER_VIP_ENJOY_VIEW = 88400,                           //超级会员专享界面
        SUPER_VIP_CONTACT_ALERT = 88401,                        //超级会员获取客服信息提示面板
        CUSTOM_TITLE_ALERT = 88410,                             //称号定制面板
        CUSTOM_TITLE_MORE_ALERT = 88411,                        //称号定制面板更多提示面板

        JIUXIAOLING_AWARD_VIEW = 88420,                         //九霄令奖励面板
        JIUXIAOLING_TASK_VIEW = 88421,                          //九霄令任务面板
        JIUXIAOLING_ACTIVATE_GOLD_ALERT = 88422,                //九霄令购买(激活)金令
        JIUXIAOLING_BUY_LEVEL_ALERT = 88423,                    //九霄令购买等级
        JIUXIAOLING_AWARD_PREVIEW_ALERT = 88424,                //九霄令大奖预览
        JIUXIAOLING_GETED_AWARD_ALERT = 88425,                  //九霄令领取到的奖励

        // 开服活动 +144[累冲] +155[消费] +156[连冲] 共9个
        OPENSERVICE_CEREMONY_GEOCAHING_VIEW = 88430,            //庆典探索-主界面
        OPENSERVICE_CEREMONYGEO_SCORE_ALERT = 88431,            //庆典探索-积分奖励榜
        OPENSERVICE_CEREMONYGEO_RANK_ALERT = 88432,             //庆典探索-排行奖励榜
        OPENSERVICE_CEREMONYGEO_GETED_ALERT = 88433,            //庆典探索-抽奖获得奖励
        OPENSERVICE_LIMIT_ONE_DISCOUNT_VIEW = 88434,            //限时一折
        OPENSERVICE_CEREMONY_CASH_VIEW = 88435,                 //庆典兑换
        OPENSERVICE_SINGLE_RECHARGE_VIEW = 88437,               //单笔充值
        // OPENSERVICE_DAILY_ADDUP_RECHARGE_VIEW = 88438,       //每日累冲
        OPENSERVICE_DOUBLE_DROP_VIEW = 88439,                   //掉落狂欢 双倍掉落
        // OPENSERVICE_COUNT_PAY_VIEW = 88440,                  //累充豪礼
        OPENSERVICE_CONTINUE_PAY_VIEW = 88441,                  //连充豪礼

        // 通用选取数量弹窗
        COMMON_AMOUNT_ALERT = 88888,

        // 钓鱼 / 休闲垂钓 / 九州渔场
        FISH_PANEL = 88500,   // 主界
        FISH_CK_PANEL = 88501,  // 垂钓宝库
        FISH_RANK_PANEL = 88502,  // 垂钓排行
        FISH_GIFT_PANEL = 88503,  // 垂钓礼包
        FISH_LINK_PANEL = 88504,  // 垂钓连充
        FISH_REAP_PANEL = 88505,  // 垂钓返利
        FISH_SHOP_PANEL = 88506,  // 垂钓商城
        FISH_PRIZE_ALERT = 88507, // 垂钓奖励预览
        FISH_GAIN_ALERT = 88508, // 垂钓钓鱼奖励
        BIG_PRIZE_ALERT = 88509, // 幸运大奖弹窗
        FISH_CARNIVAL_PANEL = 88510, // 垂钓掉落狂欢

        // 七日活动
        SEVENACTIVITY_ENTRANCE_ALERT = 88520,                   //七日活动展示宣传入口弹窗
        SEVENACTIVITY_VIEW = 88521,                             //七日活动主界面

        // 七日-魔神令
        DEMON_ORDER_GIFT_PANEL = 88530, // 魔神令界面
        DEMON_ORDER_GIFT_ALERT = 88531, // 魔神令界面

        // 新增空装备点击弹窗
        EQUIPMENT_SOURCE_ALERT = 88540,
        //打地鼠
        DI_SHU_PANEL = 88550,
        DI_SHU_TASK_PANEL = 88551,      // 补给猫粮
        DI_SHU_RANK_PANEL = 88552,      // 喵星人
        DI_SHU_ALERT = 88553,           // 大奖预览
        DI_SHU_PRIZE_ALERT = 88554,     // 选取终极大奖
        DI_SHU_CARNIVAL_ALERT = 88555,      // 掉落狂欢
        DI_SHU_REAP_PANEL = 88556,      // 消费赠礼
        // DI_SHU_LINK_PANEL = 88557,
        DI_SHU_CUMULATE_PANEL = 88558,      // 累充豪礼
        DI_SHU_DAY_CUMULATE_PANEL = 88559,      // 每日累充
        DI_SHU_DAY_SINGLE_PANEL = 88560,        // 单笔充值

        // 玉荣(玉荣)新增界面
        RUNE_COMPOSE_PANEL = 88600,                                     // 合成
        RUNE_COLLECT_PANEL = 88601,                                     // 收集箱
        RUNE_DISMANTLE_ALERT = 88602,                                   // 玉荣拆解提示
        RUNE_COLLECT_LEVEL_ALERT = 88603,                               // 玉荣收集专家弹窗

        REDPACK_LEVEL_BONUS_PANEL = 88650,                              // 红包-等级分红
        REDPACK_LEVEL_PANEL = 88651,                                    // 红包-等级红包
        SUPRER_REDPACK_PANEL = 88652,                                   // 红包-超级红包
        SUPRER_REDPACK_CASH_PANEL = 88653,                              // 红包-超级兑换

        REDPACK_CASH_RECORD_ALERT = 88654,                              // 红包-红包兑换记录
        REDPACK_WITHDRAW_DETIAL_ALERT = 88655,                          // 红包-红包兑换提现明细记录
        REDPACK_REMAIN_CASH_ALERT = 88656,                              // 红包-红包兑换余额提现
        REDPACK_GETED_ALERT = 88657,                                    // 红包-获取红包界面
        REDPACK_HELP_ALERT = 88658,                                     // 红包-红包帮助界面
        REDPACK_GET_TIPS_ALERT = 88659,                                 // 红包-红包领取提示界面

        EXPLICIT_SUIT_BEST_PANEL = 88660,                               // 外显套装-极品套装界面
        EXPLICIT_SUIT_UNIQUE_PANEL = 88661,                             // 外显套装-绝品套装界面
        EXPLICIT_SUIT_COLLECTION_PANEL = 88662,                         // 外显套装-典藏套装界面
        EXPLICIT_SUIT_ATTR_ALERT = 88663,                               // 外显套装-套装属性

        YEAR_CJ = 88680,              // 抽奖
        YEAR_SHOP = 88681,            // 商城
        YEAR_EXCHANGE = 88682,        // 兑换
        YEAR_LINK = 88683,            // 连充
        YEAR_SINGLE_PAY = 88684,      // 单笔
        YEAR_ADDUP_PAY = 88685,       // 累充
        YEAR_DAY_ADDUP_PAY = 88686,   // 每日累充
        YEAR_REAP = 88687,            // 消费赠礼
        YEAR_LOGIN_LINK = 88688,      // 连续登陆
        YEAR_SCORE_ALERT = 88689,     // 积分奖励弹窗
        YEAR_CARNIVAL = 88690,     // 掉落狂欢
        YEAR_GAIN_ALERT = 88691,     // 奖励弹窗

        //svip秒杀
        RECHARGE_SVIP_SALE_ALERT = 88700,
        
        EVERYDAY_FIRSTDAY_ALERT = 88701,        //每日首充
        //新增仙府界面的商店
        XIANFU_SHOP = 88664,


        HEAD_PANEL = 886690,                               // 个性化界面
        SET_PANEL = 886691,                                // 特效设置界面


        GUANGHUAN_SHENG_JI_PANEL = 886700,// 光环升级面板
        GUANGHUAN_HUAN_HUA_PANEL = 886701,// 光环幻化面板
        GUANGHUAN_FU_HUN_PANEL = 886702,  // 光环附魂面板

        // 运送面板
        Transport_PANEL = 510,
        // 传送面板
        Transfer_PANEL = 511,

        /** 战队逐鹿 */
        TEAMCHIEF_COPY_BOTTOM_PANEL = 88901,// 首领战底部
        TEAMPREPARE_COPY_BOTTOM_PANEL = 88902, // 准备场景右侧
        TEAMPBATTLE_COPY_CROSS_TOP_PANEL = 88903,  // 争夺战头部
        TEAMPBATTLE_COPY_CROSS_RB_PANEL = 88904,  // 争夺战底部
        TEAMPBATTLE_COPY_BATTLE_FINISH_PANEL = 88905,  // 争夺战 副本完成
        TEAMPBATTLE_COPY_CHIEF_FINISH_PANEL = 88906,  // 首领战 副本完成



    }


    // 层
    const enum Layer {
        BOTTOM_LAYER = 1,       // 最底层
        CITY_LAYER = 2,         // 主城层
        MAIN_UI_LAYER = 3,      // 主界面层
        UI_LAYER = 4,           // ui层
        NOTICE_LAYER = 5,       // 提示层
        DIALOG_LAYER = 6,       // 弹框层
        EFFECT_LAYER = 7,        // 特效层
        MID_UI_LAYER = 8,        // 中间UI层
        UP_UI_LAYER = 9,          // 上层UI层
        LOADING_LAYER = 10,         // 加载层
    }

    // 面板类型，1面板，2弹框
    const enum PanelType {
        VIEW = 1,
        DIALOG = 2
    }

    interface WindowEntry extends HeapElement {
        id: number;
        timeout: number;
        isOpen: boolean;
    }

    const enum WindowInfoFields {
        panelId,          // 面板ID
        panelType,          // 面板类型，1面板2弹框
        windowClass,       // 面板类
        res,                // 面板资源（字符串或数组）
        closeOthers,        // 是否关闭其他面板
        funcId,             // 对应的功能ID，默认是0
        disposeDelay,       // 释放时间，单位毫秒，默认0代表使用windowmanager里面的默认时间
    }

    type WindowInfo = [WindowEnum, PanelType, any, string | Array<string>, int, ActionOpenId, int];

    const enum TabInfoFields {
        panelIdsArr = 0,        // 面板ID
        names = 1,           // 面板名，显示在切页上的文字
        redPointPros = 2,        // 红点对应的属性
        icons = 3,             // 切页图标
        funcId = 4              // 切页入口的功能ID
    }

    type TabInfo = [Array<Array<WindowEnum>>, Array<string>, Array<Array<Array<keyof RedPointProperty>>>, Array<string>, ActionOpenId];

    // 红点属性
    interface RedPointProperty extends LTIocnRP {
        "petFeedSkillRP": boolean;        // 宠物培养技能红点
        "petFeedMatRP": boolean;          // 宠物培养材料红点
        "petRankSkillRP": boolean;        // 宠物进阶技能红点
        "petRankMatRP": boolean;          // 宠物进阶材料红点
        "petIllusionRP": boolean;         // 宠物幻化红点
        "petRefineMaterialRP": boolean;   // 宠物修炼材料红点
        "weaponFeedSkillRP": boolean;     // 精灵培养技能红点
        "weaponFeedMatRP": boolean;       // 精灵培养材料红点
        "weaponIllusionRP": boolean;      // 精灵幻化红点
        "weaponRankSkillRP": boolean;     // 精灵进阶技能红点
        "weaponRankMatRP": boolean;       // 精灵进阶材料红点
        "weaponRefineMaterialRP": boolean;// 精灵修炼材料红点
        "talismanRP": boolean;           // 圣物红点
        "intensiveRP": boolean;          // 强化红点
        "stoneRP": boolean;              // 仙石红点
        "exerciseRP": boolean;           // 历练红点
        "bornRP": boolean;               // 觉醒红点
        "magicArtRP": boolean;           // 技能红点
        "goldBodyRP": boolean;           // 金身红点
        "magicPositionRP": boolean;      // 仙位红点
        "immortalsShengjiRP": boolean;   // 神兵升级红点
        "immortalsHuanhuaJipinRP": boolean;   // 神兵幻化极品红点
        "immortalsHuanhuaZhenpinRP": boolean; //神兵幻化珍品红点
        "immortalsHuanhuaJuepinRP": boolean;  // 神兵幻化绝品红点
        "immortalsHuanhuaDianchangRP": boolean;  // 神兵幻化典藏红点
        "immortalsFuhunRP": boolean;     // 神兵附魂红点
        "wingShengjiRP": boolean;        // 仙翼升级红点
        "wingHuanhuaJipinRP": boolean;   // 仙翼幻化极品红点
        "wingHuanhuaZhenpinRP": boolean; // 仙翼幻化珍品红点
        "wingHuanhuaJuepinRP": boolean;  // 仙翼幻化绝品红点
        "wingHuanhuaDianchangRP": boolean;  // 仙翼幻化典藏红点
        "wingFuhunRP": boolean;          // 仙翼附魂红点
        "dailyDungeonRP": boolean;       // 玩法试炼红点
        "bigTowerRP": boolean;           // 大荒红点
        "multiBossRP": boolean;          // 多人BOSS红点
        "threeWorldsRP": boolean;        // 三界BOSS红点
        "bossHomeRP": boolean;           // BOSS之家
        "shenYuBossRP": boolean;
        "singleBossRP": boolean;       //单人boss红点
        "equipPartRP": boolean;          // 装备部位红点
        "composeRP": boolean;           //合成红点
        "redEquipComposeRP": boolean;   //合成红点
        "stoneBtnRP": boolean;          // 徽章合成红点
        "equipBtnRP": boolean;           //装备合成红点
        "itemBtnRP": boolean;           //道具合成红点
        "equipReBtnRP": boolean;           //装备分解红点
        "itemReBtnRP": boolean;           //道具分解红点
        "equipResolveRP": boolean;           //装备分解红点
        "itemResolveRP": boolean;           //道具分解红点
        "resolveRP": boolean;             //分解红点
        "missionRP": boolean;            // 天关红点
        "teamBattleRP": boolean;         //组队副本红点
        "firstPayRP": boolean;         //首充红点
        "dailyDemonRP": boolean;         //每日降妖红点
        "resBack": boolean;         //资源找回红点
        "runeCopyRP": boolean;         //远古符阵红点
        "daypayRP": boolean;           //日充红点
        "runeRP": boolean;             //玉荣系统红点
        "zzRP": boolean;             //至尊系统红点
        "zzskillRP": boolean;             //至尊系统技能红点
        "continuePayGrade1RP": boolean;      // 连充第一档红点
        "continuePayGrade2RP": boolean;      // 连充第二档红点
        "continuePayGrade3RP": boolean;      // 连充第三档红点
        "zeroBuyOneRP": boolean;        //零元购 一档
        "zeroBuyTwoRP": boolean;        //零元购 二档
        "zeroBuyThreeRP": boolean;         //零元购 三档
        "zeroBuyFourRP": boolean;         //零元购 四档
        "lineClearOut": boolean;       //挂机扫荡
        "xianfuShengjiRP": boolean;     //仙府-家园升级
        "xianfuTaskRP": boolean;   //仙府-家园任务
        "xianfuBlueHandBookRP": boolean;  //仙府-家园蓝色图鉴
        "xianfuVioletHandBookRP": boolean;  //仙府-家园紫色图鉴
        "xianfuOrangeHandBookRP": boolean;  //仙府-家园橙色图鉴
        "xianfuRedHandBookRP": boolean;  //仙府-家园红色图鉴
        "xianfuArticleRP_0": boolean;  //仙府-家园激活物件红点
        "xianfuArticleRP_1": boolean;  //仙府-家园激活物件红点
        "xianfuArticleRP_2": boolean;  //仙府-家园激活物件红点
        "xianfuEventRP": boolean;   //仙府-家园可操作事件红点
        "magicPetFazhenJipinRP": boolean;   // 宠物法阵幻化极品红点
        "magicPetFazhenZhenpinRP": boolean; //宠物法阵幻化珍品红点
        "magicPetFazhenJuepinRP": boolean;  // 宠物法阵幻化绝品红点
        "weaponFazhenJipinRP": boolean;   // 宠物法阵幻化极品红点
        "weaponFazhenZhenpinRP": boolean; //宠物法阵幻化珍品红点
        "weaponFazhenJuepinRP": boolean;  // 宠物法阵幻化绝品红点
        "activityAllItemRP": boolean; //活動列表紅點
        "ladderJoinAwardRP": boolean;        // 天梯参与奖励红点
        "yunMengBossRP": boolean;               //云梦秘境入口红点
        "fairyRP": boolean;    //护送仙女红点
        "adventureRP": boolean;      // 奇遇红点
        "adventureShopRP": boolean;      // 奇遇兑换红点
        "xunBao1": boolean;    //探索红点1
        "xunBao2": boolean;    //探索红点2
        "xunBao3": boolean;    //探索红点3
        "xunBao4": boolean;    //探索红点4
        "bagRP": boolean;      // 背包切页红点
        "smeltRP": boolean;      // 熔炼切页红点
        "shangchengRP": boolean;      // 商城切页红点
        "shangdianRP": boolean;      // 商店切页红点
        "emailRP": boolean;      // 邮件切页红点
        "rechargeRP": boolean;      // 充值切页红点
        "rankingListRP": boolean;      // 排行榜切页红点
        "tianTiRP": boolean;          // 天梯按钮红点
        "actionPreviewEnterRP": boolean; // 功能预览入口红点
        "playerTitleRP": boolean;      //称号切页红点
        "soaringRankRP": boolean;      //飞升榜切页红点
        "soaringCumulatePayRP": boolean;      //累计充值（飞升榜）切页红点
        "soaringDayConsumeRewardRP": boolean;      //消费赠礼（飞升榜)切页红点
        "soaringSinglePayRP": boolean;      //单笔充值（飞升榜）切页红点
        "mineBaozangListRP": boolean;  //我的宝藏列表
        "helpBaozangListRP": boolean; //宝藏协助列表
        "factionHurtAwardRP": boolean;  //仙盟伤害奖励列表
        "factionApplyJoinRP": boolean; //仙盟审批红点
        "factionPostApplyRP": boolean; //职位申请红点
        "factionDialRP": boolean; //仙盟转盘红点
        "factionSkillRP": boolean; //仙盟技能红点
        "fashionShengJiRP": boolean;         // 时装升级红点
        "fashionShengJiMatRP": boolean;          // 时装升级材料红点
        "fashionHuanHuaJiPinRP": boolean;        // 时装幻化极品红点
        "fashionHuanHuaZhenPinRP": boolean;      // 时装幻化珍品红点
        "fashionHuanHuaJuePinRP": boolean;       // 时装幻化绝品红点
        "fashionHuanHuaDianchangRP": boolean;       // 时装幻化典藏红点
        "fashionFuHunRP": boolean;               // 时装附魂红点
        // "guanghuanHurtAwardRP": boolean;  //光环伤害奖励列表
        // "guanghuanApplyJoinRP": boolean; //光环审批红点
        // "guanghuanPostApplyRP": boolean; //光环申请红点
        // "guanghuanDialRP": boolean; //光环转盘红点
        // "guanghuanSkillRP": boolean; //光环技能红点
        "guanghuanShengJiRP": boolean;             // 光环升级红点
        "guanghuanShengJiMatRP": boolean;          // 光环升级材料红点
        "guanghuanHuanHuaJiPinRP": boolean;        // 光环幻化极品红点
        "guanghuanHuanHuaZhenPinRP": boolean;      // 光环幻化珍品红点
        "guanghuanHuanHuaJuePinRP": boolean;       // 光环幻化绝品红点
        "guanghuanHuanHuaDianchangRP": boolean;    // 光环幻化典藏红点
        "guanghuanFuHunRP": boolean;               // 光环附魂红点
        "tianZhuShengJiRP": boolean;         // 天珠升级红点
        "tianZhuShengJiMatRP": boolean;          // 天珠升级材料红点
        "tianZhuHuanHuaJiPinRP": boolean;        // 天珠幻化极品红点
        "tianZhuHuanHuaZhenPinRP": boolean;      // 天珠幻化珍品红点
        "tianZhuHuanHuaJuePinRP": boolean;       // 天珠幻化绝品红点
        "tianZhuFuHunRP": boolean;               // 天珠附魂红点
        "equipmentZuHunRP": boolean;        //铸魂切页红点
        "xiLianMaster": boolean;             // 洗炼大师
        "shenqiRP": boolean; //神器红点
        "fightTalismanRP": boolean;     // 战力护符红点
        "moneyCatRP": boolean;     // 招财仙猫红点
        "fightTalismanBuyRP": boolean;     // 战力护符购买入口红点
        "fightTalismanYeShouRP": boolean;     // 野兽勋章入口红点
        "fightTalismanZhuFuRP": boolean;     // 祝福勋章购买入口红点
        "fightTalismanJueXingRP": boolean;     // 觉醒勋章购买入口红点
        "fightTalismanTuTengRP": boolean;     // 图腾勋章购买入口红点
        "moneyCatBuyRP": boolean;     // 招财仙猫购买入口红点
        "oneBuyRP": boolean;//一元秒杀红点
        "xianDanRP": boolean;// 仙丹红点
        "xuzuRP": boolean;// 虚祖秘药红点
        "xianfuSmeltRP": boolean;// 炼金药剂红点
        "glovesRP": boolean;     // 无限手套红点
        "glovesBuyRP": boolean;      // 无限手套购买红点
        "glovesStoneBuyRP": boolean;     // 无限手套原石购买红点
        "arenaRP": boolean;    //群仙竞技红点
        "preventFoolRP": boolean;   //防骗问卷红点
        "MissionPartyRP": boolean;   //狂嗨2红点
        /*战队相关的红点*/
        "ClanGradeAwardRP": boolean;                //战队等级奖励
        "ClanShopRP": boolean;                      //战队商店
        "ClanApplyListRP": boolean;                 //战队申请列表
        "XHMainAchievementRP": boolean;             //玄火主界面成就
        "XHCopyGetAwardRP": boolean;                //玄火副本奖励获取

        "marryRP": boolean;             // 姻缘
        "marryRingRP": boolean;         // 义戒
        "marryKeepsakeRP": boolean;     // 信物
        "marryChildrenRP": boolean;     // 仙娃
        "marryTaskRP": boolean;         // 任务

        "CeremonyDanbiRP": boolean;      //开服庆典 单笔充值 切页红点
        "ceremonyContinuePayGrade0RP": boolean;      // 连充第*档红点
        "ceremonyContinuePayGrade1RP": boolean;      // 连充第*档红点
        "ceremonyContinuePayGrade2RP": boolean;      // 连充第*档红点
        "ceremonyContinuePayGrade3RP": boolean;      // 连充第*档红点
        "ceremonyContinuePayGrade4RP": boolean;      // 连充第*档红点
        "ceremonyContinuePayGrade5RP": boolean;      // 连充第*档红点

        /********************* 活动 红点中心 *********************/
        "fishGiftRP": boolean;      // 活动 钓鱼 礼包红点
        "fishGiftRP_grade_1": boolean;      // 活动 钓鱼 礼包*档红点
        "fishGiftRP_grade_2": boolean;      // 活动 钓鱼 礼包*档红点
        "fishGiftRP_grade_3": boolean;      // 活动 钓鱼 礼包*档红点
        "fishLinkRP": boolean;              // 活动 钓鱼 连充红点
        "fishLinkRP_grade_1": boolean;      // 活动 钓鱼 连充*档红点
        "fishLinkRP_grade_2": boolean;      // 活动 钓鱼 连充*档红点
        "fishLinkRP_grade_3": boolean;      // 活动 钓鱼 连充*档红点
        "fishReapRP": boolean;              // 活动 钓鱼 返利红点
        "fishItemSate0": boolean;              // 活动 钓鱼 黄金鱼饵充足
        "fishItemSate1": boolean;              // 活动 钓鱼 铂金鱼饵充足
        "fishItemSate2": boolean;              // 活动 钓鱼 钻石鱼饵充足

        "dishuDaySingleRP": boolean;      // 单笔充值 切页红点
        "dishuDayCumulateRP": boolean;      // 单笔充值 切页红点
        "dishuCumulateRP": boolean;      // 单笔充值 切页红点
        "dishuReapRP": boolean;      // 单笔充值 切页红点
        "fishCumulateRP": boolean;      // 单笔充值 切页红点
        "fishDaySingleRP": boolean;      // 单笔充值 切页红点
        "fishDayCumulateRP": boolean;      // 单笔充值 切页红点

        "sevenActivityRP": boolean;         // 七日活动红点
        "demonOrderGiftRP": boolean;        // 魔神令红点

        "runeComposeRP": boolean;           // 玉荣合成
        "runeCollectRP": boolean;           // 玉荣收集箱
        /********************* 地鼠红点中心 *********************/
        "DishuTaskOpenRP": boolean;                 // 地鼠个人任务红点
        "DishuTaskServerRP": boolean;               // 地鼠全服任务红点

        "ExplicitSuitBest": boolean;//外显套装-极品
        "ExplicitSuitUnique": boolean;//外显套装-绝品
        "ExplicitSuitCollection": boolean;//外显套装-典藏

        "YearDaySingleRP": boolean;      // 单笔充值 切页红点
        "YearDayCumulateRP": boolean;      // 单笔充值 切页红点
        "YearCumulateRP": boolean;      // 单笔充值 切页红点
        "YearReapRP": boolean;      // 单笔充值 切页红点
        "YearLinkRP": boolean;      // 单笔充值 切页红点
        "YearLoginRP": boolean;      // 单笔充值 切页红点
        "YearCjTaskRP": boolean;      // 新春积分红点    
        "YearDhRP": boolean;      // 新春积分红点    


        "ZhuluScoreRP": boolean;      // 逐鹿单场奖励红点    
        "ZhuluDamageRP": boolean;     // 逐鹿首领战红点
        "ZhuluCjAwardeRP": boolean;   //逐鹿成就红点
    }

    interface LTIocnRP {
        "sevenDayGiftRP": boolean;// 七日礼红点
        "heroAuraRP": boolean;// 主角光环红点
        "signRP": boolean;     //签到红点
        "monthCardRP": boolean;// 月卡红点
        "weekCardRP": boolean;// 周卡红点
        "weekXianyuRP": boolean;// 周卡仙玉红点
        "weekYuanbaoRP": boolean;// 周卡代币券红点
        "onlineGiftRP": boolean;//在线礼包红点
        "treasureRP": boolean;           //探索红点        
        "treasureBagRP": boolean;           //探索仓库红点        
        "treasureExchangeRP": boolean;   //探索兑换红点
        "zeroBuyEntranceRP": boolean; //零元购        
        "discountGiftPayRP": boolean; //特惠礼包红点        
        "continuePayRP": boolean;        //连充红点        
        "cumulateRP": boolean;        //累充红点        
        "cumulate2RP": boolean;        //每日累充        
        "dayconsumeRP": boolean;               //消费赠礼 每日
        "consumeRP": boolean;         //消费赠礼红点        
        "investLoginRP": boolean;    //登录返利红点
        "investRecruitRP": boolean;    //闯关返利返利红点        
        "investGrowthRP": boolean;     //成长返利红点
        "sprintRankXianQiRP": boolean;     //精灵排行红点
        "sprintRankLingChongRP": boolean;  //宠物排行红点
        "sprintRankShenBingRP": boolean;  //神兵排行红点
        "sprintRankXianYiRP": boolean;    //仙翼排行红点
        "sprintRankFaBaoRP": boolean;     //圣物排行红点
        "sprintRankEquipmentRP": boolean; //装备排行红点
        "sprintRankFighitingRP": boolean; //战力排行红点
        "sprintRankRP": boolean              //开服冲榜入口红点        
        "guShenRP": boolean;                     //古神问道红点
        "gushengrade1RP": boolean;               //古神问道一档红点
        "gushengrade2RP": boolean;               //古神问道二档红点
        "gushengrade3RP": boolean;               //古神问道三档红点
        "gushengrade4RP": boolean;               //古神问道四档红点
        "gushengrade5RP": boolean;               //古神问道五档红点
        "kuangHuanRP": boolean;                   //全民狂欢
        "kuangHuanLevelRP": boolean;                   //全民等级狂欢
        "kuangHuanPowarRP": boolean;                   //全民战力狂欢
        "payRewardRP": boolean; //充值抽獎红点
        "soaringSpecialGiftRP": boolean;      //特惠礼包（飞升榜）切页红点
        "soaringPanicBuyingGifRP": boolean;      //抢购礼包（飞升榜切页红点
        "everyDayRebateRP": boolean;      //天天返利切页红点
        "halfMonthGiftRP": boolean;          // 半月礼红点
        "rotaryTableSoaringRP": boolean; //飞升,冲榜 转盘
        "cumulatePayShenHunRP": boolean; //单笔充值（炽星魔锤）
        "cumulatePayTianZhuRP": boolean; //单笔充值（天竺）
        "loginRewardRP": boolean;//登录豪礼红点
        "rotaryTableJiuZhouRP": boolean; //九州夺宝切页红点
        "weekSinglePayRP": boolean;  //单笔充值(周末狂欢)
        "weekRepeatPayRP": boolean;  //累计充值(周末狂欢)
        "weekLoginRP": boolean;//周末登录红点
        "weekConsumeRP": boolean; //消费赠礼红点
        "feedBackRP": boolean; //意见反馈入口红点
        "announcementRP": boolean;//兑换 公告 入口红点
        "invitationRP": boolean;//邀请有礼红点
        "vipRP": boolean;                // vip红点
        "vipNewRP": boolean;                // 新vip红点
        "realNameRP": boolean;       // 实名认证红点
        "officialAccountRP": boolean;     // 关注公众号红点
        "payRankRP": boolean;//消费排行红点
        "zxianYuBagPanelRP": boolean;     // 仙玉背包红点
        "zxianYuPanelRP": boolean;     // 仙玉红点
        "zxianYuStorePanelRP": boolean;     // 仙玉商店红点
        "zxianYuTreasurePanelRP": boolean;     // 仙玉抽奖红点
        "equipSuitRP_0": boolean; //套装红点
        "equipSuitRP_1": boolean; //套装红点
        "equipSuitRP_2": boolean; //套装红点
        "equipSuitRP_3": boolean; //套装红点
        "equipSuitRP_4": boolean; //套装红点
        "equipSuitRP_5": boolean; //套装红点
        "equipSuitRP_6": boolean; //套装红点
        "equipSuitRP_7": boolean; //套装红点
        "equipSuitRP_8": boolean; //套装红点
        "equipSuitRP_9": boolean; //套装红点
        "equipSuitRP_10": boolean; //套装红点
        "equipSuitRP_11": boolean; //套装红点
        "equipSuitRP_12": boolean; //套装红点
        "equipSuitRP_13": boolean; //套装红点
        "equipSuitRP_14": boolean; //套装红点
        "shenYuBossRP": boolean;
        "preventFoolRP": boolean;   //防骗问卷红点
        "theCarnivalRP": boolean;//狂嗨红点
        "cumulate3RP": boolean;        //daw 每日累充    
        "MissionPartyRP": boolean;        //daw 迎春派对  
        "theSuperVipRP": boolean;        //超级VIP
        "everydayFirstPayRP": boolean;      //每日首充
        "customTitleRP": boolean;        //称号定制

        "JiuXiaoLingAwardRP": boolean;              //九霄令奖励红点
        "JiuXiaoLingTaskRP": boolean;               //九霄令任务红点
        "JiuXiaoLingExtralExpRP": boolean;          //九霄令额外经验包红点

        "ceremonyGeocachingGetedRP": boolean;       // 庆典寻宝积分领取红点
        "ceremonyGeocachingCanDraw": boolean;       // 庆典寻宝可寻宝
        "ceremonyExchangeRP": boolean;              // 庆典寻宝兑换
        "ceremonyContinuePayRP": boolean;           // 开服 连充红点     
        "HeadCanActiveRP": boolean;                 // 有可激活头像的红点   

        "SuperRedPackRP": boolean;                  //超级红包红点
        "LevelBonusRP": boolean;                    //等级分红红点   
        "LevelRedPackRP": boolean;                  //等级红包红点   

    }

    const enum EventInfoField {
        dispatcher = 0,         // 派发器
        type = 1,               // 事件类型
        caller = 2,             // 执行域
        listener = 3            // 侦听函数
    }

    type EventInfo = [EventDispatcher, string, any, Function];

    const enum LongEventInfoField {
        dispatcher = 0,         // 派发器
        key = 1,               // 唯一id
        caller = 2,             // 执行域
        listener = 3,            // 侦听函数
        listenerLong = 4            // 侦听长按函数
    }

    type LongEventInfo = [EventDispatcher, number, any, Function, Function];

    const enum ScoreNoticeType {
        teamBattle = 0,            //战队 争夺战副本
        nineScore = 0,          // 九天之巅积分
        adventurePoint,     // 奇遇点
        Xuanhuo,            //战队 玄火副本
    }

    const enum ScoreNoticeInfoFields {
        type,      // 类型
        value,          // 值
    }

    type ScoreNoticeInfo = [ScoreNoticeType, number];

    const enum FeedSkillType {
        magicWeapon,        // 精灵
        magicPet,           // 宠物
        immortals,          // 神兵
        wing,               // 仙翼
        fashion,            // 时装
        tianZhu,            // 天珠
        yiJie,              // 义戒
        yiJieEx,            // 义戒专属
        XinWu,              // 信物
        XinWuUp,            // 信物进阶
        doll,               // 仙娃
        dollUp,             // 仙娃进阶
        guangHuan,          // 光环

    }

    const enum FeedAttrType {
        view,               // 主界面
        yiJie,              // 义戒
        yiJieEx,            // 义戒专属
        XinWu,              // 信物
        XinWuUp,            // 信物进阶
        doll,               // 仙娃
        dollUp,             // 仙娃进阶
        eat,                // 进补
        guangHuan,          // 光环
    }


    // 今日不再提醒ID
    const enum NoMoreNoticeId {
        none,
        xiLianSeniorUnlock = 1,         // 洗炼紫色以上品质未锁定
    }

    // 单次奖励ID
    const enum OnceRewardId {
        realName = 46001,           // 实名认证
        officialAccount = 46002,        // 关注公众号
        vipFree = 46003,                // 免费VIP
    }

    const enum amountParamFields {
        titText = 0,/*标题*/
        btnTest = 1,/*按钮文字*/
        id = 2,/*道具id (* 必备)*/
        count = 3,/*数量（显示在物品右下角） (* 必备)*/
        price = 4,/*现价 itemId#数量 (* 必备)*/
        buyid = 5,/*兑换道具对应id*/
        max = 6,
        fid = 7,/*回调*/
    }
    type amountParam = [string, string, number, number, Configuration.idCount, number, number, number];
}
