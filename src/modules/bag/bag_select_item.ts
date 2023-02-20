/** 背包选择单元项*/


namespace modules.bag {
    import BagSelectItemUI = ui.BagSelectItemUI;

    export class BagSelectData {
        public showNum: string;
        public firstColor: string;
        public showTxt: string;
        public txtNum: number;
    }

    export class BagSelectItem extends BagSelectItemUI {
        private _fontWidth: number;
        private _posX: number;
        private _showColor: string;
        private _bagSelectData: BagSelectData;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._fontWidth = 24;
            this._posX = 120;
            this._showColor = "#2d2d2d";
        }

        protected setData(value: any): void {
            super.setData(value);
            this._bagSelectData = value as BagSelectData;
            if (this._bagSelectData.showNum) {  //如果有要显示的数量
                this.showNum.visible = true;
                this.showNum.x = this._posX - this._bagSelectData.txtNum * this._fontWidth;
                this.showNum.text = this._bagSelectData.showNum;
                if (this._bagSelectData.firstColor) { //如果有对应显示的颜色
                    this.showNum.color = this._bagSelectData.firstColor;
                } else {
                    this.showNum.color = this._showColor;
                }
            } else { //没有要显示的数量设置不可见
                this.showNum.visible = false;
            }
            this.showTxt.text = this._bagSelectData.showTxt;
        }
    }
}