namespace game.role.component.brain.action {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;
    import MapUtils = game.map.MapUtils;
    import Transform3D = Laya.Transform3D;
    import Pos = Protocols.Pos;
    import Point = Laya.Point;

    export class GotoAssignPoint extends Action {
        private readonly _property: Property;
        private readonly _transform: Transform3D;
        private readonly _locomotor: LocomotorComponent;
        private readonly _selectTargetPos: () => Pos;

        constructor(owner: Role, selectTargetPos: () => Pos) {
            super("GotoSpawnpoint");
            this._property = owner.property;
            this._transform = owner.property.get("transform");
            this._locomotor = owner.getComponent(LocomotorComponent);
            this._selectTargetPos = selectTargetPos;
        }

        private isValidRadius(): boolean {
            let endPos = this._selectTargetPos();
            if (endPos == null) {
                return false;
            }
            let coords = new Point(...endPos);
            let pos = MapUtils.getRealPosition(coords.x, coords.y);
            let targetPos = this._transform.localPosition;
            return MapUtils.testDistance(pos.x, -pos.y, targetPos.x, targetPos.y, 100);
        }

        protected onEnter(): boolean {
            let endPos = this._selectTargetPos();
            if (endPos == null) {
                return false;
            }
            this._property.set('skipRevenge', true)
            return true;
        }

        protected onUpdate(): BehaviorStatus {
            if (!this._locomotor.running()) {
                if (this.isValidRadius()) {
                    return BehaviorStatus.Success;
                }
                let endPos = this._selectTargetPos();
                if (endPos == null) {
                    return BehaviorStatus.Failure;
                }
                let coords = new Point(...endPos);
                this._locomotor.moveToCoordinate_AStar(coords);
                let avatar = this._property.get("avatar");
                avatar.playAnim([AvatarAniBigType.clothes], ActionType.PAO, true, true);
            }


            return BehaviorStatus.Running;
        }

        protected onExit(): void {
            this._locomotor.stop();
            let avatar = this._property.get("avatar");
            avatar.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
            this._property.set('skipRevenge', false)
        }
    }
}