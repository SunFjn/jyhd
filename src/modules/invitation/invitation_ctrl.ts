/////<reference path="../$.ts"/>
namespace modules.invitation {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import BuyRushBuyFSReplyFields = Protocols.BuyRushBuyFSReplyFields;

    export class InvitationCtrl extends BaseCtrl {
        private static _instance: InvitationCtrl;
        public static get instance(): InvitationCtrl {
            return this._instance = this._instance || new InvitationCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetInviteGiftReply, this, this.GetInviteGiftReply);
            Channel.instance.subscribe(SystemClientOpcode.DrawInviteGiftReply, this, this.DrawInviteGiftReply);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);
            this.requsetAllData();
        }
        public requsetAllData() {
            this.GetInviteGift();
        }
        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.invitationEnter) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.invitationEnter)) {
                        InvitationModel.instance.setRP();
                        return;
                    }
                }
            }
        }

        /**
         *获取邀请有礼 请求
         */
        public GetInviteGift(): void {
            // console.log(" 获取邀请有礼 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.GetInviteGift, null);
        }
        public callBask(status: int, params: any) {
            if (status === 0) {
                InvitationCtrl.instance.InviteFriend();
            }
            else {
                SystemNoticeManager.instance.addNotice("分享失败", true);
            }
        }
        /**
        *提取邀请有礼 请求
        */
        public DrawInviteGift(): void {
            // console.log(" 获取邀请有礼 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.DrawInviteGift, null);

        }
        //邀请好友
        public InviteFriend(): void {
            // console.log(" 获取邀请有礼 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.InviteFriend, null);
        }
        private GetInviteGiftReply(tuple: Protocols.GetInviteGiftReply): void {
            // console.log("获取邀请有礼 返回数据...............:   ", tuple);
            InvitationModel.instance.getInfo(tuple);
        }

        private DrawInviteGiftReply(tuple: Protocols.DrawInviteGiftReply): void {
            // console.log("提取邀请有礼返回...............:   ", tuple);
            if (tuple[Protocols.DrawInviteGiftReplyFields.result] == 0) {
                SystemNoticeManager.instance.addNotice("领取成功", false);
            } else {
                CommonUtil.noticeError(tuple[Protocols.DrawInviteGiftReplyFields.result]);
            }
        }
    }
}
