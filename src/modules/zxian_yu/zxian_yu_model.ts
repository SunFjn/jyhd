namespace modules.zxian_yu {
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
    import PayRewardNoteSvr = Protocols.PayRewardNoteSvr;
    import blendFields = Configuration.blendFields;
    import GetXianYuInfoReply = Protocols.GetXianYuInfoReply;
    import GetXianYuInfoReplyFields = Protocols.GetXianYuInfoReplyFields;

    import GetYuGeInfoReply = Protocols.GetYuGeInfoReply;
    import GetYuGeInfoReplyFields = Protocols.GetYuGeInfoReplyFields;
    import BuyYuGeGoodsReply = Protocols.BuyYuGeGoodsReply;
    import BuyYuGeGoodsReplyFields = Protocols.BuyYuGeGoodsReplyFields;
    import F5YuGeReply = Protocols.F5YuGeReply;
    import F5YuGeReplyFields = Protocols.F5YuGeReplyFields;

    import GetXianYuFuYuInfoReply = Protocols.GetXianYuFuYuInfoReply;
    import GetXianYuFuYuInfoReplyFields = Protocols.GetXianYuFuYuInfoReplyFields;

    import GetFuYuanAwardReply = Protocols.GetFuYuanAwardReply;
    import GetFuYuanAwardReplyFields = Protocols.GetFuYuanAwardReplyFields;

    import Pair = Protocols.Pair;
    import PairFields = Protocols.PairFields;

    export class ZXianYuModel {
        private static _instance: ZXianYuModel;
        public static get instance(): ZXianYuModel {
            return this._instance = this._instance || new ZXianYuModel();
        }
        private _exchangeReply: number;
        private _hintList: Array<XunbaoHint>;
        private _restTime: number;
        private _blessing: Array<number>;
        private _selfBroadcast: Array<XunbaoNote>;
        private _svrBroadcast: Array<Array<XunbaoNote>>;
        private _runXunBaoReply: RunXunbaoReply;
        private _taskXunbaoList: number;
        private _taskXunbaoAll: number;
        private _selectItem: Array<Item>;
        private _coupon: Array<number>;
        private _redArr: Table<boolean>;
        private _fistFlag: Array<number>;
        private _svrBroadcastList: Array<PayRewardNoteSvr>;  //全服记录

        private _xianyu: number = 0;
        private _xianyuLimit: number = 0;

        private _idList: Array<Pair>; /*玉阁商品id:状态 0：未购买，1已购买*/
        private _f5Time: number = 0;/*下次刷新时间*/

        private _fuyu: number = 0;
        private _stateList: Array<number>;/*已领取的档位*/

        public oneNum: number = 0;
        public twoNum: number = 0;
        public threeNum: number = 0;
        public id: number = 0;
        public _everydayMaxLimit: number = 0;
        public _everyTimeFuYuan: number = 0;
        public _biLiArr: Array<Array<number>>;
        public taskActivesValue: number[]; //任务活跃值
        public taskActivesAward: number[][]; //任务活跃奖励
        public updateVlaue: number[]; //任务活跃值

        public _awardAee: Array<Array<number>>;
        public _awardAee1: Array<Array<number>>;
        constructor() {
            this._biLiArr = new Array<Array<number>>();
            this._stateList = new Array<number>();
            this._idList = new Array<Pair>();
            this._selectItem = new Array<Item>();
            this._blessing = new Array<number>();
            this._coupon = new Array<number>();
            this._fistFlag = new Array<number>();
            this._selfBroadcast = new Array<XunbaoNote>();
            this._svrBroadcast = new Array<Array<XunbaoNote>>();
            this._hintList = new Array<XunbaoHint>();
            this._redArr = {};
            this._svrBroadcastList = new Array<PayRewardNoteSvr>();

            this.getBlendCfgShuJu();
        }
        public set stateList(value: Array<number>) {
            this._stateList = value;
        }
        public get stateList(): Array<number> {
            return this._stateList;
        }
        public set fuyu(value: number) {
            this._fuyu = value;
        }
        public get fuyu(): number {
            return this._fuyu;
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
        public set xianyu(value: number) {
            this._xianyu = value;
        }
        public get xianyu(): number {
            return this._xianyu;
        }
        public set xianyuLimit(value: number) {
            this._xianyuLimit = value;
        }
        public get xianyuLimit(): number {
            return this._xianyuLimit;
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

        public getFuYuanAward(): Array<number> {
            for (let i = 0; i < this.taskActivesValue.length; i++) {
                let element1 = this.taskActivesValue[i];
                let bolll = true;
                for (let index = 0; index < this.stateList.length; index++) {
                    let element = this.stateList[index];
                    if (element == i) {
                        bolll = false;
                        break;
                    }
                }
                if (bolll) {
                    return [element1, i];
                }
            }
            let element1 = this.taskActivesValue[this.taskActivesAward.length - 1];
            return [element1, this.taskActivesAward.length - 1];
        }

        public getMaxVlaue():number {
            let element1 = this.taskActivesValue[this.taskActivesAward.length - 1];
            return element1;
        }

        public setRP() {
            let bolll = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.xianYu);
            // "zxianYuBagPanelRP": boolean;     // 点券背包红点
            // "zxianYuPanelRP": boolean;     // 点券红点
            // "zxianYuStorePanelRP": boolean;     // 点券商店红点
            // "zxianYuTreasurePanelRP": boolean;     // 点券抽奖红点
            if (BagModel.instance.getItemsByBagId(BagId.xianyu)) {
                let items: Array<Protocols.Item> = BagModel.instance.getItemsByBagId(BagId.xianyu).concat();
                let bolll1 = false;
                if (items) {
                    if (items.length > 0) {
                        bolll1 = true;
                    }
                    else {
                        bolll1 = false;
                    }
                }
                else {
                    bolll1 = false;
                }
                RedPointCtrl.instance.setRPProperty("zxianYuBagPanelRP", bolll && bolll1);
            }

            let bolll2 = false;
            let shuju = ZXianYuModel.instance.getFuYuanAward();
            if (shuju) {
                let conditionNUm = shuju[0];
                if (ZXianYuModel.instance.fuyu >= conditionNUm) {
                    bolll2 = true;
                } else {
                    bolll2 = false;
                }
            }
            else {
                bolll2 = false;
            }
            RedPointCtrl.instance.setRPProperty("zxianYuTreasurePanelRP", bolll && bolll2);
        }
        private getBlendCfgShuJu() {
            this._everydayMaxLimit = modules.config.BlendCfg.instance.getCfgById(48001)[blendFields.intParam][0];
            this._everyTimeFuYuan = modules.config.BlendCfg.instance.getCfgById(48003)[blendFields.intParam][0];
            this.updateVlaue = modules.config.BlendCfg.instance.getCfgById(48005)[blendFields.intParam];
            let jiangLi = modules.config.BlendCfg.instance.getCfgById(48002)[blendFields.intParam];
            let ind = 0;
            let key = 0;
            for (let index = 0; index < jiangLi.length; index++) {
                let element = jiangLi[index];
                if (!this._biLiArr[key]) {
                    this._biLiArr[key] = new Array<number>();
                }
                this._biLiArr[key][ind] = element;
                ind++;
                if (ind == 2) {
                    ind = 0;
                    key++;
                }
            }


            this._awardAee = new Array<Array<number>>();
            let jiangLi1 = modules.config.BlendCfg.instance.getCfgById(48008)[blendFields.intParam];
            let ind1 = 0;
            let key1 = 0;
            for (let index = 0; index < jiangLi1.length; index++) {
                let element = jiangLi1[index];
                if (!this._awardAee[key1]) {
                    this._awardAee[key1] = new Array<number>();
                }
                this._awardAee[key1][ind1] = element;
                ind1++;
                if (ind1 == 2) {
                    ind1 = 0;
                    key1++;
                }
            }


            this._awardAee1 = new Array<Array<number>>();
            let jiangLi2 = modules.config.BlendCfg.instance.getCfgById(48009)[blendFields.intParam];
            let ind2 = 0;
            let key2 = 0;
            for (let index = 0; index < jiangLi2.length; index++) {
                let element = jiangLi2[index];
                if (!this._awardAee1[key2]) {
                    this._awardAee1[key2] = new Array<number>();
                }
                this._awardAee1[key2][ind2] = element;
                ind2++;
                if (ind2 == 2) {
                    ind2 = 0;
                    key2++;
                }
            }



            this.taskActivesValue = [];
            this.taskActivesAward = [];
            let taskActives: string[] = modules.config.BlendCfg.instance.getCfgById(48004)[blendFields.stringParam];

            for (let i: int = 0, len: int = taskActives.length; i < len; i++) {
                let list = taskActives[i].substr(1, taskActives[i].length - 2).split("#");
                let id: number = parseInt(list[0]);
                this.taskActivesValue[i] = id;
                if (!this.taskActivesAward[i]) {
                    this.taskActivesAward[i] = [];
                }
                for (let j: int = 1; j < list.length; j++) {
                    this.taskActivesAward[i].push(parseInt(list[j]));
                }
            }

            this.oneNum = TreasureCfg.instance.getItemConditionByGrad(5, 0)[idCountFields.count];//第一档抽奖所需点券数量
            this.twoNum = TreasureCfg.instance.getItemConditionByGrad(5, 1)[idCountFields.count];//第二档抽奖所需点券数量
            this.threeNum = TreasureCfg.instance.getItemConditionByGrad(5, 2)[idCountFields.count];//第三档抽奖所需点券数量
            let condition = TreasureCfg.instance.getItemConditionByGrad(5, 0);
            this.id = condition[idCountFields.id]
        }
    }
}