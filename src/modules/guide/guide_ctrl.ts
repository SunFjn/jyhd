///<reference path="../config/guide_cfg.ts"/>


/** 新手引导*/


namespace modules.guide {
    import BaseCtrl = modules.core.BaseCtrl;
    import guide = Configuration.guide;
    import GuideCfg = modules.config.GuideCfg;
    import guideFields = Configuration.guideFields;
    import GetGuideListReply = Protocols.GetGuideListReply;
    import GetGuideListReplyFields = Protocols.GetGuideListReplyFields;
    import FinishGuideReply = Protocols.FinishGuideReply;
    import FinishGuideReplyFields = Protocols.FinishGuideReplyFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import TaskModel = modules.task.TaskModel;
    import SingleTaskFields = Protocols.SingleTaskFields;
    import MissionModel = modules.mission.MissionModel;

    export class GuideCtrl extends BaseCtrl {
        private static _instance: GuideCtrl;
        public static get instance(): GuideCtrl {
            return this._instance = this._instance || new GuideCtrl();
        }

        private _guide: guide;
        // 下一步引导
        private _nextGuide: guide;
        // 等待的引导（关闭UI导致引导面板关闭）
        private _waitGuide: guide;

        private _recordTriggerGuide: Array<number>;

        constructor() {
            super();
        }

        public setup(): void {
            // 获取所有完成的引导返回
            Channel.instance.subscribe(SystemClientOpcode.GetGuideListReply, this, this.getGuideListReply);
            // 完成引导返回
            Channel.instance.subscribe(SystemClientOpcode.FinishGuideReply, this, this.finishGuideReply);

            GlobalData.dispatcher.on(CommonEventType.GUIDE_REST_INITED, this, this.initedGuides);

            this.requsetAllData();
            LayerManager.instance.lockAllLayer(true);
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            // 获取所有完成的指引
            this.getGuideList();    
        }       

        // 获取所有完成的指引
        public getGuideList(): void {
            // console.log("获取所有完成的指引...................");
            Channel.instance.publish(UserFeatureOpcode.GetGuideList, null);
        }

        // 获取所有完成的引导返回
        private getGuideListReply(value: GetGuideListReply): void {
            // console.log("获取所有完成的指引返回......................" + value);
            GuideModel.instance.initGuides(value[GetGuideListReplyFields.list]);
        }

        // 完成引导
        public finishGuide(value: Array<number>): void {
            // console.log("完成引导................" + value);
            Channel.instance.publish(UserFeatureOpcode.FinishGuide, [value]);
        }

        // 完成引导返回
        private finishGuideReply(value: FinishGuideReply): void {
            // console.log("完成引导返回...................." + value);
            let code: number = value[FinishGuideReplyFields.code];
            if (code === 0) {

            } else modules.common.CommonUtil.noticeError(code);
        }

        // 触发指引后台记录
        private triggerGuide(guideId: number): void {
            if (!this._recordTriggerGuide) this._recordTriggerGuide = [];
            if (this._recordTriggerGuide.indexOf(guideId) === -1) {
                this._recordTriggerGuide.push(guideId);
                // console.log("触发指引后台记录.............." + guideId);
                Channel.instance.publish(UserFeatureOpcode.TriggerGuide, [[guideId]]);
            }
        }

