/**登录豪礼(周末狂欢)*/


namespace modules.week_login{
    import GetWeekLoginAwardFields = Protocols.GetWeekLoginAwardFields;
    import GetWeekLoginAward       = Protocols.GetWeekLoginAward;
    import GetWeekLoginFields = Protocols.GetWeekLoginFields;
    import GetWeekLoginReplyFields = Protocols.GetWeekLoginReplyFields;
    import SinglePayModel = modules.singlePay.SinglePayModel;

    export class WeekLoginModel {
        private static _instance: WeekLoginModel;
        public static get instance(): WeekLoginModel {
            return this._instance = this._instance || new WeekLoginModel();
        }

        private _state : boolean;
        private _time  : number;
        private _nodeList:Array<any>;

        private constructor() {
            //活动开启状态
            this._state = false;
            //结束时间
            this._time  = 0;
            //列表 id+状态(0、不可领,1、可领,2、明天可领,3、已领)
            this._nodeList = [];
        }
        public updateInfo(tuple:Protocols.GetWeekLoginReply){
            this._state = tuple[GetWeekLoginReplyFields.state];
            this._time  = tuple[GetWeekLoginReplyFields.time];//+ GlobalData.serverTime
            this._nodeList = tuple[GetWeekLoginReplyFields.stateList];
            this.setFuncState();

            GlobalData.dispatcher.event(CommonEventType.WEEK_LOGIN_UPDATE);
        }

        public get state(): boolean {
            return this._state;
        }
        public get time(): number {
            return this._time;
        }
        public get nodeList(): Array<any> {
            return this._nodeList;
        }

        // 根据id获取奖励信息
        public getNodeInfoById(id: int): Array<any> {
            let t: GetWeekLoginAward = null;
            if (this._nodeList) {
                for (let i: int = 0, len: int = this._nodeList.length; i < len; i++) {
                    let node: GetWeekLoginAward = this._nodeList[i];
                    if (id === node[GetWeekLoginAwardFields.id]) {
                        t = node;
                        break;
                    }
                }
            }
            return t;
        }
        //设置红点
        public setPayRewardRP() {
            let isWeekLogindRP = this.getgRadeRP();

            redPoint.RedPointCtrl.instance.setRPProperty("weekLoginRP", isWeekLogindRP);
        }
        //登录豪礼是否有可领取
        public getgRadeRP(): boolean {
            if (this.nodeList) {
                for (var index = 0; index < this.nodeList.length; index++) {
                    let element = this.nodeList[index];
                    if (element) {
                        let stateNum = element[1];
                        if (stateNum == 1) {//0不可领取1可领取2已领取
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        public setFuncState(): void {
            //关闭页签
            let _openState = this._state ? ActionOpenState.open : ActionOpenState.close;
            modules.funcOpen.FuncOpenModel.instance.setActionOpen(ActionOpenId.weekLogin, _openState);
        }
    }
}