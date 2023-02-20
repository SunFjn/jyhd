///<reference path="../config/week_repeat_pay_cfg.ts"/>
///<reference path="./repeat_pay_model.ts"/>
/** 累计充值item */
namespace modules.repeatPay {
    import RepeatPayModel = modules.repeatPay.RepeatPayModel;
    import BaseItem = modules.bag.BaseItem;
    import InvestItemUI = ui.InvestItemUI;
    import CustomClip = modules.common.CustomClip;
    import Item = Protocols.Item;
    import week_accumulateFields = Configuration.week_accumulateFields;
    import week_accumulate = Configuration.week_accumulate;
    import WeekRepeatPayCfg = modules.config.WeekRepeatPayCfg;

    export class RepeatPayItem extends InvestItemUI {

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
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.WEEK_REPEAT_PAY_UPDATE, this, this.updateBtnState);
        }

        public setData(value: Protocols.Pair): void {
            let id: number = this._id = value[Protocols.PairFields.first];
            this._state = value[Protocols.PairFields.second];
            let cfg: week_accumulate = WeekRepeatPayCfg.instance.getCfgById(id);
            let money: number = cfg[week_accumulateFields.money];
            this.investText.innerHTML = `累计充值<span style='color:#ffffff'>&nbsp;${money}元</span>,可领取奖励`;

            let itemDatas: Item[] = CommonUtil.formatItemData(cfg[week_accumulateFields.award]);
            for (let i: int = 0, len: int = this._items.length; i < len; i++) {
                if (i >= itemDatas.length) {
                    this._items[i].visible = false;
                } else {
                    this._items[i].visible = true;
                    this._items[i].dataSource = itemDatas[i];
                }
            }

            this.updateBtnState();

            let currNum: number = RepeatPayModel.instance.money;

            this.scheduleText.text = `(${currNum}/${money})`;
            this.scheduleText.color = currNum >= money ? `#168a17` : `#ff3e3e`;
        }

        private updateBtnState(): void {
            let openState: boolean = RepeatPayModel.instance.state;
            if (openState) {
                if (this._state == operaState.can) {
                    this._btnClip.visible = true;
                    this._btnClip.play();
                    this.sureBtn.skin = `common/17.png`;
                    this.sureBtn.labelColors = `#ffffff`;
                    this.sureBtn.mouseEnabled = true;
                    this.sureBtn.label = "领取";
                    this.sureBtn.pos(482, 64, true);
                } else if (this._state == operaState.cant) {
                    this._btnClip.visible = false;
                    this._btnClip.stop();
                    this.sureBtn.skin = `common/btn_common_an03.png`;
                    this.sureBtn.labelColors = `#ffffff`;
                    this.sureBtn.label = "前往充值";
                    this.sureBtn.mouseEnabled = true;
                    this.sureBtn.pos(482, 64, true);
                } else {
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
            let openState: boolean = RepeatPayModel.instance.state;
            if (openState) {
                if (this._state == operaState.can) {
                    RepeatPayCtrl.instance.getWeekAccumulateAward(this._id);
                } else if (this._state == operaState.cant) {
                    WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                }
            } else {
                CommonUtil.noticeError(ErrorCode.WeekAccumulateNotOpen);
            }
        }

        public destroy(destroyChild: boolean = true): void {

            this._items = this.destroyElement(this._items);
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy(destroyChild);
        }
    }
}