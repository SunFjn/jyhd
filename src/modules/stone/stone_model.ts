///<reference path="../config/stone_cfg.ts"/>
///<reference path="../vip/vip_model.ts"/>

namespace modules.stone {

    import Dictionary = Laya.Dictionary;
    import GemGrids = Protocols.GemGrids;
    import GemGridFields = Protocols.GemGridFields;
    import GemGridsFields = Protocols.GemGridsFields;
    import GemGrid = Protocols.GemGrid;
    import CommonUtil = modules.common.CommonUtil;
    import Item = Protocols.Item;
    import BagModel = modules.bag.BagModel;
    import ItemFields = Protocols.ItemFields;
    import StoneCfg = modules.config.StoneCfg;
    import gemRefineFields = Configuration.gemRefineFields;
    import PlayerModel = modules.player.PlayerModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import VipModel = modules.vip.VipModel;
    import PrivilegeCfg = modules.config.PrivilegeCfg;

    export class StoneModel {

        private static _instance: StoneModel;

        public static get instance(): StoneModel {
            return this._instance = this._instance || new StoneModel();
        }

        private _currEqiup: int;   //当前选中的装备
        private _currStonePic: int; //当前的宝石槽
        private _dic: Dictionary;  //  key值是 [部位和槽位] ,  value是宝石
        private _partArr: number[]; //存储装备数组
        private _esleValue: [number, boolean, number, number];  //仙石大师等级 是否可以升级 总战力 仙石总等级
        private _virtualStone: boolean;
        private _oneKeyPit: number[];
        private _inlay: number;  //镶嵌类型  0 镶嵌 1 替换


        constructor() {

            this._partArr = [];
            this._currEqiup = 1;
            this._currStonePic = 1;

            this._esleValue = [0, false, 0, 0];
            this._dic = new Dictionary();
            this._virtualStone = false;
            this._oneKeyPit = [];
            this._inlay = 0;

        }

        public updataValue(tuple: Protocols.UpdateGemInfo): void {

            this._esleValue = [tuple[Protocols.UpdateGemInfoFields.riseLevel], tuple[Protocols.UpdateGemInfoFields.risePoint]
                , tuple[Protocols.UpdateGemInfoFields.fighting], tuple[Protocols.UpdateGemInfoFields.gemLevel]];

            this._dic.clear();

            let _data: Array<GemGrids> = tuple[Protocols.UpdateGemInfoFields.list];

            for (let i: number = 0; i < _data.length; i++) {
                let _stoneList: Array<GemGrid> = _data[i][GemGridsFields.gems];
                for (let j: number = 0; j < _stoneList.length; j++) {
                    let _key: number = _data[i][GemGridsFields.part] * 10 + _stoneList[j][GemGridFields.number];
                    this._dic.set(_key, _stoneList[j][GemGridFields.itemId])
                }
            }
            GlobalData.dispatcher.event(CommonEventType.STONE_UPDATA);

            this.setDotDis();
        }

        // 根据宝石类型获取背包中的宝石
        public getStonesByType(type: int): Array<Item> {

            let stones: Array<Item> = BagModel.instance.getItemsByBagId(BagId.stoneType);
            if (!stones) return;
            let arr: Array<Item> = new Array<Item>();
            for (let i: int = 0, len: int = stones.length; i < len; i++) {
                let item: Item = stones[i];
                let tType: int = CommonUtil.getStoneTypeById(item[ItemFields.ItemId]);
                if (tType === type) {
                    arr.push(item);
                }
            }
            return arr;
        }

        public sortStones(a: Item, b: Item): int {
            if (StoneCfg.instance.getCfgById(a[ItemFields.ItemId])[gemRefineFields.level] >
                StoneCfg.instance.getCfgById(b[ItemFields.ItemId])[gemRefineFields.level]) {
                return -1;
            } else if (StoneCfg.instance.getCfgById(a[ItemFields.ItemId])[gemRefineFields.level] <
                StoneCfg.instance.getCfgById(b[ItemFields.ItemId])[gemRefineFields.level]) {
                return 1;
            } else return 0;
        }

