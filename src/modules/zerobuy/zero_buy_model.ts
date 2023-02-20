/** 零元购数据*/
///<reference path="../red_point/red_point_ctrl.ts"/>
///<reference path="../config/zero_buy_cfg.ts"/>
namespace modules.zerobuy {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import ZeroBuyCfg = modules.config.ZeroBuyCfg;
    import ZeroBuyReward = Protocols.ZeroBuyReward;
    import ZeroBuyRewardFields = Protocols.ZeroBuyRewardFields;
    import ZeroBuyExtraReward = Protocols.ZeroBuyExtraReward;
    import ZeroBuyExtraRewardFields = Protocols.ZeroBuyExtraRewardFields;

    export class ZerobuyModel {
        private static _instance: ZerobuyModel;
        public static get instance(): ZerobuyModel {
            return this._instance = this._instance || new ZerobuyModel();
        }

        /** 功能是否开启*/
        private _zeroBuyState: int;
        /** 充值金额*/
        private _totalMoney: int;
        /** 奖励列表*/
        private _zeroBuyReward: Array<ZeroBuyReward>;
        /** 额外奖励列表*/
        private _zeroBuyExtraReward: Array<ZeroBuyExtraReward>;

        constructor() {
            this._totalMoney = 0;
        }

        /**  功能是否开启 */
        public get zeroBuyState(): int {
            return this._zeroBuyState;
        }

        /**  功能是否开启 */
        public set zeroBuyState(value: int) {
            this._zeroBuyState = value;
        }

        /**  充值金额 */
        public get totalMoney(): int {
            return this._totalMoney;
        }

        /**  充值金额 */
        public set totalMoney(value: int) {
            this._totalMoney = value;
        }

        /**  奖励列表 */
        public get zeroBuyReward(): Array<ZeroBuyReward> {
            return this._zeroBuyReward;
        }

        /**  奖励列表 */
        public set zeroBuyReward(value: Array<ZeroBuyReward>) {
            this._zeroBuyReward = value;
            // console.log("_zeroBuyReward 长度 ：" + this._zeroBuyReward.length);
        }

        /**  额外奖励列表 */
        public get zeroBuyExtraReward(): Array<ZeroBuyExtraReward> {
            return this._zeroBuyExtraReward;
        }

        /**  额外奖励列表 */
        public set zeroBuyExtraReward(value: Array<ZeroBuyExtraReward>) {
            this._zeroBuyExtraReward = value;

            // this.changZerobuyRP();
            this.getHaveReward();
        }

        /** 获取是否有可领取的奖励 （给入口红点用）*/
        public getHaveReward(): boolean {
            let lengNum = ZeroBuyCfg.instance.getlvDicLeng();
            // let lengNum = this.getRewardLeng();
            let haveReward = false;
            for (var index = 0; index < lengNum; index++) {
                let rewardState1: number = this.getZeroBuyRewardState(index);
                let extraRewardState1: number = this.getZeroBuyExtraRewardState(index);
                if (rewardState1 == 1 || extraRewardState1 == 1) {
                    haveReward = true;
                    break;
                }
            }
            // console.log("是否有可领取的零元购奖励 haveReward " + haveReward);
            RedPointCtrl.instance.setRPProperty("zeroBuyEntranceRP", haveReward);
            return haveReward;
        }

        /** 判断并改变红点*/
        public changZerobuyRP() {
            // let rewardState1: number = this.getZeroBuyRewardState(0);
            // let rewardState2: number = this.getZeroBuyRewardState(1);
            // let rewardState3: number = this.getZeroBuyRewardState(2);
            // let extraRewardState1: number = this.getZeroBuyExtraRewardState(0);
            // let extraRewardState2: number = this.getZeroBuyExtraRewardState(1);
            // let extraRewardState3: number = this.getZeroBuyExtraRewardState(2);
            // // console.log("红点：", [rewardState1 == 1, rewardState2 == 1, rewardState3 == 1]);
            // RedPointCtrl.instance.setRPProperty("ZerobuyOneRP", rewardState1 == 1);
            // RedPointCtrl.instance.setRPProperty("ZerobuyTwoRP", rewardState2 == 1);
            // RedPointCtrl.instance.setRPProperty("ZerobuyThreeRP", rewardState3 == 1);
            // //因为两种奖励公用一个红点 
            // if (rewardState1 == 2)
            //     RedPointCtrl.instance.setRPProperty("ZerobuyOneRP", extraRewardState1 == 1);
            // if (rewardState2 == 2)
            //     RedPointCtrl.instance.setRPProperty("ZerobuyTwoRP", extraRewardState2 == 1);
            // if (rewardState3 == 2)
            //     RedPointCtrl.instance.setRPProperty("ZerobuyThreeRP", extraRewardState3 == 1);
        }

        /**
         * 获取奖励档次长度
         */
        public getRewardLeng(): number {
            return this.zeroBuyReward.length;
        }

        /** 获取奖励列表 领取状态*/
        public getZeroBuyRewardState(IDX: number): number {
            for (let index = 0; index < this.zeroBuyReward.length; index++) {
                let element = this.zeroBuyReward[index];
                if (element) {
                    let dangci = element[ZeroBuyRewardFields.grade];
                    if (dangci == IDX) {
                        let stateNum: number = element[ZeroBuyRewardFields.state];
                        return stateNum;
                    }
                }
            }
            return 0;
        }

        /** 获取额外奖励列表 领取状态*/
        public getZeroBuyExtraRewardState(IDX: number): number {
            for (let index = 0; index < this.zeroBuyExtraReward.length; index++) {
                let element = this.zeroBuyExtraReward[index];
                if (element) {
                    let dangci = element[ZeroBuyExtraRewardFields.grade];
                    if (dangci == IDX) {
                        let stateNum: number = element[ZeroBuyExtraRewardFields.state];
                        return stateNum;
                    }
                }
            }
            return 0;
        }

        /** 获取额外奖励列表 时间戳*/
        public getZeroBuyExtraRewardRestTm(IDX: number): number {
            for (let index = 0; index < this.zeroBuyExtraReward.length; index++) {
                let element = this.zeroBuyExtraReward[index];
                if (element) {
                    let dangci = element[ZeroBuyExtraRewardFields.grade];
                    if (dangci == IDX) {
                        let restTm: number = element[ZeroBuyExtraRewardFields.restTm];
                        let chaNUM = restTm - GlobalData.serverTime;
                        if (chaNUM <= 0) {
                            return 0;
                        } else {
                            let day = 1 + chaNUM / (3600 * 1000 * 24); //Math.floor(0.1)
                            let daynum = day >> 0;
                            return daynum;
                        }
                    }
                }
            }
            return 0
        }
    }
}