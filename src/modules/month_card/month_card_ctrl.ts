namespace modules.monthCard {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class MonthCardCtrl extends BaseCtrl {
        private static _instance: MonthCardCtrl;
        public static get instance(): MonthCardCtrl {
            return this._instance = this._instance || new MonthCardCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetMonthCardInfoReply, this, this.getMouthCardInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetMonthCardRewardReply, this, this.getMouthCardRewardReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateMonthCardInfo, this, this.updateMonthCardInfo);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetMonthCardInfo, null);
        }

        private getMouthCardInfoReply(tuple: Protocols.GetMonthCardInfoReply): void {
            MonthCardModel.instance.getMonthCardInfoReply(tuple);

        }

        private getMouthCardRewardReply(tuple: Protocols.GetMonthCardRewardReply): void {
            MonthCardModel.instance.getMonthCardRewardReply(tuple);
        }

        private updateMonthCardInfo(tuple: Protocols.UpdateMonthCardInfo): void {
            MonthCardModel.instance.updateMonthCardInfo(tuple);

        }

        // 请求领取奖励
        public getMonthCardReward(day: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetMonthCardReward, [day]);
        }

    }
}