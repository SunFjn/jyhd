///<reference path="../../../../misc/direction_utils.ts"/>
namespace game.role.component.brain.behavior {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;
    import MapUtils = game.map.MapUtils;
    import Point = Laya.Point;
    import Transform3D = Laya.Transform3D;
    import Pos = Protocols.Pos;
    import DirectionUtils = game.misc.DirectionUtils

    const enum BossChaseAndAttackStep {
        MoveToSpawnpoint,
        // AttackToOwner,
        AttackToBoss,
        Revenge,
    }

    export class BossChaseAndAttack extends Action {
        private readonly _locomotor: LocomotorComponent;
        private readonly _combat: CombatComponent;
        private readonly _skill: SkillComponent;
        private readonly _transform: Transform3D;

        private readonly _radius: number;
        private readonly _model: PlayerModel;
        private readonly _selectTargetPos: () => Pos;
        private readonly _getBossOnwer: (occ: number) => number;

        private _step: BossChaseAndAttackStep;

        constructor(owner: Role, radius: number, selectTargetPos: () => Pos, getBossOnwer: (occ: number) => number) {
            super("BossChaseAndAttack");
            this._combat = owner.getComponent(CombatComponent);
            this._locomotor = owner.getComponent(LocomotorComponent);
            this._skill = owner.getComponent(SkillComponent);
            this._transform = owner.property.get("transform");

            this._radius = radius;
            this._model = PlayerModel.instance;
            this._step = BossChaseAndAttackStep.MoveToSpawnpoint;

            this._selectTargetPos = selectTargetPos;
            this._getBossOnwer = getBossOnwer;
        }

        protected onEnter(): boolean {
            if (this._model.selectTargetType != SelectTargetType.Monster || this._model.selectTargetId == -1) {
                return false;
            }

            this._combat.owner.on("hurt", this, this.toRevenge);
            return true;
        }

