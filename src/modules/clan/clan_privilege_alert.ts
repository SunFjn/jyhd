/** 战队排行列表弹窗 */

///<reference path="../common/custom_list.ts"/>
///<reference path="./clan_skill_cfg.ts"/>
///<reference path="../config/skill_cfg.ts"/>

namespace modules.clan {
    import Event = Laya.Event;
    import equip_attr_poolFields = Configuration.equip_attr_poolFields;
    import equip_attr_pool = Configuration.equip_attr_pool;
    import LayaEvent = modules.common.LayaEvent;
    import ClanPrivilegeAlertUI = ui.ClanPrivilegeAlertUI;
    import CustomList = modules.common.CustomList;
    import ClanCfg = modules.config.ClanCfg;
    import ClanSkillCfg = modules.config.ClanSkillCfg;
    import SkillCfg = modules.config.SkillCfg;
    import skillFields = Configuration.skillFields;
    import clan = Configuration.clan;
    import clanFields = Configuration.clanFields;
    import attr = Configuration.attr;
    import attrFields = Configuration.attrFields;
    import ClanInfoData = Protocols.GetMyClanInfoReply;
    import ClanInfoDataFields = Protocols.GetMyClanInfoReplyFields;
    import ItemAttrPoolCfg = modules.config.ItemAttrPoolCfg;
    import clan_skill = Configuration.clan_skill;
    import clan_skillFields = Configuration.clan_skillFields;
    import clan_skill_Item = Configuration.clan_skill_Item;


    export class ClanPrivilegeAlert extends ClanPrivilegeAlertUI {
        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 45;
            this._list.y = 365;
            this._list.width = 582;
            this._list.height = 418;
            this._list.hCount = 1;
            this._list.itemRender = ClanPrivilegeItem;
            this._list.spaceY = 0;
            this.addChild(this._list);
        }


        protected addListeners(): void {
            super.addListeners();
        }

        onOpened(): void {
            super.onOpened();

            this.updateView();
        }

        //更新界面
        private updateView(): void {
            //当前等级特权显示
            let data: ClanInfoData = ClanModel.instance.myClanInfo;
            let lv: number = data[ClanInfoDataFields.level];
            let nextLv: number = ClanCfg.instance.getNextLv(lv);
            this.curLevelTxt.text = `LV.${lv}`;
            this.nextLevelTxt.text = `LV.${nextLv}`;
            //配置
            let cfg: clan = ClanCfg.instance.getCfgByLv(lv);
            let nextCfg: clan = ClanCfg.instance.getCfgByLv(lv, 1);
            this.curNumTxt.text = `战队人数：${cfg[clanFields.memerLimit]}`;
            this.nextNumTxt.text = `战队人数：${nextCfg[clanFields.memerLimit]}`;
            //等级加成配置
            let attrs: Array<attr> = cfg[clanFields.attr];
            let next_attrs: Array<attr> = nextCfg[clanFields.attr];
            //加成属性显示
            this.curAttackTxt.text = `${ItemAttrPoolCfg.instance.getCfgById(attrs[0][attrFields.type])[equip_attr_poolFields.name]}：${attrs[0][attrFields.value]}`;
            this.curHPTxt.text = `${ItemAttrPoolCfg.instance.getCfgById(attrs[1][attrFields.type])[equip_attr_poolFields.name]}：${attrs[1][attrFields.value]}`;
            this.curDefendTxt.text = `${ItemAttrPoolCfg.instance.getCfgById(attrs[2][attrFields.type])[equip_attr_poolFields.name]}：${attrs[2][attrFields.value]}`;
            this.nextAttackTxt.text = `${ItemAttrPoolCfg.instance.getCfgById(next_attrs[0][attrFields.type])[equip_attr_poolFields.name]}：${next_attrs[0][attrFields.value]}`;
            this.nextHPTxt.text = `${ItemAttrPoolCfg.instance.getCfgById(next_attrs[1][attrFields.type])[equip_attr_poolFields.name]}：${next_attrs[1][attrFields.value]}`;
            this.nextDefendTxt.text = `${ItemAttrPoolCfg.instance.getCfgById(next_attrs[2][attrFields.type])[equip_attr_poolFields.name]}：${next_attrs[2][attrFields.value]}`;
            //技能配置表
            let __clanSkillCfg: Table<clan_skill> = ClanSkillCfg.instance.getAllConfig();
            //组合参数
            let skillArray: Array<clan_skill_Item> = [];
            for (const skillID in __clanSkillCfg) {
                let skill: clan_skill = __clanSkillCfg[skillID];
                let skill_info = SkillCfg.instance.getCfgById(skill[clan_skillFields.id]);
                let activeLevel: number = skill[clan_skillFields.level];

                let name = skill_info[skillFields.name];
                let desc = skill_info[skillFields.des];
                let iconID = skill_info[skillFields.icon];
                let tempArr: clan_skill_Item = [name, desc, iconID, activeLevel, parseInt(skillID)];
                skillArray.push(tempArr);
            }
            //处理浏览器自动给对象排序导致技能顺序错误
            skillArray.sort((a, b) => a[3] - b[3]);
            //列表赋值
            this._list.datas = skillArray;
        }


    }
}