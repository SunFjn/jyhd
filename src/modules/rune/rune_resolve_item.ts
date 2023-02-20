namespace modules.rune {
    import RuneResolveItemUI = ui.RuneResolveItemUI;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import item_rune = Configuration.item_rune;
    import item_runeFields = Configuration.item_runeFields;
    import runeRefine = Configuration.runeRefine;
    import RuneRefineCfg = modules.config.RuneRefineCfg;
    import Text = Laya.Text;
    import runeRefineFields = Configuration.runeRefineFields;
    import idCount = Configuration.idCount;
    import idCountFields = Configuration.idCountFields;
    import attr = Configuration.attr;
    import attr_item = Configuration.attr_item;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attrFields = Configuration.attrFields;
    import AttrUtil = modules.common.AttrUtil;
    import attr_itemFields = Configuration.attr_itemFields;
    import BagModel = modules.bag.BagModel;

    export class RuneResolveItem extends RuneResolveItemUI {

        private _attTxtArr: Array<Text>;
        private _info: Item;
        private _attFitArr: Array<Text>;

        protected initialize(): void {
            super.initialize();

            this._attTxtArr = [this.attTxt_1, this.attTxt_2, this.attTxt_3];
            this._attFitArr = [this.attTxt_0, this.attTxt_1, this.attTxt_2, this.attTxt_3];
        }

        public destroy(): void {
            this._attTxtArr = this.destroyElement(this._attTxtArr);
            this._attFitArr = this.destroyElement(this._attFitArr);
            super.destroy();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, "setCheck", this, this.setCheck);
        }

        public clickHandler(): void {
            super.clickHandler();
            this.frameImg.visible = !this.frameImg.visible;
            this.setCount();
            GlobalData.dispatcher.event("updateResolveItems");
        }

        private setCheck(): void {

            let runeId: number = this._info[ItemFields.ItemId];

            //过滤精华玉荣
            if (CommonUtil.getStoneTypeById(runeId) === config.ItemRuneCfg.instance.resolveRuneSubTypeId) {
                this.frameImg.visible = true;
            } else {
                let selectTypes: number[] = RuneModel.instance.rflags;
                let quality: number = CommonUtil.getItemQualityById(runeId);
                let flag: boolean = false;
                for (let i: int = 0, len: int = selectTypes.length; i < len; i++) {
                    if (!selectTypes[i]) continue;
                    if (selectTypes[i] == quality - 1) {
                        flag = true;
                    }
                }
                this.frameImg.visible = flag;
            }
            this.setCount();
        }

        private setCount(): void {
            let uId: Uid = this._info[ItemFields.uid];
            let count: number = RuneModel.instance.resolveList[uId];
            let itemId: ItemId = BagModel.instance.getItemByBagIdUid(BagId.rune, uId)[ItemFields.ItemId];
            let isSpecial: boolean = CommonUtil.getStoneTypeById(itemId) === config.ItemRuneCfg.instance.resolveRuneSubTypeId;
            let tCount: number = isSpecial ? BagModel.instance.getItemByBagIdUid(BagId.rune, uId)[ItemFields.count] : 1;
            if (this.frameImg.visible) {
                RuneModel.instance.resolveList[uId] = count ? count + tCount : tCount;
            } else {
                count = count ? count - tCount == 0 ? null : count - tCount : null;
                RuneModel.instance.resolveList[uId] = count;
            }
        }

        protected setData(value: any): void {
            value = this._info = value as Item;
            let runeId: number = value[ItemFields.ItemId];
            let dimId: number = (runeId * 0.0001 >> 0) * 10000;  //模糊Id
            let lv: number = runeId % 10000;

            let dimCfg: item_rune = config.ItemRuneCfg.instance.getCfgById(dimId);
            if (!dimCfg) {
                alert(`不存在玉荣id为${runeId}的玉荣`);
                return;
            }
            this.iconImg.skin = `assets/icon/item/${dimCfg[item_runeFields.ico]}.png`;
            let num: number = value[ItemFields.count];
            this.attTxt_0.text = `${dimCfg[item_runeFields.name]} Lv.${lv}` + (num > 1 ? `×${num}` : ``);
            this.attTxt_0.color = CommonUtil.getColorById(runeId);

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
                this._attTxtArr[i].text = attrCfg[attr_itemFields.name] + " " + attrValueStr;
                this._attTxtArr[i].visible = true;
            }

            let k: int = attrs.length;
            let t: number = k;
            for (let len: int = this._attTxtArr.length; k < len; k++) {
                this._attTxtArr[k].visible = false;
            }
            //过滤精华玉荣
            if (CommonUtil.getStoneTypeById(runeId) === config.ItemRuneCfg.instance.resolveRuneSubTypeId) {
                this.attTxt_0.text = `${dimCfg[item_runeFields.name]}` + (num > 1 ? `×${num}` : ``);
                let getItems: Array<idCount> = cfg[runeRefineFields.resolveItems];
                let getNum: number = 0;
                for (let i: int = 0, len: int = getItems.length; i < len; i++) {
                    getNum += getItems[i][idCountFields.count];
                }
                this._attTxtArr[t].text = `分解+ ${getNum}`;
                this._attTxtArr[t].visible = true;
                t++;
            }

            //居中
            let sumHeight: number = 0;
            let spaceY = 3;
            for (let i: int = 0; i <= t; i++) {
                sumHeight += this._attFitArr[i].height + spaceY;
            }
            let startY: number = (this.height - sumHeight) / 2;
            for (let i: int = 0; i <= t; i++) {
                if (i == 0) this._attFitArr[i].y = startY;
                else this._attFitArr[i].y = this._attFitArr[i - 1].y + this._attFitArr[i - 1].height + spaceY;
            }
            this.setCheck();
        }
    }
}