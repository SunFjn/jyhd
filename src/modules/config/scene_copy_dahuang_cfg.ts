/** 大荒配置*/


namespace modules.config {
    import scene_copy_dahuang = Configuration.scene_copy_dahuang;
    import scene_copy_dahuangFields = Configuration.scene_copy_dahuangFields;

    export class SceneCopyDahuangCfg {
        private static _instance: SceneCopyDahuangCfg;
        public static get instance(): SceneCopyDahuangCfg {
            return this._instance = this._instance || new SceneCopyDahuangCfg();
        }


        private _table: Table<scene_copy_dahuang>;
        private _cfgs: Array<scene_copy_dahuang>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._cfgs = GlobalData.getConfig("scene_copy_dahuang");
            for (let i: int = 0, len = this._cfgs.length; i < len; i++) {
                let cfg: scene_copy_dahuang = this._cfgs[i];
                this._table[cfg[scene_copy_dahuangFields.level]] = cfg;
            }
        }

        // 根据等级获取配置
        public getCfgByLv(level: int): scene_copy_dahuang {
            return this._table[level];
        }

        // 获取配置数组
        public get cfgs(): Array<scene_copy_dahuang> {
            return this._cfgs;
        }
    }
}