namespace modules.cumulate2_pay {
    import cumulate_pay2 = Configuration.cumulate_pay2;
    import cumulate_pay2Fields = Configuration.cumulate_pay2Fields;

    export class CumulatePay2Cfg {
        private static _instance: CumulatePay2Cfg;
        public static get instance(): CumulatePay2Cfg {
            return this._instance = this._instance || new CumulatePay2Cfg();
        }

        private _tab: Table<Array<cumulate_pay2>>;
        private getfgs: cumulate_pay2[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<cumulate_pay2> = GlobalData.getConfig("cumulate_pay2");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: cumulate_pay2 = arr[i];
                let serverDay: number = cfg[cumulate_pay2Fields.serverDay];
                if (!this._tab[serverDay]) {
                    this._tab[serverDay] = [];
                }
                this._tab[serverDay].push(arr[i]);
            }
            this.getfgs = arr;
        }

        // 根据天数获取配置数组
        public getCfgsByServerDay(serverDay: number): cumulate_pay2[] {
            return this._tab[serverDay];
        }

        // public getCfg():Table<cumulate_pay2>{
        //     return this._tab;
        // }
        //获取整个配置表
        public getcfgs(): cumulate_pay2[] {
            return this.getfgs;
        }

    }
}