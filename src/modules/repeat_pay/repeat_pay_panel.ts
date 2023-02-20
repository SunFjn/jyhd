///<reference path="../config/week_repeat_pay_cfg.ts"/>

/** 累计充值---周末狂欢 */
namespace modules.repeatPay {
    import CommonUtil = modules.common.CommonUtil;
    import GlobalData = modules.common.GlobalData;
    import CustomList = modules.common.CustomList;
    import RepeatPayViewUI = ui.RepeatPayViewUI;
    import Event = laya.events.Event;

    export class RepeatPayPanel extends RepeatPayViewUI {

        private _time: number;
        private _state: boolean;
        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = this.centerY = 0;

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 16;
            this._list.y = 298;
            this._list.width = 690;
            this._list.height = 686-11;
            this._list.hCount = 1;
            this._list.itemRender = RepeatPayItem;
            this._list.spaceY = 5;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.WEEK_REPEAT_PAY_UPDATE, this, this.updateView);
            this.addAutoListener(this.okBtn, Event.CLICK, this, this.okBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZHIZUN_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIGHT_TALISMAN_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MONEY_CAT_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GLOVES_INFO_UPDATE, this, this.showUI);
        }

        public onOpened(): void {
            super.onOpened();

            this.updateView();
            this.showUI();
        }
        public showUI() {
            // 战力护符>辅助装备>招财仙猫>至尊特权
            this.okBtn.visible = true;
            this.wanChengImg.visible = false;
            if (!modules.fight_talisman.FightTalismanModel.instance.state) { //战力护符
                this.tipsImg.skin = `kuanghuan/txt_qmkh_03.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(76, 1044-11);
            }
            else if (modules.gloves.GlovesModel.instance.state == -1) {//辅助装备
                this.tipsImg.skin = `kuanghuan/txt_qmkh_05.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(85, 1058-11);
            }

            else if (!modules.money_cat.MoneyCatModel.instance.state) {//招财猫
                this.tipsImg.skin = `kuanghuan/txt_qmkh_02.png`;
                this.tipsText.text = `代币券不够花？`;
                this.tipsImg.pos(99, 1040-11);
            }
            else if (modules.zhizun.ZhizunModel.instance.state == 0) {//自尊
                this.tipsImg.skin = `kuanghuan/txt_qmkh_01.png`;
                this.tipsText.text = `火速升级,首选特权卡`;
                this.tipsImg.pos(99, 1040-11);
            }
            else {
                this.okBtn.visible = false;
                this.wanChengImg.visible = true;
                this.tipsImg.skin = `kuanghuan/txt_qmkh_01.png`;
                this.tipsText.text = `火速升级,首选特权卡`;
                this.tipsImg.pos(99, 1040-11);
            }
        }
        public okBtnHandler() {
            if (modules.first_pay.FirstPayModel.instance.giveState == 0) {
                WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);
                return;
            }
            if (!modules.fight_talisman.FightTalismanModel.instance.state) { //战力护符
                WindowManager.instance.open(WindowEnum.FIGHT_TALISMAN_BUY_ALERT);
            }
            else if (modules.gloves.GlovesModel.instance.state == -1) {//辅助装备
                WindowManager.instance.open(WindowEnum.GLOVES_BUY_ALERT);
            }
            else if (!modules.money_cat.MoneyCatModel.instance.state) {//招财猫
                WindowManager.instance.open(WindowEnum.MONEY_CAT_BUY_ALERT);
            }
            else if (modules.zhizun.ZhizunModel.instance.state == 0) {//自尊
                WindowManager.instance.open(WindowEnum.ZHIZUN_PANEL);
            }
        }

        private updateView(): void {
            let list: Array<Protocols.Pair> = RepeatPayModel.instance.list;
            if (!list) return;

            this._time = RepeatPayModel.instance.time;
            this._state = RepeatPayModel.instance.state;
            this.loopHandler();
            if (this._state) {
                Laya.timer.loop(1000, this, this.loopHandler);
            } else return;
            this.items = list;
        }

        private set items(list: Array<Protocols.Pair>) {
            list = list.sort(this.sortFunc.bind(this));
            this._list.datas = list;
        }

        private sortFunc(l: Protocols.Pair, r: Protocols.Pair): number {
            let lState: operaState = l[Protocols.PairFields.second];
            let rState: operaState = r[Protocols.PairFields.second];
            let lId: number = l[Protocols.PairFields.first];
            let rId: number = r[Protocols.PairFields.first];
            return lState > rState ? -1 : lState < rState ? 1 : CommonUtil.smallToBigSort(lId, rId);
        }

        private loopHandler(): void {
            if (this._state) {
                this.timeTxt.visible = true;
                this.timeTxt.text = CommonUtil.timeStampToDayHourMin(this._time);
                this.tipTxt.text = `活动倒计时:`;
                this.tipTxt.color = `#ffffff`;
            } else {
                this.timeTxt.visible = false;
                this.tipTxt.text = `活动已结束`;
                this.tipTxt.color = `#ff3e3e`;
                Laya.timer.clear(this, this.loopHandler);
            }
        }

        public destroy(): void {

            this._list = this.destroyElement(this._list);
            super.destroy();
        }
    }
}