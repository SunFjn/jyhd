/** 地图路径配置*/

namespace modules.config {
    import MapPath = Configuration.MapPath;

    export class MapPathCfg {
        private static _instance: MapPathCfg;
        public static get instance(): MapPathCfg {
            return this._instance = this._instance || new MapPathCfg();
        }

        private _table: Table<MapPath>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = GlobalData.getConfig("map_path");
        }

        // 根据地图ID获取地图路径配置
        public getCfgById(mapId: string): MapPath {
            return this._table[mapId];
        }
    }
}