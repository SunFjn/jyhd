/** 技能数据 */

///<reference path="../config/skill_train_cfg.ts"/>
///<reference path="../config/skill_cfg.ts"/>
///<reference path="../red_point/red_point_ctrl.ts"/>
///<reference path="../config/amulet_rise_cfg.ts"/>
///<reference path="../talisman/talisman_model.ts"/>

namespace modules.magicArt {
    import SkillTrainCfg = modules.config.SkillTrainCfg;
    import SkillCfg = modules.config.SkillCfg;
    import PlayerModel = modules.player.PlayerModel;
    import Dictionary = Laya.Dictionary;
    import skillTrain = Configuration.skillTrain;
    import skillTrainFields = Configuration.skillTrainFields;
    import skill = Configuration.skill;
    import GetSkillsReply = Protocols.GetSkillsReply;
    import GetSkillsReplyFields = Protocols.GetSkillsReplyFields;
    import UpdateSkill = Protocols.UpdateSkill;
    import UpdateSkillFields = Protocols.UpdateSkillFields;
    import Skill = Protocols.Skill;
    import SkillFields = Protocols.SkillFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import TalismanModel = modules.talisman.TalismanModel;
    import AmuletRiseFields = Protocols.AmuletRiseFields;
    import AmuletRiseCfg = modules.config.AmuletRiseCfg;
    import amuletRiseFields = Configuration.amuletRiseFields;
    import ActorBaseAttrFields = Protocols.ActorBaseAttrFields;
    import ActorBaseAttr = Protocols.ActorBaseAttr;

    export class MagicArtModel {
        private static _instance: MagicArtModel = new MagicArtModel();
        public static get instance(): MagicArtModel {
            return this._instance;
        }

        //战力
        public _fighting: number;
        //绝学技能
        public _knowledgeSkill: Array<Skill>;
        //秘术技能，等级为1只需要id即可
        public _scienceSkill: Array<number>;
        //大荒技能
        private _famineSkill: Array<skillTrain>;
        //古神技能
        private _oldGodSkill: Array<skillTrain>;
        //觉醒技能
        private _turnBirthSkill: Array<skillTrain>;
        //初始绝学ID
        private _knowledgeId: Array<number> = [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008];
        //需要消耗的花费
        private _costNum: Array<number>;
        private _minNum: number = 1000;
        //对应技能是否升级
        public hasLevelUp: Array<boolean> = [false, false, false, false, false, false, false, false];
        private _beforeLevel: Array<number>;
        public maxLevel: number;

        /**
         * 初始化需要的数据
         */
        public dataInit(tuple: GetSkillsReply) {
            this._fighting = tuple[GetSkillsReplyFields.fighting];
            let skills = tuple[GetSkillsReplyFields.skills];
            PlayerModel.instance.skills = skills;
            this.classifySkillUpdate(tuple[GetSkillsReplyFields.skills]);
            this.updateCostNum();
            this.initBeforeLevel();
            this.checkHaveRedPoint();
            GlobalData.dispatcher.event(CommonEventType.SKILL_INITED);
        }

        private initBeforeLevel(): void {
            this._beforeLevel = new Array<number>();
            for (let i = 0; i < this._knowledgeId.length; i++) {
                this._beforeLevel[i] = 1;
                for (let j = 0; j < this._knowledgeSkill.length; j++) {
                    if (this._knowledgeId[i] == this._knowledgeSkill[j][SkillFields.skillId]) {
                        this._beforeLevel[i] = this._knowledgeSkill[j][SkillFields.level];
                    }
                }
            }
        }

        /**
         * 技能更新
         */
        public updateSkill(tuple: UpdateSkill): void {
            this._fighting = tuple[UpdateSkillFields.fighting];
            let skills = tuple[GetSkillsReplyFields.skills];
            PlayerModel.instance.skills = skills;
            this.classifySkillUpdate(tuple[UpdateSkillFields.skills]);
            this.updateCostNum();
            this.isLevelChange();
            GlobalData.dispatcher.event(CommonEventType.SKILL_UPDATE);
        }

        private isLevelChange(): void {
            for (let i = 0; i < this._knowledgeSkill.length; i++) {
                let index = this._knowledgeSkill[i][SkillFields.skillId] % 1000 - 1;
                let level = this._knowledgeSkill[i][SkillFields.level];
                if (this._beforeLevel[index] < level) {
                    this.hasLevelUp[index] = true;
                    this._beforeLevel[index] = level;
                }
            }
        }

        /**
         * 将技能进行分类更新
         */
        private classifySkillUpdate(skill: Array<Skill>): void {
            this._knowledgeSkill = new Array<Skill>();
            this._scienceSkill = new Array<number>();
            if (skill && skill.length > 0) {
                for (let i = 0; i < skill.length; i++) {
                    let skillId = skill[i][SkillFields.skillId];
                    let type = Math.floor(skillId / this._minNum);
                    if (type == 1) {
                        this._knowledgeSkill.push(skill[i]);
                    } else if (type == 2 || type == 4) {
                        this._scienceSkill.push(skillId);
                    }
                }
            }
            this._scienceSkill.sort(function compare(a, b) {
                return a - b;
            }); //对技能进行正序的排序
        }

