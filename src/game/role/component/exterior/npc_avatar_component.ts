///<reference path="../../../../modules/config/npc_cfg.ts"/>

namespace game.role.component.exterior {
    import NpcCfg = modules.config.NpcCfg;
    import npcFields = Configuration.npcFields;
    export class NpcAvatarComponent extends RoleComponent {
        private readonly _sprite: RoleAvatar;
        private readonly _layer: LayerType;

        constructor(owner: Role, layer: LayerType) {
            super(owner);
            this._sprite = new RoleAvatar(owner);
            this.property.set("avatar", this._sprite);
            this.property.set("transform", this._sprite.transform);
            this._layer = layer;
        }

        public setup(): void {
            this._sprite.reset("");
            this.updateExterior();
            this.property.on("occ", this, this.updateExterior);
            // GameCenter.instance.world.publish("addToLayer", this._layer, this._sprite);
            let exterior = this.property.get("exterior");
            let scale = 1;
            let cfg = NpcCfg.instance.getCfgById(this.property.get("occ"))
            // 2D: 横版2D代码片段,加载2D龙骨资源!
            if (this._sprite._avaterSK) {
                scale = 1;

                // spine动画 不同显示处理

                let action = cfg[npcFields.action]
                !!action && this._sprite._avaterSK.setDefault(<ActionType>action)

                this._sprite._avaterSK.reset(exterior[0], 0, 0, 0, 0, 0, 0, 0);
                this._sprite.SKDirection = 1;
                // 设置缩放
                this._sprite._avaterSK.setScale(
                    [
                        [AvatarAniBigType.clothes, scale]
                    ]
                )
            }

            if (!cfg[npcFields.hide])
                GameCenter.instance.world.publish("castShadow2D", true, ShadowScale.NPCScale, this.property);
        }

        public teardown(): void {
            this._sprite.removeSelf();
            GameCenter.instance.world.publish("castShadow2D", false, ShadowScale.NPCScale, this.property);

        }

        public destory(): void {
            this._sprite.destroy();
        }

        private updateExterior(): void {
            // let tuple = NpcCfg.instance.getCfgById(this.property.get("occ"));
            // if (tuple == null) {
            //     throw new Error(`NPC类型${this.property.get("occ")}不存在！`);
            // }
            // this._sprite.clothes = tuple[npcFields.res];
            // this._sprite.direction = 180;
            // this._sprite.getActionTween(ActionType.DAIJI).repeat(Number.POSITIVE_INFINITY).start();
            // let scale = tuple[npcFields.scale] || 1;
            // this._sprite.body.transform.scale = new Vector3(scale, scale, scale);
        }
    }
}