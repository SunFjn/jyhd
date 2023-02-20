///<reference path="../config/soaring_rush_buy_fs.ts"/>
namespace modules.invitation {
    import ItemsFields = Configuration.ItemsFields;
    import Event = Laya.Event;
    import BaseItem = modules.bag.BaseItem;
    import CustomClip = modules.common.CustomClip;
    import CustomList = modules.common.CustomList;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CommonUtil = modules.common.CommonUtil;
    import BagUtil = modules.bag.BagUtil;
    import Item = Protocols.Item;
    import Items = Configuration.Items;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import BagModel = modules.bag.BagModel;
    import SoaringPanicBuyingGiftCfg = modules.config.SoaringPanicBuyingGiftCfg;
    import rush_buy_fs = Configuration.rush_buy_fs;
    import rush_buy_fsFields = Configuration.rush_buy_fsFields;

    export class InvitationAlert extends ui.InvitationAlertUI {
        private _Datas: rush_buy_fs;
        private _btnClip: CustomClip;//按钮特效
        private _taskBase: Array<BaseItem>;
        private _allMingCiArr: Array<number>;
        private _isUpdateBtnClickNum = 1000;//刷新按钮CD
        private _isUpdateBtnClick = true;//刷新按钮是否可点击
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._taskBase = [this.continueBase1, this.continueBase2, this.continueBase3];
            this.creatEffect();
            // this.StatementHTML.color = "#55ff28";
            // this.StatementHTML.style.fontFamily = "SimHei";
            // this.StatementHTML.style.fontSize = 22;
            // this.StatementHTML.style.align = "right";
        }

        protected addListeners(): void {
            super.addListeners();
            this.invitationBtn.on(Event.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.INVITATION_UPDATE, this, this.showUI);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.invitationBtn.off(Event.CLICK, this, this.sureBtnHandler);
            Laya.timer.clear(this, this.activityHandler);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }

        public onOpened(): void {
            super.onOpened();
            this.timeText.visible = false;
            InvitationCtrl.instance.GetInviteGift();
            this.showReward();
            this.showUI();
        }

        public sureBtnHandler() {
            if (InvitationModel.instance.state == 1) {
                this.isCion();
            }
            else {
                //跳转邀请
                console.log("跳转邀请");
                PlatParams.playerShare(InvitationCtrl.instance.callBask.bind(InvitationCtrl.instance));
                    //    InvitationCtrl.instance.InviteFriend();
            }
        }

        public isCion() {
            let items: Array<Item> = [];
            let rewards = InvitationModel.instance._awardAee;
            if (rewards) {
                for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                    let item: Array<number> = rewards[i];
                    items.push([item[0], item[1], 0, null]);
                }
                //通过传入需要领取的道具判断有没有背包满了
                if (BagUtil.canAddItemsByBagIdCount(items)) {
                    InvitationCtrl.instance.DrawInviteGift();
                }
            }
        }

        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
        }

        public showUI() {
            this.setBtn();
            this.setCiShu();
            this.setActivitiTime();
        }
        public setBtn() {
            if (InvitationModel.instance.state == 1) {
                this.invitationBtn.label = "领取奖励";
                if (this._btnClip) {
                    this._btnClip.play();
                    this._btnClip.visible = true;
                }
            }
            else {
                this.invitationBtn.label = "立即邀请";
                if (this._btnClip) {
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                }
            }
        }
        public setCiShu() {
            let num1 = InvitationModel.instance._maxNum - InvitationModel.instance.times;
            num1 = num1 < 0 ? 0 : num1;
            let num2 = InvitationModel.instance._maxNum;//总次数
            if (num1 == 0) {
                this.StatementHTML.color = `#ff3e3e`;
                this.StatementHTML.text = `${num1}/${num2}`;
                this.StatementHTML.stroke = 3;
            }
            else {
                this.StatementHTML.color = `#55ff28`;
                this.StatementHTML.text = `${num1}/${num2}`;
                this.StatementHTML.stroke = 0;
            }
        }
        private setActivitiTime(): void {
            Laya.timer.clear(this, this.activityHandler);
            let isOpen = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.invitationEnter);
            if (InvitationModel.instance.cold > GlobalData.serverTime &&
                isOpen) {
                this.timeText.visible = true;
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.timeText.visible = false;
            }
        }

        private activityHandler(): void {
            this.timeText.text = `分享倒计时:${CommonUtil.timeStampToMMSS(InvitationModel.instance.cold)}`;
            if (InvitationModel.instance.cold <= GlobalData.serverTime) {
                this.timeText.visible = false;
                Laya.timer.clear(this, this.activityHandler);
            }
        }
        public showReward() {
            for (var index = 0; index < this._taskBase.length; index++) {
                let element = this._taskBase[index];
                element.visible = false;
            }
            //这里根据 名次 去拿对应的奖励和上榜条件
            let rewards = InvitationModel.instance._awardAee;
            let allAward = new Array<BaseItem>();
            for (var index = 0; index < rewards.length; index++) {
                let element = rewards[index];
                let _taskBase: BaseItem = this._taskBase[index];
                if (_taskBase) {
                    _taskBase.dataSource = [rewards[index][0], rewards[index][1], 0, null];
                    _taskBase.visible = true;
                    // _taskBase.nameVisible = true;
                    allAward.push(_taskBase);
                }
            }
            //居中适配 奖励
            let lengNum = allAward.length * 100 + (allAward.length - 1) * 5;
            let startPosX = (this.rewardBox.width - lengNum) / 2;
            for (let index = 0; index < allAward.length; index++) {
                let element = allAward[index];
                element.x = startPosX;
                startPosX += (element.width) + 5;
            }
        }
        /**
         * 初始化 按钮特效
         */
        private creatEffect(): void {
            this._btnClip = new CustomClip();
            this.invitationBtn.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.play();
            this._btnClip.loop = true;
            this._btnClip.pos(-6, -8, true);
            this._btnClip.scale(0.8, 0.8);
            this._btnClip.visible = false;
        }

        public close(): void {
            super.close();
        }

        public destroy(): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy();
        }
    }
}
