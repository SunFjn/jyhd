namespace modules.config {
    import cumulate_pay = Configuration.cumulate_pay;
    import cumulate_payFields = Configuration.cumulate_payFields;

    export class CumulatePayCfg {
        private static _instance: CumulatePayCfg;
        public static get instance(): CumulatePayCfg {
            return this._instance = this._instance || new CumulatePayCfg();
        }

        private _tab: Table<cumulate_pay>;
        private getfgs: cumulate_pay[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<cumulate_pay> = GlobalData.getConfig("cumulate_pay");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                this._tab[arr[i][cumulate_payFields.id]] = arr[i];
            }
            this.getfgs = arr;
        }

        //根据ID获取配置信息
        public getCfgById(id: number): cumulate_pay {
            return this._tab[id];
        }

        public getCfg(): Table<cumulate_pay> {
            return this._tab;
        }

        //获取整个配置表
        public getcfgs(): cumulate_pay[] {
            return this.getfgs;
        }

    }
}