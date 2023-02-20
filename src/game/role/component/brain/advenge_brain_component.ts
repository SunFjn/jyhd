// ///<reference path="action/chase_and_attack.ts"/>
// ///<reference path="action/revenge.ts"/>
// ///<reference path="action/patrol.ts"/>
//
// namespace game.role.component.brain {
//     import BehaviorTree = game.ai.behavior.BehaviorTree;
//     import SelectorMonitor = game.ai.behavior.composite.SelectorMonitor;
//     import Interrupt = game.ai.behavior.condition.Interrupt;
//     import DeathAction = game.role.component.brain.behavior.DeathAction;
//     import AbnormalAction = game.role.component.brain.behavior.AbnormalAction;
//     import EventNode = game.ai.behavior.decorator.EventNode;
//     import ChaseAndAttack = game.role.component.brain.action.ChaseAndAttack;
//     import RestAction = game.role.component.brain.behavior.RestAction;
//
//     const enum BattleBrainPriority {
//         Death,
//         Transmit,
//         Abnormal,
//         TargetChange,
//     }
//
//     export class AdvengeBrainComponent extends RoleComponent {
//         private _tree: BehaviorTree;
//         private _interrupt: Interrupt;
//
//         constructor(owner: Role) {
//             super(owner);
//
//             this._interrupt = new Interrupt();
//
//             this._tree = BehaviorTree.create(
//                 new SelectorMonitor(this._interrupt).addChild(
//                     new EventNode(new DeathAction(owner), this._interrupt, BattleBrainPriority.Death)
//                 ).addChild(
//                     new EventNode(new AbnormalAction(owner), this._interrupt, BattleBrainPriority.Abnormal)
//                 ).addChild(
//                     new ChaseAndAttack(owner, 1000, SelectTargetType.Player)
//                 ).addChild(
//                     new RestAction(owner, 500, true)
//                 )
//             );
//         }
//
//         public setup(): void {
//             this.property
//                 .on("status", this, this.interrupt)
//                 .on("actorState", this, this.updateAbnormal);
//             this.owner.on("transmit", this, this.transmit);
//             this.owner.getComponent(LocomotorComponent).enableSprint = false;
//             GlobalData.dispatcher.on(CommonEventType.PLAYER_TARGET_CHANGE, this, this.onTargetChange);
//         }
//
//         public teardown(): void {
//             this.property
//                 .off("status", this, this.interrupt)
//                 .off("actorState", this, this.updateAbnormal);
//             this.owner.off("transmit", this, this.transmit);
//             this.owner.getComponent(LocomotorComponent).enableSprint = true;
//             GlobalData.dispatcher.off(CommonEventType.PLAYER_TARGET_CHANGE, this, this.onTargetChange);
//         }
//
//         public destory(): void {
//
//         }
//
//         public update(): void {
//             this._tree.run();
//         }
//
//         private transmit(x: number, y: number): void {
//             this.property.set("spawnpoint", -1);
//             this.owner.publish("setCoordinate", x, y);
//             GameCenter.instance.world.publish("follow", this.owner.getComponent(LocomotorComponent));
//             this._interrupt.trigger(BattleBrainPriority.Transmit);
//         }
//
//         private interrupt(status: number): void {
//             if (status == RoleState.DEATH) {
//                 PlayerModel.instance.selectTarget(SelectTargetType.Dummy, -1);
//             }
//
//             if (status == RoleState.DEATH || status == RoleState.REVIVE) {
//                 this._interrupt.trigger(BattleBrainPriority.Death);
//             }
//         }
//
//         private onTargetChange(): void {
//             this._interrupt.trigger(BattleBrainPriority.TargetChange);
//         }
//
//         private updateAbnormal(state: number): void {
//             if (state & ActorState.dizz) {
//                 this._interrupt.trigger(BattleBrainPriority.Abnormal);
//             }
//             if (state & ActorState.silent) {
//                 this.owner.getComponent(SkillComponent).onlyCommon = true;
//             } else {
//                 this.owner.getComponent(SkillComponent).onlyCommon = false;
//             }
//             this.owner.publish("abnormal", state);
//         }
//     }
// }