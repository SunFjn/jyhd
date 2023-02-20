///<reference path="../notice/system_notice_manager.ts"/>
///<reference path="../notice/drop_notice_manager.ts"/>
///<reference path="../task/task_model.ts"/>
///<reference path="../notice/server_broadcast_manager.ts"/>
///<reference path="../notice/item_notice_manager.ts"/>
///<reference path="../func_open/func_open_model.ts"/>
///<reference path="../config/task_cfg.ts"/>
///<reference path="../config/first_pay_cfg.ts"/>
///<reference path="../config/action_open_cfg.ts"/>
///<reference path="../exercise/exercise_model.ts"/>
///<reference path="../month_card/month_card_model.ts"/>
///<reference path="../config/scene_copy_tianguan_cfg.ts"/>
///<reference path="../mission/mission_ctrl.ts"/>
///<reference path="../first_pay/first_pay_model.ts"/>
///<reference path="../day_pay/day_pay_model.ts"/>
///<reference path="../cumulate_pay/cumulate_pay_model.ts"/>
///<reference path="../config/blend_cfg.ts"/>
///<reference path="../fight_talisman/fight_talisman_model.ts"/>
///<reference path="../money_cat/money_cat_model.ts"/>
///<reference path="../gloves/gloves_model.ts"/>
///<reference path="../one_buy/one_buy_model.ts"/>
///<reference path="../cumulatePay_tianZhu/cumulatePay_tianZhu_model.ts"/>
///<reference path="../seven_activity/seven_activity_model.ts"/>

/** 主界面左下面板*/
namespace modules.main {
    import GlobalData = modules.common.GlobalData;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import LeftBottomViewUI = ui.LeftBottomViewUI;
    import Layer = ui.Layer;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import scene_copy_tianguan = Configuration.scene_copy_tianguan;
    import MissionModel = modules.mission.MissionModel;
    import SceneCopyTianguanCfg = modules.config.SceneCopyTianguanCfg;
    import scene_copy_tianguanFields = Configuration.scene_copy_tianguanFields;
    import MissionCtrl = modules.mission.MissionCtrl;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import FirstPayModel = modules.first_pay.FirstPayModel;
    import FirstPayCfg = modules.config.FirstPayCfg;
    import first_payFields = Configuration.first_payFields;
    import first_pay = Configuration.first_pay;
    import PlayerModel = modules.player.PlayerModel;
    import DayPayModel = modules.day_pay.DayPayModel;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    // import AvatarClip = modules.common.AvatarClip;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import CustomClip = modules.common.CustomClip;
    import Point = Laya.Point;
    import CommonUtil = modules.common.CommonUtil;
    import TeamBattleModel = modules.teamBattle.TeamBattleModel;
    import FightTalismanModel = modules.fight_talisman.FightTalismanModel;
    import MoneyCatModel = modules.money_cat.MoneyCatModel;
    import GetGauntletReply = Protocols.GetGauntletReply;
    import GlovesModel = modules.gloves.GlovesModel;
    import GetGauntletReplyFields = Protocols.GetGauntletReplyFields;
    import LayaEvent = modules.common.LayaEvent;
    import OneBuyModel = modules.one_buy.OneBuyModel;
    import CumulatePayTianZhuModel = modules.cumulatePay_tianZhu.CumulatePayTianZhuModel;
    import action_openFields = Configuration.action_openFields;
    import action_open = Configuration.action_open;
    import ActionOpenCfg = modules.config.ActionOpenCfg;
    import SceneModel = modules.scene.SceneModel;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import SevenActivityModel = modules.seven_activity.SevenActivityModel;
    import LimitPackModel = modules.limit_pack.LimitPackModel;

    export class LeftBottomPanel extends LeftBottomViewUI {

        private _proCtrl: ProgressBarCtrl;
        private _missionCfg: scene_copy_tianguan;
        private _timeStage: number;
        private _playerId: number;

        private _tween: TweenJS;
        private _showDuration: number;
        private _jianCeDuration: number;//额外检测间隔
        private _clostFPTipTime: number;                  //关闭首冲提示倒计时
        private _startDownCount: boolean;                 //周期提示首冲提示倒计时开启
        private _effsTab: Table<CustomClip>;

        // private _modelClipTween: TweenJS;
        // private _modelClip: AvatarClip;
        private _skeletonClip: SkeletonAvatar;
        private _tianguanClip: CustomClip;
        private _firstPayBtnClip: CustomClip;
        private _MaxCurLvNoOpenWin: number;
        private _missionShowLv: number;
        private _dayPayEff: CustomClip;
        private _zzLibaoEff: CustomClip;
        private _OnlineEeterPanel: OnlineEeterPanel;//在线礼包快捷领取界面（代码太多写这里会很乱）

        private _enterPoses: Array<number>;
        private _onlineAwardShow: boolean;           // 在线礼包是否显示
        private _moneyCatShow: boolean;              // 招财猫是否显示
        private _fightTalismanShow: boolean;         // 战力护符是否显示
        private _glovesShow: boolean;                // 辅助装备是否显示
        private _oneBuyShow: boolean;                // 一元秒杀是否显示
        private _sevenActivityShow: boolean;         // 七日活动是否显示
        private _everydayFirstPayShow: boolean;         // 七日活动是否显示
        private _limitPackShow: boolean;         // 限时礼包是否显示
        private _svipSaleActivityShow: boolean;      // svip秒杀是否显示

        private _payRankShow: boolean;//消费排行入口
        private _singlePayPrintShow: boolean;//圣印返利入口
        private _zztzShow: boolean;//至尊礼包

        private _kh2pdShow: boolean;                 //狂嗨2派对是否显示
        private _kh2lcShow: boolean;                 //狂嗨2累冲是否显示

        private _dayPayShow: boolean;
        private _firstpayMaxLvTip: number;
        private _firstPayCfg: any;

        private _fishShow: boolean; //钓鱼
        private _dishuShow: boolean; //地鼠
        private _yearShow: boolean; //新春
        private _monopolyShow: boolean; //大富翁


        private _limitPackEff: CustomClip;
        private _hasEnterLimitPack: boolean;

        constructor() {
            super();
        }

        /**
         * 初始化特效
         */
        public initializeClip() {
            this._tianguanClip = new CustomClip();
            this.panelBtn.addChild(this._tianguanClip);
            this._tianguanClip.skin = "assets/effect/tianguan.atlas";
            let arr1: Array<string> = [];
            for (let i: int = 0; i < 7; i++) {
                // arr1[i] = `tianguan/000${i}.png`;
                arr1[i] = `tianguan/${i}.png`;
            }
            this._tianguanClip.frameUrls = arr1;
            this._tianguanClip.scale(1.5, 1.5, true);
            this._tianguanClip.pos(-90, -105, true);
            this._tianguanClip.visible = false;

            this._hasEnterLimitPack = false;
        }

        public initializeClip1() {
            this._firstPayBtnClip = new CustomClip();
            this.firstPayBtn.addChild(this._firstPayBtnClip);
            // this._firstPayBtnClip.skin = "assets/effect/scbaoxiang.atlas";
            this._firstPayBtnClip.skin = "assets/effect/firstPayEfft.atlas";
            let arr1: Array<string> = [];
            // for (let i: int = 0; i < 12; i++) {
            for (let i: int = 0; i < 8; i++) {
                arr1[i] = `firstPayEfft/${i}.png`;
            }
            this._firstPayBtnClip.frameUrls = arr1;
            this._firstPayBtnClip.scale(1, 1, true);
            this._firstPayBtnClip.pos(-50, -60, true);
            this._firstPayBtnClip.visible = false;
            this._firstPayBtnClip.zOrder = 2;

        }

