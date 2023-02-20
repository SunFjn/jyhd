namespace game.role.component.brain.behavior {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;
    import MapUtils = game.map.MapUtils;
    import Transform3D = Laya.Transform3D;
    import Point = Laya.Point;

    export class RockerMove extends Action {
        private readonly _transform: Transform3D;
        private readonly _locomotor: LocomotorComponent;
        private readonly _combat: CombatComponent;
        private readonly _skill: SkillComponent;
        private readonly _radius: number;
        private readonly _finish: Point;
        private _direction: number;
        private _customizePoint: Point = null;

        constructor(owner: Role) {
            super("RockerMove");
            this._transform = owner.property.get("transform");
            this._combat = owner.getComponent(CombatComponent);
            this._locomotor = owner.getComponent(LocomotorComponent);
            this._skill = owner.getComponent(SkillComponent);
            this._finish = new Point();
            this._direction = 0;
        }

        protected onEnter(): boolean {
            // 不是自动控制
            if (!PlayerModel.instance.autoAi) {
                this._locomotor.stop();
                return true;
            }
            return false
        }

        protected onUpdate(): BehaviorStatus {
            if (this._combat.isCooldown()) {
                return BehaviorStatus.Running;
            }
            if (PlayerModel.instance.autoAi) {
                return BehaviorStatus.Failure;
            }
            if (PlayerModel.instance.moveDirection != -1) {
                if (PlayerModel.instance.moveDirection != this._direction) {
                    this._locomotor.stop();
                }
                if (this._locomotor.running()) {
                    return BehaviorStatus.Running;
                }
                let Pos = this._transform.localPosition;
                let real = MapUtils.getPosition(Pos.x, -Pos.y)
                switch (PlayerModel.instance.moveDirection) {
                    case 0:
                        real.y -= 20;
                        break;
                    case 1:
                        real.y += 20;
                        break;
                    case 2:
                        real.x -= 20;
                        break;
                    case 3:
                        real.x += 20;
                        break;
                    case 4:
                        real.x -= 20;
                        real.y -= 20;
                        break;
                    case 5:
                        real.x -= 20;
                        real.y += 20;
                        break;
                    case 6:
                        real.x += 20;
                        real.y -= 20;
                        break;
                    case 7:
                        real.x += 20;
                        real.y += 20;
                        break;
                    default:
                        break;
                }
                this.toXy(real)
                this._direction = PlayerModel.instance.moveDirection
                return BehaviorStatus.Running;
            } else if (PlayerModel.instance.customizePoint != null) {
                let p = PlayerModel.instance.customizePoint;
                if (this._customizePoint == null) {
                    this._customizePoint = p;
                    this.toXy(p)
                    return BehaviorStatus.Running;
                }

                if (this._customizePoint == p) {
                    if (!this._locomotor.running()) {
                        PlayerModel.instance.customizePoint = null
                        this._customizePoint = null
                        let avatar = this._locomotor.property.get("avatar");
                        avatar.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI);
                        PlayerModel.instance.autoAi = true;
                        return BehaviorStatus.Failure;
                    }

                } else {
                    this._customizePoint = p;
                    this.toXy(p)
                    return BehaviorStatus.Running;
                }





            } else {
                this._locomotor.stop();
                let avatar = this._locomotor.property.get("avatar");
                avatar.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI);
            }
            return BehaviorStatus.Running;
        }

        protected onExit(): void {

        }

        private toXy(p) {
            if (p.x <= 0) p.x = 1
            if (p.y <= 0) p.y = 1
            if (p.x >= MapUtils.cols) p.x = MapUtils.cols - 1
            if (p.y >= MapUtils.rows) p.y = MapUtils.rows
            this._locomotor.moveToCoordinate_AStar(p)
            let avatar = this._locomotor.property.get("avatar");
            avatar.playAnim([AvatarAniBigType.clothes], ActionType.PAO);
        }
    }
}