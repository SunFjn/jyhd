namespace modules.ceremony_geocaching {
    import BaseItem = modules.bag.BaseItem;
    import ItemsFields = Configuration.ItemsFields;
    import ceremonyGeocachingRank = Configuration.ceremonyGeocachingRank;
    import ceremonyGeocachingRankFields = Configuration.ceremonyGeocachingRankFields;
    import Items = Configuration.Items;

    export class CeremonyGeocachingRankItem extends ui.CeremonyGeocachingRankItemUI {
        constructor() {
            super();
        }

        protected setData(value: ceremonyGeocachingRank): void {
            super.setData(value);
            let rank: number = value[ceremonyGeocachingRankFields.rank];
            let sb_score: number = value[ceremonyGeocachingRankFields.condition_show];
            let score: number = value[ceremonyGeocachingRankFields.score];
            let name: string = value[ceremonyGeocachingRankFields.name];
            let awards: Array<Items> = value[ceremonyGeocachingRankFields.items];

            // 排名设置
            this.oneImage.visible = rank == 1;
            this.twoImage.visible = rank == 2;
            this.threeImg.visible = rank == 3;
            this.otherBox.visible = rank >= 4;
            this.afterthired.value = rank.toString();

            this.notplaylisttxt.visible = name == null;
            this.playername.visible = name != null;

            // 玩家名字
            if (name) {
                this.playername.text = name;
                this.StatementHTML.innerHTML = `<div style="width:400px;fontSize:21;color:black"><span>积分：</span><span style="color:#168a17;">${score}</span></div>`;
            }
            // 上榜积分
            else {

                this.StatementHTML.innerHTML = `<div style="width:400px;fontSize:21;color:black"><span>上榜条件：</span><span style="color:#168a17;">${sb_score}</span><span>积分</span></div>`;
            }

            // 奖励
            this.reward1.dataSource = [awards[0][ItemsFields.itemId], awards[0][ItemsFields.count], 0, null];
            this.reward2.dataSource = [awards[1][ItemsFields.itemId], awards[1][ItemsFields.count], 0, null];
            this.reward3.dataSource = [awards[2][ItemsFields.itemId], awards[2][ItemsFields.count], 0, null];
        }
    }
}
