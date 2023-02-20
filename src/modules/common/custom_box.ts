/** 带滑动的盒子（溢出隐藏滚动条）*/
namespace modules.common {
    import Sprite = Laya.Sprite;
    import Event = Laya.Event;
    import Rectangle = Laya.Rectangle;

    //事件是 SELECT
    export class CustomBox extends Sprite {

        // 容器
        private _con: Sprite;
        private _lastPos: number = 0;
        private _dPos: number = 0;

        // 滚动方向，1竖向（默认），2横向
        private _scrollDir: int;
        // 滚动位置
        private _scrollPos: number;
        // 惯性滚动
        private _gxScroll: number;
        // 按下时间
        private _lastTime: number;

        constructor() {
            super();
            this._scrollDir = 1;
            this._scrollPos = 0;
            this._gxScroll = 0;

            this._con = new Sprite();
            super.addChild(this._con);
            this.on(Event.DISPLAY, this, this.displayHandler);
            this.on(Event.UNDISPLAY, this, this.undisplayHandler);
        }

        private displayHandler(): void {
            this._con.on(Event.MOUSE_DOWN, this, this.downHandler);
            this._con.on(Event.MOUSE_WHEEL, this, this.wheelHandler);
        }

        private undisplayHandler(): void {
            this._con.off(Event.MOUSE_DOWN, this, this.downHandler);
            this._con.off(Event.MOUSE_WHEEL, this, this.wheelHandler);
        }

        private downHandler(): void {
            this.clearGx();
            this._lastPos = this._scrollDir === 1 ? this._con.mouseY : this._con.mouseX;
            this._dPos = this._scrollDir === 1 ? this.mouseY : this.mouseX;
            this._lastTime = GlobalData.serverTime;
            Laya.stage.on(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.on(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.on(Event.MOUSE_OUT, this, this.upHandler);
        }

        private moveHandler(): void {
            let offset: number = this._lastPos - (this._scrollDir === 1 ? this._con.mouseY : this._con.mouseX);
            this.scroll(offset);
            this._lastPos = this._scrollDir === 1 ? this._con.mouseY : this._con.mouseX;
        }

        private upHandler(): void {
            if (GlobalData.serverTime - this._lastTime < 200) {
                let offset: number = this._dPos - (this._scrollDir === 1 ? this.mouseY : this.mouseX);
                if (Math.abs(offset) > 5 && Math.abs(this._gxScroll) <= 5) {
                    this._gxScroll = offset;
                    Laya.timer.frameLoop(1, this, this.gxScroll);
                }
            }

            Laya.stage.off(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.off(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.off(Event.MOUSE_OUT, this, this.upHandler);
        }

        private wheelHandler(e: Event): void {
            let offset: number = e.delta * -8;
            this.scroll(offset);
        }

        // 清除惯性定时器
        private clearGx() {
            this._gxScroll = 0;
            Laya.timer.clear(this, this.gxScroll);
        }

        // 惯性定时器回调
        private gxScroll() {
            if (Math.abs(this._gxScroll) <= 5)
                return this.clearGx();
            this._gxScroll *= 0.95;
            this.scroll(this._gxScroll);
        }

        // 滚动偏移（相对于当前滚动位置的偏移）
        public scroll(offset: number): void {
            if (this._scrollDir === 1 ? this._con.height < this.height : this._con.width < this.width) return;
            let rect: Rectangle = this._con.scrollRect;
            // 纵向
            if (this._scrollDir === 1) {
                rect.y = rect.y + offset;
                if (rect.y < 0) {
                    rect.y = 0;
                }
                else if (rect.y > this._con.height - this.height) {
                    rect.y = this._con.height - this.height;
                }
                this._scrollPos = rect.y;
            }
            // 横向
            else if (this._scrollDir === 2) {
                rect.x = rect.x + offset;
                if (rect.x < 0) {
                    rect.x = 0;
                }
                else if (rect.x > this._con.width - this.width) {
                    rect.x = this._con.width - this.width;
                }
                this._scrollPos = rect.x;
            }
            this._con.scrollRect = rect;
        }

        // 滚动至某位置
        public scrollTo(pos: number): void {
            if (this._scrollDir === 1 ? this._con.height < this.height : this._con.width < this.width) {
                this._scrollPos = 0;
                return;
            }
            let rect: Rectangle = this._con.scrollRect;
            if (this._scrollDir === 1) {
                rect.y = pos;
                if (rect.y < 0) rect.y = 0;
                else if (rect.y > this._con.height - this.height) {
                    rect.y = this._con.height - this.height;
                }
                this._scrollPos = rect.y;
            } else if (this._scrollDir === 2) {
                rect.x = pos;
                if (rect.x < 0) rect.x = 0;
                else if (rect.x > this._con.width - this.width) {
                    rect.x = this._con.width - this.width;
                }
                this._scrollPos = rect.x;
            }
            this._con.scrollRect = rect;
        }

        // 滚动方向
        public get scrollDir(): int {
            return this._scrollDir;
        }

        public set scrollDir(value: int) {
            this._scrollDir = value;
        }

        // 滚动位置
        public get scrollPos(): number {
            return this._scrollPos;
        }

        public set scrollPos(value: number) {
            this.scrollTo(value);
        }

        /**
         * 重新添加元素，元素内容改变时重新调用（如：txt、innerHTML值发生变化时，元素大小会发生变化）
         * @param node 添加到con的ui元素
         * @returns 
         */
        public resetChild(node: Sprite): Sprite {
            this._con.removeChildren();
            this._con.addChild(node);
            node.on(Laya.Event.CHANGE, this, this.childResize, [node,1])
            node.on(Laya.Event.CHANGED, this, this.childResize, [node,2])
            // 先设置好box大小再add，box大小没有监听，可视区域不准确
            this._con.scrollRect = new Rectangle(0, 0, this.width, this.height);
            this._con.size(node.width, node.height);

            return this;
        }

        private childResize(node: Sprite,u) {
            console.log("childResize",node,u)
            this._con.size(node.width, node.height);
        }

    }
}