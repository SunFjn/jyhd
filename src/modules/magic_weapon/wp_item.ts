///<reference path="../config/wing_cfg.ts"/>
///<reference path="../wing/wing_model.ts"/>
///<reference path="../config/ride_fazhen_cfg.ts"/>
/** 幻化列表Item */
namespace modules.magicWeapon {
    import SbItemUI = ui.SbItemUI;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import BagModel = modules.bag.BagModel;
    import RideFazhenCfg = modules.config.RideFazhenCfg;
    import ride_fazhenFields = Configuration.ride_fazhenFields;
    import MagicWeaponModel = modules.magicWeapon.MagicWeaponModel;

    // import ItemMaterialCfg = modules.config.ItemMaterialCfg;
    // import Exterior = Configuration.item_material;
    // import ExteriorSKFields = Configuration.ExteriorSKFields;

    /**
     * 宠物用的法阵 item 区别就是数据类型不一样 里面的数据还是一样的
     */
    export class WPItem extends SbItemUI {

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

            let _showInfo: MagicShowInfo = MagicWeaponModel.instance.huanhuaList.get(this._showId);

            if (_showInfo) {
                star = _showInfo[MagicShowInfoFields.star];
            }
            let curShowId: int = -1;

            curShowId = MagicWeaponModel.instance.fazhenId;

            this.usingTxt.visible = false;

            let cfg = RideFazhenCfg.instance.getHuanhuaCfgByIdAndLev(this._showId, star);
            let nextCfg = RideFazhenCfg.instance.getHuanhuaCfgByIdAndLev(this._showId, star + 1);
            let exteriorSKCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(this._showId);

            let itemId: int = cfg[ride_fazhenFields.items][0];
            let count: int = cfg[ride_fazhenFields.items][1];

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

            let cfg = RideFazhenCfg.instance.getHuanhuaCfgByIdAndLev(pitchId, 0);
            let str: string = cfg[ride_fazhenFields.getWay];
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