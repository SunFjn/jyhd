namespace modules.common {

    import Sprite = Laya.Sprite;
    import Event = Laya.Event;

    export class CustomSlide {

        private _lastY: number;
        private _con: Sprite;
        private _obj: Sprite;

        constructor(con: Sprite, obj: Sprite) {
            this._con = con;
            this._obj = obj;

            this._lastY = 0;
        }

        public destroy(): void {
            this.removeListeners();
            this._con = null;
            this._obj = null;
        }

        public addListeners(): void {
            this._obj.on(common.LayaEvent.MOUSE_DOWN, this, this.downHandler);
            this._obj.on(common.LayaEvent.MOUSE_WHEEL, this, this.wheelHandler);
        }
        public removeListeners(): void {
            if (!this._obj) return;
            this._obj.off(common.LayaEvent.MOUSE_DOWN, this, this.downHandler);
            this._obj.off(common.LayaEvent.MOUSE_WHEEL, this, this.wheelHandler);
        }

        private downHandler(): void {
            this._lastY = this._obj.mouseY;
            Laya.stage.on(common.LayaEvent.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.on(common.LayaEvent.MOUSE_UP, this, this.upHandler);
            Laya.stage.on(common.LayaEvent.MOUSE_OUT, this, this.upHandler);
        }

        private wheelHandler(e: Event): void {
            let offset: number = e.delta * -8;
            this.scroll(offset);
        }

        private moveHandler(): void {
            let offset: number = this._lastY - this._obj.mouseY;
            this.scroll(offset);
            this._lastY = this._obj.mouseY;
        }

        private upHandler(): void {
            Laya.stage.off(common.LayaEvent.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.off(common.LayaEvent.MOUSE_UP, this, this.upHandler);
            Laya.stage.off(common.LayaEvent.MOUSE_OUT, this, this.upHandler);
        }

        // 滚动偏移（相对于当前滚动位置的偏移）
        public scroll(offset: number): void {
            this._obj.y = this._obj.y - offset;
            if (this._obj.y < this._con.height - this._obj.height) {
                this._obj.y = this._con.height - this._obj.height;
                this._lastY = this._obj.y;
            } else if (this._obj.y > 0) {
                this._lastY = this._obj.y = 0;
            }
        }

        public initState(objH: number = this._obj.height): void {
            if (objH < this._con.height) {
                let y: number = (this._con.height - objH) / 2;
                this._obj.y = y;
                this.removeListeners();
            } else {
                this.addListeners();
            }
        }
    }
}