/////<reference path="../$.ts"/>
/** 周末狂欢累计充值 */
namespace modules.config {

    import week_accumulate = Configuration.week_accumulate;
    import week_accumulateFields = Configuration.week_accumulateFields;

    export class WeekRepeatPayCfg {
        private static _instance: WeekRepeatPayCfg;
        public static get instance(): WeekRepeatPayCfg {
            return this._instance = this._instance || new WeekRepeatPayCfg();
        }

        private _tab: Table<week_accumulate>;
        private _ids: number[];

        constructor() {
            this.init();
        }

        private init(): void {

            this._tab = {};
            this._ids = [];
            let arr: Array<week_accumulate> = GlobalData.getConfig("week_accumulate");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                let id: number = arr[i][week_accumulateFields.id];
                this.ids.push(id);
                this._tab[id] = arr[i];
            }
        }

        public getCfgById(id: number): week_accumulate {
            return this._tab[id];
        }

        public get ids(): number[] {
            return this._ids;
        }
    }
}