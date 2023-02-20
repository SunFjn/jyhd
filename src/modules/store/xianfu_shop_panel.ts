///<reference path="../config/treasure_cfg.ts"/>
/// <reference path="../config/xianfu_mall2_cfg.ts" />
namespace modules.store {
    import Event = laya.events.Event;
    import List = laya.ui.List;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import BagModel = modules.bag.BagModel;
    import ItemFields = Protocols.ItemFields;
    import Item = Protocols.Item;
    import BagUtil = modules.bag.BagUtil;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import XianFuMallCfg = modules.config.XianFuMallCfg;
    import xianfu_mall2 = Configuration.xianfu_mall2;
    import xianfu_mall2Fields = Configuration.xianfu_mall2Fields;
    import CustomList = modules.common.CustomList;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import GlobalData = modules.common.GlobalData;
    import CommonEventType = modules.common.CommonEventType;
    import BtnGroup = modules.common.BtnGroup;
    import StoreCfg = modules.config.StoreCfg;
    import BuyMallItemReplyFields = Protocols.BuyMallItemReplyFields;
    import Button = laya.ui.Button;
    import CommonUtil = modules.common.CommonUtil;
    import mall = Configuration.mall;
    import mallFields = Configuration.mallFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import Pair = Protocols.Pair;
    import PairFields = Protocols.PairFields;
    export class XinaFuShopPanel extends ui.XianFuShopUI {
        constructor() {
            super();
        }
        private _list: CustomList;
        private _panels: WindowEnum[];
        protected _mallType: number;
        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._list = new CustomList();
            this._list.hCount = 3;
            this._list.itemRender = XianFuShopItem;
            this._list.width = 720;
            this._list.height = 600;
            this._list.spaceY = 5;
            this._list.spaceX = 2;
            this._list.x = 35;
            this._list.y = 420;
            this.addChild(this._list);
            this.mallType = MallType.mall_2;

        }
        protected set mallType(type: number) {
            this._mallType = type;
            if (type == MallType.mall_1) {
                this._panels = [
                    WindowEnum.LIMIT_STORE_PANEL,
                    WindowEnum.USUAL_STORE_PANEL,
                    WindowEnum.GOLD_STORE_PANEL,
                    // WindowEnum.VIP_STORE_PANEL,
                ];
            } else if (type == MallType.mall_2) {
                this._panels = [
                    WindowEnum.BOSS_STORE_PANEL,
                    WindowEnum.HONOR_STORE_PANEL,
                    WindowEnum.STORE_XIAN_FU_PANEL,
                    WindowEnum.CLAN_STORE_PANEL,
                    WindowEnum.XIANYUAN_STORE_PANEL,
                ];
            } else {
                this._panels = [
                    WindowEnum.SHENHUN_STORE_PANEL,
                    WindowEnum.SHENGYIN_STORE_PANEL,
                ];
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.updateBtn, Event.CLICK, this, this.updateBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.STORE_XIANFU_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_MONEY, this, this.setHuobi);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_UPDATE, this, this.setHuobi);
        }
        protected removeListeners(): void {
            super.removeListeners();
        }

        protected onOpened(): void {
            super.onOpened();

            if (StoreModel.instance.updateVlaue) {
                // this.huoBiImg.skin = CommonUtil.getIconById(StoreModel.instance.updateVlaue[0]);
                this.moneyText.text = `${StoreModel.instance.updateVlaue[1]}`;
            }
            this.setHuobi();
            StoreCtrl.instance.GetYuGeInfo();

            GlobalData.dispatcher.event(CommonEventType.XIANFU_SHOP_OPEN, [true]);

        }
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
            let shuju = StoreModel.instance.idList;
            shuju.sort(this.sortDate)
            this._list.datas = shuju;
            Laya.timer.clear(this, this.activityHandler);

            this.setActivitiTime();
            this.setHuobi();
        }
        /**
         * setHuobi
         */
        public setHuobi() {
            let num1 = CommonUtil.bigNumToString(modules.xianfu.XianfuModel.instance.treasureInfos(1));
            let num2 = CommonUtil.bigNumToString(modules.player.PlayerModel.instance.ingot);

            this.fuguiTxt.text = `${num1}`;
            this.currencyTxt.text = `${num2}`;

            let w = this.fuguiImg.width + this.fuguiTxt.width + 10 + this.currencyImg.width + this.currencyTxt.width + 65;
            let posX = this.width - w;
            // this.fuguiImg.x = posX;
            // this.fuguiTxt.x = this.fuguiImg.x + this.fuguiImg.width;
            // this.currencyImg.x = this.fuguiTxt.x + this.fuguiTxt.textWidth + 10;
            // this.currencyTxt.x = this.currencyImg.x + this.currencyImg.width;
        }
        private setActivitiTime(): void {
            Laya.timer.clear(this, this.activityHandler);
            let isOpen = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.xianYu);
            if (StoreModel.instance.f5Time >= GlobalData.serverTime &&
                isOpen) {
                this.timeUpdateText.visible = true;
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.timeUpdateText.visible = false;
            }
        }
        private activityHandler(): void {
            this.timeUpdateText.text = `${CommonUtil.timeStampToHHMMSS(StoreModel.instance.f5Time)}后自动刷新`;
            if (StoreModel.instance.f5Time < GlobalData.serverTime) {
                this.timeUpdateText.visible = false;
                Laya.timer.clear(this, this.activityHandler);
            }
        }
        public updateBtnHandler() {
            let money = StoreModel.instance.updateVlaue[1];
            if (modules.player.PlayerModel.instance.ingot >= money) {
                StoreCtrl.instance.F5YuGe();
            }
            else {
                CommonUtil.goldNotEnoughAlert();
            }
        }
        public close(): void {
            Laya.timer.clear(this, this.activityHandler);
            super.close();
            GlobalData.dispatcher.event(CommonEventType.XIANFU_SHOP_OPEN, [false]);
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