///<reference path="./single_pay_model.ts"/>
///<reference path="./single_pay_item.ts"/>
///<reference path="../config/week_single_pay_cfg.ts"/>

/** 单笔充值---周末狂欢 */
namespace modules.singlePay {
    import SinglePayItem = modules.singlePay.SinglePayItem;
    import CommonUtil = modules.common.CommonUtil;
    import SinglePayModel = modules.singlePay.SinglePayModel;
    import GlobalData = modules.common.GlobalData;
    import SinglePayViewUI = ui.SinglePayViewUI;
    import CustomList = modules.common.CustomList;
    import Event = laya.events.Event;

    export class SinglePayPanel extends SinglePayViewUI {

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
            this._list.y = 302;
            this._list.width = 690;
            this._list.height = 677-11;
            this._list.hCount = 1;
            this._list.itemRender = SinglePayItem;
            this._list.spaceY = 5;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.okBtn, Event.CLICK, this, this.okBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZHIZUN_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIGHT_TALISMAN_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MONEY_CAT_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GLOVES_INFO_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.WEEK_SINGLE_PAY_UPDATE, this, this.updateView);
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
            let list: Array<Protocols.ThreeNumber> = SinglePayModel.instance.list;
            if (!list) return;

            this._time = SinglePayModel.instance.time;
            this._state = SinglePayModel.instance.state;
            this.loopHandler();
            if (this._state) {
                Laya.timer.loop(1000, this, this.loopHandler);
            } else return;
            this.items = list;
        }

        private set items(list: Array<Protocols.ThreeNumber>) {
            list = list.sort(this.sortFunc.bind(this));
            this._list.datas = list;
        }

        private sortFunc(l: Protocols.ThreeNumber, r: Protocols.ThreeNumber): number {
            let lId: number = l[Protocols.ThreeNumberFields.v1];
            let rId: number = r[Protocols.ThreeNumberFields.v1];
            let lCount: number = l[Protocols.ThreeNumberFields.v2];
            let rCount: number = r[Protocols.ThreeNumberFields.v2];
            let lNum: number = l[Protocols.ThreeNumberFields.v3];
            let rNum: number = r[Protocols.ThreeNumberFields.v3];
            let lState: operaState = SinglePayModel.instance.judgeState(lId, lCount, lNum);
            let rState: operaState = SinglePayModel.instance.judgeState(rId, rCount, rNum);
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

        public close(): void {
            super.close();
        }
    }
}