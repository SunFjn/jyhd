namespace modules.treasure {
    import item_equipFields = Configuration.item_equipFields;

    export class TreasureTalismanItem extends ui.TreasureTalismanItemUI {
        protected setData(value: any): void {
            super.setData(value);
            let id = value;
            this.icon.skin = CommonUtil.getIconById(id, false);
            this.nameTxt.color = CommonUtil.getColorById(id);
            this.nameTxt.text = CommonUtil.getItemCfgById(id)[item_equipFields.name].toString();
        }

        protected addListeners(): void {

        }
    }
}
