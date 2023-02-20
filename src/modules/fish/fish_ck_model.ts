///<reference path="../config/fish_ck_cfg.ts"/>
/*庆典兑换数据模型*/
namespace modules.fish {

    import FishCkCfg = modules.config.FishCkCfg;
    import limit_xunbao_exchange_cfg = Configuration.limit_xunbao_exchange_cfg;
    import limit_xunbao_exchange_cfgFields = Configuration.limit_xunbao_exchange_cfgFields;
    import limit_xunbao_exchange_cfg_ItemField = Configuration.limit_xunbao_exchange_cfg_ItemField;
    import LimitXunBaoExchangeListReply = Protocols.LimitXunBaoExchangeListReply;
    import LimitXunBaoExchangeListReplyFields = Protocols.LimitXunBaoExchangeListReplyFields;
    import XunBaoExchangeListNode = Protocols.XunBaoExchangeListNode;
    import GetLimitXunBaoHintReply = Protocols.GetLimitXunBaoHintReply;
    import LimitXunbaoHintFields = Protocols.LimitXunbaoHintFields;
    import LimitXunBaoExchangeListNodeFields = Protocols.LimitXunBaoExchangeListNodeFields;
    import BagModel = modules.bag.BagModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class FishCKModel {
        private static _instance: FishCKModel;
        public static get instance(): FishCKModel {
            return this._instance = this._instance || new FishCKModel();
        }

        // private _restTime: number[];
        private _buyedCount: Array<Array<number>>;
        private _hintList: Array<Array<number>>;

        constructor() {
            this._hintList = new Array();
            // this._restTime = new Array();
            // this._restTime[LimitBigType.fish] = 0;
            // this._restTime[LimitBigType.year] = 0;
            this._buyedCount = new Array<Array<number>>()
        }

        // 设置探索数据
        public setXunbaoInfo(tuple: LimitXunBaoExchangeListReply) {
            let _list: Array<limit_xunbao_exchange_cfg> = FishCkCfg.instance.getCfgsByType(tuple[LimitXunBaoExchangeListReplyFields.bigType]);
            let cashList: Array<XunBaoExchangeListNode> = tuple[LimitXunBaoExchangeListReplyFields.listInfo];
            // console.log('vtz:cashList', cashList);
            // this._restTime[tuple[LimitXunBaoExchangeListReplyFields.bigType]] = tuple[LimitXunBaoExchangeListReplyFields.time];
            typeof this._buyedCount[tuple[LimitXunBaoExchangeListReplyFields.bigType]] == "undefined" && (this._buyedCount[tuple[LimitXunBaoExchangeListReplyFields.bigType]] = new Array<number>());
            for (let index = 0, len = _list.length; index < len; index++) {
                const element = _list[index];
                this._buyedCount[tuple[LimitXunBaoExchangeListReplyFields.bigType]][_list[index][limit_xunbao_exchange_cfgFields.id]] = 0;

                for (let i = 0; i < cashList.length; i++) {
                    const ci = cashList[i];
                    if (ci[LimitXunBaoExchangeListNodeFields.id] == element[limit_xunbao_exchange_cfgFields.id]) {
                        this._buyedCount[tuple[LimitXunBaoExchangeListReplyFields.bigType]][_list[index][limit_xunbao_exchange_cfgFields.id]] = ci[LimitXunBaoExchangeListNodeFields.buyCount];
                        break;
                    }
                }

            }

            GlobalData.dispatcher.event(CommonEventType.FISH_CK_UPDATE);
            this.judgeRP();
        }

        private judgeRP() {
            if (this._buyedCount.length > 0 && this._hintList.length > 0) {
                let bigtype_arr = [];
                bigtype_arr[LimitBigType.year] = false;
                for (let bigtype in bigtype_arr) {
                    let _list: Array<limit_xunbao_exchange_cfg> = FishCkCfg.instance.getCfgsByType(bigtype as any as number);
                    for (let key in _list) {
                        if (this.getHintList(bigtype as any as LimitBigType).indexOf(_list[key][limit_xunbao_exchange_cfgFields.id]) != -1) {
                            let count = _list[key][limit_xunbao_exchange_cfgFields.condition][limit_xunbao_exchange_cfg_ItemField.count]
                            if (this._buyedCount[bigtype][_list[key][limit_xunbao_exchange_cfgFields.id]] < count) {
                                if (BagModel.instance.getItemCountById(_list[key][limit_xunbao_exchange_cfgFields.condition][limit_xunbao_exchange_cfg_ItemField.id]) >= count) {
                                    bigtype_arr[bigtype] = true;
                                    // console.log("bigtype_arr[bigtype]", bigtype_arr[bigtype])
                                }
                            }
                        }
                    }
                }
                // console.log('vtz:bigtype_arr', bigtype_arr);
                RedPointCtrl.instance.setRPProperty("YearDhRP", bigtype_arr[LimitBigType.year]);
            }
        }

        // 获取探索列表
        public getCashList(bigtype: LimitBigType): Array<limit_xunbao_exchange_cfg> {
            // console.log('vtz:this._list', this._list);
            return FishCkCfg.instance.getCfgsByType(bigtype);;
        }

        // public restTime(bigtype: LimitBigType): number {
        //     return this._restTime[bigtype];
        // }

        public buyedCount(bigtype: LimitBigType): Array<number> {
            console.log('打印',this._buyedCount);
            return this._buyedCount[bigtype];
        }

        public setHintList(tuple: GetLimitXunBaoHintReply) {
            for (let i = 0; i < tuple.length; i++) {
                this._hintList[tuple[i][LimitXunbaoHintFields.bigType]] = tuple[i][LimitXunbaoHintFields.hintList];
            }
            // console.log('vtz:this._hintList', this._hintList);
            this.judgeRP();
            GlobalData.dispatcher.event(CommonEventType.FISH_CK_HINT_UPDATE);
        }

        public getHintList(bigtype: LimitBigType) {
            return this._hintList[bigtype] || [];
        }
    }
}