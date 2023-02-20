///<reference path="exterior/doll_avatar_component.ts"/>
///<reference path="brain/player_doll_brain_component.ts"/>

namespace game.role.component {
    import skillFields = Configuration.skillFields;
    import DollAvatarComponent = game.role.component.exterior.DollAvatarComponent;
    import DollBrainComponent = game.role.component.brain.DollBrainComponent;
    import PlayerDollBrainComponent = game.role.component.brain.PlayerDollBrainComponent;

    export class DollProxyComponent extends RoleComponent {
        private _doll: Role;

        constructor(owner: Role) {
            super(owner);

        }

        public setup(): void {
            let context = this.property;
            let doll = context.get("doll");
            if (doll != null && doll[0] != 0) {
                this.updateExterior();
            } else {
                context.once("doll", this, this.updateExterior);
            }
            this.property.on("name", this, this.updateName);
        }

        public teardown(): void {
            this.property.off("doll", this, this.updateExterior);
            this.property.off("name", this, this.updateName);
        }

        public destory(): void {
            if (this._doll != null) {
                this._doll.destory();
            }
            this._doll = null;
        }

        public update(): void {
            if (this._doll != null) {
                this._doll.update();
            }
        }


        private updateName(): void {
            if (this._doll) {
                this._doll.property.set("name", `${this.property.get("name")}的仙娃`);
            }
        }

        private updateExterior(): void {
            if (this._doll != null) {
                return;
            }

            let context = this.property;
            let doll = context.get("doll");
            if (doll == null || doll[0] == 0) {
                return;
            }

            let result = new Role(this.owner.id);
            if (context.get("type") == RoleType.Master) {
                result.addComponent(DollAvatarComponent, this.owner, LayerType.Player); // 外观
                result.addComponent(TitleComponent, 1); // 名字
                result.addComponent(LocomotorComponent, false); // 行动
                result.addComponent(SkillComponent, [], function (value: Configuration.skill): boolean {
                    return (
                        value[skillFields.skillType] == 0 ||
                        value[skillFields.skillType] == 1) && value[skillFields.petSkill] == 2;
                });// 技能
                result.addComponent(CombatComponent); // 战斗
                result.addComponent(DollBrainComponent, this.owner); // 智能2
                result.addComponent(BubbleComponent); // 气泡
            } else {
                result.addComponent(DollAvatarComponent, this.owner, LayerType.Player); // 外观
                result.addComponent(TitleComponent, 1); // 名字
                result.addComponent(LocomotorComponent, false); // 行动
                result.addComponent(CombatComponent); // 战斗
                result.addComponent(PlayerDollBrainComponent, this.owner); // 智能
            }

            let property = result.property;
            property.set("name", `${context.get("name")}的仙娃`);
            property.set("direction", Math.random() * 360);
            property.set("speed", context.get("speed") * 1.2);
            property.set("type", context.get("type"));

            result.on("useSkill", this, this.useSkill);
            this._doll = result;
            this.owner.property.set("dollContext", result);
            this._doll.enter();
            let pos = context.get("pos");
            this._doll.publish("setCoordinate", pos.x, pos.y);

        }

        private useSkill(id: number, skill: number): void {
            this.owner.publish("useSkill", id, skill, true);
        }
    }
}
