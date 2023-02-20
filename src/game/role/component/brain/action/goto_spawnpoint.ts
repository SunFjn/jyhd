namespace game.role.component.brain.action {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;
    import MapUtils = game.map.MapUtils;
    import Transform3D = Laya.Transform3D;

    export class GotoSpawnpoint extends Action {
        private readonly _property: Property;
        private readonly _transform: Transform3D;
        private readonly _locomotor: LocomotorComponent;
        private readonly _getSpawnpoint: () => number;

        constructor(owner: Role, getSpawnpoint: () => number) {
            super("GotoSpawnpoint");
            this._property = owner.property;
            this._transform = owner.property.get("transform");
            this._locomotor = owner.getComponent(LocomotorComponent);
            this._getSpawnpoint = getSpawnpoint;
        }

        private isValidRadius(): boolean {
            let id = this._getSpawnpoint();
            if (id == -1) {
                return false;
            }
            let coords = MapUtils.getPathNode(id);
            let pos = MapUtils.getRealPosition(coords.x, coords.y);
            let targetPos = this._transform.localPosition;
            return MapUtils.testDistance(pos.x, -pos.y, targetPos.x, targetPos.y, 100);
        }

        protected onEnter(): boolean {
            let id = this._getSpawnpoint();
            if (id == -1) {
                return false;
            }
            return true;
        }

        protected onUpdate(): BehaviorStatus {
            if (!this._locomotor.running()) {
                if (this.isValidRadius()) {
                    return BehaviorStatus.Success;
                }

                let id = this._getSpawnpoint();
                if (id == -1) {
                    return BehaviorStatus.Failure;
                }
                let coords = MapUtils.getPathNode(id);
                this._locomotor.moveToCoordinate(coords);
                let avatar = this._property.get("avatar");
                avatar.playAnim([AvatarAniBigType.clothes], avatar.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
            }

            return BehaviorStatus.Running;
        }

        protected onExit(): void {
            this._locomotor.stop();
        }
    }
}