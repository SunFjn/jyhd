/** BOSS之家配置*/


namespace modules.config {
    import scene_home_boss = Configuration.scene_home_boss;
    import scene_home_bossFields = Configuration.scene_home_bossFields;
    import Items = Configuration.Items;

    export class SceneHomeBossCfg {
        private static _instance: SceneHomeBossCfg;
        public static get instance(): SceneHomeBossCfg {
            return this._instance = this._instance || new SceneHomeBossCfg();
        }

        private _layerTable: Table<Array<scene_home_boss>>;
        private _bossIdTable: Table<scene_home_boss>;
        private _totalLayer: Array<scene_home_boss>;
        private _npdIdTable: Table<scene_home_boss>;
        private _tab: Table<scene_home_boss>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._layerTable = {};
            this._bossIdTable = {};
            this._totalLayer = [];
            this._npdIdTable = {};
            this._tab = {};
            let arr: Array<scene_home_boss> = GlobalData.getConfig("scene_home_boss");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: scene_home_boss = arr[i];
                let layer: int = cfg[scene_home_bossFields.level];
                if (!this._tab[layer]) {
                    this._tab[layer] = cfg;
                }
                let levelBoss: Array<scene_home_boss> = this._layerTable[layer];
                if (!levelBoss) {
                    levelBoss = new Array<scene_home_boss>();
                    this._totalLayer.push(cfg);
                }
                levelBoss.push(cfg);
                this._layerTable[layer] = levelBoss;//层数对应boss信息
                this._bossIdTable[cfg[scene_home_bossFields.occ]] = cfg;
                this._npdIdTable[cfg[scene_home_bossFields.npcBox]] = cfg;
            }
        }

        /** 根据层数获取所有boss信息*/
        public getCfgByLayer(layer: int): Array<scene_home_boss> {
            return this._layerTable[layer + 1];
        }

        // 根据BOSSID获取配置
        public getCfgByBossId(bossId: int): scene_home_boss {
            return this._bossIdTable[bossId];
        }

        // 获取全部层数对应的信息
        public getTotalLayerCfg(): Array<scene_home_boss> {
            return this._totalLayer;
        }

        public getCfgByNpcId(id: int): scene_home_boss {
            return this._npdIdTable[id];
        }

        public getCfgByFirstLayer(layer: int): scene_home_boss {
            return this._tab[layer];
        }
    }
}