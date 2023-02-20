/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.config {
    import rush_buy_fs = Configuration.rush_buy_fs;
    import rush_buy_fsFields = Configuration.rush_buy_fsFields;

    export class SoaringPanicBuyingGiftCfg {
        private static _instance: SoaringPanicBuyingGiftCfg;
        public static get instance(): SoaringPanicBuyingGiftCfg {
            return this._instance = this._instance || new SoaringPanicBuyingGiftCfg();
        }

        private _tab: Table<rush_buy_fs>;
        private getArr: rush_buy_fs[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<rush_buy_fs> = GlobalData.getConfig("rush_buy_fs");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][rush_buy_fsFields.type]] = arr[i];
            }
            this.getArr = arr;
        }

        //根据ID获得配置
        public getCfgById(type: number): rush_buy_fs {
            return this._tab[type];
        }

        // 根据类型获取配置
        public getCfgByType(Type: int): rush_buy_fs[] {
            let gra: rush_buy_fs[] = [];
            for (let i: int = 0, len: int = this.getArr.length; i < len; i++) {
                let grad: number = this.getArr[i][rush_buy_fsFields.type];
                if (Type == grad) {
                    gra.push(this.getArr[i]);
                }
            }
            return gra;
        }

    }
}