///<reference path="../common/attr_util.ts"/>

/** 时装幻化配置*/


namespace modules.config {
    import guanghuan_magicShow = Configuration.guanghuan_magicShow;
    import guanghuan_magicShowFields = Configuration.guanghuan_magicShowFields;
    import AttrUtil = modules.common.AttrUtil;
    import blendFields = Configuration.blendFields;
    import Dictionary = Laya.Dictionary;
    export class GuangHuanMagicShowCfg {
        private static _instance: GuangHuanMagicShowCfg;
        public static get instance(): GuangHuanMagicShowCfg {
            return this._instance = this._instance || new GuangHuanMagicShowCfg();
        }

        private _table: Table<Table<guanghuan_magicShow>>;
        // 品质对应的外观数组
        private _qualityTable: Table<Array<guanghuan_magicShow>>;
        // 要显示的属性id数组
        private _attrIds: Array<int>;
        private _cfgs: Array<guanghuan_magicShow>;
        private _skinCfg: Dictionary;  //皮肤数量
        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._qualityTable = {};
            this._skinCfg = new Dictionary();
            let arr: Array<guanghuan_magicShow> = GlobalData.getConfig("guanghuan_magicshow");
            this._cfgs = arr;
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: guanghuan_magicShow = arr[i];
                let showId: number = cfg[guanghuan_magicShowFields.showId];
                if (!this._table[showId]) {
                    this._table[showId] = {};
                }
                this._table[showId][cfg[guanghuan_magicShowFields.level]] = cfg;

                let quality: number = cfg[guanghuan_magicShowFields.quality];
                if (!this._qualityTable[quality]) {
                    this._qualityTable[quality] = [];
                }
                if (cfg[guanghuan_magicShowFields.level] === 0) {
                    this._qualityTable[quality].push(cfg);
                }
                this._skinCfg.set(showId, arr[i]);
            }

            this._attrIds = BlendCfg.instance.getCfgById(22018)[blendFields.intParam];
        }

        public get cfgs(): Array<guanghuan_magicShow> {
            return this._cfgs;
        }

        public get attrIds(): Array<int> {
            return this._attrIds;
        }

        // 根据外观id和等级获取配置
        public getCfgByShowIdAndLevel(showId: number, level: number): guanghuan_magicShow {
            return this._table[showId] ? this._table[showId][level] : null;
        }

        // 根据品质获取外观数组
        public getCfgsByQuality(quality: number): Array<guanghuan_magicShow> {
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
                    if (id == element[guanghuan_magicShowFields.items][0]) {
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
                        if (id == element1[guanghuan_magicShowFields.items][0]) {
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
                        if (id == element1[guanghuan_magicShowFields.items][0]) {
                            return element1[guanghuan_magicShowFields.quality];
                        }
                    }
                }
            }
            return null;
        }
        ////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }
}