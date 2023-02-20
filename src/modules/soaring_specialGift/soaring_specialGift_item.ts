///<reference path="../config/soaring_specialGift_fs.ts"/>
/**
 * 特惠礼包 （封神榜）
 */
namespace modules.soaring_specialGift {
    import BaseItem = modules.bag.BaseItem;
    import Event = Laya.Event;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import BagUtil = modules.bag.BagUtil;
    import Item = Protocols.Item;
    import Items = Configuration.Items;
    import discount_gift_fs = Configuration.discount_gift_fs;
    import discount_gift_fsFields = Configuration.discount_gift_fsFields;
    import DiscountGiftFSNodeFields = Protocols.DiscountGiftFSNodeFields;
    import BagModel = modules.bag.BagModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class SoaringSpecialGiftItem extends ui.SoaringSpecialGiftItemUI {
        private _taskBase: Array<BaseItem>;
        private _btnClip: CustomClip;//按钮特效
        private _Datas: discount_gift_fs;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._taskBase = [this.continueBase1, this.continueBase2];

            this.CanBuyHTML.color = "#00ad35";
            this.CanBuyHTML.style.fontFamily = "SimHei";
            this.CanBuyHTML.style.fontSize = 26;
            this.CanBuyHTML.style.align = "center";

            this.zeKouHTml.color = "#ffffff";
            this.zeKouHTml.style.fontFamily = "SimHei";
            this.zeKouHTml.style.fontSize = 25;
            this.zeKouHTml.style.align = "center";
            this.zeKouHTml.style.strokeColor = "#610101";
            this.zeKouHTml.style.stroke = 3;
            this.zeKouHTml.style.valign = "middle";
            this.creatEffect();
        }

