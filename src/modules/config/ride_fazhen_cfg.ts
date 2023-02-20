/** 精灵法阵配置*/
namespace modules.config {
    import Dictionary = Laya.Dictionary;
    import blendFields = Configuration.blendFields;


    import ride_fazhen = Configuration.ride_fazhen;
    import ride_fazhenFields = Configuration.ride_fazhenFields;

    export class RideFazhenCfg {
        private static _instance: RideFazhenCfg;
        public static get instance(): RideFazhenCfg {
            return this._instance = this._instance || new RideFazhenCfg();
        }

        private _dic2: Table<Table<ride_fazhen>>;  //幻化配置
        private _skinCfg: Dictionary;  //皮肤数量
        private _huanhuaAttrIndices: int[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._dic2 = {};
            this._skinCfg = new Dictionary();
            let _cfgs2: Array<ride_fazhen> = GlobalData.getConfig("ride_fazhen");

            for (let i: int = 0, len: int = _cfgs2.length; i < len; i++) {
                if (!this._dic2[_cfgs2[i][ride_fazhenFields.showId]])
                    this._dic2[_cfgs2[i][ride_fazhenFields.showId]] = {};
                this._dic2[_cfgs2[i][ride_fazhenFields.showId]][_cfgs2[i][ride_fazhenFields.level]] = _cfgs2[i];
                this._skinCfg.set(_cfgs2[i][ride_fazhenFields.showId], _cfgs2[i]);
            }
            this._huanhuaAttrIndices = BlendCfg.instance.getCfgById(22010)[blendFields.intParam];
        }

        //根据类型获取皮肤配置数组 3~5
        public getSkinCfgByType(type: int): Array<ride_fazhen> {
            let _arr: Array<ride_fazhen> = new Array<ride_fazhen>();
            for (let i: int = 0, len: int = this._skinCfg.keys.length; i < len; i++) {
                if (this._skinCfg.get(this._skinCfg.keys[i])[ride_fazhenFields.quality] == type)
                    _arr.push(this._skinCfg.get(this._skinCfg.keys[i]));
            }
            return _arr;
        }

        //获取所有的皮肤ID 分为三个数组
        public getSkinsArr(): number[][] {
            let arr: number[][] = [];
            for (let j: int = 3; j < 6; j++) {
                let cfgArr: ride_fazhen[] = this.getSkinCfgByType(j);
                let ids: number[] = [];
                for (let i: int = 0, len: int = cfgArr.length; i < len; i++) {
                    ids.push(cfgArr[i][ride_fazhenFields.showId]);
                }
                arr.push(ids);
            }
            return arr;
        }

        //根据ID和等级取幻化配置
        public getHuanhuaCfgByIdAndLev(id: int, lev: int): ride_fazhen {
            if (this._dic2[id] == null) {
                return null;
            }
            return this._dic2[id][lev];
        }

        //筛选出幻化属性
        public get huanhuaAttrIndices(): int[] {
            return this._huanhuaAttrIndices;
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~快捷使用相关
        /**
         *通过 道具id   判断有没有这个 道具外观
         */
        public haveItem(id: number): boolean {
            for (let index = 0; index < this._skinCfg.values.length; index++) {
                let element = this._skinCfg.values[index];
                if (element) {
                    if (id == element[ride_fazhenFields.items][0]) {
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
                        if (id == element1[ride_fazhenFields.items][0]) {
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
                        if (id == element1[ride_fazhenFields.items][0]) {
                            return element1[ride_fazhenFields.quality];
                        }
                    }
                }
            }
            return null;
        }
        ////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }
}