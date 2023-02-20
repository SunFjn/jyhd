/** 单人BOSS配置*/



namespace modules.config {
    import scene_copy_single_boss = Configuration.scene_copy_single_boss;
    import Dictionary = Laya.Dictionary;

    export class SceneCopySingleBossCfg {
        private static _instance: SceneCopySingleBossCfg;
        public static get instance(): SceneCopySingleBossCfg {
            return this._instance = this._instance || new SceneCopySingleBossCfg();
        }

        private _singleBossCfgs: Array<any>;
        private _lvDic: Dictionary;

        constructor() {
            this.init();
        }

        private init(): void {
            this._lvDic = new Dictionary();
            let cfgs: Array<any> = GlobalData.getConfig("scene_copy_single_boss");
            for (let i: number = 0; i < cfgs.length; i++) {
                let cfg = cfgs[i];
                this._lvDic.set(i, cfg);
            }
            this._singleBossCfgs = cfgs;

        }

        // 根据层数获取boss配置
        public getCfgByLv(lv: int): scene_copy_single_boss {
            return this._lvDic.get(lv);
        }

        // 根据层数获取有特殊奖励的下一关配置
        public getCfg(): Array<any> {
            return this._singleBossCfgs;
        }
    }
}