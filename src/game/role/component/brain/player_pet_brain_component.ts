namespace game.role.component.brain {

    import Transform3D = Laya.Transform3D;
    import MapUtils = game.map.MapUtils;

    export class PlayerPetBrainComponent extends RoleComponent {
        private _state: RoleState;
        private readonly _sprite: RoleAvatar;
        private readonly _stateHandlers: Array<Function>;
        private readonly _locomotor: LocomotorComponent;
        private readonly _combat: CombatComponent;
        private readonly _transform: Transform3D;

        private readonly _leader: CombatComponent;
        private readonly _leaderTransform: Transform3D;

        constructor(owner: Role, leader: Role) {
            super(owner);

            this._stateHandlers = [];
            this._stateHandlers[RoleState.FOLLOW] = this.onFollow;
            this._stateHandlers[RoleState.ATTACK] = this.onAttack;
            this._stateHandlers[RoleState.IDLE] = this.onIdle;
            this._stateHandlers[RoleState.DUMMY] = this.onDummy;

            this._state = RoleState.DUMMY;

            this._locomotor = owner.getComponent(LocomotorComponent);
            this._combat = owner.getComponent(CombatComponent);
            this._transform = owner.property.get("transform");

            this._sprite = this.property.get("avatar");

            this._leader = leader.getComponent(CombatComponent);
            this._leaderTransform = leader.property.get("transform");
        }

        public setup(): void {
            this.goToState(RoleState.IDLE);
            this.property
                .on("status", this, this.updateStatus);
        }

        public teardown(): void {
            this.goToState(RoleState.DUMMY, true);
            this.property
                .off("status", this, this.updateStatus);
        }

        public destory(): void {

        }

        public update(): void {
            if (this._state == RoleState.IDLE && !this.isValidRange()) {
                this.goToState(RoleState.FOLLOW);
            } else if (this._state == RoleState.FOLLOW && this.isValidRange()) {
                this.goToState(RoleState.IDLE);
            }

        }

        private updateStatus(): void {
            let status = this.property.get("status");
            if (status == RoleState.REVIVE) {
                this.goToState(RoleState.IDLE, true);
            } else {
                this.goToState(status);
            }
        }

        private isValidRange(): boolean {
            let pos = this._transform.localPosition;
            let targetPos = this._leaderTransform.localPosition;
            return MapUtils.testDistance(pos.x, pos.y, targetPos.x, targetPos.y, 200);
        }

        public goToState(value: RoleState, interrupt: boolean = false): void {
            let handler: Function = this._stateHandlers[this._state];

            if (this._state == value) {
                handler.call(this, value, RoleStateAction.UPDATE);
                return;
            }

            if (interrupt || handler.call(this, value, RoleStateAction.APPLY)) {
                let old: RoleState = this._state;
                handler.call(this, value, RoleStateAction.DEACTIVATE);
                this._state = value;
                this._stateHandlers[value].call(this, old, RoleStateAction.ACTIVATE);
            }
        }

        private onAttack(state: RoleState, opcode: RoleStateAction): boolean {
            switch (opcode) {
                case RoleStateAction.APPLY: {
                    return state == RoleState.DEATH;
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

        protected onFollow(state: RoleState, opcode: RoleStateAction): boolean {
            switch (opcode) {
                case RoleStateAction.APPLY: {
                    return state == RoleState.DEATH || state == RoleState.ATTACK;
                }
                case RoleStateAction.ACTIVATE: {
                    this._sprite.playAnim([AvatarAniBigType.clothes], ActionType.PAO, true, true);
                    this.owner.on("moveOver", this, this.resetState);
                }
                case RoleStateAction.UPDATE: {
                    let targetPos = this._leaderTransform.localPosition;
                    let coords = MapUtils.getPosition(targetPos.x, -targetPos.y);
                    this._locomotor.moveToCoordinate(coords);
                    return true;
                }
                case RoleStateAction.DEACTIVATE: {
                    this._locomotor.stop();
                    this.owner.off("moveOver", this, this.resetState);
                    return true;
                }
            }
            return true;
        }

        private resetState(): void {
            this.goToState(RoleState.IDLE, true);
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

        private onDummy(state: RoleState, opcode: RoleStateAction): boolean {
            return true;
        }
    }
}