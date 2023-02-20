///<reference path="../config/xianfu_cfg.ts"/>
///<reference path="../config/xianfu_skill_cfg.ts"/>
/** 仙府-家园升级面板 */
namespace modules.xianfu {
    import XianfuShengjiViewUI = ui.XianfuShengjiViewUI;
    import Box = Laya.Box;
    import Label = Laya.Label;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import XianfuCfg = modules.config.XianfuCfg;
    import xianfu = Configuration.xianfu;
    import xianfuFields = Configuration.xianfuFields;
    import XianfuNode = Configuration.XianfuNode;
    import XianfuNodeFields = Configuration.XianfuNodeFields;
    import Event = Laya.Event;
    import CustomClip = modules.common.CustomClip;
    import CommonUtil = modules.common.CommonUtil;
    import XianfuSkillCfg = modules.config.XianfuSkillCfg;
    import xianfu_skill = Configuration.xianfu_skill;
    import xianfu_skillFields = Configuration.xianfu_skillFields;
    import SkillCfg = modules.config.SkillCfg;
    import skillFields = Configuration.skillFields;
    import blendFields = Configuration.blendFields;
    import blend = Configuration.blend;
    import BlendCfg = modules.config.BlendCfg;
    import skill = Configuration.skill;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;

    export class XianfuShengjiPanel extends XianfuShengjiViewUI {

        private _barBoxArr: Array<Box>;
        private _conditonArr: Array<Label>;
        private _ratioBarArr: Array<ProgressBarCtrl>;
        private _btnClip: CustomClip;
        private _flag: boolean;
        private _flagArr: [boolean, number][];  // param 1 条件是否达成 2 跳转id
        private _skillIcons: XianfuSkillItem[];

        protected initialize(): void {
            super.initialize();

            this.centerY = this.centerX = 0;

            this._barBoxArr = [this.barBox_1, this.barBox_1, this.barBox_2, this.barBox_3];
            this._conditonArr = [this.conditionTxt_0, this.conditionTxt_1, this.conditionTxt_2, this.conditionTxt_3];
            this._ratioBarArr = new Array<ProgressBarCtrl>();
            this._ratioBarArr[0] = new ProgressBarCtrl(this.barImg_0, this.barImg_0.width, this.barTxt_0);
            this._ratioBarArr[1] = new ProgressBarCtrl(this.barImg_1, this.barImg_1.width, this.barTxt_1);
            this._ratioBarArr[2] = new ProgressBarCtrl(this.barImg_2, this.barImg_2.width, this.barTxt_2);
            this._ratioBarArr[3] = new ProgressBarCtrl(this.barImg_3, this.barImg_3.width, this.barTxt_3);

            this._btnClip = CommonUtil.creatEff(this.goBtn, `btn_light`, 15);
            this._btnClip.pos(-7, -16);
            this._btnClip.scale(1.25, 1.2);
            this._btnClip.visible = false;

            this._flagArr = [];

            this._skillIcons = [this.icon_0, this.icon_1, this.icon_2, this.icon_3];

            this.unLockContentTxt.color = "#000000";
            this.unLockContentTxt.style.fontFamily = "SimHei";
            this.unLockContentTxt.style.fontSize = 24;
            this.unLockContentTxt.style.valign = "middle";
            this.unLockContentTxt.style.lineHeight = 28;
            this.unLockContentTxt.mouseEnabled = false;
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.aboutBtn, Event.CLICK, this, this.aboutBtnHandler);
            this.addAutoListener(this.goBtn, Event.CLICK, this, this.goBtnHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_UPDATE, this, this.updateView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XIANFU_SKILL_UPDATE, this, this.updateSkill);
        }

        public onOpened(): void {
            super.onOpened();

            this._btnClip.play();
            this.updateView();
            this.updateSkill();
        }

        private updateSkill(): void {
            let list: number[] = XianfuModel.instance.skillList;
            if (!list) return;

            for (let i: int = 0, len: int = this._skillIcons.length; i < len; i++) {
                let pureId: number = XianfuSkillCfg.instance.pureIds[i];
                let skillId: number;
                for (let ele of list) {
                    let tempPureId: number = CommonUtil.getSkillPureIdById(ele);
                    if (tempPureId == pureId) {
                        skillId = ele;
                        break;
                    }
                }
                if (!skillId) {
                    skillId = CommonUtil.getSkillIdByPureIdAndLv(pureId);
                }
                this._skillIcons[i].info = skillId;
            }
        }

