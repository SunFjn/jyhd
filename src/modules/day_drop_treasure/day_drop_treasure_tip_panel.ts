/** 天降圣物进入副本提示面板*/
namespace modules.day_drop_treasure {
    import Image = Laya.Image;
    import HTMLDivElement = Laya.HTMLDivElement;

    export class DayDropTreasureTipPanel extends BaseView {
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
            this.layer = ui.Layer.MAIN_UI_LAYER;
            this._bgImg = new Image("common_sg/txtbg_common_tipsbg.png");
            this._bgImg.sizeGrid = "10,90,10,90";
            this.addChild(this._bgImg);
            this.width = this._bgImg.width = 640;
            this.height = this._bgImg.height = 44;
            this._txt = new HTMLDivElement();
            this.addChild(this._txt);
            this._txt.mouseEnabled = false;
            this._txt.size(560, 24);
            this._txt.pos(40, 10, true);
            this._txt.color = "#FFFFFF";
            this._txt.style.fontFamily = "SimHei";
            this._txt.style.fontSize = 24;
            this._txt.style.align = "center";
            this._txt.innerHTML = `点击下方<span style="color:#EA8706">驭灵宝箱</span>或<span style="color:#EA8706">秘宝宝箱</span>自动采集`;//
        }

        protected onOpened(): void {
            super.onOpened();
            Laya.timer.once(4000, this, this.close);
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.close);
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
    }
}