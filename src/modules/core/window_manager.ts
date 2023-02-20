///<reference path="../layer/layer_manager.ts"/>
///<reference path="../func_open/func_open_model.ts"/>
///<reference path="../config/action_open_cfg.ts"/>
///<reference path="../magic_art/magic_art_model.ts"/>
///<reference path="../loading/loading_ctrl.ts"/>
///<reference path="../../utils/collections/set.ts"/>
///<reference path="../first_pay/first_pay_model.ts"/>
///<reference path="../faction/faction_model.ts"/>


/**
 * 窗口管理器
 */


module modules.core {
    import Dictionary = Laya.Dictionary;
    import Handler = Laya.Handler;
    import LayerManager = modules.layer.LayerManager;
    import WindowInfo = ui.WindowInfo;
    import PanelType = ui.PanelType;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import WindowInfoFields = ui.WindowInfoFields;
    import LoadingCtrl = modules.loading.LoadingCtrl;
    import Loader = Laya.Loader;
    import Set = utils.collections.Set;
    import Heap = utils.collections.Heap;
    import WindowEntry = ui.WindowEntry;
    import BottomTabConfig = modules.bottomTab.BottomTabConfig;
    import Unit = utils.Unit;
    import FirstPayModel = modules.first_pay.FirstPayModel;
    import FactionModel = modules.faction.FactionModel;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;

    export class WindowManager {
        private static _instance: WindowManager;

        public static get instance(): WindowManager {
            return WindowManager._instance = WindowManager._instance || new WindowManager();
        }

        // 面板释放间隔(统一一个间隔还是每个面板各自一个)
        private _disposeDelay: int = 5 * Unit.minute;
        private _panelDic: Dictionary;
        private _limit: int = 5;

        // dialog与面板分开管理
        private _dialogDic: Dictionary;

        // 打开的面板和弹窗
        private _openTable: Table<WindowEntry>;

        private _closeQueue: Heap<WindowEntry>;
        private _cache: Table<Set<number>>;

        private constructor() {
            this._panelDic = new Dictionary();
            this._dialogDic = new Dictionary();
            this._openTable = {};
            // 一分钟执行一次？
            Laya.timer.loop(1 * Unit.second, this, this.loopHandler);

            //永远不销毁
            let cacheSet: Set<number> = new Set([-1]);
            this._cache = {
                "res/atlas/common.atlas": cacheSet,
                "res/atlas/bottom_tab.atlas": cacheSet,
                "res/atlas/common_sg.atlas": cacheSet,
                "common/bg0_common.png": cacheSet,
                "common/bg1_common.png": cacheSet,
                "common/bj_tongyong_1.png": cacheSet,
                "common/bj_tongyong_2.png": cacheSet
            };
            this._closeQueue = new Heap<WindowEntry>(
                function (l: WindowEntry, r: WindowEntry) {
                    return l.timeout < r.timeout;
                }
            );

        }

        public openByActionId(actionId: int, param: any = null): void {
            if (actionId === 0) return;
            if (actionId == ActionOpenId.equipSuit) {
                equipSuit.EquipSuitCtrl.instance.openPanel();
                return;
            }
            if (actionId === ActionOpenId.factionCopy) {      // 仙盟宝藏副本
                if (!FactionModel.instance.factionId) {
                    SystemNoticeManager.instance.addNotice(`尚未加入公会`, true);
                    return;
                }
            }
            let windowInfo: WindowInfo = GlobalData.getWindowConfigByFuncId(actionId);
            if (!windowInfo) {
                if (ActionOpenId.tianZhuEnter == actionId ||
                    ActionOpenId.immortalEnter == actionId ||
                    ActionOpenId.fashionEnter == actionId ||
                    ActionOpenId.wingEnter == actionId
                ) {
                    BottomTabCtrl.instance.openTabByFunc(actionId);
                } 
                else if (ActionOpenId.swimming == actionId) {//白天进入温泉弹出提示
                    // SystemNoticeManager.instance.addNotice("限时活动，请晚上7点前往体验哟~");
                    WindowManager.instance.open(WindowEnum.ACTIVITY_ALL_PANEL);
                } 
                else if (ActionOpenId.riches == actionId) {
                    // 天官赐福等到时间的均跳转至入口界面
                    WindowManager.instance.open(WindowEnum.DAILY_DUNGEON_PANEL);
                } else {
                    SystemNoticeManager.instance.addNotice("找不到功能id:" + actionId + "对应的面板信息", true);
                }



            }
            else {
                let windowId = windowInfo[WindowInfoFields.panelId];
                if (windowId == WindowEnum.VIP_PANEL) {
                    if (modules.vip.VipModel.instance.vipLevel >= 1) {
                        WindowManager.instance.open(WindowEnum.VIP_PANEL);
                    }
                    else {
                        WindowManager.instance.open(WindowEnum.VIP_NEW_PANEL);
                    }
                }
                else {
                    this.open(windowId, param);
                }
            }
        }

