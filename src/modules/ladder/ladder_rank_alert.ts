/** 天梯排行弹框*/


namespace modules.ladder {
    import LadderRankAlertUI = ui.LadderRankAlertUI;
    import TiantiRank = Protocols.TiantiRank;
    import CustomList = modules.common.CustomList;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import TiantiCfg = modules.config.TiantiCfg;
    import tiantiFields = Configuration.tiantiFields;
    import tianti = Configuration.tianti;

    export class LadderRankAlert extends LadderRankAlertUI {
        private _list: CustomList;

        // 排行榜总数
        private _rankCount: number;

        constructor() {
            super();
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.itemRender = LadderRankItem;
            this._list.pos(44, 162, true);
            this._list.size(571, 528);
            this.addChild(this._list);

            this.tipTxt.color = "#393939";
            this.tipTxt.style.fontFamily = "SimeHei";
            this.tipTxt.style.align = "center";
            this.tipTxt.style.fontSize = 24;
            this._rankCount = BlendCfg.instance.getCfgById(20104)[blendFields.intParam][0];
            let score: number = BlendCfg.instance.getCfgById(20105)[blendFields.intParam][0];
            let segName: string = "";
            let cfgs: Array<tianti> = TiantiCfg.instance.cfgs;
            for (let i: int = 0, len: int = cfgs.length; i < len; i++) {
                if (score < cfgs[i][tiantiFields.totalScore]) {
                    segName = cfgs[i][tiantiFields.name];
                    break;
                }
            }
            this.tipTxt.innerHTML = `积分排名<span style="color:#168a17">前${this._rankCount}</span>且段位达到<span style="color:#168a17">${segName}</span>可上榜。`;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LADDER_RANKS_UPDATE, this, this.updateRank);
        }

        public onOpened(): void {
            super.onOpened();
            LadderCtrl.instance.getTiantiRank();
        }

        // 更新排行榜
        private updateRank(): void {
            let ranks: Array<TiantiRank> = LadderModel.instance.ranks;
            if (ranks && ranks.length === this._rankCount) {
                this._list.datas = ranks;
            } else {
                let arr: Array<TiantiRank> = [];
                for (let i: int = 0; i < this._rankCount; i++) {
                    arr.push(ranks ? ranks[i] : null);
                }
                this._list.datas = arr;
            }
        }
    }
}