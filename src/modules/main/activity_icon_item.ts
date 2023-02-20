///<reference path="../main/left_top_rp_config.ts"/>

namespace modules.main {
    import LeftTopRPConfig = main.LeftTopRPConfig;
    import ActivityIconItemUI = ui.ActivityIconItemUI;
    import Event = Laya.Event;
    import ActionOpenCfg = modules.config.ActionOpenCfg;
    import action_openFields = Configuration.action_openFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import BottomTabCtrl = modules.bottomTab.BottomTabCtrl;
    import CustomClip = modules.common.CustomClip;
    import Point = Laya.Point;

    export class ActivityIconItem extends ActivityIconItemUI {

        private _funcId: number;
        private _eff: CustomClip;      //奖品特效

        constructor(id: number) {
            super();

            let resName: string = ActionOpenCfg.instance.getCfgById(this._funcId = id)[action_openFields.uiName];;
            this.icon.skin = `left_top/${resName}`;
            // this.judgeShowOtherSkin(id);

            if (this._funcId === ActionOpenId.xunbao) {
                this.regGuideSpr(GuideSpriteId.LEFT_TOP_TREASURE_BTN, this);
            }
        }

        protected onOpened(): void {
            super.onOpened();

            this.setActionPreviewPos();
            this.showPrizeEffect();
        }

        /**
         * 存储对应功能预览 对应的飞入点
         */
        public setActionPreviewPos() {
            // Laya.timer.clear(this, this.setPosActionPreview);
            // Laya.timer.once(200, this, this.setPosActionPreview);
            this.callLater(this.setPosActionPreview);
        }

        /**
         * 不使用配置表的UI资源，使用特定的资源
         */
        // public judgeShowOtherSkin(id: number) {
        //     //任务派对，因为有很多任务，一个图片资源肯定不够
        //     if (id === ActionOpenId.MissionPartyEnter) {
        //         let resName: string = modules.mission_party.MissionPartyModel.instance.getCurrentMissionIconResName();
        //         this.icon.skin = `left_top/${resName}`;
        //     } 
        //     //充值轮循活动
        //     else if (id === ActionOpenId.TreesSpring) {
        //         let resName: string = modules.cumulate3_pay.CumulatePay3Model.instance.getCurrentIconResName();
        //         this.icon.skin = `left_top/${resName}`;
        //     }
        // }

