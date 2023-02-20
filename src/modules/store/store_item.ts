///<reference path="../vip/vip_model.ts"/>
namespace modules.store {
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;

    import Event = laya.events.Event;
    import mallFields = Configuration.mallFields;
    import idCountFields = Configuration.idCountFields;
    import Item = Protocols.Item;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import PlayerModel = modules.player.PlayerModel;
    import MallNodeFields = Protocols.MallNodeFields;
    import BuyMallItemReplyFields = Protocols.BuyMallItemReplyFields;
    import MallNode = Protocols.MallNode;
    import Box = laya.ui.Box;
    import BagModel = modules.bag.BagModel;
    import VipModel = modules.vip.VipModel;
    import Handler = laya.utils.Handler;
    import BagUtil = modules.bag.BagUtil;
    import CommonUtil = modules.common.CommonUtil;
    import CustomClip = modules.common.CustomClip;

    export class StoreItem extends ui.StoreItemUI {
        private itemCfg: any;
        private _id: number;
        private _limitCount: number;
        private _nowCount: number;
        private _pos: Array<any>;
        private _boxArr: Array<Box>;
        private _posCount: number;//价格条数
        private _btnClip: CustomClip;

        public destroy(destroyChild: boolean = true): void {
            this._btnClip = this.destroyElement(this._btnClip);
            this._boxArr = this.destroyElement(this._boxArr);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            // this._pos = [[65], [46, 69], [18, 46, 74]];
            this._pos = [[60], [35, 70], [13, 41, 69]];
            this._boxArr = [this.limit, this.price, this.nowPrice];

            this.zeKouHTml.color = "#ffffff";
            this.zeKouHTml.style.fontFamily = "SimHei";
            this.zeKouHTml.style.fontSize = 25;
            this.zeKouHTml.style.align = "center";
            this.zeKouHTml.style.strokeColor = "#610101";
            this.zeKouHTml.style.stroke = 3;
            this.zeKouHTml.style.valign = "middle";
        }

