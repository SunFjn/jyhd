
namespace modules.everyday_firstpay {
    import EverydayFirstPayAlertUI = ui.EverydayFirstPayAlertUI;
    import BaseItem = modules.bag.BaseItem;
    import CumulatepayReward = Protocols.CumulatepayReward;
    import limitCumulateRewardFields = Protocols.limit_CumulateRewardFields;
    import limit_day_cumulate = Configuration.limit_day_cumulate;
    import limit_day_cumulateFields = Configuration.limit_day_cumulateFields;
    import ItemFields = Protocols.ItemFields;
    export const enum btnType {
        arbitrariness = 0,			/*任意金额按钮*/
        fixed = 1,			/*固定金额按钮*/
    }
    export class EverydayFirstPayPanel extends EverydayFirstPayAlertUI {
        private _arbitrarinessItems: Array<BaseItem>;
        private _fixedItems: Array<BaseItem>;
        private awardId: number;
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._arbitrarinessItems = [this.item1, this.item2, this.item3, this.item4];
            this._fixedItems = [this.award1, this.award2, this.award3, this.award4];
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.EVERYDAY_FIRSTPAY_UPDATE, this, this.updateView);
            this.addAutoListener(this.getArbitrariness, Laya.Event.CLICK, this, this.arbitrarinessHandler);
            this.addAutoListener(this.getFixed, Laya.Event.CLICK, this, this.fixedHandler);
        }
        public onOpened(): void {
            super.onOpened();
            this.updateView();
        }
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }

        public close(): void {
            super.close();
            let openDay = PlayerModel.instance.openDay;
            console.log("OPENDAY", openDay);
        }

        public destroy(): void {
            super.destroy();
        }

        private updateView(): void {
            // 处理奖励列表
            let arrAward = EverydayFirstPayModel.instance.awardList;
            let arr = arrAward[btnType.arbitrariness][limit_day_cumulateFields.reward];
            let arrFixed = arrAward[btnType.fixed][limit_day_cumulateFields.reward];
            for (let i = 0; i < 4; i++) {
                this[`item${i + 1}`].dataSource = [arr[i][ItemFields.ItemId], arr[i][ItemFields.count], 0, null];
            }
            for (let m = 0; m < 4; m++) {
                this[`award${m + 1}`].dataSource = [arrFixed[m][ItemFields.ItemId], arrFixed[m][ItemFields.count], 0, null];
            }

            let stateArr = EverydayFirstPayModel.instance.rewardState;
            switch (stateArr[btnType.arbitrariness]) {
                case 0:
                    this.getArbitrariness.label = "充值任意金额"
                    break;
                case 1:
                    this.getArbitrariness.label = "可领取"
                    break;
                case 2:
                    this.getArbitrariness.label = "已领取"
                    this.getArbitrariness.gray = true;
                    break;
                default:
                    break;
            }
            switch (stateArr[btnType.fixed]) {
                case 0:
                    this.getFixed.label = "充值任意金额"
                    break;
                case 1:
                    this.getFixed.label = "可领取"
                    break;
                case 2:
                    this.getFixed.label = "已领取"
                    this.getFixed.gray = true;
                    break;
                default:
                    break;
            }
        }

        private arbitrarinessHandler() {
            // 使用limit_ctrl里的方法派发消息号
            this.btnCallBack(btnType.arbitrariness);
            let id = EverydayFirstPayModel.instance.awardList[btnType.arbitrariness][limit_day_cumulateFields.id];
            modules.limit.LimitDayCumulateCtrl.instance.GetLimitXunBaoDayCumulatePayReward([LimitBigType.evedayPay, id]);
        }

        private fixedHandler() {
            this.btnCallBack(btnType.fixed);
            
        }

        private btnCallBack(num:number) {
            let stateArr = EverydayFirstPayModel.instance.rewardState;
            let id = EverydayFirstPayModel.instance.awardList[num][limit_day_cumulateFields.id];
            modules.limit.LimitDayCumulateCtrl.instance.GetLimitXunBaoDayCumulatePayReward([LimitBigType.evedayPay, id]);
            switch (stateArr[num]) {
                case 0:
                    SystemNoticeManager.instance.addNotice("未达成领取条件");
                    break;
                case 1:
                    SystemNoticeManager.instance.addNotice("领取成功");
                    break;
                case 2:
                    break;
                default:
                    break;
            }
        }
    }
}
