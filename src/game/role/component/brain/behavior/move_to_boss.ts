namespace game.role.component.brain.behavior {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;
    import MapUtils = game.map.MapUtils;
    import UserMapOpcode = Protocols.UserMapOpcode;
    import SceneModel = modules.scene.SceneModel;

    const enum MoveToBossStep {
        MoveToPos,
        Wait,
        Watch,
        Delay,
    }


    export class MoveToBoss extends Action {
        private readonly _property: Property;
        private readonly _locomotor: LocomotorComponent;
        private _step: MoveToBossStep;
        private readonly _delay: number;
        private _timeout: number;
        private _target: Role;

        constructor(owner: Role, delay: number = 0) {
            super("MoveToBoss");
            this._property = owner.property;
            this._locomotor = owner.getComponent(LocomotorComponent);
            this._delay = delay;
            this._timeout = 0;
        }

        protected onEnter(): boolean {
            let success = this._property.get("moveType") == 1;
            if (success) {
                this._step = MoveToBossStep.MoveToPos;
                let pos: Laya.Point = this._property.get("desPos");

                let node: [number, Laya.Point] = null;

                // 防止引用类型的错误，先这么写着
                pos = new Laya.Point(pos.x, pos.y);

                if (SceneModel.instance.isInMission) {
                    // 判断天关Boss在玩家的左边还是右边
                    let masterPos = this._property.get("transform").localPosition;
                    let masterX = MapUtils.getPosition(masterPos.x, masterPos.y).x;
                    let offsetX = (masterX >= pos.x) ? 20 : -20;
                    pos.x += offsetX;
                    node = [1, pos];
                    console.log("玩家位置：", masterX, " 怪物位置：", pos.x, "offsetX:", offsetX);

                    console.log("天关移动到Boss -- 真实位置：", pos);
                } else {
                    node = MapUtils.nearbyPathNode(pos);
                }

                this._property.set("spawnpoint", node[0]);
                if (node[0] == -1) {
                    return false;
                }
                this._locomotor.moveToCoordinate(node[1]);

                let avatar = this._property.get("avatar");

                avatar.playAnim([AvatarAniBigType.clothes], avatar.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
            }
            return success;
        }

        protected onUpdate(): BehaviorStatus {

            switch (this._step) {
                case MoveToBossStep.MoveToPos: {
                    if (!this._locomotor.running()) {
                        this._property.set("moveType", 0);
                        Channel.instance.publish(UserMapOpcode.ReqFlushBoss, null);
                        this._step = MoveToBossStep.Wait;
                        let avatar = this._property.get("avatar");
                        avatar.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
                    }
                    break;
                }
                case MoveToBossStep.Wait: {
                    let pos = this._property.get("desPos");
                    let current = MapUtils.getRealPosition(pos.x, pos.y);
                    this._target = GameCenter.instance.findNearbyRole(current.x, -current.y, 1000, RoleType.Monster);
                    if (this._target != null) {
                        this._step = MoveToBossStep.Watch;
                        this._timeout = 0;
                        this._locomotor.owner.publish("visible", false);
                        if (this._target.property.get("status") == RoleState.SHOW) {
                            GameCenter.instance.world.publish("follow", this._target.getComponent(LocomotorComponent), false);
                        } else {
                            this._timeout = Date.now() + 2000;
                        }
                    }
                    break;
                }
                case MoveToBossStep.Watch: {
                    if ((this._timeout == 0 && this._target.property.get("status") != RoleState.SHOW) || this._timeout < Date.now() || !this._target.isValid) {
                        this._step = MoveToBossStep.Delay;
                        this._timeout = Date.now() + this._delay;
                        this._locomotor.owner.publish("visible", true);
                        GameCenter.instance.world.publish("follow", this._locomotor, true);
                    }
                    break;
                }
                case MoveToBossStep.Delay: {
                    if (this._timeout < Date.now()) {
                        return BehaviorStatus.Success;
                    }
                    break;
                }
            }

            return BehaviorStatus.Running;
        }

        protected onExit(): void {
            this._locomotor.owner.publish("visible", true);
            GameCenter.instance.world.publish("follow", this._locomotor, false);
            this._timeout = 0;
            this._target = null;
            this._locomotor.stop();
        }
    }
}