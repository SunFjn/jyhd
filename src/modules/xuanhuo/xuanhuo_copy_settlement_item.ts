
/**玄火副本结束展示排行item */
namespace modules.xuanhuo {
    import XuanHuoCopyISettlementtemUI = ui.XuanHuoCopyISettlementtemUI;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import xuanhuoRankAward = Configuration.xuanhuoRankAward;
    import xuanhuoRankAwardFields = Configuration.xuanhuoRankAwardFields;

    export class XuanHuoCopyISettlementtem extends XuanHuoCopyISettlementtemUI {

        protected addListeners(): void {
            super.addListeners();

        }

        protected initialize(): void {
            super.initialize();

        }

        protected setData(value): void {
            let rank: number = value[4];

            this.rank1.visible = rank == 1;
            this.rank2.visible = rank == 2;
            this.rank3.visible = rank == 3;
            this.rankClip.visible = rank >= 4;
            this.rankClip.value = rank + "";
            this.nameTxt.text = value[1];
            this.countTxt.text = value[2];
        }
    }
}