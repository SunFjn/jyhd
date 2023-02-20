/** 铸魂+铸魂总属性框 */
namespace modules.explicit {
    import ExplicitSuitAttrAlertUI = ui.ExplicitSuitAttrAlertUI;
    import Text = Laya.Text;
    import exterior_suit_Field = Configuration.exterior_suit_Field;
    import exterior_suit_feed_Field = Configuration.exterior_suit_feed_Field;
    import AutoSC_ShowSuitInfoFields = Protocols.AutoSC_ShowSuitInfoFields;
    import AutoSC_ShowSuitLevelFields = Protocols.AutoSC_ShowSuitLevelFields;
    import AutoSC_ShowSuitPosHallucinationID = Protocols.AutoSC_ShowSuitPosHallucinationID;
    import Image = Laya.Image;
    import ExteriorSuitCfg = modules.config.ExteriorSuitCfg;
    import ExteriorSuitFeedCfg = modules.config.ExteriorSuitFeedCfg;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attrFields = Configuration.attrFields;
    import attr_itemFields = Configuration.attr_itemFields;
    import attr_item = Configuration.attr_item;
    import AttrUtil = modules.common.AttrUtil;
    export class ExplicitSuitAttrAlert extends ExplicitSuitAttrAlertUI {
        constructor() {
            super();
        }

        private _attrNameTxts: Array<Text>;
        private _attrValuexts: Array<Text>;
        private _nextNameTxts: Array<Text>;
        private _nextValueTxts: Array<Text>;
        private _nextUpTxts: Array<Text>;
        private _nextArrowImgs: Array<Image>;
        public destroy(): void {
            
            super.destroy();
        }

        protected initialize(): void {
            super.initialize();
            this._attrNameTxts = [this.nowsecName0, this.nowsecName1,this.nowsecName2];
            this._attrValuexts = [this.nowsecNum0, this.nowsecNum1, this.nowsecNum2];
            this._nextNameTxts = [this.nameTxt_1, this.nameTxt_2,this.nameTxt_3];
            this._nextValueTxts = [this.valueTxt_1, this.valueTxt_2,this.valueTxt_3];
            this._nextUpTxts = [this.liftTxt_1, this.liftTxt_2,this.liftTxt_3];
            this._nextArrowImgs = [this.upArrImg_1, this.upArrImg_2,this.upArrImg_3];

        }


        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            let id = value[0][exterior_suit_Field.id];
            this.updateInfo(id);
        }

        protected addListeners(): void {
            super.addListeners();
            //this.trainingBtn.on(Event.CLICK, this, this.trainingHandler);
            //GlobalData.dispatcher.on(CommonEventType.GOLD_BODY_UPDATE, this, this.unbeatenUpdate);

        }

