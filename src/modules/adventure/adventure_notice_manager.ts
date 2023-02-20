/** 奇遇通知*/


namespace modules.adventure {
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import Point = Laya.Point;
    import Sprite = Laya.Sprite;
    import Layer = ui.Layer;

    export class AdventureNoticeManager {
        private static _instance: AdventureNoticeManager;
        public static get instance(): AdventureNoticeManager {
            return this._instance = this._instance || new AdventureNoticeManager();
        }

        private _tween: TweenJS;
        private _img: Laya.Image;
        private _tweenMove: TweenJS;

        constructor() {

        }

        public addNotice(): void {
            // 只在挂机场景有效
            let sceneId: number = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            let sceneType: SceneTypeEx = SceneCfg.instance.getCfgById(sceneId)[sceneFields.type];
            if (sceneType !== SceneTypeEx.common) return;
            if (!AdventureModel.instance.flyTarget) return;
            Laya.timer.clear(this, this.delayHandler);
            if (this._tweenMove) this._tweenMove.stop();
            if (!this._img) {
                this._img = new Laya.Image("assets/others/adventure/tips_mainui_cfqy.png");
                this._img.anchorX = this._img.anchorY = 0.5;
            }
            this._img.pos(CommonConfig.viewWidth * 0.5, 350, true);
            LayerManager.instance.addToNoticeLayer(this._img);
            this._img.scaleX = 2.5;
            this._img.scaleY = 2.5;
            if (!this._tween) {
                this._tween = TweenJS.create(this._img).to({
                    scaleX: 1,
                    scaleY: 1
                }, 300).onComplete(this.tweenEndHandler.bind(this));
            }
            this._tween.start();
        }

        private tweenEndHandler(): void {
            Laya.timer.once(3000, this, this.delayHandler);
        }

        private delayHandler(): void {
            if (!this._tweenMove) {
                this._tweenMove = TweenJS.create(this._img).onComplete(this.moveEndHandler.bind(this));
            }
            let spr: Sprite = AdventureModel.instance.flyTarget;
            if (spr) {
                Point.TEMP.setTo(67, 27);
                spr.localToGlobal(Point.TEMP);
                LayerManager.instance.getLayerById(Layer.NOTICE_LAYER).globalToLocal(Point.TEMP);
                this._tweenMove.to({scaleX: 0.4, scaleY: 0.4, x: Point.TEMP.x, y: Point.TEMP.y}, 400).start();
            } else {
                this.moveEndHandler();
            }
        }

        private moveEndHandler(): void {
            this._img.removeSelf();
        }
    }
}