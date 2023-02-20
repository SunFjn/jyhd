/** 获取途径配置*/


namespace modules.config {
    import get_way = Configuration.get_way;

    export class GetWayCfg {
        private static _instance: GetWayCfg;
        public static get instance(): GetWayCfg {
            return this._instance = this._instance || new GetWayCfg();
        }

        private _table: Table<get_way>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = GlobalData.getConfig("get_way");
        }

        // 根据ID获取配置
        public getCfgById(id: int): get_way {
            if(!this._table[id]){
                throw new Error("get_way表中没有来源" + id);
            }
            return this._table[id];
        }
    }
}