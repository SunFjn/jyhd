namespace game.misc {
    export class LogUtils {
        private static _flags: Array<boolean> = [];

        public static enable(type: LogFlags): void {
            this._flags[type] = true;
        }

        public static disable(type: LogFlags): void {
            this._flags[type] = false;
        }

        public static info(type: LogFlags, ...args: any[]): void {
            if (!LogUtils._flags[type]) {
                return;
            }
            // console.log(...args);
        }
    }
}