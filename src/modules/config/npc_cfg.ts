namespace modules.config {

    import npc = Configuration.npc;
    import npcFields = Configuration.npcFields;

    export class NpcCfg {
        private static _instance: NpcCfg;
        public static get instance(): NpcCfg {
            return this._instance = this._instance || new NpcCfg();
        }

        private _table: Table<npc>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            let arr = GlobalData.getConfig("npc");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                this._table[arr[i][npcFields.id]] = arr[i];
            }
        }

        // 根据怪物ID获取怪物配置
        public getCfgById(id: number): npc {
            return this._table[id];
        }
    }
}