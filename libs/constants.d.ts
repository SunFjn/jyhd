declare const enum SignalsType {
    SIGABRT = "SIGABRT",
    SIGALRM = "SIGALRM",
    SIGBUS = "SIGBUS",
    SIGCHLD = "SIGCHLD",
    SIGCONT = "SIGCONT",
    SIGFPE = "SIGFPE",
    SIGHUP = "SIGHUP",
    SIGILL = "SIGILL",
    SIGINT = "SIGINT",
    SIGIO = "SIGIO",
    SIGIOT = "SIGIOT",
    SIGKILL = "SIGKILL",
    SIGPIPE = "SIGPIPE",
    SIGPOLL = "SIGPOLL",
    SIGPROF = "SIGPROF",
    SIGPWR = "SIGPWR",
    SIGQUIT = "SIGQUIT",
    SIGSEGV = "SIGSEGV",
    SIGSTKFLT = "SIGSTKFLT",
    SIGSTOP = "SIGSTOP",
    SIGSYS = "SIGSYS",
    SIGTERM = "SIGTERM",
    SIGTRAP = "SIGTRAP",
    SIGTSTP = "SIGTSTP",
    SIGTTIN = "SIGTTIN",
    SIGTTOU = "SIGTTOU",
    SIGUNUSED = "SIGUNUSED",
    SIGURG = "SIGURG",
    SIGUSR1 = "SIGUSR1",
    SIGUSR2 = "SIGUSR2",
    SIGVTALRM = "SIGVTALRM",
    SIGWINCH = "SIGWINCH",
    SIGXCPU = "SIGXCPU",
    SIGXFSZ = "SIGXFSZ",
    SIGBREAK = "SIGBREAK",
    SIGLOST = "SIGLOST",
    SIGINFO = "SIGINFO",
}

declare const enum EventType {
    BeforeExit = "beforeExit",
    Close = "close",
    Connection = "connection",
    Disconnect = "disconnect",
    Exit = "exit",
    Error = "error",
    Headers = "headers",
    Listening = "listening",
    Message = "message",
    NewListener = "newListener",
    Open = "open",
    Ping = "ping",
    Pong = "pong",
    RemoveListener = "removeListener",
    RejectionHandled = "rejectionHandled",
    Upgrade = "upgrade",
    UncaughtException = "uncaughtException",
    UnexpectedResponse = "unexpected-response",
    UnhandledRejection = "unhandledRejection",
    Warning = "warning",
}

//统一的进程退出码
declare const enum ExitCode {
    Success = 0,
    InitializeFailure = 63,
    DBError,
    NetError,
    SocketClose,
    SocketError,
    ConfigError,
    StartupParamError,
}

