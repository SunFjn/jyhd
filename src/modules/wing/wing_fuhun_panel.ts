///<reference path="../config/immortals_cfg.ts"/>
///<reference path="../config/wing_cfg.ts"/>
///<reference path="../immortals/sb_item.ts"/>

namespace modules.wing {
    import BtnGroup = modules.common.BtnGroup;
    import Event = Laya.Event;
    import Text = Laya.Text;
    import RefineInfoFields = Protocols.RefineInfoFields;
    import CustomClip = modules.common.CustomClip;
    import BagModel = modules.bag.BagModel;
    import wing_refine = Configuration.wing_refine;
    import Image = Laya.Image;
    import WingCfg = modules.config.WingCfg;
    import BinghunItem = modules.immortals.BinghunItem;
    import wing_refineFields = Configuration.wing_refineFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import PlayerModel = modules.player.PlayerModel;
    import BaseItem = modules.bag.BaseItem;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import ItemFields = Protocols.ItemFields;
    import BagUtil = modules.bag.BagUtil;
    import WingFuhunViewUI = ui.WingFuhunViewUI;
    import FeedSkillType = ui.FeedSkillType;

    export class WingFuhunPanel extends WingFuhunViewUI {
        // 按钮组
        private _btnGroup: BtnGroup;

        //消耗品
        private _consumables: BaseItem;
        private btnClip: CustomClip;
        private _upGradeEff: CustomClip; //升级特效

        private _attrNameTxts: Array<Text>;
        private _attrValueTxts: Array<Text>;
        private _upAttrTxts: Array<Text>;
        private _hunArr: Array<BaseView>;
        private _currPitchHun: int;

        private _arrowImgs: Array<Image>;
        private _refineTypeNames: Array<string>;
        private _numDiff: number;

        public destroy(destroyChild: boolean = true): void {
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._consumables = this.destroyElement(this._consumables);
            this.btnClip = this.destroyElement(this.btnClip);
            this._upGradeEff = this.destroyElement(this._upGradeEff);
            this._attrNameTxts = this.destroyElement(this._attrNameTxts);
            this._attrValueTxts = this.destroyElement(this._attrValueTxts);
            this._upAttrTxts = this.destroyElement(this._upAttrTxts);
            this._arrowImgs = this.destroyElement(this._arrowImgs);
            this._hunArr = this.destroyElement(this._hunArr);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;

            this.sumAttrBtn.underline = true;
            this._refineTypeNames = ["朱雀羽魂", "毕方羽魂", "鲲鹏羽魂", "红鸾羽魂"];

            this.btnClip = CommonUtil.creatEff(this.goBtn, `btn_light`, 15);
            this.btnClip.pos(-10, -15);
            this.btnClip.scale(0.9, 0.9);

            this._upGradeEff = CommonUtil.creatEff(this, `activate`, 3, 0, false);

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.upGradeTab, this.huanhuaTab, this.fuhunTab);

            this._consumables = new BaseItem();
            this._consumables.pos(318, 918);
            this._consumables.scale(0.8, 0.8);
            this.addChild(this._consumables);

            this._upAttrTxts = new Array<Text>();
            this._arrowImgs = new Array<Image>();

            this._upAttrTxts = [this.liftTxt_1, this.liftTxt_2, this.liftTxt_3, this.liftTxt_4, this.liftTxt_5, this.liftTxt_6];
            this._arrowImgs = [this.upArrImg_1, this.upArrImg_2, this.upArrImg_3, this.upArrImg_4, this.upArrImg_5, this.upArrImg_6];
            this._attrNameTxts = [this.nameTxt_1, this.nameTxt_2, this.nameTxt_3, this.nameTxt_4, this.nameTxt_5, this.nameTxt_6];
            this._attrValueTxts = [this.valueTxt_1, this.valueTxt_2, this.valueTxt_3, this.valueTxt_4, this.valueTxt_5, this.valueTxt_6];

            this._currPitchHun = 0;
            this._hunArr = new Array<BaseView>();
            this._hunArr = [this.binghun_1, this.binghun_2, this.binghun_4, this.binghun_3];

            this.binghun_1.frameImg.visible = true;
            for (let i: int = 0, len: int = this._hunArr.length; i < len; i++) {
                (<BinghunItem>this._hunArr[i]).setType(FeedSkillType.wing);
                (<BinghunItem>this._hunArr[i]).setIndex(i + 1);
            }

            this._numDiff = 0;
        }