        // 打开面板（会根据注册信息自动判断是打开面板还是打开弹窗）
        public open(windowId: int, param: any = null): void {
            if (windowId === 0) {
                // SystemNoticeManager.instance.addNotice("没有ID为0的面板，请检查配置", true);
                return;
            }

            else if (Main.instance.isWXiOSPay) {
                // wxios需要隐藏
                if (Main.instance.isWXiOSPayWinId.indexOf(windowId) >= 0) {
                    return CommonUtil.noticeError(ErrorCode.RichesCopyClose);
                }
            }

            // 没首充之前所有打开充值面板的地方均改为打开首充面板
            // if (windowId === WindowEnum.RECHARGE_PANEL && FirstPayModel.instance.giveState <= 0) {           // 0未开启，1可领取，2已领取
            //     windowId = WindowEnum.FIRST_PAY_PANEL;
            // }
            // if(windowId == WindowEnum.HEALTH_POINT_PANEL){
            //     this.openPanel(windowId, param);
            // }
            let windowConfig: WindowInfo = WindowConfig.instance.getWindowConfigById(windowId);
            if (DEBUG && (windowConfig[2].name != "BelongPanel" && windowConfig[2].name != "HealthPointPanel")) {
                console.log("打开界面  NAME: = ", windowConfig[2].name, " 面板ID: = " + windowId, " 面板对应功能ID: = " + windowConfig[5])
            }
            if (this.isOpened(windowId)) {
                let panelType: PanelType = windowConfig[WindowInfoFields.panelType];
                if (panelType === PanelType.VIEW) {
                    let panel: BaseView = this.getPanelById(windowId);       // 如果面板已经打开，刷数据
                    if (panel) {
                        panel.setOpenParamInterface(param);
                    }
                } else if (panelType === PanelType.DIALOG) {
                    let dialog: BaseDialog = this.getDialogById(windowId);
                    if (dialog) {
                        dialog.setOpenParamInterface(param);
                    }
                }
                return;
            }


            if (!windowConfig) {
                throw new Error(`不存在的面板：${windowId}`);
            }

            let funcId: ActionOpenId = windowConfig[WindowInfoFields.funcId];
            if (funcId !== ActionOpenId.begin) {  // 判断功能是否开启
                if (!FuncOpenModel.instance.getFuncIsOpen(funcId)) {
                    if (funcId == ActionOpenId.firstPay && PlayerModel.instance.level > 20) {
                        SystemNoticeManager.instance.addNotice("首冲活动已关闭!!!", true);
                    } else {
                        SystemNoticeManager.instance.addNotice(FuncOpenModel.instance.getFuncOpenTipById(funcId), true);
                    }
                    console.log("活动未开启？？？？？但你尝试打开!!! ID:", funcId);
                    return;
                } /*else if (funcState === ActionOpenState.close) {
                    SystemNoticeManager.instance.addNotice("活动已经结束", true);
                    // SystemNoticeManager.instance.addNotice(ActionOpenCfg.instance.getCfgById(funcId)[action_openFields.tips], true);
                    return;
                }*/
            }
            if (windowConfig[WindowInfoFields.panelType] === PanelType.VIEW) {
                this.openPanel(windowId, param);
            } else if (windowConfig[WindowInfoFields.panelType] === PanelType.DIALOG) {
                this.openDialog(windowId, param);
            }
        }

