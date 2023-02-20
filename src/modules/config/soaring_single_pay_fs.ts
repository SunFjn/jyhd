/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.config {
    import pay_single_fs = Configuration.pay_single_fs;
    import pay_single_fsFields = Configuration.pay_single_fsFields;

    export class SoaringSinglePayCfg {
        private static _instance: SoaringSinglePayCfg;
        public static get instance(): SoaringSinglePayCfg {
            return this._instance = this._instance || new SoaringSinglePayCfg();
        }

        private _tab: Table<pay_single_fs>;
        private getArr: pay_single_fs[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<pay_single_fs> = GlobalData.getConfig("pay_single_fs");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][pay_single_fsFields.id]] = arr[i];
            }
            this.getArr = arr;
        }

        //根据ID获得配置
        public getCfgById(id: number): pay_single_fs {
            return this._tab[id];
        }

        // 根据类型获取配置
        public getCfgByType(Type: int): pay_single_fs[] {
            let gra: pay_single_fs[] = [];
            for (let i: int = 0, len: int = this.getArr.length; i < len; i++) {
                let grad: number = this.getArr[i][pay_single_fsFields.type];
                if (Type == grad) {
                    gra.push(this.getArr[i]);
                }
            }
            return gra;
        }

    }
}