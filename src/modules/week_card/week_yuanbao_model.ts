namespace modules.weekYuanbao {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class WeekYuanbaoModel {
        private static _instance: WeekYuanbaoModel;
        public static get instance(): WeekYuanbaoModel {
            return this._instance = this._instance || new WeekYuanbaoModel();
        }

        public WeekCardInfoReply: Protocols.GetWeekYuanbaoCardInfoReply;
        public WeekCardRewardReply: Protocols.GetWeekYuanbaoCardRewardReply;
        public flag: number;
        public isgold: boolean = false;

        public getWeekCardInfoReply(tuple: Protocols.GetWeekYuanbaoCardInfoReply): void {
            this.WeekCardInfoReply = tuple;

            this.flag = tuple[Protocols.GetWeekYuanbaoCardInfoReplyFields.flag];
            this.isHavegold(tuple[Protocols.GetWeekYuanbaoCardInfoReplyFields.isDayAward]);
            GlobalData.dispatcher.event(CommonEventType.GET_WEEK_YUANBAO_CARD_INFO_REPLY);
        }

        public getWeekYuanbaoCardRewardReply(tuple: Protocols.GetWeekYuanbaoCardRewardReply): void {
            this.WeekCardRewardReply = tuple;
            GlobalData.dispatcher.event(CommonEventType.GET_WEEK_YUANBAO_CARD_REWARD_REPLY);
        }

        // public updateWeekCardInfo(tuple: Protocols.GetWeekYuanbaoCardInfoReply): void {
        //     this.WeekCardInfoReply = tuple;
        //     this.flag = tuple[Protocols.UpdateMonthCardInfoFields.flag];
        //     this.isHavegold(tuple[Protocols.UpdateMonthCardInfoFields.rewardList]);
        //     GlobalData.dispatcher.event(CommonEventType.UPDATE_MONTH_CARD_INFO);
        // }

        private isHavegold(isReward: number): void {
            this.isgold = false;
            if (isReward == 1 && this.flag == 1) {
                this.isgold = true;
            } else {
                this.isgold = false;
            }
            RedPointCtrl.instance.setRPProperty("weekYuanbaoRP", this.isgold);
        }
    }
}