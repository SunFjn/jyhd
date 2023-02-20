///<reference path="../common/custom_slide.ts"/>
/** 仙府-家园熔炼详情弹框 */
namespace modules.xianfu {
    import XianfuSmeltDetailsAlertUI = ui.XianfuSmeltDetailsAlertUI;
    import CustomSlide = common.CustomSlide;

    export class XianfuSmeltDetailsAlert extends XianfuSmeltDetailsAlertUI {

        private _param: string;
        private _slide: CustomSlide;

        protected initialize(): void {
            super.initialize();

            this.txt.color = "#2d2d2d";
            this.txt.style.fontFamily = "SimHei";
            this.txt.style.fontSize = 24;
            this.txt.style.valign = "middle";
            this.txt.style.lineHeight = 28;

            this._slide = new CustomSlide(this.con, this.txt);
        }

        protected removeListeners(): void {
            this._slide.removeListeners();
            super.removeListeners();
        }

        public destroy(): void {
            this._slide = this.destroyElement(this._slide);
            super.destroy();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._param = value;
        }

        public onOpened(): void {
            super.onOpened();
            this.txt.innerHTML = this._param;
            let txtH: number = this.txt.contextHeight;
            this._slide.initState(txtH);
        }
    }
}