/*庆典兑换数据模型*/
namespace modules.ceremony_cash {

    import TreasureCfg = modules.config.TreasureCfg;
    import xunbao_exchange = Configuration.xunbao_exchange;
    import xunbao_exchangeFields = Configuration.xunbao_exchangeFields;
    import XunBaoExchangeListReply = Protocols.XunBaoExchangeListReply;
    import XunBaoExchangeListReplyFields = Protocols.XunBaoExchangeListReplyFields;
    import XunBaoExchangeListNode = Protocols.XunBaoExchangeListNode;
    import XunBaoExchangeListNodeFields = Protocols.XunBaoExchangeListNodeFields;

    export class CeremonyCashModel {
        private static _instance: CeremonyCashModel;
        public static get instance(): CeremonyCashModel {
            return this._instance = this._instance || new CeremonyCashModel();
        }

        private _restTime: number;
        private _list: Array<xunbao_exchange>;


        // 设置探索数据
        public setXunbaoInfo(tuple: XunBaoExchangeListReply) {
            this._list = TreasureCfg.instance.getCfgsByType(6);
            let cashList: Array<XunBaoExchangeListNode> = tuple[XunBaoExchangeListReplyFields.listInfo];

            this._restTime = tuple[XunBaoExchangeListReplyFields.time];

            for (let index = 0, len = this._list.length; index < len; index++) {
                const element = this._list[index];
                this._list[index][xunbao_exchangeFields.alreadyCash] = 0;

                for (let i = 0; i < cashList.length; i++) {
                    const ci = cashList[i];
                    if (ci[XunBaoExchangeListNodeFields.id] == element[xunbao_exchangeFields.id]) {
                        this._list[index][xunbao_exchangeFields.alreadyCash] = ci[XunBaoExchangeListNodeFields.buyCount];
                        break;
                    }
                }

            }

            GlobalData.dispatcher.event(CommonEventType.OS_CEREMONY_CASH_UPDATE);
        }

        // 获取探索列表
        public getCashList(): Array<xunbao_exchange> {
            return this._list;
        }

        public get restTime(): number {
            return this._restTime
        }
    }
}