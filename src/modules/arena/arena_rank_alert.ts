/** 竞技场排行榜弹框*/


namespace modules.arena {
    import ArenaRank = Protocols.ArenaRank;
    import CustomList = modules.common.CustomList;
    import ArenaRankAlertUI = ui.ArenaRankAlertUI;

    export class ArenaRankAlert extends ArenaRankAlertUI {
        private _list: CustomList;

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.itemRender = ArenaRankItem;
            this._list.size(571, 574);
            this._list.pos(50, 160, true);
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ARENA_RANKS_UPDATE, this, this.updateRanks);
        }

        public onOpened(): void {
            super.onOpened();
            // this.updateRanks();

            ArenaCtrl.instance.getArenaRank();
        }

        // 更新排行榜
        private updateRanks(): void {
            let ranks: Array<ArenaRank> = ArenaModel.instance.ranks;
            ranks.length = 13;
            if (!ranks) return;
            ranks.splice(3, ranks.length - 3, null, null, null,null,null,null,null,null,null,null);
            this._list.datas = ranks;
        }

        public destroy(): void {
            this._list = this.destroyElement(this._list);
            super.destroy();
        }
    }
}