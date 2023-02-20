
/**玄火成就item */
namespace modules.xuanhuo {
    import XuanHuoAchieventmentItemUI = ui.XuanHuoAchieventmentItemUI;
    import GetXuanhuoAchiecemtnAward = Protocols.GetXuanhuoAchiecemtnAward;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;

    import xuanhuoAchievementShow = Protocols.xuanhuoAchievementShow;
    import xuanhuoAchievementShowFields = Protocols.xuanhuoAchievementShowFields;


    export class XuanHuoAchieventmentItem extends XuanHuoAchieventmentItemUI {

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.getBtn, common.LayaEvent.CLICK, this, this.getBtnHandler);

        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: xuanhuoAchievementShow): void {
            super.setData(value);
            let current: number = value[xuanhuoAchievementShowFields.current];
            let condition: number = value[xuanhuoAchievementShowFields.condition];
            let status: number = value[xuanhuoAchievementShowFields.status];
            let itemData: Items = value[xuanhuoAchievementShowFields.Items];

            this.scheduleTxt.text = `(${current}/${condition})`;
            this.scheduleTxt.color = (current >= condition) ? "#168a17" : "#8a3116";
            this.descTxt.text = value[xuanhuoAchievementShowFields.desc];

            this.wjhBtn.visible = status == 0;
            this.getBtn.visible = status == 1;
            this.ylqBtn.visible = status == 2;
            console.log("领取状态：",status);
            
            this.item.dataSource = [itemData[0][ItemsFields.itemId], itemData[0][ItemsFields.count], 0, null];
        }

        //领取
        private getBtnHandler(): void {
            let data: GetXuanhuoAchiecemtnAward = [parseInt(this._data[xuanhuoAchievementShowFields.taskId])];
            XuanHuoCtrl.instance.getAchievementAward(data);
        }
    }
}