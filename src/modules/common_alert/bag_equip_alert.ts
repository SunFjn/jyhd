namespace modules.commonAlert {
    import Event = laya.events.Event;
    import PlayerModel = modules.player.PlayerModel;
    import item_equip = Configuration.item_equip;
    import Button = laya.ui.Button;
    import IMsgFields = Protocols.IMsgFields;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;
    import EquipAlertUtil = commonAlert.EquipAlertUtil;

    export class BagEquipAlert extends EquipBaseAlert {

        private _wearBtn: Button;

        constructor() {
            super();
        }

        public destroy(): void {

            this._wearBtn.destroy(true);
            this._wearBtn = null;

            super.destroy();
        }

        protected addListeners(): void {
            super.addListeners();
            this._wearBtn.on(Event.CLICK, this, this.wearHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
            this._wearBtn.off(Event.CLICK, this, this.wearHandler);
        }

        protected initialize(): void {
            super.initialize();

            this.isNeedContrast = true;
            this.sumScoreImg.visible = this.mySumScoreTxt.visible = this.stoneBox.visible = this.xiLianBox.visible = false;

            this._wearBtn = new Button(`common/btn_tongyong_6.png`, "穿戴");
            this._wearBtn.stateNum = 1;
            this._wearBtn.labelColors = `#9d5119,#9d5119,#9d5119,#9d5119`;
            this._wearBtn.labelPadding = `-3,0,0,0`;
            this._wearBtn.labelSize = 28;
            this._wearBtn.labelFont = `SimHei`;

            this.elseBox.addChild(this._wearBtn);
            this._wearBtn.centerX = 0;
            this._wearBtn.y = this.rankTxt.y + 50;
            this.elseBox.height = this._wearBtn.y + this._wearBtn.height + 10;
        }

        private wearHandler(): void {
            if (!this.itemData) return;
            // 穿戴装备
            BagCtrl.instance.wearEquip(this.itemData[Protocols.ItemFields.uid]);
            this.close();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.item = value;
        }

        public set item(value: Protocols.Item) {
            console.log('vtz:value', value);
            let itemData: Item = value;

            let itemId: number = itemData[ItemFields.ItemId];
            let part: number = modules.common.CommonUtil.getPartById(itemId);
            this.myEquip = PlayerModel.instance.getEquipByPart(part);

            this.setBaseInfo(itemData);
            this.setBaseAttr(itemData);

            let iMsg: Protocols.IMsg = itemData[ItemFields.iMsg];
            let bestAttrCount: number = this.setBestAttr(iMsg);
            if (bestAttrCount == 0) {
                this.elseBox.y = this.conBox.y;
                this.bestAttrBox.visible = false;
            } else {
                this.bestAttrBox.visible = true;
                this.elseBox.y = this.conBox.y + this.setConHeight(this._bestAttrInitY + 30 * bestAttrCount + 10);
            }
            let _sourceBtnBg: Array<Laya.Image> = this.setSource(itemData);
            if (_sourceBtnBg.length > 0) {
                // 98=btn_ydrk_bg.height
                // 49 btn_ydrk_bg与来源标题Y距离
                // 147=98+49
                this.soureBox.height = 147;
                this.soureBox.visible = true;
                this.soureBox.y = this.elseBox.y + 60;
                this.soureBox.addChildren(..._sourceBtnBg);
                this._wearBtn.y = this.rankTxt.y + this.soureBox.height + 60;
            } else {
                this.soureBox.visible = false;
            }

            this.setRank(itemId);
        }

        public setBaseInfo(itemData: Item): void {
            super.setBaseInfo(itemData);

            let myScore: number = 0;
            if (this.myEquip) {
                myScore = this.myEquip[ItemFields.iMsg][IMsgFields.baseScore];
            }
            let score: number = itemData[ItemFields.iMsg][Protocols.IMsgFields.baseScore];
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

        public setBestAttr(iMsg: Protocols.IMsg): number {
            let bestCount: number = super.setBestAttr(iMsg);
            let myBestCount: number = 0;
            if (this.myEquip) {
                let myIMsg: Protocols.IMsg = this.myEquip[ItemFields.iMsg];
                myBestCount = super.setBestAttr(myIMsg, "my");
            }
            return bestCount >= myBestCount ? bestCount : myBestCount;
        }

    }
}