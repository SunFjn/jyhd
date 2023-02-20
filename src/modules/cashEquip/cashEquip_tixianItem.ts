
/** 现金装备 提现item*/

namespace modules.cashEquip {
    export class CashEquipTxItem extends ui.CashEquipTxItemUI {
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this.createEffect();
        }
        protected addListeners(): void {
            super.addListeners();

        }
        public onOpened(): void {
            super.onOpened();

        }
        protected setData(value: any): void {
            super.setData(value);
            let s = this;
            s.money.text = "" + value.money + "元"
        }
        private sureBtnHandler() {

        }
        private gotoBtnHandler() {
            //跳转面板或场景

        }
        private createEffect() {

        }
        public close(): void {
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
        protected setSelected(value: boolean): void {
            // if (this._reviveTime - GlobalData.serverTime > 0) {
            //     return;
            // }
            super.setSelected(value);
            if (this.selected) {
                this.selebg.skin = `cashEquip/btn_je_0@2x.png`;
                this.money.color = "#D54C30"
            } else {
                this.selebg.skin = `cashEquip/btn_je_1@2x.png`;
                this.money.color = "#FFFD76"
            }

        }
        protected clickHandler() {
            let s = this;



        }


    }
}