/** 多人BOSS*/


namespace modules.multiBoss {
    import BaseCtrl = modules.core.BaseCtrl;

    export class MultiBossCtrl extends BaseCtrl {
        private static _instance: MultiBossCtrl;
        public static get instance(): MultiBossCtrl {
            return this._instance = this._instance || new MultiBossCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {

        }
    }
}