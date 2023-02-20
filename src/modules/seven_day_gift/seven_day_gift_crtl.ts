/** 七日礼控制器*/


namespace modules.sevenDayGift {

    import BaseCtrl = modules.core.BaseCtrl;
    import Channel = net.Channel;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GetSevenDayReply = Protocols.GetSevenDayReply;
    import UpdateSevenDay = Protocols.UpdateSevenDay;
    import GetSevenDayAwardReply = Protocols.GetSevenDayAwardReply;
    import GetSevenDayAwardReplyFields = Protocols.GetSevenDayAwardReplyFields;

    export class SevenDayGiftCtrl extends BaseCtrl {
        private static _instance: SevenDayGiftCtrl;

        public static get instance(): SevenDayGiftCtrl {
            return this._instance = this._instance || new SevenDayGiftCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {

            Channel.instance.subscribe(SystemClientOpcode.GetSevenDayReply, this, this.getSevenDayReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateSevenDay, this, this.updateSevenDay);
            Channel.instance.subscribe(SystemClientOpcode.GetSevenDayAwardReply, this, this.getSevenDayAwardReply);

            this.requsetAllData();
        }
        public requsetAllData() {
            this.getSevenDay();
            FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.sevenDay, UserFeatureOpcode.GetSevenDay);
        }

        // 获取七日礼信息
        public getSevenDay(): void {
            Channel.instance.publish(UserFeatureOpcode.GetSevenDay, null);
        }

        // 获取七日礼信息返回
        public getSevenDayReply(value: GetSevenDayReply): void {
            SevenDayGiftModel.instance.sevenDayInfo = value;
        }

        //更新七日礼
        private updateSevenDay(tuple: UpdateSevenDay) {
            SevenDayGiftModel.instance.sevenDayInfo = tuple;
        }

        // 领取七日礼奖励
        public getSevenDayAward(day: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetSevenDayAward, [day]);
        }

        // 领取七日礼奖励返回
        private getSevenDayAwardReply(value: GetSevenDayAwardReply) {
            let code: number = value[GetSevenDayAwardReplyFields.result];
            if (code === 0)
                SystemNoticeManager.instance.addNotice("领取成功");
            else
                CommonUtil.noticeError(code);
        }
    }
}