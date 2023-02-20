namespace modules.first_pay {
    import UpdateFirstPayInfo = Protocols.UpdateFirstPayInfo;
    import UpdateFirstPayInfoFields = Protocols.UpdateFirstPayInfoFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class FirstPayModel {
        private static _instance: FirstPayModel;
        public static get instance(): FirstPayModel {
            return this._instance = this._instance || new FirstPayModel();
        }

        private _showFirstPay: boolean;
        private _totalMoney: number;
        private _dataList: any;
        private _giveState: any;
        private _shiftDayStateTab = {};
        public _lowestRechargeShift: boolean;
        public _rechargeAllShift: boolean;
        public _alreadyRechargeShift = {};
        public _firstPayBoxVisible: boolean;
        public restTm: number;

        constructor() {
            this._showFirstPay = true;
            this._lowestRechargeShift = false;
            this._rechargeAllShift = false;
            this._firstPayBoxVisible = false;
            this.restTm = 0;
        }

        public updateInfo(tuple: UpdateFirstPayInfo): void {
            this._showFirstPay = tuple[UpdateFirstPayInfoFields.state] == 1;
            this._totalMoney = tuple[UpdateFirstPayInfoFields.totalMoney];
            this._dataList = tuple[UpdateFirstPayInfoFields.list];
            this._giveState = tuple[UpdateFirstPayInfoFields.firstPay];
            this.restTm = tuple[UpdateFirstPayInfoFields.restTm] + GlobalData.serverTime;

            GlobalData.dispatcher.event(CommonEventType.FIRST_PAY_UPDATE);

            RedPointCtrl.instance.setRPProperty("firstPayRP", this.checkMainRPAndStatus());
        }

        // 检测主入口红点
        public checkMainRPAndStatus() {
            let shift: number;
            let rpState: boolean = false;
            let raShiftCount: number = 0;
            let getedCount: number = 0;

            if (!this._dataList) return;
            // 获取状态
            for (let index = 0; index < this._dataList.length; index++) {
                // 第4档不需要，直接跳过
                if (index >= 3) {
                    break;
                }
                const shiftData = this._dataList[index];
                // 数据--天数相关的数据
                let dayData = shiftData[1];
                for (let i = 0; i < dayData.length; i++) {
                    /*状态 0未开启 1可领取 2已领取*/
                    if (dayData[i][1][0] == 1) {
                        rpState = true;
                    }
                    // 档位对应
                    switch (index) {
                        case 0: shift = 10; break;
                        case 1: shift = 30; break;
                        case 2: shift = 98; break;
                    }
                    // case 3: shift = 198; break;

                    if (!this._shiftDayStateTab[shift]) {
                        this._shiftDayStateTab[shift] = {};
                        this._alreadyRechargeShift[shift] = false;
                    }
                    if (!this._shiftDayStateTab[shift][i + 1]) {
                        this._shiftDayStateTab[shift][i + 1] = {};
                    }
                    // 档位+天数的状态
                    this._shiftDayStateTab[shift][i + 1] = dayData[i][1][0];
                    // 是否购过该档位，不区分天数
                    if (dayData[i][1][0] == 1 || dayData[i][1][0] == 2) {
                        // 是否购买过最低档次
                        if (i == 0) {
                            raShiftCount++;
                            this._lowestRechargeShift = true;
                            this._alreadyRechargeShift[shift] = true;
                        }
                        if (dayData[i][1][0] == 2) {
                            getedCount++;
                        }
                    }
                }
            }
            if (raShiftCount >= 3) {
                this._rechargeAllShift = true;
            }

            if (getedCount < 9) {
                this._firstPayBoxVisible = true;
            } else {
                this._firstPayBoxVisible = false;
            }

            // console.log("HD:", this._shiftDayStateTab);
            // console.log("_alreadyRechargeShift:", this._alreadyRechargeShift);
            // console.log("_lowestRechargeShift:", this._lowestRechargeShift);
            // console.log("_rechargeAllShift:", this._rechargeAllShift);

            // 返回
            return rpState;
        }

        public get giveState(): number {
            return this._giveState;
        }
        public get showFirstPay(): boolean {
            return this._showFirstPay;
        }

        public get shiftDayStateTab(): any {
            return this._shiftDayStateTab;
        }

        public get totalRechargeMoney(): number {
            return this._totalMoney;
        }

        // 根据档位和天数获取状态
        public getStatus(shift: number, day: number): number {
            let ret = this._shiftDayStateTab[shift][day];
            // console.log(`${shift}元档 第${day}天 状态:${ret == 0 ? "未开启" : ret == 1 ? "可领取" : "已领取"}`);
            return ret;
        }

    }
}