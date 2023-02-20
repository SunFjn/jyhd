/** 仙女配置*/

namespace modules.config {
    import fairy = Configuration.fairy;
    import fairyFields = Configuration.fairyFields;

    export class FairyCfg {
        private static _instance: FairyCfg;
        public static get instance(): FairyCfg {
            return this._instance = this._instance || new FairyCfg();
        }

        private _table: Table<fairy>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            let arr: Array<fairy> = GlobalData.getConfig("fairy");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                this._table[arr[i][fairyFields.id]] = arr[i];
            }
        }

        // 根据外观ID获取外观配置
        public getCfgById(id: int): fairy {
            return this._table[id];
        }
    }
}