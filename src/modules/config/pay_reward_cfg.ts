namespace modules.config {
    import Items = Configuration.Items;
    import pay_reward_reward = Configuration.pay_reward_reward;
    import pay_reward_rewardFields = Configuration.pay_reward_rewardFields;
    import Dictionary = Laya.Dictionary;

    /** 才氣值獎勵*/
    export class PayRewardCfg {
        private static _instance: PayRewardCfg;
        public static get instance(): PayRewardCfg {
            return this._instance = this._instance || new PayRewardCfg();
        }

        private _lvDic: Dictionary;
        public _cfgs: Array<pay_reward_reward>;

        constructor() {
            this._cfgs = new Array<pay_reward_reward>();
            this.init();
        }

        private init(): void {
            this._lvDic = new Dictionary();
            this._cfgs = GlobalData.getConfig("pay_reward_reward");
            for (let i: int = 0, len = this._cfgs.length; i < len; i++) {
                let cfg: pay_reward_reward = this._cfgs[i];
                this._lvDic.set(cfg[pay_reward_rewardFields.grade], cfg);
            }
        }

        /**
         * 获取才氣值獎勵配置表长度
         */
        public getlvDicLeng(): number {
            return this._lvDic.keys.length;
        }

        /**根据档次 grade  获取 pay_reward_reward 所有数据*/
        public get_pay_reward_reward(lv: int): pay_reward_reward {
            return this._lvDic.get(lv);
        }

        /**根据档次 grade  获取 条件*/
        public get_condition(lv: int): number {
            if (this._lvDic.get(lv) == undefined) {
                return 99999;
            }
            return this._lvDic.get(lv)[pay_reward_rewardFields.condition];
        }

        /**根据档次 reward  获取 奖励*/
        public get_reward(lv: int): Array<Items> {
            return this._lvDic.get(lv)[pay_reward_rewardFields.reward];
        }
    }
}