/** 底部tab*/
namespace modules.bottomTab {
    export class BottomTabModel {
        private static _instance: BottomTabModel;
        public static get instance(): BottomTabModel {
            return this._instance = this._instance || new BottomTabModel();
        }

        private _table: Table<boolean>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
        }

        // 根据面板ID设置面板红点
        // public set
    }
}