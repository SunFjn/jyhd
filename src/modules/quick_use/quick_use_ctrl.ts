/** 快速使用*/


///<reference path="../common/common_util.ts"/>
///<reference path="../config/blend_cfg.ts"/>
namespace modules.quickUse {
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import Dictionary = Laya.Dictionary;
    import Handler = Laya.Handler;
    import BagModel = modules.bag.BagModel;
    import CommonUtil = modules.common.CommonUtil;
    import BaseCtrl = modules.core.BaseCtrl;
    import PlayerModel = modules.player.PlayerModel;
    import GetActorBaseAttrReplyFields = Protocols.GetActorBaseAttrReplyFields;
    import ItemFields = Protocols.ItemFields;
    import TweenJS = utils.tween.TweenJS;
    import Item = Protocols.Item;
    import IMsgFields = Protocols.IMsgFields;
    import item_equip = Configuration.item_equip;
    import item_equipFields = Configuration.item_equipFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;

    export class QuickUseCtrl extends BaseCtrl {
        private static _instance: QuickUseCtrl;
        public static get instance(): QuickUseCtrl {
            return this._instance = this._instance || new QuickUseCtrl();
        }

        private _items: Array<Protocols.Item>;
        private _itemType: Array<number>;//1 背包道具  2神器
        private _panel: QuickUsePanel;

        private _partArr: Array<Item>;
        private _delayedItems: [Item, ItemSource][];

        constructor() {
            super();

            this._items = new Array<Protocols.Item>();
            this._itemType = new Array<number>();
            this._partArr = new Array<Item>();
            this._delayedItems = [];
        }

        public setup(): void {
            GlobalData.dispatcher.on(CommonEventType.BAG_ADD_ITEM, this, this.addItemHandler);
            GlobalData.dispatcher.on(CommonEventType.BAG_REMOVE_ITEM, this, this.removeItemHandler);

            // GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.bagInitedHandler);
            //
            // this.bagInitedHandler();
        }

        // 背包初始化时过滤一遍
        private bagInitedHandler(): void {
            if (!BagModel.instance.bagInited) return;
            // 过滤出所有可以使用的道具和可装备的装备
            let partDic: Dictionary = BagModel.instance.getBestEquipDic();
            for (let i: int = 0, len: int = partDic.values.length; i < len; i++) {
                this.addItem(partDic.values[i]);
            }
            let items: Array<Protocols.Item> = BagModel.instance.getItemsByBagId(BagId.itemType);
            for (let i: int = 0, len: int = items.length; i < len; i++) {
                this.addItem(items[i]);
            }

        }

        public addItemHandler(item: Protocols.Item, source: ItemSource, manual: boolean = false): void {
            if (source == ItemSource.runeDial && !manual) {  //远古转盘的延迟处理
                this._delayedItems.push([item, source]);
                return;
            } else if (source == ItemSource.factionTurn && !manual) {
                this._delayedItems.push([item, source]);
                return;
            }
            // 探索仓库不处理
            if (BagModel.instance.getItemByBagIdUid(BagId.xunbao, item[ItemFields.uid])) {
                return;
            }
            // 同上 点券仓库不处理
            if (BagModel.instance.getItemByBagIdUid(BagId.xianyu, item[ItemFields.uid])) {
                return;
            }
            this.addItem(item);
        }

        private removeItemHandler(uid: number): void {
            if (!uid) return;
            let index: int = -1;
            let count: number = -1;
            for (let i: int = 0, len = this._items.length; i < len; i++) {
                if (this._items[i][ItemFields.uid] === uid) {
                    count = this._items[i][ItemFields.count];
                    index = i;
                    break;
                }
            }
            let flag: boolean = index === this._items.length - 1;
            if (index >= 0 && count === 0) {
                this._items.splice(index, 1);
                this._itemType.splice(index, 1);
            }
            // let itemId:number = item[ItemFields.ItemId];
            // let itemType: int = CommonUtil.getItemTypeById(itemId);
            // if (itemType === ItemMType.Equip) {
            //     let part:int = CommonUtil.getPartById(itemId);
            //     if(this._partArr[part]){
            //         this._partArr[part] = null;
            //     }
            // }
            flag && this.check();
        }

