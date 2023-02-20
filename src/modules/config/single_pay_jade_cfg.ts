/////<reference path="../$.ts"/>
/** 单笔充值返炽星魔锤 */
namespace modules.config {
    import single_pay_jade = Configuration.single_pay_jade;
    import single_pay_jadeFields = Configuration.single_pay_jadeFields;

    export class SinglePayJadeCfg {
        private static _instance: SinglePayJadeCfg;
        public static get instance(): SinglePayJadeCfg {
            return this._instance = this._instance || new SinglePayJadeCfg();
        }

        private _tab: Table<single_pay_jade>;
        public getArr: single_pay_jade[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<single_pay_jade> = GlobalData.getConfig("single_pay_jade");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][single_pay_jadeFields.id]] = arr[i];
            }
            this.getArr = arr;
        }

        //根据ID获得配置
        public getCfgById(id: number): single_pay_jade {
            return this._tab[id];
        }
    }
}