namespace game.role.component.brain.behavior {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;
    import Transform3D = Laya.Transform3D;
    import MapUtils = game.map.MapUtils;
    import NpcCfg = modules.config.NpcCfg;
    import npcFields = Configuration.npcFields;
    import Point = Laya.Point;

    export class NpcTriggerAction extends Action {
        private readonly _locomotor: LocomotorComponent;
        private readonly _transform: Transform3D;
        private readonly _model: PlayerModel;
        private _target: Role;
        private readonly _filter: (role: Role) => boolean;
        private readonly _search: boolean;
        private readonly _context: Property;

        constructor(owner: Role, search: boolean = false) {
            super("NpcTriggerAction");
            this._locomotor = owner.getComponent(LocomotorComponent);
            this._transform = owner.property.get("transform");
            this._model = PlayerModel.instance;
            this._target = null;
            this._search = search;
            this._context = owner.property;
            this._filter = (role: Role): boolean => {
                let property = role.property;
                if (property.get("occ") != this._model.selectTargetId) {
                    return false;
                }

                let own = property.get("own") || 0;
                if (own != 0 && own != this._context.get("id")) {
                    return false;
                }

                return true;
            }
        }

        protected onEnter(): boolean {
            return this._model.selectTargetType == SelectTargetType.Npc;
        }

        protected onUpdate(): BehaviorStatus {
            if (this._model.selectTargetType != SelectTargetType.Npc) {
                return BehaviorStatus.Failure;
            }

            if (this._target == null) {
                let pos = this._transform.localPosition;
                this._target = GameCenter.instance.filterNearbyRole(pos.x, pos.y, Number.POSITIVE_INFINITY, RoleType.Npc, this._filter);
                if (this._target == null) {
                    if (this.trySearch()) {
                        return BehaviorStatus.Running;
                    }
                    return BehaviorStatus.Failure;
                }
                this._target.property.on("own", this, this.updateOwn);
            }

            if (!this.tryTrigger()) {
                if (!this._locomotor.running()) {
                    let targetPos = this._target.property.get("transform").localPosition;
                    let avatar = this._locomotor.property.get("avatar");
                    avatar.playAnim([AvatarAniBigType.clothes], avatar.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
                    this._locomotor.moveTo_AStar(targetPos.x, targetPos.y);
                }
                return BehaviorStatus.Running;
            }

            return BehaviorStatus.Success;
        }

        protected onExit(): void {
            if (this._target) {
                this._target.property.off("own", this, this.updateOwn);
            }
            this._target = null;
            this._locomotor.stop();
            let avatar = this._locomotor.property.get("avatar");
            avatar.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
        }

        private trySearch(): boolean {
            let coords: Point;
            if (this._search) {
                let pos = this._context.get("transform").localPosition;
                let spawnpoint = MapUtils.nearbyPathNode(MapUtils.getPosition(pos.x, -pos.y))[0];
                if (spawnpoint == -1) {
                    this._context.set("spawnpoint", -1);
                    return false;
                }
                // console.log("苏丹寻怪 ！")
                let node = MapUtils.findNextPathNode(spawnpoint);
                if (node == null) {
                    return false;
                }
                this._context.set("spawnpoint", node[0]);
                coords = node[1];
            } else {
                let tuple = NpcCfg.instance.getCfgById(this._model.selectTargetId);
                if (tuple == null) {
                    return false;
                }
                let pos = tuple[npcFields.pos];
                if (pos == null) {
                    return false;
                }
                coords = new Point(...pos);
            }


            if (!this._locomotor.running()) {
                let avatar = this._locomotor.property.get("avatar");
                avatar.playAnim([AvatarAniBigType.clothes], avatar.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
                this._locomotor.moveToCoordinate_AStar(coords);
            }
            return true;
        }

        private updateOwn(): void {
            let own = this._target.property.get("own");
            if (own != 0 && own != this._locomotor.property.get("id")) {
                this._target.property.off("own", this, this.updateOwn);
                this._target = null;
                this._locomotor.stop();
                return;
            }
        }

        private tryTrigger(): boolean {
            let pos = this._transform.localPosition;
            let property = this._target.property;
            let targetPos = property.get("transform").position;
            let radius = NpcCfg.instance.getCfgById(property.get("occ"))[npcFields.radius] || 150;
            if (MapUtils.testDistance(pos.x, pos.y, targetPos.x, targetPos.y, radius)) {
                this._target.publish("trigger");
                return true;
            }
            return false;
        }
    }
}