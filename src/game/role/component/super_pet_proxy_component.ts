///<reference path="exterior/super_pet_avatar_component.ts"/>
///<reference path="brain/super_pet_brain_component.ts"/>

namespace game.role.component {
    import XianfuModel = modules.xianfu.XianfuModel;
    import UpdateSpiritAnimalTravelFields = Protocols.UpdateSpiritAnimalTravelFields;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import SuperPetAvatarComponent = game.role.component.exterior.SuperPetAvatarComponent;
    import SuperPetBrainComponent = game.role.component.brain.SuperPetBrainComponent;
    import MapUtils = game.map.MapUtils;

    export class SuperPetProxyComponent extends RoleComponent {
        private _pets: Table<Role>;

        constructor(owner: Role) {
            super(owner);
            this._pets = {};
        }

        public setup(): void {
            this.updateSuperPet();
            GlobalData.dispatcher.on(CommonEventType.XIANFU_AREA_UPTATE, this, this.updateSuperPet);
            GlobalData.dispatcher.on(CommonEventType.XIANFU_PET_UPDATE, this, this.updateSuperPet);
        }

        public teardown(): void {
            GlobalData.dispatcher.off(CommonEventType.XIANFU_AREA_UPTATE, this, this.updateSuperPet);
            GlobalData.dispatcher.off(CommonEventType.XIANFU_PET_UPDATE, this, this.updateSuperPet);
        }

        public destory(): void {
            for (let occ in this._pets) {
                this._pets[occ].destory();
            }
            this._pets = null;
        }

        public update(): void {
            for (let occ in this._pets) {
                this._pets[occ].update();
            }
        }

        private updateSuperPet(): void {
            if (XianfuModel.instance.panelType != 2) {
                for (let occ in this._pets) {
                    this._pets[occ].destory();
                }
                this._pets = {};
                return;
            }

            let infos = XianfuModel.instance.getAllPetInfos();
            for (let key in infos) {
                let tuple = infos[key];
                let occ = tuple[UpdateSpiritAnimalTravelFields.id];
                let role = this._pets[occ];
                let state = tuple[UpdateSpiritAnimalTravelFields.state];
                if (role == null) {
                    if (state == 0) {
                        role = new Role(this.owner.id);
                        role.addComponent(SuperPetAvatarComponent, LayerType.Npc);
                        role.addComponent(TitleComponent, 1);
                        role.addComponent(LocomotorComponent, false);
                        role.addComponent(SuperPetBrainComponent);


                        let property = role.property;
                        let info = ExteriorSKCfg.instance.getCfgById(occ);
                        console.log('研发测试_chy:ExteriorSKCfg.instance.getCfgById(occ);', occ, info);
                        // property.set("name", info[ExteriorSKFields.name]);
                        // property.set("direction", Math.random() * 360);
                        // property.set("speed", 100);
                        // property.set("occ", occ);
                        // property.set("status", RoleState.IDLE);
                        // let i = ArrayUtils.random(MapUtils.findNodePath(51), 0);
                        // let pos = MapUtils.getPathNode(i);
                        // property.set("spawnpoint", i);
                        // property.set("pos", pos);
                        // this._pets[occ] = role;
                        // role.enter();
                        // role.publish("setCoordinate", pos.x, pos.y);
                    }
                } else {
                    if (state == 1) {
                        role.destory();
                        delete this._pets[occ];
                    } else if (state == 2) {
                        role.destory();
                        delete this._pets[occ];
                    }
                }
            }
        }
    }
}