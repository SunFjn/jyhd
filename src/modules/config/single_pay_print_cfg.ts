/////<reference path="../$.ts"/>
/** 单笔充值返雷米之星 */
namespace modules.config {
    import single_pay_print = Configuration.single_pay_print;
    import single_pay_printFields = Configuration.single_pay_printFields;

    export class SinglePayPrintCfg {
        private static _instance: SinglePayPrintCfg;
        public static get instance(): SinglePayPrintCfg {
            return this._instance = this._instance || new SinglePayPrintCfg();
        }

        private _tab: Table<single_pay_print>;
        public getArr: single_pay_print[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<single_pay_print> = GlobalData.getConfig("single_pay_print");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][single_pay_printFields.id]] = arr[i];
            }
            this.getArr = arr;
        }

        //根据ID获得配置
        public getCfgById(id: number): single_pay_print {
            return this._tab[id];
        }
    }
}