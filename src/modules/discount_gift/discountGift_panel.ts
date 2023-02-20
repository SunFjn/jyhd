///<reference path="../config/discount_gift_cfg.ts"/>

/**特惠礼包面板*/
namespace modules.discountGift {
    import Event = Laya.Event;
    import Item = Protocols.Item;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import Text = Laya.Text;
    import Image = Laya.Image;

    import PrivilegeNodeFields = Configuration.PrivilegeNodeFields;
    import PrivilegeCfg = modules.config.PrivilegeCfg;
    import VipModel = modules.vip.VipModel;
    //服务器数据 配置文件类型引用
    //需要的模块
    import DiscountGiftCfg = modules.config.DiscountGiftCfg;

    import BaseItem = modules.bag.BaseItem;
    import BagUtil = modules.bag.BagUtil;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class discountGiftPanel extends ui.DiscountGiftViewUI {

        //==============================================字段===========================//
        /**所有物品显示 */
        private _allItem: Array<BaseItem>;
        /**所有显示的道具*/
        private _itemArr: Array<Item> = new Array<Item>();
        /**显示配置表中达到每个折扣的购买次数 */
        private _allZhekouText: Array<Text>;
        /**每个折扣对应的折扣数图片*/
        private _allZhekouImage: Array<Image>;
        /**购买需要的代币券数量*/
        private needYuanbaoNum: number;
        /**定时器对应的时间戳 */
        private _activityTime: number = 0;
        /**当前折扣 */
        private _zhekou: number = 0;
        /**下一个折扣 */
        private _nextZhekou: number = 0;
        /** 上一次是否有数据*/
        private preIsValue: boolean = false;
        private _vipLevel: number;
        private _type: number;
        private _minLv: number;
        private _maxLv: number;
        /**下一个可提升购买数的VIP */
        private _nextVipLevel: number;
        /**当前VIP最大购买次数*/
        private maxCount: number;
        /**类型最大购买次数*/
        private typeMaxCount: number;
        /**当前已经购买次数*/
        private curCount: number;
        //private isLastImgBig:boolean=false;
        //==============================================字段=============================//

        //===============================================生命周期=============================//

        public destroy(destroyChild: boolean = true): void {
            // if (this._allItem) {
            //     for (let index = 0; index < this._allItem.length; index++) {
            //         let element = this._allItem[index];
            //         element.removeSelf();
            //         element.destroy();
            //         element = null;
            //     }
            //     this._allItem.length = 0;
            //     this._allItem = null;
            // }
            super.destroy(destroyChild);
        }


        constructor() {
            super();
            if (discountGiftModel.instance.type) {
                let a: Array<Items> = DiscountGiftCfg.instance.getGifts(discountGiftModel.instance.type, discountGiftModel.instance.ID);
                if (a.length > 0) {
                    this.preIsValue = true;
                }
            }
        }

        protected initialize(): void {
            super.initialize();
            this._allItem = [this.discountItem1, this.discountItem2, this.discountItem3, this.discountItem4, this.discountItem5, this.discountItem6];
            this._allZhekouText = new Array<Text>();
            this._allZhekouText = [this.z0, this.z1, this.z2, this.z3, this.z4];
            this._allZhekouImage = new Array<Image>();
            this._allZhekouImage = [this.zhekouImg0, this.zhekouImg1, this.zhekouImg2, this.zhekouImg3, this.zhekouImg4];

            this.centerX = 0;
            this.centerY = 0;

            this.buyVipHtml.color = "#ffec7c";
            this.curbuyHtml.color = "#ffffff";
            this.buyVipHtml.style.fontFamily = "SimHei";
            this.curbuyHtml.style.fontFamily = "SimHei";
            this.buyVipHtml.style.fontSize = 24;
            this.curbuyHtml.style.fontSize = 24;
            this.buyVipHtml.style.align = "left";
            this.buyVipHtml.style.valign = "center";
            this.curbuyHtml.style.align = "center";
            this.curbuyHtml.style.valign = "center";
            this.buyVipHtml.mouseEnabled = false;
            this.curbuyHtml.mouseEnabled = false;

            this.initDaoju();
        }

        protected addListeners(): void {
            super.addListeners();
            this.sureBtn.on(Event.CLICK, this, this.BuyItem);
            //MVC通信事件
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DISCOUNT_GIFT_UPDATE, this, this.discountGift_Update);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DISCOUNT_GIFT_UPDATE, this, this.discountGift_Timer);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DISCOUNT_GIFT_TIMER, this, this.discountGift_Timer);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.sureBtn.off(Event.CLICK, this, this.BuyItem);
            Laya.timer.clear(this, this.activityHandler);
        }

        protected onOpened(): void {
            super.onOpened();
            //this.isLastImgBig=false;
            this.SetPanel();
            this.discountGift_Update();
            this.discountGift_Timer();
        }

        //================================================生命周期=============================//


        /**购买道具 */
        private BuyItem(): void {
            // console.log("购买道具");

            /**1是否还有购买次数，2代币券是否足够 3背包是否满了 */
            let cur_yuanbaoNum: number = PlayerModel.instance.ingot;  //玩家代币券数
            // console.log("最大购买次数：" + discountGiftModel.instance.maxCount + "当前已经购买次数：" + discountGiftModel.instance.curCount);
            // console.log("当前玩家代币券：" + cur_yuanbaoNum + "购买需要代币券：" + this.needYuanbaoNum);
            // console.log("背包是否满了" + BagUtil.canAddItemsByBagIdCount(this._itemArr) + "this._itemarr" + this._itemArr);
            if (!(discountGiftModel.instance.maxCount > discountGiftModel.instance.curCount)) {
                if (this.curCount == this.typeMaxCount) {
                    this.sureBtn.visible = false;
                    SystemNoticeManager.instance.addNotice("当前购买次数已达上限。", true);
                } else {
                    SystemNoticeManager.instance.addNotice("当前购买数量已达上限，提升SVIP等级可增加购买数量", true);
                }
                return;
            } else if (!(cur_yuanbaoNum >= this.needYuanbaoNum)) {
                // SystemNoticeManager.instance.addNotice("代币券数量不足", true);
                CommonUtil.goldNotEnoughAlert();
                return;
            }
            //通过传入需要领取的道具判断有没有背包满了
            else if (!(BagUtil.canAddItemsByBagIdCount(this._itemArr))) {
                return;
            }
            DiscountGiftCtrl.instance.DiscountGiftBuy();
            //刷新页面
        }

        /**向服务器发送初始化面板 */
        private SetPanel(): void {
            DiscountGiftCtrl.instance.GetDiscountGiftInfo();
        }

        //================================================刷新显示面板============================//
        /**当当天活动关闭时*/
        undisPanels() {
            /*            this.buyTextPre.text='';
                        this.buyVipTextImg.visible=false;
                        this.buyTextImg.visible=false;
                          for (let i: int = 0, len = this._allItem.length; i < len; i++) {
                            this._allItem[i].visible = false;           
                        }
                         for (let i: int = 0, len = this._allZhekouImage.length; i < len; i++) {
                            this._allZhekouImage[i].visible = false;           
                        }
                        this.redlineImg.visible=false;
                        //this.activityText.visible=false;
                        this.activityTextPre.visible=false;
                        this.progressImage.visible=false;
                        this.progressImageBg.visible=false;
                        //唯一一个改为True的地方
                        this.activityTextOver.visible=true;*/
            Laya.timer.clear(this, this.activityHandler);
        }

        /**当当天活动开启时*/
        disPanels() {
            this.buyVipTextImg.visible = true;
            this.buyTextImg.visible = true;
            for (let i: int = 0, len = this._allItem.length; i < len; i++) {
                this._allItem[i].visible = false;
            }
            for (let i: int = 0, len = this._allZhekouImage.length; i < len; i++) {
                this._allZhekouImage[i].visible = true;
            }
            this.redlineImg.visible = true;
            this.activityText.visible = true;
            this.activityTextPre.visible = true;
            this.progressImage.visible = true;
            this.progressImageBg.visible = true;
            //唯一一个改为false的地方
            this.activityTextOver.visible = false;
        }

        /**刷新显示面板 */
        discountGift_Update() {
            //先判断是否活动时开启的，0未开启，2已经关闭
            if (discountGiftModel.instance.discountGiftState !== 1) {
                this.undisPanels();
                if (discountGiftModel.instance.discountGiftState == 0) {
                    SystemNoticeManager.instance.addNotice("当前活动未开启", true);
                    this.close();
                }
                if (discountGiftModel.instance.discountGiftState == 2) {
                    SystemNoticeManager.instance.addNotice("当前活动已结束", true);
                    return;
                    /*                    if (this.preIsValue == true) {
                                            //到底close不close看策划
                                            //this.close();
                                            return;
                                        }*/
                    // this.close();
                }
                /*                if (this.preIsValue==false) {
                                    this.close();
                                    return;
                                }*/

            }

            this.disPanels();
            // console.log("type:------------------" + discountGiftModel.instance.type);
            this.RewardText.text = DiscountGiftCfg.instance.getName(discountGiftModel.instance.type);
            let str1 = discountGiftModel.instance.curCount;
            let str2 = discountGiftModel.instance.maxCount;
            this.buyText.color = "#0ecf09";
            this.buyText.text = `${str1}/${str2}件`;
            this.buyText.bold = false;

            this.getbottom();
            this.setDate();
            this.initDaoju();
            this.getZhekou();
            this.getZhekouOnsale();
            this.updateCurZhekouImg();
            this.buyImgisDisplay();
            if (this.curCount == this.typeMaxCount) {
                this.sureBtn.visible = false;
            }
            if (discountGiftModel.instance.isDayOver == 1) {
                this.activityText.visible = false;
                this.activityTextPre.visible = false;
                this.activityTextOver.visible = true;
            }
        }

        //================================================刷新显示面板=============================//
        //==================计时器===================//
        /**计时器 */
        discountGift_Timer() {
            this._activityTime = discountGiftModel.instance.restTm;
            if (this._activityTime || this._activityTime > GlobalData.serverTime) {
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.disActivePanel();
            }
        }

        /**计时器01 */
        private activityHandler(): void {
            this.activityText.text = `${modules.common.CommonUtil.timeStampToHHMMSS(this._activityTime)}`;
            if (this.curCount !== this.typeMaxCount) {
                this.activePanel();
            }

            if (this._activityTime < GlobalData.serverTime) {
                //到0隐藏购买标签;显示活动已经结束
                this.disActivePanel();
                Laya.timer.clear(this, this.activityHandler);

            }
        }

        //====================计时器==================//
        private activePanel() {
            this.activityTextOver.visible = false;
            this.activityTextPre.visible = true;
            this.activityText.visible = true;
            this.sureBtn.visible = true;
            this.isOverImg.visible = false;
        }

        private disActivePanel() {
            this.sureBtn.visible = false;
            this.isOverImg.visible = true;
            this.activityTextOver.visible = true;
            this.activityTextPre.visible = false;
            this.activityText.visible = false;
            //this.activityText.text='';            //ssssssssssssssssssssssssssssssss
        }

        //================================================显示UI数据=============================//
        /**根据当天活动是否结束显示和隐藏购买标签 */
        private buyImgisDisplay(): void {
            let num = discountGiftModel.instance.isDayOver;
            if (num == 1) {
                //   console.log('当天活动已经结束');
                this.sureBtn.visible = false;
                this.isOverImg.visible = true;
            } else {
                this.sureBtn.visible = true;
                this.isOverImg.visible = false;
            }

        }

        /**获取next vip can buy内容*/
        private setDate(): void {
            // console.log(" enter next vip可购买");
            this._vipLevel = VipModel.instance.vipLevel;
            this._type = Privilege.discountGift;
            this._nextVipLevel = PrivilegeCfg.instance.getNextLevel(this._vipLevel, this._type);
            let node1 = PrivilegeCfg.instance.getVipInfoByLevel(this._nextVipLevel, this._type);
            // node1[PrivilegeNodeFields.param1]
            //PrivilegeCfg.instance.getVipInfoByLevel(this._nextVipLevel, this._type)[PrivilegeNodeFields.param1]
            //this.buyVipText.text = `VIP${this._nextVipLevel}可购买${node1 ? node1[PrivilegeNodeFields.param1] : 0}件`;
            this.buyVipHtml.innerHTML = `SVIP${this._nextVipLevel}可购买<span style="color:#0ecf09">${node1 ? node1[PrivilegeNodeFields.param1] : 0}件</span>`;


            this.buyVipHtml.visible = true;
            this.buyVipTextImg.visible = true;
            // console.log("next vip可购买");
            if (this._vipLevel < this._maxLv) {
                // this.buyVipText.text = `${this._nextVipLevel}可购买<span style='color:rgb(45,106,56);font-size: 26px'>${node1 ? node1[PrivilegeNodeFields.param1] : 0}</span>件`;              

                this.buyVipHtml.visible = true;
            } else if (this._nextVipLevel == undefined) {

                this.buyVipHtml.visible = false;
                this.buyVipTextImg.visible = false;
            }
        }

        /**获取折扣区间折扣对应的购买次数，注意跟可购买的最大次数不一样*/
        private getZhekou(): void {
            let arr: Array<number> = DiscountGiftCfg.instance.getZhekouQujian(discountGiftModel.instance.type);

            let texArr: Array<string> = new Array<string>();
            texArr.push('');
            if (arr !== undefined) {
                for (var index = 0; index < arr.length; index++) {
                    let ab = arr[index].toString();
                    texArr.push(ab);
                }
            }
            for (var index = 0; index < this._allZhekouText.length; index++) {
                let b = texArr[index];
                this._allZhekouText[index].text = `${b}件开启`;
            }
            this._allZhekouText[0].text = '';
        }

        /**获取显示一长串折扣数图片assets/icon/ui/mall/8.png*/
        private getZhekouOnsale(): void {
            let arr: Array<number> = DiscountGiftCfg.instance.getZhekou(discountGiftModel.instance.type);
            if (arr !== undefined && arr.length > 0) {
                for (var index = 0; index < arr.length; index++) {
                    this._allZhekouImage[index].skin = `assets/icon/ui/mall/${arr[index]}.png`;
                    let child = this._allZhekouImage[index].getChildAt(0) as Laya.Image;
                    child.skin = `assets/icon/ui/discount_gift/selected_thlb_xzk.png`;
                }

                this.updateCurZhekouImg();
            }
            this.progressImage.skin = `assets/icon/ui/discount_gift/9g_tongyong_7.png`;
            //this.progressImage.skin 'discountGift/1.png'
        }


        //把当前折扣对应的折扣数图片放大
        private updateCurZhekouImg() {
            let ndexx: number;
            for (var index = 0; index < this._allZhekouImage.length; index++) {
                this._allZhekouImage[index].scaleX = 1.2;
                this._allZhekouImage[index].scaleY = 1.2;

                let a = this._allZhekouImage[index].getChildAt(0) as Laya.Image;
                a.visible = false;

                if (this._allZhekouImage[index].skin.charAt(20) == (`${this._zhekou}`)) {
                    // console.log("当前折扣 " + this._zhekou + "skin" + this._allZhekouImage[index].skin);
                    this._allZhekouImage[index].scaleX = 1.5;
                    this._allZhekouImage[index].scaleY = 1.5;
                    a.visible = true;
                    ndexx = parseInt(this._allZhekouImage[index].name.charAt(this._allZhekouImage[index].name.length - 1));
                    //this.displayProgressBar(ndexx);

                    this.displayZhekouText(ndexx);
                    if (index == this._allZhekouImage.length - 1) {
                        this.curbuyHtml.innerHTML = `当前<span style="color:#0ecf09">${this._zhekou}折</span>，已是最大折扣`;
                        if (this.maxCount == this.typeMaxCount) {
                            // console.log('maxCount==typeMaxCount')
                            this.curbuyHtml.innerHTML = `当前<span style="color:#0ecf09">${this._zhekou}折</span>，已是最大折扣`;
                        }
                        if (this.curCount == this.typeMaxCount) {
                            // console.log('maxCount==typeMaxCount')
                            this.curbuyHtml.innerHTML = `<span style="color:#0ecf09">已达到最大购买数量</span>`;
                        }
                        if (this._zhekou == 0) {
                            this.curbuyHtml.innerHTML = ``;
                        }
                    }
                }
            }
            let numd: number = DiscountGiftCfg.instance.getIndexBuyNum(discountGiftModel.instance.type, discountGiftModel.instance.ID);
            this.updateProgressBar(numd);
        }

        /**显示折扣数头上对应文字*/
        private displayZhekouText(num: int) {
            //this. getZhekou();
            for (var index = 0; index < this._allZhekouText.length; index++) {

                if (index < num) {
                    this._allZhekouText[index].text = '';
                }
                if (index == num) {
                    this._allZhekouText[index].text = '当前';
                }
            }
        }

        //两个图片间的间隔
        private lastWidth: number;
        private probarWidth: Array<[number, number]> = [[75, 130], [195, 255], [320, 375], [440, 500], [550, 560]];
        private minCount: number;

        /**显示不同长度的进度条*/
        private displayProgressBar(num: int) {
            switch (num) {
                case 0:


                    break;
                case 1:


                    break;
                case 2:


                    break;
                case 3:

                    break;
                case 4:

                    break;
                default:
                    //this.progressImage.width=0;
                    break;
            }
        }

        /**根据购买次数，显示不同长度的进度条2*/
        private updateProgressBar(curNum: int) {
            let curWidth = this.probarWidth[curNum][0];
            let nextWidth = this.probarWidth[curNum][1];
            let max = this.maxCount;
            let min = this.minCount;
            let cur = this.curCount;
            this.progressImage.width = 0;
            if (cur >= min && cur <= max) {
                this.progressImage.width = ((cur - min) / (max - min)) * (nextWidth - curWidth) + curWidth;
                // console.log('进度条长度：  '+this.progressImage.width)
            }
        }

        /**原价，现价，当前折数，再购买多少件开启下一折扣*/
        private getbottom() {
            //本折扣的最大购买次数
            this.maxCount = DiscountGiftCfg.instance.getThisMaxBuyNum(discountGiftModel.instance.type, discountGiftModel.instance.ID);
            this.minCount = DiscountGiftCfg.instance.getThisMinBuyNum(discountGiftModel.instance.type, discountGiftModel.instance.ID);
            this.curCount = discountGiftModel.instance.curCount;
            let needCount: number = this.maxCount - this.curCount;
            //本类型的最大购买次数6001-6006
            this.typeMaxCount = DiscountGiftCfg.instance.getTypeMaxBuyNum(discountGiftModel.instance.type);
            let arr: Array<number> = DiscountGiftCfg.instance.getOriAndRealPrice(discountGiftModel.instance.type, discountGiftModel.instance.ID);

            if (this.curCount == this.maxCount) {
                let arrNext: Array<number> = DiscountGiftCfg.instance.getNextOriAndRealPrice(discountGiftModel.instance.type, discountGiftModel.instance.ID);
                if ((arrNext.length !== 0) && (arrNext !== null) && (arrNext !== undefined)) {
                    this.originalPriceText.text = arrNext[0].toString();
                    this.realPriceText.text = arrNext[1].toString();
                    this.needYuanbaoNum = arrNext[1];
                    this._zhekou = arrNext[2];
                }
            }

            if (this.curCount < this.maxCount || this.curCount == this.typeMaxCount) {
                if (arr.length == 3) {
                    this.originalPriceText.text = arr[0].toString();
                    this.realPriceText.text = arr[1].toString();
                    this.needYuanbaoNum = arr[1];
                    this._zhekou = arr[2];
                }
            }

            this.curbuyHtml.innerHTML = `当前<span style="color:#0ecf09">${this._zhekou}折</span>`;
            if (needCount > 0) {
                this.curbuyHtml.innerHTML = `当前<span style="color:#0ecf09">${this._zhekou}折</span>哦~再购买<span style="color:#0ecf09">${needCount}件</span>开启下一折扣`;
            }
            if (needCount == 0) {
                let _nextMaxCount: number = DiscountGiftCfg.instance.getNextMaxCanBuy(discountGiftModel.instance.type, discountGiftModel.instance.ID);
                if (_nextMaxCount == -1) {
                    this.curbuyHtml.innerHTML = `当前<span style="color:#0ecf09">${this._zhekou}折</span>`;
                    return
                }
                let resNum = _nextMaxCount - this.curCount;
                this.curbuyHtml.innerHTML = `当前<span style="color:#0ecf09">${this._zhekou}折</span>哦~再购买<span style="color:#0ecf09">${resNum}件</span>开启下一折扣`;
            }
            // if (this._nextVipLevel == undefined) {
            // console.log('this._nextVipLevel == undefined')
            //  this.curbuyHtml.innerHTML =`当前<span style="color:#0ecf09">${this._zhekou}折</span>`;
            // }
            if (this.maxCount == this.typeMaxCount) {
                //    console.log('maxCount==typeMaxCount')
                this.curbuyHtml.innerHTML = `当前<span style="color:#0ecf09">${this._zhekou}折</span>，已是最大折扣`;
            }
            if (this.curCount == this.typeMaxCount) {
                //    console.log('maxCount==typeMaxCount')
                this.curbuyHtml.innerHTML = `<span style="color:#0ecf09">已达到最大购买数量</span>`;
            }
            if (this._zhekou == 0) {
                this.curbuyHtml.innerHTML = ``;
            }
        }

        /**获取显示礼包道具内容*/
        private initDaoju(): void {
            /**获取礼包道具内容*/
            let itemArr: Array<Items> = DiscountGiftCfg.instance.getGifts(discountGiftModel.instance.type, discountGiftModel.instance.ID);
            if ((itemArr == null) || (itemArr == undefined)) {
                // console.log('活动未开启')
                return
            }
            //
            let items: Array<Item> = [];
            for (let i: int = 0, len: int = itemArr.length; i < len; i++) {
                let item: Items = itemArr[i];
                items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
            }
            this._itemArr = items;
            //
            for (let i: int = 0, len = 6; i < len; i++) {
                this._allItem[i].visible = false;
            }
            //根据配置表显示道具
            for (let i: int = 0, len = itemArr.length; i < len; i++) {
                let itemId = itemArr[i][0];
                let count = itemArr[i][1];
                let bagItem = this._allItem[i];
                if (bagItem) {
                    bagItem.dataSource = [itemId, count, 0, null];
                    bagItem.visible = true;
                    this._allItem[i].visible = true;
                }
            }
            switch (itemArr.length) {
                case 1:
                    this._allItem[0].pos(300, 450);
                    //this._allItem[0].localToGlobal()                  
                    break;
                case 2:
                    this._allItem[0].pos(250, 450);
                    this._allItem[1].pos(360, 450);
                    break;
                case 3:
                    this._allItem[0].pos(200, 450);
                    this._allItem[1].pos(300, 450);
                    this._allItem[2].pos(400, 450);
                    break;
                case 4:
                    this._allItem[0].pos(150, 450);
                    this._allItem[1].pos(250, 450);
                    this._allItem[2].pos(350, 450);
                    this._allItem[3].pos(450, 450);
                    break;
                case 5:
                    this._allItem[0].pos(100, 450);
                    this._allItem[1].pos(200, 450);
                    this._allItem[2].pos(300, 450);
                    this._allItem[3].pos(400, 450);
                    this._allItem[4].pos(500, 450);
                    break;
                case 6:
                    this._allItem[0].pos(50, 450);
                    this._allItem[1].pos(150, 450);
                    this._allItem[2].pos(250, 450);
                    this._allItem[3].pos(350, 450);
                    this._allItem[4].pos(450, 450);
                    this._allItem[5].pos(550, 450);
                    break;
                default:
                    break;
            }
        }

        //================================================显示UI数据=============================//

    }

}