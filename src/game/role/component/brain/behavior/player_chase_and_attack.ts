///<reference path="../../../../misc/direction_utils.ts"/>
namespace game.role.component.brain.behavior {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;
    import Transform3D = Laya.Transform3D;
    import DirectionUtils = game.misc.DirectionUtils
    import Point = Laya.Point;

    export class PlayerChaseAndAttack extends Action {
        private readonly _locomotor: LocomotorComponent;
        private readonly _combat: CombatComponent;
        private readonly _skill: SkillComponent;
        private readonly _transform: Transform3D;

        private readonly _radius: number;
        private readonly _model: PlayerModel;

        constructor(owner: Role, radius: number) {
            super("PlayerChaseAndAttack");
            this._combat = owner.getComponent(CombatComponent);
            this._locomotor = owner.getComponent(LocomotorComponent);
            this._skill = owner.getComponent(SkillComponent);
            this._transform = owner.property.get("transform");

            this._radius = radius;
            this._model = PlayerModel.instance;
        }

        protected onEnter(): boolean {
            return this._model.selectTargetType == SelectTargetType.Player;
        }

        protected onUpdate(): BehaviorStatus {
            if (this._combat.isCooldown()) {
                return BehaviorStatus.Running;
            }

            if (this._model.selectTargetType != SelectTargetType.Player) {
                return BehaviorStatus.Failure;
            }

            if (!this._combat.isValidTarget()) {
                this.setTarget();
                if (!this._combat.isValidTarget()) {
                    return BehaviorStatus.Failure;
                }
            }

            if (!this._combat.isValidRange()) {
                if (!this._locomotor.running()) {
                    let targetPos = this._combat.target.property.get("transform").localPosition;
                    let avatar = this._locomotor.property.get("avatar");
                    let actorPos = new Point(this._transform.localPosition.x,this._transform.localPosition.y);
                    let desPos = new Point(targetPos.x,targetPos.y);
                    DirectionUtils.directionCorrect(actorPos,desPos,30,(pos:Point)=>{//主角和怪物和一个水平线夹角大于30，增加一个转向点
                        desPos = pos;
                    });
                    avatar.playAnim([AvatarAniBigType.clothes], avatar.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
                    this._locomotor.moveTo(desPos.x, desPos.y);
                }
                return BehaviorStatus.Running;
            } else {
                this._locomotor.stop();
                this._combat.combat(this._skill.selectSkill());
                return BehaviorStatus.Running;
            }

            return BehaviorStatus.Success;
        }

        protected onExit(): void {
            this._locomotor.stop();
            this._combat.setTarget(null);
        }


        private setTarget(): void {
            let target: Role;
            if (this._model.selectTargetId != -1) {
                target = GameCenter.instance.getRole(this._model.selectTargetId);
            } else {
                let pos = this._transform.localPosition;
                target = GameCenter.instance.findNearbyRole(pos.x, pos.y, this._radius, RoleType.Player);
            }

            if (this._combat.testTarget(target)) {
                this._combat.setTarget(target);
            } else {
                this._combat.setTarget(null);
            }
        }
    }
}