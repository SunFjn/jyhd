/////<reference path="../$.ts"/>
/** 仙府-家园技能配置 */
namespace modules.config {
    import xianfu_skill = Configuration.xianfu_skill;
    import xianfu_skillFields = Configuration.xianfu_skillFields;

    export class XianfuSkillCfg {
        private static _instance: XianfuSkillCfg;
        public static get instance(): XianfuSkillCfg {
            return this._instance = this._instance || new XianfuSkillCfg();
        }

        private _tab: Table<xianfu_skill>;
        private _tab2: Table<xianfu_skill>;
        private _pureIds: number[];
        private  _firstLv:number;
        constructor() {
            this.init();
        }

        private init(): void {
            this._tab = {};
            this._tab2 = {};
            this._pureIds = [];
            let arr: Array<xianfu_skill> = GlobalData.getConfig("xianfu_skill");
            for (let ele of arr) {
                let lv: number = ele[xianfu_skillFields.level];
                this._tab[lv] = ele;
                let skillId: number = ele[xianfu_skillFields.skill];
                if (!skillId) continue;
                if(this._firstLv == null){
                    this._firstLv = lv;
                }
                let pureId: number = CommonUtil.getSkillPureIdById(skillId);
                if (this._pureIds.indexOf(pureId) === -1) {
                    this._pureIds.push(pureId);
                }
                this._tab2[skillId] = ele;
            }
        }

        public get pureIds(): number[] {
            return this._pureIds;
        }

        public getCfgByLv(lv: number): xianfu_skill {
            return this._tab[lv];
        }

        public getCfgBySkillId(skillId: number): xianfu_skill {
            return this._tab2[skillId];
        }

        /** 获取下一个有技能的配置 */
        public getNextSkillCfgByLv(lv: number): xianfu_skill {
            let cfg: xianfu_skill = this._tab[lv + 1];
            if (!cfg) return null;
            let skillId: number = cfg[xianfu_skillFields.skill];
            if (!skillId) {
                return this.getNextSkillCfgByLv(lv + 1);
            } else {
                return cfg;
            }
        }

        public  get firstLv():number  {
            return this._firstLv;
        }
    }
}