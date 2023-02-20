/** 活动预告*/

///<reference path="../config/activity_all_cfg.ts"/>
///<reference path="../activity_all/activity_all_model.ts"/>
namespace modules.activityPreview {
    import BaseCtrl = modules.core.BaseCtrl;
    import CopySceneState = Protocols.CopySceneState;
    import CopySceneStateFields = Protocols.CopySceneStateFields;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import ActivityAllModel = modules.activity_all.ActivityAllModel;

    export class ActivityPreviewCtrl extends BaseCtrl {
        private static _instance: ActivityPreviewCtrl;
        public static get instance(): ActivityPreviewCtrl {
            return this._instance = this._instance || new ActivityPreviewCtrl();
        }

        // 场景类型对应的功能ID
        private _sceneToFuncTable: Table<ActionOpenId>;
        private _sceneToFuncIsKaiQiTable: Table<boolean>;

        constructor() {
            super();
            this._sceneToFuncTable = {};
            this._sceneToFuncTable[SceneTypeEx.nineCopy] = ActionOpenId.nineCopy;
            this._sceneToFuncTable[SceneTypeEx.tiantiCopy] = ActionOpenId.tianti;
            this._sceneToFuncTable[SceneTypeEx.richesCopy] = ActionOpenId.riches;
            this._sceneToFuncTable[SceneTypeEx.cloudlandCopy] = ActionOpenId.cloudlandCopy;
            this._sceneToFuncTable[SceneTypeEx.swimming] = ActionOpenId.swimming;
            this._sceneToFuncTable[SceneTypeEx.fairy] = ActionOpenId.fairy;
            this._sceneToFuncTable[SceneTypeEx.homestead] = ActionOpenId.xianFuEnter;

            this._sceneToFuncIsKaiQiTable = {};
            this._sceneToFuncIsKaiQiTable[SceneTypeEx.nineCopy] = false;
            this._sceneToFuncIsKaiQiTable[SceneTypeEx.tiantiCopy] = false;
            this._sceneToFuncIsKaiQiTable[SceneTypeEx.richesCopy] = false;
            this._sceneToFuncIsKaiQiTable[SceneTypeEx.cloudlandCopy] = false;
            this._sceneToFuncIsKaiQiTable[SceneTypeEx.swimming] = false;
            this._sceneToFuncIsKaiQiTable[SceneTypeEx.fairy] = false;
            this._sceneToFuncIsKaiQiTable[SceneTypeEx.homestead] = false;
        }

        public setup(): void {
            GlobalData.dispatcher.on(CommonEventType.DUNGEON_SCENE_STATE_UPDATE, this, this.updateSceneState);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.updateSceneState);
        }

        // 更新场景状态
        public updateSceneState(): void {

            let sceneId: number = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            let type: int = SceneCfg.instance.getCfgById(sceneId)[sceneFields.type];
            if (type === SceneTypeEx.common) {
                let states: Array<CopySceneState> = DungeonModel.instance.sceneStates;
                let flag: boolean = false;
                if (states) {
                    for (let i: int = 0, len: int = states.length; i < len; i++) {
                        let state: CopySceneState = states[i];
                        if (state[CopySceneStateFields.state] !== CopyState.close && state[CopySceneStateFields.state] !== CopyState.notOpen) {    // 1预告 2开启 3关闭 4未开启
                            let funcId: ActionOpenId = this._sceneToFuncTable[state[CopySceneStateFields.sceneType]];
                            if (FuncOpenModel.instance.getFuncIsOpen(funcId)) {
                                flag = true;
                                ActivityPreModel.instance.sceneState = state;
                                let isopen = WindowManager.instance.isOpened(WindowEnum.ACTIVITY_PRE_PANEL);
                                if (!isopen) {
                                    // console.log("活动预告推送。。。。。 开启");
                                    WindowManager.instance.open(WindowEnum.ACTIVITY_PRE_PANEL);
                                }
                                break;
                            }
                        }
                    }
                }
                if (!flag) {
                    // console.log("活动预告推送。。。。。 flag 关闭");
                    WindowManager.instance.close(WindowEnum.ACTIVITY_PRE_PANEL);
                }
            } else {

                WindowManager.instance.close(WindowEnum.ACTIVITY_PRE_PANEL);
            }
            // console.log("活动预告推送。。。。。 ");
            this.showActivityAllAlert();
        }

        /**
         * name
         */
        public showActivityAllAlert() {
            //不管在不在 副本都要显示 限时活动 推送 弹窗
            let states: Array<CopySceneState> = DungeonModel.instance.sceneStates;
            if (states) {
                for (let i: int = 0, len: int = states.length; i < len; i++) {
                    let state: CopySceneState = states[i];
                    if (state[CopySceneStateFields.state] === 2) {    // 1预告 2开启 3关闭 4未开启
                        let funcId: ActionOpenId = this._sceneToFuncTable[state[CopySceneStateFields.sceneType]];
                        if (funcId && funcId != ActionOpenId.xianFuEnter) {
                            if (FuncOpenModel.instance.getFuncIsOpen(funcId)) {
                                let boollll: boolean = this._sceneToFuncIsKaiQiTable[state[CopySceneStateFields.sceneType]];
                                modules.activity_all.ActivityAllModel.instance.istanchaung = false;
                                if (!boollll) {
                                    ActivityAllModel.instance.showActivityAllAlert(funcId);
                                    this._sceneToFuncIsKaiQiTable[state[CopySceneStateFields.sceneType]] = true;
                                }

                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}
