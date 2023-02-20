
/**九霄令任务item */
namespace modules.jiuxiaoling {
    import JiuXiaoLingTaskItemUI = ui.JiuXiaoLingTaskItemUI;

    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import jiuXiaoLingTask = Configuration.jiuXiaoLingTask;
    import jiuXiaoLingTaskFields = Configuration.jiuXiaoLingTaskFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import PropAlertUtil = modules.commonAlert.PropAlertUtil;
    import JiuxiaoOrderTaskNode = Protocols.JiuxiaoOrderTaskNode;
    import JiuxiaoOrderTaskNodeFields = Protocols.JiuxiaoOrderTaskNodeFields;

    export class JiuXiaoLingTaskItem extends JiuXiaoLingTaskItemUI {

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, common.LayaEvent.CLICK, this, this.getBtnHandler);
            this.addAutoListener(this.goBtn, common.LayaEvent.CLICK, this, this.goBtnHandler);

        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: JiuxiaoOrderTaskNode): void {
            super.setData(value);
            // 是否为阶段任务
            let isStageTask: boolean = value[JiuxiaoOrderTaskNodeFields.taskType] == 1;
            // 任务状态 0-未达成 1-可领取 2-已领取
            let state: number = value[JiuxiaoOrderTaskNodeFields.state];
            // console.log(value);
            let taskName: string = value[JiuxiaoOrderTaskNodeFields.name];
            let process: string = `(${value[JiuxiaoOrderTaskNodeFields.progress]}/${value[JiuxiaoOrderTaskNodeFields.totalProgress]})`;
            let processColor: string = state == 0 ? `red` : 'green';
            this.taskname.innerHTML = `<div style="width:350px;fontFamily:SimHei; fontSize:23;"><span style="color:#4e4e4e;">${taskName}</span><span style="color:${processColor};">${process}</span></div>`;
            this.expTxt.text = value[JiuxiaoOrderTaskNodeFields.exp].toString();
            this.taskDescTxt.text = value[JiuxiaoOrderTaskNodeFields.desc];

            // 该任务完成次数，阶段任务才有的显示
            this.achievedBox.visible = isStageTask;
            if (isStageTask) {
                let achievedTimes: string = `(${value[JiuxiaoOrderTaskNodeFields.fulfilNum]}/${value[JiuxiaoOrderTaskNodeFields.totalNum]})`;
                this.achievedTxt.text = achievedTimes;
            }

            // 状态按钮显示
            this.goBtn.visible = state == 0;
            this.sureBtn.visible = state == 1;
            this.alreadyGeted.visible = state == 2;
        }

        //领取
        private getBtnHandler(): void {
            let taskId = this._data[JiuxiaoOrderTaskNodeFields.id];
            let taskType = this._data[JiuxiaoOrderTaskNodeFields.taskType];
            JiuXiaoLingCtrl.instance.GetTaskExp([taskId, taskType]);
        }

        //前往
        private goBtnHandler(): void {
            let actionId: number = this._data[JiuxiaoOrderTaskNodeFields.skipId];
            console.log("跳转面板ID：" + actionId);
            PropAlertUtil.skipScene(actionId);
        }
    }
}