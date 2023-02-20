/////<reference path="../$.ts"/>
/** 资源找回 */
namespace modules.config {
    import retrieve_lilian = Configuration.retrieve_lilian;
    import retrieve_res = Configuration.retrieve_res;

    export class RetrieveCfg {
        private static _instance: RetrieveCfg;
        public static get instance(): RetrieveCfg {
            return this._instance = this._instance || new RetrieveCfg();
        }

        private _tab1: Table<retrieve_lilian>;
        private _tab2: Table<retrieve_res>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab1 = GlobalData.getConfig("retrieve_lilian");
            this._tab2 = GlobalData.getConfig("retrieve_res");
        }

        public getLilianCfgById(id: int): retrieve_lilian {
            return this._tab1[id];
        }
        public getResCfgById(id: int): retrieve_res {
            return this._tab2[id];
        }
    }
}