//统一的协议回复码
declare const enum ErrorCode {
    Success = 0,
    NullArgs = 1,               //空参数
    ReleaseMode,                //非Debug模式
    Timeout,                    //请求超时
    NoSession,
    InvalidSize,
    InvalidPermit,
    InvalidData,
    InvalidGroup,
    AccountConflict,
    CloseService,
    CannotBroadcast,
    UnknowError,
    StateError,
    AccountIllegalCharacter,    //账号含有非法字符
    NameIllegalCharacter,       //角色名含有非法字符
    NotOpen,                    //功能未开启
    NotConfig,                  //未配置
    SeverIdError,               //服务器ID错误

    InvalidArgs = 10001,        //无效参数
    AuthFailure,                //认证失败
    ActorOffline,               //角色不在线
    InvalidService,             //找不到对应的服务器
    InvalidSessionHandle,       //无效会话句柄
    GateNotityOffline,          //gate通知下线
    BlockUser,                  //账号已封
    BlockRoleId,                //角色已封
    BlockIp,                    //IP已封
    ForceLogout,                //强制下线
    AuthFailureTimeout,         //验证超时
    OpenServicePast,         //开服过久

    //登录和创角
    NoActor = 11001,            //未创建角色
    IsExistName,                //名字已经存在
    ErrorCreateActor,           //创建角色失败
    CharLenghtLimit,            //字符长度限制
    ExistActor,
    InvalidOcc,
    DBError,
    ExistFeatureActor,          //不能重复登录

    //Map 登录
    ExistMapActor,              //不能重复进入场景
    AINotConfig,
    AIConfigError,
    ActorNotFound,
    ActorDead,
    MapNotFound,                //地图未配置
    MapLevelNotFound,           //没有当前关卡层
    KillMonsterWareNotEnough,   //击杀怪物波数不足
    CopyUnfinished,             //副本未完成
    AwardFinished,              //奖励已领取
    EraLevelNotEnough,          //觉醒等级不足
    CopyTimesNotEnough,         //副本次数不足
    BossDead,                   //BOSS复活中
    SingleBossCopyNotPass,      //单人BOSS未通关
    NothaveSweepCopy,           //没有可扫荡的副本
    ActorLevelNotEnough,        //角色等级不足
    BossNotFound,               //BOSS不存在
    SceneNotFount,              //场景不存在
    CannotInspire,              //当前场景不能鼓舞
    CopperInspireLimitTimes,    //金币鼓舞已达上限
    GoldInspireLimitTimes,      //代币券鼓舞已达上限
    CannotBuyTimes,             //不能购买次数
    CannotCopyToCopy,           //从副本中不能进入另一个副本
    TargetNotExist,             //目标不存在
    TargetInvalid,              //无效目标
    TargetDead,                 //目标已死亡
    TargetNotEnemy,             //不能攻击非敌方
    SkillCD,                    //技能CD中
    SkillReady,                 //技能预备中
    DistanceNotEnough,          //距离太远
    CopyExistPass,              //副本已过关
    RankAwardUnfinished,        //排行奖励未达成
    NothaveRankAward,           //没有排行奖励
    CannotGatherNotGather,      //非采集物不能开启
    CannotGatherNotOwn,         //没有归属不能打开宝箱
    CannotGatherNotExist,       //宝箱不存在
    MapAreadNotFound,           //地图区域错误
    OpenBoxTimesNotEnough,      //开启宝箱次数不足
    CannotAddTimes,             //不能添加次数
    CannotSweepCopyVipNotEnough,//扫荡失败,VIP等级不足
    CopyMoreThanMaxLevel,       //副本超过最大层数
    notBuyTimesPrivilege,       //没有此购买特权
    copyTimesBuyLimit,          //达到购买上限
    copyTimesNotConfig,         //购买副本次数没配置
    ActorOutline,               //角色不在线
    SingleBossNotOpen,          //单人BOSS副本未开启
    DizzState,                  //眩晕状态不能攻击
    SilentState,                //沉默状态无法使用技能
    CrossBossTimesNotEnough,    //挑战次数不足，VIP可增加购买次数
    TianguanCopyNotOpen,        //天关副本未开启
    DahuangCopyNotOpen,         //大荒古塔未开启
    ShilianCopyNotOpen,         //试炼副本未开启
    TeamCopyNotOpen,            //组队副本未开启
    EraCopyNotOpen,             //觉醒未开启
    RuneCopyNotOpen,            //玉荣副本未开启
    MultiBossNotOpen,           //多人BOSS未开启
    BossHomeNotOpen,            //BOSS之家未开启
    CrossBossNotOpen,           //跨服BOSS未开启
    ActorNotDead,               //角色未死亡
    GatherRepeat,               //采集过程中不能重复采集
    GatherFinished,             //采集已完成
    NineCopyNotOpen,            //九天之巅未开启
    TargetProtected,            //目标处于保护状态
    CopyClose,                  //副本已关闭
    NineScoreNotEnough,         //九天之巅积分不足
    FirstCopy,                  //第一次进入副本
    ShilianCopyNotPass,         //试炼副本未通关
    StayCurCopyCannotSweepCopy, //在当前副本中不能扫荡当前副本
    NothaveChallengepCopy,      //没有可挑战的副本
    NotOneKeySweepPrivilege,    //没有一键扫荡特权
    NotOneKeyChallengePrivilege,//没有一键挑战特权
    StayCurCopyCannotChallengeCopy, //在当前副本中不能一键挑战当前副本
    ShilianCopyChallengeTimesNotEnough,     //试炼副本挑战次数不足
    ShilianCopySweepTimesNotEnough,     //试炼副本扫荡次数不足
    HaveChallengeTimes,         //挑战完才能扫荡
    CopyChallengeNotPass,       //每个副本难度需挑战成功过一次才能一键挑战
    TempleBossUnopen,           //圣殿未开启

    //GM指令
    InvalidGMCommand = 12001,
    GirdNotEnough,              //格子不足
    ItemNotEnough,              //道具不足
    NotFoundItem,               //道具不存在
    NotFoundBag,                //不存在的背包
    ItemTypeError,              //道具类型错误
    ItemNotUse,                 //道具不能使用
    ItemUseLevel,               //道具使用玩家等级限制
    ItemUseVip,                 //道具使用vip等级限制
    ItemUseFail,                //道具使用失败
    ItemUseConfigError,         //道具配置错误
    goldNotEnough,              //代币券不足
    copperNotEnough,            //铜钱不足
    RuneGirdNotEnough,          //玉荣仓库已满，请先分解玉荣
    XianyuNotEnough,            //仙玉不够

    //角色装备
    CannotWear = 12101,
    CannotWearNotEquip,         //非装备不能穿戴
    CannotWearEraNotEnough,     //觉醒不足不能穿戴
    CannotWearLvlNotEnough,     //等级不足不能穿戴
    NotReplaceEquip,            //没有替换的装备
    HumanLackCopper,            //金币不够
    HumanLackGold,              //代币券不够
    HumanGuideFinish,           //指引已完成
    EquipSuitActivate,          //装备套装已激活,不可重复点亮
    EquipSuitGridActivate,      //此部位已点亮,不可重复点亮
    EquipSuitNotPreposition,    //需要激活前置套装
    EquipSuitNotOpen,           //装备套装功能未开启
    EquipSuitNotWear,           //没有穿戴此部位装备
    EquipSuitNotLight,          //没达到点亮条件

    TaskNotFound = 12201,       //任务不存在
    TaskNotComplete,            //任务未达成

    //宠物
    PetFeedNotOpen = 12301,     //宠物喂养功能未开启
    PetRankNotOpen,             //宠物升阶功能未开启
    PetSkillNotRise,            //不能升级宠物技能
    PetNotChangeShow,           //不能更换宠物外观
    PetMagicShowNotRise,        //不能升阶宠物幻化
    PetMagicShowNotChange,      //不能更换宠物幻化外观
    PetRefineNotRise,           //不能升级宠物修炼
    PetParamError,              //宠物参数错误
    PetFazhenNotChange,         //不能更换宠物法阵

    //精灵
    RideFeedNotOpen = 12401,     //精灵喂养功能未开启
    RideRankNotOpen,             //精灵升阶功能未开启
    RideSkillNotRise,            //不能升级精灵技能
    RideNotChangeShow,           //不能更换精灵外观
    RideMagicShowNotRise,        //不能升阶精灵幻化
    RideMagicShowNotChange,      //不能更换精灵幻化外观
    RideRefineNotRise,           //不能升级精灵修炼
    RideParamError,              //精灵参数错误
    RideFazhenNotChange,          //不能更换精灵法阵

    //金身
    SoulRefineNotAddLevel = 12501,  //不能升级金身
    SoulRiseNoetAddLevel,           //不能升级不败金身

    //圣物
    AmuletNotAddLevel = 12601,      //不能升级圣物

    //签到
    SignNotOpen = 12701,        //签到未开启
    SignFinished,               //已签到
    SignNotCfg,                 //签到未配置
    SignNotEnough,              //签到天数不足
    SignAccAlreadyGet,          //累计签到奖励已领取

    //技能
    SkillNotExist = 12801,     //此技能不存在
    SkillNotLearn,             //此技能没有学习
    SkillLackZq,               //魔力不够
    SkillMaxLevel,             //技能达到等级上限
    SkillLearned,              //技能已经学习
    SkillNotCanLearn,          //不能学习此技能
    SkillNull,                 //未学习绝学

    //七日礼
    SevenNotOpen = 12901,       //七日礼未开启
    CreateDayNotEnough,         //创角天数不足
    SevenDayAwardFinished,      //七日礼奖励已领
    SevenDayAwardNotCfg,        //七日礼奖励未配置

    //半月礼
    HalfMonthNotOpen = 12951,       //半月礼未开启
    HalfMonthAwardFinished,      //半月礼奖励已领
    HalfMonthAwardNotCfg,        //半月礼奖励未配置

    //gem
    GemParamError = 13001,      //参数错误
    GemNotCanInlay,             //此物品不是宝石，不能镶嵌
    GemTypeError,               //仙石类型不匹配
    GemNotCanLevel,             //低等级不能替换高等级
    GemGridNull,                //仙石格子为空
    GemNotCanRefine,            //仙石不能升级
    GemNotVipPrivilege,         //此部位需要开启vip特权

    //email
    EmailNotFound = 14001,              //没有这个邮件
    EmailHasNotAttach,          //邮件没有可领取的附件
    EmailHasNotDel,             //邮件没有可删除的邮件
    EmailAlreadyGetAward,

    //Era
    EraNotAddLevel = 15001,     //不能觉醒
    EraNotTask,                //不存在该任务
    EraCompleteAll,             //所有任务已完成
    EraUncomplete,              //任务未完成

    //strong
    StrongParamError = 16001,         //强化参数错误
    StrongNotCanRefine,               //达到满级，不能再强化
    StrongNotItem,                   //没有装备,不能强化

    //zhuhun
    ZhuhunNotCan = 16101,               //已满级，不能再铸魂
    ZhuhunItemError,                   //道具id错误
    ZhuhunParamError,                  //参数错误
    ZhuhunNotOpen,                     //噬魂未开启
    ZhuhunNotCan2,                     //噬魂已达到上限，不能升级
    ZhuhunNotItem,                     //没有装备,不能铸魂

    //compose/resolve
    CRParamError = 17001,           //参数错误
    CRItemTypeError,                //物品类型错误
    CRItemCountError,               //材料数量有误
    CRComposeFail,                  //合成失败
    CRSmeltFail,                    //熔炼失败
    CRWithOutItem,                  //当前没有合成材料

    //bag
    BagInSmelt = 18001,            //正在熔炼
    BagNoEquipCanSmelt,           //当前无装备可熔炼

    //magicArt
    MagicArtMaxLevel = 19001,     //已达到最大等级

    //onlineReward
    ORNotOpen = 20001,            //在线礼包未开启
    ORParamError,                 //在线礼包参数错误
    ORStateError,                 //在线礼包状态错误
    ORWithoutTime,                //在线时间未达到
    ORReceive,                    //领取成功


    //lilian
    LilianNotOpen = 21001,         //历练未开启
    LilianParamError,             //历练参数错误
    LilianStateError,             //历练奖励不可领取
    LilianExpNotEnough,           //活跃值不够

    //xianwei
    XianweiNotOpen = 22001,         //仙位未开启
    XianweiParamError,             //仙位参数错误
    XianweiStateError,             //仙位状态错误
    XianweiExpNotEnough,           //仙力不够

    //kuanghai
    KuanghaiNotOpen = 22101,         //狂嗨未开启
    KuanghaiParamError,             //狂嗨参数错误
    KuanghaiStateError,             //狂嗨状态错误
    KuanghaiExpNotEnough,           //嗨点不够

    //shenbing
    ShenbingParamError = 23001,    //参数错误
    ShenbingLevelEnough,           //角色等级不够
    ShenbingNotOpen,               //功能未开启
    ShenbingNotExist,              //神兵未激活

    //wing
    WingParamError = 24001,        //参数错误
    WingLevelEnough,               //角色等级不够
    WingNotOpen,                   //功能未开启
    WingNotExist,                  //仙翼未激活

    //xunbao
    XunbaoParamError = 25001,      //探索参数错误
    XunbaoGirdNotEnough,           //探索仓库格子快满,请先取回物品
    XunbaoExchangeNotConfig,       //探索兑换没配置
    XunbaoExchangeNotEnough,       //探索兑换代币不足

    //month_card
    MonthCardNotAdd = 25101,       //已经续卡，不能再续
    MonthCardNotBuy,               //没有购买月卡
    MonthCardParamError,           //月卡参数错误
    MonthCardStateError,           //月卡奖励状态错误
    MonthCardNotOpen,              //月卡未开启

    //month_card
    ZhizunCardNotAdd = 25121,       //已经续卡，不能再续
    ZhizunCardNotBuy,               //没有购买至尊特权
    ZhizunCardParamError,           //至尊特权参数错误
    ZhizunCardNotOpen,              //至尊特权未开启

    //mall
    MallParamError = 25201,        //商城参数错误
    MallItemNotExist,              //商城物品不存在
    MallDayLimit,                  //今日购买数量已到上限
    MallWeekLimit,                 //本周购买数量已到上限

    //vip
    VipParamError = 25301,         //vip参数错误
    VipRewardNotExist,             //vip奖励已经领取
    VipConfigError,                //vip配置错误
    VipNotPrivilege,               //vip等级不够

    //充值
    RechargeIndexNoConfig = 25401,  //充值档位未配置
    RechargeAlreadyExchange,        //充值已兑换

    //team
    ExistTeamMatch = 25501,         //不能重复匹配
    HasTeam,                        //已经在队伍中
    NotTeamMatching,                //不在匹配中
    TeamMatchTimeout,               //匹配超时
    TeamMatchTypeNotExist,          //匹配类型不存在
    TeamMatching,                   //正在匹配中
    MatchImgFail,                   //匹配镜像失败
    NotHaveMap,                     //该场景无法匹配
    NotHaveTeam,                    //不在队伍中
    NotFoundTeam,                   //没有这个队伍
    PleaseCreateTeam,               //请先创建队伍
    SelectTeamMember,               //请选择队员
    NothavaFactionFriend,           //没有这个盟友
    SelectFactionOrFirend,          //请选择盟友类型
    NotLeader,                      //非队长不能操作
    TeamEnterCopy,                  //队伍已进入场景
    TeamDestory,                    //队伍已解散
    TeamMemberSizeLimit,            //队伍任人员已满
    NotKickedLeader,                //不能T队长
    NothavaTeamFriend,              //队友不存在
    InviteCD,                       //组队邀请CD中
    CopyCannotCreateTeam,           //副本中不能创建队伍
    CopyCannotJoinTeam,             //副本中不能加入队伍

    //rune玉荣
    RuneParamError = 25601,         //玉荣参数错误
    RuneNotConfig,                  //没有配置此玉荣
    RuneSlotNotConfig,              //没有配置此玉荣槽
    RuneTypeError,                  //无法镶嵌不同类型的玉荣
    RuneSlotNotOpen,                //玉荣槽未开启
    RuneNotOpen,                    //玉荣系统未开启
    RuneExpNotEnough,               //玉荣经验不够
    RuneNotInlay,                   //未镶嵌玉荣
    RuneNotCanRefine,               //玉荣无法提升
    RuneResolveNotConfig,           //此玉荣不能分解，没有对应配置
    RuneExchangeNotConfig,          //未央兑换没配置
    RuneAlreadyInlay,               //此类型玉荣已镶嵌
    RuneDialNotEnough,              //转盘次数不够
    RuneLayerNotEnough,             //未达到镶嵌条件
    RuneDialUnusual,                //转盘异常
    RuneResolveCD,                  //分解CD中
    RuneComposeNotOpen,             //玉荣合成未开启
    RuneCannotCompose,              //该玉荣无法合成
    RuneNeedRuneJNotEnough,         //符晶不足
    RuneNeedRuneItemNotEnough,      //符晶道具不足
    RuneBagSpaceNotEnough,          //玉荣背包空间不足
    RuneSelectNeedRuneItem,         //请选择合成需要的玉荣
    RuneSelectRuneItemNotFound,     //选择的玉荣未找到
    RuneSelectRuneItemRepeat,       //不能重复选择玉荣

    SweepingTimesNotEnough = 25701,                 //扫荡次数不足
    SweepingNotVipPrivilege,          //没有vip权限，不能购买次数
    SweepingConfigError,              //扫荡配置参数错误

    XiangyaoNotComplete = 25801,    //降妖任务未完成
    canReceivedTimesNotEnough,      //可领取奖励次数不足
    killedBossNumNoteEnough,        //击杀Boss数量不足
    killedMonsterNumNotEnough,      //击杀小怪数量不足

    //day_pay
    DaypayNotOpen = 25901,          //日充未开启
    DaypayParamError,               //日充参数错误

    //cumulate_pay
    CumulatepayNotOpen = 26001,          //累充未开启
    CumulatepayParamError,               //累充参数错误

    //continue_pay
    ContinuepayNotOpen = 26101,          //连充未开启
    ContinuepayParamError,               //连充参数错误

    //zero_buy
    ZerobuyNotOpen = 26201,          //0元购未开启
    ZerobuyParamError,               //0元购参数错误
    ZerobuyAlready,                  //0元购该档次已经购买

    //zero_buy
    OnebuyNotOpen = 26251,          //一元秒杀未开启
    OnebuyParamError,               //一元秒杀参数错误

    //consume_reward
    ConsumerewardNotOpen = 26301,          //消费赠礼未开启
    ConsumerewardParamError,               //消费赠礼参数错误

    //pay_reward
    PayRewardNotOpen = 26311,          //充值转盘未开启
    PayRewardParamError,               //充值转盘参数错误
    PayRewardCountNotEnough,           //充值转盘抽奖次数不够
    PayRewardNotReward,                //财富值没有达到条件，不能领取奖励

    //duobao
    DuobaoNotOpen = 26351,          //夺宝未开启
    DuobaoParamError,               //夺宝参数错误
    DuobaoNotReward,                //积分没有达到条件，不能领取奖励

    //九天之巅
    NineCopyDeadLimit = 26401,      //九天之巅死亡次数超过上限
    NineCopyReEnterCD,              //请等待重新进入九天之巅

    //invest_reward
    InvestRewardNotOpen = 26501,          //投资返利未开启
    InvestRewardParamError,               //投资返利参数错误
    InvestRewardAlreadyBuy,               //不能重复购买该投资

    //sprint_rank
    SprintRankNotOpen = 26601,          //开服冲榜未开启
    SprintRankNotNode,                  //开服冲榜奖励已领取完
    SprintRankNotReward,                //未到达条件，不能领取奖励

    //gushen
    GushenNotOpen = 26701,          //古神问道未开启
    GushenNotNode,                  //该活动不存在
    GushenNotReward,                //未到达条件，不能领取奖励
    GushenTaskNotExist,             //任务不存在

    //kuanghuan
    KuanghuanNotOpen = 26801,          //全民狂欢未开启
    KuanghuanNotNode,                  //全民狂欢奖励已领取完
    KuanghuanNotReward,                //未到达条件，不能领取奖励
    KuanghuanParamError,               //参数错误

    //cumulate_pay2
    Cumulatepay2NotOpen = 26811,          //累充未开启
    Cumulatepay2ParamError,               //累充参数错误

    //discount_gift
    DiscountGiftNotOpen = 26821,         //特惠礼包未开启
    DiscountGiftNotCount,                //当前购买数量已达上限，提示vip等级可增加购买次数
    DiscountGiftConfigError,             //特惠礼包配置错误
    DiscountGiftNotEnoughGold,           //没有足够的代币券
    DiscountGiftNotTime,                 //当前活动已经结束

    //consume_reward2
    ConsumeReward2NotOpen = 26831,          //消费返利未开启
    ConsumeReward2ParamError,               //消费返利参数错误

    //everydayRebate
    EverydayRebateNotOpen = 26851,          //天天返利未开启
    EverydayRebateParamError,               //天天返利参数错误

    //loginReward
    LoginRewardNotOpen = 26881,          //登录豪礼未开启
    LoginRewardParamError,               //登录豪礼参数错误

    //单笔充值返魂玉
    SinglePayJadeNotOpen = 26890,        //活动未开启
    SinglePayJadeNotConfig,              //此档位未配置
    SinglePayJadeNotGet,                 //未完成充值，不可领取

    //单笔充值返圣印
    SinglePayPrintNotOpen,               //活动未开启
    SinglePayPrintNotConfig,             //此档位未配置
    SinglePayPrintNotGet,                //未完成充值，不可领取

    //chat
    ChatChannelNotOpen = 27001,      //聊天频道未开启
    ChatLevelNotAchieve,             //聊天等级未达到
    ChatCDNotConfig,                 //聊天频道CD未配置
    ChatCD,                          //聊天CD中
    ChatBlackExist,                  //已存在黑名单
    ChatBlackInvalid,                //操作无效
    ChatBlackNotExist,               //不存在黑名单中
    ChatBlackLimit,                  //达到黑名单上限
    ChatExpressionLimit,             //高级表情使用达到上限
    ChatItemNoSend,                  //此道具不能发送
    ChatExpressionNotConfig,         //没有配置该表情
    ChatExpressionNotVipConfig,      //没有配置Vip限制
    ChatShortcutNotConfig,           //没有配置该快捷语句
    ChatBlockSpeak,                  //已被禁言

    //xianFu
    XianFuNotOpen = 28001,           //仙府-家园未开启
    XianFuLevelNotConfig,            //仙府-家园等级未配置
    XianFuConditionNotAchieve,       //仙府-家园升级条件未达到
    XianFuProduceNotAchieve,         //仙府-家园产出领取时间未达到
    XianFuProduceUnusual,            //仙府-家园产出异常，检查配置
    XianFuLingQiNotEnough,           //药草值不足
    XianFuRichesNotEnough,           //财富值不足
    XianFuFengShuiNotEnough,         //风水值不足
    XianFuNotProduce,                //此建筑不能指定产出
    XianFuProduceNotConfig,          //此建筑产出没配置
    XianFuProduceLimit,              //此建筑产出达到上限
    XianFuProduceIndexNotConfig,     //生产序号未配置
    XianFuProduceCD,                 //生产CD中
    XianFuProduceNotGet,             //先领取上次产出才可以继续生产
    XianFuProduceNotFinish,          //本次产出未完成，无法进行下一次
    XianFuSpiritNotActivate,         //灵兽未激活
    XianFuTravelNotConfig,           //游历未配置
    XianFuSpiritLevelNotEnough,      //灵兽等级不够
    XianFuSpiritTravel,              //灵兽外出游历了
    XianFuSpiritTravelGet,           //先领取上次游历奖励才可以进行下次游历
    XianFuTravelNotFinish,           //游历未完成
    XianFuTravelNotExItemId,         //需要对应的罗盘
    XianFuIllNotConfig,              //图鉴未配置
    XianFuIllMaxLevel,               //图鉴已达到最大等级
    XianFuIllResNotEnough,           //图鉴资源不足
    XianFuMakeLimitNotConfig,        //每日制作上限未配置
    XianFuMakeLimit,                 //已达到每日制作上限
    XianFuTravelNotAmulet,           //此游历没有护身符
    XianFuSpiritNotTravel,           //灵兽未外出游历
    XianFuTravalImmlyNotConfig,      //游历立即完成系数未配置
    XianFuTravalLimit,               //已达到每日游历上限
    XianFuTravalLimitNotConfig,      //游历上限没配置
    XianFuEventMallNotOpen,          //神秘商城已结束
    XianFuNotConfigExItemId,         //游历没有配罗盘
    XianFuTaskNot,                   //仙府-家园任务不存在
    XianFuTaskNotFinish,             //仙府-家园任务未完成
    XianFuTaskAward,                 //仙府-家园任务已领取
    XianFuTaskNotConfig,             //仙府-家园任务未配置
    XianFuActiveNotEnough,           //活跃值不够
    XianFuActiveAwardNotConfig,      //活跃值奖励未配置
    XianFuActiveAwardGet,            //活跃值奖励已领取
    XianFuDecNotConfig,              //风水物件未配置
    XianFuDecMaxLevel,               //风水物件达到最大等级
    XianFuDecNotActive,              //风水物件未激活
    XianFuProduceNotSelect,          //未选择产出份数
    XianFuMallClose,                 //神秘商人已离开，购买失败
    XianFuSkillNotActive,            //仙府-家园技能未激活
    XianFuSkillMax,                  //仙府-家园技能达到满级
    XianFuSkillLevelNotEnough,       //仙府-家园未达到对应等级,无法提升技能
    XianBuildNotActive,              //此建筑未激活
    XianBuildNotWork,                //此建筑没有在炼制
    XianBuildFinishNotConfig,        //没有配置立即完成
    XianFuMallF5NotConfig,           //仙府-家园商城刷新所需道具没配置
    XianFuMallGoodsNot,              //此商品不存在
    XianFuMallGoodsBuyLimit,         //此商品达到购买上限
    XianFuMallGoodsNotItem,          //此商品没有配置对应道具

    //天梯
    TiantiCopyNotOpen = 29001,       //天梯斗法功能未开启
    TiantiJoinAwardErrorIndex,       //天梯斗法参与奖励项不存在
    TiantiJoinTimesUnfinish,         //天梯斗法次数不足
    TiantiJoinAwardfinished,         //天梯斗法参与奖励已领取
    TiantiFeatAwardErrorIndex,       //天梯斗法功勋奖励项不存在
    TiantiFeatNotEnough,             //天梯斗法功勋不足
    TiantiFeatAwardfinished,         //天梯斗法功勋奖励已领取
    TiantiTimesLimit,                //天梯斗法次数已达上限
    TiantiTimesCannotBuy,            //天梯斗法次数购买失败
    TiantiScoreNotEnough,
    TiantiHonorNotEnough,
    TiantiJoinTimesLimit,            //天梯斗法剩余次数超过

    //天降财宝
    RichesCopyClose = 31001,         //活动已结束
    RichesCopyNotOpen,               //副本未开启
    RichesGatherLimit,               //已达到采集上限
    RichesGather,                    //采集中
    RichesOtherGather,               //其他人在采集中了
    RichesGatherError,               //采到自己了
    RichesLevelNotConfig,            //采集奖励没有配置
    RichesNotExist,                  //采集已被采掉了

    //云梦秘境
    CloudlandCopyNotOpen = 31101,    //云梦秘境未开启
    CloudlandCopyTimesNotEnough = 31102,    //云梦密令不足

    //奇遇
    AdventrueBuyLimit = 32001,       //购买达到上限
    AdventrueBuyNotConfig,           //购买没有配置
    AdventrueEventNotExist,          //事件不存在
    AdventrueYunliNotEnough,         //探险次数不足
    AdventrueTreasureActive,         //宝箱已激活，不可重复激活
    AdventrueChildNotConfig,         //事件子类未配置
    AdventrueNotFinish,              //事件未完成
    AdventrueNotNormal,              //事件异常
    AdventrueTreasureTimeNotConfig,  //宝箱倒计时没有配置
    AdventrueTaskActive,             //任务已接受，不可重复接受
    AdventrueTaskNotConfig,          //任务没配置
    AdventrueAwardNotConfig,         //奖励没配置
    AdventruePointNotEnough,         //奇遇点不足
    AdventrueWeight,                 //权重随机不到
    AdventrueExchagne,               //奇遇兑换未配置

    //昆仑瑶池
    SwimmingCopyNotOpen = 33001,     //副本未开启
    SwimmingTimeLimit,               //达到时间上限
    SwimmingSoapLimit,               //达到抓取上限

    //护送仙女
    FairyNotOpen = 34001,            //护送仙女功能未开启
    FairyEscortConduct,              //正在护送中
    FairyEscortNotFinish,            //没有完成护送
    FairyEscortGet,                  //上次护送奖励没领取
    FairyEscortLimit,                //达到护送上限
    FairyNotEscortTime,              //不在护送期间
    FairyInterceptLimit,             //达到拦截上限
    FairyNotEscort,                  //该玩家没有在护送状态
    FairyNotLootingt,                //不能被拦截了，达到次数上限
    FairyRefreshCD,                  //刷新CD中
    FairyRefreshConsumeNotConfig,    //仙女刷新所需道具没有配置
    FairyRefreshVipConsumeNotConfig, //选择仙女指定所需道具没有配置
    FairyRefreshVipNotConfig,        //选择最好的仙女VIP等级没有配置
    FairyTail,                       //已经是最好的仙女了，无法再刷新
    FairyVipNotEnough,               //VIP等级不够
    FairyAwardNotConfig,             //奖励没有配置
    FairyImgFail,                    //仙女护送镜像获取失败
    FairyNotConfig,                  //选中的仙女没有配置，无法护送

    //称号
    DesignatioNotExist = 35001,      //称号不存在
    DesignatioIsActive,              //称号已激活
    DesignatioCannotActive,          //称号不能激活
    DesignatioNotActive,             //称号未激活
    DesignatioWearState,             //当前称号已佩戴
    DesignatioNotWearState,          //当前称号未佩戴

    //飞升榜
    FeishengRankObjNotExist = 35101,  //角色记录不存在
    FeishengRankNotReward = 35102,    //不能领取奖励
    FeishengRankNotOpen = 35103,      //功能未开启
    FeishengRankParamError = 35104,   //参数错误
    FeishengRankNotEnough = 35105,    //数量不够
    FeishengRankBuyLimit = 35106,     //已达到购买上限
    FeishengRankVipNotEnough = 35107, //vip等级不够

    ArenaCopyTimesNotEnough = 35201, //竞技场次数不足
    ArenaCopyEnterCD,                //竞技场重进时间限制
    ArenaSelectEnemy,                //请选择挑战玩家
    ArenaCopyFlushCD,                //刷新CD中
    ArenaCopyTimesCannotBuy,         //竞技场次数购买失败
    ArenaCopyNotOpen,                //竞技场功能未开启

    //仙盟
    FactionCreateNotConfig = 36001,  //创建仙盟所需道具未配置
    FactionCreateVipNotConfig,       //创建仙盟所需vip未配置
    FactionCreateVipNotEnough,       //创建仙盟所需vip未达到
    FactionNameExist,                //仙盟名已存在
    FactionNotExist,                 //仙盟不存在
    FactionAlreadyJoin,              //已加入其它仙盟，无法申请加入
    FactionNotOpen,                  //仙盟未开启
    FactionNotJoin,                  //未加入仙盟
    FactionAlreadyJoinOther,         //该玩家已加入其它仙盟
    FactionLevelNotConfig,           //仙盟对应等级未配置
    FactionMemberLimit,              //仙盟成员达到上限
    FactionPowerNotConfig,           //仙盟权限没配置
    FactionNotPower,                 //没有对应权限
    FactionMoreMember,               //仙盟内还有其它成员，无法解散
    FactionNotMember,                //不是该仙盟成员
    FactionLeaderNotExit,            //需将盟主转移给其他盟友方可退出仙盟
    FactionPosLimit,                 //该职位人员已达到上限
    FactionPosNotApply,              //无法申请此职位
    FactionNotCreate,                //已加入其它仙盟，不能创建
    FactionAlreadyExit,              //该玩家已退出本盟
    FactionPosSame,                  //已任职当前职位
    FactionBroadcastCD,              //仙盟广播CD中
    FactionLeaderNotRelieved,        //无法卸任盟主
    FactionJoinCD,                   //申请加入CD中
    FactionJoinConditionNotEnough,   //未达到加入条件
    FactionNotInvitation,            //当前没有接到加入邀请
    FactionBoxNot,                   //宝箱不存在
    FactionBoxNotGet,                //不能领取该宝箱
    FactionBoxNotConfig,             //宝箱奖励未配置
    FactionBoxNotAssist,             //当前宝箱不需要帮助
    FactionBoxSendAssist,            //当前宝箱已发送请求帮助
    FactionBoxF5NotConfig,           //宝箱手动刷新未配置
    FactionBoxNotOpen,               //此宝箱不能打开
    FactionBoxNotOpenCount,          //开启宝箱次数不足
    FactionAssistBoxNotGet,          //请先领取之前协助别人开的宝箱
    FactionAssistNotEnough,          //协助次数不够
    FactionCopyNotOpen,              //仙盟副本未开启
    FactionCopyTimeNotEnough,        //进入副本时间不够
    FactionCoinInspireLimit,         //金币鼓舞达到上限
    FactionGoldInspireLimit,         //代币券鼓舞达到上限
    FactionNotInCopy,                //当前不在仙盟副本里面
    FactionNotInspire,               //当前已是鼓舞状态，不能重复鼓舞
    FactionHurtGet,                  //此档奖励已领取
    FactionHurtNotConfig,            //此档奖励没配置
    FactionHurtNotEnough,            //伤害值未达到
    FactionBoxNotAddSpeed,           //当前宝箱不能加速
    FactionSkillMax,                 //技能已满级
    FactionSkillNotConfig,           //技能没配置
    FactionSkillNotAction,           //技能未激活
    FactionSkillLevelNotEnough,      //所需仙盟等级未达到
    FactionTurnNotConfig,            //仙盟转盘没配置
    FactionTurnBlessAwardNotConfig,  //仙盟幸运值奖励没配置
    FactionTurnBlessNotCount,        //没有可领取的幸运值奖励
    FactionJoinSuccess,              //成功加入仙盟
    FactionLengthLimit,              //超出限制长度

    //时装
    FashionParamError = 37001,       //参数错误
    FashionLevelEnough,              //角色等级不够
    FashionNotOpen,                  //功能未开启
    FashionNotExist,                 //时装未激活

    //天珠
    TianZhuParamError = 38001,       //参数错误
    TianZhuLevelEnough,              //角色等级不够
    TianZhuNotOpen,                  //功能未开启
    TianZhuNotExist,                 //天珠未激活

    //洗炼
    xilianNotPart = 39001,           //洗炼部位不存在
    xilianNotNum,                    //洗炼槽不存在
    xilianCannotOpen,                //洗炼槽不可开启
    xilianNumIsOpen,                 //洗炼槽已开启
    DoingChangeScene,                //请稍等,正在切换场景中
    xilianRiseCannotAddLevel,        //锻造大师不能升级
    xilianNumIsLock,                 //锻造槽锁定状态
    xilianNumIsUnlock,               //锻造槽解锁状态
    xilianLockNumTooMany,            //洗炼槽锁定超过上限
    xilianSoltNotOpen,               //洗炼槽未开启
    xilianNotWareEquip,              //没有穿戴装备

    //神器
    shenQiFragmentNotEnough = 40001,  //碎片不足
    shenQiNotOpen,                    //神器功能未开启
    shenQiFragmentRepeat,             //不能放入重复碎片
    shenQiFragmentError,              //请放入神器对应碎片
    shenQiNotActivate,                //已激活所有神器
    shenQiNotActivateEnough,          //无法激活神器，请放入对应碎片

    openRewardOpenError = 41001,      //该活动已结束
    openRewardIDError = 41002,        //该礼包不存在
    openRewardGoldNotEnough = 41003, //该礼包已购买

    //周末狂欢-单笔
    WeekSinglePayNotOpen = 41101,    //活动未开启
    WeekSinglePayNotConfig,          //此档位未配置
    WeekSinglePayNotGet,             //未完成充值，不可领取

    //周末狂欢-登陆
    WeekLoginNotOpen,                //活动未开启
    WeekLoginNotConfig,              //此档位未配置
    WeekLoginNotGet,                 //未达到指定条件，不可领取
    WeekLoginNotRepeatGet,           //已领取，不可重复领取

    //周末狂欢-累充
    WeekAccumulateNotOpen,           //活动未开启
    WeekAccumulateNotConfig,         //此档位未配置
    WeekAccumulateNotGet,            //未达到指定条件，不可领取
    WeekAccumulateNotRepeatGet,      //已领取，不可重复领取

    //周末狂欢-消费
    WeekConsumeNotOpen,              //活动未开启
    WeekConsumeNotConfig,            //此档位未配置
    WeekConsumeNotGet,               //未达到指定条件，不可领取
    WeekConsumeNotRepeatGet,         //已领取，不可重复领取

    //限时礼包
    LimitPackNotOpen = 41201,        //活动未开启
    LimitPackNotLevel,               //没有对应等级的礼包
    LimitPackNotTime,                //礼包已过期
    LimitPackBuy,                    //礼包已购买
    LimitPackVipNotEnough,           //礼包购买所需vip等级不够
    LimitPackVipSortError,           //请先购买普通礼包才能购买vip礼包

    //意见反馈
    FeedbackCLimitNotConfig = 41301, //每日反馈次数限制没有配置
    FeedbackCLimit,                  //每日反馈次数达到上限
    FeedbackLimitNotConfig,          //反馈字数限制没有配置
    FeedbackLimit,                   //反馈字数超出限制范围

    //激活码
    CdkeyError = 41401,              //激活码错误
    CdkeyUse,                        //激活码已被使用
    CdkeyUseTime,                    //激活码不再使用期限内
    CdkeyUseCount,                   //激活码已达到使用上限

    //邀请礼包
    InviteRewardNotReward = 41501,    //未满足奖励条件

    //单次奖励
    OnceRewardDrawed = 41601,       //已领过该奖励
    OnceRewardIDError = 41602,      //不存在该奖励

    //仙玉
    XianYuGeF5NotConfig = 41701,    //玉阁刷新所需道具没配置
    XianYuGetGoodsNot,              //此商品不存在
    XianYuGetGoodsBuyLimit,         //此商品达到购买上限
    XianYuGetGoodsNotItem,          //此商品没有配置对应道具
    XianYuFuYuanGet,                //已领取该档位奖励
    XianYuFuYuanNotEnough,          //福缘值不够
    //无限手套
    GauntletUnopen = 41801,         //系统未开启
    GauntletUnactive,               //系统未激活
    GauntletUndraw,                 //未购买无法领取
    GauntletMaxLevel,               //原石已满级
    GauntletJeweled,                //已镶嵌原石

    //仙丹
    XianDanDayLimit = 41901,        //此类型仙丹达到每日使用上限
    XianDanUseLimit,                //仙丹已达到使用上限
    XianDanNotEnough,               //仙丹不够

    //改名
    SetNameCDError = 42001,         //改名cd中
    SetNameTimesError = 42002,      //改名次数限制

    //防骗
    PreventFoolError = 42101,         //答案错误
    PreventFoolComplete = 42102,      //答题完成

    //圣殿
    StrengthNotEnough = 42201,      //体力不足
    OutSceneStrength = 42202,      //您的体力不足，已被移出副本
    RewardNotStrength = 42203,      //您的体力不足，无法获得奖励

    //资源找回
    RetrieveTypeNotFound = 42301,   //没有可以找回的资源类型
    RetrieveCannnot,                //资源不可找回
    RetrieveTimesNotEnough,         //资源找回次数不足
}

