///<reference path="../config/week_single_pay_cfg.ts"/>
/** 单笔充值item */
namespace modules.singlePay {
    import BaseItem = modules.bag.BaseItem;
    import InvestItemUI = ui.InvestItemUI;
    import week_single_pay = Configuration.week_single_pay;
    import WeekSinglePayCfg = modules.config.WeekSinglePayCfg;
    import week_single_payFields = Configuration.week_single_payFields;
    import recharge = Configuration.recharge;
    import RechargeCfg = modules.config.RechargeCfg;
    import rechargeFields = Configuration.rechargeFields;
    import CustomClip = modules.common.CustomClip;
    import Item = Protocols.Item;

    export class SinglePayItem extends InvestItemUI {

        private _items: BaseItem[];
        private _btnClip: CustomClip;
        private _id: number;
        private _state: operaState;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.investText.color = "#ffffff";
            this.investText.style.fontFamily = "SimHei";
            this.investText.style.fontSize = 26;

            this._items = [this.investBase1, this.investBase2, this.investBase3, this.investBase4];

            this._btnClip = CommonUtil.creatEff(this.sureBtn, `btn_light`, 15);
            this._btnClip.pos(-6, -14, true);
            this._btnClip.scale(1, 0.9, true);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.sureBtn, common.LayaEvent.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.WEEK_SINGLE_PAY_UPDATE, this, this.updateBtnState);
        }

        public setData(value: Protocols.ThreeNumber): void {
            let id: number = this._id = value[Protocols.ThreeNumberFields.v1];
            let count: number = value[Protocols.ThreeNumberFields.v2];
            let num: number = value[Protocols.ThreeNumberFields.v3];
            let cfg: week_single_pay = WeekSinglePayCfg.instance.getCfgById(id);
            let maxCount: number = cfg[week_single_payFields.count];
            this._state = SinglePayModel.instance.judgeState(id, count, num);
            let grade: number = cfg[week_single_payFields.index];
            let payCfg: recharge = RechargeCfg.instance.getRecharCfgByIndex(grade);
            let needNum: number = payCfg[rechargeFields.price];
            this.investText.innerHTML = `单笔充值<span style='color:#ffffff'>&nbsp;${needNum}元</span>,可领取奖励`;

            let itemDatas: Item[] = CommonUtil.formatItemData(cfg[week_single_payFields.award]);
            for (let i: int = 0, len: int = this._items.length; i < len; i++) {
                if (i >= itemDatas.length) {
                    this._items[i].visible = false;
                } else {
                    this._items[i].visible = true;
                    this._items[i].dataSource = itemDatas[i];
                }
            }

            this.updateBtnState();

            if (maxCount == 1) {
                this.tipBox.visible = false;
            } else {
                let yetCount: number = maxCount;
                yetCount = num - count;
                this.tipBox.visible = true;
                this.tipTxt.text = `${maxCount - yetCount}/${maxCount}`;
                this.tipTxt.color = maxCount - yetCount ? `#168a17` : `#ff3e3e`;
            }
        }

        private updateBtnState(): void {
            let openState: boolean = SinglePayModel.instance.state;
            if (openState) {
                if (this._state == operaState.can) {
                    this.scheduleText.text = `(1/1)`;
                    this.scheduleText.color = `#168a17`;
                    this._btnClip.visible = true;
                    this._btnClip.play();
                    this.sureBtn.skin = `common/17.png`;
                    this.sureBtn.labelColors = `#ffffff`;
                    this.sureBtn.mouseEnabled = true;
                    this.sureBtn.label = "领取";
                    this.sureBtn.pos(482, 64, true);
                } else if (this._state == operaState.cant) {
                    this.scheduleText.text = `(0/1)`;
                    this.scheduleText.color = `#ff3e3e`;
                    this._btnClip.visible = false;
                    this._btnClip.stop();
                    this.sureBtn.skin = `common/btn_common_an03.png`;
                    this.sureBtn.labelColors = `#ffffff`;
                    this.sureBtn.label = "前往充值";
                    this.sureBtn.mouseEnabled = true;
                    this.sureBtn.pos(482, 64, true);
                } else {
                    this.scheduleText.text = `(1/1)`;
                    this.scheduleText.color = `#168a17`;
                    this._btnClip.visible = false;
                    this._btnClip.stop();
                    this.sureBtn.skin = `common/txt_commmon_ylq.png`;
                    this.sureBtn.mouseEnabled = false;
                    this.sureBtn.label = ``;
                    this.sureBtn.pos(505, 64, true);
                }
            } else {
                this._btnClip.visible = false;
                this._btnClip.stop();
                this.sureBtn.skin = `common/txt_commmon_yjies.png`;
                this.sureBtn.mouseEnabled = false;
                this.sureBtn.label = ``;
                this.sureBtn.pos(505, 64, true);
            }
        }

        private sureBtnHandler(): void {
            let openState: boolean = SinglePayModel.instance.state;
            if (openState) {
                if (this._state == operaState.can) {
                    SinglePayCtrl.instance.getWeekSinglePayAward(this._id);
                } else if (this._state == operaState.cant) {
                    WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                }
            } else {
                CommonUtil.noticeError(ErrorCode.WeekSinglePayNotOpen);
            }
        }

        public destroy(destroyChild: boolean = true): void {

            this._items = this.destroyElement(this._items);
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy(destroyChild);
        }
    }
}