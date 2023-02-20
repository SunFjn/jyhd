/////<reference path="../$.ts"/>
/** 投资返利 */
namespace modules.invest_reward {
    import InvestGrowthRewardUI = ui.InvestLoginRewardUI;
    import CustomList = modules.common.CustomList;
    import invest_reward = Configuration.invest_reward;
    import invest_rewardFields = Configuration.invest_rewardFields;
    import PrivilegeCfg = modules.config.PrivilegeCfg;
    import InvestrewardReward = Protocols.InvestrewardReward;
    import InvestrewardRewardFields = Protocols.InvestrewardRewardFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import InvestrewardState = Protocols.InvestrewardState;
    import InvestrewardStateFields = Protocols.InvestrewardStateFields;
    import Event = Laya.Event;
    import VipModel = modules.vip.VipModel;
    import CustomClip = modules.common.CustomClip;

    export class InvestGrowthPanel extends InvestGrowthRewardUI {
        private _cfgItem: invest_reward;
        private _list: CustomList;
        private getState: number = 0;
        private vipLevel: number = 0;
        private grow: number = 0;
        private _btnClip: CustomClip;
        private arr: invest_reward[] = [];

        constructor() {
            super();
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
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.itemRender = InvestRewardItem;
            this._list.vCount = 7;
            this._list.hCount = 1;
            this._list.width = 700;
            this._list.height = 710;
            this._list.x = 0;
            this._list.y = 0;
            this.itemPanel.addChild(this._list);
            this.centerX = this.centerY = 0;
            this.setItem(2);
            this.creatEffect();
        }

        protected addListeners(): void {
            super.addListeners();
            this.investBtn.on(Event.CLICK, this, this.sureBtnHandler);
            GlobalData.dispatcher.on(CommonEventType.INVEST_REWARD_UPDATE, this, this._updateView);
            // this.addAutoListener();
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.investBtn.off(Event.CLICK, this, this.sureBtnHandler);
            GlobalData.dispatcher.off(CommonEventType.INVEST_REWARD_UPDATE, this, this._updateView);
        }

        public onOpened(): void {
            super.onOpened();
            this.setItem(2);
            this._updateView();
            this._btnClip.play();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

        }

        private _updateView(): void {
            this.setBtnSure();
            this.arr = InvestRewardCfg.instance.getCfgBytype(2);
            this.arr.sort(this.sortFunc.bind(this));
            this._list.datas = this.arr;
        }

        //设置任务栏
        private setItem(type: number) {
            this.arr = InvestRewardCfg.instance.getCfgBytype(type);
            this._cfgItem = this.arr[this.arr.length - 1];
            this.grow = this._cfgItem[invest_rewardFields.goldPrice];
            this.growText.value = `${this._cfgItem[invest_rewardFields.goldPrice]}`;
            this.giveText.value = `${this._cfgItem[invest_rewardFields.restReward]}`;
            if (type == 0) {
                let vip: number[] = PrivilegeCfg.instance.getMinLvMaxLvByType(10);
                this.vipLevel = vip[0];
            } else if (type == 1) {
                let vip: number[] = PrivilegeCfg.instance.getMinLvMaxLvByType(11);
                this.vipLevel = vip[0];
            } else {
                let vip: number[] = PrivilegeCfg.instance.getMinLvMaxLvByType(12);
                this.vipLevel = vip[0];
            }

            this.vipText.text = `SVIP${this.vipLevel}可投资`;
            this.rewardText.value = `${this._cfgItem[invest_rewardFields.timesReward]}`
        }

        //设置投资按钮状态
        private setBtnSure(): void {
            let stateList: Table<InvestrewardState> = InvestRewardModel.instance.stateList;
            let gold = PlayerModel.instance.ingot;
            let VipLevel = VipModel.instance.vipLevel;
            let value = stateList[2];//0登录返利1闯关法力2为成长返利
            if (value) {
                this.getState = value[InvestrewardStateFields.state];
            }
            if (this.getState == 0) {
                this.investBtn.visible = true;
                this.receivedImg.visible = false;
            } else {
                this.investBtn.visible = false;
                this.receivedImg.visible = true;
            }
            if (gold >= this.grow && VipLevel >= this.vipLevel) {
                this._btnClip.visible = true;
                this.vipText.visible = false;
            } else {
                this._btnClip.visible = false;
            }
            if (VipLevel >= this.vipLevel) {
                this.vipText.visible = false;
            }
            //InvestRewardCtrl.instance.getInvestReward([this._itemTaskId]);
        }

        private creatEffect(): void {
            this._btnClip = new CustomClip();
            this.investBtn.addChild(this._btnClip);
            this._btnClip.pos(-5, -16);
            this._btnClip.scale(1.23, 1.2);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.play();
            this._btnClip.loop = true;
            this._btnClip.visible = false;
        }

        private sureBtnHandler(): void {
            let gold = PlayerModel.instance.ingot;
            let VipLevel = VipModel.instance.vipLevel;
            if (gold >= this.grow && VipLevel >= this.vipLevel) {
                InvestRewardCtrl.instance.getBuyInvestReward([2]);//0登录返利1闯关法力2为成长返利
            } else if (VipLevel < this.vipLevel) {
                // SystemNoticeManager.instance.addNotice("VIP等级不足，投资失败！", true);
                let intNum = 0;
                if (modules.vip.VipModel.instance.vipLevel >= 1) {
                    intNum = WindowEnum.VIP_PANEL;
                }
                else {
                    intNum = WindowEnum.VIP_NEW_PANEL;
                }
                let handler: Handler = Handler.create(WindowManager.instance, WindowManager.instance.open, [intNum]);
                CommonUtil.alert("温馨提示", `立即投资需要SVIP${this.vipLevel},是否立即前往提升SVIP`, [handler]);
            } else if (gold < this.grow) {
                SystemNoticeManager.instance.addNotice("代币券不足，投资失败！", true);
            } else {
                SystemNoticeManager.instance.addNotice("投资失败！", true);
            }
        }

        private sortFunc(a: invest_reward, b: invest_reward): number {
            let rewarList: Table<InvestrewardReward> = InvestRewardModel.instance.rewardList;
            let aTaskId: number = a[invest_rewardFields.taskId];
            let bTaskId: number = b[invest_rewardFields.taskId];
            let aGrade: number = a[invest_rewardFields.type];
            let bGrade: number = b[invest_rewardFields.type];

            let aState: number = rewarList[aTaskId] ? rewarList[aTaskId][InvestrewardRewardFields.state] : 0;
            let bState: number = rewarList[bTaskId] ? rewarList[bTaskId][InvestrewardRewardFields.state] : 0;
            aState = aState === 0 ? 1 : aState === 1 ? 0 : aState;
            bState = bState === 0 ? 1 : bState === 1 ? 0 : bState;
            if (aState === bState) {
                return aTaskId - bTaskId;
            } else {
                return aState - bState;
            }
        }
    }
}