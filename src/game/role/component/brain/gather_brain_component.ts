///<reference path="behavior/npc_trigger_action.ts"/>
///<reference path="../../../ai/behavior/behavior_decorator.ts"/>
///<reference path="action/goto_spawnpoint.ts"/>


namespace game.role.component.brain {
    import BehaviorTree = game.ai.behavior.BehaviorTree;
    import SelectorMonitor = game.ai.behavior.composite.SelectorMonitor;
    import Interrupt = game.ai.behavior.condition.Interrupt;
    import DeathAction = game.role.component.brain.behavior.DeathAction;
    import AbnormalAction = game.role.component.brain.behavior.AbnormalAction;
    import NpcTriggerAction = game.role.component.brain.behavior.NpcTriggerAction;
    import EventNode = game.ai.behavior.decorator.EventNode;
    import Revenge = game.role.component.brain.action.Revenge;

    const enum GatherBrainPriority {
        Death,
        Transmit,
        Abnormal,
        TargetChange,
    }

    export class GatherBrainComponent extends RoleComponent {
        private _tree: BehaviorTree;
        private _interrupt: Interrupt;

        constructor(owner: Role) {
            super(owner);
            this._interrupt = new Interrupt();

            this._tree = BehaviorTree.create(
                new SelectorMonitor(this._interrupt).addChild(
                    new EventNode(new DeathAction(owner), this._interrupt, GatherBrainPriority.Death)
                ).addChild(
                    new EventNode(new AbnormalAction(owner), this._interrupt, GatherBrainPriority.Abnormal)
                ).addChild(
                    new EventNode(new NpcTriggerAction(owner, true), this._interrupt, GatherBrainPriority.TargetChange)
                ).addChild(
                    new Revenge(owner)
                )
            );

            // this._tree = BehaviorTree.create(
            //     new SelectorMonitor(this._interrupt).addChild(
            //         new EventNode(new DeathAction(owner), this._interrupt, GardenBrainPriority.Death)
            //     ).addChild(
            //         new EventNode(new AbnormalAction(owner), this._interrupt, GardenBrainPriority.Abnormal)
            //     ).addChild(
            //         new EventNode(new NpcTriggerAction(owner), this._interrupt, GardenBrainPriority.TargetChange)
            //     ).addChild(
            //         new Sequence()
            //             .addChild(
            //                 new GotoSpawnpoint(owner, (): number => {
            //                     if (PlayerModel.instance.selectTargetType != SelectTargetType.Monster) {
            //                         return -1;
            //                     }
            //                     return XianfuModel.instance.areaId();
            //                 })
            //             ).addChild(
            //             new ChaseAndAttack(owner, 1000, SelectTargetType.Monster)
            //         )
            //     ).addChild(
            //         new Revenge(owner)
            //     )
            // );
        }

        public setup(): void {
            this.property
                .on("status", this, this.interrupt)
                .on("actorState", this, this.updateAbnormal);
            this.owner.on("transmit", this, this.transmit);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_TARGET_CHANGE, this, this.onTargetChange);
        }

        public teardown(): void {
            this.property
                .off("status", this, this.interrupt)
                .off("actorState", this, this.updateAbnormal);
            this.owner.off("transmit", this, this.transmit);
            GlobalData.dispatcher.off(CommonEventType.PLAYER_TARGET_CHANGE, this, this.onTargetChange);
        }

        public destory(): void {

        }

        public update(): void {
            this._tree.run();
        }

        private transmit(x: number, y: number): void {
            this.property.set("spawnpoint", -1);
            this.owner.publish("setCoordinate", x, y);
            // GameCenter.instance.world.publish("follow", this.property.get("transform"));
            GameCenter.instance.world.publish("follow", this.owner.getComponent(LocomotorComponent));
            this._interrupt.trigger(GatherBrainPriority.Transmit);
        }

        private interrupt(status: number): void {
            if (status == RoleState.DEATH) {
                this._interrupt.trigger(GatherBrainPriority.Death);
            }
        }

        private onTargetChange(): void {
            this._interrupt.trigger(GatherBrainPriority.TargetChange);
        }

        private updateAbnormal(state: number): void {
            if (state & ActorState.dizz) {
                this._interrupt.trigger(GatherBrainPriority.Abnormal);
            }
            if (state & ActorState.silent) {
                this.owner.getComponent(SkillComponent).onlyCommon = true;
            } else {
                this.owner.getComponent(SkillComponent).onlyCommon = false;
            }
            this.owner.publish("abnormal", state);
        }
    }
}