        // 添加道具
        public addItem(item: Protocols.Item): void {
            if (!item) return;
            let bagId = CommonUtil.getBagIdById(item[ItemFields.uid]);
            if (bagId == BagId.xunbao) return;
            if (bagId == BagId.xianyu) return;

            let itemId: number = item[ItemFields.ItemId];
            let itemType: int = CommonUtil.getItemTypeById(itemId);
            // 装备先跟身上装备比较
            if (itemType === ItemMType.Equip) {
                let part: int = CommonUtil.getPartById(itemId);
                if (this._partArr[part]) {        // 如果数组里面已经有此部位的装备，判断是否需要加入
                    let flag: boolean = false;
                    if (item[ItemFields.iMsg][IMsgFields.baseScore] > this._partArr[part][ItemFields.iMsg][IMsgFields.baseScore]) {
                        let itemCfg: item_equip = CommonUtil.getItemCfgById(itemId) as item_equip;
                        // 觉醒、等级
                        if (itemCfg[item_equipFields.era] <= PlayerModel.instance.eraLevel && PlayerModel.instance.level >= itemCfg[item_equipFields.wearLvl]) {
                            flag = true;
                        }
                    }
                    if (flag) {
                        let index: int = this._items.indexOf(this._partArr[part]);
                        if (index !== -1) {
                            this._items.splice(index, 1);
                            this._itemType.splice(index, 1);
                        }
                    } else {
                        return;
                    }
                }
                if (!CommonUtil.checkEquip(item)) {
                    return;
                }
                this._partArr[part] = item;
                // 如果
            } else if (itemType === ItemMType.Consume || itemType === ItemMType.Giftbag) {
                // 判断是否可使用
                let itemCfg: item_material = CommonUtil.getItemCfgById(item[ItemFields.ItemId]) as item_material;
                // let vipLv:int =
                if (!itemCfg[item_materialFields.shortcutUse] || PlayerModel.instance.level < itemCfg[item_materialFields.useLvl]) {
                    return;
                }
                let index: int = -1;
                for (let i: int = 0, len = this._items.length; i < len; i++) {
                    if (this._items[i][ItemFields.uid] === item[ItemFields.uid]) {
                        index = i;
                        break;
                    }
                }
                if (index >= 0) {
                    if (index === this._items.length - 1) this.check();
                    return;
                }
            }
            else if (itemType === ItemMType.Material) {
                let shuju = QuickUseHuanHuaModel.instance.screeningHuanHua(item);
                if (!shuju[0]) {
                    return;
                }
                let index: int = -1;
                for (let i: int = 0, len = this._items.length; i < len; i++) {
                    if (this._items[i][ItemFields.ItemId] === item[ItemFields.ItemId]) {
                        index = i;
                        break;
                    }
                }
                if (index >= 0) {
                    if (index === this._items.length - 1) this.check();
                    return;
                }
            }
            else {
                return;
            }
            this._items.push(item);
            this._itemType.push(1);
            this.check();
        }

        public addShenQiItem(_itemId: number) {
            let itemId: number = _itemId;
            let itemType: int = CommonUtil.getItemTypeById(itemId);
            let index: int = -1;
            for (let i: int = 0, len = this._items.length; i < len; i++) {
                if (this._items[i][ItemFields.ItemId] === itemId) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                if (index === this._items.length - 1) this.check();
                return;
            }
            this._items.push([itemId, 1, 0, null]);
            this._itemType.push(2);
            this.check();
        }
        public removeShenQiItemHandler(_itemId: number): void {
            if (!_itemId) return;
            let index: int = -1;
            let count: number = -1;
            for (let i: int = 0, len = this._items.length; i < len; i++) {
                if (this._items[i][ItemFields.ItemId] === _itemId) {
                    count = this._items[i][ItemFields.count];
                    index = i;
                    break;
                }
            }
            let flag: boolean = index === this._items.length - 1;
            if (index >= 0 && count === 0) {
                this._items.splice(index, 1);
                this._itemType.splice(index, 1);
            }
            if (flag) {
                this.popItem();
                this.check();
            }
            // flag && this.check();
        }

