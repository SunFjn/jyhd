/** 天关排行榜弹框*/


namespace modules.mission {
    import ThreeWorldsRankUI = ui.ThreeWorldsRankUI;
    import CustomList = modules.common.CustomList;
    import PlayerRankingCtrl = modules.rankingList.PlayerRankingCtrl;
    import Rank = Protocols.Rank;
    import PlayerRankingModel = modules.rankingList.PlayerRankingModel;
    import scene_copy_tianguan = Configuration.scene_copy_tianguan;
    import SceneCopyTianguanCfg = modules.config.SceneCopyTianguanCfg;
    import scene_copy_tianguanFields = Configuration.scene_copy_tianguanFields;
    import BigTowerModel = modules.bigTower.BigTowerModel;

    export class MissionRankAlert extends ThreeWorldsRankUI {
        private _list: CustomList;
        private _rankType: RankType;
        private _rankCount: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.hCount = 1;
            this._list.spaceY = 4;
            this._list.itemRender = MissionRankItem;
            this._list.width = 530;
            this._list.height = 550;
            this._list.pos(68, 184, true);
            this.addChild(this._list);

            this.titleTxt.text = "";
            this.bgImg.height = this.height = 864;
            this.okBtn.destroy();

            this.awardTxt.text = "";
            this._rankCount = 10;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.okBtn, Laya.Event.CLICK, this, this.close);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RANK_UPDATE, this, this.updateRank);
        }

        public onOpened(): void {
            super.onOpened();
            PlayerRankingCtrl.instance.getRank(this._rankType);

            // this.updateRank();
            if (this._rankType === RankType.tianguanLevel) {
                this.titleTxt.text = "天关排行";
                this.awardTxt.text = "关数";
            } else if (this._rankType === RankType.dahuangLevel) {
                this.titleTxt.text = "亡者之塔排行";
                this.awardTxt.text = "层数";
            }
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._rankType = value;
        }

        private updateRank(): void {

            let ranks: Array<Rank> = PlayerRankingModel.instance.getRanksByType(this._rankType);
            if (!ranks) return;
            if (ranks && ranks.length === this._rankCount) {
                this._list.datas = ranks;
            } else {
                let arr: Array<Rank> = [];
                for (let i: int = 0; i < this._rankCount; i++) {
                    arr.push(ranks ? ranks[i] : null);
                }
                this._list.datas = arr;
            }

            let myrank: number = PlayerRankingModel.instance.actorrank(ranks, PlayerModel.instance.actorId)[0];
            this.myRankTxt.text = `我的排名：${myrank == 0 ? "未上榜" : `第${myrank.toString()}名`}`;

            if (this._rankType === RankType.tianguanLevel) {
                let cfg: scene_copy_tianguan = SceneCopyTianguanCfg.instance.getCfgByLv(MissionModel.instance.curLv);
                if (!cfg) {
                    cfg = SceneCopyTianguanCfg.instance.getCfgByLv(MissionModel.instance.curLv - 1);
                    this.myDamageTxt.text = `我的关数：${cfg ? cfg[scene_copy_tianguanFields.level] : 0}`;
                } else {
                    this.myDamageTxt.text = `我的关数：${cfg ? cfg[scene_copy_tianguanFields.level] - 1 : 0}`;
                }
            } else if (this._rankType === RankType.dahuangLevel) {
                this.myDamageTxt.text = `我的层数：${BigTowerModel.instance.finishLevel}`;
            }
        }
    }
}