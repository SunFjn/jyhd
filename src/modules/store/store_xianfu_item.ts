///<reference path="../common/common_util.ts"/>
///<reference path="../common_alert/equip_wear_alert.ts"/>
///<reference path="../common_alert/prop_use_alert.ts"/>
/// <reference path="../config/xianfu_mall2_cfg.ts" />
namespace modules.store {
    import BaseItem = modules.bag.BaseItem;
    import Image = laya.ui.Image;
    import Item = Protocols.Item;
    import Pair = Protocols.Pair;
    import PairFields = Protocols.PairFields;
    import XianFuMallCfg = modules.config.XianFuMallCfg;
    import xianfu_mall2 = Configuration.xianfu_mall2;
    import xianfu_mall2Fields = Configuration.xianfu_mall2Fields;
    import Event = laya.events.Event;
    import CustomClip = modules.common.CustomClip;
    import BagUtil = modules.bag.BagUtil;
    export class XianFuShopItem extends ui.XianFuShopItemUI {

        public _select: boolean;
        public _itemId: number;
        private _selectImg: Image;
        public _cfg: Pair;
        private _btnClip: CustomClip;//按钮特效
        constructor() {
            super();

        }

        protected initialize(): void {
            super.initialize();
            this.creatEffect();
            this.zeKouHTml.color = "#ffffff";
            this.zeKouHTml.style.fontFamily = "SimHei";
            this.zeKouHTml.style.fontSize = 25;
            this.zeKouHTml.style.align = "center";
            this.zeKouHTml.style.strokeColor = "#610101";
            this.zeKouHTml.style.stroke = 3;
            this.zeKouHTml.style.valign = "middle";
            this.item.nameVisible = false
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.puchaseBtn, Event.CLICK, this, this.puchaseBtnHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        protected setData(date: Pair): void {
            super.setData(date);
            // this.zeKouHTml.visible = this.zeKouImg.visible = false;
            if (date) {
                /*玉阁商品id:状态 0：未购买，1已购买*/
                this._cfg = date;
                let id = this._cfg[0];
                let state = this._cfg[1];
                let shuju = XianFuMallCfg.instance.getCfgById(id);
                let dateItem = shuju[xianfu_mall2Fields.goods];
                let item: Item = [dateItem[0], dateItem[1], 0, null];
                this.item.dataSource = item;
                let originalPrice = shuju[xianfu_mall2Fields.originalPrice];
                let price = shuju[xianfu_mall2Fields.price][1];
                let huoBiId = shuju[xianfu_mall2Fields.price][0];
                let desId = shuju[xianfu_mall2Fields.desId];
                let discountBgId = shuju[xianfu_mall2Fields.discountBgId];
                this.priceTxt.text = `${originalPrice}`;
                this.nowPriceTxt.text = `${price}`;
                let desIdNum = Math.round(desId);
                this.zeKouHTml.innerHTML = `${desIdNum}<span style='color:#ffffff;font-size: 22p'>折</span>`;
                if (discountBgId == 1) {
                    this.zeKouImg.skin = `common/image_common_hongbq.png`;
                } else if (discountBgId == 2) {
                    this.zeKouImg.skin = `common/image_common_hbq.png`;
                } else {
                    this.zeKouImg.skin = `common/image_common_hongbq.png`;
                }
                if (huoBiId == 91930001) {//财富
                    this.nowPriceImg.skin = this.priceImg.skin = `common/icon_tongyong_caifu.png`;
                }
                else if (huoBiId == 90140001) {//代币券
                    this.nowPriceImg.skin = this.priceImg.skin = `common/icon_tongyong_2.png`;
                }
                // this.itemName.color = CommonUtil.getColorById(dateItem[0]);
                // this.itemName.text = this.item._nameTxt.text;
                this.underLine.width = this.priceImg.width + this.priceTxt.width;
                this.maxCountTxt.visible = state == 1;
                this.puchaseBtn.visible = state != 1;
                if (state == 1) {
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                }
                else {
                    if (modules.xianfu.XianfuModel.instance.treasureInfos(1) >= price) {
                        // this._btnClip.play();
                        // this._btnClip.visible = true;
                    }
                    else {
                        this._btnClip.stop();
                        this._btnClip.visible = false;
                    }
                }
            }
        }

        protected puchaseBtnHandler(): void {
            if (this._cfg) {
                let id = this._cfg[0];
                let state = this._cfg[1];
                let shuju = XianFuMallCfg.instance.getCfgById(id);
                let dateItem = shuju[xianfu_mall2Fields.goods];
                let originalPrice = shuju[xianfu_mall2Fields.originalPrice];
                let price = shuju[xianfu_mall2Fields.price][1];
                let huoBiId = shuju[xianfu_mall2Fields.price][0];
                let desId = shuju[xianfu_mall2Fields.desId];
                let discountBgId = shuju[xianfu_mall2Fields.discountBgId];

                let bolll = false;
                if (state == 1) {
                    modules.notice.SystemNoticeManager.instance.addNotice(`此商品购买已达上限`, true);
                    return
                }
                if (huoBiId == 91930001) {//财富
                    if (modules.xianfu.XianfuModel.instance.treasureInfos(1) >= price) {
                        let items: Array<Item> = [];
                        let rewards = [dateItem[0]];
                        items.push([dateItem[0], 1, 0, null]);
                        //通过传入需要领取的道具判断有没有背包满了
                        if (BagUtil.canAddItemsByBagIdCount(items)) {
                            //钱够  发送购买请求
                            StoreCtrl.instance.BuyYuGeGoods(id);
                        }
                    } else {
                        BagUtil.openLackPropAlert(91930001, 1);
                    }
                }
                else if (huoBiId == 90140001) {//代币券
                    if (modules.player.PlayerModel.instance.ingot >= price) {
                        let items: Array<Item> = [];
                        let rewards = [dateItem[0]];
                        items.push([dateItem[0], 1, 0, null]);
                        //通过传入需要领取的道具判断有没有背包满了
                        if (BagUtil.canAddItemsByBagIdCount(items)) {
                            //钱够  发送购买请求
                            StoreCtrl.instance.BuyYuGeGoods(id);
                        }
                    } else {
                        CommonUtil.goldNotEnoughAlert();
                    }
                }


            }
        }
        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
        }
        private creatEffect(): void {
            this._btnClip = new CustomClip();
            this.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.play();
            this._btnClip.loop = true;
            // this._btnClip.pos(-6, -8, true);
            this._btnClip.scale(0.6, 0.6);
            this._btnClip.visible = false;
            this._btnClip.pos(this.puchaseBtn.x, this.puchaseBtn.y - 5);
        }
        public destroy(): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy(true);
        }
    }
}