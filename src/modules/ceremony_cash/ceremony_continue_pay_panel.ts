/** 连充豪礼 */
namespace modules.ceremony_cash {
    import CeremonyContinueViewUI = ui.CeremonyContinueViewUI;
    import CustomList = modules.common.CustomList;
    import celebration_continue_pay = Configuration.celebration_continue_pay;
    import celebration_continue_payFields = Configuration.celebration_continue_payFields;
    import Event = laya.events.Event;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import CeremonyContinuepayReward = Protocols.CeremonyContinuepayReward;
    import CeremonyContinuepayRewardFields = Protocols.CeremonyContinuepayRewardFields;
    import BtnGroup = modules.common.BtnGroup;
    import LayaEvent = modules.common.LayaEvent;

    export class CeremonyContinuePayPanel extends CeremonyContinueViewUI {
        private _list: CustomList;
        private _cfgItem: celebration_continue_pay;
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
            this._list.itemRender = CeremonyContinuePayItem;
            // this._list.vCount = 7;
            this._list.hCount = 1;
            this._list.width = 640;
            this._list.height = 703;
            this._list.x = 0;
            this._list.y = 0;
            this.itemPanel.addChild(this._list);
            this.centerX = this.centerY = 0;
            this._scienceTabGroup = new BtnGroup();
            this._scienceTabGroup.setBtns(this.sureBtn0, this.sureBtn1, this.sureBtn2, this.sureBtn3, this.sureBtn4, this.sureBtn5);
            this._scienceTabGroup.selectedIndex = 0;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.CEREMONY_CONTINUE_PAY_UPDATE, this, this.updateView);
            this.addAutoListener(this._scienceTabGroup, LayaEvent.CHANGE, this, this.changeswitchBtnTabHandler);
            this.addAutoRegisteRedPoint(this.continueRP0, ["ceremonyContinuePayGrade0RP"]);
            this.addAutoRegisteRedPoint(this.continueRP1, ["ceremonyContinuePayGrade1RP"]);
            this.addAutoRegisteRedPoint(this.continueRP2, ["ceremonyContinuePayGrade2RP"]);
            // this.addAutoRegisteRedPoint(this.continueRP3, ["ceremonyContinuePayGrade3RP"]);
            // this.addAutoRegisteRedPoint(this.continueRP4, ["ceremonyContinuePayGrade4RP"]);
            // this.addAutoRegisteRedPoint(this.continueRP5, ["ceremonyContinuePayGrade5RP"]);
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
            this._scienceTabGroup.selectedIndex = CeremonyContinuePayModel.instance.getOneTrue();
            this.changeswitchBtnTabHandler();
        }

        private setDayMoney(): void {
            this.priceText.text = `本日已充值${CeremonyContinuePayModel.instance.totalMoney}元`;
        }

        private setActivitiTime(): void {
            if (CeremonyContinuePayModel.instance.endTime > GlobalData.serverTime) {
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.activityText.color = "#FF3e3e";
                this.activityText.text = "活动已结束";
            }
        }

        private activityHandler(): void {
            if (CeremonyContinuePayModel.instance.endTime > GlobalData.serverTime) {
                this.activityText.color = "#2ad200";
                this.activityText.text = `${modules.common.CommonUtil.timeStampToDayHourMinSecond(CeremonyContinuePayModel.instance.endTime)}`;
            } else {
                this.activityText.color = "#FF3e3e";
                this.activityText.text = "活动已结束";
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        // 根据档位更新面板
        private updatePanel(grade: number) {
            let arr = CeremonyContinePayCfg.instance.getCfgsByGrade(grade);
            arr = arr.sort(this.sortFunc.bind(this));
            this._list.datas = arr;

            let arrDate = CeremonyContinePayCfg.instance.getCfgsByGrade(grade);
            for (var index = 0; index < arrDate.length; index++) {
                var element = arrDate[index];
                if (element[celebration_continue_payFields.serverDay] == 5) {
                    element = element;
                    this.payText.value = `${element[celebration_continue_payFields.money]}`;
                    //this.payText.blendMode = BlendMode.ADD;
                    this.dayText.value = `${element[celebration_continue_payFields.serverDay] + 1}`;
                    let awardArr: Array<Items> = [];
                    awardArr = element[celebration_continue_payFields.reward];
                    this.continueBase.dataSource = [awardArr[0][ItemsFields.itemId], awardArr[0][ItemsFields.count], 0, null];
                    return;
                }
            }

            // this.setRp();
        }

        //根据领取状态排序
        private sortFunc(a: celebration_continue_pay, b: celebration_continue_pay): number {
            let aDay: number = a[celebration_continue_payFields.serverDay];
            let bDay: number = b[celebration_continue_payFields.serverDay];
            let aGrade: number = a[celebration_continue_payFields.grade];
            let bGrade: number = b[celebration_continue_payFields.grade];
            let aReward: CeremonyContinuepayReward = CeremonyContinuePayModel.instance.getRewardByGradeAndDay(aGrade, aDay);
            let bReward: CeremonyContinuepayReward = CeremonyContinuePayModel.instance.getRewardByGradeAndDay(bGrade, bDay);
            let aState: number = aReward ? aReward[CeremonyContinuepayRewardFields.state] : 0;
            let bState: number = bReward ? bReward[CeremonyContinuepayRewardFields.state] : 0;

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
            // let btnMoney: celebration_continue_pay[] = [];
            // btnMoney = CeremonyContinePayCfg.instance.cfgs;
            // for (let i: int = 0; i < btnMoney.length; i++) {
            //     let grade = btnMoney[i][celebration_continue_payFields.grade];
            //     this._scienceTabGroup.btns[grade]['label'] = `${btnMoney[i][celebration_continue_payFields.money]}元`;
            // }

            /**
             *数字说明
             *
             *@10 ui上第一个按钮x
             *@118 按钮宽+与前一按钮距离
             *@59 118/2
             *@100 ui上第一个红点x
             */
            let moneyList: Array<number> = CeremonyContinePayCfg.instance.moneyList;
            let first_btn_x = (this._scienceTabGroup.btns.length - moneyList.length) * 59 + 10;
            let first_rp_x = (this._scienceTabGroup.btns.length - moneyList.length) * 59 + 100;
            let continueRPGroup = [this.continueRP0, this.continueRP1, this.continueRP2];
            console.log('vtz:btnMoney', moneyList);
            console.log('vtz:this._scienceTabGroup.btns', this._scienceTabGroup.btns);
            for (let i = 0; i < this._scienceTabGroup.btns.length; i++) {
                if (typeof moneyList[i] != "undefined") {
                    this._scienceTabGroup.btns[i]['label'] = `${moneyList[i]}元`;
                    this._scienceTabGroup.btns[i].visible = true;
                    this._scienceTabGroup.btns[i].x = i * 118 + first_btn_x;
                    continueRPGroup[i].x = i * 118 + first_rp_x;
                }
                else {
                    this._scienceTabGroup.btns[i].visible = false;
                }
            }

        }
    }
}