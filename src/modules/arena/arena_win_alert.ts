/** 竞技场胜利结算弹框*/


namespace modules.arena {
    import ArenaWinAlertUI = ui.ArenaWinAlertUI;
    import ArenaJudgeAward = Protocols.ArenaJudgeAward;
    import ArenaJudgeAwardFields = Protocols.ArenaJudgeAwardFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import LayaEvent = modules.common.LayaEvent;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    import Items = Configuration.Items;
    import arenaFields = Configuration.arenaFields;
    import ItemsFields = Configuration.ItemsFields;

    export class ArenaWinAlert extends ArenaWinAlertUI {
        private _duration: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._duration = BlendCfg.instance.getCfgById(10303)[blendFields.intParam][0];
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.close);
            Laya.timer.loop(1000, this, this.loopHandler);
            this.loopHandler();
            GlobalData.dispatcher.on(CommonEventType.CashEquip_Merge_Awards, this, this.updataCashEquip);
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.loopHandler);
            GlobalData.dispatcher.off(CommonEventType.CashEquip_Merge_Awards, this, this.updataCashEquip);
        }

        public onOpened(): void {
            super.onOpened();

            this.updateJudge();
        }

        private updateJudge(): void {
            let judge: ArenaJudgeAward = ArenaModel.instance.arenaJudgeAward;
            if (!judge) return;
            this.changeTxt.visible = judge[ArenaJudgeAwardFields.enemyRankChange];
            let curRank: number = judge[ArenaJudgeAwardFields.curRank];
            let maxRank: number = judge[ArenaJudgeAwardFields.maxRank];

            this.curRankTxt.text = `${curRank}`;
            this.maxRankTxt.text = `${maxRank}`;
            if (curRank < maxRank) {
                this.upImg.visible = this.changeRankTxt.visible = true;
                this.changeRankTxt.text = `${maxRank - curRank}`;
            } else {
                this.upImg.visible = this.changeRankTxt.visible = false;
            }
            let awards: Array<Items> = ArenaCfg.instance.getCfgByRank(curRank)[arenaFields.winItems];
            this.item1.dataSource = [awards[0][ItemsFields.itemId], awards[0][ItemsFields.count], 0, null];
            this.item2.dataSource = [awards[1][ItemsFields.itemId], awards[1][ItemsFields.count], 0, null];
            if (judge[ArenaJudgeAwardFields.gold]) {
                this.item3.visible = true;
                this.item3.dataSource = [90140001, judge[ArenaJudgeAwardFields.gold], 0, null];
                this.item1.x = 171;
                this.item2.x = 317;
            }
            else {
                this.item3.visible = false;
                this.item1.x = 237;
                this.item2.x = 396;
            }

        }
        private _item: Protocols.Item
        private updataCashEquip(item: Protocols.Item) {
            if (this.item1 && item) {
                this.item1.dataSource = item;
                this._item = item
            }


        }
        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
            DungeonCtrl.instance.reqEnterScene(0);
            if (this._item) GlobalData.dispatcher.event(CommonEventType.CashEquip_Completion_Callback, [this._item]);
        }

        private loopHandler(): void {
            if (this._duration === 0) {
                this.close();
                Laya.timer.clear(this, this.loopHandler);
            }
            this.okBtn.label = `确定(${this._duration / 1000})`;
            this._duration -= 1000;
        }
    }
}