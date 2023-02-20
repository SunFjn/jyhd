///<reference path="../../../modules/config/skill_cfg.ts"/>
///<reference path="../../../modules/player/player_model.ts"/>
namespace game.role.component {
    import skillFields = Configuration.skillFields;
    import SkillCfg = modules.config.SkillCfg;
    import PlayerModel = modules.player.PlayerModel;
    import SkillFields = Protocols.SkillFields;

    type SkillFilter = (value: Configuration.skill) => boolean;
    type SkillSorter = (l: Cooldwon, r: Cooldwon) => number;

    export class SkillComponent extends RoleComponent {
        private readonly _common: Array<Cooldwon>;
        private readonly _filter: SkillFilter;
        private readonly _sorter: SkillSorter;
        private _commonIndex: number;
        private _skills: Array<Cooldwon>;
        private _onlyCommon: boolean;

        constructor(owner: Role, commonSkills: Array<number>, filter?: SkillFilter, sorter?: SkillSorter) {
            super(owner);

            let cooldowns = PlayerModel.instance.cooldowns;
            this._common = [];
            for (let id of commonSkills) {
                let skillClass = Math.floor(id / 10000);
                let isExist = false;
                for (let info of cooldowns) {
                    if (info[0] == skillClass) {
                        this._common.push(info);
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    let tuple = SkillCfg.instance.getCfgById(id);
                    let cooldown: Cooldwon = [skillClass, 0, tuple[skillFields.cd]];
                    this._common.push(cooldown);
                    cooldowns.push(cooldown);
                }
            }

            this._commonIndex = -1;
            this._filter = filter || function (value: Configuration.skill): boolean {
                return value[skillFields.skillType] == 1 && value[skillFields.petSkill] == 0;
            };
            this._sorter = sorter || function (l: Cooldwon, r: Cooldwon): number {
                return l[0] > r[0] ? -1 : 1;
            };
            this._skills = [];
            this._onlyCommon = false;
        }

        public get onlyCommon(): boolean {
            return this._onlyCommon;
        }

        public set onlyCommon(value: boolean) {
            this._onlyCommon = value;
        }

        public setup(): void {
            this.updateSkill();
            GlobalData.dispatcher
                .on(CommonEventType.SKILL_INITED, this, this.updateSkill)
                .on(CommonEventType.SKILL_UPDATE, this, this.updateSkill);
        }

        public teardown(): void {
            GlobalData.dispatcher
                .off(CommonEventType.SKILL_INITED, this, this.updateSkill)
                .off(CommonEventType.SKILL_UPDATE, this, this.updateSkill);
        }

        public destory(): void {
        }

        public selectSkill(): number {
            return this.selectSkillEx();
            let selectIndex = -1;
            if (!this._onlyCommon) {
                let now = Date.now();
                for (let i = 0, limit = this._skills.length; i < limit; ++i) {
                    let info = this._skills[i];
                    if (info[1] < now) {
                        selectIndex = info[0];
                        info[1] = now + info[2];
                        break;
                    }
                }
            }

            if (selectIndex == -1 && this._common != null && this._common.length != 0) {
                if (this._commonIndex == -1) {
                    this._commonIndex = Math.floor(ArrayUtils.randomIndex(this._common) / 3);
                    let now = Date.now();
                    let info = this._common[this._commonIndex];
                    if (info[1] < now) {
                        selectIndex = info[0];
                        info[1] = now + info[2];
                    } else {
                        selectIndex = -1;
                    }
                } else {
                    this._commonIndex = (++this._commonIndex) % this._common.length;
                    selectIndex = this._common[this._commonIndex][0];
                }
            } else {
                this._commonIndex = -1;
            }
            // console.log("选择使用技能", selectIndex)
            return selectIndex;
        }
        private attackTime: number = 0;


        /**
         * 随机获取满足条件的技能索引
         * 
         * @param now 当前时间
         * @returns 
         */
        private randomSelectReadySkill(now: number): Cooldwon {
            let ready_skill_arr: Array<Cooldwon> = [];
            // 筛选出满足条件(cd到了)的技能
            for (let i = 0, limit = this._skills.length; i < limit; ++i) {
                let info = this._skills[i];
                if (info[1] < now) {
                    ready_skill_arr.push(info);
                }
            }

            let select_skill: Cooldwon = null;
            // 随机取一个满足条件的技能
            if (ready_skill_arr.length > 0) {
                let random_index = CommonUtil.getRandomInt(0, ready_skill_arr.length - 1);
                select_skill = ready_skill_arr[random_index];
                // console.log("随机选取选择技能：", random_index, "skill_id:", select_skill[0], "数组：", [...ready_skill_arr]);
            }

            return select_skill;
        }

        public selectSkillEx(): number { // 新版释放逻辑
            let selectIndex = -1;
            let now = Date.now();
            if (this.nextSkill != -1) {
                selectIndex = this.nextSkill
                for (let i = 0, limit = this._skills.length; i < limit; ++i) {
                    let info = this._skills[i];
                    if (selectIndex == info[0]) {
                        selectIndex = info[0];
                        info[1] = now + info[2];
                        break;
                    }
                }
                this.nextSkill = -1;
                GlobalData.dispatcher.event(CommonEventType.VIRTUAL_SKILL_UPDATE);
                return selectIndex;
            }
            if (this._commonIndex > -1) {
                // 失去普攻连贯效果
                //现阶段 第一下A 300毫秒释放 第二下A400毫秒释放 只要大于420失去连贯效果
                if (now - this.attackTime > 600) this._commonIndex = -1;
                // 一轮普攻到结尾
                if (this._commonIndex + 1 >= this._common.length) this._commonIndex = -1;
            }

            if (!this._onlyCommon && this._commonIndex == -1) {
                // for (let i = 0, limit = this._skills.length; i < limit; ++i) {
                //     let info = this._skills[i];
                //     if (info[1] < now) {
                //         selectIndex = info[0];
                //         info[1] = now + info[2];
                //         GlobalData.dispatcher.event(CommonEventType.VIRTUAL_SKILL_UPDATE)
                //         break;
                //     }
                // }
                // 选择技能
                let select_skill: Cooldwon = this.randomSelectReadySkill(now);
                if (select_skill) {
                    selectIndex = select_skill[0];
                    select_skill[1] = now + select_skill[2];
                    GlobalData.dispatcher.event(CommonEventType.VIRTUAL_SKILL_UPDATE)
                }
            }
            // selectIndex = -1; // 不放技能 只释放普攻

            if (selectIndex == -1 && this._common != null && this._common.length != 0) {
                if (this._commonIndex == -1) {
                    this._commonIndex = 0;
                    let now = Date.now();
                    let info = this._common[this._commonIndex];
                    if (info[1] < now) {
                        selectIndex = info[0];
                        info[1] = now + info[2];
                    } else {
                        selectIndex = -1;
                    }
                } else {
                    this._commonIndex++;
                    selectIndex = this._common[this._commonIndex][0];
                }
                GlobalData.dispatcher.event(CommonEventType.VIRTUAL_SKILL_UPDATE, [selectIndex, 300])
                this.attackTime = now
            } else {
                this._commonIndex = -1;
            }
            return selectIndex;
        }




        private updateSkill(): void {
            let skills = PlayerModel.instance.skills;
            if (!skills) return;
            let cooldowns = PlayerModel.instance.cooldowns;
            let list: Array<Cooldwon> = [];
            for (let skill of skills) {
                let skillClass = skill[SkillFields.skillId];
                let id = skillClass * 10000 + skill[SkillFields.level];
                if (this._common != null) {
                    let isCommon = false;
                    for (let info of this._common) {
                        if (info[0] == skillClass) {
                            isCommon = true;
                            break;
                        }
                    }
                    if (isCommon) {
                        continue;
                    }
                }
                let tuple = SkillCfg.instance.getCfgById(id);
                if (tuple != null && this._filter(tuple)) {
                    let isExist = false;
                    for (let cooldown of cooldowns) {
                        if (cooldown[0] == skillClass) {
                            cooldown[2] = tuple[skillFields.cd];
                            list.push(cooldown);
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        let cooldown: Cooldwon = [skillClass, 0, tuple[skillFields.cd]];
                        list.push(cooldown);
                        cooldowns.push(cooldown);
                    }
                }
            }
            this._skills = list;
            this._skills.sort(this._sorter);
            GlobalData.dispatcher.event(CommonEventType.VIRTUAL_SKILL_INIT)
        }
        public getCdSkill() {
            let now = Date.now();
            let list = []
            for (let i = 0, limit = this._skills.length; i < limit; ++i) {
                let info = this._skills[i];
                if (info[1] > now) {
                    list.push([info[0], info[1] - now])
                }
            }
            return list;
        }
        public getSkillList() {
            return this._skills.concat();
        }
        private nextSkill: number = -1;
        public setNextSkill(skillClass: number) {
            let now = Date.now();
            let selectIndex = -1;
            if (!this._onlyCommon) {
                for (let i = 0, limit = this._skills.length; i < limit; ++i) {
                    let info = this._skills[i];
                    if (skillClass == info[0] && info[1] < now) {
                        selectIndex = info[0];
                        info[1] = now + info[2];
                        break;
                    }
                }
            }

            if (skillClass == 8001) {
                if (this._common != null && this._common.length != 0) {
                    this._commonIndex++;
                    if (this._commonIndex >= this._common.length) this._commonIndex = 0;
                    selectIndex = this._common[this._commonIndex][0];
                }
            }
            // console.log('研发测试_chy:主动释放结果',selectIndex);
            this.nextSkill = selectIndex;
            return selectIndex > -1;
        }
    }


}