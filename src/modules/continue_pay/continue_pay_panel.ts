///<reference path="../config/continue_pay_cfg.ts"/>
/** 连充豪礼 */
///<reference path="continue_pay_item.ts"/>
namespace modules.continue_pay {
    import ContinueViewUI = ui.ContinueViewUI;
    import CustomList = modules.common.CustomList;
    import ContinePayCfg = modules.config.ContinePayCfg;
    import continue_pay = Configuration.continue_pay;
    import continue_payFields = Configuration.continue_payFields;
    import Event = laya.events.Event;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import ContinuepayReward = Protocols.ContinuepayReward;
    import ContinuepayRewardFields = Protocols.ContinuepayRewardFields;
    import BtnGroup = modules.common.BtnGroup;
    import LayaEvent = modules.common.LayaEvent;

    export class ContinuePanel extends ContinueViewUI {
        private _list: CustomList;
        private _cfgItem: continue_pay;
        private _scienceTabGroup: BtnGroup;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._scienceTabGroup) {
                this._scienceTabGroup.destroy();
                this._scienceTabGroup = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.itemRender = ContinuePayItem;
            // this._list.vCount = 7;
            this._list.hCount = 1;
            this._list.width = 640;
            this._list.height = 703;
            this._list.x = 0;
            this._list.y = 0;
            this.itemPanel.addChild(this._list);
            this.centerX = this.centerY = 0;
            this._scienceTabGroup = new BtnGroup();
            this._scienceTabGroup.setBtns(this.sureBtn1, this.sureBtn2, this.sureBtn3);
            this._scienceTabGroup.selectedIndex = 0;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.CONTINUE_PAY_UPDATE, this, this.updateView);
            this.addAutoListener(this._scienceTabGroup, LayaEvent.CHANGE, this, this.changeswitchBtnTabHandler);
            this.addAutoRegisteRedPoint(this.continueRP1, ["continuePayGrade1RP"]);
            this.addAutoRegisteRedPoint(this.continueRP2, ["continuePayGrade2RP"]);
            this.addAutoRegisteRedPoint(this.continueRP3, ["continuePayGrade3RP"]);
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.activityHandler);
        }

        public onOpened(): void {
            super.onOpened();
            this.updateView();
            this.setPanel();
        }

        /** 充值 档次 切换*/
        private changeswitchBtnTabHandler(): void {
            this.updatePanel(this._scienceTabGroup.selectedIndex);
        }

        private updateView(): void {
            //更新面板状态 和连充事件绑定
            this.setActivitiTime();
            this.setDayMoney();
            // this.setRp();
            this._scienceTabGroup.selectedIndex = ContinuePayModel.instance.getOneTrue();
            this.changeswitchBtnTabHandler();
        }

        private setDayMoney(): void {
            this.priceText.text = `本日已充值${ContinuePayModel.instance.totalMoney}元`;
        }

        private setActivitiTime(): void {
            if (ContinuePayModel.instance.endTime > GlobalData.serverTime) {
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            }
        }

        private activityHandler(): void {
            if (ContinuePayModel.instance.endTime > GlobalData.serverTime) {
                this.activityText.text = `${modules.common.CommonUtil.timeStampToDayHourMinSecond(ContinuePayModel.instance.endTime)}`;
            } else {
                this.activityText.visible = false;
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        // 根据档位更新面板
        private updatePanel(grade: number) {
            let arr = ContinePayCfg.instance.getCfgsByGrade(grade);
            arr = arr.sort(this.sortFunc.bind(this));
            this._list.datas = arr;

            let arrDate = ContinePayCfg.instance.getCfgsByGrade(grade);
            for (var index = 0; index < arrDate.length; index++) {
                var element = arrDate[index];
                if (element[continue_payFields.day] == 5) {
                    element = element;
                    this.payText.value = `${element[continue_payFields.money]}`;
                    //this.payText.blendMode = BlendMode.ADD;
                    this.dayText.value = `${element[continue_payFields.day] + 1}`;
                    let awardArr: Array<Items> = [];
                    awardArr = element[continue_payFields.reward];
                    this.continueBase.dataSource = [awardArr[0][ItemsFields.itemId], awardArr[0][ItemsFields.count], 0, null];
                    return;
                }
            }

            // this.setRp();
        }

        //根据领取状态排序
        private sortFunc(a: continue_pay, b: continue_pay): number {
            let aDay: number = a[continue_payFields.day];
            let bDay: number = b[continue_payFields.day];
            let aGrade: number = a[continue_payFields.grade];
            let bGrade: number = b[continue_payFields.grade];
            let aReward: ContinuepayReward = ContinuePayModel.instance.getRewardByGradeAndDay(aGrade, aDay);
            let bReward: ContinuepayReward = ContinuePayModel.instance.getRewardByGradeAndDay(bGrade, bDay);
            let aState: number = aReward ? aReward[ContinuepayRewardFields.state] : 0;
            let bState: number = bReward ? bReward[ContinuepayRewardFields.state] : 0;

            aState = aState === 0 ? 1 : aState === 1 ? 0 : aState;
            bState = bState === 0 ? 1 : bState === 1 ? 0 : bState;
            if (aState === bState) {
                return aDay - bDay;
            } else {
                return aState - bState;
            }
        }

        //设置进度金额及颜色
        private setPanel(): void {
            let btnMoney: continue_pay[] = [];
            btnMoney = ContinePayCfg.instance.cfgs;
            for (let i: int = 0; i < btnMoney.length; i++) {
                let grade = btnMoney[i][continue_payFields.grade];
                if (grade == 0) {
                    // this.sureBtn1.labelColors = "#465460";
                    this.sureBtn1.label = `${btnMoney[i][continue_payFields.money]}元`;
                } else if (grade == 1) {
                    this.sureBtn2.label = `${btnMoney[i][continue_payFields.money]}元`;
                } else {
                    this.sureBtn3.label = `${btnMoney[i][continue_payFields.money]}元`;
                }
            }

        }
    }
}