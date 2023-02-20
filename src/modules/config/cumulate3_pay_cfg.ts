/** daw 植树迎春 */
namespace modules.cumulate3_pay {
    import cumulate_pay3 = Configuration.cumulate_pay3;
    import cumulate_pay3Fields = Configuration.cumulate_pay3Fields;

    export class CumulatePay3Cfg {
        private static _instance: CumulatePay3Cfg;
        public static get instance(): CumulatePay3Cfg {
            return this._instance = this._instance || new CumulatePay3Cfg();
        }

        private _tab: Table<Array<cumulate_pay3>>;
        private getfgs: cumulate_pay3[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<cumulate_pay3> = GlobalData.getConfig("cumulate_pay3");//daw
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: cumulate_pay3 = arr[i];
                let serverDay: number = cfg[cumulate_pay3Fields.serverDay];
                if (!this._tab[serverDay]) {
                    this._tab[serverDay] = [];
                }
                this._tab[serverDay].push(arr[i]);
            }
            this.getfgs = arr;
        }

        // 根据天数获取配置数组
        public getCfgsByServerDay(serverDay: number): cumulate_pay3[] {
            return this._tab[serverDay];
        }

   
        //获取整个配置表
        public getcfgs(): cumulate_pay3[] {
            return this.getfgs;
        }

    }
}