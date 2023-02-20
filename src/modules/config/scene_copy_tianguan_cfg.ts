/** 天关配置*/



namespace modules.config {
    import Items = Configuration.Items;
    import scene_copy_tianguan = Configuration.scene_copy_tianguan;
    import scene_copy_tianguanFields = Configuration.scene_copy_tianguanFields;
    import Dictionary = Laya.Dictionary;

    export class SceneCopyTianguanCfg {
        private static _instance: SceneCopyTianguanCfg;
        public static get instance(): SceneCopyTianguanCfg {
            return this._instance = this._instance || new SceneCopyTianguanCfg();
        }

        private _lvDic: Dictionary;

        constructor() {
            this.init();
        }

        private init(): void {
            this._lvDic = new Dictionary();
            let cfgs: Array<scene_copy_tianguan> = GlobalData.getConfig("scene_copy_tianguan");
            for (let i: int = 0, len = cfgs.length; i < len; i++) {
                let cfg: scene_copy_tianguan = cfgs[i];
                this._lvDic.set(cfg[scene_copy_tianguanFields.level], cfg);
            }
        }

        // 根据层数获取天关配置
        public getCfgByLv(lv: int): scene_copy_tianguan {
            return this._lvDic.get(lv);
        }

        // 根据层数获取有特殊奖励的下一关配置
        public getSpeCfgByLv(lv: int): scene_copy_tianguan {
            let cfg: scene_copy_tianguan;
            let cfgs: Array<scene_copy_tianguan> = GlobalData.getConfig("scene_copy_tianguan");
            for (let i: int = lv - 1, len = cfgs.length; i < len; i++) {
                let arr: Array<Items> = cfgs[i][scene_copy_tianguanFields.award];
                if (arr && arr.length > 0) {
                    cfg = cfgs[i];
                    break;
                }
            }
            return cfg;
        }
    }
}