/** 三界BOSS右下面板*/


namespace modules.threeWorlds {
    import ThreeWorldsRBViewUI = ui.ThreeWorldsRBViewUI;
    import BaseItem = modules.bag.BaseItem;
    import Event = Laya.Event;
    import DungeonModel = modules.dungeon.DungeonModel;
    import HurtRank = Protocols.HurtRank;
    import ActorRank = Protocols.ActorRank;
    import ActorRankFields = Protocols.ActorRankFields;
    import HurtRankFields = Protocols.HurtRankFields;
    import PlayerModel = modules.player.PlayerModel;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import scene_cross_boss = Configuration.scene_cross_boss;
    import SceneCrossBossCfg = modules.config.SceneCrossBossCfg;
    import scene_cross_bossFields = Configuration.scene_cross_bossFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import JoinAwardFields = Configuration.JoinAwardFields;
    import JoinAward = Configuration.JoinAward;
    import AwardState = Protocols.AwardState;
    import UpdateJoinAwardFields = Protocols.UpdateJoinAwardFields;
    import AwardStateFields = Protocols.AwardStateFields;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import Inspire = Protocols.Inspire;
    import InspireFields = Protocols.InspireFields;
    import CustomClip = modules.common.CustomClip;
    import CommonUtil = modules.common.CommonUtil;
    import AutoInspire = Protocols.AutoInspire;
    import AutoInspireFields = Protocols.AutoInspireFields;
    import sceneFields = Configuration.sceneFields;

    export class ThreeWorldsRBPanel extends ThreeWorldsRBViewUI {
        // 第一名奖励
        private _firstAwardItem: BaseItem;
        // 参与奖励
        private _commonAwardItem: BaseItem;
        // 是否展开
        private _isExpanded: boolean;

        private _joinAwards: Array<JoinAward>;
        private _cfg: scene_cross_boss;

        private _prizeEffect: CustomClip;      //奖品特效

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.right = 0;
            this.bottom = 240;
            this.closeByOthers = false;

            this.isExpanded = true;

            this._firstAwardItem = new BaseItem();
            this.addChild(this._firstAwardItem);
            this._firstAwardItem.pos(354, 156, true);

            this._commonAwardItem = new BaseItem();
            this.addChild(this._commonAwardItem);
            this._commonAwardItem.pos(354, 378, true);

            this._prizeEffect = new CustomClip();
            this._prizeEffect.skin = "assets/effect/ok_state.atlas";
            this._prizeEffect.frameUrls = ["ok_state/0.png", "ok_state/1.png", "ok_state/2.png", "ok_state/3.png", "ok_state/4.png",
                "ok_state/5.png", "ok_state/6.png", "ok_state/7.png"];
            this._prizeEffect.durationFrame = 5;
            this._prizeEffect.loop = true;
            this._prizeEffect.pos(224, 250, true);
            this._prizeEffect.scale(1.4, 1.4, true);
        }

        protected addListeners(): void {
            super.addListeners();

            this.inspireBtn.on(Event.CLICK, this, this.inspireHandler);
            this.expandBtn.on(Event.CLICK, this, this.expandHandler);
            this._commonAwardItem.on(Event.CLICK, this, this.joinAwardClickHandler);

            GlobalData.dispatcher.on(CommonEventType.DUNGEON_UPDATE_JOIN_AWARD, this, this.updateJoinAward);
            GlobalData.dispatcher.on(CommonEventType.DUNGEON_BOSS_RANKS_UPDATE, this, this.updateRank);
            GlobalData.dispatcher.on(CommonEventType.DUNGEON_INSPIRE_UPDATE, this, this.updateInspire);
        }

        protected removeListeners(): void {
            super.removeListeners();

            this.inspireBtn.off(Event.CLICK, this, this.inspireHandler);
            this.expandBtn.off(Event.CLICK, this, this.expandHandler);
            this._commonAwardItem.off(Event.CLICK, this, this.joinAwardClickHandler);

            GlobalData.dispatcher.off(CommonEventType.DUNGEON_UPDATE_JOIN_AWARD, this, this.updateJoinAward);
            GlobalData.dispatcher.off(CommonEventType.DUNGEON_BOSS_RANKS_UPDATE, this, this.updateRank);
            GlobalData.dispatcher.off(CommonEventType.DUNGEON_INSPIRE_UPDATE, this, this.updateInspire);
        }

