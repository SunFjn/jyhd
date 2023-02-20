///<reference path="../../../base/mesh/batch_mesh.ts"/>
// 伤口组件 受击显示 
namespace game.world.component {
    import EntityComponent = base.ecs.EntityComponent;
    import LiteralAtlasMaterial = base.materials.LiteralAtlasMaterial;
    import BatchLiteralElement = base.mesh.BatchLiteralElement;
    import BatchLiteralhMesh = base.mesh.BatchLiteralhMesh;
    import LayaTexture2D = base.textures.LayaTexture2D;
    import MeshSprite3D = Laya.MeshSprite3D;
    import Vector3 = Laya.Vector3;
    import FontClip = Laya.FontClip;
    import Texture = Laya.Texture;
    import Sprite = Laya.Sprite;
    import CustomClip = modules.common.CustomClip; // 序列帧
    import Property = game.role.Property;

    class WoundItem extends Laya.Sprite {
        private _eff: CustomClip;
        constructor() {
            super();
            this.height = 100;
            this._eff = new CustomClip();
            this.addChild(this._eff);
            this._eff.pos(0, 0);
            this._eff.durationFrame = 5;
            this._eff.loop = false
            let frameUrls: Array<string> = [];
            for (let i: int = 3, len: int = 10; i < len; i++) {
                frameUrls.push(`assets/effect/hurt/1/${i}.png`);
            }
            this._eff.frameUrls = frameUrls;
            this._eff.scale(0.8, 0.8)
        }

        public effPlay() {
            this._eff.visible = true;
            this._eff.play();
        }
        public destroy(): void {
            this._eff.visible = false;
            this.removeSelf();
        }

    }

    export class WoundComponent extends EntityComponent<WorldMessage, World> {
        private static _pool: WoundItem[];

        constructor(owner: World) {
            super(owner);
            WoundComponent._pool = [];
        }

        public setup(): void {
            this.owner.on("woundTips", this, this.woundTips);
            this.owner.on("leaveScene", this, this.leaveScene);
        }

        public teardown(): void {
            this.owner.off("woundTips", this, this.woundTips);
            this.owner.off("leaveScene", this, this.leaveScene);
        }

        public destory(): void {
            for (const e of WoundComponent._pool) {
                e.removeSelf();
            }
            WoundComponent._pool.length = 0;
        }

        private leaveScene(): void {

        }

        private getPool() {
            if (!WoundComponent._pool.length) {
                let item = new WoundItem();
                return item;
            }
            return WoundComponent._pool.shift();
        }
        private convertValue(pos: Laya.Point): WoundItem {
            let item = this.getPool()
            item.pos(pos.x, pos.y, true); // 初始出现位置
            // item.pos(100, - 150, true); // 初始出现位置
            return item;
        }

        private trigger(element: WoundItem, delay: number): TweenJS {
            return TweenJS.create(element)
                .combine(true)
                .to({ scaleX: 1, scaleY: 1 }, 1000 / 60 * (5 * 7))
                .delay(delay)
                .onStart(this.addElement)
                .onComplete(this.recover)
                .start();
        }





        private addElement = (element: WoundItem): void => {
            element.effPlay();
        };

        public recover = (element: WoundItem): void => {
            element.removeSelf();
            element.destroy();
            WoundComponent._pool.push(element)
        };

        private woundTips(element: Property, pos: Laya.Point): void {
            let p = element.get('avatarSK').getSKPositon();
            let r = new Laya.Point(p.x - 40, p.y - 150)
            let item = this.convertValue(r)
            // element.get('avatarSK').addChild(item)
            this.owner.publish("addToLayer", LayerType.Foreground, item);
            this.trigger(item, 0);
        }
    }
}
