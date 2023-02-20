/** 天关场景配置*/

namespace modules.config {
    import scene_common = Configuration.scene_common;
    import scene_commonFields = Configuration.scene_commonFields;
    export class SceneCommonCfg {
        private static _instance: SceneCommonCfg;
        public static get instance(): SceneCommonCfg {
            return this._instance = this._instance || new SceneCommonCfg();
        }

        private _table: Map<number, Map<number, scene_common>>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = new Map<number, Map<number, scene_common>>();
            let arr: Array<scene_common> = GlobalData.getConfig(`scene_common`);
            for (let e of arr) {
                let mapId = e[scene_commonFields.mapId]
                let areaId = e[scene_commonFields.areaId]
                let cfg = this._table.get(mapId) || new Map<number, scene_common>();
                cfg.set(areaId, e)
                this._table.set(mapId, cfg)
            }
        }

        // 根据地图ID获取场景配置
        public getCfgById(mapId: int, areaId: number): scene_common {
            if (!this._table.has(mapId)) return null;
            return this._table.get(mapId).get(areaId) || null
        }

        // 根据地图ID获取区域数量
        public getAreaLenById(mapId: int): number {
            if (!this._table.has(mapId)) return 0;
            return this._table.get(mapId).size;


        }
    }
}