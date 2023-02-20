namespace modules.compose {
    import PropAlertUtil = modules.commonAlert.PropAlertUtil;
    import BlendCfg = modules.config.BlendCfg;
    import GetWayCfg = modules.config.GetWayCfg;
    import CommonUtil = modules.common.CommonUtil;

    export class ComposeEquipGetAlert extends ui.LackPropAlertUI {

        private _itemBg: Laya.Image;
        private _itemIcon: Laya.Image;
        private _itemTxt: Laya.Text;
        private _sourceBtnY: number;
        private _soureceBtnH: number = 0;
        private _sourceBtns: Array<Laya.Image>;
        private _imgs: Array<Laya.Image>;
        private _desTxts: Array<laya.display.Text>;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._itemBg = new Laya.Image();
            this.addChild(this._itemBg);
            this._itemBg.pos(280, 129, true);

            this._itemIcon = new Laya.Image(`assets/icon/item/50063.png`);
            this.addChild(this._itemIcon);
            this._itemIcon.pos(280, 129, true);

            this._itemTxt = new Laya.Text();
            this.addChild(this._itemTxt);
            this._itemTxt.pos(0, 240);
            this._itemTxt.width = 660;
            this._itemTxt.fontSize = 22;
            this._itemTxt.font = `SimHei`;
            this._itemTxt.align = `center`;

            this._sourceBtns = [];
            this._imgs = [];
            this._desTxts = [];

            for (let i: number = 0; i < 5; i++) {
                this._sourceBtns[i] = new Laya.Image();
                this._imgs[i] = new Laya.Image();
                this._desTxts[i] = new laya.display.Text();
                PropAlertUtil.setDesTxt(this._desTxts[i]);
                this._sourceBtns[i].mouseEnabled = true;
            }
            this.shortCutBuyBox.visible = false;
        }

        protected addListeners(): void {
            super.addListeners();

            for (let i: int = 0, len: int = this._sourceBtns.length; i < len; i++) {
                this.addAutoListener(this._sourceBtns[i], common.LayaEvent.CLICK, this, this.getOpenPlaneId, [i]);
            }
        }

        protected removeListeners(): void {
            super.removeListeners();

        }

        public setOpenParam(cfg: Configuration.item_compose): void {
            super.setOpenParam(cfg);

            this.item = cfg;
        }

        public set item(cfg: Configuration.item_compose) {
            this.removeChildSource();

            let itemId: number = cfg[Configuration.item_composeFields.needItemId][0][0];
            let quality: number = CommonUtil.getItemQualityById(itemId);
            this._itemBg.skin = `assets/icon/quality_bg/iconbg_${quality}.png`;
            this._itemTxt.color = `${CommonUtil.getColorByQuality(quality)}`;
            this._itemTxt.text = `${cfg[Configuration.item_composeFields.tips]}`;

            this.lineimage.y = this.shortCutBuyBox.y;
            this._sourceBtnY = this.lineimage.y + this.lineimage.height + 16;
            let arr: number[] = BlendCfg.instance.getCfgById(34001)[Configuration.blendFields.intParam];
            for (let i: number = 0, len: number = arr.length; i < len; i++) {
                this.getWayBtn(this._sourceBtns[i], arr[i], arr.length, i, this._imgs[i]);
            }
            this._soureceBtnH = 100;
            this.bgImg.height = this._sourceBtnY + this._soureceBtnH + 36;
            this.height = this.bgImg.height;
            this.backTxt.y = this.height + 24;
        }

        private getWayBtn(img: Laya.Image, arr: number, len: number, n: number, image: Laya.Image): void {
            let getWayCfg: Configuration.get_way;
            this.addChild(image);
            this.addChild(img);
            getWayCfg = GetWayCfg.instance.getCfgById(arr);
            img.pos(30 + (660 - 158 * len + 42 * (len - 1)) * 0.5 + n * 116, this._sourceBtnY);
            img.skin = `assets/icon/ui/get_way/${getWayCfg[Configuration.get_wayFields.icon]}.png`;
            image.skin = "assets/icon/ui/get_way/btn_ydrk_bg.png";
            image.pos(img.x, img.y);
            img.addChild(this._desTxts[n]);
            this._desTxts[n].pos(6, 70);
            this._desTxts[n].text = getWayCfg[Configuration.get_wayFields.desc];
        }
        public close(): void {
            super.close();

        }
        private getOpenPlaneId(index: number): void {
            let arr: number[] = BlendCfg.instance.getCfgById(34001)[Configuration.blendFields.intParam];
            let getWayCfg: Configuration.get_way = GetWayCfg.instance.getCfgById(arr[index]);
            let openPlane: Array<number> = getWayCfg[Configuration.get_wayFields.params];

            let id: number = getWayCfg[Configuration.get_wayFields.id];
            if (id != 500) {
                this.close();
                WindowManager.instance.closeAllDialog();
            } else {
                modules.notice.SystemNoticeManager.instance.addNotice("请多关注游戏内活动哦", false);
            }
            let skipId: number = getWayCfg[Configuration.get_wayFields.params][0];
            if (skipId) {
                if (skipId > 999) { //进场景
                    if (skipId == SCENE_ID.scene_homestead) {
                        xianfu.XianfuCtrl.instance.enterScene();
                    } else {
                        dungeon.DungeonCtrl.instance.reqEnterScene(skipId);
                    }
                } else {
                    WindowManager.instance.openByActionId(skipId);
                }
            }
        }

        private removeChildSource(): void {
            if (this._sourceBtns) {
                for (let i: number = 0; i < this._sourceBtns.length; i++) {
                    this.removeChild(this._sourceBtns[i]);
                }
            }
            if (this._imgs) {
                for (let i: number = 0; i < this._imgs.length; i++) {
                    this.removeChild(this._imgs[i]);
                    this.removeChild(this._desTxts[i]);
                }
            }
            this.bgImg.height = this.height = 700;
            this.backTxt.y = 750;
            this.lineimage.y = 463;
        }

        public destroy(): void {
            if (this._sourceBtns != null) {
                for (let e of this._sourceBtns) {
                    e.destroy(true);
                }
                this._sourceBtns = null;
            }

            if (this._imgs != null) {
                for (let e of this._imgs) {
                    e.destroy(true);
                }
                this._imgs = null;
            }

            if (this._desTxts != null) {
                for (let e of this._desTxts) {
                    e.destroy(true);
                }
                this._desTxts = null;
            }

            if (this._itemBg) {
                this._itemBg.destroy(true);
                this._itemBg = null;
            }

            if (this._itemIcon) {
                this._itemIcon.destroy(true);
                this._itemIcon = null;
            }

            if (this._itemTxt) {
                this._itemTxt.destroy(true);
                this._itemTxt = null;
            }
            super.destroy();
        }
    }
}