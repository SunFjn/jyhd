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
    export class StoreXianFuPanel extends ui.StoreXianFuViewUI {
        constructor() {
            super();
        }
        protected _tab: BtnGroup;
        private _list: CustomList;
        private _btnArr: Array<Button>;
        private _panels: WindowEnum[];
        protected _mallType: number;
        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._list = new CustomList();
            this._list.hCount = 2;
            this._list.itemRender = StoreXianFuItem;
            this._list.width = 708;
            this._list.height = 806;
            this._list.spaceY = 5;
            this._list.spaceX = 2;
            this._list.x = 10;
            this._list.y = 122;
            this.addChild(this._list);
            this.mallType = MallType.mall_2;
            this._tab = new BtnGroup();
            this._tab.setBtns(this.btn_1, this.btn_2, this.btn_3, this.btn_4, this.btn_5, this.btn_6, this.btn_7, this.btn_8, this.btn_9, this.btn_10);
            this._btnArr = [this.btn_1, this.btn_2, this.btn_3, this.btn_4, this.btn_5, this.btn_6, this.btn_7, this.btn_8, this.btn_9, this.btn_10];

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

        protected selectStore(): void {
            let index: number = this._tab.selectedIndex;
            let panelId: number = this._panels[index];
            WindowManager.instance.open(panelId);
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this._tab, Event.CHANGE, this, this.selectStore);
            this.addAutoListener(this.updateBtn, Event.CLICK, this, this.updateBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.STORE_XIANFU_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_MONEY, this, this.setHuobi);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_UPDATE, this, this.setHuobi);
            this._tab.selectedIndex = 2;
        }
        protected removeListeners(): void {
            super.removeListeners();
        }

        protected onOpened(): void {
            super.onOpened();

            for (let i = 0; i < this._btnArr.length; i++) {
                let cfgs = StoreCfg.instance.getTypeStoreCfgByChildType(this._mallType, i + 1);
                if (cfgs.length > 0) {
                    this._btnArr[i].visible = true;
                    this._btnArr[i].label = cfgs[0][mallFields.childMallName];
                } else {
                    this._btnArr[i].visible = false;
                }
            }
            if (this._mallType == MallType.mall_2) {
                this._btnArr[2].visible = true;
                this._btnArr[2].label = `家园商店`;
                // this._btnArr[3].visible = true;
                // this._btnArr[3].label = `战队商店`;
            }

            if (StoreModel.instance.updateVlaue) {
                // this.huoBiImg.skin = CommonUtil.getIconById(StoreModel.instance.updateVlaue[0]);
                this.moneyText.text = `${StoreModel.instance.updateVlaue[1]}`;
            }
            this.setHuobi();
            StoreCtrl.instance.GetYuGeInfo();
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

            this.fuguiTxt.text = `粮食值:${num1}`;
            this.currencyTxt.text = `代币券:${num2}`;

            let w = this.fuguiImg.width + this.fuguiTxt.width + 10 + this.currencyImg.width + this.currencyTxt.width + 65;
            let posX = this.width - w;
            this.fuguiImg.x = posX;
            this.fuguiTxt.x = this.fuguiImg.x + this.fuguiImg.width;
            this.currencyImg.x = this.fuguiTxt.x + this.fuguiTxt.textWidth + 10;
            this.currencyTxt.x = this.currencyImg.x + this.currencyImg.width;
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
        }
        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._tab) {
                this._tab.destroy();
                this._tab = null;
            }
            if (this._btnArr) {
                for (let e of this._btnArr) {
                    e.destroy();
                    e.removeSelf();
                }
                this._btnArr = null;
            }
            super.destroy(destroyChild);
        }
    }
}