namespace game.role.component.exterior {
    export class SuperPetAvatarComponent extends RoleComponent {
        private readonly _sprite: RoleAvatar;
        private readonly _layer: LayerType;

        constructor(owner: Role, layer: LayerType) {
            super(owner);
            this._sprite = new RoleAvatar();
            this.property.set("avatar", this._sprite);
            this.property.set("transform", this._sprite.transform);
            this._layer = layer;
        }

        public setup(): void {
            this._sprite.reset("");
            this.updateExterior();

            GameCenter.instance.world.publish("castShadow2D", true, ShadowScale.SuperPetScale,this.property);
        }

        public teardown(): void {
            this._sprite.removeSelf();
            GameCenter.instance.world.publish("castShadow2D", false, ShadowScale.SuperPetScale,this.property);
        }

        public destory(): void {
            this._sprite.destroy();
        }

        private updateExterior(): void {
            let occ = this.property.get("occ");
            // this._sprite.clothes = occ;
        }
    }
}