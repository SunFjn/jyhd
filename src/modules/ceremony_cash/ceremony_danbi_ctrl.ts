/////<reference path="../$.ts"/>
/**
 * 庆典兑换 单笔充值
 */
namespace modules.ceremony_cash {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import Getlimit_day_singleRewardReplyFields = Protocols.Getlimit_daysingleRewardReplyFields;
    import GetCeremonyDanbiInfoReplyFields = Protocols.GetCeremonyDanbiInfoReplyFields;

    export class CeremonyDanbiCtrl extends BaseCtrl {
        private static _instance: CeremonyDanbiCtrl;
        public static get instance(): CeremonyDanbiCtrl {
            return this._instance = this._instance || new CeremonyDanbiCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            // 获取支付单信息回复
            Channel.instance.subscribe(SystemClientOpcode.GetCeremonyDanbiInfoReply, this, this.GetPaySingleFSInfoReply);
            // 获得支付单奖励回复
            Channel.instance.subscribe(SystemClientOpcode.GetCeremonyDanbiRewardReply, this, this.GetPaySingleFSRewardReply);
            // FUNC打开更新
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);
            this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.GetPaySingleFSInfo();      
        }

        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.singleRecharge) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.singleRecharge)) {
                        CeremonyDanbiModel.instance.setRP();
                        return;
                    }
                }
            }
        }

        /**
         *领取奖励 请求
         */
        public GetPaySingleFSReward(id: number): void {
            // console.log(" 单笔充值 （庆典） 领取奖励 0x2021d1 请求.:.:.:.:.:.:.:.:.:.:.:.:.:.:.:.", UserFeatureOpcode.GetCeremonyDanbiReward);
            Channel.instance.publish(UserFeatureOpcode.GetCeremonyDanbiReward, [id]);
        }

        /**
         *获取数据 请求
         */
        public GetPaySingleFSInfo(): void {
            // console.log(" 单笔充值 （庆典） 获取数据 0x2021d0 请求 .:.:.:.:.:.:.:.:.:.:.:.:.:.:.:.   ", UserFeatureOpcode.GetCeremonyDanbiInfo);
            Channel.instance.publish(UserFeatureOpcode.GetCeremonyDanbiInfo, null);
        }

        private GetPaySingleFSInfoReply(tuple: Protocols.GetCeremonyDanbiInfoReply): void {
            // console.log(" 单笔充值 （庆典） 返回数据.:.:.:.:.:.:.:.:.:.:.:.:.:.:.:.", tuple);
            // console.log('vtz:0x1002382 - tuple', SystemClientOpcode.GetCeremonyDanbiInfoReply, tuple);
            CeremonyDanbiModel.instance.getInfo(tuple);
            // if (tuple[GetCeremonyDanbiInfoReplyFields.rewardList].length > 0) {
            //     CeremonyDanbiModel.instance.updateInfo(tuple[GetCeremonyDanbiInfoReplyFields.rewardList]);
            // }
        }

        private GetPaySingleFSRewardReply(tuple: Protocols.GetCeremonyDanbiRewardReply): void {
            // console.log("单笔充值 （庆典） 领取返回.:.:.:.:.:.:.:.:.:.:.:.:.:.:.:.", tuple);
            // console.log('vtz:0x1002383 - tuple', SystemClientOpcode.GetCeremonyDanbiRewardReply, tuple);
            if (tuple[Getlimit_day_singleRewardReplyFields.result] == 0) {
                SystemNoticeManager.instance.addNotice("领取成功", false);
            } else {
                CommonUtil.noticeError(tuple[Getlimit_day_singleRewardReplyFields.result]);
            }
        }
    }
}
