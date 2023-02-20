///<reference path="../config/store_cfg.ts"/>
///<reference path="./store_base_panel.ts"/>


/** 常用商城面板*/
namespace modules.store {

    import CommonUtil = modules.common.CommonUtil;
    import StoreBasePanel = modules.store.StoreBasePanel;

    export class UsualStorePanel extends StoreBasePanel {

        private _selectType: string;

        protected initialize() {
            super.initialize();

            this.mallType = MallType.mall_1;

            this.currencyImg.skin = `assets/icon/item/1_s.png`;
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            if(!value)return;
            this._selectType = value as string;
        }

        protected onOpened(): void {
            super.onOpened();

            this.judgeSkinType();
        }

        private judgeSkinType(): void {
            if (this._selectType == `stoneSkin`) {
                let datas: Array<Configuration.mall> = this._list.datas;
                let index: number = 0;
                for (let i: int = 0, len: int = datas.length; i < len; i++) {
                    let id: number = datas[i][Configuration.mallFields.itemId];
                    if (config.StoneCfg.instance.getCfgById(id)) {
                        index = i;
                        break;
                    }
                }
                this._list.scrollToIndex(index);
            }
        }

        protected addListeners(): void {
            super.addListeners();

            this._tab.selectedIndex = 1;
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_MONEY, this, this.updateMoney);
        }

        // 更新货币
        protected updateMoney(): void {
            this.currencyTxt.text = `代币券:${CommonUtil.bigNumToString(PlayerModel.instance.ingot)}`;
        }
    }
}