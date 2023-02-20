///<reference path="../config/privilege_cfg.ts"/>
///<reference path="../config/recharge_cfg.ts"/>

namespace modules.heroAura {
    import HeroAuraViewUI = ui.HeroAuraViewUI;
    import Event = laya.events.Event;
    import recharge = Configuration.recharge;
    import RechargeCfg = modules.config.RechargeCfg;
    import rechargeFields = Configuration.rechargeFields;
    import CustomClip = modules.common.CustomClip;
    import GetHeroAuraInfoReplyFields = Protocols.GetHeroAuraInfoReplyFields;
    import GetHeroAuraInfoReply = Protocols.GetHeroAuraInfoReply;
    import GetHeroAuraRewardReply = Protocols.GetHeroAuraRewardReply;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import hero_AuraFields = Configuration.hero_auraFields;
    import ItemsFields = Protocols.ItemsFields;
    import CustomList = modules.common.CustomList;
    import hero_awardItem = Configuration.hero_awardItem
    import hero_awardItemFields = Configuration.hero_awardItemFields

    export class HeroAuraPanel extends HeroAuraViewUI {

        private _btnClip: CustomClip;
        private _tipBox1Tween: TweenJS;
        private _list: CustomList;
        private _array: Array<number>;
        private _listData: Array<hero_awardItem>;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            //this.titleImg.skin = "assets/icon/ui/designation/3000.png";
            this.buyBtn.addChild(this._btnClip);
            this._btnClip.pos(-6, -18);
            this._btnClip.scale(1.1, 1.1);
            this._list = new CustomList();
            this._array = new Array<number>();
            this._listData = new Array<hero_awardItem>();
            this._list.scrollDir = 1;
            this._list.width = 679;
            this._list.height = 635;
            this._list.hCount = 2;
            this._list.spaceY = 10;
            this._list.spaceX = 28;
            this._list.selectedIndex = 0;
            this._list.itemRender = HeroAuraItem;
            this._list.x = 26;
            this._list.y = 359;
            this.addChild(this._list);

            this.listData(this._listData);
            this._list.datas = this._listData;
        }

        protected addListeners(): void {
            super.addListeners();
            this.buyBtn.on(Event.CLICK, this, this.buyClickHandler);
            this.instructionsBtn.on(Event.CLICK, this, this.showInstructions);
            // this.receiveBtn.on(Event.CLICK, this, this.getTheReward);
            GlobalData.dispatcher.on(CommonEventType.GET_HERO_AURA_INFO_REPLY, this, this.update);
            GlobalData.dispatcher.on(CommonEventType.GET_HERO_AURA_REWARD_REPLY, this, this.update);
            // GlobalData.dispatcher.on(CommonEventType.UPDATE_HERO_AURA_INFO, this, this.update);
        };

        protected removeListeners(): void {
            super.removeListeners();
            this.buyBtn.off(Event.CLICK, this, this.buyClickHandler);
            this.instructionsBtn.off(Event.CLICK, this, this.showInstructions);
            // this.receiveBtn.off(Event.CLICK, this, this.getTheReward);
            GlobalData.dispatcher.off(CommonEventType.GET_HERO_AURA_INFO_REPLY, this, this.update);
            GlobalData.dispatcher.off(CommonEventType.GET_HERO_AURA_REWARD_REPLY, this, this.update);
            // GlobalData.dispatcher.off(CommonEventType.UPDATE_HERO_AURA_INFO, this, this.update);
        }

        protected onOpened() {
            super.onOpened();
            this._btnClip.play();
            this.playEffectLoop();
            this.update();
        }

        // private getTheReward() {
        //     HeroAuraCtrl.instance.getHeroAuraReward();// 接受返回参数后自动调用update
        // }

        private showInstructions() {
            CommonUtil.alertHelp(20069);
        }

        private buyClickHandler(): void {
            let cfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(170);// 1
            PlatParams.askPay(cfg[rechargeFields.index], cfg[rechargeFields.price]);
            this.update();
        }