        // 剩余引导初始化完成之后根据剩余引导添加侦听
        private initedGuides(): void {
            this.removeAllTriggerListeners();
            this.removeAllCompleteListeners();
            let guides: Array<guide> = GuideModel.instance.restGuides;
            for (let i: int = 0, len: int = guides.length; i < len; i++) {
                let guide: guide = guides[i];
                let triggers: Array<Array<number>> = guide[guideFields.triggerType];
                for (let j: int = 0, len1: int = triggers.length; j < len1; j++) {
                    let triggerType: GuideTriggerType = triggers[j][0];
                    if (triggerType === GuideTriggerType.PlayerLevel) {       // 人物等级
                        GlobalData.dispatcher.on(CommonEventType.PLAYER_UPDATE_LEVEL, this, this.checkTrigger);
                    } else if (triggerType === GuideTriggerType.GuideComplete) {       // 引导完成
                        // GlobalData.dispatcher.on(CommonEventType.GUIDE_COMPLETE, this, this.checkTrigger);
                    } else if (triggerType === GuideTriggerType.TaskComplete || triggerType === GuideTriggerType.TaskDoing || triggerType === GuideTriggerType.TaskIDEqual) {        // 任务
                        GlobalData.dispatcher.on(CommonEventType.TASK_UPDATED, this, this.checkTrigger);
                    } else if (triggerType === GuideTriggerType.MissionLevel) {        // 天关等级
                        GlobalData.dispatcher.on(CommonEventType.MISSION_UPDATE_LV, this, this.checkTrigger);
                    } else if (triggerType === GuideTriggerType.RegisteUI) {         // 注册UI
                        GlobalData.dispatcher.on(CommonEventType.GUIDE_REGISTE_UI, this, this.checkTrigger);
                        // 如果依赖注册UI触发，则移除UI时需要取消触发
                        GlobalData.dispatcher.on(CommonEventType.GUIDE_REMOVE_UI, this, this.cancelTrigger);
                    }
                }
            }

            this.checkTrigger();
        }

        // 移除所有的触发侦听
        private removeAllTriggerListeners(): void {
            GlobalData.dispatcher.off(CommonEventType.PLAYER_UPDATE_LEVEL, this, this.checkTrigger);
            // GlobalData.dispatcher.off(CommonEventType.GUIDE_COMPLETE, this, this.checkTrigger);
            GlobalData.dispatcher.off(CommonEventType.TASK_UPDATED, this, this.checkTrigger);
            GlobalData.dispatcher.off(CommonEventType.MISSION_UPDATE_LV, this, this.checkTrigger);
            GlobalData.dispatcher.off(CommonEventType.GUIDE_REGISTE_UI, this, this.checkTrigger);
            GlobalData.dispatcher.off(CommonEventType.GUIDE_REMOVE_UI, this, this.cancelTrigger);
        }

        // 移除所有的完成侦听
        private removeAllCompleteListeners(): void {
            GlobalData.dispatcher.off(CommonEventType.GUIDE_CLICK_TARGET, this, this.checkComplete);
            GlobalData.dispatcher.off(CommonEventType.GUIDE_CD_COMPLETE, this, this.checkComplete);
            GlobalData.dispatcher.off(CommonEventType.PLAYER_UPDATE_LEVEL, this, this.checkComplete);
            // GlobalData.dispatcher.off(CommonEventType.GUIDE_COMPLETE, this, this.checkComplete);
            GlobalData.dispatcher.off(CommonEventType.TASK_UPDATED, this, this.checkComplete);
            GlobalData.dispatcher.off(CommonEventType.MISSION_UPDATE_LV, this, this.checkComplete);
            GlobalData.dispatcher.off(CommonEventType.PANEL_CLOSE, this, this.checkComplete);
        }

        // 取消触发
        private cancelTrigger(id: GuideSpriteId): void {
            if (this._guide) {
                let triggers: Array<Array<number>> = this._guide[guideFields.triggerType];
                for (let i: int = 0, len: int = triggers.length; i < len; i++) {
                    let triggerType: GuideTriggerType = triggers[i][0];
                    if (triggerType === GuideTriggerType.RegisteUI && id === triggers[i][1]) {
                        this._waitGuide = this._guide;      // 因为事件没有优先级，取消触发时如果清掉this._guide会导致点击完成引导无效，这里需要特殊处理
                        // this._guide = null;
                        // this.removeAllCompleteListeners();
                        WindowManager.instance.close(WindowEnum.GUIDE_PANEL);
                        // this.checkTrigger();
                        break;
                    }
                }
            }
        }

