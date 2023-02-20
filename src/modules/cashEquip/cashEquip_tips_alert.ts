/** 现金装备-奇珍异宝 出售成功弹窗*/


namespace modules.cashEquip {

    import CashEquipTipsAlertUI = ui.CashEquipTipsAlertUI;
    import Event = Laya.Event;// 事件
    import Text = Laya.Text;// Label
    import Image = Laya.Image;// Image
    import CustomList = modules.common.CustomList; // List
    import CustomClip = modules.common.CustomClip; // 序列帧
    import cash_Equip = Configuration.cashEquip;
    import cash_EquipFields = Configuration.cashEquipFields;
    import cashEquipData = Configuration.cashEquipData;
    import cashEquipDataFields = Configuration.cashEquipDataFields;



    export class CashEquipTipsAlert extends CashEquipTipsAlertUI {


        public destroy(destroyChild: boolean = true): void {
            super.destroy();
        }

        constructor() {
            super();
        }
        private _list: CustomList;

        protected initialize(): void {
            super.initialize();
            this.regGuideSpr(GuideSpriteId.BOTTOM_CashEquip_MONEY_TIPS, this.goldTxt);


        }

        protected addListeners(): void {
            super.addListeners();



        }

        protected removeListeners(): void {
            super.removeListeners();


        }




        public setOpenParam(value): void {
            super.setOpenParam(value);
            let itemId = value[0]
            let count = value[1]

            let cfg: cash_Equip = CashEquipCfg.instance.getCfgId(itemId)
            this.item1.dataSource = [itemId, count, 0, null]
            this.item1.needTip = false
            let gold = Number(cfg[cash_EquipFields.gold])
            gold = (count * (gold * (10000 * 10000))) / (10000 * 10000)
            this.goldTxt.text = gold + "元"
        }


        onOpened(): void {
            super.onOpened();

        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            GlobalData.dispatcher.event(CommonEventType.CashEquip_Item_change);
        }


    }
}