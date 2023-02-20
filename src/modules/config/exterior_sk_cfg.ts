/** 外观配置*/

namespace modules.config {
    import ExteriorSK = Configuration.ExteriorSK;

    export class ExteriorSKCfg {
        private static _instance: ExteriorSKCfg;
        public static get instance(): ExteriorSKCfg {
            return this._instance = this._instance || new ExteriorSKCfg();
        }

        private _table: Table<ExteriorSK>;
        private _preTable: Table<ExteriorSK>;

        constructor() {
            this._preTable = {};
            this._preTable[1001] = [1001, "zhujue/nanzhu.sk", "新手时装男", 0, 1, 0, null, 0, 0, 0.6, 0, 0];
            this._preTable[1002] = [1002, "zhujue/nvzhu.sk", "女主出场", 0, 1, 0, null, 0, 0, 0.6, 0, 0];
            this._preTable[5001] = [5001, "WQ/Weapon_1.sk", "新手幻武", 0, 1, 0, null, 0, 0, 0.18, 0, 0];
            this._preTable[3002] = [3002, "wing/Wing_2.sk", "山海紫羽", 0, 1, 0, null, 0, 0, 0.18, 0, 0];

            this.init();
        }

        private init(): void {
            this._table = GlobalData.getConfig("exterior_sk");
        }

        // 根据外观ID获取外观配置
        public getCfgById(id: int): ExteriorSK {

            // 时装id转外观id   9开头的时装区分男女 occ： 1是男 2是女
            if (Math.floor(id * 0.0001) === 9 && id % 10 === 0) {
                id = id + PlayerModel.instance.occ;
            }

            if (!this._table) {
                this._table = GlobalData.getConfig("exterior_sk");
                if (!this._table) {
                    return this._preTable[id];
                }
            }
            return this._table[id];
        }
    }
}