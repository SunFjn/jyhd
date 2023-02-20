declare const enum MapDefinitions {
    CAMERA_FAR = 0xFFFFFF,
    CAMERA_NEAR = 0,

    /** 每行Z间距 */
    PER_ROW_Z = 4000,

    /** ((最大屏高 / 每行高) +１) * PER_ROW_Z */
    MAX_SCREEN_Z = ((2048 / 16) + 1) * PER_ROW_Z,

    /** 层间最大Z间距 */
    MAX_LAYER_Z = 500,

    TOP_LAYER_Z = 1000
}

// 动画龙骨动画大类
declare const enum AvatarAniBigType {
    clothes = "clothes",                                            // 角色时装,怪物
    weapon = "weapon",                                              // 武器
    wing = "wing",                                                  // 翅膀
    immortals = "immortals",                                        // 精灵
    aura = "aura",                                                  // 法阵 
    tianZhuFront = "tianZhuFront",                                  // 天珠 - 身前(小类,游戏场景中播放动画,位置缩放都使用这个)
    tianZhuBack = "tianZhuBack",                                    // 天珠 - 身后(小类,游戏场景中播放动画,位置缩放都使用这个)
    tianZhu = "tianZhu",                                            // 天珠（只有在reset方法使用该类型）
    guangHuan = "guangHuan",                                        // 光环
    effect = "effect",                                              // 特效
    other = "other",                                                // 其他自定义的龙骨资源
}

// 清理龙骨重置参数
declare const enum ClearSkeletonParamsEnum {
    Scale,
    Offest,
    PlaybackRate,
    All
}

declare const enum LayerDepth {
    /** 风景层 */
    LANDSCAPE_LAYER_Z = MapDefinitions.CAMERA_FAR - 1000, //保证最远的层最少要离相机最远视面1000以上
    /** 地图层 */
    MAP_LAYER_Z = LANDSCAPE_LAYER_Z - MapDefinitions.MAX_LAYER_Z,
    /** 背景层 */
    BACKGROUND_LAYER_Z = MAP_LAYER_Z - MapDefinitions.MAX_LAYER_Z,
    /** 怪物层 */
    MONSTER_LAYER_Z = BACKGROUND_LAYER_Z - MapDefinitions.MAX_SCREEN_Z,
    /** 玩家角色层 */
    PLAYER_LAYER_Z = MONSTER_LAYER_Z - MapDefinitions.MAX_LAYER_Z, //MAX_SCREEN_Z能保证在屏的最大高度下,所有物体都在背景层之前,
    /** 主角层 */
    MASTER_LAYER_Z = PLAYER_LAYER_Z - MapDefinitions.MAX_LAYER_Z,
    /** 采集物,机关层 */
    APPARATUS_LAYER_Z = MONSTER_LAYER_Z - MapDefinitions.MAX_LAYER_Z,
    /** NPC层 */
    NPC_LAYER_Z = APPARATUS_LAYER_Z - MapDefinitions.MAX_LAYER_Z,
    /** 掉落层 */
    PACKAGE_LAYER_Z = NPC_LAYER_Z - MapDefinitions.MAX_LAYER_Z,
    /** 前景层 */
    FOREGROUND_LAYER_Z = PACKAGE_LAYER_Z - MapDefinitions.MAX_SCREEN_Z - 100000,//MAX_SCREEN_Z能保证在屏的最大高度下,所有物体都在背景层之前
}

declare const enum LayerType {
    Root,
    Landscape,
    Map,
    BackgroundDecorate,// 2D装饰 高宽等于视域 后景 只高于地图
    Background,
    Monster,
    Player,
    Master,
    Apparatus,
    Npc,
    Package,
    Title,
    Foreground,
    Literal,
    ForegroundDecorate,// 2D装饰 高宽等于视域 前景 高于地图所有 低于HUD
}

declare const enum StageType {
    Map3D,// 3D地图层
    BackgroundDecorate,// 2D装饰 高宽等于视域 后景 只高于地图
    Map2D,// 2D地图层  跟随地图变动
    ForegroundDecorate,// 2D装饰 高宽等于视域 前景 高于地图所有 低于HUD
    Hud,// 扩展层 [喊话气泡,]
}

declare const enum RoleType {
    Unknown = 0,
    Monster = 1,
    Pet = 2,
    Player = 3,
    Master = 4,
    Package = 5,
    Npc = 6,
    Doll = 7
}

declare const enum RoleState {
    /** 空状态 */
    DUMMY = 0x00,
    /** 待机 */
    IDLE = 0x01,
    /** 打坐 */
    MEDITATION = 0x02,
    /** 对话 */
    TALK = 0x04,
    /** 战备 */
    FIGHTING = 0x08,
    /** 收集 */
    BUSY = 0x10,
    /** 受伤 */
    STRIKE = 0x20,
    /** 移动 */
    MOVING = 0x40,
    /** 攻击 */
    ATTACK = 0x80,
    /** 跳跃 */
    JUMP = 0x100,
    /** 占领(只有死亡才会打断)*/
    OCCUPY = 0x200,
    /** 死亡 */
    DEATH = 0x400,
    /** 复活 */
    REVIVE = 0x800,
    /** 进场 */
    SHOW = 0x1000,
    /** 跟随 */
    FOLLOW = 0x2000,
    /** 进入 */
    ENTER = 0x4000,
    /** 离开 */
    LEAVE = 0x8000
}

declare const enum ActionType {
    /**跑步*/
    PAO = "run",
    /**跳跃*/
    TIAOYUE = "tiaoyue",
    /**待机*/
    DAIJI = "stand",
    /**休闲*/
    XIUXIAN = "xiuxian",
    /**受击*/
    SHOUJI = "hit",
    /**死亡*/
    SIWANG = "dead",
    /**攻击*/
    GONGJI = "attack",
    /**变身*/
    BIANSHEN = "bianshen",
    /**战备*/
    ZHANBEI = "zhanbei",
    /**飞行*/
    FEIXING = "feixing",
    /**飞行 待机*/
    FEIXING_DJ = "feixing_dj",
    /**飞行 受击*/
    FEIXING_SJ = "feixing_sj",
    /**飞行 攻击1*/
    FEIXING_GJ1 = "feixing_gj1",
    /**骑*/
    QIZUO = "zq_daiji",
    /**技能1*/
    JINENG1 = "skill_01",
    /**技能2*/
    JINENG2 = "skill_05",
    JINENG3 = "skill_08",
    /**游泳*/
    YOU = "you",
    /**浮*/
    FU = "fu",
    /**单人打坐*/
    DAZUO01 = "dazuo1",
    /**双人打坐*/
    DAZUO02 = "dazuo2",

    ATTACK1 = "1",
    ATTACK2 = "2",
    ATTACK3 = "3",

    SKILL01 = "skill_01",
    SKILL02 = "skill_02",
    SKILL03 = "skill_03",
    SHOW = "show",
    SPRINT = "sprint",
    SHOW2 = "show_1000",

    // 技能特效统一名称-新
    SKILL = "skill",

    // 技能-新
    // ATTACK_1_1 = "attack_1_1",
    // ATTACK_1_2 = "attack_1_2",
    // ATTACK_1_3 = "attack_1_3",


    attack_01 = "attack_01",
    attack_02 = "attack_02",
    attack_03 = "attack_03",
    attack_04 = "attack_04",
    attack_05 = "attack_05",

    // 当前播放动画-无（判断使用，无实际动作）
    NONE = "none",

    // 默认播放0动作
    Default = "default",
    // 第三方默认动作
    Animation = "animation",

}

declare const enum RoleStateAction {
    /**激活状态*/
    ACTIVATE = 0,
    /**退出状态*/
    DEACTIVATE = 1,
    /**更新状态*/
    UPDATE = 2,
    /**申请切换*/
    APPLY = 3
}

declare const enum ActionOpcode {
    /**激活状态*/
    ACTIVATE = 0,
    /**退出状态*/
    DEACTIVATE = 1,
    /**更新状态*/
    UPDATE = 2,
    /**申请切换*/
    APPLY = 3
}

declare const enum MountPoint {
    Weapon = "youshou",
    Scabbard = "beibu1",
    Wing = "beibu2",
    Head = "toubu",
    Immortals = "xianqi",
}

declare const enum ShaderRenderElementConstant {
    //Laya.Shader3D.PERIOD_RENDERELEMENT
    OffsetMatrix = 0,
}

declare const enum ShaderMaterialConstant {
    //Laya.Shader3D.PERIOD_MATERIAL
    AlphaTestValue = 0,
    Texture0 = 1,
    Texture1 = 2,
    Texture2 = 3,
    Texture3 = 4,
    Texture4 = 5,
    Texture5 = 6,
    Texture6 = 7,
    Texture7 = 8,
    ColorMatrix = 9,
    DiscardArray = 10,
    TilingOffset = 11,
}

declare const enum DesignConstant {
    BackgroundWidth = 2048,
    BackgroundHeight = 1536,
    BackgroundSplitSize = 512,
    BackgroundCols = BackgroundWidth / BackgroundSplitSize,
    BackgroundRows = BackgroundHeight / BackgroundSplitSize
}

// 货币道具ID
declare const enum MoneyItemId {
    glod = 90140001,	// 代币券
    bind_gold = 90240001,	// 绑定代币券
    copper = 90330001,	// 金币
    exp = 90430001,	    // 经验
    zq = 90530001,	// 魔力
    fwjh = 91740001,  //玉荣精华
    honor = 92340001,   // 荣誉
    lingqi = 91830001, //药草值
    fugui = 91930001,  //粮食值
    adventurePoint = 92740001,  //奇遇点
    adventureYunli = 92830001,  //奇遇运力
    factionContribute = 93430001, //仙盟贡献
    factionExp = 93730001,  //仙盟经验
    clanCoin = 94430001,  //战队币
    FairyCoin = 94150001,	// 代币券
}

declare const enum TipsFlags {
    Self = 0x01,
    Crit = 0x02,
    Pet = 0x04,
    Miss = 0x08,
    Heal = 0x10,
    Doll = 0x20,
}

declare const enum TalismanState {
    withouract = 0,     //未激活
    cantup = 1,  //不能升级
    maxlevel = 2,     //已满级
    up = 3,        //可升级
    active = 4,      //可激活
}

declare const enum BossState {
    challenge = 0,
    bossdead = 1,
    withoutcount = 2,
    cantchallenge = 3,
}

declare const enum LogFlags {
    ResourcePool,
    HealthPoint,
    BossHome,
    TeamBattle,

    Treasure,
    Store,
    GameCenter,
    BagCtrl,
    DungeonCtrl,
    DungeonModel,
    BossHomeCtrl,
    SceneCtrl,
    Nine,           // 九天之巅
    Xuanhuo,
}

declare const enum RecordStep {
    StartLoadLib = 1,           // 开始加载类库
    LoadedAllLib = 2,           // 所有类库加载完成
    WebSocketEnabled = 3,       // WEBSOCKET是否可用
    StartLoadConfig = 4,        // 开始加载配置文件
    StartConnectServer = 5,     // 开始连接服务器
    ServerConnected = 6,       // 连接服务器成功
    LoginSuccess = 7,           // 登录成功
    GotoCreateRole = 8,         // 创角跳转
    LoginFailed = 9,                // 登录失败
    StartCreateRole = 10,             // 开始创角
    RoleCreated = 11,               // 创角成功
    StartEnterScene = 12,           // 开始进入场景（首次进入记录）
    StartLoadCommon = 13,           // 开始加载通用资源
    CommonLoaded = 14,              // 通用资源加载完成
    EnterScene = 15,             // 进入场景（首次进入记录）
}

declare const enum SelectTargetType {
    Dummy,
    Monster,
    Player,
    Npc,
}

type Cooldwon = [
    number, //id
    number, //timeout
    number  //cd
];

// 新手引导触发类型
declare const enum GuideTriggerType {
    PlayerLevel = 1,        // 玩家等级，参数为玩家等级
    GuideComplete = 2,      // 引导完成，参数为引导id
    TaskComplete = 3,       // 任务完成，参数为任务id（不带“m”）
    MissionLevel = 4,       // 天关等级，参数为天关等级
    RegisteUI = 5,             // 注册，参数为精灵id
    TaskDoing = 6,              // 任务正在执行，参数为任务id
    TaskIDEqual = 7,            // 任务ID等于
}

// 新手引导完成类型
declare const enum GuideCompleteType {
    ClickTarget = 1,        // 点击目标，参数为精灵id
    CDComplete = 2,         // 倒计时结束，参数为时间（暂未实现）
    PlayerLevel = 3,        // 玩家等级，参数为玩家等级
    GuideComplete = 4,      // 引导完成，参数为引导id
    TaskComplete = 5,       // 任务完成，参数为任务id
    MissionLevel = 6,       // 天关等级，参数为天关等级
    PanelClose = 7,         // 关闭面板，参数为面板id
    TaskDoing = 8,          // 任务正在执行，参数为任务id
}

