/** 姻缘 刻印*/



namespace modules.marry {

    import MarryGiftAlertUI = ui.MarryGiftAlertUI;
    import LayaEvent = modules.common.LayaEvent;
    import CustomList = modules.common.CustomList;
    import marry_packageFields = Configuration.marry_packageFields;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;

    export class MarryGiftAlert extends MarryGiftAlertUI {

        private _btnClip: CustomClip;
        public destroy(destroyChild: boolean = true): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy();
        }

        constructor() {
            super();
        }
        private _List2: CustomList;
        protected initialize(): void {
            super.initialize();
            this._List2 = new CustomList();
            this._List2.scrollDir = 2;
            this._List2.itemRender = MarryShowItem;

            this._List2.vCount = 1;

            this._List2.hCount = 7;

            this._List2.width = 85;
            this._List2.height = 85;
            this._List2.x = 0;
            this._List2.y = 0;
            this._List2.spaceX = 3;
            this.itemBox.addChild(this._List2)
            this._btnClip = new CustomClip();
            this.goBtn.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.play();
            this._btnClip.loop = true;
            this._btnClip.pos(-5, -18);
            this._btnClip.scaleY = 1.2;
            this._btnClip.scaleX = 1.22;
            this._btnClip.visible = false;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.tab1Btn, LayaEvent.CLICK, this, this.sele, [0]);
            this.addAutoListener(this.tab2Btn, LayaEvent.CLICK, this, this.sele, [1]);
            this.addAutoListener(this.goBtn, LayaEvent.CLICK, this, this.sendGift);
        }

        protected removeListeners(): void {

            super.removeListeners();
        }
        private _selectIndex: number = -1;
        private sele(index: number) {
            this._selectIndex = index;
            this.selectHandler()
        }
        private selectHandler(): void {
            let cfg = MarryCfg.instance.getGiftAll()[this._selectIndex]
            if (this._selectIndex == 0) {
                this.tab1Btn.skin = "marry/image_1.png"
                this.tab2Btn.skin = "marry/marry_1.png"
                this.titileImg.skin = "marry/txt_xyxt_hjjz.png"
                this.nameImg.skin = "marry/txt_ysyq.png";
            } else {
                this.tab1Btn.skin = "marry/marry_1.png"
                this.tab2Btn.skin = "marry/image_1.png"
                this.titileImg.skin = "marry/txt_xyxt_02.png"
                this.nameImg.skin = "marry/txt_yjxb.png";
            }
            this._List2.width = 88 * cfg[marry_packageFields.items].length
            this._List2.x = -this._List2.width / 2
            this._List2.datas = cfg[marry_packageFields.items]

            this.originalTxt.text = cfg[marry_packageFields.originalPrice][ItemsFields.count]
            this.moneyTxt.text = cfg[marry_packageFields.realityPrice][ItemsFields.count]
            this.gift1Txt.text = MarryCfg.instance.getGiftAll()[0][marry_packageFields.realityPrice][ItemsFields.count]
            this.gift2Txt.text = MarryCfg.instance.getGiftAll()[1][marry_packageFields.realityPrice][ItemsFields.count]
        }

        public setOpenParam(value): void {
            super.setOpenParam(value);


        }
        onOpened(): void {
            super.onOpened();
            this.sele(0);
                this._btnClip.visible = true;
                this._btnClip.play();
        }
        private setT: number;
        private sendGift(index: number) {
            let cfg = MarryCfg.instance.getGiftAll()[this._selectIndex]
            let gold = cfg[marry_packageFields.realityPrice][ItemsFields.count]
            if (PlayerModel.instance.getCurrencyById(MoneyItemId.FairyCoin) < gold) {
                CommonUtil.alert('温馨提示', '点券不足，是否前往充值界面充值？', [Handler.create(this, this.openRecharge)]);
            } else {
                MarryCtrl.instance.BuyMarryPackage(cfg[marry_packageFields.id]);

                // 此时派发监听事件到ring的按钮上
                this.setT = setTimeout(() => {
                    GlobalData.dispatcher.event(CommonEventType.MARRY_GIFT_UPDATE);
                }, 100);
            }
            this.close();
        }
        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.ZXIANYU_PANEL);
        }
        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            if (this.setT) {
                this.setT = null;
            }
            this._btnClip.visible = false;
            this._btnClip.stop();
        }
    }
}