/////<reference path="../$.ts"/>
/** 开服礼包 */
namespace modules.config {
    import open_reward = Configuration.open_reward;
    import open_rewardFields = Configuration.open_rewardFields;

    export class OpenAwardCfg {
        private static _instance: OpenAwardCfg;
        public static get instance(): OpenAwardCfg {
            return this._instance = this._instance || new OpenAwardCfg();
        }

        private _tab: Table<open_reward>;
        private _ids: number[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._ids = [];
            let arr: Array<open_reward> = GlobalData.getConfig("open_reward");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                let id: number = arr[i][open_rewardFields.id];
                this._ids.push(id);
                this._tab[id] = arr[i];
            }
        }

        public getCfgById(id: number): open_reward {
            return this._tab[id];
        }

        public get ids(): number[] {
            return this._ids;
        }

    }
}