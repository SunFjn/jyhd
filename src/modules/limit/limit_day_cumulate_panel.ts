//累充豪礼
namespace modules.limit {
    import LimitDaycumulateViewUI = ui.LimitDaycumulateViewUI;
    import CustomList = modules.common.CustomList;
    import LimitDayCumulateReward = Protocols.LimitDayCumulateReward;
    import LimitDayCumulateRewardFields = Protocols.LimitDayCumulateRewardFields;
    import limit_day_cumulate = Configuration.limit_day_cumulate;
    import limit_day_cumulateFields = Configuration.limit_day_cumulateFields;
    import Event = laya.events.Event;

    export class LimitDayCumulatePanel extends LimitDaycumulateViewUI {
        private _list: CustomList;
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
            this._list.itemRender = this.listItemClass;
            this._list.vCount = 6;
            this._list.hCount = 1;
            this._list.width = 622;
            this._list.height = 630;
            this._list.x = 40;
            this._list.y = 36;
            this._list.zOrder = 16;
            this.itemPanel.addChild(this._list);


            this.centerX = this.centerY = 0;
        }
        protected get bigtype(): LimitBigType {
            return LimitBigType.fish;
        }

        protected get listItemClass() {
            return LimitDayCumulateItem
        }

        protected addListeners(): void {
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LIMIT_DAY_CUMULATE_UPDATE, this, this.updateView);
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
            LimitDayCumulateCtrl.instance.getLimitDayCumulateInfo(this.bigtype);
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
                this.tipsImg.pos(16, 1044 - 11);
            }
            else if (modules.gloves.GlovesModel.instance.state == -1) { //辅助装备
                this.tipsImg.skin = `kuanghuan/txt_qmkh_05.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(16, 1058 - 11);
            }
            else if (!modules.money_cat.MoneyCatModel.instance.state) {//招财猫
                this.tipsImg.skin = `kuanghuan/txt_qmkh_02.png`;
                this.tipsText.text = `代币券不够花？`;
                this.tipsImg.pos(16, 1040 - 11);
            }
            else if (modules.zhizun.ZhizunModel.instance.state == 0) {//自尊
                this.tipsImg.skin = `kuanghuan/txt_qmkh_01.png`;
                this.tipsText.text = `火速升级,首选特权卡`;
                this.tipsImg.pos(16, 1040 - 11);
            }
            else {
                this.okBtn.visible = false;
                this.wanChengImg.visible = true;
                this.tipsImg.skin = `kuanghuan/txt_qmkh_01.png`;
                this.tipsText.text = `火速升级,首选特权卡`;
                this.tipsImg.pos(16, 1040 - 11);
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
            this._serverDay = LimitDayCumulateModel.instance.serverDay(this.bigtype);

            let arr: limit_day_cumulate[] = LimitDayCumulateCfg.instance.getCfgsByServerDay(this.bigtype, this._serverDay).concat();//从model里读取天数
           
                arr.sort(this.sortFunc.bind(this));
                this._list.datas = arr;
                this.setActivitiTime();
        }

        private setActivitiTime(): void {

            this.activityHandler();
            Laya.timer.loop(1000, this, this.activityHandler);
        }

        private activityHandler(): void {
            this.activityText.text = `${modules.common.CommonUtil.timeStampToDayHourMinSecond(LimitDayCumulateModel.instance.activityTime(this.bigtype))}`;
            this.activityText.color = "#2ad200";
            if (LimitDayCumulateModel.instance.activityTime(this.bigtype) < GlobalData.serverTime) {
                this.activityText.color = "#FF3e3e";
                this.activityText.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        private sortFunc(a: limit_day_cumulate, b: limit_day_cumulate): number {
            let aID: number = a[limit_day_cumulateFields.id];
            let bID: number = b[limit_day_cumulateFields.id];
            let atable: LimitDayCumulateReward = LimitDayCumulateModel.instance.getRewardById(this.bigtype,aID);
            let btable: LimitDayCumulateReward = LimitDayCumulateModel.instance.getRewardById(this.bigtype,bID);


            //1 可  0不可 2领完
            let aState: int = atable ? atable[LimitDayCumulateRewardFields.state] : 0;
            let bState: int = btable ? btable[LimitDayCumulateRewardFields.state] : 0;
            // 交换0跟1状态，方便排序（可领》不可领》已领）
            aState = aState === 0 ? 1 : aState === 1 ? 0 : aState;
            bState = bState === 0 ? 1 : bState === 1 ? 0 : bState;
            return aState - bState;
        }
    }
}