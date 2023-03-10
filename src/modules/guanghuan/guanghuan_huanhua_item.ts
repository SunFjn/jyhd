namespace modules.guanghuan {
    import SbItemUI = ui.SbItemUI;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import UpdateGuangHuanInfo = Protocols.UpdateGuangHuanInfo;
    import UpdateGuangHuanInfoFields = Protocols.UpdateGuangHuanInfoFields;
    import GuangHuanMagicShowCfg = modules.config.GuangHuanMagicShowCfg;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import BagModel = modules.bag.BagModel;
    import guanghuan_magicShow = Configuration.guanghuan_magicShow;
    import guanghuan_magicShowFields = Configuration.guanghuan_magicShowFields;

    export class GuangHuanHuanHuaItem extends SbItemUI {
        private _showId: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.frameImg.visible = false;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FASHION_INFO_UPDATE, this, this.updateInfo);
        }

        protected setData(value: any): void {
            super.setData(value);

            this._showId = value;
            this.updateInfo();
        }

        protected onOpened(): void {
            super.onOpened();
            this.updateInfo();
        }

        private updateInfo(): void {
            if (!this._showId) return;
            let info: UpdateGuangHuanInfo = GuangHuanModel.instance.guangHuanInfo;
            if (!info) return;
            let star: int = 0;
            let showInfo: MagicShowInfo = GuangHuanModel.instance.getMagicShowInfoById(this._showId);
            if (showInfo) {
                star = showInfo[MagicShowInfoFields.star];
            }
            let curShowId: int = info[UpdateGuangHuanInfoFields.curShowId];
            this.usingTxt.visible = curShowId === this._showId;

            let cfg: guanghuan_magicShow = GuangHuanMagicShowCfg.instance.getCfgByShowIdAndLevel(this._showId, star);
            let nextCfg: guanghuan_magicShow = GuangHuanMagicShowCfg.instance.getCfgByShowIdAndLevel(this._showId, star + 1);
            let exteriorSKCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(this._showId);

            let itemId: int = cfg[guanghuan_magicShowFields.items][0];
            let count: int = cfg[guanghuan_magicShowFields.items][1];

            this.wayTxt.color = "#F4F1BB";
            this.wayTxt.fontSize = 18;
            this.nameTxt.color = CommonUtil.getColorByQuality(exteriorSKCfg[ExteriorSKFields.quality]);

            if (star == 0) { //?????????
                this.wayTxt.text = "?????????";
                this.maskImg.visible = true;
                // ????????????????????????????????????????????????????????????????????????
                if (BagModel.instance.getItemCountById(itemId) >= count) {
                    this.wayTxt.text = "?????????";
                    this.wayTxt.color = "#00ad35";
                    this.qualityImg.gray = this.icon.gray = false;
                    this.dotImg.visible = true;
                } else {
                    this.qualityImg.gray = this.icon.gray = true;
                    this.wayTxt.text = this.getWay(this._showId);
                    this.dotImg.visible = false;
                }
            } else {    //????????????
                this.maskImg.visible = false;
                this.qualityImg.gray = this.icon.gray = false;
                this.wayTxt.text = `${star}???`;
                this.wayTxt.fontSize = 20;
                nextCfg ? this.dotImg.visible = BagModel.instance.getItemCountById(itemId) >= count : this.dotImg.visible = false;
            }

            this.nameTxt.text = exteriorSKCfg[ExteriorSKFields.name];
            this.nameTxt.color = CommonUtil.getColorByQuality(exteriorSKCfg[ExteriorSKFields.quality]);
            this.icon.skin = `assets/icon/skin/${exteriorSKCfg[ExteriorSKFields.icon]}.png`;
            this.qualityImg.skin = `common/dt_tongyong_${exteriorSKCfg[ExteriorSKFields.quality]}.png`;
            let xingJiNum = 0;
            xingJiNum = exteriorSKCfg[ExteriorSKFields.xingJiNum];
            if (xingJiNum != 0 && xingJiNum) {
                this.gradeImg.skin = `common/xiyou${xingJiNum}.png`;
                this.gradeImg.visible = true;
            }
            else {
                this.gradeImg.visible = false;
            }
        }

        private getWay(pitchId: int): string {
            let cfg = GuangHuanMagicShowCfg.instance.getCfgByShowIdAndLevel(pitchId, 0);
            let str: string = cfg[guanghuan_magicShowFields.getWay];
            let str1: string = "";
            for (let i: int = 0, len: int = str.length; i < len; i++) {
                if (str[i] === '#') break;
                str1 += str[i];
            }
            return str1;
        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.frameImg.visible = value;
        }
    }
}