        protected onOpened(): void {
            super.onOpened();

            this.nameTxt1.text = this.nameTxt2.text = this.nameTxt3.text = "";
            this.damageTxt1.text = this.damageTxt2.text = this.damageTxt3.text = "";

            let mapId: number = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            let sceneCfg = modules.config.SceneCfg.instance.getCfgById(mapId);
            let auto: AutoInspire = DungeonModel.instance.getAutoInspire(sceneCfg[sceneFields.type])
            if (auto[AutoInspireFields.copper] == 1) DungeonModel.instance.reqInspire(InspireType.copper, false, true);
            if (auto[AutoInspireFields.gold] == 1) DungeonModel.instance.reqInspire(InspireType.gold, false, true);
            let lv: number = SceneModel.instance.enterScene[EnterSceneFields.level];
            let cfg: scene_cross_boss = SceneCrossBossCfg.instance.getCfgByMapIdAndLv(mapId, lv);
            if (!cfg) return;
            this._cfg = cfg;
            let item: Items = cfg[scene_cross_bossFields.rankAwards][0][JoinAwardFields.award][0];
            this._firstAwardItem.dataSource = [item[ItemsFields.itemId], item[ItemsFields.count], 0, null];

            this._joinAwards = cfg[scene_cross_bossFields.joinAwards];
            this.updateJoinAward();
            this.updateRank();
            this.updateInspire();
        }

        public set isExpanded(value: boolean) {
            this._isExpanded = value;
            if (this._isExpanded) {
                this.bgImg.y = 318;
                this.bgImg.height = 203;
                this.line1.visible = this.line2.visible = true;
                this.nameTxt2.visible = this.damageTxt2.visible = true;
                this.nameTxt3.visible = this.damageTxt3.visible = true;
                this.nameTxt1.y = this.damageTxt1.y = 375;
                this.damageRankTxt.y = 335;
                this.expandBtn.y = 337;
                this.expandBtn.skin = "common/btn_tonyong_28.png";
            } else {
                this.bgImg.y = 386;
                this.bgImg.height = 135;
                this.line1.visible = this.line2.visible = false;
                this.nameTxt2.visible = this.damageTxt2.visible = false;
                this.nameTxt3.visible = this.damageTxt3.visible = false;
                this.nameTxt1.y = this.damageTxt1.y = 441;
                this.damageRankTxt.y = 403;
                this.expandBtn.y = 405;
                this.expandBtn.skin = "common/btn_tonyong_29.png";
            }
        }

        // 鼓舞
        private inspireHandler(): void {
            WindowManager.instance.openDialog(WindowEnum.INSPIRE_ALERT);
        }

        // 展开
        private expandHandler(): void {
            this.isExpanded = !this._isExpanded;
        }

        private joinAwardClickHandler(): void {
            if (!this._commonAwardItem.needTip) {
                DungeonCtrl.instance.getJoinAward();
            }
        }

