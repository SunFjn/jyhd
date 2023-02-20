/////<reference path="../$.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_model.ts"/>
namespace modules.sheng_yu {
    import Event = Laya.Event;
    export class ShengYuBossInformationPanel extends ui.ShengYuBossInformationViewUI {
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.right = 0;
            this.bottom = 573;
            this.closeByOthers = false;
            this.layer = ui.Layer.MAIN_UI_LAYER;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.addBtn, Event.CLICK, this, this.addBtnHandler);
            this.addAutoListener(this.ziDongBtn, Event.CLICK, this, this.ziDongBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SHENG_YU_BOSS_ZIDONG_UPDATE, this, this.showZiDongBtn);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SHENG_YU_BOSS_SCENE_UPDATE, this, this.showDrawNum);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.SHENG_YU_BOSS_UPDATE, this, this.showDrawNum);

        }
        protected removeListeners(): void {
            super.removeListeners();
        }

        public onOpened(): void {
            super.onOpened();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.showDrawNum();
        }
        private showDrawNum(): void {
            let totalCiShu = ShengYuBossModel.instance.maxTiLi;
            let remainTimes = ShengYuBossModel.instance.stength;
            let tiliLimit = ShengYuBossModel.instance.tiliLimit;
            this.drawNum.text = `${remainTimes}/(${totalCiShu + tiliLimit})`;
            let colorStr = "#ff3e3e";
            remainTimes == 0 ? colorStr = "#ff3e3e" : colorStr = "#55ff28";
            this.drawNum.color = colorStr;
            this.timeText.text = `第${ShengYuBossModel.instance.nowCeng}层`;
            this.showZiDongBtn();
        }
        private addBtnHandler(): void {
            ShengYuBossModel.instance.addHandler();
        }
        private ziDongBtnHandler(): void {
            if (ShengYuBossModel.instance._bollZiDong) {
                ShenYuBossCtrl.instance.SetStrength(0);
            }
            else {
                let TiLiDanNum = modules.bag.BagModel.instance.getItemCountById(ShengYuBossModel.instance.itemId);
                if (TiLiDanNum > 0) {
                    ShenYuBossCtrl.instance.SetStrength(1);
                }
                else {
                    modules.notice.SystemNoticeManager.instance.addNotice("背包中没有魔界抗疲劳秘药", true);
                }
            }
        }
        public showZiDongBtn() {
            if (ShengYuBossModel.instance._bollZiDong) {
                this.ziDongBtn.selected = true;
            }
            else {
                this.ziDongBtn.selected = false;
            }
        }
        public close(): void {
            super.close();
        }

        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
    }
}