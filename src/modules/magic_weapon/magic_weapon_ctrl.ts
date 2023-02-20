/** 精灵*/


///<reference path="../func_open/func_open_model.ts"/>


namespace modules.magicWeapon {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetRideInfoReply = Protocols.GetRideInfoReply;
    import UpdateRideInfo = Protocols.UpdateRideInfo;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import FeedRideReply = Protocols.FeedRideReply;
    import RankRideReply = Protocols.RankRideReply;
    import AddRideSkillLevelReply = Protocols.AddRideSkillLevelReply;
    import ChangeRideShowReply = Protocols.ChangeRideShowReply;
    import RiseRideRefineReply = Protocols.RiseRideRefineReply;
    import ChangeRideShowReplyFields = Protocols.ChangeRideShowReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FeedRideReplyFields = Protocols.FeedRideReplyFields;
    import RankRideReplyFields = Protocols.RankRideReplyFields;
    import IllusionModel = modules.illusion.IllusionModel;
    import GetRideInfoReplyFields = Protocols.GetRideInfoReplyFields;
    import UpdateRideInfoFields = Protocols.UpdateRideInfoFields;
    //法阵相关
    import AddRideFazhenReply = Protocols.AddRideFazhenReply;
    import ChangeRideFazhenReply = Protocols.ChangeRideFazhenReply;
    import ChangeRideFazhenReplyFields = Protocols.ChangeRideFazhenReplyFields;
    import CommonUtil = modules.common.CommonUtil;

    export class MagicWeaponCtrl extends BaseCtrl {
        private static _instance: MagicWeaponCtrl;
        public static get instance(): MagicWeaponCtrl {
            return this._instance = this._instance || new MagicWeaponCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            // 获取精灵返回
            Channel.instance.subscribe(SystemClientOpcode.GetRideInfoReply, this, this.getRideInfoReply);
            // 更新精灵信息
            Channel.instance.subscribe(SystemClientOpcode.UpdateRideInfo, this, this.updateRideInfo);
            // 精灵培养返回
            Channel.instance.subscribe(SystemClientOpcode.FeedRideReply, this, this.feedRideReply);
            // 精灵升阶返回
            Channel.instance.subscribe(SystemClientOpcode.RankRideReply, this, this.rankRideReply);
            // 激活、升级技能返回
            Channel.instance.subscribe(SystemClientOpcode.AddRideSkillLevelReply, this, this.addRideSkillLevelReply);
            // 更换升阶外观返回
            Channel.instance.subscribe(SystemClientOpcode.ChangeRideShowReply, this, this.changeRideShowReply);
            // 更换幻化外观返回
            //Channel.instance.subscribe(SystemClientOpcode.ChangeRideMagicShowReply, this, this.changeRideMagicShowReply);
            // 精灵修炼返回
            Channel.instance.subscribe(SystemClientOpcode.RiseRideRefineReply, this, this.riseRideRefineReply);

            //法阵相关
            Channel.instance.subscribe(SystemClientOpcode.AddRideFazhenReply, this, this.magicReply);
            Channel.instance.subscribe(SystemClientOpcode.ChangeRideFazhenReply, this, this.changeMagicReply);

            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.bagUpdateHandler);
            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.bagUpdateHandler);

