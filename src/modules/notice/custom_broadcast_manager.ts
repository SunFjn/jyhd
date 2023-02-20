/** 自定义广播跑马灯*/


namespace modules.notice {


    export class CustomBroadcastManager {
        private static _instance: CustomBroadcastManager;
        public static get instance(): CustomBroadcastManager {
            return this._instance = this._instance || new CustomBroadcastManager();
        }

        private _panel: CustomBroadcastPanel;

        constructor() {

        }

        // 添加广播
        public addBroadcast(txt: string, parentNode: Laya.Node = null): void {
            this._panel = this._panel || new CustomBroadcastPanel();
            this._panel.clearBroadcast();
            if (!parentNode) {
                LayerManager.instance.addToNoticeLayer(this._panel);
            } else {
                parentNode.addChild(this._panel);
            }
            this._panel.addBroadcast(txt);
        }

        // 关闭广播
        public closeBroadcast(): void {
            if (this._panel) {
                this._panel.clearBroadcast();
            }
        }

    }
}