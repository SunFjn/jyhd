namespace modules.sprint_rank {
    import sprint_rank_task = Configuration.sprint_rank_task;
    import Items = Configuration.Items;
    import sprint_rank_taskFields = Configuration.sprint_rank_taskFields;
    import ItemsFields = Configuration.ItemsFields;
    import sprint_rank = Configuration.sprint_rank;
    import sprint_rankFields = Configuration.sprint_rankFields;
    import SprintRankTaskNodeFields = Protocols.SprintRankTaskNodeFields;
    import SprintRankTaskNode = Protocols.SprintRankTaskNode;
    import SprintRankNode = Protocols.SprintRankNode;
    import Item = Protocols.Item;
    import SprintRankInfo = Protocols.SprintRankInfo;
    import SprintRankNodeFields = Protocols.SprintRankNodeFields;
    import SprintRankInfoFields = Protocols.SprintRankInfoFields;
    import Event = Laya.Event;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import BaseItem = modules.bag.BaseItem;
    import BagUtil = modules.bag.BagUtil;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import CustomClip = modules.common.CustomClip;
    // import AvatarClip = modules.common.AvatarClip;
    import CustomList = modules.common.CustomList;
    import SprintEquipmentViewUI = ui.SprintEquipmentViewUI;
    import CommonUtil = modules.common.CommonUtil;
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    export class SpintEquipMentRankPanel extends SprintEquipmentViewUI {
        private _cfg: sprint_rank_task;
        private _rankCfg1: sprint_rank;
        private _rankCfg2: sprint_rank;
        private _rankCfg3: sprint_rank;
        private _taskList: Array<SprintRankTaskNode>;
        private _rankList: Array<SprintRankNode>;
        private _taskBase: Array<BaseItem>;
        // private _modelClip: AvatarClip;
        private _btnClip: CustomClip;//按钮特效
        private _prizeEffect: CustomClip;//奖品特效
        private _modelClipTween: TweenJS;
        private _modeBaseImgTween: TweenJS;
        private _list: CustomList;
        private _getState: number = 0;
        private _endFlag: number = 0;
        private _type: number;
        private _activityTime: number = 0;
        private _skeletonClip: SkeletonAvatar;
        /**
         * 界面 当前类型  6
         */
        private _typeWin: number = 6;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._modeBaseImgTween) {
                this._modeBaseImgTween.stop();
                this._modeBaseImgTween = null;
            }
            if (this._modelClipTween) {
                this._modelClipTween.stop();
                this._modelClipTween = null;
            }
            // if (this._modelClip) {
            //     this._modelClip.removeSelf();
            //     this._modelClip.destroy();
            //     this._modelClip = null;
            // }
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            if (this._prizeEffect) {
                this._prizeEffect.removeSelf();
                this._prizeEffect.destroy();
                this._prizeEffect = null;
            }
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }

            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = this.centerY = 0;
            this._taskBase = [this.rushReward1, this.rushReward2, this.rushReward3];
            this.MissionStatementText.color = "#585858";
            this.MissionStatementText.style.fontFamily = "SimHei";
            this.MissionStatementText.style.fontSize = 26;
            this.creatEffect();
            this.initializePrizeEffect();
            this.initializeModelClip();
            this.initializeList();
        }

        protected addListeners(): void {
            super.addListeners();
            GlobalData.dispatcher.on(CommonEventType.SPRINT_RANK_TASK_UPDATE, this, this.updateRankTaskReward);
            GlobalData.dispatcher.on(CommonEventType.SPRINT_RANK_UPDATE, this, this.updateRankandTime);
            this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
            this.rankBtn.on(Event.CLICK, this, this.showRankBtn);
        }

        protected removeListeners(): void {
            super.removeListeners();
            GlobalData.dispatcher.off(CommonEventType.SPRINT_RANK_TASK_UPDATE, this, this.updateRankTaskReward);
            GlobalData.dispatcher.off(CommonEventType.SPRINT_RANK_UPDATE, this, this.updateRankandTime);
            this.sureBtn.off(Event.CLICK, this, this.sureBtnHandler);
            this.rankBtn.off(Event.CLICK, this, this.showRankBtn);
            Laya.timer.clear(this, this.activityHandler);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }

        public onOpened(): void {
            super.onOpened();
            this.setRankReward();
            SprintRankTaskCtrl.instance.getSprintRankInfo();
            SprintRankCtrl.instance.getSprintRankAllInfo();
            this.updateRankTaskReward();
            this.updateRankandTime();
        }

        private updateRankTaskReward(): void {
            this.setRankTaskReward();
        }

        private updateRankandTime(): void {
            this.showRank();
            this.setActivitiTime();
        }

        private setRankTaskReward(): void {
            this._taskList = SprintRankTaskModel.instance.taskList;
            if (!this._taskList) {
                return;
            }
            let shuju = this._taskList[this._typeWin];//无数据测试区
            if (shuju == undefined) {
                this._getState = 0;
                this._endFlag = 1;
            } else {
                this._getState = this._taskList[this._typeWin][SprintRankTaskNodeFields.state];
                this._endFlag = this._taskList[this._typeWin][SprintRankTaskNodeFields.endFlag];
            }
            this.setBtnSure();
            this.showTaskReward();
        }

        /**
         * 显示当前活动类型任务相关  奖励展示，任务名称 ，任务进度   （任务名称  任务进度  都依赖于服务器数据）
         */
        public showTaskReward() {
            for (var index = 0; index < this._taskBase.length; index++) {
                let element = this._taskBase[index];
                element.visible = false;
            }
            let taskId: number = 0;
            let param: number = 0;
            let rankParam: number = 0;
            if (this._taskList[this._typeWin] == undefined) {//无数据测试区
                this._cfg = SprintRankTaskCfg.instance.getCfgByType(this._typeWin)[0];//没有数据
            } else {
                taskId = this._taskList[this._typeWin][SprintRankTaskNodeFields.taskId];
                param = this._taskList[this._typeWin][SprintRankTaskNodeFields.param];
                rankParam = this._taskList[this._typeWin][SprintRankTaskNodeFields.rankParam];
                this._cfg = SprintRankTaskCfg.instance.getCfgById(taskId);
            }
            let rewards = this._cfg[sprint_rank_taskFields.reward];
            for (var index = 0; index < rewards.length; index++) {
                let element = rewards[index];
                let _taskBase: BaseItem = this._taskBase[index];
                if (_taskBase) {
                    _taskBase.dataSource = [rewards[index][ItemsFields.itemId], rewards[index][ItemsFields.count], 0, null];
                    _taskBase.visible = true;
                }
            }
            this.MissionStatementText.innerHTML = `${this._cfg[sprint_rank_taskFields.name]}达到<span style='color:#168a17'>&nbsp;${this._cfg[sprint_rank_taskFields.condition]}</span>级,可领取!`;
            this.scheduleText.text = `(${param}/${this._cfg[sprint_rank_taskFields.condition][0]})`;
            if (param >= this._cfg[sprint_rank_taskFields.condition][0]) {
                this.scheduleText.color = "#16ba17";
            } else {
                this.scheduleText.color = "#FF3e3e";
            }
            this.fightingText.text = `${rankParam}`;
        }

        private setBtnSure(): void {
            if (this._endFlag == 1) {
                RedPointCtrl.instance.setRPProperty("sprintRankEquipmentRP", false);
                this.sureBtn.visible = false;
                this.receivedImg.visible = false;
                this.overImg.visible = true;
                return;
            } else {
                this.overImg.visible = false;
            }
            if (this._getState == 0) {
                this.sureBtn.visible = true;
                this.sureBtn.label = this._typeWin == 7 ? "领取" : "前往";//
                this.sureBtn.skin = this._typeWin == 7 ? "common/btn_tongyong_6.png" : "common/btn_tongyong_18.png";
                this._btnClip.stop();
                this._btnClip.visible = false;
            } else if (this._getState == 1) {
                this.sureBtn.visible = true;
                this.sureBtn.label = "领取";
                this.sureBtn.skin = "common/btn_tongyong_6.png";
                this._btnClip.play();
                this._btnClip.visible = true;
            } else if (this._getState == 2) {
                this.sureBtn.visible = false;
                this.receivedImg.visible = true;
            }
        }

        /**
         * 界面排行信息相关
         */
        public showRank() {
            SprintRankModel.instance._skipId = WindowEnum.SPRINT_RANKTASK_EQUIPMENT_PANEL;//暂时记录上个打开的面板
            this._rankList = SprintRankModel.instance.rankList;
            let oneName: string;
            let nodeList: Array<SprintRankInfo> = new Array<SprintRankInfo>();
            if (this._rankList[this._typeWin] != undefined) {//无数据测试区
                nodeList = this._rankList[this._typeWin][SprintRankNodeFields.nodeList];
            }
            let myRank: SprintRankInfo = null;
            for (let i: int = 0; i < nodeList.length; i++) {
                if (nodeList[i][SprintRankInfoFields.objId] === PlayerModel.instance.actorId) {
                    myRank = nodeList[i];
                }
                if (nodeList[i][SprintRankInfoFields.rank] == 1) {
                    oneName = nodeList[i][SprintRankInfoFields.name];
                }
            }
            this.rankingText.text = `${myRank === null ? "未上榜" : myRank[SprintRankInfoFields.rank]}`;
            this.oneNameText.text = `${oneName ? oneName : "虚位以待"}`;
        }

        private setActivitiTime(): void {
            this._rankList = SprintRankModel.instance.rankList;
            if (this._rankList[this._typeWin]) {//无数据测试区
                this._type = this._rankList[this._typeWin][SprintRankNodeFields.endFlag];
            } else {
                this._type = 2
            }
            if (this._endFlag == 1) {
                if (!this.activityText.color) return;
                this.activityText1.color = "#FF3e3e";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";
                this.fightingText1.visible = false;
                this.fightingText.visible = false;
                return;
            }
            this.activityText.text = `${CommonUtil.timeStampToHHMMSS(SprintRankModel.instance.restTm)}`;
            if (SprintRankModel.instance.restTm >= GlobalData.serverTime) {
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            }
        }

        private activityHandler(): void {
            this.activityText.text = `${CommonUtil.timeStampToHHMMSS(SprintRankModel.instance.restTm)}`;
            if (SprintRankModel.instance.restTm < GlobalData.serverTime) {
                this.activityText1.color = "#FF3e3e";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        /**
         * 前往按钮
         */
        private sureBtnHandler(): void {
            if (this._getState == 0) {
                let skipId: number = this._rankCfg1[sprint_rankFields.skipId];
                WindowManager.instance.openByActionId(skipId);
                WindowManager.instance.close(WindowEnum.SPRINT_RANKTASK_XIANQI_PANEL);
                // SystemNoticeManager.instance.addNotice("战力不足", true);
            } else if (this._getState == 1) {
                let rewards: Array<Items> = this._cfg[sprint_rank_taskFields.reward];
                let items: Array<Item> = [];
                for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                    let item: Items = rewards[i];
                    items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                }
                if (BagUtil.canAddItemsByBagIdCount(items)) {
                    SprintRankTaskCtrl.instance.getSprintRankRewar();
                }
            }
        }

        //打开榜单
        private showRankBtn(): void {
            WindowManager.instance.open(WindowEnum.SPRINT_RANK_TASK_ALERT, this._typeWin);//无数据测试区
        }

        /**
         * 显示奖励界面信息
         */
        private setRankReward(): void {
            this._rankCfg1 = SprintRankCfg.instance.getCfgsByGrade(this._typeWin, 0);
            this._rankCfg2 = SprintRankCfg.instance.getCfgsByGrade(this._typeWin, 1);
            this._rankCfg3 = SprintRankCfg.instance.getCfgsByGrade(this._typeWin, 2);
            let reward1: Array<Items> = this._rankCfg1[sprint_rankFields.reward];
            let reward2: Array<Items> = this._rankCfg2[sprint_rankFields.reward];
            let reward3: Array<Items> = this._rankCfg3[sprint_rankFields.reward];
            let showIdArr1: Array<Item> = [];
            let showIdArr2: Array<Item> = [];
            let showIdArr3: Array<Item> = [];
            let baseItems1: BaseItem[] = [this.oneReward1, this.oneReward2, this.oneReward3];
            let baseItems2: BaseItem[] = [this.twoReward1, this.twoReward2, this.twoReward3];
            let baseItems3: BaseItem[] = [this.fourReward1, this.fourReward2, this.fourReward3];
            for (let i: int = 0; i < reward1.length; i++) {
                showIdArr1.push([reward1[i][ItemsFields.itemId], reward1[i][ItemsFields.count], 0, null]);
            }
            for (let i: int = 0; i < reward2.length; i++) {
                showIdArr2.push([reward2[i][ItemsFields.itemId], reward2[i][ItemsFields.count], 0, null]);
            }
            for (let i: int = 0; i < reward3.length; i++) {
                showIdArr3.push([reward3[i][ItemsFields.itemId], reward3[i][ItemsFields.count], 0, null]);
            }
            let count1: number = showIdArr1.length;
            let count2: number = showIdArr2.length;
            let count3: number = showIdArr3.length;
            for (let i: int = 0; i < 3; i++) {
                if (i < count1) {
                    baseItems1[i].visible = true;
                    baseItems1[i].dataSource = showIdArr1[i];
                } else {
                    baseItems1[i].visible = false;
                }
                if (i < count2) {
                    baseItems2[i].visible = true;
                    baseItems2[i].dataSource = showIdArr2[i];
                } else {
                    baseItems2[i].visible = false;
                }
                if (i < count3) {
                    baseItems3[i].visible = true;
                    baseItems3[i].dataSource = showIdArr3[i];
                } else {
                    baseItems3[i].visible = false;
                }
            }
            this.onefightingText.text = `上榜战力条件：${this._rankCfg1[sprint_rankFields.condition]}`;
            this.twoFightingText.text = `上榜战力条件：${this._rankCfg2[sprint_rankFields.condition]}`;
            this.fourFightingText.text = `上榜战力条件：${this._rankCfg3[sprint_rankFields.condition]}`;
            let isModel = this._rankCfg1[sprint_rankFields.isModel];
            let showId: number = this._rankCfg1[sprint_rankFields.showId];
            let isMove: number = this._rankCfg1[sprint_rankFields.isMove];
            let getWayId = this._rankCfg1[sprint_rankFields.getWayId];
            if (this._modeBaseImgTween) {
                this._modeBaseImgTween.stop();
            }
            if (this._modelClipTween) {
                this._modelClipTween.stop();
            }
            if (isModel == 2) {//图片
                this.modelImg.visible = true;
                this.modelImg.skin = `assets/icon/ui/sprint_rank/${showId}.png`;//图片路径
                // this.modelImg.x = (this.bangShouBgImg.width - this.modelImg.width) / 2;
                if (this._prizeEffect) {
                    this._prizeEffect.play();
                    this._prizeEffect.visible = true;
                }
                this.modelImg.centerY = 0;
                if (isMove == 1) {
                    this._modeBaseImgTween = TweenJS.create(this.modelImg).to({ centerY: this.modelImg.centerY - 10 },
                        1000).start().yoyo(true).repeat(99999999);
                }
            } else {
                this.modelImg.visible = false;
                this.setAvatar(showId);
                if (this._prizeEffect) {
                    this._prizeEffect.stop();
                    this._prizeEffect.visible = false;
                }
                //新增 统一处理
                // this._modelClip.y = 590;
                this._skeletonClip.y = 780;
                let typeNum = Math.round(showId / 1000);
                if (isModel == 1) {
                    if (typeNum == 9 || typeNum == 10) {//法阵
                        // this._modelClip.reset(0, 0, 0, 0, showId);
                        // this._skeletonClip.reset(0, 0, 0, 0, showId)
                        // this._modelClip.y = 90;
                    }
                } else {
                    // this._modelClip.reset(showId);
                    this._skeletonClip.reset(0, 0, 0, 0, 0, showId)
                    if (typeNum == 2) {  //宠物
                    } else if (typeNum == 3) {//翅膀
                    } else if (typeNum == 4) {//精灵
                    } else if (typeNum == 5) {//幻武
                    } else if (typeNum == 90) { //时装
                        // this._modelClip.y = 615;
                        this._skeletonClip.y = 615;
                    } else if (typeNum == 11) { //灵珠
                        this._skeletonClip.y = 780;
                        this._skeletonClip.resetScale(AvatarAniBigType.clothes,0.7)
                        if (this._skeletonClip) {
                            this._skeletonClip.playAnim(AvatarAniBigType.tianZhu, ActionType.DAIJI);
                        }
                    } else {
                    }
                }
                //。。。。。。。
                if (this._prizeEffect) {
                    this._prizeEffect.stop();
                    this._prizeEffect.visible = false;
                }
                // if (isMove == 1) {
                //     this._modelClipTween = TweenJS.create(this._modelClip).to({ y: this._modelClip.y - 10 },
                //         1000).start().yoyo(true).repeat(99999999);
                // }
            }
            if (getWayId) {
                let _datas: Array<any> = [];
                for (var i = 0; i < getWayId.length; i++) {
                    _datas[i] = {id: getWayId[i], type: this._typeWin}
                }
                this._list.datas = _datas;
                let leng = this._list.datas.length;
                leng = leng > 3 ? 3 : leng;
                let chagndu = leng * 100 + (leng - 1) * this._list.spaceX;
                this._list.x = (this.getWayBox.width - chagndu) / 2;
            }
        }

        public initializeList() {
            this._list = new CustomList();
            this._list.width = 300;
            this._list.height = 120;
            this._list.hCount = 3;
            this._list.spaceX = 0;
            // this._list.scrollDir = 1;
            this._list.itemRender = SprintItem;
            this._list.x = 10;
            this._list.y = 37;
            this.getWayBox.addChild(this._list);
        }

        /**
         * 初始化模型
         */
        public initializeModelClip() {
            // this._modelClip = AvatarClip.create(1024, 1024, 1024);
            // this.addChildAt(this._modelClip, 4);
            // this._modelClip.pos(200, 590, true);
            // this._modelClip.anchorX = 0.5;
            // this._modelClip.anchorY = 0.5;
            // this._modelClip.mouseEnabled = false;
            this._skeletonClip = SkeletonAvatar.createShow(this, this);
            this._skeletonClip.pos(200, 590, true);
            this._skeletonClip.mouseEnabled = false;
        }

        /**
         * 设置 并显示模型
         * @param showId
         */
        private setAvatar(showId: number): void {
            let extercfg: Configuration.ExteriorSK = ExteriorSKCfg.instance.getCfgById(showId);
            if (!extercfg) return;
            // this._modelClip.avatarRotationY = extercfg[Configuration.ExteriorSKFields.rotationY] ? extercfg[Configuration.ExteriorSKFields.rotationY] : 180;
            // this._modelClip.avatarScale = extercfg[Configuration.ExteriorSKFields.scale] ? (extercfg[Configuration.ExteriorSKFields.scale] * 768 / 1280) : 1;
            // this._modelClip.avatarRotationX = extercfg[Configuration.ExteriorSKFields.rotationX] ? extercfg[Configuration.ExteriorSKFields.rotationX] : 0;
            // this._modelClip.avatarX = extercfg[Configuration.ExteriorSKFields.deviationX] ? extercfg[Configuration.ExteriorSKFields.deviationX] : 0;
            // this._modelClip.avatarY = extercfg[Configuration.ExteriorSKFields.deviationY] ? extercfg[Configuration.ExteriorSKFields.deviationY] : 0;
        }

        /**
         * 初始化 奖品特效
         */
        public initializePrizeEffect() {
            this._prizeEffect = new CustomClip();
            this.modeBaselImg.addChildAt(this._prizeEffect, 0);
            this._prizeEffect.skin = "assets/effect/ok_state.atlas";
            this._prizeEffect.frameUrls = ["ok_state/0.png", "ok_state/1.png", "ok_state/2.png", "ok_state/3.png", "ok_state/4.png",
                "ok_state/5.png", "ok_state/6.png", "ok_state/7.png"];
            this._prizeEffect.durationFrame = 5;
            this._prizeEffect.loop = true;
            this._prizeEffect.pos(-98, -155, true);
            this._prizeEffect.scale(2, 2, true);
            // this._prizeEffect.play();
            this._prizeEffect.visible = false;
        }

        /**
         * 初始化 按钮特效
         */
        private creatEffect(): void {
            this._btnClip = new CustomClip();
            this.sureBtn.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.play();
            this._btnClip.loop = true;
            this._btnClip.pos(-5, -9);
            this._btnClip.scale(1, 1);
            this._btnClip.visible = false;
        }
    }
}
