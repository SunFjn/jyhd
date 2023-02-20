///<reference path="../config/single_pay_jade_cfg.ts"/>
/**
 * 单笔充值（返炽星魔锤）
 */
namespace modules.cumulatePay_shenHun {
    import SinglePayJadeCfg = modules.config.SinglePayJadeCfg;
    import single_pay_jade = Configuration.single_pay_jade;
    import BaseItem = modules.bag.BaseItem;
    import CustomClip = modules.common.CustomClip;
    import CustomList = modules.common.CustomList;
    import CommonUtil = modules.common.CommonUtil;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    import ThreeNumber = Protocols.ThreeNumber;
    import ThreeNumberFields = Protocols.ThreeNumberFields;
    import Event = laya.events.Event;

    export class CumulatePayShenHunPanel extends ui.CumulatePayShenHunViewUI {
        private _btnClip: CustomClip;//按钮特效
        private _list: CustomList;
        private _taskBase: Array<BaseItem>;
        private _allMingCiArr: Array<number>;
        private _isUpdateBtnClickNum = 1000;//刷新按钮CD
        private _isUpdateBtnClick = true;//刷新按钮是否可点击
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
            this._list.spaceY = 2;
            this._list.x = 13;
            this._list.y = 305;
            this._list.itemRender = CumulatePayShenHunItem;
            this.addChildAt(this._list, 4);
        }

        protected addListeners(): void {
            super.addListeners();
            // this.sureBtn.on(Event.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.CUMULATEPAY_SHENHUN_UPDATE, this, this.showUI);

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

        public showUI() {
            let shuju = SinglePayJadeCfg.instance.getArr;
            shuju.sort(this.sortFunc.bind(this));
            this._list.datas = shuju;
            this.setActivitiTime();
        }

        public onOpened(): void {
            super.onOpened();
            CumulatePayShenHunCtrl.instance.GetSinglePayJade();
            this.showUI();
            this.showUI1();
        }
        public showUI1() {
            // 战力护符>辅助装备>招财仙猫>至尊特权
            this.okBtn.visible = true;
            this.wanChengImg.visible = false;
            if (!modules.fight_talisman.FightTalismanModel.instance.state) { //战力护符
                this.tipsImg.skin = `kuanghuan/txt_qmkh_03.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(76, 1044-11);
            }
            else if (modules.gloves.GlovesModel.instance.state == -1) {//辅助装备
                this.tipsImg.skin = `kuanghuan/txt_qmkh_05.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(85, 1058-11);
            }

            else if (!modules.money_cat.MoneyCatModel.instance.state) {//招财猫
                this.tipsImg.skin = `kuanghuan/txt_qmkh_02.png`;
                this.tipsText.text = `代币券不够花？`;
                this.tipsImg.pos(99, 1040-11);
            }
            else if (modules.zhizun.ZhizunModel.instance.state == 0) {//自尊
                this.tipsImg.skin = `kuanghuan/txt_qmkh_01.png`;
                this.tipsText.text = `火速升级,首选特权卡`;
                this.tipsImg.pos(99, 1040-11);
            }
            else {
                this.okBtn.visible = false;
                this.wanChengImg.visible = true;
                this.tipsImg.skin = `kuanghuan/txt_qmkh_01.png`;
                this.tipsText.text = `火速升级,首选特权卡`;
                this.tipsImg.pos(99, 1040-11);
            }
        }
        public okBtnHandler() {
            if (modules.first_pay.FirstPayModel.instance.giveState == 0) {
                WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);
                return;
            }
            if (!modules.fight_talisman.FightTalismanModel.instance.state) { //战力护符
                WindowManager.instance.open(WindowEnum.FIGHT_TALISMAN_BUY_ALERT);
            }
            else if (modules.gloves.GlovesModel.instance.state == -1) {//辅助装备
                WindowManager.instance.open(WindowEnum.GLOVES_BUY_ALERT);
            }
            else if (!modules.money_cat.MoneyCatModel.instance.state) {//招财猫
                WindowManager.instance.open(WindowEnum.MONEY_CAT_BUY_ALERT);
            }
            else if (modules.zhizun.ZhizunModel.instance.state == 0) {//自尊
                WindowManager.instance.open(WindowEnum.ZHIZUN_PANEL);
            }
        }

        private sortFunc(a: single_pay_jade, b: single_pay_jade): number {
            let rewarList: Array<ThreeNumber> = CumulatePayShenHunModel.instance.rewardList;
            let aID: number = a[ThreeNumberFields.v1];
            let bID: number = b[ThreeNumberFields.v1];
            let aState: number = CumulatePayShenHunModel.instance.getSteat(aID);
            let bState: number = CumulatePayShenHunModel.instance.getSteat(bID);
            let returnNum = 1;
            if (aState == bState) {
                if (aID < bID) {
                    returnNum = -1;
                } else {
                    returnNum = 1;
                }
            } else {
                if (aState < bState) {
                    returnNum = -1;
                } else {
                    returnNum = 1;
                }
            }
            return returnNum;
        }

        private setActivitiTime(): void {
            Laya.timer.clear(this, this.activityHandler);
            let isOpen = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.singlePayJade);
            if (CumulatePayShenHunModel.instance.restTm >= GlobalData.serverTime &&
                isOpen &&
                CumulatePayShenHunModel.instance.state) {
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
            this.activityText.text = `${CommonUtil.timeStampToHHMMSS(CumulatePayShenHunModel.instance.restTm)}`;
            if (CumulatePayShenHunModel.instance.restTm < GlobalData.serverTime) {
                this.activityText1.color = "#FF3e3e";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            }
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
