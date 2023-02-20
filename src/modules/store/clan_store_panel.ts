///<reference path="../config/store_cfg.ts"/>
///<reference path="../clan/clan_model.ts"/>
//战队商店
namespace modules.store {
    import CommonUtil = modules.common.CommonUtil;
    import ClanModel = modules.clan.ClanModel;

    export class ClanStorePanel extends StoreBasePanel {

        protected initialize() {
            super.initialize();

            this.mallType = MallType.mall_2;
            this.currencyImg.skin = `assets/icon/item/35_s.png`;
        }

        protected addListeners(): void {
            super.addListeners();
            this._tab.selectedIndex = 3;

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_CLAN_COIN, this, this.updateMoney);
        }

        // 更新货币
        protected updateMoney(): void {
            let num: number = PlayerModel.instance.clanCoin;
            this.currencyTxt.text = `战队币:${CommonUtil.bigNumToString(num)}`;
        }
    }
}