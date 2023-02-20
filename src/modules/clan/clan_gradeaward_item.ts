
/**战队等级奖励渲染节点 */
namespace modules.clan {
    import ClanGradeAwardItemUI = ui.ClanGradeAwardItemUI;
    import ClanGetLevelRewardFields = Protocols.ClanGetLevelRewardFields;
    import ClanGetLevelReward = Protocols.ClanGetLevelReward;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import clan_gradeAwardFields = Configuration.clan_gradeAwardFields;
    import clan_gradeAward = Configuration.clan_gradeAward;

    export class ClanGradeAwardItem extends ClanGradeAwardItemUI {

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.getBtn, common.LayaEvent.CLICK, this, this.getBtnHandler);

        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: clan_gradeAward): void {
            super.setData(value);
            let award: Array<Items> = value[clan_gradeAwardFields.award];
            let level: number = value[clan_gradeAwardFields.level];
            let status: number = value[clan_gradeAwardFields.status];

            this.levelTxt.text = `LV.${level}`;
            /*领取状态 1可领取 2已领取 0未激活*/
            this.ylqBtn.visible = status == 2;
            this.getBtn.visible = status == 1;
            this.wjhBtn.visible = status == 0;

            award.forEach((itemData, index) => {
                this["item" + (index + 1)].dataSource = [itemData[ItemsFields.itemId], itemData[ItemsFields.count], 0, null];
            });
        }

        //领取
        private getBtnHandler(): void {
            let data: ClanGetLevelReward = [this._data[clan_gradeAwardFields.level]];
            ClanCtrl.instance.getClanGradeLevelRequset(data);
        }
    }
}