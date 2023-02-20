/////<reference path="../$.ts"/>
/**
 * 累计充值（封神榜）
 */
namespace modules.soaring_cumulatePay {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    import CumulatepayReward = Protocols.CumulatepayReward;
    import CumulatepayRewardFields = Protocols.CumulatepayRewardFields;
    import FSRankInfoFields = Protocols.FSRankInfoFields;
    /*返回数据*/
    import GetCumulatepayFSInfoReply = Protocols.GetCumulatepayFSInfoReply;
    import GetCumulatepayFSInfoReplyFields = Protocols.GetCumulatepayFSInfoReplyFields;
    /*更新数据*/
    import UpdateCumulatepayFSInfo = Protocols.UpdateCumulatepayFSInfo;
    import UpdateCumulatepayFSInfoFields = Protocols.UpdateCumulatepayFSInfoFields;

    export class SoaringCumulatePayModel {
        private static _instance: SoaringCumulatePayModel;
        public static get instance(): SoaringCumulatePayModel {
            return this._instance = this._instance || new SoaringCumulatePayModel();
        }

        /*开启状态(0未开启 1开启 2开启后关闭)*/
        private _state: number;
        /*当前活动类型*/
        private _cuyType: number;
        /*充值金额*/
        private _totalMoney: number;
        /*排行列表*/
        private _rewardList: Array<CumulatepayReward>;
        /*剩余时间*/
        private _restTm: number;
        /*天活动是否结束(0未 1是)*/
        private _endFlag: number;

        private constructor() {
            this._state = 0;
            this._cuyType = 1;
            this._totalMoney = 0;
            this._rewardList = new Array<CumulatepayReward>();
            this._restTm = 0;
            this._endFlag = 1;
        }

        public get state(): number {
            return this._state;
        }

        public get cuyType(): number {
            return this._cuyType;
        }

        public get totalMoney(): number {
            return this._totalMoney;
        }

        public get rewardList(): Array<CumulatepayReward> {
            return this._rewardList;
        }

        public get restTm(): number {
            return this._restTm;
        }

        public get endFlag(): number {
            return this._endFlag;
        }

        //返回数据
        public getInfo(tuple: GetCumulatepayFSInfoReply) {
            // this._state = tuple[GetCumulatepayFSInfoReplyFields.state];
            this._totalMoney = tuple[GetCumulatepayFSInfoReplyFields.totalMoney];
            let fsInfo = tuple[GetCumulatepayFSInfoReplyFields.fsInfo];
            this._endFlag = fsInfo[FSRankInfoFields.endFlag];
            this._cuyType = fsInfo[FSRankInfoFields.type];
            this._restTm = fsInfo[FSRankInfoFields.restTm] + GlobalData.serverTime;
            let _rewardList = tuple[GetCumulatepayFSInfoReplyFields.rewardList];
            if (_rewardList) {
                for (var index = 0; index < _rewardList.length; index++) {
                    var element: CumulatepayReward = _rewardList[index];
                    let id = element[CumulatepayRewardFields.id];
                    this._rewardList[id] = element;
                }
            }
            GlobalData.dispatcher.event(CommonEventType.SOARING_CUMULATEPAY_UPDATE);
            this.setRP();
        }

        //更新基本数据(只更新简单信息)
        public updateInfo(tuple: UpdateCumulatepayFSInfo) {
            // this._state = tuple[UpdateCumulatepayFSInfoFields.state];
            this._totalMoney = tuple[UpdateCumulatepayFSInfoFields.totalMoney];
            let fsInfo = tuple[UpdateCumulatepayFSInfoFields.fsInfo];
            this._endFlag = fsInfo[FSRankInfoFields.endFlag];
            this._cuyType = fsInfo[FSRankInfoFields.type];
            this._restTm = fsInfo[FSRankInfoFields.restTm] + GlobalData.serverTime;
            let _rewardList = tuple[UpdateCumulatepayFSInfoFields.rewardList];
            if (_rewardList) {
                for (var index = 0; index < _rewardList.length; index++) {
                    var element: CumulatepayReward = _rewardList[index];
                    let id = element[CumulatepayRewardFields.id];
                    this._rewardList[id] = element;
                }
            }
            this.setRP();
            GlobalData.dispatcher.event(CommonEventType.SOARING_CUMULATEPAY_UPDATE);
        }

        /**
         * 判断是否有可领取的奖励
         */
        public getIsLingQu(): boolean {
            let bolll = false;
            for (let index = 0; index < this._rewardList.length; index++) {
                let element = this._rewardList[index];
                if (element) {
                    let state = element[CumulatepayRewardFields.state];
                    if (state == 1) {
                        bolll = true;
                        break;
                    }
                }
            }
            return bolll;
        }

        public setRP() {
            let bolll = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.cumulatePayFS);
            let isLingQu = this.getIsLingQu();
            RedPointCtrl.instance.setRPProperty("soaringCumulatePayRP", bolll && isLingQu && this.endFlag == 0);
        }
    }
}
