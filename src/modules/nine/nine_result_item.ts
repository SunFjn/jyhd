/** 九天之巅结算弹框单元项*/


namespace modules.nine {
    import NineResultItemUI = ui.NineResultItemUI;
    import NineRank = Protocols.NineRank;
    import NineRankFields = Protocols.NineRankFields;
    import SceneCopyNineCfg = modules.config.SceneCopyNineCfg;
    import scene_copy_nineFields = Configuration.scene_copy_nineFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import RankAwardFields = Configuration.RankAwardFields;

    export class NineResultItem extends NineResultItemUI {
        constructor() {
            super();
        }

        protected setData(value: any): void {
            super.setData(value);

            let rankInfo: NineRank = value;
            let rank: int = rankInfo[NineRankFields.rank];
            if (rank === 1) {
                this.rankImg.skin = "common/zs_tongyong_7.png";
            } else if (rank === 2) {
                this.rankImg.skin = "common/zs_tongyong_8.png";
            } else if (rank === 3) {
                this.rankImg.skin = "common/zs_tongyong_9.png";
            }
            this.nameTxt.text = rankInfo[NineRankFields.actorName];
            let item: Items = SceneCopyNineCfg.instance.getCfgByLevel(9)[scene_copy_nineFields.rankAward][rank - 1][RankAwardFields.awards][0];
            this.item.dataSource = [item[ItemsFields.itemId], item[ItemsFields.count], 0, null];
        }
    }
}