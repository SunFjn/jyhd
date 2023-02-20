namespace modules.teamBattle {
    import ThreeWorldsRankUI = ui.ThreeWorldsRankUI;
    import CustomList = modules.common.CustomList;
    import Event = Laya.Event;
    import TeamCopyRank = Protocols.TeamCopyRank;
    import TeamCopyRankFields = Protocols.TeamCopyRankFields;
    import PlayerModel = modules.player.PlayerModel;
    import UserCenterOpcode = Protocols.UserCenterOpcode;

    export class TeamBattleRankAlert extends ThreeWorldsRankUI {

        private _list: CustomList;

        constructor() {
            super();
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.hCount = 1;
            this._list.spaceY = 4;
            this._list.itemRender = TeamBattleRankItem;
            this._list.width = 530;
            this._list.height = 550;
            this._list.pos(68, 184, true);
            let nulls: null[] = [];
            for (let i: int = 0; i < 10; i++) {
                nulls[i] = null;
            }
            this._list.datas = nulls;
            this.addChild(this._list);

            this.titleTxt.text = "牛头怪乐园排行榜";
            this.bgImg.height = this.height = 864;
            this.okBtn.destroy();

            this.awardTxt.text = "刷怪波数";
        }

        protected addListeners(): void {
            super.addListeners();

            this.okBtn.on(Event.CLICK, this, this.close);

            GlobalData.dispatcher.on(CommonEventType.TEAM_BATTLE_MAX_RECORD, this, this.updateRank);
        }

        protected removeListeners(): void {

            this.okBtn.off(Event.CLICK, this, this.close);
            GlobalData.dispatcher.off(CommonEventType.TEAM_BATTLE_MAX_RECORD, this, this.updateRank);

            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();
            Channel.instance.publish(UserCenterOpcode.GetTeamCopyRank, null);

            this.updateRank();
        }

        private updateRank(): void {

            let ranks: Array<TeamCopyRank> = TeamBattleModel.Instance.rankList;
            if (!ranks) return;

            if (ranks && ranks.length === 10) {
                this._list.datas = ranks;
            } else {
                let arr: Array<TeamCopyRank> = [];
                for (let i: int = 0; i < 10; i++) {
                    arr.push(ranks ? ranks[i] : null);
                }
                this._list.datas = arr;
            }
            let myRank: int = -1;

            for (let i: int = 0, len: int = ranks.length; i < len; i++) {
                let rank: TeamCopyRank = ranks[i];
                if (rank[TeamCopyRankFields.objId] === PlayerModel.instance.actorId) {
                    myRank = i;
                    break;
                }
            }
            this.myRankTxt.text = `我的排名：${myRank === -1 ? "未上榜" : myRank + 1}`;
            this.myDamageTxt.text = `我的波数：${TeamBattleModel.Instance.myRecordLevel}`;
        }
    }
}