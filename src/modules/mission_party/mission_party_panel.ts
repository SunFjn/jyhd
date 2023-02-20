///<reference path="../config/mission_party_task_cfg.ts"/>
///<reference path="../config/mission_party_cfg.ts"/>
/** 任务派对（同一类型活动通用） 面板*/
namespace modules.mission_party {
    import MissionPartyTaskCfg = modules.config.MissionPartyTaskCfg;
    import MissionPartyCfg = modules.config.MissionPartyCfg;
    import CustomList = modules.common.CustomList;
    import kuanghai2_task = Configuration.kuanghai2_task;
    import kuanghai2_rise = Configuration.kuanghai2_rise;
    import Kuanghai2GradeNode = Protocols.Kuanghai2GradeNode;
    import Kuanghai2TaskNode = Protocols.Kuanghai2TaskNode;
    import kuanghai2_taskFields = Configuration.kuanghai2_taskFields;
    import kuanghai2_riseFields = Configuration.kuanghai2_riseFields;
    import Kuanghai2TaskNodeFields = Protocols.Kuanghai2TaskNodeFields;
    import LayaEvent = modules.common.LayaEvent;
    export class MissionPartyPanel extends ui.MissionPartyViewUI {
        private _leftList: CustomList;
        private _rightList: CustomList;
        private _List: CustomList;
        private _tween: TweenJS;
        private _missionLabel: string;

        private taskArr: Array<kuanghai2_task> = [];
        private riseArr: kuanghai2_rise[] = [];
        private tempTaskArr: Array<any>;
        private tempRiseArr: Array<any>;

        private openState: number;//活动状态 0关闭1开启
        private taskList: Array<Kuanghai2TaskNode>;//任务列表
        private gradeList: Array<Kuanghai2GradeNode>;//档次列表
        private taskIdArr: Array<number>;//任务id数组
        private activityId: number;//活动id
        private haiValue: number;//总嗨值

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._missionLabel = MissionPartyModel.instance.getCurrentMissionLabel();
            this.openState = 0;
            this.taskList = [];
            this.gradeList = [];
            this.taskIdArr = [];
            this.activityId = 0;
            this.haiValue = 0;

            this.showRealUI();
            this.leftListInit();
            this.rightListInit();

            this._List = new CustomList();
            this._List.scrollDir = 1;

            this._List.itemRender = MissionPartyTBItem;

            this._List.vCount = 7;

            this._List.hCount = 1;

            this._List.width = 200;
            this._List.height = 386;
            this._List.x = 0;
            this._List.y = 0;

            let arr = [
                { title: 'BOSS狂欢', _Indexes: 0 },
                { title: '日常任务', _Indexes: 1 },
                { title: '派对任务', _Indexes: 2 },
                { title: '限时任务', _Indexes: 3 }
            ]
            MissionPartyModel.instance._tabclink = 0
            this._List.datas = arr

            this.list.addChild(this._List);
            this._tween = TweenJS.create(this.okBtn2).yoyo(true)
            // .to({ rotation: this.okBtn2.rotation - 20 }, 300)
            //     .to({ rotation: this.okBtn2.rotation + 20 }, 50)
            //     .to({ rotation: this.okBtn2.rotation + 15 }, 150)
            //     .to({ rotation: this.okBtn2.rotation - 15 }, 50)
        }

        /**
         * 根据不通的活动展示不通的UI界面（效果图）
        */
        private showRealUI() {
            this.mainBGImg.skin = `mission_party/${this._missionLabel}/image_main_bg.png`;
            this.closeBtn.skin = `mission_party/${this._missionLabel}/btn_close.png`;
            this.okBtn2.skin = `mission_party/${this._missionLabel}/image_box.png`;
            this.imgpro.skin = `mission_party/${this._missionLabel}/image_slider_top.png`;
            this.imgBottom.skin = `mission_party/${this._missionLabel}/image_slider_di.png`;
        }
        //←侧列表
        private leftListInit() {
            this._leftList = new CustomList();
            this._leftList.scrollDir = 1;

            this._leftList.itemRender = MissionPartyTaskItem;

            this._leftList.vCount = 7;

            this._leftList.hCount = 1;

            this._leftList.width = 400;

            this._leftList.height = 385;

            this._leftList.x = 0;

            this._leftList.y = 0;

            this.leftPanel.addChild(this._leftList);
        }
        //→侧列表
        private rightListInit() {
            this._rightList = new CustomList();
            this._rightList.scrollDir = 2;

            this._rightList.itemRender = MissionPartyItem;

            this._rightList.vCount = 1;

            this._rightList.hCount = 7;

            this._rightList.width = 570;

            this._rightList.height = 90;

            this._rightList.x = 0;

            this._rightList.y = 0;

            this.rightPanel.addChild(this._rightList);
        }

