/////<reference path="../$.ts"/>
///<reference path="../config/single_pay_jade_cfg.ts"/>
/**
 * 单笔充值（返炽星魔锤）
 */
namespace modules.cumulatePay_shenHun {
    import SinglePayJadeCfg = modules.config.SinglePayJadeCfg;
    import single_pay_jadeFields = Configuration.single_pay_jadeFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    import ThreeNumber = Protocols.ThreeNumber;
    import ThreeNumberFields = Protocols.ThreeNumberFields;

    export class CumulatePayShenHunModel {
        private static _instance: CumulatePayShenHunModel;
        public static get instance(): CumulatePayShenHunModel {
            return this._instance = this._instance || new CumulatePayShenHunModel();
        }

        /*开启状态(0未开启 1开启 2开启后关闭)*/
        private _state: boolean;
        /*排行列表*/
        private _rewardList: Array<ThreeNumber>;/*[id,可领取数量，已充值数量]*/
        private _rewardList111: Array<ThreeNumber>;/*[id,可领取数量，已充值数量]*/
        /*剩余时间*/
        private _restTm: number;

        private constructor() {
            this._state = false;
            this._rewardList = new Array<ThreeNumber>();
            this._rewardList111 = new Array<ThreeNumber>();
            this._restTm = 0;
        }

        public get state(): boolean {
            return this._state;
        }


        public get rewardList(): Array<ThreeNumber> {
            return this._rewardList;
        }

        public get restTm(): number {
            return this._restTm;
        }


        //返回数据
        public getInfo(tuple: Protocols.GetSinglePayJadeReply) {
            this._state = tuple[Protocols.GetSinglePayJadeReplyFields.state];
            this._restTm = tuple[Protocols.GetSinglePayJadeReplyFields.time];// + GlobalData.serverTime
            this._rewardList111.length = 0;
            this._rewardList.length = 0;
            this._rewardList = new Array<ThreeNumber>();
            this._rewardList111 = new Array<ThreeNumber>();
            let _rewardList = tuple[Protocols.GetSinglePayJadeReplyFields.countList];
            this._rewardList111 = tuple[Protocols.GetSinglePayJadeReplyFields.countList];
            if (_rewardList) {
                for (var index = 0; index < _rewardList.length; index++) {
                    var element: ThreeNumber = _rewardList[index];
                    let id = element[Protocols.ThreeNumberFields.v1];
                    this._rewardList[id] = element;
                }
            }
            // console.log("单笔充值（神玉）_state： " + this._state);
            this.setActionOpen();
            GlobalData.dispatcher.event(CommonEventType.CUMULATEPAY_SHENHUN_UPDATE);
            this.setRP();
        }
        public setActionOpen() {
            let _openState = this._state ? ActionOpenState.open : ActionOpenState.close;
            modules.funcOpen.FuncOpenModel.instance.setActionOpen(ActionOpenId.singlePayJade, _openState);
        }
        /**
         * 判断是否有可领取的奖励
         */
        public getIsLingQu(): boolean {
            let bolll = false;
            for (let index = 0; index < this._rewardList111.length; index++) {
                let element = this._rewardList111[index];
                if (element) {
                    let state = element[ThreeNumberFields.v2];
                    if (state > 0) {
                        bolll = true;
                        break;
                    }
                }
            }
            return bolll;
        }

        /**
         * 获取状态
         */
        public getSteat(id: number): number {
            for (let index = 0; index < this._rewardList111.length; index++) {
                let element = this._rewardList111[index];
                if (element) {
                    /*[id, 可领取数量， 已充值数量]*/
                    let v1 = element[ThreeNumberFields.v1];
                    let v2 = element[ThreeNumberFields.v2];
                    let v3 = element[ThreeNumberFields.v3];
                    let shuju = SinglePayJadeCfg.instance.getCfgById(v1);
                    let cont = shuju[single_pay_jadeFields.count];
                    if (v1 == id) {
                        if (v2 > 0) {
                            return 0;
                        } else {
                            if ((v3 - v2) == cont) {
                                return 2;
                            }
                        }
                        return 1;
                    }
                }
            }
            return 1;
        }

        public setRP() {
            let bolll = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.singlePayJade);
            let isLingQu = this.getIsLingQu();
            RedPointCtrl.instance.setRPProperty("cumulatePayShenHunRP", bolll && isLingQu && this._state);
        }
    }
}
