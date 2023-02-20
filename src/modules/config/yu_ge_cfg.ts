namespace modules.config {
    import yuge = Configuration.yuge;
    import yugeFields = Configuration.yugeFields;

    export class yuGeCfg {
        private static _instance: yuGeCfg;
        public static get instance(): yuGeCfg {
            return this._instance = this._instance || new yuGeCfg();
        }

        private _tab: Table<yuge>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<yuge> = GlobalData.getConfig("yuge");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                this._tab[arr[i][yugeFields.id]] = arr[i];
            }

            
        }

        public getCfgById(id: number): yuge {
            return this._tab[id];
        }


    }
}