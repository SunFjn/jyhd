/** 多人BOSS配置*/


namespace modules.config {
    import scene_multi_boss = Configuration.scene_multi_boss;
    import scene_multi_bossFields = Configuration.scene_multi_bossFields;

    export class SceneMultiBossCfg {
        private static _instance: SceneMultiBossCfg;
        public static get instance(): SceneMultiBossCfg {
            return this._instance = this._instance || new SceneMultiBossCfg();
        }

        // private _table:Table<scene_multi_boss>;
        private _lvTable: Table<scene_multi_boss>;
        private _bossIdTable: Table<scene_multi_boss>;
        private _cfgs: Array<scene_multi_boss>;

        constructor() {
            this.init();
        }

        private init(): void {
            // this._table = {};
            this._bossIdTable = {};
            this._lvTable = {};
            this._cfgs = GlobalData.getConfig("scene_multi_boss");
            for (let i: int = 0, len: int = this._cfgs.length; i < len; i++) {
                this._lvTable[this._cfgs[i][scene_multi_bossFields.level]] = this._cfgs[i];
                this._bossIdTable[this._cfgs[i][scene_multi_bossFields.occ]] = this._cfgs[i];
            }
        }

        /** 根据层数获取配置*/
        public getCfgByLv(lv: int): scene_multi_boss {
            return this._lvTable[lv];
        }

        // 根据BOSSID获取配置
        public getCfgByBossId(bossId: int): scene_multi_boss {
            return this._bossIdTable[bossId];
        }

        // 获取配置数组
        public get cfgs(): Array<scene_multi_boss> {
            return this._cfgs;
        }
    }
}