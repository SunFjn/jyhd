/** 九天之巅配置*/


namespace modules.config {
    import scene_copy_nine = Configuration.scene_copy_nine;
    import scene_copy_nineFields = Configuration.scene_copy_nineFields;

    export class SceneCopyNineCfg {
        private static _instance: SceneCopyNineCfg;
        public static get instance(): SceneCopyNineCfg {
            return this._instance = this._instance || new SceneCopyNineCfg();
        }

        private _table: Table<scene_copy_nine>;
        private _cfgs: Array<scene_copy_nine>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._cfgs = GlobalData.getConfig("scene_copy_nine");
            for (let i: int = 0, len: int = this._cfgs.length; i < len; i++) {
                let cfg: scene_copy_nine = this._cfgs[i];
                this._table[cfg[scene_copy_nineFields.level]] = cfg;
            }
        }

        public get cfgs(): Array<scene_copy_nine> {
            return this._cfgs;
        }

        // 根据层数获取配置
        public getCfgByLevel(level: int): scene_copy_nine {
            return this._table[level];
        }
    }
}