declare const enum AuthStatus {
    WaitAuth,
    Auth,
    Login
}

declare const enum TimeGroup {
    ping = 10 * 1000,               //ping 时间
    save_min_db = 5 * 60 * 1000,    //数据保存最小时间
    save_max_db = 10 * 60 * 1000,   //数据保存最大时间
    db_ping = 15 * 1000,            //db ping
    syn_time = 30 * 1000,           //服务器间时间同步间隔
    session_out = 3 * 60 * 1000,    //会话超时
    token_out = 10 * 1000,           //token超时
    agent_out = 3 * 60 * 1000,      //玩家缓存
    chat_reconnection = 5 * 1000,   //聊天重连
    copy_judge = 2 * 1000,          //副本成功或失败后结算时间
    count_online = 5 * 60 * 1000,   //统计在线
    empty_copy_live_time = 30 * 1000,   //30秒内没玩家进入的副本自动销毁 针对多人副本
    module_mgr_time = 200,          //模块管理
    acotr_img_time = 60 * 1000,     //角色镜像保存时间
    map_cache_time = 60 * 1000,     //玩家MAP从缓存中进入场景时间 超时踢出
    dayMsecNymber = 86400000,       //一天毫秒数
    enter_tianti_time = 1000,       //匹配后等待进入天梯副本
    top_time = 60 * 1000,           //1分钟打印一次资源占用
    gc_time = 5 * 60 * 1000,        //5分钟手动GC
    bogus_client_time = 3000 * 1000, //模拟客户端
    scene_poll_time = 50,           //场景轮询
}

declare const enum BagId {
    itemType = 0,           //道具类
    equipType,              //装备类
    stoneType,              //仙石类
    magicWeaponType,        //圣物类
    xunbao,                 //探索仓库
    rune,                   //玉荣仓库
    xianyu,                 //仙玉探索仓库
    temple,                 //临时仓库
}

//道具更新
declare const enum ItemUpdateType {
    add = 0,        //新增
    addNum = 1,     //增加数量
    del = 2,        //删除
    delNum = 3,     //减少数量
    update = 4,     //更新
}

/**
 * 产生随机数时数值放大倍数
 */
declare const enum RandomMultiple {
    low = 1000,     //低精度
    high = 1000000,  //高精度
}

//角色类型
declare const enum OccType {
    Man = 1,
    Woman = 2,
}

//角色名字限制
declare const enum ActorNameLimit {
    min = 1,
    max = 6,
}

//流水类型
declare const enum ItemSource {
    db = 0,                 //从数据库加载
    monsterDrop = 1,        //怪物掉落
    onhook = 2,                 //挂机
    wear = 3,                   //穿戴
    task = 4,                   //任务
    gm = 5,                     //GM
    tianguanLevelAward = 6,     //天关关卡奖励
    pet = 7,                    //宠物
    sign = 8,                   //签到
    sevenDay = 9,               //七日礼
    sweepCopy = 10,              //扫荡副本
    skill = 11,                  //技能
    soul = 12,                   //金身
    gem = 13,                    //仙石
    amulet = 14,                 //圣物
    inspire = 15,                //鼓舞
    bossLastKillAward = 16,      //BOSS最后一击奖励
    bossMvpAward = 17,           //BOSS MVP奖励
    bossJoinKillAward = 18,      //BOSS参与奖励
    era = 19,                    //觉醒
    relive = 20,                 //复活
    strong = 21,                 //强化
    compose = 22,                //合成
    resolve = 23,                //分解
    smelt = 24,                  //熔炼
    //shilianCopy = 25,            //试炼副本
    onlineReward = 26,           //在线礼包
    lilian = 27,                 //历练
    xianwei = 28,                //仙位
    CrossBossLastKillAward = 29, //跨服BOSS最后一击
    CrossBossRankAward = 30,     //跨服BOSS排名奖励
    CrossBossHurtStage = 31,     //跨服BOSS伤害阶段奖励
    shenbing = 32,               //神兵
    wing = 33,                   //仙翼
    enterHomeBoss = 34,          //进入BOSS之家
    gatherBox = 35,              //采集宝箱
    bg_system = 36,              //后台系统
    xunbao = 37,                 //探索
    use = 38,                    //玩家使用
    giftbag = 39,                //礼包
    outline = 40,                //离线挂机
    monthCard = 41,              //月卡
    mall = 42,                   //商城
    vip = 43,                    //vip
    pay = 44,                    //用户充值
    ride = 45,                   //精灵
    onlieRewardMonthCardOpen = 46, //购买月卡后补发在线奖励
    signMonthCardOpen = 47,      //购买月卡后补发在线奖励
    exPay = 48,                  //用户充值赠送
    xunbaoExchange = 49,         //探索兑换
    copyTimesBuy = 50,           //副本次数购买
    firstPay = 51,               //首充
    runeInlay = 52,              //玉荣镶嵌
    runeRefine = 53,             //玉荣升级
    runeResolve = 54,            //玉荣分解
    runeExchange = 55,           //未央兑换
    sweepingIncom = 56,          //挂机收益
    sweepingUse = 57,            //挂机游荡消耗
    runeLevelAward = 58,         //未央幻境层数奖励
    runeEveryDatAward = 59,      //未央幻境每日奖励
    runeDial = 60,               //远古转盘
    dahuangLevelAward = 61,      //大荒关卡奖励
    XiangyaoReward = 62,         //降妖奖励
    dayPay = 63,                 //日充
    cumulatePay = 64,            //累充
    continuePay = 65,            //连充
    xianfuProduce = 66,          //仙府-家园产出
    zeroBuy = 67,                //0元购
    consumeReward = 68,          //消费赠礼
    nineCopyAward = 69,          //九天之巅奖励
    xianfuTraval = 70,           //仙府-家园灵兽游历
    investReward = 71,           //投资返利
    xianfuIllPromote = 72,       //图鉴激活或升级
    xianfuTravalImmediately = 73,//仙府-家园灵兽游历立即完成
    sprintRank = 74,             //冲榜
    tiantiDailyHonorAward = 75,  //天梯每日荣誉奖励
    tiantiRankAward = 76,        //天梯排名奖励
    tiantiFeatAward = 77,        //天梯功勋奖励
    tiantiJoinAward = 78,        //天梯参与奖励
    tiantiSegAward = 79,         //天梯段位奖励
    tiantiOutlineAward = 80,     //天梯掉线未领取
    payReward = 81,              //充值转盘
    xianfuTask = 82,             //仙府-家园任务
    xianfuActive = 83,           //仙府-家园活跃奖励
    gushen = 84,                 //古神问道
    xianfuDecActive = 85,        //仙府-家园物件激活或升级
    xianfuMake = 86,             //仙府-家园建筑炼制
    kuanghuan = 87,              //全民狂欢
    cumulatePay2 = 88,           //每日累充
    adventure = 89,              //奇遇事件
    cloudlandJoinAwards = 90,    //云梦之境参与奖励
    cloudlandKillAwards = 91,    //云梦之境参与奖励
    discountGift = 92,           //特惠礼包
    swimming = 93,               //昆仑瑶池
    fairy = 94,                  //仙女
    consumeReward2 = 95,         //消费返利
    fairyIntercept = 96,         //仙女拦截
    fairyEscort = 97,            //仙女护送
    adventureExchange = 98,      //奇遇兑换
    unrealItem = 99,             //虚拟道具
    tianguanCopy = 100,         //天关
    dahuangCopy = 101,          //大荒
    shilianCopy = 102,          //试炼
    runeCopy = 103,             //未央幻境
    teamCopy = 104,             //组队副本
    singleBossCopy = 105,       //单人BOSS
    bossHomeGather = 107,       //BOSS之家采集
    tiantiCopy = 108,           //天梯
    nineCopy = 109,             //九天之巅
    fairyCopy = 110,            //护送仙女
    cloudlandCopy = 111,        //云梦秘境
    payRewardTen = 112,         //充值转盘 10抽
    xianfuMonster = 113,        //仙府-家园小怪掉落
    xianfuOpen = 114,           //仙府-家园功能开启
    action = 115,               //功能预览开启
    activeDesignation = 116,    //激活称号
    feishengRank = 117,         //飞升榜
    factionCreate = 118,        //创建仙盟
    factionBox = 119,           //仙盟宝箱
    factionBoxF5 = 120,         //仙盟宝箱刷新
    factionOpenBox = 121,       //开仙盟宝箱
    factionInspire = 122,       //仙盟个人鼓舞
    factionBossKill = 123,      //仙盟BOSS击杀
    factionBossHurt = 124,      //仙盟BOSS伤害奖励
    factionBoxAddSpeed = 125,   //仙盟宝箱加速
    arenaCopy = 126,            //竞技场
    resetArenaCD = 127,         //重置竞技场入场CD
    arenaDailyAward = 128,      //竞技场每日奖励
    cumulatePayFS = 129,        //飞升榜每日累充
    paySingleFS = 130,          //飞升榜单笔充值
    consumeRewardFS = 131,      //飞升榜消费赠礼
    rushBuyFS = 132,            //飞升榜抢购
    discountGiftFS = 133,       //飞升榜特惠礼包
    factionSkill = 134,         //仙盟技能激活或升级
    factionTurn = 135,          //仙盟转盘
    factionTurnBless = 136,     //仙盟转盘幸运值
    fashion = 137,              //时装
    halfMonth = 138,            //半月礼
    everydayRebate = 139,       //天天返利
    tianzhu = 140,              //天珠
    factionCopy = 141,          //仙盟副本
    zhuhun = 142,               //铸魂
    loginReward = 143,          //登录豪礼
    openXilian = 144,           //开启锻造
    xilian = 145,               //锻造
    duobao = 146,               //开服夺宝
    singlePayJade = 147,        //单笔充值返魂玉
    singlePayPrint = 148,       //单笔充值返圣印
    duobaoRank = 149,           //夺宝排行
    openReward = 150,           //开服礼包
    jzduobao = 151,             //九州夺宝
    weekLogin = 152,            //周末狂欢-登陆
    weekAccumulate = 153,       //周末狂欢-累充
    weekConsume = 154,          //周末狂欢-消费
    consumeRank = 155,          //消费排行
    limitPack = 156,            //限时礼包
    zhizunCard = 157,           //至尊特权
    cdkey = 158,                //激活码兑换
    inviteReward = 159,                //激活码兑换
    vipF = 160,                 //免费vip
    oneBuy = 161,               //一元秒杀
    xianfuMakeFinish = 162,     //仙府-家园炼制立即完成
    moneyCat = 163,             //招财猫
    talisman = 164,             //战斗玉荣
    yugeF5 = 165,               //玉阁刷新
    yugeBuy = 166,              //玉阁购买
    gauntlet = 167,              //无限手套
    xianDan = 168,              //使用仙丹
    xianfuMall2Buy = 169,       //仙府-家园商城购买
    xianfuMall2F5 = 170,        //仙府-家园商城刷新
    jzduobaoRank = 171,        //九州夺宝排行
    jzduobaoJackpot = 172,       //九州夺宝奖池
    weekSinglePay = 173,        //周末狂欢-单笔
    fsDuobao = 174,             //飞升夺宝
    setNameOcc = 175,             //改名
    preventFool = 176,          //防骗
    autoTempleUse = 177,          //圣殿自动使用
    templeTimeDel = 178,          //圣殿定时扣体力
    pickTempleBag = 179,              //提取圣殿背包
    kuanghai = 180,              //狂嗨
    retrieve = 181,             //资源找回
    runCompose = 182,           //玉荣合成
}

//道具大类
declare const enum ItemMType {
    Material = 1,   //材料
    Consume = 2,    //消耗
    Giftbag = 3,    //礼包
    Stone = 4,      //仙石
    Equip = 5,      //装备
    MagicWeapon = 6,//圣物
    Rune = 7,       //玉荣
    Unreal = 9,     //虚拟道具
}

declare const enum UnrealItemType {
    gold = 1,             //代币券
    bind_gold = 2,        //绑元
    copper = 3,           //金币
    exp = 4,              //经验
    zq = 5,               //魔力
    skill = 6,            //技能书
    smeltExp = 7,         //熔炼经验
    xb_equip = 8,         //装备探索积分
    xb_dianfeng = 9,      //巅峰探索积分
    xb_zhizun = 10,       //至尊探索积分
    xb_xianfu = 11,       //仙符探索积分
    xb_fabao = 12,        //圣物探索积分
    shenbingShow = 13,    //神兵幻化[showId,itemId,count]
    wingShow = 14,        //仙翼幻化[showId,itemId,count]
    petShow = 15,         //宠物幻化[showId,itemId,count]
    rideShow = 16,        //精灵幻化[showId,itemId,count]
    runeExp = 17,         //玉荣经验
    lingQi = 18,          //仙府-家园药草
    riches = 19,          //仙府-家园财富
    fengShui = 20,        //仙府-家园风水
    illBook = 21,         //仙府-家园图鉴资源
    tiantiScore = 22,     //天梯积分
    tiantiHonor = 23,     //天梯荣誉
    tiantiFeat = 24,      //天梯功勋
    active = 25,          //仙府-家园活跃值
    cloudlandToken = 26,  //云梦令牌
    adventurePoint = 27,  //奇遇点
    adventureYunli = 28,  //奇遇探险次数
    petFazhen = 29,       //宠物法阵[showId,itemId,count]
    rideFazhen = 30,      //精灵法阵[showId,itemId,count]
    petRankOpen = 31,     //宠物升阶激活
    rideRankOpen = 32,    //精灵升阶激活
    xianweiExp = 33,      //仙位经验
    contribution = 34,    //仙盟贡献值
    fashionShow = 35,     //时装幻化[showId,itemId,count]
    tianZhuShow = 36,     //天珠幻化[showId,itemId,count]
    factionExp = 37,      //仙盟经验
    shenQiFragment = 38,  //神器碎片
    jzduobaoJackpot = 39, //奖池道具[per]
    vipFExp = 40,         //免费vip经验
    xianYu = 41,          //仙玉
    xianDan = 42,         //仙丹
    strength = 43,         //体力
    clanCoin = 44,         //战队币
    fightTeamExp = 45,     //战队经验 建设值

}

declare const enum ConsumeType {
    gold = 1,
    bind_gold = 2,
    copper = 3,
    exp = 4,
    zq = 5,
    vip_exp = 6,
    copy_times = 7,
    adventureYunli = 8,       //奇遇探险次数
    lingQi = 9,               //仙府-家园药草
    riches = 10,              //仙府-家园财富
    fengShui = 11,            //仙府-家园风水
    factionBoxAddSpeed = 12,  //仙盟宝箱加速卡
    petRise = 13,             //宠物直升丹
    rideRise = 14,            //精灵直升丹
}

declare const enum ItemChildTypeMult {
    item_1_1 = 10000000,
    item_2_3 = 100000,
    item_4_4 = 10000,
    item_5_5 = 1000,
    item_6_7 = 10,
    item_5_8 = 1,
    item_8_8 = 1
}

/**
 * effect、skill日志 1:打印日志
 */
declare const enum LogPrint {
    Effect = 0,
    skill = 0,
    hit = 0,
}

/**
 * 穿戴类型
 */
declare const enum WearType {
    wear,       //穿戴
    takeOff,    //脱下
}

/**
 * 任务类型
 */
