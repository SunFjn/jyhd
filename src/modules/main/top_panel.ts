///<reference path="../player/player_model.ts"/>
///<reference path="../config/born_cfg.ts"/>
///<reference path="../xianfu/xianfu_model.ts"/>
///<reference path="../buff/buff_model.ts"/>
///<reference path="../sound/sound_ctrl.ts"/>
///<reference path="../main/left_top_rp_config.ts"/>
///<reference path="../config/human_cfg.ts"/>

/** 主界面顶部面板*/


namespace modules.main {
    import Event = Laya.Event;
    import PlayerModel = modules.player.PlayerModel;
    import HumanCfg = modules.config.HumanCfg;
    import TopViewUI = ui.TopViewUI;
    import BornCfg = modules.config.BornCfg;
    import eraFields = Configuration.eraFields;
    import Layer = ui.Layer;
    import BagUtil = modules.bag.BagUtil;
    import CommonUtil = modules.common.CommonUtil;
    import Point = Laya.Point;
    import ActorBaseAttr = Protocols.ActorBaseAttr;
    import ActorBaseAttrFields = Protocols.ActorBaseAttrFields;
    import LayaEvent = modules.common.LayaEvent;
    import ActionOpenCfg = modules.config.ActionOpenCfg;
    import action_openFields = Configuration.action_openFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import BuffModel = modules.buff.BuffModel;
    import SoundCtrl = modules.sound.SoundCtrl;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import CustomClip = modules.common.CustomClip;
    import humanFields = Configuration.humanFields;
    import human = Configuration.human;
    import FirstPayModel = modules.first_pay.FirstPayModel;
    import FirstPayCfg = modules.config.FirstPayCfg;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    export class TopPanel extends TopViewUI {
        private _endWidth: number;
        private _totalLen: number;
        private _sceneType: number;
        private _expBarCtrl: ProgressBarCtrl;
        private _expEffect: CustomClip;      //特效
        private _levelhbEffect: CustomClip;      //特效
        private _superhbEffect: CustomClip;      //特效
        private _expTweenJs: TweenJS;
        private _barMaxWidth: number;
        private _recordLv: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.top = 0;
            this.centerX = 0;
            this.layer = Layer.UP_UI_LAYER;
            this.closeByOthers = false;
            this._totalLen = 172;
            this._sceneType = 0;
            this.expBar.width = 0;
            this._barMaxWidth = 488;

            this._recordLv = PlayerModel.instance.level;
            this._expBarCtrl = new ProgressBarCtrl(this.expBar, this._barMaxWidth);
            this._expTweenJs = TweenJS.create(this._expBarCtrl);

            this.baseAttrUpdate();
            this.initHeadMask();
            this.initEffect();
        }

        protected onOpened(): void {
            super.onOpened();

            this._recordLv = PlayerModel.instance.level;
            this._expBarCtrl.value = PlayerModel.instance.exp;

            this.updateBorn();
            this.updataExpBar();
            this.updateMoney();
            this.setActionPreviewPos();
            this.wxIosPayShow();
            this.occUpdate();
            this.updateFight();
            this.enterScene();
            this.updateHp();
            this.showNobleBtn();

            this.soundEnableChangeHandler();
            this.vipShow();
            this.setActionPreviewPos();



            this.gmBtn.visible = DEBUG
        }

        private initHeadMask() {
            let cMask = new Laya.Sprite();
            cMask.graphics.drawCircle(75, 75, 66, "#ff0000");
            cMask.pos(0, 0);
            this.headImg.mask = cMask;
        }

