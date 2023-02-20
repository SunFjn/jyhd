namespace utils {
    export class TraceUtils {
        private static _resetTime: number = 0;
        private static _lastUpdateTime: number = 0;
        private static _order: number = 0;

        public static reset(...args: any[]): void {
            TraceUtils._resetTime = TraceUtils._lastUpdateTime = Date.now();
            TraceUtils._order = 0;
            // console.log(`${TraceUtils._order++}:${TraceUtils._resetTime}`, ...args);
        }

        public static trace(...args: any[]): void {
            let now = Date.now();
            let delta = now - TraceUtils._lastUpdateTime;
            TraceUtils._lastUpdateTime = now;
            // console.log(`${TraceUtils._order++}:${delta}:${now - TraceUtils._resetTime}`, ...args);
        }
    }
}
