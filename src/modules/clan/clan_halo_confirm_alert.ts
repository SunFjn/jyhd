///<reference path="./clan_skill_cfg.ts"/>
///<reference path="../config/skill_cfg.ts"/>

/** 光环刷新确认替换弹框*/
namespace modules.clan {
    import LayaEvent = modules.common.LayaEvent;
    import ClanHaloConfirmAlertUI = ui.ClanHaloConfirmAlertUI;
    import ClanSkillCfg = modules.config.ClanSkillCfg;
    import Image = Laya.Image;
    import BtnGroup = modules.common.BtnGroup;
    import clan_skill = Configuration.clan_skill;
    import SkillCfg = modules.config.SkillCfg;
    import skillFields = Configuration.skillFields;
    import clan_skillFields = Configuration.clan_skillFields;
    import clan_skill_Item = Configuration.clan_skill_Item;

    export class ClanHaloConfirmAlert extends ClanHaloConfirmAlertUI {
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.okBtn, LayaEvent.CLICK, this, this.okBtnHandler);
            this.addAutoListener(this.cancelBtn, LayaEvent.CLICK, this, this.cancelBtnHandler);

        }


        onOpened(): void {
            super.onOpened();
            let id: number = ClanModel.instance.haloStagingId;
            //技能配置表
            let skill_info = SkillCfg.instance.getCfgById(id);
            let name = skill_info[skillFields.name];
            let desc = skill_info[skillFields.des];
            this.haloTxt.text = `【${name}】`;
            this.descTxt.text = desc;
        }

        okBtnHandler(): void {
            ClanCtrl.instance.clanHaloConfirmReplace();
        }

        cancelBtnHandler(): void {
            this.close();
        }

        close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }


    }
}