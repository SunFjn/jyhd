namespace modules.exercise {
    import ExerciseAlertUI = ui.ExerciseAlertUI;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import Event = Laya.Event;
    import BaseItem = modules.bag.BaseItem;
    import LayaEvent = modules.common.LayaEvent;

    export class ExerciseAlert extends ExerciseAlertUI {

        private _duration: number;
        private _prizeArr: Array<BaseItem>;

        public destroy(): void {
            this._prizeArr = this.destroyElement(this._prizeArr);
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

            this._prizeArr = new Array<BaseItem>();
            for (let i: int = 0, len: int = 2; i < len; i++) {
                this._prizeArr[i] = new BaseItem();
                this.addChild(this._prizeArr[i]);
                this._prizeArr[i].pos(204 + i * 156, 187);
            }
        }

        public onOpened(): void {
            super.onOpened();

            this._duration = BlendCfg.instance.getCfgById(10401)[blendFields.intParam][0];
            this.loopHandler();
        }

        // 设置打开面板时的参数
        public setOpenParam(value: any): void {
            super.setOpenParam(value);

            this._prizeArr[0].dataSource = value[0];
            this._prizeArr[1].dataSource = value[1];
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.close);
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        protected removeListeners(): void {
            Laya.timer.clear(this, this.loopHandler);
            super.removeListeners();
        }

        private loopHandler(): void {
            if (this._duration === 0) {
                this.close();
                Laya.timer.clear(this, this.loopHandler);
            }
            this.sureBtn.label = `确定(${this._duration / 1000})`;
            this._duration -= 1000;
        }
    }
}