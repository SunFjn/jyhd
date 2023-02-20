namespace modules.monthCard {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class MonthCardModel {
        private static _instance: MonthCardModel;
        public static get instance(): MonthCardModel {
            return this._instance = this._instance || new MonthCardModel();
        }

        public MonthCardInfoReply: Protocols.GetMonthCardInfoReply;
        public MonthCardRewardReply: Protocols.GetMonthCardRewardReply;
        public updateCardInfo: Protocols.UpdateMonthCardInfo;
        public byMonthCard: Protocols.BuyMallItemReply;
        public flag: number;
        public isgold: boolean = false;

        public getMonthCardInfoReply(tuple: Protocols.GetMonthCardInfoReply): void {
            this.MonthCardInfoReply = tuple;
            this.flag = tuple[Protocols.GetMonthCardInfoReplyFields.flag];
            this.isHavegold(tuple[Protocols.GetMonthCardInfoReplyFields.rewardList]);
            GlobalData.dispatcher.event(CommonEventType.GET_MONTH_CARD_INFO_REPLY);

        }

        public getMonthCardRewardReply(tuple: Protocols.GetMonthCardRewardReply): void {
            this.MonthCardRewardReply = tuple;
            GlobalData.dispatcher.event(CommonEventType.GET_MONTH_CARD_REWARD_REPLY);
        }

        public updateMonthCardInfo(tuple: Protocols.UpdateMonthCardInfo): void {
            this.MonthCardInfoReply = tuple;
            this.flag = tuple[Protocols.UpdateMonthCardInfoFields.flag];
            this.isHavegold(tuple[Protocols.UpdateMonthCardInfoFields.rewardList]);
            GlobalData.dispatcher.event(CommonEventType.UPDATE_MONTH_CARD_INFO);
        }

        private isHavegold(arr: Array<number>): void {
            this.isgold = false;
            if (arr == null) {
                this.isgold = false;
            } else {
                for (let i: number = 0, len = arr.length; i < len; i++) {
                    if (arr[i] == 1) {
                        this.isgold = true;
                        break;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("monthCardRP", this.isgold);
        }


    }
}