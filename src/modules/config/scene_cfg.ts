/** 场景配置*/

namespace modules.config {
    import scene = Configuration.scene;

    export class SceneCfg {
        private static _instance: SceneCfg;
        public static get instance(): SceneCfg {
            return this._instance = this._instance || new SceneCfg();
        }

        private _table: Table<scene>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = GlobalData.getConfig("scene");
        }

        // 根据场景ID获取场景配置
        public getCfgById(sceneId: int | string): scene {
            return this._table[sceneId];
        }
    }
}