///<reference path="../../modules/common/skeleton_avatar.ts"/>
///<reference path="../../game/world/component/effect_component.ts"/>

module modules.common {
    import EventDispatcher = Laya.EventDispatcher;
    import WindowInfo = ui.WindowInfo;
    import Struct = Configuration.Struct;
    import EffectComponent = game.world.component.EffectComponent;

    export class GlobalData {
        public static readonly dispatcher: EventDispatcher = new EventDispatcher();
        private static config: Table<any>;
        public static user: string;
        public static isContextLost: boolean = false;
        public static lostMessage: string;
        public static isContaxtRestored: boolean = false;
        private static configStatus: number = 0;
        private static configDataSize: number = 0;
        public static wordsStatus: number = 0;
        public static startTime: number = 0;
        public static lastAllocSize: number = 0;
        public static skeletonAvatar = SkeletonAvatar;
        public static SkeletonEffect = SkeletonEffect;
        public static effectComponent: EffectComponent;
        // 初次加载启用战斗
        public static enableCombat = false;
        // 测试使用，不用管
        public static ceeeeeee = 10;
        public static datasssss = 30;
        public static rrrrr;
        public static cccccccc;
        public static bbbbbbbbb;
        public static cccccccc1111;

        // 是否是创角
        // public static isCreateRole: boolean = false;

        // 本地时间
        private static _localTime: number = 0;
        // 服务器时间
        private static _serverTime: number = 0;

        private constructor() {
        }

        public static loadConfiguration(data: ArrayBuffer): void {
            this.configStatus = data ? 1 : -1;
            this.configDataSize = data ? data.byteLength : 0;
            this.config = msgpack.decode(new Uint8Array(data));

        }

        public static getConfig<K extends keyof Struct>(path: K): Struct[K] {
            if (!this.config) {
                return null;
            }
            return this.config[path];
        }


        // 本地时间
        public static get localTime(): number {
            return this._localTime;
        }

        public static set localTime(value: number) {
            this._localTime = value;
        }

        // 服务器时间
        public static get serverTime(): number {
            return Browser.now() - this._localTime + this._serverTime;
        }

        public static set serverTime(value: number) {
            this._serverTime = value;
        }

        // 功能ID对应的面板信息
        public static funcTable: Table<WindowInfo>;

        public static getWindowConfigByFuncId(funcId: int): WindowInfo {
            if (funcId === 0) return null;
            return this.funcTable[funcId];
        }

        //日充按钮特效状态
        public static dayPayEffState: boolean = true;

        // 本次登录不再提示ID
        public static noMoreNoticeArr: Array<boolean> = [];

        //  key值 自己根据需求存  用于标记特效按钮状态
        public static effState: Table<boolean> = {};

        // 错误日志上报
        public static recordError(event: Event | string, error?: Error): void {
            let message = [
                `user: ${this.user}`,
                `webgl: ${this.isContextLost}, ${this.isContaxtRestored}, ${this.lostMessage}`,
                // `config: ${this.configStatus}, ${this.configDataSize}, ${typeof this.config}, ${JSON.stringify(keys)}`,
                `config: ${this.configStatus}, ${this.configDataSize}, ${typeof this.config}`,
                `wrods: ${this.wordsStatus}`,
                `start: ${this.startTime}`,
                `time: ${Date.now() - this.startTime}`,
                `map: ${MapUtils.currentID}`,

                `error: ${event}`,
                `stack: ${error.stack || error}`,
            ].join("\n");
            // console.log("准备上报错误日志：", message);
            reqRecordError(message);
        }
    }
}
