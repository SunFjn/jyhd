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

    export class StoreSpecialAlert extends ui.StoreSpecialAlertUI {
        constructor() {
            super();
        }

        private _itemCfg: mall;
        private _maxNum: number;
        private _price: Array<any>;
        private _count: number;

        protected initialize(): void {
            super.initialize();
            this.descriptTxt.color = "#2a2a2a";
            this.descriptTxt.style.fontFamily = "SimHei";
            this.descriptTxt.style.fontSize = 26;
            this.descriptTxt.style.align = "center";
        }

        //[Configuration.mall,购买数量]
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._itemCfg = value[0];
            this._count = value[1];

            let id = this._itemCfg[mallFields.itemId];
            let count = this._itemCfg[mallFields.count];
            this._price = this._itemCfg[mallFields.realityPrice];
            this.baseItem.dataSource = [id, count, 0, null];

            let itemType: number = CommonUtil.getItemTypeById(this._price[idCountFields.id]);
            if (itemType == ItemMType.Unreal) {
                this.totalPriceImg.skin = CommonUtil.getIconById(this._price[idCountFields.id], true);
            } else {
                this.totalPriceImg.skin = CommonUtil.getIconById(this._price[idCountFields.id], false);
            }
            this.descriptTxt.innerHTML = `是否花费<span style='color:#168a17'>${CommonUtil.getNameByItemId(this._price[idCountFields.id])}</span>购买${this._count}个${this.baseItem._nameTxt.text}`;

            this._price[idCountFields.count];       //需要的数量
            this.totalPriceTxt.text = (this._count * this._price[idCountFields.count]).toString();        //总价

            this.dontShow.selected = false;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.cancelBtn, Event.CLICK, this, this.close);      //取消按钮
            this.addAutoListener(this.conformBtn, Event.CLICK, this, this.conformBtnHandler);      //确认按钮
            this.addAutoListener(this.dontShow, Event.CLICK, this, this.dontShowHandler);      //不再提示勾选框
        }

        protected removeListeners(): void {
            super.removeListeners();

        }

        public onOpened(): void {
            super.onOpened();
        }

        public close(): void {
            super.close();
            GlobalData.dispatcher.event(CommonEventType.UPDATE_XUNBAOUI);//为了关闭界面时候刷新 探索界面
        }

        private conformBtnHandler(): void {
            let id = this._itemCfg[mallFields.id];
            let costId = this._price[idCountFields.id];                 //要消耗的道具类型（代币券，金币，还有其他莫名其妙的材料）
            let num: number = PlayerModel.instance.getCurrencyById(costId);     //拥有的数量
            if (num == null) {
                num = BagModel.instance.getItemCountById(costId);
            }
            let cost: number = this._count * this._price[idCountFields.count];       //要消耗的数量
            if (cost > num) {
                CommonUtil.goldNotEnoughAlert(Laya.Handler.create(this, () => {
                    WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                    this.close();
                }));

            } else {
                Channel.instance.publish(UserFeatureOpcode.BuyMallItem, [id, this._count]);
                this.close();
            }
        }

        private dontShowHandler(): void {
            switch (this._itemCfg[mallFields.itemId]) {
                case 13540001:      //装备秘钥
                    StoreModel.instance.dontShowTreasure = this.dontShow.selected = !this.dontShow.selected;
                    break;
                case 10340001:      //圣物秘钥
                    StoreModel.instance.dontShowTalisman = this.dontShow.selected = !this.dontShow.selected;
                    break;
                case 13550002:      //至尊秘钥
                    StoreModel.instance.dontShowZhiZun = this.dontShow.selected = !this.dontShow.selected;
                    break;
                case 13550001:      //巅峰秘钥
                    StoreModel.instance.dontShowDianFeng = this.dontShow.selected = !this.dontShow.selected;
                case 13540002:      //玉荣秘钥
                    StoreModel.instance.dontShowFuWen = this.dontShow.selected = !this.dontShow.selected;

                    break;
            }
        }
    }
}