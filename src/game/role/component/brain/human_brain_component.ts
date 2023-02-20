///<reference path="../../../ai/behavior/behavior_condition.ts"/>
///<reference path="../../../ai/behavior/behavior_composite.ts"/>
///<reference path="../../../ai/behavior/behavior_action.ts"/>
///<reference path="../../../ai/behavior/behavior_decorator.ts"/>

///<reference path="behavior/death_action.ts"/>
///<reference path="behavior/abnormal_action.ts"/>
///<reference path="behavior/rest_action.ts"/>
///<reference path="behavior/move_to_boss.ts"/>
///<reference path="behavior/move_to_boss_DNF.ts"/>
///<reference path="behavior/chase_and_attack.ts"/>
///<reference path="behavior/rocker_move.ts"/>
///<reference path="behavior/move_to_spawnpoint.ts"/>
///<reference path="action/rest.ts"/>


namespace game.role.component.brain {
    import sceneFields = Configuration.sceneFields;
    import BehaviorTree = game.ai.behavior.BehaviorTree;
    import SelectorMonitor = game.ai.behavior.composite.SelectorMonitor;
    import Interrupt = game.ai.behavior.condition.Interrupt;
    import MapUtils = game.map.MapUtils;
    import SceneCfg = modules.config.SceneCfg;
    import DeathAction = game.role.component.brain.behavior.DeathAction;
    import AbnormalAction = game.role.component.brain.behavior.AbnormalAction;
    import MoveToBoss = game.role.component.brain.behavior.MoveToBoss;
    import MoveToBossDnf = game.role.component.brain.behavior.MoveToBossDnf;
    import ChaseAndAttack = game.role.component.brain.behavior.ChaseAndAttack;
    import RockerMove = game.role.component.brain.behavior.RockerMove;
    import MoveToSpawnpoint = game.role.component.brain.behavior.MoveToSpawnpoint;
    import EventNode = game.ai.behavior.decorator.EventNode;
    import Rest = game.role.component.brain.behavior.Rest;

    const enum HumanBrainPriority {
        Death,
        Transmit,
        Abnormal,
        PosUpdate,
        TargetChange,
    }

    export class HumanBrainComponent extends RoleComponent {
        private _tree: BehaviorTree;
        private _interrupt: Interrupt;

        constructor(owner: Role) {
            super(owner);

            this._interrupt = new Interrupt();

            let cfg = SceneCfg.instance.getCfgById(MapUtils.currentID);

            this._tree = BehaviorTree.create(
                new SelectorMonitor(this._interrupt).addChild(
                    new EventNode(new DeathAction(owner), this._interrupt, HumanBrainPriority.Death)
                ).addChild(
                    new EventNode(new AbnormalAction(owner), this._interrupt, HumanBrainPriority.Abnormal)
                ).addChild(
                    new Rest(owner),
                ).addChild(
                    new RockerMove(owner)
                ).addChild(
                    new MoveToBossDnf(owner, 500)
                ).addChild(
                    new ChaseAndAttack(owner, cfg[sceneFields.type] == SceneTypeEx.common ? 500 : Number.POSITIVE_INFINITY)
                ).addChild(
                    new MoveToSpawnpoint(owner, 200)
                )


            );
        }

        public setup(): void {
            this.property
                .on("status", this, this.interrupt)
                .on("actorState", this, this.updateAbnormal);
            this.owner.on("transmit", this, this.transmit);

            GlobalData.dispatcher.on(CommonEventType.MISSION_MOVE_POS_UPDATE, this, this.onPosUpdate);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_TARGET_CHANGE, this, this.onTargetChange);
        }

        public teardown(): void {
            this.property
                .off("status", this, this.interrupt)
                .off("actorState", this, this.updateAbnormal);
            this.owner.off("transmit", this, this.transmit);

            GlobalData.dispatcher.off(CommonEventType.MISSION_MOVE_POS_UPDATE, this, this.onPosUpdate);
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
            this._interrupt.trigger(HumanBrainPriority.Transmit);
        }

        private interrupt(status: number): void {
            if (status == RoleState.DEATH) {
                this._interrupt.trigger(HumanBrainPriority.Death);
            }
        }

        private onTargetChange(): void {
            this._interrupt.trigger(HumanBrainPriority.TargetChange);
        }

        private onPosUpdate(): void {
            this._interrupt.trigger(HumanBrainPriority.PosUpdate);
        }

        private updateAbnormal(state: number): void {
            if (state & ActorState.dizz) {
                this._interrupt.trigger(HumanBrainPriority.Abnormal);
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