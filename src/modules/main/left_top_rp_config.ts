namespace modules.main {
    export class LeftTopRPConfig {
        private static _instance: LeftTopRPConfig;
        public static get instance(): LeftTopRPConfig {
            return this._instance = this._instance || new LeftTopRPConfig();
        }

        private _tab: Table<Array<keyof ui.LTIocnRP>>;

        constructor() {
            this._tab = {};
            this.init();
        }

        private init(): void {
            this._tab[ActionOpenId.sevenDay] = ["sevenDayGiftRP"];
            this._tab[ActionOpenId.heroAura] = ["heroAuraRP"];
            this._tab[ActionOpenId.welfare] = ["signRP", "monthCardRP", "onlineGiftRP", "sevenDayGiftRP", "preventFoolRP"];
            this._tab[ActionOpenId.weekCard] = ["weekCardRP", "monthCardRP", "weekXianyuRP", "weekYuanbaoRP"];
            this._tab[ActionOpenId.xunbao] = ["treasureRP", "treasureBagRP", "treasureExchangeRP"];
            this._tab[ActionOpenId.zeroBuy] = ["zeroBuyEntranceRP"];
            this._tab[ActionOpenId.cumulatePay] = ["cumulateRP"];
            this._tab[ActionOpenId.continuePay] = ["continuePayRP"];
            this._tab[ActionOpenId.ceremonyContinuePay] = ["ceremonyContinuePayRP"];
            // this._tab[ActionOpenId.openServerActivit] = ["discountGiftPayRP", "ceremonyContinuePayRP", "cumulateRP", "dayconsumeRP", "cumulate2RP", "consumeRP", "dayconsumeRP", "ceremonyGeocachingGetedRP", "ceremonyExchangeRP"];
            this._tab[ActionOpenId.openServerActivit] = ["ceremonyContinuePayRP", "cumulateRP", "cumulate2RP", "consumeRP", "ceremonyGeocachingGetedRP", "ceremonyExchangeRP"];
            // this._tab[ActionOpenId.TreesSpring] = ["cumulate3RP"];
            // this._tab[ActionOpenId.MissionPartyEnter] = ["MissionPartyRP"];
            this._tab[ActionOpenId.consumeReward] = ["consumeRP"];
            this._tab[ActionOpenId.investReward] = ["investLoginRP", "investRecruitRP", "investGrowthRP"];
            this._tab[ActionOpenId.sprintRank] = ["sprintRankXianQiRP", "sprintRankLingChongRP", "sprintRankShenBingRP", "sprintRankXianYiRP"
                , "sprintRankFaBaoRP", "sprintRankEquipmentRP", "sprintRankFighitingRP", "sprintRankRP"];
            this._tab[ActionOpenId.gushen] = ["guShenRP", "gushengrade1RP", "gushengrade2RP", "gushengrade3RP",
                "gushengrade4RP", "gushengrade5RP"];
            this._tab[ActionOpenId.kuanghuan] = ["kuangHuanRP", "kuangHuanLevelRP", "kuangHuanPowarRP"];
            this._tab[ActionOpenId.cumulatePay2] = ["cumulate2RP"];
            // this._tab[ActionOpenId.soaringActivityEnter] = ["soaringPanicBuyingGifRP", "soaringSpecialGiftRP"];
            this._tab[ActionOpenId.halfMonth] = ["halfMonthGiftRP"];
            this._tab[ActionOpenId.activity] = ["loginRewardRP", "cumulatePayShenHunRP", "cumulatePayTianZhuRP", "everyDayRebateRP", "payRankRP"];
            this._tab[ActionOpenId.zhuanPanEnter] = ["rotaryTableSoaringRP", "payRewardRP", "rotaryTableJiuZhouRP"];
            this._tab[ActionOpenId.weekRevelry] = ["weekLoginRP", "weekSinglePayRP", "weekRepeatPayRP", "weekConsumeRP"];
            this._tab[ActionOpenId.feedBack] = ["feedBackRP"];
            this._tab[ActionOpenId.invitationEnter] = ["invitationRP"];
            this._tab[ActionOpenId.realName] = ["realNameRP"];
            this._tab[ActionOpenId.officialAccount] = ["officialAccountRP"];
            this._tab[ActionOpenId.xianYuEnter] = ["zxianYuBagPanelRP", "zxianYuPanelRP", "zxianYuStorePanelRP", "zxianYuTreasurePanelRP"];
            this._tab[ActionOpenId.equipSuit] = ["equipSuitRP_0", "equipSuitRP_1", "equipSuitRP_2", "equipSuitRP_3", "equipSuitRP_4", "equipSuitRP_5", "equipSuitRP_6", "equipSuitRP_7", "equipSuitRP_8", "equipSuitRP_9", "equipSuitRP_10", "equipSuitRP_11", "equipSuitRP_12", "equipSuitRP_13", "equipSuitRP_14"];
            this._tab[ActionOpenId.theCarnivalEnter] = ["theCarnivalRP"];
            this._tab[ActionOpenId.superVip] = ["theSuperVipRP"];
            this._tab[ActionOpenId.everyday_firstpay] = ["everydayFirstPayRP"];
            this._tab[ActionOpenId.customTitle] = ["customTitleRP"];
            this._tab[ActionOpenId.jiuxiaoling] = ["JiuXiaoLingAwardRP", "JiuXiaoLingTaskRP", "JiuXiaoLingExtralExpRP"];
        }


        public getRps(funcId: number): Array<keyof ui.LTIocnRP> {
            return this._tab[funcId];
        }
    }
}
