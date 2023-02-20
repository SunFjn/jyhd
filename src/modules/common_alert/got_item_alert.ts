///<reference path="../bag/bag_item.ts"/>


/** 获得道具弹框*/


namespace modules.commonAlert {
    import Event = Laya.Event;
    import Rectangle = Laya.Rectangle;
    import Sprite = Laya.Sprite;
    import BagItem = modules.bag.BagItem;
    import GotItemAlertUI = ui.GotItemAlertUI;

    export class GotItemAlert extends GotItemAlertUI {

        private _con: Sprite;
        private _items: Array<Protocols.Item>;

        private _lastX: number = 0;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._con = new Sprite();
            this.addChild(this._con);
            this._con.pos(125, 600, true);
        }

        protected addListeners(): void {
            super.addListeners();
            this._con.on(Event.MOUSE_DOWN, this, this.downHandler);
            // this._con.on(Event.MOUSE_WHEEL, this, this.wheelHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this._con.off(Event.MOUSE_DOWN, this, this.downHandler);
            // this._con.off(Event.MOUSE_WHEEL, this, this.wheelHandler);
        }

        private downHandler(): void {
            if (!this._items || this._items.length < 5) return;
            this._lastX = this.mouseX;
            Laya.stage.on(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.on(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.on(Event.MOUSE_OUT, this, this.upHandler);
        }

        private moveHandler(): void {
            console.log("move........................" + this._con.width);
            let tmpRect: Rectangle = this._con.scrollRect;
            tmpRect.x += this._lastX - this.mouseX;
            let maxX: number = this._con.width - 470;
            tmpRect.x = tmpRect.x < 0 ? 0 : tmpRect.x > maxX ? maxX : tmpRect.x;
            this._con.scrollRect = tmpRect;
            this._lastX = this.mouseX;
        }

        private upHandler(): void {
            Laya.stage.off(Event.MOUSE_MOVE, this, this.moveHandler);
            Laya.stage.off(Event.MOUSE_UP, this, this.upHandler);
            Laya.stage.off(Event.MOUSE_OUT, this, this.upHandler);
            console.log("up.........................");
        }

        private wheelHandler(e: Event): void {
            if (!this._items || this._items.length < 5) return;

            this._con.scrollRect = this._con.scrollRect.addPoint(e.delta, 0);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.setItems(value);
        }

        public setItems(items: Array<Protocols.Item>): void {
            this._items = items;
            let num: int = items.length;
            for (let i: int = 0; i < num; i++) {
                let bagItem: BagItem = new BagItem();
                bagItem.dataSource = items[i];
                this._con.addChild(bagItem);
                bagItem.x = i * 120;
            }
            this._con.size(num * 110 + (num - 1) * 10, 120);
            if (num > 4) {    // 超过4个需要滚动条
                this._con.x = 125;
                this._con.scrollRect = new Rectangle(0, 0, 470, 120);
            } else {      // 4个以内不用滚动条
                this._con.x = 125 + (470 - this._con.width >> 1);
                this._con.scrollRect = null;
            }
        }

        // 设置标题
        public setTitle(value: string): void {
            this.titleTxt.text = value;
        }
    }
}