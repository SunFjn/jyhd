/** 引导面板*/


namespace modules.guide {
    import guide = Configuration.guide;
    import Sprite = Laya.Sprite;
    import guideFields = Configuration.guideFields;
    import Point = Laya.Point;
    import GuideViewUI = ui.GuideViewUI;
    import Layer = ui.Layer;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import HitArea = Laya.HitArea;
    import CustomClip = modules.common.CustomClip;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;
    export class GuidePanel extends GuideViewUI {
        private _spr: Sprite;

        private _arrowStartPos: Array<number>;
        private _arrowEndPos: Array<number>;
        private _tween: TweenJS;
        private _bg: Sprite;
        private _guide: guide;
        private _eff: CustomClip;
        private _skeleton: Laya.Skeleton;

        private _sprId: GuideSpriteId;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.initKanbanniang();
            this.zOrder = 1000;
            this.centerX = this.centerY = 0;
            this.closeByOthers = false;

            this.hitArea = new HitArea();

            this._bg = new Sprite();
            // this._bg.cacheAs = "bitmap";
            // this._bg.mouseEnabled = true;
            this._bg.alpha = 0.5;
            // this.mouseThrough = true;

            // this.outMaskImg.blendMode = BlendMode.DESTINATIONOUT;
            // this._bg.addChild(this.outMaskImg);
            // this.outMaskImg.removeSelf();

            this._eff = modules.common.CommonUtil.creatEff(this, "dianji/dianji", 11);
            this._eff.visible = false;
            this._eff.stop();
            // 增加手指的点击穿透事件
            this._eff.mouseEnabled = false;
            this._eff.mouseThrough = true;

            this.girlImg.visible = this.talkBgImg.visible = this.cornerImg.visible = this.talkTxt.visible = false;
            this.txtBgImg.visible = this.descTxt.visible = false;
            this.layer = Layer.LOADING_LAYER;
        }