            this.requsetAllData();
        }

        public requsetAllData(): void {
            FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.rideFeed, UserFeatureOpcode.GetRideInfo);
            this.getRideInfo();
        }

        // 更新背包
        private bagUpdateHandler(): void {
            MagicWeaponModel.instance.checkRedPoint();
            GlobalData.dispatcher.event(CommonEventType.MAGIC_WEAPON_UPDATE);
        }

        // 获取精灵
        public getRideInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetRideInfo, null);
        }

        // 获取精灵返回
        private getRideInfoReply(tuple: GetRideInfoReply): void {
            IllusionModel.instance.rideMagicShowId = tuple[GetRideInfoReplyFields.curShowId];
            MagicWeaponModel.instance.getRideInfoReply(tuple);
        }

        // 更新精灵信息
        private updateRideInfo(tuple: UpdateRideInfo): void {
            IllusionModel.instance.rideMagicShowId = tuple[UpdateRideInfoFields.curShowId];
            MagicWeaponModel.instance.updateRideInfo(tuple);
            //console.log("更新精灵信息..............." + tuple);
        }

        // 精灵培养
        public feedRide(): void {
            Channel.instance.publish(UserFeatureOpcode.FeedRide, null);
        }

        // 精灵培养返回
        private feedRideReply(tuple: FeedRideReply): void {
            //console.log("精灵培养返回............" + tuple);
            let code: number = tuple[FeedRideReplyFields.result];
            if (code === ErrorCode.Success)
                MagicWeaponModel.instance.feedRideReply(tuple);
        }

        // 精灵升阶
        public rankRide(): void {
            if (MagicWeaponModel.instance._bollZiDong) {
                Channel.instance.publish(UserFeatureOpcode.RankRide, [1]);
                // console.log("请求精灵升阶(自动购买)");
            }
            else {
                Channel.instance.publish(UserFeatureOpcode.RankRide, [0]);
                // console.log("请求精灵升阶(无 自动购买)");
            }
        }
        // 精灵升阶返回
        private rankRideReply(tuple: RankRideReply): void {
            //console.log("精灵升阶返回................." + tuple);
            let result: number = tuple[RankRideReplyFields.result];
            if (result === ErrorCode.Success) {
                MagicWeaponModel.instance.rankRideReply(tuple);
                GlobalData.dispatcher.event(CommonEventType.MAGIC_WEAPON_UPDATE);
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
        // 激活、升级技能，skillId
        public addRideSkillLevel(skillId: number, skillType: number): void {
            Channel.instance.publish(UserFeatureOpcode.AddRideSkillLevel, [skillId, skillType]);
        }

        // 激活、升级技能返回
        private addRideSkillLevelReply(tuple: AddRideSkillLevelReply): void {
            // console.log("激活、升级技能返回......................" + tuple);
        }

        // 更换升阶外观
        public changeRideShow(showId: number): void {
            Channel.instance.publish(UserFeatureOpcode.ChangeRideShow, [showId]);
        }

        // 更换升阶外观返回
        private changeRideShowReply(tuple: ChangeRideShowReply): void {
            let code: number = tuple[0];
            if (!code) {
                SystemNoticeManager.instance.addNotice("更换成功");
                IllusionModel.instance.rideMagicShowId = tuple[ChangeRideShowReplyFields.showId];
                GlobalData.dispatcher.event(CommonEventType.MAGIC_WEAPON_UPDATE);
            } else {
                CommonUtil.noticeError(tuple[0]);
            }
        }

        // 更换幻化外观
        /*public changeRideMagicShow(showId:number):void{
            Channel.instance.publish(UserFeatureOpcode.ChangeRideMagicShow, [showId]);
        }*/

        // 更换幻化外观返回
        /*private changeRideMagicShowReply(tuple:ChangeRideMagicShowReply):void{
            /!*console.log("更换幻化外观返回.................." + tuple);*!/
        }*/

        // 精灵修炼（0锐1御2攻3迅）
        public riseRideRefine(type: int): void {
            Channel.instance.publish(UserFeatureOpcode.RiseRideRefine, [type]);
        }

        // 精灵修炼返回
        private riseRideRefineReply(tuple: RiseRideRefineReply): void {

        }


        //法阵幻化相关
        // AddPetFazhen = 0x20d0,			/*激活/升级法阵*/
        // 	ChangePetFazhen = 0x20d1,			/*更换法阵外观*/
        // 激活升级幻化 请求
        public magicLev(value: number): void {
            Channel.instance.publish(UserFeatureOpcode.AddRideFazhen, [value]);
        }

        //更换幻化外观 请求
        public changeMagic(value: number): void {
            Channel.instance.publish(UserFeatureOpcode.ChangeRideFazhen, [value]);
        }

        //幻化 激活/升级 返回
        private magicReply(tuple: AddRideFazhenReply): void {
            // console.log("/幻化 激活/升级 返回:   ", tuple);
            if (!tuple[0]) {
                MagicWeaponModel.instance.popActivateAlert();
                GlobalData.dispatcher.event(CommonEventType.WEAPONFZHUANHUA_UPDATA);
                MagicWeaponModel.instance.huanhuaRedPoint();
            }
            CommonUtil.noticeError(tuple[0]);
        }

        //更换幻化返回
        private changeMagicReply(tuple: ChangeRideFazhenReply): void {
            // console.log("更换幻化返回:   ", tuple);
            CommonUtil.noticeError(tuple[0]);
            if (!tuple[0]) SystemNoticeManager.instance.addNotice("更换成功");
            MagicWeaponModel.instance.fazhenId = tuple[ChangeRideFazhenReplyFields.showId];
            GlobalData.dispatcher.event(CommonEventType.WEAPONFZCHANGE_HUANHUA);
        }


    }
}