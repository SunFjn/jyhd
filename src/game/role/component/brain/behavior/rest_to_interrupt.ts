// namespace game.role.component.brain.behavior {
//     import Action = game.ai.behavior.Action;
//     import BehaviorStatus = game.ai.behavior.BehaviorStatus;
//     import Transform3D = Laya.Transform3D;
//
//     export class RestToInterrupt extends Action {
//         private readonly _locomotor: LocomotorComponent;
//         private readonly _combat: CombatComponent;
//         private readonly _skill: SkillComponent;
//         private readonly _transform: Transform3D;
//         private readonly _sprite: RoleAvatar;
//         private readonly _model: PlayerModel;
//
//         constructor(owner: Role) {
//             super("RestToInterrupt");
//             this._combat = owner.getComponent(CombatComponent);
//             this._locomotor = owner.getComponent(LocomotorComponent);
//             this._skill = owner.getComponent(SkillComponent);
//             this._transform = owner.property.get("transform");
//
//             this._model = PlayerModel.instance;
//             this._sprite = owner.property.get("avatar");
//             this._model = PlayerModel.instance;
//         }
//
//         protected onEnter(): boolean {
//             if (this._model.selectTargetType == SelectTargetType.Dummy) {
//                 let owner = this._combat.owner;
//                 owner.on("hurt", this, this.setTarget);
//                 this._sprite.getActionTween(ActionType.DAIJI).repeat(Number.POSITIVE_INFINITY).start();
//                 this.setTarget(owner.property.get("lastEnemy") || 0, 0, 0, 0);
//                 return true;
//             }
//             return false;
//         }
//
//         protected onUpdate(): BehaviorStatus {
//             if (this._combat.isCooldown()) {
//                 return BehaviorStatus.Running;
//             }
//
//             if (this._model.selectTargetType != SelectTargetType.Dummy) {
//                 return BehaviorStatus.Failure;
//             }
//
//             if (!this._combat.isValidTarget()) {
//                 this._sprite.getActionTween(ActionType.DAIJI).repeat(Number.POSITIVE_INFINITY).start();
//             } else {
//                 this.tryCombat();
//             }
//
//             return BehaviorStatus.Success;
//         }
//
//         protected onExit(): void {
//             this._combat.owner.off("hurt", this, this.setTarget);
//             this._locomotor.stop();
//             this._combat.setTarget(null);
//         }
//
//         private setTarget(id: number, skill: uint, damage: uint, flags: TipsFlags): void {
//             if (this._combat.isValidTarget()) {
//                 return;
//             }
//
//             let target = GameCenter.instance.getRole(id);
//             if (target != null) {
//                 this._combat.setTarget(target);
//             } else {
//                 this._combat.setTarget(null);
//             }
//         }
//
//         private tryCombat(): void {
//             if (!this._combat.isValidRange()) {
//                 if (!this._locomotor.running()) {
//                     let targetPos = this._combat.target.property.get("transform").localPosition;
//                     this._sprite.getActionTween(this._sprite.immortals == 0 ? ActionType.PAO : ActionType.DAIJI).repeat(Number.POSITIVE_INFINITY).start();
//                     this._locomotor.moveTo(targetPos.x, targetPos.y);
//                 }
//             } else {
//                 this._locomotor.stop();
//                 this._combat.combat(this._skill.selectSkill());
//             }
//         }
//     }
// }