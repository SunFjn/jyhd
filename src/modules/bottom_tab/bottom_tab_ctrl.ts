///<reference path="../core/base_ctrl.ts"/>
///<reference path="../config/action_open_cfg.ts"/>
///<reference path="../notice/system_notice_manager.ts"/>
///<reference path="../guide/guide_model.ts"/>
///<reference path="../scene/scene_model.ts"/>
///<reference path="../config/scene_cfg.ts"/>
///<reference path="../func_open/func_open_model.ts"/>
///<reference path="../red_point/red_point_ctrl.ts"/>
///<reference path="../prevent_fool_question/prevent_fool_ctrl.ts"/>
///<reference path="../config/task_cfg.ts"/>
///<reference path="../task/task_model.ts"/>
/** 底部tab*/


namespace modules.bottomTab {
    import action_openFields = Configuration.action_openFields;
    import Button = Laya.Button;
    import Event = Laya.Event;
    import Sprite = Laya.Sprite;
    import Image = laya.ui.Image;
    import ActionOpenCfg = modules.config.ActionOpenCfg;
    import BaseCtrl = modules.core.BaseCtrl;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import TabInfo = ui.TabInfo;
    import TabInfoFields = ui.TabInfoFields;
    import WindowInfoFields = ui.WindowInfoFields;
    import WindowEnum = ui.WindowEnum;
    import RedPointProperty = ui.RedPointProperty;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import GuideModel = modules.guide.GuideModel;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import WindowInfo = ui.WindowInfo;
    import PanelType = ui.PanelType;
    import PreventFoolCtrl = modules.prevent_fool_question.PreventFoolCtrl;
    import TaskCfg = modules.config.TaskCfg;
    import TaskModel = modules.task.TaskModel;

    export class BottomTabCtrl extends BaseCtrl {
        private static _instance: BottomTabCtrl;
        public static get instance(): BottomTabCtrl {
            return this._instance = this._instance || new BottomTabCtrl();
        }
        //引导强制锁定
        public _guideLock: boolean = false;

        private _grayBg: Sprite;
        private _bg: Image;
        private _tab: BottomTab;
        // private _mask
        private _backBtn: Button;
        private _backBg: Laya.Image;

        // 打开的面板
        private _panelId: WindowEnum;

        // 面板栈
        private _panelsStack: Array<WindowEnum>;
        // 场景里的面板栈
        private _panelsStackInScene: Array<WindowEnum>;
        // 是否在挂机场景中
        private _isHook: boolean;
        // 弹框栈
        private _dialogsStack: Array<WindowEnum>;

        constructor() {
            super();

            this._grayBg = new Sprite();
            this._grayBg.alpha = 0.8;
            this._grayBg.mouseEnabled = true;
            this._grayBg.mouseThrough = false;

            this._bg = new Image("common/bg0_mainui_bottom.png");
            this._bg.centerX = 0;
            this._bg.bottom = 0;
            this._bg.zOrder = 810;

            this._tab = BottomTab.instance;
            this._tab.zOrder = 800;

            this._backBg = new Laya.Image("bottom_tab/backBg.png");
            this._backBg.centerX = 279;
            this._backBg.bottom = -2;
            this._backBg.zOrder = 790;

            this._backBtn = new Button("bottom_tab/btn_common_fh.png");
            this._backBtn.centerX = 281;
            this._backBtn.bottom = 12;
            this._backBtn.stateNum = 1;
            this._backBtn.zOrder = 801;
            this._backBtn.label = "";
            this._backBtn.on(Laya.Event.DISPLAY, this, this.backBtnDisplayHandler);
            this._backBtn.on(Laya.Event.UNDISPLAY, this, this.backBtnUndisplayHandler);

            this._panelsStack = [];
            this._panelsStackInScene = [];
            this._isHook = false;
            this._dialogsStack = [];

            this.setup();
        }

        public setup(): void {
            // GlobalData.dispatcher.on(CommonEventType.SCENE_ENTER, this, this.enterScene);
        }