        /**
         * 删除所有神器的
         */
        public removeShenQiItem() {
            for (let i: int = 0, len = this._items.length; i < len; i++) {
                if (this._items[i] && this._itemType[i]) {
                    if (this._itemType[i] == 2) {
                        if (this._items) {
                            this._items.splice(i, 1);
                        }
                        if (this._items) {
                            this._itemType.splice(i, 1);
                        }
                        this.removeShenQiItem();
                    }
                }
            }
        }
        // 删除一个（使用或者关闭面板）
        public useOne(): void {
            if (!this._panel) return;
            // 使用后更新
            if (this._panel.parent) this._panel.close();
            this.popItem();

            // 延迟检测（服务器先脱了装备，然后更新背包（如果此时检测会有BUG），然后再穿装备）
            // Laya.timer.once(500, this, ():void=>{
            this.check();
            // });
        }

        private popItem(): void {
            let item: Item = this._items.pop();
            this._itemType.pop();
            // if(!item) return;
            // let itemId:number = item[ItemFields.ItemId];
            // let itemType: int = CommonUtil.getItemTypeById(itemId);
            // if (itemType === ItemMType.Equip) {
            //     let part:int = CommonUtil.getPartById(itemId);
            //     if(this._partArr[part]){
            //         this._partArr[part] = null;
            //     }
            // }
        }

        // 检查，如果面板已经是打开的，直接刷数据，如果是关闭则缓动
        private check(): void {
            if (this._items.length === 0) {
                if (this._panel && this._panel.parent) {
                    this._panel.close();
                }
                return;
            }
            let lastItem: Protocols.Item = this._items[this._items.length - 1];
            let typrNum = this._itemType[this._items.length - 1];
            if (typrNum == 1) {
                // 如果背包中没有这个道具，跳过
                if (!BagModel.instance.getItemByIdUid(lastItem[ItemFields.ItemId], lastItem[ItemFields.uid])) {
                    this.popItem();
                    this.check();
                    return;
                }
                // 如果是装备，重新判断
                if (CommonUtil.getItemTypeById(lastItem[ItemFields.ItemId]) === ItemMType.Equip) {
                    let shuju = BlendCfg.instance.getCfgById(10009);
                    let maxlv = 1;//装备快捷使用最大等级
                    if (shuju) {
                        maxlv = shuju[blendFields.intParam][0];//
                    }
                    if (PlayerModel.instance.level >= maxlv) {
                        if (!CommonUtil.checkEquip(lastItem)) {
                            this.popItem();
                            this.check();
                        }
                    } else {
                        return;
                    }
                }
            }

            if (this._panel && this._panel.parent) {
                this._panel.setItem(lastItem);
            } else {
                if (!this._panel) {
                    Laya.loader.load("res/atlas/quick_use.atlas", Handler.create(this, (): void => {
                        this._panel = this._panel || new QuickUsePanel();
                        this._panel.setItem(lastItem);
                        LayerManager.instance.addToNoticeLayer(this._panel);
                        // 缓动
                        this._panel.bottom = -304;
                        TweenJS.create(this._panel).to({ bottom: 200 }, 150).start();
                    }));
                } else {
                    this._panel.setItem(lastItem);
                    LayerManager.instance.addToNoticeLayer(this._panel);
                    // 缓动
                    this._panel.bottom = -304;
                    TweenJS.create(this._panel).to({ bottom: 200 }, 150).start();
                }
            }
        }

        //转盘类延迟入包
        public delayedPutInBag(): void {
            for (let i: int = 0, len: int = this._delayedItems.length; i < len; i++) {
                let item: Item = this._delayedItems[i][0];
                let itemSource: number = this._delayedItems[i][1];
                this.addItemHandler(item, itemSource, true);
            }
            this._delayedItems.length = 0;
        }
    }
}
