///<reference path="../../../utils/math_utils.ts"/>

namespace game.world.component {
    import EntityComponent = base.ecs.EntityComponent;
    import MapSpriteLayer = game.map.MapSpriteLayer;
    import Camera = Laya.Camera;
    import Transform3D = Laya.Transform3D;
    import Vector3 = Laya.Vector3;
    import Vector4 = Laya.Vector4;
    import Sprite = Laya.Sprite;
    import Sprite3D = Laya.Sprite3D;
    import MathUtils = utils.MathUtils;
    import LocomotorComponent = game.role.component.LocomotorComponent;
    import SceneModel = modules.scene.SceneModel;



    export class CameraComponent extends EntityComponent<WorldMessage, World> {
        public readonly sprite: Sprite3D;

        private readonly _camera: Camera;
        private readonly _transform: Transform3D;
        private _target: LocomotorComponent;
        private _targetTransform: Transform3D;
        private _layer: MapSpriteLayer;
        private _hud: Sprite;
        private _map2D: Sprite;

        private _cameraTween: TweenJS;
        private readonly _cameraPos: Vector3;
        private readonly _args1: { x: number, y: number };
        private readonly _args2: { x: number, y: number };

        constructor(owner: World, orthographicVerticalSize: number) {
            super(owner);
            this.sprite = new Sprite3D();
            this._cameraPos = new Vector3(0, 0, 0);
            this._camera = new Camera(0, MapDefinitions.CAMERA_NEAR, MapDefinitions.CAMERA_FAR);
            this._transform = this.sprite.transform;
            this.sprite.addChild(this._camera);
            this.initCamera(orthographicVerticalSize);
            this._args1 = { x: 0, y: 0 };
            this._args2 = { x: 0, y: 0 };
        }

        public setup(): void {
            this._layer = this.owner.getComponent(LayerComponent).mapLayer;
            this._hud = this.owner.getComponent(HUDComponent).hudLayer;
            this._map2D = this.owner.getComponent(LayerComponent).map2D;



            this.owner
                .on("stageResize", this, this.stageResize)
                .on("shakeCamera", this, this.shakeCamera)
                .on("follow", this, this.follow);
        }

        public teardown(): void {
            this.owner
                .off("stageResize", this, this.stageResize)
                .off("shakeCamera", this, this.shakeCamera)
                .off("follow", this, this.follow);
        }

        public destory(): void {

        }

        public update(): void {
            if (this._target) {
                let pos = this._targetTransform.localPosition;
                this.updatePosition(pos.x + this.getCameraOffset(), pos.y + 50, Laya.timer.delta / 1000, this._target.speed || 100);
            }
        }

        // 相机偏移 
        // goAhead -1 人物在右下角 1 人物在左下角
        private getCameraOffset(): number {
            // let cameraOffset = !!this._target.property.get("defaultSKDirection") ? 150 : -300
            let cameraOffset = 0;
            if (this._target.SKDirection == 1) {
                cameraOffset = 100
                if (SceneModel.instance.isInMission) {
                    cameraOffset = 150
                }
            } else {
                cameraOffset = -100
            }


            return cameraOffset
        }

        private stageResize(width: number, height: number): void {
            this._camera.orthographicVerticalSize = height;
        }

        private initCamera(orthographicVerticalSize: number): void {
            let camera = this._camera;
            camera.clearColor = new Vector4(0, 0, 0, 1);
            camera.orthographic = true;
            camera.orthographicVerticalSize = orthographicVerticalSize;
            camera.transform.position = new Vector3(0, 0, 0);
            camera.useOcclusionCulling = false;
            camera.removeAllLayers();
            camera.addLayer(Laya.Layer.getLayerByNumber(0));
        }

        private follow(target: LocomotorComponent, keep: boolean): void {
            this._target = target;
            if (target) {
                if (this._cameraTween != null) {
                    this._cameraTween.stop();
                }

                this._targetTransform = target.property.get("transform");
                if (!keep) {
                    let pos = this._targetTransform.localPosition;
                    this.updatePosition(pos.x + this.getCameraOffset(), pos.y + 50, Number.POSITIVE_INFINITY, target.speed || 100);
                }
            }
        }

        private updatePosition(x: number, y: number, delta: number, speed: number): void {
            let pos = this._transform.position;

            let dx = x - pos.x;
            let dy = y - pos.y;
            let dd = Math.sqrt(dx * dx + dy * dy);
            delta = (speed * delta) / dd;
            delta *= 1.5;

            x = MathUtils.lerp(pos.x, x, delta);
            y = MathUtils.lerp(pos.y, y, delta);
            this._layer.update(x, y);

            pos = this._transform.position;
            this._hud.x = -(pos.x - (Laya.stage.width / 2));
            this._hud.y = pos.y + (Laya.stage.height / 2);

            this._map2D.x = -(pos.x - (Laya.stage.width / 2));
            this._map2D.y = pos.y + (Laya.stage.height / 2);

        }

        private shakeCamera(isPlayer: boolean, delay: number): void {
            if (this._cameraTween != null && this._cameraTween.isPlaying) {
                return;
            }

            if (this._cameraTween == null) {
                let duration = 30;
                let offsetX = 7;
                let offsetY = 7;
                let cameraTransform = this._camera.transform;

                let updatePosition = () => {
                    cameraTransform.localPosition = this._cameraPos;
                };

                let resetPosition = () => {
                    this._cameraPos.reset(0, 0, 0);
                    this._args1.x = offsetX * 2;
                    this._args1.y = offsetY * 2;
                    this._args2.x = offsetX * 2;
                    this._args2.y = offsetY * 2;
                    cameraTransform.localPosition = this._cameraPos;
                };

                resetPosition();

                this._cameraTween = TweenJS
                    .create(this._cameraPos)
                    .repeat(1)
                    .yoyo(true)
                    .to(this._args1, duration)
                    .onUpdate(updatePosition)
                    .combine(true)
                    .chain(
                        TweenJS
                            .create(this._cameraPos)
                            .repeat(1)
                            .yoyo(true)
                            .to(this._args2, duration)
                            .onUpdate(updatePosition)
                            .combine(true)
                    )
                    .onStop(resetPosition)
                    .onComplete(resetPosition);
            }


            this._cameraTween.delay(delay).start();
        }

        // private shakeCamera(isPlayer: boolean, delay: number): void {
        //     if (this._cameraTween != null && this._cameraTween.isPlaying) {
        //         return;
        //     }
        //
        //     let updatePosition = () => {
        //         this._transform.position = this._cameraPos;
        //     };
        //
        //     let pos = this._transform.position;
        //     let x = pos.x;
        //     let y = pos.y;
        //     this._cameraPos.elements.set(pos.elements);
        //     let offsetX = 7;
        //     let offsetY = 7;
        //     let duration = 30;
        //     this._cameraTween = TweenJS
        //         .create(this._cameraPos)
        //         .repeat(1)
        //         .yoyo(true)
        //         .to({x: x + (offsetX * 2), y: y + (offsetY * 2)}, duration)
        //         .onUpdate(updatePosition)
        //         .combine(true)
        //         .chain(
        //             TweenJS
        //                 .create(this._cameraPos)
        //                 .repeat(1)
        //                 .yoyo(true)
        //                 .to({x: x + (offsetX * 2), y: y + (offsetY * 2)}, duration)
        //                 .onUpdate(updatePosition)
        //                 .combine(true)
        //         );
        //     this._cameraTween.delay(delay).start();
        // }
    }
}