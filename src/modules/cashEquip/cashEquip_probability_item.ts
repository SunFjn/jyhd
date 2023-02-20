/**  现金装备-奇珍异宝 item */


namespace modules.cashEquip {
    import CashEquipProbabilityItemUI = ui.CashEquipProbabilityItemUI;
    import cashEquipData = Configuration.cashEquipData;
    import cashEquipDataFields = Configuration.cashEquipDataFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import cash_Equip = Configuration.cashEquip;
    import cash_EquipFields = Configuration.cashEquipFields;
    export class CashEquipProbabilityItem extends CashEquipProbabilityItemUI {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }
        private itemId: number = 0
        protected setSelected(value: boolean): void {
            super.setSelected(value);
            // this.setData(this.iconId)
        }
        // private iconId: number = 0
        protected setData(value: cashEquipData): void {
            super.setData(value);
            this.nameTxt.text = "第" + value[0].toString() + "次"
            this.valueTxt.text = (value[1] / 100) + "%"


        }


    }
}
