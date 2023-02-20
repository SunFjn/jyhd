/** 活动预告数据*/

namespace modules.activityPreview {
    import CopySceneState = Protocols.CopySceneState;

    export class ActivityPreModel {
        private static _instance: ActivityPreModel;
        public static get instance(): ActivityPreModel {
            return this._instance = this._instance || new ActivityPreModel();
        }

        // 需要预告的场景
        private _sceneState: CopySceneState;

        constructor() {

        }

        // 需要预告的场景
        public get sceneState(): CopySceneState {
            return this._sceneState;
        }

        public set sceneState(value: CopySceneState) {
            this._sceneState = value;
            GlobalData.dispatcher.event(CommonEventType.ACTIVITY_PRE_SCENE_UPDATE);
        }
    }
}