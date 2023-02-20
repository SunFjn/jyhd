/** 九天之巅结算弹框*/


namespace modules.nine {
    import NineResultAlertUI = ui.NineResultAlertUI;
    import NineCopyJudgeAward = Protocols.NineCopyJudgeAward;
    import NineRank = Protocols.NineRank;
    import NineCopyJudgeAwardFields = Protocols.NineCopyJudgeAwardFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import BaseItem = modules.bag.BaseItem;
    import SceneCopyNineCfg = modules.config.SceneCopyNineCfg;
    import scene_copy_nineFields = Configuration.scene_copy_nineFields;
    import Items = Configuration.Items;
    import ItemsFields = Configuration.ItemsFields;
    import RankAward = Configuration.RankAward;
    import RankAwardFields = Configuration.RankAwardFields;

    export class NineResultAlert extends NineResultAlertUI {
        private _rankItems: Array<NineResultItem>;
        private _items: Array<BaseItem>;
        private _timer: number = 0;

        constructor() {
            super();
        }

        public destroy(): void {
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();
            this._rankItems = [this.rankItem1, this.rankItem2, this.rankItem3];
            this._items = [this.item1, this.item2, this.item3, this.item4];
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.okBtn, Laya.Event.CLICK, this, this.close);
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            let t: NineCopyJudgeAward = value;
            let ranks: Array<NineRank> = t[NineCopyJudgeAwardFields.ranks];
            for (let i: int = 0; i < 3; i++) {
                if (ranks[i]) {
                    this._rankItems[i].visible = true;
                    this._rankItems[i].data = ranks[i];
                } else {
                    this._rankItems[i].visible = false;
                }
            }
            let myLv: number = t[NineCopyJudgeAwardFields.selfLevel];
            let myRank: number = t[NineCopyJudgeAwardFields.selfRank];
            this.myLvTxt.text = `我的通关战绩：第${myLv}层 排名：${myRank}`;
            let arr: Array<RankAward> = SceneCopyNineCfg.instance.getCfgByLevel(myLv)[scene_copy_nineFields.tipsAwards];
            let items: Array<Items>;
            if (myLv === 9) {     // 通关根据排名显示奖励
                items = this.getAwardsByRank(myRank, arr);
            } else {          // 未通关显示当前层奖励
                items = arr[0][RankAwardFields.awards];
            }
            let offset: number = (88 * 4 + 30 * 3 - items.length * 88 - (items.length - 1) * 30) * 0.5;
            for (let i: int = 0; i < 4; i++) {
                if (items[i]) {
                    this._items[i].visible = true;
                    this._items[i].dataSource = [items[i][ItemsFields.itemId], items[i][ItemsFields.count], 0, null];
                    this._items[i].x = 144 + offset + i * 118;
                } else {
                    this._items[i].visible = false;
                }
            }
        }

        private getAwardsByRank(rank: int, arr: Array<RankAward>): Array<Items> {
            let items: Array<Items>;
            for (let i: int = arr.length - 1; i >= 0; i--) {
                if (rank >= arr[i][RankAwardFields.rank]) {
                    items = arr[i][RankAwardFields.awards];
                    break;
                }
            }
            return items;
        }

        public onOpened(): void {
            super.onOpened();
            this._timer = BlendCfg.instance.getCfgById(10303)[blendFields.intParam][0] * 0.001;
            Laya.timer.loop(1000, this, this.loopHandler);
            this.loopHandler();
        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            Laya.timer.clear(this, this.loopHandler);
        }

        private loopHandler(): void {
            this.okBtn.label = `确定(${this._timer})`;
            if (this._timer < 0) {
                this.close();
            }
            this._timer--;
        }
    }
}