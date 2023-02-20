/** 天梯奖励配置*/

namespace modules.config {
    import tianti_awards = Configuration.tianti_awards;

    export class TiantiAwardsCfg {
        private static _instance: TiantiAwardsCfg;
        public static get instance(): TiantiAwardsCfg {
            return this._instance = this._instance || new TiantiAwardsCfg();
        }

        private _cfgs: Array<tianti_awards>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._cfgs = GlobalData.getConfig("tianti_awards");
        }

        public get cfgs(): Array<tianti_awards> {
            return this._cfgs;
        }
    }
}