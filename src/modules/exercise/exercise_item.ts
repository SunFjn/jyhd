namespace modules.exercise {
    import CommonUtil = modules.common.CommonUtil;
    import ExerciseItemUI = ui.ExerciseItemUI;
    import CustomClip = modules.common.CustomClip;
    import ExerciseCfg = modules.config.ExerciseCfg;
    import lilian_taskFields = Configuration.lilian_taskFields;
    import LilianTaskNode = Protocols.LilianTaskNode;
    import LilianTaskNodeFields = Protocols.LilianTaskNodeFields;

    export class ExerciseItem extends ExerciseItemUI {

        private _btnClip: CustomClip;
        private _taskId: number;
        private _state: number;

        public destroy(destroyChild: boolean = true): void {
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();

            this._btnClip = CommonUtil.creatEff(this.btn, `btn_light`, 15);
            this._btnClip.scale(0.98,1);
            this._btnClip.pos(-5, -14);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
        }

        protected setData(value: any): void {

            let task: LilianTaskNode = value as LilianTaskNode;

            let taskId: number = this._taskId = task[LilianTaskNodeFields.id];
            this._state = task[LilianTaskNodeFields.state];
            let progress: number = task[LilianTaskNodeFields.progress];

            let cfg = ExerciseCfg.instance.getTaskCfgById(taskId);

            this.taskTxt.text = cfg[lilian_taskFields.name];
            let needValue: number = cfg[lilian_taskFields.condition];
            this.ratioTxt.text = `${progress}/${needValue}`;
            this.ratioTxt.color = progress < needValue ? `#ff3e3e` : `#00ad35`;
            this.DHTxt.text = `活跃值+${cfg[lilian_taskFields.exp]}`;

            /*状态 0未达成 1可领取 2已领取*/
            if (this._state == 0) {
                this.btn.visible = true;
                this.ylqImg.visible = false;
                this.btn.label = `前往`;
                this._btnClip.visible = false;
                this._btnClip.stop();
            } else if (this._state == 1) {
                this.btn.visible = true;
                this.ylqImg.visible = false;
                this.btn.label = `领取`;
                this._btnClip.visible = true;
                this._btnClip.play();
            } else {
                this.btn.visible = false;
                this.ylqImg.visible = true;
                this._btnClip.visible = false;
                this._btnClip.stop();
            }
        }

        private btnHandler(): void {
            /*状态 0未达成 1可领取 2已领取*/
            if (this._state == 0) {
                let arr: Array<number> = ExerciseCfg.instance.getTaskCfgById(this._taskId)[lilian_taskFields.skipId];
                if (!arr[0]) return;
                WindowManager.instance.openByActionId(arr[0]);
                WindowManager.instance.close(WindowEnum.EXERCISE_PANEL);
            } else if (this._state == 1) {
                common.ItemRenderNoticeManager.instance.index = this.index;
                ExerciseCrtl.instance.getLiLianTaskAward(this._taskId);
            }
        }
    }
}
