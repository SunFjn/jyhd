///<reference path="../multi_boss/multi_boss_model.ts"/>
///<reference path="../scene/scene_model.ts"/>


/** 副本右下角面板*/


namespace modules.dungeon {
    import DungeonRBViewUI = ui.DungeonRBViewUI;
    import Event = Laya.Event;
    import HurtRank = Protocols.HurtRank;
    import HurtRankFields = Protocols.HurtRankFields;
    import ActorRankFields = Protocols.ActorRankFields;
    import Text = Laya.Text;
    import PlayerModel = modules.player.PlayerModel;
    import Inspire = Protocols.Inspire;
    import InspireFields = Protocols.InspireFields;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import scene = Configuration.scene;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import SceneMultiBossCfg = modules.config.SceneMultiBossCfg;
    import EnterScene = Protocols.EnterScene;
    import scene_multi_boss = Configuration.scene_multi_boss;
    import scene_multi_bossFields = Configuration.scene_multi_bossFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import Layer = ui.Layer;
    import BaseItem = modules.bag.BaseItem;
    import CommonUtil = modules.common.CommonUtil;
    import LayaEvent = modules.common.LayaEvent;
    import AutoInspire = Protocols.AutoInspire;
    import AutoInspireFields = Protocols.AutoInspireFields;

    export class DungeonRBPanel extends DungeonRBViewUI {
        private _isExpand: boolean;
        private _nameTxts: Array<Text>;
        private _damageTxts: Array<Text>;

        private _bagItem: BaseItem;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.right = 0;
            this.bottom = 240;

            this._nameTxts = [this.nameTxt1, this.nameTxt2, this.nameTxt3, this.nameTxt4, this.nameTxt5];
            this._damageTxts = [this.damageTxt1, this.damageTxt2, this.damageTxt3, this.damageTxt4, this.damageTxt5];

            this.layer = Layer.MAIN_UI_LAYER;
            this.closeByOthers = false;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.expandBtn, LayaEvent.CLICK, this, this.expandHandler);
            this.addAutoListener(this.inspireBtn, LayaEvent.CLICK, this, this.inspireHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_BOSS_RANKS_UPDATE, this, this.updateRank);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_INSPIRE_UPDATE, this, this.updateInspire);
        }

        protected onOpened(): void {
            super.onOpened();
            this.isExpand = true;

            // DungeonModel.instance.ranks = [];

            this.updateRank();
            this.updateInspire();

            this.updateAward();

            let mapId: number = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            let cfg = SceneCfg.instance.getCfgById(mapId);
            let auto: AutoInspire = DungeonModel.instance.getAutoInspire(cfg[sceneFields.type])
            if (auto[AutoInspireFields.copper] == 1) DungeonModel.instance.reqInspire(InspireType.copper, false, true);
            if (auto[AutoInspireFields.gold] == 1) DungeonModel.instance.reqInspire(InspireType.gold, false, true);
        }

        private updateAward(): void {
            let sceneInfo: EnterScene = SceneModel.instance.enterScene;
            let mapId: int = sceneInfo[EnterSceneFields.mapId];
            let cfg: scene = SceneCfg.instance.getCfgById(mapId);
            if (cfg[sceneFields.type] === 4) {        // 多人BOSS
                this._bagItem = this._bagItem || new BaseItem();
                this.addChild(this._bagItem);
                this._bagItem.pos(356, 162, true);
                let bossCfg: scene_multi_boss = SceneMultiBossCfg.instance.getCfgByLv(sceneInfo[EnterSceneFields.level]);
                let t: Items = bossCfg[scene_multi_bossFields.firstRankAward];
                this._bagItem.dataSource = [t[ItemsFields.itemId], t[ItemsFields.count], 0, null];
            }
        }

        private expandHandler(): void {
            this.isExpand = !this._isExpand;
        }

        private inspireHandler(): void {
            // DungeonCtrl.instance.reqInspire()
            WindowManager.instance.openDialog(WindowEnum.INSPIRE_ALERT);
        }

        public set isExpand(value: boolean) {
            this._isExpand = value;
            if (this._isExpand) {
                this.line3.visible = this.line4.visible = this.line5.visible = this.line6.visible = true;
                this.nameTxt2.visible = this.nameTxt3.visible = this.nameTxt4.visible = this.nameTxt5.visible = true;
                this.damageTxt2.visible = this.damageTxt3.visible = this.damageTxt4.visible = this.damageTxt5.visible = true;
                this.bgImg.y = 54;
                this.bgImg.height = 268;
                this.expandBtn.skin = "common/btn_tonyong_28.png";
            } else {
                this.line3.visible = this.line4.visible = this.line5.visible = this.line6.visible = false;
                this.nameTxt2.visible = this.nameTxt3.visible = this.nameTxt4.visible = this.nameTxt5.visible = false;
                this.damageTxt2.visible = this.damageTxt3.visible = this.damageTxt4.visible = this.damageTxt5.visible = false;
                this.bgImg.y = 186;
                this.bgImg.height = 136;
                this.expandBtn.skin = "common/btn_tonyong_29.png";
            }
            this.damageTxt.y = this.bgImg.y + 16;
            this.expandBtn.y = this.bgImg.y + 18;
            this.line1.y = this.bgImg.y + 45;
            this.line2.y = this.bgImg.y + 80;
            this.nameTxt1.y = this.damageTxt1.y = this.bgImg.y + 55;
        }

        private updateRank(): void {
            let ranks: Array<HurtRank> = DungeonModel.instance.ranks;
            if (!ranks) {
                for (let i: int = 0, len: int = this._nameTxts.length; i < len; i++) {
                    this._damageTxts[i].text = "";
                    this._nameTxts[i].text = this._damageTxts[i].text = "";
                }
                this.damageTxt6.text = "";
                this.ownerNameTxt.text = "";
                return;
            }
            for (let i: int = 0, len: int = this._nameTxts.length; i < len; i++) {
                if (ranks.length > i && ranks[i] && ranks[i][HurtRankFields.actorRank]) {
                    this._nameTxts[i].text = ranks[i][HurtRankFields.actorRank][ActorRankFields.rank] + "." + ranks[i][HurtRankFields.actorRank][ActorRankFields.name];
                    this._damageTxts[i].text = CommonUtil.bigNumToString(ranks[i][HurtRankFields.hurt]);
                } else {
                    this._nameTxts[i].text = this._damageTxts[i].text = "";
                }
            }
            let flag: boolean = false;
            for (let i: int = 0, len: int = ranks.length; i < len; i++) {
                if (ranks[i] && ranks[i][HurtRankFields.actorRank] && ranks[i][HurtRankFields.actorRank][ActorRankFields.objId] === PlayerModel.instance.actorId) {
                    this.damageTxt6.text = CommonUtil.bigNumToString(ranks[i][HurtRankFields.hurt]);
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                this.damageTxt6.text = "0";
            }
            if (ranks.length > 0 && ranks[0] && ranks[0][HurtRankFields.actorRank]) {
                this.ownerNameTxt.text = ranks[0][HurtRankFields.actorRank][ActorRankFields.name];
            } else {
                this.ownerNameTxt.text = "";
            }
        }

        private updateInspire(): void {
            if (!DungeonModel.instance.inspires) return;
            let inspires: Array<Inspire> = DungeonModel.instance.inspires;
            let damage: number = 0;
            for (let i: int = 0, len: int = inspires.length; i < len; i++) {
                damage += inspires[i][InspireFields.per];
            }
            this.damagePerTxt.text = `攻击+${(damage * 100).toFixed(0)}%`;
        }
    }
}