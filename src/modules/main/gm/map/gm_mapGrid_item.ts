/**  GM 地图编辑器 item */


namespace modules.gm {
    import GM_MapGridItemUI = ui.GM_MapGridItemUI;
    import cashEquipData = Configuration.cashEquipData;
    import cashEquipDataFields = Configuration.cashEquipDataFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import cash_Equip = Configuration.cashEquip;
    import cash_EquipFields = Configuration.cashEquipFields;
    import Event = Laya.Event;// 事件
    import CustomClip = modules.common.CustomClip; // 序列帧
    import CustomList = modules.common.CustomList; // List
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    export class GM_MapGridItem extends GM_MapGridItemUI {

        constructor() {
            super();
        }
        private _smeltClip: CustomClip;
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
            if (value) {
                console.log('研发测试_chy:地图', '点击选择', this._vo);
                SystemNoticeManager.instance.addNotice(`点击位置 x${this.data._x},y${this.data._y}`, false);
                SystemNoticeManager.instance.addNotice(`点击位置 x${this.data._x},y${this.data._y}`, false);
                SystemNoticeManager.instance.addNotice(`点击位置 x${this.data._x},y${this.data._y}`, false);
             
            }
        }
        private _vo;
        protected setData(value): void {
            super.setData(value);
            this._vo = value
            this.setopen()
        }
        public setVl(value: boolean) {
            this.selectbg.visible = value;
        }
        public setopen() {
            this.selectbg.visible = GM_MapModel.instance._map[this.getIndex()] == 0
        }
        public getIndex() {
            return this._vo.index;
        }

        public destroy() {

            super.destroy()
        }


    }
}
