namespace modules.stone {

    import stoneItemUI = ui.StoneItemUI;
    import BaseItem = modules.bag.BaseItem;
    import gemRefineFields = Configuration.gemRefineFields;
    import Event = Laya.Event;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import gemRefine = Configuration.gemRefine;
    import CommonUtil = modules.common.CommonUtil;
    import StoneCfg = modules.config.StoneCfg;
    import ItemFields = Protocols.ItemFields;
    import Label = Laya.Label;
    import attr = Configuration.attr;
    import attr_item = Configuration.attr_item;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attrFields = Configuration.attrFields;
    import attr_itemFields = Configuration.attr_itemFields;
    import AttrUtil = modules.common.AttrUtil;

    export class StoneItem extends stoneItemUI {

        private _value: any;
        private _nameArr: Array<Label>;
        private _valueArr: Array<Label>;

        protected initialize(): void {
            super.initialize();

            this._nameArr = new Array<Label>();
            this._valueArr = new Array<Label>();
            this._nameArr[0] = this.typeTxt_1;
            this._nameArr[1] = this.typeTxt_2;
            this._valueArr[0] = this.valueTxt_1;
            this._valueArr[1] = this.valueTxt_2;
        }

        public destroy(): void {
            this._nameArr = this.destroyElement(this._nameArr);
            this._valueArr = this.destroyElement(this._valueArr);
            super.destroy();
        }

        //镶嵌
        private inlay(): void {

            let stoneId: number = StoneModel.instance.getValueByPart().get(StoneModel.instance.currEqiup * 10 + StoneModel.instance.currStonePic);

            //镶嵌
            if (!stoneId) {
                StoneModel.instance.inlay = 0;
            } else { //替换
                StoneModel.instance.inlay = 1;
            }

            Channel.instance.publish(UserFeatureOpcode.InlayGem, [StoneModel.instance.currEqiup, StoneModel.instance.currStonePic, this._value[ItemFields.uid]]);
            GlobalData.dispatcher.event(CommonEventType.DESTORY_DIA);
        }

        //升级
        private upGrade(): void {
            //装备格 仙石槽下标
            Channel.instance.publish(UserFeatureOpcode.RefineGem, [StoneModel.instance.currEqiup, StoneModel.instance.currStonePic]);
            GlobalData.dispatcher.event(CommonEventType.DESTORY_DIA);
        }

        //初始化数据
        protected setData(value: any): void {

            this._value = value;

            let _cfg: gemRefine = StoneCfg.instance.getCfgById(value[ItemFields.ItemId]);

            let _ico: BaseItem = new BaseItem();
            _ico.needTip = false;
            _ico.nameVisible = false;
            this.addChild(_ico);

            _ico.dataSource = value;

            this.nameTxt.color = CommonUtil.getColorById(value[ItemFields.ItemId]);

            let _currStoneId: number = StoneModel.instance.getValueByPart().get(StoneModel.instance.currEqiup * 10 + StoneModel.instance.currStonePic);
            let nextId: number = null;
            if (_currStoneId) {
                nextId = StoneCfg.instance.getCfgById(_currStoneId)[gemRefineFields.next_id];
            }

            if (value[ItemFields.ItemId] === nextId && StoneModel.instance.virtualStone) {  //这是虚拟Item
                this.addAutoListener(this, common.LayaEvent.CLICK, this, this.upGrade);
                this.nameTxt.text = `升为${_cfg[gemRefineFields.level]}级徽章`;
                this.addChild(this.arrImg);
                this.arrImg.visible = true;
                this.dotImg.visible = false;
            } else {
                this.addAutoListener(this, common.LayaEvent.CLICK, this, this.inlay);
                this.nameTxt.text = _cfg[gemRefineFields.name].toString();
                let _currPicStoneCfg: gemRefine = StoneCfg.instance.getCfgById(_currStoneId);
                if (_currPicStoneCfg) {
                    this.dotImg.visible = _cfg[gemRefineFields.level] > _currPicStoneCfg[gemRefineFields.level];
                } else {
                    this.dotImg.visible = true;
                }
            }
            let attrs: Array<attr> = _cfg[gemRefineFields.attrs];
            for (let i: int = 0, len: int = attrs.length; i < len; i++) {
                let attrCfg: attr_item = AttrItemCfg.instance.getCfgById(attrs[i][attrFields.type]);
                let attrValue: number = attrs[i][attrFields.value];
                this._nameArr[i].text = attrCfg[attr_itemFields.name];
                this._valueArr[i].text = attrCfg[attr_itemFields.isPercent] ? AttrUtil.formatFloatNum(attrValue) + "%" : Math.round(attrValue) + "";
                if (i === 2) break;
            }
            _ico.pos(10, 10);
        }
    }
}