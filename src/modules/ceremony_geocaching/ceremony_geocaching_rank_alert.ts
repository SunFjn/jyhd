namespace modules.ceremony_geocaching {
    import Event = laya.events.Event;
    import CustomClip = modules.common.CustomClip;
    import CustomList = modules.common.CustomList;
    import ceremonyGeocachingRank = Configuration.ceremonyGeocachingRank;

    export class CeremonyGeocachingRankAlert extends ui.CeremonyGeocachingRankAlertUI {
        private _list: CustomList;

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.width = 589;
            this._list.height = 481;
            this._list.hCount = 1;
            this._list.spaceX = 0;
            this._list.spaceY = 6;
            this._list.itemRender = CeremonyGeocachingRankItem;
            this._list.x = 36;
            this._list.y = 172;
            this.addChild(this._list);
        }
        public onOpened(): void {
            super.onOpened();
            CeremonyGeocachingCtrl.instance.getRankList();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.OS_CEREMONY_GEOCACHING_RANK_UPDATE, this, this.updateView);
        }

        // 刷新视图
        public updateView() {

            this.myRankNumText.text = `我的排名：${CeremonyGeocachingModel.instance.myRank}`;
            this.myIntegralText.text = `积分：${CeremonyGeocachingModel.instance.score}`;

            let datas: Array<ceremonyGeocachingRank> = CeremonyGeocachingModel.instance.rankList;
            this._list.datas = datas;
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }
    }
}