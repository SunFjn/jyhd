/** 输入数量组件*/



namespace modules.common {
    import Button = Laya.Button;
    import Event = Laya.Event;
    import EventDispatcher = Laya.EventDispatcher;
    import TextInput = Laya.TextInput;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class NumInputCtrl extends EventDispatcher {
        // 增加按钮
        private _addBtn: Button;
        // 减少按钮
        private _minusBtn: Button;
        // 增加十个按钮
        private _addTenBtn: Button;
        // 减少十个按钮
        private _minusTenBtn: Button;
        // 文本框
        private _txt: TextInput;

        // 最大值
        private _max: int = 2147483647;
        // 最小值
        private _min: int = 1;
        // 当前值
        private _value: int;

        private _noticeError: string;

        constructor(txt: TextInput, addBtn: Button, minusBtn: Button, addTenBtn: Button = null, minusTenBtn: Button = null) {
            super();
            this._txt = txt;
            this._txt.maxChars = 10;
            // this._txt.restrict
            this._addBtn = addBtn;
            this._minusBtn = minusBtn;
            this._addTenBtn = addTenBtn;
            this._minusTenBtn = minusTenBtn;

            this.value = this._min;
        }

        public addListeners(): void {
            this._addBtn.on(Event.CLICK, this, this.addHandler);
            this._minusBtn.on(Event.CLICK, this, this.minusHandler);
            if (this._addTenBtn) this._addTenBtn.on(Event.CLICK, this, this.addTenHandler);
            if (this._minusTenBtn) this._minusTenBtn.on(Event.CLICK, this, this.minusTenHandler);
            this._txt.on(Event.CHANGE, this, this.changeHandler);
            this._txt.on(Event.INPUT, this, this.changeHandler);
        }

        public removeListeners(): void {
            this._addBtn.off(Event.CLICK, this, this.addHandler);
            this._minusBtn.off(Event.CLICK, this, this.minusHandler);
            if (this._addTenBtn) this._addTenBtn.off(Event.CLICK, this, this.addTenHandler);
            if (this._minusTenBtn) this._minusTenBtn.off(Event.CLICK, this, this.minusTenHandler);
            this._txt.off(Event.CHANGE, this, this.changeHandler);
            this._txt.off(Event.INPUT, this, this.changeHandler);
        }

        public get max(): int {
            return this._max;
        }

        public set max(value: int) {
            this._max = value;
        }

        public get min(): int {
            return this._min;
        }

        public set min(value: int) {
            this._min = value;
        }

        public get value(): int {
            return this._value;
        }

        public set value(t: int) {
            if (t < this._min) {
                t = this._min;
                if (this._noticeError != null) {
                    SystemNoticeManager.instance.addNotice("已达最小" + this._noticeError, true);
                }
            }
            if (t > this._max) {
                t = this._max;
                if (this._noticeError != null && t === this._value) {
                    SystemNoticeManager.instance.addNotice("已达最大" + this._noticeError, true);
                }
            }
            // if (this._value === t) return;
            this._value = t;
            // 单次道具使用上限表现设置为200
            if (this._value >= 200) {
                this._value = 200;
            }
            this._txt.text = this._value.toString();
            this.event(Event.CHANGE);
        }

        public set notice(value: string) {
            this._noticeError = value;
        }

        private addHandler(): void {
            this.value++;
        }

        private minusHandler(): void {
            this.value--;
        }

        private addTenHandler(): void {
            this.value += 10;
        }

        private minusTenHandler(): void {
            this.value -= 10;
        }

        private changeHandler(): void {
            this.value = this._txt.text || this._txt.text === "0" ? parseInt(this._txt.text) : this._min;
        }
    }
}