        private backBtnDisplayHandler(): void {
            GuideModel.instance.registeUI(GuideSpriteId.BOTTOM_TAB_RETURN_BTN, this._backBtn);

        }

        private backBtnUndisplayHandler(): void {
            GuideModel.instance.removeUI(GuideSpriteId.BOTTOM_TAB_RETURN_BTN);

        }

        public get tab(): BottomTab {
            return this._tab;
        }

        public get imgs(): Array<Image> {
            return this._tab.imgs;
        }

        public get backBtn(): Button {
            return this._backBtn;
        }

        // 根据面板打开切页(面板打开时已经判断过功能是否开启,这里直接切页即可)
        public openTabByPanel(panelId: WindowEnum): void {
            // if(this._panelId === panelId) return;
            this._panelId = panelId;
            // 获取面板对应的切页信息
            let tabInfo: TabInfo = BottomTabConfig.instance.getTabInfoByPanelId(panelId);
            if (!tabInfo) return;
            // console.log("打开面板切页，切页ID:", panelId, "切页名字:", tabInfo[TabInfoFields.names])
            // console.log("切页信息", tabInfo)
            this._tab.tabInfo = tabInfo;
            let selectedTabIndex: int = -1;
            let selectedPanelIndex: int = -1;
            let index: int = 0;
            // 找到对应的切页
            for (let i: int = 0, len: int = tabInfo[TabInfoFields.panelIdsArr].length; i < len; i++) {
                let panelIds: Array<number> = tabInfo[TabInfoFields.panelIdsArr][i];
                // console.log('vtz:---panelIds', panelIds);
                let flag: boolean = true;
                for (let j: int = 0, len1: int = panelIds.length; j < len1; j++) {
                    if (!this.isFuncClose(panelIds[j])) {
                        flag = false;
                        break;
                    }
                }
                if (flag) continue;
                selectedPanelIndex = panelIds.indexOf(panelId);
                if (selectedPanelIndex !== -1) {
                    selectedTabIndex = index;
                    break;
                }
                index++;
            }

            if (selectedTabIndex === -1 || selectedPanelIndex === -1) {
                // SystemNoticeManager.instance.addNotice("面板" + this._panelId + "无法打开，请检查配置", true);
                return;
            }
            // console.log("切页信息2", this._panelId)
            this._tab.panelId = this._panelId;
            this._tab.selectedIndex = selectedTabIndex;

            let panel: BaseView = WindowManager.instance.getPanelById(this._panelId);
            if (panel && panel.parent) {
                this.addTabToStage();
            } else if (this._panelId) {
                GlobalData.dispatcher.on(CommonEventType.PANEL_OPEN, this, this.panelOpenHandler);
            }
            GlobalData.dispatcher.on(CommonEventType.RESIZE_UI, this, this.resizeHandler);
            this._backBtn.on(Event.CLICK, this, this.backHandler);
            this.resizeHandler();

            // 加入面板栈
            let stack: Array<WindowEnum> = this._isHook ? this._panelsStack : this._panelsStackInScene;
            if (stack.length === 0) {
                stack.push(this._panelId);
            } else {
                // console.log("切页调试2")
                let info: TabInfo = BottomTabConfig.instance.getTabInfoByPanelId(stack[stack.length - 1]);
                if (info !== tabInfo) {           // 不是同一个切页直接加入
                    stack.push(this._panelId);
                } else {      // 同一个切页替换掉最后一个面板
                    stack[stack.length - 1] = this._panelId;
                }
            }

            if (stack.length > 0) {
                GlobalData.dispatcher.event(CommonEventType.TOP_PANEL_SECOND_VIEW, false);
            }
        }

