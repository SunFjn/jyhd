namespace modules.exercise {

    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetLilianInfoReply = Protocols.GetLilianInfoReply;
    import UpdateLilianTask = Protocols.UpdateLilianTask;
    import GetLilianTaskAwardReply = Protocols.GetLilianTaskAwardReply;
    import GetLilianDayAwardReply = Protocols.GetLilianDayAwardReply;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CommonUtil = modules.common.CommonUtil;

    export class ExerciseCrtl extends BaseCtrl {

        private static _instance: ExerciseCrtl;
        public static get instance(): ExerciseCrtl {
            return this._instance = this._instance || new ExerciseCrtl();
        }

        public setup(): void {

            //获取更新
            Channel.instance.subscribe(SystemClientOpcode.GetLilianInfoReply, this, this.updataReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateLilianAll, this, this.updataReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateLilianTask, this, this.updataTask);
            Channel.instance.subscribe(SystemClientOpcode.GetLilianTaskAwardReply, this, this.LLTaskAward);
            Channel.instance.subscribe(SystemClientOpcode.GetLilianDayAwardReply, this, this.LLDayAward);

            this.requsetAllData();
        }

        public requsetAllData(): void {
            this.getLilianInfo();
        }

        private getLilianInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetLilianInfo, null);
        }

        private updataReply(tuple: GetLilianInfoReply): void {
            ExerciseModel.instance.saveData(tuple);
        }

        private updataTask(tuple: UpdateLilianTask): void {
            ExerciseModel.instance.saveTaskData(tuple);
        }

        //领取历练任务返回
        private LLTaskAward(tuple: GetLilianTaskAwardReply): void {
            if (tuple[0])
                CommonUtil.noticeError(tuple[0]);
            else {
                GlobalData.dispatcher.event(CommonEventType.LILIAN_UPDATA_TASK_LIST);
                ExerciseModel.instance.setDotDis();
            }
        }

        //领取历练日返回
        private LLDayAward(tuple: GetLilianDayAwardReply): void {
            if (tuple[0])
                CommonUtil.noticeError(tuple[0]);
            else {
                SystemNoticeManager.instance.addNotice("领取成功");
                ExerciseModel.instance.setDotDis();
            }
        }

        //领取历练任务奖励
        public getLiLianTaskAward(id: int): void {
            Channel.instance.publish(UserFeatureOpcode.GetLilianTaskAward, [id]);
        }

        //领取历练日奖励
        public getLiLianDayAward(): void {
            Channel.instance.publish(UserFeatureOpcode.GetLilianDayAward, null);
        }


    }
}