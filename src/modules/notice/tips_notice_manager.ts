/** 掉落提示管理器*/


namespace modules.notice {
    import TweenJS = utils.tween.TweenJS;

    export class TipsNoticeManager {
        private static _instance: TipsNoticeManager;
        public static get instance(): TipsNoticeManager {
            return this._instance = this._instance || new TipsNoticeManager();
        }

        private _panelPool: Array<TipsNoticePanel> = new Array<TipsNoticePanel>();
        private _items: Array<[string, string]> = new Array<[string, string]>();
        private _isPlaying: boolean = false;
        private _max: int = 3;
        private _panels: Array<TipsNoticePanel> = new Array<TipsNoticePanel>();

        constructor() {

        }

        // 获得一个道具
        public addItem(item: [string, string]): void {
            this._items.push(item);
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
            let arr: Array<[string, string]> = this._max >= this._items.length ? this._items : this._items.splice(0, this._max);
            let panel: TipsNoticePanel;
            for (let i: int = 0, len = arr.length; i < len; i++) {
                panel = this._panelPool.shift() || new TipsNoticePanel();
                panel.setTxt(arr[i]);
                LayerManager.instance.addToNoticeLayer(panel);
                panel.pos(CommonConfig.viewWidth - panel.width >> 1, 320, true);
                this._panels.push(panel);

                TweenJS.create(panel).to({ y: 320 - 60 + i * -46 }, 500)
                    .easing(utils.tween.easing.circular.Out)
                    .start();
            }
            TweenJS.create(this).delay(1000).onComplete(this.removeHandler.bind(this)).start();
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
                panel.setTxt(null);
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