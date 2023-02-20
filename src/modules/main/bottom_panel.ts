///<reference path="../chat/chat_ctrl.ts"/>
///<reference path="../intensive/intensive_model.ts"/>
///<reference path="../stone/stone_model.ts"/>
///<reference path="../func_open/func_open_model.ts"/>
///<reference path="../config/human_cfg.ts"/>
///<reference path="../born/born_model.ts"/>
///<reference path="../email/email_model.ts"/>
///<reference path="../month_card/month_card_model.ts"/>
///<reference path="../task/task_model.ts"/>
///<reference path="../config/task_cfg.ts"/>
///<reference path="../red_point/red_point_ctrl.ts"/>
///<reference path="../config/scene_cfg.ts"/>
///<reference path="../scene/scene_model.ts"/>
///<reference path="../common/custom_list.ts"/>
///<reference path="../chat/main_chat_item.ts"/>
///<reference path="../xianfu/xianfu_model.ts"/>
///<reference path="../xianfu/xianfu_ctrl.ts"/>
///<reference path="../dungeon/dungeon_ctrl.ts"/>
///<reference path="../zhizun/zhizun_model.ts"/>
/// <reference path="../limit_pack/limit_pack_model.ts" />
/// <reference path="../clan/clan_model.ts" />
/// <reference path="../marry/marry_model.ts" />
///<reference path="../../game/game_center.ts"/>
/** 主界面底部面板*/

namespace modules.main {
    import blendFields = Configuration.blendFields;
    import humanFields = Configuration.humanFields;
    import sceneFields = Configuration.sceneFields;
    import task = Configuration.task;
    import taskFields = Configuration.taskFields;
    import Event = Laya.Event;
    import BagModel = modules.bag.BagModel;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;
    import ChatCtrl = modules.chat.ChatCtrl;
    import CustomClip = modules.common.CustomClip;
    import BlendCfg = modules.config.BlendCfg;
    import HumanCfg = modules.config.HumanCfg;
    import SceneCfg = modules.config.SceneCfg;
    import TaskCfg = modules.config.TaskCfg;
    import WindowManager = modules.core.WindowManager;
    import EmailModel = modules.email.EmailModel;
    import PlayerModel = modules.player.PlayerModel;
    import SceneModel = modules.scene.SceneModel;
    import TaskModel = modules.task.TaskModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import SingleTask = Protocols.SingleTask;
    import TaskNode = Protocols.TaskNode;
    import TaskNodeFields = Protocols.TaskNodeFields;
    import BottomViewUI = ui.BottomViewUI;
    import Layer = ui.Layer;
    import WindowEnum = ui.WindowEnum;
    import ChatModel = modules.chat.ChatModel;
    import ChatPackage = Protocols.ChatPackage;
    import CustomList = modules.common.CustomList;
    import MainChatItem = modules.chat.MainChatItem;
    import ChatPackageFields = Protocols.ChatPackageFields;
    import ChatContentFields = Protocols.ChatContentFields;
    import XianfuModel = modules.xianfu.XianfuModel;
    import XianfuCtrl = modules.xianfu.XianfuCtrl;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import Item = Protocols.Item;
    import Point = Laya.Point;
    import CommonUtil = modules.common.CommonUtil;
    import TeamInvite = Protocols.TeamInvite;
    import LimitPackModel = modules.limit_pack.LimitPackModel;

    import action_openFields = Configuration.action_openFields;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import human = Configuration.human;
    import ClanModel = modules.clan.ClanModel;
    import MarryModel = modules.marry.MarryModel;

    import GameCenter = game.GameCenter;
    import SkillComponent = game.role.component.SkillComponent;
    import VirtualKeyItem = modules.common.VirtualKeyItem;
    export class BottomPanel extends BottomViewUI {

        // 任务特效
        private _taskClip: CustomClip;
        // private _expEffect: CustomClip;      //特效
        // private _barMaxWidth: number;
        // private _recordLv: number;
        // private _expTweenJs: TweenJS;
        private _emailClip: CustomClip;
        private _isShow: boolean;
        private _isShowNewTitle: boolean;
        private _list: CustomList;
        private _dongTianEff: CustomClip;
        private _zhiLuEff: CustomClip;
        private _girlTween: TweenJS;
        private _wordBoxTween: TweenJS;
        private _grilWords: string[];
        private _girlTime: number;
        private _chatPanels: WindowEnum[];
        private _tipBox1Tween: TweenJS;
        private _tipBox2Tween: TweenJS;
        private _inScene: boolean;       //是否在副本中，用于限时礼包入口控制
        private _equipClip: CustomClip;
        private _limitPackEff: CustomClip;
        private _hasEnterLimitPack: boolean;
        // private _expBarCtrl: ProgressBarCtrl;
        private _skillList: Array<VirtualKeyItem>
        private _friendBtnTween: TweenJS;
        private _strongBtnTween: TweenJS;
        /**
        * 右下角按特效（仙府-家园）
        */
        public initializeClip() {
            // this._equipClip = new CustomClip();
            // this.xfBtn.addChild(this._equipClip);
            // this._equipClip.skin = "assets/effect/tianguan.atlas";
            // let arr1: Array<string> = [];
            // for (let i: int = 0; i < 7; i++) {
            //     // arr1[i] = `tianguan/000${i}.png`;
            //     arr1[i] = `tianguan/${i}.png`;
            // }
            // this._equipClip.frameUrls = arr1;
            // this._equipClip.scale(1.5, 1.5, true);
            // this._equipClip.pos(-70, -105, true);

            // this._equipClip.visible = true;
            // this._equipClip.play();
        }

