///<reference path="../config/scene_homestead_cfg.ts"/>

/** 收集面板*/
namespace modules.scene {
    import GatherViewUI = ui.GatherViewUI;
    import Sprite = Laya.Sprite;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import SceneCopyNineCfg = modules.config.SceneCopyNineCfg;
    import SceneCopyTeamBattleCfg = modules.config.SceneCopyTeamBattleCfg;

    import scene_copy_nineFields = Configuration.scene_copy_nineFields;
    import scene_copy_teamBattleFields = Configuration.scene_copy_teamBattleFields;
    import NpcCfg = modules.config.NpcCfg;
    import npc = Configuration.npc;
    import npcFields = Configuration.npcFields;
    import GameCenter = game.GameCenter;
    import NpcModel = modules.npc.NpcModel;
    import BlendCfg = modules.config.BlendCfg;
    import DayDropTreasureModel = modules.day_drop_treasure.DayDropTreasureModel;
    import blendFields = Configuration.blendFields;
    import Layer = ui.Layer;
    import XianfuModel = modules.xianfu.XianfuModel;
    import SceneHomesteadCfg = modules.config.SceneHomesteadCfg;
    import NpcCtrl = modules.npc.NpcCtrl;

    export class GatherPanel extends GatherViewUI {
        private _maskSpr: Sprite;
        private _totalTime: number;
        private _startTime: number;
        private _occ: number;
        private _objId: number;

        private _reached: boolean;

        private _func: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0.5;
            this.bottom = 400;
            this.closeByOthers = false;

            this._maskSpr = new Sprite();
            this._maskSpr.pos(71, 71, true);
            // this.addChild(this._maskSpr);
            this.lightCircle.mask = this._maskSpr;

