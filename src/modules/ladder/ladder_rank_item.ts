/** 天梯排行榜单元项*/


namespace modules.ladder {

    import LadderRankItemUI = ui.LadderRankItemUI;
    import TiantiRank = Protocols.TiantiRank;
    import TiantiRankFields = Protocols.TiantiRankFields;
    import ActorRankFields = Protocols.ActorRankFields;

    export class LadderRankItem extends LadderRankItemUI {
        constructor() {
            super();
        }

        protected setData(value: any): void {
            super.setData(value);
            let rank: TiantiRank = value;
            let rankNum: number = this.index + 1; //rank[TiantiRankFields.actorRank][ActorRankFields.rank];
            if (rankNum === 1) {
                this.rankClip.visible = false;
                this.rankImg.skin = "common/zs_tongyong_7.png";
            } else if (rankNum === 2) {
                this.rankClip.visible = false;
                this.rankImg.skin = "common/zs_tongyong_8.png";
            } else if (rankNum === 3) {
                this.rankClip.visible = false;
                this.rankImg.skin = "common/zs_tongyong_9.png";
            } else {
                this.rankImg.skin = "common/dt_tongyong_15.png";
                this.rankClip.value = `${rankNum}`;
            }
            if (rank) {
                this.nameTxt.text = rank[TiantiRankFields.actorRank][ActorRankFields.name];
                this.scoreTxt.text = `${rank[TiantiRankFields.score]}`;
            } else {
                this.nameTxt.text = "虚位以待...";
                this.scoreTxt.text = "";
            }
        }
    }
}