        protected addListeners(): void {
            super.addListeners();
            this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
            //这里绑定 更新 事件
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_SPECIALGIFT_UPDATE, this, this.showUI);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.sureBtn.off(Event.CLICK, this, this.sureBtnHandler);
        }

        public onOpened(): void {
            super.onOpened();
        }

        protected setData(value: discount_gift_fs): void {
            super.setData(value);
            this._Datas = value;
            this.showUI();
        }

        public sureBtnHandler() {
            let shuju = this._Datas;
            let state = 0;
            let vip = this._Datas[discount_gift_fsFields.vip];
            if (vip.length > 1) { //有vip等级限制
                let vipsByOpenDay = new Array<number>();
                vipsByOpenDay = this.getListTheVips(vip);
                let vipNum = modules.vip.VipModel.instance.vipLevel;
                let openDay = modules.player.PlayerModel.instance.openDay;
                let dengJi = vipsByOpenDay[openDay];
                dengJi = dengJi ? dengJi : vipsByOpenDay[vipsByOpenDay.length - 1];//取不到就说明大于最大显示天数 取最后一个限制
                if (vipNum >= dengJi) {
                    this.isCion();
                } else {
                    CommonUtil.alert('温馨提示', 'SVIP等级不足，是否前往提升SVIP？', [Handler.create(this, this.openVip)]);
                }
            } else {
                this.isCion();
            }
        }

        public isCion() {
            let num = PlayerModel.instance.getCurrencyById(MoneyItemId.glod);
            if (num == null) {
                num = BagModel.instance.getItemCountById(MoneyItemId.glod);
            }
            let price = this._Datas[discount_gift_fsFields.price];
            if (num >= price) {
                let items: Array<Item> = [];
                let rewards = this._Datas[discount_gift_fsFields.reward];
                if (rewards) {
                    for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                        let item: Items = rewards[i];
                        items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                    }
                    //通过传入需要领取的道具判断有没有背包满了
                    if (BagUtil.canAddItemsByBagIdCount(items)) {
                        //钱够  发送购买请求
                        let id = this._Datas[discount_gift_fsFields.id];
                        SoaringSpecialGiftCtrl.instance.BuyDiscountGiftFS(id);
                    }
                }
            } else {
                CommonUtil.goldNotEnoughAlert();
            }
        }

        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
        }

        private openVip(): void {
            if (modules.vip.VipModel.instance.vipLevel >= 1) {
                WindowManager.instance.open(WindowEnum.VIP_PANEL);
            }
            else {
                WindowManager.instance.open(WindowEnum.VIP_NEW_PANEL);
            }
        }


        public showUI() {
            let shuju = this._Datas;
            let rewards = shuju[discount_gift_fsFields.reward];
            for (var index = 0; index < this._taskBase.length; index++) {
                let element = this._taskBase[index];
                element.visible = false;
            }
            for (var index = 0; index < rewards.length; index++) {
                let element = rewards[index];
                let _taskBase: BaseItem = this._taskBase[index];
                if (_taskBase) {
                    _taskBase.dataSource = [rewards[index][ItemsFields.itemId], rewards[index][ItemsFields.count], 0, null];
                    _taskBase.visible = true;
                }
            }
            this.setBtnSure();
            this.showCanBuyHTML();
            this.showZeKou();
            RedPointCtrl.instance.setRPProperty("soaringSpecialGiftRP", false);
        }


        /**
         * 显示可领取次数 进度
         */
        public showCanBuyHTML() {
            let shuju = this._Datas;
            let state = 0;
            let useCount = 0;
            let _DiscountGiftFSNode = SoaringSpecialGiftModel.instance.rewardList[shuju[discount_gift_fsFields.id]];
            if (_DiscountGiftFSNode) {
                useCount = _DiscountGiftFSNode[DiscountGiftFSNodeFields.count];//已领数量
            }
            let condition = shuju[discount_gift_fsFields.count];
            let param = condition - useCount;
            let str = `${param}/${condition}`;
            this.CanBuyHTML.visible = (condition > 1);
            if (param > 0) {
                this.CanBuyHTML.innerHTML = `可购买:<span style='color:#16ba17'>${str}</span>`;
            } else {
                this.CanBuyHTML.innerHTML = `可购买:<span style='color:#FF3e3e'>${str}</span>`;
            }
        }

        public showZeKou() {
            let price = this._Datas[discount_gift_fsFields.price];
            let vip = this._Datas[discount_gift_fsFields.vip];
            let discount = this._Datas[discount_gift_fsFields.discount];
            let originalPrice = this._Datas[discount_gift_fsFields.originalPrice];
            let limitId = this._Datas[discount_gift_fsFields.limitId];
            let discountBgId = this._Datas[discount_gift_fsFields.discountBgId];
            if (discountBgId == 1) {
                this.zeKouImg.skin = `common/image_common_hongbq.png`;
            } else if (discountBgId == 2) {
                this.zeKouImg.skin = `common/image_common_hbq.png`;
            } else {
                this.zeKouImg.skin = `common/image_common_hongbq.png`;
            }
            let desIdNum = Math.round(discount);
            this.zeKouHTml.innerHTML = `${desIdNum}<span style='color:#ffffff;font-size: 22px'>折</span>`;
            if (vip.length > 1) {
                this.limitImg.visible = false;
                this.VipLimitBox.visible = true;
                let vipsByOpenDay = new Array<number>();
                vipsByOpenDay = this.getListTheVips(vip);
                let vipNum = modules.vip.VipModel.instance.vipLevel;
                let openDay = modules.player.PlayerModel.instance.openDay;
                let dengJi = vipsByOpenDay[openDay];
                dengJi = dengJi ? dengJi : vipsByOpenDay[vipsByOpenDay.length - 1];//取不到就说明大于最大显示天数 取最后一个限制
                this.VipLimitClip.value = `${dengJi}`;
                if (this._btnClip) {
                    this._btnClip.play();
                    this._btnClip.visible = true;
                }
                // this.Img1.x = this.VipLimitClip.x + this.VipLimitClip.clipWidth;
            } else {
                if (limitId != 0) {
                    this.limitImg.visible = true;
                    this.VipLimitBox.visible = false;
                    this.limitImg.skin = `soaringActivity/limitImg${limitId}.png`;
                } else {
                    this.limitImg.visible = false;
                    this.VipLimitBox.visible = false;
                }
            }
            this.originalPriceText.text = `${originalPrice}`;
            this.originalPriceRedImg.width = this.originalPriceText.width + 40;
            this.nowPriceText.text = `${price}`;
        }
        /**
         *  根据配置 分配对应天数应取的svip等级
         */
        public getListTheVips(vip: Array<number>): Array<number> {
            let vipsByOpenDay = new Array<number>();
            for (let index = 0; index < vip.length; index += 2) {
                // if ((index / 2 != 0)) {//奇数的才是天数
                let minLv = vip[index];//最小天数
                let vipLv = vip[index + 1];//vip等级
                let maxLv = vip[index + 2];//最大天数
                if (minLv && vipLv) {
                    maxLv = maxLv ? maxLv : minLv + 1;//如果最大等级取不到了 （这个等级之后 都去最后一个数值）
                    for (let i = minLv; i < maxLv; i++) {
                        vipsByOpenDay[i] = vipLv;
                    }
                }
                // }
            }
            return vipsByOpenDay;
        }
        public setBtnSure() {
            if (this._btnClip) {
                this._btnClip.stop();
                this._btnClip.visible = false;
            }
            let shuju = this._Datas;
            let state = 0;
            let _DiscountGiftFSNode = SoaringSpecialGiftModel.instance.rewardList[shuju[discount_gift_fsFields.id]];
            // if (_DiscountGiftFSNode) {
            state = SoaringSpecialGiftModel.instance.getState(_DiscountGiftFSNode);
            // }
            let endFlag = SoaringSpecialGiftModel.instance.endFlag;
            if (endFlag == 0) {
                // this.sureBtn.skin = "common/btn_tongyong_6.png";
                // this.sureBtn.labelColors = "#9d5119,#9d5119,#9d5119,#9d5119";
                this.sureBtn.label = "购买";
                this.sureBtn.visible = true;
                this.maxCeilingText.visible = false;
                this.overImg.visible = false;
                if (state == 0) {
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                } else if (state == 1) {
                    // this._btnClip.play();
                    // this._btnClip.visible = true;
                } else {
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                    this.sureBtn.visible = false;
                    this.maxCeilingText.visible = true;
                    this.overImg.visible = false;
                    this.maxCeilingText.text = "已达上限";
                }
            } else {
                this._btnClip.stop();
                this._btnClip.visible = false;
                this.sureBtn.visible = false;
                this.maxCeilingText.visible = false;
                this.overImg.visible = true;
            }
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy(destroyChild);
        }

        public close(): void {
            super.close();
        }

        /**
         * 初始化 按钮特效
         */
        private creatEffect(): void {
            this._btnClip = new CustomClip();
            this.sureBtn.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.play();
            this._btnClip.loop = true;
            this._btnClip.pos(-6, -16, true);
            this._btnClip.scale(0.98, 1);
            this._btnClip.visible = false;
        }
    }
}
