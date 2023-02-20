namespace game.role.component.brain.behavior {
    import Action = game.ai.behavior.Action;

    import BehaviorStatus = game.ai.behavior.BehaviorStatus;

    export class AbnormalAction extends Action {
        private readonly _locomotor: LocomotorComponent;
        private readonly _context: Property;

        constructor(owner: Role) {
            super("AbnormalAction");
            this._locomotor = owner.getComponent(LocomotorComponent);
            this._context = owner.property;
        }

        protected onEnter(): boolean {
            let state = this._context.get("actorState") || 0;
            if (state & ActorState.dizz) {
                let avatar = this._context.get("avatar");
                avatar.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
                return true;
            }
            return false;
        }


        protected onUpdate(): BehaviorStatus {
            let state = this._context.get("actorState") || 0;
            return (state & ActorState.dizz) != 0 ? BehaviorStatus.Running : BehaviorStatus.Success;
        }

        protected onExit(): void {
        }
    }
}