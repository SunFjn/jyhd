///<reference path="../config/treasure_cfg.ts"/>
/**探索背包面板*/



namespace modules.treasure {
    import Event = laya.events.Event;
    import List = laya.ui.List;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import BagModel = modules.bag.BagModel;
    import ItemFields = Protocols.ItemFields;
    import Item = Protocols.Item;
    import BagUtil = modules.bag.BagUtil;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CommonUtil = modules.common.CommonUtil;

    export class TreasureBagPanel extends ui.TreasureViewUI {
        private _bagList: List;
        private _showIds: Array<any>;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._bagList) {
                this._bagList.removeSelf();
                this._bagList.destroy();
                this._bagList = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;

         this.findBox.visible = false;

            this._bagList = new List();
            this._bagList.vScrollBarSkin = "";
            this._bagList.itemRender = TreasureItem;
            this._bagList.repeatX = 5;
            this._bagList.spaceX = 20;
            this._bagList.spaceY = 20;
            this._bagList.width = 620;
            this._bagList.height = 850;
            this._bagList.x = 27;
            this.itemPanel.addChild(this._bagList);
            this._bagList.selectEnable = true;

            this.regGuideSpr(GuideSpriteId.TREASURE_BAG_ALL_TAKE_BTN, this.getAllBtn);
        }

        //更新背包
        private updateBag(): void {
            this._showIds = this.genGrids();
            this._bagList.array = this._showIds;
            TreasureModel.instance.selectItem.length = 0;
        }

        private genGrids(): Array<Protocols.Item> {
            let items: Array<Protocols.Item> = BagModel.instance.getItemsByBagId(BagId.xunbao).concat();
            items = items.sort(this.sortFunc.bind(this));
            if (items.length < 100) {
                items = items.concat(new Array<Protocols.Item>(100 - items.length));
            }
            return items;
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
            let Items: Array<Item> = TreasureModel.instance.selectItem;
            let isEnough = BagUtil.canAddItemsByBagIdCount(Items);
            let arr = new Array<number>();
            for (let i = 0; i < Items.length; i++) {
                arr.push(Items[i][ItemFields.uid]);
            }
            if (isEnough == true) {
                if (arr.length > 0) {
                    Channel.instance.publish(UserFeatureOpcode.TaskXunbaoBagItemList, [arr])
                } else {

                    SystemNoticeManager.instance.addNotice("当前无选中道具", true);

                }
            }
        }

        //全部取出
        private getAllBtnHandler(): void {
            let Items: Array<Item> = BagModel.instance.getItemsByBagId(BagId.xunbao);
            let isEnough = BagUtil.canAddItemsByBagIdCount(Items);
            if (isEnough == true) {
                if (Items) {
                    if (Items.length > 0) {
                        Channel.instance.publish(UserFeatureOpcode.TaskXunbaoBagAllItem, null);
                    } else {
                        SystemNoticeManager.instance.addNotice("当前仓库无可取出的道具", true);
                    }
                } else {
                    SystemNoticeManager.instance.addNotice("当前仓库无可取出的道具", true);
                }
            }

        }

        private taskXunbaoList(): void {
            let result = TreasureModel.instance.taskXunbao;
            if (result != 0) {
                CommonUtil.noticeError(result);
            } else {
                this.updateBag()
            }
        }

        private taskXunbaoAll(): void {
            let result = TreasureModel.instance.taskAllXunbao;
            if (result != 0) {
                CommonUtil.noticeError(result);
            } else {
                this.updateBag();
            }
        }

        private TipsHandler(): void {
            CommonUtil.alertHelp(20005);
        }

        protected addListeners(): void {
            super.addListeners();


            this.getBtn.on(Event.CLICK, this, this.getBtnHandler);
            this.getAllBtn.on(Event.CLICK, this, this.getAllBtnHandler);
            this.tipsBtn.on(Event.CLICK, this, this.TipsHandler);

            GlobalData.dispatcher.on(CommonEventType.TASK_XUNBAO_LIST_REPLY, this, this.taskXunbaoList);
            GlobalData.dispatcher.on(CommonEventType.TASK_XUNBAO_ALL_REPLY, this, this.taskXunbaoAll);

        }

        protected removeListeners(): void {
            super.removeListeners();

            this.getBtn.off(Event.CLICK, this, this.getBtnHandler);
            this.getAllBtn.off(Event.CLICK, this, this.getAllBtnHandler);
            this.tipsBtn.off(Event.CLICK, this, this.TipsHandler);

            GlobalData.dispatcher.off(CommonEventType.TASK_XUNBAO_LIST_REPLY, this, this.taskXunbaoList);
            GlobalData.dispatcher.off(CommonEventType.TASK_XUNBAO_ALL_REPLY, this, this.taskXunbaoAll);

        }

        protected onOpened(): void {
            super.onOpened();
            this.updateBag();
        }

        public close(): void {
            super.close();
        }
    }
}