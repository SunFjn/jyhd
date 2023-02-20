namespace game.role.component.brain.behavior {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;

    export class RestAction extends Action {
        private readonly _restTime: number;
        private _timeout: number;
        private _isOver: boolean;
        private readonly _reuse: boolean;
        private _sprite: RoleAvatar;

        constructor(owner: Role, restTime: number, reuse: boolean) {
            super("RestAction");
            this._restTime = restTime;
            this._timeout = 0;
            this._isOver = false;
            this._reuse = reuse;
            this._sprite = owner.property.get("avatar");
        }

        protected onEnter(): boolean {
            if (!this._reuse && this._isOver) {
                return false;
            }
            this._timeout = Date.now() + this._restTime;
            this._sprite.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, false);
            return true;
        }

        protected onUpdate(): BehaviorStatus {
            return Date.now() < this._timeout ? BehaviorStatus.Running : BehaviorStatus.Success;
        }

        protected onExit(): void {
            this._isOver = true;
        }
    }
}