        protected setData(value: any): void {
            super.setData(value);
            this.zeKouHTml.visible = this.zeKouImg.visible = false;
            this._posCount = 0;
            this.vipBox.visible = false;
            this.itemCfg = value;
            let itemId = this.itemCfg[mallFields.itemId];
            this._id = this.itemCfg[mallFields.id];
            let count = this.itemCfg[mallFields.count];
            let item: Item = [itemId, count, 0, null];
            let oprice = this.itemCfg[mallFields.originalPrice];
            let nprice = this.itemCfg[mallFields.realityPrice];
            let limitBuy = this.itemCfg[mallFields.limitBuy];
            let itemVip = this.itemCfg[mallFields.vip];
            let discountBgId = this.itemCfg[mallFields.discountBgId];
            let propCfg: Configuration.item_material = ItemMaterialCfg.instance.getItemCfgById(itemId);
            if (propCfg) {
                let isPiece: boolean = propCfg[Configuration.item_materialFields.isPiece] === 1;
                this.item.pieceImg.x = isPiece ? 66 : 4;
            }
            this.item.dataSource = item;

            this.itemName.color = CommonUtil.getColorById(itemId);
            this.itemName.text = this.item._nameTxt.text;

            this.puchaseBtn.visible = true;

            let itemType: number = CommonUtil.getItemTypeById(nprice[idCountFields.id]);
            if (itemType == ItemMType.Unreal) {
                this.nowPriceImg.skin = this.priceImg.skin = CommonUtil.getIconById(nprice[idCountFields.id], true);
            } else {
                this.nowPriceImg.skin = this.priceImg.skin = CommonUtil.getIconById(nprice[idCountFields.id], false);
            }
            if (oprice.length > 0) {
                this.price.visible = true;
                this.zeKouHTml.visible = this.zeKouImg.visible = true;
                this._posCount++;
                this.priceTxt.text = CommonUtil.bigNumToString(oprice[idCountFields.count]);
                // this.discountImg.skin = `assets/icon/ui/mall/${this.itemCfg[mallFields.desId]}.png`;

                if (discountBgId == 1) {
                    this.zeKouImg.skin = `common/image_common_hongbq.png`;
                } else if (discountBgId == 2) {
                    this.zeKouImg.skin = `common/image_common_hbq.png`;
                } else {
                    this.zeKouImg.skin = `common/image_common_hongbq.png`;
                }
                let desIdNum = Math.round(this.itemCfg[mallFields.desId]);
                this.zeKouHTml.innerHTML = `${desIdNum}<span style='color:#ffffff;font-size: 22px'>折</span>`;

                this.underLine.width = this.priceImg.width + this.priceTxt.width;
            } else {
                this.price.visible = false;
                this.zeKouHTml.visible = this.zeKouImg.visible = false;
            }
            this.nowPriceTxt.text = CommonUtil.bigNumToString(nprice[idCountFields.count]);
            if (nprice[idCountFields.count] == 0) {
                this.zeKouHTml.visible = this.zeKouImg.visible = true;
                this.zeKouImg.skin = `common/image_common_hbq.png`;
                this.zeKouHTml.innerHTML = `免费`;
                this.puchaseBtn.label = `免费`;
                this.puchaseBtn.labelColors = "#ffffff";
                this.puchaseBtn.skin = "common/btn_common_an03.png";
                this.effectInit();
            }
            //判断数量
            this._limitCount = limitBuy[idCountFields.count];
            let limit = StoreModel.instance.getLimitById(this._id);
            if (limit != null) {
                this._nowCount = limit[MallNodeFields.limitCount];
            } else {
                this._nowCount = 0;
            }
            if (limitBuy[idCountFields.id] > 0) {
                if (limitBuy[idCountFields.id] == 2) {
                    this.limitTxt.text = "本周限购:";
                } else {
                    this.limitTxt.text = "每日限购:";
                }
                this.limit.visible = true;
                this._posCount++;
                if (limit != null) {
                    this.limitCount.text = this._nowCount + "/" + this._limitCount;
                    if (this._nowCount >= this._limitCount) {
                        this.limitCount.color = "#E6372E";
                        this.puchaseBtn.visible = false;
                        this.maxCountTxt.visible = true;
                        if (this._btnClip) {
                            this._btnClip.visible = false;
                        }

                    } else {
                        this.limitCount.color = "#00AD35";
                        this.maxCountTxt.visible = false;
                    }
                } else {
                    this.limitCount.text = 0 + "/" + limitBuy[idCountFields.count];
                    this.limitCount.color = "#00AD35";
                    this.maxCountTxt.visible = false;
                }
            } else {
                this.limit.visible = false;
            }

            //vip
            let vip = VipModel.instance.vipLevel;
            if (itemVip > vip) {
                this.vipLv.text = `SVIP${itemVip}专享`;
                // this.vipLvImg.width = this.vipLv.textWidth + 32;
                this.vipBox.visible = true;
                this.puchaseBtn.visible = false;
            } else {
                this.vipBox.visible = false;
            }

            this.setPos();
        }

        private setPos(): void {
            let num = 0;
            for (let i = 0; i < this._boxArr.length; i++) {
                if (this._boxArr[i].visible == true) {
                    this._boxArr[i].x = 122;
                    this._boxArr[i].y = this._pos[this._posCount][num];
                    if (num <= this._posCount) {
                        num++;
                    }
                }
            }
        }

        protected onOpened(): void {
            super.onOpened()
        }

        public close(): void {
            super.close();
        }

