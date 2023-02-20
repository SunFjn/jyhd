/** 时装幻化单元项*/


namespace modules.explicit {
    import SbItemUI = ui.SbItemUI;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import UpdateFashionInfo = Protocols.UpdateFashionInfo;
    import UpdateFashionInfoFields = Protocols.UpdateFashionInfoFields;
    import FashionMagicShowCfg = modules.config.FashionMagicShowCfg;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import BagModel = modules.bag.BagModel;
    import FashionModel = modules.fashion.FashionModel;
    import fashion_magicShow = Configuration.fashion_magicShow;
    import fashion_magicShowFields = Configuration.fashion_magicShowFields;
    import ImmortalsModel = modules.immortals.ImmortalsModel;
    import ImmortalsCfg = modules.config.ImmortalsCfg;
    import shenbing_magicShowFields = Configuration.shenbing_magicShowFields;
    import WingModel = modules.wing.WingModel;
    import WingCfg = modules.config.WingCfg;
    import wing_magicShowFields = Configuration.wing_magicShowFields;
    import BagUtil = modules.bag.BagUtil;

    export class ExplicitSuitItem extends SbItemUI {
        private _showId: number;
        private _showType: number;
        private _itemId:number = -1;
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this.frameImg.visible = false;
        }

        protected addListeners(): void {
            super.addListeners();
        this.addAutoListener(this, Laya.Event.CLICK, this, this.btnHandler);
        }

        protected setData(value: any): void {
            super.setData(value);

            this._showId = value[0];
            this._showType = value[1];
            this.updateInfo();
        }

        protected onOpened(): void {
            super.onOpened();
            //this.updateInfo();
        }

        private updateInfo(): void {
            if (!this._showId) return;
            let cfg = null;
            let nextCfg = null;
            let exteriorSKCfg = null;
            let itemId: int = 0;
            let star: int = 0;
            let count: int = 0;
            if (this._showType == 0) {//武器
                let _showInfo: MagicShowInfo = ImmortalsModel.instance.huanhuaList.get(this._showId);
                if (_showInfo) {
                    star = _showInfo[MagicShowInfoFields.star];
                }
                let curShowId: int = -1;
                curShowId = ImmortalsModel.instance.otherValue["幻化id"];
                this.usingTxt.visible = curShowId === this._showId;
                cfg = ImmortalsCfg.instance.getHuanhuaCfgByIdAndLev(this._showId, star);
                nextCfg = ImmortalsCfg.instance.getHuanhuaCfgByIdAndLev(this._showId, star + 1);
                exteriorSKCfg = ExteriorSKCfg.instance.getCfgById(this._showId);
    
                itemId = cfg[shenbing_magicShowFields.items][0];
                count = cfg[shenbing_magicShowFields.items][1];
            }else if(this._showType == 1){//时装
                let info: UpdateFashionInfo = FashionModel.instance.fashionInfo;
                if (!info) return;
                let showInfo: MagicShowInfo = FashionModel.instance.getMagicShowInfoById(this._showId);
                if (showInfo) {
                    star = showInfo[MagicShowInfoFields.star];
                }
                let curShowId: int = info[UpdateFashionInfoFields.curShowId];
                this.usingTxt.visible = curShowId === this._showId + PlayerModel.instance.occ;

                cfg = FashionMagicShowCfg.instance.getCfgByShowIdAndLevel(this._showId, star);
                nextCfg = FashionMagicShowCfg.instance.getCfgByShowIdAndLevel(this._showId, star + 1);
                exteriorSKCfg = ExteriorSKCfg.instance.getCfgById(this._showId + PlayerModel.instance.occ);

                itemId = cfg[fashion_magicShowFields.items][0];
                count = cfg[fashion_magicShowFields.items][1];
            }else{//翅膀
                let _showInfo: MagicShowInfo = WingModel.instance.huanhuaList.get(this._showId);
                if (_showInfo) {
                    star = _showInfo[MagicShowInfoFields.star];
                }
                let curShowId: int = -1;
                curShowId = WingModel.instance.otherValue["幻化id"];
                if (this._showId === curShowId){
                    this.usingTxt.visible = true;
                }else{
                    this.usingTxt.visible = false;
                }
                let cfg = WingCfg.instance.getHuanhuaCfgByIdAndLv(this._showId, star);
                nextCfg = WingCfg.instance.getHuanhuaCfgByIdAndLv(this._showId, star + 1);
                exteriorSKCfg = ExteriorSKCfg.instance.getCfgById(this._showId);
                itemId = cfg[wing_magicShowFields.items][0];
                count = cfg[wing_magicShowFields.items][1];
            }
            this._itemId = itemId;

            this.wayTxt.color = "#F4F1BB";
            this.wayTxt.fontSize = 18;
            this.dotImg.visible = false;
            this.nameTxt.color = CommonUtil.getColorByQuality(exteriorSKCfg[ExteriorSKFields.quality]);
            this.nameTxt.visible = false;

            if (star == 0) { //未激活
                this.wayTxt.text = "未激活";
                this.maskImg.visible = true;
                // 判断材料，材料够显示可激活，材料不够显示获取途径
                if (BagModel.instance.getItemCountById(itemId) >= count) {
                    this.wayTxt.text = "可激活";
                    this.wayTxt.color = "#00ad35";
                    this.qualityImg.gray = this.icon.gray = false;
                    //this.dotImg.visible = true;
                } else {
                    this.qualityImg.gray = this.icon.gray = true;
                    //this.wayTxt.text = this.getWay(this._showId);
                    //this.dotImg.visible = false;
                }
            } else {    //已经激活
                this.maskImg.visible = false;
                this.qualityImg.gray = this.icon.gray = false;
                this.wayTxt.text = `${star}阶`;
                this.wayTxt.fontSize = 20;
                //nextCfg ? this.dotImg.visible = BagModel.instance.getItemCountById(itemId) >= count : this.dotImg.visible = false;
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
            let cfg = null;
            let str:string = "";
            if (this._showType == 0) {
                cfg = ImmortalsCfg.instance.getHuanhuaCfgByIdAndLev(pitchId, 0);
                str = cfg[shenbing_magicShowFields.getWay];
            }else if (this._showType == 1) {
                cfg = FashionMagicShowCfg.instance.getCfgByShowIdAndLevel(pitchId, 0);
                str = cfg[fashion_magicShowFields.getWay];
            }else{
                cfg = WingCfg.instance.getHuanhuaCfgByIdAndLv(pitchId, 0);
                str = cfg[wing_magicShowFields.getWay];
            }
            let str1: string = "";
            for (let i: int = 0, len: int = str.length; i < len; i++) {
                if (str[i] === '#') break;
                str1 += str[i];
            }
            return str1;
        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
        }

        private btnHandler(){
            if (this._itemId != -1) {
                BagUtil.openBagItemTip([this._itemId,0,0,null]);
            }
        }
    }
}