namespace modules.bag {
    import SmeltUpgradeAlertUI = ui.SmeltUpgradeAlertUI;
    import ItemSmeltCfg = modules.config.ItemSmeltCfg;
    import item_smeltFields = Configuration.item_smeltFields;

    export class SmeltUpgradeAlert extends SmeltUpgradeAlertUI {
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SMELT_UPDATE, this, this.updateSmeltShow);
        }

        private updateSmeltShow(): void {
            let lv = BagModel.instance.smeltLevel;   //当前等级
            let cfg = ItemSmeltCfg.instance.getItemCfgByLevel(lv); //当前等级对应的表中的数据
            if (cfg) {
                this.gradeText.text = `熔炉等级  ${lv}级`;
                this.valueText1.text = `${cfg[item_smeltFields.hp]}`;
                this.valueText2.text = `${cfg[item_smeltFields.attack]}`;
                this.valueText1.visible = this.valueText2.visible = true;
                this.nameText1.visible = this.nameText2.visible = true
            }
        }

        public onOpened(): void {
            super.onOpened();
            this.updateSmeltShow();
            this.zOrder = 1;
        }
    }
}