        private initEffect() {
            this._expEffect = new CustomClip();
            this.playInfoBox.addChild(this._expEffect);
            this._expEffect.skin = "assets/effect/proBar.atlas";
            this._expEffect.frameUrls = ["proBar/0.png", "proBar/1.png", "proBar/2.png", "proBar/3.png", "proBar/4.png",
                "proBar/5.png", "proBar/6.png", "proBar/7.png"];
            this._expEffect.durationFrame = 5;
            this._expEffect.play();
            this._expEffect.loop = true;
            this._expEffect.y = -28;

            this._levelhbEffect = new CustomClip();
            this.levelhbBtn.addChild(this._levelhbEffect);
            this._levelhbEffect.frameUrls = ["top/eff_a_0.png", "top/eff_a_1.png", "top/eff_a_2.png", "top/eff_a_3.png",
                "top/eff_a_4.png", "top/eff_a_5.png"];
            this._levelhbEffect.durationFrame = 5;
            this._levelhbEffect.loop = true;
            this._levelhbEffect.scaleX = this._levelhbEffect.scaleY = 0.8;
            this._levelhbEffect.play();

            this._superhbEffect = new CustomClip();
            this.superhbBtn.addChild(this._superhbEffect);
            this._superhbEffect.frameUrls = ["top/eff_a_0.png", "top/eff_a_1.png", "top/eff_a_2.png", "top/eff_a_3.png",
                "top/eff_a_4.png", "top/eff_a_5.png"];
            this._superhbEffect.durationFrame = 5;
            this._superhbEffect.loop = true;
            this._superhbEffect.scaleX = this._superhbEffect.scaleY = 0.8;
            this._superhbEffect.play();
        }

        private wxIosPayShow() {
            this.addIngotBtn.visible = !Main.instance.isWXiOSPay;
            this.addXianYu.visible = !Main.instance.isWXiOSPay;
            this.showNobleBtn();
        }

