/** 快速使用面板*/


///<reference path="../common/common_util.ts"/>

namespace modules.quickUse {
    import item_equipFields = Configuration.item_equipFields;
    import item_materialFields = Configuration.item_materialFields;
    import Event = Laya.Event;
    import BaseItem = modules.bag.BaseItem;
    import CommonUtil = modules.common.CommonUtil;
    import ItemFields = Protocols.ItemFields;
    import QuickUseUI = ui.QuickUseUI;
    import BagUtil = modules.bag.BagUtil;

    export class QuickUsePanel extends QuickUseUI {
        private _item: Protocols.Item;
        private _baseItem: BaseItem;

        private _timer: int;
        // 使用类型，1装备，2使用 ,3 前往激活,4前往神器界面
        private _useType: int;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.right = 20;
            this.bottom = 200;
            this.width = 245;
            this.height = 304;

            this._timer = 8;
            this._useType = 0;
        }

        protected addListeners(): void {
            // super.addListeners();

            this.useBtn.on(Event.CLICK, this, this.useHandler);
            this.closeBtn.on(Event.CLICK, this, this.closeHandler);
        }

        protected removeListeners(): void {
            // super.removeListeners();

            this.useBtn.off(Event.CLICK, this, this.useHandler);
            this.closeBtn.off(Event.CLICK, this, this.closeHandler);
        }

        private useHandler(): void {
            if (!this._item) return;
            Laya.timer.clear(this, this.loopHandler);
            let type: number = CommonUtil.getItemTypeById(this._item[Protocols.ItemFields.ItemId]);
            if (type === ItemMType.Equip) {
                BagCtrl.instance.wearEquip(this._item[Protocols.ItemFields.uid]);
            } else if (BagUtil.checkIsManualGift(this._item[ItemFields.ItemId])) {     // N选一礼包
                WindowManager.instance.openDialog(WindowEnum.MANUAL_GIFT_ALERT, this._item);
            } else if (type === ItemMType.Consume || type === ItemMType.Giftbag) {
                BagCtrl.instance.useBagItemByIdUid(this._item[ItemFields.ItemId], this._item[ItemFields.uid], this._item[ItemFields.count]);
            }
            else if (type === ItemMType.Material) {
                let WindowEnumStr = QuickUseHuanHuaModel.instance.useHandler(this._item);
                if (WindowEnumStr) {
                    // console.log("打开对应的界面");
                    WindowManager.instance.open(WindowEnumStr, this._item[ItemFields.ItemId]);
                    WindowManager.instance.closeAllDialog();
                }
            }
            else {
                if (this._useType == 4) {
                    WindowManager.instance.open(WindowEnum.SHENQI_PANEL);
                    WindowManager.instance.closeAllDialog();
                    QuickUseCtrl.instance.removeShenQiItem();
                }
            }
            QuickUseCtrl.instance.useOne();
        }

        public close(): void {
            this.setItem(null);
            super.close();
            Laya.timer.clear(this, this.loopHandler);
        }

        private closeHandler(): void {
            QuickUseCtrl.instance.useOne();
        }

        public setItem(item: Protocols.Item): void {
            this.closeBtn.visible = true;
            this._item = item;
            if (!item) {
                this.titleImg.skin = "";
                this.nameTxt.text = "";
                this.useBtn.label = "";
                if (this._baseItem) {
                    this._baseItem.dataSource = null;
                }
                return;
            }
            let type: number = CommonUtil.getItemTypeById(item[Protocols.ItemFields.ItemId]);
            let itemId: number = item[ItemFields.ItemId];
            if (type === ItemMType.Equip) {
                this._useType = 1;
                this.titleImg.skin = "quick_use/msz_tanchuang_1.png";
                this.nameTxt.text = CommonUtil.getItemCfgById(itemId)[item_equipFields.name].toString();
                this.resetTimer();
            } else if (type === ItemMType.Consume || type === ItemMType.Giftbag) {
                this._useType = 2;
                this.titleImg.skin = "quick_use/txt_common_kjsy.png";
                this.nameTxt.text = CommonUtil.getItemCfgById(itemId)[item_materialFields.name].toString();
                this.useBtn.label = `使用`;
                Laya.timer.clear(this, this.loopHandler);
            }
            else if (type === ItemMType.Material) {
                this._useType = 3;
                this.titleImg.skin = "quick_use/txt_common_xwg.png";
                this.nameTxt.text = CommonUtil.getItemCfgById(itemId)[item_materialFields.name].toString();
                this.useBtn.label = `前往激活`;
                Laya.timer.clear(this, this.loopHandler);
            }
            else {
                this._useType = 4;
                this.titleImg.skin = "quick_use/txt_common_kjsy.png";
                this.nameTxt.text = CommonUtil.getItemCfgById(itemId)[item_materialFields.name].toString();
                this.useBtn.label = `使用`;
                Laya.timer.clear(this, this.loopHandler);
            }
            this.nameTxt.color = CommonUtil.getColorById(itemId);
            if (!this._baseItem) {
                this._baseItem = new BaseItem();
                this.addChild(this._baseItem);
                this._baseItem.pos(72, 70, true);
                this._baseItem.nameVisible = false;
            }
            this._baseItem.dataSource = item;
        }

        private resetTimer(): void {
            this._timer = 8;
            Laya.timer.clear(this, this.loopHandler);
            Laya.timer.loop(1000, this, this.loopHandler);
            this.loopHandler();
        }

        private loopHandler(): void {

            this.useBtn.label = `穿戴(${this._timer})`;

            if (this._timer === 0) {
                this.useHandler();
            }
            this._timer--;
        }
    }
}