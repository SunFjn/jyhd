namespace game.role.component.brain.behavior {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;
    import Transform3D = Laya.Transform3D;
    import Point = Laya.Point

    export class RevengeAction extends Action {
        private readonly _locomotor: LocomotorComponent;
        private readonly _combat: CombatComponent;
        private readonly _skill: SkillComponent;
        private readonly _transform: Transform3D;
        private readonly _sprite: RoleAvatar;
        private _timeout: number;
        private readonly _restTime: number;

        constructor(owner: Role, restTime: number) {
            super("RevengeAction");
            this._combat = owner.getComponent(CombatComponent);
            this._locomotor = owner.getComponent(LocomotorComponent);
            this._skill = owner.getComponent(SkillComponent);
            this._transform = owner.property.get("transform");
            this._sprite = owner.property.get("avatar");
            this._timeout = 0;
            this._restTime = restTime;
        }

        protected onEnter(): boolean {
            let owner = this._combat.owner;
            owner.on("hurt", this, this.setTarget);
            this._timeout = Date.now() + this._restTime;
            this._sprite.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
            this.setTarget(owner.property.get("lastEnemy") || 0, 0, 0, 0);
            return true;
        }

        protected onUpdate(): BehaviorStatus {
            if (this._combat.isCooldown()) {
                return BehaviorStatus.Running;
            }

            if (!this._combat.isValidTarget()) {
                if (this._restTime < Date.now()) {
                    return BehaviorStatus.Success;
                }
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
            if (this._combat.testTarget(target)) {
                this._combat.setTarget(target);
            } else {
                this._combat.setTarget(null);
            }
        }

        private tryCombat(): void {
            if (!this._combat.isValidRange()) {
                if (!this._locomotor.running()) {
                    let targetPos = this._combat.target.property.get("transform").localPosition;
                    this._sprite.playAnim([AvatarAniBigType.clothes], ActionType.PAO, true, true);
                    let actorPos = new Point(this._transform.localPosition.x,this._transform.localPosition.y);
                    let desPos = new Point(targetPos.x,targetPos.y);
                    game.misc.DirectionUtils.directionCorrect(actorPos,desPos,10,(pos:Point)=>{//主角和怪物和一个水平线夹角大于10，增加一个转向点
                        desPos = pos;
                    });
                    this._locomotor.moveTo(desPos.x, desPos.y);
                }
            } else {
                this._locomotor.stop();
                this._combat.combat(this._skill.selectSkill());
            }
        }
    }
}