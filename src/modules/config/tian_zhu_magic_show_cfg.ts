///<reference path="../common/attr_util.ts"/>

/** 时装幻化配置*/


namespace modules.config {
    import AttrUtil = modules.common.AttrUtil;
    import blendFields = Configuration.blendFields;
    import tianzhu_magicShow = Configuration.tianzhu_magicShow;
    import tianzhu_magicShowFields = Configuration.tianzhu_magicShowFields;
    import Dictionary = Laya.Dictionary;
    export class TianZhuMagicShowCfg {
        private static _instance: TianZhuMagicShowCfg;
        public static get instance(): TianZhuMagicShowCfg {
            return this._instance = this._instance || new TianZhuMagicShowCfg();
        }

        private _table: Table<Table<tianzhu_magicShow>>;
        // 品质对应的外观数组
        private _qualityTable: Table<Array<tianzhu_magicShow>>;
        // 属性索引数组
        private _attrIndices: Array<int>;
        private _skinCfg: Dictionary;  //皮肤数量
        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._qualityTable = {};
            this._skinCfg = new Dictionary();
            let arr: Array<tianzhu_magicShow> = GlobalData.getConfig("tianzhu_magicshow");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: tianzhu_magicShow = arr[i];
                let showId: number = cfg[tianzhu_magicShowFields.showId];
                if (!this._table[showId]) {
                    this._table[showId] = {};
                }
                this._table[showId][cfg[tianzhu_magicShowFields.level]] = cfg;
                let quality: number = cfg[tianzhu_magicShowFields.quality];
                if (!this._qualityTable[quality]) {
                    this._qualityTable[quality] = [];
                }
                if (cfg[tianzhu_magicShowFields.level] === 0) {
                    this._qualityTable[quality].push(cfg);
                }
                this._skinCfg.set(showId, arr[i]);
            }

            this._attrIndices = BlendCfg.instance.getCfgById(22014)[blendFields.intParam];
        }

        public get attrIndices(): Array<int> {
            return this._attrIndices;
        }

        // 根据外观id和等级获取配置
        public getCfgByShowIdAndLevel(showId: number, level: number): tianzhu_magicShow {
            return this._table[showId] ? this._table[showId][level] : null;
        }

        // 根据品质获取外观数组
        public getCfgsByQuality(quality: number): Array<tianzhu_magicShow> {
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
                    if (id == element[tianzhu_magicShowFields.items][0]) {
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
                        if (id == element1[tianzhu_magicShowFields.items][0]) {
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
                        if (id == element1[tianzhu_magicShowFields.items][0]) {
                            return element1[tianzhu_magicShowFields.quality];
                        }
                    }
                }
            }
            return null;
        }
        ////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }
}