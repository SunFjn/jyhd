/**单人boss单元项*/
///<reference path="../config/action_open_cfg.ts"/>
///<reference path="../config/action_preview_cfg.ts"/>
///<reference path="../config/scene_copy_single_boss_cfg.ts"/>
///<reference path="../action_preview/action_preview_model.ts"/>
namespace modules.action_preview {
    import ActionOpenCfg = modules.config.ActionOpenCfg;
    import action_openFields = Configuration.action_openFields;
    import action_preview = Configuration.action_preview;
    import action_previewFields = Configuration.action_previewFields;
    import actionPreviewModel = modules.action_preview.actionPreviewModel;

    export class ActionPreviewItem extends ui.ActionPreviewItemUI {
        private _date: action_preview;
        private _actionID: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.StatementHTML.color = "#585858";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 22;
            this.StatementHTML.style.align = "center";
        }

        protected setSelected(value: boolean): void {
            // if (this._reviveTime - GlobalData.serverTime > 0) {
            //     return;
            // }
            super.setSelected(value);
            if (value) {
                actionPreviewModel.instance.selectedActionID = this._actionID;
            }
            this.xuanZhonImg.visible = value;
        }

        public InitializeUI() {
            this.receiveTrueImg.visible = false;
            this.weiJiHuoText.visible = false;
            this.keLingQuText.visible = false;
            // this.actionImg.gray = true;
            this.weiJiHuoImg.visible = true;
            this.xuanZhonImg.visible = false;
            // this.actionBgImg.gray = true;
        }

        protected setData(action_preview: action_preview): void {
            super.setData(action_preview);
            this.InitializeUI();
            this._date = action_preview;
            this._actionID = this._date[action_previewFields.id];
            let enterIcon = this._date[action_previewFields.enterIcon];
            let icon = this._date[action_previewFields.icon];
            let previewIcon = this._date[action_previewFields.previewIcon];
            let award = this._date[action_previewFields.award];
            let tips = this._date[action_previewFields.tips];
            this.actionImg.skin = `assets/icon/ui/get_way/${icon}.png`;
            let shuju = ActionOpenCfg.instance.getCfgById(this._actionID);
            this.openText.text = tips;
            // this.StatementHTML.innerHTML = `积分:<span style='font-size: 22p'>${tips}</span>`;
            this.actionText.text = shuju[action_openFields.name];
            this.changUI();
        }

        public changUI() {
            let stateNum = actionPreviewModel.instance.getState(this._date);
            this.receiveTrueImg.visible = stateNum == 0;
            this.weiJiHuoText.visible = stateNum == 1;
            this.keLingQuText.visible = stateNum == 2;
            // this.actionImg.gray = stateNum == 1;
            this.weiJiHuoImg.visible = stateNum == 1;
            this.RpImg.visible = stateNum == 2;
            // this.actionBgImg.gray = stateNum == 1;
        }
    }
}