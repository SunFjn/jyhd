/////<reference path="../$.ts"/>
/**
 * 累计充值（封神榜）
 */
namespace modules.soaring_cumulatePay {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import GetCumulatepayFSRewardReplyFields = Protocols.GetCumulatepayFSRewardReplyFields;

    export class SoaringCumulatePayCtrl extends BaseCtrl {
        private static _instance: SoaringCumulatePayCtrl;
        public static get instance(): SoaringCumulatePayCtrl {
            return this._instance = this._instance || new SoaringCumulatePayCtrl();
        }

        private constructor() {
            super();

        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetCumulatepayFSInfoReply, this, this.getCumulatepayFSInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateCumulatepayFSInfo, this, this.updateCumulatepayFSInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetCumulatepayFSRewardReply, this, this.getCumulatepayFSRewardReply);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);
            this.requsetAllData();
        }
        public requsetAllData() {
            this.getCumulatepayFSInfo();
        }
        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.cumulatePayFS) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.cumulatePayFS)) {
                        SoaringCumulatePayModel.instance.setRP();
                        return;
                    }
                }
            }
        }

        /**
         *领取奖励 请求
         */
        public getCumulatepayFSReward(id: number): void {
            // console.log(" 累计充值（封神榜） 领取奖励 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.GetCumulatepayFSReward, [id]);
        }

        /**
         *获取数据 请求
         */
        public getCumulatepayFSInfo(): void {
            // console.log(" 累计充值（封神榜） 获取数据 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.GetCumulatepayFSInfo, null);
        }

        private getCumulatepayFSInfoReply(tuple: Protocols.GetCumulatepayFSInfoReply): void {
            // console.log(" 累计充值（封神榜） 返回数据...............:   ", tuple);
            SoaringCumulatePayModel.instance.getInfo(tuple);
        }

        private updateCumulatepayFSInfo(tuple: Protocols.UpdateCumulatepayFSInfo): void {
            // console.log(" 累计充值（封神榜） 更新数据...............:   ", tuple);
            SoaringCumulatePayModel.instance.updateInfo(tuple);
        }

        private getCumulatepayFSRewardReply(tuple: Protocols.GetCumulatepayFSRewardReply): void {
            // console.log("累计充值（封神榜） 领取返回...............:   ", tuple);
            if (tuple[GetCumulatepayFSRewardReplyFields.result] == 0) {
                SystemNoticeManager.instance.addNotice("领取成功", false);
            } else {
                CommonUtil.noticeError(tuple[GetCumulatepayFSRewardReplyFields.result]);
            }
        }
    }
}
