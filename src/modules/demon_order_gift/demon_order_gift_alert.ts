/* 七日活动任务item */
namespace modules.demonOrderGift {
    import DemonOrderGiftAlertUI = ui.DemonOrderGiftAlertUI;
    import recharge = Configuration.recharge;
    import RechargeCfg = modules.config.RechargeCfg;
    import rechargeFields = Configuration.rechargeFields;
    import CustomList = modules.common.CustomList;
    import CustomClip = modules.common.CustomClip;
    import Event = laya.events.Event;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import ItemsFields = Protocols.ItemsFields;
    import demon_orderGiftFields = Configuration.demon_orderGiftFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import BaseItem = modules.bag.BaseItem;

    export class DemonOrderGiftAlert extends DemonOrderGiftAlertUI {
        private _btnClip: CustomClip;
        private _list: CustomList;
        private _listData: Array<BaseItem>;

        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.buyBtn.addChild(this._btnClip);
            this._btnClip.pos(-8, -12);
            this._btnClip.scale(1.18, 0.96);

            this._list = new CustomList();
            this._listData = new Array<BaseItem>();
            this._list.scrollDir = 1;
            this._list.width = 532;
            this._list.height = 263;
            this._list.hCount = 4;
            this._list.spaceY = 8;
            this._list.spaceX = 35;
            this._list.itemRender = BaseItem;
            this._list.x = 103;
            this._list.y = 128;
            this.addChild(this._list);

            this.getRewardItems();


        }
        protected addListeners(): void {
            super.addListeners();
            this.buyBtn.on(Event.CLICK, this, this.buyClickHandler);
            // GlobalData.dispatcher.on(CommonEventType.GET_WEEK_YUANBAO_CARD_INFO_REPLY, this, this.update);
            // GlobalData.dispatcher.on(CommonEventType.GET_WEEK_YUANBAO_CARD_REWARD_REPLY, this, this.update);
            // GlobalData.dispatcher.on(CommonEventType.UPDATE_WEEK_YUANBAO_CARD_INFO, this, this.update);
        };

        protected removeListeners(): void {
            super.removeListeners();
            this.buyBtn.off(Event.CLICK, this, this.buyClickHandler);
            // GlobalData.dispatcher.off(CommonEventType.GET_WEEK_YUANBAO_CARD_INFO_REPLY, this, this.update);
            // GlobalData.dispatcher.off(CommonEventType.GET_WEEK_YUANBAO_CARD_REWARD_REPLY, this, this.update);
            // GlobalData.dispatcher.off(CommonEventType.UPDATE_WEEK_YUANBAO_CARD_INFO, this, this.update);
        }

        private buyClickHandler() {
            let cfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(180);
            PlatParams.askPay(cfg[rechargeFields.index], cfg[rechargeFields.price]);
            // if(DemonOrderGiftModel.instance.flagInfo == 1){
            //     WindowManager.instance.close(WindowEnum.DEMON_ORDER_GIFT_ALERT);
            // } else {
            //     SystemNoticeManager.instance.addNotice("魔神令购买失败");
            // }
        }

        public onOpened() {
            super.onOpened();
            this._btnClip.play();
        }

        private getRewardItems() {
            // 列表里的items
            let arr = GlobalData.getConfig("demon_order");
            let dayLast = BlendCfg.instance.getCfgById(74403)[blendFields.intParam][0];
            let arrItems: Array<any> = [];
            
            for(let j = 0; j < dayLast; j++) {
                let awardOne = arr[j][demon_orderGiftFields.buyRewards];
                for(let j = 0; j < awardOne.length; j++) {
                    arrItems.push(awardOne[j])
                }
            }
            
            let items = RechargeCfg.instance.getRecharCfgByIndex(180)[Configuration.rechargeFields.reward];
            let item = RechargeCfg.instance.getRecharCfgByIndex(180)[Configuration.rechargeFields.reward];
            
            if (items && (items.length !== 0)) {
                // let itemCfg1 = CommonUtil.getItemCfgById(items[0][ItemsFields.ItemId]);
                // let itemCfg2 = CommonUtil.getItemCfgById(items[1][ItemsFields.ItemId]);
                // let itemCfg3 = CommonUtil.getItemCfgById(item[0][ItemsFields.ItemId]);
                this.award1.dataSource = [items[0][ItemsFields.ItemId], items[0][ItemsFields.count], 0, null]
                this.award2.dataSource = [items[1][ItemsFields.ItemId], items[1][ItemsFields.count], 0, null]
                this.award3.dataSource = [items[2][ItemsFields.ItemId], items[2][ItemsFields.count], 0, null]

                // this.award1._nameTxt.text = itemCfg1[item_materialFields.name].toString();
                // this.award2._nameTxt.text = itemCfg2[item_materialFields.name].toString();
                // this.award3._nameTxt.text = itemCfg3[item_materialFields.name].toString();
                this.award1._nameTxt.visible = true;
                this.award2._nameTxt.visible = true;
                this.award3._nameTxt.visible = true;
            }

            this._list.datas = DemonOrderGiftModel.instance.getFilterAwardList(arrItems);
        }

        public destroy(): void {
            super.destroy();
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
        }
        public close(): void {
            super.close();
        }
    }
}