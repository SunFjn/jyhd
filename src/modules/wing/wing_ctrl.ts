namespace modules.wing {
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import ChangeMagicShow = Protocols.ChangeMagicShow;
    import BaseCtrl = modules.core.BaseCtrl;
    import GetWingInfoReply = Protocols.GetWingInfoReply;
    import FeedWingReply = Protocols.FeedWingReply;
    import AddWingSkillLevelReply = Protocols.AddWingSkillLevelReply;
    import AddWingMagicShowReply = Protocols.AddWingMagicShowReply;
    import ChangeWingMagicShowReply = Protocols.ChangeWingMagicShowReply;
    import AddWingRefineReply = Protocols.AddWingRefineReply;
    import AddWingSkillLevel = Protocols.AddWingSkillLevel;
    import AddWingMagicShow = Protocols.AddWingMagicShow;
    import AddWingRefine = Protocols.AddWingRefine;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import ChangeWingMagicShowReplyFields = Protocols.ChangeWingMagicShowReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CommonUtil = modules.common.CommonUtil;

    export class WingCtrl extends BaseCtrl {
        private static _instance: WingCtrl;
        public static get instance(): WingCtrl {
            return this._instance = this._instance || new WingCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            //获取更新
            Channel.instance.subscribe(SystemClientOpcode.GetWingInfoReply, this, this.updataReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateWingInfo, this, this.updataReply);
            Channel.instance.subscribe(SystemClientOpcode.FeedWingReply, this, this.feedReply);
            Channel.instance.subscribe(SystemClientOpcode.AddWingSkillLevelReply, this, this.skillReply);
            Channel.instance.subscribe(SystemClientOpcode.AddWingMagicShowReply, this, this.magicReply);
            Channel.instance.subscribe(SystemClientOpcode.ChangeWingMagicShowReply, this, this.changeMagicReply);
            Channel.instance.subscribe(SystemClientOpcode.AddWingRefineReply, this, this.refineReply);

            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.updataRedPoint);
            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.updataRedPoint);

            this.requsetAllData();
        }
        
        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetWingInfo, null);
        }

        //更新红点
        private updataRedPoint(): void {
            WingModel.instance.huanhuaRedPoint();
            WingModel.instance.fuhunRedPoint();
            WingModel.instance.shengjiRedPoint();
        }

        //翅膀更新
        private updataReply(tuple: GetWingInfoReply): void {
            WingModel.instance.saveData(tuple);
        }

        //翅膀升级返回
        private feedReply(tuple: FeedWingReply): void {
            if (!tuple[0])
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
            CommonUtil.noticeError(tuple[0]);
        }

        //技能 激活/升级 返回
        private skillReply(tuple: AddWingSkillLevelReply): void {
            CommonUtil.noticeError(tuple[0]);
            if (!tuple[0]) {
                GlobalData.dispatcher.event(CommonEventType.XYSHENGJI_UPDATE);
                this.updataRedPoint();
            }
        }

        //幻化 激活/升级 返回
        private magicReply(tuple: AddWingMagicShowReply): void {
            if (!tuple[0]) {
                WingModel.instance.popActivateAlert();
                GlobalData.dispatcher.event(CommonEventType.XYHUANHUA_UPDATA);
                this.updataRedPoint();
            }
            CommonUtil.noticeError(tuple[0]);
        }

        //更换幻化返回
        private changeMagicReply(tuple: ChangeWingMagicShowReply): void {
            CommonUtil.noticeError(tuple[0]);
            if (!tuple[0]) SystemNoticeManager.instance.addNotice("更换成功");
            WingModel.instance.setHuanhuaId(tuple[ChangeWingMagicShowReplyFields.magicShowId]);
        }

        //修炼返回
        private refineReply(tuple: AddWingRefineReply): void {
            CommonUtil.noticeError(tuple[0]);
            if (!tuple[0]) {
                GlobalData.dispatcher.event(CommonEventType.XYFUHUN_UPDATA);
                this.updataRedPoint();
            }
        }

        //升级幻武
        public feedShenbing(): void {
            Channel.instance.publish(UserFeatureOpcode.FeedWing, null);
        }

        //激活升级技能
        public skillLev(value: AddWingSkillLevel): void {
            Channel.instance.publish(UserFeatureOpcode.AddWingSkillLevel, value);
        }

        //激活升级幻化
        public magicLev(value: AddWingMagicShow): void {
            Channel.instance.publish(UserFeatureOpcode.AddWingMagicShow, value);
        }

        //更换幻化外观
        public changeMagic(value: ChangeMagicShow): void {
            Channel.instance.publish(UserFeatureOpcode.ChangeWingMagicShow, value);
        }

        //升级修炼
        public refineLev(value: AddWingRefine): void {
            Channel.instance.publish(UserFeatureOpcode.AddWingRefine, value);
        }


    }
}