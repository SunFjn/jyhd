/////<reference path="../$.ts"/>
/** 仙府-家园任务面板 */
namespace modules.xianfu {
    import XianfuTaskViewUI = ui.XianfuTaskViewUI;
    import CustomList = modules.common.CustomList;
    import XianFuTask = Protocols.XianFuTask;
    import XianFuTaskFields = Protocols.XianFuTaskFields;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import Event = Laya.Event;
    import CustomClip = common.CustomClip;

    export class XianfuTaskPanel extends XianfuTaskViewUI {

        private _list: CustomList;
        // private _pro: ProgressBarCtrl;
        private _activeTxts: Array<Laya.Text>;
        private _dotImgs: Array<Laya.Image>;
        private _effs: CustomClip[];

        protected initialize(): void {
            super.initialize();

            this.centerX = this.centerY = 0;
            this.centerY = 0;

            this._list = new CustomList();
            this._list.pos(10, 126);
            this._list.width = 704;
            this._list.height = 774;
            this._list.hCount = 1;
            this._list.spaceX = 6;
            this._list.itemRender = XianfuTaskItem;
            this.addChild(this._list);

            // this._pro = new ProgressBarCtrl(this.barImg, this.barImg.width, this.barTxt);

            this._activeTxts = [this.activeTxt_0, this.activeTxt_1, this.activeTxt_2, this.activeTxt_3];
            for (let i: int = 0, len: int = this._activeTxts.length; i < len; i++) {
                this._activeTxts[i].text = XianfuModel.instance.taskActivesValue[i] + "";
            }
            // this._pro.maxValue = XianfuModel.instance.taskActivesValue[3];

            this._dotImgs = [this.dotImg_0, this.dotImg_1, this.dotImg_2, this.dotImg_3];

            this._effs = [];
            for (let i: int = 0; i < 4; i++) {
                let eff = new CustomClip();
                this.addChildAt(eff, 2);
                this._effs[i] = eff;
                if (i == 2) {
                    eff.pos(420, 890);
                } else if (i == 3) {
                    eff.pos(540 + i * 150, 890);
                } else {
                    eff.pos(120 + i * 150, 890);
                }

                eff.skin = "assets/effect/ok_state.atlas";
                eff.frameUrls = ["ok_state/0.png", "ok_state/1.png", "ok_state/2.png", "ok_state/3.png", "ok_state/4.png",
                    "ok_state/5.png", "ok_state/6.png", "ok_state/7.png"];
                eff.durationFrame = 5;
                eff.loop = true;
                eff.play();
            }
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_TASK_UPDATE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_UPDATE, this, this.updateView);
            this.addAutoListener(this.activeBtn_0, Event.CLICK, this, this.activeBtnHandler, [0]);
            this.addAutoListener(this.activeBtn_1, Event.CLICK, this, this.activeBtnHandler, [1]);
            this.addAutoListener(this.activeBtn_2, Event.CLICK, this, this.activeBtnHandler, [2]);
            this.addAutoListener(this.activeBtn_3, Event.CLICK, this, this.activeBtnHandler, [3]);
            this.addAutoListener(this.aboutBtn, Event.CLICK, this, this.aboutBtnHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private updateView(): void {

            let taskInfos: Array<XianFuTask> = XianfuModel.instance.taskInfos.concat();
            taskInfos = taskInfos.sort(this.sortFunc.bind(this));
            this._list.datas = taskInfos;

            // this._pro.value = XianfuModel.instance.taskSchedule;

            let maxValue = XianfuModel.instance.taskActivesValue[3];
            let value = XianfuModel.instance.taskSchedule;

            this.barTxt.text = value + "/" + maxValue;
            this.active_bar.width = value / maxValue * 606;
            this.active_value.text = value + "";


            for (let i: int = 0, len: int = this._dotImgs.length; i < len; i++) {
                if (XianfuModel.instance.taskSchedule >= XianfuModel.instance.taskActivesValue[i] &&
                    XianfuModel.instance.activeGrade.indexOf(i) == -1) {  //等于-1就是没领
                    this._effs[i].visible = this._dotImgs[i].visible = true;
                    this._effs[i].play();
                } else {
                    this._effs[i].visible = this._dotImgs[i].visible = false;
                    this._effs[i].stop();
                }
            }
        }

        private activeBtnHandler(index: number): void {
            XianfuModel.instance.selectTaskActiveAward = index;
            XianfuCtrl.instance.getXianFuActivaAward([index]);
        }

        private aboutBtnHandler(): void {
            CommonUtil.alertHelp(20043);
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._effs) {
                for (let index = 0; index < this._effs.length; index++) {
                    let element = this._effs[index];
                    if (element) {
                        element.removeSelf();
                        element.destroy();
                        element = null;
                    }
                }
                this._effs.length = 0;
                this._effs = null;
            }
            super.destroy(destroyChild);
        }

        private sortFunc(a: XianFuTask, b: XianFuTask): number {
            //可领取>不可领取>已经领取
            let aId: number = a[XianFuTaskFields.id];
            let bId: number = b[XianFuTaskFields.id];
            /*状态 0：未完成 1:已完成 2：已领取*/
            let aState: number = a[XianFuTaskFields.state];
            let bState: number = b[XianFuTaskFields.state];
            if (aState == bState) {  //状态相同
                if (aId < bId) {
                    return -1;
                } else if (aId > bId) {
                    return 1;
                } else {
                    return 0;
                }
            } else {  //状态不同
                if (aState == 1 && bState != 1) { //a可以领
                    return -1;
                } else if (bState == 1 && aState != 1) { //b可以领
                    return 1;
                } else { //都不可以领
                    if (aState == 0 && bState != 0) { //a未领取
                        return -1;
                    } else if (bState == 0 && aState != 0) { //b未领取
                        return 1;
                    }
                }
            }
        }
    }
}