        protected onOpened(): void {
            super.onOpened();
            this.btnClip.play();
            this.btnClip.visible = this._upGradeEff.visible = false;
            this._btnGroup.selectedIndex = 2;
            this._currPitchHun = 0;
            this.updateUI();
            this.theOperational();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._btnGroup, common.LayaEvent.CHANGE, this, this.changeHandler);
            this.addAutoListener(this.aboutBtn, common.LayaEvent.CLICK, this, this.openAbout);
            this.addAutoListener(this.goBtn, common.LayaEvent.CLICK, this, this.goBtnFunc);
            this.addAutoListener(this.sumAttrBtn, common.LayaEvent.CLICK, this, this.openSumAttr);
            this.addAutoListener(this._upGradeEff, common.LayaEvent.COMPLETE, this, this.closeEff);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.WING_UPDATE, this, this.updateUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_UPDATE, this, this.updateUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.BAG_DATA_INITED, this, this.updateUI);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XYFUHUN_UPDATA, this, this.showEffect);

            for (let i: int = 0, len: int = this._hunArr.length; i < len; i++) {
                this.addAutoListener(this._hunArr[i], common.LayaEvent.CLICK, this, this.selectHun, [i]);
            }

            this.addAutoRegisteRedPoint(this.dotImg_1, ["wingShengjiRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_2, ["wingHuanhuaJipinRP", "wingHuanhuaZhenpinRP", "wingHuanhuaJuepinRP","wingHuanhuaDianchangRP"]);
            this.addAutoRegisteRedPoint(this.dotImg_3, ["wingFuhunRP"]);
        }

        private closeEff(): void {
            this._upGradeEff.visible = false;
        }

        private showEffect(): void {

            this._upGradeEff.visible = true;
            this._upGradeEff.play();
            this._upGradeEff.pos(this._hunArr[this._currPitchHun].x - 70, this._hunArr[this._currPitchHun].y - 75);
            // if (this._currPitchHun == 0)
            //     this._upGradeEff.pos(45, 127 - 9);
            // else if (this._currPitchHun == 1)
            //     this._upGradeEff.pos(418, 127 - 9);
            // else if (this._currPitchHun == 2)
            //     this._upGradeEff.pos(423, 345 - 9);
            // else
            //     this._upGradeEff.pos(45, 345 - 9);
            this.theOperational();
        }

        private selectHun(index: int): void {

            for (let i: int = 0, len: int = this._hunArr.length; i < len; i++) {
                (<BinghunItem>this._hunArr[i]).frameImg.visible = false;
            }

            this._currPitchHun = index;

            (<BinghunItem>this._hunArr[this._currPitchHun]).frameImg.visible = true;

            let cfg, nextCfg;

            if (!WingModel.instance.getFuhunListByType(this._currPitchHun)) {  //未激活技能
                cfg = WingCfg.instance.getFuhunCfgByTypeAndLev(this._currPitchHun, 0);
                nextCfg = WingCfg.instance.getFuhunCfgByTypeAndLev(this._currPitchHun, 1);
            } else {
                let _lev = WingModel.instance.getFuhunListByType(this._currPitchHun)[RefineInfoFields.level];
                cfg = WingCfg.instance.getFuhunCfgByTypeAndLev(this._currPitchHun, _lev);
                nextCfg = WingCfg.instance.getFuhunCfgByTypeAndLev(this._currPitchHun, _lev + 1);
            }

            this.setAttr(cfg, nextCfg);

            if ((<BinghunItem>this._hunArr[this._currPitchHun]).dotImg.visible) {
                this.btnClip.visible = true;
                return;
            }
        }

        private changeHandler(): void {
            if (this._btnGroup.selectedIndex == 1) {
                WindowManager.instance.open(WindowEnum.WING_HUANHUA_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 0) {
                WindowManager.instance.open(WindowEnum.WING_SHENGJI_PANEL);
                return;
            }
        }

        /**
         * 把UI更新 从切换界面组 抽离
         */
        public updateUI() {
            this.atkMsz.value = WingModel.instance.otherValue["附魔战力"].toString();
            for (let i: int = 0, len: int = 4; i < len; i++) {
                //这里设置了红点后续可以根据红点判断可不可以操作
                (<BinghunItem>this._hunArr[i]).refineInfo = WingModel.instance.getFuhunListByType(i);
            }
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

        //升级按钮
        private goBtnFunc(): void {

            let id = this._consumables.itemData[ItemFields.ItemId];

            if (this._numDiff >= 0) {
                WingCtrl.instance.refineLev([this._currPitchHun]);
            } else {
                BagUtil.openLackPropAlert(id, -this._numDiff);
            }
        }

        //设置属性加成列表
        private setAttr(cfg: wing_refine, nextCfg: wing_refine): void {

            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._attrNameTxts,
                this._attrValueTxts,
                this._arrowImgs,
                this._upAttrTxts,
                wing_refineFields.attrs
            );
            // if (t <= 2) this.img_line0.y = 80;
            // else if (t <= 4) this.img_line0.y = 120;
            // else if (t <= 6) this.img_line0.y = 160;

            let items: Array<number>;
            items = (<wing_refine>cfg)[wing_refineFields.items];

            this.refineConTxt.visible = false;
            this.fullLevelImg.visible = false;

            if (nextCfg) {    //可以升级
                this._consumables.visible = true;
                this.goBtn.visible = true;
                let hasItemNum: int = BagModel.instance.getItemCountById(items[0]);
                this._consumables.dataSource = [items[0], 0, 0, null];
                //消耗道具 颜色判定修改
                let colorStr = "#25de25";
                if (hasItemNum < items[1]) {
                    this._consumables.setNum(`${hasItemNum}/${items[1]}`, colorStr);
                } else {
                    colorStr = "#25de25";
                    this._consumables.setNum(`${hasItemNum}/${items[1]}`, colorStr);
                }
                this._numDiff = hasItemNum - items[1];
                this.btnClip.visible = this._numDiff >= 0;
                this.refineConTxt.visible = false;

                if (cfg[wing_refineFields.humanLevel] > PlayerModel.instance.level) {
                    this.refineConTxt.text = `${this._refineTypeNames[this._currPitchHun]}附魔已达上限，主角达到${cfg[wing_refineFields.humanLevel]}级可突破上限。`;
                    this.refineConTxt.visible = true;
                    this.goBtn.visible = false;
                }

            } else {          //没有下一级
                this._consumables.visible = this.goBtn.visible = this.refineConTxt.visible = this.btnClip.visible = false;
                this.fullLevelImg.visible = true;
            }
        }

        private openSumAttr(): void {
            //总有属性有 新的额外属性 （标识 方便修改）
            WindowManager.instance.openDialog(WindowEnum.ATTR_ALERT,
                ["附魔修炼总属性",
                    WingModel.instance.otherValue["附魔战力"],
                    WingModel.instance.attr["附魔总属性"],
                    WingCfg.instance.fuhunAttrIndices
                ]);
        }

        //关于
        private openAbout(): void {
            CommonUtil.alertHelp(20018);
        }
    }
}