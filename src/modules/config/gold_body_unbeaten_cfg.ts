/** 不败金身修炼配置*/


namespace modules.config {
    import soulRise = Configuration.soulRise;

    export class GoldBodyUnbeatenCfg {
        private static _instance: GoldBodyUnbeatenCfg;
        public static get instance(): GoldBodyUnbeatenCfg {
            return this._instance = this._instance || new GoldBodyUnbeatenCfg();
        }

        private _levelArrs: Array<soulRise>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._levelArrs = GlobalData.getConfig("soul_rise");
        }

        // 根据等级获取配置
        public getCfgByLv(lv: int): soulRise {
            return this._levelArrs[lv];
        }

        // 获取等级上限
        public getMaxLvByLv(): int {
            return this._levelArrs.length - 1;
        }
    }
}