        protected addListeners(): void {
            super.addListeners();

            GlobalData.dispatcher.on(CommonEventType.PLAYER_BASE_ATTR_UPDATE, this, this.baseAttrUpdate);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_UPDATE_LEVEL, this, this.updateLevel);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_UPDATE_MONEY, this, this.updateMoney);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_BORN_LEV, this, this.updateBorn);
            GlobalData.dispatcher.on(CommonEventType.TOP_PANEL_SECOND_VIEW, this, this.updateView);
            this.addLongPress(this.gmBtn, this, this.GM_DEBUG_Handler, this.GM_DEBUG_LongHandler);
            this.addAutoListener(this.soundBtn, common.LayaEvent.CLICK, this, this.soundHandler);
            this.addAutoListener(this.vipBtn, common.LayaEvent.CLICK, this, this.vipHandler);
            this.addAutoListener(this.nobleBtn, common.LayaEvent.CLICK, this, this.nobleHandler);
            this.addAutoListener(this.buffBtn, common.LayaEvent.CLICK, this, this.buffHandler);
            this.addAutoListener(this.headImg, LayaEvent.CLICK, this, this.clickHeadHandler);

            this.addAutoRegisteRedPoint(this.vipDot_img, ["vipRP", "vipNewRP"]);
            this.addAutoRegisteRedPoint(this.activeHeadRP, ["HeadCanActiveRP"]);
            this.addAutoListener(this.addCoinBtn, Event.CLICK, this, this.moneyBtnHandler);
            this.addAutoListener(this.addIngotBtn, Event.CLICK, this, this.glodBtnHandler);
            this.addAutoListener(this.addXianYu, Event.CLICK, this, this.addXianYuHandler);
            this.addAutoListener(this.levelhbBtn, Event.CLICK, this, this.levelhbBtnHandler);
            this.addAutoListener(this.superhbBtn, Event.CLICK, this, this.superhbBtnHandler);

            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_SHOW_PAY_STATUS, this, this.wxIosPayShow);      //微信ios支付显示
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOUND_ENABLE_CHANGE, this, this.soundEnableChangeHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_FIGHT, this, this.updateFight);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_HP, this, this.updateHp);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SCENE_ENTER, this, this.enterScene);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_MAX_HP, this, this.updateHp);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_BUFF_LIST, this, this.buffBtnNumber);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FUNC_OPEN_UPDATE, this, this.showNobleBtn);
            //this.addAutoListener(GlobalData.dispatcher, CommonEventType.RED_POINT, this, this.checkRedPoint);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.VIP_UPDATE, this, this.vipShow);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.VIPF_UPDATE, this, this.vipShow);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RESIZE_UI, this, this.setActionPreviewPos);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ACTION_PREVIEW_RESIZE_UI, this, this.setActionPreviewPos);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_OCC, this, this.occUpdate);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.HEADER_UPDATE, this, this.occUpdate);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RESIZE_UI, this, this.setActionPreviewPos);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ACTION_PREVIEW_RESIZE_UI, this, this.setActionPreviewPos);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_SHOW_PAY_STATUS, this, this.wxIosPayShow);      //微信ios支付显示

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZXIANYU_UPDATE, this, this.baseAttrUpdate);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.PLAYER_UPDATE_EXP, this, this.updataExpBar);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GET_MONTH_CARD_INFO_REPLY, this, this.showHbBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.UPDATE_MONTH_CARD_INFO, this, this.showHbBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_SHOP_OPEN, this, this.openXianfuTopn);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_UPDATE, this, this.setXianfuValue);

            // 红点功能注册监听
            this.addAutoRegisteRedPoint(this.levelhbDot, ["LevelBonusRP", "LevelRedPackRP"]);
            this.addAutoRegisteRedPoint(this.superhbDot, ["SuperRedPackRP"]);
        }

        protected removeListeners(): void {
            super.removeListeners();

            GlobalData.dispatcher.off(CommonEventType.PLAYER_BASE_ATTR_UPDATE, this, this.baseAttrUpdate);
            GlobalData.dispatcher.off(CommonEventType.PLAYER_UPDATE_LEVEL, this, this.updateLevel);
            GlobalData.dispatcher.off(CommonEventType.PLAYER_UPDATE_MONEY, this, this.updateMoney);
            GlobalData.dispatcher.off(CommonEventType.PLAYER_BORN_LEV, this, this.updateBorn);
            GlobalData.dispatcher.off(CommonEventType.TOP_PANEL_SECOND_VIEW, this, this.updateView);
        }
        private setXianfuValue() {
            this.foodstuffTxt.text = modules.xianfu.XianfuModel.instance.treasureInfos(1).toString();
        }
        private openXianfuTopn(value: boolean) {
            this.setXianfuValue();
            this.foodstuff.visible = value
            this.foodstuffTxt.visible = value
            this.cionImgadd.visible = !value
            this.cionImg.visible = !value
            this.moneyTxt.visible = !value

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
            Point.TEMP.setTo(this.cionImg.width / 2, this.cionImg.height / 2);
            let pos1 = this.cionImg.localToGlobal(Point.TEMP, true);
            //离线收益增加 弹窗 的目标点
            modules.action_preview.actionPreviewModel.instance._posSprite.set(specialAniPoin.cion, pos1);
            Point.TEMP.setTo(this.yuanBaoImg.width / 2, this.yuanBaoImg.height / 2);
            let pos = this.yuanBaoImg.localToGlobal(Point.TEMP, true);
            //离线收益增加 弹窗 的目标点
            modules.action_preview.actionPreviewModel.instance._posSprite.set(specialAniPoin.yuanbao, pos);
        }

        // 更新属性
        private baseAttrUpdate(): void {
            let attr: ActorBaseAttr = PlayerModel.instance.playerBaseAttr;
            if (!attr) return;
            this.levelTxt.text = `${attr[ActorBaseAttrFields.level]}级`;
            this.levelTxt_1.text = `${attr[ActorBaseAttrFields.level]}级`;
            let transformLv: number = attr[ActorBaseAttrFields.eraLvl];
            let transformNum: number = attr[ActorBaseAttrFields.eraNum];
            this.transformTxt.text = transformLv === 0 && transformNum === 0 ? "未觉醒" : `${transformLv}阶${transformNum}段`;
            this.transformTxt_1.text = transformLv === 0 && transformNum === 0 ? "未觉醒" : `${transformLv}阶${transformNum}段`;
            this.moneyTxt.text = CommonUtil.bigNumToString(attr[ActorBaseAttrFields.copper], false);
            this.goldTxt.text = CommonUtil.bigNumToString(attr[ActorBaseAttrFields.gold], false);
            this.xianYuText.text = CommonUtil.bigNumToString(modules.zxian_yu.ZXianYuModel.instance.xianyu, false);
        }

        //购买金币
        moneyBtnHandler() {
            BagUtil.openLackPropAlert(MoneyItemId.copper, 1, true);

        }

        //购买代币券
        glodBtnHandler() {
            // if (modules.first_pay.FirstPayModel.instance.giveState == 0) {
            if (!modules.first_pay.FirstPayModel.instance._lowestRechargeShift) {

                let handler: Handler = Handler.create(WindowManager.instance, WindowManager.instance.skipOpen, [WindowEnum.FIRST_PAY_PANEL]);

                CommonUtil.alert('温馨提示', '代币券不足，是否前往首充？', [handler]);
            } else {
                if (!modules.money_cat.MoneyCatModel.instance.state) {
                    //打开提示 招财猫跳转的界面
                    WindowManager.instance.open(WindowEnum.COMMON_TXT_CAT_ALERT);
                } else {
                    let handler: Handler = Handler.create(WindowManager.instance, WindowManager.instance.skipOpen, [WindowEnum.RECHARGE_PANEL]);
                    CommonUtil.alert('温馨提示', '代币券不足，是否前往充值界面充值？', [handler]);
                }
            }

        }

        //等级红包
        private levelhbBtnHandler() {
            WindowManager.instance.openByActionId(ActionOpenId.levelhb);
        }

        //超级红包
        private superhbBtnHandler() {
            WindowManager.instance.openByActionId(ActionOpenId.superhb);
        }

        //购买点券
        addXianYuHandler() {
            WindowManager.instance.open(WindowEnum.ZXIANYU_PANEL);
        }

        // 更新等级
        private updateLevel(): void {
            this.levelTxt.text = `${PlayerModel.instance.level}级`;
            this.levelTxt_1.text = `${PlayerModel.instance.level}级`;
        }

        // 更新货币
        private updateMoney(): void {
            this.moneyTxt.text = CommonUtil.bigNumToString(PlayerModel.instance.copper, false);
            this.goldTxt.text = CommonUtil.bigNumToString(PlayerModel.instance.ingot, false);
        }

        //更新转升
        private updateBorn(): void {
            if (PlayerModel.instance.bornLev) {
                this.transformTxt.text = BornCfg.instance.getCfgByLv(PlayerModel.instance.bornLev)[eraFields.name];
                this.transformTxt_1.text = BornCfg.instance.getCfgByLv(PlayerModel.instance.bornLev)[eraFields.name];
            }
        }
        // 更新战力
        private updateFight(): void {
            if (!PlayerModel.instance.fight) {
                this.powerNum.value = "0";
            } else {
                let power: string = CommonUtil.bigNumToString(PlayerModel.instance.fight);
                this.powerNum.value = power;
            }

        }

        private vipShow(): void {
            if (modules.vip.VipModel.instance.vipLevel >= 1) {
                this.vipImg.skin = 'top/btn_zjm_svip.png';
                this.vipNum.value = `${modules.vip.VipModel.instance.vipLevel}`;
                this.vipImg.y = 15.5;
            } else {
                this.vipImg.skin = 'top/btn_zjm_vip.png';
                this.vipImg.y = 19;
                let vipLevel = modules.vip_new.VipNewModel.instance.getVipLevelTrue();
                this.vipNum.value = `${vipLevel}`;
            }
        }

        // 更新血量
        private updateHp(): void {
            this._endWidth = (PlayerModel.instance.hp / PlayerModel.instance.maxHp) * this._totalLen;
            TweenJS.create(this.hpBar).to({ width: this._endWidth }, 100).start();
            TweenJS.create(this.sideHpBar).to({ width: this._endWidth }, 300).start();
            if (PlayerModel.instance.maxHp > 99999) {
                if (PlayerModel.instance.maxHp > 99999999) {
                    if (PlayerModel.instance.hp > 99999999) {
                        this.hpTxt.text = (PlayerModel.instance.hp / Math.pow(10, 8)).toFixed(2) + "亿/" + (PlayerModel.instance.maxHp / Math.pow(10, 8)).toFixed(2) + "亿";
                    } else if (PlayerModel.instance.hp > 99999 && PlayerModel.instance.hp < Math.pow(10, 8)) {
                        this.hpTxt.text = (PlayerModel.instance.hp / Math.pow(10, 4)).toFixed(2) + "万/" + (PlayerModel.instance.maxHp / Math.pow(10, 8)).toFixed(2) + "亿";

                    } else {
                        this.hpTxt.text = Math.floor(PlayerModel.instance.hp).toString() + "/" + (PlayerModel.instance.maxHp / Math.pow(10, 8)).toFixed(2) + "亿";
                    }
                } else {
                    if (PlayerModel.instance.hp > 99999) {
                        this.hpTxt.text = (PlayerModel.instance.hp / Math.pow(10, 4)).toFixed(2) + "万/" + (PlayerModel.instance.maxHp / Math.pow(10, 4)).toFixed(2) + "万";

                    } else {
                        this.hpTxt.text = Math.floor(PlayerModel.instance.hp).toString() + "/" + (PlayerModel.instance.maxHp / Math.pow(10, 4)).toFixed(2) + "万";

                    }

                }
            } else {
                this.hpTxt.text = Math.floor(PlayerModel.instance.hp).toString() + "/" + Math.floor(PlayerModel.instance.maxHp).toString();
            }
        }

        // 更新场景
        private enterScene(mapId: number = -1): void {
            if (mapId === -1 && !SceneModel.instance.enterScene) return;
            this._sceneType = SceneCfg.instance.getCfgById(mapId !== -1 ? mapId : SceneModel.instance.enterScene[EnterSceneFields.mapId])[sceneFields.type];

            if (this._sceneType === 0) {      // 挂机
                this.hpBg.visible = this.hpBar.visible = this.hpTxt.visible = this.sideHpBar.visible = false;
                this.powerBg.visible = this.powerNum.visible = this.topbg.visible = true;
                this.showNobleBtn();
            } else {      // 副本
                this.hpBg.visible = this.hpBar.visible = this.hpTxt.visible = this.sideHpBar.visible = true;
                this.powerBg.visible = this.vipBox.visible = this.powerNum.visible = this.topbg.visible = false;
                this.showHbBtnHandler();
            }
        }

        private showNobleBtn(): void {
            this.nobleBtn.visible = FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.recharge) && !Main.instance.isWXiOSPay;
            this.vipBox.visible = FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.vip) || FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.vipF);
            this.showHbBtnHandler();
        }

        //红包按钮
        private showHbBtnHandler() {
            this.levelhbBtn.visible = FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.levelhb) && !Main.instance.isWXiOSPay;
            this.superhbBtn.visible = FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.superhb) && !Main.instance.isWXiOSPay;
        }

        // 点头像打开改名面板
        private clickHeadHandler(): void {
            WindowManager.instance.open(WindowEnum.RENAME_PANEL);
            // WindowManager.instance.open(WindowEnum.Mission_Party_Award_ALERT);
        }

        // 
        private GM_DEBUG_Handler(): void {
            WindowManager.instance.open(WindowEnum.GM_DEBUG_VIEW);
        }
        private GM_DEBUG_LongHandler(): void {
            console.log('研发测试_chy:长按事件',);
        }
        // 更新职业
        private occUpdate(): void {
            this.headImg.skin = `assets/icon/head/${CommonUtil.getHeadUrl(PlayerModel.instance.selectHead + Number(PlayerModel.instance.occ))}`;
        }
        // 声音
        private soundHandler(): void {
            SoundCtrl.instance.soundEnabled = !SoundCtrl.instance.soundEnabled;
            SoundCtrl.instance.bgMusicEnabled = !SoundCtrl.instance.bgMusicEnabled;
        }

        // 声音开关切换
        private soundEnableChangeHandler(): void {
            this.soundBtn.selected = !SoundCtrl.instance.soundEnabled && !SoundCtrl.instance.bgMusicEnabled;
        }

        // vip
        private vipHandler(): void {
            // WindowManager.instance.open(WindowEnum.VIP_NEW_PANEL);
            let bolll = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.vipF);
            if (!bolll) {
                SystemNoticeManager.instance.addNotice(FuncOpenModel.instance.getFuncOpenTipById(ActionOpenId.vipF), true);
                return;
            }
            let isSubfunction: number = ActionOpenCfg.instance.getCfgById(ActionOpenId.vipF)[action_openFields.isSubfunction];
            if (isSubfunction) {
                WindowManager.instance.openByActionId(ActionOpenId.vipF);
            } else {
                BottomTabCtrl.instance.openTabByFunc(ActionOpenId.vipF);
            }
        }

        // 贵族
        private nobleHandler(): void {
            if (FirstPayModel.instance.totalRechargeMoney < FirstPayCfg.instance.getCfgDefaultData()[Configuration.first_payFields.money]
                && FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.firstPay)) {
                WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);
            } else {
                WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
            }
        }

        // buff
        private buffHandler(): void {
            WindowManager.instance.open(WindowEnum.BUFF_ALERT);
        }

        private buffBtnNumber(): void {
            this.buffBtn.label = "BUFF×" + BuffModel.instance.buffs.length;
        }

        private updateView(show: boolean) {
            this.playInfoBox.visible = show;
            this.levelAndtranBox.visible = !show;
            this.moneyBox.x = show ? 0 : -60
        }

        private updataExpBar(): void {
            if (this._expTweenJs.isPlaying) return;
            this._expEffect.x = this.expBar.width + 130;
            let lv: number = PlayerModel.instance.level;
            if (lv == HumanCfg.instance.getMaxLvByAiId(1)) { //满级
                this.expBar.width = this._barMaxWidth;
                this._expEffect.visible = false;
            } else {
                let exp = this._expBarCtrl.value;
                //todo
                //console.log(`exp--->${exp}`);
                let maxExp: number;
                let cfg: human = HumanCfg.instance.getHumanCfgByAiIdAndLv(1, this._recordLv);
                if (cfg) {
                    maxExp = cfg[humanFields.exp];
                } else {
                    throw new Error(`当前等级--->${this._recordLv}取不到配置`);
                }

                this._expBarCtrl.maxValue = maxExp;
                // this._expBarCtrl.value =
                this._expEffect.visible = true;
                if (lv > this._recordLv) {  //连升多级
                    if (exp > maxExp) {
                        throw new Error(`经验条不动了 ---111 叫技术`);
                    }
                    let time = (1 - (exp / maxExp)) * 1000;
                    //todo
                    //console.log(`maxExp111--->${maxExp}`);
                    // console.log(`lv111--->${lv}`);
                    // console.log(`time111--->${time}`);
                    // console.log(`_recordLv111--->${this._recordLv}`);
                    this._expTweenJs.to({ value: maxExp }, time).start().onUpdate(() => {
                        this._expEffect.x = this.expBar.width + 130;
                    }).onComplete(() => {
                        this._expBarCtrl.value = 0;
                        this._expEffect.x = this.expBar.width + 130;
                        this._recordLv++;
                        this.updataExpBar();
                    });
                } else {
                    let needExp = PlayerModel.instance.exp;
                    //todo
                    //console.log(`needExp222--->${needExp}`);
                    //console.log(`lv222--->${lv}`);
                    //console.log(`_recordLv222--->${this._recordLv}`);
                    if (exp > needExp) {
                        throw new Error(`经验条不动了 ---222 叫技术`);
                    }
                    if (!needExp || exp > needExp) return;
                    let time = (1 - (exp / needExp)) * 1000;
                    this._expTweenJs.to({ value: needExp }, time).start().onUpdate(() => {
                        this._expEffect.x = this.expBar.width + 130;
                    }).onComplete(() => {
                        Laya.timer.once(500, this, () => {
                            this._expEffect.visible = false;
                        });
                    });
                    this._recordLv = lv;
                }
            }
        }
    }
}