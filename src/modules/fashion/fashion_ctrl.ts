/** 时装*/


namespace modules.fashion {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetFashionInfoReply = Protocols.GetFashionInfoReply;
    import UpdateFashionInfo = Protocols.UpdateFashionInfo;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import FeedFashionReply = Protocols.FeedFashionReply;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import AddFashionSkillLevelReply = Protocols.AddFashionSkillLevelReply;
    import AddFashionMagicShowReply = Protocols.AddFashionMagicShowReply;
    import AddFashionMagicShowReplyFields = Protocols.AddFashionMagicShowReplyFields;
    import FeedFashionReplyFields = Protocols.FeedFashionReplyFields;
    import AddFashionSkillLevelReplyFields = Protocols.AddFashionSkillLevelReplyFields;
    import ChangeFashionMagicShowReply = Protocols.ChangeFashionMagicShowReply;
    import ChangeFashionMagicShowReplyFields = Protocols.ChangeFashionMagicShowReplyFields;
    import AddFashionRefineReply = Protocols.AddFashionRefineReply;
    import AddFashionRefineReplyFields = Protocols.AddFashionRefineReplyFields;
    import UpdateFashionInfoFields = Protocols.UpdateFashionInfoFields;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;

    export class FashionCtrl extends BaseCtrl {
        private static _instance: FashionCtrl;
        public static get instance(): FashionCtrl {
            return this._instance = this._instance || new FashionCtrl();
        }

        constructor() {
            super();
        }

        setup(): void {
            //获取更新
            Channel.instance.subscribe(SystemClientOpcode.GetFashionInfoReply, this, this.getFashionInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateFashionInfo, this, this.updateFashionInfo);
            Channel.instance.subscribe(SystemClientOpcode.FeedFashionReply, this, this.feedFashionReply);
            Channel.instance.subscribe(SystemClientOpcode.AddFashionSkillLevelReply, this, this.addFashionSkillLevelReply);
            Channel.instance.subscribe(SystemClientOpcode.AddFashionMagicShowReply, this, this.addFashionMagicShowReply);
            Channel.instance.subscribe(SystemClientOpcode.ChangeFashionMagicShowReply, this, this.changeFashionMagicShowReply);
            Channel.instance.subscribe(SystemClientOpcode.AddFashionRefineReply, this, this.addFashionRefineReply);

            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.checkRP);
            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.checkRP);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_UPDATE_LEVEL, this, this.checkRP);

           

            this.requsetAllData();
        }
        public requsetAllData() {
            this.getFashionInfo();
            FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.shenbingFeed, UserFeatureOpcode.GetShenbingInfo);
        }

        // 请求获取时装信息
        public getFashionInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetFashionInfo, null);
        }

        // 获取时装信息返回
        private getFashionInfoReply(value: GetFashionInfoReply): void {
            FashionModel.instance.fashionInfo = value;
        }

        // 更新时装信息
        private updateFashionInfo(value: UpdateFashionInfo): void {
            FashionModel.instance.fashionInfo = value;
        }

        // 时装升级
        public feedFashion(): void {
            Channel.instance.publish(UserFeatureOpcode.FeedFashion, null);
        }

        // 时装升级返回
        private feedFashionReply(value: FeedFashionReply): void {
            if (!value[0])
                SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
            CommonUtil.noticeError(value[FeedFashionReplyFields.result]);
        }

        // 激活、升级技能
        public addFashionSkillLevel(skillId: number): void {
            Channel.instance.publish(UserFeatureOpcode.AddFashionSkillLevel, [skillId]);
        }

        // 激活、升级技能返回
        private addFashionSkillLevelReply(value: AddFashionSkillLevelReply): void {
            CommonUtil.noticeError(value[AddFashionSkillLevelReplyFields.result]);
            // if (!value[0]) {
            //     this.updataRedPoint();
            // }
        }

        // 激活、升级幻化
        public addFashionMagicShow(showId: number): void {
            Channel.instance.publish(UserFeatureOpcode.AddFashionMagicShow, [showId]);
            FashionModel.instance.addFashionMagicShowId = showId;
        }

        // 激活、升级幻化返回
        private addFashionMagicShowReply(value: AddFashionMagicShowReply): void {
            let code: number = value[AddFashionMagicShowReplyFields.result];
            if (code === 0) {
                let info: UpdateFashionInfo = FashionModel.instance.fashionInfo;
                if (info) {
                    let shows: Array<MagicShowInfo> = info[UpdateFashionInfoFields.showList];
                    for (let i: int = 0, len: int = shows.length; i < len; i++) {
                        let showId: number = FashionModel.instance.addFashionMagicShowId;
                        if (shows[i][MagicShowInfoFields.showId] === showId) {
                            if (shows[i][MagicShowInfoFields.star] === 1) {
                                WindowManager.instance.openDialog(WindowEnum.HUANHUAACT_ALERT, [showId + PlayerModel.instance.occ, 9]);
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
        public changeFashionMagicShow(showId: number): void {
            Channel.instance.publish(UserFeatureOpcode.ChangeFashionMagicShow, [showId]);
        }

        // 更换幻化返回
        private changeFashionMagicShowReply(value: ChangeFashionMagicShowReply): void {
            let code: number = value[ChangeFashionMagicShowReplyFields.result];
            if (code === 0) {
                FashionModel.instance.changeMagicShow(value[ChangeFashionMagicShowReplyFields.magicShowId]);
            } else {
                CommonUtil.noticeError(value[ChangeFashionMagicShowReplyFields.result]);
            }
        }

        // 附魂
        public addFashionRefine(type: number): void {
            Channel.instance.publish(UserFeatureOpcode.AddFashionRefine, [type]);
            FashionModel.instance.refineType = type;
        }

        // 附魂返回
        private addFashionRefineReply(value: AddFashionRefineReply): void {
            let code: number = value[AddFashionRefineReplyFields.result];
            if (code === 0) {
                GlobalData.dispatcher.event(CommonEventType.FASHION_REFINE_SUCCESS);
            } else {
                CommonUtil.noticeError(code);
            }
        }

        //更新红点
        private checkRP(): void {
            FashionModel.instance.checkRP();
        }
    }
}