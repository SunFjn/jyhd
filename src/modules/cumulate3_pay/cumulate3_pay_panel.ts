//累充豪礼(所有可变更的周期性充值活动)
namespace modules.cumulate3_pay {
    import Cumulate3PayViewUI = ui.Cumulate3PayViewUI;
    import CustomList = modules.common.CustomList;
    import CumulatepayReward = Protocols.CumulatepayReward;
    import CumulatepayRewardFields = Protocols.CumulatepayRewardFields;
    import cumulate_pay3 = Configuration.cumulate_pay3;
    import Event = laya.events.Event;

    export class CumulatePay3Panel extends Cumulate3PayViewUI {
        private _list: CustomList;
        private _activityTime: number = 0;
        private _serverDay: number = 0;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            //用于设置控件属性 或者创建新控件
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.itemRender = CumulatePay3Item;
            this._list.vCount = 6;
            this._list.hCount = 1;
            this._list.width = 622;
            this._list.height = 672 - 11;
            this._list.x = 13;
            this._list.y = 16;
            this.itemPanel.addChild(this._list);


            this.centerX = this.centerY = 0;

            //不同活动展示不同的标题和封面
            this.checkCover();

        }

        /**
         * 检测和设置封面以及标题
        */
        checkCover() {
            let titleName: string = CumulatePay3Model.instance.getCurrentActivityName();
            let coverName: string = CumulatePay3Model.instance.getCurrentCoverName();

            // this.titleTxt.text = titleName;
            this.titleImg.skin = titleName;
            this.coverImg.skin = `cumulate/${coverName}`;
        }

        protected addListeners(): void {
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.CUMULATE_PAY3_UPDATE, this, this.updateView);
            super.addListeners();
            this.addAutoListener(this.okBtn, Event.CLICK, this, this.okBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZHIZUN_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIGHT_TALISMAN_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MONEY_CAT_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GLOVES_INFO_UPDATE, this, this.showUI);
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.activityHandler);
        }

        public onOpened(): void {
            super.onOpened();
            Cumulate3PayCtrl.instance.getCumulatepay3Info();
            this.updateView();
            this.showUI();
        }
        public showUI() {
            //    战力护符>辅助装备>招财仙猫>至尊特权
            this.okBtn.visible = true;
            this.wanChengImg.visible = false;
            if (!modules.fight_talisman.FightTalismanModel.instance.state) { //战力护符
                this.tipsImg.skin = `kuanghuan/txt_qmkh_03.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(76, 1044 - 11);
            }
            else if (modules.gloves.GlovesModel.instance.state == -1) { //辅助装备
                this.tipsImg.skin = `kuanghuan/txt_qmkh_05.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(85, 1058 - 11);
            }
            else if (!modules.money_cat.MoneyCatModel.instance.state) {//招财猫
                this.tipsImg.skin = `kuanghuan/txt_qmkh_02.png`;
                this.tipsText.text = `代币券不够花？`;
                this.tipsImg.pos(99, 1040 - 11);
            }
            else if (modules.zhizun.ZhizunModel.instance.state == 0) {//自尊
                this.tipsImg.skin = `kuanghuan/txt_qmkh_01.png`;
                this.tipsText.text = `火速升级,首选特权卡`;
                this.tipsImg.pos(99, 1040 - 11);
            }
            else {
                this.okBtn.visible = false;
                this.wanChengImg.visible = true;
                this.tipsImg.skin = `kuanghuan/txt_qmkh_01.png`;
                this.tipsText.text = `火速升级,首选特权卡`;
                this.tipsImg.pos(99, 1040 - 11);
            }
        }
        public okBtnHandler() {
            //    战力护符>辅助装备>招财仙猫>至尊特权
            if (modules.first_pay.FirstPayModel.instance.giveState == 0) {
                WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);
                return;
            }
            if (!modules.fight_talisman.FightTalismanModel.instance.state) {
                WindowManager.instance.open(WindowEnum.FIGHT_TALISMAN_BUY_ALERT);
            }
            else if (modules.gloves.GlovesModel.instance.state == -1) { //辅助装备
                WindowManager.instance.open(WindowEnum.GLOVES_BUY_ALERT);
            }
            else if (!modules.money_cat.MoneyCatModel.instance.state) {
                WindowManager.instance.open(WindowEnum.MONEY_CAT_BUY_ALERT);
            }
            else if (modules.zhizun.ZhizunModel.instance.state == 0) {
                WindowManager.instance.open(WindowEnum.ZHIZUN_PANEL);
            }

        }

        private updateView(): void {
            //更新面板状态 和累充事件绑定
            this._serverDay = CumulatePay3Model.instance.serverDay;
            let arr: cumulate_pay3[] = CumulatePay3Cfg.instance.getCfgsByServerDay(this._serverDay);
            if (arr) {
                arr.sort(this.sortFunc.bind(this));
                this._list.datas = arr;
                this.setActivitiTime();
            }
        }

        private setActivitiTime(): void {

            this.activityHandler();
            Laya.timer.loop(1000, this, this.activityHandler);
        }

        private activityHandler(): void {
            this.activityText.text = `${modules.common.CommonUtil.timeStampToHHMMSS(CumulatePay3Model.instance.activityTime)}`;
            if (CumulatePay3Model.instance.activityTime < GlobalData.serverTime) {
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        private sortFunc(a: cumulate_pay3, b: cumulate_pay3): number {
            let rewarList: Array<CumulatepayReward> = CumulatePay3Model.instance.rewarList;
            let aID: number = a[CumulatepayRewardFields.id];
            let bID: number = b[CumulatepayRewardFields.id];
            let aState: number = rewarList[aID] ? rewarList[aID][CumulatepayRewardFields.state] : 0;
            let bState: number = rewarList[bID] ? rewarList[bID][CumulatepayRewardFields.state] : 0;
            aState = aState === 0 ? 1 : aState === 1 ? 0 : aState;
            bState = bState === 0 ? 1 : bState === 1 ? 0 : bState;
            if (aState === bState) {     // 状态相同按ID排
                return aID - bID;
            } else {
                return aState - bState;
            }
        }
    }
}