///<reference path="../config/store_cfg.ts"/>
///<reference path="./store_base_panel.ts"/>

namespace modules.store {

    import CommonUtil = modules.common.CommonUtil;
    import StoreBasePanel = modules.store.StoreBasePanel;

    export class GoldStorePanel extends StoreBasePanel {


        protected initialize() {
            super.initialize();

            this.mallType = MallType.mall_1;

            this.currencyImg.skin = `assets/icon/item/1_s.png`;
        }

        protected addListeners(): void {
            super.addListeners();

            this._tab.selectedIndex = 2;
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_MONEY, this, this.updateMoney);
        }

        // 更新货币
        protected updateMoney(): void {
            this.currencyTxt.text = `代币券:${CommonUtil.bigNumToString(PlayerModel.instance.ingot)}`;
        }
    }
}