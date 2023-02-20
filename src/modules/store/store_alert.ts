namespace modules.store {

    import Event = laya.events.Event;
    import mall = Configuration.mall;
    import mallFields = Configuration.mallFields;
    import idCountFields = Configuration.idCountFields;
    import PlayerModel = modules.player.PlayerModel;
    import NumInputCtrl = modules.common.NumInputCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import BagModel = modules.bag.BagModel;
    import CommonUtil = modules.common.CommonUtil;

    export class StoreAlert extends ui.StoreAlertUI {
        constructor() {
            super();
        }

        private _itemCfg: mall;
        private _maxNum: number;
        private _price: Array<any>;
        private _input: NumInputCtrl;

        protected initialize(): void {
            super.initialize();
            this._price = new Array<any>();
            this._input = new NumInputCtrl(this.numInput, this.addBtn, this.reduceBtn, this.addTenBtn, this.reduceTenBtn);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._itemCfg = value[0];
            let limitCount = value[1] as number;

            let id = this._itemCfg[mallFields.itemId];
            let count = this._itemCfg[mallFields.count];
            this._price = this._itemCfg[mallFields.realityPrice];
            this.baseItem.dataSource = [id, count, 0, null];
            this.itemName.text = this.baseItem._nameTxt.text;
            let itemType: number = CommonUtil.getItemTypeById(this._price[idCountFields.id]);
            if (itemType == ItemMType.Unreal) {
                this.totalPriceImg.skin = this.priceImg.skin = CommonUtil.getIconById(this._price[idCountFields.id], true);
            } else {
                this.totalPriceImg.skin = this.priceImg.skin = CommonUtil.getIconById(this._price[idCountFields.id], false);
            }
            this.priceTxt.text = this._price[idCountFields.count].toString();
            let costId = this._price[idCountFields.id];
            let num = PlayerModel.instance.getCurrencyById(costId);
            if (num == null) {
                num = BagModel.instance.getItemCountById(costId);
            }
            this._maxNum = Math.floor(num / this._price[idCountFields.count]);
            if (this._maxNum > limitCount && limitCount != 0) {
                this._input.max = limitCount;
            } else {
                this._input.max = this._maxNum;
            }
            this._input.min = 1;
            this._input.notice = "购买数量";
            this._input.value = 1;
            this.totalPriceTxt.text = (this._input.value * this._price[idCountFields.count]).toString();
        }

        private puchaseHandler() {
            let id = this._itemCfg[mallFields.id];
            let num = this._input.value;
            if (num == 0) {
                //处理探索界面 抽奖次数不足必定弹窗的情况 提示货币不足 
                CommonUtil.goldNotEnoughAlert();
                this.close();
            } else {
                Channel.instance.publish(UserFeatureOpcode.BuyMallItem, [id, num]);

            }
        }

        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
            this.close();
        }

        protected addListeners(): void {
            super.addListeners();
            this.purchaseBtn.on(Event.CLICK, this, this.puchaseHandler);
            this._input.on(Event.CHANGE, this, this.inputHandler);
            this._input.addListeners();

        }

        protected removeListeners(): void {
            super.removeListeners();
            this.purchaseBtn.off(Event.CLICK, this, this.puchaseHandler);
            this._input.off(Event.CHANGE, this, this.inputHandler);
            this._input.removeListeners();

        }

        private inputHandler(): void {
            let num = this._input.value;
            if (num > this._maxNum) {
                this.totalPriceTxt.text = (this._maxNum * this._price[idCountFields.count]).toString();
            } else {
                this.totalPriceTxt.text = (num * this._price[idCountFields.count]).toString();
            }
        }

        public onOpened(): void {
            super.onOpened();
        }

        public close(): void {
            super.close();
        }
    }
}