/** 签到配置*/

namespace modules.config {
    import Dictionary = Laya.Dictionary;
    import sign_reward = Configuration.sign_reward;
    import sign_rewardFields = Configuration.sign_rewardFields;

    export class SignRewardCfg {
        private static _instance: SignRewardCfg;
        public static get instance(): SignRewardCfg {
            return this._instance = this._instance || new SignRewardCfg();
        }

        private _cfgInited: boolean;
        public _signcfgs: Array<any>;
        private _addCountArr: Array<sign_reward>;
        private _signDic: Dictionary;

        constructor() {
            this.init();
        }

        private init(): void {
            this._signDic = new Dictionary();
            this._signcfgs = new Array<any>();
            var cfgs = GlobalData.getConfig("sign_reward");
            for (let i: number = 0, len = cfgs.length; i < len; i++) {
                let vfg = cfgs[i];
                let level = vfg[sign_rewardFields.level];
                if (this._signcfgs[level] == null) {
                    this._signcfgs[level] = [vfg];
                } else {
                    this._signcfgs[level].push(vfg);
                }
            }
            for (let i = 0; i < this._signcfgs.length; i++) {
                this._signDic.set(i, this._signcfgs[i]);
            }

        }

        // 根据层数获取签到配置
        public getCfgByLevel(level: int): Array<sign_reward> {
            return this._signDic.get(level)
        }

        // 根据层数获取有特殊奖励的下一关配置
        public getCfgByReward(level: int): Array<sign_reward> {
            this._addCountArr = new Array<sign_reward>();
            let cfgs: Array<sign_reward> = this.getCfgByLevel(level);
            for (let j = 0; j < 31; j++) {
                let cfg: sign_reward = cfgs[j];
                if (cfg[sign_rewardFields.addAward].length != 0) {
                    this._addCountArr.push(cfg);
                }
            }
            return this._addCountArr;
        }
    }
}