declare const enum TaskType {
    none = 0,               //无效
    actorLvl = 1,           //主角等级
    actorEra = 2,               //主角觉醒
    wearNumColorGrade = 3,      //穿戴N件 XX品质和YY阶级的装备
    strongNum = 4,              //强化次数
    strongLvl = 5,              //强化总等级
    //starNum = 6,                //升星次数(废除)
    //starLvl = 7,                //升星总等级(废除)
    stoneInlay = 8,             //镶嵌N颗 XX等级的仙石
    stoneLvl = 9,               //仙石总等级
    petLvl = 10,                 //宠物总等级
    petGrade = 11,               //宠物阶数
    xianqiLvl = 12,              //精灵总等级
    xianqiGrade = 13,            //精灵阶级
    wingLvl = 14,                //羽翼等级
    wingNumColor = 15,           //激活N数量 XX品质的羽翼
    //wingStar = 16,               //羽翼总星级(废除)
    shenbingLvl = 17,            //神兵总等级
    shenbingNumColor = 18,       //激活N数量 XX品质的神兵
    //shenbingStar = 19,           //神兵总星级(废除)
    //fastionLvl = 20,             //时装等级
    //fastionNumColor = 21,        //激活N数量 YY品质的时装
    //fastionStar = 22,            //时装总星级
    //skillLvl = 23,               //技能总等级(废除)
    //magicWeaponNumColorLvl = 24, //N个 XX品质 YY等级圣物(废除)
    singleBossNum = 25,          //单人BOSS参与次数
    multiBossNum = 26,           //多人BOSS参与次数
    //xianlingTower = 27,          //仙灵塔层数(废除)
    //treasureHunting = 28,        //探索次数(废除)
    tianguanLvl = 29,            //天关关数
    dahuangLvl = 30,                     //大荒古塔通关层数
    smeltNum = 31,                       //熔炼N件装备
    juexueLvl = 32,                      //绝学等级
    killMonsterNumber = 33,              //挂机杀怪数量
    zhuangbeixunbaoNum = 34,             //装备探索N次
    doPetUpgradeOnce = 35,               //执行1次宠物进阶操作
    doPetUpdateOnce = 36,                //执行1次宠物培养操作
    doPetRefineOnce = 37,                //执行1次宠物修炼操作
    doXianqiUpgradeOnce = 38,            //执行1次精灵进阶操作
    doXianqiUpdateOnce = 39,             //执行1次精灵培养操作
    doXianqiRefineOnce = 40,             //执行1次精灵修炼操作
    doJuexueUpdateOnce = 41,             //进行1次绝学升级操作
    doFabaoUpdateOnce = 42,              //进行1次圣物升级操作
    doShenbingUpdateOnce = 43,           //进行1次神兵升级操作
    doSoulUpdateOnce = 44,               //进行1次金身修炼
    //activateOneShenbing = 45,            //激活一件神兵(废除)
    activateNumFabao = 46,               //激活N件圣物
    activateNumColorFabao = 47,          //激活N件特定品质的圣物
    activateNumColorLevelFabao = 48,     //激活N件特定品质特定等级的圣物
    SoulRankNum = 49,                    //N个金身达到X阶
    killMonsterWaveNum = 50,             //杀怪波数达到X波
    crossBossNum = 51,                   //跨服boss挑战次数
    arenaCopyNum = 52,                   //竞技场挑战次数
    copperCopyNum = 53,                  //哥布林王国挑战次数
    zhenqiCopyNum = 54,                  //泰拉矿场挑战次数
    xianqiCopyNum = 55,                  //精灵副本挑战次数
    petCopyNum = 56,                     //宠物副本挑战次数
    teamCopyNum = 57,                    //组队副本挑战次数
    dahuangCopyNum = 58,                 //大荒古塔挑战次数
    xianmengDonateNum = 59,              //仙盟捐献次数
    dailyLogin = 60,                     //每日登陆
    worldChatNum = 61,                   //世界聊天发起次数
    useGold = 62,                        //消耗代币券数量
    daohangLvl = 63,                     //活跃值等级达到X
    mishuNum = 64,                       //秘术数量
    amuletXunbaoNum = 65,                //圣物探索
    homeBossNum = 66,                    //boss之家挑战次数
    runeCopyNum = 67,                    //未央幻境次数
    tiantiCopyNum = 68,                  //天梯次数
    runeNum = 89,                        //镶嵌玉荣 xx品质数量
    rideFazhenNum = 90,                  //精灵法阵数量
    petFazhenNum = 91,                   //宠物法阵数量
    firstPay = 92,                       //首充
    monthCard = 93,                      //月卡
    vipLvl = 94,                         //vip等级
    investReward = 95,                   //投资返利(登录，天关，等级)
    runeCopyLvl = 96,                    //未央幻境层数
    shenbingRefineNum = 97,              //神兵附魂次数
    wingRefineNum = 98,                  //仙翼附魂次数
    runeResolveNum = 99,                 //玉荣分解次数
    stoneComposeNum = 100,               //仙石合成次数
    equipComposeNum = 101,               //装备合成次数
    wingFeedOnce = 102,                  //执行1次仙翼培养操作
    singleBossNum2 = 103,                //单人BOSS参与次数(击杀算完成，获取历史记录)
    multiBossNum2 = 104,                 //多人BOSS参与次数(击杀算完成，获取历史记录)
    crossBossNum2 = 105,                 //跨服boss挑战次数(成功算完成，获取历史记录)
    teamCopyNum2 = 106,                  //组队副本挑战次数(成功算完成，获取历史记录)
    homeBossNum2 = 107,                  //boss之家挑战次数(成功算完成，获取历史记录)
    copperCopyNum2 = 108,                  //哥布林王国挑战次数(击杀算完成，获取历史记录)
    zhenqiCopyNum2 = 109,                  //泰拉矿场挑战次数(击杀算完成，获取历史记录)
    xianqiCopyNum2 = 110,                  //精灵副本挑战次数(击杀算完成，获取历史记录)
    petCopyNum2 = 111,                     //宠物副本挑战次数(击杀算完成，获取历史记录)
    runeLevelNum = 112,                    //身上镶嵌的玉荣 穿x数量的y品质且达到z等级

    richesNum = 113,                       //天降财宝采集次数
    cloudlandCopyNum = 114,                //云梦秘境参与次数
    fairyNum = 115,                        //护送仙女
    swimmingCopyNum = 116,                 //昆仑瑶池
    nineCopyNum = 117,                     //九天之巅

    tianzhuLvl = 121,                      //天珠等级
    tianzhuNumColor = 122,                 //激活N数量 XX品质的天珠
    tianzhuRefineOnce = 123,               //天珠附魂1次
    tianzhuLvlOnce = 124,                  //进行1次天珠升级操作

    zhuhunLvl = 131,                       //铸魂等级
    zhuhunOnce = 132,                      //进行一次铸魂

    xilianLvlNum = 141,                    //锻造 x数量的y品质
    xilianOnce = 142,                      //进行一次锻造

    shenqiNum = 151,                       //神器激活数量
    shenqiOnce = 152,                      //进行一次神器激活操作
    shenqiFmNum = 153,                     //神器碎片数量

    suitNum = 161,                         //套装激活数量
    suitOnce = 162,                        //进行一次套装激活
    suitEquipNum = 163,                    //套装部位激活[id,数量]

    fashionLvl = 171,                       //时装等级
    fashionNumColor = 172,                  //激活N数量 YY品质的时装
    fashionLvlOnce = 173,                   //进行一次时装升级
    fashionRefineOnce = 174,                //进行一次时装附魂

    mallBuy = 175,                          //商城购买
    shenbingCopyNum = 176,                     //神兵副本挑战次数
    wingCopyNum = 177,                     //仙翼副本挑战次数
    fashionCopyNum = 178,                  //永恒之森挑战次数
    tianzhuCopyNum = 179,                  //天珠副本挑战次数
    xilianCopyNum = 180,                  //异次元裂缝挑战次数

    adventureNum = 191,                   //完成奇遇任务次数
    templeBossNum = 192,                  //圣殿boss
    xianfuTravelNum = 193,                  //仙府-家园游历
    xianfuLiandanNum = 194,                 //仙府-家园炼丹
    xianfuMobing = 195,                     //仙府-家园魔兵
    xianfuBoss = 196,                       //仙府-家园魔将
    xianfuSpirit = 197,                     //仙府-家园灵矿
    xianfuTreasure = 198,                   //仙府-家园宝矿
    xianfuLingqi = 199,                     //仙府-家园药草
    xianfuRich = 200,                       //仙府-家园粮食
    killBoss = 201,                         //击杀boss
    sellCashEquip = 801,                    //出售现金装备
}

/**
 * 任务状态
 */
declare const enum TaskState {
    running = 1,//运行
    complete,   //达成
}

declare const enum TaskUpdate {
    add = 1,    //添加任务
    del,        //删除任务
    update      //更新任务
}

/**
 * 货币
 */
declare const enum MoneyType {
    gold = 1,       //代币券
    bind_gold = 2,  //绑元
    copper = 3,     //金币
}

/**
 * 装备宝石格子数量
 */
declare const enum EquipGemGird {
    count = 5,
}

declare const enum EquipGemType {
    vip = 0,
    qinglong = 1,
    baihu = 2,
    zhuque = 3,
    xuanwu = 4,
}

declare const enum BlenId {
    unrealActivity = 1,
    defClothesId = 11,                  //默认衣服外观
    defWeaponId = 12,                   //默认武器外观
    defWing = 13,                       //默认翅膀外观
    defPet = 14,                        //默认宠物外观

    PVESuppressSkill = 1002,            //PVE战力压制技能

    emailAttachCount = 201,             //邮件附件上限
    emailLiveTime = 202,                //邮件存活时间
    emailLimitCount = 203,              //邮件数量上限

    petBirthSkill = 301,                //宠物初始技能

    rankLimit = 401,                    //排行榜排行数量
    rankLimit2 = 402,                   //跨服排行榜数量
    rankEnterCondition = 403,           //排行条件
    rankJudageTime = 404,               //排行结算时间

    itemBagBaseSize = 10001,            //初始道具背包大小
    equipBagBaseSize = 10002,           //初始装备背包大小
    stoneBagBaseSize = 10003,           //初始仙石背包大小
    magicWeaponBagBaseSize = 10004,     //初始法印背包大小
    xunbaoBagSize = 10006,              //初始探索背包大小
    smlteMinBagSize = 10007,            //熔炼最小背包大小
    runeBagSize = 10008,                //初始玉荣背包大小
    templeBagSize = 10010,              //初始临时背包大小
    firstTask = 10101,                  //第一个任务ID以及接取等级

    actorSkills = 10201,                //角色初始技能

    birthScene = 10301,                 //新手场景
    tianguanRank = 10302,               //天关排行数量
    countDown = 10303,                  //副本倒计时
    copperInspire = 10304,              //金币鼓舞 消耗#百分比#鼓舞上限
    goldInspire = 10305,                //代币券鼓舞 消耗#百分比#鼓舞上限
    multiBossRecoveryTime = 10306,      //多人BOSS恢复一次的时间
    multiBossRecoveryLimit = 10307,     //多人BOSS恢复上限
    multiBossPlayerSize = 10308,        //多人BOSS角色数量限制
    multiBossRandomTime = 10309,        //多人BOSS随机时间范围进入一个机器人

    copperCopyTimes = 10311,            //哥布林王国次数#代币券
    zqCopyTimes = 10312,                //泰拉矿场次数#代币券
    xianqiCopyTimes = 10313,            //精灵副本次数#代币券
    petCopyTimes = 10314,               //宠物副本次数#代币券
    copyScore = 10315,                  //副本星级评分

    shilianInspire = 10318,             //试炼鼓舞
    shenbingCopyTimes = 10319,          //神兵副本次数#代币券
    wingCopyTimes = 10320,              //仙翼副本次数#代币券
    fashionCopyTimes = 10321,           //师专副本次数#代币券
    tianzhuCopyTimes = 10322,           //天珠副本次数#代币券
    xilianCopyTimes = 10323,            //洗炼副本次数#代币券

    crossBossTimes = 10501,             //三界BOSS每日次数
    crossBossReliveBuff = 10502,        //三界BOSS 复活BUFF

    openBoxTimes = 10601,               //每日可开启珍品次数
    openBoxCostGold = 10602,            //普通开启珍品消耗代币券数
    openBoxCostItem = 10603,            //至尊开启珍品消耗的道具数量
    npcBoxDisplayTime = 10604,          //珍品宝箱在场景显示的时间
    homeBossDropLeveLimit = 10606,      //BOSS之家掉落等级限制

    teamCopyTimes = 10701,              //组队副本次数
    playerMatchTime = 10702,            //玩家匹配时间范围
    imgMatchTime = 10703,               //镜像匹配时间范围
    teamCopyMemberSize = 10704,         //组队副本人数
    enterTeamCopyCountdown = 10705,     //进入组队副成倒计时
    teamCopyRankLimit = 10706,          //组队副本排行数量
    teamCopyJumpLimitTime = 10707,      //组队副本跳波数时间限制
    teamCopyRobotSkills = 10708,        //组队副本机器人技能
    robotMatchTime = 10703,             //机器人匹配时间范围
    teamInviteCD = 10710,               //组队邀请CD

    // nineCopyOpenWeekDay = 10801,        //九天之巅开启周数
    // nineCopyPrepareTime = 10802,        //九天之巅预备时间
    // nineCopyOpenTime = 10803,           //九天之巅开启时间
    // nineCopyCloseTime = 10804,          //九天之巅关闭时间
    nineCopyLifeTimes = 10805,          //九天之巅生命次数
    nineCopyReEnter = 10806,            //九天之巅重进时间限制
    // nineCopyTotalScore = 10807,         //九天之巅总积分
    nineCopyKillMonsterScore = 10808,   //九天之巅击杀怪物积分
    nineCopyKillAcotrScore = 10809,     //九天之巅击杀角色积分
    nineCopyProtectedBuff = 10810,      //九天之巅保护BUFF
    // nineCopyImmuneBuff = 10811,         //九天之巅免疫BUFF
    nineCopyWaitEnterNextLevel = 10812, //九天之巅等待进入下一层
    // nineCopyRankCount = 10813,          //九天之巅排行数量

    xunbaoThirdReward = 15001,          //开服7天3倍奖励
    outlineTime = 15101,                //离线挂机最大时间
    cumulatePayTime = 15201,            //累充活动持续时间
    continuePayTime = 15301,            //连充活动持续时间
    consumeRewardTime = 15401,          //消费赠礼活动持续时间
    payRewardReward = 15501,          //充值转盘财富奖励参数

    monthCardRestDay = 10901,           //月卡到期提醒天数
    zhizunCardRestDay = 10951,          //至尊卡到期提醒天数

    tiantiTotalDayNum = 20101,          //天梯总天数
    tiantiTotalTimes = 20102,           //天梯总次数
    tiantiDailyTimes = 20103,           //天梯每日总次数
    tiantiRankCount = 20104,            //天梯排行数量
    tiantiRankScore = 20105,            //天梯上榜积分
    // tiantiSeasonStartTime = 20106,      //天梯新赛季开始时间
    // tiantiSeasonEndTime = 20107,        //天梯新赛季结束时间
    // tiantiCopyPrepareTime = 20108,      //天梯副本预备时间
    // tiantiCopyStartTime = 20109,        //天梯副本开始时间
    // tiantiCopyEndTime = 20110,          //天梯副本结束时间
    // tiantiCountineWinScore = 20111,     //天梯连胜积分
    tiantiPlayerMatchTime = 20112,      //天梯玩家匹配时间范围
    tiantiImgMatchTime = 20113,         //天梯镜像匹配时间范围
    taintiSeasonId = 20114,             //天梯赛季ID

    rideBroadcast = 21001,              //精灵
    petBroadcast = 21002,               //宠物
    shenbingBroadcast = 21003,          //神兵
    wingBroadcast = 21004,              //仙翼

    runeSlot = 23001,                   //玉荣槽
    runeDial = 23002,                   //未央幻境转盘
    runeResolveCD = 23003,              //玉荣分解CD

    sweepHour = 24001,                  //扫荡时长
    sweepMaxTimes = 24002,              //最大扫荡次数
    sweepUseGold = 24003,               //扫荡消耗代币券
    sweepMonster = 24004,               //扫荡对应杀怪数量

    xiangyaoMaxTimes = 25001,           //降妖最大可领取次数
    xiangyaoBossMaxTimes = 25002,       //boss降妖最大可领取次数

    chatTypeLimit = 26001,               //聊天类型等级限制
    chatExpressionCount = 26002,         //高级表情使用限制次数
    chatExpressionVip = 26003,           //高级表情不限制所需vip等级
    chatShortcut = 26004,                //快捷语句
    chatCacheLimit = 26005,              //聊天缓存上限
    chatCD = 26006,                      //聊天cd
    chatBlacklist = 26007,               //黑名单上限

    xianfuProduce = 27001,               //仙府-家园自动产出配置
    xianfuProduceLimit = 27002,          //仙府-家园手动产出上限
    xianfuProduceEveryCD = 27003,         //仙府-家园手动产出CD
    xianfuProduceEveryTime = 27004,      //仙府-家园手动每份所需时长
    xianfuTravalImmediately = 27005,     //立即完成游历所需代币券数的系数
    xianfuMakeLimit = 27006,             //仙府-家园手动每日制作上限
    xianfuTravelLimit = 27007,           //仙府-家园每日游历上限
    xianfuEventTime = 27008,             //仙府-家园事件触发点
    xianfuEventEndTime = 27009,          //仙府-家园事件持续时间
    xianfuEventLib = 27010,              //仙府-家园事件库
    xianfuActive = 27011,                //仙府-家园活跃值奖励
    xianfuSpeak = 27012,                 //仙府-家园灵兽行程语间隔时间
    xianfuGive = 27013,                  //仙府-家园功能开启时赠送道具
    xianfuMakeFinish = 27015,            //仙府-家园炼制立即完成所需金币，每秒
    xianfuMallF5Item = 27016,            //仙府-家园商店刷新所需道具
    xianfuMallF5Time = 27017,            //仙府-家园商店刷新时间
    xianfuMallCount = 27018,             //仙府-家园商店每次刷新的道具数量

    richesNpc = 28001,                   //天降财宝宝箱id
    richesGatherLimit = 28002,           //天降财宝采集上限
    richesTime = 28003,                  //天降财宝宝箱采集时间
    richesRefresh = 28004,               //天降财宝刷新时间

    adventrueLimit = 29001,              //奇遇事件积累上限
    adventrueTime = 29002,               //奇遇触发时间间隔
    adventrueCount = 29003,              //奇遇功能开启时触发事件数量
    adventrueYunli = 29004,              //奇遇每日探险次数
    adventruePoint = 29006,              //奇遇点

    cloudlandDailyTimes = 29101,        //云梦之境每日次数
    // cloudlandMaxTimes = 29102,          //云梦之境总次数

    swimmingTimeLimit = 30001,           //场景内逗留时间
    swimmingSoapLimit = 30002,           //捡肥皂上限
    swimmingSoapLength = 30003,          //肥皂区域长度
    swimmingSoapSum = 30004,             //整条区域总长度
    swimmingSoapStart = 30005,           //肥皂起始位置
    swimmingBuffTime = 30006,            //BUFF一次持续时间
    swimmingBuffAdd = 30007,             //BUFF加成
    swimmingOffset = 30008,              //肥皂区域容错偏移值
    swimmingSpeed = 30009,               //肥皂移动速度
    swimmingInterval = 30010,            //送道具间隔时间
    swimmingChangeSpeed = 30011,         //进入后移速变化

    fairyShowLimit = 31001,              //仙女显示上限
    fairyOpenTime = 31002,               //仙女开启时间
    fairyEscortLimit = 31005,            //仙女护送上限次数
    fairyInterceptLimit = 31006,         //仙女每日拦截上限
    fairyLootingtLimit = 31007,          //仙女被拦截次数
    fairyRefreshCD = 31010,              //仙女刷新CD
    fairyRefreshConsume = 31011,         //仙女刷新消耗
    fairyVip = 31012,                    //选择仙女所需VIP等级
    fairyRefreshVipConsume = 31013,      //选择仙女所需消耗
    fairyAwardPer = 31014,               //拦截奖励扣除百分比

    copyLimit = 33001,                   //副本第一次进入限时时间

    factionCreateItem = 36001,           //创建仙盟所需道具
    factionCreateVip = 36002,            //创建仙盟所需vip等级
    factionPower = 36003,                //仙盟权限
    factionCheckDay = 36005,             //自动转让盟主天数
    factionInvitation = 36006,           //仙盟自动邀请
    factionBroadcastCd = 36007,          //仙盟广播CD
    factionJoinCd = 36008,               //仙盟加入CD
    factionBoxOpen = 36009,              //仙盟宝箱开启等级
    factionBoxUpdateTime = 36010,        //仙盟宝箱更新时间
    factionFreeBoxUpdate = 36011,        //免费更新宝箱次数
    factionMoneyBoxUpdate = 36012,       //付费更新宝箱道具
    factionBoxCount = 36013,             //更新宝箱数量
    factionOpenBoxCount = 36014,         //每天可开宝箱数量
    factionBoxWeight = 36015,            //宝箱刷新权值
    factionBoxDelTime = 36016,           //宝箱停留时间
    factionBoxFreeOpen = 36017,          //免费开宝箱次数
    factionBoxFreeOpenCD = 36018,        //免费开宝箱次数恢复CD
    factionMoneyOpenBox = 36019,         //开宝箱所需道具
    factionAssistCount = 36020,          //每日可协助别人的次数
    factionBoxOpenTime = 36021,          //宝箱开启所需时间
    factionCopyOpenLevel = 36022,        //仙盟副本开启等级
    factionCopyTime = 36023,             //仙盟副本时间
    factionMassacreBuffPer = 36024,      //戮仙BUFF百分比
    factionMassacreBuffCount = 36025,    //戮仙BUFF所需人数
    factionInspireCoin = 36026,          //个人金币鼓舞
    factionInspireGold = 36027,          //个人代币券鼓舞
    factionAllInspireGold = 36028,       //全员代币券鼓舞
    factionTurnFreeCount = 36029,        //仙盟转盘次数
    factionTurnItem = 36030,             //仙盟转盘所需道具
    factionTurnBless = 36031,            //仙盟转盘最大幸运值
    factionTurnBlessItem = 36032,        //仙盟转盘幸运值奖励
    factionTurnBlessWeight = 36033,      //仙盟转盘权值
    factionTurnRecordMax = 36034,        //仙盟转盘最大记录
    factionCopyTimeItem = 36035,         //诛仙令id
    factionTitleLimit = 36039,           //招人标题限制长度
    factionNoticeLimit = 36040,          //公告限制长度
    factionNameLimit = 36041,            //名字限制长度
    factionJoinChat = 36042,             //加入者聊天
    factionOtherChat = 36043,            //其它人聊天

    arenaCopyCD = 37001,                 //竞技场CD
    arenaCopyResetCD = 37002,            //竞技场重置CD每秒所需代币券
    arenaCopyDailyAward = 37003,         //竞技场每日发放奖励时间
    arenaCopyRecordNum = 37004,          //竞技场挑战记录条数
    arenaCopyRobotName = 37005,          //竞技场机器人名字
    arenaCopyDailyTimes = 37006,         //竞技场每日次数
    arenaCopyFlushCD = 37007,            //竞技场刷新CD时间
    arenaCopyRankNum = 37008,            //竞技场排名数量

    xilianColorWeightsCommon = 38001,    //普通洗炼颜色权值
    xilianColorWeightGold,               //代币券消耗洗炼颜色权值
    xilianColorWeightJipin,              //消耗极品石洗炼颜色权值
    xilianColorWeightPerfect,            //消耗完美石洗炼颜色权值
    xilianLockConsumeCommonStone,        //锁定洗炼消耗的锻造石
    xilianLockConsumeGold,               //锁定洗炼消耗的代币券
    xilianOpenEraLevel,                  //洗炼部位锻造开启要求觉醒等级
    xilianOpenConsumeGold,               //锻造开启消耗 X代币券
    xilianFreeDailyTime,                 //每天免费洗炼次数
    xilianOpenVipLevel,                  //洗炼开启最后一个槽需要的VIP等级
    xilianLockConsumeJipinStone,         //锁定洗炼消耗的极品锻造石
    xilianLockConsumePerfectStone,       //锁定洗炼消耗的完美锻造石

    singlePayJadeDay = 40001,            //单笔充值返魂玉下次开的间隔天数
    singlePayPrintDay = 40002,           //单笔充值返圣印下次开的间隔天数
    consumeRankDay = 40003,              //消费排行间隔多少天后开
    consumeEndTime = 40004,              //消费排行结束时间
    consumeOpenDay = 40005,              //消费排行开启天数

    jzduobaoOpenDay = 41001,             //九州夺宝开启时间#间隔时间
    jzduobaoEndTime = 41002,             //九州夺宝持续时间
    jzduobaoRun = 41003,                 //扣代币券数 一次#十次
    jzduobaoTax = 41004,                 //扣税比例
    jzduobaoJackpot = 41005,             //奖池保底代币券数

    xianweiSuppress = 42001,             //仙位压制
    lilianSuppress = 42002,              //历练压制

    feedbackLimit = 44001,               //意见反馈字数限制
    feedbackCountLimit = 44002,          //意见反馈每日上限

    inviteLimit = 45001,                    //邀请次数上限
    inviteCold = 45002,                    //分享冷却时间(s)
    inviteReward = 45003,                    //分享奖励
    inviteRefresh = 45004,                    //重置时间(时)

    realNameReward = 46001,             //实名奖励
    followReward = 46002,               //关注奖励
    LoginVipReward = 46003,             //登录vip奖励

    eraDanID = 47001,                   //觉醒丹ID

    xianyuLimit = 48001,                //仙玉每日可获取上限
    xianyuPay = 48002,                  //仙玉充值档位获得的仙玉值
    xianyuFuYu = 48003,                 //仙玉探索一次获得的福缘值
    xianyuFuYuItem = 48004,             //仙玉福缘奖励
    xianyugeF5Item = 48005,             //仙玉玉阁刷新所需道具
    xianyugeF5Time = 48006,             //仙玉玉阁刷新时间
    xianyugeCount = 48007,              //仙玉玉阁每次刷新的道具数量

    moneyCatAward = 49001,              //招财猫奖励
    talismanAward = 49002,              //战力护符奖励

    xiandanLimit = 50001,               //仙丹使用上限

    gauntlet = 51000,                   //无限手套
    gauntletAward = 51001,              //无限手套奖励
    gauntletSkill = 51101,              //手套技能ID

    nameOccItem = 52001,             //改名道具
    nameOccCD = 52002,               //改名cd
    nameOccTimes = 52003,             //改名次数

    strengthItem = 58001,               //体力丹
    templeStrength = 58002,             //圣殿体力
    strengthLimit = 58003,               //体力上限
    strengthValue = 58004,               //体力

    sceneBranch = 59001,                //场景分数
    kuanghai = 59101,                   //狂嗨数据

    fishMaterial = 72012,               //钓鱼消耗材料
    fishAboutInfo = 72013,              //钓鱼玩法说明
    fishRollInfo = 72014,               //钓鱼概率公示
    XunbaoContinueType = 72015,               //连充活动type 1钓鱼
    XunbaoGiftType = 72016,               //礼包活动type 1钓鱼
    fishCkid = 72017,               //钓鱼宝库type 1钓鱼
    fishReapid = 72018,               //钓鱼返利type 1钓鱼
    fishShopid = 72019,               //钓鱼返利type 1钓鱼
}

