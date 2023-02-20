/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.invest_reward {
    import InvestrewardState = Protocols.InvestrewardState;
    import InvestrewardReward = Protocols.InvestrewardReward;
    import UpdateInvestRewardInfoFields = Protocols.UpdateInvestRewardInfoFields;
    import InvestrewardStateFields = Protocols.InvestrewardStateFields;
    import InvestrewardRewardFields = Protocols.InvestrewardRewardFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import invest_rewardFields = Configuration.invest_rewardFields;
    import PrivilegeCfg = modules.config.PrivilegeCfg;
    export class InvestRewardModel {
        private static _instance: InvestRewardModel;
        public static get instance(): InvestRewardModel {
            return this._instance = this._instance || new InvestRewardModel();
        }

        /*开启状态(0未开启 1开启 2开启后关闭)*/
        private _giveState: number;
        /*登录次数*/
        private _loginCount: number;
        /*天关等级*/
        private _tianguanLevel: number;
        /*人物等级*/
        private _actorLevel: number;
        /*购买状态列表*/
        private _stateList: Table<InvestrewardState>;
        /*奖励列表*/
        private _rewardList: Table<InvestrewardReward>;
        public _result: number;

        private constructor() {
            this._giveState = 0;
            this._loginCount = 0;
            this._tianguanLevel = 0;
            this._actorLevel = 0;
            this._stateList = {};
            this._rewardList = {};
        }

        //更新
        public updateInfo(tuple: Protocols.UpdateInvestRewardInfo) {
            this._giveState = tuple[UpdateInvestRewardInfoFields.state];
            this._loginCount = tuple[UpdateInvestRewardInfoFields.loginCount];
            this._tianguanLevel = tuple[UpdateInvestRewardInfoFields.tianguanLevel];
            this._actorLevel = tuple[UpdateInvestRewardInfoFields.actorLevel];
            let stateList = tuple[UpdateInvestRewardInfoFields.stateList];
            for (let i: int = 0; i < stateList.length; i++) {
                this._stateList[stateList[i][InvestrewardStateFields.type]] = stateList[i];
            }
            let rewardList = tuple[UpdateInvestRewardInfoFields.rewardList];
            for (let i: int = 0; i < rewardList.length; i++) {
                this._rewardList[rewardList[i][InvestrewardRewardFields.taskId]] = rewardList[i];
            }
            GlobalData.dispatcher.event(CommonEventType.INVEST_REWARD_UPDATE);
            this.investRewardPRState();
        }

        public get giveState(): number {
            return this._giveState;
        }

        public get loginCount(): number {
            return this._loginCount;
        }

        public get tianguanLevel(): number {
            return this._tianguanLevel;
        }

        public get actorLevel(): number {
            return this._actorLevel;
        }

        public get stateList(): Table<InvestrewardState> {
            return this._stateList;
        }

        public get rewardList(): Table<InvestrewardReward> {
            return this._rewardList;
        }

        public investRewardPRState(): void {
            let loginState: boolean = false;
            let recruitState: boolean = false;
            let growthState: boolean = false;
            for (let key in this._rewardList) {
                if (this._rewardList[key]) {
                    let id = this._rewardList[key][InvestrewardRewardFields.taskId];
                    let gia = InvestRewardCfg.instance.getCfgById(id);
                    let type = gia[invest_rewardFields.type];
                    if (this._rewardList[key][InvestrewardRewardFields.state] == 1) {
                        if (type == 0) {
                            loginState = true;
                        } else if (type == 1) {
                            recruitState = true;
                        } else if (type == 2) {
                            growthState = true;
                        }
                    }
                }
            }
            let loginState1: boolean = this.getIsTouZhi(0);
            let recruitState1: boolean = this.getIsTouZhi(1);
            let growthState1: boolean = this.getIsTouZhi(2);
            RedPointCtrl.instance.setRPProperty("investLoginRP", (loginState || (!loginState && loginState1)));
            RedPointCtrl.instance.setRPProperty("investRecruitRP", (recruitState || (!recruitState && recruitState1)));
            RedPointCtrl.instance.setRPProperty("investGrowthRP", (growthState || (!growthState && growthState1)));
        }
        //是否可以投资
        private getIsTouZhi(type: number): boolean {
            let arr = InvestRewardCfg.instance.getCfgBytype(type);//0登录返利1闯关法力2为成长返利
            let _cfgItem = arr[arr.length - 1];
            let grow = _cfgItem[invest_rewardFields.goldPrice];
            let stateList: Table<InvestrewardState> = InvestRewardModel.instance.stateList;
            let vipLevel1 = 0;
            if (type == 0) {
                let vip: number[] = PrivilegeCfg.instance.getMinLvMaxLvByType(10);
                vipLevel1 = vip[0];
            } else if (type == 1) {
                let vip: number[] = PrivilegeCfg.instance.getMinLvMaxLvByType(11);
                vipLevel1 = vip[0];
            } else {
                let vip: number[] = PrivilegeCfg.instance.getMinLvMaxLvByType(12);
                vipLevel1 = vip[0];
            }
            let value = stateList[type];//0登录返利1闯关法力2为成长返利
            let getState = 0;
            if (value) {
                getState = value[InvestrewardStateFields.state]; /*状态(0没有购买 1已购买)*/
            }
            let gold = PlayerModel.instance.ingot;
            let VipLevel = modules.vip.VipModel.instance.vipLevel;
            if (getState == 0) {
                if (gold >= grow && VipLevel >= vipLevel1) {
                    return true;
                }
            }
            else {
                return false;
            }
        }
    }
}