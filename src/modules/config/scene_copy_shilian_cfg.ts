/** 日常副本配置*/


namespace modules.config {
    import scene_copy_shilian = Configuration.scene_copy_shilian;
    import scene_copy_shilianFields = Configuration.scene_copy_shilianFields;

    export class SceneCopyShilianCfg {
        private static _instance: SceneCopyShilianCfg;
        public static get instance(): SceneCopyShilianCfg {
            return this._instance = this._instance || new SceneCopyShilianCfg();
        }

        private _table: Table<Table<scene_copy_shilian>>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            let arr: Array<scene_copy_shilian> = GlobalData.getConfig("scene_copy_shilian");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let t: Table<scene_copy_shilian> = this._table[arr[i][scene_copy_shilianFields.mapId]];
                if (!t) {
                    t = {};
                    this._table[arr[i][scene_copy_shilianFields.mapId]] = t;
                }
                t[arr[i][scene_copy_shilianFields.ware]] = arr[i];
            }
        }

        // 根据副本ID和波数获取配置
        public getCfgGetMapAndWare(mapId: number, ware: number) {
            return this._table[mapId][ware];
        }
    }
}