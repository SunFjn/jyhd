///<reference path="../config/rune_collect_rise_cfg.ts"/>
namespace modules.rune {
    import RuneCollectLevelAlertUI = ui.RuneCollectLevelAlertUI;
    import RuneCollectGradeInfo = Protocols.RuneCollectGradeInfo;
    import RuneCollectGradeInfoFields = Protocols.RuneCollectGradeInfoFields;
    import RuneCollectRiseCfg = modules.config.RuneCollectRiseCfg;
    import rune_collect_rise = Configuration.rune_collect_rise;
    import rune_collect_riseFields = Configuration.rune_collect_riseFields;

    export class RuneCollectLevelAlert extends RuneCollectLevelAlertUI {
        private canUpLevel: boolean;
        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.okBtn, common.LayaEvent.CLICK, this, this.upJieHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.RUNE_UPDATE_SP_INFO, this, this.updateView);
        }


        public onOpened(): void {
            super.onOpened();
            this.updateView();
        }


        private updateView() {
            let jie = RuneModel.instance.collcetLevel;
            let rise: rune_collect_rise = RuneCollectRiseCfg.instance.getCfgByLevel(jie);
            let next_rise: rune_collect_rise = RuneCollectRiseCfg.instance.getNextCfgByLevel(jie);
            let fighting = rise[rune_collect_riseFields.fighting];
            let cur_val = rise[rune_collect_riseFields.attrUp];

            this.txt_curAttr.text = `+${Math.round(cur_val * 100)}%`
            this.titleTxt.text = `收集专家·${jie}阶`;
            this.powerNum.value = fighting + "";
            // this.box_power.visible = jie != 0;
             if (next_rise) {
                let describe = next_rise[rune_collect_riseFields.describe];
                let next_val = next_rise[rune_collect_riseFields.attrUp];
                this.box_next.visible = true;
                this.txt_maxed.visible = false;
                this.txt_nextAttr.text = `+${Math.round(next_val * 100)}%`;
                this.txt_describe.text = describe;
                let cur = RuneModel.instance.collcetProcess[0];
                let total = RuneModel.instance.collcetProcess[1];
                this.txt_process.text = `(${cur}/${total})`;
                this.txt_process.color = (cur < total) ? "red" : "#007d09";
                this.okBtn.disabled = cur < total;
            } else {
                this.box_next.visible = false;
                this.txt_maxed.visible = true;
                this.okBtn.disabled = true;
            }
        }

        private upJieHandler(): void {
            RuneCtrl.instance.runeCollectSPLevelReq();
        }

    }
}