namespace game.role.component.brain {
    import Transform3D = Laya.Transform3D;
    import MapUtils = game.map.MapUtils;

    export class SuperPetBrainComponent extends RoleComponent {
        private _state: RoleState;
        private readonly _sprite: RoleAvatar;
        private readonly _stateHandlers: Array<Function>;
        private readonly _locomotor: LocomotorComponent;
        private readonly _transform: Transform3D;

        constructor(owner: Role) {
            super(owner);

            this._stateHandlers = [];
            this._stateHandlers[RoleState.MOVING] = this.onMove;
            this._stateHandlers[RoleState.IDLE] = this.onIdle;
            this._stateHandlers[RoleState.DUMMY] = this.onDummy;

            this._state = RoleState.DUMMY;

            this._locomotor = owner.getComponent(LocomotorComponent);
            this._transform = this.property.get("transform");
            this._sprite = this.property.get("avatar");
        }

        public setup(): void {
            this.updateStatus();
            this.property
                .on("status", this, this.updateStatus);
        }

        public teardown(): void {
            this.property
                .off("status", this, this.updateStatus);
            this.goToState(RoleState.DUMMY, true);
        }

        public destory(): void {

        }

        private updateStatus(): void {
            let status = this.property.get("status");
            this.goToState(status);
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

        protected onMove(state: RoleState, opcode: RoleStateAction): boolean {
            switch (opcode) {
                case RoleStateAction.ACTIVATE: {
                    this._sprite.playAnim([AvatarAniBigType.clothes], ActionType.PAO, true, true);
                    this.owner.on("moveOver", this, this.resetState);
                }
                case RoleStateAction.UPDATE: {
                    let spawnpoint = this.property.has("spawnpoint") ? this.property.get("spawnpoint") : -1;
                    if (spawnpoint == -1) {
                        let pos = this._transform.localPosition;
                        spawnpoint = MapUtils.nearbyPathNode(MapUtils.getPosition(pos.x, -pos.y))[0];
                    }
                    // console.log("苏丹寻怪 ！")
                    let node = MapUtils.findNextPathNode(spawnpoint);
                    if (node == null) {
                        this.resetState();
                        return true;
                    }
                    this.property.set("spawnpoint", node[0]);
                    this._locomotor.moveToCoordinate(node[1]);
                    return true;
                }
                case RoleStateAction.DEACTIVATE: {
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
                    this._sprite.playAnim([AvatarAniBigType.clothes], ActionType.PAO, true, true);
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