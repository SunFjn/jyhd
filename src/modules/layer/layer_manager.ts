///<reference path="../core/custom_dialog_manager.ts"/>


/** 层管理器*/


namespace modules.layer {
    import Component = Laya.Component;
    import Sprite = Laya.Sprite;
    import CustomDialogManager = modules.core.CustomDialogManager;
    import Layer = ui.Layer;
    import guide = Configuration.guide;
    import GuideModel = modules.guide.GuideModel;
    import guideFields = Configuration.guideFields;

    export class LayerManager {
        private static _instance: LayerManager;
        public static get instance(): LayerManager {
            return this._instance = this._instance || new LayerManager();
        }

        // 最底层，在主城层下面
        private _bottomLayer: Component;
        // 主城层
        private _cityLayer: Component;
        // 主界面层
        private _mainUILayer: Component;
        // 中间UI层
        private _midUILayer: Component;
        // ui层
        private _uiLayer: Component;
        // 上层UI层
        private _upUILayer: Component;
        // 提示层
        private _noticeLayer: Component;
        // 弹框层
        private _dialogLayer: Component;
        // 特效层
        private _effectLayer: Component;
        // 加载层
        private _loadingLayer: Component;

        private _layerDic: Table<Component>;

        constructor() {
            this._bottomLayer = new Component();
            this._cityLayer = new Component();
            this._mainUILayer = new Component();
            this._midUILayer = new Component();
            this._uiLayer = new Component();
            this._upUILayer = new Component();
            this._noticeLayer = new Component();
            this._dialogLayer = new Component();
            this._effectLayer = new Component();
            this._loadingLayer = new Component();
        }

        // 主界面层
        public get mainUILayer(): Component {
            return this._mainUILayer;
        }

        // ui层
        public get uiLayer(): Component {
            return this._uiLayer;
        }

        public init(): void {
            this._layerDic = {};

            Laya.stage.addChild(this._bottomLayer);
            this._bottomLayer.mouseEnabled = this._bottomLayer.mouseThrough = true;
            this._layerDic[Layer.BOTTOM_LAYER] = this._bottomLayer;
            this._bottomLayer.name = "最底层，在主城层下面";

            Laya.stage.addChild(this._cityLayer);
            this._cityLayer.mouseEnabled = this._cityLayer.mouseThrough = true;
            this._layerDic[Layer.CITY_LAYER] = this._cityLayer;
            this._cityLayer.name = "主城层";
         
            Laya.stage.addChild(this._mainUILayer);
            this._mainUILayer.mouseEnabled = this._mainUILayer.mouseThrough = true;
            this._layerDic[Layer.MAIN_UI_LAYER] = this._mainUILayer;
            this._mainUILayer.name = "主界面层";

            Laya.stage.addChild(this._midUILayer);
            this._midUILayer.mouseEnabled = this._midUILayer.mouseThrough = true;
            this._layerDic[Layer.MID_UI_LAYER] = this._midUILayer;
            this._midUILayer.name = "中间UI层";

            Laya.stage.addChild(this._uiLayer);
            this._uiLayer.mouseEnabled = this._uiLayer.mouseThrough = true;
            this._layerDic[Layer.UI_LAYER] = this._uiLayer;
            this._uiLayer.name = "UI层";

            Laya.stage.addChild(this._upUILayer);
            this._upUILayer.mouseEnabled = this._upUILayer.mouseThrough = true;
            this._layerDic[Layer.UP_UI_LAYER] = this._upUILayer;
            this._upUILayer.name = "上层UI层";

            Laya.stage.addChild(this._dialogLayer);
            this._dialogLayer.mouseEnabled = this._dialogLayer.mouseThrough = true;
            Laya.Dialog.manager = new CustomDialogManager();
            this._dialogLayer.addChild(Laya.Dialog.manager);
            this._layerDic[Layer.DIALOG_LAYER] = this._dialogLayer;
            this._dialogLayer.name = "弹框层";

            Laya.stage.addChild(this._noticeLayer);
            this._noticeLayer.mouseEnabled = this._noticeLayer.mouseThrough = true;
            this._layerDic[Layer.NOTICE_LAYER] = this._noticeLayer;
            this._noticeLayer.name = "提示层";

            Laya.stage.addChild(this._effectLayer);
            this._effectLayer.mouseEnabled = false;
            this._effectLayer.mouseThrough = true;
            this._layerDic[Layer.EFFECT_LAYER] = this._effectLayer;
            this._effectLayer.name = "特效层";

            Laya.stage.addChild(this._loadingLayer);
            this._loadingLayer.mouseEnabled = this._loadingLayer.mouseThrough = true;
            this._layerDic[Layer.LOADING_LAYER] = this._loadingLayer;
            this._loadingLayer.name = "加载层";

            GlobalData.dispatcher.on(CommonEventType.RESIZE_UI, this, this.resize);
            this.resize();

            // GlobalData.dispatcher.on(CommonEventType.GUIDE_CUR_UPDATE, this, this.checkGuide);
            // this.checkGuide();
        }