        // 更新参与奖励
        private updateJoinAward(): void {
            this._prizeEffect.stop();
            this._prizeEffect.removeSelf();
            if (!DungeonModel.instance.joinAward) return;
            let awardStates: Array<AwardState> = DungeonModel.instance.joinAward[UpdateJoinAwardFields.states];
            let index: int = -1;
            let state: number;
            for (let i: int = 0, len: int = awardStates.length; i < len; i++) {
                state = awardStates[i][AwardStateFields.state];
                if (state === 0) {        // 0未达成，点击显示tip
                    index = awardStates[i][AwardStateFields.index];
                    this._commonAwardItem.needTip = true;
                    break;
                } else if (state === 1) {      // 1可领取，点击领取奖励
                    index = awardStates[i][AwardStateFields.index];
                    this._commonAwardItem.needTip = false;
                    this._prizeEffect.play();
                    this.addChildAt(this._prizeEffect, this.getChildIndex(this.joinLvName));
                    this.damageDescTxt.text = "点击领取";
                    this.damageDescTxt.color = CommonUtil.getColorByQuality(1);
                    break;
                } else if (state === 2) {      // 2已领取

                }
            }
            let item: Items;
            if (index === -1) {       // 最后一个也领了，则显示tipJoinAward
                this.joinLvName.text = "参与奖";
                this._commonAwardItem.needTip = true;
                item = this._cfg[scene_cross_bossFields.tipsJoinAwards][0];
                this._commonAwardItem.dataSource = [item[ItemsFields.itemId], item[ItemsFields.count], 0, null];
                this.damageDescTxt.text = "已领完全部奖励";
                this.damageDescTxt.color = "#2d2d2d";
            } else {
                this.joinLvName.text = "参与奖励·" + "一二三四五六七八九十"[index];
                item = this._joinAwards[index][JoinAwardFields.award][0];
                this._commonAwardItem.dataSource = [item[ItemsFields.itemId], item[ItemsFields.count], 0, null];
                if (state !== 1) {
                    this.damageDescTxt.text = `${CommonUtil.bigNumToString(this._joinAwards[index][JoinAwardFields.param])}伤害可领`;
                    this.damageDescTxt.color = "#2d2d2d";
                }
            }
        }

        // 更新伤害排行
        private updateRank(): void {
            let ranks: Array<HurtRank> = DungeonModel.instance.ranks;
            if (!ranks) {
                this.nameTxt1.text = "";
                this.damageTxt1.text = "";
                this.ownerTxt.text = "";
                this.nameTxt2.text = "";
                this.damageTxt2.text = "";
                this.nameTxt3.text = "";
                this.damageTxt3.text = "";
                this.myRankTxt.text = "";
                this.myDamageTxt.text = "";
                return;
            }
            let actorInfo: ActorRank;
            if (ranks.length > 0) {
                actorInfo = ranks[0][HurtRankFields.actorRank];
                this.nameTxt1.text = `${actorInfo[ActorRankFields.rank]}.${actorInfo[ActorRankFields.name]}`;
                this.damageTxt1.text = `${CommonUtil.bigNumToString(ranks[0][HurtRankFields.hurt])}`;
                this.ownerTxt.text = actorInfo[ActorRankFields.name];
            }
            if (ranks.length > 1) {
                actorInfo = ranks[1][HurtRankFields.actorRank];
                this.nameTxt2.text = `${actorInfo[ActorRankFields.rank]}.${actorInfo[ActorRankFields.name]}`;
                this.damageTxt2.text = `${CommonUtil.bigNumToString(ranks[1][HurtRankFields.hurt])}`;
            }
            if (ranks.length > 2) {
                actorInfo = ranks[2][HurtRankFields.actorRank];
                this.nameTxt3.text = `${actorInfo[ActorRankFields.rank]}.${actorInfo[ActorRankFields.name]}`;
                this.damageTxt3.text = `${CommonUtil.bigNumToString(ranks[2][HurtRankFields.hurt])}`;
            }

            let flag: boolean = false;
            for (let i: int = 0, len: int = ranks.length; i < len; i++) {
                actorInfo = ranks[i][HurtRankFields.actorRank];
                if (actorInfo[ActorRankFields.objId] === PlayerModel.instance.actorId) {
                    flag = true;
                    this.myRankTxt.text = `我的排名：${actorInfo[ActorRankFields.rank]}`;
                    this.myDamageTxt.text = CommonUtil.bigNumToString(ranks[i][HurtRankFields.hurt]);
                    break;
                }
            }
            if (!flag) {
                this.myRankTxt.text = `我的排名：未上榜`;
                this.myDamageTxt.text = "0";
            }
        }

        private updateInspire(): void {
            if (!DungeonModel.instance.inspires) return;
            let inspires: Array<Inspire> = DungeonModel.instance.inspires;
            let damage: number = 0;
            for (let i: int = 0, len: int = inspires.length; i < len; i++) {
                damage += inspires[i][InspireFields.per];
            }
            this.damageTxt.text = `攻击+${(damage * 100).toFixed(0)}%`;
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._prizeEffect) {
                this._prizeEffect.destroy(true);
                this._prizeEffect = null;
            }
            super.destroy(destroyChild);
        }
    }
}