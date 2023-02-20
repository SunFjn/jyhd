//每日累充
namespace modules.cumulate3_pay {
    import CumulatepayReward = Protocols.CumulatepayReward;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import CumulatepayRewardFields = Protocols.CumulatepayRewardFields;
    import UpdateCumulatepay3InfoFields = Protocols.UpdateCumulatepay3InfoFields;
    import UpdateCumulatepay3Info = Protocols.UpdateCumulatepay3Info;

    export class CumulatePay3Model {
        private static _instance: CumulatePay3Model;
        public static get instance(): CumulatePay3Model {
            return this._instance = this._instance || new CumulatePay3Model();
        }

        /*开启状态(0未开启 1开启)*/
        private _giveState: number;
        //累充豪礼充值金额
        private _totalMoney: number;
        //累充豪礼奖励列表
        private _rewarTab: Array<CumulatepayReward>;
        //累充豪礼活动倒计时
        private _activityTime: number;
        //开服第几天
        private _serverDay: number;
        //当前活动展示的图标名字
        private _currentIconResName: string;
        private _activityName: string;
        private _coverName: string;

        constructor() {
            this._giveState = -1;
            this._totalMoney = -1;
            this._rewarTab = new Array<CumulatepayReward>();
        }

        public updateInfo(tuple: UpdateCumulatepay3Info) {
            // console.log("updateInfo", tuple)
            this._giveState = tuple[UpdateCumulatepay3InfoFields.state];
            this._totalMoney = tuple[UpdateCumulatepay3InfoFields.totalMoney];
            let rewarList = tuple[UpdateCumulatepay3InfoFields.rewardList];
            this._rewarTab = new Array<CumulatepayReward>();
            for (let i: int = 0, len: int = rewarList.length; i < len; i++) {
                this._rewarTab[rewarList[i][CumulatepayRewardFields.id]] = rewarList[i];
            }
            this._activityTime = tuple[UpdateCumulatepay3InfoFields.restTm] + GlobalData.serverTime;
            this._serverDay = tuple[UpdateCumulatepay3InfoFields.serverDay];
            this.cumulatePayPRState();
            this.setFuncState();
            GlobalData.dispatcher.event(CommonEventType.CUMULATE_PAY3_UPDATE);
        }

        public get giveState(): number {
            return this._giveState;
        }

        public get totalMoney(): number {
            return this._totalMoney;
        }

        public get rewarList(): Array<CumulatepayReward> {
            return this._rewarTab;
        }

        public get activityTime(): number {
            return this._activityTime;
        }

        public get serverDay(): number {
            return this._serverDay;
        }

        public getCurrentIconResName(): string {
            return this._currentIconResName;
        }

        public getCurrentActivityName(): string {
            return this._activityName;
        }
        public getCurrentCoverName(): string {
            return this._coverName;
        }

        /**
         * 设置当前展示的活动的数据信息
        */
        public setCurrentActivityData(activityNum: number = 1) {
            //“轮循活动配置：累冲活动”目前先写死，需要哪个皮肤写哪个编号
            activityNum = 4;
            
            //判断取值（主要设置显示的配置）
            switch (activityNum) {
                case 1: this._activityName = "cumulate/txt_xbjm_mrlc.png"; this._coverName = "image_lc_mrcz.png"; this._currentIconResName = "btn_mainui_lc_yuren41.png"; break;
                case 2: this._activityName = "cumulate/txt_zdsd.png"; this._coverName = "image_lc_zdsd.png"; this._currentIconResName = "btn_mainui_lc_zdsd.png"; break;
                case 3: this._activityName = "cumulate/txt_zzsd.png"; this._coverName = "image_lc_zzsd.png"; this._currentIconResName = "btn_mainui_lc_zzsd.png"; break;
                case 4: this._activityName = "cumulate/txt_hcfj_dssd.png"; this._coverName = "banner_dssd.png"; this._currentIconResName = "btn_mainui_lc_dssd.png"; break;
            }
        }

        public cumulatePayPRState(): void {
            let isState: boolean = false;
            for (let key in this._rewarTab) {
                if (this._rewarTab[key][CumulatepayRewardFields.state] === 1) {
                    isState = true;
                    break;
                }
            }
            RedPointCtrl.instance.setRPProperty("cumulate3RP", isState);
        }
        //关闭页签
        public setFuncState(): void {
            let _isOpen = this._giveState == 1 ? ActionOpenState.open : ActionOpenState.close;
            modules.funcOpen.FuncOpenModel.instance.setActionOpen(ActionOpenId.cumulatePay3, _isOpen);
        }
    }
}