        // 触发引导
        private checkTrigger(): void {
            if (this._guide && !this._nextGuide && !this._waitGuide) {
                // LayerManager.instance.lockAllLayer(false);
                return;
            }
            // console.log('检测下一步');
            let lockFlag: boolean = false;
            // 强引导锁屏
            if (this._nextGuide && this._nextGuide[guideFields.lock] === 1) {
                lockFlag = true;
                LayerManager.instance.lockAllLayer(lockFlag)
            }
            // console.log('检测下一步');
            // 有下一步直接检测下一步，没有下一步则遍历
            if (this._nextGuide) {
                let flag: boolean = this.checkGuideTrigger(this._nextGuide);
                if (flag) {           // 可触发
                    this.trigger(this._nextGuide);
                }
            } else {
                // 找出应该触发的引导
                let guides: Array<guide> = GuideModel.instance.restGuides;
                for (let i: int = 0, len: int = guides.length; i < len; i++) {
                    let guide: guide = guides[i];
                    // 如果是接着上一个引导的，不用判断所有引导
                    if (!this._waitGuide || guide === this._waitGuide) {
                        let flag: boolean = this.checkGuideTrigger(guide);
                        if (flag) {           // 可触发
                            // 强引导锁屏
                            if (guide[guideFields.lock] === 1) {
                                lockFlag = true;
                                LayerManager.instance.lockAllLayer(lockFlag)
                            }
                            this.trigger(guide);
                            break;
                        }
                    }
                }
            }
            if (!lockFlag) LayerManager.instance.lockAllLayer(lockFlag);
        }

        // 检测单个引导是否触发
        private checkGuideTrigger(guide: guide): boolean {
            let triggers: Array<Array<number>> = guide[guideFields.triggerType];
            let flag: boolean = triggers.length > 0;  // 没有触发条件不能触发
            for (let j: int = 0, len1: int = triggers.length; j < len1; j++) {
                let triggerType: GuideTriggerType = triggers[j][0];
                if (triggerType === GuideTriggerType.PlayerLevel) {       // 人物等级
                    flag = flag && this.checkPlayerLevel(triggers[j][1]);
                    if (!flag) break;
                } else if (triggerType === GuideTriggerType.GuideComplete) {       // 引导完成
                    flag = flag && this.checkGuideComplete(triggers[j][1]);
                    if (!flag) break;
                } else if (triggerType === GuideTriggerType.TaskComplete) {        // 任务完成
                    flag = flag && this.checkTaskComplete(triggers[j][1]);
                    if (!flag) break;
                } else if (triggerType === GuideTriggerType.MissionLevel) {        // 天关等级
                    flag = flag && this.checkMissionLevel(triggers[j][1]);
                    if (!flag) break;
                } else if (triggerType === GuideTriggerType.RegisteUI) {         // 注册UI
                    flag = flag && this.checkRegisteUI(triggers[j][1]);
                    if (!flag) break;
                } else if (triggerType === GuideTriggerType.TaskDoing) {       // 任务正在执行
                    flag = flag && this.checkTaskDoing(triggers[j][1]);
                    if (!flag) break;
                } else if (triggerType === GuideTriggerType.TaskIDEqual) {
                    flag = flag && this.checkTaskIDEqual(triggers[j][1]);
                    if (!flag) break;
                }
            }
            return flag;
        }

