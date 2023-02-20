///<reference path="../scene/scene_model.ts"/>
///<reference path="../config/effect_cfg.ts"/>


/** 复活弹框*/


namespace modules.dungeon {
    import ReviveAlertUI = ui.ReviveAlertUI;
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

    export class ReviveAlert extends ReviveAlertUI {
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

            this.buffDescTxt.text = BlendCfg.instance.getCfgById(10502)[blendFields.des];
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.reviveBtn, LayaEvent.CLICK, this, this.reviveHandler);
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

            let mapType: number = cfg[sceneFields.type];
            if (mapType === SceneTypeEx.crossBoss) {     // 三界BOSS，多显示一个BUFF
                this.height = this.bgImg.height = 537;
                this.reviveBtn.label = "涅槃重生";
                this.buffDescTxt.visible = true;
                this.img1.visible = this.ingotTxt.visible = this.buffDescTxt.visible = this.reviveBtn.visible = (this._reviveGold != 0);
            } else {
                this.height = this.bgImg.height = 469;
                this.reviveBtn.label = "立即复活";
                this.buffDescTxt.visible = false;
                this.img1.visible = this.ingotTxt.visible = this.reviveBtn.visible = (this._reviveGold != 0);
            }

        }

        public onClosed(): void {
            super.onClosed();
            Laya.timer.clear(this, this.loopHandler);
        }

        private reviveHandler(): void {
            if (this._needGold && this._needGold > 0) {
                if (PlayerModel.instance.ingot < this._needGold) {           // 代币券不够
                    // CommonUtil.alert("提示", "代币券不足");
                    modules.common.CommonUtil.noticeError(12107);
                    return;
                }
            }

            SceneCtrl.instance.reqRevive();
            this.close();
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
                    this.ingotTxt.text = `${this._reviveGold * time}`;
                } else if (this._reviveType === 2) {      // 固定代币券
                    this._needGold = this._reviveGold;
                    this.ingotTxt.text = `${this._reviveGold}`;
                }
            }
        }
    }
}