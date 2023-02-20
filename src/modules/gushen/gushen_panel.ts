/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.gushen {
    import GushenViewUI = ui.GushenViewUI;
    import gushen_task = Configuration.gushen_task;
    import gushen = Configuration.gushen;
    import CustomList = modules.common.CustomList;
    import Event = laya.events.Event;
    import gushenFields = Configuration.gushenFields;
    import SkillTrainCfg = modules.config.SkillTrainCfg;
    import skillTrain = Configuration.skillTrain;
    import skillTrainFields = Configuration.skillTrainFields;
    import gushen_taskFields = Configuration.gushen_taskFields;
    import Button = laya.ui.Button;
    import Text = laya.display.Text;
    import CustomClip = modules.common.CustomClip;
    import GushenNote = Protocols.GushenNote;
    import GushenNoteFields = Protocols.GushenNoteFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GushenTask = Protocols.GushenTask;
    import GushenTaskFields = Protocols.GushenTaskFields;
    import Image = laya.ui.Image;
    import SkillCfg = modules.config.SkillCfg;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class GuShenPanel extends GushenViewUI {
        private gushenTaskArr: gushen_task[];
        //List滑动条
        private _list: CustomList;
        //上面标签页
        private gushenBtns: Button[];
        //标签页名字
        private gushenText: Text[];
        //标签页图片
        private gushenImage: Image[];
        //古神选中标签图片
        private gsImage: Image[];
        //古神问道表
        private _gushenArr: gushen;
        //秘术ID
        private _secretId: number;
        private currSelectIndex: int;  //当前选中下标
        //秘术表
        private _secret: skillTrain;
        //流光特效
        private _btnClip: CustomClip;
        //激活按钮状态
        private getState: number = 0;
        private _curProgress: number = 0;//当前完成的任务量
        private _maxProgress: number = 0;//总任务数量

        constructor() {
            super();
            this.currSelectIndex = 1;
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.creatEffect();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.itemRender = GushenItem;
            this._list.vCount = 7;
            this._list.hCount = 1;
            this._list.width = 690;
            this._list.height = 683;
            this._list.x = 5;
            this._list.y = 5;
            this._list.zOrder = 10;
            this._list.spaceY = 2;
            this.itemPanel.addChild(this._list);
            this.centerX = this.centerY = 0;

            this.gushenBtns = [this.gushenBtn1, this.gushenBtn2, this.gushenBtn3, this.gushenBtn4, this.gushenBtn5];
            this.gushenText = [this.titleText1, this.titleText2, this.titleText3, this.titleText4, this.titleText5];
            this.gushenImage = [this.iconImg1, this.iconImg2, this.iconImg3, this.iconImg4, this.iconImg5];
            this.gsImage = [this.gushenImage1, this.gushenImage2, this.gushenImage3, this.gushenImage4, this.gushenImage5];
        }

        protected addListeners(): void {
            super.addListeners();
            this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
            this.gushenBtns[0].on(Event.CLICK, this, this.setItem, [1]);
            this.gushenBtns[1].on(Event.CLICK, this, this.setItem, [2]);
            this.gushenBtns[2].on(Event.CLICK, this, this.setItem, [3]);
            this.gushenBtns[3].on(Event.CLICK, this, this.setItem, [4]);
            this.gushenBtns[4].on(Event.CLICK, this, this.setItem, [5]);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GUSHEN, this, this._updateView);

            this.shuaxinUI();
            this.addAutoRegisteRedPoint(this.dotImg1, ["gushengrade1RP"]);
            this.addAutoRegisteRedPoint(this.dotImg2, ["gushengrade2RP"]);
            this.addAutoRegisteRedPoint(this.dotImg3, ["gushengrade3RP"]);
            this.addAutoRegisteRedPoint(this.dotImg4, ["gushengrade4RP"]);
            this.addAutoRegisteRedPoint(this.dotImg5, ["gushengrade5RP"]);
        }

        /**
         * shuaxinUI
         */
        public shuaxinUI() {
            for (let i: number = 0; i < this.gushenBtns.length; i++) {
                let _cfg: gushen_task[] = GuShenTaskCfg.instance.getCfgBytype(i + 1);

                let nodeList: Array<GushenNote> = GuShenModel.instance.nodeList;

                this._gushenArr = GuShenCfg.instance.getCfgBytype(i + 1);
                this.gushenText[i].text = `${this._gushenArr[gushenFields.name]}`;
                this._secretId = this._gushenArr[gushenFields.secretId];
                let Ski: skill = SkillCfg.instance.getCfgById(this._secretId);
                this.gushenImage[i].skin = `assets/icon/item/${Ski[skillFields.icon]}.png`;//设置秘术图片
                this.gushenImage[i].gray = true;
                let istype: boolean = false;
                for (let K: int = 0; K < nodeList.length; K++) {
                    if (nodeList[K]) {
                        if (nodeList[K][GushenNoteFields.type] == i + 1) {
                            this.gushenImage[i].gray = false;
                        }
                    }

                }
            }
        }

        protected removeListeners(): void {
            super.removeListeners();
            for (let i: number = 0; i < this.gushenBtns.length; i++) {
                this.gushenBtns[i].off(Event.CLICK, this, this.setItem);
            }
            this.sureBtn.off(Event.CLICK, this, this.sureBtnHandler);
        }

        public onOpened(): void {
            super.onOpened();
            if (RedPointCtrl.instance.getRPProperty("gushengrade1RP")) {
                this.currSelectIndex = 1;
            } else if (RedPointCtrl.instance.getRPProperty("gushengrade2RP")) {
                this.currSelectIndex = 2;
            } else if (RedPointCtrl.instance.getRPProperty("gushengrade3RP")) {
                this.currSelectIndex = 3;
            } else if (RedPointCtrl.instance.getRPProperty("gushengrade4RP")) {
                this.currSelectIndex = 4;
            } else if (RedPointCtrl.instance.getRPProperty("gushengrade5RP")) {
                this.currSelectIndex = 5;
            }
            this.setItem(this.currSelectIndex);
            this._updateView();
            this._btnClip.play();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

        }

        private _updateView(): void {
            this.setItem(this.currSelectIndex);
            this.shuaxinUI();
        }

        //设置活动任务内容
        private setItem(type: number) {
            this._gushenArr = GuShenCfg.instance.getCfgBytype(type);
            let nodeList: Array<GushenNote> = GuShenModel.instance.nodeList;
            let istype: boolean = false;
            for (let i: int = 0; i < nodeList.length; i++) {
                if (nodeList[i][GushenNoteFields.type] == type) {
                    istype = true;
                    this.getState = nodeList[i][GushenNoteFields.activeState];
                    this._maxProgress = nodeList[i][GushenNoteFields.maxProgress];
                    this._curProgress = nodeList[i][GushenNoteFields.curProgress];
                }
            }
            if (!istype) {
                SystemNoticeManager.instance.addNotice(`${this._gushenArr[gushenFields.secretName]}`, true);
                return;
            }
            for (let i: int = 0; i < this.gsImage.length; i++) {
                if (type - 1 == i) {
                    this.gsImage[i].visible = true;
                } else {
                    this.gsImage[i].visible = false;
                }
            }
            this.currSelectIndex = type;
            this._gushenArr = GuShenCfg.instance.getCfgBytype(type);
            this._secretId = this._gushenArr[gushenFields.secretId];
            this._secret = SkillTrainCfg.instance.getScienceCfgById(this._secretId);

            let gushenTask: gushen_task[] = GuShenTaskCfg.instance.getCfgBytype(type);
            gushenTask.sort(this.sortFunc.bind(this));
            this._list.datas = gushenTask;
            let Ski: skill = SkillCfg.instance.getCfgById(this._secretId);
            this.secretText.text = `${Ski[skillFields.des]}`;//秘术效果
            this.secretItemText.text = `${this._secret[skillTrainFields.name]}`;
            this.secretImg.skin = `assets/icon/item/${Ski[skillFields.icon]}.png`;//设置秘术图片;

            if (this._curProgress >= this._maxProgress) {
                this._curProgress = this._maxProgress;
                this.scheduleText.color = "#16ba17";
                this.scheduleText.text = `(${this._curProgress}/${this._maxProgress})`;
            } else {
                this.scheduleText.color = "#FF3e3e";
                this.scheduleText.text = `(${this._curProgress}/${this._maxProgress})`;
            }
            this.updateBtnState();

        }

        //激活按钮状态
        private updateBtnState(): void {
            if (this.getState !== 0) {
                this.sureBtn.label = "可激活";
                if (this.getState == 1) {
                    this._btnClip.visible = true;
                    this.sureBtn.visible = true;
                    this.receivedImg.visible = false;
                } else {
                    this.sureBtn.visible = false;
                    this.receivedImg.visible = true;
                }
            } else {
                this.sureBtn.label = "激活";
                this.sureBtn.visible = true;
                this.receivedImg.visible = false;
                this._btnClip.visible = false;
            }
        }

        //激活按钮功能
        private sureBtnHandler(): void {
            if (this.getState == 0) {
                SystemNoticeManager.instance.addNotice("未达到条件！", true);
            }
            if (this.getState == 1) {
                GushenCtrl.instance.getGushenActiveReward([this.currSelectIndex]);
            }
        }

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
            this._btnClip.pos(-6, -15);
            this._btnClip.scale(0.98, 1);
            this._btnClip.visible = false;
        }

        private sortFunc(a: gushen_task, b: gushen_task): number {
            let nodeList: Array<GushenNote> = GuShenModel.instance.nodeList;
            let taskList: Array<GushenTask> = [];
            let taskTab: Table<GushenTask> = {};
            for (let i: int = 0; i < nodeList.length; i++) {
                if (this.currSelectIndex == nodeList[i][GushenNoteFields.type]) {
                    taskList = nodeList[i][GushenNoteFields.taskList];
                }
            }
            for (let i: int = 0; i < taskList.length; i++) {
                taskTab[taskList[i][GushenTaskFields.taskId]] = taskList[i];
            }
            let aTaskId: number = a[gushen_taskFields.taskId];
            let bTaskId: number = b[gushen_taskFields.taskId];
            let aState: number = taskTab[aTaskId] ? taskTab[aTaskId][GushenTaskFields.state] : 0;
            let bState: number = taskTab[bTaskId] ? taskTab[bTaskId][GushenTaskFields.state] : 0;
            aState = aState === 0 ? 1 : aState === 1 ? 0 : aState;
            bState = bState === 0 ? 1 : bState === 1 ? 0 : bState;
            if (aState === bState) {
                return aTaskId - bTaskId;
            } else {
                return aState - bState;
            }
        }

        public close(): void {
            super.close();
        }
    }
}