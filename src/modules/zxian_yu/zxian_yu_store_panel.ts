///<reference path="../config/treasure_cfg.ts"/>
/// <reference path="../config/yu_ge_cfg.ts" />
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
    import yuGeCfg = modules.config.yuGeCfg;
    import CustomList = modules.common.CustomList;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import Pair = Protocols.Pair;
    import PairFields = Protocols.PairFields;
    export class ZXianYuStorePanel extends ui.ZXianYuStoreViewUI {
        constructor() {
            super();
        }
        private _list: CustomList;
        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._list = new CustomList();
            this._list.hCount = 3;
            this._list.itemRender = ZXianYuStoreItem;
            this._list.width = 620;
            this._list.height = 569;
            this._list.spaceY = 32;
            this._list.spaceX = 6;
            this._list.x = 67;
            this._list.y = 390;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.updateBtn, Event.CLICK, this, this.updateBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZXIANYU_YUGE_UPDATE, this, this.showUI);
        }
        protected removeListeners(): void {
            super.removeListeners();
        }

        protected onOpened(): void {
            super.onOpened();
            if (ZXianYuModel.instance.updateVlaue) {
                // this.huoBiImg.skin = CommonUtil.getIconById(ZXianYuModel.instance.updateVlaue[0]);
                this.moneyText.text = `${ZXianYuModel.instance.updateVlaue[1]}`;
            }

            ZXianYuCtrl.instance.GetYuGeInfo();
        }
        /**
         * sortDate
         */
        public sortDate(A: Pair, B: Pair) {
            let idA = A[0];
            let idB = B[0];
            let stateA = A[1];
            let stateB = B[1];
            if (stateA > stateB) {
                return 1;
            }
            else {
                return -1;
            }
        }
        public showUI() {
            let shuju = ZXianYuModel.instance.idList;
            shuju.sort(this.sortDate)
            this._list.datas = shuju;
            Laya.timer.clear(this, this.activityHandler);

            this.setActivitiTime();
        }
        private setActivitiTime(): void {
            Laya.timer.clear(this, this.activityHandler);
            let isOpen = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.xianYu);
            if (ZXianYuModel.instance.f5Time >= GlobalData.serverTime &&
                isOpen) {
                this.timeUpdateText.visible = true;
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.timeUpdateText.visible = false;
            }
        }
        private activityHandler(): void {
            this.timeUpdateText.text = `${CommonUtil.timeStampToHHMMSS(ZXianYuModel.instance.f5Time)}后自动刷新`;
            if (ZXianYuModel.instance.f5Time < GlobalData.serverTime) {
                this.timeUpdateText.visible = false;
                Laya.timer.clear(this, this.activityHandler);
            }
        }
        public updateBtnHandler() {
            let money = ZXianYuModel.instance.updateVlaue[1];
            if (modules.player.PlayerModel.instance.ingot >= money) {
                ZXianYuCtrl.instance.F5YuGe();
            }
            else {
                CommonUtil.goldNotEnoughAlert();
            }
        }
        public close(): void {
            Laya.timer.clear(this, this.activityHandler);
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }
    }
}