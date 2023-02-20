///<reference path="../config/privilege_cfg.ts"/>
///<reference path="../config/recharge_cfg.ts"/>

namespace modules.demonOrderGift {
    import DemonOrderGiftViewUI = ui.DemonOrderGiftViewUI;
    import Event = laya.events.Event;
    import recharge = Configuration.recharge;
    import RechargeCfg = modules.config.RechargeCfg;
    import rechargeFields = Configuration.rechargeFields;
    import CustomClip = modules.common.CustomClip;
    import GetDemonOrderGiftInfoReplyFields = Protocols.GetDemonOrderGiftInfoReplyFields;
    import GetDemonOrderGiftInfoReply = Protocols.GetDemonOrderGiftInfoReply;
    import GetDemonOrderGiftRewardReply = Protocols.GetDemonOrderGiftRewardReply;
    import BlendCfg = modules.config.BlendCfg;
    import demon_orderGiftFields = Configuration.demon_orderGiftFields;
    import demon_orderGiftItem = Configuration.demon_order_giftItem;
    import ItemsFields = Protocols.ItemsFields;
    import CustomList = modules.common.CustomList;
    import DemonOrderGiftStateFields = Protocols.DemonOrderGiftStateFields;
    import DemonOrderGiftState = Protocols.DemonOrderGiftState;
    import blendFields = Configuration.blendFields;

    export class DemonOrderGiftPanel extends DemonOrderGiftViewUI {

        private _btnClip: CustomClip;
        private _list: CustomList;
        private _listData: Array<demon_orderGiftItem>;
        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.btn_receive.addChild(this._btnClip);
            this._btnClip.pos(-6, -14);
            this._btnClip.scale(0.98, 0.98);

            this._list = new CustomList();
            this._listData = new Array<demon_orderGiftItem>();
            this._list.scrollDir = 1;
            this._list.width = 690;
            this._list.height = 577;
            this._list.hCount = 1;
            this._list.spaceY = 8;
            // this._list.selectedIndex = 0;
            this._list.itemRender = DemonOrderGiftItem;
            this._list.x = 15;
            this._list.y = 477;
            this.addChild(this._list);

            this.showFinalReward();
        }

        protected addListeners(): void {
            super.addListeners();
            this.btn_receive.on(Event.CLICK, this, this.getTheReward);
            this.btn_moshen.on(Event.CLICK, this, this.showPurchase);
            GlobalData.dispatcher.on(CommonEventType.GET_WEEK_YUANBAO_CARD_INFO_REPLY, this, this.update);
            GlobalData.dispatcher.on(CommonEventType.GET_WEEK_YUANBAO_CARD_REWARD_REPLY, this, this.update);
            // GlobalData.dispatcher.on(CommonEventType.UPDATE_WEEK_YUANBAO_CARD_INFO, this, this.update);
        };

        protected removeListeners(): void {
            super.removeListeners();
            this.btn_receive.off(Event.CLICK, this, this.getTheReward);
            this.btn_moshen.off(Event.CLICK, this, this.showPurchase);
            GlobalData.dispatcher.off(CommonEventType.GET_WEEK_YUANBAO_CARD_INFO_REPLY, this, this.update);
            GlobalData.dispatcher.off(CommonEventType.GET_WEEK_YUANBAO_CARD_REWARD_REPLY, this, this.update);
            // GlobalData.dispatcher.off(CommonEventType.UPDATE_WEEK_YUANBAO_CARD_INFO, this, this.update);
        }

        protected onOpened() {
            super.onOpened();
            this._btnClip.play();
            this.update();

            // 更新倒计时时间
            this.timeHandler();
        }

        private getTheReward() {
            if (DemonOrderGiftModel.instance.flagInfo == 0) {
                this.showPurchase();
            }
            DemonOrderGiftCtrl.instance.getDemonOrderGiftReward();// 接受返回参数后自动调用update
            this.update();
        }

        private showPurchase() {
            if (DemonOrderGiftModel.instance.flagInfo == 0) {
                WindowManager.instance.open(WindowEnum.DEMON_ORDER_GIFT_ALERT);
            }
        }

        // private buyClickHandler(): void {
        //     let cfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(180);// 1
        //     PlatParams.askPay(cfg[rechargeFields.index], cfg[rechargeFields.price]);
        //     this.update();
        // }

        private update(): void {
            let info: GetDemonOrderGiftInfoReply = DemonOrderGiftModel.instance.DemonOrderGiftInfoReply;
            if (!info) return;
            // console.log('0x1002475', '0x1002476', info, DemonOrderGiftModel.instance.DemonOrderGiftRewardReply);

            // this.updateAwards();

            this.lb_dayCount.text = `${info[GetDemonOrderGiftInfoReplyFields.day].toString()}天`;

            if (DemonOrderGiftModel.instance.flagInfo == 0) {     // 0未开启 1开启
                this.btn_moshen.skin = "demon_orderGift/btn_jsmsl_0.png";
            } else {
                this.btn_moshen.skin = "demon_orderGift/btn_jsmsl_1.png";
            }

            if (DemonOrderGiftModel.instance.isRedPoint) {
                this.btn_receive.disabled = false;
                this.redPoint.visible = true;
                this._btnClip.visible = true;
            } else {
                this.btn_receive.disabled = true;
                this.redPoint.visible = false;
                this._btnClip.visible = false;
            }

            this.listData(this._listData);
            this._list.datas = this._listData;
        }

