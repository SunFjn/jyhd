/** 怪物配置*/


namespace modules.config {
    import monster = Configuration.monster;
    import monsterFields = Configuration.monsterFields;

    export class MonsterCfg {
        private static _instance: MonsterCfg;
        public static get instance(): MonsterCfg {
            return this._instance = this._instance || new MonsterCfg();
        }

        private _table: Table<monster>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            let arr: Array<monster> = GlobalData.getConfig("monster");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                this._table[arr[i][monsterFields.occ]] = arr[i];
            }
        }

        // 根据怪物ID获取怪物配置
        public getMonsterById(monsterId: number): monster {
            return this._table[monsterId];
        }
    }
}