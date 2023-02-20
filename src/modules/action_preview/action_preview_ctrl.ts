///<reference path="../main/main_ctrl.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
///<reference path="../action_preview/action_preview_model.ts"/>
///<reference path="../config/scene_cfg.ts"/>
///<reference path="../config/onhook_income_cfg.ts"/>
/** */
namespace modules.action_preview {
    import Image = laya.ui.Image;
    import Point = laya.maths.Point;
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import action_previewFields = Configuration.action_previewFields;
    import actionPreviewModel = modules.action_preview.actionPreviewModel;
    /*领取功能预览奖励返回*/
    import GetActionPreviesAwardReply = Protocols.GetActionPreviesAwardReply;
    import GetActionPreviesAwardReplyFields = Protocols.GetActionPreviesAwardReplyFields;
    /*领取功能预览奖励返回*/
    import GetActionPreviesHaveReceivedReply = Protocols.GetActionPreviesHaveReceivedReply;
    import GetActionPreviesHaveReceivedReplyFields = Protocols.GetActionPreviesHaveReceivedReplyFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import Layer = ui.Layer;
    import SceneModel = modules.scene.SceneModel;
    import SceneCfg = modules.config.SceneCfg;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import sceneFields = Configuration.sceneFields;
    import blendFields = Configuration.blendFields;

    export class actionPreviewCtrl extends BaseCtrl {

        private static _instance: actionPreviewCtrl;
        public static get instance(): actionPreviewCtrl {
            return this._instance = this._instance || new actionPreviewCtrl();
        }

        private destin: Point;

        constructor() {
            super();
            this.destin = new Point(150, 21);
        }

        public setup(): void {
            // 添加协议侦听
            Channel.instance.subscribe(SystemClientOpcode.GetActionPreviesAwardReply, this, this.GetActionPreviesAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetActionPreviesHaveReceivedReply, this, this.GetActionPreviesHaveReceivedReply);
            GlobalData.dispatcher.on(CommonEventType.ACTION_PREVIEW_FUNC_OPEN_UPDATE, this, this.funOpenEven);//功能开启监听 判断是否弹出新功能提示
            GlobalData.dispatcher.on(CommonEventType.ACTION_PREVIEW_FUNC_OPEN_UPDATE, this, this.funOpenActionPreviewPanel);//功能开启监听 判断是否显示 新功能预览入口
            GlobalData.dispatcher.on(CommonEventType.ACTION_PREVIEW_UPDATE, this, this.updateSceneState);
            GlobalData.dispatcher.on(CommonEventType.DUNGEON_SCENE_STATE_UPDATE, this, this.updateSceneState);
            GlobalData.dispatcher.on(CommonEventType.ACTION_PREVIEW_EFFECT, this, this.itemEffect);
            GlobalData.dispatcher.on(CommonEventType.ACTION_PREVIEW_ENTER, this, this.showAni);
            GlobalData.dispatcher.on(CommonEventType.SCENE_ENTER, this, this.enterScene);
            // GlobalData.dispatcher.on(CommonEventType.MISSION_UPDATE_LV, this, this.enterScene);
            this.requsetAllData();
        }
        public requsetAllData() {
            this.getActionPreviesHaveReceived();
        }

        private enterScene(mapId: number = -1): void {
            if (mapId === -1 && !SceneModel.instance.enterScene) return;
            let type = SceneCfg.instance.getCfgById(mapId !== -1 ? mapId : SceneModel.instance.enterScene[EnterSceneFields.mapId])[sceneFields.type];
            if (type === SceneTypeEx.common) {      // 挂机
                this.updateSceneState();
                Laya.timer.clear(this, this.showAni);
                Laya.timer.once(CommonConfig.panelTweenDuration, this, this.showAni);
            } else {
                Laya.timer.clear(this, this.showAni);
            }
        }

        public showAni() {
            let type = SceneCfg.instance.getCfgById(SceneModel.instance.enterScene[EnterSceneFields.mapId])[sceneFields.type];
            if (type === SceneTypeEx.common) {
                if (actionPreviewModel.instance._action_previewDate) {
                    WindowManager.instance.openDialog(WindowEnum.ACTION_PREVIEW_NEW_ALERT, actionPreviewModel.instance._action_previewDate);
                    actionPreviewModel.instance._action_previewDate = null;
                } else {
                    // 挂机
                    if (modules.vip_new.VipNewModel.instance.isUp) {
                        WindowManager.instance.open(WindowEnum.VIP_SVIP_UP_ALERT);
                        modules.vip_new.VipNewModel.instance.isUp = false;
                    }
                    else {
                        if (actionPreviewModel.instance._tianGuaIsUp) {
                            let maxTianGuanLv = modules.config.BlendCfg.instance.getCfgById(53002)[blendFields.intParam][0];
                            if (modules.mission.MissionModel.instance.curLv >= maxTianGuanLv) {
                                let GuaJiearningsUpItemObj = new modules.main.GuaJiearningsUpItem();
                                // GuaJiearningsUpItemObj.pos(CommonConfig.viewWidth / 2, CommonConfig.viewHeight / 2);
                                LayerManager.instance.addToEffectLayer(GuaJiearningsUpItemObj);
                            } else {
                                if (modules.vip_new.VipNewModel.instance.isUp) {
                                    WindowManager.instance.open(WindowEnum.VIP_SVIP_UP_ALERT);
                                    modules.vip_new.VipNewModel.instance.isUp = false;
                                }
                            }
                            actionPreviewModel.instance._tianGuaIsUp = false;
                        }
                    }
                }
            }
        }

