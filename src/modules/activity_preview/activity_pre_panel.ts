/** 活动预告面板*/


namespace modules.activityPreview {
    import ActivityPreViewUI = ui.ActivityPreViewUI;
    import CopySceneState = Protocols.CopySceneState;
    import CopySceneStateFields = Protocols.CopySceneStateFields;
    import Layer = ui.Layer;
    import CommonUtil = modules.common.CommonUtil;
    import Point = Laya.Point;

    export class ActivityPrePanel extends ActivityPreViewUI {
        private _time: number;
        private _state: CopySceneState;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.right = 15;
            this.top = 500;
            if (Main.instance.isWXChannel) {
                this.top = 580;
            }
            this.closeByOthers = false;
            this.layer = Layer.MAIN_UI_LAYER;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ACTIVITY_PRE_SCENE_UPDATE, this, this.updateState);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RESIZE_UI, this, this.setActionPreviewPos);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ACTION_PREVIEW_RESIZE_UI, this, this.setActionPreviewPos);
            this.addAutoListener(this, Laya.Event.CLICK, this, this.clickHandler);
        }

        protected onOpened(): void {
            super.onOpened();
            this.updateState();
            this.setActionPreviewPos();
        }

        /**
         * 存储对应功能预览 对应的飞入点
         */
        public setActionPreviewPos() {
            // Laya.timer.clear(this, this.setPosActionPreview);
            // Laya.timer.once(200, this, this.setPosActionPreview);
            this.callLater(this.setPosActionPreview);
        }

        public setPosActionPreview() {

            Point.TEMP.setTo(this.width / 2, this.height / 2);
            let pos1 = this.localToGlobal(Point.TEMP, true);
            //活动预告弹窗目标点
            modules.action_preview.actionPreviewModel.instance._posSprite.set(specialAniPoin.yugao, pos1);
        }

        private updateState(): void {
            this._state = ActivityPreModel.instance.sceneState;
            if (!this._state) return;
            let type: SceneTypeEx = this._state[CopySceneStateFields.sceneType];
            let stateNum: int = this._state[CopySceneStateFields.state];
            this._time = this._state[CopySceneStateFields.time];
            // 1预告、2开启、3关闭
            if (stateNum === 1) {
                this.tipTxt.text = "即将开启";
                this.tipTxt.color = CommonUtil.getColorByQuality(5);
                Laya.timer.clear(this, this.loopHandler);
                Laya.timer.loop(1000, this, this.loopHandler);
                this.loopHandler();
            } else if (stateNum === 2) {
                this.tipTxt.text = "进行中";
                this.tipTxt.color = CommonUtil.getColorByQuality(1);
                Laya.timer.clear(this, this.loopHandler);
                Laya.timer.loop(1000, this, this.loopHandler);
                this.loopHandler();
            } else {
                this.close();//关闭界面  活动关闭直接关闭推送界面
            }
            this.iconImg.skin = `assets/icon/activity_preview/${type}.png`;
        }

        private loopHandler(): void {
            this.timeTxt.text = CommonUtil.timeStampToHHMMSS(this._time);
            if (this._time < GlobalData.serverTime) {
                Laya.timer.clear(this, this.loopHandler);
            }
        }

        private clickHandler(): void {
            if (!this._state) return;
            let type: SceneTypeEx = this._state[CopySceneStateFields.sceneType];
            if (type === SceneTypeEx.nineCopy) {      // 九天之巅
                WindowManager.instance.open(WindowEnum.NINE_PANEL);
            } else if (type === SceneTypeEx.tiantiCopy) {
                WindowManager.instance.open(WindowEnum.LADDER_PANEL);
            } else if (type === SceneTypeEx.richesCopy) {// 天才降宝
                WindowManager.instance.open(WindowEnum.ACTIVITY_ALL_PANEL);
                // DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_riches);
            } else if (type === SceneTypeEx.cloudlandCopy) {//云梦秘境
                WindowManager.instance.open(WindowEnum.YUNMENGMIJING_PANLE);
                // DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_cloudland_copy);
            } else if (type === SceneTypeEx.swimming) {//昆仑瑶池
                WindowManager.instance.open(WindowEnum.ACTIVITY_ALL_PANEL);
                // DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_swimming);
            } else if (type === SceneTypeEx.fairy) {//昆仑瑶池
                WindowManager.instance.open(WindowEnum.FAIRY_PANEL);
                // DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_swimming);
            } else if (type === SceneTypeEx.homestead) {//仙府-家园事件
                WindowManager.instance.open(WindowEnum.ACTIVITY_ALL_PANEL);
                // DungeonCtrl.instance.reqEnterScene(SCENE_ID.scene_swimming);
            } else if (type === SceneTypeEx.xuanhuoCopy) {//玄火
                WindowManager.instance.open(WindowEnum.XUANHUO_PANEL);
            }
        }

    }
}
