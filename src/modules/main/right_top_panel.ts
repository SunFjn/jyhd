///<reference path="../mission/mission_model.ts"/>
///<reference path="../config/onhook_income_cfg.ts"/>
///<reference path="../common/custom_clip.ts"/>
///<reference path="../sprint_rank_task/sprint_rank_task_model.ts"/>
///<reference path="../sprint_rank/sprint_rank_model.ts"/>
///<reference path="../soaring_rank/soaring_rank_model.ts"/>
///<reference path="../config/sprint_rank_cfg.ts"/>
///<reference path="../sprint_rank/sprint_rank_ctrl.ts"/>
///<reference path="../config/action_open_cfg.ts"/>
///<reference path="../sweeping_income/sweeping_income_model.ts"/>
/** 主界面右上面板*/
///<reference path="../config/soaring_rank_cfg.ts"/>
///<reference path="../config/soaring_rank_task_cfg.ts"/>
///<reference path="../soaring_rank/soaring_rank_ctrl.ts"/>

namespace modules.main {
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import onhook_income = Configuration.onhook_income;
    import onhook_incomeFields = Configuration.onhook_incomeFields;
    import OnhookIncomeCfg = modules.config.OnhookIncomeCfg;
    import MissionModel = modules.mission.MissionModel;
    import RightTopViewUI = ui.RightTopViewUI;
    import Layer = ui.Layer;
    import SprintRankTaskModel = modules.sprint_rank.SprintRankTaskModel;
    import Event = Laya.Event;
    import SprintRankModel = modules.sprint_rank.SprintRankModel;
    import SoaringRankModel = modules.soaring_rank.SoaringRankModel;
    // import AvatarClip = modules.common.AvatarClip;
    import SprintRankCfg = modules.sprint_rank.SprintRankCfg;
    import sprint_rankFields = Configuration.sprint_rankFields;
    import SoaringRankCfg = modules.config.SoaringRankCfg;
    import feisheng_rankFields = Configuration.feisheng_rankFields;
    import SoaringRankCtrl = modules.soaring_rank.SoaringRankCtrl;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SprintRankCtrl = modules.sprint_rank.SprintRankCtrl;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import ActionOpenCfg = modules.config.ActionOpenCfg;
    import action_openFields = Configuration.action_openFields;
    import Point = Laya.Point;
    import CommonUtil = modules.common.CommonUtil;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;
    import SweepingIncomeModel = modules.sweeping_income.SweepingIncomeModel;
    import SceneModel = modules.scene.SceneModel;
    import SceneCfg = modules.config.SceneCfg;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import sceneFields = Configuration.sceneFields;
    import blendFields = Configuration.blendFields;
    import BaseItem = modules.bag.BaseItem;
    import Item = Protocols.Item;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import UpdateOccReply = Protocols.UpdateOccReply;
    import RenameModel = modules.rename.RenameModel;
    import UpdateOccReplyFields = Protocols.UpdateOccReplyFields;
    import SkeletonAvatar = modules.common.SkeletonAvatar;



    export class RightTopPanel extends RightTopViewUI {
        private _tween: TweenJS;
        private _modelClipTween: TweenJS;
        private _modeBaseImgTween: TweenJS;
        private _sModelClipTipsTween: TweenJS;

        private _soaringRankModeBaseImgTween: TweenJS;
        private _soaringRankMmodelClipTween: TweenJS;
        private _TipsModeBaselImgTween: TweenJS;
        private _skeleton: Laya.Skeleton

        private _rankName: string[] = [];
        private _skeletonClip: SkeletonAvatar;
        private _soaringRankSkeletonClip: SkeletonAvatar;
        private _sSkeletonClip: SkeletonAvatar;

        private _taskBase: Array<BaseItem>;
        //首充小弹窗 记录的时间戳

        private _curType: number;//打开时开服冲榜榜的活动类型
        private _curSoaringType: number;//打开时封神榜的活动类型
        constructor() {
            super();
            this._rankName.push("txt_mainui_xqb.png", "txt_mainui_lcb.png", "txt_mainui_sbb.png", "txt_mainui_xyb.png",
                "txt_mainui_xfb.png", "txt_mainui_zbb.png", "txt_mainui_zlb.png");
        }

        protected initialize(): void {
            super.initialize();
            this.right = 0;
            this.top = 128;
            this.layer = Layer.MAIN_UI_LAYER;
            this.closeByOthers = false;
            this._taskBase = [this.reward1, this.reward2, this.reward3];

            this._skeletonClip = SkeletonAvatar.createShow(this, this.rankOpenBtn);
            this._skeletonClip.y = 130;
            this._skeletonClip.visible = false;
            this._skeletonClip.scaleX = 0.4;
            this._skeletonClip.scaleY = 0.4;
            this._skeletonClip.anchorX = 0.5;
            this._skeletonClip.anchorY = 0.5;
            this._skeletonClip.centerX = 40;

            // 主界显示的模型
            this._soaringRankSkeletonClip = SkeletonAvatar.createShow(this, this.soaringRankOpenBtn);
            this._soaringRankSkeletonClip.y = 140;
            this._soaringRankSkeletonClip.visible = false;
            this._soaringRankSkeletonClip.anchorX = 0.5;
            this._soaringRankSkeletonClip.anchorY = 0.5;
            this._soaringRankSkeletonClip.scale(0.4, 0.4);
            this._soaringRankSkeletonClip.centerX = 0;

            // TipsBox 模型
            this._sSkeletonClip = SkeletonAvatar.createShow(this, this.TipsModeBaselImg);
            this._sSkeletonClip.y = 170;
            this._sSkeletonClip.anchorX = 0.5;
            this._sSkeletonClip.anchorY = 0.5;
            this._sSkeletonClip.centerX = 0;
            this._sSkeletonClip.visible = false;

            this.StatementHTML.color = "#585858";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 24;
            this.StatementHTML.style.align = "left";

            this.StatementHTML1.color = "#585858";
            this.StatementHTML1.style.fontFamily = "SimHei";
            this.StatementHTML1.style.fontSize = 24;
            this.StatementHTML1.style.align = "left";

            this.zOrder = 1;

            this.initEffectBg()
        }

