///<reference path="login_reward_ctrl.ts"/>
///<reference path="login_reward_item.ts"/>
/** 登录豪礼 */

namespace modules.login_reward {
    import LoginReward = ui.LoginRewardUI;
    import CustomList = modules.common.CustomList;
    import CustomClip = modules.common.CustomClip;
    import LoginRewardCfg = modules.config.LoginRewardCfg;
    import LoginRewardNode = Protocols.LoginRewardNode;
    import LoginRewardNodeFields = Protocols.LoginRewardNodeFields;
    import login_reward = Configuration.login_reward;
    import login_rewardFields = Configuration.login_rewardFields;
    import Event = laya.events.Event;

    export class LoginRewardPanel extends LoginReward {
        public _list: CustomList;
        private _btnClip: CustomClip;
        private arr: login_reward[] = [];
        private lessenTm: number = 0;
        private _showIds: Array<any>;
        private _rewardList: Array<any>;
        private RankedType: number = 0;//榜单类型
        private TypeParame: number = 0;//天数

        //public isOpen: boolean = false;

        private RestTm: number;

        private tempArr: Array<any>;

        //是否开启
        private _state: boolean;

        constructor() {
            super();
            this._state = false;
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();

                this._list.destroy();

                this._list = null;
            }
            if (this._btnClip) {
                this._btnClip.removeSelf();

                this._btnClip.destroy();

                this._btnClip = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();

            this._showIds = new Array<any>();

            this._list = new CustomList();

            this._list.scrollDir = 1;

            this._list.itemRender = LoginRewardItem;

            this._list.vCount = 7;

            this._list.hCount = 1;

            this._list.width = 699;

            this._list.height = 684 - 11;

            this._list.x = 15;

            this._list.y = 15;

            this._list.spaceY = 6;

            this.itemPanel.addChild(this._list);

            this.centerX = this.centerY = 0;

            this.setItem(0, 1);

        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LOGIN_REWARD_UPADTE, this, this._updateView);
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
            LoginRewardCtrl.instance.getLoginRewad();

            this.setItem(0, 1);

            this._updateView();

            this.setTempArr();

            this.showUI();
        }
        public showUI() {
            // 财仙猫>至尊特权>战力护符>辅助装备
            this.okBtn.visible = true;
            this.wanChengImg.visible = false;
            if (!modules.money_cat.MoneyCatModel.instance.state) {//招财猫
                this.tipsImg.skin = `kuanghuan/txt_qmkh_02.png`;
                this.tipsText.text = `代币券不够花？`;
                this.tipsImg.pos(129, 1061);
            }
            else if (modules.zhizun.ZhizunModel.instance.state == 0) {//自尊
                this.tipsImg.skin = `kuanghuan/txt_qmkh_01.png`;
                this.tipsText.text = `火速升级,首选特权卡`;
                this.tipsImg.pos(129, 1061);
            }
            else if (!modules.fight_talisman.FightTalismanModel.instance.state) { //战力护符
                this.tipsImg.skin = `kuanghuan/txt_qmkh_03.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(129, 1061);
            }
            else if (modules.gloves.GlovesModel.instance.state == -1) {//辅助装备
                this.tipsImg.skin = `kuanghuan/txt_qmkh_05.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(129, 1061);
            }
            else {
                this.okBtn.visible = false;
                this.wanChengImg.visible = true;
                this.tipsImg.skin = `kuanghuan/txt_qmkh_03.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(129, 1061);
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

        private setTempArr() {
            for (let i = 0; i < this.arr.length; i++) {
                this.tempArr = this.arr;
            }
        }

        private _updateView(): void {
            this.RestTm = LoginRewardModel.instance.restTim;

            this.lessenTm = this.RestTm;

            this.RankedType = LoginRewardModel.instance.rankedType;

            this.TypeParame = LoginRewardModel.instance.typeParame;

            this.arr = LoginRewardCfg.instance.getCfgBytype(this.RankedType, this.TypeParame);

            this.arr.sort(this.sortFunc.bind(this));
            if (LoginRewardModel.instance._nodeList.length > 0) {
                this._list.datas = this.arr;
            } else {
                this._list.datas = this.tempArr;
            }
            this.setActivitiTime();
        }

        private setActivitiTime(): void {
            Laya.timer.clear(this, this.activityHandler);
            let isOpen = modules.funcOpen.FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.loginReward);
            if (LoginRewardModel.instance.restTim >= GlobalData.serverTime &&
                isOpen &&
                LoginRewardModel.instance.nodeLit.length > 0) {
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
            if (LoginRewardModel.instance.restTim < GlobalData.serverTime) {
                this.activityText1.color = "#FF3e3e";
                this.activityText.visible = false;
                this.activityText1.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            } else {
                this.activityText.text = `${CommonUtil.timeStampToHHMMSS(LoginRewardModel.instance.restTim)}`;
            }
        }

        private setItem(type: number, sumtype: number) {
            //0、开服天数,1、封神榜
            this.arr = LoginRewardCfg.instance.getCfgBytype(type, sumtype);
        }

        private sortFunc(a: login_reward, b: login_reward): number {
            let aId: number = a[login_rewardFields.id];

            let bId: number = b[login_rewardFields.id];

            let nodeA: LoginRewardNode = LoginRewardModel.instance.getNodeInfoById(aId);

            let nodeB: LoginRewardNode = LoginRewardModel.instance.getNodeInfoById(bId);

            let aState: number = nodeA ? nodeA[LoginRewardNodeFields.state] : 0;

            let bState: number = nodeB ? nodeB[LoginRewardNodeFields.state] : 0;
            //fixed
            aState = aState === 1 ? 0 : aState === 0 ? 1 : aState;
            bState = bState === 1 ? 0 : bState === 0 ? 1 : bState;
            if (aState === bState) {
                return aId - bId;
            } else {
                return aState - bState;
            }
        }

        public close(): void {
            super.close();

            //this.isOpen = false;
        }
    }
}