/**逐鹿首领战积分排行item */
namespace modules.zhulu {
    import ZhuLuWarRankAwardItemUI = ui.ZhuLuWarRankAwardItemUI;
    import ClanGetLevelRewardFields = Protocols.ClanGetLevelRewardFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import zhuluWarRankAward = Configuration.zhuluWarRankAward;
    import zhuluWarRankAwardFields = Configuration.zhuluWarRankAwardFields;

    export class ZhuLuWarRankAwardItem extends ZhuLuWarRankAwardItemUI {

        protected addListeners(): void {
            super.addListeners();

        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: zhuluWarRankAward): void {
            super.setData(value);
            let rank: string = value[zhuluWarRankAwardFields.rank];
            let itemData: Array<Items> = value[zhuluWarRankAwardFields.items];

            this.rank1.visible = rank == "1";
            this.rank2.visible = rank == "2";
            this.rank3.visible = rank == "3";

            this.nameTxt.visible = parseInt(rank) != 1 && parseInt(rank) != 2 && parseInt(rank) != 3;
            this.nameTxt.text = `第${rank}名`;

            this.item1.dataSource = [itemData[0][ItemsFields.itemId], itemData[0][ItemsFields.count], 0, null];
            this.item2.dataSource = [itemData[1][ItemsFields.itemId], itemData[1][ItemsFields.count], 0, null];
        }
    }
}