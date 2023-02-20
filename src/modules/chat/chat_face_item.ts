namespace modules.chat {
    import CustomClip = modules.common.CustomClip;
    import Image = Laya.Image;
    import ChatContent = Protocols.ChatContent;
    import ChatFaceCfg = modules.config.ChatFaceCfg;
    import chatExpressionFields = Configuration.chatExpressionFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import VipModel = modules.vip.VipModel;

    export class ChatFaceItem extends ItemRender {

        private _btnClip: CustomClip;
        private _img: Image;
        private _id: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

        }

        public setData(value: any): void {
            let type: number = ChatModel.instance.faceType;
            let id: number = value as number;
            this._id = id;
            if (!type) {//普通表情
                if (this._btnClip) {
                    this._btnClip.visible = false;
                    this._btnClip.stop();
                }
                if (!this._img) {
                    this._img = new Image(`assets/icon/expression/${id}.png`);
                    this._img.scale(1.2, 1.2);
                    this.addChild(this._img);
                }
                this._img.skin = `assets/icon/expression/${id}.png`;
                this._img.visible = true;
                this.width = this.height = 48;
            } else {
                if (this._img) {
                    this._img.visible = false;
                }
                if (!this._btnClip) {
                    this._btnClip = new CustomClip();
                    this.addChild(this._btnClip);
                    this._btnClip.durationFrame = 5;
                    this._btnClip.loop = true;
                }
                ChatModel.instance.setFaceEffFrame(this._btnClip, id);
                this._btnClip.play();
                this._btnClip.visible = true;
                this.width = this.height = 64;
            }
        }

        protected addListeners(): void {
            super.addListeners();

        }

        protected removeListeners(): void {
            super.removeListeners();
            if (this._btnClip) this._btnClip.stop();
        }

        public onOpened(): void {
            super.onOpened();

        }

        protected clickHandler(): void {
            super.clickHandler();
            let type: number = ChatModel.instance.faceType;
            if (!type) {
                //选中表情  将表情存到输入框里
                let name: string = ChatFaceCfg.instance.getCfgById(this._id)[chatExpressionFields.name];
                ChatModel.instance.checkedFace.push(name);
                GlobalData.dispatcher.event(CommonEventType.CHECKED_FACE);
            } else {   //高级表情
                let vipLv: number = VipModel.instance.vipLevel;
                if ((ChatModel.instance.sendVipFaceTime == ChatModel.instance.maxExpertFaceTime) &&
                    (vipLv < ChatModel.instance.minSendVipFaceLv)) {
                    SystemNoticeManager.instance.addNotice("发送高级表情次数已达上限", true);
                    return;
                }
                let content: ChatContent = [ChatModel.instance.currChatChannel, 2, this._id, "", ChatModel.instance.virtualItem, [], [], []];
                ChatCtrl.instance.sendChatMessage(content);
                WindowManager.instance.close(WindowEnum.CHAT_FACE_PANEL);
            }
        }

        public close(): void {
            super.close();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy(destroyChild);
        }

    }
}