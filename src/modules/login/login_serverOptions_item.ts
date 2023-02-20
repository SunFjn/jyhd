namespace modules.login {
    import LayaEvent = modules.common.LayaEvent;
    export class ServerOptionsItem extends ui.ServerOptionsItemUI {
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: any): void {
            super.setData(value);
            this.serverName.text = value.name;
            this.statImg.skin = `${value.status == 1 ? "login/image_xfy_fm.png" : "login/image_xfy_ct.png"}`;
        }

        protected addListeners(): void {
            // this.addAutoListener(this.clickBtn, LayaEvent.CLICK, this, this.selectedServerHandler);
        }

        private selectedServerHandler(): void {
            // 派发事件  处理选服框的值
            // 关闭选择服务器界面
            // GlobalData.dispatcher.event("CHOOSE_SERVER_AND_CLOSE", this._data);
        }
    }
}