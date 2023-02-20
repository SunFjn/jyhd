///<reference path="../common/common_util.ts"/>
///<reference path="../bag/bag_item.ts"/>
///<reference path="../config/human_cfg.ts"/>
///<reference path="../gold_body/gold_body_model.ts"/>
///<reference path="../bottom_tab/bottom_tab_ctrl.ts"/>
///<reference path="../magic_art/magic_art_model.ts"/>
///<reference path="../boss_home/boss_home_model.ts"/>
///<reference path="../equip_suit/equip_suit_util.ts"/>
/// <reference path="../fight_talisman/fight_talisman_model.ts" />
/// <reference path="../money_cat/money_cat_model.ts" />
///<reference path="../gloves/gloves_model.ts"/>
///<reference path="../compose/compose_model.ts"/>


/** 角色面板*/
namespace modules.player {
    import GameCenter = game.GameCenter;
    import Dictionary = Laya.Dictionary;
    import Image = Laya.Image;
    import BagModel = modules.bag.BagModel;
    import BaseItem = modules.bag.BaseItem;
    import CustomClip = modules.common.CustomClip;
    import Item = Protocols.Item;
    import PartItemFields = Protocols.PartItemFields;
    import PlayerViewUI = ui.PlayerViewUI;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import FightTalismanModel = modules.fight_talisman.FightTalismanModel;
    import MoneyCatModel = modules.money_cat.MoneyCatModel;
    import LayaEvent = modules.common.LayaEvent;
    import GetGauntletReply = Protocols.GetGauntletReply;
    import GlovesModel = modules.gloves.GlovesModel;
    import GetGauntletReplyFields = Protocols.GetGauntletReplyFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import ComposeModel = modules.compose.ComposeModel;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import equip_suit = Configuration.equip_suit;
    import EquipSuitCfg = modules.config.EquipSuitCfg;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FirstPayModel = modules.first_pay.FirstPayModel;
    import FirstPayCfg = modules.config.FirstPayCfg;
    export class PlayerPanel extends PlayerViewUI {

        private _equipPoses: Array<[number, number]>;
        private _partDic: Dictionary;
        private _partRPArr: Array<Image>;
        private _btnClip: CustomClip;
        // private _avatarClip: AvatarClip;
        private _skeletonClip: SkeletonAvatar;

