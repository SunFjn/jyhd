namespace modules.heroAura {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class HeroAuraCtrl extends BaseCtrl {
        private static _instance: HeroAuraCtrl;
        public static get instance(): HeroAuraCtrl {
            return this._instance = this._instance || new HeroAuraCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetHeroAuraInfoReply, this, this.getHeroAuraInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetHeroAuraRewardReply, this, this.getHeroAuraRewardReply);
            //Channel.instance.subscribe(SystemClientOpcode.UpdateMonthCardInfo, this, this.updateHeroAuraInfo);

           this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetHeroAuraInfo, null);
        }

        private getHeroAuraInfoReply(tuple: Protocols.GetHeroAuraInfoReply): void {
            HeroAuraModel.instance.getHeroAuraInfoReply(tuple);

        }

        private getHeroAuraRewardReply(tuple: Protocols.GetHeroAuraRewardReply): void {
            HeroAuraModel.instance.getHeroAuraRewardReply(tuple);
        }

        // private updateHeroAuraInfo(tuple: Protocols.GetHeroAuraInfoReply): void {
        //     HeroAuraModel.instance.updateHeroAuraInfo(tuple);

        // }

        // 请求领取奖励
        public getHeroAuraReward(): void {
            Channel.instance.publish(UserFeatureOpcode.GetHeroAuraReward, null);
        }
    }
}