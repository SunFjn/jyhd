namespace modules.treasure {
    import XunbaoNote = Protocols.XunbaoNote;
    import RunXunbaoReply = Protocols.RunXunbaoReply;
    import item_stoneFields = Configuration.item_stoneFields;
    import item_materialFields = Configuration.item_materialFields;
    import item_equipFields = Configuration.item_equipFields;
    import Item = Protocols.Item;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import BagModel = modules.bag.BagModel;
    import XunbaoHint = Protocols.XunbaoHint;
    import XunbaoHintFields = Protocols.XunbaoHintFields;
    import TreasureCfg = modules.config.TreasureCfg;
    import xunbao_exchangeFields = Configuration.xunbao_exchangeFields;
    import idCountFields = Configuration.idCountFields;
    import TableUtils = utils.TableUtils;
    import item_equip = Configuration.item_equip;
    import item_stone = Configuration.item_stone;
    import item_material = Configuration.item_material;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class TreasureModel {
        private static _instance: TreasureModel;
        private _exchangeReply: number;
        private _hintList: Array<XunbaoHint>;
        private _xunbaoExchangeData: any;

        public static get instance(): TreasureModel {
            return this._instance = this._instance || new TreasureModel();
        }

        private _restTime: number;
        private _blessing: Array<number>;
        private _selfBroadcast: Array<Array<XunbaoNote>>;
        private _svrBroadcast: Array<Array<XunbaoNote>>;
        private _runXunBaoReply: RunXunbaoReply;
        private _taskXunbaoList: number;
        private _taskXunbaoAll: number;
        private _selectItem: Array<Item>;
        private _coupon: Array<number>;
        private _redArr: Table<boolean>;
        private _fistFlag: Array<number>;
        private _fistMianFei: Array<boolean>;
        public _xunBaoListIndex: Array<number>;
        constructor() {
            this._xunBaoListIndex = [0, 4, 3, 1, 2];
            this._selectItem = new Array<Item>();
            this._blessing = new Array<number>();
            this._coupon = new Array<number>();
            this._fistFlag = new Array<number>();
            this._fistMianFei = new Array<boolean>();
            this._selfBroadcast = new Array<Array<XunbaoNote>>();
            this._svrBroadcast = new Array<Array<XunbaoNote>>();
            this._hintList = new Array<XunbaoHint>();
            this._redArr = {};
        }

        public set selectItem(value: Array<Item>) {
            this._selectItem = value
        }

        public get selectItem(): Array<Item> {
            return this._selectItem;
        }

        public getBlessing(type: number) {
            return this._blessing[type]
        }
        public fistMianFei(type: number): boolean {
            return this._fistMianFei[type];
        }
        public setXunbaoInfo(type: number, bless: number, coupon: number, fistFlag: number, isFree: boolean) {
            this._blessing[type] = bless;
            this._coupon[type] = coupon;
            this._fistFlag[type] = fistFlag;
            this._fistMianFei[type] = isFree;
            this.setExchangeDotDic();
            GlobalData.dispatcher.event(CommonEventType.UPDATE_XUNBAOINFO);
            this.panduianRp();
        }

        /**
         * 判断功能是否开启
         */
        public getKaiQi(element: number) {/*类型 0装备 1巅峰 2至尊 3仙符 4圣物*/
            let openId = ActionOpenId.xunbaoEquip;
            switch (element) {
                case 0:
                    openId = ActionOpenId.xunbaoEquip;
                    break;
                case 4:
                    openId = ActionOpenId.xunbaoTalisman;
                    break;
                case 2:
                    openId = ActionOpenId.xunbaoZhizun;
                    break;
                case 3:
                    openId = ActionOpenId.xunbaoXianfu;
                    break;
                case 1:
                    openId = ActionOpenId.xunbaoDianfeng;
                    break;
                default:
                    break;
            }
            if (!FuncOpenModel.instance.getFuncIsOpen(openId)) {
                return false;
            }
            return true;
        }

        /**
         *判断红点
         */
        public panduianRp() {
            for (var index = 0; index < this._xunBaoListIndex.length; index++) {
                var element = this._xunBaoListIndex[index];
                if (this.getKaiQi(element)) {
                    let condition1 = TreasureCfg.instance.getItemConditionByGrad(element, 0);/*消耗道具 道具ID#道具数量*/
                    if (condition1) {
                        let count1 = BagModel.instance.getItemCountById(condition1[idCountFields.id]);
                        let isMianFei = TreasureModel.instance.fistMianFei(element);
                        if (count1 > 0 || isMianFei) {
                            RedPointCtrl.instance.setRPProperty("treasureRP", true);
                            return;
                        }
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("treasureRP", false);
        }

        public getCoupon(type: number): number {
            // 庆典探索兑换处理逻辑不同
            if (type == 6) {
                return BagModel.instance.getItemCountById(15650002);
            }
            return this._coupon[type] ? this._coupon[type] : 0;
        }

        public getfistFlag(type: number): number {
            return this._fistFlag[type] ? this._fistFlag[type] : 0;
        }

        public get restTime(): number {
            return this._restTime
        }

        public set restTime(value: number) {
            this._restTime = value + GlobalData.serverTime;
            GlobalData.dispatcher.event(CommonEventType.TIME_LEFT);
        }

        public getSvrBroadcast(type: number): Array<XunbaoNote> {
            return this._svrBroadcast[type];
        }

        public setSvrBroadcast(type: number, value: Array<XunbaoNote>) {
            if (this._svrBroadcast[type] == null) {
                this._svrBroadcast[type] = value;
            } else {
                this._svrBroadcast[type] = value;
            }
            GlobalData.dispatcher.event(CommonEventType.SEVER_BROADCAST_LIST);
        }

        public getSelfBroadcast(type: number): Array<XunbaoNote> {
            let shuju = this._selfBroadcast[type];
            if (shuju) {
                if (shuju.length > 100) {
                    shuju.splice(0, shuju.length - 100)
                }
            }
            shuju = shuju ? shuju : [];
            return shuju;
        }

        public setSelfBroadcast(type: number, value: Array<XunbaoNote>) {
            if (this._selfBroadcast[type] == null) {
                this._selfBroadcast[type] = value;
            } else {
                this._selfBroadcast[type] = value;
            }
            GlobalData.dispatcher.event(CommonEventType.SELF_BROADCAST_LIST);
        }

        public get runXunbaoReply(): RunXunbaoReply {
            return this._runXunBaoReply;
        }

        public set runXunbaoReply(value: RunXunbaoReply) {
            this._runXunBaoReply = value;
            GlobalData.dispatcher.event(CommonEventType.RUN_XUNBAO_REPLY);
        }

        public get taskXunbao(): number {
            return this._taskXunbaoList
        }

        public set taskXunbao(value: number) {
            this._taskXunbaoList = value;
            GlobalData.dispatcher.event(CommonEventType.TASK_XUNBAO_LIST_REPLY);

        }

        public get taskAllXunbao(): number {
            return this._taskXunbaoAll;
        }

        public set taskAllXunbao(value: number) {
            this._taskXunbaoAll = value;
            GlobalData.dispatcher.event(CommonEventType.TASK_XUNBAO_ALL_REPLY);
        }

        public getHintList(type: number): Array<number> {
            if (!this._hintList) {
                this._hintList = [];
            }
            for (let i = 0; i < this._hintList.length; i++) {
                let hintType = this._hintList[i][XunbaoHintFields.type];
                if (type == hintType) {
                    return this._hintList[i][XunbaoHintFields.hintList];
                    break;
                }
            }
            return [];
        }

        public setHintList(list: Array<XunbaoHint>) {
            this._hintList = list;
            this.setExchangeDotDic();
            GlobalData.dispatcher.event(CommonEventType.XUNBAO_HINTLIST);
        }

        public setExchangeDotDic() {
            for (let i = 0; i < this._hintList.length; i++) {
                let type = this._hintList[i][XunbaoHintFields.type];
                let hintArr = this._hintList[i][XunbaoHintFields.hintList];
                this._redArr[type] = false;
                for (let k = 0; k < hintArr.length; k++) {
                    let cfg = TreasureCfg.instance.getCfgByitemId(hintArr[k]);
                    if (!cfg) continue;
                    let condition = cfg[xunbao_exchangeFields.condition];
                    let needCount = condition[idCountFields.count];
                    let count = TreasureModel.instance.getCoupon(cfg[xunbao_exchangeFields.type]);
                    if (count >= needCount) {
                        this._redArr[type] = true;
                        break;
                    } else {
                        this._redArr[type] = false;
                    }
                }
            }
            let treasureHint: boolean = false;
            let ceremongCashHint: boolean = false;
            let num: number = 0;
            let arr = TableUtils.values(this._redArr);
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == false) {
                    num++;
                } else {
                    if (i == 6) {
                        ceremongCashHint = true;
                    } else {
                        treasureHint = true;
                    }
                }
            }

            // RedPointCtrl.instance.setRPProperty("treasureExchangeRP", num < arr.length);
            RedPointCtrl.instance.setRPProperty("treasureExchangeRP", treasureHint);
            RedPointCtrl.instance.setRPProperty("ceremonyExchangeRP", ceremongCashHint);
        }

        public getRedDot(): Table<boolean> {
            return this._redArr;
        }



        public set xunBaoExchangeReply(value: number) {
            this._exchangeReply = value;
            GlobalData.dispatcher.event(CommonEventType.XUNBAO_EXCHANGE_REPLY);
            GlobalData.dispatcher.event(CommonEventType.XUNBAO_HINTLIST);

        }

        public get xunBaoExchangeReply(): number {
            return this._exchangeReply;
        }

        //设置庆典探索兑换数据
        public setXunBaoExchangeData(id: number, alreadyExchange: number) {
            this._xunbaoExchangeData = [id, alreadyExchange];
            GlobalData.dispatcher.event(CommonEventType.XUNBAO_EXCHANGE_REPLY2);
        }

        // 获取庆典探索兑换数据
        public getXunBaoExchangeData(): any {
            return this._xunbaoExchangeData;
        }
    }
}