        protected initialize(): void {
            super.initialize();
            this.initializeClip();

            this.bottom = 0;
            this.centerX = 0;
            this.layer = Layer.MAIN_UI_LAYER;
            this.closeByOthers = false;
            // this._barMaxWidth = 488;
            // this.expBar.width = 0;
            this._isShow = false;
            this._isShowNewTitle = false;
            this.oneKeyBtn.visible = false;
            this._inScene = false;        //是否在副本中，用于限时礼包入口控制

            this.nameTxt.color = "#27b207";
            this.nameTxt.style.fontFamily = "SimHei";
            this.nameTxt.style.fontSize = 22;
            this.nameTxt.style.align = "center";

            this.awardsTxt.color = "#e4fba7";
            this.awardsTxt.style.fontFamily = "SimHei";
            this.awardsTxt.style.fontSize = 21;
            this.awardsTxt.style.align = "center";

            // this._expEffect = new CustomClip();
            // this.addChild(this._expEffect);
            // this._expEffect.skin = "assets/effect/proBar.atlas";
            // this._expEffect.frameUrls = ["proBar/0.png", "proBar/1.png", "proBar/2.png", "proBar/3.png", "proBar/4.png",
            //     "proBar/5.png", "proBar/6.png", "proBar/7.png"];
            // this._expEffect.durationFrame = 5;
            // this._expEffect.play();
            // this._expEffect.loop = true;
            // this._expEffect.y = 190;

            this._emailClip = new CustomClip();
            this.friendsBtn.addChild(this._emailClip);
            this._emailClip.skin = "assets/effect/email.atlas";
            this._emailClip.frameUrls = ["email/1.png", "email/2.png", "email/3.png", "email/4.png", "email/5.png",
                "email/6.png", "email/7.png"/*, "email/8.png"*/];
            this._emailClip.durationFrame = 5;
            this._emailClip.loop = true;
            this._emailClip.pos(20, -20, true);
            this._emailClip.zOrder = 5;

            this._zhiLuEff = CommonUtil.creatEff(this, "xiandi_zhilu", 9);
            this._zhiLuEff.play();
            this._zhiLuEff.pos(-4, 106, true);

            this._dongTianEff = CommonUtil.creatEff(this, "xianfu_dongtian", 23);
            this._dongTianEff.pos(598, 106, true);
            this._dongTianEff.play();

            this._hasEnterLimitPack = false;

            this._list = new CustomList();
            this._list.x = 73;
            this._list.y = 116;
            this._list.width = 575;
            this._list.height = 74;
            this._list.hCount = 1;
            this._list.spaceY = 3;
            this._list.itemRender = MainChatItem;
            this.fitBox.addChild(this._list);
            this.addChild(this.oneKeyBtn);

            this.wordTxt.color = "#2d2d2d";
            this.wordTxt.style.fontFamily = "SimHei";
            this.wordTxt.style.fontSize = 24;
            this.wordTxt.style.valign = "middle";
            this.wordTxt.style.wordWrap = true;

            this._girlTween = TweenJS.create(this.girlImg);
            this._wordBoxTween = TweenJS.create(this.wordBox);

            this._grilWords = BlendCfg.instance.getCfgById(27014)[blendFields.stringParam];

            this.regGuideSpr(GuideSpriteId.BOTTOM_PLAYER_BTN, this.btn4);
            this.regGuideSpr(GuideSpriteId.BOTTOM_MAGIC_ART_BTN, this.btn2);
            // this.regGuideSpr(GuideSpriteId.BOTTOM_MAGIC_PET_BTN, this.btn3);
            this.regGuideSpr(GuideSpriteId.BOTTOM_DUANZAO_BTN, this.btn5);
            this.regGuideSpr(GuideSpriteId.BOTTOM_BAG_BTN, this.btn6);
            this.regGuideSpr(GuideSpriteId.BOTTOM_XIUXIAN_BTN, this.zsBtn);
            this.regGuideSpr(GuideSpriteId.BOTTOM_XIANFU_BTN, this.xfBtn);
            this.regGuideSpr(GuideSpriteId.BOTTOM_CHAT_ENTER, this._list);
            this.regGuideSpr(GuideSpriteId.BOTTOM_TASK_BG, this.taskBg);
            this.regGuideSpr(GuideSpriteId.RIGHT_BOTTOM_BOSS_ENTER_BTN, this.btn3);
            // this.regGuideSpr(GuideSpriteId.BOTTOM_CashEquip_BTN, this.qzBtn);

            this.addChild(this.girlBox);

            this.inputTxt.visible = this.timeTxt.visible = DEBUG;

            // this._recordLv = PlayerModel.instance.level;

            // this._expBarCtrl = new ProgressBarCtrl(this.expBar, this._barMaxWidth);
            // this._expTweenJs = TweenJS.create(this._expBarCtrl);

            this._chatPanels = [WindowEnum.CHAT_FACTION_PANEL];
            this.rockerBtn.start();// 激活
            // this.skill1,
            this._skillList = [this.skill2, this.skill3, this.skill4]

            // 去掉此位置的限时礼包
            this.limitPackBtn.visible = false;

            // 初始化特效
            this.initEffect();


        }