        // updateAwards() {
        //     let info: GetDemonOrderGiftInfoReply = DemonOrderGiftModel.instance.DemonOrderGiftInfoReply;
        //     let arr = GlobalData.getConfig("demon_order");
        //     // console.log('arrrr', arr, info);

        //     let today = info[GetDemonOrderGiftInfoReplyFields.day];
        //     let freeItem = arr[today - 1][demon_orderGiftFields.rewards][0];
        //     let items = arr[today - 1][demon_orderGiftFields.buyRewards];
        //     this.award1.dataSource = [freeItem[ItemsFields.ItemId], freeItem[ItemsFields.count], 0, null];
        //     this.award2.dataSource = [items[0][ItemsFields.ItemId], items[0][ItemsFields.count], 0, null];
        //     this.award3.dataSource = [items[1][ItemsFields.ItemId], items[1][ItemsFields.count], 0, null];
        // }

        private listData(listData: Array<demon_orderGiftItem>): void {
            listData.length = 0;
            let arrts = GlobalData.getConfig("demon_order");
            let info: GetDemonOrderGiftInfoReply = DemonOrderGiftModel.instance.DemonOrderGiftInfoReply;
            let infoState = info[GetDemonOrderGiftInfoReplyFields.awardStates];
            let dayLast = BlendCfg.instance.getCfgById(74403)[blendFields.intParam][0];
            // console.log("daylast", dayLast);

            for (let j = 0; j < dayLast; j++) {
                let dayTxt = j + 1;
                let dayLimit = info[GetDemonOrderGiftInfoReplyFields.day];
                let iconBg: string;
                let isUnlock: boolean;
                let freeItem = arrts[j][demon_orderGiftFields.rewards];
                let buyItems = arrts[j][demon_orderGiftFields.buyRewards];
                let receivedIcon: Array<number>;
                if (infoState && infoState.length) {
                    receivedIcon = [infoState[j][DemonOrderGiftStateFields.state1], infoState[j][DemonOrderGiftStateFields.state2]];
                } else {
                    receivedIcon = [0, 0]
                }

                if (j < dayLimit) {
                    iconBg = "demon_orderGift/image_di_0.png";
                    isUnlock = false;
                } else {
                    iconBg = "demon_orderGift/image_di_1.png";
                    isUnlock = true;
                }
                listData.push([dayTxt, freeItem, buyItems, iconBg, receivedIcon, isUnlock]);
            }
        }

        private timeHandler() {
            let info: GetDemonOrderGiftInfoReply = DemonOrderGiftModel.instance.DemonOrderGiftInfoReply;
            if (!info) return;
            let timeLeft = info[GetDemonOrderGiftInfoReplyFields.endTime];
            if (timeLeft > GlobalData.serverTime) {
                this.timeLeftHandler();
                Laya.timer.loop(1000, this, this.timeLeftHandler);
            } else {
                this.lb_dayCount.text = "7"
                this.lb_dayLeft.text = "活动已经结束";
            }
        }

        private timeLeftHandler() {
            let info: GetDemonOrderGiftInfoReply = DemonOrderGiftModel.instance.DemonOrderGiftInfoReply;
            let timeLeft = info[GetDemonOrderGiftInfoReplyFields.endTime];
            if (timeLeft > GlobalData.serverTime) {
                this.lb_dayLeft.text = "活动倒计时:" + `${modules.common.CommonUtil.timeStampToDayHourMinSecond(timeLeft)}`;
            } else {
                Laya.timer.clear(this, this.timeLeftHandler);
            }
        }

        private showFinalReward() {
            let items = BlendCfg.instance.getCfgById(74400)[blendFields.stringParam];// 24小时内状态变为按钮出现‘续费’
            let str1: any = DemonOrderGiftModel.instance.deleteString((DemonOrderGiftModel.instance.deleteString(items[0], "[")), "]").split("#");
            let str2: any = DemonOrderGiftModel.instance.deleteString((DemonOrderGiftModel.instance.deleteString(items[1], "[")), "]").split("#");
            let str3: any = DemonOrderGiftModel.instance.deleteString((DemonOrderGiftModel.instance.deleteString(items[2], "[")), "]").split("#");

            this.award1.dataSource = [Number(str1[0]), Number(str1[1]), 0, null]
            this.award2.dataSource = [Number(str2[0]), Number(str2[1]), 0, null]
            this.award3.dataSource = [Number(str3[0]), Number(str3[1]), 0, null]
        }
    }
}