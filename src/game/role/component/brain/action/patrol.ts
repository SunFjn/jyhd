namespace game.role.component.brain.action {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;
    import MapUtils = game.map.MapUtils;
    import Transform3D = Laya.Transform3D;
    import Point = Laya.Point;

    //按路径巡逻,受击中断
    export class Patrol extends Action {
        private readonly _context: Property;
        private readonly _locomotor: LocomotorComponent;
        private _interrupt: boolean;
        private readonly _model: PlayerModel;
        private readonly _transform: Transform3D;
        private readonly _radius: number;
        private readonly _targetType: SelectTargetType;

        constructor(owner: Role, radius: number, targetType: SelectTargetType) {
            super("Patrol");
            this._context = owner.property;
            this._locomotor = owner.getComponent(LocomotorComponent);
            this._interrupt = false;
            this._model = PlayerModel.instance;
            this._transform = owner.property.get("transform");
            this._radius = radius;
            this._targetType = targetType;
        }

        protected onEnter(): boolean {
            if (this._model.selectTargetId == -1 && this.goScenePointPath()) {
                this._locomotor.owner.on("hurt", this, this.interrupt);
                return true;
            }
            return false;
        }

        protected onUpdate(): BehaviorStatus {
            if (this._interrupt || null != this.getTarget()) {
                return BehaviorStatus.Failure;
            }

            if (!this._locomotor.running()) {
                return BehaviorStatus.Success;
            }

            return BehaviorStatus.Running;
        }

        protected onExit(): void {
            this._locomotor.owner.off("hurt", this, this.interrupt);
            this._locomotor.stop();
            this._interrupt = false;
        }

        private interrupt(): void {
            this._interrupt = true;
        }

        private getTarget(): Role {
            if (this._model.selectTargetType != this._targetType) {
                return null;
            }

            switch (this._model.selectTargetType) {
                case SelectTargetType.Monster: {
                    let pos = this._transform.localPosition;
                    if (this._model.selectTargetId != -1) {
                        return GameCenter.instance.findNearbyRole(pos.x, pos.y, this._radius, RoleType.Monster, this._model.selectTargetId);
                    } else {
                        return GameCenter.instance.findNearbyRole(pos.x, pos.y, this._radius, RoleType.Monster);
                    }
                }
                case SelectTargetType.Player: {
                    if (this._model.selectTargetId != -1) {
                        return GameCenter.instance.getRole(this._model.selectTargetId);
                    } else {
                        let pos = this._transform.localPosition;
                        return GameCenter.instance.findNearbyRole(pos.x, pos.y, this._radius, RoleType.Player, 0, this._model.actorId);
                    }
                }
            }
            return null;
        }

        //场景寻路
        private goScenePointPath(): boolean {
            let avatar = this._context.get("avatar");
            //结算角色待机
            if (MapUtils.waitTransition == WaitTransitionType.WaitTransitionFive) {
                avatar.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
                return false;
            }

            let pos = this._context.get("transform").localPosition;
            let curPos = MapUtils.getPosition(pos.x, pos.y);
            let node = MapUtils.getComonSceneGetNextPath(curPos.x);
            if (node == null) {
                avatar.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
                return false;
            }

            this._context.set("spawnpoint", (node[0] as number));
            this._locomotor.moveToCoordinate(node[1] as Point);
            avatar.playAnim([AvatarAniBigType.clothes], avatar.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
            return true;
        }

        private setSpawnpointPath(): boolean {
            let spawnpoint = this._context.has("spawnpoint") ? this._context.get("spawnpoint") : -1;
            if (spawnpoint == -1) {
                let pos = this._context.get("transform").localPosition;
                spawnpoint = MapUtils.nearbyPathNode(MapUtils.getPosition(pos.x, -pos.y))[0];
                if (spawnpoint == -1) {
                    this._context.set("spawnpoint", -1);
                    return false;
                }
            }
            let node = MapUtils.findNextPathNode(spawnpoint);
            if (node == null) {
                return false;
            }
            this._context.set("spawnpoint", node[0]);
            this._locomotor.moveToCoordinate(node[1]);
            let avatar = this._context.get("avatar");
            avatar.playAnim([AvatarAniBigType.clothes], avatar.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
            return true;
        }
    }
}