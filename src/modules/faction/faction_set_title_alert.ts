/////<reference path="../$.ts"/>
/** 设置招人标题 */
namespace modules.faction {
    import FactionSetTitleAlertUI = ui.FactionSetTitleAlertUI;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class FactionSetTitleAlert extends FactionSetTitleAlertUI {

        private _maxChars: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._maxChars = BlendCfg.instance.getCfgById(36039)[blendFields.intParam][0];
            this.inputTxt.maxChars = this._maxChars;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.handler);
            this.addAutoListener(this.inputTxt, common.LayaEvent.INPUT, this, this.charNumCheck);
        }

        public onOpened(): void {
            super.onOpened();

            let currTitle: string = FactionModel.instance.title;
            this.currTitleTxt.text = `当前宣传语:${currTitle}`;
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
            FactionCtrl.instance.setTitle(content);
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