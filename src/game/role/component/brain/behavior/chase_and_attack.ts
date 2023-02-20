namespace game.role.component.brain.behavior {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;
    import MapUtils = game.map.MapUtils;
    import Transform3D = Laya.Transform3D;

    export class ChaseAndAttack extends Action {
        private readonly _transform: Transform3D;
        private readonly _locomotor: LocomotorComponent;
        private readonly _combat: CombatComponent;
        private readonly _skill: SkillComponent;
        private readonly _radius: number;

        constructor(owner: Role, radius: number) {
            super("ChaseAndAttack");
            this._transform = owner.property.get("transform");
            this._combat = owner.getComponent(CombatComponent);
            this._locomotor = owner.getComponent(LocomotorComponent);
            this._skill = owner.getComponent(SkillComponent);
            this._radius = radius;
        }

        protected onEnter(): boolean {
            return PlayerModel.instance.selectTargetType == SelectTargetType.Monster && PlayerModel.instance.autoAi;
        }

        protected onUpdate(): BehaviorStatus {

            if (this._combat.isCooldown()) {
                return BehaviorStatus.Running;
            }
            if (!PlayerModel.instance.autoAi) {
                return BehaviorStatus.Failure;
            }
            if (PlayerModel.instance.selectTargetType != SelectTargetType.Monster) {
                return BehaviorStatus.Failure;
            }

            if (!this._combat.isValidTarget()) {
                let target = this.getTarget();
                if (!this._combat.testTarget(target)) {
                    return BehaviorStatus.Failure;
                }
                this._combat.setTarget(target);
            } else {
                //检查旧目标是否还在半径内，重新找的目标一定是在半径内，但是旧目标则不一定
                let pos = this._transform.localPosition;
                let targetPos = this._combat.target.property.get("transform").localPosition;
                //测试是否在追杀半径内
                if (!MapUtils.testDistance(pos.x, pos.y, targetPos.x, targetPos.y, this._radius)) {
                    //超过半径重新找目标
                    let target = this.getTarget();
                    //找不到目标则失败
                    if (!this._combat.testTarget(target)) {
                        WindowManager.instance.close(WindowEnum.HEALTH_POINT_PANEL);
                        return BehaviorStatus.Failure;
                    }
                    this._combat.setTarget(target);
                }
            }

            if (!this._combat.isValidRange()) {
                if (!this._locomotor.running()) {
                    let targetPos = this._combat.target.property.get("transform").localPosition;
                    this._locomotor.moveTo(targetPos.x, targetPos.y);
                    let avatar = this._locomotor.property.get("avatar");
                    avatar.playAnim([AvatarAniBigType.clothes], ActionType.PAO);
                }
            } else {
                this._locomotor.stop();
                this._combat.combat(this._skill.selectSkill());



            }

            return BehaviorStatus.Running;
        }

        protected onExit(): void {
            this._locomotor.stop();
            this._combat.setTarget(null);
        }

        private getTarget(): Role {
            let pos = this._transform.localPosition;
            return GameCenter.instance.findNearbyRole(pos.x, pos.y, this._radius, RoleType.Monster);
        }
    }
}