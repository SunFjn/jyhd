/** 铸魂+铸魂总属性框 */


namespace modules.goldBody {

    import GoldBodyUnbeatenAlertUI = ui.GoldBodyUnbeatenAlertUI;
    import Event = Laya.Event;
    import Text = Laya.Text;
    import SoulRise = Protocols.SoulRise;
    import SoulRiseFields = Protocols.SoulRiseFields;
    import soulRise = Configuration.soulRise;
    import soulRiseFields = Configuration.soulRiseFields;
    import SoulRefineInfo = Protocols.SoulRefineInfo;
    import SoulRefineInfoFields = Protocols.SoulRefineInfoFields;
    import SoulRefineFields = Protocols.SoulRefineFields;
    import BtnGroup = modules.common.BtnGroup;
    import CustomClip = modules.common.CustomClip;
    import attr = Configuration.attr;
    import attr_item = Configuration.attr_item;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attrFields = Configuration.attrFields;
    import attr_itemFields = Configuration.attr_itemFields;
    import AttrUtil = modules.common.AttrUtil;
    import TypesAttr = Protocols.TypesAttr;
    import TypesAttrFields = Protocols.TypesAttrFields;

    export class GoldBodyUnbeatenAlert extends GoldBodyUnbeatenAlertUI {
        constructor() {
            super();
        }

        private _nowNameTxts: Array<Text>;
        private _nowValueTxts: Array<Text>;
        private _nextNameTxts: Array<Text>;
        private _nextValueTxts: Array<Text>;
        // 切页按钮组
        private _tabGroup: BtnGroup;
        private _btnClip: CustomClip;

        private _totalAttrNameTxts: Array<Text>;
        private _totalAttrValueTxts: Array<Text>;

        public destroy(): void {
            if (this._tabGroup) {
                this._tabGroup.destroy();
                this._tabGroup = null;
            }
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();
            this._nowNameTxts = [this.nowfirName, this.nowsecName];
            this._nowValueTxts = [this.nowfirNum, this.nowsecNum];
            this._nextNameTxts = [this.nextfirName, this.nextsecName];
            this._nextValueTxts = [this.nextfirNum, this.nextsecNum];
            this._totalAttrNameTxts = [this.attrName0, this.attrName1, this.attrName2, this.attrName3, this.attrName4, this.attrName5, this.attrName6, this.attrName7, this.attrName8, this.attrName9, this.attrName10, this.attrName11];
            this._totalAttrValueTxts = [this.attrValue0, this.attrValue1, this.attrValue2, this.attrValue3, this.attrValue4, this.attrValue5, this.attrValue6, this.attrValue7, this.attrValue8, this.attrValue9, this.attrValue10, this.attrValue11];
            this._tabGroup = new BtnGroup();
            this._tabGroup.setBtns(this.unbeatenBtn, this.qualityBtn);
            this._btnClip = new CustomClip();
            this.unbeatenDetail.addChild(this._btnClip);
            this._btnClip.skin = "assets/effect/btn_light.atlas";
            this._btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png", "btn_light/5.png", "btn_light/6.png", "btn_light/7.png",
                "btn_light/8.png", "btn_light/9.png", "btn_light/10.png", "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this._btnClip.durationFrame = 5;
            this._btnClip.scale(1.2,1.1)
            this._btnClip.pos(133, 268, true);
        }


        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.unbeatenHandler();
        }

        protected addListeners(): void {
            super.addListeners();
            this.trainingBtn.on(Event.CLICK, this, this.trainingHandler);
            this._tabGroup.on(Event.CHANGE, this, this.changeTabHandler);
            this._tabGroup.selectedIndex = 0;
            GlobalData.dispatcher.on(CommonEventType.GOLD_BODY_UPDATE, this, this.unbeatenUpdate);

        }

        protected removeListeners(): void {
            super.removeListeners();
            this.trainingBtn.off(Event.CLICK, this, this.trainingHandler);
            this._tabGroup.off(Event.CHANGE, this, this.changeTabHandler);
            GlobalData.dispatcher.off(CommonEventType.GOLD_BODY_UPDATE, this, this.unbeatenUpdate);
        }

