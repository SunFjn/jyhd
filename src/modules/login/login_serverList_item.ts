namespace modules.login {
    export class ServerListItem extends ui.ServerListItemUI {
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: any): void {
            super.setData(value);
            this.txt.text = value;
            if (this.index == 0) {
                this.selectedImg.visible = true;
            } else {
                this.selectedImg.visible = false;
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, "CHOOSE_SERVER_LIST_BY_NAME", this, this.UpdateNowRefreshUI);
        }

        private UpdateNowRefreshUI(_index): void {
            if (this.index == _index) {
                this.selectedImg.visible = true;
            } else {
                this.selectedImg.visible = false;
            }
        }
    }
}