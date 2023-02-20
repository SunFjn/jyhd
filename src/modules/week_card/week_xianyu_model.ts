namespace modules.weekXianyu {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class WeekXianyuModel {
        private static _instance: WeekXianyuModel;
        public static get instance(): WeekXianyuModel {
            return this._instance = this._instance || new WeekXianyuModel();
        }

        public WeekCardInfoReply: Protocols.GetWeekXianyuCardInfoReply;
        public WeekCardRewardReply: Protocols.GetWeekXianyuCardRewardReply;
        public flag: number;
        public isgold: boolean = false;

        public getWeekCardInfoReply(tuple: Protocols.GetWeekXianyuCardInfoReply): void {
            this.WeekCardInfoReply = tuple;

            this.flag = tuple[Protocols.GetWeekXianyuCardInfoReplyFields.flag];
            this.isHavegold(tuple[Protocols.GetWeekXianyuCardInfoReplyFields.isDayAward]);
            GlobalData.dispatcher.event(CommonEventType.GET_WEEK_XIANYU_CARD_INFO_REPLY);
        }

        public getWeekXianyuCardRewardReply(tuple: Protocols.GetWeekXianyuCardRewardReply): void {
            this.WeekCardRewardReply = tuple;
            GlobalData.dispatcher.event(CommonEventType.GET_WEEK_XIANYU_CARD_REWARD_REPLY);
        }

        // public updateWeekCardInfo(tuple: Protocols.GetWeekXianyuCardInfoReply): void {
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
            RedPointCtrl.instance.setRPProperty("weekXianyuRP", this.isgold);
        }
    }
}