/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.config {
    import everyday_rebate = Configuration.everyday_rebate;
    import everyday_rebateFields = Configuration.everyday_rebateFields;

    export class EveryDayRebateCfg {
        private static _instance: EveryDayRebateCfg;
        public static get instance(): EveryDayRebateCfg {
            return this._instance = this._instance || new EveryDayRebateCfg();
        }

        private _tab: Table<everyday_rebate>;
        private getArr: everyday_rebate[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<everyday_rebate> = GlobalData.getConfig("everyday_rebate");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][everyday_rebateFields.id]] = arr[i];
            }
            this.getArr = arr;
        }

        //根据ID获得配置
        public getCfgById(id: number): everyday_rebate {
            return this._tab[id];
        }

        public getArrDate(): everyday_rebate[] {
            return this.getArr;
        }

        // 根据类型获取配置
        public getCfgByType(day: int): everyday_rebate[] {
            let gra: everyday_rebate[] = [];
            for (let i: int = 0, len: int = this.getArr.length; i < len; i++) {
                let grad: number = this.getArr[i][everyday_rebateFields.day];
                if (day == grad) {
                    gra.push(this.getArr[i]);
                }
            }
            return gra;
        }

    }
}
