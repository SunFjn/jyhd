namespace modules.weekXianyu {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class WeekXianyuCtrl extends BaseCtrl {
        private static _instance: WeekXianyuCtrl;
        public static get instance(): WeekXianyuCtrl {
            return this._instance = this._instance || new WeekXianyuCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetWeekXianyuCardInfoReply, this, this.getWeekCardInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetWeekXianyuCardRewardReply, this, this.getWeekXianyuCardRewardReply);

            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetWeekXianyuCardInfo, null);    
        }

        private getWeekCardInfoReply(tuple: Protocols.GetWeekXianyuCardInfoReply): void {
            WeekXianyuModel.instance.getWeekCardInfoReply(tuple);

        }

        private getWeekXianyuCardRewardReply(tuple: Protocols.GetWeekXianyuCardRewardReply): void {
            WeekXianyuModel.instance.getWeekXianyuCardRewardReply(tuple);
        }

        // private updateWeekCardInfo(tuple: Protocols.GetWeekXianyuCardInfoReply): void {
        //     WeekXianyuModel.instance.updateWeekCardInfo(tuple);

        // }

        // 请求领取奖励
        public getWeekXianyuCardReward(): void {
            Channel.instance.publish(UserFeatureOpcode.GetWeekXianyuCardReward, null);
        }
    }
}