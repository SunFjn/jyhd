/** 光环*/


namespace modules.guanghuan {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetGuangHuanInfoReply = Protocols.GetGuangHuanInfoReply;
    import UpdateGuangHuanInfo = Protocols.UpdateGuangHuanInfo;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import FeedGuangHuanReply = Protocols.FeedGuangHuanReply;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import AddGuangHuanSkillLevelReply = Protocols.AddGuangHuanSkillLevelReply;
    import AddGuangHuanMagicShowReply = Protocols.AddGuangHuanMagicShowReply;
    import AddGuangHuanMagicShowReplyFields = Protocols.AddGuangHuanMagicShowReplyFields;
    import FeedGuangHuanReplyFields = Protocols.FeedGuangHuanReplyFields;
    import AddGuangHuanSkillLevelReplyFields = Protocols.AddGuangHuanSkillLevelReplyFields;
    import ChangeGuangHuanMagicShowReply = Protocols.ChangeGuangHuanMagicShowReply;
    import ChangeGuangHuanMagicShowReplyFields = Protocols.ChangeGuangHuanMagicShowReplyFields;
    import AddGuangHuanRefineReply = Protocols.AddGuangHuanRefineReply;
    import AddGuangHuanRefineReplyFields = Protocols.AddGuangHuanRefineReplyFields;
    import UpdateGuangHuanInfoFields = Protocols.UpdateGuangHuanInfoFields;
    import MagicShowInfo = Protocols.MagicShowInfo;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;

    export class GuangHuanCtrl extends BaseCtrl {
        private static _instance: GuangHuanCtrl;
        public static get instance(): GuangHuanCtrl {
            return this._instance = this._instance || new GuangHuanCtrl();
        }

        constructor() {
            super();
        }

        setup(): void {
            //获取更新
            Channel.instance.subscribe(SystemClientOpcode.GetGuangHuanInfoReply, this, this.getGuangHuanInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateGuangHuanInfo, this, this.updateGuangHuanInfo);
            Channel.instance.subscribe(SystemClientOpcode.FeedGuangHuanReply, this, this.feedGuangHuanReply);
            // Channel.instance.subscribe(SystemClientOpcode.AddGuangHuanSkillLevelReply, this, this.addGuangHuanSkillLevelReply);
            Channel.instance.subscribe(SystemClientOpcode.AddGuangHuanMagicShowReply, this, this.addGuangHuanMagicShowReply);
            Channel.instance.subscribe(SystemClientOpcode.ChangeGuangHuanMagicShowReply, this, this.changeGuangHuanMagicShowReply);
            Channel.instance.subscribe(SystemClientOpcode.AddGuangHuanRefineReply, this, this.addGuangHuanRefineReply);

            GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.checkRP);
            GlobalData.dispatcher.on(CommonEventType.BAG_DATA_INITED, this, this.checkRP);
            GlobalData.dispatcher.on(CommonEventType.PLAYER_UPDATE_LEVEL, this, this.checkRP);

           

            this.requsetAllData();
        }
        public requsetAllData() {
            this.getGuangHuanInfo();
            //FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.shenbingFeed, UserFeatureOpcode.GetShenbingInfo);
        }

        // 请求获取光环信息
        public getGuangHuanInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetGuangHuanInfo, null);
        }

        // 获取光环信息返回
        private getGuangHuanInfoReply(value: GetGuangHuanInfoReply): void {
            GuangHuanModel.instance.guangHuanInfo = value;
        }

        // 更新光环信息
        private updateGuangHuanInfo(value: UpdateGuangHuanInfo): void {
            GuangHuanModel.instance.guangHuanInfo = value;
        }

        // 光环升级
        public feedGuangHuan(): void {
            Channel.instance.publish(UserFeatureOpcode.FeedGuangHuan, null);
        }

        // 光环升级返回
        private feedGuangHuanReply(value: FeedGuangHuanReply): void {
            if (!value[0]) SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong4.png");
            CommonUtil.noticeError(value[FeedGuangHuanReplyFields.result]);
        }

        // 激活、升级技能
        public addGuangHuanSkillLevel(skillId: number): void {
            Channel.instance.publish(UserFeatureOpcode.AddGuangHuanSkillLevel, [skillId]);
        }

        // 激活、升级技能返回
        private addGuangHuanSkillLevelReply(value: AddGuangHuanSkillLevelReply): void {
            CommonUtil.noticeError(value[AddGuangHuanSkillLevelReplyFields.result]);
            // if (!value[0]) {
            //     this.updataRedPoint();
            // }
        }

        // 激活、升级幻化
        public addGuangHuanMagicShow(showId: number): void {
            Channel.instance.publish(UserFeatureOpcode.AddGuangHuanMagicShow, [showId]);
            GuangHuanModel.instance.addGuangHuanMagicShowId = showId;
        }

        // 激活、升级幻化返回
        private addGuangHuanMagicShowReply(value: AddGuangHuanMagicShowReply): void {
            let code: number = value[AddGuangHuanMagicShowReplyFields.result];
            if (code === 0) {
                let info: UpdateGuangHuanInfo = GuangHuanModel.instance.guangHuanInfo;
                if (info) {
                    let shows: Array<MagicShowInfo> = info[UpdateGuangHuanInfoFields.showList];
                    for (let i: int = 0, len: int = shows.length; i < len; i++) {
                        let showId: number = GuangHuanModel.instance.addGuangHuanMagicShowId;
                        if (shows[i][MagicShowInfoFields.showId] === showId) {
                            if (shows[i][MagicShowInfoFields.star] === 1) {
                                WindowManager.instance.openDialog(WindowEnum.HUANHUAACT_ALERT, [showId, 12]);
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
        public changeGuangHuanMagicShow(showId: number): void {
            Channel.instance.publish(UserFeatureOpcode.ChangeGuangHuanMagicShow, [showId]);
        }

        // 更换幻化返回
        private changeGuangHuanMagicShowReply(value: ChangeGuangHuanMagicShowReply): void {
            let code: number = value[ChangeGuangHuanMagicShowReplyFields.result];
            if (code === 0) {
                GuangHuanModel.instance.changeMagicShow(value[ChangeGuangHuanMagicShowReplyFields.magicShowId]);
            } else {
                CommonUtil.noticeError(value[ChangeGuangHuanMagicShowReplyFields.result]);
            }
        }

        // 附魂
        public addGuangHuanRefine(type: number): void {
            Channel.instance.publish(UserFeatureOpcode.AddGuangHuanRefine, [type]);
            GuangHuanModel.instance.refineType = type;
        }

        // 附魂返回
        private addGuangHuanRefineReply(value: AddGuangHuanRefineReply): void {
            let code: number = value[AddGuangHuanRefineReplyFields.result];
            if (code === 0) {
                GlobalData.dispatcher.event(CommonEventType.GUANGHUAN_REFINE_SUCCESS);
            } else {
                CommonUtil.noticeError(code);
            }
        }

        //更新红点
        private checkRP(): void {
            GuangHuanModel.instance.checkRP();
        }
    }
}