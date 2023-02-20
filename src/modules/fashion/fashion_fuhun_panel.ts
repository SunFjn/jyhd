///<reference path="../config/fashion_refine_cfg.ts"/>


/** 时装附魂面板*/


namespace modules.fashion {
    import ImmortalFuhunViewUI = ui.ImmortalFuhunViewUI;
    import LayaEvent = modules.common.LayaEvent;
    import Image = Laya.Image;
    import BaseItem = modules.bag.BaseItem;
    import CustomClip = modules.common.CustomClip;
    import FashionRefineCfg = modules.config.FashionRefineCfg;
    import RefineInfoFields = Protocols.RefineInfoFields;
    import fashion_refine = Configuration.fashion_refine;
    import fashion_refineFields = Configuration.fashion_refineFields;
    import BagModel = modules.bag.BagModel;
    import ItemFields = Protocols.ItemFields;
    import BagUtil = modules.bag.BagUtil;
    import BinghunItem = modules.immortals.BinghunItem;
    import UpdateFashionInfo = Protocols.UpdateFashionInfo;
    import UpdateFashionInfoFields = Protocols.UpdateFashionInfoFields;
    import RefineInfo = Protocols.RefineInfo;
    import FeedSkillType = ui.FeedSkillType;

    export class FashionFuHunPanel extends ImmortalFuhunViewUI {
        //消耗品
        private _consumables: BaseItem;
        private btnClip: CustomClip;
        private _upGradeEff: CustomClip; //升级特效

        private _attrNameTxts: Array<Laya.Text>;
        private _attrValueTxts: Array<Laya.Text>;
        private _upAttrTxts: Array<Laya.Text>;
        private _hunArr: Array<BaseView>;
        private _currPitchHun: int;

        private _arrowImgs: Array<Image>;
        private _refineTypeNames: Array<string>;
        private _numDiff: number;
        private _needMatCount: number;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            this._upAttrTxts.length = 0;
            this._upAttrTxts = null;
            this._arrowImgs.length = 0;
            this._arrowImgs = null;
            this._attrNameTxts.length = 0;
            this._attrNameTxts = null;
            this._attrValueTxts.length = 0;
            this._attrValueTxts = null;
            if (this._refineTypeNames) {
                this._refineTypeNames.length = 0;
                this._refineTypeNames = null;
            }
            this.btnClip = this.destroyElement(this.btnClip);
            this._upGradeEff = this.destroyElement(this._upGradeEff);
            this._hunArr = this.destroyElement(this._hunArr);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;


            this.sumAttrBtn.underline = true;
            this._refineTypeNames = ["五彩衣魂", "锦绣衣魂", "辉煌衣魂", "霓裳衣魂"];

            this.creatEffect();

            this.fuhunTab.selected = true;

            this._consumables = new BaseItem();
            this._consumables.pos(318, 918);
            this._consumables.scale(0.8, 0.8);
            this.addChild(this._consumables);

            this._upAttrTxts = [this.liftTxt_1, this.liftTxt_2, this.liftTxt_3, this.liftTxt_4, this.liftTxt_5, this.liftTxt_6];
            this._arrowImgs = [this.upArrImg_1, this.upArrImg_2, this.upArrImg_3, this.upArrImg_4, this.upArrImg_5, this.upArrImg_6];
            this._attrNameTxts = [this.nameTxt_1, this.nameTxt_2, this.nameTxt_3, this.nameTxt_4, this.nameTxt_5, this.nameTxt_6];
            this._attrValueTxts = [this.valueTxt_1, this.valueTxt_2, this.valueTxt_3, this.valueTxt_4, this.valueTxt_5, this.valueTxt_6];

            this._currPitchHun = 0;
            this._hunArr = new Array<BaseView>();
            this._hunArr = [this.binghun_1, this.binghun_2, this.binghun_4, this.binghun_3];

            this.binghun_1.frameImg.visible = true;
            for (let i: int = 0, len: int = this._hunArr.length; i < len; i++) {
                (<BinghunItem>this._hunArr[i]).setType(FeedSkillType.fashion);
                (<BinghunItem>this._hunArr[i]).setIndex(i + 1);
            }
            this._numDiff = 0;

            this.titleTxt.text = "时装";
            this.title_txt.skin = "immortal/txt_fy.png";
            this.bgImg0.skin = "immortal/bg_cb_fuhun.png";
            
            // this.label_lt.text = "绮罗衣灵";
            // this.label_rt.text = "紫绶衣灵";
            // this.label_lb.text = "霓裳衣灵";
            // this.label_rb.text = "金絮衣灵";
        }