        private initEffectBg() {
            if (this._skeleton) return;
            this._skeleton = new Laya.Skeleton();
            this._skeleton.pos(60, 55);
            this.effectBg.addChild(this._skeleton);
            this._skeleton.load("res/skeleton/other/fengshenbang.sk");
        }

        protected addListeners(): void {
            super.addListeners();
            this.rankOpenBtn.on(Event.CLICK, this, this.showRank);
            this.soaringRankOpenBtn.on(Event.CLICK, this, this.soaringRankOpenBtnHanler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MISSION_UPDATE_LV, this, this.updateLv);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SPRINT_RANK_UPDATE, this, this.updateRank);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SPRINT_RANK_TASK_UPDATE, this, this.updateRank);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RESIZE_UI, this, this.setActionPreviewPos);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ACTION_PREVIEW_RESIZE_UI, this, this.setActionPreviewPos);
            this.addAutoRegisteRedPoint(this.sprintRankRp, ["sprintRankRP"]);
            this.addAutoRegisteRedPoint(this.soaringSprintRankRp, ["soaringRankRP",
                "soaringCumulatePayRP",
                "soaringDayConsumeRewardRP",
                "soaringSinglePayRP",
                "soaringSpecialGiftRP",
                "soaringPanicBuyingGifRP"]);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_RANK_UPDATE, this, this.updateSoaringRank);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_RANK_ITEM_UPDATE, this, this.updateSoaringRank);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenGetSprintRankInfo);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_RANK_ITEM_UPDATE, this, this.getFeishengRankTaskInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_RANK_UPDATE, this, this.getFeishengRankTaskInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_RANK_ITEM_UPDATE, this, this.getFeishengRankAllInfo);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SWEEPING_INCOME, this, this.updateLv);//todo on
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MISSION_UPDATE, this, this.updateLv);//todo on



            this.addAutoListener(GlobalData.dispatcher, CommonEventType.CLOSE_TIPS_BANG, this, () => {
                this.TipsBox.visible = false;
            });//
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_RANK_CHANG, this, this.showFirstPayTipImgText);//todo on
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SPRING_RANK_CHANG, this, this.showFirstPayTipImgText);//todo on

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SPRINT_RANK_HUODONG_CHANG, this, this.startTips);//todo on
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_RANK_HUODONG_CHANG, this, this.startTips);//todo on

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RENAME_OCC_UPDATE, this, this.updateOcc);


            this.rankOpenBtn.on(Event.CLICK, this, this.showRank);

            this.addAutoListener(this.clikBtn, Event.CLICK, this, this.TipsBoxHandler);
            this.addAutoListener(this.colseTipBtn, Event.CLICK, this, this.colseTipBtnHandler);


            this.addAutoListener(this.TipsTextBgImg, Event.CLICK, this, this.TipsBoxHandlerText);
            this.addAutoListener(this.colseTiprTextBtn, Event.CLICK, this, this.colseTipBtnHandlerText);
            //模型展示tip 相关


        }

        public getFeishengRankTaskInfo() {
            SoaringRankCtrl.instance.getFeishengRankTaskInfo();
        }

        public getFeishengRankAllInfo() {
            SoaringRankCtrl.instance.getFeishengRankAllInfo();
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.rankOpenBtn.off(Event.CLICK, this, this.showRank);
            this.soaringRankOpenBtn.off(Event.CLICK, this, this.soaringRankOpenBtnHanler);
        }

        protected onOpened(): void {
            super.onOpened();

            this._curType = 0;
            this._curSoaringType = 0;

            SprintRankCtrl.instance.getSprintRankBaseInfo();
            this.updateRank();
            this.updateSoaringRank();
            //this.modeBaselImg.y = 34;
            this.soaringModeBaselImg.y = 34;
            this.left = 0;
            if (this._tween) this._tween.stop();
            this._tween = TweenJS.create(this).to({ left: 0 }, CommonConfig.panelTweenDuration).onComplete(() => {
                GlobalData.dispatcher.event(CommonEventType.ACTION_PREVIEW_RESIZE_UI);
            }).start();
            this.setActionPreviewPos();
            this.startTips();
            this.updateLv();

            // 微信进行屏幕适配
            // if (Main.instance.isWXChannel) {
            //     this.y = 112;
            // }
        }

        public startTips() {
            RightTopModel.instance;
            this.TipShow();
            this.TipShowText();
        }
        public funOpenGetSprintRankInfo(ID: Array<number>): void {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.soaringRank) {
                    this.updateSoaringRank();
                } else if (element == ActionOpenId.sprintRank) {
                    this.updateRank();
                }
            }
        }

        /**
         * 存储对应功能预览 对应的飞入点
         */
        public setActionPreviewPos() {
            // Laya.timer.clear(this, this.setPosActionPreview);
            // Laya.timer.once(200, this, this.setPosActionPreview);
            this.callLater(this.setPosActionPreview);
        }

        public setPosActionPreview() {
            Point.TEMP.setTo(this.rankOpenBtn.width / 2, this.rankOpenBtn.height / 2);
            let pos = this.rankOpenBtn.localToGlobal(Point.TEMP, true);
            modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.sprintRankEnter, pos);
            modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.sprintRank2, pos);
            modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.sprintRank3, pos);
            modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.sprintRank4, pos);
            modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.sprintRank5, pos);
            modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.sprintRank6, pos);
            modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.sprintRank7, pos);

            Point.TEMP.setTo(this.bg.width / 2, this.bg.height / 2);
            let pos1 = this.bg.localToGlobal(Point.TEMP, true);
            //离线收益增加 弹窗 的目标点
            modules.action_preview.actionPreviewModel.instance._posSprite.set(specialAniPoin.offLine, pos1);
        }


        public close(): void {
            this._tween.stop();
            this._tween = TweenJS.create(this).to({ Left: 0 }, CommonConfig.panelTweenDuration).onComplete((): void => {
                super.close();
            }).start();

            if (this._modelClipTween) {
                this._modelClipTween.stop();
                this._modelClipTween = null;
            }
            if (this._sModelClipTipsTween) {
                this._sModelClipTipsTween.stop();
                this._sModelClipTipsTween = null;
            }
            if (this._TipsModeBaselImgTween) {
                this._TipsModeBaselImgTween.stop();
                this._TipsModeBaselImgTween = null;
            }
            if (this._modeBaseImgTween) {
                this._modeBaseImgTween.stop();
            }
            if (this._soaringRankModeBaseImgTween) {
                this._soaringRankModeBaseImgTween.stop();
                // this._soaringRankModeBaseImgTween = null;
            }
            if (this._soaringRankMmodelClipTween) {
                this._soaringRankMmodelClipTween.stop();
                this._soaringRankMmodelClipTween = null;
            }
            Laya.timer.clear(this, this.activityHandler);
            Laya.timer.clear(this, this.soaringRankactivityHandler);

            Laya.timer.clear(this, this.firstPayTipImgTime);
            Laya.timer.clear(this, this.firstChaoGuo);
            Laya.timer.clear(this, this.chongZhi);
            Laya.timer.clear(this, this.firstPayTipImgTimeText);
            Laya.timer.clear(this, this.firstChaoGuoText);
            Laya.timer.clear(this, this.chongZhiText);

            this._curType = 0;
            this._curSoaringType = 0;
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }
            if (this._modelClipTween) {
                this._modelClipTween.stop();
                this._modelClipTween = null;
            }
            if (this._sModelClipTipsTween) {
                this._sModelClipTipsTween.stop();
                this._sModelClipTipsTween = null;
            }
            if (this._TipsModeBaselImgTween) {
                this._TipsModeBaselImgTween.stop();
                this._TipsModeBaselImgTween = null;
            }
            if (this._modeBaseImgTween) {
                this._modeBaseImgTween.stop();
                this._modeBaseImgTween = null;
            }
            if (this._soaringRankModeBaseImgTween) {
                this._soaringRankModeBaseImgTween.stop();
                this._soaringRankModeBaseImgTween = null;
            }
            if (this._soaringRankMmodelClipTween) {
                this._soaringRankMmodelClipTween.stop();
                this._soaringRankMmodelClipTween = null;
            }
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            if (this._soaringRankSkeletonClip) {
                this._soaringRankSkeletonClip.removeSelf();
                this._soaringRankSkeletonClip.destroy();
                this._soaringRankSkeletonClip = null;
            }
            if (this._sSkeletonClip) {
                this._sSkeletonClip.removeSelf();
                this._sSkeletonClip.destroy();
                this._sSkeletonClip = null;
            }
            super.destroy(destroyChild);
        }

        private updateLv(): void {
            let incomeCfg: onhook_income = OnhookIncomeCfg.instance.getIncomeCfgByLv(MissionModel.instance.curLv);
            if (!incomeCfg) incomeCfg = OnhookIncomeCfg.instance.getIncomeCfgByLv(MissionModel.instance.curLv - 1);
            if (!incomeCfg) return;
            let coinIncome = sweeping_income.SweepingIncomeModel.instance.coinImcome;
            let exeIncome = sweeping_income.SweepingIncomeModel.instance.exeImcome;
            // console.log("coinIncome = " + coinIncome);
            // console.log("exeIncome = " + exeIncome);
            this.coinTxt.text = `${coinIncome}/小时`;//todo fix
            this.expTxt.text = `${exeIncome}/小时`;

            // this.coinTxt.text = `${incomeCfg[onhook_incomeFields.coin]}/小时`;//todo old
            // this.expTxt.text = `${incomeCfg[onhook_incomeFields.exp]}/小时`;

        }

        private updateRank(): void {
            let state: number = SprintRankModel.instance.openState;
            if (FuncOpenModel.instance.getFuncStateById(ActionOpenId.sprintRank) === ActionOpenState.show) {
                this.rankOpenBtn.visible = true;
            } else if (FuncOpenModel.instance.getFuncStateById(ActionOpenId.sprintRank) === ActionOpenState.open) {
                this.rankOpenBtn.visible = state == 1;
            } else {
                this.rankOpenBtn.visible = false;
            }
            let name: string = SprintRankModel.instance.firstName;
            let isUpDateMOXingOrTuPian = false;
            if (this._curType == 0) {
                this._curType = SprintRankTaskModel.instance.curType;
                isUpDateMOXingOrTuPian = true;
            }
            else {
                if (this._curType != SprintRankTaskModel.instance.curType) {
                    isUpDateMOXingOrTuPian = true;
                }
            }
            this.OneName.text = name ? name : "虚位以待";
            if (SprintRankModel.instance.curType == 0) return;
            let _rankCfg = SprintRankCfg.instance.getCfgsByGrade(SprintRankModel.instance.curType, 0);
            let isModel = _rankCfg[sprint_rankFields.isModel];
            let isMove = _rankCfg[sprint_rankFields.isMove];
            let imageId: number = _rankCfg[sprint_rankFields.imageId];
            let isModelRuKou: number = _rankCfg[sprint_rankFields.isModelRuKou];
            let isMoveRuKou: number = _rankCfg[sprint_rankFields.isMoveRuKou];
            let reward: Array<Items> = _rankCfg[sprint_rankFields.reward];
            let showId: number = _rankCfg[feisheng_rankFields.showId];
            this.showTipsUI(0, SprintRankModel.instance.curType, reward);
            this.showTipsTextUI(0);
            if (isUpDateMOXingOrTuPian) {
                if (this._modeBaseImgTween) {
                    this._modeBaseImgTween.stop();
                }
                if (this._TipsModeBaselImgTween) {
                    this._TipsModeBaselImgTween.stop();
                }
                if (isModelRuKou == 2) {
                    this.modelImg.skin = `assets/icon/ui/sprint_rank/${imageId}.png`;//图片路径
                    this.modelImg.visible = true;
                    if (showId) {
                        this.TipsModelImg.skin = `assets/icon/ui/sprint_rank/${showId}.png`;//图片路径
                    }
                    else {
                        this.TipsModelImg.skin = `assets/icon/ui/sprint_rank/${imageId}.png`;//图片路径
                    }
                    this.TipsModelImg.visible = true;
                    this.TipsModeBaselImg.y = 22;
                    if (isMoveRuKou == 1) {

                    }
                } else {
                    this.modelImg.visible = false;
                    this.TipsModelImg.visible = false;
                    this.showModelClip(imageId, isModelRuKou, isMoveRuKou);
                    if (this._skeletonClip) {
                        this._skeletonClip.visible = true;
                    }
                    if (this._sSkeletonClip) {
                        this._sSkeletonClip.visible = true;
                    }
                }
            }


            this.rankImag.skin = `right_top/${this._rankName[SprintRankModel.instance.curType - 1]}`;
            this.setActivitiTime();
        }

        /**
         * 显示入口模型
         */
        public showModelClip(_pitchId: number, _isModelRuKou: number, isMove: number) {
            if (this._modelClipTween) {
                this._modelClipTween.stop();
            }
            if (this._sModelClipTipsTween) {
                this._sModelClipTipsTween.stop();
            }

            let typeNum = Math.round(_pitchId / 1000);
            if (typeNum === 90) {     // 时装，根据玩家性别判断
                _pitchId = _pitchId - _pitchId % 10 + PlayerModel.instance.occ;
            }
            let modelCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(_pitchId);
            // this._modelClip.y = 130;
            // this._sModelClipTips.y = 220;
            this._skeletonClip.y = 130;
            this._sSkeletonClip.y = 260;
            this._sSkeletonClip.clearAllResetParams(ClearSkeletonParamsEnum.All)

            if (_isModelRuKou == 1) {
                if (typeNum == 9 || typeNum == 10) {//法阵
                 
                }
            } else {

                if (typeNum == 11) {//鬼神之力
                    this._sSkeletonClip.reset(0, 0, 0, 0, 0, _pitchId);
                    this._skeletonClip.reset(0, 0, 0, 0, 0, _pitchId);
                } else {
                    this._sSkeletonClip.reset(_pitchId);
                    this._skeletonClip.reset(_pitchId);
                }
                if (typeNum == 2) {  //宠物
                    this._skeletonClip.x = 60;
                    this._skeletonClip.y = 150;
                    this._skeletonClip.resetScale(AvatarAniBigType.clothes, 0.7);
                } else if (typeNum == 3) {//翅膀
                    this._skeletonClip.x = 75;
                    this._skeletonClip.y = 140;
                } else if (typeNum == 4) {//精灵
                    this._skeletonClip.x = 90;
                    this._skeletonClip.y = 150;
                    this._skeletonClip.resetScale(AvatarAniBigType.clothes, 0.7);
                } else if (typeNum == 5) {//幻武
                    this._skeletonClip.x = 70;
                    this._skeletonClip.y = 120;
                    this._skeletonClip.resetScale(AvatarAniBigType.clothes, 1);
                } else if (typeNum == 90) { //时装
                    this._sSkeletonClip.resetScale(AvatarAniBigType.clothes, 0.3);
                    this._skeletonClip.resetScale(AvatarAniBigType.clothes, 0.7);
                    this._skeletonClip.x = 75;
                } else if (typeNum == 11) { //灵珠
                    if (this._skeletonClip) {
                        this._skeletonClip.x = 75;
                        this._skeletonClip.y = 190;
                        this._skeletonClip.resetScale(AvatarAniBigType.clothes, 0.8);
                    }
                    this._skeletonClip.y = 185;
                    if (this._sSkeletonClip) {
                        this._sSkeletonClip.playAnim(AvatarAniBigType.clothes, ActionType.SHOW)
                    }
                    this._sSkeletonClip.y = 420;
                } else {

                }
            }
            let ID = (_pitchId / 1000) >> 0;
            if (isMove == 1) {
                
            }
        }


        private setActivitiTime(): void {
            if (SprintRankModel.instance.restTm >= GlobalData.serverTime) {
                this.activityText.visible = true;
                this.overText.visible = false;
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.activityText.visible = false;
                this.overText.visible = true;
            }
        }

        private activityHandler(): void {
            this.activityText.text = `${CommonUtil.timeStampToHHMMSS(SprintRankModel.instance.restTm)}`;
            if (SprintRankModel.instance.restTm < GlobalData.serverTime) {
                this.activityText.visible = false;
                Laya.timer.clear(this, this.activityHandler);
                this.activityText.visible = false;
                this.overText.visible = true;
            }
        }

        private showRank(): void {
            if (!FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.sprintRank)) {
                SystemNoticeManager.instance.addNotice(FuncOpenModel.instance.getFuncOpenTipById(ActionOpenId.sprintRank), true);
                return;
            }
            switch (SprintRankModel.instance.curType) {
                case 1:
                    WindowManager.instance.open(WindowEnum.SPRINT_RANKTASK_XIANQI_PANEL);
                    break;
                case 2:
                    WindowManager.instance.open(WindowEnum.SPRINT_RANKTASK_LINGCHONG_PANEL);
                    break;
                case 3:
                    WindowManager.instance.open(WindowEnum.SPRINT_RANKTASK_SHENBING_PANEL);
                    break;
                case 4:
                    WindowManager.instance.open(WindowEnum.SPRINT_RANKTASK_XIANYI_PANEL);
                    break;
                case 5:
                    WindowManager.instance.open(WindowEnum.SPRINT_RANKTASK_FABAO_PANEL);
                    break;
                case 6:
                    WindowManager.instance.open(WindowEnum.SPRINT_RANKTASK_EQUIPMENT_PANEL);
                    break;
                case 7:
                    WindowManager.instance.open(WindowEnum.SPRINT_RANKTASK_FIGHTING_PANEL);
                    break;
            }
        }

        //....................封神榜 入口............................................
        private updateSoaringRank(): void {
            if (FuncOpenModel.instance.getFuncStateById(ActionOpenId.soaringRank) === ActionOpenState.show) {
                this.soaringRankOpenBtn.visible = true;
            } else if (FuncOpenModel.instance.getFuncStateById(ActionOpenId.soaringRank) === ActionOpenState.open) {
                this.soaringRankOpenBtn.visible = true;
            } else {
                this.soaringRankOpenBtn.visible = false;
            }

            let name: string = SoaringRankModel.instance.firstName;
            this.soaringOneName.text = name ? name : "虚位以待";
            let isUpDateMOXingOrTuPian = false;
            if (this._curSoaringType == 0) {
                this._curSoaringType = SoaringRankModel.instance.curType;
                isUpDateMOXingOrTuPian = true;
            }
            else {
                if (this._curSoaringType != SoaringRankModel.instance.curType) {
                    isUpDateMOXingOrTuPian = true;
                }
            }
            if (SoaringRankModel.instance.curType == 0) return;
            let _rankCfg = SoaringRankCfg.instance.getCfgsByGrade(SoaringRankModel.instance.curType, 0);
            let isModel = _rankCfg[feisheng_rankFields.isModel];
            let isMove = _rankCfg[feisheng_rankFields.isMove];
            let imageId: number = _rankCfg[feisheng_rankFields.imageId];
            let isModelRuKou: number = _rankCfg[feisheng_rankFields.isModelRuKou];
            let isMoveRuKou: number = _rankCfg[feisheng_rankFields.isMoveRuKou];
            let reward: Array<Items> = _rankCfg[feisheng_rankFields.reward];
            let showId: number = _rankCfg[feisheng_rankFields.showId];
            this.showTipsUI(1, SoaringRankModel.instance.curType, reward);
            this.showTipsTextUI(1);
            if (isUpDateMOXingOrTuPian) {
                if (this._soaringRankModeBaseImgTween) {
                    this._soaringRankModeBaseImgTween.stop();
                }
                if (this._TipsModeBaselImgTween) {
                    this._TipsModeBaselImgTween.stop();
                }
                if (isModelRuKou == 2) {
                    this.soaringModelImg.skin = `assets/icon/ui/sprint_rank/${imageId}.png`;//图片路径
                    this.soaringModelImg.visible = true;
                    if (showId) {
                        this.TipsModelImg.skin = `assets/icon/ui/sprint_rank/${showId}.png`;//图片路径
                    }
                    else {
                        this.TipsModelImg.skin = `assets/icon/ui/sprint_rank/${imageId}.png`;//图片路径
                    }

                    this.TipsModelImg.visible = true;
                    this.soaringModeBaselImg.y = 34;
                    this.TipsModeBaselImg.y = 22;
                    if (isMoveRuKou == 1) {
                        if (this._soaringRankSkeletonClip) {
                            this._soaringRankSkeletonClip.visible = false;
                        }
                        if (this._sSkeletonClip) {
                            this._sSkeletonClip.visible = false;
                        }
                    }

                } else {
                    this.soaringModelImg.visible = false;
                    this.TipsModelImg.visible = false;
                    this.soaringRankModelClip(imageId, isModelRuKou, isMoveRuKou);
                    if (this._soaringRankSkeletonClip) {
                        this._soaringRankSkeletonClip.visible = true;
                    } if (this._sSkeletonClip) {
                        this._sSkeletonClip.visible = true;
                    }
                }
            }
            this.soaringRanksetActivitiTime();
        }

        public soaringRankModelClip(_pitchId: number, _isModelRuKou: number, isMove: number) {
            if (this._soaringRankMmodelClipTween) {
                this._soaringRankMmodelClipTween.stop();
            }
            if (this._sModelClipTipsTween) {
                this._sModelClipTipsTween.stop();
            }

            let typeNum = Math.round(_pitchId / 1000);
            if (typeNum === 90) {     // 时装根据性别取
                _pitchId = _pitchId - _pitchId % 10 + PlayerModel.instance.occ;
            }

            let modelCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(_pitchId);
            // this._soaringRankModelClip.y = 130;
            // this._sModelClipTips.y = 220;
            this._soaringRankSkeletonClip.y = 140;
            this._sSkeletonClip.y = 260;

            if (_isModelRuKou == 1) {
                if (typeNum == 9 || typeNum == 10) {//法阵
                }
            } else {
                if (typeNum == 11) {//鬼神之力
                    this._soaringRankSkeletonClip.reset(0, 0, 0, 0, 0, _pitchId);
                    this._sSkeletonClip.reset(0, 0, 0, 0, 0, _pitchId);
                } else {
                    this._soaringRankSkeletonClip.reset(_pitchId);
                    this._sSkeletonClip.reset(_pitchId);
                }

                if (typeNum == 2) {  //宠物
                    // this._sModelClipTips.y = 200;
                    this._soaringRankSkeletonClip.resetScale(AvatarAniBigType.clothes, 0.7);
                    this._sSkeletonClip.resetScale(AvatarAniBigType.clothes, 0.7);
                    this._sSkeletonClip.y = 240;
                } else if (typeNum == 3) {//翅膀
                } else if (typeNum == 4) {//精灵
                    this._soaringRankSkeletonClip.resetScale(AvatarAniBigType.clothes, 0.7);
                    this._sSkeletonClip.resetScale(AvatarAniBigType.clothes, 0.7);
                } else if (typeNum == 5) {//幻武
                    this._sSkeletonClip.x = 115;
                    this._sSkeletonClip.y = 280;
                    this._soaringRankSkeletonClip.x = 65;
                    this._soaringRankSkeletonClip.y = 135;
                } else if (typeNum == 90) { //时装
                    this._soaringRankSkeletonClip.resetScale(AvatarAniBigType.clothes, 0.8);
                    this._sSkeletonClip.resetScale(AvatarAniBigType.clothes, 0.8);
                    // this._soaringRankModelClip.scale(1.5, 1.5);
                    // this._soaringRankModelClip.y = 130;
                    // this._sModelClipTips.scale(1.5, 1.5);
                    // this._sModelClipTips.y = 220;
                } else if (typeNum == 11) { //灵珠
                    this._soaringRankSkeletonClip.resetScale(AvatarAniBigType.tianZhu, 0.3);
                    this._soaringRankSkeletonClip.resetScale(AvatarAniBigType.clothes, 0.3);
                    if (this._soaringRankSkeletonClip) {
                        this._soaringRankSkeletonClip.playAnim(AvatarAniBigType.clothes, ActionType.SHOW)
                    }
                    this._soaringRankSkeletonClip.y = 190;
                    if (this._sSkeletonClip) {
                        this._sSkeletonClip.playAnim(AvatarAniBigType.clothes, ActionType.SHOW)
                    }
                    this._sSkeletonClip.y = 420;
                }
                else if (typeNum == 8) {//Npc
                }
                else {
                }
            }
            if (isMove == 1) {
                
            }
        }

        private soaringRanksetActivitiTime(): void {
            let isOpen = FuncOpenModel.instance.getFuncStateById(ActionOpenId.soaringRank) === ActionOpenState.open;
            if (SoaringRankModel.instance.restTm >= GlobalData.serverTime && isOpen && SoaringRankModel.instance.endFlag == 0) {
                this.soaringActivityText.visible = true;
                this.soaringOverText.visible = false;
                this.soaringRankactivityHandler();
                Laya.timer.loop(1000, this, this.soaringRankactivityHandler);
            } else {
                this.soaringActivityText.visible = false;
                this.soaringOverText.visible = true;
            }
        }

        private soaringRankactivityHandler(): void {
            this.soaringActivityText.text = `${CommonUtil.timeStampToHHMMSS(SoaringRankModel.instance.restTm)}`;
            if (SoaringRankModel.instance.restTm < GlobalData.serverTime) {
                this.soaringActivityText.visible = false;
                Laya.timer.clear(this, this.soaringRankactivityHandler);
                this.soaringActivityText.visible = false;
                this.soaringOverText.visible = true;
            }
        }

        private soaringRankOpenBtnHanler(): void {
            let bolll = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.soaringRank);
            if (!bolll) {
                SystemNoticeManager.instance.addNotice(FuncOpenModel.instance.getFuncOpenTipById(ActionOpenId.soaringRank), true);
                return;
            }
            let isSubfunction: number = ActionOpenCfg.instance.getCfgById(ActionOpenId.soaringRank)[action_openFields.isSubfunction];
            if (isSubfunction) {
                WindowManager.instance.openByActionId(ActionOpenId.soaringRank);
            } else {
                BottomTabCtrl.instance.openTabByFunc(ActionOpenId.soaringRank);
            }
            // WindowManager.instance.open(WindowEnum.SOARING_RANK_PANEL);
        }

        //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        public TipShow() {

            Laya.timer.clear(this, this.firstPayTipImgTime);
            Laya.timer.clear(this, this.firstChaoGuo);
            Laya.timer.clear(this, this.chongZhi);
            this.TipsBox.visible = false;
            let timeList = RightTopModel.instance.getTimeList(0);
  
            let chaZhiNum = GlobalData.serverTime - RightTopModel.instance._lastTime;
            //如果回到挂机场景 间隔时间大于所配的显示间隔 重置为  当前服务器时间-间隔 的时间戳
            if (chaZhiNum > timeList[2]) {
                RightTopModel.instance._lastTime = GlobalData.serverTime - timeList[2];
                Laya.timer.loop(1000, this, this.firstChaoGuo);
                this.firstChaoGuo();
                return;
            } else {
                Laya.timer.loop(1000, this, this.firstPayTipImgTime);
                this.firstPayTipImgTime();
                return;
            }
        }
        public firstChaoGuo() {
            let timeList = RightTopModel.instance.getTimeList(0);
            let chaZhiNum = GlobalData.serverTime - RightTopModel.instance._lastTime;
            if (chaZhiNum >= timeList[2] + timeList[0]) {
                Laya.timer.clear(this, this.firstChaoGuo);
                this.showFirstPayTipImg();
            }
        }

        public firstPayTipImgTime() {
            let timeList = RightTopModel.instance.getTimeList(0);
            let chaZhiNum = GlobalData.serverTime - RightTopModel.instance._lastTime;
            if (chaZhiNum >= timeList[2]) {
                Laya.timer.clear(this, this.firstPayTipImgTime);
                this.showFirstPayTipImg();
            }
        }

        public showFirstPayTipImg() {
            let bollll = RightTopModel.instance.getState();
            if (!bollll) {
                return;
            }
            let timeList = RightTopModel.instance.getTimeList(0);
            this.firstPayTipImgVisble(true);
            RightTopModel.instance._isshouci = false;
            RightTopModel.instance._lastTime = GlobalData.serverTime;
            Laya.timer.once(timeList[1], this, this.chongZhi);
        }
        public chongZhi() {
            this.firstPayTipImgVisble(false);
            let bollll = RightTopModel.instance.getState();
            if (!bollll) {
                Laya.timer.clear(this, this.firstPayTipImgTimeText);
                Laya.timer.clear(this, this.firstChaoGuoText);
                Laya.timer.clear(this, this.chongZhiText);
                return;
            }
            this.TipShow();
        }
        private TipsBoxHandler(): void {
            this.firstPayTipImgVisble(false);
            if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.sprintRank)) {
                this.showRank();
            }
            else {
                this.soaringRankOpenBtnHanler();
            }
        }
        private colseTipBtnHandler(): void {
            this.firstPayTipImgVisble(false);
        }
        public firstPayTipImgVisble(vis: boolean) {
            if (!this.TipsTextBox.visible) {
                this.TipsBox.visible = vis;
            }
            //关闭首充弹框
            if (vis) {
                GlobalData.dispatcher.event(CommonEventType.CLOSE_TIPS_SHOUCHONG);
            }
        }
        //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        public TipShowText() {
            Laya.timer.clear(this, this.firstPayTipImgTimeText);
            Laya.timer.clear(this, this.firstChaoGuoText);
            Laya.timer.clear(this, this.chongZhiText);
            this.TipsTextBox.visible = false;
            let timeList = RightTopModel.instance.getTimeList(1);
            let type = SceneCfg.instance.getCfgById(SceneModel.instance.enterScene[EnterSceneFields.mapId])[sceneFields.type];
    
            let chaZhiNum = GlobalData.serverTime - RightTopModel.instance._lastTime1;
            //如果回到挂机场景 间隔时间大于所配的显示间隔 重置为  当前服务器时间-间隔 的时间戳
            if (chaZhiNum > timeList[2]) {
                RightTopModel.instance._lastTime1 = GlobalData.serverTime - timeList[2];
                Laya.timer.loop(1000, this, this.firstChaoGuoText);
                this.firstChaoGuoText();
                return;
            } else {
                Laya.timer.loop(1000, this, this.firstPayTipImgTimeText);
                this.firstPayTipImgTimeText();
                return;
            }
        }
        public firstChaoGuoText() {
            let timeList = RightTopModel.instance.getTimeList(1);
            let chaZhiNum = GlobalData.serverTime - RightTopModel.instance._lastTime1;
            if (chaZhiNum >= timeList[2] + timeList[0]) {
                Laya.timer.clear(this, this.firstChaoGuoText);
                this.showFirstPayTipImgText(true);
            }
        }

        public firstPayTipImgTimeText() {
            let timeList = RightTopModel.instance.getTimeList(1);
            let chaZhiNum = GlobalData.serverTime - RightTopModel.instance._lastTime1;
            if (chaZhiNum >= timeList[2]) {
                Laya.timer.clear(this, this.firstPayTipImgTimeText);

                this.showFirstPayTipImgText(true);
            }
        }


        /**
         * changTextTips
         */
        public changTextTips() {

        }
        public showFirstPayTipImgText(bos: boolean = false) {

            let state: number = modules.sprint_rank.SprintRankModel.instance.openState;
            let restTm: number = modules.sprint_rank.SprintRankModel.instance.restTm;
            let endFlag: number = modules.soaring_rank.SoaringRankModel.instance.endFlag;/*活动结束标志 0开启中 1结束*/
            let bollll = restTm >= GlobalData.serverTime
            let isOne = false;
            let isTwo = false;
            if (modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.sprintRank) && state == 1 && restTm != 0 && bollll) {
                this.showTipsTextUI(0);
                isOne = modules.sprint_rank.SprintRankModel.instance.myOne();
                isTwo = modules.sprint_rank.SprintRankModel.instance.isTwo();
            }
            else if (modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.soaringRank) && endFlag == 0) {
                this.showTipsTextUI(1);
                isOne = modules.soaring_rank.SoaringRankModel.instance.myOne();
                isTwo = modules.soaring_rank.SoaringRankModel.instance.isTwo();
            }
            else {
                return;
            }
            if (RightTopModel.instance._isCloseShouDong) {
                return;
            }
            if (isOne) {
                if (bos) {
                    return
                }
                else {
                    if (!isTwo) {
                        return;
                    }
                }

            }

            let timeList = RightTopModel.instance.getTimeList(1);
            this.firstPayTipImgVisbleText(true);
            RightTopModel.instance._isshouci1 = false;
            RightTopModel.instance._lastTime1 = GlobalData.serverTime;
            Laya.timer.once(timeList[1], this, this.chongZhiText);
        }
        public chongZhiText() {
            this.firstPayTipImgVisbleText(false);
            let bollll = RightTopModel.instance.getState();
            if (!bollll) {
                Laya.timer.clear(this, this.firstPayTipImgTimeText);
                Laya.timer.clear(this, this.firstChaoGuoText);
                Laya.timer.clear(this, this.chongZhiText);
                return;
            }
            this.TipShowText();
        }
        private TipsBoxHandlerText(): void {
            this.firstPayTipImgVisbleText(false);
            if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.sprintRank)) {
                this.showRank();
            }
            else {
                this.soaringRankOpenBtnHanler();
            }
        }
        private colseTipBtnHandlerText(): void {
            this.firstPayTipImgVisbleText(false);
            RightTopModel.instance.closeTipsShouDongHar();
        }
        public firstPayTipImgVisbleText(vis: boolean) {
            this.TipsTextBox.visible = vis;
            if (vis) {
                this.TipsBox.visible = false; //关闭模型tips
            }
        }


        public showTipsUI(type: number, parm: number, rewards: Array<Items>) {
            this.fingClip.value = `` + RightTopModel.instance.getZhanLiByType(type, parm);
            if (type == 0) {
                this.tipsImg.skin = `right_top/KF${parm}.png`;
            }
            else {
                this.tipsImg.skin = `right_top/FS${parm}.png`;
            }
            for (var index = 0; index < this._taskBase.length; index++) {
                let element = this._taskBase[index];
                element.visible = false;
            }
            //这里根据 名次 去拿对应的奖励和上榜条件
            let allAward = new Array<BaseItem>();
            for (var index = 0; index < rewards.length; index++) {
                let element = rewards[index];
                let _taskBase: BaseItem = this._taskBase[index];
                if (_taskBase) {
                    _taskBase.dataSource = [rewards[index][ItemsFields.itemId], rewards[index][ItemsFields.count], 0, null];
                    _taskBase.visible = true;
                    _taskBase.nameVisible = false;
                    allAward.push(_taskBase);
                }
            }
            //居中适配 奖励
            let lengNum = allAward.length * (100 * 0.5) + (allAward.length - 1) * 10;
            let startPosX = (this.TipsBox.width - lengNum) / 2;
            for (let index = 0; index < allAward.length; index++) {
                let element = allAward[index];
                element.x = startPosX;
                startPosX += (element.width * 0.5) + 10;
            }
        }

        public showTipsTextUI(type: number) {
            let shuju = null;
            if (type == 0) {
                shuju = modules.sprint_rank.SprintRankModel.instance.getTipsInfo();
            }
            else {
                shuju = modules.soaring_rank.SoaringRankModel.instance.getTipsInfo();
            }
            if (shuju) {
                this.StatementHTML.visible = true;;
                this.StatementHTML1.visible = true;;
                this.StatementHTML.innerHTML = shuju[0];
                this.StatementHTML1.innerHTML = shuju[1];
                if (!shuju[1]) {
                    this.StatementHTML1.visible = false;
                }
                let maxW = this.StatementHTML.contextWidth;
                if (this.StatementHTML1.contextWidth > maxW) {
                    maxW = this.StatementHTML1.contextWidth;
                }
            }
        }

        private updateOcc(): void {
            let info: UpdateOccReply = RenameModel.instance.updateOccReply;
            if (info && info[UpdateOccReplyFields.roleID] === PlayerModel.instance.actorId) {
                this.updateRank();
                this.updateSoaringRank();
            }
        }
    }
}
