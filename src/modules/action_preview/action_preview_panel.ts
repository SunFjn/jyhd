/** 功能预览*/
namespace modules.action_preview {
    import ActionPreviewViewUI = ui.ActionPreviewViewUI;
    import CopySceneState = Protocols.CopySceneState;
    import Layer = ui.Layer;
    import action_previewFields = Configuration.action_previewFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class ActionPreviewPanel extends ActionPreviewViewUI {
        private _time: number;
        private _state: CopySceneState;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.left = 15;
            this.top = 360;
            // if (Main.instance.isWXChannel) {
            //     this.top = 465;
            // }
            this.closeByOthers = false;
            this.layer = Layer.MAIN_UI_LAYER;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ACTION_PREVIEW_UPDATE, this, this.updateState);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MISSION_UPDATE_LV, this, this.updateState);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_LEVEL, this, this.updateState);
            this.addAutoListener(this, Laya.Event.CLICK, this, this.clickHandler);
            this.addAutoRegisteRedPoint(this.RpImg, ["actionPreviewEnterRP"]);
        }

        protected onOpened(): void {
            super.onOpened();
            this.updateState();
        }

        private updateState(): void {
            if (actionPreviewModel.instance.isNotAward()) {
                this.close();
                return;
            }
            actionPreviewModel.instance.showRp();
            let shuju = actionPreviewModel.instance.getNotActionDate();
            if (shuju) {
                let _actionID = shuju[action_previewFields.id];
                let enterIcon = shuju[action_previewFields.enterIcon];
                let icon = shuju[action_previewFields.icon];
                let previewIcon = shuju[action_previewFields.previewIcon];
                let award = shuju[action_previewFields.award];
                let tips = shuju[action_previewFields.tips];
                this.timeTxt.text = tips;
                // this.bgImg.width = this.timeTxt.textWidth + 20;
                this.iconImg.skin = `assets/icon/ui/action_preview/${enterIcon}.png`;
            }
        }

        private clickHandler(): void {
            WindowManager.instance.open(WindowEnum.ACTION_PREVIEW_ALERT);
        }
    }
}