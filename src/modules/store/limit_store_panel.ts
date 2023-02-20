///<reference path="../config/store_cfg.ts"/>
namespace modules.store {

    import CommonUtil = modules.common.CommonUtil;

    export class LimitStorePanel extends StoreBasePanel {

        protected initialize() {
            super.initialize();

            this.mallType = MallType.mall_1;
            this.currencyImg.skin = `assets/icon/item/1_s.png`;
        }

        protected addListeners(): void {
            super.addListeners();
            this._tab.selectedIndex = 0;
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_MONEY, this, this.updateMoney);
        }

        // 更新货币
        protected updateMoney(): void {
            this.currencyTxt.text = `代币券:${CommonUtil.bigNumToString(PlayerModel.instance.ingot)}`;
        }
    }
}