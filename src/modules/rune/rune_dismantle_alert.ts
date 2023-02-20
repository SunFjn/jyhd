namespace modules.rune {
    import RuneDismantleAlertUI = ui.RuneDismantleAlertUI;
    import RuneCollectGradeInfo = Protocols.RuneCollectGradeInfo;
    import RuneCollectGradeInfoFields = Protocols.RuneCollectGradeInfoFields;
    import RuneCollectCfg = modules.config.RuneCollectCfg;
    import ItemRuneCfg = modules.config.ItemRuneCfg;
    import item_runeFields = Configuration.item_runeFields;
    import rune_collect_grade = Configuration.rune_collect_grade;
    import rune_collect_gradeFields = Configuration.rune_collect_gradeFields;

    export class RuneDismantleAlert extends RuneDismantleAlertUI {
        private dismantleID: number;
        private getedData: any;


        public destroy(): void {
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.cancelBtn, common.LayaEvent.CLICK, this, this.close);
            this.addAutoListener(this.okBtn, common.LayaEvent.CLICK, this, this.dismantleHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RUNE_DISMANTLE_FINISH_UPDATE, this, this.dismantleFinishHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this.upDateView();
        }

        public setOpenParam(value: RuneCollectGradeInfo): void {
            super.setOpenParam(value);
            this.dismantleID = value[RuneCollectGradeInfoFields.id];
            let level = value[RuneCollectGradeInfoFields.level];
            let runeData: rune_collect_grade = RuneCollectCfg.instance.getCfgByIdLevel(this.dismantleID, level);
            this.item._nameTxt.visible = false;

            if ((runeData[rune_collect_gradeFields.resolveItems] as unknown as Array<number>).length) {
                let id = runeData[rune_collect_gradeFields.resolveItems][0][0];
                let dimID = (id * 0.0001 >> 0) * 10000;
                let count = runeData[rune_collect_gradeFields.resolveItems][0][1];
                let name = ItemRuneCfg.instance.getCfgById(dimID)[item_runeFields.name];
                let color = CommonUtil.getColorById(id);
                this.getedData = [dimID, count, 0, null];
                this.item.dataSource = [dimID, 1, 0, null];
                this.item._nameTxt.visible = false;
                this.txt_attr.text = `${name} x${count}`;
                this.txt_attr.color = color;
                this.okBtn.disabled = false;
                this.hintTxt.text = "拆解后星级下降1级，获得以下奖励，是否继续拆解?";
            } else {
                // 无拆解时,取当前玉荣id
                let dimID = (value[RuneCollectGradeInfoFields.id] * 0.0001 >> 0) * 10000;
                this.item.dataSource = [dimID, 1, 0, null];
                this.okBtn.disabled = true;
                this.hintTxt.text = "当前无可拆解玉荣";
            }
        }

        /**
           * 拆解完成
           */
        private dismantleFinishHandler(): void {
            WindowManager.instance.open(WindowEnum.COMMON_ITEMS_ALERT, [[this.getedData], "拆解成功"]);
            this.close();
        }

        private dismantleHandler(): void {
            RuneCtrl.instance.runeCollectDismantleReq([this.dismantleID]);
        }

        private upDateView(): void {

        }
    }
}