/// <reference path="../common/common_util.ts" />
///<reference path="../common/btn_group.ts"/>
///<reference path="../common/progress_bar_ctrl.ts"/>
///<reference path="../config/talisman_cfg.ts"/>

/** 圣物单元项 */
namespace modules.talisman {
    import LayaEvent = modules.common.LayaEvent;
    import item_materialFields = Configuration.item_materialFields;
    import CommonUtil = modules.common.CommonUtil;
    import amuletRefineFields = Configuration.amuletRefineFields;
    import BagModel = modules.bag.BagModel;
    import Image = laya.ui.Image;
    import Text = laya.display.Text;
    import CustomClip = modules.common.CustomClip;
    import amuletRefine = Configuration.amuletRefine;
    import GuideModel = modules.guide.GuideModel;

    export class Item {
        private mask: Image;
        private level: Text;
        private active: Image;
        private _status: TalismanState;
        private redDot: Image;

        constructor(lv: Text, mask: Image, act: Image, red: Image) {
            this.level = lv;
            this.mask = mask;
            this.active = act;
            this.redDot = red;
        }

        get status(): TalismanState {
            return this._status;
        }

        set status(value: TalismanState) {
            if (this._status == value) {
                return;
            }
            this._status = value;
            switch (this._status) {
                case TalismanState.cantup: {
                    this.level.visible = true;
                    this.mask.visible = false;
                    this.active.visible = false;
                    this.redDot.visible = false;

                    break;
                }
                case TalismanState.up: {
                    this.level.visible = true;
                    this.mask.visible = false;
                    this.active.visible = false;
                    this.redDot.visible = true;

                }
                    break;
                case TalismanState.withouract: {
                    this.level.visible = true;
                    this.mask.visible = true;
                    this.active.visible = false;
                    this.redDot.visible = false


                }
                    break;
                case TalismanState.active: {
                    this.level.visible = true;
                    this.mask.visible = true;
                    this.active.visible = true;
                    this.redDot.visible = true;

                }
                    break;
                case TalismanState.maxlevel: {
                    this.level.visible = true;
                    this.mask.visible = false;
                    this.active.visible = false;
                    this.redDot.visible = false
                }
                    break;
            }
        }
    }

    export class TalismanItem extends ui.MiBaoItemUI {
        protected itemId: number;
        private level: number;
        private _item: Item;
        private _upClip: CustomClip;
        private cfg: amuletRefine;
        private _iconMaxWidth:number = 110;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._upClip = new CustomClip();
            this.addChildAt(this._upClip, 1);
            this._upClip.visible = false;
            this._upClip.pos(27, 10);
            this._upClip.scaleX = 0.7;
            this._upClip.scaleY = 0.7;
            // this.icon.anchorX = this.icon.anchorY = 0.5;
            // this.icon.pos(50, 80, true);// 88, 96
        }

        protected setData(value: any): void {
            super.setData(value);
            this.cfg = value[0];
            this.itemId = this.cfg[amuletRefineFields.id];
            this.level = this.cfg[amuletRefineFields.level];
            this._item = new Item(this.levelText, this.isExit, this.activeTxt, this.redDot);
            let quality: int = CommonUtil.getItemQualityById(this.itemId) - 1;
            let itemCfg = CommonUtil.getItemCfgById(this.itemId);
            if (!itemCfg) throw new Error("不存在的道具ID：" + this.itemId);
            if (quality > 5) quality = 5;
            this.bg.skin = `talisman/iconbg_${quality}.png`;
            this.bg2.skin = `talisman/txtbg_${quality}.png`;
            this.icon.skin = CommonUtil.getIconById(this.itemId);
            this.maxLvImg.visible = false;
            // this.icon.height *= this._iconMaxWidth / this.icon.width;
            // this.icon.width = this._iconMaxWidth;
            this.nameText.text = itemCfg[item_materialFields.name].toString();
            let nm: string = this.itemId.toString();
            if (quality >= 3) {
                // 暂时去掉动态图片
                this.icon.visible = true;
                // this._upClip.skin = `assets/effect/fa_bao/${nm}.atlas`;
                // this._upClip.frameUrls = [`${nm}/1.png`, `${nm}/2.png`, `${nm}/3.png`, `${nm}/4.png`, `${nm}/5.png`, `${nm}/6.png`, `${nm}/7.png`, `${nm}/8.png`];
                // this._upClip.play();
                this._upClip.visible = false;
            } else {
                // this._upClip.stop();
                this._upClip.visible = false;
                this.icon.visible = true;
            }
            this.levelText.text = this.level.toString();

            this.levelText.visible = true;
            let count = BagModel.instance.getItemCountById(this.itemId) + BagModel.instance.getItemCountById(this.cfg[amuletRefineFields.universalId]);
            let widt: number = 80;
            let num = this.cfg[amuletRefineFields.items][1];
            this._item.status = value[1];
            if (num != null) {
                this.nowExp.text = count.toString() + "/" + num;
                if (count / num >= 1) {
                    this.expProgress.width = widt
                } else {
                    this.expProgress.width = widt * (count / num);
                }
            } else {
                this.nowExp.text = "已满级";
                this.expProgress.width = widt;
                this.maxLvImg.skin = `talisman/txt_common_ymj_${quality}.png`;
                this.maxLvImg.visible = true;
            }
            this.selectedFirst();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.selectedBtn, LayaEvent.CLICK, this, this.selectBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MIBAO_UPDATE_SELECTED, this, this.UpdateNowRefreshUI);
            if (this.index === 0) {
                GuideModel.instance.registeUI(GuideSpriteId.TALISMAN_ITEM_0, this);
            }

        }

        private selectBtnHandler() {
            if (this.selectedBtn.alpha == 1) {
                // 打开圣物弹窗界面
                let value = this.itemId;
                WindowManager.instance.openDialog(WindowEnum.TALISMAN_DIALOG, value);
            } else {
                this.selectedBtn.alpha = 1;
                this.setProperty();
                GlobalData.dispatcher.event(CommonEventType.MIBAO_UPDATE_SELECTED, this.index);
            }
        }

        // 设置下方属性
        private setProperty() {
            let data = CommonUtil.getItemCfgById(this.itemId);
            // console.log("item data:", data);

            GlobalData.dispatcher.event(CommonEventType.UPDATE_MIBAO_SELECTED_ATTR, [data]);
        }

        // 默认选择第一个
        private selectedFirst() {
            this.selectedBtn.alpha = 0;
            if (this.index == 0) {
                this.selectBtnHandler();
            }
        }

        private UpdateNowRefreshUI(selectedIndex: number) {
            if (this.index != selectedIndex) {
                this.selectedBtn.alpha = 0;
            }
        }

        protected removeListeners(): void {
            super.removeListeners();
            if (this.index === 0) {
                GuideModel.instance.removeUI(GuideSpriteId.TALISMAN_ITEM_0);
            }
        }

        protected onOpened(): void {
            super.onOpened();
        }

        protected clickHandler(): void {
            // let value = this.itemId;
            // WindowManager.instance.openDialog(WindowEnum.TALISMAN_DIALOG, value);
        }

        public get item(): Item {
            return this._item;
        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            // this.frameImg.visible = value;
        }
    }
}