        private update(): void {
            let info: GetHeroAuraInfoReply = HeroAuraModel.instance.HeroAuraInfoReply;
            if (!info) return;
            this.updateAwardItems();// 更新赠送物品

            if (info[GetHeroAuraInfoReplyFields.isOpen] === 0) {     // 0未开启 1开启

                let cfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(170);
                this.buyBtn.label = `${cfg[rechargeFields.price]}元抢购`;
                this.adTxt.text = "早买早享受~周卡持续30天";
                this.buyBtn.visible = this._btnClip.visible = true;
                this.isBuy.visible = false;

                this.award1.visible = this.award2.visible = this.awardBg.visible = true;
            } else {

                let restday = new Date(info[GetHeroAuraInfoReplyFields.endTime]).getTime();
                let nowday = GlobalData.serverTime;

                let tipsDay = BlendCfg.instance.getCfgById(74301)[blendFields.intParam][0];// 24小时内状态变为按钮出现‘续费’
                let leftDay = Math.floor((restday - nowday) / 86400000);// 获取当前天数差
                console.log('bbbb', tipsDay, leftDay);

                if (leftDay >= tipsDay) { // info[GetHeroAuraInfoReplyFields.isRenew] == 0
                    // this.tipTxt.innerHTML = `剩余<span style="color:#168A17">${leftDay}天</span>`;
                    this.adTxt.text = `剩余${leftDay}天`;
                    this.buyBtn.visible = this._btnClip.visible = false;
                    this.isBuy.visible = true;
                    this.award1.visible = this.award2.visible = this.awardBg.visible = false;
                } else {
                    // this.tipTxt.innerHTML = `剩余<span style="color:#FF3E3E">${leftDay}天</span>, <span style="color:#FF3E3E">(周卡即将到期)</span>`
                    this.adTxt.text = `剩余${leftDay}天, 黑钻特权即将到期`;
                    this.buyBtn.visible = this._btnClip.visible = true;
                    this.isBuy.visible = false;
                    this.buyBtn.label = "续费";
                    this.award1.visible = this.award2.visible = this.awardBg.visible = true;
                }

                // 返回的是否领取奖励若是不为0则领取失败
                // if (info[GetHeroAuraInfoReplyFields.dayAwd] == 2) {
                //     this.receiveBtn.disabled = true;
                // } else {
                //     this.receiveBtn.disabled = false;
                // }
            }
        }

        private updateAwardItems() {
            let info: GetHeroAuraInfoReply = HeroAuraModel.instance.HeroAuraInfoReply;
            if (!info) return;
            let arr = GlobalData.getConfig("user_halo")[info[GetHeroAuraInfoReplyFields.openCount]];

            let id1 = arr[hero_AuraFields.openItems][2][ItemsFields.ItemId];
            let count1 = arr[hero_AuraFields.openItems][2][ItemsFields.count];
            let id2 = arr[hero_AuraFields.openItems][3][ItemsFields.ItemId];
            let count2 = arr[hero_AuraFields.openItems][3][ItemsFields.count];

            this.award1.dataSource = [id1, count1, 0, null];
            this.award2.dataSource = [id2, count2, 0, null];
        }

        private playEffectLoop(): void {
            if (this._tipBox1Tween) {
                this._tipBox1Tween.stop();
            }
            this.titleImg.y = 164;
            this._tipBox1Tween = TweenJS.create(this.titleImg).to({ y: this.titleImg.y - 15 },
                1200).start().yoyo(true).repeat(99999999);
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            if (this._tipBox1Tween) {
                this._tipBox1Tween.stop();
                this._tipBox1Tween = null;
            }
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
        }
        public close() {
            super.close();
            if (this._tipBox1Tween) {
                this._tipBox1Tween.stop();
            }
            if (this._btnClip) {
                this._btnClip.stop();
                this._btnClip.visible = false;
            }
        }

        private listData(listData: Array<hero_awardItem>): void {
            listData.length = 0;
            let arrts = GlobalData.getConfig("heroaura_item");

            for (let j = 0; j < 7; j++) {
                let id = j + 1;
                let awardTxt = arrts[j][hero_awardItemFields.awardTxt];
                let baseBg = arrts[j][hero_awardItemFields.awardIcon];
                let awardName = arrts[j][hero_awardItemFields.awardNameIcon];
                listData.push([id, baseBg, awardName, awardTxt]);
            }
        }
    }
}