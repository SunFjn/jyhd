namespace modules.login {
    export class LoginModel {
        private static _instance: LoginModel;
        public static get instance(): LoginModel {
            return this._instance = this._instance || new LoginModel();
        }

        // 选中的服务器
        private _selectedServer: any;

        // 启动参数
        private _startParams: any;

        // 服务器返回的所有参数
        public allParams: any;

        // 当前选择提示的类型 1-隐私 0-适龄提示
        public tipsType: 0 | 1;

        constructor() {

        }

        // 选中的服务器
        public get selectedServer(): any {
            return this._selectedServer;
        }

        public set selectedServer(value: any) {
            // console.log("set selectedServer：", value);

            this._selectedServer = value;
            GlobalData.dispatcher.event(CommonEventType.SELECT_SERVER);
        }

        // 启动参数
        public get startParams(): any {
            return this._startParams;
        }

        public set startParams(value: any) {
            this._startParams = value;
        }

        public get config() {
            let key = this._startParams.configs
            return !key ? null : key
        }
    }
}