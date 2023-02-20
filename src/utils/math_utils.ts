namespace utils {
    export class MathUtils {
        public static ceilPowerOfTwo(current: uint): uint {
            current--;
            current = (current >> 1) | current;
            current = (current >> 2) | current;
            current = (current >> 4) | current;
            current = (current >> 8) | current;
            current = (current >> 16) | current;
            current++;
            return current;
        }

        public static bezier(p0: number, p1: number, p2: number, t: number): number {
            if (t > 1) {
                t = 1;
            } else if (t < 0) {
                t = 0;
            }
            let dt = (1 - t);
            return (dt * dt) * p0 + (2 * t * dt) * p1 + t * t * p2;
        }

        public static lerp(lower: number, upper: number, t: number): number {
            if (t > 1) {
                t = 1;
            } else if (t < 0) {
                t = 0;
            }
            return lower * (1 - t) + upper * t;
        }
    }
}
