/** 现金装备-奇珍异宝 余额弹窗*/


namespace modules.cashEquip {

    import CashEquipMoneyAlertUI = ui.CashEquipMoneyAlertUI;
    import Event = Laya.Event;// 事件
    import Text = Laya.Text;// Label
    import Image = Laya.Image;// Image
    import CustomList = modules.common.CustomList; // List
    import CustomClip = modules.common.CustomClip; // 序列帧




    export class CashEquipMoneyAlert extends CashEquipMoneyAlertUI {


        public destroy(): void {
            super.destroy();
        }

        constructor() {
            super();
        }
        private _list: CustomList;

        protected initialize(): void {
            super.initialize();
            GlobalData.dispatcher.on(CommonEventType.CashEquip_Money_change, this, this.updateData);
            this.regGuideSpr(GuideSpriteId.BOTTOM_CashEquip_MONEY_TIXIAN, this.goBtn);

        }

        private openList() {
            WindowManager.instance.openDialog(WindowEnum.CashEquip_Sell_List_Alert)
        }
        protected addListeners(): void {
            super.addListeners();

            this.listTxt.on(Event.CLICK, this, this.openList);
            this.goBtn.on(Event.CLICK, this, DawData.ins.OpenTixian, [this.dialogId]);

        }

        private OpenTixian() {

        }

        protected removeListeners(): void {
            super.removeListeners();

        }

        //更新数据
        public updateData(): void {

            this.moneyTxt.text = CashEquipModel.instance.money.toString() + "元";
            this.listMoneyTxt.text = CashEquipModel.instance.moneyHis.toString() + "元";


        }


        public setOpenParam(value): void {
            super.setOpenParam(value);

        }
        onOpened(): void {
            super.onOpened();
            this.updateData();
        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);

        }


    }
}