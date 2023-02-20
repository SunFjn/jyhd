/**  现金装备-奇珍异宝 余额明细 */


namespace modules.cashEquip {
    import CashEquipDetailedItemUI = ui.CashEquipDetailedItemUI;
    import cashEquipData = Configuration.cashEquipData;
    /*类型*/
    const enum pageType {
        sell = 0,	/*出售*/
        cash,		/*提现*/

    }
    export class CashEquipDetailedItem extends CashEquipDetailedItemUI {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }
        private itemId: number = 0




        // private iconId: number = 0
        protected setData(value): void {
            super.setData(value);
            this.dateTxt.text = value.create_time

            if (CashEquipModel.instance.pageType == pageType.sell) {
                this.statusTxt.text = "已售出"
                this.aliTxt.text = "(" + value.description + ")"
                this.priceTxt.color = "#ff2800"
                this.priceTxt.text = "+" + value.change_money + "元"
            } else if (CashEquipModel.instance.pageType == pageType.cash) {
                this.statusTxt.text = value.msg
                this.aliTxt.text = value.pay_type == 1 ? "(微信提现)" : "(支付宝提现)"

                this.priceTxt.color = "#65ff00"
                this.priceTxt.text = "-" + value.withdraw_money + "元"
            }


        }


    }
}
