///<reference path="../config/limit_gift_cfg.ts"/>
/**
 * 活动礼包 面板
*/
namespace modules.limit {
    import BtnGroup = modules.common.BtnGroup;
    import ItemsFields = Configuration.ItemsFields;
    import FishGiftCfg = modules.config.LimitGiftCfg;
    import CustomClip = modules.common.CustomClip;
    import CommonUtil = modules.common.CommonUtil;
    import RechargeCfg = modules.config.RechargeCfg;
    import rechargeFields = Configuration.rechargeFields;
    import LayaEvent = modules.common.LayaEvent;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import limitBuyField = Configuration.limitBuyField;

    export class LimitGiftPanel extends ui.LimitGiftViewUI {

        private getAwardState: number = 0;
        constructor() {
            super();
        }

        private _btnClip: CustomClip;
        private secKillTopBtnArr: BtnGroup;//顶部按钮数组

        protected initialize(): void {
            super.initialize();

            this.secKillTopBtnArr = new BtnGroup();
            this.secKillTopBtnArr.setBtns(...this.tabBtnBox._childs);
            this.creatEffect();

        }

        protected get bigtype(): LimitBigType {
            return LimitBigType.fish;
        }

        private creatEffect(): void {
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.gainBtn.addChild(this._btnClip);
            this._btnClip.pos(-7, -14);
            this._btnClip.scale(1.25, 1.2)
            this._btnClip.visible = false;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.secKillTopBtnArr, LayaEvent.CHANGE, this, this.selectHandler);
            this.addAutoListener(this.lastBtn, LayaEvent.CLICK, this, this.selectNextHandler, [-1]);
            this.addAutoListener(this.nextBtn, LayaEvent.CLICK, this, this.selectNextHandler, [1]);
            this.addAutoListener(this.payBtn, LayaEvent.CLICK, this, this.payBtnHandler);
            this.addAutoListener(this.gainBtn, LayaEvent.CLICK, this, this.gainBtnHandler);
            this.addAutoRegisteRedPoint(this.rpBox._childs[0], ["fishGiftRP_grade_1"]);
            this.addAutoRegisteRedPoint(this.rpBox._childs[1], ["fishGiftRP_grade_2"]);
            this.addAutoRegisteRedPoint(this.rpBox._childs[2], ["fishGiftRP_grade_3"]);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LIMIT_GIFT_UPDATE, this, this.updateView);
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();
            LimitGiftCtrl.instance.getLoginRewad(this.bigtype);
            this.secKillTopBtnArr.selectedIndex = 2;
            this._btnClip.play();
        }

        private selectNextHandler(i) {
            let ii = this.secKillTopBtnArr.selectedIndex + i;
            let max = this.secKillTopBtnArr.btns.length - 1;
            if (ii > max) {
                ii = 0;
            } else if (ii < 0) {
                ii = max;
            }
            this.secKillTopBtnArr.selectedIndex = ii;
        }

        /**
         * 切页
         */
        private selectHandler() {
            // console.log('vtz:this.secKillTopBtnArr.selectedIndex', this.secKillTopBtnArr.selectedIndex);
            if (this.secKillTopBtnArr.oldSelectedIndex >= 0) {
                this.tabBtnBgBox._childs[this.secKillTopBtnArr.oldSelectedIndex].visible = false;
                this.awardModelBox._childs[this.secKillTopBtnArr.oldSelectedIndex].visible = false;
                this.priceBox._childs[this.secKillTopBtnArr.oldSelectedIndex].visible = false;
            }
            this.tabBtnBgBox._childs[this.secKillTopBtnArr.selectedIndex].visible = true;
            this.awardModelBox._childs[this.secKillTopBtnArr.selectedIndex].visible = true;
            this.priceBox._childs[this.secKillTopBtnArr.selectedIndex].visible = true;
            this.updateView();
        }

        private updateView() {
            let tid = this.bigtype;
            let gid = LimitGiftModel.instance.giftId(this.bigtype, this.secKillTopBtnArr.selectedIndex);

            let rewards_arr = FishGiftCfg.instance.getRewardsMaxByType(tid, gid);
            let price = FishGiftCfg.instance.getPriceMaxByType(tid, gid);
            // console.log('vtz:rewards_arr', rewards_arr);
            // 奖励列表
            for (let i = 0; (i < this.rewardsItemBox._childs.length && i < rewards_arr.length); i++) {
                this.rewardsItemBox._childs[i].visible = true;
                this.rewardsItemBox._childs[i].dataSource = rewards_arr[i];
                this.itemNameBox._childs[i].text = CommonUtil.getNameByItemId(rewards_arr[i][ItemsFields.itemId])
            }

            // 设置限购数量
            let limitBuy = FishGiftCfg.instance.getLimitBuyMaxByType(tid, gid);
            if (limitBuy[limitBuyField.type] == 0) {
                this.xiangouTitText.text = "限购数量";
                this.xiangouText.text = "无限";
                this.xiangouText.color = "#21B151"
            } else {
                if (limitBuy[limitBuyField.type] == 1) {
                    this.xiangouTitText.text = "每日限购";
                } else if (limitBuy[limitBuyField.type] == 2) {
                    this.xiangouTitText.text = "每周限购";
                }
                // console.log('vtz:gid', gid);
                // console.log('vtz:FishGiftModel.instance.getUseCount(gid)', FishGiftModel.instance.getUseCount(gid));
                this.xiangouText.text = "(" + LimitGiftModel.instance.getUseCount(this.bigtype, gid) + "/" + limitBuy[limitBuyField.count] + ")";
                this.xiangouText.color = "#7A0600";
                if (LimitGiftModel.instance.getUseCount(this.bigtype, gid) < limitBuy[limitBuyField.count]) {
                    this.xiangouText.color = "#21B151";
                }
            }

            // 设置原价
            // this.originalCost.text = `原价：${price}元`;
            this.payBtn.label = `${RechargeCfg.instance.getRecharCfgByIndex(FishGiftCfg.instance.getRechargeByType(tid, gid))[rechargeFields.price]}元购买`;

            // 设置按钮状态
            let _s = LimitGiftModel.instance.getState(this.bigtype, gid);
            // console.log('vtz:_s', _s);
            this.payBtn.visible = this.gainBtn.visible = this.receivedImg.visible = false;
            this._btnClip.visible = false;
            if (_s == 1) {
                this._btnClip.visible = true;
                this.gainBtn.visible = true;
            } else if (_s == 2) {
                this.receivedImg.visible = true;
            } else {
                this.payBtn.visible = true;
            }

            let isOpen = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.fish);
            if (LimitGiftModel.instance.endTime(this.bigtype) < 0) {
                // console.log('vtz:abc');
                this.activityTxt.text = "无时限";
                this.activityTxt.color = "#05671e";
            } else if (LimitGiftModel.instance.endTime(this.bigtype) >= GlobalData.serverTime && isOpen) {
                // console.log('vtz:abc');
                this.activityTxt.color = "#05671e";
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                // console.log('vtz:abc');
                this.activityTxt.text = "活动已结束";
                this.activityTxt.color = "#DD2800";
            }
        }

        private activityHandler(): void {
            // this.setFishBtnDisabled(true);
            this.activityTxt.color = "#05671e";
            this.activityTxt.text = `${modules.common.CommonUtil.timeStampToDayHourMinSecond(LimitGiftModel.instance.endTime(this.bigtype))}`;
            if (LimitGiftModel.instance.endTime(this.bigtype) < GlobalData.serverTime) {
                this.activityTxt.color = "#DD2800";
                this.activityTxt.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        private payBtnHandler(): void {
            let tid = this.bigtype;
            let gid = LimitGiftModel.instance.giftId(this.bigtype, this.secKillTopBtnArr.selectedIndex);
            PlatParams.askPay(FishGiftCfg.instance.getRechargeByType(tid, gid), RechargeCfg.instance.getRecharCfgByIndex(FishGiftCfg.instance.getRechargeByType(tid, gid))[rechargeFields.price]);
            this.updateView();
        }

        private gainBtnHandler(): void {
            let gid = LimitGiftModel.instance.giftId(this.bigtype, this.secKillTopBtnArr.selectedIndex);
            LimitGiftCtrl.instance.getLoginRewardReward(this.bigtype, FishGiftCfg.instance.getRechargeByType(this.bigtype, gid))
            this.updateView();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy(destroyChild);
        }

    }
}