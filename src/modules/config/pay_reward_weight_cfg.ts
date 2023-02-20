namespace modules.config {
    import pay_reward_weight = Configuration.pay_reward_weight;
    import pay_reward_weightFields = Configuration.pay_reward_weightFields;
    import PayRewardWeightNode = Configuration.PayRewardWeightNode;
    import PayRewardWeightNodeFields = Configuration.PayRewardWeightNodeFields;

    import Dictionary = Laya.Dictionary;

    /** 充值獎勵表*/
    export class payRewardWeightCfg {
        private static _instance: payRewardWeightCfg;
        public static get instance(): payRewardWeightCfg {
            return this._instance = this._instance || new payRewardWeightCfg();
        }

        private _lvDic: Dictionary;
        private _weightCfgs: Array<PayRewardWeightNode>;
        private _money: number;

        constructor() {
            this.init();
        }

        private init(): void {
            this._lvDic = new Dictionary();
            this._weightCfgs = new Array<PayRewardWeightNode>();
            let cfgs: Array<pay_reward_weight> = GlobalData.getConfig("pay_reward_weight");
            this._weightCfgs = cfgs[0][pay_reward_weightFields.weight];
            this._weightCfgs.sort(this.shortWeightCfgs);
            this.money = cfgs[0][pay_reward_weightFields.money];//多少錢可以抽一次
            for (let i: int = 0, len = this._weightCfgs.length; i < len; i++) {
                let cfg: PayRewardWeightNode = this._weightCfgs[i];
                this._lvDic.set(cfg[PayRewardWeightNodeFields.index], cfg);
            }
        }

        /**
         * short
         */
        public shortWeightCfgs(A: PayRewardWeightNode, B: PayRewardWeightNode): number {
            let indexA = A[PayRewardWeightNodeFields.index];
            let indexB = B[PayRewardWeightNodeFields.index];
            let returnNum = 1;
            indexA > indexB ? returnNum = 1 : returnNum = -1;
            return returnNum;
        }

        /**  多少錢一次 */
        public get money(): int {
            return this._money;
        }

        /**  多少錢一次 */
        public set money(value: int) {
            this._money = value;
        }

        public getWeightCfgs(): Array<PayRewardWeightNode> {
            return this._weightCfgs;
        }

        // public getWeightKey(lv: int): number {
        //     return this._weightCfgs;
        // }
        /**
         * 获取才氣值獎勵配置表长度
         */
        public getlvDicLeng(): number {
            return this._lvDic.keys.length;
        }

        /**根据档次 index  获取 pay_reward_weight 所有数据*/
        public get_pay_reward_weight(lv: int): pay_reward_weight {
            return this._lvDic.get(lv);
        }
    }
}