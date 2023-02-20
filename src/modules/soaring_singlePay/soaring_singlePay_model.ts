/////<reference path="../$.ts"/>
///<reference path="../config/soaring_single_pay_fs.ts"/>
/**
 * 单笔充值 （封神榜）
 */
namespace modules.soaring_singlePay {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    import PaySingleFSReward = Protocols.PaySingleFSReward;
    import PaySingleFSRewardFields = Protocols.PaySingleFSRewardFields;
    import FSRankInfoFields = Protocols.FSRankInfoFields;
    /*返回数据*/
    import GetPaySingleFSInfoReply = Protocols.GetPaySingleFSInfoReply;
    import GetPaySingleFSInfoReplyFields = Protocols.GetPaySingleFSInfoReplyFields;
    /*更新数据*/
    import UpdatePaySingleFSInfo = Protocols.UpdatePaySingleFSInfo;
    import UpdatePaySingleFSInfoFields = Protocols.UpdatePaySingleFSInfoFields;
    import SoaringSinglePayCfg = modules.config.SoaringSinglePayCfg;
    import pay_single_fsFields = Configuration.pay_single_fsFields;

    export class SoaringSinglePayModel {
        private static _instance: SoaringSinglePayModel;
        public static get instance(): SoaringSinglePayModel {
            return this._instance = this._instance || new SoaringSinglePayModel();
        }

        /*开启状态(0未开启 1开启 2开启后关闭)*/
        private _state: number;
        /*当前活动类型*/
        private _cuyType: number;
        /*充值金额*/
        private _totalMoney: number;
        /*排行列表*/
        private _rewardList: Array<PaySingleFSReward>;
        /*剩余时间*/
        private _restTm: number;
        /*天活动是否结束(0未 1是)*/
        private _endFlag: number;

        private constructor() {
            this._state = 0;
            this._cuyType = 1;
            this._totalMoney = 0;
            this._rewardList = new Array<PaySingleFSReward>();
            this._restTm = 0;
            this._endFlag = 1;
        }

        public get state(): number {
            return this._state;
        }

        public get cuyType(): number {
            return this._cuyType;
        }

        public get rewardList(): Array<PaySingleFSReward> {
            return this._rewardList;
        }

        public get restTm(): number {
            return this._restTm;
        }

        public get endFlag(): number {
            return this._endFlag;
        }

        //返回数据
        public getInfo(tuple: GetPaySingleFSInfoReply) {
            // this._state = tuple[UpdatePaySingleFSInfoFields.state];
            let fsInfo = tuple[GetPaySingleFSInfoReplyFields.fsInfo];
            this._endFlag = fsInfo[FSRankInfoFields.endFlag];
            this._cuyType = fsInfo[FSRankInfoFields.type];
            this._restTm = fsInfo[FSRankInfoFields.restTm] + GlobalData.serverTime;
            // console.log("结束时间戳1：  " + this._restTm);
            let _rewardList = tuple[GetPaySingleFSInfoReplyFields.rewardList];
            if (_rewardList) {
                for (var index = 0; index < _rewardList.length; index++) {
                    var element: PaySingleFSReward = _rewardList[index];
                    let id = element[PaySingleFSRewardFields.id];
                    this._rewardList[id] = element;
                }
            }
            GlobalData.dispatcher.event(CommonEventType.SOARING_SINGLEPAY_UPDATE);
            this.setRP();
        }

        //更新基本数据(只更新简单信息)
        public updateInfo(tuple: UpdatePaySingleFSInfo) {
            // this._state = tuple[UpdatePaySingleFSInfoFields.state];
            let fsInfo = tuple[UpdatePaySingleFSInfoFields.fsInfo];
            this._endFlag = fsInfo[FSRankInfoFields.endFlag];
            this._cuyType = fsInfo[FSRankInfoFields.type];
            this._restTm = fsInfo[FSRankInfoFields.restTm] + GlobalData.serverTime;
            let _rewardList = tuple[UpdatePaySingleFSInfoFields.rewardList];
            if (_rewardList) {
                for (var index = 0; index < _rewardList.length; index++) {
                    var element: PaySingleFSReward = _rewardList[index];
                    let id = element[PaySingleFSRewardFields.id];
                    this._rewardList[id] = element;
                }
            }
            this.setRP();
            GlobalData.dispatcher.event(CommonEventType.SOARING_SINGLEPAY_UPDATE);
        }

        public getState(data: PaySingleFSReward): number {
            let _state = 0;
            let id = data[PaySingleFSRewardFields.id];//档位
            let useCount = data[PaySingleFSRewardFields.useCount];//已领数量
            let restCount = data[PaySingleFSRewardFields.restCount];//未领数量
            let shuju = SoaringSinglePayCfg.instance.getCfgById(id);
            if (shuju) {
                let maxCount = shuju[pay_single_fsFields.count];
                if (maxCount > 0) {
                    if (restCount > 0) {
                        _state = 1;
                    } else if (useCount == maxCount) { //全部领取完毕 说明此档已全部领取
                        _state = 2;
                    }
                }
            }
            return _state;
        }

        /**
         * 判断是否有可领取的奖励
         */
        public getIsLingQu(): boolean {
            let bolll = false;
            for (let index = 0; index < this._rewardList.length; index++) {
                let element = this._rewardList[index];
                if (element) {
                    let state = this.getState(element);
                    if (state == 1) {
                        bolll = true;
                        break;
                    }
                }
            }
            return bolll;
        }

        public setRP() {
            let bolll = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.paySingleFS);
            let isLingQu = this.getIsLingQu();
            RedPointCtrl.instance.setRPProperty("soaringSinglePayRP", bolll && isLingQu && this.endFlag == 0);
        }
    }
}
