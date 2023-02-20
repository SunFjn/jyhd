namespace game.role.component.brain.behavior {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;
    import MapUtils = game.map.MapUtils;
    import Point = Laya.Point;
    import Transform3D = Laya.Transform3D;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import DungeonCtrl = modules.dungeon.DungeonCtrl

    export class MoveToSpawnpoint extends Action {
        private readonly _context: Property;
        private readonly _locomotor: LocomotorComponent;
        private readonly _finish: Point;
        private readonly _combat: CombatComponent;
        private readonly _delay: number;
        private readonly _transform: Transform3D;
        private _timeout: number;
        private readonly _auto: boolean;

        constructor(owner: Role, delay: number = 0, auto: boolean = false) {
            super("MoveToSpawnpoint");
            this._context = owner.property;
            this._transform = owner.property.get("transform");
            this._locomotor = owner.getComponent(LocomotorComponent);
            this._combat = owner.getComponent(CombatComponent);
            this._finish = new Point();
            this._delay = delay;
            this._timeout = 0;
            this._auto = auto;
        }

        protected onEnter(): boolean {
            //天关不走这
            if (modules.scene.SceneModel.instance.isInMission) {
                return false;
            }
            // 挂机场景寻路
            if (modules.scene.SceneModel.instance.isHangupScene) {
                // return this.setSpawnpointPathEx();
                return this.goHangupPointPath();
            } else if (modules.scene.SceneModel.instance.isEveryDayCopyScene 
                || modules.scene.SceneModel.instance.isEventScene
                || modules.scene.SceneModel.instance.isMarryScene) {
                return this.goCopyScenePointPath();
            } else if (modules.scene.SceneModel.instance.isTeamCopyScene 
                || modules.scene.SceneModel.instance.isFactonScene) {
                return this.goTeamScenePointPath();
            } else if (modules.scene.SceneModel.instance.isMultiBossBossScene 
                || modules.scene.SceneModel.instance.isCrossBossScene) {
                return this.goCommonScenePointPath();
            } else {
                return this.setSpawnpointPath();
            }
        }

        private getTarget(): Role {
            let pos = this._transform.localPosition;
            return GameCenter.instance.findNearbyRole(pos.x, pos.y, 300, RoleType.Monster);
        }

        protected onUpdate(): BehaviorStatus {

            if (!PlayerModel.instance.autoAi) {
                return BehaviorStatus.Failure;
            }
            
            // 移动过程中有怪则退出移动状态
            let target = this.getTarget();
            if (this._combat.testTarget(target)) {
                // console.log("移动中...找到怪...追击...");
                return BehaviorStatus.Success;
            }

            if (!this._locomotor.running()) {

                if (this._timeout == 0 && this._delay != 0) {
                    let avatar = this._context.get("avatar");
                    avatar.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
                    this._timeout = Date.now() + this._delay;
                }

                if (this._timeout < Date.now()) {
                    return BehaviorStatus.Success;
                }
            }

            return BehaviorStatus.Running;
        }

        protected onExit(): void {
            this._timeout = 0;
            this._locomotor.stop();
        }

        //挂机寻路场景
        private goHangupPointPath(): boolean {
            let node = MapUtils.getHookSceneGetNextPath();
            let avatar = this._context.get("avatar");
            GlobalData.dispatcher.event(CommonEventType.PLAYER_MOVE_POINT_UPDATE);
            if (node == null) {
                if (MapUtils.waitTransition == WaitTransitionType.WaitTransitionSecond) {
                    //通知转场
                    GameCenter.instance.world.publish("setTransformDoorActive", false);
                    modules.dungeon.DungeonCtrl.instance.reqEnterScene(0);
                    MapUtils.waitTransition = WaitTransitionType.WaitTransitionFive;
                    return false;
                } else if (MapUtils.waitTransition == WaitTransitionType.WaitTransitionOne) {
                    //走向传送门,加载传送门
                    let pos = this.goTransformDoor();
                    MapUtils.waitTransition = WaitTransitionType.WaitTransitionSecond;
                    GameCenter.instance.world.publish("setTransformDoorActive", true, pos);
                    return true;
                }
                return false;
            }

            this._context.set("spawnpoint", (node[0] as number));
            this._locomotor.findWayPint.push([(node[1] as Laya.Point).x, (node[1] as Laya.Point).y, node[2]]);
            this._locomotor.needFindWay = true;
            this._locomotor.moveToCoordinate(node[1] as Point);
            avatar.playAnim([AvatarAniBigType.clothes], avatar.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
          
            return true;
        }

        //每日必做副本
        private goCopyScenePointPath(): boolean {
            let avatar = this._context.get("avatar");
            //结算角色待机
            if (MapUtils.waitTransition == WaitTransitionType.WaitTransitionFive) {
                avatar.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
                return false;
            }
            let curPos = this.getCurPos();
            let transformDoorPos = this.getTransformPos();
            let node = MapUtils.getComonSceneGetNextPath(curPos.x);
            if (node == null) {
                if (MapUtils.waitTransition == WaitTransitionType.WaitTransitionSecond) {
                    //传送,请求传送
                    MapUtils.waitTransition = WaitTransitionType.WaitTransitionFive;
                    MapUtils.initCommonFindPathArray();
                    if (modules.scene.SceneModel.instance.isEveryDayCopyScene) {
                        modules.dungeon.DungeonCtrl.instance.reqEnterKillMonsterCopyTransmit();//副本传送
                    } else if(modules.scene.SceneModel.instance.isEventScene) {
                        modules.dungeon.DungeonCtrl.instance.reqEnterAdventureCopyTransmit();//事件场景传送
                    }
                    return false;
                } else if (MapUtils.waitTransition == WaitTransitionType.WaitTransitionOne) {
                    // 走向传送门，播放传送动画
                    MapUtils.waitTransition = WaitTransitionType.WaitTransitionSecond;
                    GameCenter.instance.world.publish("setTransformDoorActive", true, transformDoorPos);
                    this._locomotor.moveToCoordinate(transformDoorPos);
                    avatar.playAnim([AvatarAniBigType.clothes], ActionType.PAO, true, true);
                    return true;
                }
                return false;
            }
            this._context.set("spawnpoint", (node[0] as number));
            this._locomotor.moveToCoordinate(node[1] as Point);
            avatar.playAnim([AvatarAniBigType.clothes], avatar.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
            return true;
        }

        //一般场景寻路
        private goCommonScenePointPath(): boolean {
            let avatar = this._context.get("avatar");
            //结算角色待机
            if (MapUtils.waitTransition == WaitTransitionType.WaitTransitionFive) {
                avatar.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
                return false;
            }
            let curPos = this.getCurPos();
            let node = MapUtils.getComonSceneGetNextPath(curPos.x);
            if (node == null) {//三界首领会被传送到出生点
                MapUtils.waitTransition == WaitTransitionType.WaitTransitionFive;
                MapUtils.initCommonFindPathArray();
                avatar.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
                return false;
            }

            this._context.set("spawnpoint", (node[0] as number));
            this._locomotor.moveToCoordinate(node[1] as Point);
            avatar.playAnim([AvatarAniBigType.clothes], avatar.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
            return true;
        }

        //组队副本
        private goTeamScenePointPath(): boolean {
            let avatar = this._context.get("avatar");
            //结算角色待机
            if (MapUtils.waitTransition == WaitTransitionType.WaitTransitionFive) {//
                avatar.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
                return false;
            }

            let curPos = this.getCurPos();
            let transformDoorPos = this.getTransformPos();
            //console.log("移动到出生点：" + curPos.x);
            if (MapUtils.waitTransition == WaitTransitionType.WaitTransitionThree) {
                //等待服务器传送
                avatar.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
                return true;
            } else if (MapUtils.waitTransition == WaitTransitionType.WaitTransitionSecond) {
                if (transformDoorPos.x == curPos.x) {
                    //到达传送位
                    MapUtils.waitTransition = WaitTransitionType.WaitTransitionThree;
                } else {
                    //走到到达传送位
                    this._locomotor.moveToCoordinate(transformDoorPos);
                    avatar.playAnim([AvatarAniBigType.clothes], ActionType.PAO, true, true);
                }
                return true;
            } else if (MapUtils.waitTransition == WaitTransitionType.WaitTransitionOne) {
                //走向传送门，播放传送动画
                MapUtils.waitTransition = WaitTransitionType.WaitTransitionSecond;
                GameCenter.instance.world.publish("setTransformDoorActive", true, transformDoorPos);
                this._locomotor.moveToCoordinate(transformDoorPos);
                avatar.playAnim([AvatarAniBigType.clothes], ActionType.PAO, true, true);
                return true;
            }
            return true;
        }

        //普通场景
        private setSpawnpointPath(): boolean {
            let pos = this._context.get("transform").localPosition;
            let spawnpoint = this._auto ? MapUtils.nearbyPathIdNode(MapUtils.getPosition(pos.x, -pos.y))[0] : MapUtils.nearbyPathNode(MapUtils.getPosition(pos.x, -pos.y))[0];
            if (spawnpoint == -1) {
                this._context.set("spawnpoint", -1);
                return false;
            }
            // console.log("苏丹寻怪 ！")
            let node = MapUtils.findNextPathNode(spawnpoint);
            if (node == null) {
                let cfg = SceneCfg.instance.getCfgById(MapUtils.currentID);
                if (MapUtils.waitTransition == WaitTransitionType.WaitTransitionFour) {
                    switch (cfg[sceneFields.type]) {
                        case SceneTypeEx.dahuangCopy:
                        case SceneTypeEx.runeCopy:
                            //通知传送，关闭传送门
                            MapUtils.waitTransition = WaitTransitionType.WaitTransitionOne;
                            GameCenter.instance.world.publish("setTransformDoorActive", false);
                            DungeonCtrl.instance.reqEnterNextLevel();
                            break;
                        default:
                            break;
                    }
                    return false;
                } else if (MapUtils.waitTransition == WaitTransitionType.WaitTransitionThree) {
                    // 走向传送门,加载传送门
                    let pos = this.goTransformDoor();
                    MapUtils.waitTransition = WaitTransitionType.WaitTransitionFour;
                    GameCenter.instance.world.publish("setTransformDoorActive", true, pos);
                    return true;
                } else if (MapUtils.waitTransition == WaitTransitionType.WaitTransitionSecond) {
                    switch (cfg[sceneFields.type]) {
                        case SceneTypeEx.dahuangCopy:
                        case SceneTypeEx.runeCopy:
                            //下一层弹窗倒计时结束，MapUtils.waitTransition会被赋值为WaitTransitionType.WaitTransitionThree
                            break;
                        default:
                            break;
                    }
                    return false;
                } else if (MapUtils.waitTransition == WaitTransitionType.WaitTransitionOne) {
                    switch (cfg[sceneFields.type]) {
                        case SceneTypeEx.dahuangCopy:
                        case SceneTypeEx.runeCopy:
                            // 通知加载传送门并 移动到转场点
                            MapUtils.waitTransition = WaitTransitionType.WaitTransitionSecond;
                            return false;
                            break;
                        default:
                            break;
                    }
                    return true;
                }
                let avatar = this._context.get("avatar");
                avatar.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI);
                return false;
            }
            this._context.set("spawnpoint", node[0]);
            //console.log("移动到出生点：", node[1]);

            this._locomotor.moveToCoordinate(node[1]);
            this._finish.x = node[1].x;
            this._finish.y = node[1].y;
            let avatar = this._context.get("avatar");
            avatar.playAnim([AvatarAniBigType.clothes], avatar.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
            return true;
        }

        // 走向传送门
        private goTransformDoor(): Point {
            let cycleMapCount = MapUtils.getCycleMapCount();
            let transformDoorPos = modules.scene.SceneModel.instance.transformDoorPos;
            let p = new Point(MapUtils.cols * (cycleMapCount - 1) + transformDoorPos.x, transformDoorPos.y);
            let avatar = this._context.get("avatar");
            avatar.playAnim([AvatarAniBigType.clothes], ActionType.PAO, true, true);
            this._locomotor.needFindWay = false;
            this._locomotor.moveToCoordinate(p);
            return p;
        }

        //获得传送位置
        private getTransformPos(): Point {
            let cycleMapCount = MapUtils.getCycleMapCount();
            let transformPos = new Point(MapUtils.cols * (cycleMapCount - 1) + modules.scene.SceneModel.instance.transformDoorPos.x, modules.scene.SceneModel.instance.transformDoorPos.y);
            return transformPos;
        }

        //获得当前位置
        private getCurPos(): Point {
            let pos = this._context.get("transform").localPosition;
            let curPos = MapUtils.getPosition(pos.x, pos.y);
            return curPos;
        }
    }
}