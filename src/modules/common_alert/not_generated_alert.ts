namespace modules.commonAlert {

    import Text = Laya.Text;
    import PlayerModel = modules.player.PlayerModel;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import item_equip = Configuration.item_equip;
    import IMsgFields = Protocols.IMsgFields;

    export class NotGeneratedAlert extends EquipBaseAlert {

        private _hintTxt: Text;

        constructor() {
            super();
        }

        public destroy(): void {

            this._hintTxt.destroy(true);
            this._hintTxt = null;

            super.destroy();
        }

        protected initialize(): void {
            super.initialize();

            this._hintTxt = new Text();
            this._hintTxt.color = `#ffffff`;
            this._hintTxt.font = `SimHei`;
            this._hintTxt.fontSize = 22;
            this.addChild(this._hintTxt);
            this._hintTxt.pos(65, 325 + 32, true);

            this.sumScoreImg.visible = this.mySumScoreTxt.visible = this.stoneBox.visible = this.xiLianBox.visible = false;
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }


        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.item = value;
        }

        public set item(value: Protocols.Item) {
            let itemData: Item = value;

            let itemId: number = itemData[ItemFields.ItemId];
            let part: number = modules.common.CommonUtil.getPartById(itemId);
            this.myEquip = PlayerModel.instance.getEquipByPart(part);

            this.setBaseInfo(itemData);
            this.setBaseAttr(itemData);

            let bestAttrCount: number = this.setBestAttr(null);
            if (bestAttrCount == 0) {
                this.elseBox.y = this.conBox.y;
                this.bestAttrBox.visible = false;
            } else {
                this.bestAttrBox.visible = true;
                this.elseBox.y = this.conBox.y + this.setConHeight(40 + 30 * bestAttrCount + 10);
            }
            this.setRank(itemId);
        }

        public setBaseInfo(itemData: Item): void {
            super.setBaseInfo(itemData);

            let itemId: number = itemData[ItemFields.ItemId];
            let itemCfg: item_equip = config.ItemEquipCfg.instance.getItemCfgById(itemId);

            let myScore: number = 0;
            if (this.myEquip) {
                myScore = this.myEquip[ItemFields.iMsg][IMsgFields.baseScore];
            }
            let iMsg: Protocols.IMsg = itemData[ItemFields.iMsg];
            let score: number = 0;
            if (iMsg) {
                score = iMsg[Protocols.IMsgFields.baseScore];
            } else {
                score = itemCfg[Configuration.item_equipFields.notGeneratedScore][0];
            }

            //获取分数差
            let scoreDiff: number = score - myScore;
            EquipAlertUtil.judgeDiff(scoreDiff, this.myScoreTxt, this.scoreImg);
        }

        public setBaseAttr(itemData: Item): void {
            super.setBaseAttr(itemData);

            let itemId: number = itemData[ItemFields.ItemId];
            let itemCfg: item_equip = config.ItemEquipCfg.instance.getItemCfgById(itemId);
            let baseAttrs: Configuration.attr[] = itemCfg[Configuration.item_equipFields.baseAttr];

            //获取自己基础属性
            if (this.myEquip) {
                let myEquipCfg: item_equip = config.ItemEquipCfg.instance.getItemCfgById(this.myEquip[ItemFields.ItemId]);
                let myBaseAttrs: Configuration.attr[] = myEquipCfg[Configuration.item_equipFields.baseAttr];
                for (let i: number = 0; i < myBaseAttrs.length; i++) {
                    let value: number = myBaseAttrs[i][Configuration.attrFields.value];
                    let valueDiff: number = baseAttrs[i][Configuration.attrFields.value] - value;
                    this.baseAttrImgs[i].visible = true;
                    EquipAlertUtil.judgeDiff(valueDiff, this.myBaseAttrTxts[i], this.baseAttrImgs[i]);
                }
            } else {
                for (let i: number = 0; i < this.myBaseAttrTxts.length; i++) {
                    this.myBaseAttrTxts[i].color = `#cbcade`;
                    this.myBaseAttrTxts[i].text = `无`;
                    this.baseAttrImgs[i].visible = false;
                }
            }
        }

        public setBestAttr(iMsg: Protocols.IMsg, type?: string): number {
            let txts: Text[] = type ? this.myBestAttrTxts : this.bestAttrTxts;
            for (let i: int = 0, len: int = txts.length; i < len; i++) {
                txts[i].visible = false;
            }
            let itemCfg: item_equip = config.ItemEquipCfg.instance.getItemCfgById(this.itemData[ItemFields.ItemId]);
            let attrs: Array<Protocols.extendAttr> = [];
            for (let i: number = 0, len: number = itemCfg[Configuration.item_equipFields.adviseOrangeAttr].length; i < len; i++) {
                let id: number = itemCfg[Configuration.item_equipFields.adviseOrangeAttr][i];
                if (id) {
                    attrs.push([id, null, null]);
                }
            }
            for (let i: number = 0, len: number = itemCfg[Configuration.item_equipFields.advisePurpleAttr].length; i < len; i++) {
                let id: number = itemCfg[Configuration.item_equipFields.advisePurpleAttr][i];
                if (id) {
                    attrs.push([id, null, null]);
                }
            }
            if (attrs.length) {
                this._bestAttrInitY = 70;
                this.setBestAttrByColor(attrs, 0, type, txts);
                this._hintTxt.text = "(随机生成" + attrs.length + "条属性)";
                this._hintTxt.visible = true;
            } else {
                this._bestAttrInitY = 40;
                this._hintTxt.visible = false;
            }

            let myBestCount: number = 0;
            if (this.myEquip) {
                let myIMsg: Protocols.IMsg = this.myEquip[ItemFields.iMsg];
                this._bestAttrInitY = 40;
                myBestCount = super.setBestAttr(myIMsg, "my");
            } else {
                for (let i: int = 0, len: int = this.myBestAttrTxts.length; i < len; i++) {
                    this.myBestAttrTxts[i].visible = false;
                }
            }
            let attrLen: number = attrs.length ? attrs.length + 1 : 0;
            return attrLen >= myBestCount ? attrLen : myBestCount;
        }
    }
}