///<reference path="../../../../modules/config/monster_res_cfg.ts"/>

namespace game.role.component.exterior {
    import MonsterResFields = Configuration.MonsterResFields;
    import Vector3 = Laya.Vector3;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import Sprite3D = Laya.Sprite3D;
    import ParticlePool = base.particle.ParticlePool;

    export class MonsterAvatarComponent extends RoleComponent {
        private static resetFlareValue(target: any, endValue: any): void {
            endValue.colorOffset = 0.5;
            target.colorOffset = 0;
        }

        private readonly _sprite: RoleAvatar;
        private readonly _layer: LayerType;
        private readonly _flareTween: TweenJS;
        private readonly _fadeTween: TweenJS;
        private _showEffects: Array<Sprite3D>;

        constructor(owner: Role, layer: LayerType) {
            super(owner);
            this._sprite = new RoleAvatar(owner);
            this.property.set("avatar", this._sprite);
            this.property.set("transform", this._sprite.transform);

            this._layer = layer;

            this._flareTween = TweenJS
                .create(this._sprite)
                .to({ colorOffset: 0.5 }, 75)
                .yoyo(true)
                .repeat(1)
                .onComplete(MonsterAvatarComponent.resetFlareValue)
                .onStop(MonsterAvatarComponent.resetFlareValue);

            this._fadeTween = TweenJS
                .create(this._sprite)
                .to({ alpha: 0.0 }, 800);
        }

        public setup(): void {
            this._sprite.reset("");

            let exterior = this.property.get("exterior");
            let scale = 1;
            // 2D: 横版2D代码片段,加载2D龙骨资源!
            if (this._sprite._avaterSK) {
                let tuple = MonsterResCfg.instance.getCfgById(this.property.get("occ"));
                scale = tuple[MonsterResFields.scale] || 1;

                this._sprite._avaterSK.reset(exterior[0], 0, 0, 0, 0, 0, 0, 0);

                this._sprite.SKDirection = (tuple[MonsterResFields.side]) as (1 | -1);

                // 设置缩放
                this._sprite._avaterSK.setScale(
                    [
                        [AvatarAniBigType.clothes, scale]
                    ]
                )
            }
            
            this.owner.on("flare", this, this.flare);
            this.owner.on("fade", this, this.fade);
            this.property.on("status", this, this.updateStatus);
            this.updateStatus(this.property.get("status"));

            // GameCenter.instance.world.publish("addToLayer", this._layer, this._sprite);
            GameCenter.instance.world.publish("castShadow2D", true, scale, this.property);
        }


        public teardown(): void {
            this._sprite.removeSelf();
            this.owner.off("flare", this, this.flare);
            this.owner.off("fade", this, this.fade);
            this.property.off("status", this, this.updateStatus);
            this._flareTween.stop();
            this._fadeTween.stop();
            GameCenter.instance.world.publish("castShadow2D", false, 0, this.property);

            if (this._showEffects != null) {
                for (let effect of this._showEffects) {
                    effect.removeSelf();
                }
            }
        }

        public destory(): void {
            this._sprite.destroy();
            if (this._showEffects != null) {
                for (let effect of this._showEffects) {
                    effect.destroy(true);
                }
                this._showEffects = null;
            }
        }

        private flare(): void {
            this._flareTween.start();
        }

        private fade(): void {
            this._fadeTween.start();
        }

        private updateStatus(status: RoleState): void {

            // console.log("怪物updateStatus处理,Show展示动画!!!待检测问题后处理,应该是没问题的!!!");
            // if (status == RoleState.SHOW) {

            //     let tuple = MonsterResCfg.instance.getCfgById(this.property.get("occ"));
            //     let urls = tuple[MonsterResFields.showEffect];
            //     if (urls && urls.length) {
            //         if (this._showEffects == null) {
            //             this._showEffects = [];
            //             for (let i = 0; i < urls.length; ++i) {
            //                 this._showEffects[i] = ParticlePool.instance.loadParticle(`assets/particle/${urls[i]}.lh`);
            //             }
            //         }
            //         // for (let i = 0; i < this._showEffects.length; ++i) {
            //         //     this._sprite.body.bindTo(i >= 9 ? `xq_GD_${i + 1}` : `xq_GD_0${i + 1}`, this._showEffects[i]);
            //         // }
            //     }
            //     let url = tuple[MonsterResFields.local];
            //     if (url != null && url != "") {
            //         // this._sprite.body.addChild(ParticlePool.instance.loadParticle(`assets/particle/${url}.lh`));
            //         this._sprite.addChild(ParticlePool.instance.loadParticle(`assets/particle/${url}.lh`));
            //     }
            // } else {
            //     if (this._showEffects != null) {
            //         for (let effect of this._showEffects) {
            //             effect.removeSelf();
            //         }
            //     }
            // }
        }
    }
}