/**逐鹿首领战积分排行item */
namespace modules.zhulu {
    import ZhuLuWarRankAwardItem2UI = ui.ZhuLuWarRankAwardItem2UI;
    import ClanGetLevelRewardFields = Protocols.ClanGetLevelRewardFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import zhuluWarRankAward = Configuration.zhuluWarRankAward;
    import zhuluWarRankAwardFields = Configuration.zhuluWarRankAwardFields;

    export class ZhuLuWarRankAwardItem2 extends ZhuLuWarRankAwardItem2UI {

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.ckfdBtn, common.LayaEvent.CLICK, this, this.ckfdBtnHandler);
        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: zhuluWarRankAward): void {
            super.setData(value);

            let index: number = parseInt(value[zhuluWarRankAwardFields.rank]);
            let itemData: Array<Items> = value[zhuluWarRankAwardFields.items];

            this.titleImg.skin = `zhulu/image_title_${index}.png`
            this.bgImg.skin = `zhulu/image_bg_jl_${index < 3 ? index : 3}.png`
            this.blessingImg.skin = `zhulu/image_bg_fd_${value[zhuluWarRankAwardFields.blessing]}.png`

            this.item1.dataSource = [itemData[0][ItemsFields.itemId], itemData[0][ItemsFields.count], 0, null];
            this.item2.dataSource = [itemData[1][ItemsFields.itemId], itemData[1][ItemsFields.count], 0, null];
            this.item3.dataSource = [itemData[2][ItemsFields.itemId], itemData[2][ItemsFields.count], 0, null];
            this.item4.dataSource = [itemData[3][ItemsFields.itemId], itemData[3][ItemsFields.count], 0, null];
        }
        
        //查看福地
        private ckfdBtnHandler() {
            WindowManager.instance.open(WindowEnum.ZHULU_BLESSED_AWARD_DISPLAY_ALERT, this._data[zhuluWarRankAwardFields.blessedName]);
        }
    }
}