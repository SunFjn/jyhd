/** 至尊礼包购买弹框*/


namespace modules.extreme {
    import GetGauntletReply = Protocols.GetGauntletReply;
    import GetGauntletReplyFields = Protocols.GetGauntletReplyFields;
    import BaseItem = modules.bag.BaseItem;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import Event = Laya.Event;
    import CustomClip = modules.common.CustomClip;
    import CustomList = modules.common.CustomList;
    import Items = Configuration.Items;
    import ZhizunBuyAlertUI = ui.ZhiZunBuyAlertUI;
    import ZhizunBuyItemUI = ui.ZhizunBuyItemUI;


    export class ZhizunBuyAlert extends ZhizunBuyAlertUI {
        private _items: Array<BaseItem>;
        private _btnClip: CustomClip;
        private _list: CustomList;
        private _challengeClip: CustomClip;

        public destroy(destroyChild: boolean = true): void {
            this._items = this.destroyElement(this._items);
            this._btnClip = this.destroyElement(this._btnClip);
            this._list = this.destroyElement(this._list);
            this._challengeClip = this.destroyElement(this._challengeClip);
            super.destroy();
        }

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._items = [this.item1, this.item2, this.item3, this.item4, this.item5, this.item6];
            // this.item1.needTip = false;



            this._btnClip = CommonUtil.creatEff(this, `btn_light`, 15);
            this._btnClip.pos(this.buyBtn.x - 5, this.buyBtn.y - 10, true);
            this._btnClip.visible = true;
            this._btnClip.play();

            this._list = new CustomList();
            this._list.scrollDir = 2;
            this._list.width = 570;
            this._list.height = 57;
            this._list.vCount = 1;
            this._list.hCount = 4;
            this._list.itemRender = ZhizunBuyItem;
            this._list.x = 55;
            this._list.y = 790;
            this._list.spaceX = 5;
            this.addChild(this._list);
            this._challengeClip = new CustomClip();
            this.itemIcon.addChildAt(this._challengeClip, 0);
            this._challengeClip.pos(-110, -50, true);
            this._challengeClip.scale(0.85, 0.85);
        }

        protected addListeners(): void {
            super.addListeners();
            this._list.on(Event.SELECT, this, this.selectHandler);
            this.buyBtn.on(Event.CLICK, this, this.askPay);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LuxuryEquip_ZhiZun_BuyUPDATE, this, this.updateUI);
            // PlatParams.askPay(cfg[rechargeFields.index], cfg[rechargeFields.price]);
        }
        private askPay() {
            let info = this._info[this._list.selectedIndex]
            if (!info) return;
            let id = info[0]
            PlatParams.askPay(extremeModel.instance.getBuyId(id)[0], extremeModel.instance.getBuyId(id)[2]);
            WindowManager.instance.close(WindowEnum.ZZTZ_BUY_ALERT)
        }
        protected removeListeners(): void {
            super.removeListeners();
            this._list.off(Event.SELECT, this, this.selectHandler);
            this.buyBtn.off(Event.CLICK, this, this.askPay);
        }
        private _info: Array<[number, number, number]> = new Array<[number, number, number]>()
        onOpened(): void {
            super.onOpened();
            this._info = extremeModel.instance.getBuyInfo(8)
            let showGoldBodys = this._info
            this._list.datas = showGoldBodys;
            this._list.selectedIndex = 0;
            this.selectHandler();
        }
        private updateUI() {
            this._info = extremeModel.instance.getBuyInfo(8)
            let showGoldBodys = this._info
            this._list.datas = showGoldBodys;
            this.selectHandler();
        }
        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            this._btnClip.stop();
        }

        private updateInfo(): void {
            let info = this._info[this._list.selectedIndex]
            if (!info) return;
            let id = info[0]
            let num = info[1]
            let max = info[2]
            this.remainTxt.text = "剩余购买次数:" + num + "/" + max

            if (num > 0) {
                this.buyBtn.label = "立即抢购";
                this._btnClip.visible = true;
                this.buyBtn.disabled = false;
                this.buyBtn.visible = true;
                this.gotImg.visible = false;
            } else {
                this.buyBtn.label = "已售完";
                this.buyBtn.disabled = true;
                this._btnClip.visible = false;
                this.buyBtn.visible = true;
                this.gotImg.visible = false;
            }

            let rewardArr: Array<Items> = extremeModel.instance.getBuyId(id)[6];
            console.log('vtz:rewardArrrewardArr', rewardArr);
            for (let i: int = 0, len: int = rewardArr.length; i < len; i++) {
                this._items[i].dataSource = [rewardArr[i][0], rewardArr[i][1], 0, null];
            }
            this.moneyTxt.text = extremeModel.instance.getBuyId(id)[2] + ""
            this.iconId = Number(rewardArr[0][0]) - 15160001
            console.log('vtz:  this.iconId', this.iconId);
        }


        private iconId = 0
        private _selectedId: int;
        //选择某个页签,开放则刷新显示页面
        private selectHandler(): void {
            this.updateInfo()
            // //0 1 2 3
            this._selectedId = this._list.selectedIndex;
            let name = "extreme_" + (Number(this.iconId) + 1001)
            this._challengeClip.skin = "assets/effect/extreme/" + name + ".atlas";
            this._challengeClip.frameUrls = [
                name + "/0.png",
                name + "/1.png",
                name + "/2.png",
                name + "/3.png",
                name + "/4.png",
                name + "/5.png",
                name + "/6.png",
                name + "/7.png"
            ];
            this._challengeClip.durationFrame = 10;
            this._challengeClip.play();

            let item = extremeModel.instance.getIcon(Number(this.iconId + 1))
            console.log('vtz:itemitemitemitemitem', item, this.iconId);
            this.titleImg.skin = "zhizun/zhizunbuy/" + item[0] + ".png"

        }
    }
}