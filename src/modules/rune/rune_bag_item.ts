///<reference path="../config/rune_refine_cfg.ts"/>

namespace modules.rune {
    import RuneBagItemUI = ui.RuneBagItemUI;
    import Label = Laya.Label;
    import item_rune = Configuration.item_rune;
    import item_runeFields = Configuration.item_runeFields;
    import runeRefine = Configuration.runeRefine;
    import RuneRefineCfg = modules.config.RuneRefineCfg;
    import CustomClip = modules.common.CustomClip;
    import Event = Laya.Event;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import equip_attr_pool = Configuration.equip_attr_pool;
    import ItemAttrPoolCfg = modules.config.ItemAttrPoolCfg;
    import equip_attr_poolFields = Configuration.equip_attr_poolFields;
    import RuneCopyModel = modules.rune_copy.RuneCopyModel;
    import attr = Configuration.attr;
    import runeRefineFields = Configuration.runeRefineFields;
    import attr_item = Configuration.attr_item;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attrFields = Configuration.attrFields;
    import attr_itemFields = Configuration.attr_itemFields;
    import AttrUtil = modules.common.AttrUtil;

    export class RuneBagItem extends RuneBagItemUI {

        private _attNameArr: Array<Label>;
        private _btnClip: CustomClip;
        private _runeInfo: [number, number];
        private _attFitArr: Array<Label>;

        public destroy(destroyChild: boolean = true): void {
            this._attNameArr = this.destroyElement(this._attNameArr);
            this._btnClip = this.destroyElement(this._btnClip);
            this._attFitArr = this.destroyElement(this._attFitArr);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();

            this._attNameArr = [this.attNameTxt_0, this.attNameTxt_1];
            this._attFitArr = [this.attTxt, this.attNameTxt_0, this.attNameTxt_1];

            this._btnClip = CommonUtil.creatEff(this.inalyBtn, `btn_light`, 15);
            this._btnClip.scale(0.7, 0.8);
            this._btnClip.pos(-5, -12);
            this._btnClip.visible = false;

            this._runeInfo = [0, 0];
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.inalyBtn, Event.CLICK, this, this.inalyBtnHandler);
        }

        public onOpened(): void {
            super.onOpened();

            this._btnClip.play();
        }

        protected setData(value: any): void {

            value = value as Item;
            this._runeInfo = [RuneModel.instance.currClickPit, value[ItemFields.uid]];

            let runeId: number = value[ItemFields.ItemId];
            let type: number = CommonUtil.getStoneTypeById(runeId);
            let dimId: number = (runeId * 0.0001 >> 0) * 10000;  //模糊Id
            let lv: number = runeId % 10000;
            let currCopyLv: number = RuneCopyModel.instance.finishLv;
            let dimCfg: item_rune = config.ItemRuneCfg.instance.getCfgById(dimId);
            if (!dimCfg) {
                alert(`不存在玉荣id为${runeId}的玉荣`);
                return;
            }
            let needUnLockLv: number = dimCfg[item_runeFields.layer];
            this.iconImg.skin = `assets/icon/item/${dimCfg[item_runeFields.ico]}.png`;
            this.attTxt.text = `${dimCfg[item_runeFields.name]} Lv.${lv}`;
            this.attTxt.color = CommonUtil.getColorById(runeId);

            let cfg: runeRefine = RuneRefineCfg.instance.getCfgById(runeId);
            if (!cfg) {
                alert(`不存在玉荣id为${runeId}的玉荣`);
                return;
            }

            let attrs: Array<attr> = cfg[runeRefineFields.attrs];
            for (let i: int = 0, len: int = attrs.length; i < len; i++) {
                let attrCfg: attr_item = AttrItemCfg.instance.getCfgById(attrs[i][attrFields.type]);
                let attrValue: number = attrs[i][attrFields.value];
                let attrValueStr: string = attrCfg[attr_itemFields.isPercent] ? AttrUtil.formatFloatNum(attrValue) + "%" : Math.round(attrValue) + "";
                this._attNameArr[i].text = attrCfg[attr_itemFields.name] + " " + attrValueStr;
                this._attNameArr[i].visible = true;
            }

            let k: int = attrs.length;
            let t: number = k;
            for (let len: int = this._attNameArr.length; k < len; k++) {
                this._attNameArr[k].visible = false;
            }
            //居中
            let sumHeight: number = 0;
            let spaceY = 5;
            for (let i: int = 0; i <= t; i++) {
                sumHeight += this._attFitArr[i].height + spaceY;
            }
            let startY: number = (this.height - sumHeight) / 2;
            for (let i: int = 0; i <= t; i++) {
                if (i == 0) this._attFitArr[i].y = startY;
                else this._attFitArr[i].y = this._attFitArr[i - 1].y + this._attFitArr[i - 1].height + spaceY;
            }

            let isHasSameType: Table<number> = RuneModel.instance.currPitType == 0 ? RuneModel.instance.commonPitTypeRecode : RuneModel.instance.specialPitTypeRecode;
            let currInlayRune: number = RuneModel.instance.slots[RuneModel.instance.currClickPit];
            let currInlayType: number = CommonUtil.getStoneTypeById(currInlayRune);
            let currQuality: number = CommonUtil.getItemQualityById(currInlayRune);
            let currLv: number = currInlayRune % 10000;
            this.hintTxt.visible = this._btnClip.visible = this.inalyBtn.visible = this.lockTxt.visible = false;

            if (isHasSameType[type] && (type !== currInlayType)) {   // 如果其他槽已经镶嵌同种类玉荣   玉荣不可镶嵌 改为已有属性程序字
                this.hintTxt.visible = true;
                this.hintTxt.text = `已有属性`;
            } else if (currInlayRune) { //有镶嵌的
                if (runeId == currInlayRune) {   //当前镶嵌的玉荣
                    this.hintTxt.visible = true;
                    this.hintTxt.text = `当前镶嵌`;
                } else if (needUnLockLv > currCopyLv) {  //未解锁
                    this.lockTxt.text = `未央幻境${needUnLockLv}层解锁`;
                    this.lockTxt.visible = true;
                } else if (needUnLockLv <= currCopyLv) {    //解锁了
                    let quality: number = CommonUtil.getItemQualityById(runeId);
                    if (type == currInlayType) {
                        if ((quality == currQuality && lv > currLv) || quality > currQuality) {
                            this._btnClip.visible = true;
                            this._btnClip.play();
                        }
                    }
                    this.inalyBtn.visible = true;
                }
            } else {      //无镶嵌
                if (needUnLockLv > currCopyLv) {  //未解锁
                    this.lockTxt.text = `未央幻境${needUnLockLv}层解锁`;
                    this.lockTxt.visible = true;
                } else if (needUnLockLv <= currCopyLv) {
                    this._btnClip.visible = this.inalyBtn.visible = true;
                    this._btnClip.play();
                }
            }
        }

        private inalyBtnHandler(): void {
            RuneCtrl.instance.inlayRune(this._runeInfo);
            WindowManager.instance.close(WindowEnum.RUNE_BAG_ALERT);
        }
    }
}