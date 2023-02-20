///<reference path="../config/action_open_cfg.ts"/>
///<reference path="../config/activity_all_cfg.ts"/>
///<reference path="../config/scene_copy_single_boss_cfg.ts"/>
///<reference path="../activity_all/activity_all_model.ts"/>
namespace modules.activity_all {
    import activity_allFields = Configuration.activity_allFields;
    import activity_all = Configuration.activity_all;
    import Point = Laya.Point;
    import Layer = ui.Layer;
    import LayaEvent = modules.common.LayaEvent;

    export class ActivityAllAlert extends ui.ActivityAllAlertUI {
        private _date: activity_all;
        private _bolll: boolean;
        private _sTween: TweenJS;
        public onOpened(): void {
            super.onOpened();
            this.closeOnSide = true;
            this._bolll = false;
        }

        protected addListeners(): void {
            super.addListeners();
            // if (this.closeBtn) this.closeBtn.off(Event.CLICK, this, this.closeItemEffect);
            // if (this.closeBtn) this.closeBtn.on(Event.CLICK, this, this.closeItemEffect);
            this.addAutoListener(this.receiveBtn, LayaEvent.CLICK, this, this.sureBtnHandler);
        }

        public setOpenParam(value: activity_all): void {
            super.setOpenParam(value);
            this.scale(1, 1);
            if (this._sTween) {
                this._sTween.stop();
            }
            this._date = value;
            if (this._date) {
                let nameID: number = this._date[activity_allFields.nameID];
                this.textImg.skin = "assets/icon/ui/activity_all/txt_" + nameID + ".png";
                this.textPlayerImg.skin = "assets/icon/ui/activity_all/txt_player_" + nameID + ".png";
            }
        }

        public sureBtnHandler() {
            if (this._date) {
                let actionOpenId = this._date[activity_allFields.actionOpenId];
                // if (gotoType == 1) {
                //     WindowManager.instance.openByActionId(gotoParams);
                // } else if (gotoType == 2) {
                //     // if (this._state == 4) {
                //     if (gotoParams == SCENE_ID.scene_homestead) {
                //         if (scene.SceneUtil.isCommonScene) {
                //             xianfu.XianfuModel.instance.panelType = 0;
                //             DungeonCtrl.instance.reqEnterScene(2241, 0);
                //         } else if (scene.SceneUtil.currScene == SceneTypeEx.homestead) {
                //             SystemNoticeManager.instance.addNotice("您已在该场景中", true);
                //         }
                //     } else {
                //         DungeonCtrl.instance.reqEnterScene(gotoParams);
                //     }
                // }
                let type: ActionOpenId = actionOpenId;
                if (type === ActionOpenId.nineCopy) {      // 九天之巅
                    WindowManager.instance.open(WindowEnum.NINE_PANEL);
                } else if (type === ActionOpenId.tianti) {
                    WindowManager.instance.open(WindowEnum.LADDER_PANEL);
                } else if (type === ActionOpenId.riches) {// 天才降宝
                    WindowManager.instance.open(WindowEnum.ACTIVITY_ALL_PANEL);
                } else if (type === ActionOpenId.cloudlandCopy) {//云梦秘境
                    WindowManager.instance.open(WindowEnum.YUNMENGMIJING_PANLE);
                } else if (type === ActionOpenId.swimming) {//昆仑瑶池
                    WindowManager.instance.open(WindowEnum.ACTIVITY_ALL_PANEL);
                } else if (type === ActionOpenId.fairy) {//昆仑瑶池
                    WindowManager.instance.open(WindowEnum.FAIRY_PANEL);
                } else if (type === ActionOpenId.xianFuEnter) {//仙府-家园事件
                    WindowManager.instance.open(WindowEnum.ACTIVITY_ALL_PANEL);
                }else if (type === ActionOpenId.XuanHuo) {//玄火
                    WindowManager.instance.open(WindowEnum.XUANHUO_PANEL);
                }
            }
            super.close();
        }

        public close(): void {
            if (!this._bolll) {
                this._bolll = true;
                this.itemEffect();
            }
            this.closeOnSide = false;
        }

        public itemEffect(): void {
            let spr: Point = modules.action_preview.actionPreviewModel.instance.getPosSprite(specialAniPoin.yugao);
            if (spr) {
                Point.TEMP.setTo(spr.x, spr.y);
                LayerManager.instance.getLayerById(Layer.EFFECT_LAYER).globalToLocal(Point.TEMP);
                let destinX = Point.TEMP.x;
                let destinY = Point.TEMP.y;
                // let destinX = spr.x;
                // let destinY = spr.y;
                this._sTween = TweenJS.create(this).to({
                    x: destinX,
                    y: destinY,
                    scaleX: 0.1,
                    scaleY: 0.1
                }, 600).onComplete((): void => {
                    super.close();
                }).start();
            } else {
                super.close();
            }
        }
    }
}
