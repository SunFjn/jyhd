/////<reference path="../$.ts"/>
/**
 * 单笔充值 （封神榜）
 */
namespace modules.soaring_singlePay {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import GetPaySingleFSRewardReplyFields = Protocols.GetPaySingleFSRewardReplyFields;

    export class SoaringSinglePayCtrl extends BaseCtrl {
        private static _instance: SoaringSinglePayCtrl;
        public static get instance(): SoaringSinglePayCtrl {
            return this._instance = this._instance || new SoaringSinglePayCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetPaySingleFSInfoReply, this, this.GetPaySingleFSInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdatePaySingleFSInfo, this, this.UpdatePaySingleFSInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetPaySingleFSRewardReply, this, this.GetPaySingleFSRewardReply);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);
            this.requsetAllData();
        }
        public requsetAllData() {
            this.GetPaySingleFSInfo();
        }

        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.paySingleFS) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.paySingleFS)) {
                        SoaringSinglePayModel.instance.setRP();
                        return;
                    }
                }
            }
        }

        /**
         *领取奖励 请求
         */
        public GetPaySingleFSReward(id: number): void {
            // console.log(" 单笔充值 （封神榜） 领取奖励 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.GetPaySingleFSReward, [id]);
        }

        /**
         *获取数据 请求
         */
        public GetPaySingleFSInfo(): void {
            // console.log(" 单笔充值 （封神榜） 获取数据 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.GetPaySingleFSInfo, null);
        }

        private GetPaySingleFSInfoReply(tuple: Protocols.GetPaySingleFSInfoReply): void {
            // console.log(" 单笔充值 （封神榜） 返回数据...............:   ", tuple);
            SoaringSinglePayModel.instance.getInfo(tuple);
        }

        private UpdatePaySingleFSInfo(tuple: Protocols.UpdatePaySingleFSInfo): void {
            // console.log(" 单笔充值 （封神榜） 更新数据...............:   ", tuple);
            SoaringSinglePayModel.instance.updateInfo(tuple);
        }

        private GetPaySingleFSRewardReply(tuple: Protocols.GetPaySingleFSRewardReply): void {
            // console.log("单笔充值 （封神榜） 领取返回...............:   ", tuple);
            if (tuple[GetPaySingleFSRewardReplyFields.result] == 0) {
                SystemNoticeManager.instance.addNotice("领取成功", false);
            } else {
                CommonUtil.noticeError(tuple[GetPaySingleFSRewardReplyFields.result]);
            }
        }
    }
}
