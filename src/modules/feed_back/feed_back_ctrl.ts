///<reference path="../main/main_ctrl.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
///<reference path="../zerobuy/zero_buy_model.ts"/>
namespace modules.feed_back {
    import BaseCtrl = modules.core.BaseCtrl;
    import SendFeedbackReply = Protocols.SendFeedbackReply;
    import SendFeedbackReplyFields = Protocols.SendFeedbackReplyFields;
    import UpdateFeedback = Protocols.UpdateFeedback;
    import UpdateFeedbackFields = Protocols.UpdateFeedbackFields;
    import GetFeedbackListReply = Protocols.GetFeedbackListReply;
    import GetFeedbackListReplyFields = Protocols.GetFeedbackListReplyFields;
    import UpdateFashionInfo = Protocols.UpdateFashionInfo;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    export class FeedBackCtrl extends BaseCtrl {
        private static _instance: FeedBackCtrl;
        public static get instance(): FeedBackCtrl {
            return this._instance = this._instance || new FeedBackCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.SendFeedbackReply, this, this.SendFeedbackReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateFeedback, this, this.UpdateFeedback);
            Channel.instance.subscribe(SystemClientOpcode.GetFeedbackListReply, this, this.GetFeedbackListReply);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);

            this.requsetAllData();
        }
        public requsetAllData() {
            this.GetFeedbackList();
        }

        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.feedBack) {
                    if (modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.feedBack)) {
                        FeedBackModel.instance.setRP();
                        return;
                    }
                }
            }
        }
        public GetFeedbackList(): void {
            // console.log("意见反馈 获取意见反馈列表 请求...............:   ");
            Channel.instance.publish(UserCenterOpcode.GetFeedbackList, null);
        }
        public SendFeedback(type: number, str: string): void {
            // console.log("意见反馈 发送意见反馈 请求...............:   " + type + "    " + str);
            Channel.instance.publish(UserCenterOpcode.SendFeedback, [type, str]);
        }
        public ChangeFeedbackState(uuid: Array<string>): void {
            // console.log("意见反馈 改变意见反馈查看状态 请求...............:   ");
            Channel.instance.publish(UserCenterOpcode.ChangeFeedbackState, [uuid]);
        }

        private SendFeedbackReply(value: SendFeedbackReply): void {
            // console.log("意见反馈 发送意见反馈 返回...............:   ", value);
            if (value[SendFeedbackReplyFields.result] == 0) {
                modules.notice.SystemNoticeManager.instance.addNotice("提交成功", false);
                GlobalData.dispatcher.event(CommonEventType.FEED_BACK_CLOSE);
                this.GetFeedbackList();
            }
            else {
                CommonUtil.noticeError(value[SendFeedbackReplyFields.result]);
            }

        }
        private GetFeedbackListReply(value: GetFeedbackListReply): void {
            // console.log("意见反馈 获取意见反馈列表 返回...............:   ", value);
            FeedBackModel.instance.getInfo(value);
        }
        private UpdateFeedback(value: UpdateFeedback): void {
            // console.log("意见反馈 获取意见反馈列表 更新...............:   ", value);
            FeedBackModel.instance.updateInfo(value);
        }

    }
}