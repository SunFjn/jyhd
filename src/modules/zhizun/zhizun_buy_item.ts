/**  圣装 item */


namespace modules.extreme {
    import ZhizunBuyItemUI = ui.ZhizunBuyItemUI;

    export class ZhizunBuyItem extends ZhizunBuyItemUI {

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

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            if (!this.selected) {
                this.listBtn.selected = false;
            } else {
                this.listBtn.selected = true;
            }
        }
        private iconId: number = 0
        protected setData(value: any): void {
            super.setData(value);
            // this.iconId = value as number;
            // extremeModel.instance.getBuyId(extremeModel.instance.getBuyInfo(this.iconId)["value"][0][0]);
            // getBuyId][0]
            this.listBtn.label = extremeModel.instance.getBuyId(value[0])[1];

        }


    }
}