// 新手引导精灵ID
declare const enum GuideSpriteId {
    LEFT_BOTTOM_PANEL_BTN = 1,     // 左下天关入口按钮
    MISSION_CHALLENGE_BTN = 2,  // 天关面板挑战按钮
    BOTTOM_PLAYER_BTN = 3,      // 底部角色按钮
    PLAYER_EQUIP_BTN = 4,       // 角色面板一键装备按钮
    BOTTOM_TAB_RETURN_BTN = 5,      // 切页返回按钮
    BOTTOM_MAGIC_ART_BTN = 6,      // 底部仙法按钮
    MAGIC_ART_ONE_KEY_BTN = 7,      // 仙法一键升级按钮
    TALISMAN_TAB_BTN = 8,           // 圣物切页按钮
    TALISMAN_ITEM_0 = 9,            // 圣物列表第一项
    TALISMAN_ALERT_UP_BTN = 10,     // 圣物弹窗下方激活按钮
    TALISMAN_ALERT_CLOSE_BTN = 11,      // 圣物弹窗右上角关闭
    BOTTOM_MAGIC_PET_BTN = 12,          // 底部仙灵按钮
    MAGIC_WEAPON_TAB_BTN = 13,          // 精灵切页按钮
    MAGIC_WEAPON_FEED_ONE_KEY_BTN = 14,     // 精灵培养一键按钮
    MAGIC_WEAPON_RANK_BTN = 15,         // 精灵面板进阶切页按钮
    MAGIC_WEAPON_RANK_ONE_KEY_BTN = 16,     // 精灵进阶一键祝福按钮
    MAGIC_WEAPON_REFINE_BTN = 17,       // 精灵修炼切页按钮
    MAGIC_WEAPON_REFINE_ONE_KEY_BTN = 18,       // 精灵修炼一键修炼按钮
    MAGIC_WEAPON_FAZHEN_BTN = 19,           // 精灵法阵切页按钮
    MGAIC_WEAPON_FAZHEN_ACTIVE_BTN = 20,        // 精灵法阵激活按钮
    MAGIC_PET_TAB_BTN = 21,                     // 宠物切页按钮
    MAGIC_PET_FEED_BTN = 22,                    // 宠物面板培养切页按钮
    MGAIC_PET_FEED_ONE_KEY_BTN = 23,            // 宠物培养一键按钮
    MAGIC_PET_RANK_BTN = 24,                    // 宠物面板进阶切页按钮
    MAGIC_PET_RANK_ONE_KEY_BTN = 25,            // 宠物进阶一键按钮
    MAGIC_PET_REFINE_BTN = 26,                  // 宠物面板修炼切页按钮
    MAGIC_PET_REFINE_ONE_KEY_BTN = 27,          // 宠物修炼一键按钮
    MAGIC_PET_FAZHEN_BTN = 28,                  // 宠物法阵切页按钮
    MAGIC_PET_FAZHEN_ACTIVE_BTN = 29,           // 宠物法阵激活按钮
    BOTTOM_DUANZAO_BTN = 30,                // 底部锻造按钮
    INTENSIVE_TAB_BTN = 31,                     // 强化面板切页按钮
    INTENSIVE_ONE_KEY_BTN = 32,                 // 强化面板一键按钮
    STONE_TAB_BTN = 33,                         // 仙石面板切页按钮
    STONE_ONE_KEY_BTN = 34,                     // 仙石面板一键按钮
    BOTTOM_BAG_BTN = 35,                    // 底部背包按钮
    BAG_SMELT_TAB_BTN = 36,                     // 背包熔炼切页按钮
    BAG_SMELT_ONE_KEY_BTN = 37,                 // 背包熔炼一键按钮
    BAG_SMELT_SUCCESS_ALERT_CLOSE_BTN = 38,     // 背包熔炼成功弹框关闭按钮
    BOTTOM_XIUXIAN_BTN = 39,                // 底部修仙按钮
    BORN_TAB_BTN = 40,                          // 觉醒切页按钮
    BORN_GOTO_BTN = 41,                         // 觉醒面板前往按钮
    BOTTOM_XIANFU_BTN = 42,                     // 底部仙府-家园按钮
    RIGHT_BOTTOM_DUNGEON_ENTER_BTN = 43,        // 右下副本入口按钮
    SINGLE_DUNGEON_TAB_BTN = 44,                // 单人副本切页按钮
    BIG_TOWER_TAB_BTN = 45,                     // 大荒古塔切页按钮
    BIG_TOWER_CHALLENGE_BTN = 46,               // 大荒古塔挑战按钮
    DAILY_DUNGEON_TAB_BTN = 47,                 // 每日试炼切页按钮
    COIN_DUNGEON_CHALLENGE_BTN = 48,            // 哥布林王国挑战按钮
    ZQ_DUNGEON_CHALLENGE_BTN = 49,              // 泰拉矿场挑战按钮
    MAGIC_WEAPON_CHALLENGE_BTN = 50,            // 精灵副本挑战按钮
    MAGIC_PET_CHALLENGE_BTN = 51,               // 宠物副本挑战按钮
    RUNE_COPY_TAB_BTN = 52,                     // 未央幻境切页按钮
    RUNE_COPY_CHALLENGE_BTN = 53,               // 未央幻境挑战按钮
    MULTI_DUNGEON_TAB_BTN = 54,                 // 多人副本切页按钮
    TEAM_BATTLE_TAB_BTN = 55,                   // 组队切页按钮
    TEAM_BATTLE_MATCH_BTN = 56,                 // 组队匹配按钮
    RIGHT_BOTTOM_BOSS_ENTER_BTN = 57,                 // 右下BOSS入口按钮
    THIS_SERVER_TAB_BTN = 58,                   // 本服切页按钮
    SINGLE_BOSS_TAB_BTN = 59,                   // 单人BOSS切页按钮
    SINGLE_BOSS_ITEM0_CHALLENGE_BTN = 60,       // 单人BOSS第一个单元项的挑战按钮
    MULTI_BOSS_TAB_BTN = 61,                    // 多人BOSS切页按钮
    MULTI_BOSS_CHALLENGE_BTN = 62,              // 多人BOSS挑战按钮
    OTHER_SERVER_TAB_BTN = 63,                  // 跨服BOSS切页按钮
    THREE_WORLDS_TAB_BTN = 64,                  // 三界BOSS切页按钮
    THREE_WORLDS_CHALLENGE_BTN = 65,            // 三界BOSS挑战按钮
    BOSS_HOME_TAB_BTN = 66,                     // BOSS之家切页按钮
    BOSS_HOME_CHALLENGE_BTN = 67,               // BOSS之家挑战按钮
    RIGHT_BOTTOM_DAILY_ENTER_BTN = 68,          // 右下日常入口按钮
    EXERCISE_TAB_BTN = 69,                      // 历练切页按钮
    ACTIVITY_ALL_TAB_BTN = 70,                  // 活动列表切页按钮
    DAILY_DEMON_TAB_BTN = 71,                   // 每日降妖切页按钮
    DAILY_DEMON_ON_HOOK_GET_BTN = 72,           // 每日降妖挂机领取按钮
    DAILY_DEMON_BOSS_GET_BTN = 73,              // 每日降妖BOSS领取按钮
    RIGHT_BOTTOM_ADVENTURE_ENTER_BTN = 74,      // 右下奇遇入口按钮
    ADVENTURE_TAB_BTN = 75,                     // 奇遇切页按钮
    ADVENTURE_ITEM0_GOTO_BTN = 76,              // 奇遇第一项前往按钮
    ADVENTURE_SHOP_TAB_BTN = 77,                // 奇遇商店切页按钮
    BOTTOM_CHAT_ENTER = 78,                     // 下方聊天入口
    CHAT_BACK_BTN = 79,                         // 聊天返回按钮
    LEFT_TOP_TREASURE_BTN = 80,                 // 左上探索按钮
    TREASURE_TAB_BTN = 81,                      // 探索切页按钮
    TREASURE_EQUIP_TAB_BTN = 82,                // 装备探索切页按钮
    TREASURE_DIANFENG_TAB_BTN = 83,             // 巅峰探索切页按钮
    TREASURE_ZHIZUN_TAB_BTN = 84,               // 至尊探索切页按钮
    TREASURE_TALISMAN_TAB_BTN = 85,             // 圣物探索切页按钮
    TREASURE_EQUIP_BTN = 86,                    // 装备探索寻一次按钮
    TREASURE_DIANFENG_BTN = 87,                 // 巅峰探索寻一次按钮
    TREASURE_ZHIZUN_BTN = 88,                   // 至尊探索寻一次按钮
    TREASURE_TALISMAN_BTN = 89,                 // 圣物探索寻一次按钮
    TREASURE_BAG_TAB_BTN = 90,                  // 探索仓库切页按钮
    TREASURE_BAG_ALL_TAKE_BTN = 91,             // 探索仓库全部取出按钮
    TREASURE_CHANGE_TAB_BTN = 92,               // 探索兑换切页按钮
    CHAT_SEND_BTN = 93,                         // 聊天发送按钮
    GOLD_BODY_ENTER_BTN = 94,                   // 角色界面金身入口按钮
    GOLD_BODY_TRAINING_BTN = 95,                // 金身修炼按钮
    BOTTOM_TASK_BG = 96,                        // 底部任务栏背景
    MISSION_AWARD_ITEM = 97,                    // 天关奖励
    BOTTOM_CashEquip_BTN = 98,                  // 底部现金装备入口
    BOTTOM_CashEquip_SELL_BTN = 99,             // 现金装备 第一个出售按钮
    BOTTOM_CashEquip_SELLON_BTN = 100,          // 现金装备 确定出售按钮
    BOTTOM_CashEquip_MONEY_TIPS = 101,          // 现金装备 出售成功提示
    BOTTOM_CashEquip_MONEY_BTN = 102,           // 现金装备 弹出余额按钮
    BOTTOM_CashEquip_MONEY_TIXIAN = 103,        // 现金装备 提现提示
    BOTTOM_CashEquip_TIANGUAN10 = 104,          // 现金装备 天关10按钮
    BOTTOM_CashEquip_CLOSE = 105,               // 现金装备 关闭按钮
    BOTTOM_CashEquip_CLOSE2 = 106,               // 现金装备 关闭详情页按钮

    WIN_PANEL_LEAVE_BTN = 107,                  // 胜利页面 离开按钮
    CURRENCY_INSPIRE_BTN = 108,                  // 通用鼓舞按钮 金币副本 真气副本
}

declare const enum NumberValue {
    MIN_SAFE_INTEGER = -9007199254740991,
    MAX_SAFE_INTEGER = 9007199254740991,
    MIN_VALUE = 5e-324,
    MAX_VALUE = 1.7976931348623157e+308,
}

declare const enum KeyboardValue {
    NUMBER_0 = 48,
    NUMBER_1 = 49,
    NUMBER_2 = 50,
    NUMBER_3 = 51,
    NUMBER_4 = 52,
    NUMBER_5 = 53,
    NUMBER_6 = 54,
    NUMBER_7 = 55,
    NUMBER_8 = 56,
    NUMBER_9 = 57,
    A = 65,
    B = 66,
    C = 67,
    D = 68,
    E = 69,
    F = 70,
    G = 71,
    H = 72,
    I = 73,
    J = 74,
    K = 75,
    L = 76,
    M = 77,
    N = 78,
    O = 79,
    P = 80,
    Q = 81,
    R = 82,
    S = 83,
    T = 84,
    U = 85,
    V = 86,
    W = 87,
    X = 88,
    Y = 89,
    Z = 90,
    F1 = 112,
    F2 = 113,
    F3 = 114,
    F4 = 115,
    F5 = 116,
    F6 = 117,
    F7 = 118,
    F8 = 119,
    F9 = 120,
    F10 = 121,
    F11 = 122,
    F12 = 123,
    F13 = 124,
    F14 = 125,
    F15 = 126,
    NUMPAD = 21,
    NUMPAD_0 = 96,
    NUMPAD_1 = 97,
    NUMPAD_2 = 98,
    NUMPAD_3 = 99,
    NUMPAD_4 = 100,
    NUMPAD_5 = 101,
    NUMPAD_6 = 102,
    NUMPAD_7 = 103,
    NUMPAD_8 = 104,
    NUMPAD_9 = 105,
    NUMPAD_ADD = 107,
    NUMPAD_DECIMAL = 110,
    NUMPAD_DIVIDE = 111,
    NUMPAD_ENTER = 108,
    NUMPAD_MULTIPLY = 106,
    NUMPAD_SUBTRACT = 109,
    SEMICOLON = 186,
    EQUAL = 187,
    COMMA = 188,
    MINUS = 189,
    PERIOD = 190,
    SLASH = 191,
    BACKQUOTE = 192,
    LEFTBRACKET = 219,
    BACKSLASH = 220,
    RIGHTBRACKET = 221,
    QUOTE = 222,
    ALTERNATE = 18,
    BACKSPACE = 8,
    CAPS_LOCK = 20,
    COMMAND = 15,
    CONTROL = 17,
    DELETE = 46,
    ENTER = 13,
    ESCAPE = 27,
    PAGE_UP = 33,
    PAGE_DOWN = 34,
    END = 35,
    HOME = 36,
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40,
    SHIFT = 16,
    SPACE = 32,
    TAB = 9,
    INSERT = 45,
}

/**
 * 通用事件类型
 */
