/** 红包规则弹窗*/
namespace modules.redpack {
    import RedPackHelpAlertUI = ui.RedPackHelpAlertUI;


    export class RedPackHelpAlert extends RedPackHelpAlertUI {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.contentTxt.color = "#454545";
            this.contentTxt.style.fontFamily = "SimHei";
            this.contentTxt.style.fontSize = 22;
            this.contentTxt.style.valign = "middle";
            this.contentTxt.style.lineHeight = 35;
            this.contentTxt.mouseEnabled = false;
        }

        protected addListeners(): void {
            super.addListeners();
        }

        public setOpenParam(value: number): void {
            super.setOpenParam(value);
        }

        public onOpened(): void {
            super.onOpened();
            this.contentTxt.innerHTML = "1、活动时间内，玩家可通过游戏充值解锁超级红包领取相应红包，余额可选择兑换为游戏代币或者提现。<br/>" +
                                        "2、活动时间结束后，账户剩余金额将等额兑换成游戏代币通过邮件发放至玩家账户，届时请注意查收。<br/>" +
                                        "3、活动时间为30天。"
        }
    }
}