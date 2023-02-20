namespace modules.config {
    import day_pay = Configuration.day_pay;
    import day_payFields = Configuration.day_payFields;

    export class DayPayCfg {
        private static _instance: DayPayCfg;
        public static get instance(): DayPayCfg {
            return this._instance = this._instance || new DayPayCfg();
        }

        private _tab: Table<day_pay>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<day_pay> = GlobalData.getConfig("day_pay");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                this._tab[arr[i][day_payFields.id]] = arr[i];
            }
        }

        public getCfgById(id: number): day_pay {
            return this._tab[id];
        }
    }
}