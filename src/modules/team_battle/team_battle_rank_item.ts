namespace modules.teamBattle {
    import ThreeWorldsRankItemUI = ui.ThreeWorldsRankItemUI;

    export class TeamBattleRankItem extends ThreeWorldsRankItemUI {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.nameTxt.y = 35;
            this.nameTxt.x = 200;
            this.damageTxt.x = 450;
            this.damageTxt.y = 36;
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        protected setData(value: any): void {
            super.setData(value);

            let rank: Protocols.TeamCopyRank = value;
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

            this.nameTxt.text = rank[Protocols.TeamCopyRankFields.name];
            this.damageTxt.text = rank[Protocols.TeamCopyRankFields.ware].toString();

        }
    }
}