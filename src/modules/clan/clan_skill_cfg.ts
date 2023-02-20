///<reference path="./clan_model.ts"/>
/** 战队技能配置 */
namespace modules.config {
    import clan_skill = Configuration.clan_skill;
    import clan_skillFields = Configuration.clan_skillFields;
    import ClanModel = modules.clan.ClanModel;
    import GetMyClanInfoReplyFields = Protocols.GetMyClanInfoReplyFields;

    export class ClanSkillCfg {
        private static _instance: ClanSkillCfg;
        public static get instance(): ClanSkillCfg {
            return this._instance = this._instance || new ClanSkillCfg();
        }

        private _tab: Table<clan_skill>;

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            let arr: Array<clan_skill> = GlobalData.getConfig("fight_team_skill");
            for (let i: int = 0, len = arr.length; i < len; i++) {
                this._tab[arr[i][clan_skillFields.id]] = arr[i];
            }
        }

        //根据ID取配置 
        public getCfgByID(id: int): clan_skill {
            return this._tab[id];
        }

        //获取所有数据 
        public getAllConfig(): Table<clan_skill> {
            return this._tab;
        }
        //检测技能是否开启 
        public checkSkillActive(id: number): boolean {
            let active = false;
            let skill: clan_skill = this.getCfgByID(id);
            let needLevel = skill[clan_skillFields.level];
            let level: number = ClanModel.instance.myClanInfo[GetMyClanInfoReplyFields.level];
            active = level >= needLevel;
            return active;
        }
    }
}