        /**
         * 看板娘
         */
        private initKanbanniang() {
            if (this._skeleton) return;
            this._skeleton = new Laya.Skeleton();
            this._skeleton.pos(210, 310);
            this.girlImg.addChild(this._skeleton);
            this.girlImg.skin = "";
            this._skeleton.load("res/skeleton/other/kanbanniang.sk");
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GUIDE_CUR_UPDATE, this, this.updateCurGuide);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RESIZE_UI, this, this.resizeHandler);
            this.addAutoListener(this, Laya.Event.CLICK, this, this.bgClickHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SCENE_ENTER, this, this.enterScene);
        }

        private bgClickHandler(): void {
            SystemNoticeManager.instance.addNotice("请点击箭头引导区域", true, this.layer);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            if (value === 0) {
                this.layer = Layer.LOADING_LAYER;
            } else {
                this.layer = value;
            }
        }

        protected onOpened(): void {
            super.onOpened();
            this.resizeHandler();
            this.updateCurGuide();
            // this.removeSelf();
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.relayout);
            this._guide = null;
            this._spr = null;
            if (this._tween) this._tween.stop();
            this._eff.visible = false;
            this._eff.stop();
        }
        private enterScene() {
            this.updateCurGuide();
        }
        // 更新当前引导
        private updateCurGuide(): void {
            this.mouseEnabled = false;
            let guide: guide = GuideModel.instance.curGuide;
            if (!guide) {
                this.close();
                return;
            }
            this._guide = guide;
            // console.log("guidePanelOpened..................");
            LayerManager.instance.lockAllLayer(false);

            // 判断是否要关闭一些面板
            // let allowPanels: Array<WindowEnum> = this._guide[guideFields.allowPanel];
            // if (allowPanels.length > 0) {
            //     let openTable: Table<WindowEntry> = WindowManager.instance.openTable;
            //     if (openTable) {
            //         for (let key in openTable) {
            //             let panel: BaseView = WindowManager.instance.getPanelById(openTable[key].id);
            //             if (panel && panel.layer === Layer.UI_LAYER && panel.panelId !== WindowEnum.GUIDE_PANEL && allowPanels.indexOf(panel.panelId) === -1) {
            //                 WindowManager.instance.close(panel.panelId);
            //             }
            //             let dialog: BaseDialog = WindowManager.instance.getDialogById(openTable[key].id);
            //             if (dialog && allowPanels.indexOf(dialog.dialogId) === -1) {
            //                 WindowManager.instance.close(dialog.dialogId);
            //             }
            //         }
            //     }
            // }

            this._sprId = guide[guideFields.spriteId];
            // guide[guideFields.lock] = 1;
            // guide[guideFields.needGirl] = "1";
            // guide[guideFields.talkContent] = "asdfasdfasdfasdf";
            // guide[guideFields.girlPos] = [100, 100];
            this.mouseEnabled = guide[guideFields.lock] === 1;
            this.girlImg.visible = this.talkBgImg.visible = this.talkTxt.visible = false;//  = this.cornerImg.visible
            if (guide[guideFields.needGirl] === "1") {
                this.girlImg.visible = this.talkBgImg.visible = this.talkTxt.visible = true;//  = this.cornerImg.visible
                // this.relayoutGirl();
            }
            this.txtBgImg.visible = this.descTxt.visible = this.arrowImg.visible = this.borderImg.visible = false;
            this._spr = GuideModel.instance.getUIByid(guide[guideFields.spriteId]);
            if (this._spr && !this._spr.destroyed) {
                // 因为事件没有优先级，如果已经侦听过点击且会关闭引导面板会导致清掉事件侦听而无法触发this.clickHandler
                this._spr.once(Laya.Event.CLICK, this, this.clickHandler);

                if (guide[guideFields.needTxt]) {
                    this.txtBgImg.visible = this.descTxt.visible = true;
                    this.descTxt.text = guide[guideFields.txt];
                    this.descTxt.width = this.descTxt.textWidth;
                    this.descTxt.height = this.descTxt.textHeight;
                    this.txtBgImg.size(this.descTxt.width + 32, this.descTxt.height + 32);
                    this.descTxt.color = "#ffffff";
                } else {
                    this.descTxt.color = "#603130";
                }

                this.arrowImg.visible = guide[guideFields.arrowDir] !== 0;
                this.borderImg.visible = guide[guideFields.spriteId] !== GuideSpriteId.BOTTOM_TASK_BG;
                if (this.borderImg.visible) this.borderImg.visible = guide[guideFields.show] != 1

                Laya.timer.loop(300, this, this.relayout);
                let talkPos: number[] = guide[guideFields.talkPos];
                if (talkPos.length > 0) {
                    this._eff.visible = true;
                    this._eff.play();
                } else {
                    this._eff.visible = false;
                    this._eff.stop();
                }
                this.relayout();

                if (this._tween) this._tween.stop();
                this.descBox.pos(this._arrowStartPos[0], this._arrowStartPos[1], true);
                this._tween = TweenJS.create(this.descBox);
                this.tweenToEnd();
                //只有挂机场景显示天关引导
                if (modules.scene.SceneModel.instance.currentScene != SceneTypeEx.common && guide[guideFields.spriteId] == 1) {
                    this.txtBgImg.visible = this.descTxt.visible = this.arrowImg.visible = this.borderImg.visible = false;
                }
            }
        }

        // 缓动至结束位置
        private tweenToEnd(): void {
            this._tween.to({
                x: this._arrowStartPos[0],
                y: this._arrowStartPos[1]
            }, 200).onComplete(this.tweenToStart.bind(this)).start();
        }

        // 缓动至开始位置
        private tweenToStart(): void {
            this._tween.to({
                x: this._arrowEndPos[0],
                y: this._arrowEndPos[1]
            }, 200).onComplete(this.tweenToEnd.bind(this)).start();
        }

        // 重布局
        private relayout(): void {
            if (this._spr.destroyed) return;
            let p: Point = Point.TEMP;
            let guide: guide = GuideModel.instance.curGuide;
            let offsetH = guide[guideFields.offsetH];
            let offsetW = guide[guideFields.offsetW];
            p.setTo(0, 0);
            this._spr.localToGlobal(p);
            this.globalToLocal(p);
            this.borderImg.pos(p.x - 12, p.y - 10, true);
            this.borderImg.size(this._spr.width + 22 + offsetW, this._spr.height + 20 + offsetH);
            let flipPosX = 100;
            this.checkBorderSkin(p);

            let talkPos: number[] = this._guide[guideFields.talkPos];
            if (talkPos.length > 0) {
                this._eff.pos(this.borderImg.x + talkPos[0], this.borderImg.y + talkPos[1], true);
            }
            if (this._guide && this._guide[guideFields.needGirl] === "1") {
                this.talkTxt.text = this._guide[guideFields.talkContent];
                // this.talkTxt.height = this.talkTxt.textHeight;
                this.girlImg.pos(this.borderImg.x + this._guide[guideFields.girlPos][0] + flipPosX, this.borderImg.y + this._guide[guideFields.girlPos][1], true);
                this.girlImg.scaleX = guide[guideFields.side];
                // console.log("guide[guideFields.side]", guide[guideFields.side], this.girlImg.x);
                this.cornerImg.pos(this.girlImg.x + 222 - flipPosX, this.girlImg.y + 29, true);
                // this.talkBgImg.size(this.talkTxt.width + 60, this.talkTxt.height + 50);
                this.talkBgImg.pos(this.girlImg.x - 64, this.girlImg.y + 200, true);
                // this.talkTxt.pos(this.talkBgImg.x + 35, this.talkBgImg.y + 30, true);
            }
            // this.outMaskImg.pos(p.x, p.y, true);
            // this.outMaskImg.size(this._spr.width, this._spr.height);
            this.hitArea.unHit.clear();
            this.hitArea.unHit.drawRect(p.x, p.y, this._spr.width, this._spr.height, "#000000");
            if (this._guide && this._guide[guideFields.lock]) {
                this._bg.graphics.clear();
                this._bg.graphics.drawRect(0, 0, p.x, CommonConfig.viewHeight, "#000000");
                this._bg.graphics.drawRect(p.x, 0, this._spr.width, p.y, "#000000");
                this._bg.graphics.drawRect(p.x, p.y + this._spr.height, this._spr.width, CommonConfig.viewHeight - p.y - this._spr.height, "#000000");
                this._bg.graphics.drawRect(p.x + this._spr.width, 0, CommonConfig.viewWidth - p.x - this._spr.width, CommonConfig.viewHeight, "#000000");
                this._bg.alpha = 0
                this.addChildAt(this._bg, 0);
                BottomTabCtrl.instance._guideLock = true;
            } else {
                BottomTabCtrl.instance._guideLock = false;
                this._bg.removeSelf();
            }


            let arrowDir: number = guide[guideFields.arrowDir];
            if (!this._arrowStartPos) {
                this._arrowStartPos = [];
                this._arrowEndPos = [];
            }
            if (arrowDir === 1) {
                this._arrowStartPos[0] = this.borderImg.x + this.borderImg.width * 0.5;
                this._arrowStartPos[1] = this.borderImg.y;
                this._arrowEndPos[0] = this._arrowStartPos[0];
                this._arrowEndPos[1] = this._arrowStartPos[1] + 20;
                this.arrowImg.rotation = 90;
                this.txtBgImg.pos(-this.txtBgImg.width * 0.5, -124 - this.txtBgImg.height, true);
                this.descTxt.pos(this.txtBgImg.x + 16, this.txtBgImg.y + 16, true);
            } else if (arrowDir === 2) {
                this._arrowStartPos[0] = this.borderImg.x + this.borderImg.width * 0.5;
                this._arrowStartPos[1] = this.borderImg.y + this.borderImg.height;
                this._arrowEndPos[0] = this._arrowStartPos[0];
                this._arrowEndPos[1] = this._arrowStartPos[1] - 20;
                this.arrowImg.rotation = 270;
                this.txtBgImg.pos(-this.txtBgImg.width * 0.5, 124, true);
                this.descTxt.pos(this.txtBgImg.x + 16, this.txtBgImg.y + 16, true);
            } else if (arrowDir === 3) {
                this._arrowStartPos[0] = this.borderImg.x;
                this._arrowStartPos[1] = this.borderImg.y + this.borderImg.height * 0.5;
                this._arrowEndPos[0] = this._arrowStartPos[0] + 20;
                this._arrowEndPos[1] = this._arrowStartPos[1];
                this.arrowImg.rotation = 0;
                this.txtBgImg.pos(-124 - this.txtBgImg.width, -this.txtBgImg.height * 0.5, true);
                this.descTxt.pos(this.txtBgImg.x + 16, this.txtBgImg.y + 16, true);
            } else if (arrowDir === 4) {
                this._arrowStartPos[0] = this.borderImg.x + this.borderImg.width;
                this._arrowStartPos[1] = this.borderImg.y + this.borderImg.height * 0.5;
                this._arrowEndPos[0] = this._arrowStartPos[0] - 20;
                this._arrowEndPos[1] = this._arrowStartPos[1];
                this.arrowImg.rotation = 180;
                this.txtBgImg.pos(124, -this.txtBgImg.height * 0.5, true);
                this.descTxt.pos(this.txtBgImg.x + 16, this.txtBgImg.y + 16, true);
            }
        }

        private checkBorderSkin(p: Point) {
            switch ((this._spr as Laya.Image).skin) {
                case "common/17.png":
                    this.borderImg.skin = "guide/selected_xsyd_xzk1.png";
                    break;
                case "common/btn_common_an02.png":
                    this.borderImg.skin = "guide/selected_xsyd_xzk1.png";
                    break;
                case "common/btn_common_an03.png":
                    this.borderImg.skin = "guide/selected_xsyd_xzk1.png";
                    break;
                case "common/btn_tongyong_18.png":
                    this.borderImg.skin = "guide/selected_xsyd_xzk1.png";
                    break;
                case "common/btn_tongyong_24.png":
                    this.borderImg.skin = "guide/selected_xsyd_xzk1.png";
                    break;
                case "common/btn_tongyong_23.png":
                    this.borderImg.skin = "guide/selected_xsyd_xzk1.png";
                    break;
                case "common/btn_tongyong_6.png":
                    this.borderImg.skin = "guide/selected_xsyd_xzk1.png";
                    break;
                default:
                    this.borderImg.skin = "guide/selected_xsyd_xzk.png";
                    break;
            }
            let id: number = this._guide[guideFields.id];
            switch (id) {
                case 2803:
                    this.borderImg.pos(p.x - 9, p.y - 8, true);
                    this.borderImg.size(205, 88);
                    break;

                default:
                    break;
            }

        }

        // 重布局妹纸
        // private relayoutGirl():void{
        //     if(!this._guide || this._guide[guideFields.needGirl] !== "1") return;
        //     this.talkTxt.text = this._guide[guideFields.talkContent];
        //     this.talkTxt.height = this.talkTxt.textHeight;
        //     let offsetX:number = (CommonConfig.viewWidth - 720) * 0.5;
        //     let offsetY:number = (CommonConfig.viewHeight - 1280) * 0.5;
        //     this.girlImg.pos(offsetX + this._guide[guideFields.girlPos][0], offsetY + this._guide[guideFields.girlPos][1], true);
        //     this.cornerImg.pos(this.girlImg.x + 262, this.girlImg.y + 20, true);
        //     this.talkBgImg.size(this.talkTxt.width + 32, this.talkTxt.height + 32);
        //     this.talkBgImg.pos(this.cornerImg.x - 42, this.cornerImg.y - this.talkBgImg.height + 16, true);
        //     this.talkTxt.pos(this.talkBgImg.x + 16, this.talkBgImg.y + 16, true);
        // }

        private clickHandler(): void {
            GlobalData.dispatcher.event(CommonEventType.GUIDE_CLICK_TARGET, this._sprId);
        }

        public resizeHandler(): void {
            this.width = CommonConfig.viewWidth;
            this.height = CommonConfig.viewHeight;
            this.hitArea.hit.drawRect(0, 0, this.width, this.height, "#000000");
            // this._bg.graphics.clear();
            // this._bg.graphics.drawRect(0, 0, this.width, this.height, "#000000");
            // this.scaleX = this.scaleY = CommonConfig.viewScale;
            // this._bg.graphics.clear();
            // let startX:number = (this.width - CommonConfig.viewWidth) * 0.5;
            // let startY:number = (this.height - CommonConfig.viewHeight) * 0.5;
            // this._bg.pos(startX, startY, true);
            // this._bg.graphics.drawRect(0, 0, CommonConfig.viewWidth, CommonConfig.viewHeight, "#FF0000");
            // this.relayoutGirl();
        }

        public destroy(destroyChild: boolean = true): void {

            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }


            this._spr = this.destroyElement(this._spr);
            this._bg = this.destroyElement(this._bg);
            this._eff = this.destroyElement(this._eff);
            this._skeleton = this.destroyElement(this._skeleton);

            super.destroy(destroyChild);
        }
    }
}