        protected addListeners(): void {
            super.addListeners();

            this.puchaseBtn.on(Event.CLICK, this, this.puchaseHandler);
            GlobalData.dispatcher.on(CommonEventType.UPDATE_MALLINFO, this, this.updateMallHandler);
            GlobalData.dispatcher.on(CommonEventType.PURCHASE_REPLY, this, this.puchaseReply);
            GlobalData.dispatcher.on(CommonEventType.VIP_UPDATE, this, this.updateVip);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.puchaseBtn.off(Event.CLICK, this, this.puchaseHandler);
            GlobalData.dispatcher.off(CommonEventType.UPDATE_MALLINFO, this, this.updateMallHandler);
            GlobalData.dispatcher.off(CommonEventType.PURCHASE_REPLY, this, this.puchaseReply);
            GlobalData.dispatcher.off(CommonEventType.VIP_UPDATE, this, this.updateVip);

        }

        private puchaseHandler() {
            let shortCut = this.itemCfg[mallFields.shortcut];
            let nprice = this.itemCfg[mallFields.realityPrice];
            let costId = nprice[idCountFields.id];
            /*if(this._nowCount>=this._limitCount&&this._nowCount!=0){
                SystemNoticeManager.instance.addNotice(limitBuy[idCountFields.id] == 2?"本周购买数量已达上限":"今日购买数量已达上限", true);
                return ;
            }*/
            let num = PlayerModel.instance.getCurrencyById(costId);
            if (num == null) {
                num = BagModel.instance.getItemCountById(costId);
            }
            if (num >= nprice[idCountFields.count]) {
                if (shortCut == 0) {
                    let count = this._limitCount - this._nowCount;//剩余可购买数
                    WindowManager.instance.openDialog(WindowEnum.STORE_ALERT, [this.itemCfg, count]);
                } else {
                    Channel.instance.publish(UserFeatureOpcode.BuyMallItem, [this.itemCfg[mallFields.id], 1]);
                }
            } else {

                if (costId == MoneyItemId.glod) {
                    CommonUtil.goldNotEnoughAlert();
                } else {
                    BagUtil.openLackPropAlert(costId, 1);
                }
            }
        }

        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
        }


        private puchaseReply() {
            let reply = StoreModel.instance.PurchaseReply;
            let id = reply[BuyMallItemReplyFields.id];
            let limit = reply[BuyMallItemReplyFields.limitCount];
            if (id == this._id) {
                let node: MallNode = [id, limit];
                this.changeLimit(node);
            }
        }

        private updateMallHandler() {
            let limit = StoreModel.instance.getLimitById(this._id);
            if (limit != null) {
                this.changeLimit(limit);
            }
        }

        private updateVip() {
            let vip = VipModel.instance.vipLevel;
            let itemVip = this.itemCfg[mallFields.vip];
            if (itemVip > vip) {
                this.vipLv.text = `SVIP${itemVip}专享`;
                // this.vipLvImg.width = this.vipLv.textWidth + 32;
                this.vipBox.visible = true;
                this.puchaseBtn.visible = false;
            } else {
                this.vipBox.visible = false;
                this.puchaseBtn.visible = true;
            }
        }

        private changeLimit(limit: MallNode) {
            this._nowCount = limit[MallNodeFields.limitCount];
            if (limit != null) {
                this.limitCount.text = this._nowCount + "/" + this._limitCount;
                if (this._nowCount >= this._limitCount) {
                    this.limitCount.color = "#E6372E";
                    this.puchaseBtn.visible = false;
                    this.maxCountTxt.visible = true;
                    if (this._btnClip) {
                        this._btnClip.visible = false;
                    }

                } else {
                    this.limitCount.color = "#00AD35";
                    this.puchaseBtn.visible = true;
                    this.maxCountTxt.visible = false;
                }
            }
        }

        private effectInit(): void {
            if (this._btnClip) { this._btnClip.play(); return; }
            this._btnClip = new CustomClip();
            this.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.loop = true;
            this._btnClip.scale(0.6, 0.7);
            this._btnClip.play();
            this._btnClip.pos(this.puchaseBtn.x - 5, this.puchaseBtn.y - 10);
        }
    }
}