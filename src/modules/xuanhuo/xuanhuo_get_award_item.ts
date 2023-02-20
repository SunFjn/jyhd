
/**玄火场景中的获取item */
namespace modules.xuanhuo {
    import XuanHuoGetAwardItemUI = ui.XuanHuoGetAwardItemUI;
    import ClanGetLevelRewardFields = Protocols.ClanGetLevelRewardFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;

    import xuanhuoGetAwardShow = Protocols.xuanhuoGetAwardShow;
    import xuanhuoGetAwardShowFields = Protocols.xuanhuoGetAwardShowFields;


    export class XuanHuoGetAwardItem extends XuanHuoGetAwardItemUI {

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.getBtn, common.LayaEvent.CLICK, this, this.getBtnHandler);

        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: xuanhuoGetAwardShow): void {
            super.setData(value);
            let current: number = value[xuanhuoGetAwardShowFields.current];
            let condition: number = value[xuanhuoGetAwardShowFields.condition];
            let status: number = value[xuanhuoGetAwardShowFields.status];
            let itemData: Array<Items> = value[xuanhuoGetAwardShowFields.Items];

            this.scheduleTxt.text = `(${current}/${condition})`;
            this.scheduleTxt.color = (current >= condition) ? "#168a17" : "#8a3116";
            this.descTxt.text = value[xuanhuoGetAwardShowFields.desc];

            this.wjhBtn.visible = status == 0;
            this.getBtn.visible = status == 1;
            this.ylqBtn.visible = status == 2;


            this.item1.dataSource = [itemData[0][ItemsFields.itemId], itemData[0][ItemsFields.count], 0, null];
            this.item2.dataSource = [itemData[1][ItemsFields.itemId], itemData[1][ItemsFields.count], 0, null];
        }

        //领取
        private getBtnHandler(): void {
            XuanHuoCtrl.instance.getSingleXuanHuoAward([this._data[xuanhuoGetAwardShowFields.taskId]]);
        }
    }
}