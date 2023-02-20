///<reference path="../main/main_ctrl.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
///<reference path="../zerobuy/zero_buy_model.ts"/>
namespace modules.announcement {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetNoticeReply = Protocols.GetNoticeReply;
    import GetNoticeReplyFields = Protocols.GetNoticeReplyFields;
    import ExchangeCdkeyReply = Protocols.ExchangeCdkeyReply;
    import ExchangeCdkeyReplyFields = Protocols.ExchangeCdkeyReplyFields;
    import UpdateFashionInfo = Protocols.UpdateFashionInfo;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class AnnouncementCtrl extends BaseCtrl {
        private static _instance: AnnouncementCtrl;
        public static get instance(): AnnouncementCtrl {
            return this._instance = this._instance || new AnnouncementCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetNoticeReply, this, this.GetNoticeReply);
            Channel.instance.subscribe(SystemClientOpcode.ExchangeCdkeyReply, this, this.ExchangeCdkeyReply);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);
            this.requsetAllData();
        }
        public requsetAllData() {
            this.GetNotice();
        }
        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.announcement) {
                    if (modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.announcement)) {
                        AnnouncementModel.instance.setRP();
                        return;
                    }
                }
            }
        }
        public GetNotice(): void {
            // console.log("获取公告 请求...............:   ");
            Channel.instance.publish(UserCenterOpcode.GetNotice, null);
        }
        public ExchangeCdkey(str: string): void {
            // console.log("兑换激活码 请求...............:   ");
            Channel.instance.publish(UserCenterOpcode.ExchangeCdkey, [str]);
        }
        private GetNoticeReply(value: GetNoticeReply): void {
            // console.log("获取公告返回 ...............:   ", value);
            AnnouncementModel.instance.getInfo(value);
        }
        private ExchangeCdkeyReply(value: ExchangeCdkeyReply): void {
            if (value[ExchangeCdkeyReplyFields.result] == 0) {
                modules.notice.SystemNoticeManager.instance.addNotice("激活码使用成功，奖励已发放", false);
                AnnouncementModel.instance.getCdkeyReply(value);
            }
            else {
                CommonUtil.noticeError(value[ExchangeCdkeyReplyFields.result]);
            }
        }
    }
}