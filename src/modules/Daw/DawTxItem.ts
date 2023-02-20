
/** 战力分红子项*/

namespace modules.daw {
    export class DawTxItem extends ui.DawTxItemUI {
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
        private num: number = 0
        protected setData(value: any): void {
            super.setData(value);
            let s = this;
            console.log("value", value)
            s.money.text = "" + value.money + "元"
            s.num = value.tag


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
                this.selebg.skin = `dawtixian/seleon.png`;
            } else {
                this.selebg.skin = `dawtixian/seleoff.png`;
            }

        }
        protected clickHandler() {
            let s = this;
            console.log(s.money.text)
            DawData.ins.TiXianSelect = s.num

        }
    }
}