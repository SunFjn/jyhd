///<reference path="behavior_node.ts"/>

namespace game.ai.behavior {
    export class BehaviorTree {
        public static create(root: BehaviorNode): BehaviorTree {
            return new BehaviorTree(root);
        }

        private readonly _root: BehaviorNode;
        private _runningNode: BehaviorNode;

        private constructor(root: BehaviorNode) {
            this._root = root;
        }

        public run(): void {
            if (this._runningNode == null) {
                this._root.reset();
                this._root.execute(this, BehaviorStatus.Running);
            } else {
                let node = this._runningNode;
                this._runningNode = null;
                let status = BehaviorStatus.Running;
                do {
                    status = node.execute(this, status);
                    if (status == BehaviorStatus.Running) {
                        return;
                    }
                    node = node.parent;
                } while (node != null);
            }
        }

        public abort(): void {
            if (this._runningNode != null) {
                let node = this._runningNode;
                this._runningNode = null;
                do {
                    node.abort();
                    node = node.parent;
                } while (node != null);
            }
        }

        public reset(): void {
            if (this._runningNode != null) {
                let node = this._runningNode;
                this._runningNode = null;
                do {
                    node.reset();
                    node = node.parent;
                } while (node != null);
            }
        }

        public setRunningNode(node: BehaviorNode): void {
            if (node == null) {
                this._runningNode = null;
                return;
            }

            if (this._runningNode != null && !node.force) {
                return;
            }
            this._runningNode = node;
        }
    }
}