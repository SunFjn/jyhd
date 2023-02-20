namespace modules.config {
    import exterior_suit = Configuration.exterior_suit;
    import exterior_suit_Field = Configuration.exterior_suit_Field;
    
    export const enum ExteriorSuitClass{
        best = 3,//极品
        unique = 4,//绝品
        collection = 5,//典藏
    }

    export class ExteriorSuitCfg {
        private static _instance: ExteriorSuitCfg;
        public static get instance(): ExteriorSuitCfg {
            return this._instance = this._instance || new ExteriorSuitCfg();
        }

        private _tab: Table<exterior_suit>;
        private _classTab: Table<Table<exterior_suit>>; //品质分类
        private _orgSuitId: number;//默认显示外显套装ID
    
        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._classTab = {};
            this._classTab[ExteriorSuitClass.best] = {};
            this._classTab[ExteriorSuitClass.unique] = {};
            this._classTab[ExteriorSuitClass.collection] = {};
            let arr: Array<exterior_suit> = GlobalData.getConfig("exterior_suit");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                let id: number = arr[i][exterior_suit_Field.id];
                let quality: number = arr[i][exterior_suit_Field.quality];
                this._tab[id] = arr[i];
                if (quality == ExteriorSuitClass.best) {
                    this._classTab[ExteriorSuitClass.best][id] = arr[i]
                }else if (quality == ExteriorSuitClass.unique) {
                    this._classTab[ExteriorSuitClass.unique][id] = arr[i]
                }else if (quality == ExteriorSuitClass.collection) {
                    this._classTab[ExteriorSuitClass.collection][id] = arr[i]
                }
                if (i == 0) {
                    this._orgSuitId = id;
                }
            }
        }

        //默认显示外显套装ID
        public get orgSuitId(): number {
            return this._orgSuitId;
        }

        /**根据品质分类类获取配置 */
        public getCfgByClass(classValue: number):Table<exterior_suit> {
            return this._classTab[classValue];
        }

        /**根据id 获取配置*/
        public getCfgById(id: number): exterior_suit {
            return this._tab[id];
        }

        /**根据exterior_sk id 获取配置*/
        public getCfgByPartId(id: number): any {
            for (const key in this._classTab) {
                if (Object.prototype.hasOwnProperty.call(this._classTab, key)) {
                    let cfgs = this._classTab[key];
                    let index = 0;
                    for (const key in cfgs) {
                        let data:exterior_suit = cfgs[key];
                        if (data[exterior_suit_Field.partsShowId][0] == id ||
                            data[exterior_suit_Field.partsShowId][1] == id ||
                            data[exterior_suit_Field.partsShowId][2] == id) {
                            return [index,data];
                        }
                       index++;
                    }
                }
            }
            return null;
        }

        /**
         *  是否使用外显套装
         * weapon  武器ID
         * clothes 时装ID
         * wing    翅膀ID
         * suitId  外显套装Id
        */
        public checkCfgByWCWId(weapon: number,clothes: number,wing: number,suitId:number): boolean {
            let count = 0;
            let data:exterior_suit = this._tab[suitId];
            if (data[exterior_suit_Field.partsShowId][0] == weapon) {
                count++;
            } 
            if (data[exterior_suit_Field.partsShowId][1] == clothes) {
                count++;
            }
            if (data[exterior_suit_Field.partsShowId][2] == wing) {
                count++;
            }
            if (count == 3) {
                return true;
            }
            return false;
        }
    }
}
