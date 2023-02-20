/////<reference path="../$.ts"/>
/** 仙盟配置 */
namespace modules.config {
    import faction = Configuration.faction;
    import factionFields = Configuration.factionFields;

    export class FactionCfg {
        private static _instance: FactionCfg;
        public static get instance(): FactionCfg {
            return this._instance = this._instance || new FactionCfg();
        }

        private _tab: Table<faction>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<faction> = GlobalData.getConfig("faction");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][factionFields.level]] = arr[i];
            }
        }

        // 根据等级获取配置
        public getCfgByLv(lv: int): faction {
            return this._tab[lv];
        }

    }
}