/** 玄火副本提示面板*/

namespace modules.xuanhuo {
    import Image = Laya.Image;
    import HTMLDivElement = Laya.HTMLDivElement;

    export class XuanhuoEnterTipPanel extends BaseView {
        private _bgImg: Image;
        private _txt: HTMLDivElement;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.top = 260;
            this.closeByOthers = false;

            this._bgImg = new Image("common_sg/txtbg_common_tipsbg.png");
            this._bgImg.sizeGrid = "10,90,10,90";
            this.addChild(this._bgImg);
            this.width = this._bgImg.width = 640;
            this.height = this._bgImg.height = 44;

            this._txt = new HTMLDivElement();
            this.addChild(this._txt);
            this._txt.mouseEnabled = false;
            this._txt.size(570, 24);
            this._txt.pos(40, 10, true);
            this._txt.color = "#FFFFFF";
            this._txt.style.fontFamily = "SimHei";
            this._txt.style.fontSize = 24;
            this._txt.style.align = "center";

        }
        public setOpenParam(value): void {
            super.setOpenParam(value);
            let name = value.name

            let desc = value.desc

            this._txt.innerHTML = `<span style="color:#f3081a">${name}</span>${desc}！`;
            
        }
        protected onOpened(): void {
            super.onOpened();



            Laya.timer.once(4000, this, this.close);

        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.close);
        }
    }
}