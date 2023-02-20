namespace modules.weekYuanbao {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class WeekYuanbaoCtrl extends BaseCtrl {
        private static _instance: WeekYuanbaoCtrl;
        public static get instance(): WeekYuanbaoCtrl {
            return this._instance = this._instance || new WeekYuanbaoCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetWeekYuanbaoCardInfoReply, this, this.getWeekCardInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetWeekYuanbaoCardRewardReply, this, this.getWeekYuanbaoCardRewardReply);
            //Channel.instance.subscribe(SystemClientOpcode.UpdateMonthCardInfo, this, this.updateWeekCardInfo);
            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetWeekYuanbaoCardInfo, null);
        }

        private getWeekCardInfoReply(tuple: Protocols.GetWeekYuanbaoCardInfoReply): void {
            WeekYuanbaoModel.instance.getWeekCardInfoReply(tuple);

        }

        private getWeekYuanbaoCardRewardReply(tuple: Protocols.GetWeekYuanbaoCardRewardReply): void {
            WeekYuanbaoModel.instance.getWeekYuanbaoCardRewardReply(tuple);
        }

        // private updateWeekCardInfo(tuple: Protocols.GetWeekYuanbaoCardInfoReply): void {
        //     WeekYuanbaoModel.instance.updateWeekCardInfo(tuple);

        // }

        // 请求领取奖励
        public getWeekYuanbaoCardReward(): void {
            Channel.instance.publish(UserFeatureOpcode.GetWeekYuanbaoCardReward, null);
        }
    }
}