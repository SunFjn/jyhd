///<reference path="../config/the_carnival_task_cfg.ts"/>
///<reference path="../config/the_carnival_cfg.ts"/>
/** 全民狂嗨 面板*/
namespace modules.the_carnival{
    import TheCarnivalTaskCfg = modules.config.TheCarnivalTaskCfg;
    import TheCarnivalCfg = modules.config.TheCarnivalCfg;
    import CustomList = modules.common.CustomList;
    import kuanghai_task = Configuration.kuanghai_task;
    import kuanghai_rise = Configuration.kuanghai_rise;
    import KuanghaiGradeNode = Protocols.KuanghaiGradeNode;
    import KuanghaiTaskNode = Protocols.KuanghaiTaskNode;
    import kuanghai_taskFields = Configuration.kuanghai_taskFields;
    import kuanghai_riseFields = Configuration.kuanghai_riseFields;
    import KuanghaiTaskNodeFields = Protocols.KuanghaiTaskNodeFields;
    export class TheCarnivalPanel extends ui.TheCarnivalViewUI{
        private _leftList : CustomList;
        private _rightList : CustomList;
        private taskArr: Array<kuanghai_task>= [];
        private riseArr: kuanghai_rise[] = [];
        private tempTaskArr: Array<any>;
        private tempRiseArr: Array<any>;

        private openState : number;//活动状态 0关闭1开启
        private taskList :Array<KuanghaiTaskNode>;//任务列表
        private gradeList:Array<KuanghaiGradeNode>;//档次列表
        private taskIdArr : Array<number>;//任务id数组
        private activityId:number;//活动id
        private haiValue:number;//总嗨值

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.openState = 0;
            this.taskList = [];
            this.gradeList = [];
            this.taskIdArr = [];
            this.activityId = 0;
            this.haiValue = 0;

            this.leftListInit();
            this.rightListInit();
        }
        //←侧列表
        private leftListInit(){
            this._leftList = new CustomList();
            this._leftList.scrollDir = 1;

            this._leftList.itemRender = TheCarnivalTaskItem;

            this._leftList.vCount = 7;

            this._leftList.hCount = 1;

            this._leftList.width = 200;

            this._leftList.height = 881;

            this._leftList.x = 0;

            this._leftList.y = 0;

            this.leftPanel.addChild(this._leftList);

            this._leftList.spaceY = 3;
        }
        //→侧列表
        private rightListInit(){
            this._rightList = new CustomList();
            this._rightList.scrollDir = 1;

            this._rightList.itemRender = TheCarnivalItem;

            this._rightList.vCount = 7;

            this._rightList.hCount = 1;

            this._rightList.width = 454;

            this._rightList.height = 829;

            this._rightList.x = 6;

            this._rightList.y = 0;

            this.rightPanel.addChild(this._rightList);

            this._rightList.spaceY = 3;
        }

        public onOpened(): void {
            super.onOpened();
            TheCarnivalCtrl.instance.getKuanghaiInfo();
            this._updateView();
            this.setTempArr();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.THE_CARNIVAL_UPDATE, this, this._updateView);
        }

        public destroy(): void {
            super.destroy();
        }

        private _updateView(): void {

            this.openState = TheCarnivalModel.instance.openState;
            this.taskList = TheCarnivalModel.instance.taskList;
            this.gradeList = TheCarnivalModel.instance.gradeList;
            this.activityId = TheCarnivalModel.instance.id;
            this.haiValue = TheCarnivalModel.instance.exp;
            this.happyPointCount.visible = true;
            // this.happyPointBG.visible = true;
            this.taskIdArr = [];
            if(this.openState!=0&&this.taskList){
                this.leftPanel.visible = true;
                this.rightPanel.visible = true;
                this.itemPanel.visible = true;
                for(let i =0;i<this.taskList.length;i++){
                    this.taskIdArr.push(this.taskList[i][KuanghaiTaskNodeFields.id])
                }
                this.happyPointCount.text = `嗨点数量:${this.haiValue}`;
                this.taskArr = [];
                for(let i =0;i<this.taskIdArr.length;i++){
                    this.taskArr.push(TheCarnivalTaskCfg.instance.getCfgById(this.taskIdArr[i]));
                }
                this.riseArr = TheCarnivalCfg.instance.getCfgById(this.activityId);
                this.taskArr.sort(this.sortFuncTask.bind(this));
                this.riseArr.sort(this.sortFuncRise.bind(this));
                if (TheCarnivalModel.instance.taskList.length > 0) {
                    this._leftList.datas = this.taskArr;
                    this._rightList.datas = this.riseArr;
                } else {
                    this._leftList.datas = this.tempTaskArr;
                    this._rightList.datas =this.tempRiseArr;
                }
                this.setActivitiTime();
            }else{
                this.leftPanel.visible = false;
                this.rightPanel.visible = false;
                this.itemPanel.visible = false;
            }
        }

        private setActivitiTime(): void {
            Laya.timer.clear(this, this.activityHandler);
            let isOpen = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.theCarnivalEnter);
            if (TheCarnivalModel.instance.restTm > 0 && isOpen) {
                this.activityText1.color = "#ffec7c";
                this.activityText.visible = true;
                this.activityText1.text = "活动时间:";
                this.endBG.visible = false;
                this.endText.visible = false;
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.activityText1.color = "#FF3e3e";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";
                this.endBG.visible = true;
                this.endText.visible = true;
                this.happyPointCount.visible = false;
                // this.happyPointBG.visible = false;
                this.leftPanel.visible = false;
                this.rightPanel.visible = false;
                this.itemPanel.visible = false;
            }
        }
        private activityHandler(): void {
            if (TheCarnivalModel.instance.restTm <= 0) {
                this.activityText1.color = "#FF3e3e";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";
                this.endBG.visible = true;
                this.endText.visible = true;
                this.happyPointCount.visible = false;
                // this.happyPointBG.visible = false;
                this.leftPanel.visible = false;
                this.rightPanel.visible = false;
                this.itemPanel.visible = false;
                Laya.timer.clear(this, this.activityHandler);
            } else {
                this.activityText.text = `${CommonUtil.timeStampToDayHourMin(TheCarnivalModel.instance.restTm)}`;
            }
        }
        private sortFuncTask(a: kuanghai_task, b: kuanghai_task):number{
            let aId: number = a[kuanghai_taskFields.id];

            let bId: number = b[kuanghai_taskFields.id];

            let nodeA: Array<any> = TheCarnivalModel.instance.getNodeInfoById(aId);

            let nodeB: Array<any> = TheCarnivalModel.instance.getNodeInfoById(bId);

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


            if(aState == bState){
                a[kuanghai_taskFields.rank]<b[kuanghai_taskFields.rank]?returnNum = -1 : returnNum = 1;
            }else{
                aState>bState?returnNum = -1 : returnNum = 1;
            }
            return returnNum;
        }
        private sortFuncRise(a: kuanghai_rise, b: kuanghai_rise):number{
            let aGrade: number = a[kuanghai_riseFields.grade];

            let bGrade: number = b[kuanghai_riseFields.grade];

            let nodeA: Array<any> = TheCarnivalModel.instance.getRisrNodeInfoByGrade(aGrade);

            let nodeB: Array<any> = TheCarnivalModel.instance.getRisrNodeInfoByGrade(bGrade);

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