        public getValueByPart(): Dictionary {
            return this._dic;
        }

        public get otherValue(): [number, boolean, number, number] {
            return this._esleValue;
        }

        public set currEqiup(index: int) {
            this._currEqiup = index;
            GlobalData.dispatcher.event(CommonEventType.STONE_UPDATA);
        }

        public set currStonePic(index: int) {
            this._currStonePic = index;
        }

        public get currEqiup() {
            return this._currEqiup;
        }

        public get currStonePic() {
            return this._currStonePic;
        }

        public get vipIsOpen(): boolean {
            let vipLv = VipModel.instance.vipLevel;
            let result: boolean = !!PrivilegeCfg.instance.getVipInfoByLevel(vipLv, Privilege.gemGridOpen);
            return result;
        }

        public setDotDis(): void {
            this.updateEquip();
            this.judge();
        }

        public set virtualStone(b: boolean) {
            this._virtualStone = b;
        }

        public get virtualStone(): boolean {
            return this._virtualStone;
        }

        public set oneKeyPit(num: number[]) {
            this._oneKeyPit = [];
            this._oneKeyPit = num;
        }

        public get oneKeyPit(): number[] {
            return this._oneKeyPit;
        }

        public set inlay(num: number) {
            this._inlay = num;
        }

        public get inlay(): number {
            return this._inlay;
        }

        //更新装备
        private updateEquip(): void {

            let equipsDic: Dictionary = PlayerModel.instance.equipsDic;
            if (!equipsDic) return;
            for (let i: int = 0, len = equipsDic.keys.length; i < len; i++) {
                this._partArr[i] = equipsDic.keys[i];
            }
        }

        private judge(): void {

            if (this._partArr.length == 0) {
                RedPointCtrl.instance.setRPProperty("stoneRP", false);
                return;
            }

            //仙石大师可以升级
            if (this._esleValue[1]) {
                RedPointCtrl.instance.setRPProperty("stoneRP", true);
                return;
            }

            //可以镶嵌的时候
            for (let i: int = 0, len: int = this._partArr.length; i < len; i++) {
                //宝石槽的加号和升级箭头
                for (let j: int = 0; j < 5; j++) {
                    let _id: number = this._dic.get(this._partArr[i] * 10 + j);
                    if (_id == null) {      //没有宝石
                        if (j == 0 && this.vipIsOpen)    //vip槽 有多余宝石
                        {
                            for (let i: int = 1; i < 5; i++) {
                                if (this.getStonesByType(i).length > 0) {
                                    RedPointCtrl.instance.setRPProperty("stoneRP", true);
                                    return;
                                }
                            }
                        } else {
                            if (this.getStonesByType(j).length > 0) {
                                RedPointCtrl.instance.setRPProperty("stoneRP", true);
                                return;
                            }
                        }
                    } else {             //有宝石的时候
                        //如果能合成升级
                        if (StoneCfg.instance.getCfgById(_id)[gemRefineFields.level] != 20) {
                            if (BagModel.instance.getItemCountById(_id) + 1 >= StoneCfg.instance.getCfgById(_id)[gemRefineFields.refine_count]) {
                                RedPointCtrl.instance.setRPProperty("stoneRP", true);
                                return;
                            }
                        }

                        //如果能替换成高级石头
                        let stones: Array<Item> = this.getStonesByType(StoneCfg.instance.getCfgById(_id)[gemRefineFields.type]).concat();
                        stones = stones.sort(this.sortStones.bind(this));
                        for (let i: int = 0; i < stones.length; i++) {
                            //如果有高等级的
                            if (StoneCfg.instance.getCfgById(stones[i][ItemFields.ItemId])[gemRefineFields.level] > StoneCfg.instance.getCfgById(_id)[gemRefineFields.level]) {
                                RedPointCtrl.instance.setRPProperty("stoneRP", true);
                                return;
                            }
                        }
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("stoneRP", false);
        }
    }
}