        protected initialize() {
            super.initialize();

            this._playerId = PlayerModel.instance.actorId;

            if (!localStorage.getItem(`${this._playerId}${localStorageStrKey.LeftBottomPanel}`)) {
                localStorage.setItem(`${this._playerId}${localStorageStrKey.LeftBottomPanel}`, "0");
            }

            this.left = 0;
            this.bottom = 206;
            this.layer = Layer.MAIN_UI_LAYER;
            this.closeByOthers = false;

            this.splitImg1.visible = this.splitImg2.visible = false;
            this._proCtrl = new ProgressBarCtrl(this.proBar, this.proBar.width);

            this.regGuideSpr(GuideSpriteId.LEFT_BOTTOM_PANEL_BTN, this.panelBtn);

            // this._modelClip = AvatarClip.create(1024, 1024, 1024);
            // this.firstPayTipImg.addChildAt(this._modelClip, 0);
            // this._modelClip.anchorX = 0.5;
            // this._modelClip.anchorY = 0.5;
            // this._modelClip.centerX = 0;
            // this._modelClip.y = 270;
            // this._modelClip.visible = false;
            // this._modelClip.mouseEnabled = false;

            this._skeletonClip = SkeletonAvatar.create();
            this._skeletonClip.centerX = -60;
            this._skeletonClip.centerY = 50;
            this.firstPayTipImg.addChildAt(this._skeletonClip, 0);

            this.initializeClip();
            this.initializeClip1();
            let shuju = BlendCfg.instance.getCfgById(32001);
            this._MaxCurLvNoOpenWin = 0;
            if (shuju) {
                this._MaxCurLvNoOpenWin = shuju[blendFields.intParam][0];
            }
            this._missionShowLv = BlendCfg.instance.getCfgById(32002)[blendFields.intParam][0];

            this._enterPoses = [60, -244, 60, -156, 60, -68, 60, 20, 60, 108,
                170, -244, 170, -156, 170, -68, 170, 20, 170, 108, 280, -244, 280, -156, 280, -68, 280, 20, 280, 108, 392, -280];

            this.missonBox.x = CommonConfig.viewWidth - 90;
            //this.missionRP.x = CommonConfig.viewWidth - 45;
        }

        protected onOpened(): void {
            super.onOpened();

            this._firstPayCfg = FirstPayCfg.instance.getCfgDefaultData();
            this._timeStage = this._firstPayCfg[first_payFields.showTime];
            this._showDuration = this._firstPayCfg[first_payFields.showDuration];
            this._jianCeDuration = this._firstPayCfg[first_payFields.hintTime];
            this._firstpayMaxLvTip = this._firstPayCfg[first_payFields.maxLv];
            this._startDownCount = false;

            this.missionRP.removeSelf();
            this.updateLv(true);
            this.updateWare();
            this.updateAuto();
            this.showFirstPayBtn();
            this.showDayPayBtn();

            // 周期首冲显示             
            if (!this._startDownCount) {
                this._startDownCount = true;
                Laya.timer.loop(1000, this, this.checkFirstPayVisible);
            }

            // 副本失败提示首冲界面             
            if (SceneModel.instance._isshibaiShowFP) {
                SceneModel.instance._isshibaiShowFP = false;
                this.firstPayTipShow(true, false);
            }

            // 从左到右移入屏幕
            this.left = -228;
            if (this._tween) this._tween.stop();
            this._tween = TweenJS.create(this).to({ left: 0 }, CommonConfig.panelTweenDuration).onComplete(() => {
                GlobalData.dispatcher.event(CommonEventType.ACTION_PREVIEW_RESIZE_UI);
            }).start();
            this.showoffAutoBtnAndOnAutoBtn();

            this.setActionPreviewPos();
            this.isShowOnlineRewardEnter();
            this.sevenActivityIcon();
            this.everydayFirstPayIcon();
            this.limitPackShowIcon();
            this.moneyCatIcon();
            this.fightTalismanIcon();
            this.updateGlovesInfo();
            this.oneBuyShowIcon();
            this.svipSaleIcon();

            this.singlePayPrintShowIcon();
            this.payRankShowIcon();
            this.zztzShowIcon();
            this.kh2PDShowIcon();
            this.kh2LCShowIcon();
            this.fishIcon();
            this.yearIcon();
            this.dishuIcon();
            // this.monopolyIcon();
            Main.instance.isWXiOSPay && this.wxIosPayShow();
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
            Point.TEMP.setTo(this.missonBox.width / 2, this.missonBox.height / 2);
            let pos = this.missonBox.localToGlobal(Point.TEMP, true);
            modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.tianguan, pos);
            modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.sweepingEnter, pos);

