/** 三界BOSS排行*/
namespace modules.threeWorlds {
    import ThreeWorldsRankUI = ui.ThreeWorldsRankUI;
    import Event = Laya.Event;
    import CustomList = modules.common.CustomList;
    import GetBossRankRecordReply = Protocols.GetBossRankRecordReply;
    import GetBossRankRecordReplyFields = Protocols.GetBossRankRecordReplyFields;
    import DungeonModel = modules.dungeon.DungeonModel;
    import HurtRank = Protocols.HurtRank;
    import HurtRankFields = Protocols.HurtRankFields;
    import ActorRankFields = Protocols.ActorRankFields;
    import PlayerModel = modules.player.PlayerModel;
    import ActorRank = Protocols.ActorRank;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;

    export class ThreeWorldsRankPanel extends ThreeWorldsRankUI {
        public static type: number;

        private _list: CustomList;
        private _type: number;
        private _duration: number;

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
            this._list.spaceY = 10;
            this._list.itemRender = ThreeWorldsRankItem;
            this._list.width = 553;
            this._list.height = 530;
            this._list.pos(58, 184, true);
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();

            this.okBtn.on(Event.CLICK, this, this.okHandler);
            GlobalData.dispatcher.on(CommonEventType.THREE_WORLDS_UPDATE_BOSS_RANK_RECORD, this, this.updateRank);
            GlobalData.dispatcher.on(CommonEventType.DUNGEON_BOSS_RANKS_UPDATE, this, this.updateHurtRank);
        }

        protected removeListeners(): void {
            super.removeListeners();

            this.okBtn.off(Event.CLICK, this, this.okHandler);
            GlobalData.dispatcher.off(CommonEventType.THREE_WORLDS_UPDATE_BOSS_RANK_RECORD, this, this.updateRank);
            GlobalData.dispatcher.off(CommonEventType.DUNGEON_BOSS_RANKS_UPDATE, this, this.updateHurtRank);
            Laya.timer.clear(this, this.loopHandler);
        }

        public onOpened(): void {
            super.onOpened();

            if (this._type === 2) {          // 结算时排行
                this.updateHurtRank();
                Laya.timer.loop(1000, this, this.loopHandler);
                this._duration = BlendCfg.instance.getCfgById(10303)[blendFields.intParam][0];
                this.loopHandler();
            }
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            let bossId: number = value[0];
            this._type = value[1];

            if (this._type === 1) {         // 1上一期排行，2结算时排行
                this.bgImg.height = this.height = 864;
                this.okBtn.visible = false;
                this.titleTxt.text = "上期排名奖励列表";
                ThreeWorldsCtrl.instance.getBossRankRecord(bossId);
                this.closeOnSide = true;
            } else if (this._type === 2) {
                this.bgImg.height = this.height = 941;
                this.okBtn.visible = true;
                this.titleTxt.text = "本次伤害排名";
                this.closeOnSide = false;
            }
            ThreeWorldsRankPanel.type = this._type;
        }

        private okHandler(): void {
            this.close();
            DungeonCtrl.instance.reqEnterScene(0);
        }

        private updateRank(): void {
            if (this._type !== 1) return;
            let rank: GetBossRankRecordReply = ThreeWorldsModel.instance.bossRankRecord;
            if (!rank) return;
            this._list.datas = rank[GetBossRankRecordReplyFields.rankRecords];
            let myRank: number = rank[GetBossRankRecordReplyFields.selfRank];
            this.myRankTxt.text = `我的排名：${myRank === 0 ? "未上榜" : myRank}`;
            let myBigDamage = modules.common.CommonUtil.bigNumToString(rank[GetBossRankRecordReplyFields.selfHurt])
            this.myDamageTxt.text = `我的伤害：${myBigDamage}`;
        }

        private updateHurtRank(): void {
            if (this._type !== 2) return;
            let ranks: Array<HurtRank> = DungeonModel.instance.ranks;
            if (!ranks) return;
            this._list.datas = ranks.length > 10 ? ranks.slice(0, 10) : ranks;
            let myRank: int = 0;
            let myDamage: number = 0;
            for (let i: int = 0, len: int = ranks.length; i < len; i++) {
                let rank: ActorRank = ranks[i][HurtRankFields.actorRank];
                if (rank[ActorRankFields.objId] === PlayerModel.instance.actorId) {
                    myRank = rank[ActorRankFields.rank];
                    myDamage = ranks[i][HurtRankFields.hurt];
                    break;
                }
            }

            this.myRankTxt.text = `我的排名：${myRank === 0 ? "未上榜" : myRank}`;
            this.myDamageTxt.text = `我的伤害：${modules.common.CommonUtil.bigNumToString(myDamage)}`;
        }

        private loopHandler(): void {
            if (this._duration === 0) {
                this.okHandler();
                Laya.timer.clear(this, this.loopHandler);
            }
            this.okBtn.label = `确定(${this._duration / 1000})`;
            this._duration -= 1000;
        }
    }
}