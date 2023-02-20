/** 竞技场挑战刻录弹框*/


namespace modules.arena {
    import ChallengeRecord = Protocols.ChallengeRecord;
    import CustomList = modules.common.CustomList;
    import ArenaRecordsAlertUI = ui.ArenaRecordsAlertUI;

    export class ArenaRecordsAlert extends ArenaRecordsAlertUI {
        private _list: CustomList;

        protected initialize(): void {
            super.initialize();

            this._list = new CustomList();
            this._list.itemRender = ArenaRecordsItem;
            this._list.size(572, 320);
            this._list.pos(40, 110, true);
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ARENA_RECORDS_UPDATE, this, this.updateRecords);
        }

        public onOpened(): void {
            super.onOpened();
            this.updateRecords();
            // ArenaCtrl.instance.getArenaChallengeRecord();
        }

        // 更新挑战记录
        private updateRecords(): void {
            let records: Array<ChallengeRecord> = ArenaModel.instance.records;
            if (!records) return;
            this._list.datas = records;
        }

        public destroy(): void {
            this._list = this.destroyElement(this._list);
            super.destroy();
        }
    }
}