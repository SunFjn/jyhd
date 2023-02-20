/////<reference path="../$.ts"/>
/** 设置战力要求弹框 */
namespace modules.faction {
    import FactionJoinLimitSetAlertUI = ui.FactionJoinLimitSetAlertUI;

    export class FactionJoinLimitSetAlert extends FactionJoinLimitSetAlertUI {

        constructor() {
            super();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.okBtn, common.LayaEvent.CLICK, this, this.okBtnHandler);
        }

        private okBtnHandler(): void {
            let num: string = this.inputTxt.text;
            if (!num) {
                notice.SystemNoticeManager.instance.addNotice(`输入内容不能为空`, true);
                return;
            }
            FactionCtrl.instance.setFight([parseInt(num)]);
            this.close();
        }
    }
}