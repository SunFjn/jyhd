
/**逐鹿首领战积分排行item */
namespace modules.zhulu {
    import ZhuLuHeaderWarRankItemUI = ui.ZhuLuHeaderWarRankItemUI;
    import ClanGetLevelRewardFields = Protocols.ClanGetLevelRewardFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;

    import TeamChiefRank = Protocols.TeamChiefRank;
    import TeamChiefRankFields = Protocols.TeamChiefRankFields;


    export class ZhuLuHeaderWarRankItem extends ZhuLuHeaderWarRankItemUI {

        protected addListeners(): void {
            super.addListeners();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: any): void {
            super.setData(value);
            // let current: number = value[xuanhuoAchievementShowFields.current];
            // let condition: number = value[xuanhuoAchievementShowFields.condition];
            // let status: number = value[xuanhuoAchievementShowFields.status];
            // let itemData: Items = value[xuanhuoAchievementShowFields.Items];

            // this.scheduleTxt.text = `(${current}/${condition})`;
            // this.scheduleTxt.color = (current >= condition) ? "#168a17" : "#8a3116";
            // this.descTxt.text = value[xuanhuoAchievementShowFields.desc];

            // this.wjhBtn.visible = status == 0;
            // this.getBtn.visible = status == 1;
            // this.ylqBtn.visible = status == 2;

            // this.item.dataSource = [itemData[0][ItemsFields.itemId], itemData[0][ItemsFields.count], 0, null];

            let rank = value[0]
            for (let index = 1; index < 4; index++) {
                this['rank' + index].visible = rank == index
            }
            this.commonRank.visible = rank > 3
            this.rankClip.value = rank
            this.nameTxt.text = value[1]
            this.scoreTxt.text = value[2].toString();
        }

    }
}