        public close(windowId: int, param: any = null, isFromPanel: boolean = false): void {
            if (!this.isOpened(windowId)) {
                return;
            }

            LoadingCtrl.instance.hideLoading(windowId);
            this.closeEntry(windowId);

            GlobalData.dispatcher.event(CommonEventType.PANEL_CLOSE, windowId);
            if (isFromPanel) {
                return;
            }

            let panel = this._panelDic.get(windowId) || this._dialogDic.get(windowId);
            if (panel != null) {
                if (panel instanceof BaseView) {
                    panel.close();
                } else if (panel instanceof BaseDialog) {
                    panel.close(null, false);
                }
            }
        }

        // 待优化（面板保存、面板释放管理）
        public openPanel(windowId: int, param: any = null): void {
            let windowConfig: WindowInfo = WindowConfig.instance.getWindowConfigById(windowId);
            if (!windowConfig) {
                throw new Error(`不存在的面板：${windowId}`);
            }

            // if (this.isOpened(windowId)) {
            //     return;
            // }

            this.openEntry(windowId);
            GlobalData.dispatcher.event(CommonEventType.PANEL_OPEN, windowId);
            // 加载UI
            // 判断是否所有资源已经加载，如果未加载则显示加载界面
            if (BottomTabConfig.instance.getTabInfoByPanelId(windowId)) {        // 有切页的才需要显示加载
                this.showLoading(windowConfig);
            }
            Laya.loader.load(windowConfig[WindowInfoFields.res], Handler.create(this, (): void => {
                if (!this.isOpened(windowId)) {
                    return;
                }
                LoadingCtrl.instance.hideLoading(windowId);
                let panel = this._panelDic.get(windowId);
                let windowConfig = WindowConfig.instance.getWindowConfigById(windowId);
                let closeOthers = windowConfig[WindowInfoFields.closeOthers];
                if (closeOthers === 1) {      // 关闭其他面板
                    for (let i: int = 0, len = this._panelDic.values.length; i < len; i++) {
                        if (!this.isOpened(this._panelDic.keys[i])) {
                            continue;
                        }
                        let other = this._panelDic.values[i];
                        if (other && other !== panel && other.closeByOthers) {
                            // 被其它切页关闭
                            if (BottomTabConfig.instance.getTabInfoByPanelId(windowId)) other.closeByOtherPanel();
                            else other.close();
                        }
                    }
                }

                if (panel == null) {
                    panel = new windowConfig[WindowInfoFields.windowClass]();
                    this._panelDic.set(windowId, panel);
                }
                panel.setOpenParamInterface(param);
                panel.panelId = windowId;
                LayerManager.instance.getLayerById(panel.layer).addChild(panel);
            }));
        }

        // 打开dialog
        public openDialog(dialogId: int, param: any = null): void {

            let dialogConfig: WindowInfo = WindowConfig.instance.getWindowConfigById(dialogId);
            if(DEBUG){
                console.log(`打开弹窗 name: ${dialogConfig[2].name} id: ${dialogId} config:`, dialogConfig)
            }
          
            if (Main.instance.isWXiOSPay) {
                if (dialogId == WindowEnum.COMMON_TXT_CAT_ALERT) {
                    CommonUtil.noticeError(ErrorCode.goldNotEnough);
                    return;
                }
            }

            if (!dialogConfig) {
                throw new Error(`不存在的面板：${dialogId}`);
            }

            // if (this.isOpened(dialogId)) {
            //     return;
            // }

            this.openEntry(dialogId);
            GlobalData.dispatcher.event(CommonEventType.PANEL_OPEN, dialogId);
            // 加载UI
            // 判断是否所有资源已经加载，如果未加载则显示加载界面
            this.showLoading(dialogConfig);

            Laya.loader.load(dialogConfig[WindowInfoFields.res], Handler.create(this, (): void => {
                if (!this.isOpened(dialogId)) {
                    return;
                }
                LoadingCtrl.instance.hideLoading(dialogId);
                let dialog = this._dialogDic.get(dialogId);


                let dialogConfig = WindowConfig.instance.getWindowConfigById(dialogId);
                if (!dialog) {
                    dialog = new dialogConfig[WindowInfoFields.windowClass]();
                    this._dialogDic.set(dialogId, dialog);
                }
                dialog.dialogId = dialogId;
                dialog.setOpenParamInterface(param);
                dialog.popup(dialogConfig[WindowInfoFields.closeOthers] === 1, false);
            }));
        }

