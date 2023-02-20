
/**战队特权技能渲染节点 */
namespace modules.clan {
    import ClanPrivilegeItemUI = ui.ClanPrivilegeItemUI;
    import ClanSkillCfg = modules.config.ClanSkillCfg;
    import clan_skill_ItemFields = Configuration.clan_skill_ItemFields;
    import clan_skill_Item = Configuration.clan_skill_Item;

    export class ClanPrivilegeItem extends ClanPrivilegeItemUI {

        protected addListeners(): void {
            super.addListeners();

        }

        protected initialize(): void {
            super.initialize();
        }

        protected setData(value: clan_skill_Item): void {
            super.setData(value);
            let skillID = value[clan_skill_ItemFields.id];
            let active = ClanSkillCfg.instance.checkSkillActive(skillID);
            this.skillTxt.text = value[clan_skill_ItemFields.name];
            this.descTxt.text = value[clan_skill_ItemFields.desc];

            this.activeImg.visible = active;
            this.activeTxt.visible = !active;
            this.activeTxt.text = `${value[clan_skill_ItemFields.activeLevel]}级激活`;
            this.iconImg.skin = `assets/icon/skill/${value[clan_skill_ItemFields.iconId]}.png`;
        }
    }
}