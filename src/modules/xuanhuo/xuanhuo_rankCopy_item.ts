
/**玄火排行item */
namespace modules.xuanhuo {
    import XuanHuoRankCopyItemUI = ui.XuanHuoRankCopyItemUI;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import xuanhuoRankAward = Configuration.xuanhuoRankAward;
    import xuanhuoRankAwardFields = Configuration.xuanhuoRankAwardFields;

    export class XuanHuoRankCopyItem extends XuanHuoRankCopyItemUI {

        protected addListeners(): void {
            super.addListeners();

        }

        protected initialize(): void {
            super.initialize();
            this.StatementHTML.color = "#ec7f09";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 20;
            this.StatementHTML.style.valign = "middle";
            this.StatementHTML.style.lineHeight = 26;
            this.StatementHTML.mouseEnabled = false;
            this.StatementHTML.width = 400
        }

        protected setData(value): void {
            let rank: number = value[4];

            this.rank1.visible = rank == 1;
            this.rank2.visible = rank == 2;
            this.rank3.visible = rank == 3;
            this.rankTxt.visible = rank >= 4;
            this.rankTxt.text = `第${rank}名`
            this.nameTxt.text = value[1]
            this.StatementHTML.innerHTML = `<img src="assets/icon/item/xuanhuo_huo.png" width="20" height="20"/>` + value[2];
        }
    }
}