        protected onOpened(): void {
            super.onOpened();

            this.btnClip.visible = this._upGradeEff.visible = false;
            this._currPitchHun = 0;
            this.upGradeTab.label = "升级";
            this.huanhuaTab.label = "幻化";
            this.fuhunTab.label = "附魔";
            this.goBtn.label = "升级";
            this.updateFashionInfo();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.upGradeTab, LayaEvent.CLICK, this, this.shengjiHandler);
            this.addAutoListener(this.huanhuaTab, LayaEvent.CLICK, this, this.huanhuaHandler);
            this.addAutoListener(this.aboutBtn, LayaEvent.CLICK, this, this.openAbout);
            this.addAutoListener(this.goBtn, LayaEvent.CLICK, this, this.goBtnFunc);
            this.addAutoListener(this.sumAttrBtn, LayaEvent.CLICK, this, this.openSumAttr);
            this.addAutoListener(this._upGradeEff, LayaEvent.COMPLETE, this, this.closeEff);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateFashionInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FASHION_INFO_UPDATE, this, this.updateFashionInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FASHION_REFINE_SUCCESS, this, this.refineSuccessHandler);

            for (let i: int = 0, len: int = this._hunArr.length; i < len; i++) {
                this.addAutoListener(this._hunArr[i], LayaEvent.CLICK, this, this.selectHun, [i]);
            }

            this.addAutoRegisteRedPoint(this.dotImg_1, ["fashionShengJiRP", "fashionShengJiMatRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_2, ["fashionHuanHuaJiPinRP", "fashionHuanHuaZhenPinRP", "fashionHuanHuaJuePinRP","fashionHuanHuaDianchangRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_3, ["fashionFuHunRP"]);
        }

        private shengjiHandler(): void {
            WindowManager.instance.open(WindowEnum.FASHION_SHENG_JI_PANEL);
        }

        private huanhuaHandler(): void {
            WindowManager.instance.open(WindowEnum.FASHION_HUAN_HUA_PANEL);
        }

        private closeEff(): void {
            this._upGradeEff.visible = false;
        }

        private refineSuccessHandler(): void {
            this._upGradeEff.visible = true;
            this._upGradeEff.play();
            this._upGradeEff.pos(this._hunArr[this._currPitchHun].x - 70, this._hunArr[this._currPitchHun].y - 75);
            // if (FashionModel.instance.refineType === 0)
            //     this._upGradeEff.pos(45, 127 - 9);
            // else if (FashionModel.instance.refineType === 1)
            //     this._upGradeEff.pos(418, 127 - 9);
            // else if (FashionModel.instance.refineType === 2)
            //     this._upGradeEff.pos(423, 345 - 9);
            // else
            //     this._upGradeEff.pos(45, 345 - 9);
        }

        private selectHun(index: int): void {
            for (let i: int = 0, len: int = this._hunArr.length; i < len; i++) {
                (<BinghunItem>this._hunArr[i]).frameImg.visible = false;
            }
            this._currPitchHun = index;
            (<BinghunItem>this._hunArr[this._currPitchHun]).frameImg.visible = true;

            let cfg, nextCfg;

            let refineInfo: RefineInfo;
            let arr: Array<RefineInfo> = FashionModel.instance.fashionInfo[UpdateFashionInfoFields.refineList];
            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                if (this._currPitchHun === arr[i][RefineInfoFields.type]) {
                    refineInfo = arr[i];
                    break;
                }
            }
            let lev = refineInfo ? refineInfo[RefineInfoFields.level] : 0;
            cfg = FashionRefineCfg.instance.getCfgByTypeAndLv(this._currPitchHun, lev);
            nextCfg = FashionRefineCfg.instance.getCfgByTypeAndLv(this._currPitchHun, lev + 1);

            this.setAttr(cfg, nextCfg);

            if ((<BinghunItem>this._hunArr[this._currPitchHun]).dotImg.visible) {
                this.btnClip.visible = true;
                this.btnClip.play();
                return;
            }
        }

        /**
         * 把UI更新 从切换界面组 抽离
         */
        public updateFashionInfo() {
            let info: UpdateFashionInfo = FashionModel.instance.fashionInfo;
            if (!info) return;
            this.atkMsz.value = info[UpdateFashionInfoFields.refineFighting].toString();
            let arr: Array<RefineInfo> = info[UpdateFashionInfoFields.refineList];
            for (let i: int = 0, len: int = 4; i < len; i++) {
                let t: RefineInfo;
                for (let j: int = 0, len1: int = arr.length; j < len1; j++) {
                    if (i === arr[j][RefineInfoFields.type]) {
                        t = arr[j];
                        break;
                    }
                }
                (<BinghunItem>this._hunArr[i]).refineInfo = t;
            }
            this.theOperational();
        }

        /**
         * 定位可以操作的选项
         */
        public theOperational() {
            if ((<BinghunItem>this._hunArr[this._currPitchHun]).dotImg.visible) {
                this.selectHun(this._currPitchHun);
                return;
            }
            for (let i: int = 0, len: int = this._hunArr.length; i < len; i++) {
                if ((<BinghunItem>this._hunArr[i]).dotImg.visible) {
                    this.selectHun(i);
                    return;
                }
            }
            this.selectHun(0);
        }

        //设置属性加成列表
        private setAttr(cfg: fashion_refine, nextCfg: fashion_refine): void {
            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._attrNameTxts,
                this._attrValueTxts,
                this._arrowImgs,
                this._upAttrTxts,
                fashion_refineFields.attrs
            );

            // if (t <= 2) this.img_line0.y = 80;
            // else if (t <= 4) this.img_line0.y = 120;
            // else if (t <= 6) this.img_line0.y = 160;

            let items: Array<number> = cfg[fashion_refineFields.items];

            this.refineConTxt.visible = false;
            this.fullLevelImg.visible = false;

            if (nextCfg) {    //可以升级
                this._consumables.visible = true;
                this.goBtn.visible = true;
                let hasItemNum: int = BagModel.instance.getItemCountById(items[0]);
                this._needMatCount = items[1];
                this._consumables.dataSource = [items[0], 0, 0, null];
                //消耗道具 颜色判定修改
                let colorStr = "#22af1f";
                if (hasItemNum < items[1]) {
                    this._consumables.setNum(`${hasItemNum}/${items[1]}`, colorStr);
                } else {
                    colorStr = "#22af1f";
                    this._consumables.setNum(`${hasItemNum}/${items[1]}`, colorStr);
                }
                this._numDiff = hasItemNum - items[1];
                this.btnClip.visible = this._numDiff >= 0;
                this._numDiff >= 0 ? this.btnClip.play() : this.btnClip.stop();
                this.refineConTxt.visible = false;

                if (cfg[fashion_refineFields.humanLevel] > PlayerModel.instance.level) {
                    this.refineConTxt.text = `${this._refineTypeNames[this._currPitchHun]}附魔已达上限，主角达到${cfg[fashion_refineFields.humanLevel]}级可突破上限。`;
                    this.refineConTxt.visible = true;
                    this.goBtn.visible = false;
                }
            } else {          //没有下一级
                this._needMatCount = 0;
                this._consumables.visible = this.goBtn.visible = this.refineConTxt.visible = this.btnClip.visible = false;
                this.btnClip.stop();
                this.fullLevelImg.visible = true;
            }
        }

        private creatEffect(): void {
            // this.btnClip = new CustomClip();
            // this.btnClip.skin = "assets/effect/btn_light.atlas";
            // this.btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
            //     "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
            //     "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            // this.btnClip.durationFrame = 5;
            // this.btnClip.loop = true;
            this.btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16, false);
            this.goBtn.addChild(this.btnClip);
            this.btnClip.pos(-10, -15);
            this.btnClip.scale(0.9, 0.9);
            this.btnClip.visible = false;

            // this._upGradeEff = new CustomClip();
            // this._upGradeEff.skin = "assets/effect/activate.atlas";
            // this._upGradeEff.frameUrls = ["activate/0.png", "activate/1.png", "activate/2.png", "activate/3.png"];
            // this._upGradeEff.durationFrame = 5;
            // this._upGradeEff.loop = false;
            this._upGradeEff = CustomClip.createAndPlay("assets/effect/activate.atlas", "activate", 4, false, false);
            this.addChild(this._upGradeEff);
            this._upGradeEff.visible = false;
        }

        //升级按钮
        private goBtnFunc(): void {

            let id = this._consumables.itemData[ItemFields.ItemId];

            if (this._numDiff >= 0) {
                FashionCtrl.instance.addFashionRefine(this._currPitchHun);
            } else {
                BagUtil.openLackPropAlert(id, -this._numDiff);
            }
        }

        //关于
        private openAbout(): void {
            CommonUtil.alertHelp(20049);
        }

        private openSumAttr(): void {
            //总有属性有 新的额外属性 （标识 方便修改）
            WindowManager.instance.openDialog(WindowEnum.ATTR_ALERT,
                ["附魔总属性",
                    FashionModel.instance.fashionInfo[UpdateFashionInfoFields.refineFighting],
                    FashionModel.instance.fashionInfo[UpdateFashionInfoFields.refineAttr],
                    FashionRefineCfg.instance.attrIndices
                ]);
        }
    }
}