///<reference path="../config/scene_homestead_cfg.ts"/>

/** 传送面板*/
namespace modules.scene {
    import TransferViewUI = ui.TransferViewUI;
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

    export class TransferPanel extends TransferViewUI {
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
            // 被打中断
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.SCENE_NPC_GATHER_STATE_UPDATE, this, this.updateGatherState);

        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            console.log('研发测试_chy:接收到传送id', value);
            this._objId = value
        }

        protected onOpened(): void {
            super.onOpened();
            this.bottom = 400;
            this.clickHandler();
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.loopHandler);
            if (NpcModel.instance.isTransfer) {
                NpcCtrl.instance.userTransfer(this._objId)
            }
            NpcModel.instance.isTransfer = false;
        }



        private clickHandler(): void {
            console.log('研发测试_chy:NpcModel.instance.isTransfer', NpcModel.instance.isTransfer);
            if (NpcModel.instance.isTransfer) return;
            NpcModel.instance.isTransfer = true;
            this._totalTime = 3000
            if (this._totalTime > 0) {
                this._startTime = GlobalData.serverTime;
                Laya.timer.frameLoop(1, this, this.loopHandler);
                this.loopHandler();
            } else {
                Laya.timer.clear(this, this.loopHandler);
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
                this.close()
            }
        }



        // 更新传送状态
        private updateState(): void {
            NpcModel.instance.isTransfer = false;
            this.close();
        }


    }
}