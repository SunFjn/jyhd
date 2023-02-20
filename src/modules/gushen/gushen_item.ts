/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.gushen {
    import GushenItemUI = ui.GushenItemUI;
    import Items = Protocols.Items;
    import gushen_task = Configuration.gushen_task;
    import gushen_taskFields = Configuration.gushen_taskFields;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import BagUtil = modules.bag.BagUtil;
    import Item = Protocols.Item;
    import GushenNote = Protocols.GushenNote;
    import GushenNoteFields = Protocols.GushenNoteFields;
    import GushenTask = Protocols.GushenTask;
    import GushenTaskFields = Protocols.GushenTaskFields;
    import Event = laya.events.Event;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class GushenItem extends GushenItemUI {
        private _cfg: gushen_task;
        //任务ID
        private _taskId: number;
        //任务类型
        private _type: number;
        //达成条件
        private _condition: number;
        //跳转功能ID
        private _skipActionId: number;
        //任务描述
        private _describe: string;
        //流光特效
        private _btnClip: CustomClip;
        //领取按钮状态
        private getState: number = 0;
        //任务列表
        private _taskList: Array<GushenTask>;
        //任务进度
        private _param: number;
        //显示达成条件
        private _taskCondition: number;

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
            this.describeText.color = "white";
            this.describeText.style.fontFamily = "SimHei";
            this.describeText.style.fontSize = 22;
            this.describeText.style.valign = "middle";
            this.describeText.style.wordWrap = true;
            this.creatEffect();
        }

        protected addListeners(): void {
            super.addListeners();
            this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
            // this.addAutoListener();
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.sureBtn.off(Event.CLICK, this, this.sureBtnHandler);
        }

        public onOpened(): void {
            super.onOpened();
            this._btnClip.play();
            this._updateView();
        }

        //设置任务列表信息
        protected setData(value: any): void {
            this._cfg = value as gushen_task;
            let awardArr: Array<Items> = [];
            awardArr = this._cfg[gushen_taskFields.reward];
            this._describe = this._cfg[gushen_taskFields.describe];
            this._condition = this._cfg[gushen_taskFields.condition];
            this._taskId = this._cfg[gushen_taskFields.taskId];
            this._skipActionId = this._cfg[gushen_taskFields.skipActionId];
            this._type = this._cfg[gushen_taskFields.type];
            this._taskCondition = this._cfg[gushen_taskFields.taskCondition];
            this.gushenItem.dataSource = [awardArr[0][ItemsFields.itemId], awardArr[0][ItemsFields.count], 0, null];

            let nodeList: Array<GushenNote> = GuShenModel.instance.nodeList;
            for (let i: int = 0; i < nodeList.length; i++) {
                if (this._type == nodeList[i][GushenNoteFields.type]) {
                    this._taskList = nodeList[i][GushenNoteFields.taskList];
                }
            }
            for (let i: int = 0; i < this._taskList.length; i++) {
                if (this._taskId == this._taskList[i][GushenTaskFields.taskId]) {
                    this.getState = this._taskList[i][GushenTaskFields.state];
                    this._param = this._taskList[i][GushenTaskFields.param];
                }
            }
            if (this._param >= this._condition) {
                this._param = this._condition;
                this.scheduleText.color = "#16ba17";
                if (this._taskCondition == 1) {
                    this.scheduleText.text = "(1/1)";
                } else {
                    this.scheduleText.text = `(${this._param}/${this._condition})`;
                }
            } else {
                this.scheduleText.color = "#FF3e3e";
                if (this._taskCondition == 1) {
                    this.scheduleText.text = "(0/1)";
                } else {
                    this.scheduleText.text = `(${this._param}/${this._condition})`;
                }
            }

            this.describeText.innerHTML = `${this._describe}`;
            this.describeText.style.height = this.describeText.contextHeight;

            let txtHeight: number = this.describeText.height;
            // let initY: number = (this.height - txtHeight) / 2;
            // this.describeText.y = initY;
            this.updateBtnState();
        }

        private _updateView(): void {

        }

        // 更新按钮状态
        private updateBtnState(): void {
            if (this.getState !== 0) {
                this.sureBtn.label = "领取";
                if (this.getState == 1) {
                    this._btnClip.visible = true;
                    this.sureBtn.visible = true;
                    this.receivedImg.visible = false;
                } else {
                    this.sureBtn.visible = false;
                    this.receivedImg.visible = true;
                }
            } else {
                if (this._skipActionId == 0) {
                    this.sureBtn.label = "领取";
                } else {
                    this.sureBtn.label = "前往";
                }
                this.sureBtn.visible = true;
                this.receivedImg.visible = false;
                this._btnClip.visible = false;
            }
        }

        //领取按钮功能
        private sureBtnHandler(): void {
            if (this.getState == 0) {
                if (this._skipActionId == 0) {
                    SystemNoticeManager.instance.addNotice("条件未达成,不可领取！", true);
                } else {
                    WindowManager.instance.openByActionId(this._skipActionId);
                    WindowManager.instance.close(WindowEnum.GUSHEN_PANEL);
                }
            }
            if (this.getState == 1) {
                let rewards: Array<Items> = this._cfg[gushen_taskFields.reward];
                let items: Array<Item> = [];
                for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                    let item: Items = rewards[i];
                    items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                }
                if (BagUtil.canAddItemsByBagIdCount(items)) {
                    GushenCtrl.instance.getGuShenTaskReward([this._taskId]);
                }
            }
        }

        //流光特效
        private creatEffect(): void {
            // this._btnClip = new CustomClip();
            // this._btnClip.skin = "assets/effect/btn_light.atlas";
            // this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
            //     "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
            //     "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            // this._btnClip.durationFrame = 5;
            // this._btnClip.play();
            // this._btnClip.loop = true;
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.sureBtn.addChild(this._btnClip);
            this._btnClip.pos(-6, -16);
            this._btnClip.scale(0.98, 1);
            this._btnClip.visible = false;
        }

        private setschedule(): void {

        }

        public close(): void {
            super.close();
        }
    }
}