/////<reference path="../$.ts"/>
/** 登录豪礼 */
namespace modules.config {
    import login_reward = Configuration.login_reward;
    import login_rewardFields = Configuration.login_rewardFields;
    import Dictionary = laya.utils.Dictionary;

    export class LoginRewardCfg {
        private static _instance: LoginRewardCfg;
        private _idDic: Dictionary;
        private getTab: login_reward[];//fixed
        private _dates: Array<login_reward>;

        public static get instance(): LoginRewardCfg {
            return this._instance = this._instance || new LoginRewardCfg();
        }

        constructor() {
            this.init();
        }

        private init(): void {
            this._dates = new Array<login_reward>();
            let arr: Array<login_reward> = GlobalData.getConfig("login_reward");
            this._dates = arr;
            this.getTab = arr;

            this._idDic = new Dictionary();

            for (let i = 0; i < arr.length; i++) {
                let cfg = arr[i];

                let id = cfg[login_rewardFields.id];

                this._idDic.set(id, cfg);
                // this._levelDic.set(level,this._lvTab[level]);
            }
        }

        public byIndex(num: number): any {
            return this.getTab[num];
        }

        public getCfgBytype(type: number, sumType: number): login_reward[] {
            let gra: login_reward[] = [];

            for (let i: int = 0, len: int = this.getTab.length; i < len; i++) {
                let grad: Array<number> = this.getTab[i][login_rewardFields.type];

                // console.log("this.getTab[i] = " + this.getTab[i]);

                // console.log("-----------------------getTab[i] = " + typeof this.getTab[i]);

                // console.log("grad = " + grad);

                //console.log("grad[0] = " + grad[0]);

                //  console.log("grad[1] = " + grad[1]);

                // console.log("-----------------------grad = " + typeof grad);

                if (type == grad[0] && sumType == grad[1]) {//
                    gra.push(this.getTab[i]);
                }
            }
            return gra;
        }

        public getCfgById(id: number): login_reward[] {
            return this._idDic.get(id);
        }
    }
}