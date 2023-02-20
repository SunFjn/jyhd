/** 九天之巅登顶奖励单元项*/


namespace modules.nine {
    import NineTopAwardItemUI = ui.NineTopAwardItemUI;
    import BaseItem = modules.bag.BaseItem;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import RankAwardFields = Configuration.RankAwardFields;

    export class NineTopAwardItem extends NineTopAwardItemUI {

        constructor() {
            super();
        }

        protected setData(value: any): void {
            super.setData(value);
            let rank: number = value[0];
            if (rank === 1) {
                this.rankTxt.visible = false;
                this.rankImg.visible = true;
                this.rankImg.skin = "common/zs_tongyong_7.png";
            } else if (rank === 2) {
                this.rankTxt.visible = false;
                this.rankImg.visible = true;
                this.rankImg.skin = "common/zs_tongyong_8.png";
            } else if (rank === 3) {
                this.rankTxt.visible = false;
                this.rankImg.visible = true;
                this.rankImg.skin = "common/zs_tongyong_9.png";
            } else if (rank === 4) {
                this.rankImg.visible = false;
                this.rankTxt.visible = true;
                this.rankTxt.text = "4-10名";
            } else if (rank === 5) {
                this.rankImg.visible = false;
                this.rankTxt.visible = true;
                this.rankTxt.text = "11名后"
            }
            let items: Array<Items> = value[1][RankAwardFields.awards];
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