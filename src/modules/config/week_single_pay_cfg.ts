/////<reference path="../$.ts"/>
/** 周末狂欢单笔充值 */
namespace modules.config {
    import week_single_pay = Configuration.week_single_pay;
    import week_single_payFields = Configuration.week_single_payFields;

    export class WeekSinglePayCfg {
        private static _instance: WeekSinglePayCfg;
        public static get instance(): WeekSinglePayCfg {
            return this._instance = this._instance || new WeekSinglePayCfg();
        }

        private _tab: Table<week_single_pay>;
        private _ids: number[];

        constructor() {
            this.init();
        }

        private init(): void {

            this._tab = {};
            this._ids = [];
            let arr: Array<week_single_pay> = GlobalData.getConfig("week_single_pay");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                let id: number = arr[i][week_single_payFields.id];
                this.ids.push(id);
                this._tab[id] = arr[i];
            }
        }

        public getCfgById(id: number): week_single_pay {
            return this._tab[id];
        }

        public get ids(): number[] {
            return this._ids;
        }
    }
}