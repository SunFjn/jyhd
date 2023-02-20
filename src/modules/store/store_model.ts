/// <reference path="../config/store_cfg.ts" />

namespace modules.store {


    import MallNode = Protocols.MallNode;
    import BuyMallItemReply = Protocols.BuyMallItemReply;
    import MallNodeFields = Protocols.MallNodeFields;
    import mall = Configuration.mall;
    import mallFields = Configuration.mallFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import StoreCfg = modules.config.StoreCfg;
    import blendFields = Configuration.blendFields;
    import Pair = Protocols.Pair;
    import PairFields = Protocols.PairFields;
    export class StoreModel {
        private static _instance: StoreModel;
        public static get instance(): StoreModel {
            return this._instance = this._instance || new StoreModel();
        }

        private _mallArr: Array<MallNode>;
        private _purReply: BuyMallItemReply;

        private _mallTable: Table<MallNode>;

        public dontShowTreasure: boolean;       //装备本次登录不再提醒
        public dontShowTalisman: boolean;       //圣物本次登录不再提醒
        public dontShowZhiZun: boolean;       //至尊本次登录不再提醒
        public dontShowDianFeng: boolean;       //巅峰本次登录不再提醒
        public dontShowFuWen: boolean;       //玉荣本次登录不再提醒
        private _idList: Array<Pair>; /*玉阁商品id:状态 0：未购买，1已购买*/
        private _f5Time: number = 0;/*下次刷新时间*/
        public updateVlaue: number[];
        constructor() {
            this._mallArr = new Array<MallNode>();
            this.dontShowTreasure = false;
            this.dontShowTalisman = false;
            this.dontShowZhiZun = false;
            this.dontShowDianFeng = false;
            this.dontShowFuWen = false;
            this._idList = new Array<Pair>();
            this.updateVlaue = modules.config.BlendCfg.instance.getCfgById(27016)[blendFields.intParam];

        }
        public set idList(value: Array<Pair>) {
            this._idList = value;
        }
        public get idList(): Array<Pair> {
            return this._idList;
        }
        public set f5Time(value: number) {
            this._f5Time = value;
        }
        public get f5Time(): number {
            return this._f5Time;
        }
        public set GetMallInfo(value: Array<MallNode>) {
            this._mallArr = value;
            this.checkRP();
            GlobalData.dispatcher.event(CommonEventType.UPDATE_MALLINFO);
        }

        public set UpdateMallInfo(value: Array<MallNode>) {
            this._mallArr = value;
            this.checkRP();
            GlobalData.dispatcher.event(CommonEventType.UPDATE_MALLINFO);
        }

        public getGetMallInfo(): Array<MallNode> {
            return this._mallArr;
        }

        public set PurchaseReply(value: BuyMallItemReply) {
            this._purReply = value;
            GlobalData.dispatcher.event(CommonEventType.PURCHASE_REPLY);
        }

        public get PurchaseReply(): BuyMallItemReply {
            return this._purReply;
        }

        public getLimitById(id: number): MallNode {
            for (let i = 0; i < this._mallArr.length; i++) {
                let nodeId: number = this._mallArr[i][MallNodeFields.id];
                if (nodeId == id) {
                    return this._mallArr[i];
                }
            }
        }

        public setSkin(id: number): string {
            return CommonUtil.getIconById(id);
        }

        public sortFunc(a: mall, b: mall): number {
            if (a[mallFields.sortId] > b[mallFields.sortId]) return 1;
            else if (a[mallFields.sortId] < b[mallFields.sortId]) return -1;
            else return 0;
        }
        /**
         * name
         */
        public getmall_1RP(): boolean {
            let flag: boolean = true;
            let mall: Array<mall> = StoreCfg.instance.getTypeStoreCfgByChildType(MallType.mall_1, 1);
            for (let i: int = 0, len: int = mall.length; i < len; i++) {
                if (mall[i][mallFields.realityPrice][1] === 0) {
                    let id = mall[i][mallFields.id];
                    let count = mall[i][mallFields.count];
                    if (this._mallArr.length === 0) {
                        flag = true;
                        break;
                    }
                    for (let i: int = 0, len: int = this._mallArr.length; i < len; i++) {
                        if (this._mallArr[i][MallNodeFields.id] === id && this._mallArr[i][MallNodeFields.limitCount] >= count) {
                            flag = false;
                            break;
                        }
                    }
                }
            }
            return flag;
        }
        private checkRP(): void {
            let bolll = this.getmall_1RP();
            RedPointCtrl.instance.setRPProperty("shangchengRP", bolll);
        }
    }
}