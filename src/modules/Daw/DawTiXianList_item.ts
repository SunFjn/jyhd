
/** 战力分红子项*/

namespace modules.daw {
    export class DawTiXianList_item extends ui.DawTianXianiItem2UI {
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this.createEffect();
        }
        protected addListeners(): void {
            super.addListeners();

        }
        public onOpened(): void {
            super.onOpened();

        }
        protected setData(value: any): void {
            super.setData(value);
            let s = this;
            //console.log("value", value)
            s.labtitle.text = value.pay_type == 1 ? "微信提现" : "支付宝提现"
            s.labstatus.text = value.status == 0 ? "待处理" : "提现成功"
            s.labtime.text = value.create_time
            s.labmoney.text = Number(value.withdraw_money) + "元"

        }
        private sureBtnHandler() {

        }
        private gotoBtnHandler() {
            //跳转面板或场景

        }
        private createEffect() {

        }
        public close(): void {
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
    }
}