        //相应按钮切换
        private changeTabHandler(): void {
            switch (this._tabGroup.selectedIndex) {
                case 0:     // 铸魂
                    this.unbeatenHandler();
                    break;
                case 1:     // 铸魂总属性
                    this.totalinfoHandler();
                    break;
            }
        }

        //修炼按钮点击事件
        private trainingHandler(): void {
            GoldBodyCtrl.instance.riseSoul();
        }

        //铸魂修炼界面设置
        private unbeatenHandler(): void {
            this.unbeatenDetail.visible = true;
            this.textbg.height = 284;
            this.textbg.y = 169;
            this.trainingBtn.visible = true;
            this.totalInfo.visible = false;

            this.titleText.visible = true;
            this.title_left.visible = true;
            this.white_bg1.visible = true;
            this.white_bg2.visible = true;
            this.titleText.visible = true
            this.all_title.visible = false;
            this.unbeatenUpdate();
        }

        //铸魂修炼界面更新-----------------------------铸魂修炼红点控制----------------------------
        private unbeatenUpdate(): void {
            if (GoldBodyModel.instance.checkRiseCanTraining()) {
                this.riseRedImg.visible = true;
                this._btnClip.play();
                this._btnClip.visible = true;
            } else {
                this.riseRedImg.visible = false;
                this._btnClip.stop();
                this._btnClip.visible = false;
            }
            let level: number = 0;
            let info: SoulRise = GoldBodyModel.instance._rise;
            level = info[SoulRiseFields.level];
            let isLevelUp = info[SoulRiseFields.point];
            this.titleText.text = level + '阶';
            let cfg: soulRise = GoldBodyModel.instance.getAttrByLevel(level);
            this.powerNum.value = cfg[soulRiseFields.fighting].toString();
            this.setAttrs(0, cfg);
            if (level == 0) {
                this.nowText.visible = false;
                this.nowhasText.visible = false;
                this.nowfirName.text = '无加成';
                this.nowfirName.visible = true;
            } else {
                let forwardCfg: soulRise = GoldBodyModel.instance.getAttrByLevel(level - 1);
                this.nowText.text = forwardCfg[soulRiseFields.count] + '种铸魂达到' + Math.ceil(forwardCfg[soulRiseFields.refineLevel] / 10) + '阶';
                this.nowhasText.visible = true;
                this.nowText.visible = true;
            }

            //判断是否达到最大重数
            if (GoldBodyModel.instance.checkIsRiseMax(level)) {
                // this.nextText.text = '已达到最大重数';
                // this.nextText.color = '#00ad35';
                this.maxCSText.visible = true;
                this.nextText.visible = this.trainingBtn.visible = this.activeTxt.visible = this.nextInfo.visible = this.nexthasText.visible = false;
            } else {
                this.maxCSText.visible = false;
                let nextCfg: soulRise = GoldBodyModel.instance.getAttrByLevel(level + 1);
                let needLevel = cfg[soulRiseFields.refineLevel];
                let needNum = cfg[soulRiseFields.count];
                this.nextText.text = needNum + '种铸魂达到' + Math.ceil(needLevel / 10) + '阶';
                this.nextText.color = '#2d2d2d';
                this.setAttrs(1, nextCfg);
                let fitSoulNum = this.getNumByLevel(needLevel);
                this.trainingBtn.visible = this.nextInfo.visible = this.nexthasText.visible = true;
                this.nexthasText.text = `(${fitSoulNum}/${needNum})`;
                if (isLevelUp) {
                    this.activeTxt.visible = true;
                    this.nextInfo.y = 196;
                    this.nexthasText.color = '#00ad35';
                    this.trainingBtn.disabled = false;
                } else {
                    this.activeTxt.visible = false;
                    this.nextInfo.y = 158;
                    this.nexthasText.color = '#e5070b';
                    this.trainingBtn.disabled = true;
                }
            }

        }

        //根据等级获得达到要求的铸魂数量
        private getNumByLevel(lv: number): number {
            let infos: Array<SoulRefineInfo> = GoldBodyModel.instance._refine[SoulRefineFields.list];
            let soulNum: number = 0;
            if (infos.length > 0) {
                for (let i = 0; i < infos.length; i++) {
                    if (infos[i][SoulRefineInfoFields.level] >= lv) {
                        soulNum++;
                    }
                }
                return soulNum;
            }
            return 0;
        }

