/** 邮件详细内容面板*/
namespace modules.email {
    import Event = Laya.Event;
    import Rectangle = Laya.Rectangle;
    import List = Laya.List;
    import EmailDetailViewUI = ui.EmailDetailViewUI;
    import Email = Protocols.Email;
    import EmailFields = Protocols.EmailFields;
    import BaseItem = modules.bag.BaseItem;
    import CustomClip = modules.common.CustomClip;
    import ItemFields = Protocols.ItemFields;
    import BagUtil = modules.bag.BagUtil;
    import LayaEvent = modules.common.LayaEvent;

    export class EmailDetailPanel extends EmailDetailViewUI {
        private _h: number;
        private _lastY: number = 0;
        private _uuid: string;
        private _list: List;
        private _emailInfo: Email;

        private _btnClip: CustomClip;

        constructor() {
            super();
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new List();
            this._list.vScrollBarSkin = "";
            this._list.itemRender = BaseItem;
            this._list.repeatX = 4;
            this._list.spaceX = 0;
            this._list.spaceY = 0;
            this._list.width = 434;
            this._list.height = 152;
            this._list.x = 0;
            this._list.y = 0;
            this.itemPanel.addChild(this._list);
            this._h = 193;
            this.emailTxt.scrollRect = new Rectangle(0, 0, this.emailTxt.width, this._h);
            this._btnClip = new CustomClip();
            this.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            let arr: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr[i] = `btn_light/${i}.png`;
            }
            this._btnClip.frameUrls = arr;
            this._btnClip.visible = false;
            this._btnClip.pos(231, 652, true);
            this._btnClip.scaleY = 1.2;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.getBtn, LayaEvent.CLICK, this, this.getHandler);

            this.addAutoListener(this.emailTxt, LayaEvent.MOUSE_DOWN, this, this.downHandler);
            this.addAutoListener(this.emailTxt, LayaEvent.MOUSE_WHEEL, this, this.wheelHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.EMAIL_SINGLE_UPDATE, this, this.emailUpdate);
        }

        private downHandler(): void {
            this._lastY = this.emailTxt.mouseY;
            Laya.stage.on(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.on(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.on(Event.MOUSE_OUT, this, this.upHandler);
        }

        private wheelHandler(e: Event): void {
            let offsetY: number = e.delta * -8;
            this.scrollY(offsetY);
        }

        private moveHandler(): void {
            let offsetY: number = this._lastY - this.emailTxt.mouseY;
            this.scrollY(offsetY);
            this._lastY = this.emailTxt.mouseY;
        }

        private upHandler(): void {
            Laya.stage.off(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.off(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.off(Event.MOUSE_OUT, this, this.upHandler);
        }

        private scrollY(offsetY: number): void {
            if (this.emailTxt.height < this._h) return;
            let rect: Rectangle = this.emailTxt.scrollRect;
            rect.y = rect.y + offsetY;
            if (rect.y < 0) rect.y = 0;
            else if (rect.y > this.emailTxt.height - this._h) {
                rect.y = this.emailTxt.height - this._h;
            }
            this.emailTxt.scrollRect = rect;
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._emailInfo = value as Email;
            this.emailInfoUpdate();
            EmailCtrl.instance.readEmail(value[EmailFields.uuid]);
        }

        public onClosed(): void {
            super.onClosed();
            EmailModel.instance.isChoose = false;

            this._btnClip.visible = false;
            this._btnClip.stop();
        }

        private emailUpdate(): void {
            this._emailInfo = EmailModel.instance.newShowEmail;
            EmailModel.instance.newShowEmail = null;
            this.emailInfoUpdate();
        }

        private emailInfoUpdate() {
            this.emailTxt.text = this._emailInfo[EmailFields.content];
            this.emailTxt.height = this.emailTxt.textHeight;
            this._uuid = this._emailInfo[EmailFields.uuid];
            this.emailTime.text = this.timeHandler(this._emailInfo[EmailFields.create_time]);
            if (this._emailInfo[EmailFields.items] && this._emailInfo[EmailFields.items].length > 0) {
                this._list.visible = true;
                this.tipsImg.visible = false;
                this._list.array = this._emailInfo[EmailFields.items];
                if (this._emailInfo[EmailFields.state] == 2) {  //已领取状态
                    this.getBtn.visible = false;
                    this.hasGet.visible = true;
                    this._btnClip.visible = false;
                    this._btnClip.stop();
                } else {
                    this.getBtn.visible = true;
                    this.hasGet.visible = false;
                    this._btnClip.visible = true;
                    this._btnClip.play();
                }
                this.getBtn.mouseEnabled = true;
                this.getBtn.gray = false;
            } else {
                this.hasGet.visible = this._list.visible = false;
                this.getBtn.visible = true;
                this.getBtn.mouseEnabled = false;
                this.getBtn.gray = true;
                this.tipsImg.visible = true;
                this._btnClip.visible = false;
                this._btnClip.stop();
            }
        }

        private getHandler(): void {

            let flag: boolean = false;

            for (let i: int = 0, len: int = this._list.array.length; i < len; i++) {
                let id: number = this._list.array[i][ItemFields.ItemId];
                let type: number = modules.common.CommonUtil.getItemTypeById(id);
                if (type === ItemMType.Equip) {
                    flag = true;
                    break;
                }
            }

            // let restNum = BagModel.instance.getBagEnoughById(1);
            // let isShow: boolean = !(restNum > BlendCfg.instance.getCfgByTypeAndId(10007)[blendFields.intParam][0]);

            if (flag && BagUtil.checkNeedSmeltTip()) {
                // CommonUtil.alert("温馨提示","装备背包格子不足，是否一键熔炼", true, Handler.create(BagModel.instance, BagModel.instance.quicklyOneKeySmelt));
            } else {
                if (!EmailModel.instance.getAttach) {
                    EmailModel.instance.isChoose = true;
                    EmailModel.instance.chooseUuid = this._uuid;
                    EmailCtrl.instance.getAward(this._uuid);
                    EmailModel.instance.getAttach = true;
                }
            }
        }

        private timeHandler(timeMs: number): string {
            let time = new Date(timeMs);
            let month = time.getMonth() + 1;
            let str: string = time.getFullYear() + "-" + this.formateData(month) + "-" + this.formateData(time.getDate()) + " " + this.formateData(time.getHours()) + ":" +
                this.formateData(time.getMinutes()) + ":" + this.formateData(time.getSeconds());
            return str;
        }

        private formateData(input: number): string {
            let str: string = "";
            let t = input.toString();
            if (t.length < 2) {
                str = "0" + t;
                return str;
            }
            return t;
        }
    }
}