        public TabClink() {
            // let arr = [
            //     { title: 'BOSS狂欢', clink: false, _tag: 0 },
            //     { title: '日常任务', clink: false, _tag: 1 },
            //     { title: '派对任务', clink: false, _tag: 2 },
            //     { title: '限时任务', clink: false, _tag: 3 }
            // ]
            // arr[MissionPartyModel.instance._tabclink].clink = true
            // this._List.datas = arr

        }

        public onOpened(): void {
            super.onOpened();
            MissionPartyModel.instance._tabclink = 0
            GlobalData.dispatcher.event(CommonEventType.Mission_Party_updataList);
            MissionPartyCtrl.instance.getKuanghaiInfo();
            this._updateView();
            this.setTempArr();
            Laya.timer.clear(this, this.showTw);
            Laya.timer.loop(3000, this, this.showTw)
        }
        private showTw() {
            // console.log("晃动效果")
            // this._tween
            //     .to({ rotation: this.okBtn2.rotation - 20 }, 300)
            //     .to({ rotation: this.okBtn2.rotation + 20 }, 50)
            //     .to({ rotation: this.okBtn2.rotation + 15 }, 150)
            //     .to({ rotation: this.okBtn2.rotation - 15 }, 50)
            //     .start()

            this._tween.to({ rotation: - 20 }, 150).start().onComplete(() => {
                this._tween.to({ rotation: 15 }, 200).start().onComplete(() => {
                    this._tween.to({ rotation: 0 }, 20).start().onComplete(() => {

                    });
                });



            });

        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.Mission_Party_UPDATE, this, this._updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.Mission_Party_updataList, this, this.TabClink);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.Mission_Party_updataList, this, this._updateView);
            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.openAward);
            this.addAutoListener(this.okBtn2, LayaEvent.CLICK, this, this.openAward);
        }

        close() {
            super.close();
            Laya.timer.clear(this, this.showTw);
        }

        public destroy(): void {
            super.destroy();
            Laya.timer.clear(this, this.showTw);
        }

        private _updateView(): void {

            this.openState = MissionPartyModel.instance.openState;
            this.taskList = MissionPartyModel.instance.taskList;
            this.gradeList = MissionPartyModel.instance.gradeList;
            this.activityId = MissionPartyModel.instance.id;
            this.haiValue = MissionPartyModel.instance.exp;
            let isBuy = MissionPartyModel.instance.isBuy;
            this.okBtn.label = "领取大奖"
            if (isBuy == 0) this.okBtn.label = "立即激活"
            let percentage = (this.haiValue / 15)
            if (percentage > 1) percentage = 1
            this.imgpro.width = 560 * (percentage)
            this.missionPointCount.visible = true;
            // this.happyPointBG.visible = true;
            this.taskIdArr = [];
            if (this.openState != 0 && this.taskList) {
                this.leftPanel.visible = true;
                this.rightPanel.visible = true;
                // this.itemPanel.visible = true;
                for (let i = 0; i < this.taskList.length; i++) {
                    this.taskIdArr.push(this.taskList[i][Kuanghai2TaskNodeFields.id])
                }
                this.missionPointCount.text = `${MissionPartyModel.instance.missionName}点:${MissionPartyModel.instance.point}`;
                this.taskArr = [];
                for (let i = 0; i < this.taskIdArr.length; i++) {
                    this.taskArr.push(MissionPartyTaskCfg.instance.getCfgById(this.taskIdArr[i]));
                }
                this.riseArr = MissionPartyCfg.instance.getCfgById(this.activityId);
                this.taskArr.sort(this.sortFuncTask.bind(this));
                // this.riseArr.sort(this.sortFuncRise.bind(this));
                if (MissionPartyModel.instance.taskList.length > 0) {
                    let arr: Array<kuanghai2_task> = []
                    for (let i = 0; i < this.taskArr.length; i++) {
                        if (this.taskArr[i][11] == MissionPartyModel.instance._tabclink)
                            arr.push(this.taskArr[i])
                    }
                    this._leftList.datas = arr;
                    this._rightList.datas = this.riseArr;
                } else {
                    this._leftList.datas = this.tempTaskArr;
                    this._rightList.datas = this.tempRiseArr;
                }
                this.setActivitiTime();
            } else {
                this.leftPanel.visible = false;
                this.rightPanel.visible = false;
                // this.itemPanel.visible = false;
            }
        }
        private openAward() {
            WindowManager.instance.open(WindowEnum.Mission_Party_Award_ALERT);
        }


        private setActivitiTime(): void {
            Laya.timer.clear(this, this.activityHandler);
            let isOpen = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.MissionPartyEnter);
            if (MissionPartyModel.instance.restTm > 0 && isOpen) {
                this.activityText1.color = "#ffec7c";
                this.activityText.visible = true;
                this.activityText1.text = "活动时间:";
                // this.endBG.visible = false;
                // this.endText.visible = false;
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.activityText1.color = "#FF3e3e";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";
                // this.endBG.visible = true;
                // this.endText.visible = true;
                this.missionPointCount.visible = false;
                // this.happyPointBG.visible = false;
                this.leftPanel.visible = false;
                this.rightPanel.visible = false;
                // this.itemPanel.visible = false;
            }
        }
        private activityHandler(): void {
            if (MissionPartyModel.instance.restTm <= 0) {
                this.activityText1.color = "#FF3e3e";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";
                // this.endBG.visible = true;
                // this.endText.visible = true;
                this.missionPointCount.visible = false;
                // this.happyPointBG.visible = false;
                this.leftPanel.visible = false;
                this.rightPanel.visible = false;
                // this.itemPanel.visible = false;
                Laya.timer.clear(this, this.activityHandler);
            } else {
                this.activityText.text = `${CommonUtil.timeStampToDayHourMin(MissionPartyModel.instance.restTm)}`;
            }
        }
        private sortFuncTask(a: kuanghai2_task, b: kuanghai2_task): number {
            let aId: number = a[kuanghai2_taskFields.id];

            let bId: number = b[kuanghai2_taskFields.id];

            let nodeA: Array<any> = MissionPartyModel.instance.getNodeInfoById(aId);

            let nodeB: Array<any> = MissionPartyModel.instance.getNodeInfoById(bId);

            let aState: number = nodeA ? nodeA[1] : 0;

            let bState: number = nodeB ? nodeB[1] : 0;

            let returnNum = 1;

            switch (aState) {
                case 0:
                    aState = 1;
                    break;
                case 1:
                    aState = 2;
                    break;
                case 2:
                    aState = 0;
                    break;
            };
            switch (bState) {
                case 0:
                    bState = 1;
                    break;
                case 1:
                    bState = 2;
                    break;
                case 2:
                    bState = 0;
                    break;
            };


            if (aState == bState) {
                a[kuanghai2_taskFields.rank] < b[kuanghai2_taskFields.rank] ? returnNum = -1 : returnNum = 1;
            } else {
                aState > bState ? returnNum = -1 : returnNum = 1;
            }
            return returnNum;
        }
        private sortFuncRise(a: kuanghai2_rise, b: kuanghai2_rise): number {
            let aGrade: number = a[kuanghai2_riseFields.grade];

            let bGrade: number = b[kuanghai2_riseFields.grade];

            let nodeA: Array<any> = MissionPartyModel.instance.getRisrNodeInfoByGrade(aGrade);

            let nodeB: Array<any> = MissionPartyModel.instance.getRisrNodeInfoByGrade(bGrade);

            let aState: number = nodeA ? nodeA[1] : 0;

            let bState: number = nodeB ? nodeB[1] : 0;

            if (aState + bState > 1) {
                if (aState === bState) {// 状态相同按ID排
                    return aGrade - bGrade;
                } else {
                    return aState - bState;
                }
            } else if (aState > bState) {
                return aState - bState;
            } else {
                return bState - aState;
            }
        }

        private setTempArr() {
            for (let i = 0; i < this.taskArr.length; i++) {
                this.tempTaskArr = this.taskArr;
            }
            for (let i = 0; i < this.riseArr.length; i++) {
                this.tempRiseArr = this.riseArr;
            }
        }
    }
}