declare const enum OnceReward {
    begin = 46000,
    realNameReward = 46001,             //实名奖励
    followReward = 46002,               //关注奖励
    LoginVipReward = 46003,             //登录vip奖励
    end
}

declare const enum SCENE_ID {
    scene_tianguan = 2011,      //天关
    scene_dahuang = 2021,       //大荒
    scene_single_boss = 2031,   //单人BOSS
    scene_multi_boss = 2041,    //多人BOSS
    scene_copper_copy = 2051,   //哥布林王国
    scene_zq_copy = 2061,       //泰拉矿场
    scene_xianqi_copy = 2071,   //精灵副本
    scene_pet_copy = 2081,      //宠物副本
    scene_team_copy = 2091,     //组队副本
    scene_cross_boss = 2101,    //跨服BOSS
    scene_era_copy = 2111,      //觉醒副本
    scene_home_boss = 2121,     //BOSS之家
    scene_adventure_monster = 2131, //奇遇小怪
    scene_cloudland_copy = 2151,//云梦秘境
    scene_nine_copy = 2161,     //九天之巅
    scene_tianti_copy = 2171,   //天梯
    scene_riches = 2181,        //天降财宝
    scene_rune_copy = 2201,     //未央幻境副本
    scene_homestead = 2241,     //家园
    scene_adventure_boss = 2251,//奇遇boss
    scene_adventure_pk = 2261,  //奇遇pk
    scene_swimming = 2141,      //昆仑瑶池
    scene_fairy = 2271,         //护送仙女
    scene_arena_copy = 2281,    //竞技场
    scene_faction = 2291,       //仙盟诛仙

    scene_shenbing_copy = 2301, //神兵副本
    scene_wing_copy = 2311,     //仙翼副本
    scene_fashion_copy = 2321,  //永恒之森
    scene_tianzhu_copy = 2331,  //天珠副本
    scene_xilian_copy = 2341,   //洗炼副本
    scene_guanghuan_copy = 2371,   //洗炼副本

    scene_temple_boss = 2351,   //圣殿boss
    scene_xuanhuo_boss = 2361,   //玄火boss
    scene_xuanhuo_arena = 2361, //玄火争夺战

    scene_marry_copy = 2381, //姻缘副本

    scene_teamchief_copy = 3001,            //战队逐鹿 首领战
    scene_teamPrepare_copy = 3101,          //战队逐鹿 争夺战准备场景
    scene_teamBattle_copy = 3201,           //战队逐鹿 争夺战战斗场景
}

//场景类型
declare const enum SceneType {
    common = 0,     //普通场景
    singleCopy,     //单人副本
    multiCopy,      //多人副本
    forever,        //常驻场景
    faction,        //仙盟场景
}

//场景类型
declare const enum SceneTypeEx {
    common = 0,             //普通场景
    tianguanCopy = 1,       //天关副本
    dahuangCopy = 2,        //大荒古塔
    singleBossCopy = 3,     //单人BOSS
    multiBoss = 4,          //多人BOSS
    copperCopy = 5,         //哥布林王国
    zqCopy = 6,             //泰拉矿场
    xianqiCopy = 7,         //精灵副本
    petCopy = 8,            //宠物副本
    teamCopy = 9,           //组队副本
    crossBoss = 10,         //三界BOSS
    eraCopy = 11,           //觉醒副本
    homeBoss = 12,          //BOSS之家
    runeCopy = 13,          //未央幻境
    nineCopy = 14,          //九天之巅
    homestead = 15,         //家园
    tiantiCopy = 16,        //天梯
    richesCopy = 17,        //天降财宝
    adventrueBoss = 18,     //奇遇boss
    adventruePK = 19,       //奇遇pk
    adventrueMonster = 20,  //奇遇小怪
    cloudlandCopy = 21,     //云梦秘境
    swimming = 22,          //昆仑瑶池
    fairy = 23,             //护送仙女
    arenaCopy = 24,         //竞技场
    faction = 25,           //仙盟诛仙
    shenbingCopy = 26,      //神兵副本
    wingCopy = 27,          //仙翼副本
    fashionCopy = 28,       //永恒之森
    tianzhuCopy = 29,       //天珠副本
    xilianCopy = 30,        //洗炼副本
    templeBoss = 31,        //圣殿boss
    xuanhuoCopy = 32,       //战队玄火
    marryCopy = 33,         //姻缘副本
    teamChiefCopy = 34,         //战队逐鹿 首领战
    teamPrepare = 35,           //战队逐鹿 积分赛准备场景
    teamBattleCopy = 36,        //战队逐鹿 积分赛
    guangHuanCopy = 37,     //光环副本
    debugCopy = 40,         //测试副本
}

//技能更新
declare const enum SkillUpdateOper {
    add = 1,
    update = 2,
}

//装备分类
declare const enum EquipCategory {
    weapon = 1,   //武器
    hats = 2,     //帽子
    clothes = 3,  //衣服
    hand = 4,     //护手
    shoes = 5,    //鞋子
    belt = 6,     //腰带
    necklace = 7, //项链
    bangle = 8,   //手镯
    ring = 9,     //戒指
    jude = 10,    //玉佩
    all,          //所有部位
}

declare const enum UnrealCategory {
    money = 1,        //代币券
    coin = 3,           //金币
    exp = 4,            //经验
    energy = 5             //魔力
}

//功能开启类型
declare const enum ActionOpenType {
    actorLevel = 1,     //角色等级
    tianguanLevel = 2,  //天关关数
    openServerDay = 3,  //开服天数
    vipLevel = 4,       //VIP等级
    createDay = 5,      //创角天数
    runeLevel = 6,      //未央幻境关数
    userDefined = 10,   //自定义
}

//功能开启状态
declare const enum ActionOpenState {
    notOpen = 0,    //未开启
    open,  //开启
    close,  //关闭
    show,  //显示
}

declare const enum ActionOpenPolicy {
    one = 1,
    all
}