            Point.TEMP.setTo(this.dayPayBox.width / 2, this.dayPayBox.height / 2);
            let pos1 = this.dayPayBox.localToGlobal(Point.TEMP, true);
            modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.dayPay, pos1);

            Point.TEMP.setTo(this.firstPayBtn.width / 2, this.firstPayBtn.height / 2);
            let pos2 = this.firstPayBtn.localToGlobal(Point.TEMP, true);
            modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.firstPay, pos2);

            Point.TEMP.setTo(this.oneBuyBtn.width / 2, this.oneBuyBtn.height / 2);
            let pos3 = this.oneBuyBtn.localToGlobal(Point.TEMP, true);
            modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.oneBuy, pos3);
        }

        /**
         * 创建UI展示特效
         * 
         * @param name 名字，可随机取一个。但如果需要对UI进行操作则需要认真命名
         * @param node 给哪个节点添加特效
         */
        private createUIEff(name: string, node: Laya.Sprite) {
            if (this._effsTab == null) this._effsTab = {};
            let eff = this._effsTab[name];
            if (!eff) {
                eff = new CustomClip();
                node.addChildAt(eff, 1);
                eff.frameUrls = ["left_top/eff_0.png", "left_top/eff_2.png", "left_top/eff_4.png", "left_top/eff_6.png",
                    "left_top/eff_8.png", "left_top/eff_10.png", "left_top/eff_12.png", "left_top/eff_14.png"];
                eff.durationFrame = 7;
                eff.loop = true;
                eff.x = 9;
                eff.y = 10;
                this._effsTab[name] = eff;
            } else {
                // console.log("不能创建一个已经存在的eff");
            }

            eff.play();
            eff.visible = true;
        }

        public close(): void {
            this._tween.stop();
            this._tween = TweenJS.create(this).to({ left: -228 }, CommonConfig.panelTweenDuration).onComplete((): void => {
                super.close();
            }).start();
            // if (this._modelClipTween) {
            //     this._modelClipTween.stop();
            //     this._modelClipTween = null;
            //     this._modelClipTween = null;
            // }
            if (this._dayPayEff) {
                this._dayPayEff.visible = GlobalData.dayPayEffState = false;
                this._dayPayEff.stop();
            }

            if (this._OnlineEeterPanel) {
                this._onlineAwardShow = false;
                this._OnlineEeterPanel.removeSelf();
                this._OnlineEeterPanel.destroy(true);
                this._OnlineEeterPanel = null;
            }
            if (this._tianguanClip) {
                this._tianguanClip.visible = false;
                this._tianguanClip.stop();
            }
            this._limitPackEff = this.destroyElement(this._limitPackEff);
            if (this._firstPayBtnClip) {
                this._firstPayBtnClip.visible = false;
                this._firstPayBtnClip.stop();
            }
            Laya.timer.clearAll(this);
            GlobalData.dispatcher.event(CommonEventType.THE_CARNIVAL_UPDATE);
            super.close();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.onAutoBtn, common.LayaEvent.CLICK, this, this.autoHandler);
            this.addAutoListener(this.offAutoBtn, common.LayaEvent.CLICK, this, this.autoHandler);
            this.addAutoListener(this.panelBtn, common.LayaEvent.CLICK, this, this.panelHandler);
            this.addAutoListener(this.firstPayBtn, common.LayaEvent.CLICK, this, this.firstPayBtnHandler);
            this.addAutoListener(this.firstPayTipImg, common.LayaEvent.CLICK, this, this.firstPayBtnHandler);
            this.addAutoListener(this.colseFirstPayTipImg, common.LayaEvent.CLICK, this, this.firstPayBtnHandler);
            this.addAutoListener(this.dayPayBox, common.LayaEvent.CLICK, this, this.dayPayBtnHandler);
            this.addAutoListener(this.oneBuyBtn, common.LayaEvent.CLICK, this, this.oneBuyBtnHandler);
            this.addAutoListener(this.fightTalismanBtn, common.LayaEvent.CLICK, this, this.fightTalismanBtnHandler);        //护符活动入口
            this.addAutoListener(this.moneyCatBtn, common.LayaEvent.CLICK, this, this.moneyCatBtnHandler);                  //招财猫活动入口
            this.addAutoListener(this.glovesBtn, LayaEvent.CLICK, this, this.glovesClickHandler);

            this.addAutoListener(this.singlePayPrintBtn, LayaEvent.CLICK, this, this.singlePayPrintHandler);//圣印入口
            this.addAutoListener(this.payRankBtn, LayaEvent.CLICK, this, this.payRankHandler);                              //消费排行入口
            this.addAutoListener(this.zztzBtn, LayaEvent.CLICK, this, this.zztzHandler);                                    //至尊
            this.addAutoListener(this.kh2LCBtn, LayaEvent.CLICK, this, this.kh2LCHandler);                                  //狂嗨2累冲点击事件
            this.addAutoListener(this.kh2PDBtn, LayaEvent.CLICK, this, this.kh2PDHandler);                                  //狂嗨2派对点击事件
            this.addAutoListener(this.fishBtn, LayaEvent.CLICK, this, this.fishBtnHandler);                                 //钓鱼
            this.addAutoListener(this.yearBtn, LayaEvent.CLICK, this, this.yearBtnHandler);                                 //新春
            this.addAutoListener(this.sevenActivityBtn, LayaEvent.CLICK, this, this.sevenActivityBtnHandler);               //七日活动
            this.addAutoListener(this.everydayFirstPayBtn, LayaEvent.CLICK, this, this.everydayFirstPayBtnHandler);               //七日活动
            this.addAutoListener(this.limitPackBtn, LayaEvent.CLICK, this, this.limitPackBtnHandler);                       //限时礼包按钮回调
            this.addAutoListener(this.dishuBtn, LayaEvent.CLICK, this, this.dishuBtnHandler);                               //打地鼠
            this.addAutoListener(this.svipSaleBtn, LayaEvent.CLICK, this, this.svipSaleBtnHandler);                         //svip秒杀
            // this.addAutoListener(this.monopolyBtn, LayaEvent.CLICK, this, this.monopolyBtnHandler);//大富翁

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RESIZE_UI, this, this.setActionPreviewPos);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ACTION_PREVIEW_RESIZE_UI, this, this.setActionPreviewPos);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_ONLINE_REWARD_REPLY, this, this.isShowOnlineRewardEnter);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_BASE_ATTR_UPDATE, this, this.isShowOnlineRewardEnter);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MISSION_UPDATE_LV, this, this.updateLv);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MISSION_UPDATE_WARE, this, this.updateWare);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MISSION_UPDATE_AUTO, this, this.updateAuto);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIRST_PAY_UPDATE, this, this.showFirstPayBtn);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenGetSprintRankInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MISSION_UPDATE_LV, this, this.showoffAutoBtnAndOnAutoBtn);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIGHT_TALISMAN_UPDATE, this, this.fightTalismanIcon);      //护符刷新
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIRST_PAY_UPDATE, this, this.fightTalismanIcon);      //首充护符刷新
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MONEY_CAT_UPDATE, this, this.moneyCatIcon);      //猫刷新
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIRST_PAY_UPDATE, this, this.moneyCatIcon);      //首充猫刷新
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ONEBUY_UPDATE, this, this.oneBuyShowIcon);      //1元秒杀刷新
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FUNC_OPEN_UPDATE, this, this.oneBuyShowIcon);      //1元秒杀功能开启刷新
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LuxuryEquip_ZhiZun_BuyUPDATE, this, this.zztzShowIcon); //至尊礼包刷新
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GLOVES_INFO_UPDATE, this, this.updateGlovesInfo);       // 辅助装备
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.VIP_UPDATE, this, this.singlePayPrintShowIcon);         // vip升级更新圣印
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.KUANGHAI2_PD_ACTION_OPEN_UPDATE, this, this.kh2PDShowIcon);       // 狂嗨2派对功能开启状态更新
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.KUANGHAI2_LC_ACTION_OPEN_UPDATE, this, this.kh2LCShowIcon);       // 狂嗨2累冲功能开启状态更新
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FAILURE_SHOW_FIRST_PAY, this, this.firstPayTipShow, [true]);       // 副本失败显示首冲
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.YEAR_UPDATE, this, this.yearIcon);      //钓鱼
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DISHU_PANEL_UPDATE, this, this.dishuIcon);      //地鼠
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.MONOPOLY_UPDATE, this, this.monopolyIcon);      //大富翁
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DAY_PAY_UPDATE, this, this.showDayPayBtn);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SEVEN_ACTIVITY_UPDATE, this, this.sevenActivityIcon);      //七日活动显示
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.EVERYDAY_FIRSTPAY_UPDATE, this, this.everydayFirstPayIcon);      //七日活动显示
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LIMIT_PACK_UPDATE, this, this.limitPackShowIcon);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_SHOW_PAY_STATUS, this, this.wxIosPayShow);      //微信ios支付显示

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_LEVEL, this, this.svipSaleIcon);       // 角色升级,svip秒杀状态

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LIMIT_PACK_UPDATE, this, this.limitPackUpdateHandler);      //限时礼包入口控制
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SCENE_ENTER, this, this.enterScene);


            this.addAutoListener(GlobalData.dispatcher, CommonEventType.CLOSE_TIPS_SHOUCHONG, this, () => {
                this.firstPayTipImg.visible = false;
                // this.colseFirstPayTipImg.visible = false;
                // if (this._modelClip) {
                //     this._modelClip.visible = false;
                // }
                if (this._skeletonClip) {
                    this._skeletonClip.visible = false;
                }
            });//todo on

            this.addAutoRegisteRedPoint(this.missionRP, ["missionRP", "lineClearOut"]);
            this.addAutoRegisteRedPoint(this.firstPayRP, ["firstPayRP"]);
            this.addAutoRegisteRedPoint(this.daypayRP, ["daypayRP"]);
            this.addAutoRegisteRedPoint(this.fightTalismanBuyRP, ["fightTalismanBuyRP"]);
            this.addAutoRegisteRedPoint(this.moneyCatBuyRP, ["moneyCatBuyRP"]);
            this.addAutoRegisteRedPoint(this.oneBuyRP, ["oneBuyRP"]);
            this.addAutoRegisteRedPoint(this.fishRP, ["fishGiftRP", "fishGiftRP_grade_1", "fishGiftRP_grade_2", "fishGiftRP_grade_3","fishReapRP","fishLinkRP","fishLinkRP_grade_1","fishLinkRP_grade_2","fishLinkRP_grade_3","fishItemSate0","fishItemSate1","fishItemSate2"]);
            this.addAutoRegisteRedPoint(this.dishuRP, ["DishuTaskOpenRP", "DishuTaskServerRP", "dishuCumulateRP", "dishuDayCumulateRP", "dishuDaySingleRP", "dishuReapRP"]);
            this.addAutoRegisteRedPoint(this.glovesRP, ["glovesBuyRP", "glovesStoneBuyRP"]);
            this.addAutoRegisteRedPoint(this.singlePayPrintRP, ["cumulatePayTianZhuRP"]);
            this.addAutoRegisteRedPoint(this.payRankRP, ["payRankRP"]);
            // this.addAutoRegisteRedPoint(this.kh2LCRP, ["payRankRP"]);    //狂嗨2累冲的红点？好像没写完
            this.addAutoRegisteRedPoint(this.kh2PDRP, ["MissionPartyRP"]);
            this.addAutoRegisteRedPoint(this.sevenActivityRP, ["sevenActivityRP", "demonOrderGiftRP"]);
            this.addAutoRegisteRedPoint(this.everydayFirstPayRP, ["everydayFirstPayRP"]);
            this.addAutoRegisteRedPoint(this.yearBtnRP, ["YearDaySingleRP", "YearDayCumulateRP", "YearCumulateRP", "YearReapRP", "YearLinkRP", "YearLoginRP", "YearCjTaskRP", "YearDhRP"]);
            //大富翁

        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        public showoffAutoBtnAndOnAutoBtn(): void {
            if (MissionModel.instance.curLv <= this._MaxCurLvNoOpenWin) {
                this.onAutoBtn.visible = this.offAutoBtn.visible = false;
            } else {
                this.offAutoBtn.visible = MissionModel.instance.auto;
                this.onAutoBtn.visible = !MissionModel.instance.auto;
            }
        }

        private enterScene() {
            //其他场景也要显示首冲
            this.otherBox.visible = this.isCommonScene();
            this.isShowOnlineRewardEnter();
        }

        private isCommonScene() {
            return SceneModel.instance.currentScene == SceneTypeEx.common && !SceneModel.instance.isInMission;
        }

        // 检测首冲提示面板是否应该打开
        private checkFirstPayVisible() {
            if (GlobalData.serverTime >= SceneModel.instance._lastTime) {
                this.firstPayTipShow(true);
            }
        }

        /**
        * 按钮下的首充倒计时
        */
        private loopHandler(): void {
            this.timeText.text = `${CommonUtil.timeStampToHMMSSMS(FirstPayModel.instance.restTm)}`;
            FirstPayModel.instance.restTm -= 10;
            if (FirstPayModel.instance.restTm < GlobalData.serverTime) {
                this.countdownImg.visible = false;
                Laya.timer.clear(this, this.loopHandler);
                this.relayoutEnters();
            }
        }

        // 关闭首冲提示倒计时
        private closeFirstPayTipDownCount() {
            this._clostFPTipTime--;
            // 提示展示时间结束，关闭面板
            if (this._clostFPTipTime <= 0) {
                this.firstPayTipShow(false);
            }
        }

        // 首冲提示面板展示状态
        public firstPayTipShow(active: boolean, openBigger: boolean = false) {
            // console.log("首冲提示面板展示状态", active);


            // giveState =2 表示已经首冲过了
            if (PlayerModel.instance.level < this._firstpayMaxLvTip) return;
            if (active && FirstPayModel.instance._rechargeAllShift) {
                //console.log("已经首冲过所有的档次了", active);
                Laya.timer.clear(this, this.checkFirstPayVisible);
                return;
            }
            if (active && this.firstPayTipImg.visible) return;

            // 展示
            this.firstPayTipImg.visible = active && !openBigger;
            if (active && FirstPayModel.instance._firstPayBoxVisible && openBigger) {
                WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);
            } else {
                WindowManager.instance.close(WindowEnum.FIRST_PAY_PANEL);
            }
            // this.countdownImg.visible = active;
            // this._modelClip.visible = active;
            this._skeletonClip.visible = active;

            if (active) {
                this.showModelClip();
                GlobalData.dispatcher.event(CommonEventType.CLOSE_TIPS_BANG);
                // this._modelClipTween.start();
                this._clostFPTipTime = this._showDuration / 1000;
                SceneModel.instance._isshouci = true;
                Laya.timer.loop(1000, this, this.closeFirstPayTipDownCount);
                SceneModel.instance._lastTime = GlobalData.serverTime + this._timeStage;
            } else {
                // if (this._modelClipTween) {
                //     this._modelClipTween.stop();
                // }
                Laya.timer.clear(this, this.closeFirstPayTipDownCount);
            }
        }

        //获取数据
        public funOpenGetSprintRankInfo(ID: Array<number>): void {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.firstPay) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.firstPay)) {
                        this.showFirstPayBtn();
                        SceneModel.instance._isshouci = true;
                        this.firstPayTipShow(true);
                    }
                } else if (element == ActionOpenId.onlineReward || element == ActionOpenId.sevenDay) {
                    this.isShowOnlineRewardEnter();
                } else if (element === ActionOpenId.dayPay) {
                    this.showDayPayBtn();
                }
                else if (element === ActionOpenId.singlePayPrint) {
                    this.singlePayPrintShowIcon();
                } else if (element === ActionOpenId.consumeRank) {
                    this.payRankShowIcon();
                }
            }
        }

        /**
         * 时候打开 在线礼包入口
         */
        public isShowOnlineRewardEnter() {
            let getDay = modules.player.PlayerModel.instance.getDayNum();
            if (getDay >= 4) {
                WindowManager.instance.close(WindowEnum.ONLINE_ENTER_PANEL);
                this.onlineAwardShow = false;
                return;
            }
            if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.onlineReward)) {
                if (!this._OnlineEeterPanel) {
                    this._OnlineEeterPanel = new modules.main.OnlineEeterPanel();
                    this.addChild(this._OnlineEeterPanel);
                    this._OnlineEeterPanel.visible = this.isCommonScene();
                    // this._OnlineEeterPanel.pos(0, -10);
                } else {
                    this.addChild(this._OnlineEeterPanel);
                    // this._OnlineEeterPanel.pos(0, -10);
                    this._OnlineEeterPanel.initializeQuickToReceive();
                    this._OnlineEeterPanel.visible = this.isCommonScene();
                }
                this.onlineAwardShow = true;
                return;
            }
        }

        private firstPayBtnHandler(): void {
            this.firstPayTipShow(false);
            WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);
        }

        private dayPayBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.DAY_PAY_PANEL);
            if (this._dayPayEff) {
                this._dayPayEff.visible = GlobalData.dayPayEffState = false;
                this._dayPayEff.stop();
            }
        }
        private oneBuyBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.ONE_BUY_PANEL);
        }


        private showFirstPayBtn(): void {
            if (FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.firstPay) && !Main.instance.isWXiOSPay) {
                FirstPayModel.instance.checkMainRPAndStatus();
                this.firstPayBox.visible = FirstPayModel.instance._firstPayBoxVisible;
                // console.log("是否关闭首冲：", FirstPayModel.instance._firstPayBoxVisible);
                if (FirstPayModel.instance.restTm > 0) {
                    this.countdownImg.visible = true;
                    this.loopHandler();
                    Laya.timer.loop(10, this, this.loopHandler);
                } else {
                    this.countdownImg.visible = false;
                    Laya.timer.clear(this, this.loopHandler);
                }
            } else {
                this.firstPayBox.visible = false;
            }
            //根据场景名字关闭首充界面
            LeftBottomModel.instance.NoShowFirstPayScenes.forEach(element => {
                if (element == SceneModel.instance.currentScene) {
                    if (this.firstPayBox.visible) {
                        this.firstPayBox.visible = false;
                    }
                    return
                }
            });


            this.isShowFirstPayBtnClip();
            this.setActionPreviewPos();
            this.setPos();
        }

        public setPos() {
            this.relayoutEnters();
        }

        private wxIosPayShow() {
            this.showFirstPayBtn();
            this.isShowFirstPayBtnClip();
            this.oneBuyShowIcon();
            this.updateGlovesInfo();
            this.showDayPayBtn();
            this.setPos();
            this.payRankShowIcon();
            this.moneyCatIcon();
            this.fightTalismanIcon();
        }

        /**
         * name
         */
        public isShowFirstPayBtnClip() {
            if (this.firstPayBox.visible && !Main.instance.isWXiOSPay) {
                if (this._firstPayBtnClip) {
                    this._firstPayBtnClip.visible = true;
                    this._firstPayBtnClip.play();
                }
            } else {
                if (this._firstPayBtnClip) {
                    this._firstPayBtnClip.visible = false;
                    this._firstPayBtnClip.stop();
                }
            }
        }


        private showDayPayBtn(): void {
            if (FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.dayPay) && !Main.instance.isWXiOSPay) {
                this._dayPayShow = ((DayPayModel.instance.giveState == 2) && (DayPayModel.instance.ISover()));
                this.enterTipText.text = DayPayModel.instance.getEnterTips()[0];
                if (DayPayModel.instance.getEnterTips()[1]) {
                    this.enterTipText.color = `#${DayPayModel.instance.getEnterTips()[1]}`;
                }
                if (DayPayModel.instance.ISover()) {
                    if (!this._dayPayEff && GlobalData.dayPayEffState) {
                        this._dayPayEff = CommonUtil.creatEff(this.dayPayBox, `activityEnter`, 15);
                        this._dayPayEff.visible = true;
                        this._dayPayEff.play();
                    }
                }
            } else {
                this._dayPayShow = false;
            }
            this._dayPayShow = this._dayPayShow && !Main.instance.isWXiOSPay;
            this.dayPayBox.visible = this._dayPayShow;
            this.setPos();
        }

        private autoHandler(): void {
            if (TeamBattleModel.Instance.isHaveRoom) {
                TeamBattleCtrl.instance.teamWaitingHandler();
                return;
            }
            if (!this._missionCfg) {
                SystemNoticeManager.instance.addNotice("已挑战完所有关卡", true);
                return;
            }
            MissionModel.instance.auto = !MissionModel.instance.auto;
        }

        private panelHandler(): void {
            if (MissionModel.instance.curLv <= this._MaxCurLvNoOpenWin) {//小于多少关直接挑战无需打开界面
                if (!this._missionCfg)
                    return;
                let maxWare: number = this._missionCfg[scene_copy_tianguanFields.killWare];
                if (MissionModel.instance.curWare === maxWare && !MissionModel.instance.auto) {//在不自动打的时候才生效
                    MissionCtrl.instance.challenge(this._missionCfg[scene_copy_tianguanFields.mapId]);
                } else {
                    let maxWare: number = this._missionCfg[scene_copy_tianguanFields.killWare];
                    let curWare: number = MissionModel.instance.curWare;
                    SystemNoticeManager.instance.addNotice(`还需击杀${maxWare - curWare}波怪物，才能开启闯关`, true);
                }
            } else {
                WindowManager.instance.open(WindowEnum.MISSION_PANEL);
            }
        }

        private updateLv(isFormOpenFunc: boolean = false): void {
            this.levelTxt.visible = this.missonBox.visible = this.onAutoBtn.visible = this.offAutoBtn.visible = this.levelTxt.visible = MissionModel.instance.curLv >= this._missionShowLv && SceneModel.instance.currentScene == SceneTypeEx.common;
            if (MissionModel.instance.curLv >= this._missionShowLv) this.missonBox.addChild(this.missionRP);
            this._missionCfg = SceneCopyTianguanCfg.instance.getCfgByLv(MissionModel.instance.curLv);
            if (!this._missionCfg) {      // 最大关
                this.levelTxt.text = `第${MissionModel.instance.curLv - 1}关`;
                MissionModel.instance.auto = false;
            } else {
                this.levelTxt.text = `第${MissionModel.instance.curLv}关`;
            }
            this.updateWare();
            //console.log("天关显示首冲的时刻", MissionModel.instance.curLv);

            if (!isFormOpenFunc) {
                // 过天关首冲显示
                let difLv = MissionModel.instance.curLv - MissionModel.instance.startLv;
                if (PlayerModel.instance.level >= this._firstpayMaxLvTip && SceneModel.instance.currentScene == SceneTypeEx.common && (difLv >= 10 && (difLv % 10 == 0))) {
                    //console.log("天关显示首冲的时刻22", MissionModel.instance.curLv);
                    SceneModel.instance._isshouciLv = true;
                    this.firstPayTipShow(true, true);
                }

                //弹出一元秒杀
                if (FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.oneBuy)
                    && SceneModel.instance.currentScene == SceneTypeEx.common
                    && (difLv > 10 && (difLv % 10 == 1)) && !Main.instance.isWXiOSPay
                    && !modules.one_buy.OneBuyModel.instance.isBuyFinish()) {
                    WindowManager.instance.open(WindowEnum.ONE_BUY_PANEL);
                }
            }
        }

        private updateWare(): void {
            if (!this._missionCfg) return;
            let maxWare: number = this._missionCfg[scene_copy_tianguanFields.killWare];
            this._proCtrl.maxValue = maxWare;
            this._proCtrl.value = MissionModel.instance.curWare;
            if (maxWare === 1) {
                this.splitImg1.visible = this.splitImg2.visible = false;
            } else if (maxWare === 2) {
                this.splitImg1.visible = true;
                this.splitImg1.x = this.proBar.x + this.proBar.width / 2;
                this.splitImg2.visible = false;
            } else if (maxWare === 3) {
                this.splitImg1.visible = this.splitImg2.visible = true;
                this.splitImg1.x = this.proBar.x + this.proBar.width / 3;
                this.splitImg2.x = this.proBar.x + this.proBar.width / 3 * 2;
            }

            this.checkAutoChallenge();
        }

        private updateAuto(): void {
            if (MissionModel.instance.curLv <= this._MaxCurLvNoOpenWin) {
                this.onAutoBtn.visible = this.offAutoBtn.visible = false;
            } else {
                this.offAutoBtn.visible = MissionModel.instance.auto;
                this.onAutoBtn.visible = !MissionModel.instance.auto;
            }

            this.checkAutoChallenge();
        }

        // 自动挑战
        private checkAutoChallenge(): void {
            if (!this._missionCfg) return;
            let maxWare: number = this._missionCfg[scene_copy_tianguanFields.killWare];
            if (MissionModel.instance.curWare === maxWare) {
                this._tianguanClip.visible = false;// true
                this._tianguanClip.play();
            } else {
                this._tianguanClip.visible = false;
                this._tianguanClip.stop();
            }
            // 开启自动挑战且波数达到最大
            if (MissionModel.instance.auto && MissionModel.instance.curWare === maxWare) {
                MissionCtrl.instance.challenge(this._missionCfg[scene_copy_tianguanFields.mapId]);
            }
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._tween) {
                this._tween.stop();
                this._tween = null;
            }
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            // if (this._modelClip) {
            //     this._modelClip.removeSelf();
            //     this._modelClip.destroy();
            //     this._modelClip = null;
            // }
            if (this._tianguanClip) {
                this._tianguanClip.removeSelf();
                this._tianguanClip.destroy();
                this._tianguanClip = null;
            }
            if (this._firstPayBtnClip) {
                this._firstPayBtnClip.removeSelf();
                this._firstPayBtnClip.destroy();
                this._firstPayBtnClip = null;
            }
            if (this._dayPayEff) {
                this._dayPayEff.removeSelf();
                this._dayPayEff.destroy();
                this._dayPayEff = null;
            }

            for (const key in this._effsTab) {
                if (Object.prototype.hasOwnProperty.call(this._effsTab, key)) {
                    const element = this._effsTab[key];
                    element.removeSelf();
                    element.destroy();
                }
            }
            this._effsTab = null;

            super.destroy(destroyChild);
            this._proCtrl.destroy();
            this._proCtrl = null;

        }


        public showModelClip() {
            // if (this._modelClipTween) {
            //     this._modelClipTween.stop();
            // }
            let _cfg = FirstPayCfg.instance.getCfgDefaultData();
            let modelId: number = _cfg[first_payFields.showId];
            // let modelCfg: Exterior = ExteriorSKCfg.instance.getCfgById(modelId);

            this._skeletonClip.reset(modelId);
            this._skeletonClip.resetScale(AvatarAniBigType.clothes, 0.9);
            this._skeletonClip.resetOffset(AvatarAniBigType.clothes, 50, -50);
            // this._modelClip.y = 270;
            // this._modelClip.reset(modelId);
            // this._modelClip.avatarRotationX = modelCfg[ExteriorSKFields.rotationX];
            // this._modelClip.avatarRotationY = modelCfg[ExteriorSKFields.rotationY];
            // this._modelClip.avatarScale = modelCfg[ExteriorSKFields.scale] * 0.7;
            // this._modelClip.avatarY = modelCfg[ExteriorSKFields.deviationY];
            // this._modelClip.avatarX = modelCfg[ExteriorSKFields.deviationX];
            // this._modelClipTween = TweenJS.create(this._modelClip).to({ y: this._modelClip.y - 15 },
            //     1000).start().yoyo(true).repeat(99999999);

        }
        //战力护符入口控制
        private fightTalismanIcon(): void {
            //如果已首充并未购买护符
            this.fightTalismanShow = (FirstPayModel.instance.giveState !== 0) && (FightTalismanModel.instance.currMedalType() !== 4)// || FightTalismanModel.instance.actived == -1);
        }

        //战力护符购买页面
        private fightTalismanBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.FIGHT_TALISMAN_BUY_ALERT);
        }

        //招财仙猫入口控制
        private moneyCatIcon(): void {
            //如果已首充并未购买护符或未领取
            this.moneyCatShow = FirstPayModel.instance.giveState && (!MoneyCatModel.instance.state || MoneyCatModel.instance.actived == -1);
        }

        //七日活动入口控制
        private sevenActivityIcon(): void {
            this.sevenActivityShow = SevenActivityModel.instance.showSevenActivity && modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.sevenActivity);
        }

        //每日首充入口控制
        private everydayFirstPayIcon() {
            this.everydayFirstPayShow = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.everyday_firstpay) || modules.everyday_firstpay.EverydayFirstPayModel.instance.iconShowState;
        }

        //svip秒杀入口控制
        private svipSaleIcon(): void {
            this._svipSaleActivityShow = this.svipSaleBtn.visible = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.svipSale);
            this.relayoutEnters();
        }

        private limitPackShowIcon() {
            if (LimitPackModel.instance.limitPackInfo && LimitPackModel.instance.limitPackInfo.length) {
                this.limitPackShow = true;
            } else {
                this.limitPackShow = false;
            }
        }

        //1元秒杀入口控制
        private oneBuyShowIcon(): void {
            //如果已首充并未购买护符或未领取
            let a = PlayerModel.instance.level;
            let state = FuncOpenModel.instance.getFuncStateById(ActionOpenId.oneBuy);
            if (state == ActionOpenState.open && !Main.instance.isWXiOSPay) {
                this.oneBuyShow = true;
            }
            else {
                this.oneBuyShow = false;
            }
        }
        //圣印返利入口控制
        private singlePayPrintShowIcon(): void {
            this.singlePayPrintShow = CumulatePayTianZhuModel.instance.state;
        }
        //消费排行入口控制
        private payRankShowIcon(): void {
            this.payRankShow = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.consumeRank);
        }
        //至尊礼包
        private zztzShowIcon(): void {
            this.zztzShow = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.HolyEquip) && modules.extreme.extremeModel.instance.buyShow[0];
        }

        //狂嗨2派对控制
        private kh2PDShowIcon(): void {
            let isShow = this.checkMinus1Special(ActionOpenId.MissionPartyEnter) && this.judgeIsShow(ActionOpenId.MissionPartyEnter);
            this.kh2PDBox.visible = isShow;
            this._kh2pdShow = isShow;
            // 根据活动状态修改icon图标
            if (isShow) {
                let resName: string = modules.mission_party.MissionPartyModel.instance.getCurrentMissionIconResName();
                console.log("狂嗨2派对资源图标名字：" + resName);
                this.kh2PDBtn.skin = `left_bottom/${resName}`;
                this.createUIEff("kh2pd", this.kh2PDBox);
            }
            this.relayoutEnters();
        }
        //狂嗨2累冲活动控制
        private kh2LCShowIcon(): void {
            // this._kh2lcShow = false;
            // return;
            let isShow = this.checkMinus1Special(ActionOpenId.cumulatePay3) && this.judgeIsShow(ActionOpenId.cumulatePay3);
            this.kh2LCBox.visible = isShow;
            this._kh2lcShow = isShow;
            // 根据活动状态修改icon图标
            if (isShow) {
                let resName: string = modules.cumulate3_pay.CumulatePay3Model.instance.getCurrentIconResName();
                console.log("狂嗨2累冲活动资源图标名字：" + resName);
                this.kh2LCBtn.skin = `left_bottom/${resName}`
                this.createUIEff("kh2lcS", this.kh2LCBox);
            }
            this.relayoutEnters();
        }
        // 【狂嗨累冲和狂嗨派对】检测状态为-1的特殊活动 -1则不显示活动
        private checkMinus1Special(id: number): boolean {
            if (FuncOpenModel.instance.getFuncStateById(id) === -1) {
                return false;
            }
            return true;
        }
        // 判断活动是否显示
        private judgeIsShow(id: number): boolean {
            let isShow: boolean = false;
            if (FuncOpenModel.instance.getFuncNeedShow(id)) { //不论其他 入口功能开了才可以判断
                let cfg: action_open = ActionOpenCfg.instance.getCfgById(id);
                let subs: number[] = cfg[action_openFields.subfunctions];
                let isSub: boolean = subs.length > 0;
                if (isSub) {//是入口功能 就判断子功能全部开启
                    let flag: boolean = false;
                    for (let id of subs) {
                        if (FuncOpenModel.instance.getFuncNeedShow(id)) {
                            flag = true;
                            break;
                        }
                    }
                    isShow = flag;
                } else {
                    isShow = true;
                }
            }
            return isShow;
        }

        //招财仙猫购买页面
        private moneyCatBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.MONEY_CAT_BUY_ALERT);
        }

        //钓鱼
        private fishIcon(): void {
            //先显示
            this.fishShow = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.fish);
        }

        // 地鼠
        private dishuIcon(): void {
            //先显示`       
            // this.dishuShow = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.dishu);
            this.dishuShow = !!(!Main.instance.isWXiOSPay && modules.dishu.DishuModel.instance.iconShow);
        }

        //新春
        private yearIcon(): void {
            //先显示
            this.yearShow = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.year);
        }
        //大富翁
        // private monopolyIcon(): void {
        //     //先显示
        //     this.monopolyShow = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.monopoly);
        //     // this.monopolyShow = true;
        // }


        // 辅助装备点击
        private glovesClickHandler(): void {
            if (FirstPayModel.instance.totalRechargeMoney < FirstPayCfg.instance.getCfgDefaultData()[Configuration.first_payFields.money]
                && FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.firstPay)) {
                WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);
            } else {
                let info: GetGauntletReply = GlovesModel.instance.glovesInfo;
                if (!info) return;
                // 已领之后变成徽章购买面板
                WindowManager.instance.open(info[GetGauntletReplyFields.state] === 1 ? WindowEnum.GLOVES_STONE_BUY_ALERT : WindowEnum.GLOVES_BUY_ALERT);
            }
        }

        // 辅助装备更新
        private updateGlovesInfo(): void {
            let info: GetGauntletReply = GlovesModel.instance.glovesInfo;
            if (!info) return;
            let state: int = info[GetGauntletReplyFields.state];
            this.glovesShow = state === -1 || state === 0 || (state === 1 && (info[GetGauntletReplyFields.jewel_index] > 0 || info[GetGauntletReplyFields.draw_index]) > 0);
            if (this._glovesShow) {
                this.glovesBtn.skin = state === 1 ? `left_bottom/gloves_${info[GetGauntletReplyFields.jewel_index] || info[GetGauntletReplyFields.draw_index]}.png` : "left_bottom/btn_mainui_wxst.png";
            }
        }
        // 圣印返利点击
        private singlePayPrintHandler(): void {
            WindowManager.instance.open(WindowEnum.CUMULATEPAY_TAINZHU);
        }

        // 消费排行点击
        private payRankHandler(): void {
            WindowManager.instance.open(WindowEnum.PAY_RANK_PANEL);
        }

        // 至尊礼包点击
        private zztzHandler(): void {
            WindowManager.instance.openDialog(WindowEnum.ZZTZ_BUY_ALERT);
        }

        // 狂嗨2累冲
        private kh2LCHandler(): void {
            WindowManager.instance.open(WindowEnum.CUMULATE_PAY3_UPDATE);
        }

        // 狂嗨2派对
        private kh2PDHandler(): void {
            WindowManager.instance.open(WindowEnum.Mission_Party_PANEL);
        }

        // 在线礼包是否显示
        private set onlineAwardShow(value: boolean) {
            if (this._onlineAwardShow === value) return;
            this._onlineAwardShow = value;
            this.relayoutEnters();
        }

        // 招财猫是否显示
        private set moneyCatShow(value: boolean) {
            if (this._moneyCatShow === value) return;
            this._moneyCatShow = this.moneyCatBtn.visible = value && !Main.instance.isWXiOSPay;
            this.relayoutEnters();
        }

        // 七日活动入口是否显示
        private set sevenActivityShow(value: boolean) {
            if (this._sevenActivityShow === value) return;
            this._sevenActivityShow = this.sevenActivityBox.visible = value;
            this.relayoutEnters();
        }

        // 每日首充入口是否显示
        private set everydayFirstPayShow(value: boolean) {
            if (this._everydayFirstPayShow === value) return;
            this._everydayFirstPayShow = this.everydayFirstPayBox.visible = value;
            this.relayoutEnters();
        }

        private set limitPackShow(value: boolean) {
            if (this._limitPackShow === value) return;
            this._limitPackShow = value;
            this.limitPackUpdateHandler();
            this.relayoutEnters();
        }

        //钓鱼页面
        private fishBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.FISH_PANEL);
        }

        //地鼠页面
        private dishuBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.DI_SHU_PANEL);
        }
        //svip秒杀
        private svipSaleBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_SVIP_SALE_ALERT);
        }
        // //大富翁页面
        // private monopolyBtnHandler(): void {
        //     WindowManager.instance.open(WindowEnum.MONOPOLY_PANEL);
        // }

        //新春页面
        private yearBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.YEAR_CJ);
        }

        //七日活动
        private sevenActivityBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.SEVENACTIVITY_ENTRANCE_ALERT);
        }

        //每日首充活动
        private everydayFirstPayBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.EVERYDAY_FIRSTDAY_ALERT);
        }


        // 钓鱼是否显示
        private set fishShow(value: boolean) {
            if (this._fishShow === value) return;
            this._fishShow = this.fishBtn.visible = value;
            if (value) {
                this.createUIEff("fish", this.fishBtn);
            }
            this.relayoutEnters();
        }


        // 地鼠是否显示
        private set dishuShow(value: boolean) {
            if (this._dishuShow === value) return;
            this._dishuShow = this.dishuBtn.visible = value;
            if (value) {
                this.createUIEff("dishu", this.dishuBtn);
            }
            this.relayoutEnters();
        }

        // 大富翁是否显示
        // private set monopolyShow(value: boolean) {
        //     // if (this._monopolyShow === value) return;
        //     // this._monopolyShow = this.monopolyBtn.visible = value;
        //     // if (value) {
        //     //     this.createUIEff("monopoly", this.monopolyBtn);
        //     // }


        //     // this.relayoutEnters();
        // }


        // 新年活动是否显示
        private set yearShow(value: boolean) {

            if (this._yearShow === value) return;
            this._yearShow = this.yearBtn.visible = value;

            if (value) {
                this.createUIEff("year", this.yearBtn);
            }
            this.relayoutEnters();
        }

        // 战力护符是否显示
        private set fightTalismanShow(value: boolean) {
            if (this._fightTalismanShow === value) return;
            this._fightTalismanShow = this.fightTalismanBtn.visible = value && !Main.instance.isWXiOSPay;
            this.relayoutEnters();
        }

        // 辅助装备是否显示
        private set glovesShow(value: boolean) {
            if (this._glovesShow === value) return;
            this._glovesShow = this.glovesBtn.visible = value && !Main.instance.isWXiOSPay;
            this.relayoutEnters();
        }

        // 一元秒杀是否显示
        private set oneBuyShow(value: boolean) {
            if (this._oneBuyShow === value) return;
            this._oneBuyShow = this.oneBuyBox.visible = value && !Main.instance.isWXiOSPay;
            if (value) {
                this.createUIEff("oneBuy", this.oneBuyBox);
            }
            this.relayoutEnters();
        }
        //消费排行是否显示
        private set payRankShow(value: boolean) {
            if (this._payRankShow === value) return;
            this._payRankShow = this.payRankBox.visible = value && !Main.instance.isWXiOSPay;
            this.relayoutEnters();
        }
        //至尊礼包是否显示
        private set zztzShow(value: boolean) {
            if (this._zztzShow === value) return;
            this._zztzShow = this.zztzBox.visible = value;
            if (!this._zzLibaoEff) {
                this._zzLibaoEff = CommonUtil.creatEff(this.zztzBox, `activityEnter`, 15);
                this._zzLibaoEff.visible = true;
                this._zzLibaoEff.play();
            }
            this.relayoutEnters();
        }
        //圣印返利是否显示
        private set singlePayPrintShow(value: boolean) {
            let playLevel: number = PlayerModel.instance.level;
            let showLevel: Array<number> = BlendCfg.instance.getCfgById(54001)[blendFields.intParam];
            if (vip.VipModel.instance.vipLevel >= showLevel[0]) {
                if (this._singlePayPrintShow === value) return;
                this._singlePayPrintShow = this.singlePayPrintBox.visible = value;
            } else {
                this._singlePayPrintShow = this.singlePayPrintBox.visible = false;
            }
            this.relayoutEnters();
        }

        // private btnPos(obj: Laya.Component) {
        //     obj.pos(this._enterPoses[this._b_i], this._enterPoses[this._b_i + 1], true);
        //     this._b_i += 2;
        //     if (this.flag && this._b_i === 8) this._b_i += 2;
        // }

        private limitPackBtnHandler(): void {     //限时礼包
            //删除入口特效
            this._hasEnterLimitPack = true;
            if (this._limitPackEff) {
                this._limitPackEff.removeSelf();
                this._limitPackEff.destroy();
                this._limitPackEff = null;
            }
            WindowManager.instance.open(WindowEnum.LIMIT_PACK_ALERT);
        }

        private limitPackUpdateHandler(): void {      //限时礼包更新
            //如果礼包数组不为空,显示入口，否则隐藏
            if (LimitPackModel.instance.limitPackInfo && LimitPackModel.instance.limitPackInfo.length && !Main.instance.isWXiOSPay) {
                this.limitPackBtn.visible = true;
                //如果没点击过入口为入口添加特效
                if (this._hasEnterLimitPack == false && !this._limitPackEff) {
                    this._limitPackEff = CommonUtil.creatEff(this.limitPackBtn, `activityEnter`, 15);
                    this._limitPackEff.x = 10
                    this._limitPackEff.y = 10
                    this._limitPackEff.play();
                }
            } else {
                this.limitPackBtn.visible = false;
            }
        }

        // 重布局入口
        private relayoutEnters(): void {
            let flag: boolean = false;
            if (this._onlineAwardShow && this._OnlineEeterPanel) {
                this._OnlineEeterPanel.pos(this._enterPoses[8], this._enterPoses[9], true);
                flag = true;
            }
            let index: int = 0;
            // if (FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.firstPay) && FirstPayModel.instance.giveState !== 2) {
            if (FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.firstPay) && FirstPayModel.instance.showFirstPay) {
                index = FirstPayModel.instance.restTm > 0 && FirstPayModel.instance.restTm > GlobalData.serverTime ? 4 : 2;
            }

            if (this._dayPayShow) {
                this.dayPayBox.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
                index += 2;
                if (flag && index === 8) index += 2;
            }
            if (this._moneyCatShow) {
                this.moneyCatBtn.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
                this.moneyCatBuyRP.pos(this.moneyCatBtn.x + 12, this.moneyCatBtn.y - 34, true);
                index += 2;
                if (flag && index === 8) index += 2;
            }

            if (this._sevenActivityShow) {
                this.sevenActivityBox.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
                index += 2;
                if (flag && index === 8) index += 2;
            }

            if (this._limitPackShow) {
                this.limitPackBtn.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
                index += 2;
                if (flag && index === 8) index += 2;
            }
            if (this._everydayFirstPayShow) {
                this.everydayFirstPayBox.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
                index += 2;
                if (flag && index === 8) index += 2;
            }

            if (this._svipSaleActivityShow) {
                this.svipSaleBtn.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
                index += 2;
                if (flag && index === 8) index += 2;
            }

            // if (this._limitPackShow) {
            //     this.dayPayBtn.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
            //     index += 2;
            //     if (flag && index === 8) index += 2;
            // }

            if (this._fightTalismanShow) {
                this.fightTalismanBtn.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
                this.fightTalismanBuyRP.pos(this.fightTalismanBtn.x - 2, this.fightTalismanBtn.y - 106, true);
                index += 2;
                if (flag && index === 8) index += 2;
            }
            if (this._glovesShow) {
                this.glovesBtn.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
                this.glovesRP.pos(this.glovesBtn.x + 12, this.glovesBtn.y - 34, true);
                index += 2;
                if (flag && index === 8) index += 2;
            }
            if (this._oneBuyShow) {
                this.oneBuyBox.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
                index += 2;
                if (flag && index === 8) index += 2;
            }
            if (this._singlePayPrintShow) {
                this.singlePayPrintBox.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
                index += 2;
                if (flag && index === 8) index += 2;
            }
            if (this._payRankShow) {
                this.payRankBox.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
                index += 2;
                if (flag && index === 8) index += 2;
            }
            if (this._fishShow) {
                this.fishBtn.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
                index += 2;
                if (flag && index === 8) index += 2;
            }
            if (this._dishuShow) {
                this.dishuBtn.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
                index += 2;
                if (flag && index === 8) index += 2;
            }
            if (this._yearShow) {
                this.yearBtn.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
                index += 2;
                if (flag && index === 8) index += 2;
            }

            if (this._zztzShow) {
                this.zztzBox.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
                index += 2;
                if (flag && index === 8) index += 2;
            }
            if (this._kh2lcShow) {
                this.kh2LCBox.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
                index += 2;
                if (flag && index === 8) index += 2;
            }
            if (this._kh2pdShow) {
                this.kh2PDBox.pos(this._enterPoses[index], this._enterPoses[index + 1], true);
                index += 2;
                if (flag && index === 8) index += 2;
            }

            this.callLater(this.setPosActionPreview);
        }
    }
}
