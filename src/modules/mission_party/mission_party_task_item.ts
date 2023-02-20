///<reference path="../../../libs/generate/configuration.d.ts"/>
/** 全民狂嗨 任务子项*/

namespace modules.mission_party {

    import CustomClip = modules.common.CustomClip;
    import kuanghai2_task = Configuration.kuanghai2_task;
    import LayaEvent = modules.common.LayaEvent;
    import kuanghai2_taskFields = Configuration.kuanghai2_taskFields;
    import Kuanghai2TaskNode = Protocols.Kuanghai2TaskNode;
    import Kuanghai2TaskNodeFields = Protocols.Kuanghai2TaskNodeFields;
    import PropAlertUtil = modules.commonAlert.PropAlertUtil;
    //import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;

    export class MissionPartyTaskItem extends ui.MissionPartyTaskItemUI {
        // private _btnClip: CustomClip;
        private _cfg: kuanghai2_task;
        private _taskList: Kuanghai2TaskNode;/*任务列表*/
        private _taskId: number;/*任务id*/
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this.createEffect();
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(this.gotoBtn, LayaEvent.CLICK, this, this.gotoBtnHandler);
            this.addAutoListener(this.btncomplete, LayaEvent.CLICK, this, this.taskComplete);

        }
        public onOpened(): void {
            super.onOpened();
            // this._btnClip.play();
        }
        protected setData(value: any): void {
            super.setData(value);
            this._cfg = value;

            this._taskId = this._cfg[kuanghai2_taskFields.id];

            //任务名
            this.themeDrawText.text = this._cfg[kuanghai2_taskFields.name];
            //奖励嗨点
            // this.happyPointText.text = `活跃值+${this._cfg[kuanghai2_taskFields.exp]}`;

            this._taskList = MissionPartyModel.instance.getNodeInfoById(this._taskId) ? MissionPartyModel.instance.getNodeInfoById(this._taskId) : [0, 0, 2333];
            //进度
            let condition = this._cfg[kuanghai2_taskFields.condition];
            let progress = this._taskList[Kuanghai2TaskNodeFields.progress];
            this.percentText.text = `(${progress}/${condition})`;
            this.percentText.x = this.themeDrawText.x + this.themeDrawText.width + 5

            this.sureBtn.visible = false;//领取
            this.gotoBtn.visible = false;//前往 未激活
            this.btncomplete.visible = false;//直接完成
            this.received.visible = false;//已领取
            // this.gotoBtn.y = 56
            // this.btncomplete.y = 115
            this.gotoBtn.label = "前往"
            // console.log("cfg", this._cfg, MissionPartyModel.instance.isBuy)
            if (MissionPartyModel.instance.isBuy == 0) {
                this.gotoBtn.visible = true;
                this.gotoBtn.label = "未激活"
                // this.gotoBtn.y = 75
            } else {
                //领取状态 /*状态 0未达成 1可领取 2已领取*/
                switch (this._taskList[Kuanghai2TaskNodeFields.state]) {
                    case 0:

                        if (this._cfg[8][0] == 0) {
                            this.gotoBtn.visible = true;
                            this.btncomplete.visible = false;//直接完成
                            this.gotoBtn.label = "直接完成"
                            // this.gotoBtn.y = 75

                        } else {
                            this.gotoBtn.visible = true;
                            // this.btncomplete.y = 115
                            this.btncomplete.visible = true;//直接完成
                        }


                        break;
                    case 1:
                        this.sureBtn.visible = true;
                        break;
                    case 2:
                        this.received.visible = true;//已领取
                        break;
                    default:
                        this.sureBtn.visible = false;
                        this.gotoBtn.visible = false;
                        break;
                }
            }



            let awardArr: Array<Items> = [];
            let showIdArr: number[] = [];
            awardArr = this._cfg[kuanghai2_taskFields.reward];

            for (let i: int = 0; i < awardArr.length; i++) {
                showIdArr.push(awardArr[i][ItemsFields.itemId]);
            }
            let count: number = showIdArr.length;
            let DayBase: modules.bag.BaseItem[] = [];


            DayBase.push(this.carnivalBase1);

            DayBase.push(this.carnivalBase2);

            DayBase.push(this.carnivalBase3);

            for (let i: int = 0; i < 3; i++) {
                if (i < count) {
                    if (!DayBase[i].visible) {
                        DayBase[i].visible = true;
                    }
                    DayBase[i].dataSource = [awardArr[i][ItemsFields.itemId], awardArr[i][ItemsFields.count], 0, null];
                } else {
                    DayBase[i].visible = false;
                }
            }
            DayBase[2].visible = false;
            this.happyPointText.visible = false;

        }
        private taskComplete() {

            CommonUtil.alert('直接完成', '是否直接完成任务?消耗派对点:' + this._cfg[kuanghai2_taskFields.taskPoint], [Laya.Handler.create(this, () => {
                MissionPartyCtrl.instance.JumpKuanghaiTask(this._taskId);
            })]);
        }


        private sureBtnHandler() {
            MissionPartyCtrl.instance.getKuanghaiTaskAward(this._taskId);
        }
        private gotoBtnHandler() {
            if (this.gotoBtn.label == "直接完成") {
                this.taskComplete();
            } else {
                //跳转面板或场景
                let actionId: number = this._cfg[kuanghai2_taskFields.skipId][0];
                PropAlertUtil.skipScene(actionId)
                WindowManager.instance.close(WindowEnum.Mission_Party_PANEL);
            }

        }
        private createEffect() {
            // this._btnClip = CommonUtil.creatEff(this.sureBtn, "scbaoxiang", 15);
            // this._btnClip.scale(0.65, 0.7);
            // this._btnClip.pos(-5, -10);
            // this._btnClip.play();
            // this._btnClip.visible = false;
        }
        public close(): void {
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            // this._btnClip = this.destroyElement(this._btnClip);
            super.destroy(destroyChild);
        }
    }
}