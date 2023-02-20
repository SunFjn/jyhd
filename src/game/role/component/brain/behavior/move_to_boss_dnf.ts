namespace game.role.component.brain.behavior {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;
    import MapUtils = game.map.MapUtils;
    import UserMapOpcode = Protocols.UserMapOpcode;
    import SceneModel = modules.scene.SceneModel;

    const enum MoveToBossStep {
        WaitJoin,
        Wait,
        MoveToPos,
        Watch,
        Delay,
    }

    // 移动boss 展示像 异界地下城一样
    // 先移动视角到BOSS 
    // 等待BOSS 展示完 然后人物跑入开始战斗
    export class MoveToBossDnf extends Action {
        private readonly _property: Property;
        private readonly _locomotor: LocomotorComponent;
        private _step: MoveToBossStep;
        private readonly _delay: number;
        private _timeout: number;
        private _target: Role;

        constructor(owner: Role, delay: number = 0) {
            super("MoveToBossDnf");
            this._property = owner.property;
            this._locomotor = owner.getComponent(LocomotorComponent);
            this._delay = delay;
            this._timeout = 0;
        }

        protected onEnter(): boolean {
            let success = this._property.get("moveType") == 1;
            if (success) {
                this._step = MoveToBossStep.WaitJoin;
                this._timeout = Date.now() + 1000;
                this._locomotor.stop();
                let avatar = this._property.get("avatar");
                avatar.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
            }
            return success;
        }

        protected onUpdate(): BehaviorStatus {
            switch (this._step) {
                case MoveToBossStep.WaitJoin: {
                    if (this._timeout < Date.now()) {
                        this._target = null
                        this._step = MoveToBossStep.Wait;
                        // this._locomotor.owner.publish("visible", false);
                        Channel.instance.publish(UserMapOpcode.ReqFlushBoss, null);
                        this._timeout = Date.now() + 300
                    }
                    break;
                }
                case MoveToBossStep.Wait: {
                    let pos = this._property.get("desPos");
                    let current = MapUtils.getRealPosition(pos.x, pos.y);
                    this._target = GameCenter.instance.findNearbyRole(current.x, -current.y, 1000, RoleType.Monster);
                    if (this._target != null) {
                        console.log("获取到BOSS", this._target)
                        this._step = MoveToBossStep.Watch
                        // 如果没有入场动画就等待两秒
                        this._timeout = this._target.property.get("status") != RoleState.SHOW ? Date.now() + 2000 : 0;
                        GameCenter.instance.world.publish("follow", this._target.getComponent(LocomotorComponent), true);
                    } else if (this._timeout > 0 && this._timeout < Date.now()) {
                        // 300毫秒BOSS没出现 兼容下 人物跑过去
                        this._timeout = 0;
                        this._step = MoveToBossStep.MoveToPos
                        this.move();
                    }


                    break;
                }
                case MoveToBossStep.Watch: {
                    if ((this._timeout == 0 && this._target.property.get("status") != RoleState.SHOW) || this._timeout < Date.now()) {
                        this._step = MoveToBossStep.MoveToPos;
                        this.move();
                    }
                    break;
                }
                case MoveToBossStep.MoveToPos: {
                    if (!this._locomotor.running()) {
                        this._property.set("moveType", 0);
                        let avatar = this._property.get("avatar");
                        GameCenter.instance.world.publish("follow", this._locomotor, true);
                        avatar.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
                        return BehaviorStatus.Success;
                    }
                    break;
                }
            }

            return BehaviorStatus.Running;
        }
        private move() {
            // this._locomotor.owner.publish("visible", true);
            let pos: Laya.Point = this._property.get("desPos");
            pos.x += -20;
            let node: [number, Laya.Point] = [1, pos];
            this._property.set("spawnpoint", node[0]);
            this._locomotor.moveToCoordinate(node[1]);
            let avatar = this._property.get("avatar");
            avatar.playAnim([AvatarAniBigType.clothes], avatar.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
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