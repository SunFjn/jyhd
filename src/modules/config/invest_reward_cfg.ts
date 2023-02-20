/////<reference path="../$.ts"/>
/** 投资返利 */
namespace modules.invest_reward {
    import Dictionary = laya.utils.Dictionary;
    import invest_rewardFields = Configuration.invest_rewardFields;
    import invest_reward = Configuration.invest_reward;

    export class InvestRewardCfg {
        private static _instance: InvestRewardCfg;
        public static get instance(): InvestRewardCfg {
            return this._instance = this._instance || new InvestRewardCfg();
        }

        private _dic: Dictionary;
        private getTab: invest_reward[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._dic = new Dictionary();
            let arr: Array<invest_reward> = GlobalData.getConfig("invest_reward");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._dic.set(arr[i][invest_rewardFields.taskId], arr[i]);
            }
            this.getTab = arr;
        }

        public getCfgBytype(type: number): invest_reward[] {
            let gra: invest_reward[] = [];
            for (let i: int = 0, len: int = this.getTab.length; i < len; i++) {
                let grad: number = this.getTab[i][invest_rewardFields.type];
                if (type == grad) {
                    gra.push(this.getTab[i]);
                }
            }
            return gra;
        }

        // 根据ID获取配置
        public getCfgById(id: int): invest_reward {
            return this._dic.get(id);
        }

    }
}