        private openEntry(id: number): void {
            let entry = this._openTable[id];
            if (entry == null) {
                this._openTable[id] = {
                    pointer: 0,
                    id: id,
                    timeout: 0,
                    isOpen: true
                };
            } else if (!entry.isOpen) {
                this._closeQueue.remove(entry);
                entry.isOpen = true;
            }
            this.keepCache(id);
        }

        private closeEntry(id: number): void {
            // let disposeDelay = WindowConfig.instance.getWindowConfigById(id)[WindowInfoFields.disposeDelay] || this._disposeDelay;
            let disposeDelay = Unit.second * 10;
            let entry = this._openTable[id];
            if (entry == null) {
                return;
            } else if (!entry.isOpen) {
                entry.timeout = Date.now() + disposeDelay;
                this._closeQueue.updateElement(entry);
            } else {
                entry.isOpen = false;
                entry.timeout = Date.now() + disposeDelay;
                this._closeQueue.push(entry);
            }
        }

        private showLoading(config: WindowInfo): void {
            let res: string | Array<string> = config[WindowInfoFields.res];
            let flag: boolean = false;
            if (res instanceof Array) {
                for (let i: int = 0, len: int = res.length; i < len; i++) {
                    flag = !Loader.getRes(res[i]);
                    if (flag) break;
                }
            } else {
                flag = !Loader.getRes(res);
            }
            if (flag) {
                LoadingCtrl.instance.showLoading(config[WindowInfoFields.panelId]);
            }
        }

        private keepCache(id: number): void {
            let tuple = WindowConfig.instance.getWindowConfigById(id);
            let res = tuple[WindowInfoFields.res];
            if (res instanceof Array) {
                let list = <Array<string>>res;
                for (let res of list) {
                    let ids = this._cache[res];
                    if (ids == null) {
                        this._cache[res] = ids = new Set<number>();
                    }
                    ids.add(id);
                }
            } else {
                let ids = this._cache[res];
                if (ids == null) {
                    this._cache[res] = ids = new Set<number>();
                }
                ids.add(id);
            }
        }

        private clearCache(id: number): void {
            let tuple = WindowConfig.instance.getWindowConfigById(id);
            let res = tuple[WindowInfoFields.res];
            if (res instanceof Array) {
                let list = <Array<string>>res;
                for (let res of list) {
                    let ids = this._cache[res];
                    ids.del(id);
                    if (ids.isEmpty()) {
                        Loader.clearRes(res, true);
                    }
                }
            } else {
                let ids = this._cache[res];
                ids.del(id);
                if (ids.isEmpty()) {
                    Loader.clearRes(res, true);
                }
            }
        }

        public gc(): void {
            while (!this._closeQueue.isEmtry()) {
                this.destoryEntry(this._closeQueue.pop());
            }
        }

        private destoryEntry(e: WindowEntry): void {
            let id = e.id;
            delete this._openTable[id];
            let tuple = WindowConfig.instance.getWindowConfigById(id);
            if (tuple[WindowInfoFields.panelType] === PanelType.VIEW) {
                let panel = this._panelDic.get(id);
                if (panel != null) {
                    panel.removeSelf();
                    panel.destroy(true);
                    this._panelDic.remove(id);
                }
            } else if (tuple[WindowInfoFields.panelType] === PanelType.DIALOG) {
                let dialog = this._dialogDic.get(id);
                if (dialog != null) {
                    dialog.removeSelf();
                    dialog.destroy(true);
                    this._dialogDic.remove(id);
                }
            }
            this.clearCache(id);
        }