            this.layer = Layer.MAIN_UI_LAYER;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this, Laya.Event.CLICK, this, this.clickHandler);

            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_TRIGGER_NPC, this, this.reachNPCHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SCENE_NPC_GATHER_STATE_UPDATE, this, this.updateGatherState);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SCENE_TRIGGERED_NPC_UPDATE, this, this.updateTriggeredNpc);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._objId = value || NpcModel.instance.triggeredNpcId;
            NpcModel.instance.triggeredNpcId = this._objId;
        }

        protected onOpened(): void {
            super.onOpened();
            this.reset();
            this.updateTriggeredNpc();
            let mapId: number = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            if (mapId == 2121) {
                this.bottom = 500;
            } else {
                this.bottom = 400;
            }
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.disappearLoopHandler);
            Laya.timer.clear(this, this.loopHandler);
            if (NpcModel.instance.isGathering) {
                NpcCtrl.instance.gatherInterrupt();
            }
        }

        /**
         * 文字背景 根据文字长度适配
         */
        public setDescTxt(str: any) {
            this.descTxt.text = str;
            this.descImg.width = this.descTxt.textWidth + 40;
            this.descImg.visible = this.descTxt.text != "";
        }

        private disappearLoopHandler(endTime: number): void {
            // this.descTxt.text = `宝箱于${CommonUtil.timeStampToHHMMSS(endTime)}后消失`;
            this.setDescTxt(`宝箱于${modules.common.CommonUtil.timeStampToHHMMSS(endTime)}后消失`);
            if (endTime < GlobalData.serverTime) {
                this.close();
            }
        }

        private clickHandler(): void {

            if (this._func === 1) {
                PlayerModel.instance.selectTarget(SelectTargetType.Npc, this._occ);
            } else {
                if (NpcModel.instance.isGathering) return;
                this._totalTime = 0;
                let sceneId: number = SceneModel.instance.enterScene[EnterSceneFields.mapId];
                let sceneType: SceneTypeEx = SceneCfg.instance.getCfgById(sceneId)[sceneFields.type];
                if (sceneType === SceneTypeEx.nineCopy) {        // 九天之巅，走去NPC旁边再采集
                    this._totalTime = SceneCopyNineCfg.instance.getCfgByLevel(9)[scene_copy_nineFields.gatherTime];
                    this.startGather();
                } if (sceneType === SceneTypeEx.teamBattleCopy) {        // 战队逐鹿，走去NPC旁边再采集
                    PlayerModel.instance.selectTarget(SelectTargetType.Dummy, -1);
                    this._totalTime = SceneCopyTeamBattleCfg.instance.getCfgByIndex(1)[scene_copy_teamBattleFields.gatherTime];
                    this.startGather();
                }
            }
        }

        private reset(): void {
            this._maskSpr.graphics.clear();
            this._maskSpr.graphics.drawCircle(0, 360, 71, "#FF0000");
            this.pointImg.pos(71, 14, true);
        }

        private loopHandler(): void {
            if (GlobalData.serverTime < this._startTime + this._totalTime) {
                this._maskSpr.graphics.clear();
                let angle: number = (GlobalData.serverTime - this._startTime) / this._totalTime * 360;
                this._maskSpr.graphics.drawPie(0, 0, 71, -90, -90 + angle, "#FF0000");
                angle = angle * Math.PI / 180;
                this.pointImg.pos(71 + 57 * Math.sin(angle), 71 - 57 * Math.cos(angle), true);
            } else {
                this.reset();
                Laya.timer.clear(this, this.loopHandler);
            }
        }

        private reachNPCHandler(): void {

        }

        private startGather(): void {

            NpcCtrl.instance.gather(NpcModel.instance.triggeredNpcId, 0);
            // this.descTxt.text = "采集中";
            this.setDescTxt("采集中");
            if (this._totalTime > 0) {
                this._startTime = GlobalData.serverTime;
                Laya.timer.frameLoop(1, this, this.loopHandler);
                this.loopHandler();
            } else {
                Laya.timer.clear(this, this.loopHandler);
            }
        }

        // 更新采集状态
        private updateGatherState(): void {
            let role = game.GameCenter.instance.getRole(PlayerModel.instance.actorId)
            role.property.set('skipRevenge', NpcModel.instance.isGathering)
            if (!NpcModel.instance.isGathering) {
                // this.reset();
                // Laya.timer.clear(this, this.loopHandler);
                this.close();
            }
        }

        // 更新触发NPC
        private updateTriggeredNpc(): void {
            // this.descTxt.text = "点击采集";
            this.setDescTxt("点击采集");
            this._occ = 0;
            let role = GameCenter.instance.getRole(NpcModel.instance.triggeredNpcId);
            if (role == null) {
                return;
            }

            this._occ = role.property.get("occ");
            let cfg: npc = NpcCfg.instance.getCfgById(this._occ);
            this._func = cfg[npcFields.funId] || 0;
            if (this._func === 1) {      // BOSS之家宝箱（显示宝箱模型倒计时）
                let endTime: number = role.property.get("liveTime");
                Laya.timer.loop(1000, this, this.disappearLoopHandler, [endTime]);
                this.disappearLoopHandler(endTime);
            } else {
                // this.descTxt.text = "点击采集";
                this.setDescTxt("点击采集");
            }

            if (this._func === 5) {        // 天降财宝，触发NPC后直接开始采集
                if (this._occ === DayDropTreasureModel.instance.xianLingId)
                    this._totalTime = BlendCfg.instance.getCfgById(28003)[blendFields.intParam][0];
                else if (this._occ === DayDropTreasureModel.instance.xianFaId)
                    this._totalTime = BlendCfg.instance.getCfgById(28003)[blendFields.intParam][1];
                this.startGather();
            } else if (this._func == 6) {   //仙府-家园收集的那些东西
                let eventInfo: Protocols.XianFuEvent = XianfuModel.instance.xianfuEvent;
                let id: number = eventInfo[Protocols.XianFuEventFields.eventId];
                let fengshuiLv: number = XianfuModel.instance.fengshuiLv;
                let wheel: number = eventInfo[Protocols.XianFuEventFields.wheel]; //轮
                let cfg: Configuration.scene_homestead = SceneHomesteadCfg.instance.getCfgByLvAndWheel(fengshuiLv, wheel);
                if (id == 4) {//灵脉爆发 采集物 4
                    this._totalTime = cfg[Configuration.scene_homesteadFields.collect][5];
                } else if (id == 5) {//宝矿爆发 宝箱 5
                    this._totalTime = cfg[Configuration.scene_homesteadFields.treasure][5];
                }
                this.startGather();
            }
        }
    }
}