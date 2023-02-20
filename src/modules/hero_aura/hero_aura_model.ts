namespace modules.heroAura {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class HeroAuraModel {
        private static _instance: HeroAuraModel;
        public static get instance(): HeroAuraModel {
            return this._instance = this._instance || new HeroAuraModel();
        }

        public HeroAuraInfoReply: Protocols.GetHeroAuraInfoReply;
        public HeroAuraRewardReply: Protocols.GetHeroAuraRewardReply;
        public flag: number = 0;
        public mergeFbCount:number = 0;
        public isgold: boolean = false;

        public getHeroAuraInfoReply(tuple: Protocols.GetHeroAuraInfoReply): void {
            this.HeroAuraInfoReply = tuple;

            this.flag = tuple[Protocols.GetHeroAuraInfoReplyFields.isOpen];
            this.mergeFbCount = tuple[Protocols.GetHeroAuraInfoReplyFields.mergeFbCount];
            this.isHavegold(tuple[Protocols.GetHeroAuraInfoReplyFields.dayAwd]);
            GlobalData.dispatcher.event(CommonEventType.GET_HERO_AURA_INFO_REPLY);
        }

        public getHeroAuraRewardReply(tuple: Protocols.GetHeroAuraRewardReply): void {
            this.HeroAuraRewardReply = tuple;
            GlobalData.dispatcher.event(CommonEventType.GET_HERO_AURA_REWARD_REPLY);
        }

        // public updateHeroAuraInfo(tuple: Protocols.GetHeroAuraInfoReply): void {
        //     this.HeroAuraInfoReply = tuple;
        //     this.flag = tuple[Protocols.UpdateMonthCardInfoFields.flag];
        //     this.isHavegold(tuple[Protocols.UpdateMonthCardInfoFields.rewardList]);
        //     GlobalData.dispatcher.event(CommonEventType.UPDATE_MONTH_CARD_INFO);
        // }

        private isHavegold(isReward: number): void {
            this.isgold = false;
            if (!isReward) {
                this.isgold = false;
            } else {
                if (isReward == 1) {
                    this.isgold = true;
                } else {
                    this.isgold = false;
                }
            }
            RedPointCtrl.instance.setRPProperty("heroAuraRP", false);
        }


    }
}