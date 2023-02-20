/** 按钮组，只有一个被选中*/


namespace modules.common {
    import Button = Laya.Button;
    import Event = Laya.Event;
    import EventDispatcher = Laya.EventDispatcher;
    import Sprite = Laya.Sprite;
    import Handler = Laya.Handler;

    //事件是 CHANGE
    export class BtnGroup extends EventDispatcher {
        // 按钮组
        private _btns: Sprite[];
        // 旧的选中索引
        private _oldSelectedIndex: int = -1;
        // 选中索引
        private _selectedIndex: int = -1;
        // 旧的选中按钮
        private _oldSelectedBtn: Sprite;
        // 选中按钮
        private _selectedBtn: Sprite;

        // 选中之前的处理函数
        private _canSelectHandler: Handler;

        // 点击时记录信息（用于判断单击）
        private _downX: number;
        private _downY: number;
        private _downTime: number;

        constructor() {
            super();
        }

        // 设置按钮组
        public setBtns(...btns: Array<Sprite>): void {
            if (this._btns && this._btns.length > 0) {
                for (let i: int = 0; i < this._btns.length; i++) {
                    let btn: Sprite = this._btns[i];
                    btn.off(Event.MOUSE_DOWN, this, this.downHandler);
                    btn.off(Event.MOUSE_UP, this, this.upHandler);
                }
            }

            this._btns = btns;

            if (btns && btns.length > 0) {
                for (let i: int = 0; i < btns.length; i++) {
                    let btn: Sprite = btns[i];

                    btn.on(Event.MOUSE_DOWN, this, this.downHandler);
                    btn.on(Event.MOUSE_UP, this, this.upHandler, [i]);
                }
            }
        }

        private downHandler(): void {
            this._downX = Laya.stage.mouseX;
            this._downY = Laya.stage.mouseY;
            this._downTime = Browser.now();
        }

        private upHandler(value: number): void {
            // 偏移小于5且时间小于125才认为是单击
            let offsetX: number = Laya.stage.mouseX - this._downX;
            let offsetY: number = Laya.stage.mouseY - this._downY;
            let offsetT: number = Browser.now() - this._downTime;
            if (offsetX < 5 && offsetX > -5 && offsetY < 5 && offsetY > -5 && offsetT < 300) {
                // this.clickHandler();
                this.btnClickHandler(value);
            }
        }

        public get btns(): Array<Sprite> {
            return this._btns;
        }

        public get oldSelectedBtn(): Sprite {
            return this._oldSelectedBtn;
        }

        public get selectedBtn(): Sprite {
            return this._selectedBtn;
        }

        // 旧的选中索引
        public get oldSelectedIndex(): int {
            return this._oldSelectedIndex;
        }

        // 选中索引
        public get selectedIndex(): int {
            return this._selectedIndex;
        }

        public set selectedIndex(value: int) {
            this.btnClickHandler(value);
        }

        // 是否可选中处理器
        public get canSelectHandler(): Handler {
            return this._canSelectHandler;
        }

        public set canSelectHandler(value: Handler) {
            this._canSelectHandler = value;
        }

        protected btnClickHandler(i: int): void {
            if (!this._canSelectHandler || this._canSelectHandler.runWith(i)) {
                // if (this._selectedIndex != i) {
                if (i == -1) { // -1 为初始化 全部不选中
                    for (const key in this._btns) {
                        let btn: Sprite = this._btns[key]
                        if (btn && <Button>btn) (<Button>btn).selected = false;
                    }
                    this._oldSelectedBtn = null;
                    this._oldSelectedIndex = i;
                    this._selectedIndex = i;
                    this.event(Event.CHANGE);
                    return;
                }
                let btn: Sprite = this._btns[this._selectedIndex];
                if (btn && <Button>btn) (<Button>btn).selected = false;
                this._oldSelectedBtn = btn;
                this._oldSelectedIndex = this._selectedIndex;
                this._selectedIndex = i;
                btn = this._btns[this._selectedIndex];
                if (btn && <Button>btn) (<Button>btn).selected = true;
                this._selectedBtn = btn;
                // 抛出事件
                this.event(Event.CHANGE);
                // }
            }
        }

        public destroy(): void {
            if (this._btns && this._btns.length > 0) {
                for (let i: int = 0; i < this._btns.length; i++) {
                    let btn: Sprite = this._btns[i];
                    btn.off(Event.MOUSE_DOWN, this, this.downHandler);
                    btn.off(Event.MOUSE_UP, this, this.upHandler);
                }
                this._btns.length = 0;
                this._btns = null;
            }
            this._oldSelectedBtn = null;
            this._selectedBtn = null;
        }
    }
}