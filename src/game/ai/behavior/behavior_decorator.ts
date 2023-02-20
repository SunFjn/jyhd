///<reference path="behavior_node.ts"/>

namespace game.ai.behavior.decorator {
    import Interrupt = game.ai.behavior.condition.Interrupt;

    export abstract class Decorator extends BehaviorNode {
        protected _node: BehaviorNode;

        protected constructor(node: BehaviorNode, name: string) {
            super(name);
            this._node = node;
            this._node.setParent(this);
        }

        protected onExit(): void {
            this._node.reset();
        }
    }

    export class EventNode extends Decorator {
        private readonly _interrupt: Interrupt;
        private readonly _priority: number;

        constructor(node: BehaviorNode, interrupt: Interrupt, priority: number) {
            super(node, "EventNode");
            this._interrupt = interrupt;
            this._priority = priority;
        }

        protected onEnter(): boolean {
            if (this._interrupt.check() && this._interrupt.priority == this._priority) {
                this._interrupt.lock();
                return true;
            }
            return false;
        }

        protected onUpdate(tree: BehaviorTree, childStatus: BehaviorStatus): BehaviorStatus {
            return this.executeNode(tree, this._node, childStatus);
        }

        protected onExit(): void {
            super.onExit();
            this._interrupt.free();
        }
    }

    export class AlwaysFailure extends Decorator {
        constructor(node: BehaviorNode) {
            super(node, "AlwaysFailure");
        }

        protected onUpdate(tree: BehaviorTree, childStatus: BehaviorStatus): BehaviorStatus {
            let result = this.executeNode(tree, this._node, childStatus);
            if (result != BehaviorStatus.Running) {
                return BehaviorStatus.Failure;
            }
            return BehaviorStatus.Running;
        }
    }

    export class AlwaysSuccess extends Decorator {
        constructor(node: BehaviorNode) {
            super(node, "AlwaysSuccess");
        }

        protected onUpdate(tree: BehaviorTree, childStatus: BehaviorStatus): BehaviorStatus {
            let result = this.executeNode(tree, this._node, childStatus);
            if (result != BehaviorStatus.Running) {
                return BehaviorStatus.Success;
            }
            return BehaviorStatus.Running;
        }
    }

    export class UntilFailure extends Decorator {
        constructor(node: BehaviorNode) {
            super(node, "UntilFailure");
        }

        protected onUpdate(tree: BehaviorTree, childStatus: BehaviorStatus): BehaviorStatus {
            let result = this.executeNode(tree, this._node, childStatus);
            if (result == BehaviorStatus.Failure) {
                return BehaviorStatus.Success;
            }
            return BehaviorStatus.Running;
        }
    }

    export class UntilSuccess extends Decorator {
        constructor(node: BehaviorNode) {
            super(node, "UntilSuccess");
        }

        protected onUpdate(tree: BehaviorTree, childStatus: BehaviorStatus): BehaviorStatus {
            let result = this.executeNode(tree, this._node, childStatus);
            if (result == BehaviorStatus.Success) {
                return BehaviorStatus.Success;
            }
            return BehaviorStatus.Running;
        }
    }

    export class Inverter extends Decorator {
        constructor(node: BehaviorNode) {
            super(node, "Inverter");
        }

        protected onUpdate(tree: BehaviorTree, childStatus: BehaviorStatus): BehaviorStatus {
            let result = this.executeNode(tree, this._node, childStatus);
            if (result == BehaviorStatus.Success) {
                result = BehaviorStatus.Failure;
            } else if (result == BehaviorStatus.Failure) {
                result = BehaviorStatus.Success;
            }
            return result;
        }
    }

    export class Repeater extends Decorator {
        private readonly _limit: uint;
        private _count: uint;

        constructor(node: BehaviorNode, limit: uint) {
            super(node, "Repeater");
            this._limit = limit;
            this._count = 0;
        }

        protected onEnter(): boolean {
            if (!super.onEnter()) {
                return false;
            }
            this._count = 0;
            return true;
        }

        protected onUpdate(tree: BehaviorTree, childStatus: BehaviorStatus): BehaviorStatus {
            if (this._count < this._limit) {
                let result = this.executeNode(tree, this._node, childStatus);
                if (result != BehaviorStatus.Success) {
                    return result;
                }
                this._node.reset();
                ++this._count;
            }
            return this._count < this._limit ? BehaviorStatus.Running : BehaviorStatus.Success;
        }
    }

    export class While extends Decorator {
        constructor(condition: Condition, node: BehaviorNode) {
            super(node, "While");
        }
    }
}