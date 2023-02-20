///<reference path="../config/wing_cfg.ts"/>
///<reference path="../wing/wing_model.ts"/>

/** 姻缘仙娃幻化列表Item */
namespace modules.marry {
    import MarryItemUI = ui.MarryItemUI;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import ImmortalsCfg = modules.config.ImmortalsCfg;
    import marry_dollFields = Configuration.marry_dollFields;


    import marry_doll_gradeFields = Configuration.marry_doll_gradeFields;
    import BagModel = modules.bag.BagModel;
    import CommonUtil = modules.common.CommonUtil;

    export class MarryItem extends MarryItemUI {

        private _showId: number;
        private _type: number;
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.frameImg.visible = false;
        }

        protected setData(value: any): void {
            super.setData(value);

            this._showId = value[0];
            this._type = value[1];
            // 仙娃等级
            let star: int = 0;
            if (this._type == 1) {
                star = MarryModel.instance.getDollLevel(this._showId);
            } else {
                star = MarryModel.instance.getDollClassLevel(this._showId);
            }


            // 出战仙娃ID
            let curShowId = MarryModel.instance.curDoll;
            this.usingTxt.visible = curShowId === this._showId;

            let cfg = MarryDollCfg.instance.getItemCfg(this._showId, star);
            let nextCfg = MarryDollCfg.instance.getItemCfg(this._showId, star + 1);

            //3d配置
            let exteriorSKCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(this._showId);

            let itemId: int = !cfg ? nextCfg[marry_dollFields.items][0] : cfg[marry_dollFields.items][0];
            let count: int = !cfg ? nextCfg[marry_dollFields.items][0] : cfg[marry_dollFields.items][1];


            this.wayTxt.fontSize = 18;
            this.nameTxt.color = CommonUtil.getColorByQuality(exteriorSKCfg[ExteriorSKFields.quality]);

            if (star == 0) { //未激活
                this.wayTxt.color = "#00ad35";
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
                    // this.wayTxt.text = this.getWay(this._showId);
                    // this.wayTxt.text = ""
                    //this.wayTxt.text = this._type == 1 ? `${star}级` : `${star}阶`;
                    this.dotImg.visible = false;
                }
            } else {    //已经激活
                this.wayTxt.color = "#F4F1BB";
                this.maskImg.visible = false;
                this.qualityImg.gray = this.icon.gray = false;
                this.wayTxt.text = this._type == 1 ? `${star}级` : `${star}阶`;
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
            let cfg = MarryDollCfg.instance.getGradeCfg(pitchId, 1);
            let str: string = cfg[marry_doll_gradeFields.getWay];
            let str1: string = "";
            for (let i: int = 0, len: int = str.length; i < len; i++) {
                if (str[i] === '#') break;
                str1 += str[i];
            }
            return str1;
        }
        public setRP(value) {
            this.dotImg.visible = value
        }
        // private showTip(pitchId: int): void {
        //     let cfg = WingCfg.instance.getHuanhuaCfgByIdAndLv(pitchId, 0);
        //     let str: string = cfg[shenbing_magicShowFields.getWay];
        //     let str1: string = "", str2: string = "";
        //     let j = str.length;
        //     for (let i: int = 0, len: int = str.length; i < len; i++) {
        //         if (str[i] === '#') {
        //             str2 += '+';
        //             j = i;
        //             continue;
        //         }
        //         i < j == true ? str1 += str[i] : str2 += str[i];
        //     }
        //     this.tipTxt_1.text = str1;
        //     this.tipTxt_2.text = str2;
        // }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.frameImg.visible = value;
        }
    }
}