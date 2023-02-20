namespace modules.year {
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import limit_xunbao_exchange_cfgFields = Configuration.limit_xunbao_exchange_cfgFields;
    import limit_xunbao_exchange_cfg = Configuration.limit_xunbao_exchange_cfg;
    import idCountFields = Configuration.idCountFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import TreasureModel = modules.treasure.TreasureModel;
    import BagModel = modules.bag.BagModel;
    import FishCKCtrl = modules.fish.FishCKCtrl;
    import FishCKModel = modules.fish.FishCKModel;

    export class YearDjItem extends ui.YearDhItemUI {
        private _id: number;
        constructor() {
            super();
        }
        protected get bigtype(): LimitBigType {
            return LimitBigType.year;
        }
        protected initialize(): void {
            super.initialize();
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.cashBtn, Laya.Event.CLICK, this, this.cashBtnHandler);
            this.addAutoListener(this.selectBtn, Laya.Event.CLICK, this, this.selectBtnHandler);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.FISH_CK_UPDATE, this, this.refreshRemain);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FISH_CK_HINT_UPDATE, this, this.updateHint);
        }
        protected removeListeners(): void {
            super.removeListeners();
        }
        protected get prize(): ItemId {
            return 15650004;
        }
        protected setData(value: limit_xunbao_exchange_cfg): void {
            super.setData(value);
            // 道具属性
            let id: number = value[limit_xunbao_exchange_cfgFields.exchangeItem][idCountFields.id];
            let count: number = value[limit_xunbao_exchange_cfgFields.exchangeItem][idCountFields.count];
            let itemData: item_material = ItemMaterialCfg.instance.getItemCfgById(id);

            this._id = value[limit_xunbao_exchange_cfgFields.id];

            // 消耗的兑换道具
            let haveCount = BagModel.instance.getItemCountById(this.prize);
            let needCount = value[limit_xunbao_exchange_cfgFields.condition][idCountFields.count];
            this.oldPriceTxt.color = haveCount < needCount ? "#ffffff" : "#ffffff";

            this.consumeImg.skin = CommonUtil.getIconById(this.prize, true);
            this.oldPriceTxt.text = needCount.toString();
            this.goodNameTxt.text = itemData[item_materialFields.name];


            // 兑换得到的道具
            this.item.dataSource = [id, count, 0, null];
            let alreadyExchange = FishCKModel.instance.buyedCount(this.bigtype)[this._id];
            let limitCount = value[limit_xunbao_exchange_cfgFields.limitBuy][idCountFields.count];

            // 兑换限制
            this.limitTxt.text = `${alreadyExchange}/${limitCount}`;
            if (alreadyExchange >= limitCount) {
                this.cashBtn.disabled = true;
                this.limitTxt.color = "#6e361c";
            }

            // 是否勾选了提示
            let hintList: Array<number> = FishCKModel.instance.getHintList(this.bigtype);
            if (hintList.indexOf(this._id) != -1) {
                this.selectedImg.visible = true;
            } else {
                this.selectedImg.visible = false;
            }
        }

        // 兑换奖励
        private cashBtnHandler() {
            let uid: number = this._data[limit_xunbao_exchange_cfgFields.id];
            FishCKCtrl.instance.cashRequest(this.bigtype, uid, 1);
        }

        // 刷新数据
        private refreshRemain() {
            let id_count = TreasureModel.instance.getXunBaoExchangeData();
            let alreadyExchange: number = id_count[1];
            let id: number = id_count[0];
            let cur_id: number = this._data[limit_xunbao_exchange_cfgFields.id];

            if (cur_id == id) {
                // 兑换限制
                this.limitTxt.text = `${alreadyExchange}/${this._data[limit_xunbao_exchange_cfgFields.limitBuy][idCountFields.count]}`;

                // 达到了最大限制
                if (alreadyExchange >= this._data[limit_xunbao_exchange_cfgFields.limitBuy][idCountFields.count]) {
                    this.cashBtn.disabled = true;
                    this.limitTxt.color = "#6e361c";
                }
            }

        }

        // 兑换提醒
        private selectBtnHandler() {
            let newStatus = !this.selectedImg.visible;
            this.selectedImg.visible = newStatus;

            let hintList: Array<number> = FishCKModel.instance.getHintList(this.bigtype);

            if (hintList.indexOf(this._id) != -1) {
                hintList.splice(hintList.indexOf(this._id), 1);
                FishCKCtrl.instance.DhHint(this.bigtype, hintList, this.bigtype);
            } else {
                hintList.push(this._id);
                FishCKCtrl.instance.DhHint(this.bigtype, hintList, this.bigtype);
            }
        }

        // 更新 兑换提醒
        private updateHint() {
            let hintList: Array<number> = FishCKModel.instance.getHintList(this.bigtype);
            this.selectedImg.visible = hintList.indexOf(this._id) != -1;
        }

        public close(): void {
            super.close();
        }
    }
}
