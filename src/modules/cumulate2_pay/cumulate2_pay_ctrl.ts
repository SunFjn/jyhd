//每日累充
namespace modules.cumulate2_pay {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GetCumulatepay2InfoReply = Protocols.GetCumulatepay2InfoReply;
    import UpdateCumulatepay2Info = Protocols.UpdateCumulatepay2Info;
    import GetCumulatepay2Reward = Protocols.GetCumulatepay2Reward;
    import GetCumulatepay2RewardReplyFields = Protocols.GetCumulatepay2RewardReplyFields;
    import GetCumulatepay2RewardReply = Protocols.GetCumulatepay2RewardReply;

    export class Cumulate2PayCtrl extends BaseCtrl {
        private static _instance: Cumulate2PayCtrl;
        public static get instance(): Cumulate2PayCtrl {
            return this._instance = this._instance || new Cumulate2PayCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetCumulatepay2InfoReply, this, this.getCumulatepay2InfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateCumulatepay2Info, this, this.updateCumulatepay2Info);
            Channel.instance.subscribe(SystemClientOpcode.GetCumulatepay2RewardReply, this, this.getCumulatepay2RewardReply);

            this.requsetAllData();
        }
        public requsetAllData() {
            Channel.instance.publish(UserFeatureOpcode.GetCumulatepay2Info, null);
        }

        constructor() {
            super();

        }

        //累充豪礼信息返回
        private getCumulatepay2InfoReply(tuple: GetCumulatepay2InfoReply) {
            //console.log("------------------------getCumulatepay2InfoReply",tuple)
            CumulatePay2Model.instance.updateInfo(tuple);
        }

        //更新信息
        private updateCumulatepay2Info(tuple: UpdateCumulatepay2Info) {
            //console.log("------------------------updateCumulatepay2Info",tuple)
            CumulatePay2Model.instance.updateInfo(tuple);
        }

        //获取奖励返回
        private getCumulatepay2RewardReply(tuple: GetCumulatepay2RewardReply) {
            //console.log("------------------------getCumulatepay2RewardReply",tuple)
            if (!tuple[GetCumulatepay2RewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("领取成功");
            }
        }

        //领取奖励
        public getCumulatepay2Reward(tuple: GetCumulatepay2Reward): void {
            //console.log("------------------------getCumulatepay2Reward",tuple)
            Channel.instance.publish(UserFeatureOpcode.GetCumulatepay2Reward, tuple);
        }

        //获取数据
        public getCumulatepay2Info(): void {
            //console.log("------------------------getCumulatepay2Info")
            Channel.instance.publish(UserFeatureOpcode.GetCumulatepay2Info, null);
        }
    }
}