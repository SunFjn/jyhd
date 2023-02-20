///<reference path="../compose/compose_item.ts"/>
namespace modules.commonAlert {
    import PlayerModel = modules.player.PlayerModel;
    import item_equip = Configuration.item_equip;
    import IMsgFields = Protocols.IMsgFields;
    import Item = Protocols.Item;
    import ItemFields = Protocols.ItemFields;

    export class OtherEquipAlert extends EquipBaseAlert {

        protected initialize(): void {
            super.initialize();

            this.isNeedContrast = true;
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.item = value;
        }

        public set item(value: Item) {
            let itemData: Item = value;

            let itemId: number = itemData[ItemFields.ItemId];
            let part: number = modules.common.CommonUtil.getPartById(itemId);
            this.myEquip = PlayerModel.instance.getEquipByPart(part);

            this.setBaseInfo(itemData);
            this.setBaseAttr(itemData);

            let iMsg: Protocols.IMsg = itemData[ItemFields.iMsg];
            let bestAttrCount: number = this.setBestAttr(iMsg);
            if (bestAttrCount == 0) {
                this.stoneBox.y = this.bestAttrBox.y;
                this.bestAttrBox.visible = false;
            } else {
                this.bestAttrBox.visible = true;
                this.stoneBox.y = this._bestAttrInitY + 30 * bestAttrCount + 10;
            }
            let myIMsg: Protocols.IMsg = this.myEquip ? this.myEquip[ItemFields.iMsg] : null;
            this.setStoneAttr(iMsg);
            this.setStoneAttr(myIMsg, "my");
            let stoneTxtlastY: number = this.stoneTxt.y + this.stoneTxt.contextHeight;
            let myStoneTxtlastY: number = myIMsg ? this.myStoneTxt.y + this.myStoneTxt.contextHeight : 0;
            this.stoneBox.height = stoneTxtlastY >= myStoneTxtlastY ? stoneTxtlastY : myStoneTxtlastY;
            this.xiLianBox.y = this.stoneBox.y + this.stoneBox.height;
            let h1: number = this.setXiLian(iMsg[IMsgFields.xilianAttr]);
            let h2: number = myIMsg ? this.setXiLian(myIMsg[IMsgFields.xilianAttr], true) : 0;
            if (h1 > 1 || h2 > 1) this.xiLianBox.visible = true;
            this.xiLianBox.height = h1 > h2 ? h1 : h2;

            this.zhuHunBox.y = this.xiLianBox.y + this.xiLianBox.height;
            let k1: number = this.setZhuHun(itemData);
            let k2: number = myIMsg ? this.setZhuHun(this.myEquip, true) : 0;
            if (k1 > 1 || k2 > 1) this.zhuHunBox.visible = true;
            this.zhuHunBox.height = k1 > k2 ? k1 : k2;

            this.elseBox.y = this.conBox.y + this.setConHeight(this.xiLianBox.y + this.xiLianBox.height + this.zhuHunBox.height);
            this.setRank(itemId);
        }

        public setBaseInfo(itemData: Item): void {
            super.setBaseInfo(itemData);

            let myScore: number = 0;
            let mySumScore: number = 0;
            if (this.myEquip) {
                myScore = this.myEquip[ItemFields.iMsg][IMsgFields.baseScore];
                mySumScore = this.myEquip[ItemFields.iMsg][IMsgFields.totalScore];
            }
            let score: number = itemData[ItemFields.iMsg][Protocols.IMsgFields.baseScore];
            let sumScore: number = itemData[ItemFields.iMsg][Protocols.IMsgFields.totalScore];
            //获取分数差
            let scoreDiff: number = score - myScore;
            EquipAlertUtil.judgeDiff(scoreDiff, this.myScoreTxt, this.scoreImg);
            let sumScoreDiff: number = sumScore - mySumScore;
            EquipAlertUtil.judgeDiff(sumScoreDiff, this.mySumScoreTxt, this.sumScoreImg);
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
            let myBestCount: number;
            if (this.myEquip) {
                let myIMsg: Protocols.IMsg = this.myEquip[ItemFields.iMsg];
                myBestCount = super.setBestAttr(myIMsg, "my");
            }else{
                myBestCount = super.setBestAttr(null, "my");
            }
            return bestCount >= myBestCount ? bestCount : myBestCount;
        }
    }

}