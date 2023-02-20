///<reference path="../common/common_util.ts"/>
///<reference path="../player/player_model.ts"/>
///<reference path="../notice/drop_notice_manager.ts"/>
///<reference path="../notice/item_notice_manager.ts"/>
///<reference path="../config/vip_cfg.ts"/>
///<reference path="../config/blend_cfg.ts"/>
///<reference path="../../utils/table_utils.ts"/>
///<reference path="../vip/vip_model.ts"/>

/** 背包数据*/
namespace modules.bag {
    import item_equip = Configuration.item_equip;
    import item_equipFields = Configuration.item_equipFields;
    import Dictionary = Laya.Dictionary;
    import GetActorBaseAttrReplyFields = Protocols.GetActorBaseAttrReplyFields;
    import IMsgFields = Protocols.IMsgFields;
    import ItemFields = Protocols.ItemFields;
    import Item = Protocols.Item;
    import BagOperFields = Protocols.BagOperFields;
    import DropNoticeManager = modules.notice.DropNoticeManager;
    import PlayerModel = modules.player.PlayerModel;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import TableUtils = utils.TableUtils;
    import SmeltReplyFields = Protocols.SmeltReplyFields;
    import VipModel = modules.vip.VipModel;
    import PrivilegeCfg = modules.config.PrivilegeCfg;
    import PrivilegeNode = Configuration.PrivilegeNode;
    import PrivilegeNodeFields = Configuration.PrivilegeNodeFields;
    import Layer = ui.Layer;
    import CommonUtil = modules.common.CommonUtil;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_materialFields = Configuration.item_materialFields;
    import item_material = Configuration.item_material;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class BagModel {
        private static _instance: BagModel;

        public static get instance(): BagModel {
            return this._instance = this._instance || new BagModel();
        }

        private _bagIdToUidItems: Dictionary = new Dictionary();
        // private _uidToItem:Dictionary = new Dictionary();

        public bagInited: boolean;

        //选择的内容，初始选择均为6,maxstages,1
        private _smeltColor: number = 6;
        private _smeltStage: number = 13;
        private _smeltStar: number = 2;
        public maxStage: number = 13;       //------------------------- 根据觉醒等级进行配置,改变
        private _smeltRankItems: Table<Table<Item>>;
        private _stageTable: Table<Table<number>>;
        private _stageInit: boolean = false;
        public smeltLevel: number;
        public smeltExp: number;
        public oneKeySmelt: boolean = false;
        private _reciveCount: Array<number>;
        private _quicklySmelt: boolean = false;
        public equipMaxStage: number;
        private _getItemId: Array<number> = [90730001, 90330001, 10120001];
        private _delayedItems: [BagId, ItemSource, Item][];
        public _isUp: boolean = false;//熔炼是否 升级了;
        public _inBagQuicklySmelt: boolean = false;               //新增.在背包界面点击一键熔炼且需要显示熔炼所得
        constructor() {
            this._delayedItems = [];
        }

        public set smeltColor(num: number) {
            this._smeltColor = num;
            redPoint.RedPointCtrl.instance.setRPProperty("smeltRP", this.getSmeltRank().length > 0);
        }

        public set smeltStage(num: number) {
            this._smeltStage = num;
            redPoint.RedPointCtrl.instance.setRPProperty("smeltRP", this.getSmeltRank().length > 0);
        }

        public set smeltStar(num: number) {
            this._smeltStar = num;
            redPoint.RedPointCtrl.instance.setRPProperty("smeltRP", this.getSmeltRank().length > 0);
        }

        public get smeltColor(): number {
            return this._smeltColor;
        }

        public get smeltStage(): number {
            return this._smeltStage;
        }

        public get smeltStar(): number {
            return this._smeltStar;
        }

        // 根据背包ID添加道具列表
        public addItemsByBagId(bagId: number, items: Array<Protocols.Item>): void {
            // bagid: 0道具1装备2仙石3圣物
            let uidToItem: Dictionary = new Dictionary();
            for (let i: int = 0; i < items.length; i++) {
                uidToItem.set(items[i][Protocols.ItemFields.uid], items[i]);
            }
            this._bagIdToUidItems.set(bagId, uidToItem);
            // for(let i:int = 0; i < items.length; i++){
            //     this._uidToItem.set(items[i][Protocols.ItemFields.uid], items[i]);
            // }
            this.equipMaxStage = 0;
            if (this._bagIdToUidItems.get(0) && this._bagIdToUidItems.get(1) && this._bagIdToUidItems.get(2) && this._bagIdToUidItems.get(3)) {
                this.bagInited = true;
                GlobalData.dispatcher.event(CommonEventType.BAG_DATA_INITED);
            }
            if (bagId == BagId.equipType) {
                this.setSmeltRank();
                redPoint.RedPointCtrl.instance.setRPProperty("smeltRP", this.getSmeltRank().length > 0);
            }
        }

        /**
         * 初始化熔炼信息
         * @param level 等级
         * @param exp  经验
         */
        public initSmeltInfo(level: number, exp: number): void {
            this.smeltLevel = level;
            this.smeltExp = exp;
            this.initRecive();
            GlobalData.dispatcher.event(CommonEventType.SMELT_UPDATE);
        }

        /**
         * 初始化熔炼获得信息
         */
        public initRecive(): void {
            this._reciveCount = new Array<number>();
            for (let i = 0; i < 3; i++) {
                this._reciveCount[i] = 0;
            }
        }

        /**
         * 更新熔炼信息
         * @param tuple
         */
        public updateSmeltInfo(tuple: Protocols.SmeltReply): void {

            if (this.smeltLevel != tuple[SmeltReplyFields.level]) {
                this._isUp = true;
            }

            this.smeltLevel = tuple[SmeltReplyFields.level];
            this.smeltExp = tuple[SmeltReplyFields.curExp];

            GlobalData.dispatcher.event(CommonEventType.SMELT_UPDATE);
            if (this._quicklySmelt) {
                this._quicklySmelt = false;
                //在背包点击一键熔炼（走的快速熔炼逻辑）也需要显示熔炼获得
                if (this._inBagQuicklySmelt) {
                    this._inBagQuicklySmelt = false;
                    let datas: Array<Item> = [];
                    datas.push([this._getItemId[0], tuple[SmeltReplyFields.exp], 0, null]);
                    datas.push([this._getItemId[1], tuple[SmeltReplyFields.copper], 0, null]);
                    datas.push([this._getItemId[2], tuple[SmeltReplyFields.stone], 0, null]);
                    WindowManager.instance.openDialog(WindowEnum.SMELT_SUCCESS_ALERT, [datas, '熔炼成功']);
                    modules.bag.BagCtrl.instance.showSmelt_upgrade_alert(1);
                }
                return;
            }
            this._reciveCount[0] = this._reciveCount[0] + tuple[SmeltReplyFields.exp];
            this._reciveCount[1] = this._reciveCount[1] + tuple[SmeltReplyFields.copper];
            this._reciveCount[2] = this._reciveCount[2] + tuple[SmeltReplyFields.stone];
        }

        /**
         * 显示获取弹窗
         */
        public showGetAlert(): void {
            if (!this.oneKeySmelt) {
                let datas: Array<Item> = [];
                for (let i = 0; i < 3; i++) {
                    if (this._reciveCount[i] != 0) {
                        let data: Item = [this._getItemId[i], this._reciveCount[i], 0, null];
                        datas.push(data);
                    }
                }
                if (datas && datas.length > 0) {
                    WindowManager.instance.openDialog(WindowEnum.SMELT_SUCCESS_ALERT, [datas, '熔炼成功']);
                    modules.bag.BagCtrl.instance.showSmelt_upgrade_alert(1);
                    this.initRecive();
                }
            }
        }

        /**
         * 设置最大阶数
         * @param level
         */
        public setMaxStage(level: number): void {
            if (!this._stageInit) {
                this._stageInit = true;
                let str = BlendCfg.instance.getCfgById(10005)[blendFields.stringParam]; //从表中获取数据
                this._stageTable = {};
                for (let i = 0; i < str.length; i++) {
                    str[i] = str[i].replace("[", "");
                    str[i] = str[i].replace("]", "");
                    let strShow = str[i].split("#");
                    if (strShow.length != 3) {
                        continue;
                    }
                    let index = parseInt(strShow[0]);
                    let table: Table<number> = this._stageTable[index];
                    if (!table) {
                        table = {};
                    }
                    table[parseInt(strShow[1])] = parseInt(strShow[2]);
                    this._stageTable[index] = table;
                }
            }
            let z = Math.floor(level * 0.01);
            let c = level % 100;
            let tableTemp: Table<number> = this._stageTable[z];
            if (!tableTemp) {
                // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" + z + "转" + c + "重数据不存在");
            }
            if (tableTemp[c] != this.maxStage) {
                this.maxStage = tableTemp[c];
                // this.maxStageChange = true;
            }
            if (!this._smeltStage /* && this.maxStageChange */) {    //在选择为任意阶数的情况下，保持最大阶数一致
                if (this.equipMaxStage > this.maxStage) {
                    this.smeltStage = this.equipMaxStage;
                } else {
                    this.smeltStage = this.maxStage;
                }
            }
        }

        //不可穿戴的装备，每阶只保留评分最高的那件
        private cantWearBestEquip(): Array<number> {
            let equipDic: Dictionary = this._bagIdToUidItems.get(1);
            let equipItem: Array<Item> = equipDic.values;
            let items: Table<Array<Item>> = {};  //不能穿戴的每个部位的每个觉醒阶的最高装备id
            for (let i: int = 0; i < equipItem.length; i++) {
                let itemId: number = equipItem[i][ItemFields.ItemId];
                let part = CommonUtil.getPartById(itemId);
                //去掉戒指和玉佩
                if (part == EquipCategory.jude || part == EquipCategory.ring) {
                    continue;
                }
                //评分高于身上的装备  每个部位每个觉醒阶只保留一件
                //不可穿戴的装备，每阶只保留评分最高的那件
                let equipCfg: Configuration.item_equip = config.ItemEquipCfg.instance.getItemCfgById(itemId);
                let needLv: number = equipCfg[item_equipFields.wearLvl];
                let needEra: number = equipCfg[item_equipFields.era];
                //不能穿戴
                if (needLv > PlayerModel.instance.level || needEra > PlayerModel.instance.eraLevel) {
                    if (!items[part]) {
                        items[part] = [];
                        items[part][needEra] = equipItem[i];
                    } else {
                        let score: number = equipItem[i][ItemFields.iMsg][IMsgFields.baseScore]; //评分
                        let tScore: number;
                        if (items[part][needEra]) {
                            tScore = items[part][needEra][ItemFields.iMsg][IMsgFields.baseScore];
                        } else {
                            tScore = 0;
                        }
                        if (score > tScore) {
                            items[part][needEra] = equipItem[i];
                        }
                    }
                }
            }
            let uids: number[] = [];
            for (let key in items) {
                for (let i: int = 0; i < items[key].length; i++) {
                    if (items[key][i]) {
                        uids.push(items[key][i][ItemFields.uid]);
                    }
                }
            }
            return uids;
        }

        //可穿戴的装备，只保留评分最高的那件
        private canWearBestEquip(): Array<number> {
            let equipDic: Dictionary = this._bagIdToUidItems.get(1);
            let equipItem: Array<Item> = equipDic.values;
            let items: Table<Item> = {};  //能穿戴的每个部位最高装备id
            for (let i: int = 0; i < equipItem.length; i++) {
                let itemId: number = equipItem[i][ItemFields.ItemId];
                let part = CommonUtil.getPartById(itemId);
                //去掉戒指和玉佩 以及评分低的
                if (part == EquipCategory.jude || part == EquipCategory.ring || this.checkEquipIsWorse(equipItem[i])) {
                    continue;
                }
                //评分高于身上的装备  只保留一件 只保留评分最高的那件
                let equipCfg: Configuration.item_equip = config.ItemEquipCfg.instance.getItemCfgById(itemId);
                let needLv: number = equipCfg[item_equipFields.wearLvl];
                let needEra: number = equipCfg[item_equipFields.era];
                //能穿戴
                if (needLv <= PlayerModel.instance.level && needEra <= PlayerModel.instance.eraLevel) {

                    let score: number = equipItem[i][ItemFields.iMsg][IMsgFields.baseScore]; //评分
                    let tScore: number;
                    if (items[part]) {
                        tScore = items[part][ItemFields.iMsg][IMsgFields.baseScore];
                    } else {
                        if (PlayerModel.instance.getEquipByPart(part)) {
                            tScore = PlayerModel.instance.getEquipByPart(part)[ItemFields.iMsg][IMsgFields.baseScore];
                        } else {
                            tScore = 0;
                        }
                    }
                    if (score > tScore) {
                        items[part] = equipItem[i];
                    }
                }
            }
            let uids: number[] = [];
            for (let key in items) {
                if (items[key]) {
                    uids.push(items[key][ItemFields.uid]);
                }
            }
            return uids;
        }

        //根据背包品质、阶数以及星级来设置熔炼装备列表
        /**   逻辑?   **/
        public setSmeltRank(): void {
            let equipDic: Dictionary = this._bagIdToUidItems.get(1);
            let equipItem: Array<Item> = equipDic.values;
            this._smeltRankItems = {};
            let cantWearBestEquip: Array<number> = this.cantWearBestEquip();
            let canWearBestEquip: Array<number> = this.canWearBestEquip();
            for (let i: int = 0; i < equipItem.length; i++) {
                let itemId: number = equipItem[i][ItemFields.ItemId];
                let part = CommonUtil.getPartById(itemId);
                //去掉戒指和玉佩
                if (part == EquipCategory.jude || part == EquipCategory.ring) {
                    continue;
                }

                let itemUid: number = equipItem[i][ItemFields.uid];
                let equipCfg: Configuration.item_equip = config.ItemEquipCfg.instance.getItemCfgById(itemId);
                let needLv: number = equipCfg[item_equipFields.wearLvl];
                let needEra: number = equipCfg[item_equipFields.era];
                //是不可穿戴装备里最好的
                // if (needLv > PlayerModel.instance.level || needEra > PlayerModel.instance.eraLevel){

                // }else {//是可穿戴装备里最好的

                // }
                if (cantWearBestEquip.indexOf(itemUid) !== -1) {
                    continue;
                }
                if (canWearBestEquip.indexOf(itemUid) !== -1) {
                    continue;
                }
                let index = parseInt(equipItem[i][ItemFields.ItemId].toString().slice(1, 5), 10);
                let stage = Math.floor(index / 100);
                if (this.equipMaxStage < stage) {
                    this.equipMaxStage = stage;
                    if (!this._smeltStage && this.smeltStage < this.equipMaxStage) {
                        this.smeltStage = this.equipMaxStage;
                    }
                }
                let table: Table<Item> = this._smeltRankItems[index];
                if (!table) {
                    table = {};
                }
                table[equipItem[i][ItemFields.uid]] = equipItem[i];
                this._smeltRankItems[index] = table;
            }
        }


        // 熔炼装备字典(key:星级、阶数、品质组成的索引，value:key:uid,value:item)
        public get smeltRankItems(): Table<Table<Item>> {
            return this._smeltRankItems;
        }

        /**
         * 获得装备 可熔炼机制
         */
        public getSmeltRank(): Array<Item> { //阶段从1-stage,颜色从1-color,星级从1-star
            let arr: Array<Item> = [];

            for (let i: int = this.smeltStage; i > 0; i--) {
                for (let j: int = this.smeltColor; j > 0; j--) {
                    for (let n: int = this.smeltStar; n > 0; n--) {
                        let index = i * 100 + j * 10 + n;
                        let table: Table<Item> = this._smeltRankItems[index];
                        if (table) {
                            //传入方法获得对象
                            arr = arr.concat(TableUtils.values(table));
                        }
                    }
                }
            }
            return arr;
        }

        public quicklyOneKeySmelt(): void {
            let t: number = Browser.now();
            this.setSmeltRank();
            let equip: Item[] = this.getSmeltRank();
            let smeltId = new Array<number>();
            for (let i = 0; i < equip.length; i++) {
                smeltId.push(equip[i][ItemFields.uid]);
            }
            this._quicklySmelt = true;
            if (smeltId.length == 0) {
                CommonUtil.noticeError(18002);
                return;
            }
            // console.log("一键熔炼耗时......................" + (Browser.now() - t));
            BagCtrl.instance.oneKeySmelt(smeltId);
        }

        // 根据背包ID获取道具列表
        public getItemsByBagId(bagId: number): Array<Protocols.Item> {
            let t: Dictionary = this._bagIdToUidItems.get(bagId);
            return t ? t.values : null;
        }

        // 根据背包ID和唯一id获取道具
        public getItemByBagIdUid(bagId: number, uid: number): Protocols.Item {
            let t: Dictionary = this._bagIdToUidItems.get(bagId);
            return t ? t.get(uid) : null;
        }

        // 根据道具ID和唯一ID获取道具
        public getItemByIdUid(itemId: number, uid: number): Protocols.Item {
            let bagId: number = CommonUtil.getBagIdById(itemId);
            return this.getItemByBagIdUid(bagId, uid);
        }

        // 根据道具ID获取道具数量
        public getItemCountById(itemId: number): number {
            if (itemId == 21530011)
                console.log("根据道具ID获取道具数量", itemId, CommonUtil.getBagIdById(itemId), !this.bagInited)
            if (!this.bagInited) return;
            let items: Array<Protocols.Item> = this.getItemsByBagId(CommonUtil.getBagIdById(itemId));
            let count: number = 0;
            for (let i: int = 0, len = items.length; i < len; i++) {
                if (items[i][ItemFields.ItemId] === itemId) {
                    count += items[i][ItemFields.count];
                }
            }
            return count;
        }

        public getItemsById(itemId: number): Array<Item> {
            let items: Array<Protocols.Item> = this.getItemsByBagId(CommonUtil.getBagIdById(itemId));
            let arr: Array<Item> = [];
            for (let i: int = 0, len = items.length; i < len; i++) {
                if (items[i][ItemFields.ItemId] === itemId) {
                    arr.push(items[i]);
                }
            }
            return arr;
        }

        // 更新背包
        public updateBag(tuple: Protocols.UpdateBag): void {
            try {
                let bagOpers: Array<Protocols.BagOper> = tuple[Protocols.UpdateBagFields.bags];
                // 背包操作不确定，暂时不细化操作事件
                for (let i: int = 0, len: int = bagOpers.length; i < len; i++) {
                    let bagOper: Protocols.BagOper = bagOpers[i];
                    let bagId: int = bagOper[Protocols.BagOperFields.bagId];
                    // 背包ID对应数据为空时不处理
                    let uidToItem: Dictionary = this._bagIdToUidItems.get(bagId);
                    if (!uidToItem) return;
                    let itemOpers: Array<Protocols.ItemOper> = bagOper[Protocols.BagOperFields.itemOpers];
                    let added: boolean = false;
                    for (let j: int = 0, len1: int = itemOpers.length; j < len1; j++) {
                        let itemOper: Protocols.ItemOper = itemOpers[j];
                        let operType: int = itemOper[Protocols.ItemOperFields.type];
                        let tItem: Protocols.Item = itemOper[Protocols.ItemOperFields.item];
                        // console.log("operType " + operType);
                        switch (operType) {   // 0新增1增加数量2删除3减少数量
                            case 0: {
                                let itemId: number = tItem[ItemFields.ItemId];
                                //console.log("item11= ",tItem,bagId,tItem);
                                let item: Protocols.Item = [itemId, tItem[ItemFields.count], tItem[ItemFields.uid], tItem[ItemFields.iMsg]];
                                if (!uidToItem) {
                                    uidToItem = new Dictionary();

                                    this._bagIdToUidItems.set(bagId, uidToItem);
                                    if (bagId == 1) {
                                        this.setSmeltRank(); //初始化熔炼表
                                    }
                                }

                                uidToItem.set(item[Protocols.ItemFields.uid], item);
                                added = true;

                                if (bagId == 1) {
                                    let part = CommonUtil.getPartById(itemId);
                                    if (part != EquipCategory.jude && part != EquipCategory.ring && this.checkEquipIsWorse(item)) {  //去掉戒指和玉佩以及评分高的
                                        let index = parseInt(itemId.toString().slice(1, 5), 10);
                                        let stage = Math.floor(index / 100);
                                        if (this.equipMaxStage < stage) {
                                            this.equipMaxStage = stage;
                                            if (!this._smeltStage && this.smeltStage < this.equipMaxStage) {
                                                this.smeltStage = this.equipMaxStage;
                                            }
                                        }
                                        let table: Table<Item> = this._smeltRankItems[index];
                                        if (!table) {
                                            table = {};
                                        }
                                        table[item[ItemFields.uid]] = item;  //加入对象
                                        this._smeltRankItems[index] = table;
                                    }
                                }

                                // 操作列表中的所有添加合并成一个事件？
                                GlobalData.dispatcher.event(CommonEventType.BAG_ADD_ITEM, [item, bagOper[BagOperFields.source]]);
                                GlobalData.dispatcher.event(CommonEventType.KUNLUN_BAG_ADD_ITEM, [item, bagOper[BagOperFields.source]]);
                                GlobalData.dispatcher.event(CommonEventType.BAG_ADD_ITEM_CashEquip, [tItem]);
                                this.enterBagTip(bagId, bagOper[BagOperFields.source], tItem);
                            }
                                break;
                            case 1: {
                                let item: Protocols.Item = this.getItemByBagIdUid(bagId, tItem[Protocols.ItemFields.uid]);
                                //console.log("item11= ",item,bagId,tItem);
                                if (!item) {
                                    console.error("背包数据出现异常！！！", bagId, tItem[Protocols.ItemFields.uid]);
                                    return;
                                }
                                item[Protocols.ItemFields.count] += tItem[Protocols.ItemFields.count];
                                // GlobalData.dispatcher.event(CommonEventType.BAG_CHANGE_NUM, item[Protocols.ItemFields.uid]);
                                GlobalData.dispatcher.event(CommonEventType.KUNLUN_BAG_ADD_ITEM, [item, bagOper[BagOperFields.source]]);
                                this.enterBagTip(bagId, bagOper[BagOperFields.source], tItem);
                                GlobalData.dispatcher.event(CommonEventType.BAG_ADD_ITEM, [item, bagOper[BagOperFields.source]]);
                                GlobalData.dispatcher.event(CommonEventType.BAG_ADD_ITEM_CashEquip, [tItem]);
                            }
                                break;
                            case 2: {
                                let uid: number = tItem[Protocols.ItemFields.uid];
                                //console.log("item11= ",tItem,bagId,tItem);
                                if (uidToItem) {
                                    if (uidToItem.remove(uid)) {
                                        // 操作列表中的所有删除合并成一个事件？
                                        GlobalData.dispatcher.event(CommonEventType.BAG_REMOVE_ITEM, [uid]);
                                    }
                                    if (bagId == 1) {
                                        let index = (tItem[ItemFields.ItemId] * 0.001 >> 0) % 10000;
                                        let table: Table<Item> = this._smeltRankItems[index];
                                        if (table) {
                                            delete table[tItem[ItemFields.uid]];  //删除表中某个数据
                                            // this._smeltRankItems[index] = table;
                                        }
                                    }
                                }
                            }
                                break;
                            case 3: {
                                let item: Protocols.Item = this.getItemByBagIdUid(bagId, tItem[Protocols.ItemFields.uid]);
                                //console.log("item11= ",item,bagId,tItem);
                                item[Protocols.ItemFields.count] -= tItem[Protocols.ItemFields.count];
                                GlobalData.dispatcher.event(CommonEventType.BAG_REMOVE_ITEM, [tItem[Protocols.ItemFields.uid]]);
                                // GlobalData.dispatcher.event(CommonEventType.BAG_CHANGE_NUM, item[Protocols.ItemFields.uid]);
                            }
                                break;
                        }
                        if (bagId == BagId.equipType) {
                            this.setSmeltRank();
                            redPoint.RedPointCtrl.instance.setRPProperty("smeltRP", this.getSmeltRank().length > 0);
                        }
                    }
                    if (added) {      // 如果有增加操作，需要重新排序（第一次全排，后面插入）
                        // 清掉key，重排value，重新生成key
                        let uidToItem: Dictionary = this._bagIdToUidItems.get(bagId);
                        // uidToItem.keys.length = 0;
                    }
                    GlobalData.dispatcher.event(CommonEventType.BAG_UPDATE, bagId);
                }
            } catch (error) {
                console.log("背包数据出现异常:",error);
            }
        }

        // 取出最佳装备字典
        public getBestEquipDic(): Dictionary {
            // 遍历装备背包，取出最高评分的装备
            let equips: Array<Protocols.Item> = BagModel.instance.getItemsByBagId(BagId.equipType);
            let partDic: Dictionary = new Dictionary();
            for (let i: int = 0, len = equips.length; i < len; i++) {
                let equip: Protocols.Item = equips[i];
                let era: number = PlayerModel.instance.eraLevel;
                let lv: number = PlayerModel.instance.level;
                let equipCfg: item_equip = CommonUtil.getItemCfgById(equip[ItemFields.ItemId]) as item_equip;
                if (era < equipCfg[item_equipFields.era] || lv < equipCfg[item_equipFields.wearLvl]) {
                    continue;
                }
                let part: int = CommonUtil.getPartById(equip[Protocols.ItemFields.ItemId]);
                let maxEquip: Protocols.Item = partDic.get(part);
                if (!maxEquip) maxEquip = PlayerModel.instance.getEquipByPart(part);
                if (!maxEquip || equip[ItemFields.iMsg][IMsgFields.baseScore] > maxEquip[ItemFields.iMsg][IMsgFields.baseScore]) {
                    partDic.set(part, equip);
                }
            }
            return partDic;
        }

        /**
         * 判断装备是不是比身上的装备评分要低
         */
        public checkEquipIsWorse(equip: Protocols.Item): boolean {
            let part: int = CommonUtil.getPartById(equip[Protocols.ItemFields.ItemId]);
            let myEquip = PlayerModel.instance.getEquipByPart(part);
            if (!myEquip || equip[ItemFields.iMsg][IMsgFields.baseScore] > myEquip[ItemFields.iMsg][IMsgFields.baseScore]) {
                return false;
            }
            return true;
        }

        // 根据背包ID获取背包剩余容量
        public getBagEnoughById(bagId: int): int {
            let maxCount: number = 0;
            let vipLv = VipModel.instance.vipLevel;
            if (bagId === BagId.itemType) {
                let params: PrivilegeNode = PrivilegeCfg.instance.getVipInfoByLevel(vipLv, Privilege.itemEquipSize);
                maxCount = BlendCfg.instance.getCfgById(10001)[blendFields.intParam][0];
                if (params)
                    maxCount += params[PrivilegeNodeFields.param1];
            } else if (bagId === BagId.equipType) {  //先不加vip的
                let params: PrivilegeNode = PrivilegeCfg.instance.getVipInfoByLevel(vipLv, Privilege.bagEquipSize);
                maxCount = BlendCfg.instance.getCfgById(10002)[blendFields.intParam][0];
                if (params)
                    maxCount += params[PrivilegeNodeFields.param1];
            } else if (bagId === BagId.stoneType) {
                maxCount = BlendCfg.instance.getCfgById(10003)[blendFields.intParam][0];
                // maxCount += vipCfg[vipFields.stoneBagSize];
            } else if (bagId === BagId.magicWeaponType) {
                maxCount = BlendCfg.instance.getCfgById(10004)[blendFields.intParam][0];
                // maxCount += vipCfg[vipFields.magiceWeaponBagSize];
            } else if (bagId === BagId.rune) {
                maxCount = BlendCfg.instance.getCfgById(10008)[blendFields.intParam][0];
            }
            else if (bagId === BagId.xianyu) {
                maxCount = BlendCfg.instance.getCfgById(10008)[blendFields.intParam][0];
            }
            else if (bagId === BagId.temple) {
                maxCount = BlendCfg.instance.getCfgById(10010)[blendFields.intParam][0];
            }

            let arr: Array<Item> = BagModel.instance.getItemsByBagId(bagId);
            return maxCount - (arr ? arr.length : 0);
        }

        // 不入包来源数组
        public noTipSources: Array<ItemSource> = [ItemSource.outline, ItemSource.sweepingIncom, ItemSource.monsterDrop,
        ItemSource.xianfuDecActive, ItemSource.tianguanCopy, ItemSource.dahuangCopy, ItemSource.shilianCopy,
        ItemSource.runeCopy, ItemSource.teamCopy, ItemSource.singleBossCopy, ItemSource.tiantiCopy,
        ItemSource.nineCopy, ItemSource.fairyCopy, ItemSource.cloudlandCopy, ItemSource.gem, ItemSource.wear,
        ItemSource.xianfuOpen,
        ];

        // 入包提示
        public enterBagTip(bagId: BagId, source: ItemSource, item: Item, manual: boolean = false): void {

            if (source == ItemSource.runeDial && !manual) {  //远古转盘的延迟处理
                this._delayedItems.push([bagId, source, item]);
                return;
            } else if (source == ItemSource.factionTurn && !manual) {
                this._delayedItems.push([bagId, source, item]);
                return;
            }
            else if (source == ItemSource.payReward && !manual) {
                this._delayedItems.push([bagId, source, item]);
                return;
            }
            else if (source == ItemSource.payRewardTen && !manual) {
                this._delayedItems.push([bagId, source, item]);
                return;
            }
            else if (source == ItemSource.duobao && !manual) {
                this._delayedItems.push([bagId, source, item]);
                return;
            } else if (source == ItemSource.jzduobao && !manual) {
                this._delayedItems.push([bagId, source, item]);
                return;
            }

            if (this.noTipSources.indexOf(source) === -1) {
                // 有面板打开时挂机收益不提示
                if (source === ItemSource.onhook) {     // 挂机走掉落提示
                    if (LayerManager.instance.getLayerById(Layer.UI_LAYER).numChildren === 0) {
                        DropNoticeManager.instance.addItem(item);
                    }
                } else {
                    if (bagId != BagId.xunbao && bagId != BagId.xianyu) {        // 探索不入包
                        DropNoticeManager.instance.addItem(item);
                    }
                }
            }
        }

        //转盘类延迟入包
        //延时入包
        public delayedPutInBag(): void {
            for (let i: int = 0, len: int = this._delayedItems.length; i < len; i++) {
                let bagId: number = this._delayedItems[i][0];
                let itemSource: number = this._delayedItems[i][1];
                let item: Item = this._delayedItems[i][2];
                this.enterBagTip(bagId, itemSource, item, true);
            }
            BagModel.instance._delayedItems.length = 0;
        }

        // 检测红点
        public checkRP(): void {
            let items: Array<Item> = this.getItemsByBagId(BagId.itemType);
            let flag: boolean = false;
            if (items) {
                for (let i: int = 0, len: int = items.length; i < len; i++) {
                    let itemCfg: item_material = ItemMaterialCfg.instance.getItemCfgById(items[i][ItemFields.ItemId]);
                    if (itemCfg[item_materialFields.shortcutUse] && PlayerModel.instance.level >= itemCfg[item_materialFields.useLvl]
                        && VipModel.instance.vipLevel >= itemCfg[item_materialFields.vipLvl]) {
                        flag = true;
                        break;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("bagRP", flag);
        }
    }
}