        protected onOpened(): void {
            super.onOpened();

            // this._recordLv = PlayerModel.instance.level;
            // this._expBarCtrl.value = PlayerModel.instance.exp;

            this.updateSmelt();
            this.updateNewTitle();
            // this.updataExpBar();
            this.emailNotice();
            this.taskUpdatedHandler();
            this.enterScene();
            this.chatUpdate();
            this.setActionPreviewPos();
            //this.mlBtnShow();
            this.calcClanBtnShow();
            this.isMarryBtnShow();
            this.updateTeamInviteBtn();
            this.limitPackUpdateHandler();
            this.updateFactionMessage();
            //this.moreBtnShow();
            this.wxIosPayShow();
            this.updateSkill();
            this.updateFriendBtnTween();
            this.updateStrongBtnTween();
            this.updateXianFuGrayState();//家园置灰情况
            this.showRocker(-1);

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
            Point.TEMP.setTo(this.zsBtn.width / 2, this.zsBtn.height / 2);
            let pos = this.zsBtn.localToGlobal(Point.TEMP, true);
            let posSprite = modules.action_preview.actionPreviewModel.instance._posSprite;
            posSprite.set(ActionOpenId.xianwei, pos);
            posSprite.set(ActionOpenId.era, pos);
            posSprite.set(ActionOpenId.xiuxianEnter, pos);

            Point.TEMP.setTo(this.btn4.width / 2, this.btn4.height / 2);
            let pos1 = this.btn4.localToGlobal(Point.TEMP, true);
            posSprite.set(ActionOpenId.soul, pos1);
            posSprite.set(ActionOpenId.rune, pos1);
            posSprite.set(ActionOpenId.shenbingFeed, pos1);
            posSprite.set(ActionOpenId.shenbingMagicShow, pos1);
            posSprite.set(ActionOpenId.shenbingRefine, pos1);
            posSprite.set(ActionOpenId.wingFeed, pos1);
            posSprite.set(ActionOpenId.wingMagicShow, pos1);
            posSprite.set(ActionOpenId.wingRefine, pos1);
            posSprite.set(ActionOpenId.wingRefine, pos1);
            posSprite.set(ActionOpenId.wingRefine, pos1);
            posSprite.set(ActionOpenId.actorEnter, pos1);
            posSprite.set(ActionOpenId.fashionEnter, pos1);
            posSprite.set(ActionOpenId.tianZhuEnter, pos1);
            posSprite.set(ActionOpenId.fashionFeed, pos1);
            posSprite.set(ActionOpenId.fashionMagicShow, pos1);
            posSprite.set(ActionOpenId.fashionRefine, pos1);
            posSprite.set(ActionOpenId.tianZhuFeed, pos1);
            posSprite.set(ActionOpenId.tianZhuMagicShow, pos1);
            posSprite.set(ActionOpenId.tianZhuRefine, pos1);
            posSprite.set(ActionOpenId.equipSuit, pos1);


            Point.TEMP.setTo(this.btn2.width / 2, this.btn2.height / 2);
            let pos2 = this.btn2.localToGlobal(Point.TEMP, true);
            posSprite.set(ActionOpenId.skill, pos2);
            posSprite.set(ActionOpenId.amulet, pos2);
            posSprite.set(ActionOpenId.xianfaEnter, pos2);

            Point.TEMP.setTo(this.btn3.width / 2, this.btn3.height / 2);
            let pos3 = this.btn3.localToGlobal(Point.TEMP, true);
            posSprite.set(ActionOpenId.petFeed, pos3);
            posSprite.set(ActionOpenId.petMagicShow, pos3);
            posSprite.set(ActionOpenId.petRefine, pos3);
            posSprite.set(ActionOpenId.rideFeed, pos3);
            posSprite.set(ActionOpenId.rideMagicShow, pos3);
            posSprite.set(ActionOpenId.rideRefine, pos3);
            posSprite.set(ActionOpenId.petFazhen, pos3);
            posSprite.set(ActionOpenId.rideFazhen, pos3);
            posSprite.set(ActionOpenId.xianlingEnter, pos3);

            Point.TEMP.setTo(this.btn5.width / 2, this.btn5.height / 2);
            let pos4 = this.btn5.localToGlobal(Point.TEMP, true);
            posSprite.set(ActionOpenId.strong, pos4);
            posSprite.set(ActionOpenId.gem, pos4);
            posSprite.set(ActionOpenId.duanzaoEnter, pos4);
            posSprite.set(ActionOpenId.zhuhun, pos4);
            posSprite.set(ActionOpenId.xilian, pos4);

            Point.TEMP.setTo(this.btn6.width / 2, this.btn6.height / 2);
            let pos5 = this.btn6.localToGlobal(Point.TEMP, true);
            posSprite.set(ActionOpenId.smelt, pos5);
            posSprite.set(ActionOpenId.compose, pos5);
            posSprite.set(ActionOpenId.resolve, pos5);
            posSprite.set(ActionOpenId.bag, pos5);
            posSprite.set(ActionOpenId.beibaoEnter, pos5);
            posSprite.set(ActionOpenId.shenqi, pos5);
            posSprite.set(specialAniPoin.beiBao, pos5);

            Point.TEMP.setTo(this.xfBtn.width / 2, this.xfBtn.height / 2);
            let pos6 = this.xfBtn.localToGlobal(Point.TEMP, true);
            posSprite.set(ActionOpenId.xianFuEnter, pos6);

            // Point.TEMP.setTo(this.qzBtn.width / 2, this.qzBtn.height / 2);
            // let pos7 = this.qzBtn.localToGlobal(Point.TEMP, true);
            // posSprite.set(ActionOpenId.CashEquip, pos7);

            // Point.TEMP.setTo(this.chatBgImg.width / 2, this.chatBgImg.height / 2);
            // let pos7 = this.localToGlobal(Point.TEMP, true);
            // posSprite.set(ActionOpenId.xianFuEnter, pos7);
        }

