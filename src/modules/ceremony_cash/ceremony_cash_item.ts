namespace modules.ceremony_cash {
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import ItemsFields = Configuration.ItemsFields;
    import mall = Configuration.mall;
    import mallFields = Configuration.mallFields;
    import BaseItem = modules.bag.BaseItem;
    import xunbao_exchangeFields = Configuration.xunbao_exchangeFields;
    import xunbao_exchange = Configuration.xunbao_exchange;
    import idCountFields = Configuration.idCountFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import TreasureModel = modules.treasure.TreasureModel;
    import BagModel = modules.bag.BagModel;

    export class CeremonyCashItem extends ui.CeremonyCashItemUI {
        private _id: number;
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.cashBtn, Laya.Event.CLICK, this, this.cashBtnHandler);
            this.addAutoListener(this.selectBtn, Laya.Event.CLICK, this, this.selectBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XUNBAO_EXCHANGE_REPLY2, this, this.refreshRemain);
        }
        protected removeListeners(): void {
            super.removeListeners();
        }
        protected setData(value: xunbao_exchange): void {
            super.setData(value);
            // 道具属性
            let id: number = value[xunbao_exchangeFields.exchangeItem][idCountFields.id];
            let count: number = value[xunbao_exchangeFields.exchangeItem][idCountFields.count];
            let itemData: item_material = ItemMaterialCfg.instance.getItemCfgById(id);

            this._id = value[xunbao_exchangeFields.id];

            // 消耗的兑换道具
            let haveCount = BagModel.instance.getItemCountById(15650002);
            let needCount = value[xunbao_exchangeFields.condition][idCountFields.count];
            this.oldPriceTxt.color = haveCount < needCount ? "#ffffff" : "#ffffff";

            // this.consumeImg.skin = CommonUtil.getAssetsIconByItemID(value[xunbao_exchangeFields.condition][idCountFields.id]);
            this.oldPriceTxt.text = needCount.toString();
            this.goodNameTxt.text = itemData[item_materialFields.name];


            // 兑换得到的道具
            this.item.dataSource = [id, count, 0, null];
            let alreadyExchange = value[xunbao_exchangeFields.alreadyCash];
            let limitCount = value[xunbao_exchangeFields.limitBuy][idCountFields.count];

            // 兑换限制
            this.limitTxt.text = `${alreadyExchange}/${limitCount}`;
            if (alreadyExchange >= limitCount) {
                this.cashBtn.disabled = true;
                this.limitTxt.color = "#6e361c";
            }

            // 是否勾选了提示
            let hintList: Array<number> = TreasureModel.instance.getHintList(6);
            if (hintList.indexOf(this._id) != -1) {
                this.selectedImg.visible = true;
            } else {
                this.selectedImg.visible = false;
            }
        }

        // 兑换奖励
        private cashBtnHandler() {
            let uid: number = this._data[xunbao_exchangeFields.id];
            CeremonyCashCtrl.instance.cashRequest(uid);
        }

        // 刷新数据
        private refreshRemain() {
            let id_count = TreasureModel.instance.getXunBaoExchangeData();
            let alreadyExchange: number = id_count[1];
            let id: number = id_count[0];
            let cur_id: number = this._data[xunbao_exchangeFields.id];

            if (cur_id == id) {
                // 兑换限制
                this.limitTxt.text = `${alreadyExchange}/${this._data[xunbao_exchangeFields.limitBuy][idCountFields.count]}`;

                // 达到了最大限制
                if (alreadyExchange >= this._data[xunbao_exchangeFields.limitBuy][idCountFields.count]) {
                    this.cashBtn.disabled = true;
                    this.limitTxt.color = "#6e361c";
                }
            }

        }

        // 兑换提醒
        private selectBtnHandler() {
            let newStatus = !this.selectedImg.visible;
            this.selectedImg.visible = newStatus;

            let hintList: Array<number> = TreasureModel.instance.getHintList(6);
            if (hintList.indexOf(this._id) != -1) {
                hintList.splice(hintList.indexOf(this._id), 1);
                Channel.instance.publish(UserFeatureOpcode.XunBaoExchangeHint, [6, hintList]);
            } else {
                hintList.push(this._id);
                Channel.instance.publish(UserFeatureOpcode.XunBaoExchangeHint, [6, hintList]);
            }
        }


        public close(): void {
            super.close();
        }
    }
}
