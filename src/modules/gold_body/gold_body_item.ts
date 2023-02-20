/**  金身单元项*/


namespace modules.goldBody {
    import GoldBodyItemUI = ui.GoldBodyItemUI;

    export class GoldBodyItem extends GoldBodyItemUI {
        private _showId: int;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();
            GlobalData.dispatcher.on(CommonEventType.PLAYER_UPDATE_MONEY, this, this.redPointHandler);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_BASE_ATTR_UPDATE, this, this.redPointHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            GlobalData.dispatcher.off(CommonEventType.PLAYER_UPDATE_MONEY, this, this.redPointHandler);
            GlobalData.dispatcher.off(CommonEventType.PLAYER_BASE_ATTR_UPDATE, this, this.redPointHandler);
        }

        protected setSelected(value: boolean): void {
            if (GoldBodyModel.instance.checkOpenById(this._showId, false)) {
                super.setSelected(value);
                this.setData(this._showId);
            }
        }

        protected setData(value: any): void {
            super.setData(value);
            let id = value as int;
            this._showId = id;
            this.bodynameTxt.text = GoldBodyModel.instance.getNameById(id);
            let levelInfo = GoldBodyModel.instance.getInfoById(id) as number;
            this.levelTxt.text = levelInfo.toString() + '阶';
            let isOpen = GoldBodyModel.instance.checkOpenById(id, false);
            // this.bodyShow.skin = `assets/icon/ui/gold_body_icon/ts_jinshen_0${this._showId + 1}.png`;
            this.bg.skin = "goldbody/image_suit_" + id + ".png"
            this.bodynameTxt.strokeColor=GoldBodyModel.instance.suitColors[id]
            if (!isOpen) {
                this.lockImg.visible = true;
            } else {
                this.lockImg.visible = false;
            }
            if (!this.selected) {
                // this.bg.skin = 'goldbody/dt_jinshen_02.png';
                this.chooice.visible = false;
                this.bg.visible = true;
                this.levelTxt.strokeColor = '#808788';
            } else {
                this.chooice.visible = true;
                this.bg.visible = true;
                // this.bg.skin = 'goldbody/dt_jinshen_01.png';
                this.levelTxt.strokeColor = '#753b23';
            }
            if (isOpen && GoldBodyModel.instance.checkIsFitCondition(this._showId) && GoldBodyModel.instance.checkCanTrainingById(this._showId)) { //符合条件并且没有被选择
                this.refineRedImg.visible = true;
            } else
                this.refineRedImg.visible = false;
        }

        //-----------------------------------控制页签红点显示--------------------------------------------
        private redPointHandler() {
            if (GoldBodyModel.instance.checkIsFitCondition(this._showId) && GoldBodyModel.instance.checkCanTrainingById(this._showId)) {
                this.refineRedImg.visible = true;
            } else {
                this.refineRedImg.visible = false;
            }
        }
    }
}