declare namespace modules.common {
    const enum LayaEvent {
        MOUSE_DOWN = "mousedown",
        MOUSE_UP = "mouseup",
        CLICK = "click",
        RIGHT_MOUSE_DOWN = "rightmousedown",
        RIGHT_MOUSE_UP = "rightmouseup",
        RIGHT_CLICK = "rightclick",
        MOUSE_MOVE = "mousemove",
        MOUSE_OVER = "mouseover",
        MOUSE_OUT = "mouseout",
        MOUSE_WHEEL = "mousewheel",
        ROLL_OVER = "mouseover",
        ROLL_OUT = "mouseout",
        DOUBLE_CLICK = "doubleclick",
        CHANGE = "change",
        CHANGED = "changed",
        RESIZE = "resize",
        ADDED = "added",
        REMOVED = "removed",
        DISPLAY = "display",
        UNDISPLAY = "undisplay",
        ERROR = "error",
        COMPLETE = "complete",
        LOADED = "loaded",
        PROGRESS = "progress",
        INPUT = "input",
        RENDER = "render",
        OPEN = "open",
        MESSAGE = "message",
        CLOSE = "close",
        KEY_DOWN = "keydown",
        KEY_PRESS = "keypress",
        KEY_UP = "keyup",
        FRAME = "enterframe",
        DRAG_START = "dragstart",
        DRAG_MOVE = "dragmove",
        DRAG_END = "dragend",
        ENTER = "enter",
        SELECT = "select",
        BLUR = "blur",
        FOCUS = "focus",
        VISIBILITY_CHANGE = "visibilitychange",
        FOCUS_CHANGE = "focuschange",
        PLAYED = "played",
        PAUSED = "paused",
        STOPPED = "stopped",
        START = "start",
        END = "end",
        ENABLE_CHANGED = "enablechanged",
        ACTIVE_IN_HIERARCHY_CHANGED = "activeinhierarchychanged",
        COMPONENT_ADDED = "componentadded",
        COMPONENT_REMOVED = "componentremoved",
        LAYER_CHANGED = "layerchanged",
        HIERARCHY_LOADED = "hierarchyloaded",
        RECOVERED = "recovered",
        RELEASED = "released",
        LINK = "link",
        LABEL = "label",
        FULL_SCREEN_CHANGE = "fullscreenchange",
        DEVICE_LOST = "devicelost",
        MESH_CHANGED = "meshchanged",
        MATERIAL_CHANGED = "materialchanged",
        WORLDMATRIX_NEEDCHANGE = "worldmatrixneedchanged",
        ANIMATION_CHANGED = "animationchanged",
        TRIGGER_ENTER = "triggerenter",
        TRIGGER_STAY = "triggerstay",
        TRIGGER_EXIT = "triggerexit",
        TRAIL_FILTER_CHANGE = "trailfilterchange",
        DOMINO_FILTER_CHANGE = "dominofilterchange",

    }

