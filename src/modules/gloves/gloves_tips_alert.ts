/** 装备tips弹框*/


namespace modules.gloves{
    import GlovesTipsAlertUI = ui.GlovesTipsAlertUI;
    import GetGauntletReply = Protocols.GetGauntletReply;
    import attr = Configuration.attr;
    import gauntletFields = Configuration.gauntletFields;
    import GauntletCfg = modules.config.GauntletCfg;
    import attrFields = Configuration.attrFields;
    import AttrItemCfg = modules.config.AttrItemCfg;
    import attr_item = Configuration.attr_item;
    import attr_itemFields = Configuration.attr_itemFields;
    import GetGauntletReplyFields = Protocols.GetGauntletReplyFields;
    import PairFields = Protocols.PairFields;
    import ItemsFields = Configuration.ItemsFields;
    import gauntlet = Configuration.gauntlet;
    import skill = Configuration.skill;
    import SkillCfg = modules.config.SkillCfg;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import skillFields = Configuration.skillFields;

    export class GlovesTipsAlert extends GlovesTipsAlertUI{
        private _attrNames:Array<Laya.Text>;
        private _attrValues:Array<Laya.Text>;
        private _attrExes:Array<Laya.Text>;
        private _stoneIcons:Array<Laya.Image>;
        private _stoneNames:Array<Laya.Text>;
        private _stoneLvs:Array<Laya.Text>;
        private _stoneDescs:Array<Laya.Text>;
        private _descs:Array<string>;

        constructor(){
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._attrNames = [this.attrName1, this.attrName2, this.attrName3, this.attrName4, this.attrName5, this.attrName6];
            this._attrValues = [this.attrValue1, this.attrValue2, this.attrValue3, this.attrValue4, this.attrValue5, this.attrValue6];
            this._attrExes = [this.attrEx1, this.attrEx2, this.attrEx3, this.attrEx4, this.attrEx5, this.attrEx6];
            this._stoneIcons = [this.stoneIcon1, this.stoneIcon2, this.stoneIcon3, this.stoneIcon4, this.stoneIcon5, this.stoneIcon6];
            this._stoneNames = [this.stoneName1, this.stoneName2, this.stoneName3, this.stoneName4, this.stoneName5, this.stoneName6];
            this._stoneLvs = [this.stoneLv1, this.stoneLv2, this.stoneLv3, this.stoneLv4, this.stoneLv5, this.stoneLv6];
            this._stoneDescs = [this.stoneDesc1, this.stoneDesc2, this.stoneDesc3, this.stoneDesc4, this.stoneDesc5, this.stoneDesc6];

            this.skillDesc.color = "#393939";
            this.skillDesc.style.fontSize = 24;
            this.skillDesc.style.fontFamily = "SimHei";
            this.skillDesc.style.wordWrap = true;

            this._descs = ["对BOSS类怪物伤害增加+X%", "与玩家战斗中，PVP减伤+X%", "与玩家战斗中，PVP增伤+X%",
                            "战斗中暴击减伤+X%", "战斗中暴击增伤+X%", "攻击时真实伤害+X"];

            this.item.dataSource = [13250004, 1, 0, null];
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.GLOVES_INFO_UPDATE, this, this.updateInfo);
        }

        onOpened(): void {
            super.onOpened();
            this.updateInfo();
        }

        private updateInfo():void{
            let info:GetGauntletReply = GlovesModel.instance.glovesInfo;
            if(!info) return;
            let t:Array<Protocols.Pair> = info[GetGauntletReplyFields.jewels];
            let arr:Array<number> = new Array<number>();
            for(let i:int = 0, len:int = t.length; i < len; i++){
                arr[t[i][PairFields.first] - 1] = t[i][PairFields.second];
            }
            let per:number = 1;
            let count:number = 0;
            let fight:number = 0;
            for(let i:int = 0, len:int = this._stoneIcons.length; i < len; i++){
                if(!arr[i]) arr[i] = (i + 1) * 1000;
                let stoneId:number = arr[i];
                if(stoneId % 1000 === 0) stoneId += 1;
                else count++;
                this._stoneIcons[i].skin = CommonUtil.getIconById(GauntletCfg.instance.getCfgById(stoneId)[gauntletFields.material][0][ItemsFields.itemId], true);
                let cfg:gauntlet = GauntletCfg.instance.getCfgById(stoneId);
                per += arr[i] % 1000 === 0 ? 0 : cfg[gauntletFields.attrs][1][attrFields.value];
                this._stoneNames[i].text = cfg[gauntletFields.name];
                this._stoneLvs[i].text = `Lv.${arr[i] % 1000}`;
                this._stoneDescs[i].text = this._descs[i].replace("X", arr[i] % 1000 === 0 ? "0" : (Math.ceil(cfg[gauntletFields.attrs][0][attrFields.value] * (i === 5 ? 1 : 100)) + ""));
                fight += arr[i] % 1000 === 0 ? 0 : cfg[gauntletFields.fight];
            }
            if(count === 0) this.nameTxt.text = "辅助装备";
            else this.nameTxt.text = `${CommonUtil.numToUpperCase(count)}徽章·辅助装备`;
            this.stoneNum.text = `x${count}`;
            // 总属性
            let glovesCfg:gauntlet = GauntletCfg.instance.getCfgById(0);
            let attrs:Array<attr> = glovesCfg[gauntletFields.attrs];
            for(let i:int = 0, len:int = attrs.length; i < len; i++){
                let cfg:attr_item = AttrItemCfg.instance.getCfgById(attrs[i][attrFields.type]);
                this._attrNames[i].text = `${cfg[attr_itemFields.name]}：`;
                this._attrValues[i].text = `+${Math.floor(attrs[i][attrFields.value] * per)}`;
                this._attrExes[i].text = `(徽章加成+${Math.floor(attrs[i][attrFields.value] * (per - 1))})`;
                this._attrExes[i].visible = per > 1;
            }

            let cfg:skill = SkillCfg.instance.getCfgById(BlendCfg.instance.getCfgById(51101)[blendFields.intParam][0] * 10000 + 1);
            this.skillIcon.skin = `assets/icon/skill/${cfg[skillFields.icon]}.png`;
            this.skillName.text = cfg[skillFields.name];
            this.skillDesc.innerHTML = cfg[skillFields.des];

            this.fightClip.value = Math.floor(glovesCfg[gauntletFields.fight] * per + fight) + "";
        }

        destroy(): void {
            this._attrNames = this.destroyElement(this._attrNames);
            this._attrValues = this.destroyElement(this._attrValues);
            this._attrExes = this.destroyElement(this._attrExes);
            this._stoneIcons = this.destroyElement(this._stoneIcons);
            this._stoneNames = this.destroyElement(this._stoneNames);
            this._stoneLvs = this.destroyElement(this._stoneLvs);
            this._stoneDescs = this.destroyElement(this._stoneDescs);
            this._descs.length = 0;
            this._descs = null;
            super.destroy();
        }
    }
}