/** 九霄令奖励配置 */
namespace modules.config {

    import jiuXiaoLingAward = Configuration.jiuXiaoLingAward;
    import jiuXiaoLingAwardFields = Configuration.jiuXiaoLingAwardFields;
    import Items = Configuration.Items;

    export class JiuXiaoLingAwardCfg {
        private static _instance: JiuXiaoLingAwardCfg;
        public static get instance(): JiuXiaoLingAwardCfg {
            return this._instance = this._instance || new JiuXiaoLingAwardCfg();
        }

        private _tab: Table<jiuXiaoLingAward>;
        private _level: number;
        private _final_award: Items;
        // private _normaltab: Table<jiuXiaoLingAward>;
        // private _goldtab: Table<jiuXiaoLingAward>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._level = 0;
            let arr: Array<jiuXiaoLingAward> = GlobalData.getConfig("jiuxiaoling_award");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                let level: number = arr[i][jiuXiaoLingAwardFields.level];
                this._tab[level] = arr[i];

                // 最高等级
                if (level >= this._level) {
                    this._level = level;
                    this._final_award = arr[i][jiuXiaoLingAwardFields.final_award][0];
                }
            }

        }

        //获取所有数据
        public getAllConfig(): Table<jiuXiaoLingAward> {
            return this._tab;
        }

        //获取最终大奖
        public getFinalAward(): Items {
            return this._final_award;
        }

        //获取最高等级（长度）
        public get level(): number {
            return this._level;
        }


        //获取升级经验
        public getUpLevelExp(level: number): number {
            //最高等级则不再需要等级经验
            if (level == this.level) {
                return 0;
            }
            //获取下一级所需经验
            level++;
            let nextData: jiuXiaoLingAward = this._tab[level];

            let nextExp: number = nextData[jiuXiaoLingAwardFields.condition];

            return nextExp;
        }
    }
}