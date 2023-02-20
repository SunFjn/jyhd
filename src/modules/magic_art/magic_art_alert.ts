/** 秘术单元项 */

namespace modules.magicArt {
    import MaigcArtAlertUI = ui.MaigcArtAlertUI;
    import skillTrain = Configuration.skillTrain;
    import skillTrainFields = Configuration.skillTrainFields;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import SkillFields = Protocols.SkillFields;
    import Skill = Protocols.Skill;
    import BagUtil = modules.bag.BagUtil;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class magicArtAlert extends MaigcArtAlertUI {
        private _levelUpCost: number;
        private _showInfoId: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
        }

        onOpened() {
            super.onOpened();

        }

        setOpenParam(value: number) {
            super.setOpenParam(value);
            this.setKnowledgeInfo(value);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.levelUpBtn, common.LayaEvent.CLICK, this, this.levelUpHandler);
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        private setKnowledgeInfo(showInfoId: number): void {
            console.log("showid", showInfoId);
            this._showInfoId = showInfoId;
            if (showInfoId) {
                let haveKnowledge: Array<Skill> = MagicArtModel.instance._knowledgeSkill;
                let level: number = 0;
                let nextLevel: number = 0;
                for (let i = 0; i < haveKnowledge.length; i++) {
                    if (showInfoId == haveKnowledge[i][SkillFields.skillId]) {
                        level = haveKnowledge[i][SkillFields.level];
                        nextLevel = haveKnowledge[i][SkillFields.level] + 1;
                        break;
                    }
                }

                let cfg: skillTrain = MagicArtModel.instance.getKnowledgeInfoById(showInfoId * 10000 + level);
                let skillInfo: skill = MagicArtModel.instance.getCfgById(showInfoId * 10000 + level);
                let nextSkillInfo: skill = MagicArtModel.instance.getCfgById(showInfoId * 10000 + nextLevel);
                this.skillIcon3.skin = `assets/icon/skill/${skillInfo[skillFields.icon]}.png`;
                this._levelUpCost = cfg[skillTrainFields.zq];
                this.skillInfoTxt.text = cfg[skillTrainFields.name] + ' Lv.' + `${level}`;
                this.skillDescribeTxt.text = skillInfo[skillFields.des]    //设置描述
                this.fightTxt.text = skillInfo[skillFields.fight].toString()  //设置战斗力
                if (nextSkillInfo) {
                    this.nextSkillDescribeTxt.text = nextSkillInfo[skillFields.des];    //设置下级描述
                } else {
                    this.nextSkillDescribeTxt.text = "已满级";
                }
            }
        }

        private levelUpHandler(): void {
            if (this._levelUpCost > PlayerModel.instance.getCurrencyById(MoneyItemId.zq)) {
                BagUtil.openLackPropAlert(MoneyItemId.zq, 1);
            }
            let haveKnowledge: Array<Skill> = MagicArtModel.instance._knowledgeSkill;
            for (let i = 0; i < haveKnowledge.length; i++) {
                if (haveKnowledge[i][SkillFields.skillId] == this._showInfoId) {
                    if (haveKnowledge[i][SkillFields.level] < MagicArtModel.instance.maxLevel) {
                        MagicArtCtrl.instance.addSkillLevel(this._showInfoId);
                        setTimeout(() => {
                            this.setKnowledgeInfo(this._showInfoId)
                        }, 60);
                        return;
                    } else {
                        if (haveKnowledge[i][SkillFields.level] == config.AmuletRiseCfg.instance.maxLv) {
                            CommonUtil.noticeError(ErrorCode.MagicArtMaxLevel);
                        } else {
                            SystemNoticeManager.instance.addNotice(`技能等级达到上限，提升圣物属性可突破上限`, true);
                        }
                        return;
                    }
                }
            }
            SystemNoticeManager.instance.addNotice("需先激活技能才可升级", true);
        }
    }
}