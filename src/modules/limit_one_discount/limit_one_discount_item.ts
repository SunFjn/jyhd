namespace modules.limit_one_discount {
    import Items = Configuration.Items;
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import ItemsFields = Configuration.ItemsFields;
    import mall = Configuration.mall;
    import mallFields = Configuration.mallFields;
    import BagModel = modules.bag.BagModel;
    import BagUtil = modules.bag.BagUtil;
    import StoreModel = modules.store.StoreModel;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import idCountFields = Configuration.idCountFields;
    import MallNode = Protocols.MallNode;
    import BuyMallItemReplyFields = Protocols.BuyMallItemReplyFields;
    import MallNodeFields = Protocols.MallNodeFields;

    export class LimitOneDiscountItem extends ui.LimitOneDiscountItemUI {
        private _limitCount: number = 0;
        private _nowCount: number = 0;
        private _id: number = 0;

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.buyBtn, Laya.Event.CLICK, this, this.buyBtnHandler);
            GlobalData.dispatcher.on(CommonEventType.PURCHASE_REPLY, this, this.puchaseReplys);
        }

        protected setData(value: mall): void {
            super.setData(value);
            // 道具属性
            let id: number = value[mallFields.itemId];
            let uid: number = value[mallFields.id];
            let itemData: item_material = ItemMaterialCfg.instance.getItemCfgById(id);

            // 折扣
            this.discountImg.skin = `limit_one_discount/image_${value[mallFields.desId]}z.png`;

            this.goodNameTxt.text = itemData[item_materialFields.name];
            this.item.dataSource = [id, value[mallFields.count], 0, null];
            // 价钱
            this.oldPriceTxt.text = value[mallFields.originalPrice][idCountFields.count].toString();
            this.nowPriceTxt.text = value[mallFields.realityPrice][idCountFields.count].toString();

            // 消耗资产图标
            let skinOrig: string = CommonUtil.getAssetsIconByItemID(value[mallFields.originalPrice][idCountFields.id], true);
            let skinReal: string = CommonUtil.getAssetsIconByItemID(value[mallFields.realityPrice][idCountFields.id], true);

            this.consumeImg.skin = skinOrig;
            this.realConsumeImg.skin = skinReal;


            // 限购(都是每日限購,只取值即可)
            let limit = StoreModel.instance.getLimitById(uid);
            let alreadyBuy: number = 0;
            if (limit != null) {
                alreadyBuy = limit[MallNodeFields.limitCount];
            }

            // 属性赋值
            this._nowCount = alreadyBuy;
            this._id = uid;
            this._limitCount = value[mallFields.limitBuy][1];

            this.limitTxt.text = `${alreadyBuy}/${this._limitCount}`;
            if (alreadyBuy >= value[mallFields.limitBuy][1]) {
                this.limitTxt.color = "#6e361c";
                this.buyBtn.disabled = true;
            } else {
                this.limitTxt.color = "#0c8e00";
                this.buyBtn.disabled = false;
            }
        }

        // 购买-判断是否能买
        private buyBtnHandler(): void {
            let shortCut = this._data[mallFields.shortcut];
            let nprice = this._data[mallFields.realityPrice];
            let costId = nprice[idCountFields.id];

            /*if(this._nowCount>=this._limitCount&&this._nowCount!=0){
                SystemNoticeManager.instance.addNotice(limitBuy[idCountFields.id] == 2?"本周购买数量已达上限":"今日购买数量已达上限", true);
                return ;
            }*/
            let num = PlayerModel.instance.getCurrencyById(costId);
            if (num == null) {
                num = BagModel.instance.getItemCountById(costId);
            }
            if (num >= nprice[idCountFields.count]) {
                if (shortCut == 0) {
                    let count = this._limitCount - this._nowCount;//剩余可购买数
                    WindowManager.instance.openDialog(WindowEnum.STORE_ALERT, [this._data, count]);
                } else {
                    Channel.instance.publish(UserFeatureOpcode.BuyMallItem, [this._data[mallFields.id], 1]);
                }
            } else {

                if (costId == MoneyItemId.glod) {
                    CommonUtil.goldNotEnoughAlert();
                } else {
                    BagUtil.openLackPropAlert(costId, 1);
                }
            }
        }

        private puchaseReplys() {
            let reply = StoreModel.instance.PurchaseReply;
            let id = reply[BuyMallItemReplyFields.id];
            let limitData = reply[BuyMallItemReplyFields.limitCount];
            if (id == this._id) {
                let limit: MallNode = [id, limitData];
                this._nowCount = limit[MallNodeFields.limitCount];
                this.limitTxt.text = this._nowCount + "/" + this._limitCount;

                try {
                    if (this._nowCount >= this._limitCount) {
                        this.limitTxt.color = "#6e361c";
                        this.buyBtn.disabled = true;
                    } else {
                        this.limitTxt.color = "#0c8e00";
                        this.buyBtn.disabled = false;
                    }
                } catch (error) {
                    console.log("??????????laji,laya!!!!!!!!!!");
                }
            }
        }


        public close(): void {
            super.close();
        }
    }
}
