///<reference path="exterior/pet_avatar_component.ts"/>
///<reference path="brain/player_pet_brain_component.ts"/>

namespace game.role.component {
    import skillFields = Configuration.skillFields;
    import PetAvatarComponent = game.role.component.exterior.PetAvatarComponent;
    import PetBrainComponent = game.role.component.brain.PetBrainComponent;
    import PlayerPetBrainComponent = game.role.component.brain.PlayerPetBrainComponent;
    import sceneFields = Configuration.sceneFields;

    export class PetProxyComponent extends RoleComponent {
        private _pet: Role;

        constructor(owner: Role) {
            super(owner);

        }

        public setup(): void {
            let context = this.property;
            let pet = context.get("pet");
            if (pet != null && pet[0] != 0) {
                this.updateExterior();
            } else {
                context.once("pet", this, this.updateExterior);
            }
            this.property.on("name", this, this.updateName);
            this.owner.on("transmit", this, this.transmit);
            this.property.on("speed", this, this.updateSpeed);
        }

        public teardown(): void {
            this.property.off("pet", this, this.updateExterior);
            this.property.off("name", this, this.updateName);
            this.owner.off("transmit", this, this.transmit);
            this.property.off("speed", this, this.updateSpeed);
        }

        public destory(): void {
            if (this._pet != null) {
                this._pet.destory();
            }
            this._pet = null;
        }

        public update(): void {
            if (this._pet != null) {
                this._pet.update();
            }
        }

        private updateName(): void {
            if (this._pet) {
                this._pet.property.set("name", `${this.property.get("name")}的宠物`);
            }
        }

        private updateSpeed(): void {
            if (this._pet) {
                this._pet.property.set("speed", this.property.get("speed"));
            }
        }

        private updateExterior(): void {
            if (this._pet != null) {
                return;
            }

            let context = this.property;
            let pet = context.get("pet");
            if (pet == null || pet[0] == 0) {
                return;
            }
            // console.log("切换宠物..................");

            let result = new Role(this.owner.id);
            let property = result.property;
            property.set("name", `${context.get("name")}的宠物`);
            property.set("direction", Math.random() * 360);
            property.set("speed", context.get("speed"));
            property.set("type", context.get("type"));
            property.set("isPet", true);

            if (context.get("type") == RoleType.Master) {
                let cfg = modules.config.SceneCfg.instance.getCfgById(MapUtils.currentID);
                result.addComponent(PetAvatarComponent, this.owner, LayerType.Player); // 外观

                // 2D: 横版2D代码片段,加载2D龙骨资源!
                result.addComponent(PetSKComponent, true); // 龙骨外观

                result.addComponent(TitleComponent, 1); // 名字
                result.addComponent(LocomotorComponent, false, cfg[sceneFields.sprintType] != 0, 600, 600); // 行动
                result.addComponent(SkillComponent, [], function (value: Configuration.skill): boolean {
                    return (value[skillFields.skillType] == 0 ||
                        value[skillFields.skillType] == 1) && value[skillFields.petSkill] == 1;
                });// 技能
                result.addComponent(CombatComponent); // 战斗
                result.addComponent(PetBrainComponent, this.owner); // 智能2
                result.addComponent(BubbleComponent); // 气泡
            } else {
                result.addComponent(PetAvatarComponent, this.owner, LayerType.Player); // 外观

                // 2D: 横版2D代码片段,加载2D龙骨资源!
                result.addComponent(PetSKComponent, false); // 龙骨外观

                result.addComponent(TitleComponent, 1); // 名字
                result.addComponent(LocomotorComponent, false); // 行动
                result.addComponent(CombatComponent); // 战斗
                result.addComponent(PlayerPetBrainComponent, this.owner); // 智能
            }

            // 玩家拿到对自己宠物的龙骨组件的引用
            context.set("petSK", result.property.get("avatarSK"));
            result.on("useSkill", this, this.useSkill);
            this._pet = result;
            this.owner.property.set("petContext", result);
            this._pet.enter();
            let pos = context.get("pos");
            this._pet.publish("setCoordinate", pos.x, pos.y);

        }

        private useSkill(id: number, skill: number): void {
            this.owner.publish("useSkill", id, skill, true);
        }

        private transmit(x: number, y: number): void {
            this._pet.publish("setCoordinate", x, y);
        }
    }
}