    const enum CommonEventType {
        RESIZE_UI = "RESIZE_UI",

        // 登录成功
        LOGIN_SUCCESS = "LOGIN_SUCCESS",
        // 更新服务器列表
        SERVER_LIST_UPDATE = "SERVER_LIST_UPDATE",
        // 选择服务器
        SELECT_SERVER = "SELECT_SERVER",

        // 创角失败
        CREATE_ROLE_FAIL = "CREATE_ROLE_FAIL",

        // 打开面板或弹窗（windowmanager调用open的时候发送）
        PANEL_OPEN = "PANEL_OPEN",
        // 关闭面板或弹窗（windowmanager调用close的时候发送）
        PANEL_CLOSE = "PANEL_CLOSE",

        // 面板打开事件（添加到舞台时发送）
        PANEL_OPENED = "PANEL_OPENED",
        // 面板关闭事件（从舞台移除时发送）
        PANEL_CLOSED = "PANEL_CLOSED",

        // 声音状态改变事件
        SOUND_ENABLE_CHANGE = "SOUND_ENABLE_CHANGE",

        SKILL_EFFECT_RECYCLE = "SKILL_EFFECT_RECYCLE",
        // -----------------------------------------  场景 -------------------------------
        // 进入场景
        SCENE_ENTER = "SCENE_ENTER",
        // 入屏添加道具
        SCENE_ADD_ITEMS = "SCENE_ADD_ITEMS",
        // 入屏添加玩家
        SCENE_ADD_HUMANS = "SCENE_ADD_HUMANS",
        // 入屏添加怪物
        SCENE_ADD_MONSTERS = "SCENE_ADD_MONSTERS",
        // 入屏添加NPC
        SCENE_ADD_NPCS = "SCENE_ADD_NPCS",
        // 离屏删除道具
        SCENE_REMOVE_ITEMS = "SCENE_REMOVE_ITEMS",
        // 离屏删除玩家
        SCENE_REMOVE_HUMANS = "SCENE_REMOVE_HUMANS",
        // 离屏删除怪物
        SCENE_REMOVE_MONSTERS = "SCENE_REMOVE_MONSTERS",
        // 离屏删除NPC
        SCENE_REMOVE_NPCS = "SCENE_REMOVE_NPCS",
        // 采集状态更新
        SCENE_NPC_GATHER_STATE_UPDATE = "SCENE_NPC_GATHER_STATE_UPDATE",
        // 触发的NPC更新
        SCENE_TRIGGERED_NPC_UPDATE = "SCENE_TRIGGERED_NPC_UPDATE",
        // 采集结束
        SCENE_GATHER_END = "SCENE_GATHER_END",
        // -----------------------------------------  场景 -------------------------------

        // -----------------------------------------  玩家 ----------------------------------
        // 基本属性更新
        PLAYER_BASE_ATTR_UPDATE = "PLAYER_BASE_ATTR_UPDATE",
        // 客户端准备完成
        PLAYER_CLIENT_READY = "PLAYER_CLIENT_READY",
        // 总属性更新
        PLAYER_TOTAL_ATTR_UPDATE = "PLAYER_TOTAL_ATTR_UPDATE",
        // 更新等级
        PLAYER_UPDATE_LEVEL = "PLAYER_UPDATE_LEVEL",
        // 更新经验
        PLAYER_UPDATE_EXP = "PLAYER_UPDATE_EXP",
        // 更新货币
        PLAYER_UPDATE_MONEY = "PLAYER_UPDATE_MONEY",
        // 更新魔力
        PLAYER_UPDATE_ZQ = "PLAYER_UPDATE_ZQ",
        // 更新天梯荣誉
        PLAYER_UPDATE_HONOR = "PLAYER_UPDATE_HONOR",
        // 更新战力
        PLAYER_UPDATE_FIGHT = "PLAYER_UPDATE_FIGHT",
        // 装备数据初始化
        PLAYER_EQUIPS_INITED = "PLAYER_EQUIPS_INITED",
        // 穿戴装备
        PLAYER_WEAR_EQUIP = "PLAYER_WEAR_EQUIP",
        // 穿戴多个装备
        PLAYER_WEAR_EQUIPS = "PLAYER_WEAR_EQUIPS",
        //更新转升等级
        PLAYER_BORN_LEV = "PLAYER_BORN_LEV",
        // 更新玩家血量
        PLAYER_UPDATE_HP = "PLAYER_UPDATE_HP",
        // 更新玩家总血量
        PLAYER_UPDATE_MAX_HP = "PLAYER_UPDATE_MAX_HP",
        //获取玩家离线收益
        GET_OUTLINE_INFO_REPLY = "GET_OUTLINE_INFO_REPLY",
        // 更新PK模式PK
        PLAYER_UPDATE_PK_MODE = "PLAYER_UPDATE_PK_MODE",
        // 选择目标变化
        PLAYER_TARGET_CHANGE = "PLAYER_TARGET_CHANGE",
        // 触发NPC
        PLAYER_TRIGGER_NPC = "PLAYER_TRIGGER_NPC",
        // 更新角色职业
        PLAYER_UPDATE_OCC = "PLAYER_UPDATE_OCC",
        // 更新角色名字
        PLAYER_UPDATE_NAME = "PLAYER_UPDATE_NAME",
        // -----------------------------------------  玩家 ----------------------------------

        // -----------------------------------------  背包 -------------------------------
        // 背包数据初始化
        BAG_DATA_INITED = "BAG_DATA_GOT",
        // 增加
        BAG_ADD_ITEM = "BAG_ADD_ITEM",
        // 改变数量
        BAG_CHANGE_NUM = "BAG_CHANGE_NUM",
        // 删除
        BAG_REMOVE_ITEM = "BAG_REMOVE_ITEM",
        // 背包更新
        BAG_UPDATE = "BAG_UPDATE",
        // 熔炼更新
        SMELT_UPDATE = "SMELT_UPDATE",
        //熔炼成功提示
        SMELT_SUCCEED = "SMELT_SUCCEED",
        // 切换熔炼条件
        SELECT_SMELT_UPDATE = "SELECT_SMELT_UPDATE",
        // 现金装备 增加
        BAG_ADD_ITEM_CashEquip = "BAG_ADD_ITEM_CashEquip",


        // -----------------------------------------  背包 -------------------------------

        // -----------------------------------------  任务 -------------------------------
        // 任务信息更新
        TASK_UPDATED = "TASK_UPDATED",
        // -----------------------------------------  任务 -------------------------------

        // -----------------------------------------  邮件 -------------------------------
        // 单个邮件更新
        EMAIL_SINGLE_UPDATE = "EMAIL_SINGLE_UPDATE",
        // 邮件列表更新
        EMAIL_LIST_UPDATE = "EMAIL_LIST_UPDATE",
        // -----------------------------------------  邮件 -------------------------------

        // -----------------------------------------  宠物 -------------------------------
        // 宠物更新
        MAGIC_PET_INITED = "MAGIC_PET_INITED",
        // 宠物更新
        MAGIC_PET_UPDATE = "MAGIC_PET_UPDATE",
        //宠物更换外观
        MAGIC_PET_RANK_SHOWID = "MAGIC_PET_RANK_SHOWID",
        //宠物幻化更换外观
        MAGIC_PET_HUANHUA_SHOWID = "MAGIC_PET_HUANHUA_SHOWID",
        // 宠物更新
        MAGIC_PET_ZIDONG = "MAGIC_PET_ZIDONG",
        // -----------------------------------------  宠物 -------------------------------

        // -----------------------------------------  天关 -------------------------------
        // 更新层数
        MISSION_UPDATE_LV = "MISSION_UPDATE_LV",
        // 更新波数
        MISSION_UPDATE_WARE = "MISSION_UPDATE_WARE",
        // 更新已领奖层数
        MISSION_UPDATE_AWARD_LV = "MISSION_UPDATE_AWARD_LV",
        // 更新排行榜
        MISSION_UPDATE_RANK = "MISSION_UPDATE_RANK",
        // 自动
        MISSION_UPDATE_AUTO = "MISSION_UPDATE_AUTO",
        //更新玩家移动地点
        MISSION_MOVE_POS_UPDATE = "MISSION_MOVE_POS_UPDATE",
        //更新天关奖励返回
        MISSION_UPDATE = "MISSION_UODATE",
        // -----------------------------------------  天关 -------------------------------

        // -----------------------------------------  副本 -------------------------------
        // 副本结算
        DUNGEON_RESULT = "DUNGEON_RESULT",
        // 副本鼓舞
        DUNGEON_INSPIRE_UPDATE = "DUNGEON_INSPIRE_UPDATE",
        // 副本次数、难度更新
        DUNGEON_TIMES_UPDATE = "DUNGEON_TIMES_UPDATE",
        // 副本开始战斗广播
        DUNGEON_BROADCAST_BEGIN_COMBAT = "DUNGEON_BROADCAST_BEGIN_COMBAT",
        // 副本结束战斗广播
        DUNGEON_BROADCAST_END_COMBAT = "DUNGEON_BROADCAST_END_COMBAT",
        // 副本怪物波数广播
        DUNGEON_BROADCAST_COPY_MONSTER_WARE = "DUNGEON_BROADCAST_COPY_MONSTER_WARE",
        // 副本收益广播
        DUNGEON_BROADCAST_COPY_INCOME = "DUNGEON_BROADCAST_COPY_INCOME",
        // 副本星级广播
        DUNGEON_BROADCAST_COPY_STAR = "DUNGEON_BROADCAST_COPY_STAR",
        // 副本更新收益记录
        DUNGEON_UPDATE_INCOME_RECORD = "DUNGEON_UPDATE_INCOME_RECORD",
        // 副本更新参与奖励
        DUNGEON_UPDATE_JOIN_AWARD = "DUNGEON_UPDATE_JOIN_AWARD",
        // BOSS信息更新
        DUNGEON_BOSS_UPDATE = "DUNGEON_BOSS_UPDATE",
        // BOSS伤害排行更新
        DUNGEON_BOSS_RANKS_UPDATE = "DUNGEON_BOSS_RANKS_UPDATE",
        // BOSS次数更新
        DUNGEON_BOSS_TIMES_UPDATE = "DUNGEON_BOSS_TIMES_UPDATE",
        //次元攻坚战boss选择更新
        BOSS_SELECT_UPDATE = "Boss_Select_Updata",
        //次元攻坚战boss击杀信息更新
        BOSS_KILL_INFO_UPDATE = "Boss_Lill_info_Updata",
        // 添加BOSS TIP
        DUNGEON_BOSS_REVIVE_TIP = "DUNGEON_BOSS_REVIVE_TIP",
        // BOSS死亡重生推送
        DUNGEON_BOSS_DEAD_REVIVE = "DUNGEON_BOSS_DEAD_REVIVE",
        // 更新场景状态
        DUNGEON_SCENE_STATE_UPDATE = "DUNGEON_SCENE_STATE_UPDATE",
        //boss之家选择boss事件
        BOSS_HOME_SELECT = "Boss_Home_Select",
        // -----------------------------------------  副本 -------------------------------

        // -----------------------------------------  金身 -------------------------------
        //金身初始化
        GOLD_BODY_INITED = "GOLD_BODY_INITED",
        //金身更新
        GOLD_BODY_UPDATE = "GOLD_BODY_UPDATE",
        // //金身修炼
        // GOLD_BODY_REFINE = "GOLD_BODY_REFINE",
        // //不败金身修炼
        // GOLD_BODY_RISE = "GOLD_BODY_RISE",
        // -----------------------------------------  金身 -------------------------------

        // -----------------------------------------  签到 -------------------------------
        //获取签到信息
        GET_SIGN = "GET_SIGN",
        //签到返回
        SIGN_REPLY = "SIGN_REPLY",
        // -----------------------------------------  签到 -------------------------------

        // -----------------------------------------  单人boss -------------------------------
        //获取单人BOSS
        GET_SINGLE_BOSS = "GET_SINGLE_BOSS",
        //更新单人BOSS
        UPDATE_SINGLE_BOSS = "UPDATE_SINGLE_BOSS",
        // -----------------------------------------  单人boss -------------------------------

        // -----------------------------------------  功能开启 -------------------------------
        // 功能开启更新
        FUNC_OPEN_UPDATE = "FUNC_OPEN_UPDATE",
        FUNC_OPEN_ASSIGN_UPDATE = "FUNC_OPEN_ASSIGN_UPDATE",
        FUNC_OPEN_ASSIGN_REPLY = "FUNC_OPEN_ASSIGN_REPLY",
        // -----------------------------------------  功能开启 -------------------------------

        // -----------------------------------------  七日礼 -------------------------------
        SEVEN_DAY_INFO_UPDATA = "SEVEN_DAY_INFO_UPDATA",
        // -----------------------------------------  七日礼 -------------------------------


        // -----------------------------------------  仙石 -------------------------------
        STONE_UPDATA = "STONE_UPDATA",
        UP_MASTER = "UP_MASTER",
        UP_EFFECT = "UP_EFFECT",
        ONEKEY_UP_EFFECT = "ONEKEY_UP_EFFECT",
        GET_EQUIP = "GET_EQUIP",
        DESTORY_DIA = "DESTORY_DIA",
        SELECT_PIT = "SELECT_PIT",
        // -----------------------------------------  仙石 -------------------------------


        // -----------------------------------------  精灵 -------------------------------
        MAGIC_WEAPON_UPDATE = "MAGIC_WEAPON_UPDATE",
        MAGIC_WEAPON_HUANHUA_SHOWID = "MAGIC_WEAPON_HUANHUA_SHOWID",
        // 宠物更新
        MAGIC_WEAPON_ZIDONG = "MAGIC_WEAPON_ZIDONG",
        // -----------------------------------------  精灵 -------------------------------

        // -----------------------------------------  多人BOSS -------------------------------
        // BOSS关注数组更新
        MULTI_BOSS_FOLLOWS_UPDATE = "MULTI_BOSS_FOLLOWS_UPDATE",
        // -----------------------------------------  多人BOSS -------------------------------

        // -----------------------------------------  觉醒 -------------------------------
        BORN_UPDATE = "BORN_UPDATE",
        // -----------------------------------------  觉醒 -------------------------------

        //-----------------------------------------大荒------------------------------
        UPDATE_COPY_DAHUANG = "UPDATE_COPY_DAHUANG",
        GET_COPY_DAHUANG = "GET_COPY_DAHUANG",

        // ----------------------------------------- 技能系统 -------------------------------
        //技能初始化
        SKILL_INITED = "SKILL_INITED",
        //技能更新
        SKILL_UPDATE = "SKILL_UPDATE",
        //技能界面打开
        MAGIC_ART_OPEN = "MAGIC_ART_OPEN",
        // ----------------------------------------- 技能系统 -------------------------------

        // ----------------------------------------- 圣物系统 -------------------------------
        //圣物信息更新
        UPDATE_AMULET_INFO_REPLAY = "UPDATE_AMULET_INFO_REPLAY",
        //获取圣物信息
        GET_AMULET_INFO_REPLAY = "GET_AMULET_INFO_REPLAY",
        //升级圣物返回
        REFINE_AMULET_REPLAY = "REFINE_AMULET_REPLAY",
        // ----------------------------------------- 圣物系统 -------------------------------

        //----------------------------------------- 强化 -------------------------------
        INTENSIVE_UPDATE = "INTENSIVE_UPDATE",
        INTENSIVE_SUCCESS = "INTENSIVE_SUCCESS",
        UPGRADE_SUCCESS = "UPGRADE_SUCCESS",
        //----------------------------------------- 强化 -------------------------------
        // ----------------------------------------- 合成分解 -------------------------------
        //合成返回
        COMPOSE_REPLY = "COMPOSE_REPLY",
        //分解返回
        RESOLVE_REPLY = "RESOLVE_REPLY",
        //添加装备
        ADD_EQUIP = "ADD_EQUIP",
        UNLOAD_EQUIP = "UNLOAD_EQUIP",
        // ----------------------------------------- 合成分解 -------------------------------

        //----------------------------------------- 红点事件 -------------------------------
        // 红点事件
        RED_POINT = "RED_POINT",
        //----------------------------------------- 红点 -------------------------------

        //----------------------------------------- 历练 -------------------------------
        LILIAN_UPDATA = "LILIAN_UPDATA",
        LILIAN_UPGRADE = "LILIAN_UPGRADE",
        LILIAN_UPDATA_TASK_LIST = "LILIAN_UPDATA_TASK_LIST",
        //----------------------------------------- 历练 -------------------------------


        //----------------------------------------- 在线礼包 -------------------------------
        UPDATE_ONLINE_REWARD_REPLY = "UPDATE_ONLINE_REWARD_REPLY",
        AWARD_REPLY = "AWARD_REPLY",
        //----------------------------------------- 在线礼包 -------------------------------


        // ---------------------------------------- 仙位系统 -------------------------------

        //仙位更新
        MAGIC_POSITION_UPDATE = "MAGIC_POSITION_UPDATE",
        //仙位任务更新
        MAGIC_POSITION_TASK_UPDATE = "MAGIC_POSITION_TASK_UPDATE",
        //仙位领取奖励
        MAGIC_POSITION_GET_AWARD = "MAGIC_POSITION_GET_AWARD",
        // ---------------------------------------- 仙位系统 -------------------------------

        //----------------------------------------- 三界BOSS -------------------------------
        // 副本更新BOSS排行记录
        THREE_WORLDS_UPDATE_BOSS_RANK_RECORD = "THREE_WORLDS_UPDATE_BOSS_RANK_RECORD",
        //----------------------------------------- 三界BOSS -------------------------------


        // ---------------------------------------- 排行榜 -------------------------------
        RANK_UPDATE = "RANK_UPDATE",
        GET_ACTOR_RANK_SHOW_REPLY = "GET_ACTOR_RANK_SHOW_REPLY",
        GET_ACTOR_RANK_DATA_REPLY = "GET_ACTOR_RANK_DATA_REPLY",

        // ---------------------------------------- 神兵系统 -------------------------------
        SHENBING_UPDATE = "SHENBING_UPDATE",
        SBSHENGJI_UPDATE = "SBSHENGJI_UPDATE",
        SBFUHUN_UPDATA = "SBFUHUN_UPDATA",
        SBHUANHUA_UPDATA = "SBHUANHUA_UPDATA",
        SBCHANGE_HUANHUA = "SBCHANGE_HUANHUA",

        // ---------------------------------------- 神兵系统 -------------------------------
        // ---------------------------------------- 仙翼系统 -------------------------------
        WING_UPDATE = "WING_UPDATE",
        XYSHENGJI_UPDATE = "XYSHENGJI_UPDATE",
        XYFUHUN_UPDATA = "SBFUHUN_UPDATA",
        XYHUANHUA_UPDATA = "XYHUANHUA_UPDATA",
        XYCHANGE_HUANHUA = "XYCHANGE_HUANHUA",
        // ---------------------------------------- 仙翼系统 -------------------------------


        // ---------------------------------------- Boss之家系统 -------------------------------

        //boss之家更新boss归属者
        BOSS_OWN_UPDATE = "BOSS_OWN_UPDATE",
        //boss之家玩家入屏离屏信息
        BOSS_SHOW_PLAYER_INFO = "BOSS_SHOW_PLAYER_INFO",
        //boss之家更新次数信息
        BOSS_HOME_UPDATE_TIMES = "BOSS_HOME_UPDATE_TIMES",
        //boss之家更新攻击信息
        BOSS_ATTACK_UPDATE = "BOSS_ATTACK_UPDATE",
        //boss之家更新玩家移动地点
        BOSS_MOVE_POS_UPDATE = "BOSS_MOVE_POS_UPDATE",
        // ---------------------------------------- Boss之家系统 -------------------------------

        // ---------------------------------------- 探索 -------------------------------
        //探索返回
        RUN_XUNBAO_REPLY = "RUN_XUNBAO_REPLY",
        TASK_XUNBAO_ALL_REPLY = "TASK_XUNBAO_ALL_REPLY",
        TASK_XUNBAO_LIST_REPLY = "TASK_XUNBAO_LIST_REPLY",
        SEVER_BROADCAST_LIST = "SEVER_BROADCAST_LIST",
        SELF_BROADCAST_LIST = "SELF_BROADCAST_LIST",
        TIME_LEFT = "TIME_LEFT",
        UPDATE_XUNBAOINFO = "BLESSING_UPDATE",
        UPDATE_XUNBAOUI = "UPDATE_XUNBAOUI",
        XUNBAO_EFFECT = "XUNBAO_EFFECT",
        XUNBAO_EXCHANGE_REPLY = "XUNBAO_EXCHANGE_REPLY",
        XUNBAO_EXCHANGE_REPLY2 = "XUNBAO_EXCHANGE_REPLY2",
        XUNBAO_HINTLIST = "XUNBAO_HINTLIST",


        // ---------------------------------------- 探索 -------------------------------

        // ----------------------------------------- 月卡 -------------------------------
        GET_MONTH_CARD_INFO_REPLY = "GET_MONTH_CARD_INFO_REPLY",
        GET_MONTH_CARD_REWARD_REPLY = "GET_MONTH_CARD_REWARD_REPLY",
        UPDATE_MONTH_CARD_INFO = "UPDATE_MONTH_CARD_INFO",
        BUY_MALL_ITEM_REPLY = "BUY_MALL_ITEM_REPLY",
        // ----------------------------------------- 月卡 -------------------------------


        // ----------------------------------------- 代币券周卡 -------------------------------
        GET_WEEK_YUANBAO_CARD_INFO_REPLY = "GET_WEEK_YUANBAO_CARD_INFO_REPLY",
        GET_WEEK_YUANBAO_CARD_REWARD_REPLY = "GET_WEEK_YUANBAO_CARD_REWARD_REPLY",
        UPDATE_WEEK_YUANBAO_CARD_INFO = "UPDATE_WEEK_YUANBAO_CARD_INFO",
        // ----------------------------------------- 代币券周卡 -------------------------------

        // ----------------------------------------- 仙玉周卡 -------------------------------
        GET_WEEK_XIANYU_CARD_INFO_REPLY = "GET_WEEK_XIANYU_CARD_INFO_REPLY",
        GET_WEEK_XIANYU_CARD_REWARD_REPLY = "GET_WEEK_XIANYU_CARD_REWARD_REPLY",
        UPDATE_WEEK_XIANYU_CARD_INFO = "UPDATE_WEEK_XIANYU_CARD_INFO",
        // ----------------------------------------- 仙玉周卡 -------------------------------

        // ----------------------------------------- 福利周卡 -------------------------------
        GET_WEEK_FULI_CARD_INFO_REPLY = "GET_WEEK_FULI_CARD_INFO_REPLY",
        GET_WEEK_FULI_CARD_REWARD_REPLY = "GET_WEEK_FULI_CARD_REWARD_REPLY",
        UPDATE_WEEK_FULI_CARD_INFO = "UPDATE_WEEK_FULI_CARD_INFO",
        // ----------------------------------------- 福利周卡 -------------------------------

        // ----------------------------------------- 主角光环 -------------------------------
        GET_HERO_AURA_INFO_REPLY = "GET_HERO_AURA_INFO_REPLY",
        GET_HERO_AURA_REWARD_REPLY = "GET_HERO_AURA_REWARD_REPLY",
        UPDATE_HERO_AURA_INFO = "UPDATE_HERO_AURA_INFO",
        // ----------------------------------------- 主角光环 -------------------------------


        // ---------------------------------------- 组队副本 -------------------------------

        //组队副本更新挑战次数
        TEAM_BATTLE_TIMES_UPDATE = "TEAM_BATTLE_TIMES_UPDATE",
        //组队副本更新最高纪录
        TEAM_BATTLE_MAX_RECORD = "TEAM_BATTLE_MAX_RECORD",
        //组队副本更新匹配玩家
        TEAM_BATTLE_MATCH_UPDATE = "TEAM_BATTLE_MATCH_UPDATE",
        //组队副本更新匹配状态
        TEAM_BATTLE_MATCH_STATE_UPDATE = "TEAM_BATTLE_MATCH_STATE_UPDATE",
        //组队副本更新挑战波次
        TEAM_BATTLE_LEVEL_UPDATE = "TEAM_BATTLE_LEVEL_UPDATE",
        //匹配房间解散
        TEAM_COPY_ROOM_UPDATE = "TEAM_COPY_ROOM_UPDATE",
        //更新组队副本被邀请列表
        TEAM_COPY_ASK_LIST_UPDATE = "TEAM_COPY_ASK_LIST_UPDATE",
        //队员被踢
        TEAM_COPY_MEMBER_KICKED = "TEAM_COPY_MEMBER_KICKED",
        //可邀请成员刷新
        TEAM_COPY_CAN_INVITE_MEMBER_UPDATE = "TEAM_COPY_CAN_INVITE_MEMBER_UPDATE",
        // ---------------------------------------- 组队副本 -------------------------------

        // ---------------------------------------- 商城 -------------------------------
        //购买返回
        PURCHASE_REPLY = "PURCHASE_REPLY",
        GET_MALLINFO = "GET_MALLINFO",
        UPDATE_MALLINFO = "UPDATE_MALLINFO",
        STORE_XIANFU_UPDATE = "STORE_XIANFU_UPDATE",//仙府-家园商店
        // ---------------------------------------- 商城 -------------------------------

        // ---------------------------------------- SVIP -------------------------------
        //SVIP更新信息
        VIP_UPDATE = "VIP_UPDATE",
        //SVIP成功获取奖励
        VIP_GET_REWARD = "VIP_GET_REWARD",
        //特权信息更新
        UPDATE_PRIVILEGE = "UPDATE_PRIVILEGE",
        // ---------------------------------------- VIP -------------------------------
        //VIP更新信息
        VIPF_UPDATE = "VIPF_UPDATE",
        //VIP成功获取奖励
        VIPF_GET_REWARD = "VIPF_GET_REWARD",
        // ---------------------------------------- 首充 -------------------------------
        FIRST_PAY_UPDATE = "FIRST_PAY_UPDATE",
        FAILURE_SHOW_FIRST_PAY = "FAILURE_SHOW_FIRST_PAY",
        FIRST_PAY_UPDATE_GETED_STATUS = "FIRST_PAY_UPDATE_GETED_STATUS",
        // ---------------------------------------- 首充 -------------------------------
        // ---------------------------------------- 充值系统 -------------------------------
        GET_RECHARGE_INFO_REPLY = "GET_RECHARGE_INFO_REPLY",
        UPDATE_RECHARGE_INFO = "UPDATE_RECHARGE_INFO",
        // ---------------------------------------- 充值系统 -------------------------------

        // ---------------------------------------- Buff -------------------------------
        UPDATE_BUFF_LIST = "UPDATE_BUFF_LIST",
        BUFF_NUMBER = "BUFF_NUMBER",
        // ---------------------------------------- Buff -------------------------------

        //-----------------------------------------扫荡挂机------------------------------
        SWEEPING_UPDATE = "SWEEPING_UPDATE",
        //-----------------------------------------扫荡挂机------------------------------

        //-----------------------------------------每日降妖------------------------------
        DAILY_DEMON_UPDATE = "DAILY_DEMON_UPDATE",
        //-----------------------------------------每日降妖------------------------------

        //-----------------------------------------未央幻境------------------------------
        RUNE_COPY_UPDATE = "RUNE_COPY_UPDATE",
        DIAL_UPDATE = "DIAL_UPDATE",
        DIAL_RESULT_UPDATE = "DIAL_RESULT_UPDATE",
        //-----------------------------------------未央幻境------------------------------

        //-----------------------------------------玉荣系统------------------------------
        RUNE_UPDATE = "RUNE_UPDATE",
        RUNE_COMPOSE_RP_UPDATE = "RUNE_COMPOSE_RP_UPDATE",
        RUNE_COMPOSE_UPDATE_SELECT_SMALL_HANDLER = "RUNE_COMPOSE_UPDATE_SELECT_SMALL_HANDLER",
        RUNE_COLLECT_UPDATE_SELECT_SMALL_HANDLER = "RUNE_COLLECT_UPDATE_SELECT_SMALL_HANDLER",
        RUNE_COMPOSE_FINISH_UPDATE = "RUNE_COMPOSE_FINISH_UPDATE",
        RUNE_DISMANTLE_FINISH_UPDATE = "RUNE_DISMANTLE_FINISH_UPDATE",
        RUNE_COLLECT_UPDATE_INFO = "RUNE_COLLECT_UPDATE_INFO",
        RUNE_UPDATE_SP_INFO = "RUNE_UPDATE_SP_INFO",
        RUNE_COLLCET_REFRESH_ITEM_DATA = "RUNE_COLLCET_REFRESH_ITEM_DATA",  //收集箱升级成功
        RUNE_INALY_SUCCEED = "RUNE_INALY_SUCCEED",                          //镶嵌成功
        RUNE_INALY_SELECT = "RUNE_INALY_SELECT",                            //切换选中
        RUNE_RESOLVE_SUCCEED = "RUNE_RESOLVE_SUCCEED",                      //切换选中
        RUNE_COMPOSE_SELECT_SMALL = "RUNE_COMPOSE_SELECT_SMALL",            //合成小类选中
        UPDATE_RUNE_COMPOSE_SHOW_DATA = "UPDATE_RUNE_COMPOSE_SHOW_DATA",    //更新选择要合成的数据
        UPDATE_COMPSOE_FINAL_LEVEL = "UPDATE_COMPSOE_FINAL_LEVEL",          //更新合成范文属性等级
        //-----------------------------------------玉荣系统------------------------------

        //----------------------------------------- 九天之巅 ------------------------------
        // 九天之巅排行榜更新
        NINE_RANKS_UPDATE = "NINE_RANKS_UPDATE",
        // 九天之巅个人信息更新
        NINE_COPY_INFO_UPDATE = "NINE_COPY_INFO_UPDATE",
        // 搜索对象更新
        NINE_SEARCH_OBJ_UPDATE = "NINE_SEARCH_OBJ_UPDATE",
        // 更新采集对象
        NINE_GATHER_OBJ_UPDATE = "NINE_GATHER_OBJ_UPDATE",
        // 更新积分
        NINE_SCORE_UPDATE = "NINE_SCORE_UPDATE",
        // 击败信息更新
        NINE_DEFEAT_UPDATE = "NINE_DEFEAT_UPDATE",
        //----------------------------------------- 九天之巅 ------------------------------

        //-----------------------------------------日充豪礼------------------------------
        DAY_PAY_UPDATE = "DAY_PAY_UPDATE",
        //-----------------------------------------日充豪礼------------------------------

        //-----------------------------------------累充豪礼------------------------------
        CUMULATE_PAY_UPDATE = "CUMULATE_PAY_UPDATE",
        //-----------------------------------------累充豪礼------------------------------

        //-----------------------------------------连充豪礼------------------------------
        CONTINUE_PAY_UPDATE = "CONTINUE_PAY_UPDATE",
        //-----------------------------------------连充豪礼------------------------------
        //-----------------------------------------每日首充------------------------------
        EVERYDAY_FIRSTPAY_UPDATE = "EVERYDAY_FIRSTPAY_UPDATE",
        //-----------------------------------------每日首充------------------------------

        //-----------------------------------------聊天------------------------------
        CHAT_UPDATE = "CHAT_UPDATE",
        CHAT_BLACK_LIST_UPDATE = "CHAT_BLACK_LIST_UPDATE",
        CHECKED_FACE = "CHECKED_FACE",
        SELECT_CHAT_CHANNEL = "SELECT_CHAT_CHANNEL",
        OTHER_PLAYER_INFO = "OTHER_PLAYER_INFO",
        SEND_RESULT = "SEND_RESULT",
        FACTION_MESSAGE_UPDATE = "FACTION_MESSAGE_UPDATE",
        SYSTEM_MESSAGE_UPDATE = "SYSTEM_MESSAGE_UPDATE",
        JIUZHOU_MESSAGE_UPDATE = "JIUZHOU_MESSAGE_UPDATE",
        BENFU_MESSAGE_UPDATE = "BENFU_MESSAGE_UPDATE",

        MARRY_MESSAGE_UPDATE = "MARRY_MESSAGE_UPDATE",
        //-----------------------------------------聊天------------------------------

        //-----------------------------------------零元购------------------------------
        ZERO_BUY_UPDATE = "ZERO_BUY_UPDATE",
        //-----------------------------------------零元购------------------------------

        //-----------------------------------------消费赠礼------------------------------
        CONSUME_REWARD_UPDATE = "CONSUME_REWARD_UPDATE",
        //-----------------------------------------消费赠礼------------------------------
        //-----------------------------------------投资返利------------------------------
        INVEST_REWARD_UPDATE = "INVEST_REWARD_UPDATE",
        //-----------------------------------------投资返利------------------------------

        //-----------------------------------------仙府-家园------------------------------
        XIANFU_UPDATE = "XIANFU_SHENGJI_UPDATE",
        XIANFU_BUILD_UPDATE = "XIANFU_BUILD_UPDATE",
        XIANFU_PET_UPDATE = "XIANFU_PET_UPDATE",
        SELECT_XIANFU_AREA = "SELECT_XIANFU_AREA",
        HAND_BOOK_UPDATE = "HAND_BOOK_UPDATE",
        XIANFU_TASK_UPDATE = "XIANFU_TASK_UPDATE",
        XIANFU_EVENT_UPDATE = "XIANFU_EVENT_UPDATE",
        XIANFU_WIND_WATER_UPTATE = "XIANFU_WIND_WATER_UPTATE",
        XIANFU_AREA_UPTATE = "XIANFU_AREA_UPTATE",
        XIANFU_ALL_RP_EVENT = "XIANFU_ALL_RP_EVENT",
        XIANFU_SKILL_UPDATE = "XIANFU_SKILL_UPDATE",
        XIANFU_REENTER = "XIANFU_REENTER",
        XIANFU_CLICK = "XIANFU_CLICK",
        XIANFU_SHOP_OPEN = "XIANFU_SHOP_OPEN",
        //-----------------------------------------仙府-家园------------------------------

        //-----------------------------------------宠物法阵------------------------------
        FZHUANHUA_UPDATA = "FZHUANHUA_UPDATA",
        FZCHANGE_HUANHUA = "FZCHANGE_HUANHUA",
        //-----------------------------------------宠物法阵------------------------------

        //-----------------------------------------精灵法阵------------------------------
        WEAPONFZHUANHUA_UPDATA = "WEAPONFZHUANHUA_UPDATA",
        WEAPONFZCHANGE_HUANHUA = "WEAPONFZCHANGE_HUANHUA",
        //-----------------------------------------精灵法阵------------------------------

        //-----------------------------------------开服冲榜下------------------------------
        SPRINT_RANK_TASK_UPDATE = "SPRINT_RANK_TASK_UPDATE",
        //-----------------------------------------开服冲榜下------------------------------

        //-----------------------------------------开服冲榜上------------------------------
        SPRINT_RANK_UPDATE = "SPRINT_RANK_UPDATE",
        //-----------------------------------------开服冲榜上------------------------------

        //-----------------------------------------  天梯  ------------------------------
        // 更新天梯积分
        LADDER_SCORE_UPDATE = "LADDER_SCORE_UPDATE",
        // 更新天梯参与奖励状态
        LADDER_JOIN_AWARD_UPDATE = "LADDER_JOIN_AWARD_UPDATE",
        // 更新天梯功勋奖励状态
        LADDER_FEAT_AWARD_UPDATE = "LADDER_FEAT_AWARD_UPDATE",
        // 更新次数
        LADDER_TIMES_UPDATE = "LADDER_TIMES_UPDATE",
        // 更新天梯信息
        LADDER_INFO_UPDATE = "LADDER_INFO_UPDATE",
        // 更新天梯排行
        LADDER_RANKS_UPDATE = "LADDER_RANKS_UPDATE",
        // 更新天梯自动匹配
        LADDER_AUTO_MATCH_UPDATE = "LADDER_AUTO_MATCH_UPDATE",
        //-----------------------------------------  天梯  ------------------------------

        //-----------------------------------------活动列表刷新界面------------------------------
        UPDATE_ACTIVITY_STATE = "UPDATE_ACTIVITY_STATE",
        //-----------------------------------------活动列表刷新界面------------------------------

        //-----------------------------------------充值转盘刷新界面------------------------------
        PAYREWARD_UPDATE = "PAYREWARD_UPDATE",
        PAYREWARD_RUNREPLY = "PAYREWARD_RUNREPLY",
        PAY_REWARD_EFFECT = "PAY_REWARD_EFFECT",
        PAYREWARD_OPENRECORD = "PAYREWARD_OPENRECORD",
        PAYREWARD_BROADCAST_LIST = "PAYREWARD_BROADCAST_LIST",
        PAYREWARD_SHOWHTML = "PAYREWARD_SHOWHTML",
        //-----------------------------------------充值转盘刷新界面------------------------------

        //-----------------------------------------古神问道------------------------------
        GUSHEN = "GUSHEN",
        //-----------------------------------------古神问道------------------------------

        //-----------------------------------------  活动预告  ------------------------------
        ACTIVITY_PRE_SCENE_UPDATE = "ACTIVITY_PRE_SCENE_UPDATE",
        //-----------------------------------------  活动预告  ------------------------------

        //-----------------------------------------  天降财宝  ------------------------------
        DAY_DROP_TREASURE_GATHERCOUNT_UPDATE = "DAY_DROP_TREASURE_GATHERCOUNT_UPDATE",
        DAY_DROP_TREASURE_UADATETIME_UPDATE = "DAY_DROP_TREASURE_UADATETIME_UPDATE",
        DAY_DROP_TREASURE_CAIJILOSE = "DAY_DROP_TREASURE_CAIJILOSE",
        //-----------------------------------------  天降财宝  ------------------------------

        //-----------------------------------------全民狂欢------------------------------
        KUANGHUAN = "KUANGHUAN",
        //-----------------------------------------全民狂欢------------------------------

        //-----------------------------------------  昆仑瑶池  ------------------------------
        KUNLUN_REWARD_EFFECT = "KUNLUN_REWARD_EFFECT",
        KUNLUN_UPDATE = "KUNLUN_UPDATE",
        KUNLUN_ZHUAN = "KUNLUN_ZHUAN",
        KUNLUN_SHOWSOAP = "KUNLUN_SHOWSOAP",
        KUNLUN_GETDROPRECORD = "KUNLUN_GETDROPRECORD",
        KUNLUN_SHOUYI = "KUNLUN_SHOUYI",
        KUNLUN_BAG_ADD_ITEM = "KUNLUN_BAG_ADD_ITEM",
        KUNLUN_STATE_UPDATE = "KUNLUN_STATE_UPDATE",
        //-----------------------------------------  昆仑瑶池  ------------------------------

        //-----------------------------------------每日累充------------------------------
        CUMULATE_PAY2_UPDATE = "CUMULATE_PAY_UPDATE",
        //-----------------------------------------每日累充------------------------------
        CUMULATE_PAY3_UPDATE = "CUMULATE_PAY3_UPDATE",
        //-----------------------------------------每日累充------------------------------

        //-----------------------------------------云梦秘境------------------------------
        YUNMENGMIJING_UPDATE = "YUNMENGMIJING_UPDATE",
        YUNMENGMIJING_CLICK = "YUNMENGMIJING_CLICK",
        //-----------------------------------------云梦秘境------------------------------

        //-----------------------------------------特惠礼包------------------------------
        DISCOUNT_GIFT_UPDATE = "DISCOUNT_GIFT_UPDATE",
        DISCOUNT_GIFT_TIMER = "DISCOUNT_GIFT_TIMER",
        //-----------------------------------------特惠礼包------------------------------

        //-----------------------------------------仙女护送------------------------------
        FAIRY_UPDATE = "FAIRY_UPDATE",
        FAIRY_LOG_UPDATE = "FAIRY_LOG_UPDATE",
        CURR_LOOK_PLAYER_UPDATE = "CURR_LOOK_PLAYER_UPDATE",
        //-----------------------------------------仙女护送------------------------------

        //-----------------------------------------累计消费 每日------------------------------
        DAY_CONSUME_REWARD_UPDATE = "DAY_CONSUME_REWARD_UPDATE",

        //-----------------------------------------  奇遇  ------------------------------
        // 更新正在进行中的事件列表
        ADVENTURE_EVENT_LIST_UPDATE = "ADVENTURE_EVENT_LIST_UPDATE",
        // 更新下一次事件触发时间戳
        ADVENTURE_NEXT_TRIGGER_TIME_UPDATE = "ADVENTURE_NEXT_TRIGGER_TIME_UPDATE",
        // 更新探险次数
        ADVENTURE_YUNLI_UPDATE = "ADVENTURE_YUNLI_UPDATE",
        // 更新奇遇点
        ADVENTURE_POINT_UPDATE = "ADVENTURE_POINT_UPDATE",
        // 更新兑换提醒列表
        ADVENTURE_HINT_LIST_UPDATE = "ADVENTURE_HINT_LIST_UPDATE",
        // 更新单个奇遇事件
        ADVENTURE_EVENT_UPDATE = "ADVENTURE_EVENT_UPDATE",
        // 奇遇掉落更新
        ADVENTURE_DROP_ITEMS_UPDATE = "ADVENTURE_DROP_ITEMS_UPDATE",
        // 奇遇是否有新事件更新
        ADVENTURE_HAS_NEW_EVENT_UPDATE = "ADVENTURE_HAS_NEW_EVENT_UPDATE",
        //-----------------------------------------  奇遇  ------------------------------

        //-----------------------------------------  新手引导  ------------------------------
        // 初始化剩余的新手引导
        GUIDE_REST_INITED = "GUIDE_REST_INITED",
        // 完成一个引导
        GUIDE_COMPLETE = "GUIDE_COMPLETE",
        // 注册一个UI
        GUIDE_REGISTE_UI = "GUIDE_REGISTE_UI",
        // 删除一个UI
        GUIDE_REMOVE_UI = "GUIDE_REMOVE_UI",
        // 点击目标
        GUIDE_CLICK_TARGET = "GUIDE_CLICK_TARGET",
        // 倒计时结束
        GUIDE_CD_COMPLETE = "GUIDE_CD_COMPLETE",
        // 更新当前引导
        GUIDE_CUR_UPDATE = "GUIDE_CUR_UPDATE",
        //-----------------------------------------  新手引导  ------------------------------

        //-----------------------------------------  界面变强提示 ------------------------------
        TIPBIANQIANG_UPDATE = "TIPBIANQIANG_UPDATE",
        //-----------------------------------------  界面变强提示 ------------------------------

        //-----------------------------------------  仙盟 ------------------------------

        FACTION_LIST = "FACTION_LIST",
        FACTION_APPLY_POST_LIST = "FACTION_APPLY_POST_LIST",
        FACTION_RANK_LIST = "FACTION_RANK_LIST",
        FACTION_INFO = "FACTION_INFO",
        FACTION_JOIN_LIST = "FACTION_JOIN_LIST",
        FACTION_SHOW_OPERA_PANEL = "FACTION_SHOW_OPERA_PANEL",
        BAOZANG_INFO_UPDATE = "BAOZANG_INFO_UPDATE",
        BAOZANG_LIST_UPDATE = "BAOZANG_LIST_UPDATE",
        BAOZANG_HELP_LIST_UPDATE = "BAOZANG_HELP_LIST_UPDATE",
        FACTION_COPY_INFO = "FACTION_COPY_INFO",
        FACTION_COPY_DATA = "FACTION_COPY_DATA",
        FACTION_HURT_INFO = "FACTION_HURT_INFO",
        FACTION_SKILL_LIST = "FACTION_SKILL_LIST",
        FACTION_WEAL_UPDATE = "FACTION_WEAL_UPDATE",
        FACTION_TURN_LIST = "FACTION_TURN_LIST",
        FACTION_TURN_RESULT = "FACTION_TURN_RESULT",
        FACTION_REQUEST_LIST_UPDATE = "FACTION_REQUEST_LIST_UPDATE",
        //-----------------------------------------  仙盟 ------------------------------

        // ------------------------------云梦秘境------------------------------
        YUNMENGMIJING_JUDGE_AWARD_UPDATE = "YUNMENGMIJING_JUDGE_AWARD_UPDATE",//云梦秘境 BOSS结算奖励 参与
        YUNMENGMIJING_JUDGE_AWARD_FINALLY = "YUNMENGMIJING_JUDGE_AWARD_FINALLY",//云梦秘境 BOSS结算奖励 最后一击
        //------------------------------功能预览------------------------------

        //功能预览 更新领取状态
        ACTION_PREVIEW_UPDATE = "ACTION_PREVIEW_UPDATE",
        ACTION_PREVIEW_AWARD_UPDATE = "ACTION_PREVIEW_AWARD_UPDATE",
        ACTION_PREVIEW_EFFECT = "ACTION_PREVIEW_EFFECT",//新功能飞入动画事件
        ACTION_PREVIEW_RESIZE_UI = "ACTION_PREVIEW_RESIZE_UI",//新功能飞入动画事件
        ACTION_PREVIEW_FUNC_OPEN_UPDATE = "ACTION_PREVIEW_FUNC_OPEN_UPDATE",//功能预览 监听功能开启
        ACTION_PREVIEW_ENTER = "ACTION_PREVIEW_ENTER",//新功能飞入完毕后 抛出是否 飞出收益加成动画

        //------------------------------称号------------------------------
        PLAYER_TITLE_UPDATE = "PLAYER_TITLE_UPDATE",//称号界面刷新list
        PLAYER_TITLE_NOW_REFRESH = "PLAYER_TITLE_NOW_REFRESH",//当前称号刷新
        PLAYER_TITLE_OPENUPDATE = "PLAYER_TITLE_OPENUPDATE",//称号界面 展开称号属性 刷新list


        MIBAO_UPDATE_SELECTED = "MIBAO_UPDATE_SELECTED",//秘宝选择刷新
        UPDATE_MIBAO_SELECTED_ATTR = "UPDATE_MIBAO_SELECTED_ATTR",//刷新选择的秘宝的属性

        //------------------------------飞升------------------------------
        SOARING_RANK_UPDATE = "SOARING_RANK_UPDATE",//飞升榜界面刷新
        SOARING_RANK_ITEM_UPDATE = "SOARING_RANK_ITEM_UPDATE",//飞升榜界面刷新Item
        SOARING_RANK_LIONQU_UPDATE = "SOARING_RANK_LIONQU_UPDATE",//飞升榜奖励领取刷新

        CLOSE_TIPS_SHOUCHONG = "CLOSE_TIPS_SHOUCHONG",//关闭首充弹窗
        CLOSE_TIPS_BANG = "CLOSE_TIPS_BANG",//关闭榜单相关弹窗
        SOARING_RANK_CHANG = "SOARING_RANK_CHANG",//飞升榜积分 变动
        SPRING_RANK_CHANG = "SOARING_RANK_CHANG",//开服冲榜积分 变动
        SOARING_RANK_HUODONG_CHANG = "SOARING_RANK_HUODONG_CHANG",//,飞升榜活动改变
        SPRINT_RANK_HUODONG_CHANG = "SPRINT_RANK_HUODONG_CHANG",//开服冲榜活动改变

        //-----------------------------------------  竞技场 ------------------------------
        // 竞技场次数更新
        ARENA_TIMES_UPDATE = "ARENA_TIMES_UPDATE",
        // 竞技场挑战对象更新
        ARENA_OBJS_UPDATE = "ARENA_OBJS_UPDATE",
        // 竞技场排行榜更新
        ARENA_RANKS_UPDATE = "ARENA_RANKS_UPDATE",
        // 竞技场挑战记录更新
        ARENA_RECORDS_UPDATE = "ARENA_RECORDS_UPDATE",
        //-----------------------------------------  竞技场 ------------------------------

        //------------------------------累计充值（飞升榜）------------------------------
        SOARING_CUMULATEPAY_UPDATE = "SOARING_CUMULATEPAY_UPDATE",//累计充值（飞升榜）界面刷新
        //------------------------------单笔充值（飞升榜）------------------------------
        SOARING_SINGLEPAY_UPDATE = "SOARING_SINGLEPAY_UPDATE",//单笔充值（飞升榜）界面刷新
        //------------------------------消费赠礼（飞升榜）------------------------------
        SOARING_DATCONSUMEREWARD_UPDATE = "SOARING_DATCONSUMEREWARD_UPDATE",//消费赠礼（飞升榜） 界面刷新
        //------------------------------抢购礼包（飞升榜）------------------------------
        SOARING_PANICBUYINGGIFT_UPDATE = "SOARING_PANICBUYINGGIFT_UPDATE",//抢购礼包（飞升榜） 界面刷新
        SOARING_PANICBUYINGGIFT_COUNT_UPDATE = "SOARING_PANICBUYINGGIFT_COUNT_UPDATE",//抢购礼包（飞升榜）剩余可购买数刷新
        SOARING_PANICBUYINGGIFT_NEXT_DAY_UPDATE = "SOARING_PANICBUYINGGIFT_NEXT_DAY_UPDATE",//


        //------------------------------特惠礼包（飞升榜）------------------------------
        SOARING_SPECIALGIFT_UPDATE = "SOARING_SPECIALGIFT_UPDATE",//特惠礼包（飞升榜） 界面刷新
        SOARING_SPECIALGIFT_GETINFO = "SOARING_SPECIALGIFT_GETINFO",
        //------------------------------天天返利------------------------------
        SOARING_EVERTDATREDATE_UPDATE = "SOARING_EVERTDATREDATE_UPDATE",//特惠礼包（飞升榜） 界面刷新

        //-----------------------------------------  时装 ------------------------------
        // 时装信息更新
        FASHION_INFO_UPDATE = "FASHION_INFO_UPDATE",
        // 时装附魂成功
        FASHION_REFINE_SUCCESS = "FASHION_REFINE_SUCCESS",
        //-----------------------------------------  时装 ------------------------------

        //-----------------------------------------  天珠 ------------------------------
        // 天珠信息更新
        TIAN_ZHU_INFO_UPDATE = "TIAN_ZHU_INFO_UPDATE",
        // 天珠附魂成功
        TIAN_ZHU_REFINE_SUCCESS = "TIAN_ZHU_REFINE_SUCCESS",
        //-----------------------------------------  天珠 ------------------------------

        //-----------------------------------------  半月礼 ------------------------------
        // 时装信息更新
        HALF_MONTH_INFO_UPDATE = "HALF_MONTH_INFO_UPDATE",
        //-----------------------------------------  半月礼 ------------------------------

        //-----------------------------------------  洗炼 ------------------------------
        // 时装信息更新
        XI_LIAN_INFO_UPDATE = "XI_LIAN_INFO_UPDATE",
        //-----------------------------------------  洗炼 ------------------------------
        //----------------------------------------- 装备铸魂 -------------------------------
        EQUIPMENT_ZUHUN_UPDATE = "EQUIPMENT_ZUHUN_UPDATE",//铸魂数据刷新
        EQUIPMENT_ZUHUN_UP = "EQUIPMENT_ZUHUN_UP",//铸魂成功
        EQUIPMENT_ZUHUN_SHENGJIE = "EQUIPMENT_ZUHUN_SHENGJIE",//铸魂 升阶 成功
        //----------------------------------------- 装备套装 -------------------------------
        EQUIP_SUIT_UPDATE = "EQUIP_SUIT_UPDATE",

        //-----------------------------------------登录豪礼----------------------------------
        LOGIN_REWARD_UPADTE = "LOGIN_REWARD_UPADTE",

        //-----------------------------------------飞升 冲榜 转盘------------------------------

        //-----------------------------------------飞升 冲榜 转盘------------------------------

        //-----------------------------------------飞升 冲榜 夺宝------------------------------

        ROTARYTABLE_SOARING_UPDATE = "ROTARYTABLE_SOARING_UPDATE",
        ROTARYTABLE_SOARING_RUNREPLY = "ROTARYTABLE_SOARING_RUNREPLY",
        ROTARYTABLE_SOARING_EFFECT = "ROTARYTABLE_SOARING_EFFECT",
        ROTARYTABLE_SOARING_OPENRECORD = "ROTARYTABLE_SOARING_OPENRECORD",
        ROTARYTABLE_SOARING_BROADCAST_LIST = "ROTARYTABLE_SOARING_BROADCAST_LIST",
        ROTARYTABLE_SOARING_MYLIST = "ROTARYTABLE_SOARING_MYLIST",//个人排行
        ROTARYTABLE_SOARING_QULIST = "ROTARYTABLE_SOARING_QULIST",//区服排汗
        ROTARYTABLE_SOARING_SHOWHTML = "ROTARYTABLE_SOARING_SHOWHTML",
        //------------------------------单笔充值（返炽星魔锤）------------------------------
        CUMULATEPAY_SHENHUN_UPDATE = "CUMULATEPAY_SHENHUN_UPDATE",//单笔充值（返炽星魔锤）界面刷新
        //------------------------------单笔充值（返天珠）------------------------------
        CUMULATEPAY_TIANZHU_UPDATE = "CUMULATEPAY_TIANZHU_UPDATE",//单笔充值（返天珠） 界面刷新
        //------------------------------开服礼包------------------------------
        OPEN_AWARD_UPDATE = "OPEN_AWARD_UPDATE",
        //-----------------------------------------神器------------------------------
        SHENQI_UPDATE = "SHENQI_UPDATE",
        SHENQI_JIHUO = "SHENQI_JIHUO",
        //-----------------------------------------九州夺宝------------------------------
        ROTARYTABLE_JIUZHOU_UPDATE = "ROTARYTABLE_JIUZHOU_UPDATE",
        ROTARYTABLE_JIUZHOU_RUNREPLY = "ROTARYTABLE_JIUZHOU_RUNREPLY",
        ROTARYTABLE_JIUZHOU_EFFECT = "ROTARYTABLE_JIUZHOU_EFFECT",
        ROTARYTABLE_JIUZHOU_OPENRECORD = "ROTARYTABLE_JIUZHOU_OPENRECORD",
        ROTARYTABLE_JIUZHOU_BROADCAST_LIST = "ROTARYTABLE_JIUZHOU_BROADCAST_LIST",
        ROTARYTABLE_JIUZHOU_MYLIST = "ROTARYTABLE_JIUZHOU_MYLIST",//个人排行
        ROTARYTABLE_JIUZHOU_QULIST = "ROTARYTABLE_JIUZHOU_QULIST",//区服排汗
        ROTARYTABLE_JIUZHOU_SHOWHTML = "ROTARYTABLE_JIUZHOU_SHOWHTML",
        ROTARYTABLE_JIUZHOU_UPDATE_JACKPOT = "ROTARYTABLE_JIUZHOU_UPDATE_JACKPOT",
        //------------------------------消费赠礼（周末狂欢）------------------------------
        WEEK_CONSUME_UPDATE = "WEEK_CONSUME_UPDATE",
        WEEK_CONSUME_ITEM_UPDATE = "WEEK_CONSUME_ITEM_UPDATE",
        //-------------------------------------登录豪礼(周末狂欢)-----------------------------
        WEEK_LOGIN_UPDATE = "WEEK_LOGIN_UPDATE",
        //-------------------------------------单笔充值(周末狂欢)-----------------------------
        WEEK_SINGLE_PAY_UPDATE = "WEEK_SINGLE_PAY_UPDATE",
        //-------------------------------------累计充值(周末狂欢)-----------------------------
        WEEK_REPEAT_PAY_UPDATE = "WEEK_REPEAT_PAY_UPDATE",
        //-------------------------------------意见反馈-----------------------------
        FEED_BACK_UPDATE = "FEED_BACK_UPDATE",
        FEED_BACK_CLOSE = "FEED_BACK_CLOSE",
        //-------------------------------------至尊特权-----------------------------
        ZHIZUN_UPDATE = "ZHIZUN_UPDATE",
        //-------------------------------------公告 激活码-----------------------------
        ANNOUNCEMENT_UPDATE = "ANNOUNCEMENT_UPDATE",
        ANNOUNCEMENT_BACK = "ANNOUNCEMENT_BACK",
        //-------------------------------------限时礼包-----------------------------
        LIMIT_PACK_UPDATE = "LIMIT_PACK_UPDATE",
        LIMIT_PACK_BUY = "LIMIT_PACK_BUY",
        //-------------------------------------消费排行-----------------------------
        PAY_RANK_OPEN = 'PAY_RANK_OPEN',
        PAY_RANK_UPDATE = "PAY_RANK_UPDATE",
        //-------------------------------------邀请有礼-----------------------------
        INVITATION_UPDATE = "INVITATION_UPDATE",
        //-------------------------------------挂机收益-----------------------------
        SWEEPING_INCOME = "SWEEPING_INCOME",

        //----------------------------------------- 单次奖励 ------------------------------
        ONCE_REWARD_UPDATE = "ONCE_REWARD_UPDATE",
        //----------------------------------------- 单次奖励 ------------------------------

        //----------------------------------------- 实名认证 ------------------------------
        REAL_NAME_STATUS_CHANGE = "REAL_NAME_STATUS_CHANGE",
        //----------------------------------------- 实名认证 ------------------------------

        //----------------------------------------- 关注公众号 ------------------------------
        OFFICAL_ACCOUNT_STATUS_CHANGE = "OFFICAL_ACCOUNT_STATUS_CHANGE",
        //----------------------------------------- 仙玉 ------------------------------
        ZXIANYU_BROADCAST_LIST = "ZXIANYU_BROADCAST_LIST",//全服记录更新
        ZXIANYU_SELF_BROADCAST_LIST = "SELF_BROADCAST_LIST",//个人记录更新
        ZXIANYU__SHOWHTML = "ZXIANYU__SHOWHTML",//显示下一条全服记录数据
        ZXIANYU_REPLY = "ZXIANYU_REPLY",//取出
        ZXIANYU_ALL_REPLY = "ZXIANYU_ALL_REPLY",//全部取出
        ZXIANYU_EFFECT = "ZXIANYU_EFFECT",//动画
        ZXIANYU_UPDATE = "ZXIANYU_UPDATE",//仙玉界面界面信息刷新
        ZXIANYU_YUGE_UPDATE = "ZXIANYU_YUGE_UPDATE",//玉阁界面刷新
        ZXIANYU_FUYUAN_UPDATE = "ZXIANYU_FUYUAN_UPDATE",//福源信息刷新
        //----------------------------一元秒杀-----------------------
        ONEBUY_UPDATE = "ONEBUY_UPDATE",
        //-----------------------------------------  战力护符 ------------------------------
        // 战力护符更新
        FIGHT_TALISMAN_UPDATE = "FIGHT_TALISMAN_UPDATE",
        //-----------------------------------------  战力护符 ------------------------------

        //-----------------------------------------  招财仙猫 ------------------------------
        // 招财仙猫更新
        MONEY_CAT_UPDATE = "FIGHT_TALISMAN_UPDATE",
        //-----------------------------------------  招财仙猫 ------------------------------

        //-----------------------------------------  仙丹 ------------------------------
        XIANDAN_INFO_UPDATE = "XIANDAN_INFO_UPDATE",
        XIANDAN_ITEMS_UPDATE = "XIANDAN_ITEMS_UPDATE",
        //----------------------------------------- 无限手套 ------------------------------
        GLOVES_INFO_UPDATE = "GLOVES_INFO_UPDATE",
        //----------------------------------------- 无限手套 ------------------------------

        //-----------------------------------------  一键扫荡/一键挑战 ------------------------------
        YIJIAN_SAODANG_UPDATE = "YIJIAN_SAODANG_UPDATE",

        //----------------------------------------- 重命名 ------------------------------
        RENAME_INFO_UPDATE = "RENAME_INFO_UPDATE",
        RENAME_NAME_UPDATE = "RENAME_NAME_UPDATE",
        RENAME_OCC_UPDATE = "RENAME_OCC_UPDATE",
        //----------------------------------------- 重命名 ------------------------------

        //----------------------------------------- 资源找回 ------------------------------
        RETRIEVE_LILIAN_UPDATE = "RETRIEVE_LILIAN_UPDATE",
        RETRIEVE_RES_UPDATE = "RETRIEVE_RES_UPDATE",
        //----------------------------------------- 圣域BOSS ------------------------------
        SHENG_YU_BOSS_OPENUPDATE = "SHENG_YU_BOSS_OPENUPDATE",//圣域BOSS界面 展开 刷新list
        SHENG_YU_BOSS_OPENONE = "SHENG_YU_BOSS_OPENONE",//展开第一个
        SHENG_YU_BOSS_REPLER = "SHENG_YU_BOSS_REPLER",//体力返回
        SHENG_YU_BOSS_UPDATE = "SHENG_YU_BOSS_UPDATE",//体力更新
        SHENG_YU_BOSS_ZIDONG_UPDATE = "SHENG_YU_BOSS_ZIDONG_UPDATE",//自动使用体力丹状态更新
        SHENG_YU_BOSS_BAG_UPDATE = "SHENG_YU_BOSS_BAG_UPDATE",//今日收益背包更新
        SHENG_YU_BOSS_SCENE_UPDATE = "SHENG_YU_BOSS_SCENE_UPDATE",//进入场景更新

        //圣域BOSS更新boss归属者
        // SHENG_YU_BOSS_OWN_UPDATE = "SHENG_YU_BOSS_OWN_UPDATE",
        //boss之家玩家入屏离屏信息
        // SHENG_YU_BOSS_SHOW_PLAYER_INFO = "SHENG_YU_BOSS_SHOW_PLAYER_INFO",

        //--------------------------防骗问卷返回---------------------------------------
        PREVENTFOOL_ANSWER_UPDATE = "PREVENTFOOL_ANSWER_UPDATE", //答案更新
        PREVENTFOOL_UPDATE = "PREVENTFOOL_UPDATE",                //问卷更新


        //狂嗨更新信息
        THE_CARNIVAL_UPDATE = "THE_CARNIVAL_UPDATE",//更新信息
        //狂嗨2更新信息
        Mission_Party_UPDATE = "Mission_Party_UPDATE",//更新信息
        //--------------------------Daw平台---------------------------------------
        DAW_TiXian_updataList = "DAW_TiXian_updataList",//更新提现列表

        Mission_Party_updataList = "Mission_Party_updataList",//狂嗨2更新状态
        Mission_Party_updataListRP = "Mission_Party_updataListRP",//狂嗨2更新红点

        //战队
        Update_My_Clan_Info = "Update_MyClan_Info",                         //更新我的战队的信息
        Open_Opreate_Member_View = "Open_Opreate_Member_View",              //打开操作玩家面板
        UPDATE_CLAN_APPLY_LIST = "UPDATE_CLAN_APPLY_LIST",                  //更新战队战队申请列表的信息
        UPDATE_ALL_CLAN_LIST = "UPDATE_ALL_CLAN_LIST",                      //更新所有战队列表的信息
        UPDATE_CLAN_JOIN_LIMIT = "UPDATE_CLAN_JOIN_LIMIT",                  //更新申请最低战力显示的值
        UPDATE_CLAN_GRADE_AWARD = "UPDATE_CLAN_GRADE_AWARD",                //更新战队等级奖励
        UPDATE_CLAN_BUILD_REMAIN = "UPDATE_CLAN_BUILD_REMAIN",              //更新战队建设剩余或可捐献次数
        UPDATE_CLAN_HALO_REFRESHTIME = "UPDATE_CLAN_HALO_REFRESHTIME",      //更新战队光环刷新次数
        UPDATE_CLAN_COIN = "UPDATE_CLAN_COIN",                              //更新战队币
        UPDATE_XIANYUAN_COIN = "UPDATE_XIANYUAN_COIN",                      //更新姻缘货币

        //玄火
        Update_XUANHUO_ACHIEVEMENT_VIEW = "Update_XUANHUO_ACHIEVEMENT_VIEW",//玄火成就面板刷新
        Update_XUANHUO_GET_AWARD_VIEW = "Update_XUANHUO_GET_AWARD_VIEW",    //玄火场景界面玄火获取奖励状态刷新
        // 更新积分
        Xuanhuo_SCORE_UPDATE = "Xuanhuo_SCORE_UPDATE",
        // 玄火个人信息更新
        XUANHUO_COPY_INFO_UPDATE = "XUANHUO_COPY_INFO_UPDATE",
        XUANHUO_COPY_VULCAN_UPDATE = "XUANHUO_COPY_VULCAN_UPDATE",
        // XUANHUO_COPY_SETTLEMENT_UPDATE = "XUANHUO_COPY_SETTLEMENT_UPDATE",  //玄火副本结算数据刷新


        //逐鹿
        ZHULU_UPDATE_HWDAMAGE_LIST = "ZHULU_UPDATE_HWDAMAGE_LIST",          //更新首领战对boss伤害列表信息
        UPDATE_HEADERWAR_SCORE_RANK = "UPDATE_HEADERWAR_SCORE_RANK",        //更新首领战积分排行列表信息
        UPDATE_ZHULU_ACHIEVEMENT_VIEW = "UPDATE_ZHULU_ACHIEVEMENT_VIEW",    //更新逐鹿成就列表


        //圣装
        LuxuryEquip_ZhiZun_UPDATE = "LuxuryEquip_ZhiZun_UPDATE", //页面更新
        LuxuryEquip_ZhiZun_BuyUPDATE = "LuxuryEquip_ZhiZun_BuyUPDATE", //礼包页面更新

        //现金装备 
        CashEquip_Merge_Awards = "CashEquip_Merge_Awards", //合并奖励
        CashEquip_Item_change = "CashEquip_Item_change", // 物品变化
        CashEquip_Money_change = "CashEquip_Money_change", // 余额变化
        CashEquip_showComposeEffect = "CashEquip_showComposeEffect", // 合成效果


        CashEquip_Completion_Callback = "CashEquip_Completion_Callback", //完成副本合并显示后回调

        SUPERVIP_STATUS_INFO_CHANGE = "SUPERVIP_STATUS_INFO_CHANGE",        // 超级vip状态信息变化
        CUSTOM_TITILE_UPDATE = "CUSTOM_TITILE_UPDATE",                      // 定制称号状态改变

        //头像数据更新
        HEADER_DATA_UPDATE = "HEADER_DATA_UPDATE",                          // 头像数据更新
        HEADER_UPDATE = "HEADER_UPDATE",                                    // 头像更新

        UPDATE_JXL_AWARD_AND_STATUS = "UPDATE_JXL_AWARD_AND_STATUS",        // 九霄令基础信息和奖励列更新
        UPDATE_JXL_DAILY_TASK_INFO = "UPDATE_JXL_DAILY_TASK_INFO",          // 九霄令日常任务刷新
        UPDATE_JXL_SEASON_TASK_INFO = "UPDATE_JXL_SEASON_TASK_INFO",        // 九霄令赛季任务刷新

        KUANGHAI2_LC_ACTION_OPEN_UPDATE = "KUANGHAI2_LC_ACTION_OPEN_UPDATE",// 狂嗨2累冲活动开启状态更新
        KUANGHAI2_PD_ACTION_OPEN_UPDATE = "KUANGHAI2_PD_ACTION_OPEN_UPDATE",// 狂嗨2派对活动开启状态更新

        OS_DOUBLE_DROP_ENDTIME_UPDATE = "OS_DOUBLE_DROP_ENDTIME_UPDATE",    // 开服活动掉落狂欢倒计时更新
        OS_CEREMONY_GEOCACHING_UPDATE = "OS_CEREMONY_GEOCACHING_UPDATE",    // 庆典探索
        OS_CEREMONY_SELF_BROADCAST_LIST = "OS_CEREMONY_SELF_BROADCAST_LIST",// 庆典探索-个人抽奖记录
        OS_CEREMONY_GEOCACHING_RANK_UPDATE = "OS_CEREMONY_GEOCACHING_RANK_UPDATE",// 庆典探索v-排行榜
        OS_CEREMONY_CASH_UPDATE = "OS_CEREMONY_CASH_UPDATE",                // 庆典兑换
        OS_LIMIT_ONE_DISCOUNT_UPDATE = "OS_LIMIT_ONE_DISCOUNT_UPDATE",      // 开服活动-限时一折
        OS_CEREMONY_DANBI_UPDATE = "SOARING_SINGLEPAY_UPDATE",//开服活动-单笔充值界面刷新
        CEREMONY_CONTINUE_PAY_UPDATE = "CEREMONY_CONTINUE_PAY_UPDATE",//开服活动-连充界面刷新
        //姻缘
        MARRY_INFO_UPDATE = "MARRY_INFO_UPDATE",                                //姻缘更新
        MARRY_TASK_UPDATE = "MARRY_TASK_UPDATE",                                //姻缘任务更新
        MARRY_WALL_UPDATE = "MARRY_WALL_UPDATE",                                //姻缘墙更新
        MARRY_RING_UPDATE = "MARRY_RING_UPDATE",                                //姻缘义戒更新
        MARRY_GIFT_UPDATE = "MARRY_GIFT_UPDATE",                                //新增缘分大作战更新

        MARRY_COPY_UPDATE = "MARRY_COPY_UPDATE",                                //姻缘副本数据变化

        MARRY_Keepsake_UPDATE = "MARRY_Keepsake_UPDATE",                        //姻缘信物更新
        MARRY_Keepsake_GRADE_UPDATE = "MARRY_Keepsake_GRADE_UPDATE",            //姻缘信物进阶更新

        MARRY_DOLL_UPDATE = "MARRY_DOLL_UPDATE",                                //仙娃更新
        MARRY_DOLL_GRADE_UPDATE = "MARRY_DOLL_Grade_UPDATE",                    //仙娃进阶更新
        MARRY_DOLL_EAT_UPDATE = "MARRY_DOLL_EAT_UPDATE",                        //仙娃进补更新
        //姻缘副本更新挑战波次
        MARRY_BATTLE_LEVEL_UPDATE = "MARRY_BATTLE_LEVEL_UPDATE",
        // -----------------------------------------  数量 -------------------------------
        AMOUNT_UPDATE = "AMOUNT_UPDATE",

        FISH_UPDATE = "FISH_UPDATE",                    // 钓鱼活动更新
        FISH_CK_UPDATE = "FISH_CK_UPDATE",              // 钓鱼宝库更新
        // ----------------------------------------- LIMIT 活动公用事件 -------------------------------
        LIMIT_LINK_UPDATE = "LIMIT_LINK_UPDATE",          // 活动公用 连充更新
        LIMIT_GIFT_UPDATE = "LIMIT_GIFT_UPDATE",          // 活动公用 礼包更新
        LIMIT_RANKLIST_UPDATE = "LIMIT_RANKLIST_UPDATE",  // 活动公用 排行榜更新
        LIMIT_REAP_UPDATE = "LIMIT_REAP_UPDATE",          // 活动公用 反利更新
        LIMIT_SHOP_UPDATE = "LIMIT_SHOP_UPDATE",          // 活动公用 商城更新
        LIMIT_DAY_SINGLE_UPDATE = "LIMIT_DAY_SINGLE_UPDATE",// 活动公用 -单笔充值界面刷新
        LIMIT_DAY_CUMULATE_UPDATE = "LIMIT_DAY_CUMULATE_UPDATE", // 活动公用 每日累消
        LIMIT_CUMULATE_UPDATE = "LIMIT_CUMULATE_UPDATE", // 活动公用 累消
        LIMIT_XUNBAO_LOG = "LIMIT_XUNBAO_LOG",           // 限寻-获取寻宝全服记录 返回
        FISH_CK_HINT_UPDATE = "FISH_CK_HINT_UPDATE",        // 钓鱼宝库兑换提醒更新


        SEVEN_ACTIVITY_UPDATE = "SEVEN_ACTIVITY_UPDATE",                        // 七日活动更新
        SEVEN_ACTIVITY_UPDATE_DAY_ITEM = "SEVEN_ACTIVITY_UPDATE_DAY_ITEM",      // 七日活动选择不同的天

        // 副本自动鼓舞状态更新
        COPY_AUTO_INSPIRE = "COPY_AUTO_INSPIRE",

        // 充值按钮显隐
        UPDATE_SHOW_PAY_STATUS = "UPDATE_SHOW_PAY_STATUS",


        //虚拟按键 技能初始化
        VIRTUAL_SKILL_INIT = "VIRTUAL_SKILL_INIT",
        //虚拟按键 技能更新
        VIRTUAL_SKILL_UPDATE = "VIRTUAL_SKILL_UPDATE",
        //通知top_panel进入二级页面
        TOP_PANEL_SECOND_VIEW = "TOP_PANEL_SECOND_VIEW",

        DISHU_RANKLIST_UPDATE = "DISHU_RANKLIST_UPDATE",  // 地鼠排行榜更新
        DISHU_PANEL_UPDATE = "DISHU_PANEL_UPDATE",        // 打地鼠面板更新
        DISHU_CKICK_UPDATE = "DISHU_CKICK_UPDATE",        // 打地鼠更新
        DISHU_ULTIMATE_UPDATE = "DISHU_ULTIMATE_UPDATE",  // 打地鼠更新
        DISHU_ROWPRIZE_UPDATE = "DISHU_ROWPRIZE_UPDATE",  // 行奖励更新
        DISHU_BIGPRIZE_UPDATE = "DISHU_BIGPRIZE_UPDATE",  // 大奖更新
        DISHU_TASK_UPDATE = "DISHU_TASK_UPDATE",          // 地鼠任务更新

        // DISHU_TASKAWD_UPDATE = "DISHU_TASKWAD_UPDATE",  // 全民奖励更新

        YEAR_UPDATE = "YEAR_UPDATE",          // 新春活动更新


        UPDATE_REDPACK_BONUS_REMIAN = "UPDATE_REDPACK_BONUS_REMIAN",  // 刷新等级分红余额
        UPDATE_SUPER_REDPACK_REMIAN = "UPDATE_SUPER_REDPACK_REMIAN",  // 刷新超级红包余额
        UPDATE_LEVEL_REDPACK_REMIAN = "UPDATE_LEVEL_REDPACK_REMIAN",  // 刷新等级红包余额
        UPDATE_LEVEL_REDPACK_ITEM = "UPDATE_LEVEL_REDPACK_ITEM",      // 刷新等级红包ITEM
        UPDATE_SUPER_REDPACK_ITEM = "UPDATE_SUPER_REDPACK_ITEM",      // 刷新超级红包ITEM

        // 人物移动 鞭尸取消
        PLAYER_MOVE_POINT_UPDATE = "PLAYER_MOVE_POINT_UPDATE",


        // 战队逐鹿
        TeamChief_COPY_DATA = "TeamChief_COPY_DATA",
        TeamChief_HURT_INFO = "TeamChief_HURT_INFO",
        TeamPrepare_COPY_DATA = "TeamPrepare_COPY_DATA",
        TeamBattle_COPY_DATA = "TeamBattle_COPY_DATA",
        TeamBattle_Gather_UPDATA_DATA = "TeamBattle_Gather_UPDATA_DATA",    // 争夺战采集数据变化
        TeamBattle_COPY_UPDATA_DATA = "TeamBattle_COPY_UPDATA_DATA",   // UI界面数据返回
        TeamBattle_SCORE_UPDATA_DATA = "TeamBattle_SCORE_UPDATA_DATA", // 场景内积分变化
        TeamBattle_WORSHIP_UPDATA_DATA = "TeamBattle_WORSHIP_UPDATA_DATA", // 膜拜更新


        TeamBattle_REBORN_UPDATA = "TeamBattle_REBORN_UPDATA", // 复活通知
        //外显套装
        EXPLICIT_SUIT_UPDATE = "Explicit_Suit_posHallucinationID",//激活外显套装或者升级

        GUANGHUAN_INFO_UPDATE = "GUANGHUAN_INFO_UPDATE",// 光环信息更新
        GUANGHUAN_REFINE_SUCCESS = "GUANGHUAN_REFINE_SUCCESS", // 光环附魂成功
    }
}

declare namespace utils {
    const enum Unit {
        //容量，以字节为单位
        KB = 1024,
        MB = 1024 * KB,
        GB = 1024 * MB,
        TB = 1024 * GB,

        //时间，以毫秒为单位
        second = 1000,
        minute = 60 * second,
        hour = 60 * minute,
        day = 24 * hour,
        week = 7 * day
    }
}

//角色阴影放大比例
declare const enum ShadowScale {
    AvatarScale = 1,
    DallAvatarScale = 1,
    MosterScale = 1,//没有用，读取配置文件
    NPCScale = 1,
    PetScale = 0.7,
    SuperPetScale = 1,
    CommonScale = 1,
}

//特定控件点击标记
declare const enum GlobalSecondEffectBtnTag {
    BTN_VALUE = 90000,
    BTN_KEY = "GLOBAL_SECOND_EFFECT_BTN_KEY"
}

//等待传送判定标记(用于需要传送门场景)
declare const enum WaitTransitionType {
    WaitTransitionOne,
    WaitTransitionSecond,
    WaitTransitionThree,
    WaitTransitionFour,
    WaitTransitionFive,
}