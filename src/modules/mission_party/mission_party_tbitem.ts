
/** 战力分红子项*/

namespace modules.mission_party {
    export class MissionPartyTBItem extends ui.MissionPartyTabItemUI {
        private mission: string;

        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this.mission = MissionPartyModel.instance.getCurrentMissionLabel();
            this.createEffect();
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.Mission_Party_updataList, this, this.shouUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.Mission_Party_updataListRP, this, this.shouUI);

        }
        public onOpened(): void {
            super.onOpened();

        }
        private _Indexes: number = -1
        protected setData(value: any): void {
            super.setData(value);
            // console.log("value", value, value.title)
            this.title.text = "" + value.title
            this._Indexes = value._Indexes
            this.title.visible = true
            this.shouUI();


        }
        private sureBtnHandler() {

        }
        private gotoBtnHandler() {
            //跳转面板或场景

        }
        private createEffect() {

        }
        public close(): void {
            super.close();
        }
        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
        protected setSelected(value: boolean): void {
            // if (this._reviveTime - GlobalData.serverTime > 0) {
            //     return;
            // }
            super.setSelected(value);


        }

        private shouUI() {

            if (MissionPartyModel.instance._tabclink == this._Indexes) {
                this.selebg.skin = `mission_party/${this.mission}/image_bg_2.png`;
                this.title.color = "#ffffff"
            } else {
                this.selebg.skin = `mission_party/${this.mission}/image_bg_1.png`;
                this.title.color = "#824126"
            }

            this.imgrp.visible = MissionPartyModel.instance._itemTab.indexOf(this._Indexes) > -1

        }
        protected clickHandler() {
            let s = this;
            if (MissionPartyModel.instance._tabclink != this._Indexes) {
                console.log(this._Indexes, s.title.text)
                MissionPartyModel.instance._tabclink = this._Indexes
                GlobalData.dispatcher.event(CommonEventType.Mission_Party_updataList);
            }
        }
    }
}