        private updateView(): void {

            let lv: number = XianfuModel.instance.lv;
            if (!lv) return;

            this.lvMsz.value = lv.toString();
            this.nextLvTxt.text = `${lv + 1}`;
            // this.nextLvTxt.text = `下一等级 Lv.${lv + 1}`;
            this.setSkillDes(lv);
            let nextCfgs: Array<xianfu> = XianfuCfg.instance.getCfgByLv(lv + 1);
            if (!nextCfgs) {
                this.maxLvBox.visible = false;
                this.maxLvTxt.visible = true;
                return;
            }
            let nextCfg: xianfu = nextCfgs[0];

            let describes: string[] = nextCfg[xianfuFields.describe];
            this.unLockTxt.text = describes[0];
            // this.unLockContentTxt.text = describes[1];
            this.unLockContentTxt.innerHTML = describes[1];
            let buildId: number = nextCfg[xianfuFields.buildId];
            this.buildIcon(buildId);

            let currCfg: xianfu = XianfuCfg.instance.getCfgByLv(XianfuModel.instance.lv)[0];
            let taskInfos: Array<XianfuNode> = currCfg[xianfuFields.nodes];
            let count: int = 0;
            this._flag = true;
            this._flagArr.length = 0;
            for (let i: int = 0, len: int = taskInfos.length; i < len; i++) {
                let taskType: number = taskInfos[i][XianfuNodeFields.type];
                this.setTaskBar(i, taskType);
                count++;
            }
            for (let i: int = 0, len: int = this._barBoxArr.length; i < len; i++) {
                this._barBoxArr[i].visible = i < count;
            }
            this._btnClip.visible = this._flag;
            this.goBtn.label = this._flag ? "升级" : "前往";


        }

        private setSkillDes(lv: number): void {
            let nextSkillCfg: xianfu_skill = XianfuSkillCfg.instance.getNextSkillCfgByLv(lv);
            if (nextSkillCfg) {
                let nextSkillNeedLv: number = nextSkillCfg[xianfu_skillFields.level];
                let nextSkillId: number = nextSkillCfg[xianfu_skillFields.skill];
                let skillCfg: skill = SkillCfg.instance.getCfgById(nextSkillId);
                let skillName: string = skillCfg[skillFields.name];
                let skillLv: number = nextSkillId % 100;
                this.needLvTxt.text = `${nextSkillNeedLv - lv}级`;
                this.skillTxt.text = `【${skillName}】${skillLv}级`;
                CommonUtil.centerChainArr(this.width, [this.tipTxt_0, this.needLvTxt, this.tipTxt_1, this.skillTxt], 5);
            } else {
                this.tipTxt_0.visible = this.needLvTxt.visible = this.tipTxt_1.visible = this.skillTxt.visible = false;
            }
        }

        private setTaskBar(index: number, type: number): void {
            let currCfg: xianfu = XianfuCfg.instance.getCfgByLv(XianfuModel.instance.lv)[0];
            let tasks: Array<XianfuNode> = currCfg[xianfuFields.nodes];
            let maxValue: number = 0;
            let skipId: number;
            for (let i: int = 0, len: int = tasks.length; i < len; i++) {
                if (tasks[i][XianfuNodeFields.type] == type) {
                    maxValue = tasks[i][XianfuNodeFields.value];
                    skipId = tasks[i][XianfuNodeFields.skipId];
                    break;
                }
            }
            let maxStr: string = CommonUtil.bigNumToString(maxValue);
            let str: string;
            if (type == 0) {  //药草值
                str = `累计消耗药草值达到${maxStr}`;
            } else if (type == 1) { //粮食值
                str = `累计消耗粮食值达到${maxStr}`;
            } else if (type == 2) { //任务次数
                str = `完成${maxStr}次家园任务`;
            } else if (type == 3) { //风水值
                str = `家园风水值达到${maxStr}`;
            } else if (type == 4) { //4积累药草值
                str = `累计消耗药草值达到${maxStr}`;
            } else if (type == 5) {//5积累财富值
                str = `累计消耗粮食值达到${maxStr}`;
            }
            let value: number = XianfuModel.instance.treasureInfos(type);
            this._ratioBarArr[index].maxValue = maxValue;
            this._ratioBarArr[index].value = value;
            this._conditonArr[index].text = str;
            this._conditonArr[index].color = value >= maxValue ? "#000000" : "#000000";
            this._flagArr.push([value >= maxValue, skipId]);
            if (this._flag) {
                this._flag = value >= maxValue;
            }
        }

        private buildIcon(id: number): void {
            let str: string;
            if (id == 0) {
                str = `xianfu/btn_xf_hlz.png`;
            } else if (id == 1) {
                str = `xianfu/btn_xf_jbp.png`;
            } else if (id == 2) {
                str = `xianfu/btn_xf_ldl.png`;
            } else if (id == 3) {
                str = `xianfu/btn_xf_lhl.png`;
            } else if (id == 4) {
                str = `xianfu/btn_xf_lhl.png`;
            }
            this.iconImg.skin = str;
        }

        private goBtnHandler(): void {
            if (this._flag) {
                XianfuCtrl.instance.xianfuShengji();
            } else {
                for (let i: int = 0, len: int = this._flagArr.length; i < len; i++) {
                    if (!this._flagArr[i][0]) {
                        if (this._flagArr[i][1]) {
                            WindowManager.instance.openByActionId(this._flagArr[i][1]);
                            return;
                        } else {
                            let cfg:blend = BlendCfg.instance.getCfgById(27019);
                            let string = cfg[blendFields.stringParam];

                            SystemNoticeManager.instance.addNotice(string[0]);
                        }
                    }
                }
            }
        }

        private aboutBtnHandler(): void {
            CommonUtil.alertHelp(20030);
        }

        public destroy(destroyChild: boolean = true): void {
            this._btnClip = this.destroyElement(this._btnClip);
            super.destroy(destroyChild);
        }
    }
}