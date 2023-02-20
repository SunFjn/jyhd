/** 九天之巅进入副本提示面板*/

namespace modules.nine {
    import Image = Laya.Image;
    import HTMLDivElement = Laya.HTMLDivElement;

    export class NineEnterTipPanel extends BaseView {
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
            this._txt.size(560, 24);
            this._txt.pos(40, 10, true);
            this._txt.color = "#FFFFFF";
            this._txt.style.fontFamily = "SimHei";
            this._txt.style.fontSize = 24;
            this._txt.style.align = "center";
            this._txt.innerHTML = `战斗开始，点击下方<span style="color:#EA8706">搜敌按钮</span>或<span style="color:#EA8706">玩家列表</span>发起攻击！`;
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