/**圣物激活弹窗*/



namespace modules.talisman {
    import item_materialFields = Configuration.item_materialFields;

    export class TalismanGetAlert extends ui.TalismanGetAlertUI {

        private talismanId: number;

        protected removeListeners(): void {
            Laya.timer.clear(this, this.close);
            super.removeListeners();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.talismanId = value as number;
            this.showInfo();
            Laya.timer.loop(1500, this, this.close);
        }

        protected initialize(): void {
            super.initialize();

            this.clickCD = true;
        }

        public showInfo(): void {
            let cfg = modules.common.CommonUtil.getItemCfgById(this.talismanId);
            this.talismanImg.skin = CommonUtil.getIconById(this.talismanId);
            this.talismanName.text = cfg[item_materialFields.name].toString();
        }
    }
}