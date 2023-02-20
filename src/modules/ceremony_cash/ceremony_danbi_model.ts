/////<reference path="../$.ts"/>
///<reference path="../config/soaring_single_pay_fs.ts"/>
/**
 * 单笔充值 （封神榜）
 */
namespace modules.ceremony_cash {
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    import CeremonyDanbiReward = Protocols.CeremonyDanbiReward;
    import CeremonyDanbiRewardFields = Protocols.CeremonyDanbiRewardFields;
    /*返回数据*/
    import GetCeremonyDanbiInfoReply = Protocols.GetCeremonyDanbiInfoReply;
    import GetCeremonyDanbiInfoReplyFields = Protocols.GetCeremonyDanbiInfoReplyFields;

    import ceremony_danbiFields = Configuration.ceremony_danbiFields;

    export class CeremonyDanbiModel {
        private static _instance: CeremonyDanbiModel;
        public static get instance(): CeremonyDanbiModel {
            return this._instance = this._instance || new CeremonyDanbiModel();
        }

        /*开启状态(0未开启 1开启 2开启后关闭)*/
        private _state: number;
        /*充值金额*/
        private _totalMoney: number;
        /*排行列表*/
        private _rewardList: Array<CeremonyDanbiReward>;
        /*剩余时间*/
        private _restTm: number;
        /*天活动是否结束(0未 1是)*/
        // private _endFlag: number;

        private constructor() {
            this._state = 0;
            this._totalMoney = 0;
            this._rewardList = new Array<CeremonyDanbiReward>();
            this._restTm = 0;
        }

        public get state(): number {
            return this._state;
        }


        public get rewardList(): Array<CeremonyDanbiReward> {
            return this._rewardList;
        }

        public get restTm(): number {
            return this._restTm;
        }


        //返回数据
        public getInfo(tuple: GetCeremonyDanbiInfoReply) {
            this._state = tuple[GetCeremonyDanbiInfoReplyFields.endTime] < GlobalData.serverTime ? 0 : 1;
            this._restTm = tuple[GetCeremonyDanbiInfoReplyFields.endTime];
            let _rewardList = tuple[GetCeremonyDanbiInfoReplyFields.rewardList];
            if (_rewardList) {
                for (var index = 0; index < _rewardList.length; index++) {
                    var element: CeremonyDanbiReward = _rewardList[index];
                    let id = element[CeremonyDanbiRewardFields.id];
                    this._rewardList[id] = element;
                }
            }
            GlobalData.dispatcher.event(CommonEventType.OS_CEREMONY_DANBI_UPDATE);
            this.setRP();
        }

        public getState(data: CeremonyDanbiReward): number {
            let _state = 0;
            let id = data[CeremonyDanbiRewardFields.id];//档位
            let useCount = data[CeremonyDanbiRewardFields.useCount];//已领数量
            let restCount = data[CeremonyDanbiRewardFields.restCount];//可领数量
            let shuju = CeremonyDanbiCfg.instance.getCfgById(id);
            if (shuju) {
                let maxCount = shuju[ceremony_danbiFields.count];
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
            let bolll = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.singleRecharge);
            let isLingQu = this.getIsLingQu();
            RedPointCtrl.instance.setRPProperty("CeremonyDanbiRP", bolll && isLingQu);
        }
    }
}
