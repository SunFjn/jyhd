/////<reference path="../$.ts"/>
/** 装备套装 */
namespace modules.config {
    import equip_suit = Configuration.equip_suit;
    import equip_suitFields = Configuration.equip_suitFields;

    export class EquipSuitCfg {
        private static _instance: EquipSuitCfg;
        public static get instance(): EquipSuitCfg {
            return this._instance = this._instance || new EquipSuitCfg();
        }

        private _tab: Table<Table<equip_suit>>;
        private _cfg: Table<equip_suit>;
        private _sClassIds: Table<number[]>; //每个大类 的id[]
        private _bClassIds: number[]; //所有的大类id
        private _ids: number[];
        private _tab2: Table<int[]>;

        constructor() {
            this.init();
        }

        private init(): void {

            this._tab = {};
            this._cfg = {};
            this._bClassIds = [];
            this._sClassIds = {};
            this._ids = [];
            this._tab2 = {};
            let arr: Array<equip_suit> = GlobalData.getConfig("equip_suit");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                let id: number = arr[i][equip_suitFields.id];
                let condition: int = arr[i][equip_suitFields.condition];
                if (!this._tab2[condition]) {
                    this._tab2[condition] = [];
                }
                this._tab2[condition].push(id);
                this._ids.push(id);
                this._cfg[id] = arr[i];
                let bClass: number = id / 10 >> 0;
                if (this._bClassIds.indexOf(bClass) == -1) {
                    this._bClassIds.push(bClass);
                }
                let sClass: number = id % 10;
                if (!this._sClassIds[bClass]) {
                    this._sClassIds[bClass] = [];
                }
                this._sClassIds[bClass].push(id);
                if (!this._tab[bClass]) {
                    this._tab[bClass] = {};
                }
                this._tab[bClass][sClass] = arr[i];
            }
        }

        /**根据大小类取配置 */
        public getCfgBybsClass(b: number, s: number): equip_suit {
            return this._tab[b][s];
        }

        /**获取所有大类id */
        public get bClassIds(): number[] {
            return this._bClassIds;
        }

        /**根据大类获取id数组 */
        public getIdsBybClass(bClass: number): number[] {
            return this._sClassIds[bClass];
        }

        /**根据id 获取配置*/
        public getCfgById(id: number): equip_suit {
            return this._cfg[id];
        }

        public get ids(): number[] {
            return this._ids;
        }

        /**根据已经开启的 获取可以操作的*/
        public getActiveIdsByYetId(id: int): int[] {
            let ids: int[] = this._tab2[id];
            if (!ids) {
                return this.getActiveIdsByYetId(this.getIdById(id, -1));
            }
            return ids;
        }

        //-1 往前取  1往后取
        public getIdById(curId: int, dir: int): int {
            let index: int = this._ids.indexOf(curId);
            if (index === -1) return null;
            index = dir === -1 ? --index : ++index;
            return this._ids[index];
        }
    }
}