        // 根据功能打开切页(切页入口用)
        public openTabByFunc(funcId: ActionOpenId): void {
            // console.log("测试入口", funcId, ActionOpenCfg.instance.getCfgById(funcId))
            // 入口需要判断所有子功能是否开启,子功能ID字段中第一个代表功能都未开启时的提示功能ID,后面与切页功能ID依次对应
            let subFuncIds: Array<number> = ActionOpenCfg.instance.getCfgById(funcId)[action_openFields.subfunctions];
            let minFuncId: number = subFuncIds[0];
            let isSub: boolean = ActionOpenCfg.instance.getCfgById(funcId)[action_openFields.isSubfunction] === 1;
            let panelId: number = -1;        // 功能开启但没红点的面板
            let redPanel: number = -1;       // 功能开启且有红点的面板

            // console.log("isSub", isSub)
            if (isSub) {
                // 按顺序找到最前开启的
                for (let i: int = 1, len: int = subFuncIds.length; i < len; i++) {
                    if (FuncOpenModel.instance.getFuncIsOpen(subFuncIds[i])) {
                        let tPanelId: number = GlobalData.getWindowConfigByFuncId(subFuncIds[i])[WindowInfoFields.panelId];
                        let rps: Array<keyof RedPointProperty> = BottomTabConfig.instance.getRpsByPanelId(tPanelId);
                        if (rps && rps.length > 0) {
                            let flag: boolean = false;
                            for (let k: int = 0, len2: int = rps.length; k < len2; k++) {
                                flag = RedPointCtrl.instance.getRPProperty(rps[k]);
                                if (flag) {
                                    redPanel = tPanelId;
                                    break;
                                }
                            }
                        }
                        if (redPanel !== -1) break;
                        if (panelId === -1) panelId = tPanelId;
                    }
                }
            } else {
                // console.log("minFuncId", minFuncId)
                // console.log("GlobalData.getWindowConfigByFuncId", GlobalData.getWindowConfigByFuncId(minFuncId))
                let tabInfo: TabInfo = BottomTabConfig.instance.getTabInfoByPanelId(GlobalData.getWindowConfigByFuncId(minFuncId)[WindowInfoFields.panelId]);

                if (!tabInfo) return;
                // 按顺序找到最前开启的
                for (let i: int = 1, len: int = subFuncIds.length; i < len; i++) {
                    // console.log("活动测试", subFuncIds[i], subFuncIds, FuncOpenModel.instance.getFuncIsOpen(subFuncIds[i]))
                    if (FuncOpenModel.instance.getFuncIsOpen(subFuncIds[i])) {  // 切页开启
                        let panelIds: Array<WindowEnum> = tabInfo[TabInfoFields.panelIdsArr][i - 1];
                        // console.log("页面信息", panelIds)
                        if (panelIds) {
                            for (let j: int = 0, len1: int = panelIds.length; j < len1; j++) {
                                if (this.isFuncOpen(panelIds[j])) {     // 优先选择功能开启且有红点的面板，然后选择功能开启但没有红点的面板
                                    let rps: Array<keyof RedPointProperty> = tabInfo[TabInfoFields.redPointPros][i - 1] ? tabInfo[TabInfoFields.redPointPros][i - 1][j] : null;  // 面板对应的红点
                                    if (rps && rps.length > 0) {
                                        let flag: boolean = false;
                                        for (let k: int = 0, len2: int = rps.length; k < len2; k++) {
                                            flag = RedPointCtrl.instance.getRPProperty(rps[k]);
                                            if (flag) {
                                                redPanel = panelIds[j];
                                                // console.log("跳出")
                                                break;
                                            }
                                        }
                                    }
                                    if (redPanel !== -1) {
                                        // console.log("跳出")
                                        break;
                                    }
                                    if (panelId === -1) panelId = panelIds[j];
                                }
                            }
                        }
                        if (redPanel !== -1) {
                            // console.log("跳出")
                            break;
                        }
                    }
                }
            }
            // console.log("测试入口 end")
            if (redPanel !== -1) {
                this.openTabByPanel(redPanel);
            } else if (panelId !== -1) {
                this.openTabByPanel(panelId);
            } else {
                SystemNoticeManager.instance.addNotice(FuncOpenModel.instance.getFuncOpenTipById(minFuncId), true);
            }
        }

