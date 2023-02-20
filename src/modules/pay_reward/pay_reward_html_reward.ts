
namespace modules.pay_reward {
    export class HtmlReward extends laya.html.dom.HTMLDivElement {
        private startY = 0;
        private _hight = 0;
        private _oneBoll = true;
        private _twoBoll = true;
        private _threeBoll = true;
        public _htmlArr: Array<HtmlReward>;//全服记录修改
        constructor(width: number, fontSize: number, _htmlArr: Array<HtmlReward>) {
            super();
            this._htmlArr = _htmlArr;
            this.innerHTML = "";
            this.width = width;
            this.style.fontFamily = "SimHei";
            this.style.align = "left";
            this.style.fontSize = fontSize;
        }
        public setText(y: number, hight: number, str: string) {
            if (str) {
                this.innerHTML = str;
            }
            this.startY = y;
            this._hight = hight;
            this._oneBoll = false;
            this._twoBoll = false;
            this._threeBoll = false;
            this.pos(0, this.startY);
            this.visible = true;
        }
        public closeTimer() {
            this._oneBoll = true;
            this._twoBoll = true;
            this._threeBoll = true
        }
        public updateList(): void {
            if (!this._threeBoll) {
                this.y -= 1 * (Laya.stage.frameRate === Laya.Stage.FRAME_SLOW ? 2 : 1);
                if (this.y <= (this._hight - this.contextHeight) && !this._oneBoll) {
                    this._oneBoll = true;
                    //生成下一个
                    GlobalData.dispatcher.event(CommonEventType.PAYREWARD_SHOWHTML);
                }
                if (this.y <= - this.contextHeight && !this._twoBoll) {
                    this._twoBoll = true;
                    this._threeBoll = true;
                    this.visible = false;
                }
            }
        }
        public destroy(destroyChild: boolean = true): void {
            Laya.timer.clear(this, this.updateList);
            super.destroy(destroyChild);
        }
    }
}