///<reference path="../config/package_cfg.ts"/>


/** N选一礼包弹框*/


namespace modules.commonAlert {
    import ManualGiftAlertUI = ui.ManualGiftAlertUI;
    import Button = Laya.Button;
    import BagItem = modules.bag.BagItem;
    import Event = Laya.Event;
    import Item = Protocols.Item;
    import item_material = Configuration.item_material;
    import ItemFields = Protocols.ItemFields;
    import item_materialFields = Configuration.item_materialFields;
    import PackageCfg = modules.config.PackageCfg;
    import weightItem = Configuration.weightItem;
    import weightItemFields = Configuration.weightItemFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CustomList = modules.common.CustomList;
    import CommonUtil = modules.common.CommonUtil;
    import NumInputCtrl = modules.common.NumInputCtrl;
    import BagUtil = modules.bag.BagUtil;

    export class ManualGiftModel {
        private static _instance: ManualGiftModel;
        public static get instance(): ManualGiftModel {
            return this._instance = this._instance || new ManualGiftModel();
        }

        public _selectedItem: weightItem;
        public _selectedCheckBox: Button;

        constructor() {
        }
    }

    export class ManualGiftAlert extends ManualGiftAlertUI {

        private _checkBoxArr: Array<Button>;
        private _bagItems: Array<BagItem>;
        private _posArr: Array<number>;

        private _item: Item;
        private _numInputCtrl: NumInputCtrl;

        // private _items: Array<weightItem>;
        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            // this.closeOnSide = false;
            this._numInputCtrl = new NumInputCtrl(this.numInput, this.addBtn, this.minusBtn, this.addTenBtn, this.minusTenBtn);
            this._checkBoxArr = [this.checkBox1, this.checkBox2, this.checkBox3, this.checkBox4,
            this.checkBox5, this.checkBox6, this.checkBox7, this.checkBox8];
            this._bagItems = [];
            this._posArr = [100, 149, 222, 149, 344, 149, 466, 149, 100, 334, 222, 334, 344, 334, 466, 334];

            //改为 list
            this._list = new CustomList();
            this._list.width = 520;
            this._list.height = 386;
            this._list.hCount = 4;
            this._list.spaceX = 10;
            this._list.itemRender = ManualGiftItem;
            this._list.x = 72;
            this._list.y = 130;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.okBtn, Event.CLICK, this, this.okHandler);
            this._numInputCtrl.addListeners();

            // for (let i: int = 0, len = this._checkBoxArr.length; i < len; i++) {
            //     this.addAutoListener(this._checkBoxArr[i], Event.CLICK, this, this.checkBoxHandler);
            // }
        }

        protected removeListeners(): void {
            super.removeListeners();
            this._numInputCtrl.removeListeners();
        }

        private okHandler(): void {
            if (!ManualGiftModel.instance._selectedItem) {
                SystemNoticeManager.instance.addNotice("请选择一种奖励", true);
                return;
            }
            let count: number = this._numInputCtrl.value;
            BagCtrl.instance.useBagItem(this._item[ItemFields.uid], this._item[ItemFields.ItemId], count, ManualGiftModel.instance._selectedItem[weightItemFields.itemId]);
            this.close();
        }

        private checkBoxHandler(e: Event): void {
            // if (!this._items) return;
            // if (ManualGiftModel.instance._selectedCheckBox) ManualGiftModel.instance._selectedCheckBox.selected = false;
            // ManualGiftModel.instance._selectedCheckBox = e.target as Button;
            // ManualGiftModel.instance._selectedCheckBox.selected = true;
            // ManualGiftModel.instance._selectedItem = this._items[this._checkBoxArr.indexOf(this._selectedCheckBox)];
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

            this._item = value;
        }

        public onOpened(): void {
            super.onOpened();
            ManualGiftModel.instance._selectedCheckBox = null;
            ManualGiftModel.instance._selectedItem = null;
            let itemId: number = this._item[ItemFields.ItemId];
            let itemCfg: item_material = CommonUtil.getItemCfgById(itemId) as item_material;
            this.nameTxt.text = itemCfg[item_materialFields.name];
            this.nameTxt.color = CommonUtil.getColorById(itemId);
            let pkgCfg: Configuration.package = PackageCfg.instance.getCfgById(itemCfg[item_materialFields.fixGiftbag][0]);
            let items: Array<weightItem> = pkgCfg[Configuration.packageFields.items];
            this._numInputCtrl.max = this._item[Protocols.ItemFields.count];
            this._numInputCtrl.value = 1;
            // this._items = items;

            // for (let i: int = 0, len: int = this._bagItems.length; i < len; i++) {
            //     this._bagItems[i].removeSelf();
            // }
            // for (let i: int = 0, len: int = items.length; i < len; i++) {
            //     if (!this._bagItems[i]) {
            //         this._bagItems[i] = new BagItem();
            //         this._bagItems[i].pos(this._posArr[i * 2], this._posArr[i * 2 + 1], true);
            //     }
            //     let item: weightItem = items[i];
            //     itemId = item[weightItemFields.itemId];
            //     this._bagItems[i].dataSource = [itemId, item[weightItemFields.count], 0, null];
            //     this.addChild(this._bagItems[i]);
            //     this._checkBoxArr[i].visible = true;
            //     this._checkBoxArr[i].selected = false;
            //     if (CommonUtil.getItemTypeById(itemId) === ItemMType.Rune) {      // 玉荣显示等级
            //         let dimId: number = (itemId * 0.0001 >> 0) * 10000;  //模糊Id
            //         let cfg: item_rune = ItemRuneCfg.instance.getCfgById(dimId);
            //         this._bagItems[i]._nameTxt.text = `${cfg[item_runeFields.name]} Lv.${itemId % 10000}`;
            //     }
            // }
            // for (let i: int = items.length, len: int = 8; i < len; i++) {
            //     this._checkBoxArr[i].visible = false;
            //     this._checkBoxArr[i].selected = false;
            // }

            //修改
            this._list.datas = items;
        }

        public destroy(): void {
            if (this._checkBoxArr) {
                this._checkBoxArr.length = 0;
                this._checkBoxArr = null;
            }
            if (this._bagItems) {
                this._bagItems.length = 0;
                this._bagItems = null;
            }
            if (this._posArr) {
                this._posArr.length = 0;
                this._posArr = null;
            }

            this._item = null;

            // if (this._items) {
            //     // this._items.length = 0;
            //     this._items = null;
            // }
            ManualGiftModel.instance._selectedItem = null;
            ManualGiftModel.instance._selectedCheckBox = null;
            super.destroy();
        }
    }
}