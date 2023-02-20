namespace game.role.component.brain.behavior {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;

    export class Rest extends Action {
        private readonly _model: PlayerModel;
        private _sprite: RoleAvatar;

        constructor(owner: Role) {
            super("Rest");
            this._sprite = owner.property.get("avatar");
            this._model = PlayerModel.instance;
        }

        protected onEnter(): boolean {
            return this._model.selectTargetType == SelectTargetType.Dummy;
        }

        protected onUpdate(): BehaviorStatus {
            return this._model.selectTargetType == SelectTargetType.Dummy ? BehaviorStatus.Running : BehaviorStatus.Success;
        }
    }
}