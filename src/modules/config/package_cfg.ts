/** 礼包配置*/

namespace modules.config {

    export class PackageCfg {
        private static _instance: PackageCfg;
        public static get instance(): PackageCfg {
            return this._instance = this._instance || new PackageCfg();
        }

        constructor() {
            this.init();
        }

        private _table: Table<Configuration.package>;

        private init(): void {
            this._table = {};
            let arr: Array<Configuration.package> = GlobalData.getConfig("package");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: Configuration.package = arr[i];
                this._table[cfg[Configuration.packageFields.id]] = cfg;
            }
        }

        // 根据礼包ID获取礼包配置
        public getCfgById(packageId: number): Configuration.package {
            return this._table[packageId];
        }
    }
}