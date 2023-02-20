namespace modules.rune {
    import RuneItemUI = ui.RuneItemUI;
    import item_rune = Configuration.item_rune;
    import item_runeFields = Configuration.item_runeFields;
    import BagUtil = modules.bag.BagUtil;

    export class RuneItem extends RuneItemUI {

        private _itemId: number;

        protected clickHandler(): void {
            super.clickHandler();
            BagUtil.openBagItemTip([this._itemId + 1, 0, 0, null]);
        }

        public setData(itemId: number, lv: number = 1): void {
            if (!itemId) return;
            this._itemId = itemId;
            let cfg: item_rune = config.ItemRuneCfg.instance.getCfgById(itemId);
            let name: string = cfg[item_runeFields.name];

            this.iconImg.skin = CommonUtil.getIconById(itemId);
            this.nameTxt.text = `${name} Lv.${lv}`;
        }
    }
}