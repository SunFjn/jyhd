/////<reference path="../$.ts"/>
/** 开服冲榜 */
namespace modules.sprint_rank {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GetSprintRankTaskRewardReplyFields = Protocols.GetSprintRankTaskRewardReplyFields;
    import GetSprintRankTaskInfoReply = Protocols.GetSprintRankTaskInfoReply;
    import UpdateSprintRankTaskInfo = Protocols.UpdateSprintRankTaskInfo;
    import GetSprintRankTaskRewardReply = Protocols.GetSprintRankTaskRewardReply;

    export class SprintRankTaskCtrl extends BaseCtrl {
        private static _instance: SprintRankTaskCtrl;
        public static get instance(): SprintRankTaskCtrl {
            return this._instance = this._instance || new SprintRankTaskCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {

            Channel.instance.subscribe(SystemClientOpcode.GetSprintRankTaskInfoReply, this, this.getdateSprintRankInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateSprintRankTaskInfo, this, this.updateSprintRankInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetSprintRankTaskRewardReply, this, this.getSprintRankRewardReply);

            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenGetSprintRankInfo);
            this.requsetAllData();

        }
        public requsetAllData() {
            Channel.instance.publish(UserFeatureOpcode.GetSprintRankTaskInfo, null);
        }

        //开服冲榜获取信息返回
        private getdateSprintRankInfoReply(tuple: GetSprintRankTaskInfoReply) {
            SprintRankTaskModel.instance.getInfo(tuple);
        }

        //更新信息
        private updateSprintRankInfo(tuple: UpdateSprintRankTaskInfo) {
            SprintRankTaskModel.instance.updateInfo(tuple);
        }

        //领取奖励返回
        private getSprintRankRewardReply(tuple: GetSprintRankTaskRewardReply) {
            if (tuple[GetSprintRankTaskRewardReplyFields.result]) {

            } else {
                SystemNoticeManager.instance.addNotice("领取成功");
            }
        }

        //领取奖励
        public getSprintRankRewar(): void {
            Channel.instance.publish(UserFeatureOpcode.GetSprintRankTaskReward, null);
        }

        //获取数据
        public getSprintRankInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetSprintRankTaskInfo, null);
        }

        //获取数据
        public funOpenGetSprintRankInfo(ID: Array<number>): void {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.sprintRank) {
                    // let funcState: int = FuncOpenModel.instance.getFuncStateById(ActionOpenId.sprintRank);
                    // if (funcState === ActionOpenState.open || funcState === ActionOpenState.close || funcState === ActionOpenState.show) {
                    // Channel.instance.publish(UserFeatureOpcode.GetSprintRankTaskInfo, null);
                    SprintRankTaskCtrl.instance.getSprintRankInfo();
                    SprintRankCtrl.instance.getSprintRankAllInfo();
                    return;
                    // }
                }
            }

        }

    }
}