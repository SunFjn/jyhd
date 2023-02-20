/** 半月礼控制器*/




namespace modules.halfMonthGift {

    import BaseCtrl = modules.core.BaseCtrl;
    import Channel = net.Channel;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GetHalfMonthInfoReply = Protocols.GetHalfMonthInfoReply;
    import UpdateHalfMonthInfo = Protocols.UpdateHalfMonthInfo;
    import GetHalfMonthRewardReply = Protocols.GetHalfMonthRewardReply;
    import GetHalfMonthRewardReplyFields = Protocols.GetHalfMonthRewardReplyFields;

    export class HalfMonthGiftCtrl extends BaseCtrl {
        private static _instance: HalfMonthGiftCtrl;

        public static get instance(): HalfMonthGiftCtrl {
            return this._instance = this._instance || new HalfMonthGiftCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetHalfMonthInfoReply, this, this.getHalfMonthInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateHalfMonthInfo, this, this.updateHalfMonthInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetHalfMonthRewardReply, this, this.getHalfMonthRewardReply);

            this.requsetAllData();
        }
        public requsetAllData() {
            this.getHalfMonthInfo();
            FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.halfMonth, UserFeatureOpcode.GetHalfMonthInfo);
        }

        // 获取半月礼信息
        private getHalfMonthInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetHalfMonthInfo, null);
        }

        // 获取半月礼信息返回
        private getHalfMonthInfoReply(value: GetHalfMonthInfoReply): void {
            HalfMonthGiftModel.instance.halfMonthInfo = value;
        }

        //更新半月礼
        private updateHalfMonthInfo(value: UpdateHalfMonthInfo) {
            HalfMonthGiftModel.instance.halfMonthInfo = value;
        }

        // 领取半月礼奖励
        public getHalfMonthReward(day: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetHalfMonthReward, [day]);
        }

        // 领取半月礼奖励返回
        private getHalfMonthRewardReply(value: GetHalfMonthRewardReply): void {
            let result: number = value[GetHalfMonthRewardReplyFields.result];
            if (result === 0) {
                SystemNoticeManager.instance.addNotice("领取成功");
            } else {
                CommonUtil.noticeError(result);
            }
        }
    }
}