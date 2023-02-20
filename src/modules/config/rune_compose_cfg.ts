namespace modules.config {
    import rune_compose = Configuration.rune_compose;
    import rune_composeFields = Configuration.rune_composeFields;

    export class RuneComposeCfg {
        private static _instance: RuneComposeCfg;
        public static get instance(): RuneComposeCfg {
            return this._instance = this._instance || new RuneComposeCfg();
        }

        private _ids_tab: Table<rune_compose>;
        private _category_tab: Table<Array<rune_compose>>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._ids_tab = {};
            this._category_tab = {};
            let tab: Table<rune_compose> = GlobalData.getConfig("rune_compose");

            for (const i in tab) {
                this._ids_tab[tab[i][rune_composeFields.id]] = tab[i];
                if (!this._category_tab[tab[i][rune_composeFields.mClass][0]]) {
                    this._category_tab[tab[i][rune_composeFields.mClass][0]] = [];
                }
                this._category_tab[tab[i][rune_composeFields.mClass][0]].push(tab[i]);
            }
        }

        public getCfgById(id: number): rune_compose {
            return this._ids_tab[id];
        }

        public getCfgByCategory(category_id: number): Array<rune_compose> {
            return this._category_tab[category_id];
        }

        public getBigClassArr(): Array<any> {
            let arr = [];
            let alerady_add_arr = [];
            for (const key in this._ids_tab) {
                if (Object.prototype.hasOwnProperty.call(this._ids_tab, key)) {
                    const bigClass = this._ids_tab[key][rune_composeFields.mClass];
                    if (alerady_add_arr.indexOf(bigClass[0]) == -1) {
                        arr.push(bigClass);
                        alerady_add_arr.push(bigClass[0]);
                    }
                }
            }
            return arr;
        }
    }
}