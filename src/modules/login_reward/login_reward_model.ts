///<reference path="../config/login_reward_cfg.ts"/>

/**登录豪礼*/
namespace modules.login_reward {
    import UpdateLoginRewardInfoFields = Protocols.UpdateLoginRewardInfoFields;
    import LoginRewardNode = Protocols.LoginRewardNode;
    import LoginRewardNodeFields = Protocols.LoginRewardNodeFields;
    import login_reward = Configuration.login_reward;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;


    //获取奖励
    export class LoginRewardModel {
        private static _instance: LoginRewardModel;

        public static get instance(): LoginRewardModel {
            return this._instance = this._instance || new LoginRewardModel();
        }

        /*榜单类型(0开服冲榜 1封神榜)*/
        private _rankedType: number;
        /*类型参数*/
        private _typeParame: number;
        /*剩余时间*/
        private _restTm: number;
        /*列表*/
        public _nodeList: Array<any>;
        //是否开启
        private _state: boolean;

        private _arr: login_reward[] = [];

        //倒计时结束文本判断
        public endText: boolean = false;

        private constructor() {
            this._rankedType = 0;
            this._typeParame = 1;
            this._restTm = 0;
            this._nodeList = [];
            this._state = false;
        }

        public get state(): boolean {
            return this._state;
        }


        public updateInfo(tuple: Protocols.UpdateLoginRewardInfo) {
            this._rankedType = tuple[UpdateLoginRewardInfoFields.type];

            this._typeParame = tuple[UpdateLoginRewardInfoFields.param];

            this._restTm = tuple[UpdateLoginRewardInfoFields.restTm] + GlobalData.serverTime;

            this._nodeList = tuple[UpdateLoginRewardInfoFields.nodeList];

            if ( this._nodeList.length > 0 &&this._restTm>= GlobalData.serverTime) {//this._nodeList.length > 0 ||
                this._state = true;
            } else {
                this._state = false;
            }

            this.setFuncState();
            GlobalData.dispatcher.event(CommonEventType.LOGIN_REWARD_UPADTE);
        }

        public get rankedType(): number {
            return this._rankedType;
        }

        public get typeParame(): number {
            return this._typeParame;
        }

        public get restTim(): number {
            return this._restTm;
        }

        public get nodeLit(): Array<any> {
            return this._nodeList;
        }

        // 根据id获取奖励信息
        public getNodeInfoById(id: int): LoginRewardNode {
            let t: LoginRewardNode = null;
            if (this._nodeList) {
                for (let i: int = 0, len: int = this._nodeList.length; i < len; i++) {
                    let node: LoginRewardNode = this._nodeList[i];
                    if (id === node[LoginRewardNodeFields.id]) {
                        t = node;
                        break;
                    }
                }
            }
            return t;
        }

        //设置红点
        public setPayRewardRP() {
            let isLoginRewardRP = this.getgRadeRP();
            redPoint.RedPointCtrl.instance.setRPProperty("loginRewardRP", isLoginRewardRP);
        }

        //登录豪礼是否有可领取
        public getgRadeRP(): boolean {
            if(FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.loginReward)){
                if (this.nodeLit) {
                    for (var index = 0; index < this.nodeLit.length; index++) {
                        let element = this.nodeLit[index];
                        if (element) {
                            let stateNum = element[LoginRewardNodeFields.state];
                            if (stateNum == 1) {//0不可领取1可领取2已领取
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }
        //关闭页签
        public setFuncState(): void {
            let _openState = this._state ? ActionOpenState.open : ActionOpenState.close;
            modules.funcOpen.FuncOpenModel.instance.setActionOpen(ActionOpenId.loginReward, _openState);
        }
    }
}