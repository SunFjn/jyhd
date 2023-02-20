namespace modules.scene {
    import Skeleton = Laya.Skeleton;
    export class MapEffectCtrl {
        private static _instance: MapEffectCtrl;
        public static get instance(): MapEffectCtrl {
            return this._instance = this._instance || new MapEffectCtrl();
        }
        private _mapRainSke: Skeleton;

        constructor() {
        }
        public setup(): void {
            this.initView();
        }
        public initView() {
            this._mapRainSke = new Laya.Skeleton();
            this._mapRainSke.visible = false;
            game.GameCenter.instance.world.publish("addToLayer", LayerType.ForegroundDecorate, this._mapRainSke); // 消息投递式添加 参与layer层管理函数
            // GameCenter.instance.getWorldLayer(LayerType.ForegroundDecorate).addChild(this._mapRainSke) // 节点式添加 不参与layer层管理 (尽量少用设计初衷用来转换坐标)
            this._mapRainSke.zOrder = 100;
            this._mapRainSke.pos(Laya.stage.width / 2, 1024);
        }

        public show() {
            this.close();
            if (SceneModel.instance.sceneEffectName.length == 0) {
                return;
            }
            let path = "res/skeleton/other/" + SceneModel.instance.sceneEffectName + ".sk";
            this._mapRainSke.load(path, Laya.Handler.create(this, (skele) => {
                this._mapRainSke.visible = true;
                this._mapRainSke.play(0, true, true);
            }));
        }

        public close() {
            this._mapRainSke && (this._mapRainSke.visible = false)
        }
    }
}