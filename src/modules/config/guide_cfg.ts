/** 新手引导配置*/

namespace modules.config {
    import guide = Configuration.guide;

    export class GuideCfg {
        private static _instance: GuideCfg;
        public static get instance(): GuideCfg {
            return this._instance = this._instance || new GuideCfg();
        }

        private _cfgs: Array<guide>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._cfgs = GlobalData.getConfig("guide");
        }

        public get cfgs(): Array<guide> {
            return this._cfgs;
        }
    }
}