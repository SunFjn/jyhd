///<reference path="../config/wing_cfg.ts"/>
///<reference path="../wing/wing_model.ts"/>

/** 幻化列表Item */
namespace modules.immortals {
    import SbItemUI = ui.SbItemUI;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import ImmortalsCfg = modules.config.ImmortalsCfg;
    import shenbing_magicShowFields = Configuration.shenbing_magicShowFields;
    import BagModel = modules.bag.BagModel;
    import CommonUtil = modules.common.CommonUtil;

    export class SBItem extends SbItemUI {

        private _showId: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.frameImg.visible = false;
        }

        protected setData(value: any): void {
            super.setData(value);

            this._showId = value;
            let star: int = 0;

            let _showInfo: MagicShowInfo = ImmortalsModel.instance.huanhuaList.get(this._showId);

            if (_showInfo) {
                star = _showInfo[MagicShowInfoFields.star];
            }
            let curShowId: int = -1;

            curShowId = ImmortalsModel.instance.otherValue["幻化id"];

            this.usingTxt.visible = curShowId === this._showId;

            let cfg = ImmortalsCfg.instance.getHuanhuaCfgByIdAndLev(this._showId, star);
            let nextCfg = ImmortalsCfg.instance.getHuanhuaCfgByIdAndLev(this._showId, star + 1);
            let exteriorSKCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(this._showId);

            let itemId: int = cfg[shenbing_magicShowFields.items][0];
            let count: int = cfg[shenbing_magicShowFields.items][1];

            this.wayTxt.color = "#F4F1BB";
            this.wayTxt.fontSize = 18;
            this.nameTxt.color = CommonUtil.getColorByQuality(exteriorSKCfg[ExteriorSKFields.quality]);

            if (star == 0) { //未激活
                this.wayTxt.text = "未激活";
                this.maskImg.visible = true;
                // 判断材料，材料够显示可激活，材料不够显示获取途径
                if (BagModel.instance.getItemCountById(itemId) >= count) {
                    this.wayTxt.text = "可激活";
                    this.wayTxt.color = "#00ad35";
                    this.qualityImg.gray = this.icon.gray = false;
                    this.dotImg.visible = true;
                } else {
                    this.qualityImg.gray = this.icon.gray = true;
                    this.wayTxt.text = this.getWay(this._showId);
                    this.dotImg.visible = false;
                }
            } else {    //已经激活
                this.maskImg.visible = false;
                this.qualityImg.gray = this.icon.gray = false;
                this.wayTxt.text = `${star}阶`;
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

            let cfg = ImmortalsCfg.instance.getHuanhuaCfgByIdAndLev(pitchId, 0);
            let str: string = cfg[shenbing_magicShowFields.getWay];
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