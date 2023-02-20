///<reference path="../config/week_login_cfg.ts"/>
/**登录豪礼(周末狂欢)*/


namespace modules.week_login {
    import WeekLogin = ui.WeekLoginUI;
    import week_login = Configuration.week_login;
    import GetWeekLoginAwardFields = Protocols.GetWeekLoginAwardFields;
    import CustomList = modules.common.CustomList;
    import WeekLoginCfg = modules.config.WeekLoginCfg;
    import Event = laya.events.Event;

    export class WeekLoginPanel extends WeekLogin {
        public _list: CustomList;

        private arr: week_login[] = [];

        private RestTm: number;

        private lessenTm: number;

        private tempArr: Array<any>;

        private itemID: Array<any>;

        //是否开启
        private _state: boolean;
        //构造函数
        constructor() {
            super();
            this._state = false;
            this.lessenTm = 0;
            this.itemID = [];
        }
        //初始化
        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();

            this._list.scrollDir = 1;

            this._list.itemRender = WeekLoginItem;

            this._list.vCount = 34;

            this._list.hCount = 1;

            this._list.width = 640;

            this._list.height = 628;

            this._list.x = 30;

            this._list.y = 66;

            this.itemPanel.addChild(this._list);

            this.centerX = this.centerY = 0;
        }

        public onOpened(): void {
            super.onOpened();

            WeekLoginCtrl.instance.getWeekLogin();

            this._updateView();

            if (WeekLoginModel.instance.nodeList.length == 0) {
                this.setTempArr();
            }
            this.arr = [];
            this.showUI();
        }
        public showUI() {
            // 按招财仙猫>至尊特权>战力护符>辅助装备的优先级
            this.okBtn.visible = true;
            this.wanChengImg.visible = false;

            if (!modules.money_cat.MoneyCatModel.instance.state) {//招财猫
                this.tipsImg.skin = `kuanghuan/txt_qmkh_02.png`;
                this.tipsText.text = `代币券不够花？`;
                this.tipsImg.pos(99, 1040);
            }
            else if (modules.zhizun.ZhizunModel.instance.state == 0) {//自尊
                this.tipsImg.skin = `kuanghuan/txt_qmkh_01.png`;
                this.tipsText.text = `火速升级,首选特权卡`;
                this.tipsImg.pos(99, 1040);
            }

            else if (!modules.fight_talisman.FightTalismanModel.instance.state) { //战力护符
                this.tipsImg.skin = `kuanghuan/txt_qmkh_03.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(76, 1044);
            }

            else if (modules.gloves.GlovesModel.instance.state == -1) {
                this.tipsImg.skin = `kuanghuan/txt_qmkh_03.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(76, 1044);
            }
            else {
                this.okBtn.visible = false;
                this.wanChengImg.visible = true;
                this.tipsImg.skin = `kuanghuan/txt_qmkh_03.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(76, 1044);
            }
        }
        public okBtnHandler() {
            //   按招财仙猫>至尊特权>战力护符>辅助装备的优先级
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
            else if (!modules.fight_talisman.FightTalismanModel.instance.state) {
                WindowManager.instance.open(WindowEnum.FIGHT_TALISMAN_BUY_ALERT);
            }
            else if (modules.gloves.GlovesModel.instance.state == -1) { //辅助装备
                WindowManager.instance.open(WindowEnum.GLOVES_BUY_ALERT);
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

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.WEEK_LOGIN_UPDATE, this, this._updateView);
            this.addAutoListener(this.okBtn, Event.CLICK, this, this.okBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZHIZUN_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIGHT_TALISMAN_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MONEY_CAT_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GLOVES_INFO_UPDATE, this, this.showUI);
        }

        private _updateView() {
            this.RestTm = WeekLoginModel.instance.time;

            this.arr = [];
            this.itemID = [];

            this.lessenTm = this.RestTm;

            let nodeList = WeekLoginModel.instance.nodeList;
            if (!nodeList || !nodeList.length) return;
            for (let i = 0; i < nodeList.length; i++) {
                this.itemID[i] = nodeList[i][0];
            }

            for (let i = 0; i < this.itemID.length; i++) {
                this.arr.push(WeekLoginCfg.instance.getArrDare(this.itemID[i]));
            }

            this.arr.sort(this.sortFunc.bind(this));

            if (WeekLoginModel.instance.state) {
                this._list.datas = this.arr;
            } else {
                this._list.datas = this.tempArr;

            }
            this.setActivitiTime();
        }

        private sortFunc(a: week_login, b: week_login): number {
            let aId: number = a[GetWeekLoginAwardFields.id];

            let bId: number = b[GetWeekLoginAwardFields.id];

            let nodeA: Array<any> = WeekLoginModel.instance.getNodeInfoById(aId);

            let nodeB: Array<any> = WeekLoginModel.instance.getNodeInfoById(bId);

            let aState: number = nodeA ? nodeA[1] : 0;

            let bState: number = nodeB ? nodeB[1] : 0;

            if (aState + bState > 1) {
                if (aState === bState) {// 状态相同按ID排
                    return aId - bId;
                } else {
                    return aState - bState;
                }
            } else if (aState > bState) {
                return aState - bState;
            } else {
                return bState - aState;
            }
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.activityHandler);
        }

        private setActivitiTime(): void {
            Laya.timer.clear(this, this.activityHandler);
            let isOpen = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.weekLogin);

            if (WeekLoginModel.instance.state && isOpen) {
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

        private activityHandler() {
            if (WeekLoginModel.instance.time < GlobalData.serverTime) {
                this.activityText1.color = "#FF3e3e";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            } else {
                this.activityText.text = `${CommonUtil.timeStampToDayHourMin(WeekLoginModel.instance.time)}`;
            }
        }

        private setTempArr() {
            for (let i = 0; i < this.arr.length; i++) {
                this.tempArr = this.arr;
            }
        }
    }
}
