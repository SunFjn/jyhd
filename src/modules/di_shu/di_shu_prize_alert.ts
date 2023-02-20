
namespace modules.dishu {
    import di_shu_main_cfgFields = Configuration.di_shu_main_cfgFields;
    import ItemsFields = Configuration.ItemsFields;
    import AutoSC_DiShuItemFields = Protocols.AutoSC_DiShuItemFields;
    import AutoSC_DiShuTimateList = Protocols.AutoSC_DiShuTimateList;
    import BaseItem = modules.bag.BaseItem;
    import CustomList = modules.common.CustomList;
    import AutoSC_DiShuTimateListFields = Protocols.AutoSC_DiShuTimateListFields;

    export class DishuPrizeAlert extends ui.DishuPrizeAlertUI {

        private _cfg: Array<Array<any>>
        private timateList: AutoSC_DiShuTimateList[]
        private _list: CustomList
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.itemRender = DishuPrizeItem;
            this._list.width = this.bigPrizeBox.width
            this._list.height = this.bigPrizeBox.height
            this._list.hCount = 4;
            this._list.autoX = true;
            this._list.spaceY = 50
            this.bigPrizeBox.addChild(this._list)
        };
        public onOpened() {
            // this._cfg = DishuCfg.instance.getDishuByLevel(DishuModel.instance.level);
            // this.Ultimate = this._cfg[di_shu_main_cfgFields.Ultimate]
            this.timateList = DishuModel.instance.timateList;
            this._list.datas = this.timateList
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this._list, common.LayaEvent.SELECT, this, this.bigPrizeHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DISHU_ULTIMATE_UPDATE, this, this.bigPrizeHandlerReply); //选择终极大奖 返回
        }

        public bigPrizeHandler() {
            let index = this._list.selectedIndex
            // 发送给后端
            DishuCtrl.instance.selectUltimate([index]);
        }

        public bigPrizeHandlerReply(index: number) {

            // 更改大奖选取状态
            DishuModel.instance.ultimate = [1, this.timateList[index][AutoSC_DiShuTimateListFields.Item][ItemsFields.itemId], this.timateList[index][AutoSC_DiShuTimateListFields.Item][ItemsFields.count], 0];
            DishuModel.instance.dishuCallback();
            this.close()
        }

        protected removeListeners(): void {

            super.removeListeners();
        }

        public destroy(): void {
            super.destroy();
        }
        public close() {
            super.close();
        }

    }
}