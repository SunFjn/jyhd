/////<reference path="../$.ts"/>
/** 仙丹配置 */
namespace modules.config {
    import xiandan = Configuration.xiandan;
    import xiandanFields = Configuration.xiandanFields;

    export class XianDanCfg {
        private static _instance: XianDanCfg;
        public static get instance(): XianDanCfg {
            return this._instance = this._instance || new XianDanCfg();
        }

        private _tab: Table<xiandan>;
        private _sIds: number[];
        private _sIdTab: Table<number[]>;
        private _ids: number[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._sIds = [];
            this._sIdTab = {};
            this._ids = [];
            let arr: Array<xiandan> = GlobalData.getConfig("xiandan");
            arr.forEach((ele) => {
                let id: number = ele[xiandanFields.id];
                this._ids.push(id);
                let sId: number = id % 100 >> 0;
                if (this._sIds.indexOf(sId) == -1) {
                    this._sIds.push(sId);
                }
                if (!this._sIdTab[sId]) {
                    this._sIdTab[sId] = [];
                }
                this._sIdTab[sId].push(id);
                this._tab[id] = ele;
            });
        }
        public get ids(): number[] {
            return this._ids;
        }

        public getCfgById(id: number): xiandan {
            return this._tab[id];
        }

        public get sIds(): number[] {
            return this._sIds;
        }

        public getIdsBySId(sId: number): number[] {
            return this._sIdTab[sId];
        }
    }
}