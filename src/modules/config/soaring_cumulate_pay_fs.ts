/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.config {
    import cumulate_pay_fs = Configuration.cumulate_pay_fs;
    import cumulate_pay_fsFields = Configuration.cumulate_pay_fsFields;

    export class SoaringCumulatePayCfg {
        private static _instance: SoaringCumulatePayCfg;
        public static get instance(): SoaringCumulatePayCfg {
            return this._instance = this._instance || new SoaringCumulatePayCfg();
        }

        private _tab: Table<cumulate_pay_fs>;
        private getArr: cumulate_pay_fs[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<cumulate_pay_fs> = GlobalData.getConfig("cumulate_pay_fs");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][cumulate_pay_fsFields.id]] = arr[i];
            }
            this.getArr = arr;
        }

        //根据ID获得配置
        public getCfgById(id: number): cumulate_pay_fs {
            return this._tab[id];
        }

        // 根据类型获取配置
        public getCfgByType(Type: int): cumulate_pay_fs[] {
            let gra: cumulate_pay_fs[] = [];
            for (let i: int = 0, len: int = this.getArr.length; i < len; i++) {
                let grad: number = this.getArr[i][cumulate_pay_fsFields.type];
                if (Type == grad) {
                    gra.push(this.getArr[i]);
                }
            }
            return gra;
        }

    }
}