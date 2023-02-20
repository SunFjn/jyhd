///<reference path="../team_battle/team_battle_rank_item.ts"/>


/** 天关排行单元项*/

namespace modules.mission {
    import TeamBattleRankItem = modules.teamBattle.TeamBattleRankItem;

    export class MissionRankItem extends TeamBattleRankItem {
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.damageTxt.x = 390;
            this.damageTxt.width = 100;
            this.damageTxt.align = "center";
        }

        protected setData(value: any): void {

            let rank: Protocols.Rank = value;
            let rankNum: number = this.index + 1;
            this.rankTxt.text = "";

            if (rankNum === 1) {
                this.rankImg.skin = "common/zs_tongyong_7.png";
            } else if (rankNum === 2) {
                this.rankImg.skin = "common/zs_tongyong_8.png";
            } else if (rankNum === 3) {
                this.rankImg.skin = "common/zs_tongyong_9.png";
            } else {
                this.rankImg.skin = "common/dt_tongyong_15.png";
                this.rankTxt.text = rankNum.toString();
            }
            if (rank == null) {
                this.notplaylisttxt.visible = true;
                this.havePlayerBox.visible = false;
                return;
            }
            this.notplaylisttxt.visible = false;
            this.havePlayerBox.visible = true;

            this.nameTxt.text = rank[Protocols.RankFields.name];
            this.damageTxt.text = rank[Protocols.RankFields.param].toString();
        }
    }
}