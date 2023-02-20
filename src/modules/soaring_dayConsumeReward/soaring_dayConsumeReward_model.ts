/////<reference path="../$.ts"/>
/**
 * 消费赠礼 （封神榜）
 */
namespace modules.soaring_dayConsumeReward {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    import ConsumeRewardFSReward = Protocols.ConsumeRewardFSReward;
    import ConsumeRewardFSRewardFields = Protocols.ConsumeRewardFSRewardFields;
    import FSRankInfoFields = Protocols.FSRankInfoFields;
    /*返回数据*/
    import GetConsumeRewardFSInfoReply = Protocols.GetConsumeRewardFSInfoReply;
    import GetConsumeRewardFSInfoReplyFields = Protocols.GetConsumeRewardFSInfoReplyFields;
    /*更新数据*/
    import UpdateConsumeRewardFSInfo = Protocols.UpdateConsumeRewardFSInfo;
    import UpdateConsumeRewardFSInfoFields = Protocols.UpdateConsumeRewardFSInfoFields;


    export class SoaringDayConsumeRewardModel {
        private static _instance: SoaringDayConsumeRewardModel;
        public static get instance(): SoaringDayConsumeRewardModel {
            return this._instance = this._instance || new SoaringDayConsumeRewardModel();
        }

        /*开启状态(0未开启 1开启 2开启后关闭)*/
        private _state: number;
        /*当前活动类型*/
        private _cuyType: number;
        /*充值金额*/
        private _totalCount: number;
        /*排行列表*/
        private _rewardList: Array<ConsumeRewardFSReward>;
        /*剩余时间*/
        private _restTm: number;
        /*天活动是否结束(0未 1是)*/
        private _endFlag: number;

        private constructor() {
            this._state = 0;
            this._cuyType = 1;
            this._totalCount = 0;
            this._rewardList = new Array<ConsumeRewardFSReward>();
            this._restTm = 0;
            this._endFlag = 1;
        }

        public get state(): number {
            return this._state;
        }

        public get cuyType(): number {
            return this._cuyType;
        }

        public get totalCount(): number {
            return this._totalCount;
        }

        public get rewardList(): Array<ConsumeRewardFSReward> {
            return this._rewardList;
        }

        public get restTm(): number {
            return this._restTm;
        }

        public get endFlag(): number {
            return this._endFlag;
        }

        //返回数据
        public getInfo(tuple: GetConsumeRewardFSInfoReply) {
            // this._state = tuple[GetConsumeRewardFSInfoReplyFields.state];
            this._totalCount = tuple[GetConsumeRewardFSInfoReplyFields.totalCount];
            let fsInfo = tuple[GetConsumeRewardFSInfoReplyFields.fsInfo];
            this._endFlag = fsInfo[FSRankInfoFields.endFlag];
            this._cuyType = fsInfo[FSRankInfoFields.type];
            this._restTm = fsInfo[FSRankInfoFields.restTm] + GlobalData.serverTime;
            let _rewardList = tuple[GetConsumeRewardFSInfoReplyFields.rewardList];
            if (_rewardList) {
                for (var index = 0; index < _rewardList.length; index++) {
                    var element: ConsumeRewardFSReward = _rewardList[index];
                    let id = element[ConsumeRewardFSRewardFields.id];
                    this._rewardList[id] = element;
                }
            }
            GlobalData.dispatcher.event(CommonEventType.SOARING_DATCONSUMEREWARD_UPDATE);
            this.setRP();
        }

        //更新基本数据(只更新简单信息)
        public updateInfo(tuple: UpdateConsumeRewardFSInfo) {
            // this._state = tuple[UpdateConsumeRewardFSInfoFields.state];
            this._totalCount = tuple[UpdateConsumeRewardFSInfoFields.totalCount];
            let fsInfo = tuple[UpdateConsumeRewardFSInfoFields.fsInfo];
            this._endFlag = fsInfo[FSRankInfoFields.endFlag];
            this._cuyType = fsInfo[FSRankInfoFields.type];
            this._restTm = fsInfo[FSRankInfoFields.restTm] + GlobalData.serverTime;
            let _rewardList = tuple[UpdateConsumeRewardFSInfoFields.rewardList];
            if (_rewardList) {
                for (var index = 0; index < _rewardList.length; index++) {
                    var element: ConsumeRewardFSReward = _rewardList[index];
                    let id = element[ConsumeRewardFSRewardFields.id];
                    this._rewardList[id] = element;
                }
            }
            this.setRP();
            GlobalData.dispatcher.event(CommonEventType.SOARING_DATCONSUMEREWARD_UPDATE);
        }

        /**
         * 判断是否有可领取的奖励
         */
        public getIsLingQu(): boolean {
            let bolll = false;
            for (let index = 0; index < this._rewardList.length; index++) {
                let element = this._rewardList[index];
                if (element) {
                    let state = element[ConsumeRewardFSRewardFields.state];
                    if (state == 1) {
                        bolll = true;
                        break;
                    }
                }
            }
            return bolll;
        }

        public setRP() {
            let bolll = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.consumeRewardFS);
            let isLingQu = this.getIsLingQu();
            RedPointCtrl.instance.setRPProperty("soaringDayConsumeRewardRP", bolll && isLingQu && this.endFlag == 0);
        }
    }
}
