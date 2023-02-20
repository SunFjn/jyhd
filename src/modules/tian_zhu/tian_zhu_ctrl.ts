/** 时装*/


namespace modules.tianZhu {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetTianZhuInfoReply = Protocols.GetTianZhuInfoReply;
    import UpdateTianZhuInfo = Protocols.UpdateTianZhuInfo;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import FeedTianZhuReply = Protocols.FeedTianZhuReply;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import AddTianZhuSkillLevelReply = Protocols.AddTianZhuSkillLevelReply;
    import AddTianZhuMagicShowReply = Protocols.AddTianZhuMagicShowReply;
    import AddTianZhuMagicShowReplyFields = Protocols.AddTianZhuMagicShowReplyFields;
    import FeedTianZhuReplyFields = Protocols.FeedTianZhuReplyFields;
    import AddTianZhuSkillLevelReplyFields = Protocols.AddTianZhuSkillLevelReplyFields;
    import ChangeTianZhuMagicShowReply = Protocols.ChangeTianZhuMagicShowReply;
    import ChangeTianZhuMagicShowReplyFields = Protocols.ChangeTianZhuMagicShowReplyFields;
    import AddTianZhuRefineReply = Protocols.AddTianZhuRefineReply;
    import AddTianZhuRefineReplyFields = Protocols.AddTianZhuRefineReplyFields;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import UpdateTianZhuInfoFields = Protocols.UpdateTianZhuInfoFields;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;

    export class TianZhuCtrl extends BaseCtrl {
        private static _instance: TianZhuCtrl;
        public static get instance(): TianZhuCtrl {
            return this._instance = this._instance || new TianZhuCtrl();
        }

        constructor() {
            super();
        }

        setup(): void {
            //获取更新
            Channel.instance.subscribe(SystemClientOpcode.GetTianZhuInfoReply, this, this.getTianZhuInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateTianZhuInfo, this, this.updateTianZhuInfo);
            Channel.instance.subscribe(SystemClientOpcode.FeedTianZhuReply, this, this.feedTianZhuReply);
            Channel.instance.subscribe(SystemClientOpcode.AddTianZhuSkillLevelReply, this, this.addTianZhuSkillLevelReply);
            Channel.instance.subscribe(SystemClientOpcode.AddTianZhuMagicShowReply, this, this.addTianZhuMagicShowReply);
            Channel.instance.subscribe(SystemClientOpcode.ChangeTianZhuMagicShowReply, this, this.changeTianZhuMagicShowReply);
            Channel.instance.subscribe(SystemClientOpcode.AddTianZhuRefineReply, this, this.addTianZhuRefineReply);

            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.checkRP);
            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.checkRP);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_UPDATE_LEVEL, this, this.checkRP);

            this.requsetAllData();
        }

        public requsetAllData() {
            this.getTianZhuInfo();
            FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.shenbingFeed, UserFeatureOpcode.GetShenbingInfo);
        }
        // 请求获取时装信息
        public getTianZhuInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetTianZhuInfo, null);
        }

        // 获取时装信息返回
        private getTianZhuInfoReply(value: GetTianZhuInfoReply): void {
            TianZhuModel.instance.tianZhuInfo = value;
        }

        // 更新时装信息
        private updateTianZhuInfo(value: UpdateTianZhuInfo): void {
            TianZhuModel.instance.tianZhuInfo = value;
        }

        // 时装升级
        public feedTianZhu(): void {
            Channel.instance.publish(UserFeatureOpcode.FeedTianZhu, null);
        }

        // 时装升级返回
        private feedTianZhuReply(value: FeedTianZhuReply): void {
            if (!value[0])
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
            CommonUtil.noticeError(value[FeedTianZhuReplyFields.result]);
        }

        // 激活、升级技能
        public addTianZhuSkillLevel(skillId: number): void {
            Channel.instance.publish(UserFeatureOpcode.AddTianZhuSkillLevel, [skillId]);
        }

        // 激活、升级技能返回
        private addTianZhuSkillLevelReply(value: AddTianZhuSkillLevelReply): void {
            CommonUtil.noticeError(value[AddTianZhuSkillLevelReplyFields.result]);
            // if (!value[0]) {
            //     this.updataRedPoint();
            // }
        }

        // 激活、升级幻化
        public addTianZhuMagicShow(showId: number): void {
            Channel.instance.publish(UserFeatureOpcode.AddTianZhuMagicShow, [showId]);
            TianZhuModel.instance.addTianZhuMagicShowId = showId;
        }

        // 激活、升级幻化返回
        private addTianZhuMagicShowReply(value: AddTianZhuMagicShowReply): void {
            let code: number = value[AddTianZhuMagicShowReplyFields.result];
            if (code === 0) {
                let info: UpdateTianZhuInfo = TianZhuModel.instance.tianZhuInfo;
                if (info) {
                    let shows: Array<MagicShowInfo> = info[UpdateTianZhuInfoFields.showList];
                    for (let i: int = 0, len: int = shows.length; i < len; i++) {
                        let showId: number = TianZhuModel.instance.addTianZhuMagicShowId;
                        if (shows[i][MagicShowInfoFields.showId] === showId) {
                            if (shows[i][MagicShowInfoFields.star] === 1) {
                                WindowManager.instance.openDialog(WindowEnum.HUANHUAACT_ALERT, [showId, 10]);
                            } else if (shows[i][MagicShowInfoFields.star] > 1) {
                                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong7.png");
                            }
                            break;
                        }
                    }
                }
            } else {
                CommonUtil.noticeError(code);
            }
        }

        // 更换幻化
        public changeTianZhuMagicShow(showId: number): void {
            Channel.instance.publish(UserFeatureOpcode.ChangeTianZhuMagicShow, [showId]);
        }

        // 更换幻化返回
        private changeTianZhuMagicShowReply(value: ChangeTianZhuMagicShowReply): void {
            let code: number = value[ChangeTianZhuMagicShowReplyFields.result];
            if (code === 0) {
                TianZhuModel.instance.changeMagicShow(value[ChangeTianZhuMagicShowReplyFields.magicShowId]);
            } else {
                CommonUtil.noticeError(value[ChangeTianZhuMagicShowReplyFields.result]);
            }
        }

        // 附魂
        public addTianZhuRefine(type: number): void {
            Channel.instance.publish(UserFeatureOpcode.AddTianZhuRefine, [type]);
            TianZhuModel.instance.refineType = type;
        }

        // 附魂返回
        private addTianZhuRefineReply(value: AddTianZhuRefineReply): void {
            let code: number = value[AddTianZhuRefineReplyFields.result];
            if (code === 0) {
                GlobalData.dispatcher.event(CommonEventType.TIAN_ZHU_REFINE_SUCCESS);
            } else {
                CommonUtil.noticeError(code);
            }
        }

        //更新红点
        private checkRP(): void {
            TianZhuModel.instance.checkRP();
        }
    }
}