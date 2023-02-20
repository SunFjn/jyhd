/** 广播配置*/


namespace modules.config {
    import broadcast = Configuration.broadcast;
    import broadcastFields = Configuration.broadcastFields;
    import Dictionary = Laya.Dictionary;

    export class BroadcastCfg {
        private static _instance: BroadcastCfg;
        public static get instance(): BroadcastCfg {
            return this._instance = this._instance || new BroadcastCfg();
        }

        private _dic: Dictionary;

        constructor() {
            this.init();
        }

        private init(): void {
            this._dic = new Dictionary();
            let arr: Array<broadcast> = GlobalData.getConfig("broadcast");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._dic.set(arr[i][broadcastFields.broadcastId], arr[i]);
            }
        }

        // 根据ID获取配置
        public getCfgById(id: int): broadcast {
            return this._dic.get(id);
        }
    }
}