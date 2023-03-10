///<reference path="../../../libs/LayaAir.d.ts"/>
namespace modules.feed_back {
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
    export class FeedBackAlert extends ui.FeedBackAlertUI {
        private _list: CustomList;
        private _btnGroup: BtnGroup;
        private _toggleGroup: BtnGroup;
        private _tween: TweenJS;
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.width = 528;
            this._list.height = 376;
            this._list.spaceX = 0;
            this._list.spaceY = 5;
            this._list.itemRender = FeedBackkItem;
            this._list.x = 23;
            this._list.y = 13;
            this.daFuBox.addChild(this._list);
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.yiJianBtn, this.faFuBtn);
            this._toggleGroup = new BtnGroup();
            this._toggleGroup.setBtns(this.toggleBtn1, this.toggleBtn2, this.toggleBtn3);
            this.StatementHTML.color = "#000000";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 22;
            this.StatementHTML.style.align = "center";
            this.StatementHTML.style.valign = "middle";
        }
        public onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 0;
            this._toggleGroup.selectedIndex = 0;
            this.inPutText.maxChars = FeedBackModel.instance.maxInputChar;
            this.inPutText.multiline = true;
            // this.StatementHTML.innerHTML = `???????????????????????????????????????,???????????????????????????!<br/>??????????????????:???????????????8:00-23:00`;
            this.StatementHTML.innerHTML = FeedBackModel.instance.desStr;
            this.rpImg.visible = FeedBackModel.instance.getgRadeRP();
            this.inPutText.text = '';
            this.tipAniText.visible = false;
            // this.inPutText.inputElementYAdjuster = 60;
            this.cangPrompt();
        }
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this._btnGroup, Event.CHANGE, this, this.btnGroupHandler);
            this.addAutoListener(this._toggleGroup, Event.CHANGE, this, this.toggleGroupHandler);
            this.addAutoListener(this.okBtn, Event.CLICK, this, this.inputEnterHandler);
            this.addAutoListener(this.inPutText, Event.BLUR, this, this.cangPrompt);
            this.addAutoListener(this.inPutText, Event.FOCUS, this, this.cangPrompt);
            // this.addAutoListener(this, Event.CLICK, this, this.cangPrompt);
            this.addAutoListener(this.inPutText, Event.INPUT, this, this.charNumCheck);
            this.addAutoListener(this.inPutText, Event.MOUSE_DOWN, this, this.inputDownHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FEED_BACK_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FEED_BACK_CLOSE, this, () => {
                super.close();
            });
        }
        protected removeListeners(): void {
            super.removeListeners();
            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }
        }
        private charNumCheck(): void {
            let content: string = this.inPutText.text;
            if (content.length > FeedBackModel.instance.maxInputChar) {
                // SystemNoticeManager.instance.addNotice(`??????????????????${FeedBackModel.instance.maxInputChar}???`, true);
                this.tipAni(`??????????????????${FeedBackModel.instance.maxInputChar}???`);
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
        /**  ???????????? -----------  */
        private inputEnterHandler(): void {
            // if (FeedBackModel.instance.cishu <= 0) {
            //     SystemNoticeManager.instance.addNotice(`??????????????????????????????`, true);
            //     return;
            // }
            let content: string = this.inPutText.text;
            if (!content) {
                // SystemNoticeManager.instance.addNotice(`???????????????????????????`, true);
                this.tipAni(`???????????????????????????`);
                return;
            } 
            // else if (content.length < FeedBackModel.instance.minInputChar) {
            //     // SystemNoticeManager.instance.addNotice(`?????????????????????${FeedBackModel.instance.minInputChar}???`, true);
            //     this.tipAni(`?????????????????????${FeedBackModel.instance.minInputChar}???`);
            //     return;
            // }
            // else if (!modules.chat.ChatModel.instance.isValidContent(content)) {
            //     // SystemNoticeManager.instance.addNotice(`??????????????????`, true);
            //     this.tipAni(`??????????????????`);
            //     return;
            // }
            //????????????
            FeedBackCtrl.instance.SendFeedback(FeedBackModel.instance._type, this.inPutText.text);
        }
        public tipAni(str: string, booll: boolean = false) {
            this.tipAniText.text = str;
            if (!booll) {
                this.tipAniText.color = "#ff3e3e";
            }
            else {
                this.tipAniText.color = "#168a17";
            }
            if (this._tween) {
                this._tween.stop();
                this.tipAniText.y = 170;
                // this._tween.start();
            }
            //  else {
            this.tipAniText.visible = true;
            this._tween = TweenJS.create(this.tipAniText).to({ y: 150 }, 80).chain(
                TweenJS.create(this.tipAniText).to({ y: 80 }, 80).delay(1000).onComplete(() => {
                    this.tipAniText.visible = false;
                })
            ).combine(true).start();
        }
        private btnGroupHandler(): void {
            if (this._btnGroup.selectedIndex === 0) {
                this.yiJianBox.visible = true;
                this.daFuBox.visible = false;
            } else if (this._btnGroup.selectedIndex === 1) {
                FeedBackCtrl.instance.GetFeedbackList();
                this.yiJianBox.visible = false;
                this.daFuBox.visible = true;
                this.showUI();
                FeedBackModel.instance.ChangeFeedbackState();
            }
        }
        private toggleGroupHandler(): void {
            // bug,            //??????BUG 1
            // topUp,       //?????? 2
            // other,          //?????? 3
            if (this._toggleGroup.selectedIndex === 0) {
                FeedBackModel.instance._type = FeedbackType.bug;
            }
            else if (this._toggleGroup.selectedIndex === 1) {
                FeedBackModel.instance._type = FeedbackType.topUp;
            }
            else if (this._toggleGroup.selectedIndex === 2) {
                FeedBackModel.instance._type = FeedbackType.other;
            }
        }
        public sortArr(A: Feedback, B: Feedback) {
            return A[FeedbackFields.time] < B[FeedbackFields.time] ? 1 : -1;
        }
        public showUI() {
            let shuju = FeedBackModel.instance.listDate;
            shuju.sort(this.sortArr);
            this._list.datas = shuju;
            this._list.relayout();
            this.zanWuText.visible = !(shuju && shuju.length > 0);
            this.rpImg.visible = FeedBackModel.instance.getgRadeRP();
        }
        public close(): void {
            let content: string = this.inPutText.text;
            if (!content) {
                super.close();
            }
            else {
                CommonUtil.alert('??????', '??????????????????????????????,???????????????????????????,???????????????', [Handler.create(this, this.openRecharge)]);
            }
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
            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }
            if (this._toggleGroup) {
                this._toggleGroup.destroy();
                this._toggleGroup = null;
            }
            super.destroy();
        }
    }
}
