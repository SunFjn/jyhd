/////<reference path="../$.ts"/>
/** 自动邀请弹框 */
namespace modules.faction {
    import ArrayUtils = utils.ArrayUtils;
    import BlendCfg = modules.config.BlendCfg;
    import Layer = ui.Layer;
    import FactionAutoInviteViewUI = ui.FactionAutoInviteViewUI;
    import AutoInvitation = Protocols.AutoInvitation;
    import AutoInvitationFields = Protocols.AutoInvitationFields;

    export class FactionAutoInvitePanel extends FactionAutoInviteViewUI {

        private _id: string;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.flagBtn.selected = false;

            this.centerX = 0;
            this.bottom = 300;

            this.layer = Layer.MAIN_UI_LAYER;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.okBtn, common.LayaEvent.CLICK, this, this.okBtnHandler);
            this.addAutoListener(this.flagBtn, common.LayaEvent.CLICK, this, this.flagBtnHandler);
        }

        public setOpenParam(tuple: AutoInvitation): void {
            super.setOpenParam(tuple);

            let name: string = tuple[AutoInvitationFields.name];
            this._id = tuple[AutoInvitationFields.id];
            this.nameTxt.text = name;
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        private updateView(): void {
            let strs: string[] = BlendCfg.instance.getCfgById(36036)[Configuration.blendFields.stringParam];
            this.contentTxt.text = ArrayUtils.random(strs);
        }

        private okBtnHandler(): void {
            FactionCtrl.instance.joinFaction([this._id, 0]);
            this.close();
        }

        private flagBtnHandler(): void {
            this.flagBtn.selected = !this.flagBtn.selected;
            FactionCtrl.instance.selectPush([this.flagBtn.selected]);
        }
    }
}
