///<reference path="../common/attr_util.ts"/>

/** 时装幻化配置*/


namespace modules.config {
    import fashion_magicShow = Configuration.fashion_magicShow;
    import fashion_magicShowFields = Configuration.fashion_magicShowFields;
    import AttrUtil = modules.common.AttrUtil;
    import blendFields = Configuration.blendFields;
    import Dictionary = Laya.Dictionary;
    export class FashionMagicShowCfg {
        private static _instance: FashionMagicShowCfg;
        public static get instance(): FashionMagicShowCfg {
            return this._instance = this._instance || new FashionMagicShowCfg();
        }

        private _table: Table<Table<fashion_magicShow>>;
        // 品质对应的外观数组
        private _qualityTable: Table<Array<fashion_magicShow>>;
        // 要显示的属性id数组
        private _attrIds: Array<int>;
        private _cfgs: Array<fashion_magicShow>;
        private _skinCfg: Dictionary;  //皮肤数量
        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._qualityTable = {};
            this._skinCfg = new Dictionary();
            let arr: Array<fashion_magicShow> = GlobalData.getConfig("fashion_magicshow");
            this._cfgs = arr;
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: fashion_magicShow = arr[i];
                let showId: number = cfg[fashion_magicShowFields.showId];
                if (!this._table[showId]) {
                    this._table[showId] = {};
                }
                this._table[showId][cfg[fashion_magicShowFields.level]] = cfg;

                let quality: number = cfg[fashion_magicShowFields.quality];
                if (!this._qualityTable[quality]) {
                    this._qualityTable[quality] = [];
                }
                if (cfg[fashion_magicShowFields.level] === 0) {
                    this._qualityTable[quality].push(cfg);
                }
                this._skinCfg.set(showId, arr[i]);
            }

            this._attrIds = BlendCfg.instance.getCfgById(22012)[blendFields.intParam];
        }

        public get cfgs(): Array<fashion_magicShow> {
            return this._cfgs;
        }

        public get attrIds(): Array<int> {
            return this._attrIds;
        }

        // 根据外观id和等级获取配置
        public getCfgByShowIdAndLevel(showId: number, level: number): fashion_magicShow {
            return this._table[showId] ? this._table[showId][level] : null;
        }

        // 根据品质获取外观数组
        public getCfgsByQuality(quality: number): Array<fashion_magicShow> {
            return this._qualityTable[quality];
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~快捷使用相关
        /**
         *通过 道具id   判断有没有这个 道具外观
         */
        public haveItem(id: number): boolean {
            for (let index = 0; index < this._skinCfg.values.length; index++) {
                let element = this._skinCfg.values[index];
                if (element) {
                    if (id == element[fashion_magicShowFields.items][0]) {
                        return true;
                    }
                }
            }
            return false;
        }
        /**
         * 通过 道具id  获取 外观id
         */
        public getItemIdBayShowId(id: number): number {
            for (let index = 0; index < this._skinCfg.keys.length; index++) {
                let element = this._skinCfg.keys[index]; //key 就是showid
                if (element) {
                    let element1 = this._skinCfg.get(element);
                    if (element1) {
                        if (id == element1[fashion_magicShowFields.items][0]) {
                            return element;
                        }
                    }
                }
            }
            return null;
        }
        public getpingZhiBayShowId(id: number): number {
            for (let index = 0; index < this._skinCfg.keys.length; index++) {
                let element = this._skinCfg.keys[index]; //key 就是showid
                if (element) {
                    let element1 = this._skinCfg.get(element);
                    if (element1) {
                        if (id == element1[fashion_magicShowFields.items][0]) {
                            return element1[fashion_magicShowFields.quality];
                        }
                    }
                }
            }
            return null;
        }
        ////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }
}