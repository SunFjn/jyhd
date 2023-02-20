/////<reference path="../$.ts"/>
/** 仙府-家园图鉴配置 */
namespace modules.config {
    import Dictionary = Laya.Dictionary;
    import xianfu_illustrated_handbook = Configuration.xianfu_illustrated_handbook;
    import xianfu_illustrated_handbookFields = Configuration.xianfu_illustrated_handbookFields;

    export class XianfuHandBookCfg {
        private static _instance: XianfuHandBookCfg;
        public static get instance(): XianfuHandBookCfg {
            return this._instance = this._instance || new XianfuHandBookCfg();
        }

        private _dic: Dictionary;
        private _ids: Array<Table<number>>;
        private _tab: Table<Array<xianfu_illustrated_handbook>>;
        private _maxLv: number;

        constructor() {
            this.init();
        }

        private init(): void {
            this._dic = new Dictionary();
            this._ids = [];
            this._tab = {};
            let arr: Array<xianfu_illustrated_handbook> = GlobalData.getConfig("xianfu_illustrated_handbook");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                let id: number = arr[i][xianfu_illustrated_handbookFields.id];
                let index: number = arr[i][xianfu_illustrated_handbookFields.quality] - 1;
                if (!this._ids[index]) {
                    this._ids[index] = {};
                }
                if (!this._ids[index][id]) {
                    this._ids[index][id] = id;
                }

                if (!this._tab[id]) {
                    this._tab[id] = [];
                }
                this._tab[id].push(arr[i]);
                this._maxLv = arr[i][xianfu_illustrated_handbookFields.level];
            }
        }

        // 根据ID获取配置
        public getCfgById(id: int): xianfu_illustrated_handbook {
            return this._dic.get(id);
        }

        public getCfgByIdAndLv(id: number, lv: number): xianfu_illustrated_handbook {
            return this._tab[id][lv];
        }

        public get typeLen(): number {
            return this._ids.length;
        }

        //根据品质获取数组
        public getIdsByType(type: number): Table<number> {
            return this._ids[type];
        }

        //最大等级
        public get maxLv(): number {
            return this._maxLv;
        }
    }
}