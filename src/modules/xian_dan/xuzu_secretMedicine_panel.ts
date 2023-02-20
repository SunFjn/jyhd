///<reference path="../config/xian_dan_cfg.ts"/>
///<reference path="../common/custom_list.ts"/>
/** 仙丹 */
namespace modules.xianDan {
    import XuZuSecretMedicineViewUI = ui.XuZuSecretMedicineViewUI;
    import XuZuIconUI = ui.XuZuIconUI;
    export class XuZuSecretMedicinePanel extends XuZuSecretMedicineViewUI {
        constructor() {
            super();
        }
        private _mediArr: Array<XuZuIconUI>;
        private _selectedMedi:number;
        protected initialize(): void {
            super.initialize();
            this.centerX = this.centerY = 0;

            this._mediArr = new Array<XuZuIconUI>();
            this._mediArr = [this.medicine_1, this.medicine_2, this.medicine_3, this.medicine_4];
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.goBtn, common.LayaEvent.CLICK, this, this.goHandler);
            for (let i: int = 0, len: int = this._mediArr.length; i < len; i++) {
                this.addAutoListener(this._mediArr[i], common.LayaEvent.CLICK, this, this.selectMedicine, [i]);
            }
            this.addAutoListener(this.aboutBtn, common.LayaEvent.CLICK, this, this.aboutHandler);
        }

        private aboutHandler() {

        }

        private selectMedicine(index:number) {
            this._selectedMedi = index;
            for (let i: int = 0, len: int = this._mediArr.length; i < len; i++) {
                this._mediArr[i].selectBg.visible = false;
            }
            this._mediArr[this._selectedMedi].selectBg.visible = true;
        }

        private goHandler() {

        }

        public onOpened(): void {
            super.onOpened();

            this.selectMedicine(0);
        }

        public destroy(): void {
            super.destroy();
            this._mediArr = this.destroyElement(this._mediArr);
        }
    }
}