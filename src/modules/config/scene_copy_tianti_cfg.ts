/** 天梯配置*/
namespace modules.config {
    export class SceneCopyTiantiCfg {
        private static _instance: SceneCopyTiantiCfg;
        public static get instance(): SceneCopyTiantiCfg {
            return this._instance = this._instance || new SceneCopyTiantiCfg();
        }

        constructor() {
            this.init();
        }

        private init(): void {

        }
    }
}