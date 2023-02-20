/////<reference path="../$.ts"/>

/** 创建仙盟弹框 */
namespace modules.faction {
    import ArrayUtils = utils.ArrayUtils;
    import BtnGroup = modules.common.BtnGroup;
    import FactionCreateAlertUI = ui.FactionCreateAlertUI;
    import LayaEvent = modules.common.LayaEvent;
    import Image = Laya.Image;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import ItemsFields = Configuration.ItemsFields;

    export class FactionCreateAlert extends FactionCreateAlertUI {

        private _imgs: Array<Image>;
        private _imgGroup: BtnGroup;
        private _imgSpace: number;
        private _iconIndexs: number[];

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._imgSpace = 120;

            let icons: string[] = BlendCfg.instance.getCfgById(36004)[blendFields.stringParam];

            let len: number = icons.length;
            this._iconIndexs = [];
            this._imgs = [];
            for (let i: int = 0; i < len; i++) {
                this._iconIndexs.push(i);
                let img: Image = new Image();
                this._imgs.push(img);
                this.listBox.addChild(img);
                img.width = 103;
                img.height = 104;
                img.x = 20 + i * this._imgSpace;
            }

            this._imgGroup = new BtnGroup();
            this._imgGroup.setBtns(...this._imgs);
            this.listBox.width = this._imgs[len - 1].x + this._imgs[len - 1].width;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.okBtnHandler);
            this.addAutoListener(this._imgGroup, LayaEvent.CHANGE, this, this.selecetIconImg);
            this._imgGroup.selectedIndex = 0;
            this.addAutoListener(this.lShiftImg, LayaEvent.CLICK, this, this.imgsShowHandler, [0]);
            this.addAutoListener(this.rShiftImg, LayaEvent.CLICK, this, this.imgsShowHandler, [1]);
            this.addAutoListener(this.inputTxt, common.LayaEvent.MOUSE_DOWN, this, this.inputHandler);
            this.addAutoListener(this.inputTxt, common.LayaEvent.BLUR, this, this.otherHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this.listBox.x = 0;
            this.updateView();
            this.imgsShow();
        }

        private updateView(): void {
            let needItemId: number = BlendCfg.instance.getCfgById(36001)[blendFields.intParam][ItemsFields.itemId];
            let needItemNum: number = BlendCfg.instance.getCfgById(36001)[blendFields.intParam][ItemsFields.count];
            this.propImg.skin = CommonUtil.getIconById(needItemId, true);
            this.propTxt.text = CommonUtil.bigNumToString(needItemNum);

            let icons: string[] = BlendCfg.instance.getCfgById(36004)[blendFields.stringParam];
            this._iconIndexs = ArrayUtils.disturb(this._iconIndexs);
            for (let i: int = 0, len: int = icons.length; i < len; i++) {
                let iconRes: string = icons[this._iconIndexs[i]];
                this._imgs[i].skin = `assets/icon/ui/faction/${iconRes}.png`;
            }
        }

        private imgsShowHandler(dir: number): void {
            let speedSpace: number = this._imgSpace * 4;
            if (dir) {
                if (this.listBox.x <= (500 - this.listBox.width)) { //最右边
                    return;
                }
                this.listBox.x -= speedSpace;
            } else {
                if (this.listBox.x >= 0) {  //最左边
                    return;
                }
                this.listBox.x += speedSpace;
            }
            this.imgsShow();
        }

        private imgsShow() {
            this.rShiftImg.visible = !(this.listBox.x <= (500 - this.listBox.width));
            this.lShiftImg.visible = !(this.listBox.x >= 0);
        }

        private inputHandler(): void {
            this.inputTxt.prompt = ` `;
        }

        private otherHandler(): void {
            this.inputTxt.prompt = `输入公会名称`;
        }

        private selecetIconImg(): void {
            this.selectImg.x = this._imgGroup.selectedBtn.x - 7;
        }

        private okBtnHandler(): void {
            let content: string = this.inputTxt.text;
            if (!content) {
                SystemNoticeManager.instance.addNotice(`请先给公会起个名字`, true);
                return;
            } else if (!chat.ChatModel.instance.isValidContent(content)) {
                SystemNoticeManager.instance.addNotice(`包含非法字符`, true);
                return;
            } else if (content.length < 1 || content.length > 6) {
                SystemNoticeManager.instance.addNotice(`名字长度为1~6个字`, true);
                return;
            }
            FactionCtrl.instance.createFaction([content, this._iconIndexs[this._imgGroup.selectedIndex]]);
            this.close();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._imgs) {
                for (let e of this._imgs) {
                    e.destroy();
                }
                this._imgs.length = 0;
                this._imgs = null;
            }
            if (this._imgGroup) {
                this._imgGroup.destroy();
                this._imgGroup = null;
            }
            if (this._iconIndexs) {
                this._iconIndexs.length = 0;
                this._iconIndexs = null;
            }
            super.destroy();
        }
    }
}
