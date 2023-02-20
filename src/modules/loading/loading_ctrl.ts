/** 加载控制器*/

namespace modules.loading {
    import Set = utils.collections.Set;

    export class LoadingCtrl {
        private static _instance: LoadingCtrl;
        public static get instance(): LoadingCtrl {
            return this._instance = this._instance || new LoadingCtrl();
        }

        private _locks: Set<number>;
        private _blackLoading: LoadingBlackPanel;
        private _whiteLoading: LoadingWhitePanel;

        constructor() {
            this._locks = new Set<number>();
        }

        // type 0代表面板加载，1代表场景加载
        public showLoading(id: number, type: number = 0): void {
            this._locks.add(id);
            if (type === 0) {
                if (!this._blackLoading) {
                    this._blackLoading = new LoadingBlackPanel();
                }
                LayerManager.instance.addToLoadingLayer(this._blackLoading);
            } else if (type === 1) {
                if (!this._whiteLoading) {
                    this._whiteLoading = new LoadingWhitePanel();
                }
                LayerManager.instance.addToLoadingLayer(this._whiteLoading);
            }
        }

        public hideLoading(id: number, type: number = 0): void {
            this._locks.del(id);
            if (!this._locks.isEmpty()) {
                return;
            }
            if (type === 0 && this._blackLoading) this._blackLoading.removeSelf();
            if (type === 1 && this._whiteLoading) this._whiteLoading.removeSelf();
        }
    }
}