/**
 * 通用选取数量弹窗
 * @param <amountParam>
*/
namespace modules.common {

    import Event = Laya.Event;// 事件
    import Text = Laya.Text;// Label
    import Image = Laya.Image;// Image
    import mallFields = Configuration.mallFields;
    import CustomList = modules.common.CustomList; // List
    import CustomClip = modules.common.CustomClip; // 序列帧
    import idCount = Configuration.idCount
    import idCountFields = Configuration.idCountFields;
    import BagModel = modules.bag.BagModel;
    import amountParam = ui.amountParam;
    import amountParamFields = ui.amountParamFields;

    export class AmountAlert extends ui.StoreAlertUI {
        constructor() {
            super();
        }
        private _list: CustomList;
        private param_data: amountParam;
        private _maxNum: number;
        private _price: idCount;
        private _input: NumInputCtrl;

        protected initialize(): void {
            super.initialize();
            this._price = new Array<any>() as idCount;
            this._input = new NumInputCtrl(this.numInput, this.addBtn, this.reduceBtn, this.addTenBtn, this.reduceTenBtn);
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

        public setOpenParam(value: amountParam): void {
            super.setOpenParam(value);
            // 判断必要条件
            if (typeof value[amountParamFields.id] == "undefined" || typeof value[amountParamFields.count] == "undefined" || typeof value[amountParamFields.price] == "undefined" || typeof value[amountParamFields.buyid] == "undefined") {
                return modules.notice.SystemNoticeManager.instance.addNotice("参数不足", true);
            }

            this.param_data = value;
            // 更改标题
            if (typeof value[amountParamFields.titText] != "undefined") {
                this.titText.text = value[amountParamFields.titText];
            }
            // 按钮文字 没有时同步标题
            this.purchaseBtn.label = typeof value[amountParamFields.btnTest] == "undefined" ? this.titText.text : value[amountParamFields.btnTest];

            let limitCount = value[amountParamFields.max] as number;

            let id = value[amountParamFields.id];//道具id
            let count = value[amountParamFields.count];//数量
            this._price = value[amountParamFields.price];//现价 itemId#数量
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
            let num = this._input.value;
            if (num == 0) {
                //处理探索界面 抽奖次数不足必定弹窗的情况 提示货币不足 
                CommonUtil.goldNotEnoughAlert();
            }
            switch (this.param_data[amountParamFields.fid]) {
                case 1:
                    // 开服活动 - 庆典兑换
                    modules.ceremony_cash.CeremonyCashCtrl.instance.cashRequest(this.param_data[amountParamFields.buyid])
                    break;
                case 2:
                    // 钓鱼活动 - 钓鱼宝库
                    modules.fish.FishCKCtrl.instance.cashRequest(LimitBigType.fish, this.param_data[amountParamFields.buyid], num)

                    break;
                case 3:
                    // 新春活动 - 新春商城
                    modules.limit.LimitShopCtrl.instance.getReap(LimitBigType.year, this.param_data[amountParamFields.buyid], num)
                    break;
                case 4:
                    // 钓鱼活动 - 钓鱼商城
                    console.log('打印',"dadasdasdas");
                    modules.limit.LimitShopCtrl.instance.getReap(LimitBigType.fish, this.param_data[amountParamFields.buyid], num)
                    break;


            }
            this.close();
        }

        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
            this.close();
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