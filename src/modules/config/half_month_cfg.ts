/** 半月礼*/


namespace modules.config {
    import half_month = Configuration.half_month;
    import half_monthFields = Configuration.half_monthFields;

    export class HalfMonthCfg {
        private static _instance: HalfMonthCfg;
        public static get instance(): HalfMonthCfg {
            return this._instance = this._instance || new HalfMonthCfg();
        }

        private _cfgs: Array<half_month>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._cfgs = GlobalData.getConfig("half_month");
        }

        public get cfgs(): Array<half_month> {
            return this._cfgs;
        }

        // 根据天数获取配置
        public getCfgByDay(day: number): half_month {
            let t: half_month;
            for (let i: int = 0, len: int = this._cfgs.length; i < len; i++) {
                let cfg: half_month = this._cfgs[i];
                if (day === cfg[half_monthFields.day]) {
                    t = cfg;
                    break;
                }
            }
            return t;
        }
    }
}