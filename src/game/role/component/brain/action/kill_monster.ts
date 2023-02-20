///<reference path="../../../../misc/direction_utils.ts"/>
namespace game.role.component.brain.action {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;
    import MapUtils = game.map.MapUtils;
    import Point = Laya.Point;
    import Transform3D = Laya.Transform3D;
    import Pos = Protocols.Pos;
    import BossInfoFields = Protocols.BossInfoFields;
    import ShengYuBossModel = modules.sheng_yu.ShengYuBossModel;
    import BossDungeonModel = modules.bossDungeon.BossDungeonModel;
    import DirectionUtils = game.misc.DirectionUtils


    const enum BossChaseAndAttackStep {
        MoveToSpawnpoint,
        // AttackToOwner,
        AttackToBoss,
        Revenge,
        MoveToMonster,
        AttackToMonster,
    }

    export class KillMonster extends Action {
        private readonly _locomotor: LocomotorComponent;
        private readonly _combat: CombatComponent;
        private readonly _skill: SkillComponent;
        private readonly _transform: Transform3D;

        private readonly _radius: number;
        private readonly _model: PlayerModel;

        private _step: BossChaseAndAttackStep;

        constructor(owner: Role, radius: number) {
            super("KillMonster");
            this._combat = owner.getComponent(CombatComponent);
            this._locomotor = owner.getComponent(LocomotorComponent);
            this._skill = owner.getComponent(SkillComponent);
            this._transform = owner.property.get("transform");

            this._radius = radius;
            this._model = PlayerModel.instance;
            this._step = BossChaseAndAttackStep.MoveToSpawnpoint;
        }

        protected onEnter(): boolean {
            this._combat.owner.on("hurt", this, this.toRevenge);
            if (this._model.selectTargetType != SelectTargetType.Monster)
                this._model.selectTargetType = SelectTargetType.Dummy;
            return true;
        }

        private hasLiveBoss(): boolean {
            return DungeonModel.instance.getLiveBoss() != -1;
        }

        private getLiveBoss(): Role {
            let result: Role = null;
            let pos = this._transform.localPosition;
            if (this._model.selectTargetType == SelectTargetType.Monster && this._model.selectTargetId != -1) {
                result = GameCenter.instance.findNearbyRole(pos.x, pos.y, this._radius, RoleType.Monster, this._model.selectTargetId);
                if (!result && DungeonModel.instance.getLiveBoss(this._model.selectTargetId) != -1) {
                    return null;
                }
            }

            if (!result) {
                let occ = DungeonModel.instance.getLiveBoss();
                if (occ != -1) {
                    result = GameCenter.instance.findNearbyRole(pos.x, pos.y, this._radius, RoleType.Monster, occ);
                }
            }
            return result;
        }

        private getTarget(): Role {
            let pos = this._transform.localPosition;
            return GameCenter.instance.findNearbyRole(pos.x, pos.y, this._radius, RoleType.Monster);
        }

