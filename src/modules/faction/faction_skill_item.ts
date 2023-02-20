/////<reference path="../$.ts"/>
///<reference path="../config/attr_skill_cfg.ts"/>

/** 技能item */
namespace modules.faction {
    import CommonUtil = modules.common.CommonUtil;
    import GlobalData = modules.common.GlobalData;
    import FactionSkillItemUI = ui.FactionSkillItemUI;
    import skill = Configuration.skill;
    import SkillCfg = modules.config.SkillCfg;
    import skillFields = Configuration.skillFields;
    import AttrUtil = modules.common.AttrUtil;
    import faction_skill = Configuration.faction_skill;
    import Items = Configuration.Items;
    import faction_skillFields = Configuration.faction_skillFields;
    import ItemsFields = Configuration.ItemsFields;
    import attr_skill = Configuration.attr_skill;
    import AttrSkillCfg = modules.config.AttrSkillCfg;
    import attr_skillFields = Configuration.attr_skillFields;

    export class FactionSkillItem extends FactionSkillItemUI {

        private _skillId: number;
        private _needProp: Items;

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.btn, common.LayaEvent.CLICK, this, this.btnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_INFO, this, this.updateProp);
        }

        public setData(skillId: number): void {
            this._skillId = skillId;
            let skillCfg: skill = SkillCfg.instance.getCfgById(skillId);
            let name: string = skillCfg[skillFields.name];
            let lv: number = skillId % 100;
            this.nameTxt.text = `${name}`;
            this.levelTxt.text = `Lv.${lv}`;
            let icon: string = skillCfg[skillFields.icon];
            this.iconImg.skin = `assets/icon/skill/${icon}.png`;
            let attr: number[] = skillCfg[skillFields.param];
            let attrId: number = attr[0];
            let attrValue: number = attr[1] ? attr[1] : 0;
            let attrSkillCfg: attr_skill = AttrSkillCfg.instance.getCfgById(attrId);
            let attrName: string = attrSkillCfg[attr_skillFields.name];
            let isPer: number = attrSkillCfg[attr_skillFields.isPercent];
            let valueStr: string;
            if (attrValue) {
                valueStr = isPer ? `${AttrUtil.formatFloatNum(attrValue)}%` : `${attrValue}`;
            } else {
                valueStr = `0`;
            }
            this.attrTxt.text = `${attrName} ${valueStr}`;
            let nextSkillCfg: skill = SkillCfg.instance.getCfgById(skillId + 1);

            if (!nextSkillCfg) { //满级
                this.propBox.visible = this.btn.visible = this.nextLvBox.visible = false;
                this.conditionTxt.visible = true;
                this.conditionTxt.color = `#168a17`;
                this.conditionTxt.text = `已满级`;
                CommonUtil.centerChainArr(this.width, [this.conditionTxt]);
            } else {
                this.nextLvBox.visible = true;
                let diffNum: number = nextSkillCfg[skillFields.param][1] - attrValue;
                this.nextLvTxt.text = isPer ? `${AttrUtil.formatFloatNum(diffNum)}%` : `${diffNum}`;
                let cfg: faction_skill = FactionSkillCfg.instance.getCfgById(skillId);
                let needLv: number = cfg[faction_skillFields.level];
                let thisLv: number = FactionModel.instance.lv;
                if (thisLv >= needLv) {  //等级足够
                    this.conditionTxt.visible = false;
                    this.propBox.visible = this.btn.visible = true;
                    this._needProp = cfg[faction_skillFields.items];
                    this.updateProp();
                } else {
                    this.conditionTxt.visible = true;
                    this.propBox.visible = this.btn.visible = false;
                    this.conditionTxt.color = `#ff3e3e`;
                    this.conditionTxt.text = `公会达到Lv.${needLv}方可继续升级`;
                    CommonUtil.centerChainArr(this.width, [this.conditionTxt]);
                }
            }
        }

        private updateProp(): void {
            if (!this._needProp) return;
            let itemId: number = this._needProp[ItemsFields.itemId];
            let itemCount: number = this._needProp[ItemsFields.count];
            let myCount: number = FactionModel.instance.contribution;
            this.propImg.skin = CommonUtil.getIconById(itemId);
            this.propTxt.text = itemCount.toString();
            this.propTxt.color = myCount >= itemCount ? `#168a17` : `#ff3e3e`;
        }

        private btnHandler(): void {
            FactionCtrl.instance.promoteFactionSkill(this._skillId);
        }
    }
}