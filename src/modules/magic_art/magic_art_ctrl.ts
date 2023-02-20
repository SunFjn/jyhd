/**仙灵控制器 */


///<reference path="../bag/bag_util.ts"/>

namespace modules.magicArt {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetSkillsReply = Protocols.GetSkillsReply;
    import UpdateSkill = Protocols.UpdateSkill;
    import AddSkill = Protocols.AddSkill;
    import CommonUtil = modules.common.CommonUtil;
    import AddSkillLevelReply = Protocols.AddSkillLevelReply;
    import AddSkillLevelOfAllReply = Protocols.AddSkillLevelOfAllReply;
    //import OpenSkillReply = Protocols.OpenSkillReply;
    import AddSkillFields = Protocols.AddSkillFields;
    import skillTrain = Configuration.skillTrain;
    import SkillTrainCfg = modules.config.SkillTrainCfg;
    import skillTrainFields = Configuration.skillTrainFields;

    export class MagicArtCtrl extends BaseCtrl {
        private constructor() {
            super();
        }

        private static _instance: MagicArtCtrl;

        public static get instance(): MagicArtCtrl {
            return this._instance = this._instance || new MagicArtCtrl();
        }

        public setup(): void {
            // 技能信息获取
            Channel.instance.subscribe(SystemClientOpcode.GetSkillsReply, this, this.getSkillsReply);
            // 技能信息更新
            Channel.instance.subscribe(SystemClientOpcode.UpdateSkill, this, this.updateSkill);
            // 增加技能
            Channel.instance.subscribe(SystemClientOpcode.AddSkill, this, this.addSkill);
            // 技能升级返回
            Channel.instance.subscribe(SystemClientOpcode.AddSkillLevelReply, this, this.addSkillLevelReply);
            // 一键升级返回
            Channel.instance.subscribe(SystemClientOpcode.AddSkillLevelOfAllReply, this, this.addSkillLevelOfAllReply);
            //激活技能返回
            //Channel.instance.subscribe(SystemClientOpcode.OpenSkillReply,this, this.openSkillReply);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_UPDATE_ZQ, this, this.redPointControl);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.openFunc);
            GlobalData.dispatcher.on(CommonEventType.UPDATE_AMULET_INFO_REPLAY, this, this.setMaxLevel);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            this.getActorSkillInfo();
        }

        // 获取技能信息
        public getActorSkillInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetSkills, null);
        }

        //设置最大等级
        public setMaxLevel(): void {
            MagicArtModel.instance.updateMaxLevel();
        }

        //大模块的红点
        private redPointControl(): void {
            MagicArtModel.instance.checkHaveRedPoint();
        }

        //功能开启时进行一次红点判断
        private openFunc(value: Array<number>): void {
            if (value && value.length > 0) {
                for (let i = 0; i < value.length; i++) {
                    if (value[i] == ActionOpenId.skill) {
                        this.redPointControl();
                    }
                }
            }
        }

        // 返回技能信息
        private getSkillsReply(tuple: GetSkillsReply): void {
            MagicArtModel.instance.dataInit(tuple);
            this.redPointControl();
        }

        // 更新技能信息
        private updateSkill(tuple: UpdateSkill): void {
            MagicArtModel.instance.updateSkill(tuple);
            this.redPointControl();
        }

        //增加技能,弹窗
        private addSkill(tuple: AddSkill): void {
            let cfg:skillTrain = SkillTrainCfg.instance.getScienceCfgById(tuple[AddSkillFields.skillId] * 10000 + 1);
            if(cfg && cfg[skillTrainFields.type] === 999) return;      // 999为辅助装备技能，不弹框提示
            WindowManager.instance.open(WindowEnum.MAGIC_ART_GET_PANEL, tuple[AddSkillFields.skillId]);
        }

        //技能升级返回
        private addSkillLevelReply(tuple: AddSkillLevelReply): void {
            let result = tuple[Protocols.AddSkillLevelReplyFields.result];
            if (result != 0) {
                if (result == 12803) {

                } else {
                    CommonUtil.noticeError(result);
                }
            } else {
                // this.redPointControl();
            }
        }

        //一键升级返回
        private addSkillLevelOfAllReply(tuple: AddSkillLevelOfAllReply): void {
            let result = tuple[Protocols.AddSkillLevelOfAllReplyFields.result];
            if (result != 0) {
                if (result == 12803) {
                } else {
                    CommonUtil.noticeError(result);
                }
            } else {
                // this.redPointControl();
            }
        }

        //激活技能返回,激活成功弹窗
        // private openSkillReply(tuple: OpenSkillReply): void {
        //     let result = tuple[Protocols.OpenSkillReplyFields.result];
        //     if (result != 0)
        //         CommonUtil.noticeError(result);
        //     else
        //         WindowManager.instance.openDialog(WindowEnum.MAGIC_ART_ALERT, MagicArtModel.instance._openSkill);
        // }

        /**
         * 请求技能激活
         */
        // public openSkill(id: number): void {
        //     Channel.instance.publish(UserFeatureOpcode.OpenSkill, [id]);
        // }

        /**
         * 请求技能升级
         */
        public addSkillLevel(id: number): void {
            Channel.instance.publish(UserFeatureOpcode.AddSkillLevel, [id]);
        }

        /**
         * 请求技能一键升级
         */
        public addSkillLevelOfAll(): void {
            Channel.instance.publish(UserFeatureOpcode.AddSkillLevelOfAll, null);
        }
    }
}