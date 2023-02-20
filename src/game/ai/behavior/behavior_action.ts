///<reference path="behavior_node.ts"/>

namespace game.ai.behavior {
    export class Action extends BehaviorNode {

    }

    export class Noop extends BehaviorNode {
        constructor() {
            super("Noop");
        }

        protected onUpdate(): BehaviorStatus {
            return BehaviorStatus.Success;
        }
    }

    export class Wait extends BehaviorNode {
        protected readonly _interval: number;
        protected _timeout: number;

        constructor(interval: number) {
            super("Wait");
            this._interval = interval;
        }

        protected onEnter(): boolean {
            this._timeout = Date.now() + this._interval;
            return true;
        }

        protected onUpdate(): BehaviorStatus {
            return Date.now() > this._timeout ? BehaviorStatus.Running : BehaviorStatus.Success;
        }
    }

    export class WaitFrames extends BehaviorNode {
        protected _count: number;
        protected readonly _frameCount: number;

        constructor(frameCount: number) {
            super("WaitFrames");
            this._frameCount = frameCount;
        }

        protected onEnter(): boolean {
            this._count = 0;
            return true;
        }

        protected onUpdate(): BehaviorStatus {
            return ++this._count < this._frameCount ? BehaviorStatus.Running : BehaviorStatus.Success;
        }
    }
}