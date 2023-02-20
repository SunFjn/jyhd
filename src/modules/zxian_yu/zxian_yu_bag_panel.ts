///<reference path="../config/treasure_cfg.ts"/>
/**探索背包面板*/



namespace modules.zxian_yu {
    import Event = laya.events.Event;
    import List = laya.ui.List;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import BagModel = modules.bag.BagModel;
    import ItemFields = Protocols.ItemFields;
    import Item = Protocols.Item;
    import BagUtil = modules.bag.BagUtil;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CommonUtil = modules.common.CommonUtil;
    import BtnGroup = modules.common.BtnGroup;

    export class ZXianYuBagPanel extends ui.ZXianYuBagViewUI {
        private _bagList: List;
        private _showIds: Array<any>;
        private _btnGroup: BtnGroup;

        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._bagList = new List();
            this._bagList.vScrollBarSkin = "";
            this._bagList.itemRender = ZXianYuBagItem;
            this._bagList.repeatX = 5;
            this._bagList.spaceX = 20;
            this._bagList.spaceY = 20;
            this._bagList.width = 620;
            this._bagList.height = 714;
            this._bagList.x = 27;
            this.itemPanel.addChild(this._bagList);
            this._bagList.selectEnable = true;
            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.qiFuBtn, this.cangKuBtn);
            // this.regGuideSpr(GuideSpriteId.TREASURE_BAG_ALL_TAKE_BTN, this.getAllBtn);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.getBtn, Event.CLICK, this, this.getBtnHandler);
            this.addAutoListener(this.getAllBtn, Event.CLICK, this, this.getAllBtnHandler);
            this.addAutoListener(this._btnGroup, Event.CHANGE, this, this.btnGroupHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZXIANYU_REPLY, this, this.updateBag);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZXIANYU_ALL_REPLY, this, this.updateBag);
            modules.redPoint.RedPointCtrl.instance.registeRedPoint(this.qiFuRpImg, ["zxianYuTreasurePanelRP"]);
            modules.redPoint.RedPointCtrl.instance.registeRedPoint(this.cangKuImg, ["zxianYuBagPanelRP"]);
        }
        protected removeListeners(): void {
            super.removeListeners();
            modules.redPoint.RedPointCtrl.instance.retireRedPoint(this.qiFuRpImg);
            modules.redPoint.RedPointCtrl.instance.retireRedPoint(this.cangKuImg);
        }

        protected onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 1;
            this.updateBag();
        }
        private btnGroupHandler(): void {
            if (this._btnGroup.selectedIndex === 0) {
                WindowManager.instance.open(WindowEnum.ZXIANYU_TREASURE_PANEL);
                this._btnGroup.selectedIndex = 1;
            } else if (this._btnGroup.selectedIndex === 1) {

            }
        }
        //更新背包
        private updateBag(): void {
            this._showIds = this.genGrids();
            if (this._showIds) {
                this._bagList.array = this._showIds;
                ZXianYuModel.instance.selectItem.length = 0;
            }

        }

        private genGrids(): Array<Protocols.Item> {
            if (BagModel.instance.getItemsByBagId(BagId.xianyu)) {
                let items: Array<Protocols.Item> = BagModel.instance.getItemsByBagId(BagId.xianyu).concat();
                items = items.sort(this.sortFunc.bind(this));
                if (items.length < 100) {
                    items = items.concat(new Array<Protocols.Item>(100 - items.length));
                }
                return items;
            }
            return [];
        }

        private sortFunc(a: Item, b: Item): number {
            let aItemId: number = a[ItemFields.ItemId];
            let bItemId: number = b[ItemFields.ItemId];
            let aQuality: number = CommonUtil.getItemQualityById(aItemId);
            let bQuality: number = CommonUtil.getItemQualityById(bItemId);
            if (aQuality > bQuality) {
                return -1;
            } else if (aQuality < bQuality) {
                return 1;
            } else {
                if (aItemId > bItemId) {
                    return -1;
                } else if (aItemId < bItemId) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }

        //取出
        private getBtnHandler(): void {
            let Items: Array<Item> = ZXianYuModel.instance.selectItem;
            let isEnough = BagUtil.canAddItemsByBagIdCount(Items);
            let arr = new Array<number>();
            for (let i = 0; i < Items.length; i++) {
                arr.push(Items[i][ItemFields.uid]);
            }
            if (isEnough == true) {
                if (arr.length > 0) {
                    Channel.instance.publish(UserFeatureOpcode.TaskXianYuXunbaoBagItemList, [arr])
                } else {

                    SystemNoticeManager.instance.addNotice("当前无选中道具", true);

                }
            }
        }

        //全部取出
        private getAllBtnHandler(): void {
            let Items: Array<Item> = BagModel.instance.getItemsByBagId(BagId.xianyu);
            let isEnough = BagUtil.canAddItemsByBagIdCount(Items);
            if (isEnough == true) {
                if (Items) {
                    if (Items.length > 0) {
                        Channel.instance.publish(UserFeatureOpcode.TaskXianYuXunbaoBagAllItem, null);
                    } else {
                        SystemNoticeManager.instance.addNotice("当前仓库无可取出的道具", true);
                    }
                } else {
                    SystemNoticeManager.instance.addNotice("当前仓库无可取出的道具", true);
                }
            }

        }
        private TipsHandler(): void {
            CommonUtil.alertHelp(20005);
        }

        public close(): void {
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            if (this._bagList) {
                this._bagList.removeSelf();
                this._bagList.destroy();
                this._bagList = null;
            }
            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }
            super.destroy(destroyChild);
        }
    }
}