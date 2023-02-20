/** 现金装备-奇珍异宝 获得装备弹窗*/


namespace modules.cashEquip {

    import CashEquipShareAlertUI = ui.CashEquipShareAlertUI;
    import Event = Laya.Event;// 事件
    import Text = Laya.Text;// Label
    import Image = Laya.Image;// Image
    import CustomList = modules.common.CustomList; // List
    import CustomClip = modules.common.CustomClip; // 序列帧

    import MissionModel = modules.mission.MissionModel;
    import cash_Equip = Configuration.cashEquip;
    import cash_EquipFields = Configuration.cashEquipFields;
    import cashEquipData = Configuration.cashEquipData;
    import cashEquipDataFields = Configuration.cashEquipDataFields;

    export class CashEquipShareAlert extends CashEquipShareAlertUI {


        public destroy(destroyChild: boolean = true): void {
            super.destroy();
        }

        constructor() {
            super();
        }
        private _list: CustomList;

        protected initialize(): void {
            super.initialize();



        }

        protected addListeners(): void {
            super.addListeners();
            this.goBtn.on(Event.CLICK, this, this.sell);


        }

        protected removeListeners(): void {
            super.removeListeners();


        }

        private itemId = 0
        public setOpenParam(value): void {
            super.setOpenParam(value);
            let itemId = value[0]
            let count = 1
            this.itemId = itemId
            let cfg: cash_Equip = CashEquipCfg.instance.getCfgId(itemId)
            this.item1.dataSource = [itemId, count, 0, null]
            this.item1.needTip = false
            this.descTxt.text = `恭喜获得(${cfg[cash_EquipFields.name]})x${count} 已入库`
            this.dsTxt.x = this.descTxt.width + 5
            this.goBtn.label = MissionModel.instance.curLv <= 11 ? "我知道了" : "前往出售"
        }

        private sell() {
            if (MissionModel.instance.curLv <= 11) {
                this.close();
                return;
            }
            WindowManager.instance.close(WindowEnum.CashEquip_Share_Alert)
            WindowManager.instance.open(WindowEnum.CashEquip_Sell_Alert, [this.itemId]);
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