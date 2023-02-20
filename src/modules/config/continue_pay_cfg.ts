namespace modules.config {
    import continue_pay = Configuration.continue_pay;
    import continue_payFields = Configuration.continue_payFields;

    export class ContinePayCfg {
        private static _instance: ContinePayCfg;
        public static get instance(): ContinePayCfg {
            return this._instance = this._instance || new ContinePayCfg();
        }

        private _tab: Table<Array<continue_pay>>;
        private _cfgs: continue_pay[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<continue_pay> = GlobalData.getConfig("continue_pay");
            this._cfgs = arr;
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: continue_pay = arr[i];
                let grade: number = cfg[continue_payFields.grade];
                if (!this._tab[grade]) {
                    this._tab[grade] = [];
                }
                this._tab[grade].push(arr[i]);
            }
        }

        // 根据档位获取配置数组
        public getCfgsByGrade(grade: number): continue_pay[] {
            let shuju = this._tab[grade];
            return shuju;
        }

        // 配置数组
        public get cfgs(): continue_pay[] {
            return this._cfgs;
        }
    }
}