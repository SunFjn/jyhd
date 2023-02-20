namespace modules.rune_copy {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import UpdateRuneCopy = Protocols.UpdateRuneCopy;
    import GetRuneEveryDayAwardReply = Protocols.GetRuneEveryDayAwardReply;
    import UpdateRuneDial = Protocols.UpdateRuneDial;
    import StartRuneDialReply = Protocols.StartRuneDialReply;
    import StartRuneDialReplyFields = Protocols.StartRuneDialReplyFields;
    import GetRuneEveryDayAwardReplyFields = Protocols.GetRuneEveryDayAwardReplyFields;
    import CommonUtil = modules.common.CommonUtil;

    export class RuneCopyCtrl extends BaseCtrl {
        private static _instance: RuneCopyCtrl;
        public static get instance(): RuneCopyCtrl {
            return this._instance = this._instance || new RuneCopyCtrl();
        }

        public setup(): void {

            Channel.instance.subscribe(SystemClientOpcode.GetCopyRuneReply, this, this.updateRuneCopy);
            Channel.instance.subscribe(SystemClientOpcode.UpdateRuneCopy, this, this.updateRuneCopy);
            Channel.instance.subscribe(SystemClientOpcode.GetRuneEveryDayAwardReply, this, this.getRuneEveryDayAwardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetRuneDialReply, this, this.updateRuneDial);
            Channel.instance.subscribe(SystemClientOpcode.UpdateRuneDial, this, this.updateRuneDial);
            Channel.instance.subscribe(SystemClientOpcode.StartRuneDialReply, this, this.startRuneDialReply);

            GlobalData.dispatcher.on(CommonEventType.PLAYER_UPDATE_FIGHT, RuneCopyModel.instance, RuneCopyModel.instance.checkRP);
        
            this.requsetAllData();
        }

        public requsetAllData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetCopyRune, null);
            Channel.instance.publish(UserFeatureOpcode.GetRuneDial, null);
        }

        //更新未央幻境层数和奖励返回
        private updateRuneCopy(tuple: UpdateRuneCopy): void {
            RuneCopyModel.instance.saveDate(tuple);
        }

        //领取未央幻境副本每日奖励
        public getRuneEveryDayAward(): void {
            Channel.instance.publish(UserFeatureOpcode.GetRuneEveryDayAward, null);
        }

        //领取未央幻境副本每日奖励返回
        private getRuneEveryDayAwardReply(tuple: GetRuneEveryDayAwardReply): void {
            CommonUtil.noticeError(tuple[GetRuneEveryDayAwardReplyFields.result]);
        }

        //开始抽奖
        public startRuneDial(): void {
            Channel.instance.publish(UserFeatureOpcode.StartRuneDial, null);
        }

        //更新未央幻境转盘回复
        private updateRuneDial(tuple: UpdateRuneDial): void {
            RuneCopyModel.instance.updateRuneDial(tuple);
        }

        //开奖结果
        private startRuneDialReply(tuple: StartRuneDialReply): void {
            if (!tuple[StartRuneDialReplyFields.result]) {
                RuneCopyModel.instance.dialResult = tuple[StartRuneDialReplyFields.index];
            } else {
                CommonUtil.noticeError(tuple[StartRuneDialReplyFields.result]);
            }
        }
    }
}