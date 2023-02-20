/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.chat {
    import BlackListItemUI = ui.BlackListItemUI;
    import BlackInfo = Protocols.BlackInfo;
    import Event = Laya.Event;
    import BlackInfoFields = Protocols.BlackInfoFields;

    export class ChatBlackListItem extends BlackListItemUI {

        private _playerInfo: BlackInfo;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.cancelBtn, Event.CLICK, this, this.cancelBtnHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();

        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        public setData(value: any): void {
            this._playerInfo = value as BlackInfo;
            this.nameTxt.text = this._playerInfo[BlackInfoFields.name];
        }

        private updateView(): void {

        }

        private cancelBtnHandler(): void {
            ChatModel.instance.blackListOpt = 2;
            ChatCtrl.instance.blackListOpt([this._playerInfo, 2]);
        }

        public close(): void {
            super.close();
        }
    }
}