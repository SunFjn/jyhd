/////<reference path="../$.ts"/>
/** 公告设置弹框 */
namespace modules.faction {
    import FactionSetNoticeAlertUI = ui.FactionSetNoticeAlertUI;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class FactionSetNoticeAlert extends FactionSetNoticeAlertUI {

        private _maxChars: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._maxChars = BlendCfg.instance.getCfgById(36040)[blendFields.intParam][0];
            this.inputTxt.maxChars = this._maxChars;
            this.inputTxt.multiline = true;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.handler);
            this.addAutoListener(this.inputTxt, common.LayaEvent.INPUT, this, this.charNumCheck);
        }

        private handler(): void {
            let content: string = this.inputTxt.text;
            if (!content) {
                SystemNoticeManager.instance.addNotice(`输入内容不能为空`, true);
                return;
            } else if (!chat.ChatModel.instance.isValidContent(content)) {
                SystemNoticeManager.instance.addNotice(`包含非法字符`, true);
                return;
            }
            FactionCtrl.instance.setNotice(content);
            this.close();
        }

        private charNumCheck(): void {
            let content: string = this.inputTxt.text;
            if (content.length > this._maxChars) {
                SystemNoticeManager.instance.addNotice(`最大输入字数${this._maxChars}个`, true);
            }
        }

        public close(): void {
            super.close();
            WindowManager.instance.open(WindowEnum.FACTION_MANAGE_PANEL);
        }
    }
}