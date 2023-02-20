namespace modules.ceremony_cash {
    import celebration_continue_pay = Configuration.celebration_continue_pay;
    import celebration_continue_payFields = Configuration.celebration_continue_payFields;

    export class CeremonyContinePayCfg {
        private static _instance: CeremonyContinePayCfg;
        public static get instance(): CeremonyContinePayCfg {
            return this._instance = this._instance || new CeremonyContinePayCfg();
        }

        private _tab: Table<Array<celebration_continue_pay>>;
        private _cfgs: celebration_continue_pay[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<celebration_continue_pay> = GlobalData.getConfig("celebration_continue_pay");
            this._cfgs = arr;
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: celebration_continue_pay = arr[i];
                let grade: number = cfg[celebration_continue_payFields.grade];
                if (!this._tab[grade]) {
                    this._tab[grade] = [];
                }
                this._tab[grade].push(arr[i]);
            }
        }

        // 根据档位获取配置数组
        public getCfgsByGrade(grade: number): celebration_continue_pay[] {
            let shuju = this._tab[grade];
            return shuju;
        }

        // 配置数组
        public get cfgs(): celebration_continue_pay[] {
            return this._cfgs;
        }

        // 配置数组
        public get moneyList(): Array<number> {
            let _money_arr = [];
            for (let k in this._cfgs) {
                let _money = this._cfgs[k][celebration_continue_payFields.money];
                console.log('vtz:_grade',_money);
                if (_money_arr.indexOf(_money) < 0) {
                    _money_arr.push(_money)
                }
            }
            return _money_arr;
        }

    }
}