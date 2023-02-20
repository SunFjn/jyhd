namespace modules.config {
    import item_rune = Configuration.item_rune;
    import item_runeFields = Configuration.item_runeFields;

    export class ItemRuneCfg {
        private static _instance: ItemRuneCfg;
        public static get instance(): ItemRuneCfg {
            return this._instance = this._instance || new ItemRuneCfg();
        }

        private _table: Table<item_rune>;
        private _unlockTab: Table<Array<item_rune>>;
        private _unlockLayerArr: number[];
        private _resolveRuneSubTypeId: number;  //精华玉荣小类id

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._unlockTab = {};
            this._unlockLayerArr = [];
            this._resolveRuneSubTypeId = 1;

            let arr: Array<item_rune> = GlobalData.getConfig("item_rune");

            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                let id: number = arr[i][item_runeFields.itemId];
                let type: int = (id * 0.000001 >> 0) % 10;
                this._table[id] = arr[i];
                if (arr[i][item_runeFields.layer] !== -1) {
                    if (this._unlockTab[arr[i][item_runeFields.layer]] == null)
                        this._unlockTab[arr[i][item_runeFields.layer]] = new Array<item_rune>();
                    if (type !== 9)
                        this._unlockTab[arr[i][item_runeFields.layer]].push(arr[i]);
                } else {
                    this._resolveRuneSubTypeId = arr[i][item_runeFields.itemId];
                }
                if (type == 9) {
                    if (this._unlockTab[-1] == null)
                        this._unlockTab[-1] = new Array<item_rune>();
                    this._unlockTab[-1].push(arr[i]);
                }
            }

            for (let key in this._unlockTab) {
                this._unlockLayerArr.push(parseInt(key));
            }

            this._unlockLayerArr.sort(modules.common.CommonUtil.smallToBigSort.bind(this));
            this._resolveRuneSubTypeId = modules.common.CommonUtil.getStoneTypeById(this._resolveRuneSubTypeId);
        }

        public getCfgById(itemId: number): item_rune {
            return this._table[itemId];
        }

        public getCfgByUnlock(layer: number): Array<item_rune> {
            return this._unlockTab[layer];
        }

        public get unlockLayerArr(): number[] {
            return this._unlockLayerArr;
        }

        public get resolveRuneSubTypeId(): number {
            return this._resolveRuneSubTypeId;
        }
    }
}