///<reference path="../config/store_cfg.ts"/>
namespace modules.store {
    import CommonUtil = modules.common.CommonUtil;

    export class HonorStorePanel extends StoreBasePanel {

        protected initialize() {
            super.initialize();

            this.mallType = MallType.mall_2;
            this.currencyImg.skin = `assets/icon/item/23_s.png`;
        }

        protected addListeners(): void {
            super.addListeners();
            this._tab.selectedIndex = 1;

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_HONOR, this, this.updateMoney);
        }

        // 更新货币
        protected updateMoney(): void {
            this.currencyTxt.text = `荣誉值:${CommonUtil.bigNumToString(PlayerModel.instance.tiantiHonor)}`;//boss精华
        }
    }
}