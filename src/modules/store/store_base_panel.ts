///<reference path="../config/store_cfg.ts"/> 


/** 商城父类面板*/
namespace modules.store {
    import GlobalData = modules.common.GlobalData;
    import CommonEventType = modules.common.CommonEventType;
    import BtnGroup = modules.common.BtnGroup;
    import CustomList = modules.common.CustomList;
    import StoreCfg = modules.config.StoreCfg;
    import BuyMallItemReplyFields = Protocols.BuyMallItemReplyFields;
    import Button = laya.ui.Button;
    import CommonUtil = modules.common.CommonUtil;
    import mall = Configuration.mall;
    import mallFields = Configuration.mallFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class StoreBasePanel extends ui.StoreViewUI {
        protected _tab: BtnGroup;
        protected _list: CustomList;
        protected _mallType: number;
        private _btnArr: Array<Button>;
        private _panels: WindowEnum[];

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._tab = this.destroyElement(this._tab);
            this._btnArr = this.destroyElement(this._btnArr);

            if (this._panels) {
                this._panels.length = 0;
                this._panels = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize() {
            super.initialize();

            this.centerY = this.centerX = 0;

            this._tab = new BtnGroup();
            this._tab.setBtns(this.btn_1, this.btn_2, this.btn_3, this.btn_4, this.btn_5, this.btn_6, this.btn_7, this.btn_8, this.btn_9, this.btn_10);
            this._btnArr = [this.btn_1, this.btn_2, this.btn_3, this.btn_4, this.btn_5, this.btn_6, this.btn_7, this.btn_8, this.btn_9, this.btn_10];

            this._list = new CustomList();
            this._list.hCount = 2;
            this._list.itemRender = StoreItem;
            this._list.width = 708;
            this._list.height = 806;
            this._list.spaceY = 5;
            this._list.spaceX = 2;
            this._list.x = 10;
            this._list.y = 122;
            this.addChild(this._list);
        }

        protected set mallType(type: number) {
            this._mallType = type;
            if (type == MallType.mall_1) {
                this._panels = [
                    WindowEnum.LIMIT_STORE_PANEL,
                    WindowEnum.USUAL_STORE_PANEL,
                    WindowEnum.GOLD_STORE_PANEL,
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

        // button的皮肤设置
        private setToggleSkin(tog: Laya.Button, index: number): void {
            let val = (720 - 200) / this._panels.length;
            switch (this._mallType) {
                case MallType.mall_1:
                case MallType.mall_3:
                    tog.skin = `store/image_mall${this._mallType}_${index}.png`;
                    tog.size(112, 132.5);
                    tog.y = 1029;
                    tog.x = val * (index + 1) - 112 / 2;
                    tog.label = "";
                    break;
                default:
                    tog.skin = `common/btn_tongyong_1.png`;
                    tog.size(142, 59);
                    break;
            }
        }

        protected selectStore(): void {
            let index: number = this._tab.selectedIndex;
            let panelId: number = this._panels[index];
            WindowManager.instance.open(panelId);
        }

        protected onOpened(): void {
            super.onOpened();
            WindowManager.instance.close(WindowEnum.LIMIT_PACK_ALERT);     //关闭限时礼包窗口

            for (let i = 0; i < this._btnArr.length; i++) {
                let cfgs = StoreCfg.instance.getTypeStoreCfgByChildType(this._mallType, i + 1);
                if (cfgs.length > 0) {
                    this._btnArr[i].visible = true;
                    this._btnArr[i].label = cfgs[0][mallFields.childMallName];
                    this.setToggleSkin(this._btnArr[i], i);
                } else {
                    this._btnArr[i].visible = false;
                }
            }
            if (this._mallType == MallType.mall_2) {
                this._btnArr[2].visible = true;
                this._btnArr[2].label = `家园商店`;
            }

            if (this._mallType == MallType.mall_1) {
                let bolll = StoreModel.instance.getmall_1RP();
                this.xianShiTeHui.visible = bolll;
            }

            this.showUI();
        }

        public showUI() {
            let malls = StoreCfg.instance.getTypeStoreCfgByChildType(this._mallType, this._tab.selectedIndex + 1);
            //二次筛选 通过成就等级
            let _dates = new Array<mall>();
            for (let index = 0; index < malls.length; index++) {
                let element = malls[index];
                if (element) {
                    let xWConditions = element[mallFields.eraCondition];
                    if (xWConditions) {
                        if (xWConditions.length > 0) {
                            let minLv = xWConditions[0];//最小成就等级
                            let maxLv = xWConditions[1];//最大成就等级
                            let lev = modules.born.BornModel.instance.lv;
                            if (lev >= minLv && lev <= maxLv) {
                                _dates.push(element);
                            }
                        }
                        else {
                            _dates.push(element);
                        }
                    }
                    else {
                        _dates.push(element);
                    }
                }
            }
            _dates = _dates.sort(StoreModel.instance.sortFunc.bind(this));

            // console.log("商城参数：" + _dates);

            this._list.datas = _dates;
            this.updateMoney();
        }
        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._tab, common.LayaEvent.CHANGE, this, this.selectStore);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PURCHASE_REPLY, this, this.puchaseReply);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BORN_UPDATE, this, this.showUI);//成就更新需要更新商城
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_MALLINFO, this, this.showUI);//成就更新需要更新商城


            // RedPointCtrl.instance.registeRedPoint(this.xianShiTeHui, ["shangchengRP"]);
        }
        protected removeListeners(): void {
            super.removeListeners();
            // RedPointCtrl.instance.retireRedPoint(this.xianShiTeHui);
        }
        // 更新货币
        protected updateMoney(): void {

        }

        private puchaseReply() {
            let result = StoreModel.instance.PurchaseReply[BuyMallItemReplyFields.result];
            if (result != 0) {
                CommonUtil.noticeError(result);
            } else {
                WindowManager.instance.close(WindowEnum.STORE_ALERT);
            }
            if (this._mallType == MallType.mall_1) {
                let bolll = StoreModel.instance.getmall_1RP();
                this.xianShiTeHui.visible = bolll;
            }
        }
    }
}