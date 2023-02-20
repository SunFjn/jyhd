///<reference path="../config/week_consume_cfg.ts"/>

namespace modules.weekConsume {
    import WeekConsumeCfg = modules.config.WeekConsumeCfg;
    import week_consume = Configuration.week_consume;
    import week_consumeFields = Configuration.week_consumeFields;
    import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    import item_material = Configuration.item_material;
    import item_materialFields = Configuration.item_materialFields;
    import CustomList = modules.common.CustomList;
    import ThreeNumber = Protocols.ThreeNumber;
    import Event = laya.events.Event;
    export class WeekConsumePanel extends ui.WeekConsumeUI {
        private _list: CustomList;      //活动列表

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.centerX = 0;
            this.centerY = 0;
            this._list = new CustomList();
            this._list.width = 640;
            this._list.height = 682 - 11;
            this._list.hCount = 1;
            this._list.spaceX = 0;
            this._list.spaceY = 6;
            this._list.x = 40;
            this._list.y = 298;
            this._list.itemRender = WeekConsumeItem;
            this.addChildAt(this._list, 4);
        }

        protected onOpened(): void {
            super.onOpened();
            WeekConsumeCtrl.instance.getWeekConsume();
            this.showUI();
        }
        public showUI() {
            // 按招财仙猫>至尊特权>战力护符>辅助装备的优先级
            this.okBtn.visible = true;
            this.wanChengImg.visible = false;

            if (!modules.money_cat.MoneyCatModel.instance.state) {//招财猫
                this.tipsImg.skin = `kuanghuan/txt_qmkh_02.png`;
                this.tipsText.text = `代币券不够花？`;
                this.tipsImg.pos(99, 1040 - 11);
            }
            else if (modules.zhizun.ZhizunModel.instance.state == 0) {//自尊
                this.tipsImg.skin = `kuanghuan/txt_qmkh_01.png`;
                this.tipsText.text = `火速升级,首选特权卡`;
                this.tipsImg.pos(99, 1040 - 11);
            }

            else if (!modules.fight_talisman.FightTalismanModel.instance.state) { //战力护符
                this.tipsImg.skin = `kuanghuan/txt_qmkh_03.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(76, 1044 - 11);
            }

            else if (modules.gloves.GlovesModel.instance.state == -1) {
                this.tipsImg.skin = `kuanghuan/txt_qmkh_05.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(85, 1058 - 11);
            }
            else {
                this.okBtn.visible = false;
                this.wanChengImg.visible = true;
                this.tipsImg.skin = `kuanghuan/txt_qmkh_03.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(76, 1044 - 11);
            }
        }
        public okBtnHandler() {
            if (modules.first_pay.FirstPayModel.instance.giveState == 0) {
                WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);
                return;
            }
            //   按招财仙猫>至尊特权>战力护符>辅助装备的优先级
            if (!modules.money_cat.MoneyCatModel.instance.state) {//招财猫
                WindowManager.instance.open(WindowEnum.MONEY_CAT_BUY_ALERT);
            }
            else if (modules.zhizun.ZhizunModel.instance.state == 0) {//自尊
                WindowManager.instance.open(WindowEnum.ZHIZUN_PANEL);
            }
            else if (!modules.fight_talisman.FightTalismanModel.instance.state) {
                WindowManager.instance.open(WindowEnum.FIGHT_TALISMAN_BUY_ALERT);
            }
            else if (modules.gloves.GlovesModel.instance.state == -1) { //辅助装备
                WindowManager.instance.open(WindowEnum.GLOVES_BUY_ALERT);
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.WEEK_CONSUME_UPDATE, this, this.refresh);       //画面刷新事件
            this.addAutoListener(this.okBtn, Event.CLICK, this, this.okBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZHIZUN_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIGHT_TALISMAN_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MONEY_CAT_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GLOVES_INFO_UPDATE, this, this.showUI);
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.activityHandler);
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }

        private setActivitiTime(): void {
            Laya.timer.clear(this, this.activityHandler);
            if (WeekConsumeModel.instance.time >= GlobalData.serverTime &&
                WeekConsumeModel.instance.state) {
                //this.timeLeft.color = "#ffffff";
                this.timeLeft.visible = true;
                this.activityText.text = "活动倒计时:";
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.activityText.color = "#FF3e3e";
                this.timeLeft.visible = false;
                this.activityText.text = "活动已结束";
            }
        }

        private activityHandler(): void {
            //console.log("当前时间： "+GlobalData.serverTime);
            //console.log("活动时间： "+WeekConsumeModel.instance.time);
            this.timeLeft.text = `${CommonUtil.timeStampToDayHourMin(WeekConsumeModel.instance.time)}`;
            if (WeekConsumeModel.instance.time < GlobalData.serverTime) {
                this.activityText.color = "#FF3e3e";
                this.timeLeft.visible = false;
                this.activityText.text = "活动已结束";
                GlobalData.dispatcher.event(CommonEventType.WEEK_CONSUME_ITEM_UPDATE);      //让Item更新
                Laya.timer.clear(this, this.activityHandler);
            }
        }

        private refresh(): void {
            this.setActivitiTime();
            let arr: Array<ThreeNumber> = WeekConsumeModel.instance.arr;
            //let arr:Array<ThreeNumber>=[[1001,0,3000],[1002,0,3000],[1003,0,3000],[1001,1,3000],[1002,1,3000],[1003,1,3000],[1001,2,3000],[1002,2,3000],[1003,2,3000]];
            if (arr.length > 0) {
                //排序[id,状态：0不可领，1可领，2已领,消费代币券数]
                arr.sort((a: ThreeNumber, b: ThreeNumber) => {
                    if (a[1] == b[1]) {
                        return a[0] - b[0];
                    }
                    else if (a[1] == 1) { return -1; }
                    else if (a[1] == 2) { return 1; }
                    else if (b[1] == 1) { return 1; }
                    else { return -1; }
                });
                this._list.datas = arr;
            }
            else { GlobalData.dispatcher.event(CommonEventType.WEEK_CONSUME_ITEM_UPDATE); }        //如果活动结束，item按钮替换成已结束
        }
    }
}