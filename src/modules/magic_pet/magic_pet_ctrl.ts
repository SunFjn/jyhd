/**
 * 宠物控制器
 * */


namespace modules.magicPet {
    import CommonUtil = modules.common.CommonUtil;
    import BaseCtrl = modules.core.BaseCtrl;
    import AddPetSkillLevelReply = Protocols.AddPetSkillLevelReply;
    import GetPetInfoReply = Protocols.GetPetInfoReply;
    import GetPetInfoReplyFields = Protocols.GetPetInfoReplyFields;
    import RiseRefineReplyFields = Protocols.RiseRefineReplyFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import ChangePetShowReply = Protocols.ChangePetShowReply;
    import ChangePetShowReplyFields = Protocols.ChangePetShowReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import IllusionModel = modules.illusion.IllusionModel;

    import AddPetFazhenReply = Protocols.AddPetFazhenReply;
    import ChangePetFazhenReply = Protocols.ChangePetFazhenReply;
    import ChangePetFazhenReplyFields = Protocols.ChangePetFazhenReplyFields;

    export class MagicPetCtrl extends BaseCtrl {
        private static _instance: MagicPetCtrl;

        public static get instance(): MagicPetCtrl {
            return this._instance = this._instance || new MagicPetCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            // 订阅宠物
            Channel.instance.subscribe(SystemClientOpcode.GetPetInfoReply, this, this.getPetInfoReply);
            // 订阅培养
            Channel.instance.subscribe(SystemClientOpcode.FeedPetReply, this, this.feedPetReply);
            // 订阅进阶
            Channel.instance.subscribe(SystemClientOpcode.RankPetReply, this, this.rankPetReply);
            // 订阅修炼
            Channel.instance.subscribe(SystemClientOpcode.RiseRefineReply, this, this.riseRefinePetReply);
            // 订阅宠物更新
            Channel.instance.subscribe(SystemClientOpcode.UpdatePetInfo, this, this.updatePet);
            // 订阅技能升级
            Channel.instance.subscribe(SystemClientOpcode.AddPetSkillLevelReply, this, this.skillUpReply);
            // 更换宠物外观返回
            Channel.instance.subscribe(SystemClientOpcode.ChangePetShowReply, this, this.changePetShowReply);
            //法阵相关
            Channel.instance.subscribe(SystemClientOpcode.AddPetFazhenReply, this, this.magicReply);
            Channel.instance.subscribe(SystemClientOpcode.ChangePetFazhenReply, this, this.changeMagicReply);

            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.bagUpdateHandler);
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.bagUpdateHandler);

          

