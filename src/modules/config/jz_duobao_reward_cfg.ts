namespace modules.config {

    import jzduobao_reward = Configuration.jzduobao_reward;
    import jzduobao_rewardFields = Configuration.jzduobao_rewardFields;

    export class JzDuobaoRewardCfg {
        private static _instance: JzDuobaoRewardCfg;
        public static get instance(): JzDuobaoRewardCfg {
            return this._instance = this._instance || new JzDuobaoRewardCfg();
        }

        private _tab1: Table<jzduobao_reward>;
        private _tab2: Table<Array<jzduobao_reward>>;
        private _Dates: Array<jzduobao_reward>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab1 = {};
            this._tab2 = {};
            this._Dates = new Array<jzduobao_reward>();
            this._Dates = GlobalData.getConfig("jzduobao_reward");
            for (let index = 0; index < this._Dates.length; index++) {
                let element = this._Dates[index];
                if (element) {
                    let id = element[jzduobao_rewardFields.id];
                    this._tab1[id] = (element);
                    let grade = element[jzduobao_rewardFields.grade];
                    this._tab1[grade] = (element);
                }
            }
        }
        /**
         * 获取数据
         * @param type 类型
         * @param day 天数
         * @param grade 档次
         */
        public getDate(id: number): jzduobao_reward {
            let dates = this._tab1[id];
            return dates;
        }

        public getDateArr(): Array<jzduobao_reward> {
            return this._Dates;
        }
    }
}
