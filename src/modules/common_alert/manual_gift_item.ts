/**单人boss单元项*/

///<reference path="../config/pay_reward_weight_cfg.ts"/>
///<reference path="../config/pay_reward_cfg.ts"/>
///<reference path="../config/package_cfg.ts"/>
///<reference path="manual_gift_bag_item.ts"/>


namespace modules.commonAlert {
    import CommonUtil = modules.common.CommonUtil;
    import weightItem = Configuration.weightItem;
    import weightItemFields = Configuration.weightItemFields;
    import item_runeFields = Configuration.item_runeFields;
    import item_rune = Configuration.item_rune;
    import ItemRuneCfg = modules.config.ItemRuneCfg;
    import Event = Laya.Event;
    import BagItem = modules.bag.BagItem;
    import ManualGiftBagItem = modules.commonAlert.ManualGiftBagItem;

    export class ManualGiftItem extends ui.ManualGiftAlertItemUI {
        private _date: weightItem;
        private _BagItem: ManualGiftBagItem;

        constructor() {
            super();
        }

        public destroy(): void {
            this._BagItem = this.destroyElement(this._BagItem);
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.changBtn, Event.CLICK, this, this.checkBoxHandler);
        }

        protected setData(item: weightItem): void {
            super.setData(item);
            this._date = item;
            let itemId = item[weightItemFields.itemId];
            if (!this._BagItem) {
                this._BagItem = new ManualGiftBagItem();
                this.addChild(this._BagItem);
                this._BagItem.pos(10, 0);
            }
            this._BagItem.dataSource = [itemId, this._date[weightItemFields.count], 0, null];
            if (CommonUtil.getItemTypeById(itemId) === ItemMType.Rune) {      // 玉荣显示等级
                let dimId: number = (itemId * 0.0001 >> 0) * 10000;  //模糊Id
                let cfg: item_rune = ItemRuneCfg.instance.getCfgById(dimId);
                this._BagItem._nameTxt.text = `${cfg[item_runeFields.name]} Lv.${itemId % 10000}`;
            }
            this.changBtn.selected = false;
        }

        private checkBoxHandler(e: Event): void {
            if (!this._date) return;
            if (ManualGiftModel.instance._selectedCheckBox)
                ManualGiftModel.instance._selectedCheckBox.selected = false;
            this.changBtn.selected = true;
            ManualGiftModel.instance._selectedCheckBox = this.changBtn;
            ManualGiftModel.instance._selectedItem = this._date;
        }

    }
}