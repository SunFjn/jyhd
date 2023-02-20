///<reference path="../config/open_award_cfg.ts"/>
/** --- */
namespace modules.openAward {
    import OpenAwardItemUI = ui.OpenAwardItemUI;
    import open_reward = Configuration.open_reward;
    import OpenAwardCfg = modules.config.OpenAwardCfg;
    import open_rewardFields = Configuration.open_rewardFields;

    export class OpenAwardItem extends OpenAwardItemUI {

        private _id: number;

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.OPEN_AWARD_UPDATE, this, this.updateView);
        }

        public setData(id: number): void {
            this._id = id;
            this.updateView();
        }

        public onOpened(): void {
            super.onOpened();
            this.updateView();
        }

        private updateView(): void {
            let cfg: open_reward = OpenAwardCfg.instance.getCfgById(this._id);
            let state: number = OpenAwardModel.instance.getStateById(this._id);
            this.stateImg.visible = !!state;
            let icon: string = cfg[open_rewardFields.flagImg];
            this.iconImg.skin = `assets/icon/ui/open_award/${icon}.jpg`;
        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.frameImg.visible = value;
        }
    }
}