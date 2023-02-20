namespace modules.explicit {
    import ExplicitSuitClassItemUI = ui.ExplicitSuitClassItemUI;
    import exterior_suit_Field = Configuration.exterior_suit_Field;
    export class ExplicitSuitClassItem extends ExplicitSuitClassItemUI {
        private _showId: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
           
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.EXPLICIT_SUIT_UPDATE, this, this.updateInfo);
        }

        protected setData(value: any): void {
            super.setData(value);
            let url = "assets/icon/explicit_suit_btn/" + (parseInt(value[exterior_suit_Field.icon]) + PlayerModel.instance.occ) +".png";
            this.class_img.skin = url;
            this._showId = value[exterior_suit_Field.id];
            this.updateInfo();
        }

        protected onOpened(): void {
            super.onOpened();
            
        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.class_img.y = value ? -145:0;
        }

        private updateInfo(){
            this.dotImg.visible = ExplicitSuitModel.instance.checkRedPoint(this._showId);
        }
    }
}