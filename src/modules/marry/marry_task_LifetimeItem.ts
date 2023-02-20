/** */

namespace modules.marry {
    import LayaEvent = modules.common.LayaEvent;
    import PropAlertUtil = modules.commonAlert.PropAlertUtil;
    import marry_task = Configuration.marry_task;
    import marry_taskFields = Configuration.marry_taskFields;
    export class MarryTaskLifetimeItem extends ui.MarryTaskLifetimeItemUI {
        private proWidth: number;
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this.proWidth = this.progressBar.width;
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(this.gotoBtn, LayaEvent.CLICK, this, this.gotoBtnHandler);
        }
        public onOpened(): void {
            super.onOpened();

        }
        private _taskId: number = 0
        private _skipId: number = 0
        protected setData(value: any): void {
            super.setData(value);
            let taskId = value as number
            let cfg = MarryModel.instance.getTask(taskId, 2)
            let cfg2 = MarryCfg.instance.getLTaskCfg(taskId)
            this._taskId = taskId
            this._skipId = cfg2[marry_taskFields.skipId]
            this.nameTxt.text = cfg2[marry_taskFields.taskCondition]

            if (cfg[0] == 0) {
                //未完成
                this.gotoBtn.visible = true;
                this.sureBtn.visible = false;
                this.receivedImg.visible = false;
                if (this._skipId == 0) this.gotoBtn.visible = false;
            } else if (cfg[0] == 1) {
                //已完成
                this.gotoBtn.visible = false;
                this.sureBtn.visible = true;
                this.receivedImg.visible = false;

            } else {
                //已领取
                this.gotoBtn.visible = false;
                this.sureBtn.visible = false;
                this.receivedImg.visible = true;
            }

            this.progressTxt.text = cfg[2] + "/" + cfg2[marry_taskFields.condition]
            this.progressBar.width = (cfg[2] / cfg2[marry_taskFields.condition]) * this.proWidth;
            if (this.progressBar.width >= this.proWidth) {
                this.progressBar.width = this.proWidth;
            }

            this.otherProgressTxt.text = cfg[3] + "/" + cfg2[marry_taskFields.condition]
            this.otherProgressBar.width = (cfg[3] / cfg2[marry_taskFields.condition]) * this.proWidth;
            if (this.otherProgressBar.width >= this.proWidth) {
                this.otherProgressBar.width = this.proWidth;
            }
        }

        private sureBtnHandler() {
            MarryCtrl.instance.GetMarryTaskAward(this._taskId);
        }
        private gotoBtnHandler() {
            PropAlertUtil.skipScene(this._skipId);
        }
        public close(): void {
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
    }
}