/** 试炼配置*/


namespace modules.config {
    import shilian = Configuration.shilian;
    import shilianFields = Configuration.shilianFields;

    export class ShilianCfg {
        private static _instance: ShilianCfg;
        public static get instance(): ShilianCfg {
            return this._instance = this._instance || new ShilianCfg();
        }

        private _table: Table<shilian>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            let arr: Array<shilian> = GlobalData.getConfig("shilian");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: shilian = arr[i];
                this._table[cfg[shilianFields.level]] = cfg;
            }
        }

        // 根据难度获取配置
        public getCfgByLv(lv: int): shilian {
            return this._table[lv];
        }
    }
}