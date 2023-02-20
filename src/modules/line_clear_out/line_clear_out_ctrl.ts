namespace modules.lineClearOut {
    import BaseCtrl = modules.core.BaseCtrl;
    import OneKeySweepingReply = Protocols.OneKeySweepingReply;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetSweepingStateReply = Protocols.GetSweepingStateReply;
    import BuysweepingtimesReply = Protocols.BuysweepingtimesReply;
    import BuysweepingtimesReplyFields = Protocols.BuysweepingtimesReplyFields;
    import SystemNoticeManager = notice.SystemNoticeManager;
    import OneKeySweepingReplyFields = Protocols.OneKeySweepingReplyFields;
    import UpdateSweepingBaseInfo = Protocols.UpdateSweepingBaseInfo;
    import CommonUtil = modules.common.CommonUtil;

    export class LineClearOutCtrl extends BaseCtrl {
        private static _instance: LineClearOutCtrl;
        public static get instance(): LineClearOutCtrl {
            return this._instance = this._instance || new LineClearOutCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.OneKeySweepingReply, this, this.oneKeySweepingReply);
            Channel.instance.subscribe(SystemClientOpcode.GetSweepingBaseInfoReply, this, this.updateSweepingBaseInfo);
            Channel.instance.subscribe(SystemClientOpcode.UpdateSweepingBaseInfo, this, this.updateSweepingBaseInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetSweepingStateReply, this, this.getSweepingStateReply);
            Channel.instance.subscribe(SystemClientOpcode.BuysweepingtimesReply, this, this.buySweepingtimesReply);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.sweepingEnter, UserFeatureOpcode.GetSweepingBaseInfo);
            this.getSweepingBaseInfo();
        }

        public getSweepingBaseInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetSweepingBaseInfo, null);
        }

        private getSweepingStateReply(tuple1: GetSweepingStateReply): void {
            LineClearOutModel.instance.getSweepingStateReply(tuple1);
        }

        private updateSweepingBaseInfo(tuple: UpdateSweepingBaseInfo): void {
            LineClearOutModel.instance.updateSweepingBaseInfo(tuple);
        }

        private oneKeySweepingReply(tuple: OneKeySweepingReply): void {
            if (tuple[OneKeySweepingReplyFields.result] == 0) {
                SystemNoticeManager.instance.addNotice("扫荡成功");
            } else {

                if (tuple[OneKeySweepingReplyFields.result] == 12107) {
                    CommonUtil.goldNotEnoughAlert();
                } else {
                    CommonUtil.noticeError(tuple[OneKeySweepingReplyFields.result]);
                }
            }
        }

        private buySweepingtimesReply(tuple: BuysweepingtimesReply): void {
            if (tuple[BuysweepingtimesReplyFields.result] == 0) {
                SystemNoticeManager.instance.addNotice("购买成功");
            } else {
                if (tuple[BuysweepingtimesReplyFields.result] == 12012) {
                    CommonUtil.goldNotEnoughAlert();
                    
                } else {
                    CommonUtil.noticeError(tuple[BuysweepingtimesReplyFields.result]);
                }

            }
        }

        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
            WindowManager.instance.close(WindowEnum.VIP_TIMES_ALERT);
            WindowManager.instance.close(WindowEnum.LINE_CLEAR_OUT_ALERT);
        }
    }
}