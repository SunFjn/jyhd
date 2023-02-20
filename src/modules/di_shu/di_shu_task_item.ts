/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.dishu {
    import Items = Protocols.Items;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import LayaEvent = modules.common.LayaEvent;
    import AutoSC_DiShuTask_list = Protocols.AutoSC_DiShuTask_list;
    import AutoSC_DiShuTask_listFields = Protocols.AutoSC_DiShuTask_listFields;
    import AutoSC_GetTaskAwd = Protocols.AutoSC_GetTaskAwd;

    export class DishuTaskItem extends ui.DishuTaskItemUI {
        private _cfg: AutoSC_DiShuTask_list;
        private getState: number = 0;
        private hitnum: number = 0;
        private _btnClip: CustomClip;


        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.continueText.color = "#ffffff";
            this.continueText.style.fontFamily = "SimHei";
            this.continueText.style.fontSize = 22;
            this.creatEffect();

        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.lqBtn, LayaEvent.CLICK, this, this.lqBtnHandler);
            this.addAutoListener(this.hitBtn, LayaEvent.CLICK, this, this.hitBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DISHU_TASK_UPDATE, this, this.lqBtnHandlerReply);

        }

        protected removeListeners(): void {
            super.removeListeners();
            // this.sureBtn.off(Event.CLICK, this, this.sureBtnHandler);
        }

        public onOpened(): void {
            super.onOpened();
        }

        //设置任务列表信息
        protected setData(value: AutoSC_DiShuTask_list): void {
            this._cfg = value;

            // 设置标题
            if (value[AutoSC_DiShuTask_listFields.TaskType] == 1) {
                this.continueText.innerHTML = `个人打地鼠数量达到<span style='color:#3CFF00'>&nbsp;${this._cfg[AutoSC_DiShuTask_listFields.Condition]}&nbsp;</span> ,可领取`;
            } else {
                this.continueText.innerHTML = `全民消耗猫爪锤数量达到<span style='color:#3CFF00'>&nbsp;${this._cfg[AutoSC_DiShuTask_listFields.Condition]}&nbsp;</span> ,可领取`;
            }

            // 设置道具
            let awardArr: Array<Items> = [];
            awardArr = this._cfg[AutoSC_DiShuTask_listFields.TaskAwd];
            let DayBase: modules.bag.BaseItem[] = [];
            DayBase.push(this.continueBase1);
            DayBase.push(this.continueBase2);
            DayBase.push(this.continueBase3);
            for (let i: int = 0; i < awardArr.length; i++) {
                if (i < awardArr.length) {
                    if (!DayBase[i].visible) {
                        DayBase[i].visible = true;
                    }
                    DayBase[i].dataSource = [awardArr[i][ItemsFields.itemId], awardArr[i][ItemsFields.count], 0, null];
                } else {
                    DayBase[i].visible = false;
                }
            }
            if (value[AutoSC_DiShuTask_listFields.status] == 1) {
                // 已领取
                this.receivedImg.visible = true;
                this.lqBtn.visible = false;
                this.hitBtn.visible = false;
            } else {
                // 设置按钮
                if (DishuModel.instance.playCount >= value[AutoSC_DiShuTask_listFields.Condition]) {
                    // 点亮领取
                    this.receivedImg.visible = false;
                    this.lqBtn.visible = true;
                    this.hitBtn.visible = false;
                    this._btnClip.play();
                    this._btnClip.visible = true;
                } else {
                    // 未达成
                    this.receivedImg.visible = false;
                    this.lqBtn.visible = false;
                    this.hitBtn.visible = true;
                }
            }

            // 设置数量
            this.scheduleText.text = `(${DishuModel.instance.playCount}/${this._cfg[AutoSC_DiShuTask_listFields.Condition]})`;
            if (DishuModel.instance.playCount >= this._cfg[AutoSC_DiShuTask_listFields.Condition]) {
                this.scheduleText.color = "#16ba17";
            } else {
                this.scheduleText.color = "#FF3e3e";
            }
        }

        private lqBtnHandler(): void {
            DishuCtrl.instance.GainTaskPrize([DishuModel.instance.taskTypeBySelect, this._cfg[AutoSC_DiShuTask_listFields.id]]);
        }
        private lqBtnHandlerReply(){
            console.log(111)
            
        }

        private hitBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.DI_SHU_PANEL);
        }

        public close(): void {
            super.close();
        }

        private creatEffect(): void {
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.lqBtn.addChild(this._btnClip);
            this._btnClip.pos(-7.5, -20);
            this._btnClip.scale(1.25, 1.3);
            this._btnClip.visible = false;
        }
    }
}