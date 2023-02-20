/** VIP特权信息单元项*/



namespace modules.vip {

    import VipPowerItemUI = ui.VipPowerItemUI;

    export class VipPowerItem extends VipPowerItemUI {

        protected setData(value: any): void {
            super.setData(value);
            let str: string = value;
            this.showTxt.text = str;
        }
    }
}