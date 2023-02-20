/////<reference path="../$.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_model.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_model.ts"/>
namespace modules.yunmeng {
    import Event = Laya.Event;
    import YunMengMiJingModel = modules.yunmeng.YunMengMiJingModel;
    import DungeonModel = modules.dungeon.DungeonModel;
    import CopySceneState = Protocols.CopySceneState;
    import CopySceneStateFields = Protocols.CopySceneStateFields;
    import YunMengMiJingInformationViewUI = ui.YunMengMiJingInformationViewUI;

    export class YunMengMiJingInformationPanel extends YunMengMiJingInformationViewUI {
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.right = 7;
            this.bottom = 465;
            this.closeByOthers = false;
            this.layer = ui.Layer.MAIN_UI_LAYER;
        }

        protected addListeners(): void {
            super.addListeners();
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.DAY_DROP_TREASURE_GATHERCOUNT_UPDATE, this, this.setValueTxt1);
            // this.addAutoListener(GlobalData.dispatcher, CommonEventType.DAY_DROP_TREASURE_UADATETIME_UPDATE, this, this.updateTime);
            this.getBtn.on(Event.CLICK, this, this.getBtnHandler);
            this.addBtn.on(Event.CLICK, this, this.addBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.YUNMENGMIJING_UPDATE, this, this.setValueTxt1);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_SCENE_STATE_UPDATE, this, this.loopHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this.getBtn.off(Event.CLICK, this, this.getBtnHandler);
            this.addBtn.off(Event.CLICK, this, this.addBtnHandler);
        }

        public onOpened(): void {
            YunMengMiJingCtrl.instance.GetCloudland();
            super.onOpened();
            this.setValueTxt1();
            this.updateTime();
            this.loopHandler();
            this.Text1.text = YunMengMiJingModel.instance._nameYunMeng;
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }

        private getBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.YUNMENGMIJING_REWARD_ALERT, YunMengMiJingModel.instance.ItemDate);
        }

        private addBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.VIP_TIMES_ALERT, Privilege.copyCloudlandTicket);
        }

        private loopHandler(): void {
            let states: CopySceneState = DungeonModel.instance.getCopySceneStateByType(SceneTypeEx.cloudlandCopy);
            if (states) {
                let stateNum = states[CopySceneStateFields.time];
                this.timeText.text = `${modules.common.CommonUtil.timeStampToHHMMSS(stateNum)}`;
            }
        }

        /**
         *更新时间
         */
        public updateTime() {
            Laya.timer.loop(1000, this, this.loopHandler);
        }

        /**
         * 设置剩余云梦令数量
         */
        public setValueTxt1() {
            let totalTimes = YunMengMiJingModel.instance.totalTimes;
            let totalCiShu = YunMengMiJingModel.instance.totalCiShu;
            let remainTimes = YunMengMiJingModel.instance.remainTimes;
            this.drawNum.text = `${remainTimes}/${totalCiShu}`;
            let colorStr = "#ff3e3e";
            remainTimes == 0 ? colorStr = "#ff3e3e" : colorStr = "#55ff28";
            this.drawNum.color = colorStr;
            let wight = this.addBtn.width + this.drawNum.width + this.img1.width;
            let X = (this.width - wight) / 2;
            this.img1.x = X;
            this.drawNum.x = this.img1.x + this.img1.width;
            this.addBtn.x = this.drawNum.x + this.drawNum.width + 2;
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.loopHandler);
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
    }
}