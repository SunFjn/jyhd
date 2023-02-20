///<reference path="../config/everyday_rebate_cfg.ts"/>
/**
 * 天天返利 （封神榜）
 */
namespace modules.every_day_rebate {
    import BaseItem = modules.bag.BaseItem;
    import Event = Laya.Event;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import BagUtil = modules.bag.BagUtil;
    import Item = Protocols.Item;
    import Items = Configuration.Items;
    import everyday_rebate = Configuration.everyday_rebate;
    import everyday_rebateFields = Configuration.everyday_rebateFields;
    import EverydayRebateNodeFields = Protocols.EverydayRebateNodeFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import LayaEvent = modules.common.LayaEvent;

    export class EveryDayRebateItem extends ui.EveryDayreBateItemUI {
        private _taskBase: Array<BaseItem>;
        private _btnClip: CustomClip;//按钮特效
        private _Datas: everyday_rebate;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._taskBase = [this.continueBase1, this.continueBase2];

            this.StatementHTML.color = "#585858";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 26;
            this.StatementHTML.style.align = "left";

            this.creatEffect();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.sureBtnHandler);
        }

        protected setData(value: everyday_rebate): void {
            super.setData(value);
            this._Datas = value;
            this.showUI();
        }

        public sureBtnHandler() {
            let shuju = this._Datas;
            let state = 0;
            let _PaySingleFSReward = EveryDayRebateModel.instance.nodeList[shuju[everyday_rebateFields.day]];
            if (_PaySingleFSReward) {
                state = _PaySingleFSReward[EverydayRebateNodeFields.state]
            }
            if (state == 1) {
                let items: Array<Item> = [];
                let rewards = this._Datas[everyday_rebateFields.reward];
                if (rewards) {
                    for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                        let item: Items = rewards[i];
                        items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                    }
                    //通过传入需要领取的道具判断有没有背包满了
                }
                if (BagUtil.canAddItemsByBagIdCount(items)) {
                    //钱够  发送购买请求
                    let day = this._Datas[everyday_rebateFields.day];
                    EveryDayRebateCtrl.instance.GetEverydayRebateReward(day);
                }
            } else {
                WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                this.close();
            }

        }

        public showUI() {
            let day = this._Datas[everyday_rebateFields.day];
            this.StatementHTML.innerHTML = `累计充值<span style='color:#e0b75f'>${day}</span>天`;
            for (var index = 0; index < this._taskBase.length; index++) {
                let element = this._taskBase[index];
                element.visible = false;
            }
            let rewards = this._Datas[everyday_rebateFields.reward];
            for (var index = 0; index < rewards.length; index++) {
                let element = rewards[index];
                let _taskBase: BaseItem = this._taskBase[index];
                if (_taskBase) {
                    _taskBase.dataSource = [rewards[index][ItemsFields.itemId], rewards[index][ItemsFields.count], 0, null];
                    _taskBase.visible = true;
                }
            }
            this.setBtnSure();
        }

        public setBtnSure() {
            let shuju = this._Datas;
            let state = 0;
            let _PaySingleFSReward = EveryDayRebateModel.instance.nodeList[shuju[everyday_rebateFields.day]];
            if (_PaySingleFSReward) {
                state = _PaySingleFSReward[EverydayRebateNodeFields.state]
            }
            let openState = FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.everydayRebate);
            if (openState) {
                if (state == 0) {
                    this.sureBtn.skin = "common/btn_tongyong_24.png";
                    this.sureBtn.labelColors = "#ffffff, #ffffff, #ffffff, #ffffff";
                    this.sureBtn.label = "前往充值";
                    this.sureBtn.visible = true;
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                    this.receivedImg.visible = false;
                } else if (state == 1) {
                    this.sureBtn.skin = "common/btn_tongyong_23.png";
                    this.sureBtn.labelColors = "#ffffff, #ffffff, #ffffff, #ffffff";
                    this.sureBtn.label = "领取";
                    this.sureBtn.visible = true;
                    this._btnClip.play();
                    this._btnClip.visible = true;
                    this.receivedImg.visible = false;
                } else {
                    this._btnClip.stop();
                    this._btnClip.visible = false;
                    this.sureBtn.visible = false;
                    this.receivedImg.visible = true;
                }
            } else {
                this._btnClip.stop();
                this._btnClip.visible = false;
                this.sureBtn.visible = false;
                this.receivedImg.visible = false;
            }

        }

        public destroy(destroyChild: boolean = true): void {
            this._btnClip = this.destroyElement(this._btnClip);
            this._taskBase = this.destroyElement(this._taskBase);
            super.destroy(destroyChild);
        }

        /**
         * 初始化 按钮特效
         */
        private creatEffect(): void {
            // this._btnClip = new CustomClip();
            // this._btnClip.skin = "assets/effect/btn_light.atlas";
            // this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
            //     "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
            //     "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            // this._btnClip.durationFrame = 5;
            // this._btnClip.loop = true;
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16, false);
            this.sureBtn.addChild(this._btnClip);
            this._btnClip.pos(-6, -16, true);
            this._btnClip.scale(0.9, 1);
            this._btnClip.visible = false;
        }
    }
}