        // 设置铸魂属性加成列表
        private setAttrs(type: number, cfg: soulRise) {
            let allNames: Array<Text> = new Array<Text>();
            let allValues: Array<Text> = new Array<Text>();
            if (type == 0) {
                allNames = this._nowNameTxts;
                allValues = this._nowValueTxts;
            } else {
                allNames = this._nextNameTxts;
                allValues = this._nextValueTxts;
            }
            let t: int = 0;
            let attrs: Array<attr> = cfg[soulRiseFields.attrs];
            for (let i: int = 0; i < attrs.length; i++) {
                let attrCfg: attr_item = AttrItemCfg.instance.getCfgById(attrs[i][attrFields.type]);
                let attrValue: number = attrs[i][attrFields.value];
                allNames[t].visible = allValues[t].visible = true;
                allNames[t].text = attrCfg[attr_itemFields.name];
                allValues[t].text = attrCfg[attr_itemFields.isPercent] ? "+" + AttrUtil.formatFloatNum(attrValue) + "%" : "+" + Math.round(attrValue) + "";
                allValues[t].x = allNames[t].x + allNames[t].textWidth + 8;
                t++;
            }
            for (let i: int = t; i < allNames.length; i++) {
                allNames[i].visible = allValues[i].visible = false;
            }
        }

        //铸魂总属性界面设置
        private totalinfoHandler(): void {
            if (GoldBodyModel.instance.checkRiseCanTraining())
                this.riseRedImg.visible = true;
            else
                this.riseRedImg.visible = false;
            this.titleText.visible = false;
            this.title_left.visible = false
            this.white_bg1.visible = false;
            this.white_bg2.visible = false;
            this.titleText.visible = false
            this.all_title.visible = true;

            this.unbeatenDetail.visible = false;
            this.textbg.height = 253;
            // this.textbg.y = 222;
            this.totalInfo.y=200
            this.trainingBtn.visible = false;
            this.totalInfo.visible = true;
           
            let info: SoulRise = GoldBodyModel.instance._rise;
            let cfg: soulRise = GoldBodyModel.instance.getAttrByLevel(info[SoulRiseFields.level]);
            let fightingNum: number = GoldBodyModel.instance._refine[SoulRefineFields.fighting] + cfg[soulRiseFields.fighting];
            fightingNum = Math.round(fightingNum);
            this.powerNum.value = fightingNum.toString();
            //设置下方显示属性
            for (let index = 0; index < this._totalAttrNameTxts.length; index++) {
                this._totalAttrNameTxts[index].visible = this._totalAttrValueTxts[index].visible = false;
            }
            let attrs: Array<TypesAttr> = GoldBodyModel.instance._attr;
            let attrTypes: Array<int> = GoldBodyUtil.soulTotalAttrIndices;      // 必须显示的属性
            for (let i: int = 0, len: int = attrTypes.length; i < len; i++) {
                let attr: TypesAttr = AttrUtil.getAttrByType(attrTypes[i], attrs);
                let attrCfg: attr_item = AttrItemCfg.instance.getCfgById(attrTypes[i]);
                let attrValue: number = attr ? attr[TypesAttrFields.value] : 0;
                let attrValueStr: string = attrCfg[attr_itemFields.isPercent] ? AttrUtil.formatFloatNum(attrValue) + "%" : Math.round(attrValue) + "";
                this._totalAttrNameTxts[i].text = attrCfg[attr_itemFields.name] + "：";
                this._totalAttrValueTxts[i].text = ` ${attrValueStr}`;
                if (attrTypes[i] === 61 || attrTypes[i] === 62) {        // 总的铸魂攻击和铸魂生命属性
                    this._totalAttrNameTxts[i].visible = this._totalAttrValueTxts[i].visible = attrValue !== 0;
                } else {
                    this._totalAttrNameTxts[i].visible = this._totalAttrValueTxts[i].visible = true;
                }
                this._totalAttrNameTxts[i].width = this._totalAttrNameTxts[i].textWidth;
            }
            for (let index = 0; index < this._totalAttrNameTxts.length; index++) {
                this._totalAttrValueTxts[index].x = this._totalAttrNameTxts[index].x + this._totalAttrNameTxts[index].width + 7;
            }
        }
    }
}