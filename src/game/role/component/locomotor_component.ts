namespace game.role.component {
    import MapUtils = game.map.MapUtils;
    import Point = Laya.Point;
    import Transform3D = Laya.Transform3D;
    import Vector3 = Laya.Vector3;
    import UserMapOpcode = Protocols.UserMapOpcode;
    import MathUtils = utils.MathUtils;
    import SceneModel = modules.scene.SceneModel;
    import MapSpriteLayer = game.map.MapSpriteLayer;

    export class LocomotorComponent extends RoleComponent {
        private _sprite: RoleAvatar;
        private _transform: Transform3D;

        private readonly _walkPath: Array<Point>;
        private _speed: number;
        private _sprint: boolean;
        private _moveStatus: uint;
        private readonly _next: Vector3;
        private readonly _needSync: boolean;//主角
        private _enableSprint: boolean;
        private readonly _sprintRadius: number;
        private readonly _sprintSpeed: number;
        private _lastDistance: number;
        private _sprintStart: number;
        // 主角寻路点记录
        public readonly findWayPint: Array<any>;
        public needFindWay: boolean = false;
        public _speed1000: boolean = false;

        constructor(owner: Role, needSync: boolean, enableSprint: boolean = false, sprintRadius: number = 0, sprintSpeed: number = 0) {
            super(owner);
            this._walkPath = [];

            this._next = new Vector3();
            this._moveStatus = 0;
            this._needSync = needSync;
            this._sprint = false;
            this._enableSprint = enableSprint;
            this._sprintRadius = sprintRadius;
            this._sprintSpeed = sprintSpeed;
            this._lastDistance = 0;
            this._sprintStart = 0;
            this._speed1000 = false;
            if (needSync) {
                this.findWayPint = new Array();
                GlobalData.cccccccc = this.dddd.bind(this);
                GlobalData.bbbbbbbbb = () => {

                    console.log(this._transform.localPosition.toString(), MapUtils.getPosition(this._transform.localPosition.x, -  this._transform.localPosition.y).toString());

                }
            }

            // if (this.property.get("speed") > 500) {
            //     console.log("LocomotorComponent=", this);
            //     this._speed1000 = true;
            // }
        }

        public setup(): void {
            this.owner.on("setCoordinate", this, this.setCoordinate);

            let property = this.property;
            this._sprite = property.get("avatar");
            this._transform = property.get("transform");
            this._speed = property.get("speed") || 0;
            property.on("speed", this, this.updateSpeed);
        }

        public teardown(): void {
            this.stop();
            this.owner.off("setCoordinate", this, this.setCoordinate);
            this.property.off("speed", this, this.updateSpeed);
        }

        public destory(): void {

        }
        //获取运动目标点
        public getNextPos(): Vector3 {
            return this._next;
        }

        /**
         * 获取龙骨组件方向
         */
        public get SKDirection(): -1 | 1 {
            return this._sprite.SKDirection;
        }

        // 发送移动指定
        private sendMoveCode(self_x: number, self_y: number, next_x: number, next_y: number, sprint: boolean) {
            if (this._needSync) {
                // console.log("移动到寻路点：", [self_x, self_y], [next_x, next_y], [... this.findWayPint]);
                Channel.instance.publish(UserMapOpcode.Move, [[self_x, self_y], [next_x, next_y], sprint]);
                if (SceneModel.instance.isHangupScene) {
                    for (let index = 0; index < this.findWayPint.length; index++) {
                        let p = this.findWayPint[index];
                        // 下一个移动点是一个寻路点,移除并发送寻路点消息
                        if (p[0] == next_x && p[1] == next_y && this.needFindWay) {
                            this.needFindWay = false;
                            this.findWayPint.splice(index, 1);
                            Channel.instance.publish(UserMapOpcode.RequestRefeshMonster, [p[0], p[1], p[2]]);
                            return;
                        }
                    }
                }
            }
        }

        public update(): void {
            if (this._moveStatus == 0 || this._speed == 0) {
                return;
            }

            if (this._needSync && Main.instance._reconnect) {
                // console.log("断线重连中,玩家停止移动!!!");
                return;
            }

            if (this._moveStatus == 1) {
                if (this._walkPath.length == 0) {
                    if (this._sprint) {
                        this.owner.publish("sprint", false);
                    }
                    this._sprint = false;
                    this._moveStatus = 0;
                    this.owner.publish("moveOver");
                    return;
                }

                this._lastDistance = MapUtils.calcPathDistance(this._walkPath);

                let next = this._walkPath.pop();
                if (this._needSync) {
                    let pos = this._transform.localPosition;
                    let coords = MapUtils.getPosition(pos.x, -pos.y);
                    this.sendMoveCode(coords.x, coords.y, next.x, next.y, this._sprint);
                }
                this._next.z = next.y * MapDefinitions.PER_ROW_Z;
                MapUtils.getRealPosition(next.x, next.y, next);
                this._next.x = next.x;
                this._next.y = -next.y;
                // 改变角色的方向和龙骨动画的方向
                this.directionTo(next.x, -next.y);

                this._moveStatus = 2;
            }

            if (this._moveStatus == 2) {
                let pos = this._transform.localPosition;
                let dx = this._next.x - pos.x;
                let dy = this._next.y - pos.y;
                let dd = Math.sqrt(dx * dx + dy * dy);
                if (this._enableSprint && !this._sprint) {
                    if ((dd + this._lastDistance) > this._sprintRadius) {
                        this._sprint = true;
                        this._sprintStart = Date.now();
                        let coords = MapUtils.getPosition(pos.x, -pos.y);
                        let next = MapUtils.getPosition(this._next.x, -this._next.y);
                        this.sendMoveCode(coords.x, coords.y, next.x, next.y, this._sprint);
                        this.owner.publish("sprint", true);
                    }
                }

                let speed = this._speed;
                if (this._sprint) {
                    speed = MathUtils.lerp(speed, this._sprintSpeed, (Date.now() - this._sprintStart) / 500);
                    //speed = this._needSync && SceneModel.instance.isHangupScene ? speed / 3 * 2 : speed;
                }

                let delta = (speed * Laya.timer.delta / 1000) / dd;
                pos.reset(
                    MathUtils.lerp(pos.x, this._next.x, delta),
                    MathUtils.lerp(pos.y, this._next.y, delta),
                    MathUtils.lerp(pos.z, this._next.z, delta));
                this._transform.localPosition = pos;
                let coords: Point = MapUtils.getPosition(pos.x, -pos.y);
                // this._sprite.mix = !MapUtils.isOpaqueArea(coords.x, coords.y);
                if (delta >= 1) {
                    this._moveStatus = 1;
                }
            }
        }

        public get enableSprint(): boolean {
            return this._enableSprint;
        }

        public set enableSprint(value: boolean) {
            this._enableSprint = value;
        }

        public get speed(): number {
            let speed = this._speed;
            if (this._sprint) {
                speed = MathUtils.lerp(speed, this._sprintSpeed, (Date.now() - this._sprintStart) / 500);
            }
            return speed;
        }

        public set speed(value: number) {
            this._speed = value;
        }

        public directionTo(x: number, y: number): void {
            let pos = this._transform.localPosition;
            if (Math.abs(pos.x - x) < 16 && Math.abs(pos.y - y) < 16) return; //未发生坐标移动 不调整朝向
            this._sprite.SKDirection = (pos.x - x <= 0) ? 1 : -1;
        }

        private updateSpeed(): void {
            this._speed = this.property.get("speed") || 0;
        }

        public testCoordinate(x: number, y: number): boolean {
            let pos = this._transform.localPosition;
            let coords = MapUtils.getPosition(pos.x, -pos.y);
            return x == coords.x && y == coords.y;
        }

        public setCoordinate(x: number, y: number): void {
            let pos = MapUtils.getRealPosition(x, y);
            let localPosition = this._transform.localPosition;
            localPosition.reset(pos.x, -pos.y, y * MapDefinitions.PER_ROW_Z);
            this._transform.localPosition = localPosition;
            // this._sprite.mix = !MapUtils.isOpaqueArea(x, y);
        }


        public dddd(x: number, y: number, check = true): void {
            this._moveStatus = 1;
            this._walkPath.length = 0;
            let pos = this._transform.localPosition;
            MapUtils.findPath(MapUtils.getPosition(pos.x, -pos.y), MapUtils.getPosition(x, -y), 5, 0, this._walkPath);
        }

        public moveTo(x: number, y: number): void {
            this._moveStatus = 1;
            this._walkPath.length = 0;
            let pos = this._transform.localPosition;

            if (this._needSync) {
                MapUtils.findPath(MapUtils.getPosition(pos.x, -pos.y), MapUtils.getPosition(x, -y), 5, 0, this._walkPath);
            } else {
                this._walkPath.push(MapUtils.getPosition(x, -y));
            }

        }

        public moveToCoordinate(coords: Point): void {
            this._moveStatus = 1;
            this._walkPath.length = 0;
            let pos = this._transform.localPosition;
            if (this._needSync) {
                MapUtils.findPath(MapUtils.getPosition(pos.x, -pos.y), coords, 5, 0, this._walkPath);
            } else {
                this._walkPath.push(new Point(coords.x, coords.y));
            }
        }

        public moveTo_AStar(x: number, y: number): void {
            this._moveStatus = 1;
            this._walkPath.length = 0;
            let pos = this._transform.localPosition;
            if (this._needSync) {
                MapUtils.AStarPath(MapUtils.getPosition(pos.x, -pos.y), MapUtils.getPosition(x, -y), 5, 0, this._walkPath);
            } else {
                this._walkPath.push(MapUtils.getPosition(x, -y));
            }

        }

        public moveToCoordinate_AStar(coords: Point): void {
            this._moveStatus = 1;
            this._walkPath.length = 0;
            let pos = this._transform.localPosition;
            if (this._needSync) {
                MapUtils.AStarPath(MapUtils.getPosition(pos.x, -pos.y), coords, 5, 0, this._walkPath);
            } else {
                this._walkPath.push(new Point(coords.x, coords.y));
            }
        }

        public running(): boolean {
            return this._moveStatus != 0;
        }

        public stop(): void {
            if (this._moveStatus != 0) {
                if (this._needSync) {
                    let pos = this._transform.localPosition;
                    let coords = MapUtils.getPosition(pos.x, -pos.y);
                    // Channel.instance.publish(UserMapOpcode.Move, [[coords.x, coords.y], [coords.x, coords.y], false]);
                    this.sendMoveCode(coords.x, coords.y, coords.x, coords.y, false);
                }
            }
            this._moveStatus = 0;
            if (this._sprint) {
                this.owner.publish("sprint", false);
            }
            this._sprint = false;
        }
    }
}