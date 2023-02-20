/*历练活跃值配置*/
namespace modules.config {

    export class LilianRiseCfg {
        private static _instance: LilianRiseCfg;
        public static get instance(): LilianRiseCfg {
            return this._instance = this._instance || new LilianRiseCfg();
        }

        private _table: Table<Configuration.lilian_rise>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            let arr: Array<Configuration.lilian_rise> = GlobalData.getConfig("lilian_rise");
            for (let i: number = 0, len: number = arr.length; i < len; i++) {
                let lilian_rise: Configuration.lilian_rise = arr[i];
                this._table[lilian_rise[Configuration.lilian_riseFields.riseLevel]] = lilian_rise;
            }

        }

        //根据重数获取配置
        public getLilianRiseCfgByRiseLevel(riselevel: number): Configuration.lilian_rise {
            return this._table[riselevel];
        }
        public getLilianNameByRiseLevel(riselevel: number): string {
            if (this._table[riselevel]) {
                return this._table[riselevel][Configuration.lilian_riseFields.name];
            }
            else {
                return "太极无极·一重";
            }

        }
    }
}