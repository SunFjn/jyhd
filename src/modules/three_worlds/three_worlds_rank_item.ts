/** 三界BOSS排名单元项*/


namespace modules.threeWorlds {
    import ThreeWorldsRankItemUI = ui.ThreeWorldsRankItemUI;
    import BossRankRecord = Protocols.BossRankRecord;
    import BossRankRecordFields = Protocols.BossRankRecordFields;
    import ActorRankFields = Protocols.ActorRankFields;
    import ActorRank = Protocols.ActorRank;
    import BaseItem = modules.bag.BaseItem;
    import Item = Protocols.Item;
    import HurtRank = Protocols.HurtRank;
    import HurtRankFields = Protocols.HurtRankFields;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import SceneCrossBossCfg = modules.config.SceneCrossBossCfg;
    import scene_cross_bossFields = Configuration.scene_cross_bossFields;
    import JoinAwardFields = Configuration.JoinAwardFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import scene_cross_boss = Configuration.scene_cross_boss;

    export class ThreeWorldsRankItem extends ThreeWorldsRankItemUI {
        private _bagItem: BaseItem;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._bagItem = new BaseItem();
            this.addChild(this._bagItem);
            this._bagItem.scale(0.8, 0.8, true);
            this._bagItem.pos(400, 8, true);
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        protected setData(value: any): void {
            super.setData(value);
            this.rankTxt.visible = false;
            if (ThreeWorldsRankPanel.type === 1) {
                let record: BossRankRecord = value as BossRankRecord;
                let actorInfo: ActorRank = record[BossRankRecordFields.actorRank];
                this.nameTxt.text = actorInfo[ActorRankFields.name];
                this.damageTxt.text = `伤害：${CommonUtil.bigNumToString(record[BossRankRecordFields.hurt])}`;
                let rank: number = actorInfo[ActorRankFields.rank];
                if (rank === 1) {
                    this.rankImg.skin = "common/zs_tongyong_7.png";
                } else if (rank === 2) {
                    this.rankImg.skin = "common/zs_tongyong_8.png";
                } else if (rank === 3) {
                    this.rankImg.skin = "common/zs_tongyong_9.png";
                } else {
                    this.rankImg.skin = "common/dt_tongyong_15.png";
                    this.rankTxt.visible = true;
                    this.rankTxt.text = rank.toString();
                }
                let awards: Array<Item> = record[BossRankRecordFields.rankAward];
                this._bagItem.dataSource = awards && awards.length > 0 ? awards[0] : null;
            } else if (ThreeWorldsRankPanel.type === 2) {
                let hurtRank: HurtRank = value as HurtRank;
                this.nameTxt.text = hurtRank[HurtRankFields.actorRank][ActorRankFields.name];
                this.damageTxt.text = `伤害：${CommonUtil.bigNumToString(hurtRank[HurtRankFields.hurt])}`;
                let rank: number = hurtRank[HurtRankFields.actorRank][ActorRankFields.rank];
                if (rank === 1) {
                    this.rankImg.skin = "common/zs_tongyong_7.png";
                } else if (rank === 2) {
                    this.rankImg.skin = "common/zs_tongyong_8.png";
                } else if (rank === 3) {
                    this.rankImg.skin = "common/zs_tongyong_9.png";
                } else {
                    this.rankImg.skin = "common/dt_tongyong_15.png";
                    this.rankTxt.visible = true;
                    this.rankTxt.text = rank.toString();
                }
                let mapId: number = ThreeWorldsModel.instance.mapId;
                let lv: number = ThreeWorldsModel.instance.mapLv;
                let cfg:scene_cross_boss = SceneCrossBossCfg.instance.getCfgByMapIdAndLv(mapId, lv);
                if(cfg) {
                    let awards: Array<Items> = cfg[scene_cross_bossFields.rankAwards][rank - 1][JoinAwardFields.award];
                    this._bagItem.dataSource = awards && awards.length > 0 ? [awards[0][ItemsFields.itemId], awards[0][ItemsFields.count], 0, null] : null;
                }
            }
        }
    }
}