//功能开启ID
declare const enum ActionOpenId {
    begin = 0,
    singleBossCopy = 1,         //单人副本
    petFeed = 2,                //宠物喂养
    petMagicShow = 3,           //宠物幻化
    petRefine = 4,              //宠物修炼
    sevenDay = 5,               //七日礼
    welfare = 6,                //福利
    sign = 7,                   //签到
    onlineReward = 8,           //在线礼包
    lilian = 9,                 //历练
    xianwei = 10,                //仙位
    skill = 11,                  //技能
    rideFeed = 12,               //精灵培养
    rideMagicShow = 13,          //精灵幻化
    rideRefine = 14,             //精灵修炼
    amulet = 15,                 //圣物
    soul = 16,                   //金身
    strong = 17,                 //强化
    gem = 18,                    //仙石
    smelt = 19,                  //熔炼
    multiBoss = 20,              //多人boss
    dahuang = 21,                //大荒古塔
    copperCopy = 22,             //哥布林王国
    zqCopy = 23,                 //泰拉矿场
    petCopy = 24,                //宠物副本
    rideCopy = 25,               //精灵副本
    era = 26,                    //觉醒
    compose = 27,                //合成
    resolve = 28,                //分解
    shenbingFeed = 29,           //神兵培养
    shenbingMagicShow = 30,      //神兵幻化
    shenbingRefine = 31,         //神兵修炼
    wingFeed = 32,               //仙翼培养
    wingMagicShow = 33,          //仙翼幻化
    wingRefine = 34,             //仙翼修炼
    //xunbaoEquip = 35,            //装备探索
    //xunbaoDianfeng = 36,         //巅峰探索
    //xunbaoZhizun = 37,           //至尊探索
    //xunbaoXianfu = 38,           //仙符探索
    paihangbang = 39,            //排行榜
    monthCard = 40,              //月卡
    threeWorldsBoss = 41,           // 三界BOSS
    bossHome = 42,                  // BOSS之家
    teamCopy = 43,               //组队副本
    petRank = 44,                //宠物进阶
    rideRank = 45,               //坐骑进阶
    tianguan = 46,               //天关
    vip = 47,                    //vip
    bag = 48,                    //背包
    xunbao = 49,                 //探索
    recharge = 50,               //充值
    firstPay = 51,               //首充
    store = 52,                    //商城
    store_1 = 53,               //商城1
    store_2 = 54,               //商城2
    store_3 = 55,                //商城3
    store_4 = 56,                 //商城4
    //xunbaoExchange=57,            //探索兑换
    //xunbaoTalisman=58,            //圣物探索
    copy = 59,                    //副本主入口
    daily = 60,                   //日常主入口
    boss = 61,                    //boss主入口
    storeAndShop = 62,            //商城和商店顶级入口
    shilian = 63,                 //每日试炼
    shop = 71,                    //商店(71-75)
    shop_1 = 72,                  //商店1
    shop_2 = 73,                  //商店2
    shop_3 = 74,                  //商店3
    shop_4 = 75,                  //商店4
    rune = 76,                    //辟邪玉
    runeCompose = 77,             //玉荣合成
    runeCollect = 78,             //玉荣收集箱
    xunbaoExchange = 81,            //探索兑换(81-90)
    equipExchange = 82,             //装备兑换
    dianfengExchange = 83,          //巅峰兑换
    zhizunExchange = 84,            //至尊兑换
    xianfuExchange = 85,            //仙符兑换

    xunbaoTalisman = 91,           //圣物探索(91-100)
    xunbaoEquip = 92,            //装备探索
    xunbaoDianfeng = 93,         //巅峰探索
    xunbaoZhizun = 94,           //至尊探索
    xunbaoXianfu = 95,           //仙符探索

    xiuxianEnter = 101,          // 修仙入口
    xianfaEnter = 102,           // 仙法入口
    xianlingEnter = 103,         // 仙灵入口
    duanzaoEnter = 104,          // 锻造入口
    beibaoEnter = 105,           // 背包入口
    actorEnter = 106,            // 角色入口
    sweepingEnter = 107,         // 扫荡入口
    roleEnter = 108,        // 角色入口
    runeCopy = 109,              //玉荣副本
    xiangyao = 110,              //降妖
    dayPay = 111,                //日充
    cumulatePay = 112,           //累充

    chatCross = 113,             //聊天九州（跨服）频道
    chatLocal = 114,             //聊天本服频道
    continuePay = 115,           //连充
    xianFuEnter = 116,        //仙府-家园入口
    zeroBuy = 117,               //0元购
    consumeReward = 118,         //消费赠礼
    sports = 119,                   // 竞技入口
    nineCopy = 120,                 // 九天之巅
    investReward = 121,             //成长返利
    petFazhen = 122,                //宠物法阵
    immortalEnter = 123,            // 神兵入口
    wingEnter = 124,                // 仙翼入口
    sprintRank = 125,               //开服冲榜
    rideFazhen = 126,                //精灵法阵
    payReward = 127,                //充值转盘
    actionList = 128,               //活动列表
    tianti = 129,                   //天梯
    gushen = 130,                   //古神问道
    riches = 131,                   //天降财宝
    sprintRank2 = 132,              // 开服冲榜第二天
    sprintRank3 = 133,              // 开服冲榜第三天
    sprintRank4 = 134,              // 开服冲榜第三天
    sprintRank5 = 135,              // 开服冲榜第三天
    sprintRank6 = 136,              // 开服冲榜第三天
    sprintRank7 = 137,              // 开服冲榜第三天
    sprintRankEnter = 138,          // 开服冲榜入口
    kuanghuan = 139,                //全民狂欢
    cumulatePay2 = 140,             //每日累充
    adventrue = 141,                //奇遇
    cloudlandCopy = 142,            //云梦秘境
    discountGift = 143,             //特惠礼包
    swimming = 144,                 //昆仑瑶池
    fairy = 145,                    //护送仙女
    consumeReward2 = 146,           //消费返利2
    consumeReward3 = 300,           //daw 消费返利3
    openServerActivit = 147,        //开服活动
    TreesSpring = 299,             //植树迎春 daw
    adventureEnter = 148,           // 奇遇入口
    adventureShop = 149,            // 奇遇商店
    xianfuFengshui = 150,            //仙府-家园风水
    xianfuTask = 151,                //仙府-家园任务
    xianfuShengji = 152,            //仙府-家园升级
    investLogin = 153,             //登录返利
    investRecruit = 154,             //闯关返利
    kuanghuan2 = 155,             //全民狂欢2
    actionPreviewEnter = 156,             //功能预览入口
    quickToReceiveEnter = 157,             //在线礼包快捷领取入口
    factionEnter = 158,          //仙盟主入口
    factionJoin = 159,           //加入仙盟
    faction = 160,               //仙盟
    factionMember = 161,         //仙盟成员
    factionWeal = 162,           //仙盟福利
    playerTitle = 163,           //角色称号
    soaringRank = 164,           //飞升榜
    arenaCopy = 165,             //竞技场
    chatFaction = 166,           //仙盟聊天
    soaringActivityEnter = 167, //飞升大礼包 活动入口
    cumulatePayFS = 168,            //飞升榜每日累充
    paySingleFS = 169,              //飞升榜单笔充值
    consumeRewardFS = 170,          //飞升榜消费赠礼
    rushBuyFS = 171,                //飞升榜抢购
    discountGiftFS = 172,           //飞升榜特惠礼包
    everydayRebate = 173,        //天天返利
    fashionFeed = 174,           //时装培养
    fashionMagicShow = 175,      //时装幻化
    fashionRefine = 176,         //时装修炼
    tianZhuFeed = 177,           //天珠培养
    tianZhuMagicShow = 178,      //天珠幻化
    tianZhuRefine = 179,         //天珠修炼
    halfMonth = 180,             //半月礼
    fashionEnter = 181,         // 时装入口
    tianZhuEnter = 182,         // 天珠入口
    factionSkill = 183,       //仙盟技能
    baozangList = 184,       //宝藏列表
    mineBaozang = 185,   //我的宝藏
    helpBaozang = 186,   //宝藏协助
    factionCopy = 187,   //宝藏副本
    factionHurt = 188,   //仙盟伤害列表
    shenqi = 189,        //神器
    xilian = 190,               //洗炼
    loginReward = 191,   //登录豪礼
    zhuhun = 192,        //铸魂
    activity = 193,         //活动
    equipSuit = 194,        //装备套装
    duobao = 195,           //夺宝
    singlePayJade = 196,    //单笔充值返魂玉
    singlePayPrint = 197,   //单笔充值返圣印
    openReward = 198,       //开服礼包

    equipSuitPanel_0 = 199,  //套装面板0
    equipSuitPanel_1 = 200,  //套装面板1
    equipSuitPanel_2 = 201,  //套装面板2
    equipSuitPanel_3 = 202,  //套装面板3
    equipSuitPanel_4 = 203,  //套装面板4
    equipSuitPanel_5 = 204,  //套装面板5
    equipSuitPanel_6 = 205,  //套装面板6
    equipSuitPanel_7 = 206,  //套装面板7
    equipSuitPanel_8 = 207,  //套装面板8
    equipSuitPanel_9 = 208,  //套装面板9



    weekConsume = 209,      //消费赠礼（周末狂欢)
    weekSinglePay = 210,    //周末狂欢-单笔充值
    weekLogin = 211,        //周末狂欢-登陆
    weekAccumulate = 212,   //周末狂欢-累充
    consumeRank = 213,      //消费排行
    limitPack = 214,        //限时礼包
    weekRevelry = 215, // 周末狂欢入口
    zhuanPanEnter = 216,//转盘入口
    jzduobao = 217,           //九州夺宝
    zhizunCard = 218,        //至尊特权
    shenbingCopy = 219,     //神兵副本
    wingCopy = 220,         //仙翼副本
    fashionCopy = 221,      //永恒之森
    tianzhuCopy = 222,      //天珠副本
    xilianCopy = 223,       //洗炼副本
    guanghuanCopy = 404,       //光环副本
    feedBack = 224,       //意见反馈
    announcement = 225,     //激活码/公告
    kuanghuan3 = 226,  //全名战力狂欢
    invitationEnter = 227,  //邀请有礼入口
    realName = 228,         // 实名认证
    officialAccount = 229,      // 关注公众号
    vipF = 230,             //免费vip
    oneBuy = 231,           //一元秒杀
    // oneBuyEnter = 232,      //一元秒杀入口
    xianYu = 233,//仙玉主界面
    xianYu1 = 234,//仙玉抽奖界面
    xianYu2 = 235,//仙玉商店
    xianYu3 = 236,//仙玉仓库
    xianYuEnter = 237,//仙玉入口
    xianDan = 238,   //仙丹
    xianFuMall2 = 239,    //仙府-家园商店2
    zhanLiHuFu = 240,//战力护符
    wuXianShouTao = 241,//无限手套
    rename = 242,       // 改名换性
    resBack = 243,       // 资源找回
    theCarnivalEnter = 244,//全民狂欢
    theCarnival = 245,//狂嗨
    shengYu = 246,//圣域BOss
    preventFool = 247, //防骗
    xianFuSmelt = 248, // 炼金药剂
    zhanLiHuFuNew = 249, //勋章界面（老版战力护符）

    //区长分红
    Daw_UI_QUZHANG = 88001,
    //战力分红
    Daw_UI_ZHANLI = 88002,
    //战力分红历史
    Daw_UI_ZHANLIList = 88003,
    //daw新增转盘
    Daw_UI_UI_Reward = 88004,
    //提现页面
    Daw_UI_TiXian = 88005,
    //提现历史
    Daw_UI_TiXianList = 88006,

    cumulatePay3 = 300,             //每日累充 daw
    // MissionParty = 302,             //狂嗨2入口 daw
    MissionPartyEnter = 301,             //狂嗨2 daw

    ClanEntry = 302, //战队入口
    ClanJoin = 303, //加入战队
    ClanIndex = 304, //战队主頁
    ClanLuckyField = 305, //战队福地
    ClanStore = 306, //战队商城
    XuanHuo = 307, //战队-玄火争夺战
    HolyEquip = 308, //圣装入口
    ZhiZunLiBao = 309, //至尊礼包
    CashEquip = 312, // 现金装备-奇珍异宝
    superVip = 313,  //超级vip专属
    customTitle = 314,  //称号定制
    jiuxiaoling = 315,  //九霄令

    ceremonyGeocaching = 316,           //开服活动-庆典夺宝
    LimitOneDiscountStore = 317,        //开服活动-庆典商城  限时一折
    ceremonyCash = 318,                 //开服活动-庆典兑换
    doubleDrop = 319,                   //开服活动-掉落狂欢
    ceremonyContinuePay = 321,          //开服活动-连续充值
    singleRecharge = 322,               //开服活动-单笔充值

    marry = 330,  // 姻缘
    marryRing = 331,  // 义戒
    marryKeepsake = 332,  // 信物
    marryKeepsakeGrade = 333,  // 信物进阶
    marryDoll = 334,  // 仙娃
    marryDollGrade = 335,  // 仙娃
    marryDollEat = 336,  // 仙娃
    marryGift = 348,  // 姻缘结婚
    // 姻缘	330
    // 姻缘义戒	331
    // 姻缘信物培养	332
    // 姻缘信物进阶	333
    // 姻缘仙娃培养	334
    // 姻缘仙娃进阶	335
    // 姻缘仙娃进补	336
    chatMarry = 500,           //姻缘聊天
    marryCopy = 501,           //姻缘副本入口

    // 钓鱼 / 休闲垂钓 / 九州渔场
    fishAtv = 340, // 入口活动
    fish = 341, // 主界
    fishCk = 342, // 垂钓宝库
    fishRank = 343, // 垂钓排行
    fishGift = 344, // 垂钓礼包
    fishLink = 345, // 垂钓连充
    fishReap = 346, // 垂钓返利
    fishShop = 347, // 垂钓商城

    weekCard = 349, // 周卡返利
    weekXianyu = 350, // 仙玉周卡返利
    weekYuanbao = 351, // 代币券周卡返利

    sevenActivity = 352, // 七日活动

    heroAura = 353, // 主角光环

    demonOrderGift = 354, //魔神令
    dishu = 355, //打地鼠
    dishu_xfzl = 356, //打地鼠-消费赠礼(累积-任务)
    dishu_mrlc = 357, //打地鼠-每日累充
    dishu_lchl = 358, //打地鼠-累充豪礼
    dishu_mrdb = 359, //打地鼠-每日单笔

    explicitSuit = 361,//外显套装
    explicitSuitBest = 362,//外显套装-极品
    explicitSuitUnique = 363,//外显套装-绝品
    explicitSuitCollecttion = 364,//外显套装-典藏

    levelhb = 370,                  // 等级红包
    levelfh = 371,                  // 等级分红
    superhb = 372,                  // 超级红包
    superhbdh = 373,                // 超级红包兑换

    equipSuitPanel_10 = 374,  //套装面板10
    equipSuitPanel_11 = 375,  //套装面板11
    equipSuitPanel_12 = 376,  //套装面板12
    equipSuitPanel_13 = 377,  //套装面板13
    equipSuitPanel_14 = 378,  //套装面板14

    year = 380,             // 运营活动
    yearCj = 381,           // 运营抽奖
    yearShop = 382,         // 运营商城
    yearExchange = 383,     // 运营兑换
    yearLink = 384,         // 运营连充
    yearSingle = 385,       // 运营单笔
    yearAddupPay = 386,     // 运营累充
    yearDayAddupPay = 387,  // 运营每日累充
    yearReap = 388,         // 运营消费赠礼
    yearLoginLink = 389,    // 运营连续登录
    yearkh = 390,    // 运营连续登录

    guangHuan = 391, //光环入口
    guangHuanShengJi = 392, //光环升级
    guangHuanHuanHua = 393, //光环幻化
    guangHuanFuHun = 394, //光环附魂

    svipSale = 405, //svip秒杀
    everyday_firstpay = 406,//每日首充
    end,
}

//邮件类型
declare const enum EmailType {
    bagToEmail = 1001,               //背包转邮件
    BossMvpAward = 1002,             //MVP
    BossLastKillAward = 1003,        //最后一击
    BossJoinKillAward = 1004,        //参与奖励
    sign = 1005,                     //签到
    copyOffline = 1006,              //副本掉线
    onlineReward = 1007,             //在线礼包
    lilian = 1008,                   //历练
    CrossBossLastKillAward = 1009,   //最后一击
    CrossBossHurtStage = 1010,       //BOSS伤害阶段奖励
    CrossBossRankAward = 1011,       //BOSS排名奖励
    monthCard = 1012,                //月卡
    monthCardOpen = 1013,            //月卡开启奖励
    onlieRewardMonthCardOpen = 1014, //月卡开启时补发在线有礼奖励
    signMonthCardOpen = 1015,        //月卡开启时补发签到奖励
    xianweiDailyReward = 1016,       //仙位每日俸禄
    dailyXiangyaoReward = 1017,       //降妖奖励
    bossXiangyaoReward = 1018,        //boss降妖奖励
    dayPay = 1019,                    //日充奖励
    cumulatePay = 1020,               //累充奖励
    continuePay = 1021,               //连充奖励
    consumeReward = 1022,              //消费赠礼
    nineCopyAward = 1023,            //九天之巅奖励
    sprintRankTask = 1024,           //开服冲榜奖励
    tiantiDailyHonor = 1025,            //天梯每日荣誉奖励
    tiantiRankAward = 1026,             //天梯排名奖励
    tiantiFeatAward = 1027,             //天梯功勋未领取的奖励
    tiantiJoinAward = 1028,             //天梯参与未领取的奖励
    sprintRank = 1029,                  //开服冲榜比拼
    payReward = 1030,                //充值转盘
    tiantiSegAward = 1031,              //天梯段位奖励
    tiantiOutlineAward = 1032,          //天梯掉线未领取的奖励
    xianfuActive = 1033,              //仙府-家园活跃奖励
    kuanghuan = 1034,                  //全民狂欢
    cumulatePay2 = 1035,               //每日累充
    consumeReward2 = 1036,              //消费赠礼
    feishengRankTask = 1037,                //飞升榜积分
    feishengRank = 1038,                //飞升榜
    arenaDailyAward = 1039,             //竞技场每日奖励
    factionKick = 1040,                 //仙盟踢人
    factionLeaderAuto = 1041,           //仙盟自动转让
    factionLeader = 1042,               //仙盟手动转让
    factionBoss = 1043,                 //仙盟BOSS击杀
    factionBossHurt = 1044,             //仙盟BOSS击杀伤害
    factionBossGet = 1045,              //仙盟BOSS击杀已领取奖励
    cumulatePayFS = 1046,               //飞升榜每日累充
    paySingleFS = 1047,                 //飞升榜单笔充值
    consumeRewardFS = 1048,             //飞升榜消费赠
    duobao = 1049,                      //夺宝
    singlePayJade = 1050,               //单笔充值返魂玉
    singlePayPrint = 1051,              //单笔充值返圣印
    duobaoRankChar = 1052,              //夺宝排行个人
    duobaoRankSv = 1053,                //夺宝排行区服
    jzduobao = 1054,                    //九州夺宝
    jzduobaoRankChar = 1055,              //九州夺宝排行个人
    jzduobaoRankSv = 1056,                //九州夺宝排行区服
    jzduobaoJackpot = 1057,               //九州夺宝奖池
    weekSinglePay = 1058,               //周末狂欢-单笔
    weekAccumulate = 1059,              //周末狂欢-累充
    weekConsume = 1060,                 //周末狂欢-消费
    consumeRank = 1061,                 //消费排行
    zhizunCardOpen = 1062,            //月卡开启奖励
    duobaoSprint = 1063,                //夺宝(冲榜)
    duobaoFeisheng = 1064,              //夺宝(飞升榜)
    oneBuy = 1065,                      //一元秒杀
    templeBag = 1066,                   //临时背包
    kuanghai = 1067,                    //狂嗨
    autoTempleBag = 1068,               //临时背包满了邮件
}

interface EmailParam {
    [EmailType.bagToEmail]: null;
    [EmailType.BossMvpAward]: [string, string];
    [EmailType.BossLastKillAward]: [string, string];
    [EmailType.BossJoinKillAward]: [string, string];
    [EmailType.copyOffline]: null;
    [EmailType.sign]: null;
    [EmailType.onlineReward]: null;
    [EmailType.lilian]: null;
    [EmailType.CrossBossLastKillAward]: [string, string];
    [EmailType.CrossBossHurtStage]: [string, string];
    [EmailType.CrossBossRankAward]: [string, string, number];
    [EmailType.monthCard]: null;
    [EmailType.monthCardOpen]: null;
    [EmailType.onlieRewardMonthCardOpen]: null;
    [EmailType.xianweiDailyReward]: null;
    [EmailType.signMonthCardOpen]: null;
    [EmailType.dailyXiangyaoReward]: null;
    [EmailType.bossXiangyaoReward]: null;
    [EmailType.dayPay]: [number];
    [EmailType.cumulatePay]: [number];
    [EmailType.continuePay]: [number, number];
    [EmailType.consumeReward]: [number];
    [EmailType.nineCopyAward]: [string, number];
    [EmailType.sprintRankTask]: null;
    [EmailType.tiantiDailyHonor]: [string];
    [EmailType.tiantiRankAward]: [number];
    [EmailType.tiantiFeatAward]: null;
    [EmailType.tiantiJoinAward]: null;
    [EmailType.sprintRank]: [number];
    [EmailType.payReward]: [number];
    [EmailType.tiantiSegAward]: [string, string];
    [EmailType.tiantiOutlineAward]: null,
    [EmailType.xianfuActive]: null,
    [EmailType.kuanghuan]: null,
    [EmailType.cumulatePay2]: null,
    [EmailType.consumeReward2]: null;
    [EmailType.feishengRankTask]: null;
    [EmailType.feishengRank]: [number];
    [EmailType.arenaDailyAward]: [number];
    [EmailType.factionKick]: null;
    [EmailType.factionLeaderAuto]: null;
    [EmailType.factionLeader]: [string];
    [EmailType.factionBoss]: [string];
    [EmailType.factionBossHurt]: null;
    [EmailType.factionBossGet]: [string];
    [EmailType.cumulatePayFS]: null;
    [EmailType.paySingleFS]: null;
    [EmailType.consumeRewardFS]: null;
    [EmailType.duobao]: null;
    [EmailType.singlePayJade]: null;
    [EmailType.singlePayPrint]: null;
    [EmailType.duobaoRankChar]: [number];
    [EmailType.duobaoRankSv]: [number];
    [EmailType.jzduobao]: null;
    [EmailType.jzduobaoRankChar]: [number];
    [EmailType.jzduobaoRankSv]: [number];
    [EmailType.jzduobaoJackpot]: [number, number];
    [EmailType.weekSinglePay]: null;
    [EmailType.weekAccumulate]: null;
    [EmailType.weekConsume]: null;
    [EmailType.consumeRank]: [number];
    [EmailType.zhizunCardOpen]: null;
    [EmailType.duobaoSprint]: null;
    [EmailType.duobaoFeisheng]: null;
    [EmailType.oneBuy]: null;
    [EmailType.templeBag]: null;
    [EmailType.kuanghai]: null;
    [EmailType.autoTempleBag]: null;
}

declare const enum EmailState {
    unread,     //未读
    read,       //已读
    getAward,   //已领
    del,        //已删
}

declare const enum BossType {
    commonMoster = 0,   //普通怪
    tianguanBoss = 1,   //天关BOSS
    dahuangBoss,        //大荒古塔
    singleBoss,         //单人BOSS
    multiBoss,          //多人BOSS
    xianqiBoss,         //精灵BOSS
    petBoss,            //宠物BOSS
    eraBoss,            //觉醒BOSS
    crossBoss,          //跨服BOSS
    homeBoss,           //家BOSS
    xianfuBoss = 14,    //仙府-家园BOSS
    templeBoss = 18,    //圣殿BOSS
}

//鼓舞类型
declare const enum InspireType {
    copper = 1, //金币鼓舞
    gold,       //代币券鼓舞
}

/**
 * 飘血伤害类型
 */
declare const enum HurtType {
    common = 0,         //普通伤害
    crit = 1,           //暴击伤害
    dodge = 2,          //闪避
    rebound = 3,        //反伤
    bleeding = 4,       //流血
    wudi = 5,           //无敌,免疫
    lightning = 6,      //闪电链

    hpRecover = 7,      //回血
    suckBlood = 8,      //吸血
    hurtRecoverHp = 9,  //伤害回血
}

//奖励类型
declare const enum AwardJudgeType {
    common = 0,
    lastKill,       //最后一击
    mvp,            //mpv奖励
    join,           //参加奖励
    rank,           //排名结算
    openBox,        //开宝箱
    riches,         //天降财宝
    cloudland,      //云梦秘境
    swimming1,      //瑶池本身时间到了
    swimming2,      //瑶池活动结束
}

