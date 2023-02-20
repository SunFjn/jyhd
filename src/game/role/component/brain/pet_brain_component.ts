///<reference path="behavior/follow_and_attack.ts"/>
///<reference path="behavior/rest_action.ts"/>

namespace game.role.component.brain {
    import BehaviorTree = game.ai.behavior.BehaviorTree;
    import Selector = game.ai.behavior.composite.Selector;
    import FollowAndAttack = game.role.component.brain.behavior.FollowAndAttack;
    import RestAction = game.role.component.brain.behavior.RestAction;

    export class PetBrainComponent extends RoleComponent {
        private _tree: BehaviorTree;

        constructor(owner: Role, master: Role) {
            super(owner);

            this._tree = BehaviorTree.create(
                new Selector().addChild(
                    new FollowAndAttack(owner, master, RoleType.Pet)
                ).addChild(
                    new RestAction(owner, 500, true)
                )
            );
        }

        public setup(): void {
        }

        public teardown(): void {
        }

        public destory(): void {

        }

        public update(): void {
            this._tree.run();
        }
    }
}