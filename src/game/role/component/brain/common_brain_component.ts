namespace game.role.component.brain {
    import Point = Laya.Point
    export class CommonBrainComponent extends RoleComponent {
        private _state: RoleState;
        private readonly _sprite: RoleAvatar;
        private readonly _stateHandlers: Array<Function>;
        private readonly _locomotor: LocomotorComponent;
        private readonly _combat: CombatComponent;

        constructor(owner: Role) {
            super(owner);

            this._stateHandlers = [];
            this._stateHandlers[RoleState.DEATH] = this.onDeath;
            this._stateHandlers[RoleState.ATTACK] = this.onAttack;
            this._stateHandlers[RoleState.MOVING] = this.onMove;
            this._stateHandlers[RoleState.STRIKE] = this.onStrike;
            this._stateHandlers[RoleState.IDLE] = this.onIdle;
            this._stateHandlers[RoleState.DUMMY] = this.onDummy;
            this._stateHandlers[RoleState.SHOW] = this.onShow;

            this._state = RoleState.DUMMY;

            this._locomotor = owner.getComponent(LocomotorComponent);
            this._combat = owner.getComponent(CombatComponent);

            this._sprite = this.property.get("avatar");
        }

        public setup(): void {
            this.updateStatus();
            this.property
                .on("status", this, this.updateStatus)
                .on("actorState", this, this.updateAbnormal);
            this.owner
                // .on("hurt", this, this.strike)
                .on("strike", this, this.strike);
        }

        public teardown(): void {
            this.property
                .off("status", this, this.updateStatus)
                .off("actorState", this, this.updateAbnormal);
            this.owner
                // .off("hurt", this, this.strike)
                .off("strike", this, this.strike);
            this.goToState(RoleState.DUMMY, true);
        }

        public destory(): void {

        }

        private updateStatus(): void {
            let status = this.property.get("status");
            if (status == RoleState.REVIVE) {
                this.goToState(RoleState.IDLE, true);
            } else {
                this.goToState(status);
            }
        }

        public goToState(value: RoleState, interrupt: boolean = false): void {
            if (this._state == RoleState.DEATH) {
                //console.log("角色已经死亡，不可切换状态!");
                return;
            }
            let handler: Function = this._stateHandlers[this._state];

            // 相同值，更新当前状态
            if (this._state == value) {
                handler.call(this, value, RoleStateAction.UPDATE);
                return;
            }

            // 直接打断并切换状或申请切换状态成功。
            if (interrupt || handler.call(this, value, RoleStateAction.APPLY)) {

                let old: RoleState = this._state;
                handler.call(this, value, RoleStateAction.DEACTIVATE);
                this._state = value;
                this._stateHandlers[value].call(this, old, RoleStateAction.ACTIVATE);
            }
        }

        private onDeath(state: RoleState, opcode: RoleStateAction): boolean {
            switch (opcode) {
                case RoleStateAction.APPLY: {
                    return false;
                }
                case RoleStateAction.ACTIVATE: {
                    // 保存死亡状态
                    this._state = RoleState.DEATH;

                    this.owner.publish("death");
                    this.owner.property.event("death");

                    this._sprite.playAnim([AvatarAniBigType.clothes], ActionType.SIWANG, false, true, () => {
                        //this._state = RoleState.DUMMY;
                        this.owner.publish("fade");
                    });

                    GameCenter.instance.world.publish("castShadow2D", false, ShadowScale.CommonScale, this.property);
                    return true;
                }
            }
            return true;
        }

        private onAttack(state: RoleState, opcode: RoleStateAction): boolean {
            switch (opcode) {
                // 挂机场景-死亡或受击时可切换状态，否则只有死亡能切换状态
                case RoleStateAction.APPLY: {
                    if (modules.scene.SceneModel.instance.isHangupScene && !modules.scene.SceneModel.instance.isInMission) {
                        return state == RoleState.DEATH || state == RoleState.STRIKE;
                    } else {
                        return state == RoleState.DEATH;
                    }
                }
                case RoleStateAction.ACTIVATE: {
                    let battle = this.property.get("battle");
                    let role = GameCenter.instance.getRole(battle[0]);
                    if (role != null) {
                        this._combat.setTarget(role);
                        this._combat.combat(battle[1]);
                        this._combat.owner.on("combatComplete", this, this.resetState);
                    } else {
                        this.resetState();
                    }
                    return true;
                }
                case RoleStateAction.UPDATE: {
                    if (this._combat.isCooldown()) {
                        return true;
                    }
                    let battle = this.property.get("battle");
                    let role = GameCenter.instance.getRole(battle[0]);
                    if (role != null) {
                        this._combat.setTarget(role);
                        this._combat.combat(battle[1]);
                        this._combat.owner.on("combatComplete", this, this.resetState);
                    } else {
                        this.resetState();
                    }
                    return true;
                }
                case RoleStateAction.DEACTIVATE: {
                    this._combat.owner.off("combatComplete", this, this.resetState);
                    return true;
                }
            }
            return true;
        }

        protected onMove(state: RoleState, opcode: RoleStateAction): boolean {
            switch (opcode) {
                case RoleStateAction.APPLY: {
                    return state == RoleState.DEATH || state == RoleState.ATTACK;
                }
                case RoleStateAction.ACTIVATE: {
                    this._sprite.playAnim([AvatarAniBigType.clothes], this._sprite.haveImmortals ? ActionType.DAIJI : ActionType.PAO);
                    this.owner.on("moveOver", this, this.resetState);
                }
                case RoleStateAction.UPDATE: {
                    if (this.property.get("moveType") == 2) {
                        this._locomotor.speed = 1000;
                        this.owner.publish("sprint", true);
                    } else {
                        this._locomotor.speed = this.property.get("speed");
                        this.owner.publish("sprint", false);
                    }
                    let pos = this.property.get("pos");
                    let desPos = this.property.get("desPos");
                    if (modules.scene.SceneModel.instance.isDirectCurrectScene) {
                        game.misc.DirectionUtils.directionCorrect(pos, desPos, 30, (pos: Point) => {//主角和玩家一个水平线夹角大于30，增加一个转向点
                            desPos = new Point(pos.x, pos.y);
                        });
                    }
                    this._locomotor.setCoordinate(pos.x, pos.y);
                    this._locomotor.moveToCoordinate(desPos);
                    return true;
                }
                case RoleStateAction.DEACTIVATE: {
                    let pos = this.property.get("desPos");
                    this._locomotor.stop();
                    this._locomotor.setCoordinate(pos.x, pos.y);
                    this._locomotor.speed = this.property.get("speed");
                    this.owner.publish("sprint", false);
                    this.owner.off("moveOver", this, this.resetState);
                    return true;
                }
            }
            return true;
        }

        private resetState(): void {
            this.goToState(RoleState.IDLE, true);
        }

        private onStrike(state: RoleState, opcode: RoleStateAction): boolean {

            switch (opcode) {
                case RoleStateAction.APPLY: {
                    // if (SceneCtrl.instance.sceneType == SceneTypeEx.common) {
                    return state == RoleState.ATTACK || state == RoleState.DEATH;
                    // } 
                }
                case RoleStateAction.UPDATE: {
                    this._sprite.playAnim([AvatarAniBigType.clothes], ActionType.SHOUJI, false, true, () => {
                        this.resetState();
                    }, this);
                    break;
                }
                case RoleStateAction.ACTIVATE: {
                    this._sprite.playAnim([AvatarAniBigType.clothes], ActionType.SHOUJI, false, true, () => {
                        this.resetState();
                    }, this);
                    break;
                }
            }
            return true;
        }

        private onIdle(state: RoleState, opcode: RoleStateAction): boolean {
            switch (opcode) {
                case RoleStateAction.ACTIVATE: {
                    this._sprite.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
                    return true;
                }
            }
            return true;
        }

        private onShow(state: RoleState, opcode: RoleStateAction): boolean {
            switch (opcode) {
                case RoleStateAction.ACTIVATE: {
                    // 出场动画
                    // console.log("aaaa -start 这里需要播放Boss出场动画！后续检测是否有问题");
                    this._sprite.playAnim([AvatarAniBigType.clothes], ActionType.SHOW, false, true, () => {
                        // console.log("aaaa - end 设置状态：待机");
                        this.property.set("status", RoleState.IDLE)
                    });
                    return true;
                }
            }
            return true;
        }

        private onDummy(state: RoleState, opcode: RoleStateAction): boolean {
            return true;
        }

        private updateAbnormal(state: number): void {
            this.owner.publish("abnormal", state);
        }

        private strike(role, skill, skip): void {
            if (skip) return;
            this.goToState(RoleState.STRIKE);
        }
    }
}