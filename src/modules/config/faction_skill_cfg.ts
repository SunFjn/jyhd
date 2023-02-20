/////<reference path="../$.ts"/>
/** 仙盟技能配置 */
namespace modules.faction {
    import faction_skill = Configuration.faction_skill;
    import faction_skillFields = Configuration.faction_skillFields;

    export class FactionSkillCfg {
        private static _instance: FactionSkillCfg;
        public static get instance(): FactionSkillCfg {
            return this._instance = this._instance || new FactionSkillCfg();
        }

        private _tab: Table<faction_skill>;
        private _pureIds: number[];

        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._pureIds = [];
            let arr: Array<faction_skill> = GlobalData.getConfig("faction_skill");
            for (let e of arr) {
                let id: number = e[faction_skillFields.skillId];
                this._tab[id] = e;
                let pureId: number = CommonUtil.getSkillPureIdById(id);
                if (this._pureIds.indexOf(pureId) == -1) {
                    this._pureIds.push(pureId);
                }
            }
        }

        // 根据ID获取配置
        public getCfgById(id: int): faction_skill {
            return this._tab[id];
        }

        //获取纯粹id数组
        public get pureIds(): number[] {
            return this._pureIds;
        }

    }
}
