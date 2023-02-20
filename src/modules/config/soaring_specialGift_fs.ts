/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.config {
    import discount_gift_fs = Configuration.discount_gift_fs;
    import discount_gift_fsFields = Configuration.discount_gift_fsFields;

    export class SoaringSpecialGiftCfg {
        private static _instance: SoaringSpecialGiftCfg;
        public static get instance(): SoaringSpecialGiftCfg {
            return this._instance = this._instance || new SoaringSpecialGiftCfg();
        }

        private _tab: Table<discount_gift_fs>;
        private getArr: discount_gift_fs[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<discount_gift_fs> = GlobalData.getConfig("discount_gift_fs");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][discount_gift_fsFields.id]] = arr[i];
            }
            this.getArr = arr;
        }

        //根据ID获得配置
        public getCfgById(id: number): discount_gift_fs {
            return this._tab[id];
        }

        // 根据类型获取配置
        public getCfgByType(Type: int): discount_gift_fs[] {
            let gra: discount_gift_fs[] = [];
            for (let i: int = 0, len: int = this.getArr.length; i < len; i++) {
                let grad: number = this.getArr[i][discount_gift_fsFields.type];
                if (Type == grad) {
                    gra.push(this.getArr[i]);
                }
            }
            return gra;
        }

    }
}