/** 服务器广播跑马灯*/


namespace modules.notice {


    export class ServerBroadcastManager {
        private static _instance: ServerBroadcastManager;
        public static get instance(): ServerBroadcastManager {
            return this._instance = this._instance || new ServerBroadcastManager();
        }

        private _panel: ServerBroadcastPanel;

        constructor() {

        }

        // 添加广播
        public addBroadcast(txt: string): void {
            this._panel = this._panel || new ServerBroadcastPanel();
            LayerManager.instance.addToNoticeLayer(this._panel);
            this._panel.addBroadcast(txt);
        }

    }
}