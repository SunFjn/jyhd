namespace modules.config {
    import xianfu_mall2 = Configuration.xianfu_mall2;
    import xianfu_mall2Fields = Configuration.xianfu_mall2Fields;

    export class XianFuMallCfg {
        private static _instance: XianFuMallCfg;
        public static get instance(): XianFuMallCfg {
            return this._instance = this._instance || new XianFuMallCfg();
        }

        private _tab: Table<xianfu_mall2>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<xianfu_mall2> = GlobalData.getConfig("xianfu_mall2");
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                this._tab[arr[i][xianfu_mall2Fields.id]] = arr[i];
            }      
        }

        public getCfgById(id: number): xianfu_mall2 {
            return this._tab[id];
        }


    }
}