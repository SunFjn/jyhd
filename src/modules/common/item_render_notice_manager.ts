namespace modules.common {
    import TweenGroup = utils.tween.TweenGroup;

    export class ItemRenderNoticeManager {
        private static _instance: ItemRenderNoticeManager;
        public static get instance(): ItemRenderNoticeManager {
            return this._instance = this._instance || new ItemRenderNoticeManager();
        }

        private _tweenGroup: TweenGroup;
        public index: number;

        public addNotice(itemRender: ItemRender, eventType: CommonEventType): void {
            if (!this._tweenGroup) this._tweenGroup = new TweenGroup();
            for (let e of this._tweenGroup.getAll()) {
                if (e.isPlaying) {
                    return;
                }
            }
            let chuShiX = itemRender.x;

            let initX: number = itemRender.x;
            let endX: number = initX + itemRender.width + 70;

            TweenJS.create(itemRender, this._tweenGroup).to({ x: endX, alpha: 0.5 }, 300).onComplete(() => {
                itemRender.x = 70 - endX;
                TweenJS.create(itemRender, this._tweenGroup).to({ x: initX, alpha: 1 }, 300).onComplete(() => {
                    this.index = null;
                    GlobalData.dispatcher.event(eventType);
                    this._tweenGroup.destroy();
                    this._tweenGroup = null;
                }).onStop(() => {
                    this.index = null;
                    if (itemRender) {
                        itemRender.alpha = 1;
                        itemRender.x = chuShiX;
                    }
                }).easing(utils.tween.easing.circular.InOut).start();
            }).onStop(() => {
                this.index = null;
                if (itemRender) {
                    itemRender.alpha = 1;
                    itemRender.x = chuShiX;
                }
            }).start();
        }

        public stop(): void {
            this.index = null;

            if (this._tweenGroup) {
                this._tweenGroup.removeAll();
                this._tweenGroup.destroy();
                this._tweenGroup = null;
            }
        }

        public get isPlaying(): boolean {
            if (!this._tweenGroup) return false;
            for (let ele of this._tweenGroup.getAll()) {
                if (ele.isPlaying) {
                    return true;
                }
            }
            return false;
        }
    }
}