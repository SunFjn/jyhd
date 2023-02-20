namespace modules.config {
    import fish_gift_cfg = Configuration.fish_gift_cfg;
    import fish_gift_cfgFields = Configuration.fish_gift_cfgFields;
    import Items = Configuration.Items;


    export class LimitGiftCfg {
        private static _instance: LimitGiftCfg;
        public static get instance(): LimitGiftCfg {
            return this._instance = this._instance || new LimitGiftCfg();
        }
        private _tab: Array<Table<fish_gift_cfg>>;
        private getTab: Array<fish_gift_cfg>;
        private _gift_id_arr: Array<Array<number>>;

        constructor() {
            this.init();
        }
        private init(): void {
            this._tab = [];
            this._gift_id_arr = new Array();
            let arr: Array<fish_gift_cfg> = GlobalData.getConfig("limit_xunbao_cash_gift");
            this.getTab = arr;
            for (let e of arr) {
                let id: number = e[fish_gift_cfgFields.id];
                let bigtype: number = e[fish_gift_cfgFields.type];

                if (typeof this._tab[bigtype] == "undefined") {
                    this._tab[bigtype] = {};
                }
                this._tab[bigtype][id] = e;

                if (typeof this._gift_id_arr[bigtype] == "undefined") {
                    this._gift_id_arr[bigtype] = new Array();
                }
                this._gift_id_arr[bigtype].push(id);
            }
        }

        public getArrDare(bigtype: number, id: number): fish_gift_cfg {
            // console.log('vtz:this._tab', this._tab);
            return this._tab[bigtype][id];
        }

        // 获取id列表
        public giftIdArrByType(bigtype: number): Array<number> {
            return this._gift_id_arr[bigtype];
        }

        /**
         * 获取限购次数
         * level字段先当限购用吧
         *@param count 已购次数
         */
        public getLimitBuyMaxByType(bigtype: number, id: number): Array<number> {
            return this._tab[bigtype][id][fish_gift_cfgFields.limitBuy];
        }

        /**
         * 获取奖励
         */
        public getRewardsMaxByType(bigtype: number, id: number): Array<Items> {
            return this._tab[bigtype][id][fish_gift_cfgFields.rewards];
        }

        /**
         * 获取原价
         */
        public getPriceMaxByType(bigtype: number, id: number): number {
            return this._tab[bigtype][id][fish_gift_cfgFields.originalPrice];
        }

        /**
         * 获取充值档次id
         */
        public getRechargeByType(bigtype: number, id: number): number {
            return this._tab[bigtype][id][fish_gift_cfgFields.recharge];
        }


        // public getArrByLevel(level: number): Array<fish_gift_cfg> {
        //     let arr: Array<fish_gift_cfg> = [];
        //     //let arr: Array<fish_gift_cfg> = GlobalData.getConfig("fish_gift_cfg");

        //     for (let i = 0; i < this.getTab.length; i++) {
        //         if (level >= this.getTab[i][fish_gift_cfgFields.level][0] && level <= this.getTab[i][fish_gift_cfgFields.level][1]) {
        //             let a0 = this.getTab[i][fish_gift_cfgFields.level][0];
        //             let a1 = this.getTab[i][fish_gift_cfgFields.level][1];
        //             let a2 = this.getTab[i][i];
        //             arr.push(this.getTab[i]);
        //         }
        //     }

        //     // console.log("this.arr = " + arr);
        //     return arr;
        // }
    }
}