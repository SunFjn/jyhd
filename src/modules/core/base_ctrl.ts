/** 控制器基类*/
namespace modules.core {
    export abstract class BaseCtrl {
        protected constructor() {
        }

        public abstract setup(): void;

        /** 请求数据 */
        public requsetAllData(): void { }
    }
}