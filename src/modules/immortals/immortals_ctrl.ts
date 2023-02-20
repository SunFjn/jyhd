namespace modules.immortals {
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetShenbingInfoReply = Protocols.GetShenbingInfoReply;
    import FeedShenbingReply = Protocols.FeedShenbingReply;
    import AddShenbingSkillLevelReply = Protocols.AddShenbingSkillLevelReply;
    import AddShenbingMagicShowReply = Protocols.AddShenbingMagicShowReply;
    import ChangeShenbingMagicShowReply = Protocols.ChangeShenbingMagicShowReply;
    import AddShenbingRefineReply = Protocols.AddShenbingRefineReply;
    import AddShenbingSkillLevel = Protocols.AddShenbingSkillLevel;
    import AddShenbingMagicShow = Protocols.AddShenbingMagicShow;
    import ChangeMagicShow = Protocols.ChangeMagicShow;
    import RiseRefine = Protocols.RiseRefine;
    import BaseCtrl = modules.core.BaseCtrl;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import ChangeShenbingMagicShowReplyFields = Protocols.ChangeShenbingMagicShowReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CommonUtil = modules.common.CommonUtil;

    export class ImmortalsCtrl extends BaseCtrl {
        private static _instance: ImmortalsCtrl;
        public static get instance(): ImmortalsCtrl {
            return this._instance = this._instance || new ImmortalsCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            //获取更新
            Channel.instance.subscribe(SystemClientOpcode.GetShenbingInfoReply, this, this.updataReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateShenbingInfo, this, this.updataReply);
            Channel.instance.subscribe(SystemClientOpcode.FeedShenbingReply, this, this.feedReply);
            Channel.instance.subscribe(SystemClientOpcode.AddShenbingSkillLevelReply, this, this.skillReply);
            Channel.instance.subscribe(SystemClientOpcode.AddShenbingMagicShowReply, this, this.magicReply);
            Channel.instance.subscribe(SystemClientOpcode.ChangeShenbingMagicShowReply, this, this.changeMagicReply);
            Channel.instance.subscribe(SystemClientOpcode.AddShenbingRefineReply, this, this.refineReply);

            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.updataRedPoint);
            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.updataRedPoint);

           
        
            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetShenbingInfo, null);
            FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.shenbingFeed, UserFeatureOpcode.GetShenbingInfo);
        }


        //更新红点
        private updataRedPoint(): void {
            ImmortalsModel.instance.huanhuaRedPoint();
            ImmortalsModel.instance.fuhunRedPoint();
            ImmortalsModel.instance.shengjiRedPoint();
        }

        //幻武更新
        private updataReply(tuple: GetShenbingInfoReply): void {
            ImmortalsModel.instance.saveData(tuple);
        }

        //幻武升级返回
        private feedReply(tuple: FeedShenbingReply): void {
            if (!tuple[0])
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
            CommonUtil.noticeError(tuple[0]);
            // BagUtil.openLackPropAlert();
        }

        //技能 激活/升级 返回
        private skillReply(tuple: AddShenbingSkillLevelReply): void {
            CommonUtil.noticeError(tuple[0]);
            if (!tuple[0]) {
                GlobalData.dispatcher.event(CommonEventType.SBSHENGJI_UPDATE);
                this.updataRedPoint();
            }
        }

        //幻化 激活/升级 返回
        private magicReply(tuple: AddShenbingMagicShowReply): void {
            if (!tuple[0]) {
                ImmortalsModel.instance.popActivateAlert();
                GlobalData.dispatcher.event(CommonEventType.SBHUANHUA_UPDATA);
                this.updataRedPoint();
            }
            CommonUtil.noticeError(tuple[0]);
        }

        //更换幻化返回
        private changeMagicReply(tuple: ChangeShenbingMagicShowReply): void {
            CommonUtil.noticeError(tuple[0]);
            if (!tuple[0]) SystemNoticeManager.instance.addNotice("更换成功");
            ImmortalsModel.instance.setHuanhuaId(tuple[ChangeShenbingMagicShowReplyFields.magicShowId]);
            GlobalData.dispatcher.event(CommonEventType.SBCHANGE_HUANHUA);
        }

        //修炼返回
        private refineReply(tuple: AddShenbingRefineReply): void {
            CommonUtil.noticeError(tuple[0]);
            if (!tuple[0]) {
                GlobalData.dispatcher.event(CommonEventType.SBFUHUN_UPDATA);
                this.updataRedPoint();
            }
        }

        //升级幻武
        public feedShenbing(): void {
            Channel.instance.publish(UserFeatureOpcode.FeedShenbing, null);
        }

        //激活升级技能
        public skillLev(value: AddShenbingSkillLevel): void {
            Channel.instance.publish(UserFeatureOpcode.AddShenbingSkillLevel, value);
        }

        //激活升级幻化
        public magicLev(value: AddShenbingMagicShow): void {
            Channel.instance.publish(UserFeatureOpcode.AddShenbingMagicShow, value);
        }

        //更换幻化外观
        public changeMagic(value: ChangeMagicShow): void {
            Channel.instance.publish(UserFeatureOpcode.ChangeShenbingMagicShow, value);
        }

        //升级修炼
        public refineLev(value: RiseRefine): void {
            Channel.instance.publish(UserFeatureOpcode.AddShenbingRefine, value);
        }


    }
}