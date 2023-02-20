///<reference path="../config/tianti_awards_cfg.ts"/>


/** 段位、排行奖励面板*/



namespace modules.ladder {
    import LadderGradeAwardAlertUI = ui.LadderGradeAwardAlertUI;
    import CustomList = modules.common.CustomList;
    import BtnGroup = modules.common.BtnGroup;
    import TiantiCfg = modules.config.TiantiCfg;
    import TiantiAwardsCfg = modules.config.TiantiAwardsCfg;
    import tianti = Configuration.tianti;
    import tiantiFields = Configuration.tiantiFields;
    import TiantiScoreFields = Protocols.TiantiScoreFields;

    export class LadderGradeAwardAlert extends LadderGradeAwardAlertUI {
        // 段位奖励列表
        private _gradeList: CustomList;
        // 排名奖励列表
        private _rankList: CustomList;
        // 按钮组
        private _btnGroup: BtnGroup;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._gradeList = new CustomList();
            this._gradeList.itemRender = LadderGradeAwardItem;
            this._gradeList.pos(48, 116, true);
            this._gradeList.size(565, 526);
            this._gradeList.datas = TiantiCfg.instance.cfgs.slice(0, TiantiCfg.instance.cfgs.length - 1);

            this._rankList = new CustomList();
            this._rankList.itemRender = LadderRankAwardItem;
            this._rankList.pos(48, 162, true);
            this._rankList.size(560, 400);
            this._rankList.datas = TiantiAwardsCfg.instance.cfgs;

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.rankBtn, this.gradeBtn);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this._btnGroup, Laya.Event.CHANGE, this, this.selectHandler);
        }

        public onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 0;

            let arr: Array<tianti> = TiantiCfg.instance.cfgs;
            let index: int = 0;
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                if (arr[i][tiantiFields.id] === LadderModel.instance.tiantiScore[TiantiScoreFields.seg]) {
                    index = i;
                    break;
                }
            }
            this._gradeList.scrollTo(134 * index);
        }

        private selectHandler(): void {
            if (this._btnGroup.selectedIndex === 0) {
                this.addChild(this._rankList);
                this._gradeList.removeSelf();
                this.rankTitleBg.visible = this.rankTxt.visible = this.awardTxt.visible = true;
                this.titleTxt.text = "排行奖励";
                this.TipText.text = "排行奖励通过邮件发送";
            } else if (this._btnGroup.selectedIndex === 1) {
                this.addChild(this._gradeList);
                this._rankList.removeSelf();
                this.rankTitleBg.visible = this.rankTxt.visible = this.awardTxt.visible = false;
                this.titleTxt.text = "段位奖励";
                this.TipText.text = "段位晋级奖励通过邮件发送";
            }
        }

        public destroy(): void {
            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }

            if (this._gradeList) {
                this._gradeList.destroy();
                this._gradeList = null;
            }

            if (this._rankList) {
                this._rankList.destroy();
                this._rankList = null;
            }
            super.destroy();
        }
    }
}