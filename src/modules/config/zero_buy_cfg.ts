namespace modules.config {
    import Items = Configuration.Items;
    import zero_buy = Configuration.zero_buy;
    import zero_buyFields = Configuration.zero_buyFields;
    import Dictionary = Laya.Dictionary;

    /** 零元购配置*/
    export class ZeroBuyCfg {
        private static _instance: ZeroBuyCfg;
        public static get instance(): ZeroBuyCfg {
            return this._instance = this._instance || new ZeroBuyCfg();
        }

        private _lvDic: Dictionary;

        constructor() {
            this.init();
        }

        private init(): void {
            this._lvDic = new Dictionary();
            let cfgs: Array<zero_buy> = GlobalData.getConfig("zero_buy");
            // console.log("cfgs:  ", cfgs);
            for (let i: int = 0, len = cfgs.length; i < len; i++) {
                let cfg: zero_buy = cfgs[i];
                this._lvDic.set(cfg[zero_buyFields.grade], cfg);
            }
            //测试数据
            // this._lvDic.set(3, cfgs[1]);
            // this._lvDic.set(4, cfgs[2]);
            // this._lvDic.set(5, cfgs[0]);
            // this._lvDic.set(6, cfgs[1]);
        }

        /**
         * 获取显示模式(0正常显示,1显示倍数,2显示万单位)
         */
        public get_model(lv: int): number {
            if (this._lvDic.get(lv) == undefined) {
                return 0;
            }
            // return this._lvDic.get(lv)[zero_buyFields.model];
        }

        /**
         * 获取零元购配置表长度
         */
        public getlvDicLeng(): number {
            return this._lvDic.keys.length;
        }

        /**根据档次 grade  获取 zero_buy 所有数据*/
        public get_zero_buy(lv: int): zero_buy {
            return this._lvDic.get(lv);
        }

        /**根据档次 grade  获取 累计金额*/
        public get_money(lv: int): number {
            if (this._lvDic.get(lv) == undefined) {
                return 0
            }
            return this._lvDic.get(lv)[zero_buyFields.xianyu];
        }

        /**根据档次 reward  获取 奖励*/
        public get_reward(lv: int): Array<Items> {
            return this._lvDic.get(lv)[zero_buyFields.reward];
        }

        /**根据档次 restDay  获取 返还天数*/
        public get_restDay(lv: int): number {
            if (this._lvDic.get(lv) == undefined) {
                return 0
            }
            return this._lvDic.get(lv)[zero_buyFields.restDay];
        }

        /**根据档次 extraReward  获取 返还奖励*/
        public get_extraReward(lv: int): Array<Items> {
            return this._lvDic.get(lv)[zero_buyFields.extraReward];
        }
    }
}