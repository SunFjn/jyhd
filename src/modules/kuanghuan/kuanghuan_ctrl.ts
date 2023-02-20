///<reference path="kuanghuan_model.ts"/>
/////<reference path="../$.ts"/>
/** 描述 */
namespace modules.kuanghuan {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetKuanghuanRewardReply = Protocols.GetKuanghuanRewardReply;
    import GetKuanghuanRewardReplyFields = Protocols.GetKuanghuanRewardReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import UpdateKuanghuanInfo = Protocols.UpdateKuanghuanInfo;
    import GetKuanghuanInfoReply = Protocols.GetKuanghuanInfoReply;
    import GetKuanghuanReward = Protocols.GetKuanghuanReward;

    export class KuangHuanCtrl extends BaseCtrl {
        private static _instance: KuangHuanCtrl;
        public static get instance(): KuangHuanCtrl {
            return this._instance = this._instance || new KuangHuanCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {

            Channel.instance.subscribe(SystemClientOpcode.GetKuanghuanInfoReply, this, this.getKuangHuanInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateKuanghuanInfo, this, this.updateKuangHuanInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetKuanghuanRewardReply, this, this.getKuangHuanRewardReply);
            //功能开启注册 仿写
            //FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.sevenDay, UserFeatureOpcode.GetSevenDay);
            this.requsetAllData();
            //GlobalData.dispatcher.once(CommonEventType.LOGIN_SUCCESS, this, this.onLoginSuccess);
        }
        public requsetAllData() {
            this.GetKuanghuanInfo();
        }

        public GetKuanghuanInfo() {
            Channel.instance.publish(UserFeatureOpcode.GetKuanghuanInfo, null);
        }

        //获取信息返回
        private getKuangHuanInfoReply(tuple: GetKuanghuanInfoReply) {
            KuangHuanModel.instance.updateInfo(tuple);
            // console.log("全名狂欢返回：", tuple);
        }

        //更新信息返回
        private updateKuangHuanInfo(tuple: UpdateKuanghuanInfo) {
            KuangHuanModel.instance.updateInfo(tuple);
            // console.log("全名狂欢更新信息返回：", tuple);
        }

        //获取奖励返回
        private getKuangHuanRewardReply(tuple: GetKuanghuanRewardReply) {
            if (!tuple[GetKuanghuanRewardReplyFields.result]) {
                SystemNoticeManager.instance.addNotice("领取成功");
            }
        }

        //领取奖励
        public getKuangHuanReward(tuple: GetKuanghuanReward) {
            Channel.instance.publish(UserFeatureOpcode.GetKuanghuanReward, tuple);
        }

        //获取数据
        public getKuangHuanInfo(): void {
            Channel.instance.publish(UserFeatureOpcode.GetKuanghuanInfo, null);
        }
    }
}