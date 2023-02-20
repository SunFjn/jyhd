namespace game.role.component.brain.action {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;
    import Transform3D = Laya.Transform3D;

    export class Revenge extends Action {
        private readonly _locomotor: LocomotorComponent;
        private readonly _combat: CombatComponent;
        private readonly _skill: SkillComponent;
        private readonly _transform: Transform3D;
        private readonly _sprite: RoleAvatar;

        constructor(owner: Role) {
            super("Revenge");
            this._combat = owner.getComponent(CombatComponent);
            this._locomotor = owner.getComponent(LocomotorComponent);
            this._skill = owner.getComponent(SkillComponent);
            this._transform = owner.property.get("transform");
            this._sprite = owner.property.get("avatar");
        }

        protected onEnter(): boolean {
            this._combat.owner.on("hurt", this, this.setTarget);
            this._sprite.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
            return true;
        }

        protected onUpdate(): BehaviorStatus {
            if (this._combat.isCooldown()) {
                return BehaviorStatus.Running;
            }
            if (!PlayerModel.instance.autoAi) {
                return BehaviorStatus.Failure;
            }
            if (!this._combat.isValidTarget()) {
                this._sprite.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
            } else {
                this.tryCombat();
            }

            return BehaviorStatus.Running;
        }

        protected onExit(): void {
            this._combat.owner.off("hurt", this, this.setTarget);
            this._locomotor.stop();
            this._combat.setTarget(null);
        }

        private setTarget(id: number, skill: uint, damage: uint, flags: TipsFlags): void {
            if (this._combat.isValidTarget()) {
                return;
            }
            if (this._combat.skipRevenge()) {
                return;
            }

            let target = GameCenter.instance.getRole(id);
            if (target != null) {
                this._combat.setTarget(target);
            } else {
                this._combat.setTarget(null);
            }
        }

        private tryCombat(): void {
            if (!this._combat.isValidRange()) {
                if (!this._locomotor.running()) {
                    let targetPos = this._combat.target.property.get("transform").localPosition;
                    this._sprite.playAnim([AvatarAniBigType.clothes], this._sprite.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
                    this._locomotor.moveTo(targetPos.x, targetPos.y);
                }
            } else {
                this._locomotor.stop();
                this._combat.combat(this._skill.selectSkill());
            }
        }
    }
}