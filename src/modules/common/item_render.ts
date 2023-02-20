/** 单元项渲染器*/


namespace modules.common {
    import BaseView = modules.core.BaseView;
    import Event = Laya.Event;

    export class ItemRender extends BaseView implements IItemRender {
        // 是否可选中（默认可选中）
        protected _selectEnable: boolean;
        // 是否选中
        private _selected: boolean;
        // 数据
        protected _data: any;

        // 点击时记录信息（用于判断单击）
        private _downX: number;
        private _downY: number;
        private _downTime: number;

        // 索引
        public index: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._selectEnable = true;
        }

        public get selectEnable(): boolean {
            return this._selectEnable;
        }

        public set selectEnable(value: boolean) {
            this._selectEnable = value;
        }

        protected undisplayHandler(): void {
            super.undisplayHandler();
            this.close();
        }

        public close(): void {
            // this.removeSelf();
        }

        protected addListeners(): void {
            super.addListeners();

            // 原生点击事件不准确
            this.on(Event.MOUSE_DOWN, this, this.downHandler);
            this.on(Event.MOUSE_UP, this, this.upHandler);
            this.on(Event.MOUSE_OUT,this,this.outHandler)
        }

        protected removeListeners(): void {
            super.removeListeners();

            this.off(Event.MOUSE_DOWN, this, this.downHandler);
            this.off(Event.MOUSE_UP, this, this.upHandler);
            this.off(Event.MOUSE_OUT,this,this.outHandler)
        }

        protected downHandler(): void {
            this._downX = Laya.stage.mouseX;
            this._downY = Laya.stage.mouseY;
            this._downTime = Browser.now();
        }
        protected outHandler(){

        }
        protected upHandler(): void {
            // 偏移小于5且时间小于125才认为是单击
            let offsetX: number = Laya.stage.mouseX - this._downX;
            let offsetY: number = Laya.stage.mouseY - this._downY;
            let offsetT: number = Browser.now() - this._downTime;
            if (offsetX < 5 && offsetX > -5 && offsetY < 5 && offsetY > -5 && offsetT < 300) {
                this.clickHandler();
            }

        }

        protected clickHandler(): void {

        }

        // 是否选中
        public get selected(): boolean {
            return this._selected;
        }

        public set selected(value: boolean) {
            this.setSelected(value);
        }

        protected setSelected(value: boolean): void {
            this._selected = value;
        }

        // 数据
        public get data(): any {
            return this._data;
        }

        public set data(value: any) {
            this.setData(value);
        }

        protected setData(value: any): void {
            this._data = value;
        }
    }
}