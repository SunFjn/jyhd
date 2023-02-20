///<reference path="../config/store_cfg.ts"/>
///<reference path="./store_base_panel.ts"/>

namespace modules.store {

    import CommonUtil = modules.common.CommonUtil;
    import StoreBasePanel = modules.store.StoreBasePanel;

    export class ShengyinStorePanel extends StoreBasePanel {

        protected initialize() {
            super.initialize();

            this.mallType = MallType.mall_3;
            this.currencyImg.skin = `assets/icon/item/10056_s.png`;
        }

        protected addListeners(): void {
            super.addListeners();

            this._tab.selectedIndex = 1;

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateMoney);
        }

        // 更新货币
        protected updateMoney(): void {
            let num: number = bag.BagModel.instance.getItemCountById(13050002);
            this.currencyTxt.text = `雷米之星:${CommonUtil.bigNumToString(num)}`;
        }
    }
}