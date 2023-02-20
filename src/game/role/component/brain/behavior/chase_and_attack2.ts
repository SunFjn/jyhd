

// src\modules\xuanhuo\xuanhuo_model.ts
///<reference path="../../../../../modules/xuanhuo/xuanhuo_model.ts"/>


namespace game.role.component.brain.action {
    import Action = game.ai.behavior.Action;
    import BehaviorStatus = game.ai.behavior.BehaviorStatus;
    import MapUtils = game.map.MapUtils;
    import Transform3D = Laya.Transform3D;
    import XuanHuoModel = modules.xuanhuo.XuanHuoModel;
    import Point = Laya.Point;
    import Pos = Protocols.Pos;

    export class ChaseAndAttack2 extends Action {
        private readonly _transform: Transform3D;
        private readonly _locomotor: LocomotorComponent;
        private readonly _combat: CombatComponent;
        private readonly _skill: SkillComponent;
        private readonly _radius: number;
        private readonly _model: PlayerModel;
        private readonly _targetType: SelectTargetType;
        private _interrupt: boolean;
        private readonly _sprite: RoleAvatar;

        constructor(owner: Role, radius: number, targetType: SelectTargetType) {
            super("ChaseAndAttack2");
            this._transform = owner.property.get("transform");
            this._combat = owner.getComponent(CombatComponent);
            this._locomotor = owner.getComponent(LocomotorComponent);
            this._skill = owner.getComponent(SkillComponent);
            this._radius = radius;
            this._model = PlayerModel.instance;
            this._targetType = targetType;
            this._sprite = owner.property.get("avatar");
            this._interrupt = false;
        }

        private interrupt(id: number, skill: uint, damage: uint, flags: TipsFlags): void {
            let target = GameCenter.instance.getRole(id);
            if (this._combat.testTarget(target) && target.property.get("type") == RoleType.Player) {
                this._interrupt = true;
            }
        }



        protected onEnter(): boolean {
            if (this._model.selectTargetType == this._targetType) {
                this._locomotor.owner.on("hurt", this, this.interrupt);
                return true;
            }
            return false;
        }
        private _count = 0
        protected onUpdate(): BehaviorStatus {
            if (this._combat.isCooldown()) return BehaviorStatus.Running;
            if (this._model.selectTargetType != this._targetType || this._interrupt) return BehaviorStatus.Failure;
            if (!this._combat.isValidTarget()) {

                let target = this.getTarget();
                if (!target && this._model.selectTargetId != -1) {
                    if (!this._locomotor.running()) {
                        let targetPos = XuanHuoModel.instance.selectTargetPos;
                        if (!targetPos) return BehaviorStatus.Failure;
                        let pos = new Point(...targetPos);
                        let node = MapUtils.nearbyPathNode(pos);
                        if (node[0] == -1) return BehaviorStatus.Failure;
                        pos = node[1];
                        if (!this._locomotor.running()) {
                            this._sprite.playAnim([AvatarAniBigType.clothes], ActionType.DAIJI, true, true);
                            this._locomotor.moveToCoordinate(pos);
                        }
                        return BehaviorStatus.Running;
                    }
                }
                if (!this._combat.testTarget(target)) {
                    WindowManager.instance.close(WindowEnum.HEALTH_POINT_PANEL);
                    return BehaviorStatus.Success;
                }
                this._combat.setTarget(target);
            } else {
                //检查旧目标是否还在半径内，重新找的目标一定是在半径内，但是旧目标则不一定
                let pos = this._transform.localPosition;
                let targetPos = this._combat.target.property.get("transform").localPosition;
                //测试是否在追杀半径内
                if (!MapUtils.testDistance(pos.x, pos.y, targetPos.x, targetPos.y, this._radius)) {
                    //超过半径重新找目标
                    let target = this.getTarget();
                    //找不到目标则失败
                    if (!this._combat.testTarget(target)) {
                        WindowManager.instance.close(WindowEnum.HEALTH_POINT_PANEL);
                        return BehaviorStatus.Success;
                    }
                    this._combat.setTarget(target);
                }
            }
            if (!this._combat.isValidRange()) {
                if (!this._locomotor.running()) {
                    let targetPos = this._combat.target.property.get("transform").localPosition;
                    let actorPos = new Point(this._transform.localPosition.x,this._transform.localPosition.y);
                    let desPos = new Point(targetPos.x,targetPos.y);
                    if (modules.scene.SceneModel.instance.isDirectCurrectScene) {
                        game.misc.DirectionUtils.directionCorrect(actorPos,desPos,30,(pos:Point)=>{//主角和怪物和一个水平线夹角大于30，增加一个转向点
                            desPos = pos;
                        });
                    }
                    this._locomotor.moveTo(desPos.x, desPos.y);
                    let avatar = this._locomotor.property.get("avatar");
                    avatar.playAnim([AvatarAniBigType.clothes], avatar.haveImmortals ? ActionType.DAIJI : ActionType.PAO, true, true);
                }
            } else {
                this._locomotor.stop();
                this._combat.combat(this._skill.selectSkill());
            }
            return BehaviorStatus.Running;
        }

        protected onExit(): void {
            this._locomotor.stop();
            this._combat.setTarget(null);
            this._locomotor.owner.off("hurt", this, this.interrupt);
            this._interrupt = false;
            // WindowManager.instance.close(WindowEnum.HEALTH_POINT_PANEL);
        }

        private getTarget(): Role {
            switch (this._model.selectTargetType) {
                case SelectTargetType.Monster: {
                    let pos = this._transform.localPosition;
                    if (this._model.selectTargetId != -1) {
                        return GameCenter.instance.findNearbyRole(pos.x, pos.y, this._radius, RoleType.Monster, this._model.selectTargetId);
                    } else {
                        return GameCenter.instance.findNearbyRole(pos.x, pos.y, this._radius, RoleType.Monster);
                    }
                }
                case SelectTargetType.Player: {
                    if (this._model.selectTargetId != -1) {
                        return GameCenter.instance.getRole(this._model.selectTargetId);
                    } else {
                        let pos = this._transform.localPosition;
                        return GameCenter.instance.findNearbyRole(pos.x, pos.y, this._radius, RoleType.Player, 0, this._model.actorId);
                    }
                }
            }
            return null;
        }
    }
}