///<reference path="../bag/base_item.ts"/>


/** 获得道具提示*/


namespace modules.notice {
    import Image = Laya.Image;
    import Sprite = Laya.Sprite;
    import BaseItem = modules.bag.BaseItem;
    import TweenJS = utils.tween.TweenJS;

    export class ItemNoticeManager {
        // private static _instance: ItemNoticeManager;
        // public static get instance(): ItemNoticeManager {
        //     return this._instance = this._instance || new ItemNoticeManager();
        // }

        private _bg: Image;
        private _con: Sprite;
        private _isPlaying: boolean;
        private _items: Array<Protocols.Item>;
        private _max: int = 4;
        private _itemPool: Array<BaseItem>;
        private _usingBaseItems: Array<BaseItem>;

        constructor() {
            this._con = new Sprite();
            this._con.mouseEnabled = false;
            this._bg = new Image("common/dt_tishi_2.png");
            this._bg.sizeGrid = "28,22,26,24";
            this._con.addChild(this._bg);
            this._bg.size(600, 140);

            this._items = new Array<Protocols.Item>();
            this._itemPool = new Array<BaseItem>();
            this._usingBaseItems = new Array<BaseItem>();
        }

        public addItem(item: Protocols.Item): void {
            this._items.push(item);
            this.check();
        }

        public addItems(items: Array<Protocols.Item>): void {
            for (let i: int = 0, len = items.length; i < len; i++) {
                this._items.push(items[i]);
            }
            this.check();
        }

        private check(): void {
            if (!this._isPlaying) {
                this.tween();
            }
        }

        private tween(): void {
            let max: int = this._max > this._items.length ? this._items.length : this._max;
            let arr: Array<Protocols.Item> = this._items.splice(0, max);
            let baseItem: BaseItem;
            let offsetX: number = 610 - max * 110 >> 1;
            for (let i: int = 0, len = arr.length; i < len; i++) {
                baseItem = this._itemPool.shift() || new BaseItem();
                baseItem.dataSource = arr[i];
                this._con.addChild(baseItem);
                baseItem.pos(offsetX + i * 110, 32, true);
                this._usingBaseItems.push(baseItem);
            }
            LayerManager.instance.addToNoticeLayer(this._con);
            this._isPlaying = true;
            this._con.pos(-600, CommonConfig.viewHeight - 250, true);
            TweenJS.create(this._con).to({x: CommonConfig.viewWidth * 0.5 - 300}, 200).chain(
                TweenJS.create(this._con).delay(400).to({x: CommonConfig.viewWidth}, 200).onComplete(this.completeHandler.bind(this))
            ).start();
        }

        private completeHandler(): void {
            this._con.removeSelf();
            for (let e of this._usingBaseItems) {
                e.dataSource = null;
                e.removeSelf();
                if (this._itemPool.length >= this._max) {
                    e.destroy(true);
                } else {
                    this._itemPool.push(e);
                }
            }
            this._usingBaseItems.length = 0;
            if (this._items.length > 0) {
                this.tween();
            } else {
                this._isPlaying = false;
            }
        }
    }
}