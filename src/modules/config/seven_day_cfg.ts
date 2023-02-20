namespace modules.config {

    import seven_day = Configuration.seven_day;
    import seven_dayFields = Configuration.seven_dayFields;

    export class SevenDayCfg {

        private static _instance: SevenDayCfg;

        public static get instance(): SevenDayCfg {
            return this._instance = this._instance || new SevenDayCfg();
        }

        private _cfgs: Array<seven_day>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._cfgs = GlobalData.getConfig("seven_day");
        }

        public get cfgs(): Array<seven_day> {
            return this._cfgs;
        }

        // 根据天数获取配置
        public getCfgByDay(day: number): seven_day {
            let t: seven_day;
            for (let i: int = 0, len: int = this._cfgs.length; i < len; i++) {
                let cfg: seven_day = this._cfgs[i];
                if (day === cfg[seven_dayFields.day]) {
                    t = cfg;
                    break;
                }
            }
            return t;
        }
    }
}