        constructor() {
            super();


        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.equipBtn, common.LayaEvent.CLICK, this, this.equipHandler);
            this.addAutoListener(this.rankBtn, common.LayaEvent.CLICK, this, this.rankHandler);
            this.addAutoListener(this.attrBtn, common.LayaEvent.CLICK, this, this.attrHandler);
            this.addAutoListener(this.nextBtn, common.LayaEvent.CLICK, this, this.nextHandler);
            this.addAutoListener(this.preBtn, common.LayaEvent.CLICK, this, this.preHandler);
            this.addAutoListener(this.addTipsBtn1, common.LayaEvent.CLICK, this, this.addTipsBtnHandler, [0]);
            this.addAutoListener(this.addTipsBtn2, common.LayaEvent.CLICK, this, this.addTipsBtnHandler, [1]);
            this.addAutoListener(this.addTipsBtn3, common.LayaEvent.CLICK, this, this.addTipsBtnHandler, [2]);
            this.addAutoListener(this.btn1, common.LayaEvent.CLICK, this, this.goldBodyHandler);
            this.addAutoListener(this.btn2, common.LayaEvent.CLICK, this, this.runeHandler);
            this.addAutoListener(this.holyEquipBtn, common.LayaEvent.CLICK, this, this.holyEquipBtnHandler);
            this.addAutoListener(this.immortalsBtn, common.LayaEvent.CLICK, this, this.immortalsHandler);
            this.addAutoListener(this.wingBtn, common.LayaEvent.CLICK, this, this.wingHandler);
            this.addAutoListener(this.fashionImgBtn, common.LayaEvent.CLICK, this, this.fashionImgBtnHandler);
            this.addAutoListener(this.artifactBtn, common.LayaEvent.CLICK, this, this.artifactBtnHandler);
            //this.addAutoListener(this.redEquipImg, common.LayaEvent.CLICK, this, this.redEquipImgHandler);
            this.addAutoListener(this.suitImg, common.LayaEvent.CLICK, this, this.suitHandler);
            this.addAutoListener(this.fightTalismanImg, common.LayaEvent.CLICK, this, this.fightTalismanBtn);     //战力护符
            this.addAutoListener(this.moneyCatImg, common.LayaEvent.CLICK, this, this.moneyCatBtn);     //招财仙猫
            this.addAutoListener(this.xdBtn, common.LayaEvent.CLICK, this, this.xdBtnHandler);     //仙丹
            this.addAutoListener(this.glovesBtn, LayaEvent.CLICK, this, this.glovesClickHandler);
            this.addAutoListener(this.zztqBtn, LayaEvent.CLICK, this, this.zhizunHandler);//至尊特权
            this.addAutoListener(this.yyBtn, LayaEvent.CLICK, this, this.marryHandler);//姻缘（姻缘）
            this.addAutoListener(this.hsBtn, LayaEvent.CLICK, this, this.hushiHandler);//护石
            this.addAutoListener(this.ehBtn, LayaEvent.CLICK, this, this.erHuanHandler);//耳环
            this.addAutoListener(this.explicitSuitBtn, LayaEvent.CLICK, this, this.explicitSuitHandler);//耳环


            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_EQUIPS_INITED, this, this.equipInitedHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_WEAR_EQUIP, this, this.setEquip);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_WEAR_EQUIPS, this, this.wearEquips);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_FIGHT, this, this.updateFight);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_DATA_INITED, this, this.updateBag);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateBag);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MONEY_CAT_UPDATE, this, this.moneyCatGray);       //猫置灰
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIGHT_TALISMAN_UPDATE, this, this.fightTalismanGray);       //护符置灰
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GLOVES_INFO_UPDATE, this, this.updateGlovesInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_TOTAL_ATTR_UPDATE, this, this.showAddTipsBtn);//戒指和项链的加号

            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_SHOW_PAY_STATUS, this, this.wxIosPayShow);      //微信ios支付显示

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FUNC_OPEN_UPDATE, this, this.updateXianFuGrayState);//仙府相关功能 炼金置灰

            this.addAutoRegisteRedPoint(this.chDotImg, ["zzRP", "zzskillRP"]);
            this.addAutoRegisteRedPoint(this.fwDotImg, ["runeRP", "runeComposeRP", "runeCollectRP"]);
            this.addAutoRegisteRedPoint(this.xdRP, ["xianDanRP", "xuzuRP"]);
            this.addAutoRegisteRedPoint(this.suitRP, ["equipSuitRP_0", "equipSuitRP_1", "equipSuitRP_2", "equipSuitRP_3", "equipSuitRP_4", "equipSuitRP_5", "equipSuitRP_6", "equipSuitRP_7", "equipSuitRP_8", "equipSuitRP_9"
                , "equipSuitRP_10", "equipSuitRP_11", "equipSuitRP_12", "equipSuitRP_13", "equipSuitRP_14"]);
            this.addAutoRegisteRedPoint(this.dotImg_1, ["goldBodyRP"]);
            this.addAutoRegisteRedPoint(this.xyDotImg, [
                "weaponFeedSkillRP", "weaponFeedMatRP", "weaponRankSkillRP", "weaponRankMatRP", "weaponIllusionRP", "weaponRefineMaterialRP", "weaponFazhenJipinRP", "weaponFazhenZhenpinRP", "weaponFazhenJuepinRP",
                "petFeedSkillRP", "petFeedMatRP", "petRankSkillRP", "petRankMatRP", "petIllusionRP", "petRefineMaterialRP", "magicPetFazhenJipinRP", "magicPetFazhenZhenpinRP", "magicPetFazhenJuepinRP",
            ]);
            this.addAutoRegisteRedPoint(this.sbDotImg, ["immortalsShengjiRP", "immortalsHuanhuaJipinRP", "immortalsHuanhuaZhenpinRP", "immortalsHuanhuaJuepinRP", "immortalsHuanhuaDianchangRP", , "immortalsFuhunRP"]);
            //this.addAutoRegisteRedPoint(this.redEquipRP, ["redEquipComposeRP"]);
            this.addAutoRegisteRedPoint(this.fightTalismanRP, ["fightTalismanRP", "fightTalismanBuyRP"]);     //战力护符红点
            this.addAutoRegisteRedPoint(this.moneyCatRP, ["moneyCatRP"]);     //招财仙猫红点
            // this.addAutoRegisteRedPoint(this.chDotImg, ["playerTitleRP"]);
            this.addAutoRegisteRedPoint(this.fashionRP, [
                "wingShengjiRP", "wingHuanhuaJipinRP", "wingHuanhuaZhenpinRP", "wingHuanhuaJuepinRP", "wingHuanhuaDianchangRP", "wingFuhunRP",
                "fashionShengJiRP", "fashionShengJiMatRP", "fashionHuanHuaZhenPinRP", "fashionHuanHuaJiPinRP", "fashionHuanHuaJuePinRP", "fashionHuanHuaDianchangRP", "fashionFuHunRP",
                "guanghuanShengJiRP", "guanghuanShengJiMatRP", "guanghuanHuanHuaZhenPinRP", "guanghuanHuanHuaJiPinRP", "guanghuanHuanHuaJuePinRP", "guanghuanHuanHuaDianchangRP", "guanghuanFuHunRP"]);
            this.addAutoRegisteRedPoint(this.tianZhuRP, ["tianZhuShengJiRP", "tianZhuShengJiMatRP", "tianZhuHuanHuaZhenPinRP", "tianZhuHuanHuaJiPinRP", "tianZhuHuanHuaJuePinRP", "tianZhuFuHunRP"]);
            this.addAutoRegisteRedPoint(this.glovesRP, ["glovesRP"]);
            this.addAutoRegisteRedPoint(this.yyDotImg, ["marryRP", "marryRingRP", "marryKeepsakeRP", "marryChildrenRP"]);
            this.addAutoRegisteRedPoint(this.explicitSuitRP, ["ExplicitSuitBest", "ExplicitSuitUnique", "ExplicitSuitCollection"]);
            // this.addAutoRegisteRedPoint(this.yyDotImg, ["marryRP", "marryRingRP", "marryKeepsakeRP", "marryChildrenRP"]);

            let len = this.equipBgBox._childs.length
            for (let index = 0; index < len; index++) {
                this.addAutoListener(this.equipBgBox._childs[index], LayaEvent.CLICK, this, this.equipBgBoxClickHandler);
            }
            this.ehBtn.gray = true;

            this.addTipsBtn1[GlobalSecondEffectBtnTag.BTN_KEY] = GlobalSecondEffectBtnTag.BTN_VALUE;
            this.addTipsBtn2[GlobalSecondEffectBtnTag.BTN_KEY] = GlobalSecondEffectBtnTag.BTN_VALUE;
            this.addTipsBtn3[GlobalSecondEffectBtnTag.BTN_KEY] = GlobalSecondEffectBtnTag.BTN_VALUE;
        }

        private wxIosPayShow() {
            this.moneyCatImg.visible = !Main.instance.isWXiOSPay;
            this.glovesBtn.visible = !Main.instance.isWXiOSPay;
            this.fightTalismanImg.visible = !Main.instance.isWXiOSPay;
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;

            this._equipPoses = new Array<[number, number]>();
            this._partDic = new Dictionary();

            // this.redEquipImg.skin = `assets/icon/item/50093.png`;
            // this.fightTalismanImg.skin = `assets/icon/item/10082.png`;        //战力护符图标
            // this.moneyCatImg.skin = `assets/icon/item/10081.png`;        //招财仙猫图标
            // this.glovesBtn.skin = `assets/icon/item/10083.png`;         // 辅助装备

            this.nameTxt.text = PlayerModel.instance.roleName; // 人物名字

            this._equipPoses.push([49, 219 - 9], [49, 339 - 9], [49, 459 - 9], [49, 579 - 9], [49, 699 - 9],
                [569, 219 - 9], [569, 339 - 9], [569, 459 - 9], [569, 579 - 9], [569, 699 - 9]);

            this._partRPArr = [this.partRP1, this.partRP2, this.partRP3, this.partRP4, this.partRP5,
            this.partRP6, this.partRP7, this.partRP8, this.partRP9, this.partRP10];

            this._btnClip = new CustomClip();
            this.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            let arr: Array<string> = [];
            for (let i: int = 0; i < 16; i++) {
                arr[i] = `btn_light/${i}.png`;
            }
            this._btnClip.frameUrls = arr;
            this._btnClip.visible = false;
            this._btnClip.pos(264, 792, true);

            // this.equipBgBox.mouseThrough = true;

            // this._avatarClip = AvatarClip.create(1560, 1560, 850);
            // this.addChildAt(this._avatarClip, 4);
            // this._avatarClip.pos(368, 750, true);
            // this._avatarClip.pos(368, 680, true);
            // this._avatarClip.anchorX = 0.5;
            // this._avatarClip.anchorY = 0.5;
            // this._avatarClip.mouseEnabled = true;
            // this._avatarClip.visible = false;
            // this._avatarClip.avatarRotationY = 180;

            this.regGuideSpr(GuideSpriteId.PLAYER_EQUIP_BTN, this.equipBtnBox);
            this.regGuideSpr(GuideSpriteId.GOLD_BODY_ENTER_BTN, this.btn1);

            // 2d模型资源
            this._skeletonClip = SkeletonAvatar.createShow(this, this, 3);
            this._skeletonClip.pos(368, 700, true);
        }

        protected onOpened(): void {
            super.onOpened();

            this.equipInitedHandler();
            this.updateFight();
            this.fightTalismanGray();       //战力护符置灰
            this.moneyCatGray();            //招财仙猫置灰
            this.updateGlovesInfo();
            this.showAddTipsBtn(); //戒指加号

            let role = GameCenter.instance.getRole(PlayerModel.instance.actorId);
            if (role) {
                let shuju: Array<number> = role.property.get("exterior");
                this._skeletonClip.reset(shuju[0], shuju[1], shuju[2], 0, 0, shuju[5], shuju[6]);
                this._skeletonClip.resetOffset(AvatarAniBigType.wing, -100, -30);
                this._skeletonClip.resetScale(AvatarAniBigType.clothes, 1);
                this._skeletonClip.resetScale(AvatarAniBigType.tianZhuBack, 1);
                this._skeletonClip.resetScale(AvatarAniBigType.tianZhuFront, 1);
                this._skeletonClip.resetScale(AvatarAniBigType.guangHuan, 1);
            }
            this.wxIosPayShow();
            this.isYyBtnShow();
            this.updateXianFuGrayState();
        }


        public close(): void {
            super.close();
            this._btnClip.visible = false;
            this._btnClip.stop();
        }

        // 装备数据初始化
        private equipInitedHandler(): void {
            let equipsDic: Dictionary = PlayerModel.instance.equipsDic;
            if (!equipsDic) return;
            for (let i: int = 0, len = equipsDic.keys.length; i < len; i++) {
                this.setEquip(equipsDic.keys[i], equipsDic.values[i], false);
            }
            this.checkPartRP();
        }

        private setEquip(part: int, equip: Protocols.Item, needCheckTip: boolean = true): void {
            let bagItem: BaseItem = this._partDic.get(part);
            if (!equip) {
                if (bagItem) bagItem.removeSelf();
            } else {
                if (!bagItem) {
                    bagItem = new BaseItem();
                    this._partDic.set(part, bagItem);
                    bagItem.pos(this._equipPoses[part - 1][0], this._equipPoses[part - 1][1], true);
                }
                this.addChildAt(bagItem, 17);
                bagItem.dataSource = equip;
            }
            if (needCheckTip) {
                let item: Item = BagModel.instance.getBestEquipDic().get(part);
                if (item) {
                    this._partRPArr[part - 1].visible = true;
                } else {
                    this._partRPArr[part - 1].visible = false;
                }
            }
        }

        // 穿戴多个装备
        private wearEquips(equips: Array<Protocols.PartItem>): void {
            for (let i: int = 0, len = equips.length; i < len; i++) {
                this.setEquip(equips[i][PartItemFields.part], equips[i][PartItemFields.item], false);
            }
            this.checkPartRP();
        }

        // 更新战力
        private updateFight(): void {
            if (!PlayerModel.instance.fight) {
                this.powerNum.value = "0";
            } else {
                this.powerNum.value = PlayerModel.instance.fight.toString();
            }
        }

        // 一键装备
        private equipHandler(): void {
            BagCtrl.instance.fastWearEquip();
        }

        // 榜单
        private rankHandler(): void {
            WindowManager.instance.open(WindowEnum.RANKING_LIST_PANEL);
        }

        // 属性
        private attrHandler(): void {
            WindowManager.instance.open(WindowEnum.PLAYER_ATTR_ALERT);
        }

        // 时装
        private fashionImgBtnHandler(): void {
            // SystemNoticeManager.instance.addNotice("功能尚未开放", true);
            BottomTabCtrl.instance.openTabByFunc(ActionOpenId.fashionEnter);
        }

        // 神器
        private artifactBtnHandler(): void {
            // SystemNoticeManager.instance.addNotice("功能尚未开放", true);
            BottomTabCtrl.instance.openTabByFunc(ActionOpenId.tianZhuEnter);
        }

        /**
         * 金身系统按钮相应事件
         */
        private goldBodyHandler(): void {

            WindowManager.instance.open(WindowEnum.GOLD_BODY_PANEL);//如果有可修炼的就跳到可修炼的那一条
        }

        private immortalsHandler(): void {
            BottomTabCtrl.instance.openTabByFunc(ActionOpenId.immortalEnter);
        }

        private wingHandler(): void {
            //BottomTabCtrl.instance.openTabByFunc(ActionOpenId.wingEnter);
            BottomTabCtrl.instance.openTabByFunc(ActionOpenId.xianlingEnter);
        }

        //玉荣界面按钮
        private runeHandler(): void {
            WindowManager.instance.open(WindowEnum.RUNE_INLAY_PANEL);
        }

        //称号
        private holyEquipBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.PLAYER_TITLE_PANEL);
        }

        //红装合成
        private redEquipImgHandler(): void {
            ComposeModel.instance.setDotDic();
            let index: number = compose.ComposeModel.instance.equipRPIndex;
            WindowManager.instance.open(WindowEnum.COMPOSE_PANEL, index ? [index] : index);
        }

        private xdBtnHandler(): void {
            // CommonUtil.noticeError(16)//因为家园关了
            WindowManager.instance.open(WindowEnum.XIAN_DAN_PAENL);
        }
        //家园置灰更新
        private updateXianFuGrayState() {
            let funcId: number = ActionOpenId.xianFuEnter;
            let xianfuGray: boolean = FuncOpenModel.instance.getFuncNeedShow(funcId);
            this.xdBtn.disabled = !xianfuGray;
        }


        //外显套装
        private explicitSuitHandler() {
            WindowManager.instance.open(WindowEnum.EXPLICIT_SUIT_BEST_PANEL, [0]);
        }

        // 下一页
        private nextHandler(): void {

        }

        // 上一页
        private preHandler(): void {

        }

        private suitHandler(): void {
            WindowManager.instance.openByActionId(ActionOpenId.equipSuit);
        }

        private addTipsBtnHandler(type: number): void {
            if (!FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.xunbaoEquip)) {
                let str = "戒指";
                switch (type) {
                    case 0:
                        str = "手镯";
                        break;
                    case 1:
                        str = "戒指";
                        break;
                    case 2:
                        str = "魔法石";
                        break;
                    default:
                        break;
                }
                modules.notice.SystemNoticeManager.instance.addNotice(`${str}可通过探索获得`, true);
            } else {
                WindowManager.instance.open(WindowEnum.TREASURE_PANEL);
            }
        }

        // 更新背包
        private updateBag(): void {
            this.checkPartRP();
        }

        // 检测部位红点
        private checkPartRP() {
            let dic: Dictionary = BagModel.instance.getBestEquipDic();
            let flag: boolean = false;
            for (let i: int = 0; i < 10; i++) {
                if (dic.get(i + 1)) {
                    this._partRPArr[i].visible = true;
                    flag = true;
                } else {
                    this._partRPArr[i].visible = false;
                }
            }
            if (flag) {
                this._btnClip.visible = true;
                this._btnClip.play();
            } else {
                this._btnClip.visible = false;
                this._btnClip.stop();
            }
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._partDic) {
                let values = this._partDic.values;
                for (let e of values) {
                    e.destroy(true);
                }
                this._partDic = null;
            }
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            if (this._skeletonClip) {
                this._skeletonClip = this.destroyElement(this._skeletonClip);
            }
            super.destroy(destroyChild);
        }

        //战力护符按钮
        public fightTalismanBtn(): void {
            WindowManager.instance.open(WindowEnum.FIGHT_TALISMAN_ALERT);
        }

        //战力护符置灰
        public fightTalismanGray(): void {
            this.fightTalismanImg.gray = FightTalismanModel.instance.currMedalType() == 1;
        }

        //招财仙猫按钮
        public moneyCatBtn(): void {
            WindowManager.instance.open(WindowEnum.MONEY_CAT_ALERT);
        }

        //招财仙猫置灰
        public moneyCatGray(): void {
            this.moneyCatImg.gray = MoneyCatModel.instance.actived == -1;
        }

        // 更新辅助装备信息
        private updateGlovesInfo(): void {
            let info: GetGauntletReply = GlovesModel.instance.glovesInfo;
            this.glovesBtn.gray = !info || info[GetGauntletReplyFields.state] !== 1;
        }

        // 辅助装备
        private glovesClickHandler(): void {
            if (FirstPayModel.instance.totalRechargeMoney < FirstPayCfg.instance.getCfgDefaultData()[Configuration.first_payFields.money]
                && FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.firstPay)) {
                WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);
            } else {
                let info: GetGauntletReply = GlovesModel.instance.glovesInfo;
                if (!info) return;
                let state = info[GetGauntletReplyFields.state];
                // console.log("辅助装备state", state, info);

                // 未购买或未领取到购买界面
                if (state == -1 || state == 0 || state == -2) {
                    WindowManager.instance.open(WindowEnum.GLOVES_BUY_ALERT);
                }
                // 已购买并领取过则打开辅助装备界面
                else {
                    WindowManager.instance.open(WindowEnum.GLOVES_PANEL);
                }
            }
        }
        //戒指加号
        private showAddTipsBtn() {
            let playLevel: number = PlayerModel.instance.level;
            let showLevel: Array<number> = BlendCfg.instance.getCfgById(53001)[blendFields.intParam];
            if (playLevel >= showLevel[0]) {
                this.addTipsBtn2.visible = true;
                this.addTipsBtn3.visible = true;
            }
            else {
                this.addTipsBtn2.visible = false;
                this.addTipsBtn3.visible = false;
            }
        }

        /**
         * 装备点击
         * @author VTZ vvtz@qq.com
         */
        private equipBgBoxClickHandler() {
            // let cfg: equip_suit = EquipSuitCfg.instance.getCfgById(101);
            WindowManager.instance.open(WindowEnum.EQUIPMENT_SOURCE_ALERT, null);
        }

        //至尊特权
        private zhizunHandler() {
            // let cfg: equip_suit = EquipSuitCfg.instance.getCfgById(101);
            WindowManager.instance.open(WindowEnum.ZHIZUN_PANEL, null);
        }

        //姻缘
        private marryHandler() {
            this.close();
            WindowManager.instance.open(WindowEnum.MARRY_PANEL, null);
            // SystemNoticeManager.instance.addNotice('暂未开启!', true);
        }

        private isYyBtnShow(): void {
            //let marry_isOpen: boolean = FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.marry);
            // this.yyBtn.visible = marry_isOpen;
        }
        //护石
        private hushiHandler(): void {
            CommonUtil.noticeError(16)
        }
        //耳环
        private erHuanHandler(): void {
            CommonUtil.noticeError(16)
        }
    }
}
