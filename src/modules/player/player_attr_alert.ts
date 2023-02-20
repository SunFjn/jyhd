namespace modules.player {
    import PlayerAttrAlertUI = ui.PlayerAttrAlertUI;
    import BtnGroup = modules.common.BtnGroup;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import HumanCfg = modules.config.HumanCfg;
    import humanFields = Configuration.humanFields;
    import Button = Laya.Button;
    import Text = Laya.Text;
    import TypesAttr = Protocols.TypesAttr;
    import attr = Configuration.attr;
    import AttrUtil = modules.common.AttrUtil;
    import attr_item = Configuration.attr_item;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attr_itemFields = Configuration.attr_itemFields;
    import attrFields = Configuration.attrFields;
    import ActorBaseAttrFields = Protocols.ActorBaseAttrFields;

    export class PlayerAttrAlert extends PlayerAttrAlertUI {

        private _btnGroup: BtnGroup; //按钮组
        private _progressBar: ProgressBarCtrl;
        private _textArr: Array<Text>;
        private _baseAttrIds:Array<int>;
        private _specAttrIds:Array<int>;

        protected initialize(): void {
            super.initialize();

            this._btnGroup = new BtnGroup();
            this._btnGroup.setBtns(this.baseAttrBtn, this.betterAttrBtn);

            this._textArr = new Array<Text>();
            this._textArr = [this.attrName1, this.attrName7, this.attrName2, this.attrName8, this.attrName3, this.attrName9,
                this.attrName4, this.attrName10, this.attrName5, this.attrName11, this.attrName6, this.attrName12];

            this._progressBar = new ProgressBarCtrl(this.barImg, this.barImg.width, this.sufferValueTxt);

            this._baseAttrIds = [ItemAttrType.attack, ItemAttrType.hp, ItemAttrType.defense, ItemAttrType.disDefense, ItemAttrType.hit, ItemAttrType.dodge, ItemAttrType.crit, ItemAttrType.tough];
            this._specAttrIds = [ItemAttrType.pvpHurtDeep, ItemAttrType.pvpHurtLess, ItemAttrType.hurtDeep, ItemAttrType.hurtLess, ItemAttrType.critHurtDeep, ItemAttrType.critHurtLess,
                                ItemAttrType.disArmor, ItemAttrType.armor, ItemAttrType.realHurt, ItemAttrType.realArmor,/*ItemAttrType.eleAttack,ItemAttrType.eleResistant,*/ ItemAttrType.bossHurtDeep];
        }

        public destroy(): void {
            this._btnGroup = this.destroyElement(this._btnGroup);
            this._progressBar = this.destroyElement(this._progressBar);
            this._textArr = this.destroyElement(this._textArr);
            if(this._baseAttrIds){
                this._baseAttrIds.length = 0;
                this._baseAttrIds = null;
            }
            if(this._specAttrIds){
                this._specAttrIds.length = 0;
                this._specAttrIds = null;
            }
            super.destroy();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this._btnGroup,common.LayaEvent.CHANGE,this, this.attrUpdate);
            this.addAutoListener(this._btnGroup,Laya.Event.CLICK,this, this.attrUpdate);

            this.addAutoListener(GlobalData.dispatcher,CommonEventType.PLAYER_BASE_ATTR_UPDATE, this, this.attrUpdate);
            this.addAutoListener(GlobalData.dispatcher,CommonEventType.PLAYER_UPDATE_LEVEL, this, this.attrUpdate);
            this.addAutoListener(GlobalData.dispatcher,CommonEventType.PLAYER_UPDATE_EXP, this, this.attrUpdate);
            this.addAutoListener(GlobalData.dispatcher,CommonEventType.PLAYER_TOTAL_ATTR_UPDATE, this, this.attrUpdate);
        }

        public onOpened(): void {
            super.onOpened();
            this._btnGroup.selectedIndex = 0;
            this.attrUpdate();
        }

        private attrUpdate(): void {
            this.typeNameTxt.text = (<Button>this._btnGroup.selectedBtn).label;

            let attrs:Array<TypesAttr> = PlayerModel.instance.playerTotolAttrs;

            if (this._btnGroup.selectedIndex == 0) {
                this.sufferNameTxt.visible = this.sufferValueTxt.visible = this.proBg.visible = this.barImg.visible = this.attrName12.visible = true;
                this.attrName1.visible = this.attrName7.visible = false;

                for(let i:int = 4, len:int = this._textArr.length; i < len; i++){
                    let attrId:number = this._baseAttrIds[i - 4];
                    let att:attr = AttrUtil.getAttrByType(attrId, attrs);
                    let attrCfg:attr_item = AttrItemCfg.instance.getCfgById(attrId);
                    let attrValue:number = att ? att[attrFields.value] : 0;
                    this._textArr[i].text = `${attrCfg[attr_itemFields.name]}:${attrCfg[attr_itemFields.isPercent] ? AttrUtil.formatFloatNum(attrValue) + "%" : Math.round(attrValue)}`;
                }

                let lv: number = PlayerModel.instance.level;
                this.attrName2.text = `等级:${lv}`;
                this.attrName8.text = `ID:${PlayerModel.instance.actorId}`;

                if (lv == HumanCfg.instance.getMaxLvByAiId(1)) {
                    this._progressBar.value = PlayerModel.instance.playerBaseAttr[ActorBaseAttrFields.exp];
                    this._progressBar.maxValue = HumanCfg.instance.getHumanCfgByAiIdAndLv(1, lv - 1)[humanFields.exp];
                    if (this._progressBar.value > this._progressBar.maxValue) this._progressBar.value = this._progressBar.maxValue;
                    this._progressBar.moleculeTxt = PlayerModel.instance.playerBaseAttr[ActorBaseAttrFields.exp];
                } else {
                    this._progressBar.value = PlayerModel.instance.playerBaseAttr[ActorBaseAttrFields.exp];
                    this._progressBar.maxValue = HumanCfg.instance.getHumanCfgByAiIdAndLv(1, lv)[humanFields.exp];
                }


            } else {
                this.sufferNameTxt.visible = this.sufferValueTxt.visible = this.proBg.visible = this.barImg.visible = this.attrName12.visible = false;
                this.attrName1.visible = this.attrName7.visible = true;

                for (let i: int = 0, len: int = this._textArr.length - 1; i < len; i++) {
                    let att:attr = AttrUtil.getAttrByType(this._specAttrIds[i], attrs);
                    let attrCfg:attr_item = AttrItemCfg.instance.getCfgById(this._specAttrIds[i]);
                    let attrValue:number = att ? att[attrFields.value] : 0;
                    this._textArr[i].text = `${attrCfg[attr_itemFields.name]}:${attrCfg[attr_itemFields.isPercent] ? AttrUtil.formatFloatNum(attrValue) + "%" : Math.round(attrValue)}`;
                }
            }
        }
    }
}