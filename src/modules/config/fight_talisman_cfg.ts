namespace modules.config {
    import fight_talisman = Configuration.fight_talisman;
    import fight_talismanFields = Configuration.fight_talismanFields;

    export class FightTalismanCfg {
        private static _instance: FightTalismanCfg;
        public static get instance(): FightTalismanCfg {
            return this._instance = this._instance || new FightTalismanCfg();
        }

        private _arr: Array<fight_talisman>;
        private _table: Table<fight_talisman>;
        public get length(): number {
            return this._arr.length;
        }

        constructor() {
            this.init();
        }

        private init(): void {
            this._table = {};
            this._arr = GlobalData.getConfig("fight_talisman");
            for (let i = 0; i < this._arr.length; ++i) {
                this._table[this._arr[i][fight_talismanFields.era]] = this._arr[i];
            }
        }

        
        
        /**根据觉醒重数查找 */
        public getCfgByEra(era: number): fight_talisman {
            return this._table[era];
        } 

        public getCfgByIndex(index: number): fight_talisman {
            return this._arr[index];
        }

        public get arr(): Array<fight_talisman> {
            return this._arr;
        }

        /**根据ID和觉醒重数查找 */
        public getCfgByEraAId(id: number, era: number): fight_talisman {
            let arr = this._arr.filter((ele) => ele[fight_talismanFields.id] === id);
            for (let i = 0; i < arr.length; ++i) {
                this._table[arr[i][fight_talismanFields.era]] = arr[i];
            }
            return this._table[era];
        }
    }
}