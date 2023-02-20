/////<reference path="../$.ts"/>
/**
 * 单笔充值（返炽星魔锤）
 */
namespace modules.cumulatePay_shenHun {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class CumulatePayShenHunCtrl extends BaseCtrl {
        private static _instance: CumulatePayShenHunCtrl;
        public static get instance(): CumulatePayShenHunCtrl {
            return this._instance = this._instance || new CumulatePayShenHunCtrl();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetSinglePayJadeReply, this, this.getCumulatepayFSInfoReply);
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
                if (element == ActionOpenId.singlePayJade) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.singlePayJade)) {
                        CumulatePayShenHunModel.instance.setActionOpen();
                        CumulatePayShenHunModel.instance.setRP();
                        return;
                    }
                }
            }
        }

        public GetSinglePayJade(): void {
            // console.log(" 单笔充值（返炽星魔锤） 获取数据 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.GetSinglePayJade, null);
        }

        public GetSinglePayJadeAward(id: number): void {
            // console.log(" 单笔充值（返炽星魔锤） 领取奖励 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.GetSinglePayJadeAward, [id]);
        }

        private getCumulatepayFSInfoReply(tuple: Protocols.GetSinglePayJadeReply): void {
            // console.log(" 单笔充值（返炽星魔锤） 返回数据...............:   ", tuple);
            CumulatePayShenHunModel.instance.getInfo(tuple);
        }

        private getCumulatepayFSRewardReply(tuple: Protocols.GetSinglePayJadeAwardReply): void {
            // console.log("单笔充值（返炽星魔锤） 领取返回...............:   ", tuple);
            if (tuple[Protocols.GetSinglePayJadeAwardReplyFields.result] == 0) {
                SystemNoticeManager.instance.addNotice("领取成功", false);
            } else {
                CommonUtil.noticeError(tuple[Protocols.GetSinglePayJadeAwardReplyFields.result]);
            }
        }
    }
}
