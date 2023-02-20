/////<reference path="../$.ts"/>
/**
 * 单笔充值（返神兽）
 */
namespace modules.cumulatePay_tianZhu {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class CumulatePayTianZhuCtrl extends BaseCtrl {
        private static _instance: CumulatePayTianZhuCtrl;
        public static get instance(): CumulatePayTianZhuCtrl {
            return this._instance = this._instance || new CumulatePayTianZhuCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetSinglePayPrintReply, this, this.getCumulatepayFSInfoReply);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);
            this.requsetAllData();
        }

        public requsetAllData() {
            this.GetSinglePayJade();
        }

        // singlePayJade = 196,     //单笔充值返魂玉
        // singlePayPrint = 197,    //单笔充值返圣印
        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.singlePayPrint) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.singlePayPrint)) {
                        CumulatePayTianZhuModel.instance.setActionOpen();
                        CumulatePayTianZhuModel.instance.setRP();
                        return;
                    }
                }
            }
        }

        public GetSinglePayJade(): void {
            // console.log(" 单笔充值（返神兽） 获取数据 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.GetSinglePayPrint, null);
        }

        public GetSinglePayJadeAward(id: number): void {
            // console.log(" 单笔充值（返神兽） 领取奖励 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.GetSinglePayPrintAward, [id]);
        }

        private getCumulatepayFSInfoReply(tuple: Protocols.GetSinglePayPrintReply): void {
            // console.log(" 单笔充值（返神兽） 返回数据...............:   ", tuple);
            CumulatePayTianZhuModel.instance.getInfo(tuple);
        }

        private getCumulatepayFSRewardReply(tuple: Protocols.GetSinglePayPrintAwardReply): void {
            // console.log("单笔充值（返神兽） 领取返回...............:   ", tuple);
            if (tuple[Protocols.GetSinglePayPrintAwardReplyFields.result] == 0) {
                SystemNoticeManager.instance.addNotice("领取成功", false);
            } else {
                CommonUtil.noticeError(tuple[Protocols.GetSinglePayPrintAwardReplyFields.result]);
            }
        }
    }
}
