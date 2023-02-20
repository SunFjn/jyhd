/** 底部切页配置*/
namespace modules.bottomTab {
    import TabInfo = ui.TabInfo;
    import TabInfoFields = ui.TabInfoFields;
    import WindowEnum = ui.WindowEnum;
    import RedPointProperty = ui.RedPointProperty;

    export class BottomTabConfig {
        private static _instance: BottomTabConfig;
        public static get instance(): BottomTabConfig {
            return this._instance = this._instance || new BottomTabConfig();
        }

        private _arr: Array<TabInfo>;
        private _table: Table<TabInfo>;
        private _tabEnterTable: Table<TabInfo>;
        // 红点table，保存每个面板对应的红点属性数组
        private _redTable: Table<Array<keyof RedPointProperty>>;

        constructor() {
            this.init();
        }


        private init(): void {
            this._arr = [
                [
                    [[WindowEnum.PLAYER_PANEL], [WindowEnum.LuxuryEquip_ZhiZun_PANEL]],
                    ["角色", "圣装"],
                    [[["goldBodyRP", "equipPartRP", "fightTalismanRP", "fightTalismanBuyRP", "moneyCatRP",
                        "equipSuitRP_0", "equipSuitRP_1", "equipSuitRP_2", "equipSuitRP_3",
                        "equipSuitRP_4", "equipSuitRP_5", "equipSuitRP_6",
                        "equipSuitRP_7", "equipSuitRP_8", "equipSuitRP_9",
                        "tianZhuShengJiRP", "tianZhuShengJiMatRP", "tianZhuHuanHuaZhenPinRP",
                        "tianZhuHuanHuaJiPinRP", "tianZhuHuanHuaJuePinRP", "tianZhuFuHunRP",
                        "fashionShengJiRP", "fashionShengJiMatRP", "fashionHuanHuaZhenPinRP",
                        "fashionHuanHuaJiPinRP", "fashionHuanHuaJuePinRP", "fashionHuanHuaDianchangRP", "fashionFuHunRP", "glovesRP",
                        "weaponFeedSkillRP", "weaponFeedMatRP", "weaponRankSkillRP", "weaponRankMatRP", "weaponIllusionRP", "weaponRefineMaterialRP", "weaponFazhenJipinRP",
                        "weaponFazhenZhenpinRP", "weaponFazhenJuepinRP", "petFeedSkillRP", "petFeedMatRP", "petRankSkillRP", "petRankMatRP", "petIllusionRP", "petRefineMaterialRP",
                        "magicPetFazhenJipinRP", "magicPetFazhenZhenpinRP", "magicPetFazhenJuepinRP",
                        "guanghuanShengJiRP", "guanghuanShengJiMatRP", "guanghuanHuanHuaZhenPinRP", "guanghuanHuanHuaJiPinRP", "guanghuanHuanHuaJuePinRP", "guanghuanHuanHuaDianchangRP", "guanghuanFuHunRP"
                    ]], [["zzRP", "zzskillRP"]]],
                    ["image_common_jse_", "image_common_zzzb_"],
                    ActionOpenId.begin
                ],
                [
                    [[WindowEnum.MAGIC_WEAPON_FEED_PANEL, WindowEnum.MAGIC_WEAPON_RANK_PANEL, WindowEnum.WEAPON_ILLUSION_PANEL, WindowEnum.MAGIC_WEAPON_REFINE_PANEL, WindowEnum.MAGIC_WEAPON_FAZHEN_PANEL], [WindowEnum.MAGIC_PET_FEED_PANEL, WindowEnum.MAGIC_PET_RANK_PANEL, WindowEnum.PET_ILLUSION_PANEL, WindowEnum.MAGIC_PET_REFINE_PANEL, WindowEnum.MAGIC_PET_FAZHEN_PANEL]],
                    ["翅膀", "宠物"],
                    [[["weaponFeedSkillRP", "weaponFeedMatRP"], ["weaponRankSkillRP", "weaponRankMatRP"], ["weaponIllusionRP"], ["weaponRefineMaterialRP"], ["weaponFazhenJipinRP", "weaponFazhenZhenpinRP", "weaponFazhenJuepinRP"]], [["petFeedSkillRP", "petFeedMatRP"], ["petRankSkillRP", "petRankMatRP"], ["petIllusionRP"], ["petRefineMaterialRP"], ["magicPetFazhenJipinRP", "magicPetFazhenZhenpinRP", "magicPetFazhenJuepinRP"]]],
                    ["image_common_xq_", "image_common_lc_"],
                    ActionOpenId.xianlingEnter
                ],
                [
                    [[WindowEnum.BAG_PANEL], [WindowEnum.SMELT_PANEL], [WindowEnum.SHENQI_PANEL], [WindowEnum.COMPOSE_PANEL], [WindowEnum.UNCOMPOSE_PANEL]],
                    ["背包", "熔炼", "神器", "合成", "分解"],
                    [[["bagRP"]], [["smeltRP"]], [["shenqiRP"]], [["composeRP"]], [["resolveRP"]]],
                    ["image_common_bb_", "image_common_rl_", "image_common_shenqi_", "image_common_hc_", "image_common_fj_"],
                    ActionOpenId.beibaoEnter
                ],
                [
                    [[WindowEnum.MISSION_PANEL]],
                    ["天关"],
                    [[["missionRP", "lineClearOut"]]],
                    ["image_common_tg_"],
                    ActionOpenId.begin
                ],
                // [
                //     [[WindowEnum.WEAPON_ILLUSION_PANEL], [WindowEnum.PET_ILLUSION_PANEL]],
                //     ["精灵幻化", "宠物幻化"],
                //     [[["weaponIllusionRP"]], [["petIllusionRP"]]],
                //     ["image_common_xqhh_", "image_common_lchh_"],
                //     ActionOpenId.begin
                // ],
                [
                    [[WindowEnum.INTENSIVE_PANEL], [WindowEnum.STONE_PANEL], [WindowEnum.EQUIPMENT_ZUHUN_PANEL], [WindowEnum.XI_LIAN_PANEL]],
                    ["强化", "仙石", "铸魂", "洗炼"],
                    [[["intensiveRP"]], [["stoneRP"]], [["equipmentZuHunRP"]], [["xiLianMaster"]]],
                    ["image_common_qh_", "image_common_xs_", "image_common_zh_", "image_common_xil_"],
                    ActionOpenId.duanzaoEnter
                ],
                [
                    [[WindowEnum.SINGLE_BOSS_PANEL, WindowEnum.MULTI_BOSS_PANEL, WindowEnum.YUNMENGMIJING_PANLE], [WindowEnum.THREE_WORLDS_PANEL, WindowEnum.SHENGYU_BOSS_PANEL, WindowEnum.BOSS_HOME_PANEL]],
                    ["本服", "跨服"],
                    [[["singleBossRP"], ["multiBossRP"], ["yunMengBossRP"]], [["threeWorldsRP"], ["shenYuBossRP"], ["bossHomeRP"]]],
                    ["image_common_bfboss_", "image_common_kfboss_"],
                    ActionOpenId.boss
                ],
                [
                    [[WindowEnum.MAGIC_ART_PANEL], [WindowEnum.TALISMAN_PANEL]],
                    ["技能", "圣物"],
                    [[["magicArtRP"]], [["talismanRP"]]],
                    ["image_common_xshu_", "image_common_fb_"],
                    ActionOpenId.xianfaEnter
                ],
                [
                    [[WindowEnum.BIG_TOWER, WindowEnum.DAILY_DUNGEON_PANEL, WindowEnum.RUNE_COPY_PANEL], [WindowEnum.TEAM_BATTLE_PANEL]],
                    ["单人", "多人"],
                    [[["bigTowerRP"], ["dailyDungeonRP"], ["runeCopyRP"]], [["teamBattleRP"]]],
                    ["image_common_danrfb_", "image_common_drfb_"],
                    ActionOpenId.copy
                ],
                [
                    // [[WindowEnum.EXERCISE_PANEL], [WindowEnum.ACTIVITY_ALL_PANEL], [WindowEnum.RES_BACK_PANEL], [WindowEnum.DAILY_DEMON_PANEL]],
                    // ["历练", "活动列表", "资源找回", "降妖"],
                    // [[["exerciseRP"]], [["activityAllItemRP"]], [["resBack"]], [["dailyDemonRP"]]],
                    // ["image_common_mrll_", "image_common_hdlb_", "image_common_hdlb_", "image_common_mrxy_"],
                    // ActionOpenId.daily
                    [[WindowEnum.EXERCISE_PANEL], [WindowEnum.ACTIVITY_ALL_PANEL], [WindowEnum.DAILY_DEMON_PANEL]],
                    ["历练", "活动列表", "降妖"],
                    [[["exerciseRP"]], [["activityAllItemRP"]], [["dailyDemonRP"]]],
                    ["image_common_mrll_", "image_common_hdlb_", "image_common_mrxy_"],
                    ActionOpenId.daily

                ],
                // [
                //     [[WindowEnum.IMMORTAL_SHENGJI_PANEL, WindowEnum.IMMORTAL_HUANHUA_PANEL, WindowEnum.IMMORTAL_FUHUN_PANEL], [WindowEnum.WING_SHENGJI_PANEL, WindowEnum.WING_HUANHUA_PANEL, WindowEnum.WING_FUHUN_PANEL],
                //     [WindowEnum.FASHION_SHENG_JI_PANEL, WindowEnum.FASHION_HUAN_HUA_PANEL, WindowEnum.FASHION_FU_HUN_PANEL], [WindowEnum.TIAN_ZHU_SHENG_JI_PANEL, WindowEnum.TIAN_ZHU_HUAN_HUA_PANEL, WindowEnum.TIAN_ZHU_FU_HUN_PANEL]],
                //     ["幻武", "翅膀", "时装", "神兽"],
                //     [[["immortalsShengjiRP"], ["immortalsHuanhuaJipinRP", "immortalsHuanhuaZhenpinRP", "immortalsHuanhuaJuepinRP"], ["immortalsFuhunRP"]], [["wingShengjiRP"], ["wingHuanhuaJipinRP", "wingHuanhuaZhenpinRP", "wingHuanhuaJuepinRP"], ["wingFuhunRP"]],
                //     [["fashionShengJiRP", "fashionShengJiMatRP"], ["fashionHuanHuaJiPinRP", "fashionHuanHuaZhenPinRP", "fashionHuanHuaJuePinRP"], ["fashionFuHunRP"]], [["tianZhuShengJiRP", "tianZhuShengJiMatRP"], ["tianZhuHuanHuaJiPinRP", "tianZhuHuanHuaZhenPinRP", "tianZhuHuanHuaJuePinRP"], ["tianZhuFuHunRP"]]],
                //     ["image_common_sb_", "image_common_xy_", "image_common_sz_", "image_common_tz_"],
                //     ActionOpenId.immortalEnter
                // ],
                [
                    [[WindowEnum.IMMORTAL_SHENGJI_PANEL, WindowEnum.IMMORTAL_HUANHUA_PANEL, WindowEnum.IMMORTAL_FUHUN_PANEL]],
                    ["幻武"],
                    [[["immortalsShengjiRP"], ["immortalsHuanhuaJipinRP", "immortalsHuanhuaZhenpinRP", "immortalsHuanhuaJuepinRP", "immortalsHuanhuaDianchangRP"], ["immortalsFuhunRP"]]],
                    ["image_common_sb_"],
                    ActionOpenId.immortalEnter
                ],
                [
                    [[WindowEnum.WING_SHENGJI_PANEL, WindowEnum.WING_HUANHUA_PANEL, WindowEnum.WING_FUHUN_PANEL], [WindowEnum.FASHION_SHENG_JI_PANEL, WindowEnum.FASHION_HUAN_HUA_PANEL, WindowEnum.FASHION_FU_HUN_PANEL]
                        /*, [WindowEnum.GUANGHUAN_SHENG_JI_PANEL, WindowEnum.GUANGHUAN_HUAN_HUA_PANEL, WindowEnum.GUANGHUAN_FU_HUN_PANEL]*/],
                    ["翅膀", "时装"],
                    [[["wingShengjiRP"], ["wingHuanhuaJipinRP", "wingHuanhuaZhenpinRP", "wingHuanhuaJuepinRP", "wingHuanhuaDianchangRP"], ["wingFuhunRP"]], [["fashionShengJiRP", "fashionShengJiMatRP"], ["fashionHuanHuaJiPinRP", "fashionHuanHuaZhenPinRP", "fashionHuanHuaJuePinRP", "fashionHuanHuaDianchangRP"]],
                    /*[["guanghuanShengJiRP", "guanghuanShengJiMatRP"], ["guanghuanHuanHuaZhenPinRP", "guanghuanHuanHuaJiPinRP", "guanghuanHuanHuaJuePinRP", "guanghuanHuanHuaDianchangRP"], ["guanghuanFuHunRP"]]*/],
                    ["image_common_xy_", "image_common_sz_"/*, "image_common_gh_"*/],
                    ActionOpenId.immortalEnter
                ],
                [
                    [[WindowEnum.TIAN_ZHU_SHENG_JI_PANEL, WindowEnum.TIAN_ZHU_HUAN_HUA_PANEL, WindowEnum.TIAN_ZHU_FU_HUN_PANEL]],
                    ["鬼神之力"],
                    [[["tianZhuShengJiRP", "tianZhuShengJiMatRP"], ["tianZhuHuanHuaJiPinRP", "tianZhuHuanHuaZhenPinRP", "tianZhuHuanHuaJuePinRP"], ["tianZhuFuHunRP"]]],
                    ["image_common_tz_"],
                    ActionOpenId.immortalEnter
                ],
                [
                    [[WindowEnum.TREASURE_PANEL,
                    WindowEnum.TREASURE_TALISMAN_PANEL,
                    WindowEnum.TREASURE_RUNE_PANEL,
                    WindowEnum.TREASURE_DIANFENG_PANEL,
                    WindowEnum.TREASURE_ZHIZUN_PANEL], [WindowEnum.TREASURE_BAG_PANEL], [WindowEnum.TREASURE_CHANGE]],
                    ["探索", "仓库", "兑换"],
                    [[["treasureRP"]], [["treasureBagRP"]], [["treasureExchangeRP"]]],
                    ["image_common_xb_", "image_common_ck_", "image_common_dh_"],
                    ActionOpenId.xunbao
                ],
                [
                    [[WindowEnum.MAGIC_POSITION_PANEL], [WindowEnum.BORN_PANEL]],
                    ["成就", "觉醒"],
                    [[["magicPositionRP"]], [["bornRP"]]],
                    ["image_common_xw_", "image_common_zs_"],
                    ActionOpenId.xiuxianEnter
                ],
                [
                    [[WindowEnum.LIMIT_STORE_PANEL, WindowEnum.USUAL_STORE_PANEL, WindowEnum.GOLD_STORE_PANEL/*, WindowEnum.VIP_STORE_PANEL*/],
                    [WindowEnum.BOSS_STORE_PANEL, WindowEnum.HONOR_STORE_PANEL, WindowEnum.STORE_XIAN_FU_PANEL, WindowEnum.CLAN_STORE_PANEL, WindowEnum.XIANYUAN_STORE_PANEL],
                    [WindowEnum.SHENHUN_STORE_PANEL, WindowEnum.SHENGYIN_STORE_PANEL]],
                    ["商城", "商店", "商店"],
                    [[["shangchengRP"]], [["shangdianRP"]], [null]],
                    ["image_common_sc_", "image_common_sd_", "image_common_bk_"],
                    ActionOpenId.storeAndShop
                ],
                [
                    [[WindowEnum.GOLD_BODY_PANEL]],
                    ["铸魂"],
                    [[["goldBodyRP"]]],
                    ["image_common_js_"],
                    ActionOpenId.begin
                ],
                [
                    [[WindowEnum.PLAYER_TITLE_PANEL]],
                    ["称号"],
                    [[["playerTitleRP"]]],
                    ["image_common_ch_"],
                    ActionOpenId.begin
                ],
                [
                    [[WindowEnum.VIP_NEW_PANEL], [WindowEnum.VIP_PANEL]],
                    ["VIP", "SVIP"],
                    [[["vipNewRP"]], [["vipRP"]]],
                    ["image_common_vip_", "image_common_svip_"],
                    ActionOpenId.vipF
                ],
                [
                    [[WindowEnum.SIGN_PANEL],
                    [WindowEnum.ONLINE_PANEL],
                    [WindowEnum.SEVEN_DAY_GIFT_PANEL],
                    [WindowEnum.HALF_MONTH_GIFT_PANEL],
                    [WindowEnum.PREVENT_FOOL_PANEL],
                    [WindowEnum.ANNOUNCEMENT_PANEL]],
                    ["签到", "在线礼包", "七日礼", "半月礼", "防骗问答", "激活码兑换/公告"],
                    [[["signRP"]], [["onlineGiftRP"]], [["sevenDayGiftRP"]], [["halfMonthGiftRP"]], [["preventFoolRP"]], [["announcementRP"]]],
                    ["image_common_mrqd_", "image_common_zxlb_", "image_common_qrl_", "image_common_byl_", "image_common_fzp_", "image_common_jhm_"],
                    ActionOpenId.welfare
                ],
                [
                    [[WindowEnum.WEEK_CARD_PANEL],
                    [WindowEnum.MONTH_CARD_PANEL],
                    [WindowEnum.WEEK_XIANYU_PANEL],
                    [WindowEnum.WEEK_YUANBAO_PANEL],],
                    ["周卡", "月卡", "点券周卡", "代币券周卡"],
                    [[["weekCardRP"]], [["monthCardRP"]], [["weekXianyuRP"]], [["weekYuanbaoRP"]]],
                    ["image_common_flzk_", "image_common_ybyk_", "image_common_xyzk_", "image_common_ybzk_"],
                    ActionOpenId.weekCard
                ],
                [
                    [[WindowEnum.HERO_AURA_PANEL]],
                    ["黑钻特权"],
                    [[["heroAuraRP"]]],
                    ["image_common_zjgh_"],
                    ActionOpenId.heroAura
                ],
                [
                    [[WindowEnum.EMAIL_PANEL]],
                    ["邮件"],
                    [[["emailRP"]]],
                    ["image_common_yj_"],
                    ActionOpenId.begin
                ],
                [
                    [[WindowEnum.RECHARGE_PANEL]],
                    ["充值"],
                    [[["rechargeRP"]]],
                    ["image_common_cz_"],
                    ActionOpenId.begin
                ],
                [
                    [[WindowEnum.RANKING_LIST_PANEL]],
                    ["排行榜"],
                    [[["rankingListRP"]]],
                    ["image_common_phb_"],
                    ActionOpenId.begin
                ],
                [
                    [[WindowEnum.RUNE_INLAY_PANEL], [WindowEnum.RUNE_COMPOSE_PANEL], [WindowEnum.RUNE_COLLECT_PANEL]],
                    ["玉荣", "玉荣合成", "玉荣收集箱"],
                    [[["runeRP"]], [["runeComposeRP"]], [["runeCollectRP"]]],
                    ["image_common_yr_", "image_common_yrhc_", "image_common_yrsjx_"],
                    ActionOpenId.rune
                ],
                [
                    [[WindowEnum.ARENA_PANEL, WindowEnum.LADDER_PANEL], [WindowEnum.NINE_PANEL, WindowEnum.FAIRY_PANEL], [WindowEnum.XUANHUO_PANEL, WindowEnum.ZHULU_PANEL]],
                    ["单人竞技", "多人竞技", "战队竞技"],
                    [[["arenaRP"], ["ladderJoinAwardRP"]], [null, ["fairyRP"]], [["XHMainAchievementRP"], ["ZhuluCjAwardeRP", "ZhuluDamageRP"]]],
                    ["image_common_danrjj_", "image_common_drjj_", "image_common_zdjj_"],
                    ActionOpenId.begin
                ],
                [
                    [[WindowEnum.FISH_PANEL], [WindowEnum.FISH_RANK_PANEL], [WindowEnum.FISH_SHOP_PANEL], [WindowEnum.FISH_LINK_PANEL], [WindowEnum.FISH_REAP_PANEL], [WindowEnum.FISH_CARNIVAL_PANEL]],
                    ["九州渔场", "垂钓排行", "垂钓商城", "垂钓连充", "垂钓反利", "掉落狂欢"],
                    [
                        [["fishItemSate0", "fishItemSate1", "fishItemSate2"]],
                        [[null]],
                        [[null]],
                        [["fishLinkRP", "fishLinkRP_grade_1", "fishLinkRP_grade_2", "fishLinkRP_grade_3"]],
                        [["fishReapRP"]], [[null]]

                    ],
                    ["image_common_cdsy_", "image_common_cdph_", "image_common_cdsc_", "image_common_cdlc_", "image_common_cdfl_", "image_common_dlkh_"],
                    ActionOpenId.fishAtv
                ],
                //     [WindowEnum.FISH_GIFT_PANEL],
                //     "垂钓礼包",
                //     [["fishGiftRP", "fishGiftRP_grade_1", "fishGiftRP_grade_2", "fishGiftRP_grade_3"]],
                //     "image_common_cdlb_",
                [
                    [[WindowEnum.FISH_CK_PANEL]],
                    ["垂钓宝库"],
                    [[[null]]],
                    ["image_common_cdbk_"],
                    ActionOpenId.fishCk
                ],
                [
                    [
                        /*[WindowEnum.OPEN_AWARD_PANEL],
                        [WindowEnum.DISCOUNT_GIFT_PANEL],
                        [WindowEnum.DAY_CONSUME_REWARD_PANEL],*/
                        [WindowEnum.OPENSERVICE_CEREMONY_GEOCAHING_VIEW],
                        [WindowEnum.OPENSERVICE_LIMIT_ONE_DISCOUNT_VIEW],
                        [WindowEnum.OPENSERVICE_CEREMONY_CASH_VIEW],

                        [WindowEnum.CUMULATE_PAY2_UPDATE],
                        [WindowEnum.OPENSERVICE_CONTINUE_PAY_VIEW],
                        [WindowEnum.OPENSERVICE_SINGLE_RECHARGE_VIEW],
                        [WindowEnum.CUMULATE_PAY_UPDATE],

                        [WindowEnum.CONSUME_REWARD_PANEL],
                        [WindowEnum.OPENSERVICE_DOUBLE_DROP_VIEW]
                    ],
                    [/*"开服礼包", "特惠礼包", "消费赠礼(每日)",*/
                        "庆典探索",
                        "限时一折",
                        "庆典兑换",

                        "每日累充",
                        "连充",
                        "单笔充值",
                        "累充",

                        "消费赠礼",
                        "掉落狂欢"
                    ],
                    [/*null, [["discountGiftPayRP"]], [["dayconsumeRP"]],*/
                        [["ceremonyGeocachingGetedRP", "ceremonyGeocachingCanDraw"]],
                        [[null]],
                        [["ceremonyExchangeRP"]],

                        [["cumulate2RP"]],
                        [["ceremonyContinuePayRP"]],
                        [["CeremonyDanbiRP"]],
                        [["cumulateRP"]],

                        [["consumeRP"]],
                        [[null]]
                    ],
                    [/*"image_common_kflb_", "image_common_thlb_", "image_common_xfzl_",*/
                        "image_common_qdxb_",
                        "image_common_xsyz_",
                        "image_common_qddh_",

                        "image_common_mrlc_",
                        "image_common_lchl_",
                        "image_common_dbcz_",
                        "image_common_leichl_",

                        "image_common_xfzl_",
                        "image_common_dlkh_"
                    ],
                    ActionOpenId.openServerActivit
                ],
                [
                    [
                        [WindowEnum.YEAR_CJ],
                        [WindowEnum.YEAR_SHOP],
                        [WindowEnum.YEAR_EXCHANGE],

                        [WindowEnum.YEAR_LINK],
                        [WindowEnum.YEAR_REAP],

                        [WindowEnum.YEAR_ADDUP_PAY],
                        [WindowEnum.YEAR_DAY_ADDUP_PAY],
                        [WindowEnum.YEAR_SINGLE_PAY],

                        [WindowEnum.YEAR_CARNIVAL],
                        [WindowEnum.YEAR_LOGIN_LINK],

                    ], [
                        "抽奖", "商城", "兑换",

                        "连充", "消费赠礼",

                        "累充豪礼", "每日累充", "每日单笔",

                        "掉落狂欢",
                        "连续登陆"
                    ], [
                        [["YearCjTaskRP"]],
                        [[null]],
                        [["YearDhRP"]],

                        [["YearLinkRP"]],
                        [["YearReapRP"]],

                        [["YearCumulateRP"]],
                        [["YearDayCumulateRP"]],
                        [["YearDaySingleRP"]],

                        [[null]],
                        [["YearLoginRP"]]
                    ], [
                        "image_common_cjdb_",
                        "image_common_xsyz_",
                        "image_common_yeardh_",

                        "image_common_lchl_", "image_common_xfzl_",

                        "image_common_leichl_", "image_common_mrlc_", "image_common_dbcz_",

                        "image_common_dlkh_", "image_common_lxdl_"
                    ],
                    ActionOpenId.year
                ],
                [
                    [
                        [WindowEnum.CUMULATE_PAY3_UPDATE]
                    ],
                    ["累充2"],
                    [[["cumulate3RP"]]],
                    ["image_common_leichl_"],
                    ActionOpenId.TreesSpring//198#198#143#115#112#140#118#146
                ],
                [
                    [
                        [WindowEnum.GM_DEBUG_VIEW], [WindowEnum.GM_MAP_VIEW]
                    ],
                    ["GM"],
                    [],
                    ["image_common_zzzb_", "image_common_zzzb_"],
                    ActionOpenId.begin//198#198#143#115#112#140#118#146
                ],
                [
                    [[WindowEnum.INVEST_LOGIN_PANEL], [WindowEnum.INVEST_RECRUIT_PANEL], [WindowEnum.INVEST_GROWTH_PANEL]],
                    ["登录返利", "闯关返利", "成长返利"],
                    [[["investLoginRP"]], [["investRecruitRP"]], [["investGrowthRP"]]],
                    ["image_common_dlfl_", "image_common_cgfl_", "image_common_czfl_"],
                    ActionOpenId.investReward
                ],
                [    //升级、任务、风水、总览
                    [[WindowEnum.XIANFU_SHENGJI_PANEL], [WindowEnum.XIANFU_TASK_PANEL], [WindowEnum.XIANFU_WIND_WATER_PANEL], [WindowEnum.XIANFU_PANDECT_PANEL], [WindowEnum.XIANFU_SHOP]],
                    ["家园升级", "家园任务", "家园风水", "家园总览", "家园商店"],
                    [[["xianfuShengjiRP"]], [["xianfuTaskRP"]], [["xianfuArticleRP_0", "xianfuArticleRP_1", "xianfuArticleRP_2"]]],
                    ["image_common_xfsj_", "image_common_xfrw_", "image_common_xffs_", "image_common_xfzlan_", "image_common_jysc_"],
                    ActionOpenId.begin
                ],
                [
                    [
                        [WindowEnum.SPRINT_RANKTASK_XIANQI_PANEL],
                        [WindowEnum.SPRINT_RANKTASK_LINGCHONG_PANEL],
                        [WindowEnum.SPRINT_RANKTASK_SHENBING_PANEL],
                        [WindowEnum.SPRINT_RANKTASK_XIANYI_PANEL],
                        [WindowEnum.SPRINT_RANKTASK_FABAO_PANEL],
                        [WindowEnum.SPRINT_RANKTASK_EQUIPMENT_PANEL],
                        [WindowEnum.SPRINT_RANKTASK_FIGHTING_PANEL]
                    ],
                    ["精灵排行", "宠物排行", "幻武排行", "翅膀排行", "仙法排image_common_djkh_行", "装备排行", "战力排行"],
                    [[["sprintRankXianQiRP"]], [["sprintRankLingChongRP"]], [["sprintRankShenBingRP"]], [["sprintRankXianYiRP"]]
                        , [["sprintRankFaBaoRP"]], [["sprintRankEquipmentRP"]], [["sprintRankFighitingRP"]]],
                    ["image_common_lfxq_", "image_common_wmlc_", "image_common_kxsb_", "image_common_xcxy_", "image_common_xaxf_", "image_common_jpzb_", "image_common_zqzl_"],
                    ActionOpenId.sprintRankEnter
                ],
                [
                    [[WindowEnum.XIANFU_HAND_BOOK_BLUE_PANEL], [WindowEnum.XIANFU_HAND_BOOK_VIOLET_PANEL], [WindowEnum.XIANFU_HAND_BOOK_ORANGE_PANEL], [WindowEnum.XIANFU_HAND_BOOK_RED_PANEL]],
                    ["蓝品图鉴", "紫品图鉴", "橙品图鉴", "红品图鉴"],
                    [[["xianfuBlueHandBookRP"]], [["xianfuVioletHandBookRP"]], [["xianfuOrangeHandBookRP"]], [["xianfuRedHandBookRP"]]],
                    ["image_common_lp_", "image_common_zp_", "image_common_cp_", "image_common_hp_"],
                    ActionOpenId.begin
                ],
                [
                    [[WindowEnum.GUSHEN_PANEL]],
                    ["古神问道"],
                    [[["guShenRP",]]],
                    ["image_common_gswd_"],
                    ActionOpenId.begin
                ],
                [
                    [[WindowEnum.KUANGHUAN_LEVEL_PANLE], [WindowEnum.KUANGHUAN_PANLE], [WindowEnum.KUANGHUAN_POWER_PANLE]],
                    ["全民等级狂欢", "全民狂欢", "全民战力狂欢"],
                    [[["kuangHuanLevelRP"]], [["kuangHuanRP"]], [["kuangHuanPowarRP"]]],
                    ["image_common_djkh_", "image_common_djkh_", "image_common_zlkh_"],
                    ActionOpenId.kuanghuan
                ],
                [
                    [[WindowEnum.ADVENTURE_PANEL], [WindowEnum.ADVENTURE_SHOP_PANEL]],
                    ["奇遇", "奇遇商店"],
                    [[["adventureRP"]], [["adventureShopRP"]]],
                    ["image_common_qysj_", "image_common_qydh_"],
                    ActionOpenId.adventureEnter
                ],
                [
                    [[WindowEnum.FACTION_JOIN_PANEL], [WindowEnum.FACTION_PANEL], [WindowEnum.FACTION_SKILL_PANEL, WindowEnum.FACTION_WEAL_PANEL], [WindowEnum.FACTION_MEMBER_PANEL]],
                    ["公会列表", "公会主页", "公会福利", "公会成员"],
                    [[null], [["factionApplyJoinRP", "factionPostApplyRP", "mineBaozangListRP", "helpBaozangListRP", "factionHurtAwardRP"]], [["factionSkillRP"], ["factionDialRP"]], [null]],
                    ["image_common_xmlb_", "image_common_xmzy_", "image_common_xmfl_", "image_common_xmcy_"],
                    ActionOpenId.factionEnter
                ],
                // [
                //     [[WindowEnum.PLAYER_TITLE_PANEL]],
                //     ["称号"],
                //     [[["playerTitleRP"]]],
                //     ["image_common_ch_"],
                //     ActionOpenId.playerTitle
                // ],
                [
                    [[WindowEnum.BAOZANG_LIST_PANEL], [WindowEnum.BAOZANG_MINE_PANEL], [WindowEnum.BAOZANG_HELP_LIST_PANEL]],
                    ["宝藏列表", "我的宝藏", "协助列表"],
                    [[null], [["mineBaozangListRP"]], [["helpBaozangListRP"]]],
                    ["image_common_bzlb_", "image_common_wdbz_", "image_common_xzlb_"],
                    ActionOpenId.begin
                ],
                [
                    [[WindowEnum.FACTION_COPY_PANEL], [WindowEnum.FACTION_TASK_PANEL]],
                    ["公会挑战", "伤害奖励"],
                    [[null], [["factionHurtAwardRP"]]],
                    ["image_common_xmzx_", "image_common_shjl_"],
                    ActionOpenId.begin
                ],
                [
                    [[WindowEnum.SOARING_RANK_PANEL],
                    [WindowEnum.SOARING_SPECIALGIFT_PANEL],
                    [WindowEnum.SOARING_PANICBUTINGGIFT_PANEL],
                    [WindowEnum.SOARING_SINGLEPAY_PANEL],
                    [WindowEnum.SOARING_CUMULATEPAY_PANEL],
                    [WindowEnum.SOARING_DAYCONSUMEREWARD_PANEL]
                    ],
                    ["封神榜", "特惠礼包（封神榜）", "抢购礼包（封神榜）", "单笔充值（封神榜）", "累计充值（封神榜）", "消费赠礼（封神榜）"],
                    [[["soaringRankRP"]], [["soaringSpecialGiftRP"]], [["soaringPanicBuyingGifRP"]], [["soaringSinglePayRP"]], [["soaringCumulatePayRP"]], [["soaringDayConsumeRewardRP"]]],
                    ["image_common_fsb_", "image_common_fsth_", "image_common_fsqg_", "image_common_fsdbi_", "image_common_fslc_", "image_common_fsxf_"],
                    ActionOpenId.soaringRank
                ],
                [
                    [[WindowEnum.EQUIP_SUIT_PANEL_0],
                    [WindowEnum.EQUIP_SUIT_PANEL_1],
                    [WindowEnum.EQUIP_SUIT_PANEL_2],
                    [WindowEnum.EQUIP_SUIT_PANEL_3],
                    [WindowEnum.EQUIP_SUIT_PANEL_4],
                    [WindowEnum.EQUIP_SUIT_PANEL_5],
                    [WindowEnum.EQUIP_SUIT_PANEL_6],
                    [WindowEnum.EQUIP_SUIT_PANEL_7],
                    [WindowEnum.EQUIP_SUIT_PANEL_8],
                    [WindowEnum.EQUIP_SUIT_PANEL_9],
                    [WindowEnum.EQUIP_SUIT_PANEL_10],
                    [WindowEnum.EQUIP_SUIT_PANEL_11],
                    [WindowEnum.EQUIP_SUIT_PANEL_12],
                    [WindowEnum.EQUIP_SUIT_PANEL_13],
                    [WindowEnum.EQUIP_SUIT_PANEL_14]],
                    ["装备合成_0", "装备合成_1", "装备合成_2", "装备合成_3", "装备合成_4",
                        "装备合成_5", "装备合成_6", "装备合成_7", "装备合成_8", "装备合成_9", "装备合成_10", "装备合成_11", "装备合成_12", "装备合成_13", "装备合成_14"],
                    [[["equipSuitRP_0"]],
                    [["equipSuitRP_1"]],
                    [["equipSuitRP_2"]],
                    [["equipSuitRP_3"]],
                    [["equipSuitRP_4"]],
                    [["equipSuitRP_5"]],
                    [["equipSuitRP_6"]],
                    [["equipSuitRP_7"]],
                    [["equipSuitRP_8"]],
                    [["equipSuitRP_9"]],
                    [["equipSuitRP_10"]],
                    [["equipSuitRP_11"]],
                    [["equipSuitRP_12"]],
                    [["equipSuitRP_13"]],
                    [["equipSuitRP_14"]],],
                    ["image_common_lytz_", "image_common_cxtz_", "image_common_txtz_", "image_common_zxtz_", "image_common_kwtz_",
                        "image_common_xytz_", "image_common_pgtz_", "image_common_qktz_", "image_common_hdtz_", "image_common_mstz_",
                        "image_common_ygqs_", "image_common_cfbm_", "image_common_wyzy_", "image_common_hszz_", "image_common_xscy_",],
                    ActionOpenId.equipSuit
                ],
                [
                    [
                        [WindowEnum.LOGIN_REWARD_PANEL],
                        [WindowEnum.CUMULATEPAY_TAINZHU],
                        [WindowEnum.CUMULATEPAY_SHENHUN],
                        [WindowEnum.EVERYDAY_REBATE_PANEL],
                        [WindowEnum.PAY_RANK_PANEL],

                    ],
                    ["登录豪礼(开服活动)", "单笔充值（天尊）", "单笔充值（炽星魔锤）", "天天返利", "消费排行",],
                    [
                        [["loginRewardRP"]],
                        [["cumulatePayTianZhuRP"]],
                        [["cumulatePayShenHunRP"]],
                        [["everyDayRebateRP"]],
                        [["payRankRP"]],
                    ],
                    ["image_common_dlhl_", "image_common_dbcz_", "image_common_dbcz_", "image_common_tiantfl_", "image_common_xfph_"],
                    ActionOpenId.activity
                ],
                [
                    [[WindowEnum.PAY_REWARD_PANEL], [WindowEnum.ROTARYTABLE_SOARING_PANEL], [WindowEnum.ROTARYTABLE_JIUZHOU_PANEL]],
                    ["充值转盘", "封神夺宝（转盘）", "九州夺宝"],
                    [[["payRewardRP"]], [["rotaryTableSoaringRP"]], [["rotaryTableJiuZhouRP"]]],
                    ["image_common_czzp_", "image_common_fsdb_", "image_common_jzdb_"],
                    ActionOpenId.zhuanPanEnter
                ],
                [
                    [
                        [WindowEnum.WEEK_LOGIN_PANEL],
                        [WindowEnum.SINGLE_PAY_PANEL],
                        [WindowEnum.REPEAT_PAY_PANEL],
                        [WindowEnum.WEEK_CONSUME_PANEL],
                    ],
                    ["登录豪礼(周末狂欢)", "单笔充值(周末狂欢)", "累充(周末狂欢)", "消费赠礼（周末狂欢）"],
                    [[["weekLoginRP"]], [["weekSinglePayRP"]], [["weekRepeatPayRP"]], [["weekConsumeRP"]]],
                    ["image_common_dlhl_", "image_common_dbcz_", "image_common_ljcz_", "image_common_xfzl_"],
                    ActionOpenId.weekRevelry
                ],
                // [
                //     [[WindowEnum.ZHIZUN_PANEL]],
                //     ["至尊特权"],
                //     [[[null]]],
                //     ["image_common_zztq_"],
                //     ActionOpenId.zhizunCard
                // ],
                [
                    [[WindowEnum.ZXIANYU_PANEL],
                    [
                        WindowEnum.ZXIANYU_TREASURE_PANEL,
                        WindowEnum.ZXIANYU_BAG_PANEL
                    ],
                    [WindowEnum.ZXIANYU_STORE_PANEL]],
                    ["点券界面", "点券抽奖，仓库", "珍宝阁"],
                    [[["zxianYuPanelRP"]], [["zxianYuTreasurePanelRP", "zxianYuBagPanelRP"]], [["zxianYuStorePanelRP"]]],
                    ["image_common_xyu_", "image_common_ys_", "image_common_yg_"],
                    ActionOpenId.xianYuEnter
                ],
                [
                    [[WindowEnum.ONE_BUY_PANEL]],
                    ["一元秒杀"],
                    [[["oneBuyRP"]]],
                    ["image_common_yyms_"],
                    ActionOpenId.oneBuy
                ],
                [
                    [[WindowEnum.XIAN_DAN_PAENL]],
                    ["仙丹"],
                    [[["xianDanRP"]]],
                    ["image_common_sxd_"],
                    ActionOpenId.xianDan
                ],
                [    //炼金药剂 
                    [[WindowEnum.INSIDE_XIAN_DAN_PAENL], [WindowEnum.XIANFU_SMELT_PANEL]],
                    ["仙丹", "炼金药剂"],
                    [[["xianDanRP", "xianfuSmeltRP"]]],
                    ["image_common_sxd_", "image_common_ljyj_"],
                    ActionOpenId.xianFuSmelt
                ],
                // [
                //     [[WindowEnum.FIGHT_TALISMAN_PANEL]],
                //     ["战力护符"],
                //     [[["fightTalismanRP"]]],
                //     ["image_common_xz_"],
                //     ActionOpenId.zhanLiHuFuNew
                // ],
                [
                    [[WindowEnum.THE_CARNIVAL_PANEL]],
                    ["全民狂嗨"],
                    [[["theCarnivalRP"]]],
                    ["image_common_qmkh_"],
                    ActionOpenId.theCarnivalEnter
                ],
                [
                    [[WindowEnum.CLAN_INDEX_PANEL]/*, [WindowEnum.CLAN_BLESSED_PANEL]*/],
                    ["战队"/*, "福地"*/],
                    [[["ClanGradeAwardRP", "ClanShopRP", "ClanApplyListRP"]]/*, [[null]]*/],
                    ["image_common_clan_"/*, "image_common_luckyFields_"*/],
                    ActionOpenId.ClanEntry
                ],
                [
                    [[WindowEnum.CLAN_LIST_PANEL]],//战队列表
                    ["战队"],
                    [[[null]]],
                    ["image_common_clan_"],
                    ActionOpenId.begin
                ],
                [
                    [[WindowEnum.CashEquip_PANEL]],
                    ["现金装备(奇装)"],
                    [[[null]]],
                    ["image_common_qizhuang_"],
                    ActionOpenId.CashEquip
                ],
                [
                    [[WindowEnum.JIUXIAOLING_AWARD_VIEW, WindowEnum.JIUXIAOLING_TASK_VIEW]],
                    ["九霄令"],
                    [[["JiuXiaoLingAwardRP"], ["JiuXiaoLingTaskRP", "JiuXiaoLingExtralExpRP"]]],
                    ["image_common_jxl_"],
                    ActionOpenId.jiuxiaoling
                ],
                [
                    [[WindowEnum.MARRY_PANEL], [WindowEnum.MARRY_RING_PANEL], [WindowEnum.MARRY_KEEPSAKE_PANEL, WindowEnum.MARRY_KEEPSAKE_Up_PANEL]],//, [WindowEnum.MARRY_CHILDREN_PANEL, WindowEnum.MARRY_CHILDREN_Up_PANEL, WindowEnum.MARRY_CHILDREN_Eat_PANEL, WindowEnum.MARRY_CHILDREN_Skill_PANEL]
                    ["姻缘", "义戒", "信物"],//, "仙娃"
                    [[["marryRP"]], [["marryRingRP"]], [["marryKeepsakeRP"]]],// , [["marryChildrenRP"]]
                    ["image_common_xianyuan_", "image_common_hj_", "image_common_xinwu_"],// , "image_common_xwa_"
                    ActionOpenId.marry
                ],
                [
                    [[WindowEnum.MARRY_Wall_PANEL]],
                    ["姻缘墙"],
                    [[["marryRP"]]],
                    ["image_common_xianyuan_"],
                    ActionOpenId.begin
                ],
                [
                    [[WindowEnum.MARRY_Task_PANEL]],
                    ["姻缘任务"],
                    [[["marryRP"]]],
                    ["image_common_xianyuan_"],
                    ActionOpenId.begin
                ],
                [
                    [[WindowEnum.SEVENACTIVITY_VIEW], [WindowEnum.DEMON_ORDER_GIFT_PANEL]],
                    ["七日活动", "魔神令"],
                    [[["sevenActivityRP"]], [["demonOrderGiftRP"]]],
                    ["image_common_qrmb_", "image_common_msl_"],
                    ActionOpenId.sevenActivity
                ],
                [
                    [
                        [WindowEnum.DI_SHU_PANEL],
                        [WindowEnum.DI_SHU_TASK_PANEL],
                        [WindowEnum.DI_SHU_RANK_PANEL],

                        [WindowEnum.DI_SHU_CARNIVAL_ALERT],
                        [WindowEnum.DI_SHU_REAP_PANEL],

                        [WindowEnum.DI_SHU_CUMULATE_PANEL],
                        [WindowEnum.DI_SHU_DAY_CUMULATE_PANEL],
                        [WindowEnum.DI_SHU_DAY_SINGLE_PANEL],

                    ],
                    [
                        "打地鼠", "补给猫粮", "喵星人",

                        "掉落狂欢", "消费赠礼",

                        "累充豪礼", "每日累充", "每日单笔"],
                    [
                        [[null]], [["DishuTaskOpenRP", "DishuTaskServerRP"]], [[null]],

                        [[null]], [["dishuReapRP"]],

                        [["dishuCumulateRP"]], [["dishuDayCumulateRP"]], [["dishuDaySingleRP"]]
                    ],
                    ["image_common_dds_",
                        "image_common_bjml_",
                        "image_common_mxr_",

                        "image_common_dlkh_",
                        "image_common_xfzl_",


                        "image_common_leichl_", "image_common_mrlc_", "image_common_dbcz_"],

                    ActionOpenId.begin
                ],
                [
                    [[WindowEnum.REDPACK_LEVEL_BONUS_PANEL], [WindowEnum.REDPACK_LEVEL_PANEL]],
                    ["等级分红", "等级红包"],
                    [[["LevelBonusRP"]], [["LevelRedPackRP"]]],
                    ["image_common_djfh_", "image_common_djhb_"],
                    ActionOpenId.levelhb
                ],
                [
                    [[WindowEnum.SUPRER_REDPACK_PANEL], [WindowEnum.SUPRER_REDPACK_CASH_PANEL]],
                    ["超级红包", "超级兑换"],
                    [[["SuperRedPackRP"]], [null]],
                    ["image_common_cjhb_", "image_common_cjdh_"],
                    ActionOpenId.superhb
                ],
                [
                    [[WindowEnum.EXPLICIT_SUIT_BEST_PANEL], [WindowEnum.EXPLICIT_SUIT_UNIQUE_PANEL], [WindowEnum.EXPLICIT_SUIT_COLLECTION_PANEL]],
                    ["极品套装", "绝品套装", "典藏套装"],
                    [[["ExplicitSuitBest"]], [["ExplicitSuitUnique"]], [["ExplicitSuitCollection"]]],
                    ["image_common_jptz_", "image_common_jueptz_", "image_common_dctz_"],
                    ActionOpenId.explicitSuit
                ],
                [
                    [[WindowEnum.RENAME_PANEL], [WindowEnum.HEAD_PANEL], [WindowEnum.SET_PANEL]],
                    ["改名", "个性化", "设置"],
                    [[null], [["HeadCanActiveRP"]], [null]],
                    ["image_common_gm_", "image_common_gxh_", "image_common_sztx_"],
                    ActionOpenId.begin
                ],
            ];

            this._table = {};
            this._tabEnterTable = {};
            this._redTable = {};
            for (let i: int = 0, len: int = this._arr.length; i < len; i++) {
                let tabInfo: TabInfo = this._arr[i];
                for (let j: int = 0, len1: int = tabInfo[TabInfoFields.panelIdsArr].length; j < len1; j++) {
                    let panelIds: Array<number> = tabInfo[TabInfoFields.panelIdsArr][j];
                    for (let k: int = 0, len2: int = panelIds.length; k < len2; k++) {
                        if (this._table[panelIds[k]]) console.log("bottom_tab_config中重复注册面板.............." + panelIds[k]);
                        this._table[panelIds[k]] = tabInfo;
                        this._redTable[panelIds[k]] = tabInfo[TabInfoFields.redPointPros][j] ? tabInfo[TabInfoFields.redPointPros][j][k] : null;
                    }
                }
                this._tabEnterTable[tabInfo[TabInfoFields.funcId]] = tabInfo;
            }
        }

        // 根据面板ID获取对应的切页信息
        public getTabInfoByPanelId(panelId: number): TabInfo {
            // console.log("panelId", panelId, this._table)
            return this._table[panelId];
        }

        // 根据切页入口功能ID获取切页信息
        public getTabInfoByEnterId(funcId: ActionOpenId): TabInfo {
            return this._tabEnterTable[funcId];
        }

        // 根据面板ID获取面板对应的红点数组
        public getRpsByPanelId(panelId: number): Array<keyof RedPointProperty> {
            return this._redTable[panelId];
        }
    }
}
