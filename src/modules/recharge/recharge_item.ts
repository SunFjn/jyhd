namespace modules.recharge {
    import RechargeCfg = modules.config.RechargeCfg;
    import recharge = Configuration.recharge;
    import rechargeFields = Configuration.rechargeFields;

    export class RechargeItem extends ui.RechargeItemUI {
        private static _instance: RechargeItem;
        public static get instance(): RechargeItem {
            return this._instance = this._instance || new RechargeItem();
        }

        private _cfg: recharge;

        constructor() {
            super();
        }

        protected clickHandler(): void {
            super.clickHandler();
            this.rechargeMoney();
        }

        protected initialize(): void {
            super.initialize();

            this.iconImg.width = this.iconImg.height = 32;
        }

        private rechargeMoney(): void {
            // SystemNoticeManager.instance.addNotice("购买成功");
            // 购买次数判断（后面添加）

            let type: number = this._cfg[rechargeFields.index];
            if (type == RechargeId.monthCard) {
                WindowManager.instance.open(WindowEnum.MONTH_CARD_PANEL);
            } else if (type == RechargeId.zhizunCard) {
                WindowManager.instance.open(WindowEnum.ZHIZUN_PANEL);
            } else {
                if (this._cfg[rechargeFields.index] == 160) {
                    WindowManager.instance.open(WindowEnum.WEEK_CARD_PANEL);
                } else if (this._cfg[rechargeFields.index] == 161) {
                    WindowManager.instance.open(WindowEnum.WEEK_YUANBAO_PANEL);
                } else if (this._cfg[rechargeFields.index] == 162) {
                    WindowManager.instance.open(WindowEnum.WEEK_XIANYU_PANEL);
                } else {
                    if (Main.instance.isWXiOSPay) {
                        wxiOSPayHandler();
                    } else {
                        PlatParams.askPay(this._cfg[rechargeFields.index], this._cfg[rechargeFields.price]);
                    }
                }
            }
        }

        protected setData(rechargeInfor: Protocols.RechargeInfo): void {
            super.setData(rechargeInfor);
            let rearchargeCfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(rechargeInfor[Protocols.RechargeInfoFields.index]);
            this._cfg = rearchargeCfg;
            this.baseImg.skin = `assets/icon/ui/recharge/${rearchargeCfg[rechargeFields.baseId]}.png`;
            this.icoImg.skin = `assets/icon/ui/recharge/${rearchargeCfg[rechargeFields.ico]}.png`;
            this.nameTxt.text = rearchargeCfg[rechargeFields.name];
            this.priceTxt.text = rearchargeCfg[rechargeFields.price].toString();// "￥" + 

            if (rearchargeCfg[rechargeFields.describe]) {
                this.decTxt.visible = true;
                this.icoImg.pos(42, 48);// 22, 26
                this.decTxt.text = rearchargeCfg[rechargeFields.describe];
            } else {

                this.decTxt.visible = false;
                this.icoImg.pos(19, 50);// 80, 40
            }

            if (rearchargeCfg[rechargeFields.descriptive]) {
                this.desTxt.visible = true;
                this.desTxt.text = rearchargeCfg[rechargeFields.descriptive]
            }else{
                this.desTxt.visible = false;
            }

            if (rearchargeCfg[rechargeFields.exReward].length > 0 && !rechargeInfor[Protocols.RechargeInfoFields.count]) {
                this.iconImg.visible = this.tipImg.visible = this.tipTxt.visible = true;
                this.tipTxt.text = "赠送 " + rearchargeCfg[rechargeFields.exReward][0][Configuration.ItemsFields.count].toString() + "代币券";
                this.tipTxt.width = this.tipTxt.textField.textWidth;
                // CommonUtil.centerChainArr(115, [this.tipTxt, this.iconImg]);
            } else {
                this.iconImg.visible = this.tipImg.visible = this.tipTxt.visible = false;
            }
            // 特卖无赠送语
            if (rearchargeCfg[rechargeFields.type] == 0) {
                this.tipTxt.visible = false;
            } else {
                this.tipTxt.visible = true;
            }
        }
    }
}