//复活类型
declare const enum ReliveType {
    common = 0,     //普通复活 不需要消耗、弹窗
    secondConsume,  //按秒消耗
    fixedConsume,   //固定消耗
}

declare const enum Constant {
    IdMask = 0x7FFFFFFF,
    GroupMask = 0xFFF,
    PlatformMask = 0x3FF,

    IdLimit = 0x80000000,
    GroupLimit = 0x1000,
    HighMask = 0x3FFFFF,
}

declare const enum NpcTypes {
    common = 1,     //常规
    gather,         //采集物
}

//排行
declare const enum RankType {
    fight = 1,              //战力
    level = 2,              //等级
    petFight = 4,           //宠物战力
    rideFight = 8,          //精灵战力
    shenbingFight = 16,     //神兵战力
    wingFight = 32,         //仙翼战力
    magicWeaponFight = 64,  //圣物战力
    lilianGrade = 128,      //活跃值阶级
    xianweiGrade = 256,     //仙位品阶
    equipFight = 512,       //装备战力
    tianguanLevel = 1024,   //天关等级
    dahuangLevel = 2048,    //大荒等级
    skillAndAmulet = 4096,  //技能和圣物总战力之和
    equipScore = 4096 * 2,  //装备总评分
    fashionFight = 4096 * 4,//时装战力
    tianZhuFight = 4096 * 8,//天珠战力
    faction = 4096 * 16,    //仙盟
    end = 4096 * 32,
}

//跨服排行
declare const enum CrossRankType {
    begin = 0,
    level = 1,              //等级
    rideFeedScore = 2,      //精灵培养积分
    petFeedScore = 4,       //宠物培养积分
    shenbingFeedScore = 8,  //神兵升级积分
    wingFeedScore = 16,      //仙翼升级积分
    amuletScore = 32,        //圣物通用材料积分
    fastionFeedScore = 64,       //时装升级积分
    tianzhuFeedScore = 128,      //天珠升级积分
    duobaoScore = 1024,        //夺宝积分
    jzduobaoScore = 2048,      //九州夺宝积分
    end = 4096,
}

//服排行
declare const enum ServerRankType {
    begin = 0,
    duobaoScore = 1,         //夺宝积分
    jzduobaoScore = 2,       //九州夺宝积分
    end = 4,                //2^N
}

declare const enum GatherType {
    common = 0, //普通采集
    fine = 1,   //精细采集
}

declare const enum XunbaoType {
    equip = 0,    //装备探索
    dianfeng,     //巅峰探索
    zhizun,       //至尊探索
    xianfu,       //仙符探索
    fabao,        //圣物探索
    xianyu,       //仙玉探索
}

declare const enum XunbaoGrade {
    grade_1 = 0,   //1次
    grade_2 = 1,   //10次
    grade_3,       //50次
}

//特权
declare const enum Privilege {
    goldPerDay = 0,           //每日领代币券[虚拟id，数量]
    openReward = 1,           //开启时奖励[id，数量]
    bagEquipSize = 2,         //装备背包容量加成[数量]
    itemEquipSize = 3,        //道具背包容量加成[数量]
    onlineRewardPer = 4,      //在线礼包双倍[倍率]
    signPer = 5,              //签到双倍[倍率]
    loginRewardPer = 6,       //登陆豪礼双倍[倍率]
    homeBossFree = 7,         //免费进入boss之家[层数]
    homeBossRewardCount = 8,  //boss之家珍宝次数[次数]
    gemGridOpen = 9,          //仙石vip槽开启
    investRewardLogin = 10,   //登录投资返利
    investRewardTianguan = 11, //天关投资返利
    investRewardLevel = 12,   //等级投资返利
    xianDanCount = 13,  //仙丹

    copyCopperTicket = 61,    //哥布林王国门票[数量]
    copyZqTicket = 62,        //泰拉矿场门票[数量]
    copyPetTicket = 63,       //宠物副本门票[数量]
    copyRideTicket = 64,      //精灵副本门票[数量]
    copyTeamTicket = 65,      //组队副本门票[数量]
    copySingleSweep = 66,     //单人副本一键扫荡
    copyCrossBoss = 67,       //三界BOSS副本门票[数量]

    canBuySweppingTimes = 68, //挂机扫荡可购买[数量]
    copyTiantiTicket = 69,    //天梯斗法可购买[数量]
    copyCloudlandTicket = 70, //云梦秘境可购买[数量]
    adventrueYunli = 71,      //奇遇运力购买[数量]
    discountGift = 72,        //特惠礼包可购买[数量]
    copyArenaTicket = 73,     //竞技场购买[数量]

    copySBTicket = 74,          //神兵副本门票[数量]
    copyWingTicket = 75,        //仙翼副本门票[数量]
    copyFashionTicket = 76,     //永恒之森门票[数量]
    copyTianzhuTicket = 77,     //天珠副本门票[数量]
    copyXilianTicket = 78,      //洗炼副本门票[数量]
    copyGuanghuanTicket = 106,  //洗炼副本门票[数量]

    oneKeySweepCopy = 79,       //一键扫荡特权 [0:无 1:有特权]
    oneKeyChallenge = 80,       //一键挑战特权 [0:无 1:有特权]

    attackPer = 81,            //主角攻击百分比[小数]
    defensePer = 82,           //主角防御百分比[小数]
    hpPer = 83,                //主角血量百分比[小数]
    pvpHurtDeep = 84,          //pvp增伤百分比[小数]
    pvpHurtLess = 85,          //pvp减伤百分比[小数]
    bossHurtDeep = 86,         //boss伤害百分比[小数]
    copperPer = 87,            //金币加成[小数]
    expPer = 88,               //经验加成[小数]
    attack = 89,               //攻击力[数量]
    defense = 90,              //防御[数量]
    hp = 91,                   //生命[数量]
    onhookExpPer = 92,         //离线经验加成[小数]
    onhookCoinPer = 93,        //离线金币加成[小数]
}

declare const enum PrivilegeGrade {
    vip_0 = 0,           //vip 0级 未开启
    vip_1 = 1,           //vip 1级
    vip_2,
    vip_3,
    vip_4,
    vip_5,
    vip_6,
    vip_7,
    vip_8,
    vip_9,
    vip_10,
    vip_11,
    vip_12,
    vip_13,
    vip_14,
    vip_15,
    vipF_0 = 50,    //免费vip
    vipF_1 = 51,
    vipF_2,
    vipF_3,
    vipF_4,
    vipF_5,
    vipF_6,
    vipF_7,
    vipF_8,
    vipF_9,
    vipF_10,
    monthCard = 101,       //月卡
    zhizunCard = 201,      //至尊特权
}

//PK 模式
declare const enum PKMode {
    Peace = 0,  //和平
    Faction,    //帮派、仙盟
    Camp,       //整容
    Team,       //队伍
}

declare const enum MallType {
    mall_1 = 0,       //商城
    mall_2 = 10,      //商店
    mall_3 = 20,      //商店
    mall_4 = 30,      //开服活动【1-一折限购】
}

//子商城(商店)
declare const enum MallChildType {
    mall_child_item = 1,     //道具商城
    mall_child_material = 2, //材料商城
    mall_child_equip = 3,    //装备商城
    mall_child_limit = 4,    //限购商城
    mall_child_xianFu = 5,   //仙府-家园神秘商城
}

declare const enum MallLimit {
    none = 0,       //不限制
    day = 1,        //每天
    week = 2,       //每周
}

declare const enum TeamMemberType {
    human = 0,
    robot = 1,
}

declare const enum TeamMatchState {
    matching = 0,
    success = 1,
    init = 2,
}

//广播ID
declare const enum BroadcastId {
    month_card = 1,             //月卡购买
    vip_level = 2,              //vip升级
    ride_grade = 3,             //精灵进阶
    ride_magic = 4,             //精灵幻化
    ride_refine = 5,            //精灵修炼
    pet_grade = 6,              //宠物进阶
    pet_magic = 7,              //宠物幻化
    pet_refine = 8,             //宠物修炼
    amulet_activate = 9,        //圣物激活
    amulet_grade = 10,          //圣物进阶
    skill_train_activate = 11,  //秘术激活
    strong_rise2 = 12,          //强化神匠
    gem_inlay = 13,             //仙石镶嵌
    gem_compose = 14,           //仙石合成
    shenbing_magic = 15,        //神兵幻化
    shenbing_rise = 16,         //神兵附魂
    wing_magic = 17,            //仙翼幻化
    wing_rise = 18,             //仙翼附魂
    dahuang_layer = 19,         //大荒层数
    three_boss = 20,            //击杀三界BOSS
    multi_boss = 21,            //多人BOSS伤害排名第一
    xianwei_grade = 22,         //仙位达到阶级
    era = 23,                   //达到几转
    lilian = 24,                //历炼
    nineCopyPrepare = 25,       //副本预备
    nineCopyOpen = 26,          //副本开启
    nideCopyRankFirst = 27,     //九天之巅第一名
    nideCopyRankSecond = 28,    //九天之巅第一名
    nideCopyRankThird = 29,     //九天之巅第一名
    nineCopyClose = 30,         //副本关闭
    firstPay = 31,              //首充
    faction = 32,               //仙盟招人
    factionBox = 33,            //仙盟宝箱求助
    fashion_magic = 34,         //时装幻化
    fashion_rise = 35,          //时装附魂
    tianZhu_magic = 36,         //天珠幻化
    tianZhu_rise = 37,          //天珠附魂
    factionCopyBuff = 38,       //仙盟诛仙BUFF
    zhizun_card = 39,           //至尊特权购买
}

interface BroadcastParam {
    [BroadcastId.month_card]: [string];
    [BroadcastId.vip_level]: [string, number];
    [BroadcastId.ride_grade]: [string, number];
    [BroadcastId.ride_magic]: [string, number];
    [BroadcastId.ride_refine]: [string, number, number];
    [BroadcastId.pet_grade]: [string, number];
    [BroadcastId.pet_magic]: [string, number];
    [BroadcastId.pet_refine]: [string, number, number];
    [BroadcastId.amulet_activate]: [string, number];
    [BroadcastId.amulet_grade]: [string, number];
    [BroadcastId.skill_train_activate]: [string, number];
    [BroadcastId.strong_rise2]: [string, number];
    [BroadcastId.gem_inlay]: [string, number];
    [BroadcastId.gem_compose]: [string, number];
    [BroadcastId.shenbing_magic]: [string, number];
    [BroadcastId.shenbing_rise]: [string, number, number];
    [BroadcastId.wing_magic]: [string, number];
    [BroadcastId.wing_rise]: [string, number, number];
    [BroadcastId.dahuang_layer]: [string, number];
    [BroadcastId.three_boss]: [string, number];
    [BroadcastId.multi_boss]: [string];
    [BroadcastId.xianwei_grade]: [string, number];
    [BroadcastId.era]: [string, number];
    [BroadcastId.lilian]: [string, number];
    [BroadcastId.nineCopyPrepare]: [string];
    [BroadcastId.nineCopyOpen]: [string];
    [BroadcastId.nideCopyRankFirst]: [string, string];
    [BroadcastId.nideCopyRankSecond]: [string, string];
    [BroadcastId.nideCopyRankThird]: [string, string];
    [BroadcastId.nineCopyClose]: [string];
    [BroadcastId.firstPay]: [string];
    [BroadcastId.faction]: [string];
    [BroadcastId.factionBox]: [string, number, string];
    [BroadcastId.fashion_magic]: [string, number];
    [BroadcastId.fashion_rise]: [string, number, number];
    [BroadcastId.tianZhu_magic]: [string, number];
    [BroadcastId.tianZhu_rise]: [string, number, number];
    [BroadcastId.factionCopyBuff]: [null];
    [BroadcastId.zhizun_card]: [string];
}

//充值ID
declare const enum RechargeId {
    monthCard = 1,              //月卡对应充值档位
    zhizunCard = 2,             //至尊特权对应充值档位
    MoneyCat = 4,               //招财猫
    Talisman = 5,               //战力护符
    gauntlet = 6,               //无限手套
    oneBuyBegin = 11,           //一元秒杀充值档开始
    oneBuyAll = 14,            //一元秒杀所有档
    oneBuyEnd = 20,           //一元秒杀充值档结束

    jewelStart = 31,            //原力宝石档
    jewelEnd = 36,               //原力宝石档结束

    sixYuan = 101,             //6元档
}

//封禁
declare const enum BlockType {
    user = 1,   //封账号
    ip = 2,     //封IP
    speak = 3,  //禁言
    role = 4,   //封角色ID
}

declare const enum BuffOper {
    add = 1,
    del = 2,
}

//匹配类型
declare const enum MatchType {
    none = 0,       //无匹配类型，即指定获取的id
    level = 1,
    fight = 2,
    era = 3,
    tiantiSeg = 4,  //天梯段位
}

//角色状态
declare const enum ActorState {
    normal = 0X0000,        //正常状态
    alert = 0X00001,        //预警状态 AI状态使用,状态变化不更新到前端
    combat = 0X0002,        //战斗状态 AI状态使用,状态变化不更新到前端
    dead = 0X0004,          //死亡状态
    dizz = 0X0008,          //眩晕
    silent = 0X0010,        //沉默
    athanasy = 0X0020,      //不死
    wudi = 0X0040,          //无敌
    bati = 0X0080,          //霸体
    unhurt = 0X0100,        //免疫伤害
    all = 0XFFFF,
}

//冲刺
declare const enum RunEnum {
    minSpeed = 300,     //最小速度
    maxSpeed = 1000,    //最大速度
    speedupTime = 500,  //加速时间
}

//降妖类型

declare const enum XiangyaoType {
    monster = 0,           //小怪降妖
    boss = 1,              //boss降妖
}

//九天支点副本状态
declare const enum CopyState {
    prepare = 1,    //预备状态
    open = 2,       //开启状态
    close = 3,      //关闭状态
    notOpen = 4,    //未开启
}

//赛季状态
declare const enum SeasonState {
    open = 1,       //开启状态
    close = 2,      //关闭状态
}

//聊天频道(不要自定义枚举的值，以防获取长度不对)
declare const enum ChatChannel {
    broadcast,   //广播
    cross,       //九洲（跨服）
    local,       //本服
    system,      //系统
    faction,     //仙盟
    marry,       //姻缘
    length,      //用于获取枚举长度，放在最后面
}

//聊天类型
declare const enum ChatType {
    general,     //普通的文字
    shortcut,    //快捷语句
    expression,  //高级表情
    item,        //道具
}

//搜索类型
declare const enum SearchType {
    actor = 1,
    monster,
    item,
    npc,
}


//仙府-家园升级条件类型
declare const enum XianFuUpgradeCondition {
    lingQi,    //消耗药草值
    riches,    //消耗财富值
    task,      //仙府-家园任务
    fengShui,  //风水值
    accLingQi, //累计药草值
    accRiches, //累计财富值
}

//仙府-家园事件
declare const enum XianFuEvent {
    none,      //无事件
    mall,      //神秘商店
    Intrusion, //魔兵入侵
    boss,      //boss入侵
    collect,   //灵脉爆发 采集物
    treasure,  //宝矿爆发 宝箱

    end,       //结束
}

//仙府-家园任务类型
declare const enum XianFuTaskType {
    build,     //使用建筑
    travel,    //游历
    event,     //参与事件

    end,
}

//仙府-家园风水加成类型
declare const enum XianFuFengShuiAdd {
    buildAdd,    //建筑固定加成
    buildSub,    //建筑制作减少消耗%
    buildSuc,    //建筑制作增加成功率%
    buildCou,    //建筑制作增加炼制上限
    travalSub,   //游历减少消耗%
    travelExp,   //游历增加经验%
    travelCou,   //游历次数增加
}

//榜单类型
declare const enum RankClass {
    sprint = 0,     //开服冲榜
    feisheng = 1,   //飞升榜
}

declare const enum DuobaoRankType {
    char = 0,  //玩家个人排名
    server = 1,  //区服排名
}

//冲榜类型
declare const enum SprintRankType {
    none = 0,             //无效
    ride = 1,             //精灵
    pet = 2,              //宠物
    shenbing = 3,         //神兵
    wing = 4,             //仙翼
    xianfa = 5,           //仙法
    equip = 6,            //装备
    fight = 7,            //战力
}

//飞升榜类型
declare const enum FeishengRankType {
    none = 0,             //无效
    ride = 1,             //精灵
    pet = 2,              //宠物
    shenbing = 3,         //神兵
    wing = 4,             //仙翼
    amulet = 5,           //圣物
    fastion = 6,          //时装
    tianzhu = 7,          //天珠
    end,
}

//玩家操作(游戏埋点)
declare const enum ActorOperType {
    chat = 1,     //玩家发送一次聊天[频道，类型]
}

//古神问道类型
declare const enum GushenType {
    none = 0,       //无效
    gushen_1 = 1,
    gushen_2 = 2,
    gushen_3 = 3,
    gushen_4 = 4,
    gushen_5 = 5,
}

//狂欢类型
declare const enum KuanghuanType {
    none = 0,       //无效
    level = 1,      //等级
    tianguanCopy = 2,   //天关
    dahuangCopy = 3,       //古塔
    boss = 4,       //boss
    teamCopy = 5,   //组队副本
    copperCopy = 6, //哥布林王国
    zqCopy = 7,     //泰拉矿场
    runeCopy = 8,   //符阵副本
    fight = 9,      //战力
}

//特惠礼包类型
declare const enum DiscountGiftType {
    none = 0,         //无效
    ride = 1,         //精灵
    pet = 2,          //宠物
    shenbing = 3,     //神兵
    wing = 4,         //仙翼
    amulet = 5,       //圣物
    equip = 6,        //装备
    fight = 7,        //战力
}

//扫荡类型
declare const enum SweepType {
    guaji = 1,             //挂机
    singleBossCopy = 2,    //单人boss副本
    petCopy = 3,           //宠物副本
    rideCopy = 4,          //精灵副本
}

//场景朝向
declare const enum SceneDirection {
    NORTH_WEST = 1,
    NORTH = 2,
    NORTH_EAST = 3,
    WEST = 4,
    EAST = 5,
    SOUTH_WEST = 6,
    SOUTH = 7,
    SOUTH_EAST = 8
}

//奇遇事件
declare const enum AdventrueEvent {
    finger,    //好赌仙人
    task,      //仙女的考验
    pk,        //与机器人pk
    boss,      //BOSS突袭
    monster,   //洞府遗迹
    treasure,  //神秘乾坤袋

    end,
}

declare const enum TipsType {
    none = 0,
    firstPay = 1,  //首充
    talisman = 2,  //战力护符
    gauntlet = 3,  //无限手套
}

declare const enum EraNodeType {
    humanLevel = 0, //人物等级
    gem,          //1仙石等级
    dahuang,      //2大荒
    soulRise,     //3不败金身
    strong,       //4强化
    amulet,       //5圣物属性
    copyTeam,     //6组队副本
    copyCopper,     //7哥布林王国
    copyZq,         //8泰拉矿场
    boss,           //9觉醒boss
    tianguan,       //10天关层数
    rune,           //11远古阵符层数
    multiBoss,      //12击杀多人BOSS次数
    escortFairy,    //13护送仙女次数
    lightSuit,      //14激活指定ID的套装
    skill,          //15技能总等级
    zhuhun,         //16铸魂总等级
    xilian,         //17进行锻造次数
}

