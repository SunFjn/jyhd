/** 掉落提示管理器*/


namespace modules.notice {
    import TweenJS = utils.tween.TweenJS;

    export class DropNoticeManager {
        private static _instance: DropNoticeManager;
        public static get instance(): DropNoticeManager {
            return this._instance = this._instance || new DropNoticeManager();
        }

        private _panelPool: Array<DropNoticePanel> = new Array<DropNoticePanel>();
        private _items: Array<Protocols.Item> = new Array<Protocols.Item>();
        private _isPlaying: boolean = false;
        private _max: int = 8;
        private _panels: Array<DropNoticePanel> = new Array<DropNoticePanel>();

        constructor() {

        }

        // 获得一个道具
        public addItem(item: Protocols.Item): void {
            this._items.push(item);
            this.check();
        }

        // 获得多个道具
        public addItems(items: Array<Protocols.Item>): void {
            for (let i: int = 0, len: int = items.length; i < len; i++) {
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
            if (this._items.length === 0) return;
            this._isPlaying = true;
            let arr: Array<Protocols.Item> = this._max >= this._items.length ? this._items : this._items.splice(0, this._max);
            let panel: DropNoticePanel;
            for (let i: int = 0, len = arr.length; i < len; i++) {
                panel = this._panelPool.shift() || new DropNoticePanel();
                panel.setItem(arr[i]);
                LayerManager.instance.addToNoticeLayer(panel);
                panel.pos(CommonConfig.viewWidth - panel.width >> 1, CommonConfig.viewHeight - 400, true);
                this._panels.push(panel);

                TweenJS.create(panel).to({y: CommonConfig.viewHeight - 400 - 60 + i * -46}, 1000)
                    .easing(utils.tween.easing.circular.Out)
                    .start();
            }
            TweenJS.create(this).delay(1850).onComplete(this.removeHandler.bind(this)).start();
            arr.length = 0;

            // Tween.to(panel, {y:y}, 1000, Ease.circOut, Handler.create(this, this.moveCompleteHandler, [panel]));
        }

        // 移动完成后停留一段时间消失
        // private moveCompleteHandler = (panel:GotNoticePanel):void => {
        //     Laya.timer.once(800, this, this.removeHandler, [panel], false);
        // }

        private removeHandler(): void {
            for (let i: int = 0, len = this._panels.length; i < len; i++) {
                let panel = this._panels[i];
                panel.setItem(null);
                panel.removeSelf();
                if (this._panelPool.length >= this._max) {
                    panel.destroy(true);
                } else {
                    this._panelPool.push(panel);
                }
            }
            this._panels.length = 0;
            if (this._items.length > 0) {
                this.tween();
            } else {
                this._isPlaying = false;
            }
        }
    }
}