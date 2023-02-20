/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.gushen {
    import BaseCtrl = modules.core.BaseCtrl;
    import UpdateGushenInfo = Protocols.UpdateGushenInfo;
    import GetGushenInfoReply = Protocols.GetGushenInfoReply;
    import GetGushenTaskRewardReply = Protocols.GetGushenTaskRewardReply;
    import GetGushenActiveRewardReply = Protocols.GetGushenActiveRewardReply;
    import GetGushenTaskRewardReplyFields = Protocols.GetGushenTaskRewardReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import GetGushenActiveRewardReplyFields = Protocols.GetGushenActiveRewardReplyFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetGushenTaskReward = Protocols.GetGushenTaskReward;
    import GetGushenActiveReward = Protocols.GetGushenActiveReward;

    export class GushenCtrl extends BaseCtrl {
        private static _instance: GushenCtrl;
        public static get instance(): GushenCtrl {
            return this._instance = this._instance || new GushenCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {

            Channel.instance.subscribe(SystemClientOpcode.GetGushenInfoReply, this, this.getGushenInfo);
            Channel.instance.subscribe(SystemClientOpcode.UpdateGushenInfo, this, this.updateGushenInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetGushenTaskRewardReply, this, this.getGuShenTaskRewardReply);
            Channel.instance.subscribe(SystemClientOpcode.GetGushenActiveRewardReply, this, this.getGuShenActiveRewardReply);
            //功能开启注册 仿写
            //FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.sevenDay, UserFeatureOpcode.GetSevenDay);
            //获取数据
            this.requsetAllData()
        }
        public requsetAllData() {
            Channel.instance.publish(UserFeatureOpcode.GetGushenInfo, null);
        }

        //获取信息返回
        private getGushenInfo(tuple: GetGushenInfoReply) {
            GuShenModel.instance.updateInfo(tuple);
        }

        //更新信息返回
        private updateGushenInfo(tuple: UpdateGushenInfo) {
            GuShenModel.instance.updateInfo(tuple);
        }

        //获取任务奖励返回
        private getGuShenTaskRewardReply(tuple: GetGushenTaskRewardReply) {
            if (!tuple[GetGushenTaskRewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("领取成功");
            }
        }

        //获取激活秘术返回
        private getGuShenActiveRewardReply(tuple: GetGushenActiveRewardReply) {
            if (!tuple[GetGushenActiveRewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("激活成功");
            }
        }

        //领取任务奖励
        public getGuShenTaskReward(tuple: GetGushenTaskReward) {
            Channel.instance.publish(UserFeatureOpcode.GetGushenTaskReward, tuple);
        }

        //激活秘术
        public getGushenActiveReward(tuple: GetGushenActiveReward) {
            Channel.instance.publish(UserFeatureOpcode.GetGushenActiveReward, tuple);
        }

        //获取数据
        public getCumulatepayInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetGushenInfo, null);
        }
    }
}