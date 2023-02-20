namespace modules.config {
    import money_cat = Configuration.money_cat;
    import money_catFields = Configuration.money_catFields;

    export class MoneyCatCfg {
        private static _instance: MoneyCatCfg;
        public static get instance(): MoneyCatCfg {
            return this._instance = this._instance || new MoneyCatCfg();
        }

        private _arr:Array<money_cat>;
        private _table:Table<money_cat>;
        public get length():number{
            return this._arr.length;
        }

        constructor() {
            this.init();
        }

        private init(): void {
            this._table={};
            this._arr = GlobalData.getConfig("money_cat");
            for(let i = 0;i<this._arr.length;++i){
                this._table[this._arr[i][money_catFields.era]]=this._arr[i];
            }
        }

        /**根据觉醒重数查找 */
        public getCfgByEra(era:number):money_cat{
            return this._table[era];
        }

        public getCfgByIndex(index:number):money_cat{
            return this._arr[index];
        }

        public get arr():Array<money_cat>{
            return this._arr;
        }
    }
}