        // 触发引导
        private trigger(guide: guide) {
            this.guide = guide;
            //console.log("触发引导..............." + guide);
            this.triggerGuide(guide[guideFields.id]);
            let flag: boolean = this.checkComplete([-1], null);
            if (!flag) {
                // GuideModel.instance.curGuide = guide;
                // 侦听完成条件
                let completes: Array<Array<number>> = guide[guideFields.completeType];
                let flag: boolean = completes.length > 0;
                for (let i: int = 0, len: int = completes.length; i < len; i++) {
                    let completeType: GuideCompleteType = completes[i][0];
                    if (completeType === GuideCompleteType.ClickTarget) {
                        GlobalData.dispatcher.on(CommonEventType.GUIDE_CLICK_TARGET, this, this.checkComplete, [[completeType]]);
                    } else if (completeType === GuideCompleteType.CDComplete) {
                        GlobalData.dispatcher.on(CommonEventType.GUIDE_CD_COMPLETE, this, this.checkComplete, [[completeType]]);
                    } else if (completeType === GuideCompleteType.PlayerLevel) {
                        GlobalData.dispatcher.on(CommonEventType.PLAYER_UPDATE_LEVEL, this, this.checkComplete, [[completeType]]);
                    } else if (completeType === GuideCompleteType.GuideComplete) {
                        // GlobalData.dispatcher.on(CommonEventType.GUIDE_COMPLETE, this, this.checkComplete, [[completeType]]);
                    } else if (completeType === GuideCompleteType.TaskComplete || completeType === GuideCompleteType.TaskDoing) {
                        GlobalData.dispatcher.on(CommonEventType.TASK_UPDATED, this, this.checkComplete, [[completeType]]);
                    } else if (completeType === GuideCompleteType.MissionLevel) {
                        GlobalData.dispatcher.on(CommonEventType.MISSION_UPDATE_LV, this, this.checkComplete, [[completeType]]);
                    } else if (completeType === GuideCompleteType.PanelClose) {
                        GlobalData.dispatcher.on(CommonEventType.PANEL_CLOSE, this, this.checkComplete, [[completeType]]);
                    }
                }
                // console.log("打开引导..............." + guide[guideFields.id], guide);
                WindowManager.instance.open(WindowEnum.GUIDE_PANEL, guide[guideFields.layer]);
            }
        }

        // 检测引导是否完成（只对当前触发的引导有效，如果达到完成条件会直接完成）
        private checkComplete(params: Array<any>, params1: any): boolean {
            if (!this._guide) return false;
            // 检测是否达到完成条件，达到则直接完成，并检测下一个触发
            let flag: boolean = this.checkCanComplete(this._guide, params, params1);
            if (flag) {
                this.completeGuide();
            }
            return flag;
        }

        // 检测引导是否可以完成（单纯检测，可以检测任意引导）
        private checkCanComplete(guide: guide, params: Array<any> = [-1], params1: any = null): boolean {
            if (!guide) return false;
            let type: GuideCompleteType = params[0];
            let completes: Array<Array<number>> = guide[guideFields.completeType];
            let flag: boolean = false;
            for (let i: int = 0, len: int = completes.length; i < len; i++) {
                let completeType: GuideCompleteType = completes[i][0];
                if (completeType === GuideCompleteType.ClickTarget) {
                    flag = flag || (type === GuideCompleteType.ClickTarget && params1 === completes[i][1]);
                    if (flag) break;
                } else if (completeType === GuideCompleteType.CDComplete) {
                    flag = flag || type === GuideCompleteType.CDComplete;
                    if (flag) break;
                } else if (completeType === GuideCompleteType.PlayerLevel) {
                    flag = flag || this.checkPlayerLevel(completes[i][1]);
                    if (flag) break;
                } else if (completeType === GuideCompleteType.GuideComplete) {
                    flag = flag || this.checkGuideComplete(completes[i][1]);
                    if (flag) break;
                } else if (completeType === GuideCompleteType.TaskComplete) {
                    flag = flag || this.checkTaskComplete(completes[i][1]);
                    if (flag) break;
                } else if (completeType === GuideCompleteType.MissionLevel) {
                    flag = flag || this.checkMissionLevel(completes[i][1]);
                    if (flag) break;
                } else if (completeType === GuideCompleteType.PanelClose) {
                    flag = flag || this.checkPanelClose(completes[i][1]);
                    if (flag) break;
                } else if (completeType === GuideCompleteType.TaskDoing) {
                    flag = flag || this.checkTaskDoing(completes[i][1]);
                    if (flag) break;
                }
            }
            return flag;
        }

