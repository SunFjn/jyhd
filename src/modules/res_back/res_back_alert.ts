///<reference path="../common/slide_ctrl.ts"/>
///<reference path="../config/retrieve_cfg.ts"/>
/** 资源找回弹框 */
namespace modules.resBack {
    import ResBackAlertUI = ui.ResBackAlertUI;
    import SlideCtrl = modules.common.SlideCtrl;
    import Retrieve = Protocols.Retrieve;
    import RetrieveFields = Protocols.RetrieveFields;
    import retrieve_res = Configuration.retrieve_res;
    import retrieve_lilian = Configuration.retrieve_lilian;
    import RetrieveCfg = modules.config.RetrieveCfg;
    import retrieve_resFields = Configuration.retrieve_resFields;
    import retrieve_lilianFields = Configuration.retrieve_lilianFields;

    export class ResBackAlert extends ResBackAlertUI {

        private _slider: SlideCtrl;
        private _info: Retrieve;
        private _needCount: int;

        protected initialize(): void {
            super.initialize();

            this._slider = new SlideCtrl(1, 1, 1, 180, 465, this.barImg, this.addBtn, this.minBtn);
        }

        protected addListeners(): void {
            super.addListeners();

            this._slider.addListeners();
            this.addAutoListener(this._slider, common.LayaEvent.CHANGE, this, this.contentChangeHandler);
            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
            this.addAutoListener(GlobalData.dispatcher,CommonEventType.PLAYER_UPDATE_MONEY,this,this.contentChangeHandler);
        }

        protected removeListeners(): void {
            this._slider.removeListeners();
            super.removeListeners();
        }

        protected setOpenParam(value: Retrieve): void {
            super.setOpenParam(value);
            this._info = value;
        }

        public onOpened(): void {
            super.onOpened();
            let id: int = this._info[RetrieveFields.id];
            let type: int = this._info[RetrieveFields.type];/*1:资源找回 2:活跃值找回*/
            let cfg: retrieve_res | retrieve_lilian;
            if (type === 1) {
                cfg = RetrieveCfg.instance.getResCfgById(id);
                this.titleTxt.text = cfg[retrieve_resFields.name];
            } else {
                cfg = RetrieveCfg.instance.getLilianCfgById(id);
                this.titleTxt.text = cfg[retrieve_lilianFields.name];
            }
            this.update();
        }

        private contentChangeHandler(): void {
            let unit: int = this._info[RetrieveFields.gold];
            let value: int = this._slider.value;
            let count: int = value;
            let needCount: int = this._needCount = Math.round(unit * count);
            let haveCount: int = CommonUtil.getPropCountById(MoneyItemId.glod);
            this.numTxt.text = `${needCount}`;
            this.numTxt.text = haveCount >= needCount ? `#2d1a1a` : `#ff3e3e`;
            this.desTxt.text = value.toString();
        }

        private btnHandler(): void {
            let haveCount: int = CommonUtil.getPropCountById(MoneyItemId.glod);
            if (haveCount >= this._needCount) { //代币券足够
                let temp: Retrieve = <Retrieve>this._info.concat();
                temp[RetrieveFields.times] = this._slider.value;
                ResBackCtrl.instance.getrieveRes([temp]);
            } else {
                CommonUtil.goldNotEnoughAlert();
            }
        }

        private update(): void {
            this._slider.max = this._info[RetrieveFields.times];
            this._slider.min = 1;
            this._slider.value = 4;
        }

        public destroy(): void {
            this._slider = this.destroyElement(this._slider);
            super.destroy();
        }
    }
}