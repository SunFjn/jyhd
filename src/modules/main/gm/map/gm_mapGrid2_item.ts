/**  GM 地图编辑器 item2 */


namespace modules.gm {
    import GM_MapGrid2ItemUI = ui.GM_MapGrid2ItemUI;
    import cashEquipData = Configuration.cashEquipData;
    import cashEquipDataFields = Configuration.cashEquipDataFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import cash_Equip = Configuration.cashEquip;
    import cash_EquipFields = Configuration.cashEquipFields;
    import Event = Laya.Event;// 事件
    import CustomClip = modules.common.CustomClip; // 序列帧
    import CustomList = modules.common.CustomList; // List
    export class GM_MapGrid2Item extends GM_MapGrid2ItemUI {

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
        public itemId: number = 0
        protected setSelected(value: boolean): void {
            super.setSelected(value);
            // this.setData(this.iconId)
           
        }


        protected setData(value): void {
            super.setData(value);
            this.bgtxt.visible = CommonUtil.getRandomInt(0, 1) == 0

        }

        public destroy() {

            super.destroy()
        }


    }
}
