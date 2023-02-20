namespace modules.fish {
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import limit_xunbao_exchange_cfgFields = Configuration.limit_xunbao_exchange_cfgFields;
    import limit_xunbao_exchange_cfg = Configuration.limit_xunbao_exchange_cfg;
    import limit_xunbao_exchange_cfg_buyField = Configuration.limit_xunbao_exchange_cfg_buyField;
    import limit_xunbao_exchange_cfg_Item = Configuration.limit_xunbao_exchange_cfg_Item;
    import limit_xunbao_exchange_cfg_ItemField = Configuration.limit_xunbao_exchange_cfg_ItemField;

    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import TreasureModel = modules.treasure.TreasureModel;
    import BagModel = modules.bag.BagModel;
    import amountParam = ui.amountParam;
    import amountParamFields = ui.amountParamFields;

    export class FishCKItem extends ui.FishCKItemUI {
        private _id: number;
        private xe_value: limit_xunbao_exchange_cfg;
        constructor() {
            super();
        }
        protected get bigtype(): LimitBigType {
            return LimitBigType.fish;
        }
        protected get prizeItemId(): ItemId {
            return 16750001;
        }
        protected initialize(): void {
            super.initialize();
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.cashBtn, Laya.Event.CLICK, this, this.cashBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FISH_CK_UPDATE, this, this.refreshRemain);
        }
        protected removeListeners(): void {
            super.removeListeners();
        }
        protected setData(value: limit_xunbao_exchange_cfg): void {
            super.setData(value);
            this.xe_value = value;
            // 道具属性
            let id: number = value[limit_xunbao_exchange_cfgFields.exchangeItem][limit_xunbao_exchange_cfg_ItemField.id];
            let count: number = value[limit_xunbao_exchange_cfgFields.exchangeItem][limit_xunbao_exchange_cfg_ItemField.count];
            let itemData: item_material = ItemMaterialCfg.instance.getItemCfgById(id);

            this._id = value[limit_xunbao_exchange_cfgFields.id];

            // 消耗的兑换道具
            let haveCount: number = BagModel.instance.getItemCountById(this._data[limit_xunbao_exchange_cfgFields.condition][limit_xunbao_exchange_cfg_buyField.type]);
            let needCount: number = value[limit_xunbao_exchange_cfgFields.condition][limit_xunbao_exchange_cfg_buyField.count];
            this.oldPriceTxt.color = haveCount < needCount ? "#e6361c" : "#71789F";

            this.priceImg.skin = CommonUtil.getIconById(this.prizeItemId, true);
            this.oldPriceTxt.text = needCount.toString();
            this.goodNameTxt.fontSize = 14;
            this.goodNameTxt.text = itemData[item_materialFields.name];


            // 兑换得到的道具
            this.item.dataSource = [id, count, 0, null];
            let alreadyExchange = FishCKModel.instance.buyedCount(this.bigtype)[value[limit_xunbao_exchange_cfgFields.id]];
            let limitCount = value[limit_xunbao_exchange_cfgFields.limitBuy][limit_xunbao_exchange_cfg_buyField.count];

            // let count: number = BagModel.instance.getItemCountById(15650002);
            // 兑换限制
            this.limitTxt.text = `${alreadyExchange}/${limitCount}`;
            if (alreadyExchange >= limitCount) {
                this.cashBtn.disabled = true;
                this.limitTxt.color = "#e6361c";
                this.cashBtn.visible = false;
            } else {
                this.cashBtn.disabled = false;
                this.limitTxt.color = "#5BCB65";
                this.cashBtn.visible = true;
            }

            // 是否勾选了提示
            let hintList: Array<number> = TreasureModel.instance.getHintList(this.bigtype);
            // if (hintList.indexOf(this._id) != -1) {
            //     this.selectedImg.visible = true;
            // } else {
            //     this.selectedImg.visible = false;
            // }
        }

        // 兑换奖励
        private cashBtnHandler() {

            let shortCut = this._data[limit_xunbao_exchange_cfgFields.shortcut];
            let id: number = this._data[limit_xunbao_exchange_cfgFields.id];
            // 判断钱带没带够没有做完
            if (BagModel.instance.getItemCountById(this._data[limit_xunbao_exchange_cfgFields.condition][limit_xunbao_exchange_cfg_buyField.type]) < this._data[limit_xunbao_exchange_cfgFields.condition][limit_xunbao_exchange_cfg_buyField.count]) {
                // console.log('vtz:兑换所需物不足');
                return modules.notice.SystemNoticeManager.instance.addNotice("兑换所需物不足", true);
            }
            if (shortCut) {
                // console.log('vtz:shortCut',shortCut);
                return FishCKCtrl.instance.cashRequest(this.bigtype, id, 1);
            }

            // 0弹 后端设计的// 可购数量
            let count = this._data[limit_xunbao_exchange_cfgFields.limitBuy][limit_xunbao_exchange_cfg_buyField.count] - FishCKModel.instance.buyedCount[id];
            if (this._data[limit_xunbao_exchange_cfgFields.limitBuy][limit_xunbao_exchange_cfg_buyField.type] > 0) {
                if (count <= 0) {
                    return modules.notice.SystemNoticeManager.instance.addNotice("兑换次数不足", true);
                }
            } else {
                // 无限量
                count = 0;
            }
            // 可以兑换
            let _send_param = new Array<any>() as amountParam;
            _send_param[amountParamFields.titText] = "兑换";
            _send_param[amountParamFields.max] = count;
            _send_param[amountParamFields.buyid] = id;
            _send_param[amountParamFields.id] = this._data[limit_xunbao_exchange_cfgFields.exchangeItem][limit_xunbao_exchange_cfg_ItemField.id];
            _send_param[amountParamFields.count] = this._data[limit_xunbao_exchange_cfgFields.exchangeItem][limit_xunbao_exchange_cfg_ItemField.count];
            _send_param[amountParamFields.price] = this._data[limit_xunbao_exchange_cfgFields.condition];
            _send_param[amountParamFields.fid] = 2;
            console.log("🚀 ~ file: fish_ck_item.ts:124 ~ FishCKItem ~ cashBtnHandler ~ _send_param", _send_param)
            WindowManager.instance.openDialog(WindowEnum.COMMON_AMOUNT_ALERT, _send_param);
        }

        // 刷新数据
        private refreshRemain() {
            let id_count = TreasureModel.instance.getXunBaoExchangeData();
            let alreadyExchange: number = id_count[1];
            let id: number = id_count[0];
            let cur_id: number = this._data[limit_xunbao_exchange_cfgFields.id];

            if (cur_id == id) {
                // 兑换限制
                this.limitTxt.text = `${alreadyExchange}/${this._data[limit_xunbao_exchange_cfgFields.limitBuy][limit_xunbao_exchange_cfg_buyField.count]}`;

                // 达到了最大限制
                if (alreadyExchange >= this._data[limit_xunbao_exchange_cfgFields.limitBuy][limit_xunbao_exchange_cfg_buyField.count]) {
                    this.cashBtn.disabled = true;
                    this.limitTxt.color = "#e6361c";
                }
            }

        }

        // 兑换提醒
        private selectBtnHandler() {
            // let newStatus = !this.selectedImg.visible;
            // this.selectedImg.visible = newStatus;
            let hintList: Array<number> = TreasureModel.instance.getHintList(this.bigtype);
            if (hintList.indexOf(this._id) != -1) {
                hintList.splice(hintList.indexOf(this._id), 1);
                Channel.instance.publish(UserFeatureOpcode.XunBaoExchangeHint, [this.bigtype, hintList]);
            } else {
                hintList.push(this._id);
                Channel.instance.publish(UserFeatureOpcode.XunBaoExchangeHint, [this.bigtype, hintList]);
            }
        }

        public close(): void {
            super.close();
        }
    }
}
