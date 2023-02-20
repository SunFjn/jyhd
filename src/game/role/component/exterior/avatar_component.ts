///<reference path="../../role.ts"/>

namespace game.role.component.exterior {

    export class AvatarComponent extends RoleComponent {
        private static resetFlareValue(target: any, endValue: any): void {
            endValue.colorOffset = 0.5;
            target.colorOffset = 0;
        }

        private readonly _sprite: RoleAvatar;
        private readonly _layer: LayerType;
        private readonly _flareTween: TweenJS;
        private _sprint: boolean;

        constructor(owner: Role, layer: LayerType) {
            super(owner);
            this._sprite = new RoleAvatar(owner);
            this._sprite.fighting = true;
            this.property.set("avatar", this._sprite);
            this.property.set("transform", this._sprite.transform);

            this._layer = layer;

            this._flareTween = TweenJS
                .create(this._sprite)
                .to({ colorOffset: 0.5 }, 75)
                .yoyo(true)
                .repeat(1)
                .onComplete(AvatarComponent.resetFlareValue)
                .onStop(AvatarComponent.resetFlareValue);

            this._sprint = false;
        }

        public setup(): void {
            this._sprite.reset("");
            this.updateExterior();
            this._sprint = false;

            this.property.on("exterior", this, this.updateExterior);
            this.owner
                .on("visible", this, this.visible)
                .on("flare", this, this.flare)
                .on("sprint", this, this.sprint)

            GameCenter.instance.world.publish("castShadow2D", true, ShadowScale.AvatarScale, this.property);
            GameCenter.instance.world.on("updateSet", this, this.updateSet);
            this._sprite.fighting = true;
        }

        /**
         * 设置龙骨资源隐藏 如果是玩家则还需要处理其附属物品（宠物，仙娃啥的）
         */
        private setSkeletonVisible(active: boolean) {
            if (!this._sprite._avaterSK) {
                console.log("无龙骨组件资源,无法设置visible属性!", this.owner, active);
                return;
            }
            // 龙骨组件隐藏
            this._sprite._avaterSK.active = active;

            // 如果是玩家则则处理其附属物品visible
            let type = this.property.get("type");
            if (type == RoleType.Master || type == RoleType.Player) {
                let petSk = this.property.get("petSK");
                if (petSk) {
                    petSk.active = active;
                }
            }
        }

        public teardown(): void {
            this.sprint(false);
            this._sprite.removeSelf();
            this.property.off("exterior", this, this.updateExterior);
            this.owner
                .off("visible", this, this.visible)
                .off("flare", this, this.flare)
                .off("sprint", this, this.sprint)
            this._flareTween.stop();
            GameCenter.instance.world.off("updateSet", this, this.updateSet);
            GameCenter.instance.world.publish("castShadow2D", false, ShadowScale.AvatarScale, this.property);
        }

        public destory(): void {
            this._sprite.destroy(true);
        }

        private flare(): void {
            this._flareTween.start();
        }

        private sprint(value: boolean): void {
            if (this._sprint == value) {
                return;
            }
            this._sprint = value;
        }

        private visible(value: boolean): void {
            this.setSkeletonVisible(value);

            if (this._sprite.active == value) {
                return;
            }

            this._sprite.active = value;
            GameCenter.instance.world.publish("castShadow2D", value, ShadowScale.AvatarScale, this.property);
        }

        private updateExterior(): void {
            let ext = this.property.get("exterior");

            if (this.property.get("type") == RoleType.Master) {
                console.log("Master 外观：", "衣服：", ext[0], "幻武：", ext[1], "翅膀：", ext[2], "精灵：", ext[3], "法阵：", ext[4], "鬼神之力：", ext[5], "光环：", ext[6]);
            }
            let filterExt = modules.rename.SetCtrl.instance.filterRoleExterior(ext.slice(0, ext.length), this.property.get("type") as RoleType);
            if (this._sprite._avaterSK) {
                //console.log("filterExt = ",filterExt,ext,this.property.get("type"));
                this._sprite._avaterSK.reset(filterExt[0], filterExt[1], filterExt[2], filterExt[3], 0, filterExt[5], 0, filterExt[6]);
            }
        }

        private updateSet() {
            this.updateExterior();
            GameCenter.instance.world.publish("castShadow2D", modules.rename.SetCtrl.instance.isHideSelfGuangHuan, ShadowScale.AvatarScale, this.property);
        }
    }
}