        /** 获取功能预览已领取的id*/
        public getActionPreviesHaveReceived() {
            // console.log("获取功能预览已领取的id 请求 ");
            Channel.instance.publish(UserFeatureOpcode.GetActionPreviesHaveReceived, null);
        }

        /** 领取功能预览奖励 */
        public getActionPreviesAward(id: number) {
            // console.log("领取功能预览奖励 请求 ");
            Channel.instance.publish(UserFeatureOpcode.GetActionPreviesAward, [id]);
        }

        /** 领取功能预览奖励 返回*/
        private GetActionPreviesAwardReply(tuple: GetActionPreviesAwardReply): void {
            // console.log("领取功能预览奖励返回 返回数据...............:   ", tuple);
            modules.common.CommonUtil.noticeError(tuple[GetActionPreviesAwardReplyFields.result]);
            GlobalData.dispatcher.event(CommonEventType.ACTION_PREVIEW_UPDATE);
        }

        /** 获取功能预览已领取的id返回*/
        private GetActionPreviesHaveReceivedReply(tuple: GetActionPreviesHaveReceivedReply): void {
            // console.log("获取功能预览已领取的id返回 返回数据...............:   ", tuple);
            actionPreviewModel.instance.actionIDList = tuple[GetActionPreviesHaveReceivedReplyFields.list];
            GlobalData.dispatcher.event(CommonEventType.ACTION_PREVIEW_UPDATE);
        }

        public funOpenActionPreviewPanel(ID: Array<number>): void {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.actionPreviewEnter) {
                    this.updateSceneState();
                }
            }
        }

        public funOpenEven(ID: Array<number>): void {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                let shuju = actionPreviewModel.instance.isHaveAction(element);
                if (shuju) {
                    let id = shuju[action_previewFields.id];
                    let funcState: int = FuncOpenModel.instance.getFuncStateById(id);
                    if (funcState === ActionOpenState.open) {//功能开启推送 其中有活动预告里的活动 并且是开启的 抛事件
                        GlobalData.dispatcher.event(CommonEventType.ACTION_PREVIEW_UPDATE);
                        //这里判断如果功能开启时 不在挂机场景 需要等玩家经历挂场景后  弹
                        let type = SceneCfg.instance.getCfgById(SceneModel.instance.enterScene[EnterSceneFields.mapId])[sceneFields.type];
                        if (type === SceneTypeEx.common) {      // 挂机
                            // console.log("当前为挂机场景");
                            if (modules.scene.SceneModel.instance.isInMission) {
                                actionPreviewModel.instance._action_previewDate = shuju;
                                // console.log("当前为挂机场景 但是在天关副本中 记录数据");
                            } else {
                                WindowManager.instance.openDialog(WindowEnum.ACTION_PREVIEW_NEW_ALERT, shuju);
                            }
                        } else {
                            actionPreviewModel.instance._action_previewDate = shuju;
                            // console.log("有新功能开启 但是不在挂机场景 记录数据");
                        }
                        return;
                    }
                }
            }
        }

        public updateSceneState(): void {
            let funcState: int = FuncOpenModel.instance.getFuncStateById(ActionOpenId.actionPreviewEnter);
            if (funcState === ActionOpenState.open) {
                if (actionPreviewModel.instance.isNotAward()) {
                    WindowManager.instance.close(WindowEnum.ACTION_PREVIEW_PANEL);
                } else {
                    let type = SceneCfg.instance.getCfgById(SceneModel.instance.enterScene[EnterSceneFields.mapId])[sceneFields.type];
                    if (type === SceneTypeEx.common) {      // 挂机
                        WindowManager.instance.open(WindowEnum.ACTION_PREVIEW_PANEL);
                    }
                }
                return;
            }

        }

        private itemEffect(value: any): void {
            if (value) {
                let datas = value[0];
                let start = value[1];
                let heightP = value[2];
                if (datas == null) return;

                let icon = datas[action_previewFields.icon];
                let id = datas[action_previewFields.id];
                let spr: Point = actionPreviewModel.instance.getPosSprite(id);
                if (spr) {
                    let img = new Image();
                    let str = `assets/icon/ui/get_way/${icon}.png`;
                    img.skin = str;
                    img.anchorX = img.anchorY = 0.5;
                    let startX = start.x + img.width / 2;
                    let startY = start.y + img.height / 2;
                    img.pos(startX, startY);
                    LayerManager.instance.addToEffectLayer(img);
                    let viewWidth = CommonConfig.viewWidth;
                    let viewHeight = CommonConfig.viewHeight;
                    Point.TEMP.setTo(spr.x, spr.y);
                    LayerManager.instance.getLayerById(Layer.EFFECT_LAYER).globalToLocal(Point.TEMP);
                    let destinX = Point.TEMP.x;
                    let destinY = Point.TEMP.y;
                    TweenJS.create(img).to({ scaleX: 1.5, scaleY: 1.5 }, 400).onComplete((): void => {
                        TweenJS.create(img).to({ scaleX: 1.1, scaleY: 1.1 }, 400).onComplete((): void => {
                            TweenJS.create(img).to({
                                x: destinX,
                                y: destinY,
                                scaleX: 0.2,
                                scaleY: 0.2
                            }, 600).onComplete((): void => {
                                img.destroy(true);
                                if (modules.vip_new.VipNewModel.instance.isUp) {
                                    WindowManager.instance.open(WindowEnum.VIP_SVIP_UP_ALERT);
                                    modules.vip_new.VipNewModel.instance.isUp = false;
                                }
                                else {
                                    GlobalData.dispatcher.event(CommonEventType.ACTION_PREVIEW_ENTER);
                                }

                            }).start()
                        }).start()
                    }).start()
                } else {
                    console.log("功能预览目标点 该功能未注册点：  " + id);
                }
            }
        }
    }
}