declare const enum EraNodeState {
    uncomplete = 0,
    complete = 1,
    drawed = 2,
}


//在线礼包状态
declare const enum OnlineRewardState {
    not = 0,    //未达成
    can = 1,    //可领取
    already,    //已领取
    double      //月卡双倍领取
}

declare const enum DesignationState {
    notActive = 1,  //未激活
    canActive,      //可激活
    active,         //激活
    wear,           //穿戴中
}

declare const enum DesignationType {
    xianwei = 1,
    loginDay = 2,
    actorLevel = 3,
    actorFight = 4,
    useGold = 5,
    activeAmulet = 6,
    juexueFight = 7,
    multiBoss = 8,
    tianti = 9,
    zhizunCard = 10,    //至尊特权
    rankJudage,         //排名结算称号
    vip,                //VIP称号
    fsRankJudage,       //飞升排名结算称号
    vipLevel,           //VIP等级
}

//道具品质
declare const enum Color {
    blue = 2,
    purple = 3,
    orange = 4,
    red = 5,
}

//仙盟职位
declare const enum FactionPosition {
    member,        //普通成员
    leader,        //盟主
    deputyLeader,  //副盟主
    huFa,          //护法
}

//仙盟权力, 使用二进制位判断，不要随意改变顺序
// 0：解散 1：审批 2：广播 3：设定入盟条件 4：修改公告  5：修改宣传语 6：踢人 7任命副盟  8：任命护法
declare const enum FactionPower {
    dissolution,   //解散
    examine,       //审批
    broadcast,     //广播
    setJoinLimit,  //设置入盟条件
    setNotice,     //修改公告
    setTitle,      //修改宣传语
    kick,          //踢人
    deputyLeader,  //任命副盟主
    huFa,          //任命护法
    leader,        //任命盟主
    member,        //任命普通成员
    examineState,  //修改仙盟加入审批状态（加入的时候是否需要审批）
}

//仙盟宝箱
declare const enum FactionBoxColor {
    green,
    blue,
    purple,
    orange,
    red,
}

//仙盟宝箱状态
declare const enum FactionBoxState {
    notOpen,   //未挖
    waitOpen,  //已挖，等着协助开
    assist,    //已发送协助请求
    open,      //开启中
    get,       //可领取
}

//洗炼状态
declare const enum XilianState {
    notOpen = 0,    //未开启
    canOpen,        //可开启
    open,           //已开启
}

//洗炼类型
declare const enum XilianType {
    common = 0,     //普通
    jipin,          //极品
    prefect,        //完美
}

declare const enum XilianStone {
    common = 10230001,  //普通锻造石
    jipin = 10240001,   //极品锻造石
    prefect = 10250001, //完美锻造石
}

/**
 * 技能效果类型
 */
declare const enum PassiveSkillType {
    addAttack = 1,          //加攻击
    addAttackPer,           //加攻击%
    addDefense,             //加防御
    addDefensePer,          //加防御%
    addHp,                  //加生命上限
    addHpPer,               //加生命上限%
    addDisDefense,          //加破防
    addDisDefensePer,       //加破防%
    addHit,                 //加命中
    addHitPer,              //加命中%
    addDodge,               //加闪避
    addDodgePer,            //加闪避%
    addCrit,                //加暴击
    addCritPer,             //加暴击%
    addTough,               //加韧性
    addToughPer,            //加韧性%
    addCritHurtDeep,        //加暴击伤害增加
    addCritHurtLess,        //加暴击伤害减少
    addRebound,             //加反伤
    addPvpHurtDeep,         //加pvp伤害加深
    addPvpHurtLess,         //加pvp伤害减少
    addBossHurtDeep,        //加boss伤害加深
    addArmor,               //加护甲
    addDisArmor,            //加破甲
    addEleAttack,           //加元素攻击
    addEleAttackPer,        //加元素攻击%
    addEleResistant,        //加元素抗性
    addEleResistantPer,     //加元素抗性%
    addRealHurt,            //加真实伤害
    addRealHurtPer,         //加真实伤害%
    addRealArmor,           //加真实护甲
    addRealArmorPer,        //加真实护甲%
    addSpeed,               //加移速
    addSpeedPer,            //加移速%
    addExpPer,              //加经验%
    addPetHurtLess,         //加宠物伤害减免百分比
    addPetHurtDeep,         //加宠物伤害增加百分比
    addpetBossHurtDeep,     //加宠物对BOSS增伤百分比
    addPetAttack,           //加宠物攻击
    addPetAttackPer,        //加宠物攻击%
    addWingAttack,          //加羽翼攻击增加
    addShenbingCrit,        //加神兵暴击
    addFastionHp,           //加时装生命上限
    addFastionTough,        //加时装韧性
    addHurtDeep,            //加伤害加深百分比
    addHurtLess,            //加伤害减免百分比
    hurtRecoverHpPer,       //伤害回血%
    suckBlood,              //吸血
    commRangeHurt,          //普通范围伤害
    lightNingHurt,          //闪电链范围伤害
    recoverHp,              //回血
    recoverHpPer,           //回血%
    recoverHpLevel,         //每等级恢复血量
    addHitValuePer,         //命中值%
    addDodgeValuePer,       //闪避值%
    addCritValuePer,        //暴击值%
    addToughValuePer,       //韧性值%
}

/**
 * BUFF 大类
 */
declare const enum EffectMType {
    effect_10 = 10,     //加攻击
    effect_11 = 11,     //加生命值上限
    effect_12 = 12,     //加防御
    effect_13 = 13,     //加命中
    effect_14 = 14,     //加闪避
    effect_15 = 15,     //加暴击
    effect_16 = 16,     //加韧性
    effect_17 = 17,     //加护甲
    effect_18 = 18,     //加破甲
    effect_19 = 19,     //加伤害加深
    effect_20 = 20,     //加伤害减免
    effect_21 = 21,     //加暴击增伤
    effect_22 = 22,     //加暴击减伤
    effect_23 = 23,     //加PVP增伤
    effect_24 = 24,     //加PVP减伤
    effect_25 = 25,     //加元素攻击
    effect_26 = 26,     //加元素抗性
    effect_27 = 27,     //加经验加成
    effect_28 = 28,     //加宠物伤害减免
    effect_29 = 29,     //加宠物伤害增加
    effect_30 = 30,     //持续回XX血量
    effect_31 = 31,     //不死 血量最多降为1点，溢出的伤害量抹掉，持续X秒
    effect_32 = 32,     //使目标解除并免疫所有减益buff，免疫所有伤害，持续X秒
    effect_33 = 33,     //使目标移动速度增加，持续X秒
    effect_34 = 34,     //免疫所有控制类（目前是眩晕、沉默）效果，持续X秒
    effect_35 = 35,     //反伤 将所受到伤害量的X%反弹给对方，持续X秒
    effect_36 = 36,     //吸血 将对对象造成的伤害量的X%转换成自身血量恢复，持续X秒
    effect_37 = 37,     //将所受到伤害量的X%转换成自身血量恢复，持续X秒
    effect_38 = 38,     //加命中率
    effect_39 = 39,     //加闪避率
    effect_40 = 40,     //加暴击率
    effect_41 = 41,     //加韧性率
    effect_42 = 42,     //加破防
    effect_43 = 43,     //加免疫伤害

    effect_50 = 50,     //减攻击
    effect_51 = 51,     //减生命上限
    effect_52 = 52,     //减防御
    effect_53 = 53,     //减破甲
    effect_54 = 54,     //减命中
    effect_55 = 55,     //减闪避
    effect_56 = 56,     //减暴击
    effect_57 = 57,     //减韧性
    effect_58 = 58,     //使目标移动速度减少X，持续X秒
    effect_59 = 59,     //使目标无法释放技能（8个主角技能），持续X秒
    effect_60 = 60,     //减伤害加深
    effect_61 = 61,     //减伤害减免
    effect_62 = 62,     //减暴击增伤
    effect_63 = 63,     //减暴击减伤
    effect_64 = 64,     //减PVP增伤
    effect_65 = 65,     //减PVP减伤
    effect_66 = 66,     //减元素攻击
    effect_67 = 67,     //减元素抗性
    effect_68 = 68,     //持续掉XX血
    effect_69 = 69,     //眩晕，使目标无法释放技能（8个主角技能）及普攻，持续X秒
    effect_70 = 70,     //持续XX%的技能伤害
    effect_71 = 71,     //减命中率
    effect_72 = 72,     //减闪避率
    effect_73 = 73,     //减暴击率
    effect_74 = 74,     //减韧性率
    effect_75 = 75,     //减少治疗效果 X%
    effect_76 = 76,     //减破防
}

//多用操作类型
declare const enum operaState {
    gone,  //已领取
    cant,  //未达成
    can,  //可领取
}
//邀请类型
declare const enum InviteType {
    faction,    //盟友
}

/**
 * 装备道具属性类型   不要随便改变顺序不要在中间插入，这是数组，按索引配置，动了顺序，要改相应配置表
 */
declare const enum ItemAttrType {
    begin = 0,
    attack,                     //攻击
    hp,                         //生命
    defense,                    //防御
    disDefense,                 //破防
    hit,                        //命中
    dodge,                      //闪避
    crit,                       //暴击
    tough,                      //韧性
    critPer,                    //暴击率
    critHurtDeep,               //暴击增伤
    critHurtLess,               //暴击减伤
    toughPer,                   //韧性率加成
    disArmor,                   //破甲
    armor,                      //护甲加成
    hurtDeep,                   //伤害加成
    attackPer,                  //攻击加成
    disDefensePer,              //破防加成
    critValuePer,               //暴击值加成
    hpPer,                      //生命加成
    defensePer,                 //防御加成
    hurtLess,                   //伤害减免
    toughValuePer,              //韧性值加成
    threeAddAttack,             //每三级攻击加+1
    threeAddHp,                 //每三级生命加+1
    threeAddDefense,            //每三级防御加+1
    threeAddDisDefense,         //每三级破防加+1
    dropItemPer,                //掉落道具增加
    dropCopperPer,              //掉落金币增加

    equipAttackPer,             //装备攻击%
    equipHpPer,                 //装备生命%
    equipDefensePer,            //装备防御%
    equipDisDefensePer,         //装备破防%
    equipHitPer,                //装备命中%
    equipDodgePer,              //装备闪避%
    equipCritPer,               //装备暴击%
    equipToughPer,              //装备韧性%

    strongAttackPer,            //强化攻击%
    strongHpPer,                //强化生命%
    strongDefensePer,           //强化防御%
    strongDisDefensePer,        //强化破防%
    strongHitPer,               //强化命中%
    strongDodgePer,             //强化闪避%
    strongCritPer,              //强化暴击%
    strongToughPer,             //强化韧性%

    gemAttackPer,               //宝石攻击%
    gemHpPer,                   //宝石生命%
    gemDefensePer,              //宝石防御%
    gemDisDefensePer,           //宝石破防%
    gemHitPer,                  //宝石命中%
    gemDodgePer,                //宝石闪避%
    gemCritPer,                 //宝石暴击%
    gemToughPer,                //宝石韧性%

    amuletAttackPer,            //圣物攻击%
    amuletHpPer,                //圣物生命%
    amuletDefensePer,           //圣物防御%
    amuletDisDefensePer,        //圣物破防%
    amuletHitPer,               //圣物命中%
    amuletDodgePer,             //圣物闪避%
    amuletCritPer,              //圣物暴击%
    amuletToughPer,             //圣物韧性%

    soulAttackPer,              //金身攻击%
    soulHpPer,                  //金身生命%
    soulDefensePer,             //金身防御%
    soulDisDefensePer,          //金身破防%
    soulHitPer,                 //金身命中%
    soulDodgePer,               //金身闪避%
    soulCritPer,                //金身暴击%
    soulToughPer,               //金身韧性%

    petAttackPer,               //宠物攻击%
    petHpPer,                   //宠物生命%
    petDefensePer,              //宠物防御%
    petDisDefensePer,           //宠物破防%
    petHitPer,                  //宠物命中%
    petDodgePer,                //宠物闪避%
    petCritPer,                 //宠物暴击%
    petToughPer,                //宠物韧性%

    rideAttackPer,              //精灵攻击%
    rideHpPer,                  //精灵生命%
    rideDefensePer,             //精灵防御%
    rideDisDefensePer,          //精灵破防%
    rideHitPer,                 //精灵命中%
    rideDodgePer,               //精灵闪避%
    rideCritPer,                //精灵暴击%
    rideToughPer,               //精灵韧性%

    sbAttackPer,                //神兵攻击%
    sbHpPer,                    //神兵生命%
    sbDefensePer,               //神兵防御%
    sbDisDefensePer,            //神兵破防%
    sbHitPer,                   //神兵命中%
    sbDodgePer,                 //神兵闪避%
    sbCritPer,                  //神兵暴击%
    sbToughPer,                 //神兵韧性%

    wingAttackPer,              //羽翼攻击%
    wingHpPer,                  //羽翼生命%
    wingDefensePer,             //羽翼防御%
    wingDisDefensePer,          //羽翼破防%
    wingHitPer,                 //羽翼命中%
    wingDodgePer,               //羽翼闪避%
    wingCritPer,                //羽翼暴击%
    wingToughPer,               //羽翼韧性%

    animalAttackPer,            //灵兽攻击%
    animalHpPer,                //灵兽生命%
    animalDefensePer,           //灵兽防御%
    animalDisDefensePer,        //灵兽破防%
    animalHitPer,               //灵兽命中%
    animalDodgePer,             //灵兽闪避%
    animalCritPer,              //灵兽暴击%
    animalToughPer,             //灵兽韧性%

    equipTotalPer,              //装备模块总属性加成%
    strongTotalPer,             //强化模块总属性加成%
    gemTotalPer,                //宝石模块总属性加成%
    amuletTotalPer,             //圣物模块总属性加成%
    soulTotalPer,               //金身模块总属性加成%
    petTotalPer,                //宠物模块总属性加成%
    rideTotalPer,               //精灵模块总属性加成%
    sbTotalPer,                 //神兵模块总属性加成%
    wingTotalPer,               //羽翼模块总属性加成%
    animalTotalPer,             //灵兽模块总属性加成%

    fashionAttackPer,           //时装攻击%
    fashionHpPer,               //时装生命%
    fashionDefensePer,          //时装防御%
    fashionDisDefensePer,       //时装破防%
    fashionHitPer,              //时装命中%
    fashionDodgePer,            //时装闪避%
    fashionCritPer,             //时装暴击%
    fashionToughPer,            //时装韧性%
    fashionTotalPer,            //时装模块总属性加成%

    tianZhuAttackPer,           //天珠攻击%
    tianZhuHpPer,               //天珠生命%
    tianZhuDefensePer,          //天珠防御%
    tianZhuDisDefensePer,       //天珠破防%
    tianZhuHitPer,              //天珠命中%
    tianZhuDodgePer,            //天珠闪避%
    tianZhuCritPer,             //天珠暴击%
    tianZhuToughPer,            //天珠韧性%
    tianZhuTotalPer,            //天珠模块总属性加成%

    actorHitPer,                //角色命中%
    actorDodgePer,              //角色闪避%
    eleAttack,                  //元素攻击、伤害
    eleResistant,               //元素抗性
    realHurt,                   //真实伤害
    realArmor,                  //真实护甲

    xilianAttackPer,            //洗炼攻击%
    xilianHpPer,                //洗炼生命%
    xilianDefensePer,           //洗炼防御%
    xilianDisDefensePer,        //洗炼破防%
    xilianHitPer,               //洗炼命中%
    xilianDodgePer,             //洗炼闪避%
    xilianCritPer,              //洗炼暴击%
    xilianToughPer,             //洗炼韧性%
    xilianTotalPer,             //洗炼总属性%

    zhuhunAttackPer,            //铸魂攻击%
    zhuhunHpPer,                //铸魂生命%
    zhuhunDefensePer,           //铸魂防御%
    zhuhunDisDefensePer,        //铸魂破防%
    zhuhunHitPer,               //铸魂命中%
    zhuhunDodgePer,             //铸魂闪避%
    zhuhunCritPer,              //铸魂暴击%
    zhuhunToughPer,             //铸魂韧性%
    zhuhunTotalPer,             //铸魂总属性%

    pvpHurtDeep,                //PVP增伤
    pvpHurtLess,                //PVP减伤
    hitPer,                     //命中率
    hitValuePer,                //命中百分比
    dodgeValuePer,              //闪避百分比
    rebound,                    //伤害反射
    bossHurtDeep,               //BOSS增伤
    suckBlood,                  //吸血
    hurtRecoverHpPer,           //受击回血
    expPer,                     //经验加成
    speed,                      //移速
    dodgePer,                   //闪避率
    onhookExpPer,               //挂机经验加成
    onhookCoinPer,              //挂机金币加成

    gauntletAttackPer,            //手套攻击%
    gauntletHpPer,                //手套生命%
    gauntletDefensePer,           //手套防御%
    gauntletDisDefensePer,        //手套破防%
    gauntletHitPer,               //手套命中%
    gauntletDodgePer,             //手套闪避%
    gauntletCritPer,              //手套暴击%
    gauntletToughPer,             //手套韧性%
    gauntletTotalPer,             //手套总属性%
    end,
}//装备道具属性类型   不要随便改变顺序不要在中间插入，这是数组，按索引配置，动了顺序，要改相应配置表

//意见反馈类型
declare const enum FeedbackType {
    none,           //没用
    bug,            //游戏BUG
    topUp,       //建议
    other,          //其它
}
declare const enum TeamOper {
    leave = 0,  //离队
    join,       //入队
    kicked,     //T出
}

declare const enum ResItemID {
    xianyu = 94150001,
}

declare const enum WelfareType {
    sign = 1,
    sevenDay = 2,
    onlineReward = 3,
    monthCard = 4,
    firstPay = 5,
    dayPay = 6,
    cumulatePay = 7,
    continuePay = 8,
    zeroBuy = 9,
    consumeReward = 10,
    investReward = 11,
    sprintRankTask = 12,
    payReward = 13,
    gushen = 14,
    kuanghuan = 15,
    cumulatePay2 = 16,
    discountGift = 17,
    consumeReward2 = 18,
    cumulatePayFS = 19,
    paySingleFS = 20,
    consumeRewardFS = 21,
    rushBuyFS = 22,
    discountGiftFS = 23,
    halfMonth = 24,
    everydayRebate = 25,
    loginReward = 26,
    duobao = 27,
    singlePayJade = 28,
    singlePayPrint = 29,
    openReward = 30,
    jzduobao = 31,
    weekSinglePay = 32,
    weekLogin = 33,
    weekAccumulate = 34,
    weekConsume = 35,
    consumeRank = 36,
    limitPack = 37,
    zhizunCard = 38,
    inviteGift = 39,
    oneBuy = 40,
}

declare const enum LimitBigType {
    null = 0,
    fish = 1,
    dishu = 2,
    year = 3,
    evedayPay = 5,
}
declare const enum LimitTaskSmallType {
    null = 0,
    money = 3001,
    day = 3002,
    cjjf = 3003
}

declare const enum LimitWeightType {
    null = 0,
    fh = 1, // 钓鱼(黄金) 
    fb = 2, // 钓鱼(铂金)
    fz = 3, // 钓鱼(钻石)
    year = 5, // 新春活动
}

