/** 红包提现记录单元项*/
namespace modules.redpack {
    import RedPackReocrdItemUI = ui.RedPackReocrdItemUI;

    export class RedPackReocrdItem extends RedPackReocrdItemUI {

        constructor() {
            super();
        }

        protected setData(value: any): void {
            super.setData(value);
            this.txt_date.text = value.create_time.replace(" ", "\n");

            // 超级红包兑换
            if (!value.msg && value.status != undefined) {
                let str = "";
                switch (value.status) {
                    case 0: str = "待处理"; break;
                    case 1: str = "兑换成功"; break;
                    case 2: str = "兑换失败"; break;
                }
                this.txt_status.text = str;
            } else
            // 提现记录
            {
                // 主播服状态修改
                if (window["dawSDK"].current_platform == 3) {
                    this.txt_status.text = "提现成功";
                } else {
                    this.txt_status.text = value.msg;
                }
            }

            // 超级红包兑换
            if (value.withdraw_money == undefined && value.money != undefined) {
                this.txt_amount.text = (value.money >= 0 ? "+" + value.money : value.money) + "元"
            }
            // 提现记录
            else {
                this.txt_amount.text = (value.withdraw_money >= 0 ? "+" + value.withdraw_money : value.withdraw_money) + "元"
            }
        }
    }
}