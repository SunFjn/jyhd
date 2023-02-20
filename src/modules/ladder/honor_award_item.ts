/** 每日荣誉奖励单元项*/


namespace modules.ladder {
    import HonorAwardItemUI = ui.HonorAwardItemUI;
    import tianti = Configuration.tianti;
    import tiantiFields = Configuration.tiantiFields;
    import ItemsFields = Configuration.ItemsFields;
    import TiantiCfg = modules.config.TiantiCfg;

    export class HonorAwardItem extends HonorAwardItemUI {
        constructor() {
            super();
        }

        protected setData(value: any): void {
            super.setData(value);
            let cfg: tianti = value;
            // this.icon.skin = "";
            this.gradeTxt.text = cfg[tiantiFields.name];
            let index: int = TiantiCfg.instance.cfgs.indexOf(cfg);
            if (index === 0) {
                this.scoreTxt.text = "0";
            } else {
                this.scoreTxt.text = TiantiCfg.instance.cfgs[index - 1][tiantiFields.totalScore] + "";
            }
            this.honorTxt.text = cfg[tiantiFields.honorAwards][0][ItemsFields.count] + "";
        }
    }
}