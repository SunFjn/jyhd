namespace modules.config {

    import Dictionary = laya.utils.Dictionary;
    import online_rewardFields = Configuration.online_rewardFields;
    import online_reward = Configuration.online_reward;

    export class OnlineGiftCfg {
        private static _instance: OnlineGiftCfg;
        public static get instance(): OnlineGiftCfg {
            return this._instance = this._instance || new OnlineGiftCfg();
        }

        private _giftCfgs: Array<any>;

        private _levelDic: Dictionary;
        private _idDic: Dictionary;

        private _lvTab: Table<online_reward[]>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._levelDic = new Dictionary();
            this._idDic = new Dictionary();

            this._giftCfgs = new Array<any>();
            this._lvTab = {};
            let cfgs: Array<any> = GlobalData.getConfig("online_reward");
            for (let i = 0; i < cfgs.length; i++) {
                let cfg = cfgs[i];
                let id = cfg[online_rewardFields.id];
                this._idDic.set(id, cfg);
                let level = cfg[online_rewardFields.eraLevel];
                if (this._lvTab[level] != null) {
                    this._lvTab[level].push(cfg);
                } else {
                    this._lvTab[level] = [cfg];
                }
                // this._levelDic.set(level,this._lvTab[level]);
            }

        }

        public getCfgsByEralv(lv: number): Array<online_reward> {
            return this._lvTab[lv];
        }

        public getCfgsById(id: number): online_reward {
            return this._idDic.get(id);
        }
    }
}