        private loopHandler(): void {
            let now: uint32 = Date.now();

            while (!this._closeQueue.isEmtry()) {
                let e = this._closeQueue.top;
                if (e.timeout > now && this._closeQueue.size <= this._limit) {
                    break;
                }
                this.destoryEntry(this._closeQueue.pop());
            }
        }

        // private loopHandler = (): void => {
        //     let keys: Array<int> = this._panelDic.keys;
        //     for (let i: int = 0, len = keys.length; i < len; i++) {
        //         let panelInfo: [BaseView, number] = this._panelDic.get(keys[i]);
        //         if (!panelInfo) continue;
        //         if (Browser.now() - panelInfo[1] > this._disposeDelay) {
        //             let panel: BaseView = panelInfo[0] as BaseView;
        //             // 如果面板处于打开状态，不释放
        //             if (!panel || this.isOpened(keys[i])) continue;
        //             panel.destroy();
        //             this.clearCache(keys[i]);
        //             this._panelDic.remove(keys[i]);
        //         }
        //     }
        //     keys = this._dialogDic.keys;
        //     for (let i: int = 0, len = keys.length; i < len; i++) {
        //         let panelInfo: [BaseDialog, number] = this._dialogDic.get(keys[i]);
        //         if (!panelInfo) continue;
        //         if (Browser.now() - panelInfo[1] > this._disposeDelay) {
        //             let panel: BaseDialog = panelInfo[0] as BaseDialog;
        //             // 如果面板处于打开状态，不释放
        //             if (!panel || this.isOpened(keys[i])) continue;
        //             panel.destroy();
        //             this.clearCache(keys[i]);
        //             this._dialogDic.remove(keys[i]);
        //         }
        //     }
        // }

        // 根据ID获取面板
        public getPanelById(panelId: WindowEnum): BaseView {
            return this._panelDic.get(panelId) || null;
        }

        // 根据ID获取弹框
        public getDialogById(dialogId: WindowEnum): BaseDialog {
            return this._dialogDic.get(dialogId) || null;
        }

        // 根据ID判断面板或弹窗是否打开
        public isOpened(id: WindowEnum): boolean {
            let entry = this._openTable[id];
            if (entry == null) {
                return false;
            }
            return entry.isOpen;
        }

        public getWindowConfigById(windowId: int): WindowInfo {
            return WindowConfig.instance.getWindowConfigById(windowId);
        }

        public get openTable(): Table<WindowEntry> {
            return this._openTable;
        }

        //
        /**
         * 处理道具获取途径调转  弹窗中弹出获取途径 弹窗调转后 弹窗未关闭问题
         */
        public colseDialogForGetWay() {
            // WindowManager.instance.close(WindowEnum.FIRST_PAY_PANEL);//首充 弹框
            // WindowManager.instance.close(WindowEnum.LINE_CLEAR_OUT_ALERT);//快速挂机
            // WindowManager.instance.close(WindowEnum.OFFLINE_PROFIT_ALERT);
            // WindowManager.instance.close(WindowEnum.FIRST_PAY_PANEL);
            // WindowManager.instance.close(WindowEnum.FIRST_PAY_PANEL);
        }

        // 关闭所有弹框
        public closeAllDialog(): void {
            // Dialog.manager.closeAll();
            for (let key in this._openTable) {
                let entry: WindowEntry = this._openTable[key];
                let windowId: number = entry.id;
                let windowConfig: WindowInfo = WindowConfig.instance.getWindowConfigById(windowId);
                let panelType: PanelType = windowConfig[WindowInfoFields.panelType];
                if (panelType === PanelType.DIALOG) {
                    WindowManager.instance.close(windowId);
                }
            }
        }

        //为了满足特殊需求写的---很诡异
        public skipOpen(id: WindowEnum): void {
            this.closeAllDialog();
            this.open(id);
        }
    }
}