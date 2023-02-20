namespace modules.first_pay {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetFirstPayInfoReply = Protocols.GetFirstPayInfoReply;
    import UpdateFirstPayInfo = Protocols.UpdateFirstPayInfo;
    import UpdateFirstPayShow = Protocols.UpdateFirstPayShow;
    import GetFirstPayRewardReply = Protocols.GetFirstPayRewardReply;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UpdateFirstPayShowFields = Protocols.UpdateFirstPayShowFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GetFirstPayRewardReplyFields = Protocols.GetFirstPayRewardReplyFields;

    export class FirstPayCtrl extends BaseCtrl {
        private static _instance: FirstPayCtrl;
        public static get instance(): FirstPayCtrl {
            return this._instance = this._instance || new FirstPayCtrl();
        }

        private _showIds: number[];
        private _isAlert: boolean;

        constructor() {
            super();
            this._showIds = [];
            this._isAlert = true;
        }

        public setup(): void {

            //更新信息返回
            Channel.instance.subscribe(SystemClientOpcode.GetFirstPayInfoReply, this, this.getFirstPayInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateFirstPayInfo, this, this.updateFirstPayInfo);
            //获取外观返回
            Channel.instance.subscribe(SystemClientOpcode.UpdateFirstPayShow, this, this.updateFirstPayShow);
            //获取奖励返回
            Channel.instance.subscribe(SystemClientOpcode.GetFirstPayRewardReply, this, this.getFirstPayRewardReply);

            GlobalData.dispatcher.on(CommonEventType.PANEL_CLOSE, this, this.openAlert);
            this.requsetAllData()
        }
        public requsetAllData() {
            Channel.instance.publish(UserFeatureOpcode.GetFirstPayInfo, null);
        }

        //信息返回
        private getFirstPayInfoReply(tuple: GetFirstPayInfoReply): void {
            FirstPayModel.instance.updateInfo(tuple);
        }

        //更新消息
        private updateFirstPayInfo(tuple: UpdateFirstPayInfo): void {
            FirstPayModel.instance.updateInfo(tuple);
        }

        //获取外观
        private updateFirstPayShow(tuple: UpdateFirstPayShow): void {
            if (this._isAlert) {
                WindowManager.instance.open(WindowEnum.HUANHUAACT_ALERT, [tuple[UpdateFirstPayShowFields.showId], -1]);
                this._isAlert = false;
            }
            this._showIds.push(tuple[UpdateFirstPayShowFields.showId]);
        }

        private openAlert(dialogId: WindowEnum): void {
            if (dialogId !== WindowEnum.HUANHUAACT_ALERT) return;
            this._showIds.shift();
            if (this._showIds.length) {
                WindowManager.instance.open(WindowEnum.HUANHUAACT_ALERT, [this._showIds[0], -1]);
            }
        }

        //获取奖励返回
        private getFirstPayRewardReply(tuple: GetFirstPayRewardReply): void {
            console.log("client 接收数据 = ", tuple, " 消息号：0x", SystemClientOpcode.GetFirstPayRewardReply.toString(16))
            if (!tuple[GetFirstPayRewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("领取成功");
                GlobalData.dispatcher.event(CommonEventType.FIRST_PAY_UPDATE_GETED_STATUS);

                // 赠送头像的时候判断新头像红点
                modules.rename.RenameModel.instance.setCanActiveRP();
            }
        }

        public getFirstPayReward(id: number): void {
            console.info("client 发送 = ", [id], " 消息号：0x", (UserFeatureOpcode.GetFirstPayReward as Number).toString(16));
            Channel.instance.publish(UserFeatureOpcode.GetFirstPayReward, [id]);
        }
    }
}