        public closeTab(closedByOthers: boolean = false): void {
            this._panelId = 0;
            this._tab.tabInfo = null;

            let stack: Array<WindowEnum> = this._isHook ? this._panelsStack : this._panelsStackInScene;
            if (!closedByOthers) {
                stack.pop();
            }
            if (stack.length === 0) {
                this._grayBg.removeSelf();
                this._bg.removeSelf();
                this._tab.removeSelf();
                this._backBg.removeSelf();
                this._backBtn.removeSelf();
                GlobalData.dispatcher.off(CommonEventType.PANEL_OPEN, this, this.panelOpenHandler);
                GlobalData.dispatcher.off(CommonEventType.RESIZE_UI, this, this.resizeHandler);
                this._backBtn.off(Event.CLICK, this, this.backHandler);
                GlobalData.dispatcher.event(CommonEventType.TOP_PANEL_SECOND_VIEW, true);
            }

            if (!closedByOthers && stack.length > 0) {
                let lastPanelId: number = stack[stack.length - 1];
                this.openTabByPanel(lastPanelId);
                if (!WindowManager.instance.isOpened(lastPanelId)) {      // 如果中间有某个面板没打开，继续打开下一个
                    this.closeTab(closedByOthers);
                }
            }
        }

        private panelOpenHandler(panelId: WindowEnum): void {
            if (this._panelId === panelId) {
                this.addTabToStage();
            }
        }

        private addTabToStage(): void {
            LayerManager.instance.addToMidUILayer(this._grayBg);
            LayerManager.instance.addToUILayer(this._bg);
            LayerManager.instance.addToUpUILayer(this._tab);
            LayerManager.instance.addToUpUILayer(this._backBg);
            LayerManager.instance.addToUpUILayer(this._backBtn);
        }

        // public setLabels(...labels:Array<string>){
        //     this._tab.setLabels(labels);
        // }

        private resizeHandler(): void {
            this._grayBg.width = CommonConfig.viewWidth;
            this._grayBg.height = CommonConfig.viewHeight;
            this._grayBg.graphics.clear(true);
            this._grayBg.graphics.drawRect(0, 0, CommonConfig.viewWidth, CommonConfig.viewHeight, "#000000");

            // this._tab.y = CommonConfig.viewHeight * 0.5 + 640 - 136 + 12;

            this._tab.bottom = -12;
        }

        private backHandler(): void {
            // let tmpId: WindowEnum = this._panelId;
            // this.closeTab();
            // if (tmpId == WindowEnum.PET_ILLUSION_PANEL) {
            //     WindowManager.instance.open(WindowEnum.MAGIC_PET_RANK_PANEL);
            // } else if (tmpId == WindowEnum.WEAPON_ILLUSION_PANEL) {
            //     WindowManager.instance.open(WindowEnum.MAGIC_WEAPON_RANK_PANEL);
            // } else if (tmpId) {
            //     WindowManager.instance.close(tmpId);
            // }
            if (this._guideLock) return;
            let stack: Array<WindowEnum> = this._isHook ? this._panelsStack : this._panelsStackInScene;
            if (stack.length > 0) {
                console.log("关闭面板", [...stack]);
                WindowManager.instance.close(stack[stack.length - 1]);
            } else {
                this.closeTab();
                console.log("单纯关闭 tab", [...stack]);
            }

            // 加不加返回的缩放都看不出来暂时注释
            // this.scaleExpand(this._backBtn);
        }

        private scaleExpand(img: Button) {
            img.anchorX = img.anchorY = 0.5;
            TweenJS.create(img).to({ scaleX: 1.14, scaleY: 1.14 }, 80)
                .easing(utils.tween.easing.circular.InOut)
                .onComplete((): void => {
                    TweenJS.create(img).to({ scaleX: 1, scaleY: 1 }, 80)
                        .easing(utils.tween.easing.circular.InOut)
                        .start()
                }).start()
        }

