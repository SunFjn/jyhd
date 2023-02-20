/** 滑动条控制器*/


namespace modules.common {
    import EventDispatcher = Laya.EventDispatcher;
    import Image = Laya.Image;
    import Sprite = Laya.Sprite;

    export class SlideCtrl extends EventDispatcher {
        // 增加按钮
        private _addBtn: Image;
        // 减少按钮
        private _minusBtn: Image;
        // 滑块按钮
        private _slideBtn: Image;

        // 步长（点击一次加的量）
        private _step: number;
        // 最大值
        private _max: number;
        // 最小值
        private _min: number;
        // 当前值
        private _value: number;
        // 初始坐标
        private _startPos: number;
        // 结束坐标
        private _endPos: number;
        // 鼠标点下时的坐标
        private _downPos: number;

        constructor(min: number, max: number, step: number, startPos: number, endPos: number, slideBtn: Sprite, addBtn: Sprite = null, minusBtn: Sprite = null) {
            super();
            if (!step) throw new Error("step值不合法");
            if (!max || max < 0) throw new Error("max值不合法");
            if (!min && min !== 0) throw new Error("min值不合法");
            this._step = step;
            this._max = max;
            this._min = min;
            this._startPos = startPos;
            this._endPos = endPos;
            this._value = 0;
            this._slideBtn.anchorX = this._slideBtn.anchorY = 0.5;
        }

        public addListeners(): void {
            this._addBtn && this._addBtn.on(LayaEvent.CLICK, this, this.addHandler);
            this._minusBtn && this._minusBtn.on(LayaEvent.CLICK, this, this.minusHandler);
            this._slideBtn.on(LayaEvent.MOUSE_DOWN, this, this.downHandler);
            this._slideBtn.on(LayaEvent.MOUSE_UP, this, this.upHandler);
        }

        public removeListeners(): void {
            this._addBtn && this._addBtn.off(LayaEvent.CLICK, this, this.addHandler);
            this._minusBtn && this._minusBtn.off(LayaEvent.CLICK, this, this.minusHandler);
            this._slideBtn.off(LayaEvent.MOUSE_DOWN, this, this.downHandler);
            this._slideBtn.off(LayaEvent.MOUSE_UP, this, this.upHandler);
            this.upHandler();
        }

        // 步长
        public get step(): number {
            return this._step;
        }
        public set step(value: number) {
            if (this._step === value) return;
            this._step = value;
        }

        // 最大值
        public get max(): number {
            return this._max;
        }
        public set max(value: number) {
            if (this._max === value) return;
            this._max = value;
        }

        // 最小值
        public get min(): number {
            return this._min;
        }
        public set min(value: number) {
            if (this._min === value) return;
            this._min = value;
        }

        // 值
        public get value(): number {
            return this._value;
        }
        public set value(t: number) {
            if (t > this._max) t = this._max;
            if (t < this._min) t = this._min;
            if (this._value === t) return;
            this._value = t;
            this._slideBtn.x = this._startPos + (this._endPos - this._startPos) / this._max * this._value;
            this.event(LayaEvent.CHANGE);
        }

        // 增加
        private addHandler(): void {
            this.value = this._value + this._step;
        }

        // 减少
        private minusHandler(): void {
            this.value = this._value - this._step;
        }

        private downHandler(): void {
            this._downPos = Laya.stage.mouseX;
            Laya.stage.on(LayaEvent.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.on(LayaEvent.MOUSE_OUT, this, this.upHandler);
        }

        private upHandler(): void {
            Laya.stage.off(LayaEvent.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.off(LayaEvent.MOUSE_OUT, this, this.upHandler);
        }

        private moveHandler(): void {
            let offsetX: number = Laya.stage.mouseX - this._downPos;
            offsetX = Math.round(offsetX / this.max);
            this.value = this._value + offsetX;
        }

        // 销毁
        public destroy(): void {
            this.removeListeners();
            this._addBtn = null;
            this._minusBtn = null;
            this._slideBtn = null;
        }
    }
}