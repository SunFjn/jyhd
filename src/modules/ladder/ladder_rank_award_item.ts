/** 天梯排行奖励单元项*/


namespace modules.ladder {
    import NineTopAwardItemUI = ui.NineTopAwardItemUI;
    import tianti_awards = Configuration.tianti_awards;
    import tianti_awardsFields = Configuration.tianti_awardsFields;
    import BaseItem = modules.bag.BaseItem;
    import PairFields = Configuration.PairFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;

    export class LadderRankAwardItem extends NineTopAwardItemUI {
        constructor() {
            super();
        }

        protected setData(value: any): void {
            super.setData(value);
            let cfg: tianti_awards = value;
            let items: Array<Items> = cfg[tianti_awardsFields.rankAwards];
            if (items.length === 0) {
                this.visible = false;
                return;
            } else this.visible = true;
            let range: Configuration.Pair = cfg[tianti_awardsFields.rankRange];
            if (!range) return;
            if (range[PairFields.first] === 1 && range[PairFields.second] === 1) {
                this.rankTxt.visible = false;
                this.rankImg.visible = true;
                this.rankImg.skin = "common/zs_tongyong_7.png";
            } else if (range[PairFields.first] === 2 && range[PairFields.second] === 2) {
                this.rankTxt.visible = false;
                this.rankImg.visible = true;
                this.rankImg.skin = "common/zs_tongyong_8.png";
            } else if (range[PairFields.first] === 3 && range[PairFields.second] === 3) {
                this.rankTxt.visible = false;
                this.rankImg.visible = true;
                this.rankImg.skin = "common/zs_tongyong_9.png";
            } else {
                this.rankImg.visible = false;
                this.rankTxt.visible = true;
                this.rankTxt.text = `${range[PairFields.first]}-${range[PairFields.second]}`;
            }

            let arr: Array<BaseItem> = [this.item3, this.item2, this.item1, this.item0];
            for (let i: int = 0; i < 4; i++) {
                let index: number = items.length - i - 1;
                if (items[index]) {
                    arr[i].visible = true;
                    arr[i].dataSource = [items[index][ItemsFields.itemId], items[index][ItemsFields.count], 0, null];
                } else {
                    arr[i].visible = false;
                }
            }
        }
    }
}