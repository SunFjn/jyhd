///<reference path="behavior_tree.ts"/>

namespace game.ai.behavior {
    export abstract class BehaviorNode {
        protected _parent: BehaviorNode;
        protected _status: BehaviorStatus;
        protected _force: boolean;
        protected _name: string;

        protected constructor(name: string) {
            this._parent = null;
            this._status = BehaviorStatus.Ready;
            this._force = false;
            this._name = name;
        }

        public get force(): boolean {
            return this._force;
        }

        public get status(): BehaviorStatus {
            return this._status;
        }

        public get parent(): BehaviorNode {
            return this._parent;
        }

        public setParent(value: BehaviorNode): void {
            this._parent = value;
        }

        public execute(tree: BehaviorTree, childStatue: BehaviorStatus): BehaviorStatus {
            if (this._status == BehaviorStatus.Ready) {
                this._status = this.onEnter() ? BehaviorStatus.Running : BehaviorStatus.Failure;
            }

            if (this._status == BehaviorStatus.Running) {
                this._status = this.onUpdate(tree, childStatue);
                if (this._status != BehaviorStatus.Running) {
                    this.onExit();
                    tree.setRunningNode(null);
                } else {
                    tree.setRunningNode(this);
                }
            }

            return this._status;
        }

        protected onEnter(): boolean {
            return true;
        }

        protected onUpdate(tree: BehaviorTree, childStatue: BehaviorStatus): BehaviorStatus {
            return BehaviorStatus.Success
        }

        protected onExit(): void {

        }

        protected executeNode(tree: BehaviorTree, node: BehaviorNode, childStatus: BehaviorStatus): BehaviorStatus {
            if (childStatus == BehaviorStatus.Success || childStatus == BehaviorStatus.Failure) {
                return childStatus;
            }
            return node.execute(tree, BehaviorStatus.Running);
        }

        public reset(): void {
            if (this._status == BehaviorStatus.Running) {
                this.onExit();
            }
            this._status = BehaviorStatus.Ready;
        }

        public abort(): void {
            if (this._status == BehaviorStatus.Running) {
                this.onExit();
            }
            this._status = BehaviorStatus.Failure;
        }
    }
}