        /**
         * name
         */
        public setPosActionPreview() {
            if (this._funcId === ActionOpenId.welfare) {
                Point.TEMP.setTo(this.width / 2, this.height / 2);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.welfare, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.sign, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.onlineReward, pos);
            } else if (this._funcId === ActionOpenId.sevenDay) {
                Point.TEMP.setTo(this.width / 2, this.height / 2);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.sevenDay, pos);
            } else if (this._funcId === ActionOpenId.paihangbang) {
                Point.TEMP.setTo(this.width / 2, this.height / 2);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.paihangbang, pos);
            } else if (this._funcId === ActionOpenId.monthCard) {
                Point.TEMP.setTo(this.width / 2, this.height / 2);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.monthCard, pos);
            } else if (this._funcId === ActionOpenId.xunbao) {
                Point.TEMP.setTo(this.width / 2, this.height / 2);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.xunbao, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.xunbaoEquip, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.xunbaoDianfeng, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.xunbaoZhizun, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.xunbaoTalisman, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.xunbaoXianfu, pos);
            } else if (this._funcId === ActionOpenId.openServerActivit) {
                Point.TEMP.setTo(this.width / 2, this.height / 2);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.openServerActivit, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.discountGift, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.payReward, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.consumeReward, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.cumulatePay2, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.cumulatePay, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.consumeReward2, pos);
            } else if (this._funcId === ActionOpenId.TreesSpring) {//daw 植树迎春
                Point.TEMP.setTo(this.width / 2, this.height / 2);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.TreesSpring, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.cumulatePay3, pos);
            } else if (this._funcId === ActionOpenId.MissionPartyEnter) {//daw 派对狂欢（迎春派对）
                Point.TEMP.setTo(this.width / 2, this.height / 2);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.MissionPartyEnter, pos);
            } else if (this._funcId === ActionOpenId.continuePay) {
                Point.TEMP.setTo(this.width / 2, this.height / 2);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.continuePay, pos);
            } else if (this._funcId === ActionOpenId.zeroBuy) {
                Point.TEMP.setTo(this.width / 2, this.height / 2);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.zeroBuy, pos);
            } else if (this._funcId === ActionOpenId.gushen) {
                Point.TEMP.setTo(this.width / 2, this.height / 2);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.gushen, pos);
            } else if (this._funcId === ActionOpenId.investReward) {
                Point.TEMP.setTo(this.width / 2, this.height / 2);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.investLogin, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.investRecruit, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.investReward, pos);
            } else if (this._funcId === ActionOpenId.kuanghuan) {
                Point.TEMP.setTo(this.width / 2, this.height / 2);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.kuanghuan2, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.kuanghuan, pos);
            } else if (this._funcId === ActionOpenId.storeAndShop) {
                Point.TEMP.setTo(this.width / 2, this.height / 2);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.storeAndShop, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.shop, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.shop_1, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.shop_2, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.shop_3, pos);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.shop_4, pos);
            } else if (this._funcId === ActionOpenId.halfMonth) {
                Point.TEMP.setTo(this.width / 2, this.height / 2);
                let pos = this.localToGlobal(Point.TEMP, true);
                modules.action_preview.actionPreviewModel.instance._posSprite.set(ActionOpenId.halfMonth, pos);
            }
        }

        protected addListeners(): void {
            super.addListeners();

            this.on(Event.CLICK, this, this.openEventHandler);

            // 红点功能注册监听
            let rps: Array<keyof ui.LTIocnRP> = LeftTopRPConfig.instance.getRps(this._funcId);
            if (rps) {
                RedPointCtrl.instance.registeRedPoint(this.dotImg, rps);
            }

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RESIZE_UI, this, this.setActionPreviewPos);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ACTION_PREVIEW_RESIZE_UI, this, this.setActionPreviewPos);
            // this.showPrizeEffect(true);
        }

        protected removeListeners(): void {

            this.off(Event.CLICK, this, this.openEventHandler);

            RedPointCtrl.instance.retireRedPoint(this.dotImg);

            super.removeListeners();
        }

        private openEventHandler(): void {

            if (this._funcId == ActionOpenId.investReward) {
                if (RedPointCtrl.instance.getRPProperty("investLoginRP")) {
                    WindowManager.instance.open(WindowEnum.INVEST_LOGIN_PANEL);
                } else if (RedPointCtrl.instance.getRPProperty("investRecruitRP")) {
                    WindowManager.instance.open(WindowEnum.INVEST_RECRUIT_PANEL);
                } else if (RedPointCtrl.instance.getRPProperty("investGrowthRP")) {
                    WindowManager.instance.open(WindowEnum.INVEST_GROWTH_PANEL);
                } else {
                    WindowManager.instance.open(WindowEnum.INVEST_LOGIN_PANEL);
                }
            } else {
                let isSubfunction: number = ActionOpenCfg.instance.getCfgById(this._funcId)[action_openFields.isSubfunction];
                if (isSubfunction || this._funcId === ActionOpenId.equipSuit) {
                    WindowManager.instance.openByActionId(this._funcId);
                } else {
                    BottomTabCtrl.instance.openTabByFunc(this._funcId);
                }
            }
            this.setEffState();
        }

        public setEffState(): void {
            switch (this._funcId) {
                case ActionOpenId.zeroBuy:  //零元购
                case ActionOpenId.continuePay:  //连充
                case ActionOpenId.investReward:  //百倍返利
                    GlobalData.effState[this._funcId] = false;
                    break;
            }
            this.showPrizeEffect();
        }

        /**
         * 入口显示特效
         */
        public showPrizeEffect() {
            switch (this._funcId) {
                case ActionOpenId.zeroBuy:  //零元购
                case ActionOpenId.continuePay:  //零元购
                case ActionOpenId.investReward:  //零元购
                case ActionOpenId.Daw_UI_QUZHANG:  //区长分红
                case ActionOpenId.Daw_UI_ZHANLI:  //战力分红
                    if (GlobalData.effState[this._funcId] === false) {
                        CustomClip.thisStop(this._eff);
                    } else {
                        this.playEff();
                    }
                    break;
                case ActionOpenId.zhuanPanEnter:  //充值转盘
                case ActionOpenId.activity:  //活动
                case ActionOpenId.openServerActivit:  //开服活动
                case ActionOpenId.TreesSpring:  //植树迎春
                case ActionOpenId.MissionPartyEnter:  //植树迎春
                    this.playEff();
                    break;
            }
        }

        private playEff(): void {
            if (!this._eff) {
                if (this._funcId == ActionOpenId.Daw_UI_QUZHANG ||
                    this._funcId == ActionOpenId.Daw_UI_ZHANLI) {
                    //抽过帧  一个一个写
                    this._eff = new CustomClip();
                    this.addChildAt(this._eff, 1);
                    //注释skin  否则会导致图集释放报错
                    // this._eff.skin = "res/atlas/left_top.atlas";
                    this._eff.frameUrls = ["left_top/eff_a_0.png", "left_top/eff_a_1.png", "left_top/eff_a_2.png", "left_top/eff_a_3.png",
                        "left_top/eff_a_4.png", "left_top/eff_a_5.png"];
                    this._eff.durationFrame = 5;
                    this._eff.loop = true;
                    this._eff.x = 0;
                    this._eff.y = 0;
                    this._eff.scaleX = this._eff.scaleY = 0.8;
                }else{
                    //抽过帧  一个一个写
                    this._eff = new CustomClip();
                    this.addChildAt(this._eff, 1);
                    //注释skin  否则会导致图集释放报错
                    // this._eff.skin = "res/atlas/left_top.atlas";
                    this._eff.frameUrls = ["left_top/eff_0.png", "left_top/eff_2.png", "left_top/eff_4.png", "left_top/eff_6.png",
                        "left_top/eff_8.png", "left_top/eff_10.png", "left_top/eff_12.png", "left_top/eff_14.png"];
                    this._eff.durationFrame = 7;
                    this._eff.loop = true;
                    this._eff.x = 9;
                    this._eff.y = 8;
                    this._eff.scaleX = this._eff.scaleY = 0.8;
                }
            }
            this._eff.play();
            this._eff.visible = true;
        }

        public destroy(destroyChild: boolean = true): void {
            this._eff = this.destroyElement(this._eff);
            super.destroy(destroyChild);
        }
    }
}