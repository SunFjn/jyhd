/** 结束时间面板*/


namespace modules.dungeon {
    import BroadcastBeginCombat = Protocols.BroadcastBeginCombat;
    import BroadcastBeginCombatFields = Protocols.BroadcastBeginCombatFields;
    import Text = Laya.Text;
    import Layer = ui.Layer;

    export class EndTimePanel extends BaseView {
        private _txt: Text;
        private _time: number;
        private _bgImg: Laya.Image

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.layer = Layer.MAIN_UI_LAYER;
            this.closeByOthers = false;

            this._txt = new Text();
            this.addChild(this._txt);
            this._txt.width = 300;
            this._txt.color = "#FDF6B8";
            this._txt.fontSize = 60;
            this._txt.stroke = 3;
            this._txt.strokeColor = "#9E5D3A";
            this._txt.align = "center";
            this.width = 300;
            this.height = 62;

            this._bgImg = new Laya.Image;
            this.addChild(this._bgImg);
            this._bgImg.skin = "common_sg/newImage_lvdi.png"
            this._bgImg.width = 300;
            this._bgImg.height = 67;
            this._bgImg.centerX = 0;
            this._bgImg.zOrder = -1
            this._bgImg.alpha = 0.7;

            this.centerX = 0;
            this.top = 310;

            this._txt.text = "";
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_BROADCAST_BEGIN_COMBAT, this, this.beginHandler);
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();

            Laya.timer.clear(this, this.loopHandler);
        }

        protected onOpened(): void {
            super.onOpened();
            this._txt.text = "";
            this.beginHandler();
        }

        private beginHandler(): void {
            let begin: BroadcastBeginCombat = DungeonModel.instance.broadcastBeginCombat;
            if (!begin) return;
            this._time = begin[BroadcastBeginCombatFields.remainTime];
            this.loopHandler();
        }

        private loopHandler(): void {
            if (this._time === undefined) return;
            if (this._time < 0) {
                this.close();
                return;
            } else {
                this._txt.text = modules.common.CommonUtil.msToMMSS(this._time);
                this._time -= 1000;
            }
        }
    }
}