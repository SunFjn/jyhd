/** 左下角面板数据*/
namespace modules.main {
    export class LeftBottomModel {
        private static _instance: LeftBottomModel;
        public static get instance(): LeftBottomModel {
            return this._instance = this._instance || new LeftBottomModel();
        }
        /**
         * 不显示首充的场景
         */
        private noShowFirstPayScenes: SceneTypeEx[] = [
            SceneTypeEx.homestead,
        ];
        // private _
        constructor() {

        }
        /**
         * 不显示首充的场景
         */
        public get NoShowFirstPayScenes() {
            return this.noShowFirstPayScenes
        }
    }
}