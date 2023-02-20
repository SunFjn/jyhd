namespace game.role.component.exterior {

    export class PetAvatarComponent extends RoleComponent {
        private readonly _sprite: RoleAvatar;
        private readonly _layer: LayerType;
        private readonly _master: Role;

        constructor(owner: Role, master: Role, layer: LayerType) {
            super(owner);
            this._sprite = new RoleAvatar();
            this.property.set("avatar", this._sprite);
            this.property.set("transform", this._sprite.transform);
            this._master = master;
            this._layer = layer;
        }

        public setup(): void {
            this._sprite.reset("");
            this.updateExterior();
            this._master.property.on("pet", this, this.updateExterior);
            this._master.on("visible", this, this.visible);

            // GameCenter.instance.world.publish("addToLayer", this._layer, this._sprite);
            GameCenter.instance.world.publish("castShadow2D", true, ShadowScale.PetScale, this.property);
        }

        public teardown(): void {
            this._sprite.removeSelf();
            this._master.property.off("pet", this, this.updateExterior);
            this._master.off("visible", this, this.visible);
            GameCenter.instance.world.publish("castShadow2D", false, ShadowScale.PetScale, this.property);
        }

        public destory(): void {
            this._sprite.destroy();
        }

        private updateExterior(): void {
            let exterior = this._master.property.get("pet");

            // 2D: 横版2D代码片段,加载2D龙骨资源!
            if (this.property.get("avatarSK")) {
                this._sprite._avaterSK = this.property.get("avatarSK");
                this._sprite._avaterSK.reset(exterior[0], 0, 0, 0, 0, 0, 0, 0);
            } else {
                console.log("宠物上没有龙骨动画节点：", exterior[0]);
            }

            // 3D: 横版3D注释代码片段-使用3D时放开且关闭2D代码即可!
            // this._sprite.clothes = exterior[0];
            // 法阵用3D的
            this._sprite.aura = exterior[1];
        }

        private visible(value: boolean): void {
            if (this._sprite.active == value) {
                return;
            }

            this.owner.publish("visible", value);
            this._sprite.active = value;
            GameCenter.instance.world.publish("castShadow2D", value, ShadowScale.PetScale, this.property);
        }
    }
}