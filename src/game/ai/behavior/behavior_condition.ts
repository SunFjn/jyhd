namespace game.ai.behavior.condition {
    export class ConditionTRUE implements Condition {
        public check(): boolean {
            return true;
        }

        public reset(): void {
        }
    }

    export class ConditionFALSE implements Condition {
        public check(): boolean {
            return false;
        }

        public reset(): void {
        }
    }

    export class ConditionNOT implements Condition {
        private _lhs: Condition;

        constructor(lhs: Condition) {
            this._lhs = lhs;
        }

        public check(): boolean {
            return !this._lhs.check();
        }

        public reset(): void {
            this._lhs.reset();
        }
    }

    export class ConditionAND implements Condition {
        private _lhs: Condition;
        private _rhs: Condition;

        constructor(lhs: Condition, rhs: Condition) {
            this._lhs = lhs;
            this._rhs = rhs;
        }

        public check(): boolean {
            return this._lhs.check() && this._rhs.check();
        }

        public reset(): void {
            this._lhs.reset();
            this._rhs.reset();
        }
    }

    export class ConditionOR implements Condition {
        private _lhs: Condition;
        private _rhs: Condition;

        constructor(lhs: Condition, rhs: Condition) {
            this._lhs = lhs;
            this._rhs = rhs;
        }

        public check(): boolean {
            return this._lhs.check() || this._rhs.check();
        }

        public reset(): void {
            this._lhs.reset();
            this._rhs.reset();
        }
    }

    export class ConditionXOR implements Condition {
        private _lhs: Condition;
        private _rhs: Condition;

        constructor(lhs: Condition, rhs: Condition) {
            this._lhs = lhs;
            this._rhs = rhs;
        }

        public check(): boolean {
            return this._lhs.check() != this._rhs.check();
        }

        public reset(): void {
            this._lhs.reset();
            this._rhs.reset();
        }
    }

    // export class Interrupt implements Condition {
    //     private _isTrigger: boolean;
    //     private _priority: number;
    //
    //     constructor() {
    //         this._isTrigger = false;
    //         this._priority = Number.POSITIVE_INFINITY;
    //     }
    //
    //     public check(): boolean {
    //         return this._isTrigger;
    //     }
    //
    //     public trigger(priority: number): void {
    //         this._isTrigger = true;
    //         this._priority = priority;
    //     }
    //
    //     public reset(): void {
    //         this._isTrigger = false;
    //         this._priority = Number.POSITIVE_INFINITY;
    //     }
    //
    //     public get priority(): number {
    //         return this._priority;
    //     }
    // }
    export class Interrupt implements Condition {
        private _isTrigger: boolean;
        private _priority: number;
        private _lock: boolean;

        constructor() {
            this._isTrigger = false;
            this._priority = Number.POSITIVE_INFINITY;
            this._lock = false;
        }

        public check(): boolean {
            return this._isTrigger;
        }

        public trigger(priority: number): void {
            if ((this._lock || this._isTrigger) && this._priority < priority) {
                return;
            }
            this._isTrigger = true;
            this._priority = priority;
            this._lock = false;
        }

        public lock(): void {
            this._lock = true;
            this._isTrigger = false;
        }

        public free(): void {
            this._lock = false;
            if (this._isTrigger) {
                return;
            }
            this._priority = Number.POSITIVE_INFINITY;
        }

        public step(): void {
            if (this._lock) {
                return;
            }
            this.reset();
        }

        public reset(): void {
            this._isTrigger = false;
            this._priority = Number.POSITIVE_INFINITY;
            this._lock = false;
        }

        public get priority(): number {
            return this._priority;
        }
    }
}