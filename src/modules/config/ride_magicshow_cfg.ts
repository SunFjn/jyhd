/** 精灵幻化配置*/


namespace modules.config {
    import rideMagicShow = Configuration.rideMagicShow;
    import rideMagicShowFields = Configuration.rideMagicShowFields;
    import blendFields = Configuration.blendFields;
    import Dictionary = Laya.Dictionary;
    export class RideMagicShowCfg {
        private static _instance: RideMagicShowCfg;

        public static get instance(): RideMagicShowCfg {
            return this._instance = this._instance || new RideMagicShowCfg();
        }

        private _showTable: Table<Table<rideMagicShow>>;
        private _showIds: Array<int>;
        private _attrIndices: number[];
        private _skinCfg: Dictionary;  //皮肤数量
        constructor() {
            this.init();
        }

        private init(): void {
            this._showTable = {};
            this._attrIndices = [];
            this._skinCfg = new Dictionary();
            this._showIds = new Array<int>();
            let arr: Array<rideMagicShow> = GlobalData.getConfig("ride_magicshow");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let cfg: rideMagicShow = arr[i];
                this._skinCfg.set(cfg[rideMagicShowFields.showId], cfg);
                let lvTable: Table<rideMagicShow> = this._showTable[cfg[rideMagicShowFields.showId]];
                if (!lvTable) {
                    lvTable = {};
                    this._showTable[cfg[rideMagicShowFields.showId]] = lvTable;
                    this._showIds.push(cfg[rideMagicShowFields.showId]);
                }
                lvTable[cfg[rideMagicShowFields.star]] = cfg;
            }

            this._attrIndices = BlendCfg.instance.getCfgById(22008)[blendFields.intParam];
        }

        // 获取外观id数组
        public getShowIds(): Array<number> {
            return this._showIds;
        }

        // 根据外观ID和等级获取配置
        public getCfgByIdAndLv(id: int, lv: int): rideMagicShow {
            if (this._showTable[id] == null) {
                return null;
            }
            return this._showTable[id][lv];
        }

        // 根据外观ID获取table
        public getCfgsById(id: int): Table<rideMagicShow> {
            return this._showTable[id];
        }

        //筛选出显示属性
        public get attrIndices(): int[] {
            return this._attrIndices;
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~快捷使用相关
        /**
         *通过 道具id   判断有没有这个 道具外观
         */
        public haveItem(id: number): boolean {
            for (let index = 0; index < this._skinCfg.values.length; index++) {
                let element = this._skinCfg.values[index];
                if (element) {
                    if (id == element[rideMagicShowFields.items][0]) {
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
                        if (id == element1[rideMagicShowFields.items][0]) {
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
                        if (id == element1[rideMagicShowFields.items][0]) {
                            return element1[3];
                        }
                    }
                }
            }
            return null;
        }
        ////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }
}