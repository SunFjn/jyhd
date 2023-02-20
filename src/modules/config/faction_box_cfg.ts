/////<reference path="../$.ts"/>
/** 仙盟宝箱配置 */
namespace modules.config {

    import faction_box = Configuration.faction_box;
    import faction_boxFields = Configuration.faction_boxFields;

    export class FactionBoxCfg {
        private static _instance: FactionBoxCfg;
        public static get instance(): FactionBoxCfg {
            return this._instance = this._instance || new FactionBoxCfg();
        }

        private _tab: Table<faction_box>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<faction_box> = GlobalData.getConfig("faction_box");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                let cfg: faction_box = arr[i];
                let lv: number = cfg[faction_boxFields.level];
                this._tab[lv] = cfg;
            }
        }

        // 根据lv获取配置
        public getCfgBylv(lv: int): faction_box {
            return this._tab[lv];
        }

    }
}
