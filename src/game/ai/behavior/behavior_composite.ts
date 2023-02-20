///<reference path="behavior_node.ts"/>
///<reference path="../../../utils/array_utils.ts"/>

namespace game.ai.behavior.composite {
    import ArrayUtils = utils.ArrayUtils;
    import Interrupt = game.ai.behavior.condition.Interrupt;

    export abstract class Composite extends BehaviorNode {
        protected _activeChildIndex: number;
        protected _children: Array<BehaviorNode>;

        protected constructor(name: string) {
            super(name);
            this._activeChildIndex = 0;
            this._children = new Array<BehaviorNode>();
        }

        public addChild(child: BehaviorNode): Composite {
            if (this._children.indexOf(child) != -1) {
                return this;
            }
            this._children.push(child);
            child.setParent(this);
            return this;
        }

        protected onEnter(): boolean {
            return this._children.length != 0;
        }

        protected onExit(): void {
            this._activeChildIndex = 0;
        }

        public reset(): void {
            if (this._status == BehaviorStatus.Running) {
                this._children[this._activeChildIndex].reset();
                this._activeChildIndex = 0;
            }
            this._status = BehaviorStatus.Ready;
        }

        public abort(): void {
            if (this._status == BehaviorStatus.Running) {
                this._children[this._activeChildIndex].abort();
                this._activeChildIndex = 0;
            }
            this._status = BehaviorStatus.Failure;
        }
    }

    export class If extends Composite {
        constructor(condition: BehaviorNode, left: BehaviorNode) {
            super("If");
            this.addChild(condition);
            this.addChild(left);
        }

        public addChild(child: BehaviorNode): Composite {
            throw new Error("If not support addChild!");
            return this;
        }

        protected onEnter(): boolean {
            return this._children.length == 2;
        }

        protected onUpdate(tree: BehaviorTree, childStatus: BehaviorStatus): BehaviorStatus {
            let result = this.executeNode(tree, this._children[this._activeChildIndex], childStatus);
            if (result != BehaviorStatus.Running) {
                this._children[this._activeChildIndex].reset();
            }
            if (this._activeChildIndex == 0 && result == BehaviorStatus.Success) {
                this._activeChildIndex = 1;
                result = BehaviorStatus.Running;
            }
            return result;
        }
    }

    export class IfElse extends Composite {
        constructor(condition: BehaviorNode, left: BehaviorNode, right: BehaviorNode) {
            super("IfElse");
            this.addChild(condition);
            this.addChild(left);
            this.addChild(right);
        }

        public addChild(child: BehaviorNode): Composite {
            throw new Error("IfElse not support addChild!");
            return this;
        }

        protected onEnter(): boolean {
            return this._children.length == 3;
        }

        protected onUpdate(tree: BehaviorTree, childStatus: BehaviorStatus): BehaviorStatus {
            let result = this.executeNode(tree, this._children[this._activeChildIndex], childStatus);
            if (result != BehaviorStatus.Running) {
                this._children[this._activeChildIndex].reset();
            }
            if (this._activeChildIndex == 0 && result != BehaviorStatus.Running) {
                this._activeChildIndex = result == BehaviorStatus.Success ? 1 : 2;
                result = BehaviorStatus.Running;
            }
            return result;
        }
    }

    export class Sequence extends Composite {
        constructor() {
            super("Sequence");
        }

        protected onUpdate(tree: BehaviorTree, childStatus: BehaviorStatus): BehaviorStatus {
            do {
                let result = this.executeNode(tree, this._children[this._activeChildIndex], childStatus);
                if (result != BehaviorStatus.Running) {
                    this._children[this._activeChildIndex].reset();
                }
                if (result != BehaviorStatus.Success) {
                    return result;
                }
                this._activeChildIndex++;
                childStatus = BehaviorStatus.Running;
            } while (this._activeChildIndex < this._children.length);

            return BehaviorStatus.Success;
        }
    }

    export class RandomSequence extends Sequence {
        constructor() {
            super();
            this._name = "RandomSequence";
        }

        protected onEnter(): boolean {
            if (!super.onEnter()) {
                return false;
            }
            ArrayUtils.disturb(this._children);
            return true;
        }
    }

    export class Selector extends Composite {
        constructor() {
            super("Selector");
        }

        protected onUpdate(tree: BehaviorTree, childStatus: BehaviorStatus): BehaviorStatus {
            do {
                let result = this.executeNode(tree, this._children[this._activeChildIndex], childStatus);
                if (result != BehaviorStatus.Running) {
                    this._children[this._activeChildIndex].reset();
                }
                if (result != BehaviorStatus.Failure) {
                    return result;
                }
                this._activeChildIndex++;
                childStatus = BehaviorStatus.Running;
            } while (this._activeChildIndex < this._children.length);

            return BehaviorStatus.Failure;
        }
    }

    export class RandomSelector extends Selector {
        constructor() {
            super();
            this._name = "RandomSelector";
        }

        protected onEnter(): boolean {
            if (!super.onEnter()) {
                return false;
            }
            ArrayUtils.disturb(this._children);
            return true;
        }
    }

    export class PrioritySelector extends Composite {
        constructor() {
            super("PrioritySelector");
        }

        protected onEnter(): boolean {
            if (!super.onEnter()) {
                return false;
            }
            this._activeChildIndex = -1;
            return true;
        }

