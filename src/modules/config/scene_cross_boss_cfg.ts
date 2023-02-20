/** 三界BOSS配置*/


namespace modules.config {
    import scene_cross_boss = Configuration.scene_cross_boss;
    import scene_cross_bossFields = Configuration.scene_cross_bossFields;

    export class SceneCrossBossCfg {
        private static _instance: SceneCrossBossCfg;
        public static get instance(): SceneCrossBossCfg {
            return this._instance = this._instance || new SceneCrossBossCfg();
        }

        private _table: Table<scene_cross_boss>;
        private _cfgs: Array<scene_cross_boss>;
        private _mapIdTable: Table<Table<scene_cross_boss>>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._mapIdTable = {};
            this._cfgs = GlobalData.getConfig("scene_cross_boss");
            for (let i: int = 0, len: int = this._cfgs.length; i < len; i++) {
                let cfg: scene_cross_boss = this._cfgs[i];
                this._table[cfg[scene_cross_bossFields.occ]] = cfg;
                let table: Table<scene_cross_boss> = this._mapIdTable[cfg[scene_cross_bossFields.mapId]];
                if (!table) {
                    table = {};
                    this._mapIdTable[cfg[scene_cross_bossFields.mapId]] = table;
                }
                table[cfg[scene_cross_bossFields.level]] = cfg;
            }
        }

        public get cfgs(): Array<scene_cross_boss> {
            return this._cfgs;
        }

        // 根据BOSSID获取配置
        public getCfgByBossId(bossId: number): scene_cross_boss {
            return this._table[bossId];
        }

        // 根据地图ID和层数获取配置
        public getCfgByMapIdAndLv(mapId: number, level: number): scene_cross_boss {
            return this._mapIdTable && this._mapIdTable[mapId] ? this._mapIdTable[mapId][level] : null;
        }
    }
}