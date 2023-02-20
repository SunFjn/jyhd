
///<reference path="../config/get_way_cfg.ts"/>

/**  幻化单元项*/
namespace modules.illusion {
    import IllusionItemUI = ui.IllusionItemUI;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import MagicPetModel = modules.magicPet.MagicPetModel;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import petMagicShow = Configuration.petMagicShow;
    import PetMagicShowCfg = modules.config.PetMagicShowCfg;
    import petMagicShowFields = Configuration.petMagicShowFields;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import BagModel = modules.bag.BagModel;
    import CommonUtil = modules.common.CommonUtil;
    import MagicWeaponModel = modules.magicWeapon.MagicWeaponModel;
    import rideMagicShow = Configuration.rideMagicShow;
    import RideMagicShowCfg = modules.config.RideMagicShowCfg;
    import rideMagicShowFields = Configuration.rideMagicShowFields;

    export class IllusionItem extends IllusionItemUI {
        private _showId: number;
        private _curId: int;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.selectedImg.visible = false;
        }

        protected addListeners(): void {
            super.addListeners();

        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.selectedImg.visible = value;
        }

        protected setData(value: any): void {
            super.setData(value);

            this._showId = value as int;
            let star: int = 0;
            let panelType: int = MagicPetModel.instance.panelType;
            let showInfo: MagicShowInfo = panelType === 0 ? MagicWeaponModel.instance.getShowInfoById(this._showId) : MagicPetModel.instance.getShowInfoById(this._showId);
            if (showInfo) {
                star = showInfo[MagicShowInfoFields.star];
            }
            let curShowId: int = -1;
            if (panelType === 0 && MagicWeaponModel.instance.magicShow) {
                curShowId = IllusionModel.instance.rideMagicShowId;
            } else if (panelType === 1 && MagicPetModel.instance.magicShow) {
                curShowId = IllusionModel.instance.magicShowId;
            }

            this.usingTxt.visible = curShowId === this._showId;

            let cfg: petMagicShow | rideMagicShow = panelType === 0 ? RideMagicShowCfg.instance.getCfgByIdAndLv(this._showId, star) : PetMagicShowCfg.instance.getCfgByIdAndLv(this._showId, star);
            let nextCfg: petMagicShow | rideMagicShow = panelType === 0 ? RideMagicShowCfg.instance.getCfgByIdAndLv(this._showId, star + 1) : PetMagicShowCfg.instance.getCfgByIdAndLv(this._showId, star + 1);
            let itemId: int = cfg[panelType === 0 ? rideMagicShowFields.items : petMagicShowFields.items][0];
            let count: int = cfg[panelType === 0 ? rideMagicShowFields.items : petMagicShowFields.items][1];
            let exteriorSKCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(this._showId);

            this.wayTxt.color = "#F4F1BB";
            this.wayTxt.fontSize = 18;
            this.nameTxt.color = CommonUtil.getColorByQuality(exteriorSKCfg[ExteriorSKFields.quality]);

            if (star === 0) {     // 未激活
                this.wayTxt.text = "未激活";
                this.maskImg.visible = true;
                // 判断材料，材料够显示可激活，材料不够显示获取途径
                if (BagModel.instance.getItemCountById(itemId) >= count) {
                    this.wayTxt.text = "可激活";
                    this.wayTxt.color = "#00ad35";
                    this.qualityImg.gray = this.iconImg.gray = false;
                    this.dotImg.visible = true;
                } else {
                    this.qualityImg.gray = this.iconImg.gray = true;
                    this.wayTxt.text = this.getWay(panelType, this._showId);
                    this.dotImg.visible = false;
                }
            } else {              // 已激活
                this.maskImg.visible = false;
                this.qualityImg.gray = this.iconImg.gray = false;
                this.wayTxt.text = `${star}阶`;
                this.wayTxt.fontSize = 20;
                nextCfg ? this.dotImg.visible = BagModel.instance.getItemCountById(itemId) >= count : this.dotImg.visible = false;
            }
            this.nameTxt.text = exteriorSKCfg[ExteriorSKFields.name];
            this.nameTxt.color = CommonUtil.getColorByQuality(exteriorSKCfg[ExteriorSKFields.quality]);
            this.iconImg.skin = `assets/icon/skin/${exteriorSKCfg[ExteriorSKFields.icon]}.png`;
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

        private getWay(panelType: number, pitchId: int): string {

            let cfg: petMagicShow | rideMagicShow = panelType === 0 ? RideMagicShowCfg.instance.getCfgByIdAndLv(pitchId, 0) : PetMagicShowCfg.instance.getCfgByIdAndLv(pitchId, 0);
            let str: string = cfg[panelType === 0 ? petMagicShowFields.getWay : rideMagicShowFields.getWay];
            let str1: string = "";
            for (let i: int = 0, len: int = str.length; i < len; i++) {
                if (str[i] === '#') break;
                str1 += str[i];
            }
            return str1;
        }
    }
}