        protected removeListeners(): void {
            super.removeListeners();
           
            //GlobalData.dispatcher.off(CommonEventType.GOLD_BODY_UPDATE, this, this.unbeatenUpdate);
        }
          //设置属性加成列表
        private updateInfo(suitId:number) :void {
            let curShowSuitLevel = ExplicitSuitModel.instance.getShowSuitLevelInfo(suitId);
            let suitFeedInfo = ExteriorSuitFeedCfg.instance.getCfgById(suitId);
            let suitInfo = ExteriorSuitCfg.instance.getCfgById(suitId);
            let curShowSuitPosLevel = ExplicitSuitModel.instance.getShowSuitPosLevelInfo(suitId);
            let showSuitPosHallucinationIDs:AutoSC_ShowSuitPosHallucinationID = ExplicitSuitModel.instance.suitInfo[AutoSC_ShowSuitInfoFields.posHallucinationID];
            let curLevel = curShowSuitLevel[AutoSC_ShowSuitLevelFields.level];
            this.powerNum.value = curLevel > -2 ? suitFeedInfo[curLevel][exterior_suit_feed_Field.fighting].toString():"0";//战力
            let count = 0;//激活部件数量
            for (let index = 0,len = showSuitPosHallucinationIDs.length; index < len; index++) {
                if (curShowSuitPosLevel[1][index] != 0) {
                    count++;
                }
            }
           
            let nextCfg = suitFeedInfo[curLevel + 1];
            let nextAttrs = null;
            if (nextCfg) {
                nextAttrs = nextCfg[exterior_suit_feed_Field.attrs];
            }
            let attrs = suitFeedInfo[curLevel] ?suitFeedInfo[curLevel][exterior_suit_feed_Field.attrs]:[];
            if (attrs.length) {
                for (let index = 0; index < 2; index++) {
                    let curAttr = attrs[index];
                    let attCfg: attr_item = AttrItemCfg.instance.getCfgById(curAttr[attrFields.type]);
                    let isPercent: number = attCfg[attr_itemFields.isPercent];
                    let curAttrStr: string = curAttr ? isPercent ? AttrUtil.formatFloatNum(curAttr[attrFields.value]) + "%" : Math.round(curAttr[attrFields.value]).toString(): "0";
                    this._attrNameTxts[index].text = attCfg[attr_itemFields.name] + ":";
                    this._attrValuexts[index].text = curAttrStr;
                    this._nextNameTxts[index].text = attCfg[attr_itemFields.name] + ":";
                    this._nextValueTxts[index].text = curAttrStr;
                    if (nextAttrs) {
                        let nextAttr = nextAttrs[index];
                        this._nextUpTxts[index].visible = this._nextArrowImgs[index].visible = true;
                        let value: number = nextAttr[attrFields.value] - (curAttr ? curAttr[attrFields.value] : 0);
                        this._nextUpTxts[index].text = isPercent ? AttrUtil.formatFloatNum(value) + "%" : Math.round(value).toString();
                    } else {
                        this._nextUpTxts[index].visible = this._nextArrowImgs[index].visible = false;
                    }
                }
            } else {//-2等级
               let nextAttrs = suitFeedInfo[curLevel + 1] ?suitFeedInfo[curLevel + 1][exterior_suit_feed_Field.attrs]:[];
                for (let index = 0; index < 2; index++) {
                    let curAttr = nextAttrs[index];
                    let attCfg: attr_item = AttrItemCfg.instance.getCfgById(curAttr[attrFields.type]);
                    this._attrNameTxts[index].text = attCfg[attr_itemFields.name] + ":";
                    this._attrValuexts[index].text = "0";
                    this._nextNameTxts[index].text = attCfg[attr_itemFields.name] + ":";
                    this._nextValueTxts[index].text = "0";
                    this._nextUpTxts[index].text = Math.round(nextAttrs[index][attrFields.value]).toString();
                }
            }

            //
            let curAttr = attrs[2];
            this._attrNameTxts[2].text = `[${suitInfo[exterior_suit_Field.name]}]套装全部外显属性`;
            this._nextNameTxts[2].text = `[${suitInfo[exterior_suit_Field.name]}]套装全部外显属性`;
            if (curAttr) {
                this._nextValueTxts[2].text = AttrUtil.formatFloatNum(curAttr[attrFields.value]) + "%";
                this._attrValuexts[2].text = AttrUtil.formatFloatNum(curAttr[attrFields.value]) + "%";
            } else {
                this._nextValueTxts[2].text = `${0}%`
                this._attrValuexts[2].text = `${0}%`
            }

            if (nextAttrs) {
                let nextAttr = nextAttrs[2];
                this._nextUpTxts[2].visible = this._nextArrowImgs[2].visible = true;
                let value: number = curAttr ? nextAttr[attrFields.value] - (curAttr ? curAttr[attrFields.value] : 0):0;
                this._nextUpTxts[2].text = AttrUtil.formatFloatNum(value) + "%";
            } else {
                this._nextUpTxts[2].visible = this._nextArrowImgs[2].visible = false;
            }

            //进阶条件
            let condCount = 0;
            let condition = suitFeedInfo[curLevel + 1] ? suitFeedInfo[curLevel + 1][exterior_suit_feed_Field.condition]:[];
            if (condition.length) {
                for (let index = 0,len = showSuitPosHallucinationIDs.length; index < len; index++) {
                    if (curShowSuitPosLevel[1][index] >= condition[1]) {
                        condCount++;
                    }
                }
                this.next_title_1.text = `[${suitInfo[exterior_suit_Field.name]}]全部外显达到${condition[1]}阶`;
            }else{
                if (curShowSuitLevel[AutoSC_ShowSuitLevelFields.level] == -2) {
                    this.next_title_1.text = `[${suitInfo[exterior_suit_Field.name]}]激活套装2件外显`;
                }else if (curShowSuitLevel[AutoSC_ShowSuitLevelFields.level] == -1) {
                    this.next_title_1.text = `[${suitInfo[exterior_suit_Field.name]}]激活套装全部外显`;
                }
                this.next_title_2.visible = false;
            }

            //消耗道具
            this.next_title_2.text = `(${condCount}/3)`;
            this.next_title_1.x = this.next_title_0.x +  this.next_title_0.textWidth;
            this.next_title_2.x = this.next_title_1.x +  this.next_title_1.textWidth;
            //n
            for (let index = 0; index < 3; index++) {
              this._attrValuexts[index].x =  this._attrNameTxts[index].x + this._attrNameTxts[index].textWidth + 10;
              this._nextValueTxts[index].x =  this._nextNameTxts[index].x + this._nextNameTxts[index].textWidth + 10;
              this._nextArrowImgs[index].x =  this._nextValueTxts[index].x + this._nextValueTxts[index].textWidth + 10;
              this._nextUpTxts[index].x =  this._nextArrowImgs[index].x + this._nextArrowImgs[index].width + 10;
            }
        } 
    }
}