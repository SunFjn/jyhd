/////<reference path="../$.ts"/>
///<reference path="../config/everyday_rebate_cfg.ts"/>
/**
 * 天天返利 （封神榜）
 */
namespace modules.every_day_rebate {

    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class EveryDayRebateModel {
        private static _instance: EveryDayRebateModel;
        public static get instance(): EveryDayRebateModel {
            return this._instance = this._instance || new EveryDayRebateModel();
        }

        /*开启状态(0未开启 1开启 2开启后关闭)*/
        private _openState: number;

        /*排行列表*/
        private _nodeList: Array<Protocols.EverydayRebateNode>;

        private constructor() {
            this._openState = 0;
            this._nodeList = new Array<Protocols.EverydayRebateNode>();
        }

        // public get openState(): number {
        //     return this._openState;
        // }
        public get nodeList(): Array<Protocols.EverydayRebateNode> {
            return this._nodeList;
        }

        //返回数据
        public getInfo(tuple: Protocols.GetEverydayRebateInfoReply) {
            // this._openState = tuple[Protocols.GetEverydayRebateInfoReplyFields.openState];
            let _nodeList = tuple[Protocols.GetEverydayRebateInfoReplyFields.nodeList];
            if (_nodeList) {
                for (var index = 0; index < _nodeList.length; index++) {
                    var element: Protocols.EverydayRebateNode = _nodeList[index];
                    let day = element[Protocols.EverydayRebateNodeFields.day];
                    this._nodeList[day] = element;
                }
            }
            GlobalData.dispatcher.event(CommonEventType.SOARING_EVERTDATREDATE_UPDATE);
            this.setRP();
        }

        //更新基本数据(只更新简单信息)
        public updateInfo(tuple: Protocols.UpdateEverydayRebateInfo) {
            // this._openState = tuple[Protocols.UpdateEverydayRebateInfoFields.openState];
            let _nodeList = tuple[Protocols.UpdateEverydayRebateInfoFields.nodeList];
            if (_nodeList) {
                for (var index = 0; index < _nodeList.length; index++) {
                    var element: Protocols.EverydayRebateNode = _nodeList[index];
                    let day = element[Protocols.EverydayRebateNodeFields.day];
                    this._nodeList[day] = element;
                }
            }
            this.setRP();
            GlobalData.dispatcher.event(CommonEventType.SOARING_EVERTDATREDATE_UPDATE);
        }

        /**
         * 判断是否有可领取的奖励
         */
        public getIsLingQu(): boolean {
            let bolll = false;
            for (let index = 0; index < this._nodeList.length; index++) {
                let element = this._nodeList[index];
                if (element) {
                    let state = element[Protocols.EverydayRebateNodeFields.state];
                    if (state == 1) {
                        bolll = true;
                        break;
                    }
                }
            }
            return bolll;
        }

        public setRP() {
            let bolll = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.everydayRebate);
            let isLingQu = this.getIsLingQu();
            RedPointCtrl.instance.setRPProperty("everyDayRebateRP", bolll && isLingQu);
        }
    }
}
