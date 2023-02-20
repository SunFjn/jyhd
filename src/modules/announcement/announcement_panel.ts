///<reference path="../../../libs/LayaAir.d.ts"/>
namespace modules.announcement {
    import Point = laya.maths.Point;
    import List = laya.ui.List;
    import BagItem = modules.bag.BagItem;
    import Event = laya.events.Event;
    import CustomClip = modules.common.CustomClip;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BtnGroup = modules.common.BtnGroup;
    import CustomList = modules.common.CustomList;
    import Feedback = Protocols.Feedback;
    import FeedbackFields = Protocols.FeedbackFields;
    export class AnnouncementPanel extends ui.AnnouncementViewUI {
        private _list: CustomList;
        private _btnGroup: BtnGroup;
        private _toggleGroup: BtnGroup;
        private _tween: TweenJS;
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this.centerX = this.centerY = 0;
            this._list = new CustomList();
            this.gongGaoImg.addChildAt(this._list, 0);
            this._list.hCount = 1;
            this._list.vCount = 1;
            this._list.pos(34, 11);
            this._list.size(582, 694);
            this._list.itemRender = AnnouncementHtml;
        }
        public onOpened(): void {
            super.onOpened();
            AnnouncementCtrl.instance.GetNotice();
            this.inPutText.maxChars = AnnouncementModel.instance.maxInputChar;
            this.inPutText.multiline = true;
            this.inPutText.text = '';
            this.inPutText.restrict = "0-9a-zA-Z";
            this.cangPrompt();
            this.showUI();
        }
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.okBtn, Event.CLICK, this, this.inputEnterHandler);
            this.addAutoListener(this.inPutText, Event.BLUR, this, this.cangPrompt);
            this.addAutoListener(this.inPutText, Event.FOCUS, this, this.cangPrompt);
            this.addAutoListener(this.inPutText, Event.INPUT, this, this.charNumCheck);
            this.addAutoListener(this.inPutText, Event.MOUSE_DOWN, this, this.inputDownHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ANNOUNCEMENT_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ANNOUNCEMENT_BACK, this, () => {
                if (AnnouncementModel.instance.cdkeyReply && AnnouncementModel.instance.cdkeyReply.length > 0) {
                    //激活成功弹框
                    WindowManager.instance.open(WindowEnum.ANNOUNCEMENT_ALERT);
                } else {
                    console.log("奖励返回为空");
                }
            });
        }
        protected removeListeners(): void {
            super.removeListeners();
            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }
        }
        public showUI() {
            this._list.datas = [AnnouncementModel.instance.noticeStr];
            this._list.relayout();
            this.noGgText.visible = !AnnouncementModel.instance.noticeStr;
        }
        private charNumCheck(): void {
            let content: string = this.inPutText.text;
            if (content.length > AnnouncementModel.instance.maxInputChar) {
                SystemNoticeManager.instance.addNotice(`最大输入字数${AnnouncementModel.instance.maxInputChar}个`, true);
            }
            else {
                this.inPutText.text = content;//.toLowerCase();//固定xiao写
            }
            this.cangPrompt();
        }
        private inputDownHandler(e: Event): void {
            e.stopPropagation();
        }
        public cangPrompt() {
            let content: string = this.inPutText.text;
            if (!content) {
                if (this.inPutText.focus) {
                    this.tipText.visible = false;
                }
                else {
                    this.tipText.visible = true;
                }
            }
            else {
                this.tipText.visible = false;
            }
        }
        /**  发送消息 -----------  */
        private inputEnterHandler(): void {
            // if (AnnouncementModel.instance.cishu <= 0) {
            //     SystemNoticeManager.instance.addNotice(`您今日的反馈次数已满`, true);
            //     return;
            // }
            if (window['get_Debug_platform']()) {
                Channel.instance.publish(Number(this.inPutText.text), []);
                console.log("Number(this.inPutText.text)", Number(this.inPutText.text))
            }


            let content: string = this.inPutText.text;
            if (!content) {
                SystemNoticeManager.instance.addNotice(`请输入激活码`, true);
                return;
            } else if (content.length < AnnouncementModel.instance.minInputChar) {
                SystemNoticeManager.instance.addNotice(`提交的内容最少${AnnouncementModel.instance.minInputChar}个`, true);
                return;
            }
            // else if (!modules.chat.ChatModel.instance.isValidContent(content)) {
            //     SystemNoticeManager.instance.addNotice(`包含非法字符`, true);
            //     return;
            // }
            //发送协议
            AnnouncementCtrl.instance.ExchangeCdkey(this.inPutText.text);
        }

        public close(): void {
            let content: string = this.inPutText.text;
            // if (!content) {
            super.close();
            // }
            // else {
            //     CommonUtil.alert('提示', '输入区有待提交的意见,退出将清除意见内容,是否确认？', true, Handler.create(this, this.openRecharge), true);
            // }
        }

        private openRecharge(): void {
            super.close();
        }
        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }
    }
}
