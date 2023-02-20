/** 怪物资源配置*/

namespace modules.config {
    import MonsterRes = Configuration.MonsterRes;

    export class MonsterResCfg {
        private static _instance: MonsterResCfg;
        public static get instance(): MonsterResCfg {
            return this._instance = this._instance || new MonsterResCfg();
        }

        private _table: Table<MonsterRes>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = GlobalData.getConfig("monster_res");
        }

        // 根据怪物ID获取配置
        public getCfgById(id: int): MonsterRes {
           
            return this._table[id];
        }
    }
}