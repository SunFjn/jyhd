/** VIP特权信息单元项*/



namespace modules.vip_new {

    import VipPowerItemUI = ui.VipPowerItemUI;

    export class VipNewPowerItem extends VipPowerItemUI {

        protected setData(value: any): void {
            super.setData(value);
            let str: string = value;
            this.showTxt.text = str;
        }
    }
}