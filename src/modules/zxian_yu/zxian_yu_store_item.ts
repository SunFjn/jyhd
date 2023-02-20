///<reference path="../common/common_util.ts"/>
///<reference path="../common_alert/equip_wear_alert.ts"/>
///<reference path="../common_alert/prop_use_alert.ts"/>
/// <reference path="../config/yu_ge_cfg.ts" />
namespace modules.zxian_yu {
    import BaseItem = modules.bag.BaseItem;
    import Image = laya.ui.Image;
    import Item = Protocols.Item;
    import Pair = Protocols.Pair;
    import PairFields = Protocols.PairFields;
    import yuGeCfg = modules.config.yuGeCfg;
    import yuge = Configuration.yuge;
    import yugeFields = Configuration.yugeFields;
    import Event = laya.events.Event;
    import CustomClip = modules.common.CustomClip;
    import BagUtil = modules.bag.BagUtil;
    export class ZXianYuStoreItem extends ui.ZXianYuStoreItemUI {

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
                let shuju = yuGeCfg.instance.getCfgById(id);
                let dateItem = shuju[yugeFields.goods];
                let item: Item = [dateItem[0], dateItem[1], 0, null];
                this.item.dataSource = item;
                let originalPrice = shuju[yugeFields.originalPrice];
                let price = shuju[yugeFields.price];
                let desId = shuju[yugeFields.desId];
                let discountBgId = shuju[yugeFields.discountBgId];
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
                this.itemName.color = CommonUtil.getColorById(dateItem[0]);
                this.itemName.text = this.item._nameTxt.text;
                this.underLine.width = this.priceImg.width + this.priceTxt.width;
                this.maxCountTxt.visible = state == 1;
                this.puchaseBtn.visible = state != 1;
                if (state == 1) {
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                }
                else {
                    if (ZXianYuModel.instance.xianyu >= price) {
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
                let shuju = yuGeCfg.instance.getCfgById(id);
                let dateItem = shuju[yugeFields.goods];
                let originalPrice = shuju[yugeFields.originalPrice];
                let price = shuju[yugeFields.price];
                let desId = shuju[yugeFields.desId];
                let discountBgId = shuju[yugeFields.discountBgId];
                if (state == 1) {
                    modules.notice.SystemNoticeManager.instance.addNotice(`此商品购买已达上限`, true);
                    return
                }
                if (ZXianYuModel.instance.xianyu >= price) {
                    let items: Array<Item> = [];
                    let rewards = [dateItem[0]];
                    items.push([dateItem[0], 1, 0, null]);
                    //通过传入需要领取的道具判断有没有背包满了
                    if (BagUtil.canAddItemsByBagIdCount(items)) {
                        //钱够  发送购买请求
                        ZXianYuCtrl.instance.BuyYuGeGoods(id);
                    }

                } else {
                    BagUtil.openLackPropAlert(modules.zxian_yu.ZXianYuModel.instance.id, 1);
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