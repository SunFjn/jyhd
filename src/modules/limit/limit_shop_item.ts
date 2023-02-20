/////<reference path="../fish_mall_cfg_cfg.ts"/>
/** 消费赠礼 */
namespace modules.limit {

    import fish_mall_cfg = Configuration.limit_mall_cfg;
    import ItemsFields = Configuration.ItemsFields;
    import fish_mall_cfgFields = Configuration.limit_mall_cfgFields;
    import limitBuyField = Configuration.limitBuyField;
    import item_materialFields = Configuration.item_materialFields;
    import Item = Protocols.Item;
    import LayaEvent = modules.common.LayaEvent;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import PackageCfg = modules.config.PackageCfg;
    import packageFields = Configuration.packageFields;
    import weightItemFields = Configuration.weightItemFields;
    import amountParam = ui.amountParam;
    import amountParamFields = ui.amountParamFields;
    import BlendCfg = modules.config.BlendCfg;
    import BagModel = modules.bag.BagModel;

    export class LimitShopItem extends ui.LimitShopItemUI {
        private _cfg: fish_mall_cfg;
        private getState: number = 0;
        private _itemId: number;
        private buy_max: number;
        private _price_id: number;
        private _price_count: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected get bigtype(): LimitBigType {
            return LimitBigType.fish;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.CONSUME_REWARD_UPDATE, this, this.updateView);
        }

        public onOpened(): void {
            super.onOpened();
            this.updateView();
        }

        private updateView(): void {
            //更新面板状态 和消费赠礼事件绑定
        }

        private itemCfg: any;
        protected setData(value: any): void {
            this.itemCfg = value;
            // console.log('vtz:value', value);
            this._itemId = this.itemCfg[fish_mall_cfgFields.itemId];
            let count = this.itemCfg[fish_mall_cfgFields.count];
            let desId = this.itemCfg[fish_mall_cfgFields.desId] - 1;

            for (let i = 0; i < this.zheBox._childs.length; i++) {
                this.zheBox._childs[i].visible = desId == i ? true : false;
            }




            this.priceOldImg.skin = CommonUtil.getIconById(this.itemCfg[fish_mall_cfgFields.originalPrice][ItemsFields.itemId]);
            this.priceOldText.text = String(this.itemCfg[fish_mall_cfgFields.originalPrice][ItemsFields.count]);
            this.priceImg.skin = CommonUtil.getIconById(this.itemCfg[fish_mall_cfgFields.realityPrice][ItemsFields.itemId]);
            this.priceText.text = String(this.itemCfg[fish_mall_cfgFields.realityPrice][ItemsFields.count]);

            this._price_id = this.itemCfg[fish_mall_cfgFields.realityPrice][ItemsFields.itemId];
            this._price_count = this.itemCfg[fish_mall_cfgFields.realityPrice][ItemsFields.count];

            this.delLineImg.width = this.priceOldImg.width + this.priceOldText.width;

            // limitBuy
            let limitBuy = this.itemCfg[fish_mall_cfgFields.limitBuy];
            //判断数量
            let id = this.itemCfg[fish_mall_cfgFields.id];
            let _limitCount = limitBuy[limitBuyField.count];
            let counted = LimitShopModel.instance.getListinfo(id);
            // console.log('vtz:counted',counted);
            this.buy_max = _limitCount - counted;
            if (this.buy_max < 1) { this.buy_max = 0; }
            if (limitBuy[limitBuyField.type] > 0) {
                if (limitBuy[limitBuyField.type] == 2) {
                    this.limitTxt.text = "本周限购：";
                } else {
                    this.limitTxt.text = "每日限购：";
                }

                this.limitBox.visible = true;
                if (counted != null) {
                    this.limitCount.text = counted + "/" + _limitCount;
                    if (counted >= _limitCount) {
                        this.limitCount.color = "#E6372E";
                        this.sureBtn.visible = false;
                        this.receivedImg.visible = true;

                    } else {
                        this.limitCount.color = "#46B069";
                        this.receivedImg.visible = false;
                    }
                } else {
                    this.limitCount.text = 0 + "/" + limitBuy[limitBuyField.count];
                    this.limitCount.color = "#46B069";
                    this.receivedImg.visible = false;
                }
            } else {
                this.limitBox.visible = false;
            }

            let item: Item = [this._itemId, count, 0, null];
            let propCfg: Configuration.item_material = ItemMaterialCfg.instance.getItemCfgById(this._itemId);
            if (!propCfg[item_materialFields.fixGiftbag].length) {
                //材料
                this.giftImg.skin = "fish/boximg.png"
                this.giftText.text = '限时折扣'

                for (let i = 0; i < this.itemBox._childs.length; i++) {
                    this.itemBox._childs[i].visible = false;
                }

                this.itemBox._childs[0].visible = true;
                this.itemBox._childs[0].dataSource = [this._itemId, this.itemCfg[fish_mall_cfgFields.count]];


            } else {
                //宝箱
                this.giftImg.skin = CommonUtil.getIconById(this._itemId);
                this.giftText.text = CommonUtil.getNameByItemId(this._itemId);
                let pack_age = PackageCfg.instance.getCfgById(propCfg[item_materialFields.fixGiftbag][0]);

                let item_arr = pack_age[packageFields.items];
                for (let i = 0; i < this.itemBox._childs.length; i++) {
                    this.itemBox._childs[i].visible = false;
                }
                for (let i = 0; i < item_arr.length && i < 2; i++) {
                    // console.log('vtz:item_arr',item_arr);
                    this.itemBox._childs[i].visible = true;
                    this.itemBox._childs[i].dataSource = [item_arr[i][weightItemFields.itemId], item_arr[i][weightItemFields.count]];
                }
            }


        }

        private get fid(): number {
            switch (this.bigtype) {
                case LimitBigType.fish:
                    return 4
                case LimitBigType.year:
                    return 3
            }
        }

        private sureBtnHandler(): void {
            if (!this.buy_max) { return; }

            // 判断本钱够不够
            if (CommonUtil.getItemNum(this.itemCfg[fish_mall_cfgFields.realityPrice][ItemsFields.itemId]) < this.itemCfg[fish_mall_cfgFields.realityPrice][ItemsFields.count]) {
                return CommonUtil.goldNotEnoughAlert();
            }

            if (this.itemCfg[fish_mall_cfgFields.shortcut]) {
                LimitShopCtrl.instance.getReap(this.bigtype, this.itemCfg[fish_mall_cfgFields.id], 1);
                return;
            }
            // 可以兑换
            let _send_param = new Array<any>() as amountParam;
            
            console.log('打印', this.itemCfg);
            // console.log('vtz:_send_param', _send_param);
            _send_param[amountParamFields.titText] = "购买";
            _send_param[amountParamFields.max] = this.buy_max;
            _send_param[amountParamFields.buyid] = this.itemCfg[fish_mall_cfgFields.id];
            _send_param[amountParamFields.id] = this._itemId;
            _send_param[amountParamFields.count] = 1;
            _send_param[amountParamFields.price] = [this._price_id, this._price_count];
            _send_param[amountParamFields.fid] = this.fid;
            console.log("🚀 ~ file: limit_shop_item.ts:186 ~ LimitShopItem ~ sureBtnHandler ~ _send_param", _send_param)
            
            WindowManager.instance.openDialog(WindowEnum.COMMON_AMOUNT_ALERT, _send_param);

        }

        public close(): void {
            super.close();
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
    }
}