            this.requsetAllData();
        }

        public requsetAllData(): void {
            this.getPetInfo();
            FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.petFeed, UserFeatureOpcode.GetPetInfo);
        }

        // 获取宠物信息
        public getPetInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetPetInfo, null);
        }

        // 返回宠物信息
        private getPetInfoReply(tuple: GetPetInfoReply): void {
            IllusionModel.instance.magicShowId = tuple[GetPetInfoReplyFields.curShowId];
            MagicPetModel.instance.dataInit(
                tuple[GetPetInfoReplyFields.feed],
                tuple[GetPetInfoReplyFields.rank],
                tuple[GetPetInfoReplyFields.refine],
                tuple[GetPetInfoReplyFields.fazhen], tuple[GetPetInfoReplyFields.magicShow]);
            // console.log("获取宠物信息返回................." + tuple);
        }

        // 宠物更新
        private updatePet(tuple: Protocols.UpdatePetInfo): void {
            IllusionModel.instance.magicShowId = tuple[Protocols.UpdatePetInfoFields.curShowId];
            MagicPetModel.instance.updatePetInfo(tuple);
            // console.log("宠物更新。。。。。。。。。" + tuple);
        }

        // 请求宠物培养
        public feedPet(): void {
            Channel.instance.publish(UserFeatureOpcode.FeedPet, null);
        }

        // 返回宠物培养
        private feedPetReply(tuple: Protocols.FeedPetReply): void {
            let result = tuple[Protocols.FeedPetReplyFields.result];
            if (result != ErrorCode.Success)
                CommonUtil.noticeError(result);
            else
                MagicPetModel.instance.feedPet(tuple[Protocols.FeedPetReplyFields.level], tuple[Protocols.FeedPetReplyFields.exp]);
        }

        // 请求宠物进阶
        public rankPet(): void {
            if (MagicPetModel.instance._bollZiDong) {
                Channel.instance.publish(UserFeatureOpcode.RankPet, [1]);
                // console.log("请求宠物进阶(自动购买)");
            }
            else {
                Channel.instance.publish(UserFeatureOpcode.RankPet, [0]);
                // console.log("请求宠物进阶(无 自动购买)");
            }
        }

        // 返回宠物进阶
        private rankPetReply(tuple: Protocols.RankPetReply): void {
            let result = tuple[Protocols.RankPetReplyFields.result];
            if (result === 0) {
                MagicPetModel.instance.rankPet(tuple);
            }
            else {
                if (result == ErrorCode.goldNotEnough) {       
                    CommonUtil.goldNotEnoughAlert();
                }
                else {
                    CommonUtil.noticeError(result);
                }
            }
        }
        private openRecharge(): void {
            WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
        }
        // 请求宠物修炼
        public riseRefinePet(type: number): void {
            Channel.instance.publish(UserFeatureOpcode.RiseRefine, [type]);
        }

        // 返回宠物修炼
        private riseRefinePetReply(tuple: Protocols.RiseRefineReply): void {
            let result: number = tuple[RiseRefineReplyFields.result];
            if (result === 0) {
                MagicPetModel.instance.refinePet(tuple[RiseRefineReplyFields.result]);
            } else {
                CommonUtil.noticeError(result);
            }
        }

        // 升级技能
        public skillUp(skillId: number, skillType: number): void {
            Channel.instance.publish(UserFeatureOpcode.AddPetSkillLevel, [skillId, skillType]);
            //console.log("发送技能升级 " + [skillId, skillType]);
        }

        // 升级技能返回
        private skillUpReply(tuple: AddPetSkillLevelReply): void {
            // let code:number = tuple[AddPetSkillLevelReplyFields.result];
            // if(code === 0){
            //
            // }
        }

        // 更换升阶外观
        public changePetShow(showId: number): void {
            Channel.instance.publish(UserFeatureOpcode.ChangePetShow, [showId]);
        }

        // 更换外观返回
        public changePetShowReply(value: ChangePetShowReply): void {
            let code: number = value[ChangePetShowReplyFields.result];
            //GlobalData.dispatcher.event(CommonEventType.MAGIC_PET_RANK_SHOWID);
            CommonUtil.noticeError(code);
            if (!value[0]) {
                SystemNoticeManager.instance.addNotice("更换成功");
                IllusionModel.instance.magicShowId = value[ChangePetShowReplyFields.showId];
                GlobalData.dispatcher.event(CommonEventType.MAGIC_PET_UPDATE);
            }
        }

        // 更新背包
        private bagUpdateHandler(): void {
            MagicPetModel.instance.checkRedPoint();
            GlobalData.dispatcher.event(CommonEventType.MAGIC_PET_UPDATE);
        }

        //法阵幻化相关
        // AddPetFazhen = 0x20d0,			/*激活/升级法阵*/
        // 	ChangePetFazhen = 0x20d1,			/*更换法阵外观*/
        //激活升级幻化 请求
        public magicLev(value: number): void {
            Channel.instance.publish(UserFeatureOpcode.AddPetFazhen, [value]);
        }

        //更换幻化外观 请求
        public changeMagic(value: number): void {
            Channel.instance.publish(UserFeatureOpcode.ChangePetFazhen, [value]);
        }

        //幻化 激活/升级 返回
        private magicReply(tuple: AddPetFazhenReply): void {
            // console.log("/幻化 激活/升级 返回:   ", tuple);
            if (!tuple[0]) {
                MagicPetModel.instance.popActivateAlert();
                GlobalData.dispatcher.event(CommonEventType.FZHUANHUA_UPDATA);
                MagicPetModel.instance.huanhuaRedPoint();
            }
            else {
                CommonUtil.noticeError(tuple[0]);
            }

        }

        //更换幻化返回
        private changeMagicReply(tuple: ChangePetFazhenReply): void {
            // console.log("更换幻化返回:   ", tuple);
            CommonUtil.noticeError(tuple[0]);
            if (!tuple[0]) SystemNoticeManager.instance.addNotice("更换成功");
            MagicPetModel.instance.fazhenId = tuple[ChangePetFazhenReplyFields.showId];
            GlobalData.dispatcher.event(CommonEventType.FZCHANGE_HUANHUA);
        }
    }
}