        public close(): void {
            if (this._tipBox1Tween) {
                this._tipBox1Tween.stop();
            }
            if (this._tipBox2Tween) {
                this._tipBox2Tween.stop();
            }
            super.close();
            this._girlTween.stop();
            this._wordBoxTween.stop();
            // this._expTweenJs.stop();
            this.updateFriendBtnTween();
            this.updateStrongBtnTween();
        }
        private wxIosPayShow() {
            this.strongBtn.visible = !Main.instance.isWXiOSPay;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.autoBtn, common.LayaEvent.CLICK, this, () => {
                SystemNoticeManager.instance.addNotice(`2秒后恢复AI控制`, false);
                PlayerModel.instance.autoAi = true
                // let result = []
                // MapUtils.AStarPath(new Point(50, 100), new Point(60, 100), 5, 0, result);
            });
            this.addAutoListener(this.btn2, common.LayaEvent.CLICK, this, this.btn2Handler);
            this.addAutoListener(this.btn3, common.LayaEvent.CLICK, this, this.btn3Handler);
            this.addAutoListener(this.btn4, common.LayaEvent.CLICK, this, this.btn4Handler);
            this.addAutoListener(this.btn5, common.LayaEvent.CLICK, this, this.btn5Handler);
            this.addAutoListener(this.btn6, common.LayaEvent.CLICK, this, this.btn6Handler);
            this.addAutoListener(this.taskBg, common.LayaEvent.CLICK, this, this.clickTaskHandler);
            this.addAutoListener(this.oneKeyBtn, common.LayaEvent.CLICK, this, this.oneKeySmelt);
            this.addAutoListener(this.newTitleBtn, common.LayaEvent.CLICK, this, this.newTitleBtnSmelt);
            this.addAutoListener(this.friendsBtn, common.LayaEvent.CLICK, this, this.friendsHandler);
            this.addAutoListener(this.strongBtn, common.LayaEvent.CLICK, this, this.strongHandler);
            this.addAutoListener(this.xxBtn, common.LayaEvent.CLICK, this, this.xxHandler);
            this.addAutoListener(this.xfBtn, common.LayaEvent.CLICK, this, this.xfHandler);
            // this.addAutoListener(this.qzBtn, common.LayaEvent.CLICK, this, this.qzHandler);
            this.addAutoListener(this.inputTxt, Event.ENTER, this, this.inputEnterHandler);
            this.addAutoListener(this._list, Event.CLICK, this, this.chatMessageTxtHandler);
            this.addAutoListener(this.closeGirlBtn, Event.CLICK, this, this.closeGirlBtnHandler);
            this.addAutoListener(this.zsBtn, Event.CLICK, this, this.zsBtnHandler);       //觉醒
            //this.addAutoListener(this.mlBtn, common.LayaEvent.CLICK, this, this.messageBtnHandler);
            //this.addAutoListener(this.moreBtn, common.LayaEvent.CLICK, this, this.showMoreViewHandler);
            //this.addAutoListener(this.clanBtn, common.LayaEvent.CLICK, this, this.clanBtnHandler);
            //this.addAutoListener(this.marryBtn, common.LayaEvent.CLICK, this, this.marryBtnHandler);
            this.addAutoListener(this.teamWaitBox, common.LayaEvent.CLICK, this, this.teamWaitBtnHandler);
            this.addAutoListener(this.teamInviteBtn, common.LayaEvent.CLICK, this, this.teamInviteBtnHandler);
            this.addAutoListener(this.limitPackBtn, Event.CLICK, this, this.limitPackBtnHandler);       //限时礼包按钮回调

            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_SHOW_PAY_STATUS, this, this.wxIosPayShow);      //微信ios支付显示
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SELECT_CHAT_CHANNEL, this, this.chatUpdate);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.CHAT_UPDATE, this, this.chatUpdate);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_MESSAGE_UPDATE, this, this.updateFactionMessage);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PANEL_OPENED, this, this.otherOpenHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PANEL_CLOSED, this, this.otherCloseHandler);
            //this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_INFO, this, this.mlBtnShow);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RESIZE_UI, this, this.setActionPreviewPos);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ACTION_PREVIEW_RESIZE_UI, this, this.setActionPreviewPos);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_TITLE_UPDATE, this, this.updateNewTitle);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_EXP, this, this.updataExpBar);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.EMAIL_LIST_UPDATE, this, this.emailNotice);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TASK_UPDATED, this, this.taskUpdatedHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateSmelt);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_DATA_INITED, this, this.updateSmelt);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SELECT_SMELT_UPDATE, this, this.updateSmelt);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_EQUIPS_INITED, this, this.updateSmelt);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SCENE_ENTER, this, this.enterScene);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SMELT_UPDATE, this, this.updateSmelt);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZHIZUN_UPDATE, this, this.updateSmelt);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TEAM_COPY_ASK_LIST_UPDATE, this, this.updateTeamInviteBtn);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TEAM_COPY_ROOM_UPDATE, this, this.updateTeamWaitBtnShow);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LIMIT_PACK_UPDATE, this, this.limitPackUpdateHandler);      //限时礼包入口控制
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.TEAM_BATTLE_MATCH_UPDATE, this, this.teamMatchUpdate);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MISSION_UPDATE_LV, this, this.calcClanBtnShow);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MISSION_UPDATE_LV, this, this.isMarryBtnShow);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FUNC_OPEN_UPDATE, this, this.updateXianFuGrayState);
            // PLAYER_UPDATE_LEVEL
            // MISSION_UPDATE_LV

            //this.addAutoRegisteRedPoint(this.dottImg_more, ["ClanGradeAwardRP", "ClanShopRP", "ClanApplyListRP"]);
            //this.addAutoRegisteRedPoint(this.clanRPImg, ["ClanGradeAwardRP", "ClanShopRP", "ClanApplyListRP"]);
            //this.addAutoRegisteRedPoint(this.marryRPImg, ["marryRP", "marryRingRP", "marryKeepsakeRP", "marryChildrenRP"]);
            //this.addAutoRegisteRedPoint(this.dotImg_3, ["petFeedSkillRP", "petFeedMatRP", "petRankSkillRP", "petRefineMaterialRP", "weaponFeedSkillRP", "weaponFeedMatRP", "weaponRankSkillRP", "weaponRefineMaterialRP", "weaponIllusionRP", "petIllusionRP", "petRankMatRP", "weaponRankMatRP", "magicPetFazhenJipinRP", "magicPetFazhenZhenpinRP", "magicPetFazhenJuepinRP", "weaponFazhenJipinRP", "weaponFazhenZhenpinRP", "weaponFazhenJuepinRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_3, ["singleBossRP", "multiBossRP", "yunMengBossRP", "threeWorldsRP", "shenYuBossRP", "bossHomeRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_zs, ["bornRP", "magicPositionRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_5, ["intensiveRP", "stoneRP", "equipmentZuHunRP", "xiLianMaster"]);
            this.addAutoRegisteRedPoint(this.dotImg_2, ["talismanRP", "magicArtRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_4, [
                "redEquipComposeRP", "goldBodyRP", "runeRP", "runeComposeRP", "runeCollectRP",
                "equipPartRP", "immortalsShengjiRP", "immortalsHuanhuaJipinRP", "immortalsHuanhuaDianchangRP",
                "immortalsHuanhuaZhenpinRP", "immortalsHuanhuaJuepinRP", "immortalsFuhunRP",
                "wingShengjiRP", "wingHuanhuaJipinRP", "wingHuanhuaZhenpinRP",
                "wingHuanhuaJuepinRP", "wingHuanhuaDianchangRP", "wingFuhunRP", "playerTitleRP",
                "moneyCatRP", "equipSuitRP_0", "equipSuitRP_1",
                "equipSuitRP_2", "equipSuitRP_3", "equipSuitRP_4",
                "equipSuitRP_5", "equipSuitRP_6", "equipSuitRP_7",
                "equipSuitRP_8", "equipSuitRP_9",
                "equipSuitRP_10", "equipSuitRP_11", "equipSuitRP_12", "equipSuitRP_13", "equipSuitRP_14",

                "xianDanRP", "xuzuRP",
                "tianZhuShengJiRP", "tianZhuShengJiMatRP", "tianZhuHuanHuaZhenPinRP",
                "tianZhuHuanHuaJiPinRP", "tianZhuHuanHuaJuePinRP", "tianZhuFuHunRP",
                "fashionShengJiRP", "fashionShengJiMatRP", "fashionHuanHuaZhenPinRP",
                "fashionHuanHuaJiPinRP", "fashionHuanHuaJuePinRP", "fashionHuanHuaDianchangRP", "fashionFuHunRP",

                "weaponFeedSkillRP", "weaponFeedMatRP", "weaponRankSkillRP", "weaponRankMatRP", "weaponIllusionRP", "weaponRefineMaterialRP", "weaponFazhenJipinRP",
                "weaponFazhenZhenpinRP", "weaponFazhenJuepinRP", "petFeedSkillRP", "petFeedMatRP", "petRankSkillRP", "petRankMatRP", "petIllusionRP", "petRefineMaterialRP",
                "magicPetFazhenJipinRP", "magicPetFazhenZhenpinRP", "magicPetFazhenJuepinRP",
                "guanghuanShengJiRP", "guanghuanShengJiMatRP", "guanghuanHuanHuaZhenPinRP", "guanghuanHuanHuaJiPinRP", "guanghuanHuanHuaJuePinRP", "guanghuanHuanHuaDianchangRP", "guanghuanFuHunRP"
            ]);
            this.addAutoRegisteRedPoint(this.dotImg_6, ["bagRP", "composeRP", "shenqiRP", "resolveRP"]);
            this.addAutoRegisteRedPoint(this.shangChengRPImg, ["shangchengRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_xx, ["factionApplyJoinRP", "factionPostApplyRP", "mineBaozangListRP", "helpBaozangListRP", "factionHurtAwardRP", "factionSkillRP", "factionDialRP"]);

            if (DEBUG) {
                Laya.timer.loop(1000, this, this.loopHandler);
            }

            // 虚拟摇杆  控制
            this.addAutoListener(this.rockerBtn, 'rocker_move', this, this.mouseMoveHandler);// 滑动
            this.addAutoListener(this.rockerBtn, 'rocker_end', this, this.closeAIauto);// 弹起结束
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SCENE_ENTER, this, this.showRocker); // 控制显示

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.VIRTUAL_SKILL_INIT, this, this.updateSkill);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.VIRTUAL_SKILL_UPDATE, this, this.updateSkillCd);
        }


        private mouseMoveHandler() {
            // return;
            PlayerModel.instance.moveDirection = this.rockerBtn.direction
            PlayerModel.instance.autoAi = false
            // PlayerModel.instance.selectTargetType = SelectTargetType.Dummy
        }
        private closeAIauto() {
            // return;
            PlayerModel.instance.autoAi = true
            PlayerModel.instance.moveDirection = -1
        }

        private showRocker(mapId: number = -1) {
            this.skillBox.visible = this.rockerBtn.visible = false;
            this.autoBtn.visible = false;
            let type = SceneCfg.instance.getCfgById(mapId !== -1 ? mapId : SceneModel.instance.enterScene[EnterSceneFields.mapId])[sceneFields.type];
            // this.skillBox.visible = this.rockerBtn.visible = [SceneTypeEx.common, SceneTypeEx.debugCopy].indexOf(type) > -1
            this.rockerBtn.visible = [SceneTypeEx.homestead, SceneTypeEx.debugCopy].indexOf(type) > -1;
            // this.skillBox.visible = this.rockerBtn.visible = false
        }

        private updateFriendBtnTween() {
            if (this._friendBtnTween) this._friendBtnTween.stop();
            let posX = this.globalToLocal(new Point(0, 0)).x;
            this._friendBtnTween = TweenJS.create(this.friendsBox).to({ x: posX }, CommonConfig.panelTweenDuration).onComplete(() => {
            }).start();
        }

        private updateStrongBtnTween() {
            if (this._strongBtnTween) this._strongBtnTween.stop();
            let posX = this.globalToLocal(new Point(Laya.stage.width, 0)).x;
            this._strongBtnTween = TweenJS.create(this.strongBox).to({ x: posX }, CommonConfig.panelTweenDuration).onComplete(() => {
                GlobalData.dispatcher.event(CommonEventType.ACTION_PREVIEW_RESIZE_UI);
            }).start();
        }

        private updateSkill() {
            for (const iterator of this._skillList) {
                iterator.visible = false
            }
            if (!GameCenter.instance._master) return
            let list = GameCenter.instance._master.getComponent(SkillComponent).getSkillList().reverse();
            this.skill1.skillId = 80010001;
            this.skill1.visible = true
            for (let index = 0; index < this._skillList.length; index++) {
                if (list.length > index) {
                    this._skillList[index].skillClass = list[index][0] // 大类ID
                    this._skillList[index].visible = true
                } else {
                    this._skillList[index].visible = false
                }


            }
        }
        private updateSkillCd() {
            if (!GameCenter.instance._master) return
            let list = GameCenter.instance._master.getComponent(SkillComponent).getCdSkill();
            for (const key in list) {
                let skillClass = list[key][0] // 大类ID
                let skillCd = list[key][1] // 剩余CD 
                for (let index = 0; index < this._skillList.length; index++) {
                    if (this._skillList[index].skillClass == skillClass) {
                        this._skillList[index].cdPlay(skillCd);
                    }
                }
            }


        }

        protected removeListeners(): void {
            Laya.timer.clear(this, this.loopHandler);
            super.removeListeners();
        }

        // private mlBtnShow(): void {
        //     if (faction.FactionModel.instance.factionId) {
        //         this.mlBtn.disabled = false;
        //     } else {
        //         this.mlBtn.disabled = true;
        //         this.mlRPImg.visible = false;
        //     }
        // }
 

        private calcClanBtnShow(): void {
            let clan_isOpen: boolean = FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.ClanEntry);
            // this.clanBtn.disabled = !clan_isOpen;
            //this.clanBtn.visible = clan_isOpen;
            //this.moreBtnShow();
        }
        private isMarryBtnShow(): void {
            let marry_isOpen: boolean = FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.marry);
            //this.marryBtn.visible = marry_isOpen;
            //this.moreBtnShow();
        }
        private otherOpenHandler(windowId: WindowEnum): void {
            if (windowId == null) return;

            if (this._chatPanels.indexOf(windowId) != -1) { //聊天面板打开
                //this.mlRPImg.visible = this.fitBox.visible = false;
            }
            if (windowId == WindowEnum.TEAM_COPY_ROOM_ALERT) { //组队副本
                this.teamWaitBox.visible = false;
            }
        }

        private otherCloseHandler(windowId: WindowEnum): void {
            if (windowId == null) return;
            if (this._chatPanels.indexOf(windowId) != -1) {
                this.fitBox.visible = true;
            }
            if (windowId == WindowEnum.TEAM_COPY_ROOM_ALERT) { //组队副本
                this.teamWaitBox.visible = teamBattle.TeamBattleModel.Instance.isHaveRoom;
            }
        }

        private updateFactionMessage(): void {
            if (ChatModel.instance.currChatChannel != ChatChannel.faction && ChatModel.instance.noSeeMessage) {
                //this.mlRPImg.visible = true;
            }
        }

        //仙府-家园事件更新
        private xianfuEventHandler(): void {
            if (this._girlTween.isPlaying || this._wordBoxTween.isPlaying) {
                return;
            }
            let ids: number[] = XianfuModel.instance.eventIds || [];
            let id: number = ArrayUtils.random(ids);
            if (id == null) return;
            this.girlBox.visible = true;
            this.wordTxt.innerHTML = this._grilWords[id];
            this.wordTxtCenterY();
            if (!this._girlTween || !this._wordBoxTween) {
                return;
            }
            this._girlTween.to({ scaleX: 1, scaleY: 1 }, 500).start().onComplete(() => {
                this._wordBoxTween.to({ x: 0 }, 500).start();
                this._girlTime = 3000;
                Laya.timer.loop(1000, this, this.girlTime);
            });
        }

        private wordTxtCenterY(): void {
            this.wordTxt.style.height = this.wordTxt.contextHeight;
            this.wordTxt.y = (this.wordBox.height - this.wordTxt.height) / 2;
        }

        private girlTime(): void {
            if (this._girlTime <= 0) {
                this.girlBox.visible = false;
                this.wordBox.x = this.wordBox.width;
                this.girlImg.scale(0, 0);
                Laya.timer.clear(this, this.girlTime);
                return;
            } else {
                this._girlTime -= 1000;
            }
        }

        private initGirlShow(): void {
            this._girlTime = 0;
            this.girlTime();
        }

        private chatUpdate(): void {
            let currChannel: number = ChatModel.instance.currChatChannel;
            let massages: ChatPackage[];

            if (currChannel == ChatChannel.cross) { //九州
                massages = ChatModel.instance.jiuzhouChatRecord;
                this.checkChatContentType(massages);
            } else if (currChannel == ChatChannel.local) { //本服
                massages = ChatModel.instance.benfuChatRecord;
                this.checkChatContentType(massages);
            } else if (currChannel == ChatChannel.faction) { //仙盟
                massages = ChatModel.instance.factionChatRecord;
                this.checkChatContentType(massages);
            } else if (currChannel == ChatChannel.marry) { //姻缘
                massages = ChatModel.instance.marryChatRecord;
                this.checkChatContentType(massages);
            } else if (currChannel == ChatChannel.system) { //系统
                let listInfos: ChatPackage[] = ChatModel.instance.systemChatRecord.concat();
                if (!listInfos) return;
                if (listInfos.length > 3) {
                    listInfos = listInfos.splice(-3);
                }

                this._list.datas = listInfos;
            }
            if (this._list.conHeight >= this._list.height) {  //聊天框上移
                this._list.scrollPos = this._list.conHeight - this._list.height;
            }
        }

        private checkChatContentType(massages: ChatPackage[]): void {
            if (massages.length == 0) {
                this._list.datas = [];
            } else if (massages[massages.length - 1][ChatPackageFields.content][ChatContentFields.contentType] == 2) {
                this._list.datas = [massages[massages.length - 1]];
            } else {
                this._list.datas = massages.slice(massages.length - 3, massages.length);
            }
        }

        private chatMessageTxtHandler(): void {
            let panel: WindowEnum = chat.ChatUtil.getChatPanelByChatType(ChatModel.instance.currChatChannel);
            WindowManager.instance.open(panel);
        }

        private inputEnterHandler(): void {
            if (this.inputTxt.text) {
                ChatCtrl.instance.gmCommand(this.inputTxt.text);
            }
        }

        private oneKeySmelt(): void {
            BagModel.instance.quicklyOneKeySmelt();
            this.updateSmelt();
        }

        private newTitleBtnSmelt(): void {
            WindowManager.instance.open(WindowEnum.PLAYER_TITLE_PANEL);
        }

        private updateSmelt(): void {
            let restNum = BagModel.instance.getBagEnoughById(1);
            let isShow: boolean = !(restNum > BlendCfg.instance.getCfgById(10007)[blendFields.intParam][0]);
            if (isShow) {
                let flag: boolean = false;
                let items: Array<Item> = BagModel.instance.getSmeltRank();
                if (items && items.length > 0) {
                    flag = true;
                }
                isShow = flag;
            }
            if (this._isShow != isShow) {
                this.oneKeyBtn.visible = isShow;
                this._isShow = isShow;
                if (isShow) {
                    this.smeltEffectLoop();
                } else {
                    if (this._tipBox1Tween) {
                        this._tipBox1Tween.stop();
                    }
                }
            }
        }

        private smeltEffectLoop(): void {
            if (this._tipBox1Tween) {
                this._tipBox1Tween.stop();
            }
            this.oneKeyBtn.y = 48;
            this._tipBox1Tween = TweenJS.create(this.oneKeyBtn).to({ y: this.oneKeyBtn.y - 15 },
                600).start().yoyo(true).repeat(99999999);
        }

        /**
         * 判断是否还有未激活的称号
         */
        private updateNewTitle(): void {
            let isShow: boolean = modules.player_title.PlayerTitleModel.instance.isJiHuo();
            if (this._isShowNewTitle != isShow) {
                // this.newTitleBtn.visible = isShow;
                this._isShowNewTitle = isShow;
                if (isShow) {
                    this.newTitleBtnEffectLoop();
                } else {
                    if (this._tipBox2Tween) {
                        this._tipBox2Tween.stop();
                    }
                }
            }
        }

        private newTitleBtnEffectLoop(): void {
            if (this._tipBox2Tween) {
                this._tipBox2Tween.stop();
            }
            this.newTitleBtn.y = 48;
            this._tipBox2Tween = TweenJS.create(this.newTitleBtn).to({ y: this.newTitleBtn.y - 15 },
                600).start().yoyo(true).repeat(99999999);
        }

        private enterScene(mapId: number = -1): void {
            this.nineCopyBox.visible = false;
            if (mapId === -1 && !SceneModel.instance.enterScene) return;
            let type = SceneCfg.instance.getCfgById(mapId !== -1 ? mapId : SceneModel.instance.enterScene[EnterSceneFields.mapId])[sceneFields.type];
            this.initGirlShow();
            GlobalData.dispatcher.off(CommonEventType.XIANFU_ALL_RP_EVENT, this, this.xianfuEventHandler);
            if (type === SceneTypeEx.common) {      // 挂机
                this.fitBox.addChildAt(this.taskBox, 5);
                GlobalData.dispatcher.on(CommonEventType.XIANFU_ALL_RP_EVENT, this, this.xianfuEventHandler);
                this.xianfuEventHandler();
                this._inScene = false;        //是否在副本中，用于限时礼包入口控制
                // this.moreBtn.visible = true;
                //this.moreBtnShow();
                this.limitPackUpdateHandler();
            } else {// 副本
                //this.moreView.visible = false;
                // this.moreBtn.visible = false;
                //this.moreBtnShow(false);
                this.taskBox.removeSelf();
                this.effectCompleteHandler();

                this._inScene = true;        //是否在副本中，用于限时礼包入口控制
                this.limitPackUpdateHandler();
                if (type === SceneTypeEx.nineCopy && SceneModel.instance.enterScene[EnterSceneFields.level] === 9) {
                    this.nineCopyBox.visible = true;
                }
            }
        }

        private xxHandler(): void {   // 修仙
            //BottomTabCtrl.instance.openTabByFunc(ActionOpenId.xiuxianEnter);
            BottomTabCtrl.instance.openTabByFunc(ActionOpenId.factionEnter);
        }

        private btn2Handler(): void {     //仙法
            BottomTabCtrl.instance.openTabByFunc(ActionOpenId.xianfaEnter);
        }

        private btn3Handler(): void {     //boss
            //BottomTabCtrl.instance.openTabByFunc(ActionOpenId.xianlingEnter);
            BottomTabCtrl.instance.openTabByFunc(ActionOpenId.boss);
        }

        private btn4Handler(): void {     //角色
            WindowManager.instance.open(WindowEnum.PLAYER_PANEL);
        }

        private btn5Handler(): void {     //锻造
            BottomTabCtrl.instance.openTabByFunc(ActionOpenId.duanzaoEnter);
        }

        private btn6Handler(): void {     //背包
            BottomTabCtrl.instance.openTabByFunc(ActionOpenId.beibaoEnter);
        }

        private friendsHandler(): void { // 好友
            WindowManager.instance.open(WindowEnum.EMAIL_PANEL);
        }

        private strongHandler(): void {   // 现在跳商城
            let isSubfunction: number = modules.config.ActionOpenCfg.instance.getCfgById(ActionOpenId.store)[action_openFields.isSubfunction];
            if (isSubfunction) {
                // let panelId: number = GlobalData.getWindowConfigByFuncId(this._funcId)[WindowInfoFields.panelId];
                // WindowManager.instance.open(panelId);
                WindowManager.instance.openByActionId(ActionOpenId.storeAndShop);
            } else {
                BottomTabCtrl.instance.openTabByFunc(ActionOpenId.storeAndShop);
            }
        }
        // //战队入口
        // private clanBtnHandler(): void {
        //     let hasJoinClan = ClanModel.instance.hasJoinClan;
        //     if (hasJoinClan) {
        //         BottomTabCtrl.instance.openTabByFunc(ActionOpenId.ClanEntry);
        //     } else {
        //         WindowManager.instance.open(WindowEnum.CLAN_LIST_PANEL);
        //     }
        //     this.showMoreViewHandler();
        // }
        // // 姻缘入口
        // private marryBtnHandler(): void {
        //     // let hasJoinClan = MarryModel.instance.;
        //     // if (hasJoinClan) {
        //     //     BottomTabCtrl.instance.openTabByFunc(ActionOpenId.marry);
        //     // } else {
        //     WindowManager.instance.open(WindowEnum.MARRY_PANEL);
        //     // }
        //     this.showMoreViewHandler();
        // }

        /**
         * 设置更多按钮显隐
         * @author VTZ vvtz@qq
         */
        // private moreBtnShow(b?: boolean) {
        //     if (typeof b === "undefined" || b !== false) {
        //         for (let i = 0; i < this.moreView._childs.length; i++) {
        //             // 遍历子对象有显示的则显示
        //             if (this.moreView._childs[i].visible) {
        //                 b = true;
        //                 break;
        //             }
        //         }
        //     }
        //     this.moreBtn.visible = b;
        // }

        // //更多按钮
        // private showMoreViewHandler(e = null): void {
        //     if (e != null && this.moreView.visible && (e.target.parent != null && e.target.parent.name == "moreView" || e.target.name == "moreView")) return;
        //     this.moreView.visible = !this.moreView.visible;
        //     if (this.moreView.visible) {
        //         Laya.stage.on(common.LayaEvent.MOUSE_DOWN, this, this.showMoreViewHandler)
        //     } else {
        //         Laya.stage.off(common.LayaEvent.MOUSE_DOWN, this, this.showMoreViewHandler)
        //     }
        // }

        // //盟聊按钮
        // private messageBtnHandler(): void {
        //     WindowManager.instance.open(WindowEnum.CHAT_FACTION_PANEL);
        //     this.showMoreViewHandler();
        // }

        private teamWaitBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.TEAM_COPY_ROOM_ALERT);
        }

        private updateTeamWaitBtnShow(): void {
            this.teamWaitBox.visible = teamBattle.TeamBattleModel.Instance.isHaveRoom;
        }

        private updateTeamInviteBtn(): void {
            let isOpen: boolean = FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.teamCopy);
            if (isOpen) {
                let list: TeamInvite[] = teamBattle.TeamBattleModel.Instance.askList;
                this.teamInviteBtn.visible = list.length > 0;
            } else {
                this.teamInviteBtn.visible = false;
            }
        }

        private teamMatchUpdate(): void {
            let count: number = teamBattle.TeamBattleModel.Instance.playerInfos.length;
            this.teamWaitCountTxt.text = `${count + 1}/3`;
        }

        private teamInviteBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.TEAM_COPY_ASK_ALERT);
        }

        private xfHandler(): void {       // 仙府-家园
            XianfuCtrl.instance.enterScene();
            // SystemNoticeManager.instance.addNotice(`暂未开启,敬请期待!`, true);
        }

        private qzHandler(): void {       // 仙府-家园
            WindowManager.instance.open(WindowEnum.CashEquip_PANEL)
        }

        private zsBtnHandler(): void {       //觉醒
            BottomTabCtrl.instance.openTabByFunc(ActionOpenId.xiuxianEnter);
        }

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
            if (this._inScene) {
                this.limitPackBtn.visible = false;
                return;
            }
            //如果礼包数组不为空,显示入口，否则隐藏
            if (LimitPackModel.instance.limitPackInfo && LimitPackModel.instance.limitPackInfo.length) {
                this.limitPackBtn.visible = false;
                //如果没点击过入口为入口添加特效
                if (this._hasEnterLimitPack == false && !this._limitPackEff) {
                    this._limitPackEff = CommonUtil.creatEff(this.limitPackBtn, `activityEnter`, 15);
                    this._limitPackEff.play();
                }
            } else {
                this.limitPackBtn.visible = false;
            }
        }
        private _effect: CustomClip;

        private initEffect() {
            this._effect = new CustomClip();
            this.taskBg.addChild(this._effect);
            let frameUrls: Array<string> = [];
            for (let i: int = 0, len: int = 9; i < len; i++) {
                frameUrls.push(`assets/effect/task/eff_${i}.png`);
            }
            this._effect.pos(-70, -38);
            this._effect.frameUrls = frameUrls;
            this._effect.durationFrame = 4;
            this._effect.loop = false;
            this._effect.zOrder = 10;
            this._effect.visible = false;
            this._effect.scale(1.2, 0.8)
        }

        public play(): void {
            this._effect.on(Event.COMPLETE, this, this.effectCompleteHandler);
            this._effect.play();
            this._effect.visible = true;
        }

        private effectCompleteHandler(): void {
            this._effect.visible = false;
            this._effect.off(Event.COMPLETE, this, this.effectCompleteHandler);
        }


        private clickTaskHandler(): void {
            let taskInfo: SingleTask = TaskModel.instance.taskInfo;
            if (!taskInfo) return;

            if (taskInfo[Protocols.SingleTaskFields.state] === 2) {       // 可点击领奖
                TaskCtrl.instance.getTaskAward(taskInfo[Protocols.SingleTaskFields.taskId]);
                this.play();
            } else {
                let id: number = TaskCfg.instance.getTaskCfgById(taskInfo[Protocols.SingleTaskFields.taskId])[taskFields.skipActionId];
                if (!id) return;
                if (id === ActionOpenId.tianguan) {
                    this.panelHandler();
                } else {
                    WindowManager.instance.openByActionId(id);
                }
            }
        }

        private panelHandler(): void {
            let missionCfg = config.SceneCopyTianguanCfg.instance.getCfgByLv(mission.MissionModel.instance.curLv);
            if (!missionCfg) return;
            let shuju = BlendCfg.instance.getCfgById(32001);
            let MaxCurLvNoOpenWin = shuju ? shuju[blendFields.intParam][0] : 0;
            if (mission.MissionModel.instance.curLv <= MaxCurLvNoOpenWin) {//小于多少关直接挑战无需打开界面
                let maxWare: number = missionCfg[Configuration.scene_copy_tianguanFields.killWare];
                if (mission.MissionModel.instance.curWare === maxWare && !mission.MissionModel.instance.auto) {//在不自动打的时候才生效
                    mission.MissionCtrl.instance.challenge(missionCfg[Configuration.scene_copy_tianguanFields.mapId]);
                } else {
                    let maxWare: number = missionCfg[Configuration.scene_copy_tianguanFields.killWare];
                    let curWare: number = mission.MissionModel.instance.curWare;
                    SystemNoticeManager.instance.addNotice(`还需击杀${maxWare - curWare}波怪物，才能开启闯关`, true);
                }
            } else {
                WindowManager.instance.open(WindowEnum.MISSION_PANEL);
            }
        }
        //家园置灰更新
        private updateXianFuGrayState() {
            let funcId: number = ActionOpenId.xianFuEnter;
            let xianfuGray: boolean = FuncOpenModel.instance.getFuncNeedShow(funcId);
            this.xfBtn.gray = !xianfuGray;
        }

        // 任务更新
        private taskUpdatedHandler(): void {
            let taskInfo: SingleTask = TaskModel.instance.taskInfo;
            if (!taskInfo) return;
            let taskId: string = taskInfo[Protocols.SingleTaskFields.taskId];
            let state: int = taskInfo[Protocols.SingleTaskFields.state];

            let nodes: Array<TaskNode> = taskInfo[Protocols.SingleTaskFields.nodes];
            let taskCfg: task = TaskCfg.instance.getTaskCfgById(taskId);

            this.awardsTxt.innerHTML = taskCfg[taskFields.describe];
            if (state === 1) {        // 未完成
                if (this._taskClip) {
                    this._taskClip.removeSelf();
                }
                // console.log("11111");
                this.nameTxt.innerHTML = `${taskCfg[taskFields.name]}<span style='color:#FF3E3E'>&nbsp;(${nodes[0][TaskNodeFields.curNum]}/${nodes[0][TaskNodeFields.total]})</span>`;
            } else if (state === 2) {      // 已完成但未领奖
                // 显示特效
                if (!this._taskClip) {
                    this._taskClip = new CustomClip();
                    this._taskClip.skin = "assets/effect/task.atlas";
                    this._taskClip.frameUrls = ["task/0.png", "task/1.png", "task/2.png", "task/3.png", "task/4.png",
                        "task/5.png", "task/6.png", "task/7.png"];
                    this._taskClip.durationFrame = 7;
                    this._taskClip.loop = true;
                    this._taskClip.y = 26;
                    this._taskClip.centerX = 0;
                    this._taskClip.mouseEnabled = false;

                }
                this._taskClip.play();
                this.taskBox.addChild(this._taskClip);
                // console.log("2222");
                this.nameTxt.innerHTML = `${taskCfg[taskFields.name]}<span style='color:#AEFF00'>&nbsp;(已完成)</span>`;
            } else if (state === 3) {      // 已领奖
                // console.log("3333");

            }
        }

        private _date: Date;

        private loopHandler(): void {
            if (!this._date) this._date = new Date();
            this._date.setTime(GlobalData.serverTime);
            this.timeTxt.text = this._date.toLocaleString();
        }

        // private updataExpBar(): void {
        //     if (this._expTweenJs.isPlaying) return;
        //     this._expEffect.x = this.expBar.width - 90;
        //     let lv: number = PlayerModel.instance.level;
        //     if (lv == HumanCfg.instance.getMaxLvByAiId(1)) { //满级
        //         this.expBar.width = this._barMaxWidth;
        //         this._expEffect.visible = false;
        //     } else {
        //         let exp = this._expBarCtrl.value;
        //         //todo
        //         //console.log(`exp--->${exp}`);
        //         let maxExp: number;
        //         let cfg: human = HumanCfg.instance.getHumanCfgByAiIdAndLv(1, this._recordLv);
        //         if (cfg) {
        //             maxExp = cfg[humanFields.exp];
        //         } else {
        //             throw new Error(`当前等级--->${this._recordLv}取不到配置`);
        //         }

        //         this._expBarCtrl.maxValue = maxExp;
        //         // this._expBarCtrl.value =
        //         this._expEffect.visible = true;
        //         if (lv > this._recordLv) {  //连升多级
        //             if (exp > maxExp) {
        //                 throw new Error(`经验条不动了 ---111 叫技术`);
        //             }
        //             let time = (1 - (exp / maxExp)) * 1000;
        //             //todo
        //             //console.log(`maxExp111--->${maxExp}`);
        //             // console.log(`lv111--->${lv}`);
        //             // console.log(`time111--->${time}`);
        //             // console.log(`_recordLv111--->${this._recordLv}`);
        //             this._expTweenJs.to({ value: maxExp }, time).start().onUpdate(() => {
        //                 this._expEffect.x = this.expBar.width - 90;
        //             }).onComplete(() => {
        //                 this._expBarCtrl.value = 0;
        //                 this._expEffect.x = this.expBar.width - 90;
        //                 this._recordLv++;
        //                 this.updataExpBar();
        //             });
        //         } else {
        //             let needExp = PlayerModel.instance.exp;
        //             //todo
        //             //console.log(`needExp222--->${needExp}`);
        //             //console.log(`lv222--->${lv}`);
        //             //console.log(`_recordLv222--->${this._recordLv}`);
        //             if (exp > needExp) {
        //                 throw new Error(`经验条不动了 ---222 叫技术`);
        //             }
        //             if (!needExp || exp > needExp) return;
        //             let time = (1 - (exp / needExp)) * 1000;
        //             this._expTweenJs.to({ value: needExp }, time).start().onUpdate(() => {
        //                 this._expEffect.x = this.expBar.width - 90;
        //             }).onComplete(() => {
        //                 Laya.timer.once(500, this, () => {
        //                     this._expEffect.visible = false;
        //                 });
        //             });
        //             this._recordLv = lv;
        //         }
        //     }
        // }

        private emailNotice(): void {
            if (EmailModel.instance.checkHasRedPoint()) {
                this._emailClip.play();
                this._emailClip.visible = true;
            } else {
                this._emailClip.stop();
                this._emailClip.visible = false;
            }
        }

        private closeGirlBtnHandler(): void {
            this.girlBox.visible = false;
        }

        public destroy(destroyChild: boolean = true) {
            this._taskClip = this.destroyElement(this._taskClip);
            this.taskBox = this.destroyElement(this.taskBox);
            this._limitPackEff = this.destroyElement(this._limitPackEff);

            if (this._tipBox1Tween) {
                this._tipBox1Tween.stop();
                this._tipBox1Tween = null;
            }
            if (this._tipBox2Tween) {
                this._tipBox2Tween.stop();
                this._tipBox2Tween = null;
            }
            if (this._friendBtnTween) {
                this._friendBtnTween.stop();
                this._friendBtnTween = null;
            }
            if (this._strongBtnTween) {
                this._strongBtnTween.stop();
                this._strongBtnTween = null;
            }
            super.destroy(destroyChild);
        }
    }
}