        // 完成一个引导，区分是否需要保存到服务器
        private completeGuide(): void {
            // console.log("完成一个引导............." + this._guide[guideFields.id]);
            LayerManager.instance.lockAllLayer(false);
            this.removeAllCompleteListeners();
            this._waitGuide = null;
            this._nextGuide = null;
            let needSaveIds: Array<number> = this._guide[guideFields.completeIds];
            if (needSaveIds && needSaveIds.length > 0) {      //
                let nextId: number = this._guide[guideFields.nextId];
                this.guide = null;
                WindowManager.instance.close(WindowEnum.GUIDE_PANEL);
                GuideModel.instance.completeGuides(needSaveIds);
                GuideCtrl.instance.finishGuide(needSaveIds);        // 本地直接算完成，然后发送给服务器做保存，不依赖服务器的返回结果
                if (nextId) {     // 固定触发的引导
                    let guides: Array<guide> = GuideCfg.instance.cfgs;       // 从配置中遍历
                    for (let i: int = 0, len: int = guides.length; i < len; i++) {
                        if (nextId === guides[i][guideFields.id]) {
                            this._nextGuide = guides[i];        // 下一步可能已经保存为完成了，但还是应该触发
                            break;
                        }
                    }
                    if (this.checkCanComplete(this._nextGuide)) {     // 如果下一步是可以完成的，直接完成
                        this._guide = this._nextGuide;
                        this.completeGuide();
                    } else {
                        this.checkTrigger();
                    }
                } else {
                    this.checkTrigger();
                }
            } else {
                WindowManager.instance.close(WindowEnum.GUIDE_PANEL);
                // 本地算完成，但不保存到服务器，刷新后会重新触发

                GuideModel.instance.completeGuides([this._guide[guideFields.id]]);
                let nextId: number = this._guide[guideFields.nextId];
                this.guide = null;
                if (nextId) {     // 固定触发的引导
                    let guides: Array<guide> = GuideModel.instance.restGuides;       // 从剩余引导中遍历
                    for (let i: int = 0, len: int = guides.length; i < len; i++) {
                        if (nextId === guides[i][guideFields.id]) {
                            this._nextGuide = guides[i];
                            if (this.checkCanComplete(this._nextGuide)) {
                                this._guide = this._nextGuide;
                                this.completeGuide();
                            } else {
                                this.checkTrigger();
                            }
                            break;
                        }
                    }
                } else {
                    this.checkTrigger();
                }
            }
        }





        private set guide(value: guide) {
            this._guide = value;
            GuideModel.instance.curGuide = value;

        }

        // 检测玩家等级
        private checkPlayerLevel(level: int): boolean {
            return PlayerModel.instance.level >= level;
        }

        // 检测引导完成
        private checkGuideComplete(guideId: number): boolean {
            let guides: Array<guide> = GuideModel.instance.restGuides;
            let flag: boolean = true;
            for (let i: int = 0, len: int = guides.length; i < len; i++) {
                if (guideId === guides[i][guideFields.id]) {
                    flag = false;
                    break;
                }
            }
            return flag;
        }

        // 检测任务完成
        private checkTaskComplete(taskId: number): boolean {
            return TaskModel.instance.taskInfo[SingleTaskFields.taskId] === "m" + taskId && TaskModel.instance.taskInfo[SingleTaskFields.state] === 2;
        }

        // 检测天关等级
        private checkMissionLevel(missionLevel: number): boolean {
            return MissionModel.instance.curLv >= missionLevel;
        }

        // 检测注册UI
        private checkRegisteUI(spriteId: GuideSpriteId): boolean {



            return !!GuideModel.instance.getUIByid(spriteId);
        }

        // 检测任务正在执行
        private checkTaskDoing(taskId: number): boolean {
            return TaskModel.instance.taskInfo[SingleTaskFields.taskId] === "m" + taskId && TaskModel.instance.taskInfo[SingleTaskFields.state] === 1;
        }

        // 检测面板关闭
        private checkPanelClose(panelId: WindowEnum): boolean {
            return !WindowManager.instance.isOpened(panelId);
        }

        // 检测任务ID是否等于
        private checkTaskIDEqual(taskId: number): boolean {
            return TaskModel.instance.taskInfo[SingleTaskFields.taskId] === "m" + taskId;
        }
    }
}