        // 功能是否未开启
        private isFuncOpen(panelId: WindowEnum): boolean {
            // console.log("判断开启", panelId)
            let flag: boolean = true;

            if (Main.instance.isWXiOSPay) {
                // wxios需要隐藏
                if (Main.instance.isWXiOSPayWinId.indexOf(panelId) >= 0) {
                    return false;
                }
            }
            let funcId: number = WindowManager.instance.getWindowConfigById(panelId)[WindowInfoFields.funcId];
            if (funcId !== ActionOpenId.begin) {
                if (!FuncOpenModel.instance.getFuncIsOpen(funcId)) {
                    flag = false;
                }
            }
            return flag;
        }

        // 功能是否关闭
        private isFuncClose(panelId: WindowEnum): boolean {
            // console.log("判断关闭", panelId)
            let flag: boolean = false;
            let funcId: number = WindowManager.instance.getWindowConfigById(panelId)[WindowInfoFields.funcId];
            if (!FuncOpenModel.instance.getFuncNeedShow(funcId)) {
                flag = true;
            }
            return flag;
        }

        public enterScene(): void {
            let mapId: number = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            let type: number = SceneCfg.instance.getCfgById(mapId)[sceneFields.type];
            if (type === SceneTypeEx.common) {        // 挂机
                this._isHook = true;
                // 回到挂机场景后检测栈中是否有面板，有的话打开面板，没有的话按场景中的面板栈执行
                if (this._panelsStackInScene.length > 0) {
                    let startIndex: number = this._panelsStack.length;
                    for (let i: int = 0, len: int = this._panelsStackInScene.length; i < len; i++) {
                        this._panelsStack[i + startIndex] = this._panelsStackInScene[i];
                    }
                }

                this._panelsStackInScene.length = 0;
                if (this._panelsStack.length > 0) {
                    // 如果是引导后需要关闭的界面则关闭界面
                    if (TaskModel.instance.taskInfo != null) {
                        let task_id = TaskModel.instance.taskInfo[Protocols.SingleTaskFields.taskId];
                        //当前任务从副本退出 要关闭哪个面板
                        let wouldClosePanel: number = TaskCfg.instance.getTaskCfgById(task_id)[Configuration.taskFields.guideFinishToHook];
                        for (let index = 0; index < this._panelsStack.length; index++) {
                            const panel_id = this._panelsStack[index];
                            if (wouldClosePanel == panel_id) {
                                this._panelsStack.splice(index, 1);
                                break;
                            }
                        }
                    }
                    // 去重
                    let newSet = new Set(this._panelsStack);
                    this._panelsStack = [];
                    newSet.forEach(id => {
                        this._panelsStack.push(id);
                    });

                    if (this._panelsStack.length > 0) {
                        WindowManager.instance.open(this._panelsStack.pop());
                    }
                }
                if (this._dialogsStack.length > 0) {
                    WindowManager.instance.open(this._dialogsStack.pop());
                }
            } else {
                this._isHook = false;
            }
        }

        public get panelsStack(): Array<WindowEnum> {
            return this._panelsStack;
        }

        // 根据功能ID添加面板到栈中
        public addPanelByFunc(funcId: number): void {
            if (funcId === 0) return;
            let windowInfo: WindowInfo = GlobalData.getWindowConfigByFuncId(funcId);
            if (!windowInfo) SystemNoticeManager.instance.addNotice("找不到功能id:" + funcId + "对应的面板信息", true);
            else if (windowInfo[WindowInfoFields.panelType] === PanelType.VIEW) {
                this._panelsStack.push(windowInfo[WindowInfoFields.panelId]);
            } else if (windowInfo[WindowInfoFields.panelType] === PanelType.DIALOG) {
                this._dialogsStack.push(windowInfo[WindowInfoFields.panelId]);
            }
        }
    }
}