        private checkGuide(): void {
            // 如果是在强引导中，不能再打开弹框
            let guide: guide = GuideModel.instance.curGuide;
            this._dialogLayer.visible = !(guide && guide[guideFields.lock] === 1);
        }

        public resize(): void {
            let _viewWidth = CommonConfig.viewWidth;
            let _viewHeight = CommonConfig.viewHeight;
            let _viewScale = CommonConfig.viewScale;
            let shipei_liuhai = false;
            if (Main.instance.isWXChannel) {
                // 适配小游戏刘海屏
                let stage = Laya.stage;
                let w = Math.floor(stage.width);
                let h = Math.floor(stage.height);
                if (h / w >= 1.8) {
                    // 长屏
                    shipei_liuhai = true;
                    _viewHeight = Math.floor(h / (w / 720)) - 60;
                    this._bottomLayer.y = this._cityLayer.y = this._mainUILayer.y = this._midUILayer.y = this._uiLayer.y = this._upUILayer.y = this._noticeLayer.y = this._dialogLayer.y = this._effectLayer.y = this._loadingLayer.y = 60;
                }
            }

            this._bottomLayer.size(_viewWidth, _viewHeight);
            this._bottomLayer.scale(_viewScale, _viewScale, true);
            this._cityLayer.size(_viewWidth, _viewHeight);
            this._cityLayer.scale(_viewScale, _viewScale, true);
            this._mainUILayer.size(_viewWidth, _viewHeight);
            this._mainUILayer.scale(_viewScale, _viewScale, true);
            this._midUILayer.size(_viewWidth, _viewHeight);
            this._midUILayer.scale(_viewScale, _viewScale, true);
            this._uiLayer.size(_viewWidth, _viewHeight);
            this._uiLayer.scale(_viewScale, _viewScale, true);
            this._upUILayer.size(_viewWidth, _viewHeight);
            this._upUILayer.scale(_viewScale, _viewScale, true);
            this._noticeLayer.size(_viewWidth, _viewHeight);
            this._noticeLayer.scale(_viewScale, _viewScale, true);
            if (shipei_liuhai) {
                this._dialogLayer.size(_viewWidth, CommonConfig.viewHeight);
                this._dialogLayer.y = 0;
            }else{
                this._dialogLayer.size(_viewWidth, _viewHeight);
            }
            this._dialogLayer.scale(_viewScale, _viewScale, true);
            this._effectLayer.size(_viewWidth, _viewHeight);
            this._effectLayer.scale(_viewScale, _viewScale, true);
            this._loadingLayer.size(_viewWidth, _viewHeight);
            this._loadingLayer.scale(_viewScale, _viewScale, true);

            // this._uiLayer.scale(CommonConfig.viewScale, CommonConfig.viewScale, true);
            // alert(CommonConfig.viewWidth + "  " + CommonConfig.viewHeight + "   " + Browser.width + "   " + Browser.height + "   " + CommonConfig.viewScale);
            // console.log("............" + CommonConfig.viewWidth + "   " + CommonConfig.viewHeight + "   " + CommonConfig.viewScale);
        }

        // 根据层ID获取层
        public getLayerById(id: Layer): Component {
            return this._layerDic[id];
        }

        // 添加到底层
        public addToBottomLayer(spr: Sprite): void {
            this._bottomLayer.addChild(spr);
        }

        // 添加到主城层
        public addToCityLayer(spr: Sprite): void {
            this._cityLayer.addChild(spr);
        }

        // 添加到主界面层
        public addToMainUILayer(spr: Sprite): void {
            this._mainUILayer.addChild(spr);
        }

        // 添加到中间UI层
        public addToMidUILayer(spr: Sprite): void {
            this._midUILayer.addChild(spr);
        }

        // 添加到UI层
        public addToUILayer(spr: Sprite): void {
            this._uiLayer.addChild(spr);
        }

        // 添加到上层UI层
        public addToUpUILayer(spr: Sprite): void {
            this._upUILayer.addChild(spr);
        }

        // 添加到提示层
        public addToNoticeLayer(spr: Sprite): void {
            this._noticeLayer.addChild(spr);
        }

        // 添加到特效层
        public addToEffectLayer(spr: Sprite): void {
            this._effectLayer.addChild(spr);
        }

        // 添加到加载层
        public addToLoadingLayer(spr: Sprite): void {
            this._loadingLayer.addChild(spr);
        }


        // 锁住所有层
        public lockAllLayer(value: boolean): void {
            return;
            console.log("lockStage......................." + value);
            for (let key in this._layerDic) {
                if (key !== Layer.EFFECT_LAYER.toString()) {
                    this._layerDic[key].mouseEnabled = !value;
                }
            }
        }
    }
}
