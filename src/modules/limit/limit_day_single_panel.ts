//累充豪礼
///<reference path="../config/limit_day_single_cfg.ts"/>

namespace modules.limit {
    import LimitDaySingleViewUI = ui.LimitDaySingleViewUI;
    import CustomList = modules.common.CustomList;
    import daySinglePayReward = Protocols.daySinglePayReward;
    import daySinglePayRewardFields = Protocols.daySinglePayRewardFields;
    import limit_daySingle = Configuration.limit_daysingle;
    import limit_daySingleFields = Configuration.limit_daysingleFields;
    import Event = laya.events.Event;
    import LimitDaySingleCfg = modules.config.LimitDaySingleCfg;

    export class LimitDaySinglePanel extends LimitDaySingleViewUI {
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
            return LimitDaySingleItem
        }

        protected addListeners(): void {
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LIMIT_DAY_SINGLE_UPDATE, this, this.updateView);
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
            LimitDaySingleCtrl.instance.getLimitDaySingleInfo(this.bigtype);
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
            this._serverDay = LimitDaySingleModel.instance.serverDay(this.bigtype);

            let arr: limit_daySingle[] = LimitDaySingleCfg.instance.getCfgsByServerDay(this.bigtype, this._serverDay).concat();//从model里读取天数

            arr.sort(this.sortFunc.bind(this));
            this._list.datas = arr;
            this.setActivitiTime();
        }

        private setActivitiTime(): void {

            this.activityHandler();
            Laya.timer.loop(1000, this, this.activityHandler);
        }

        private activityHandler(): void {
            this.activityText.text = `${modules.common.CommonUtil.timeStampToDayHourMinSecond(LimitDaySingleModel.instance.activityTime(this.bigtype))}`;
            this.activityText.color = "#2ad200";
            if (LimitDaySingleModel.instance.activityTime(this.bigtype) < GlobalData.serverTime) {
                this.activityText.color = "#FF3e3e";
                this.activityText.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        private sortFunc(a: limit_daySingle, b: limit_daySingle): number {

            let aID: number = a[limit_daySingleFields.id];
            let bID: number = b[limit_daySingleFields.id];
            let atable: daySinglePayReward = LimitDaySingleModel.instance.getRewardById(this.bigtype, aID);
            let btable: daySinglePayReward = LimitDaySingleModel.instance.getRewardById(this.bigtype, bID);
            //未领
            let arestcount: number = atable ? atable[daySinglePayRewardFields.restCount] : 0
            let brestcount: number = btable ? btable[daySinglePayRewardFields.restCount] : 0
            //已领
            let ausecount: number = atable ? atable[daySinglePayRewardFields.useCount] : 0
            let busecount: number = btable ? btable[daySinglePayRewardFields.useCount] : 0

            let astate: number = 0
            if (arestcount > 0) {
                astate = 2
            } else {
                astate = 1
            }

            if (a[limit_daySingleFields.count] - ausecount < 1) {
                astate = 0
            }

            let bstate: number = 0
            if (brestcount > 0) {
                bstate = 2
            } else {
                bstate = 1
            }
            if (b[limit_daySingleFields.count] - busecount < 1) {
                bstate = 0
            }

            return bstate - astate;
        }




    }
}