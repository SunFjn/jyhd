/////<reference path="../$$.ts"/>
/** 描述 */
namespace modules.config {
    import xianfu_decorate = Configuration.xianfu_decorate;
    import xianfu_decorateField = Configuration.xianfu_decorateFields;

    export class XianfuDecorateCfg {
        private static _instance: XianfuDecorateCfg;
        public static get instance(): XianfuDecorateCfg {
            return this._instance = this._instance || new XianfuDecorateCfg();
        }

        private _tab: Table<xianfu_decorate>;
        private _arr: Array<Array<number>>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._arr = [];
            let tempArr: Array<Table<number>> = [];

            let arr: Array<xianfu_decorate> = GlobalData.getConfig("xianfu_decorate");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][xianfu_decorateField.id]] = arr[i];
                let type: number = arr[i][xianfu_decorateField.id] / 100 >> 0;// 11 21 31 具体类型
                let bigType: number = arr[i][xianfu_decorateField.id] / 1000 >> 0;// 1 2 3 大类
                if (!tempArr[bigType - 1]) {
                    tempArr[bigType - 1] = {};
                }
                tempArr[bigType - 1][type] = type * 100;
            }
            for (let i: int = 0, len: int = tempArr.length; i < len; i++) {
                let tab: Table<number> = tempArr[i];
                for (let key in tab) {
                    if (!this._arr[i]) {
                        this._arr[i] = [];
                    }
                    this._arr[i].push(tab[key]);
                }
            }
        }

        // 根据ID获取配置
        public getCfgById(id: int): xianfu_decorate {
            return this._tab[id];
        }

        //根据大类获取模糊ids   11 12 13 14
        public getIdsByBigType(type: number): Array<number> {
            return this._arr[type];
        }
    }
}