        //仙灵升级需要消耗的金钱数量
        private updateCostNum(): void {
            this._costNum = new Array<number>();
            for (let i = 0; i < this._knowledgeSkill.length; i++) {
                let skillId = this._knowledgeSkill[i][SkillFields.skillId];
                let level = this._knowledgeSkill[i][SkillFields.level];
                let info: skillTrain = this.getKnowledgeInfoById(skillId * 10000 + level);
                this._costNum[i] = info[skillTrainFields.zq];
            }
        }

        /**
         * 根据输入的索引来判断是否有红点
         * @param index 索引值
         */
        public checkLevelUp(index: number): boolean {
            let attr: ActorBaseAttr = PlayerModel.instance.playerBaseAttr;
            let needNum: number = this._costNum[index];
            let haveNum: number = attr[ActorBaseAttrFields.zq];
            if (needNum <= haveNum) {
                return true;
            }
            return false;
        }

        public updateMaxLevel(): void {
            let level = TalismanModel.instance.getAmuletRise()[AmuletRiseFields.level];
            this.maxLevel = AmuletRiseCfg.instance.getCfgBylevel(level)[amuletRiseFields.maxSkillLevel];
            this.checkHaveRedPoint();
        }

        /**
         * 判断技能模块是否有红点
         */
        public checkHaveRedPoint(): boolean {
            if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.skill) && this._knowledgeSkill) {
                for (let i = 0; i < this._knowledgeSkill.length; i++) {
                    if (this.checkLevelUp(i) && this._knowledgeSkill[i][SkillFields.level] < this.maxLevel) {
                        RedPointCtrl.instance.setRPProperty("magicArtRP", true);
                        return true;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("magicArtRP", false);
            return false
        }

        /**
         * 设置/获取学习技能，客户端主动
         */
        // public openSkill(): number {
        //     let t: number = this._unOpenSkill.pop();
        //     this._openSkill = t;
        //     return t ? t : null;
        // }

        /**
         * 获得原始的技能id
         * @param index 索引值
         */
        public getRowSkillId(index: number): number {
            return this._knowledgeId[index];
        }

        /**
         * 根据绝学技能ID获取对应的Skill_train配置
         * @param id 绝学技能id
         */
        public getKnowledgeInfoById(id: number): skillTrain {
            let t: skillTrain = SkillTrainCfg.instance.getKnowledgeCfgById(id);
            return t ? t : null;
        }

        /**
         * 根据秘术技能ID获取对应的Skill_train配置
         * @param id 秘术技能id
         */
        public getScienceCfgById(id: number): skillTrain {
            let t: skillTrain = SkillTrainCfg.instance.getScienceCfgById(id);
            return t ? t : null;
        }

        /**
         * 根据id获取对应的Skill配置
         */
        public getCfgById(id: number): skill {
            let t: skill = SkillCfg.instance.getCfgById(id);
            return t ? t : null;
        }

        /**
         * 检测是否已经获取了该秘术技能
         */
        public checkHasSkill(id: number): boolean {
            for (let i = 0; i < this._scienceSkill.length; i++) {
                if (this._scienceSkill[i] == id) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 更改排序
         */
        public setScienceCfgBySort(type: number, arr: Array<skillTrain>): void {
            if (type == 1) {
                this._famineSkill = arr;
            } else if (type == 2) {
                this._oldGodSkill = arr;
            } else if (type == 3) {
                this._turnBirthSkill = arr;
            }
        }

        /**
         * 根据类型获得所有秘术技能
         */
        public getScienceCfg(type: number): Array<skillTrain> {
            if (!this._famineSkill || !this._oldGodSkill || !this._turnBirthSkill) {
                let t: Dictionary = SkillTrainCfg.instance.getScienceCfg();
                let keyNum: Array<number> = t.keys;
                this._famineSkill = new Array<skillTrain>();
                this._oldGodSkill = new Array<skillTrain>();
                this._turnBirthSkill = new Array<skillTrain>();
                for (let i = 0; i < keyNum.length; i++) {
                    let scienceType = t.get(keyNum[i])[skillTrainFields.type];
                    if (scienceType == 1) {
                        this._famineSkill.push(t.get(keyNum[i]));
                    } else if (scienceType == 2) {
                        this._oldGodSkill.push(t.get(keyNum[i]));
                    } else if (scienceType == 3) {
                        this._turnBirthSkill.push(t.get(keyNum[i]));
                    }
                }
            }
            if (type == 1) {
                return this._famineSkill;
            } else if (type == 2) {
                return this._oldGodSkill;
            } else if (type == 3) {
                return this._turnBirthSkill;
            }
            return null;
        }
    }
}