        protected onUpdate(tree: BehaviorTree, childStatus: BehaviorStatus): BehaviorStatus {
            if (this._activeChildIndex != -1) {
                let result = this._children[this._activeChildIndex].execute(tree, childStatus);
                if (result != BehaviorStatus.Running) {
                    this._children[this._activeChildIndex].reset();
                }
                if (result != BehaviorStatus.Failure) {
                    return result;
                }
            }

            for (let i = 0, size = this._children.length; i < size; ++i) {
                let result = this._children[i].execute(tree, BehaviorStatus.Running);
                if (result != BehaviorStatus.Running) {
                    this._children[i].reset();
                }
                if (result == BehaviorStatus.Failure) {
                    continue;
                }
                this._activeChildIndex = i;
                return result;
            }
            return BehaviorStatus.Failure;
        }
    }

    export class SelectorMonitor extends Composite {
        private _interrupt: Interrupt;

        constructor(interrupt: Interrupt) {
            super("SelectorMonitor");
            this._force = true;
            interrupt.reset();
            this._interrupt = interrupt;
        }

        protected onEnter(): boolean {
            if (!super.onEnter()) {
                return false;
            }
            // this._interrupt.reset();
            this._activeChildIndex = -1;
            return true;
        }

        protected onUpdate(tree: BehaviorTree, childStatus: BehaviorStatus): BehaviorStatus {
            // if (this._interrupt.check()) {
            //     if (this._activeChildIndex != -1) {
            //         this._children[this._activeChildIndex].reset();
            //     }
            //     this._activeChildIndex = -1;
            // }
            //
            // let result = BehaviorStatus.Failure;
            // if (this._activeChildIndex != -1) {
            //     let result = this._children[this._activeChildIndex].execute(tree, childStatus);
            //     if (result != BehaviorStatus.Running) {
            //         this._children[this._activeChildIndex].reset();
            //     }
            // } else {
            //     for (let i = 0, size = this._children.length; i < size; ++i) {
            //         let result = this._children[i].execute(tree, BehaviorStatus.Running);
            //         if (result != BehaviorStatus.Running) {
            //             this._children[i].reset();
            //         }
            //         if (result == BehaviorStatus.Failure) {
            //             continue;
            //         }
            //         this._activeChildIndex = i;
            //         break;
            //     }
            // }
            //
            // this._interrupt.step();
            // return result;

            if (this._interrupt.check()) {
                if (this._activeChildIndex != -1) {
                    this._children[this._activeChildIndex].reset();
                }
                this._activeChildIndex = -1;
            }

            let result = BehaviorStatus.Failure;
            if (this._activeChildIndex != -1) {
                result = this._children[this._activeChildIndex].execute(tree, childStatus);
                if (result != BehaviorStatus.Running) {
                    this._children[this._activeChildIndex].reset();
                }
            }

            if (result == BehaviorStatus.Failure) {
                for (let i = 0, size = this._children.length; i < size; ++i) {
                    result = this._children[i].execute(tree, BehaviorStatus.Running);
                    if (result != BehaviorStatus.Running) {
                        this._children[i].reset();
                    }
                    if (result == BehaviorStatus.Failure) {
                        continue;
                    }
                    this._activeChildIndex = i;
                    break;
                }
            }

            this._interrupt.step();
            return result;
        }

        public reset(): void {
            if (this._status == BehaviorStatus.Running) {
                if (this._activeChildIndex != -1)
                    this._children[this._activeChildIndex].reset();
                this._activeChildIndex = -1;
            }
            this._status = BehaviorStatus.Ready;
        }

        public abort(): void {
            if (this._status == BehaviorStatus.Running) {
                if (this._activeChildIndex != -1)
                    this._children[this._activeChildIndex].abort();
                this._activeChildIndex = -1;
            }
            this._status = BehaviorStatus.Failure;
        }
    }

    export class Paraller extends Composite {
        constructor() {
            super("Paraller");
            this._force = true;
        }

        protected onUpdate(tree: BehaviorTree, childStatus: BehaviorStatus): BehaviorStatus {
            let size = this._children.length;
            let successCount = 0;
            for (let i = 0; i < size; ++i) {
                let child = this._children[i];
                let status = child.status;
                if (status != BehaviorStatus.Success && status != BehaviorStatus.Failure) {
                    status = child.execute(tree, BehaviorStatus.Running);
                }

                if (status == BehaviorStatus.Failure) {
                    return BehaviorStatus.Failure;
                }

                if (status == BehaviorStatus.Success) {
                    successCount++;
                }
            }

            if (successCount == size) {
                return BehaviorStatus.Success;
            }

            return BehaviorStatus.Running;
        }

        protected onExit(): void {
            for (let i = 0, length = this._children.length; i < length; ++i) {
                this._children[i].reset();
            }
        }

        public reset(): void {
            if (this._status == BehaviorStatus.Running) {
                for (let i = 0, length = this._children.length; i < length; ++i) {
                    this._children[i].reset();
                }
            }
            this._status = BehaviorStatus.Ready;
        }

        public abort(): void {
            if (this._status == BehaviorStatus.Running) {
                for (let i = 0, length = this._children.length; i < length; ++i) {
                    this._children[i].abort();
                }
            }
            this._status = BehaviorStatus.Failure;
        }
    }

    export class ParallelSelector extends Paraller {
        constructor() {
            super();
            this._name = "ParallelSelector";
            this._force = true;
        }

        protected onUpdate(tree: BehaviorTree, childStatus: BehaviorStatus): BehaviorStatus {
            let size = this._children.length;
            let failureCount = 0;
            for (let i = 0; i < size; ++i) {
                let child = this._children[i];
                let status = child.status;
                if (status != BehaviorStatus.Success && status != BehaviorStatus.Failure) {
                    status = child.execute(tree, BehaviorStatus.Running);
                    if (status == BehaviorStatus.Success) {
                        return BehaviorStatus.Success;
                    }
                }

                if (status == BehaviorStatus.Failure) {
                    failureCount++;
                }
            }

            if (failureCount == size) {
                return BehaviorStatus.Failure;
            }

            return BehaviorStatus.Running;
        }
    }
}