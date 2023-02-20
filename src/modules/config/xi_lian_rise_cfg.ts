// 洗炼配置
namespace modules.config {
    import xilian_rise = Configuration.xilian_rise;

    export class XiLianRiseCfg {
        private static _instance: XiLianRiseCfg;
        public static get instance(): XiLianRiseCfg {
            return this._instance = this._instance || new XiLianRiseCfg();
        }

        private _cfgs: Array<xilian_rise>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._cfgs = GlobalData.getConfig("xilian_rise");
        }

        // 根据等级获取配置
        public getCfgByLv(level: int): xilian_rise {
            return this._cfgs[level];
        }
    }
}