        protected onUpdate(): BehaviorStatus {
            // console.log("BossChaseAndAttack")
            if (this._combat.isCooldown()) {
                return BehaviorStatus.Running;
            }

            if (this._model.selectTargetType != SelectTargetType.Monster || this._model.selectTargetId == -1) {
                return BehaviorStatus.Failure;
            }

            switch (this._step) {
                case BossChaseAndAttackStep.MoveToSpawnpoint: {
                    if (this.isValidRadius(this._transform)) {
                        // let target = this.getOwnerTarget();
                        // if (this._combat.testTarget(target)) {
                        //     this.enterAttackToOwner(target);
                        // } else {
                        //     target = this.getTarget();
                        //     if (this._combat.testTarget(target)) {
                        //         this.enterAttackToBoss(target);
                        //     } else {
                        //         let status = this.gotoStatus();
                        //         if (status != BehaviorStatus.Running) {
                        //             return BehaviorStatus.Failure;
                        //         }
                        //     }
                        // }
                        let target = this.getTarget();
                        if (this._combat.testTarget(target)) {
                            this.enterAttackToBoss(target);
                        } else {
                            let status = this.gotoStatus();
                            if (status != BehaviorStatus.Running) {
                                return BehaviorStatus.Failure;
                            }
                        }
                    }
                    break;
                }
                // case BossChaseAndAttackStep.AttackToOwner:
                case BossChaseAndAttackStep.Revenge: {
                    if (!this._combat.isValidTarget()) {
                        let target = this.getTarget();
                        if (this._combat.testTarget(target)) {
                            this.enterAttackToBoss(target);
                        } else {
                            this.enterMoveToSpawnpoint();
                        }
                        // let target = this.getOwnerTarget();
                        // if (!this._combat.testTarget(target)) {
                        //     let target = this.getTarget();
                        //     if (this._combat.testTarget(target)) {
                        //         this.enterAttackToBoss(target);
                        //     } else {
                        //         this.enterMoveToSpawnpoint();
                        //     }
                        // } else {
                        //     if (!this.tryGoHome()) {
                        //         this._locomotor.stop();
                        //         this._combat.setTarget(target);
                        //     }
                        // }
                    } else {
                        this.tryGoHome();
                    }
                    break;
                }
                case BossChaseAndAttackStep.AttackToBoss: {
                    // let target = this.getOwnerTarget();
                    // if (this._combat.testTarget(target)) {
                    //     this.enterAttackToOwner(target);
                    // } else if (!this._combat.isValidTarget()) {
                    //     this.enterMoveToSpawnpoint();
                    //     WindowManager.instance.close(WindowEnum.HEALTH_POINT_PANEL);
                    // }
                    if (!this._combat.isValidTarget()) {
                        this.enterMoveToSpawnpoint();
                        WindowManager.instance.close(WindowEnum.HEALTH_POINT_PANEL);
                    }
                    break;
                }
            }

            switch (this._step) {
                case BossChaseAndAttackStep.MoveToSpawnpoint: {
                    if (!this._locomotor.running()) {
                        let targetPos = this._selectTargetPos();
                        let pos = new Point(...targetPos);
                        
                        let node = MapUtils.nearbyPathNode(pos);
                        if (node[0] == -1) {
                            return BehaviorStatus.Failure;
                        }
                        pos = node[1];
                        if (!this._locomotor.running()) {
                            let avatar = this._locomotor.property.get("avatar");
                            avatar.playAnim([AvatarAniBigType.clothes], avatar.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
                            this._locomotor.moveToCoordinate(pos);
                        }
                    }
                    break;
                }
                case BossChaseAndAttackStep.Revenge:
                // case BossChaseAndAttackStep.AttackToOwner:
                case BossChaseAndAttackStep.AttackToBoss: {
                    if (!this._combat.isValidRange()) {
                        if (!this._locomotor.running()) {
                            let targetPos = this._combat.target.property.get("transform").localPosition;
                            let avatar = this._locomotor.property.get("avatar");
                            avatar.playAnim([AvatarAniBigType.clothes], avatar.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
                            let actorPos = this.getActorCurPos();
                            let desPos = new Point(targetPos.x,targetPos.y);
                            DirectionUtils.directionCorrect(actorPos,desPos,30,(pos:Point)=>{//主角和怪物和一个水平线夹角大于30，增加一个转向点
                                desPos = pos;
                                this._step = BossChaseAndAttackStep.AttackToBoss;
                            });
                            this._locomotor.moveTo(desPos.x, desPos.y);
                        }
                    } else {
                        this._locomotor.stop();
                        this._combat.combat(this._skill.selectSkill());
                    }
                }
            }

            return BehaviorStatus.Running;
        }

        protected onExit(): void {
            this._locomotor.stop();
            this._combat.setTarget(null);
            this._step = BossChaseAndAttackStep.MoveToSpawnpoint;
            this._combat.owner.off("hurt", this, this.toRevenge);
        }

        private enterMoveToSpawnpoint(): void {
            this._locomotor.stop();

            this._step = BossChaseAndAttackStep.MoveToSpawnpoint;
        }

        private enterAttackToBoss(target: Role): void {
            this._locomotor.stop();

            this._combat.setTarget(target);

            this._step = BossChaseAndAttackStep.AttackToBoss;
        }

        // private enterAttackToOwner(target: Role): void {
        //     this._locomotor.stop();
        //
        //     this._combat.setTarget(target);
        //
        //     this._step = BossChaseAndAttackStep.AttackToOwner;
        // }

        private tryGoHome(): boolean {
            if (!this.isValidRadius(this._transform)) {
                let target = this.getTarget();
                if (this._combat.testTarget(target)) {
                    this.enterAttackToBoss(target);
                } else {
                    this.enterMoveToSpawnpoint();
                }
                return true;
            }
            return false;
        }

        private gotoStatus(): BehaviorStatus {
            let targetPos = this._selectTargetPos();
            let pos = new Point(...targetPos);
            let node = MapUtils.nearbyPathNode(pos);
            if (node[0] == -1) {
                return BehaviorStatus.Failure;
            }
            pos = node[1];
            if (this._locomotor.testCoordinate(pos.x, pos.y)) {
                return BehaviorStatus.Success;
            }
            return BehaviorStatus.Running;
        }

        private isValidRadius(target: Transform3D): boolean {
            let coords = this._selectTargetPos();
            let pos = MapUtils.getRealPosition(coords[0], coords[1]);
            let targetPos = target.localPosition;
            //测试是否在BOSS点半径内
            return MapUtils.testDistance(pos.x, -pos.y, targetPos.x, targetPos.y, this._radius);
        }

        // private getOwnerTarget(): Role {
        //     let id = this._getBossOnwer(this._model.selectTargetId);
        //     if (id != 0) {
        //         let target = GameCenter.instance.getRole(id);
        //         if (target != null && this.isValidRadius(target.property.get("transform"))) {
        //             return target;
        //         }
        //     }
        //     return null;
        // }

        private getTarget(): Role {
            let pos = this._transform.localPosition;
            return GameCenter.instance.findNearbyRole(pos.x, pos.y, this._radius, RoleType.Monster, this._model.selectTargetId);
        }

        private toRevenge(id: number, skill: uint, damage: uint, flags: TipsFlags): void {
            if (this._step == BossChaseAndAttackStep.AttackToBoss) {
                let target = GameCenter.instance.getRole(id);
                if (this._combat.testTarget(target) && target.property.get("type") == RoleType.Player) {
                    this._combat.setTarget(target);
                    this._locomotor.stop();
                    this._step = BossChaseAndAttackStep.Revenge;
                }
            }
        }

        //获得主角当前位置
        private getActorCurPos(){
            let pos = this._transform.localPosition;
            return new Point(pos.x,pos.y);
        }

    }
}
