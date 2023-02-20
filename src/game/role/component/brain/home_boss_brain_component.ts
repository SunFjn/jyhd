///<reference path="behavior/player_chase_and_attack.ts"/>
///<reference path="behavior/boss_chase_and_attack.ts"/>
///<reference path="behavior/revenge_action.ts"/>
///<reference path="../../../ai/behavior/behavior_decorator.ts"/>
///<reference path="behavior/npc_trigger_action.ts"/>
///<reference path="action/chase_and_attack.ts"/>
///<reference path="action/revenge.ts"/>
///<reference path="action/patrol.ts"/>

namespace game.role.component.brain {
    import BehaviorTree = game.ai.behavior.BehaviorTree;
    import SelectorMonitor = game.ai.behavior.composite.SelectorMonitor;
    import Interrupt = game.ai.behavior.condition.Interrupt;
    import DeathAction = game.role.component.brain.behavior.DeathAction;
    import AbnormalAction = game.role.component.brain.behavior.AbnormalAction;
    import PlayerChaseAndAttack = game.role.component.brain.behavior.PlayerChaseAndAttack;
    import BossChaseAndAttack = game.role.component.brain.behavior.BossChaseAndAttack;
    import RevengeAction = game.role.component.brain.behavior.RevengeAction;
    import EventNode = game.ai.behavior.decorator.EventNode;
    import NpcTriggerAction = game.role.component.brain.behavior.NpcTriggerAction;
    import Pos = Protocols.Pos;


    const enum HomeBossBrainPriority {
        Death,
        Transmit,
        Abnormal,
        TargetChange,
    }

    export class HomeBossBrainComponent extends RoleComponent {
        private _tree: BehaviorTree;
        private _interrupt: Interrupt;

        constructor(owner: Role, selectTargetPos: () => Pos, getBossOnwer: (occ: number) => number) {
            super(owner);

            this._interrupt = new Interrupt();

            this._tree = BehaviorTree.create(
                new SelectorMonitor(this._interrupt).addChild(
                    new EventNode(new DeathAction(owner), this._interrupt, HomeBossBrainPriority.Death)
                ).addChild(
                    new EventNode(new AbnormalAction(owner), this._interrupt, HomeBossBrainPriority.Abnormal)
                ).addChild(
                    new EventNode(new NpcTriggerAction(owner), this._interrupt, HomeBossBrainPriority.TargetChange)
                    // ).addChild(
                    //     new RestAction(owner, 3000, false)
                ).addChild(
                    new PlayerChaseAndAttack(owner, 1000)
                ).addChild(
                    new BossChaseAndAttack(owner, 600, selectTargetPos, getBossOnwer)
                ).addChild(
                    new RevengeAction(owner, 1000)
                )
            );
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
            this._interrupt.trigger(HomeBossBrainPriority.Transmit);
        }

        private interrupt(status: number): void {
            if (status == RoleState.DEATH || status == RoleState.REVIVE) {
                this._interrupt.trigger(HomeBossBrainPriority.Death);
            }
        }

        private onTargetChange(): void {
            this._interrupt.trigger(HomeBossBrainPriority.TargetChange);
        }

        private updateAbnormal(state: number): void {
            if (state & ActorState.dizz) {
                this._interrupt.trigger(HomeBossBrainPriority.Abnormal);
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