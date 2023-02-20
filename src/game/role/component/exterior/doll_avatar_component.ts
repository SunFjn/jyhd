namespace game.role.component.exterior {


    export class DollAvatarComponent extends RoleComponent {
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
            this._master.property.on("doll", this, this.updateExterior);
            this._master.on("visible", this, this.visible);

            // GameCenter.instance.world.publish("addToLayer", this._layer, this._sprite);
            GameCenter.instance.world.publish("castShadow2D", true, ShadowScale.DallAvatarScale,this.property);
        }

        public teardown(): void {
            this._sprite.removeSelf();
            this._master.property.off("doll", this, this.updateExterior);
            this._master.off("visible", this, this.visible);
            GameCenter.instance.world.publish("castShadow2D", false, ShadowScale.DallAvatarScale,this.property);
        }

        public destory(): void {
            this._sprite.destroy();
        }

        private updateExterior(): void {
            let exterior = this._master.property.get("doll");
            this._sprite.clothes = exterior[0];
            //this._sprite.aura = exterior[1];
        }

        private visible(value: boolean): void {
            if (this._sprite.active == value) {
                return;
            }

            this.owner.publish("visible", value);
            this._sprite.active = value;
            GameCenter.instance.world.publish("castShadow2D", value,ShadowScale.DallAvatarScale, this.property);
        }
    }
}