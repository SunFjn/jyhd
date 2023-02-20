///<reference path="../config/day_consume_reward_cfg.ts"/>
///<reference path="../day_consume_reward/day_consume_reward_model.ts"/>
///<reference path="../day_consume_reward/day_consume_reward_ctrl.ts"/>
/** 消费赠礼（日更） */
namespace modules.day_consume_reward {
    import DayConsumeRewardViewUI = ui.DayConsumeRewardViewUI;
    import CustomList = modules.common.CustomList;
    import DayConsumeRewardCfg = modules.config.DayConsumeRewardCfg;
    import consume_reward2 = Configuration.consume_reward2;
    import ConsumerewardRewardFields = Protocols.ConsumerewardRewardFields;
    import ConsumerewardReward = Protocols.ConsumerewardReward;
    import DayConsumeRewardModel = modules.day_consume_reward.DayConsumeRewardModel;
    import DayConsumeRewardCtrl = modules.day_consume_reward.DayConsumeRewardCtrl;
    import Event = laya.events.Event;

    export class DayConsumeRewardPanel extends DayConsumeRewardViewUI {
        private _list: CustomList;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            //用于设置控件属性 或者创建新控件
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.itemRender = DayConsumeRewardItem;
            this._list.vCount = 6;
            this._list.hCount = 1;
            this._list.width = 640;
            this._list.height = 650;
            this._list.x = 40;
            this._list.y = 317;
            this.addChild(this._list);
            this.centerX = this.centerY = 0;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DAY_CONSUME_REWARD_UPDATE, this, this._updateView);
            this.addAutoListener(this.okBtn, Event.CLICK, this, this.okBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZHIZUN_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FIGHT_TALISMAN_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MONEY_CAT_UPDATE, this, this.showUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GLOVES_INFO_UPDATE, this, this.showUI);
        }

        public onOpened(): void {
            super.onOpened();
            if (DayConsumeRewardModel.instance.giveState == 1) {
                DayConsumeRewardCtrl.instance.GetConsumeReward2Info();
                this._updateView();
            }
            this.showUI();
        }
        public showUI() {
            //  按招财仙猫>至尊特权>战力护符>辅助装备的优先级
            this.okBtn.visible = true;
            this.wanChengImg.visible = false;

            if (!modules.money_cat.MoneyCatModel.instance.state) {//招财猫
                this.tipsImg.skin = `kuanghuan/txt_qmkh_02.png`;
                this.tipsText.text = `代币券不够花？`;
                this.tipsImg.pos(99, 1040-11);
            }
            else if (modules.zhizun.ZhizunModel.instance.state == 0) {//自尊
                this.tipsImg.skin = `kuanghuan/txt_qmkh_01.png`;
                this.tipsText.text = `火速升级,首选特权卡`;
                this.tipsImg.pos(99, 1040-11);
            }
            else if (!modules.fight_talisman.FightTalismanModel.instance.state) { //战力护符
                this.tipsImg.skin = `kuanghuan/txt_qmkh_03.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(76, 1044-11);
            }
            else if (modules.gloves.GlovesModel.instance.state == -1) { //辅助装备
                this.tipsImg.skin = `kuanghuan/txt_qmkh_05.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(85, 1058-11);
            }
            else {
                this.okBtn.visible = false;
                this.wanChengImg.visible = true;
                this.tipsImg.skin = `kuanghuan/txt_qmkh_03.png`;
                this.tipsText.text = `战力成长慢`;
                this.tipsImg.pos(76, 1044-11);
            }
        }
        public okBtnHandler() {
            if (modules.first_pay.FirstPayModel.instance.giveState == 0) {
                WindowManager.instance.open(WindowEnum.FIRST_PAY_PANEL);
                return;
            }
            //    按招财仙猫>至尊特权>战力护符>辅助装备的优先级
            if (!modules.money_cat.MoneyCatModel.instance.state) {//招财猫
                WindowManager.instance.open(WindowEnum.MONEY_CAT_BUY_ALERT);
            }
            else if (modules.zhizun.ZhizunModel.instance.state == 0) {//自尊
                WindowManager.instance.open(WindowEnum.ZHIZUN_PANEL);
            }
            else if (!modules.fight_talisman.FightTalismanModel.instance.state) { //战力护符
                WindowManager.instance.open(WindowEnum.FIGHT_TALISMAN_BUY_ALERT);
            }
            else if (modules.gloves.GlovesModel.instance.state == -1) { //辅助装备
                WindowManager.instance.open(WindowEnum.GLOVES_BUY_ALERT);
            }
        }
        private sortFunc(a: consume_reward2, b: consume_reward2): number {
            let table: Array<ConsumerewardReward> = DayConsumeRewardModel.instance.rewarTable;
            let aID: number = a[ConsumerewardRewardFields.id];
            let bID: number = b[ConsumerewardRewardFields.id];
            //1 可  0不可 2领完
            let aState: int = table[aID] ? table[aID][ConsumerewardRewardFields.state] : 0;
            let bState: int = table[bID] ? table[bID][ConsumerewardRewardFields.state] : 0;
            // 交换0跟1状态，方便排序（可领》不可领》已领）
            aState = aState === 0 ? 1 : aState === 1 ? 0 : aState;
            bState = bState === 0 ? 1 : bState === 1 ? 0 : bState;
            if (aState - bState === 0) {      // 状态相同时按ID排
                return aID - bID;
            }
            return aState - bState;
        }

        private _updateView(): void {
            this.setActivitiTime();
            let serverDay = DayConsumeRewardModel.instance.serverDay;
            serverDay = serverDay == 0 ? 1 : serverDay;
            // if (serverDay != 0) {
            let arr: Array<consume_reward2> = DayConsumeRewardCfg.instance.getCfgByServerDay(serverDay);
            arr.sort(this.sortFunc);
            this._list.datas = arr;
            // }
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.activityHandler);
        }

        private setActivitiTime(): void {
            this.activityHandler();
            Laya.timer.loop(1000, this, this.activityHandler);
        }

        private activityHandler(): void {
            this.activityText.text = `${modules.common.CommonUtil.timeStampToHHMMSS(DayConsumeRewardModel.instance.activityTime)}`;
            if (DayConsumeRewardModel.instance.activityTime < GlobalData.serverTime) {
                Laya.timer.clear(this, this.activityHandler);
            }
        }
    }
}