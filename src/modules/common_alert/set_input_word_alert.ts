/////<reference path="../$.ts"/>
/** 输入语句弹框 */
namespace modules.commonAlert {
    import SetInputWordAlertUI = ui.SetInputWordAlertUI;
    import Handler = Laya.Handler;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class SetInputWordAlert extends SetInputWordAlertUI {

        private _handler: Handler;
        private _limitLen: number;  //字符长度限制

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.handler);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

            this.title = value[0];
            this.inputTxt.prompt = value[1];
            this._handler = value[2];
            this._limitLen = value[3];
            this.inputTxt.text = ``;
        }

        public set title(value: string) {
            this.titleTxt.text = value;
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
            if (this._limitLen != null) {
                if (content.length > this._limitLen) {
                    SystemNoticeManager.instance.addNotice(`最多输入${this._limitLen}个字符`, true);
                    return;
                }
            }
            if (this._handler) this._handler.runWith(this.inputTxt.text);
            this.close();
        }
    }
}
