///<reference path="../../../modules/common/skeleton_avatar.ts"/>
namespace game.world.component {
    import EntityComponent = base.ecs.EntityComponent;
    import Sprite = Laya.Sprite;
    import SkeletonAvatar = modules.common.SkeletonAvatar;

    export class HUDComponent extends EntityComponent<WorldMessage, World> {
        private _hudLayer: Sprite;

        constructor(owner: World) {
            super(owner);
            this._hudLayer = new Sprite();
            this._hudLayer.name = "Hud Layer";

        }

        public get hudLayer(): Laya.Sprite {
            return this._hudLayer;
        }

        public setup(): void {
            Laya.stage.addChildAt(this._hudLayer, StageType.Hud);
            this.owner.on("addToHUD", this, this.addChild);
        }

        public teardown(): void {

        }

        public destory(): void {

        }

        private addChild(child: Sprite): void {
            this._hudLayer.addChild(child);
        }
    }
}