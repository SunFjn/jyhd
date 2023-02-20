/** */
///<reference path="../red_point/red_point_ctrl.ts"/>
///<reference path="../config/activity_all_cfg.ts"/>
///<reference path="../nine/nine_model.ts"/>
namespace modules.activity_all {
    import ActivityAllCfg = modules.config.ActivityAllCfg;
    import activity_all = Configuration.activity_all;
    import activity_allFields = Configuration.activity_allFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import CopySceneState = Protocols.CopySceneState;
    import CopySceneStateFields = Protocols.CopySceneStateFields;

    export class ActivityAllModel {
        private static _instance: ActivityAllModel;
        public static get instance(): ActivityAllModel {
            return this._instance = this._instance || new ActivityAllModel();
        }

        public istanchaung: boolean = false;
        public activity_allDate: activity_all;
        private _activityAllDate: Array<activity_all>;//数据列表
        constructor() {
            let _AllArray: Array<activity_all> = ActivityAllCfg.instance.get_arr();
            this._activityAllDate = _AllArray;
            this.istanchaung = false;
            this.activity_allDate = null;
        }

        public get activityAllDate(): Array<activity_all> {
            return this._activityAllDate;
        }

        /**
         * 显示限时活动 开启推送
         */
        public showActivityAllAlert(funcId: ActionOpenId) {
            this.activity_allDate = null;
            this.activity_allDate = ActivityAllCfg.instance.getCfgById(funcId);
            if (this.activity_allDate) {
                // if (!this.istanchaung) {
                let isopen = WindowManager.instance.isOpened(WindowEnum.ACTIVITY_ALL_ALERT);
                let isopen1 = WindowManager.instance.isOpened(WindowEnum.OFFLINE_PROFIT_ALERT);
                if (!isopen) {
                    if (!isopen1) { //只能保证 这个界面再 离线收益弹窗的下面
                        WindowManager.instance.open(WindowEnum.ACTIVITY_ALL_ALERT, this.activity_allDate);
                    }
                    // this.istanchaung = true;
                }
                // }
            }
        }

        /**
         * 进行中>预告>未开始>已结束>未开启
         *  统一状态 【0活动结束  未开启功能1  2未开始  3预告 4进行中 】（为排序考虑）
         */
        public getState(element: activity_all): number {
            let funcId: ActionOpenId = element[activity_allFields.actionOpenId];
            if (funcId !== ActionOpenId.begin) {  // 判断功能是否开启
                if (!FuncOpenModel.instance.getFuncIsOpen(funcId)) {
                    return 1;
                }
            }
            let _actionOpenId = element[activity_allFields.actionOpenId];
            if (_actionOpenId == ActionOpenId.xianFuEnter) {
                if (modules.xianfu.XianfuModel.instance.xianfuEventIsOpen()) {
                    return 4;
                } else {
                    return this.getstate(element);
                }
            } else {
                return this.getstate(element);
            }
        }

        public getstate(element: activity_all): number {
            let typeNum = element[activity_allFields.type];
            let params = element[activity_allFields.params];
            let names = element[activity_allFields.activityName];
            if (typeNum == 1) {
                let stateNum = 4;
                let ISdouble = false;
                let states: CopySceneState = DungeonModel.instance.getCopySceneStateByType(params);
                if (states) {
                    stateNum = states[CopySceneStateFields.state];
                }
                // prepare = 1,    //预备状态
                //     open = 2,       //开启状态
                //     close = 3,      //关闭状态
                //     notOpen = 4,    //未开启
                if (stateNum == CopyState.prepare)
                    stateNum = 3;
                else if (stateNum == CopyState.open) {
                    stateNum = 4;
                } else if (stateNum == CopyState.close) {
                    stateNum = 0;
                } else if (stateNum == CopyState.notOpen) {
                    stateNum = 2;
                } else {
                    stateNum = 2;
                }
                return stateNum;
            } else if (typeNum == 2) {
                return 1;
            } else {
                return 1;
            }
        }
    }
}
