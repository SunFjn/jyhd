/**离开场景弹窗 */

namespace modules.bossHome {
    import LeaveSenceAlertUI = ui.LeaveSenceAlertUI;
    import Sprite = Laya.Sprite;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import BroadcastDead = Protocols.BroadcastDead;
    import BroadcastDeadFields = Protocols.BroadcastDeadFields;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;


    export class LeaveScenceAlert extends LeaveSenceAlertUI {

        private _leaveTime: number;
        private _maskSpr: Sprite;

        protected initialize(): void {
            super.initialize();
            this._maskSpr = new Sprite();
            this._maskSpr.pos(137.5, 137.5, true);//放到圆心位置
            this.lightCircle.mask = this._maskSpr;
            this.closeOnSide = false;
            this.tipTxt.text = `复活倒计时`;
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            let info = value as BroadcastDead;
            let cfg = SceneCfg.instance.getCfgById(2121);
            let time = cfg[sceneFields.reliveTime];
            this.numClip.value = Math.floor(time / 1000).toString();
            this.lightCircle.visible = true;
            this.pointImg.visible = true;
            this._leaveTime = GlobalData.serverTime + 5 * 1000;
            let str = "";
            if (info[BroadcastDeadFields.killerType] == 1) {//玩家杀死
                str = `[玩家]${info[BroadcastDeadFields.killerName]}`;
            } else if (info[BroadcastDeadFields.killerType] == 2) { //怪物杀死
                str = `[BOSS]${info[BroadcastDeadFields.killerName]}`;
            }
            this.killInfoHtml.style.align = "center";
            this.killInfoHtml.innerHTML = `<span style='color:#ffffff;font-size:24px'>您已被</span><span style='color:#e6372e;font-size: 24px'>${str}</span><span style='color:#ffffff;font-size: 24px'>杀死了!</span>`;
            this._maskSpr.graphics.clear();
            this._maskSpr.graphics.drawCircle(0, 0, 137.5, "#FF0000");
            this.pointImg.x = 273;
            this.pointImg.y = 85;
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        public onClosed(): void {
            Laya.timer.clear(this, this.loopHandler);
            Laya.timer.clearAll(this);
            // DungeonCtrl.instance.reqEnterScene(0);
            // WindowManager.instance.open(WindowEnum.BOSS_HOME_PANEL);
            SceneCtrl.instance.reqRevive();
            super.onClosed();
        }

        private loopHandler(): void {
            let time: int = this._leaveTime - GlobalData.serverTime;
            if (time <= 0) {
                this._maskSpr.graphics.clear();
                this.lightCircle.visible = false;
                this.numClip.value = '0';
                this.pointImg.pos(273, 85);
                Laya.timer.clear(this, this.loopHandler);
                this.close();
            } else {
                this._maskSpr.graphics.clear();
                let angle: number = 1 - time / (5 * 1000) * 360; //已负的作为开始，跳过中间正负处理
                this._maskSpr.graphics.drawPie(0, 0, 137.5, -90 + angle, -90, "#FF0000");
                angle = angle * Math.PI / 180;
                this.pointImg.pos(273 + 88 * Math.sin(angle), 174 - 88 * Math.cos(angle), true); //圆心进行计算
                time = Math.ceil(time * 0.001);
                this.numClip.value = time.toString();
            }
        }
    }
}