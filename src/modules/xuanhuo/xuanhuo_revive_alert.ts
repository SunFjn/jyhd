///<reference path="../scene/scene_model.ts"/>
///<reference path="../config/effect_cfg.ts"/>


/** 复活弹框*/


namespace modules.xuanhuo {
    import XuanhuoReviveAlertUI = ui.XuanhuoReviveAlertUI;
    import Event = Laya.Event;
    import SceneCfg = modules.config.SceneCfg;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import scene = Configuration.scene;
    import sceneFields = Configuration.sceneFields;
    import Sprite = Laya.Sprite;
    import PlayerModel = modules.player.PlayerModel;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import LayaEvent = modules.common.LayaEvent;
    import EffectCfg = modules.config.EffectCfg;
    export class XuanhuoReviveAlert extends XuanhuoReviveAlertUI {
        private _reviveTime: number;
        private _reviveType: int;
        private _reviveGold: int;
        private _maskSpr: Sprite;
        private _totalTime: number;
        private _needGold: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.closeOnSide = false;
            this._maskSpr = new Sprite();
            this._maskSpr.pos(137.5, 137.5, true);
            this.lightCircle.mask = this._maskSpr;
            this.buffDescTxt.text = ""

            this.StatementHTML.color = "#ffffff";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 26;
            this.StatementHTML.style.align = "center";
            this.StatementHTML.width = 520
            this.StatementHTML.x = 17
            this.StatementHTML.y = 10
     
            this.killTxt.text = ""
        }

        protected addListeners(): void {
            super.addListeners();

        }
        private updateUI() {
            let lv = XuanHuoModel.instance.getPowerLevel();
            if (lv == 0) lv++;
            this.buffTxt.text = `玄火之力:${lv}层`;
            this.buffDescTxt.text = EffectCfg.instance.getCfgById(4903000 + Number(lv))[2];
            //您已被 [玩家]S10086.苏丹 击败了!
            let typename = XuanHuoModel.instance.defeatInfo[2] == 1 ? "[玩家]" : "[怪物]"
            let name = XuanHuoModel.instance.defeatInfo[3]
            this.StatementHTML.innerHTML = `您已被<span style='color:#e3531b'>${typename}${name}</span>击败了!`;
        }


        public onOpened(): void {
            super.onOpened();

            let cfg: scene = SceneCfg.instance.getCfgById(SceneModel.instance.enterScene[EnterSceneFields.mapId]);
            this._reviveType = cfg[sceneFields.reliveType];
            this._reviveTime = cfg[sceneFields.reliveTime] + PlayerModel.instance.playerDeadTime;
            this._reviveGold = cfg[sceneFields.reliveGold];
            Laya.timer.loop(1000, this, this.loopHandler);
            this._totalTime = -1;
            this._maskSpr.graphics.clear();
            this._maskSpr.graphics.drawCircle(0, 0, 137.5, "#FF0000");
            this.pointImg.x = 268;
            this.pointImg.y = 58;
            this.loopHandler();

            this.updateUI();
        }

        public onClosed(): void {
            super.onClosed();
            Laya.timer.clear(this, this.loopHandler);
        }



        private loopHandler(): void {
            let time: int = this._reviveTime - GlobalData.serverTime;
            if (this._totalTime === -1) {
                this._totalTime = time;
            }
            if (time <= 0) {
                Laya.timer.clear(this, this.loopHandler);
                this.close();
                SceneCtrl.instance.reqRevive();
            } else {
                this._maskSpr.graphics.clear();
                let angle: number = 1 - time / this._totalTime * 360;
                this._maskSpr.graphics.drawPie(0, 0, 137.5, -90 + angle, -90, "#FF0000");
                angle = angle * Math.PI / 180;
                this.pointImg.pos(268 + 88 * Math.sin(angle), 146 - 88 * Math.cos(angle), true);
                time = Math.ceil(time * 0.001);
                this.numClip.visible = true;
                this.numClip.value = time.toString();
                console.log(" this.numClip.value: " + this.numClip.value);
                if (this._reviveType === 1) {     // 每秒钟代币券
                    this._needGold = this._reviveGold * time;
                } else if (this._reviveType === 2) {      // 固定代币券
                    this._needGold = this._reviveGold;
                }
            }
        }
    }
}