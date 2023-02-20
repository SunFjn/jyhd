
/**玄火排行item */
namespace modules.xuanhuo {
    import XuanHuoRankAwardItemUI = ui.XuanHuoRankAwardItemUI;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import xuanhuoRankAward = Configuration.xuanhuoRankAward;
    import xuanhuoRankAwardFields = Configuration.xuanhuoRankAwardFields;

    export class XuanHuoRankAwardItem extends XuanHuoRankAwardItemUI {

        protected addListeners(): void {
            super.addListeners();

        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: xuanhuoRankAward): void {
            let rank: number = value[xuanhuoRankAwardFields.rank];
            let awards: Array<Items> = value[xuanhuoRankAwardFields.award];

            this.rank1.visible = rank == 1;
            this.rank2.visible = rank == 2;
            this.rank3.visible = rank == 3;
            this.nameTxt.visible = rank >= 4;

            switch (rank) {
                case 4: this.nameTxt.text = "第4-5名"; break;
                case 6: this.nameTxt.text = "第6-10名"; break;
                case 11: this.nameTxt.text = "第11-20名"; break;
            }
            this.item1.dataSource = [awards[0][ItemsFields.itemId], awards[0][ItemsFields.count], 0, null];
            this.item2.dataSource = [awards[1][ItemsFields.itemId], awards[1][ItemsFields.count], 0, null];
            this.item3.dataSource = [awards[2][ItemsFields.itemId], awards[2][ItemsFields.count], 0, null];
        }
    }
}