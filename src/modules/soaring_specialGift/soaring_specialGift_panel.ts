///<reference path="../config/soaring_specialGift_fs.ts"/>
/**
 * 特惠礼包 （封神榜）
 */
namespace modules.soaring_specialGift {
    import BaseItem = modules.bag.BaseItem;
    import CustomClip = modules.common.CustomClip;
    import CustomList = modules.common.CustomList;
    import CommonUtil = modules.common.CommonUtil;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    import DiscountGiftFSNode = Protocols.DiscountGiftFSNode;
    import DiscountGiftFSNodeFields = Protocols.DiscountGiftFSNodeFields;
    import SoaringSpecialGiftCfg = modules.config.SoaringSpecialGiftCfg;
    import discount_gift_fs = Configuration.discount_gift_fs;
    import Event = laya.events.Event;

    export class SoaringSpecialGiftPanel extends ui.SoaringSpecialGiftViewUI {
        private _list: CustomList;
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._list = new CustomList();
            this._list.width = 699;
            this._list.height = 660;
            this._list.hCount = 1;
            this._list.spaceX = 0;
            this._list.spaceY = 8;
            this._list.x = 13;
            this._list.y = 305;
            this._list.itemRender = SoaringSpecialGiftItem;
            this.addChildAt(this._list, 4);
        }

        protected addListeners(): void {
            super.addListeners();
            // this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_SPECIALGIFT_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SOARING_SPECIALGIFT_GETINFO, this, this.showUI);
            this.addAutoListener(this.okBtn, Event.CLICK, this, this.okBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZHIZUN_UPDATE, this, this.showUI1);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIGHT_TALISMAN_UPDATE, this, this.showUI1);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MONEY_CAT_UPDATE, this, this.showUI1);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GLOVES_INFO_UPDATE, this, this.showUI1);
        }

        protected removeListeners(): void {
            super.removeListeners();
            // this.sureBtn.off(Event.CLICK, this, this.sureBtnHandler);
            Laya.timer.clear(this, this.activityHandler);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }

        public showUI() {
            let shuju = SoaringSpecialGiftCfg.instance.getCfgByType(SoaringSpecialGiftModel.instance.cuyType);
            shuju.sort(this.sortFunc.bind(this));
            this._list.datas = shuju;
            this.setActivitiTime();
        }

        public onOpened(): void {
            super.onOpened();
            SoaringSpecialGiftCtrl.instance.GetDiscountGiftFSInfo();
            this.showUI1();
        }

        public showUI1() {
            // 财仙猫>至尊特权>战力护符>辅助装备
            this.okBtn.visible = true;
            this.wanChengImg.visible = false;
            if (!modules.money_cat.MoneyCatModel.instance.state) {//招财猫
                this.tipsImg.skin = `kuanghuan/txt_qmkh_02.png`;
                this.tipsText.text = `代币券不够花？`;
                this.tipsImg.pos(95, 1049);
            }
            else if (modules.zhizun.ZhizunModel.instance.state == 0) {//自尊
                this.tipsImg.skin = `kuanghuan/txt_qmkh_01.png`;
                this.tipsText.text = `火速升级,首选特权卡`;
                this.tipsImg.pos(95, 1049);
            }
            else if (!modules.fight_talisman.FightTalismanModel.instance.state) { //战力护符
                this.tipsImg.skin = `kuanghuan/txt_qmkh_03.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(95, 1049);
            }
            else if (modules.gloves.GlovesModel.instance.state == -1) {//辅助装备
                this.tipsImg.skin = `kuanghuan/txt_qmkh_05.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(95, 1049);
            }
            else {
                this.okBtn.visible = false;
                this.wanChengImg.visible = true;
                this.tipsImg.skin = `kuanghuan/txt_qmkh_03.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(95, 1049);
            }
        }
        public okBtnHandler() {
            if (modules.first_pay.FirstPayModel.instance.giveState == 0) {
                WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);
                return;
            }
            if (!modules.money_cat.MoneyCatModel.instance.state) {//招财猫
                WindowManager.instance.open(WindowEnum.MONEY_CAT_BUY_ALERT);
            }
            else if (modules.zhizun.ZhizunModel.instance.state == 0) {//自尊
                WindowManager.instance.open(WindowEnum.ZHIZUN_PANEL);
            }
            else if (!modules.fight_talisman.FightTalismanModel.instance.state) { //战力护符
                WindowManager.instance.open(WindowEnum.FIGHT_TALISMAN_BUY_ALERT);
            }
            else if (modules.gloves.GlovesModel.instance.state == -1) {//辅助装备
                WindowManager.instance.open(WindowEnum.GLOVES_BUY_ALERT);
            }
        }

        private sortFunc(a: discount_gift_fs, b: discount_gift_fs): number {
            let rewarList: Array<DiscountGiftFSNode> = SoaringSpecialGiftModel.instance.rewardList;
            let aID: number = a[DiscountGiftFSNodeFields.id];
            let bID: number = b[DiscountGiftFSNodeFields.id];
            // let aState: number = rewarList[aID] ? SoaringSpecialGiftModel.instance.getState(rewarList[aID]) : 0;
            // let bState: number = rewarList[bID] ? SoaringSpecialGiftModel.instance.getState(rewarList[bID]) : 0;
            //特殊处理 特惠礼包默认都是可以点击购买的 只是点击的时候判断 代币券还有是否有附加条件
            let aState: number = SoaringSpecialGiftModel.instance.getState(rewarList[aID]);
            let bState: number = SoaringSpecialGiftModel.instance.getState(rewarList[bID]);
            aState = aState === 0 ? 1 : aState === 1 ? 0 : aState;
            bState = bState === 0 ? 1 : bState === 1 ? 0 : bState;
            if (aState === bState) {     // 状态相同按ID排
                return aID - bID;
            } else {
                return aState - bState;
            }
        }

        private setActivitiTime(): void {
            Laya.timer.clear(this, this.activityHandler);
            let isOpen = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.discountGiftFS);
            if (SoaringSpecialGiftModel.instance.restTm >= GlobalData.serverTime &&
                isOpen &&
                SoaringSpecialGiftModel.instance.endFlag == 0) {
                this.activityText1.color = "#ffffff";
                this.activityText.visible = true;
                this.activityText1.text = "活动倒计时:";
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.activityText1.color = "#FF3e3e";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";
            }
        }

        private activityHandler(): void {
            this.activityText.text = `${CommonUtil.timeStampToHHMMSS(SoaringSpecialGiftModel.instance.restTm)}`;
            if (SoaringSpecialGiftModel.instance.restTm < GlobalData.serverTime) {
                this.activityText1.color = "#FF3e3e";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        public close(): void {
            super.close();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }
    }
}
