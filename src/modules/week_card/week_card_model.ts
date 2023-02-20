namespace modules.weekCard {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import WeekFuliCardPrivilege1Fields = Protocols.WeekFuliCardPrivilege1Fields;

    export class WeekCardModel {
        private static _instance: WeekCardModel;
        public static get instance(): WeekCardModel {
            return this._instance = this._instance || new WeekCardModel();
        }

        public WeekCardInfoReply: Protocols.GetWeekFuliCardInfoReply;
        public WeekCardRewardReply: Protocols.GetWeekFuliCardRewardReply;
        public flag: number;
        public isgold: boolean = false;

        public getWeekCardInfoReply(tuple: Protocols.GetWeekFuliCardInfoReply): void {
            this.WeekCardInfoReply = tuple;
            let purchasedInfo = tuple[Protocols.GetWeekFuliCardInfoReplyFields.privilege1];
            this.isHavegold(purchasedInfo[WeekFuliCardPrivilege1Fields.state]);
            this.flag = tuple[Protocols.GetWeekFuliCardInfoReplyFields.flag];
            //console.log('weecard--', tuple[Protocols.GetWeekFuliCardInfoReplyFields.privilege1], tuple);


            // if (this.WeekCardInfoReply && this.flag == 1) {
            //     this.isHavegold(tuple[Protocols.GetWeekFuliCardInfoReplyFields.privilege1][WeekFuliCardPrivilege1Fields.state]);
            // }
            GlobalData.dispatcher.event(CommonEventType.GET_WEEK_FULI_CARD_INFO_REPLY);
        }

        public getWeekCardRewardReply(tuple: Protocols.GetWeekFuliCardRewardReply): void {
            this.WeekCardRewardReply = tuple;
            GlobalData.dispatcher.event(CommonEventType.GET_WEEK_FULI_CARD_REWARD_REPLY);
        }


        private isHavegold(state: number): void {
            this.isgold = false;
            if (state == 1 && this.flag == 1) {
                this.isgold = true;
            } else {
                this.isgold = false;
            }
            RedPointCtrl.instance.setRPProperty("weekCardRP", this.isgold);
        }
    }
}