        protected onUpdate(): BehaviorStatus {
            if (this._combat.isCooldown()) {
                return BehaviorStatus.Running;
            }

            switch (this._step) {
                case BossChaseAndAttackStep.MoveToSpawnpoint: {
                    if (this.hasLiveBoss()) {
                        if (this.isValidRadius(this._transform)) {
                            let target = this.getLiveBoss();
                            if (this._combat.testTarget(target)) {
                                this.enterAttackToBoss(target);
                            }
                        }
                    } else {
                        let target = this.getTarget();
                        if (this._combat.testTarget(target)) {
                            this.enterAttackToMonster(target);
                        } else {
                            this.enterMoveToMonster();
                        }
                    }
                    break;
                }
                case BossChaseAndAttackStep.MoveToMonster: {
                    if (this.hasLiveBoss()) {
                        this.enterMoveToSpawnpoint();
                    } else {
                        let target = this.getTarget();
                        if (this._combat.testTarget(target)) {
                            this.enterAttackToMonster(target);
                        }
                    }
                    break;
                }
                case BossChaseAndAttackStep.Revenge: {
                    if (!this._combat.isValidTarget()) {
                        if (this.hasLiveBoss()) {
                            let target = this.getLiveBoss();
                            if (this._combat.testTarget(target)) {
                                this.enterAttackToBoss(target);
                            } else {
                                this.enterMoveToSpawnpoint();
                            }
                        } else {
                            let target = this.getTarget();
                            if (this._combat.testTarget(target)) {
                                this.enterAttackToMonster(target);
                            } else {
                                this.enterMoveToMonster();
                            }
                        }
                    } else {
                        if (this.hasLiveBoss()) {
                            this.tryGoHome();
                        }
                    }
                    break;
                }
                case BossChaseAndAttackStep.AttackToMonster:
                case BossChaseAndAttackStep.AttackToBoss: {
                    if (!this._combat.isValidTarget()) {
                        if (this.hasLiveBoss()) {
                            this.enterMoveToSpawnpoint();
                        } else {
                            this.enterMoveToMonster()
                        }
                    }
                    break;
                }
            }

            switch (this._step) {
                case BossChaseAndAttackStep.MoveToSpawnpoint: {
                    if (!this._locomotor.running()) {
                        let targetPos = this.getBossPos();
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
                case BossChaseAndAttackStep.MoveToMonster: {
                    if (!this._locomotor.running()) {
                        let pos = this._transform.localPosition;
                        let id = MapUtils.nearbyPathIdNode(MapUtils.getPosition(pos.x, -pos.y))[0];
                        let node = MapUtils.findNextPathNode(id);
                        if (node[0] == -1) {
                            return BehaviorStatus.Failure;
                        }
                        if (!this._locomotor.running()) {
                            let avatar = this._locomotor.property.get("avatar");
                            avatar.playAnim([AvatarAniBigType.clothes], avatar.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
                            this._locomotor.moveToCoordinate(node[1]);
                        }
                    }
                    break;
                }
                case BossChaseAndAttackStep.Revenge:
                case BossChaseAndAttackStep.AttackToMonster:
                case BossChaseAndAttackStep.AttackToBoss: {
                    if (!this._combat.isValidRange()) {
                        if (!this._locomotor.running()) {
                            let targetPos = this._combat.target.property.get("transform").localPosition;
                            let avatar = this._locomotor.property.get("avatar");
                            let actorPos = new Point(this._transform.localPosition.x,this._transform.localPosition.y);
                            let desPos = new Point(targetPos.x,targetPos.y);
                            let isDirectionCorrect = false
                            DirectionUtils.directionCorrect(actorPos,desPos,10,(pos:Point)=>{//主角和怪物和一个水平线夹角大于10，增加一个转向点
                                desPos = pos;
                                isDirectionCorrect = true;
                            });
                            avatar.playAnim([AvatarAniBigType.clothes], avatar.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
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
            this._combat.setTarget(null);
            if (this._model.selectTargetType == SelectTargetType.Monster && this._model.selectTargetId != -1 && DungeonModel.instance.getLiveBoss(this._model.selectTargetId) != -1) {
                BossDungeonModel.instance.selectLastBoss = DungeonModel.instance.getLiveBoss(this._model.selectTargetId);
            } else {
                BossDungeonModel.instance.selectLastBoss = DungeonModel.instance.getLiveBoss();
            }
        }

        private enterMoveToMonster(): void {
            this._locomotor.stop();
            this._step = BossChaseAndAttackStep.MoveToMonster;
            this._combat.setTarget(null);
        }

        private enterAttackToBoss(target: Role): void {
            this._locomotor.stop();
            this._combat.setTarget(target);
            this._step = BossChaseAndAttackStep.AttackToBoss;
        }

        private enterAttackToMonster(target: Role): void {
            this._locomotor.stop();
            this._combat.setTarget(target);
            this._step = BossChaseAndAttackStep.AttackToMonster;
        }


        private tryGoHome(): boolean {
            if (!this.isValidRadius(this._transform)) {
                let target = this.getLiveBoss();
                if (this._combat.testTarget(target)) {
                    this.enterAttackToBoss(target);
                } else {
                    this.enterMoveToSpawnpoint();
                }
                return true;
            }
            return false;
        }

        private isValidRadius(target: Transform3D): boolean {
            let coords = this.getBossPos();
            let pos = MapUtils.getRealPosition(coords[0], coords[1]);
            let targetPos = target.localPosition;
            //测试是否在BOSS点半径内
            return MapUtils.testDistance(pos.x, -pos.y, targetPos.x, targetPos.y, this._radius);
        }

        private getBossPos(): Pos {
            if (this._model.selectTargetType == SelectTargetType.Monster && this._model.selectTargetId != -1) {
                if (DungeonModel.instance.getLiveBoss(this._model.selectTargetId) != -1) {
                    return DungeonModel.instance.getBossInfoById(this._model.selectTargetId)[BossInfoFields.pos];
                }
            }
            let occ = DungeonModel.instance.getLiveBoss();
            return occ != -1 ? DungeonModel.instance.getBossInfoById(occ)[BossInfoFields.pos] : null;
        }


        private toRevenge(id: number, skill: uint, damage: uint, flags: TipsFlags): void {
            if (this._step != BossChaseAndAttackStep.Revenge) {
                let target = GameCenter.instance.getRole(id);
                if (this._combat.testTarget(target) && target.property.get("type") == RoleType.Player) {
                    this._combat.setTarget(target);
                    this._locomotor.stop();
                    this._step = BossChaseAndAttackStep.Revenge;
                }
            }
        }
    }
}