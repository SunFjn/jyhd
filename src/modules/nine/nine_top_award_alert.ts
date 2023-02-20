///<reference path="../config/scene_copy_nine_cfg.ts"/>


/** 九天之巅登顶奖励弹框*/


namespace modules.nine {
    import NineTopAwardAlertUI = ui.NineTopAwardAlertUI;
    import SceneCopyNineCfg = modules.config.SceneCopyNineCfg;
    import scene_copy_nineFields = Configuration.scene_copy_nineFields;
    import RankAward = Configuration.RankAward;

    export class NineTopAwardAlert extends NineTopAwardAlertUI {
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            let arr: Array<RankAward> = SceneCopyNineCfg.instance.cfgs[SceneCopyNineCfg.instance.cfgs.length - 1][scene_copy_nineFields.tipsAwards];
            // 奖励只显示五档，第一名，第二名，第三名，第四到第十名，十一名之后
            this.rankItem0.data = [1, arr[0]];
            this.rankItem1.data = [2, arr[1]];
            this.rankItem2.data = [3, arr[2]];
            this.rankItem3.data = [4, arr[3]];
            this.rankItem4.data = [5, arr[4]];
        }
    }
}