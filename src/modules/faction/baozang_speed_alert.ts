/////<reference path="../$.ts"/>
/** 宝藏加速弹框 */
namespace modules.faction {
    import BaozangSpeedAlertUI = ui.BaozangSpeedAlertUI;
    import BaseItem = modules.bag.BaseItem;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import BtnGroup = modules.common.BtnGroup;
    import BagModel = modules.bag.BagModel;
    import BagUtil = modules.bag.BagUtil;
    import FactionBox = Protocols.FactionBox;
    import FactionBoxFields = Protocols.FactionBoxFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class BaozangSpeedAlert extends BaozangSpeedAlertUI {

        private _items: Array<BaseItem>;
        private _btnGroup: BtnGroup;
        private _boxId: string;
        private _time: number;

        protected initialize(): void {
            super.initialize();

            this._items = [];
            let speedIds: number[] = ItemMaterialCfg.instance.speedItemIds;
            //筛选出所有加速卡
            for (let i: int = 0, len: int = speedIds.length; i < len; i++) {
                let item: BaseItem = new BaseItem();
                this.addChild(item);
                this._items.push(item);
                item.needTip = false;
                item.nameVisible = true;
                item.y = 180;
            }
            CommonUtil.autoFitBySumWidth(661, 100, this._items);

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(...this._items);

            this._time = 0;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
            this.addAutoListener(this._btnGroup, common.LayaEvent.CHANGE, this, this.itemHandler);
            this.addAutoListener(GlobalData.dispatcher, common.CommonEventType.BAG_UPDATE, this, this.updateCounts);
            this.addAutoListener(GlobalData.dispatcher, common.CommonEventType.BAOZANG_LIST_UPDATE, this, this.updateInfo);

            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();

            Laya.timer.clear(this, this.loopHandler);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

            this._boxId = value;
        }

        public onOpened(): void {
            super.onOpened();

            this._btnGroup.selectedIndex = this.searchOne();

            this.updateCounts();
            this.updateInfo();
        }

        private loopHandler(): void {
            if (this._time <= GlobalData.serverTime) {
                SystemNoticeManager.instance.addNotice(`宝藏已开启完毕,可领取奖励`, true);
                this.close();
                return;
            } else {
                this.txt.text = CommonUtil.timeStampToHHMMSS(this._time);
            }
        }

        private updateCounts(): void {
            for (let i: int = 0, len: int = this._items.length; i < len; i++) {
                let id: number = ItemMaterialCfg.instance.speedItemIds[i];
                let count: number = BagModel.instance.getItemCountById(id);
                this._items[i].dataSource = [id, count, 0, null];
                if (!count) {
                    this._items[i]._numTxt.visible = true;
                    this._items[i]._numTxt.color = `#ff3e3e`;
                } else {
                    this._items[i]._numTxt.color = `#ffffff`;
                }
            }
        }

        private updateInfo(): void {
            let info: FactionBox;
            let list: Array<FactionBox> = FactionModel.instance.mineBoxList;
            for (let e of list) {
                if (e[FactionBoxFields.id] == this._boxId) {
                    info = e;
                    break;
                }
            }
            if (!info) {  //说明是我帮助的那个宝箱
                info = FactionModel.instance.tempBox;
            }
            this._time = info[FactionBoxFields.time];
            this.loopHandler();
        }

        private searchOne(): number {
            for (let i: int = 0, len: int = this._items.length; i < len; i++) {
                let id: number = ItemMaterialCfg.instance.speedItemIds[i];
                let count: number = BagModel.instance.getItemCountById(id);
                if (count > 0) {
                    return i;
                }
            }
            return -1;
        }

        private btnHandler(): void {
            let selectIndex: number = this._btnGroup.selectedIndex;
            if (selectIndex == -1) {
                SystemNoticeManager.instance.addNotice(`请先选择加速卡`);
            } else {
                let itemId: number = ItemMaterialCfg.instance.speedItemIds[selectIndex];
                let count: int = CommonUtil.getPropCountById(itemId);
                if (count > 0) {
                    FactionCtrl.instance.addSpeedBox(this._boxId, itemId);  //加速卡                           
                } else {
                    BagUtil.openLackPropAlert(itemId, 1);
                }
            }
        }

        private itemHandler(): void {
            let index: number = this._btnGroup.selectedIndex;
            let oldBtn: BaseItem = <BaseItem>this._btnGroup.oldSelectedBtn;
            let btn: BaseItem = <BaseItem>this._btnGroup.selectedBtn;
            if (index == -1) {
                if (oldBtn) {
                    oldBtn.frameImg.visible = false;
                }
                if (btn) {
                    btn.frameImg.visible = false;
                }
            } else {
                if (oldBtn) {
                    oldBtn.frameImg.visible = false;
                }
                if (btn) {
                    btn.frameImg.visible = true;
                }
            }
        }

        public destroy(): void {
            this._items = this.destroyElement(this._items);
            this._btnGroup = this.destroyElement(this._btnGroup);
            super.destroy();
        }
    }
}
