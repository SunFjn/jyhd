///<reference path="../config/store_cfg.ts"/>
//姻缘商店
namespace modules.store {
    import CommonUtil = modules.common.CommonUtil;

    export class XianYuanStorePanel extends StoreBasePanel {

        protected initialize() {
            super.initialize();

            this.mallType = MallType.mall_2;
            this.currencyImg.skin = `assets/icon/item/7_s.png`; //姻缘货币待替换
        }

        protected addListeners(): void {
            super.addListeners();
            this._tab.selectedIndex = 4;

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_XIANYUAN_COIN, this, this.updateMoney);
        }

        // 更新货币
        protected updateMoney(): void {
            // let num: number = ClanModel.instance.clanCoin[0];
            this.currencyTxt.text = `姻缘货币:${CommonUtil.bigNumToString(99999)}`;
        }
    }
}