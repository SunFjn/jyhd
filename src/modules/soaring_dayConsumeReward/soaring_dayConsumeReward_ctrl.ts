/////<reference path="../$.ts"/>
/**
 * 消费赠礼 （封神榜）
 */
namespace modules.soaring_dayConsumeReward {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import GetConsumeRewardFSRewardReplyFields = Protocols.GetConsumeRewardFSRewardReplyFields;

    export class SoaringDayConsumeRewardCtrl extends BaseCtrl {
        private static _instance: SoaringDayConsumeRewardCtrl;
        public static get instance(): SoaringDayConsumeRewardCtrl {
            return this._instance = this._instance || new SoaringDayConsumeRewardCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetConsumeRewardFSInfoReply, this, this.GetConsumeRewardFSInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateConsumeRewardFSInfo, this, this.UpdateConsumeRewardFSInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetConsumeRewardFSRewardReply, this, this.GetConsumeRewardFSRewardReply);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);
            this.requsetAllData();
        }
        public requsetAllData() {
            this.GetConsumeRewardFSInfo();
        }

        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.consumeRewardFS) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.consumeRewardFS)) {
                        SoaringDayConsumeRewardModel.instance.setRP();
                        return;
                    }
                }
            }
        }

        /**
         *领取奖励 请求
         */
        public GetConsumeRewardFSReward(id: number): void {
            // console.log(" 消费赠礼 （封神榜） 领取奖励 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.GetConsumeRewardFSReward, [id]);
        }

        /**
         *获取数据 请求
         */
        public GetConsumeRewardFSInfo(): void {
            // console.log(" 消费赠礼 （封神榜） 获取数据 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.GetConsumeRewardFSInfo, null);
        }

        private GetConsumeRewardFSInfoReply(tuple: Protocols.GetConsumeRewardFSInfoReply): void {
            // console.log(" 消费赠礼 （封神榜） 返回数据...............:   ", tuple);
            SoaringDayConsumeRewardModel.instance.getInfo(tuple);
        }

        private UpdateConsumeRewardFSInfo(tuple: Protocols.UpdateConsumeRewardFSInfo): void {
            // console.log(" 消费赠礼 （封神榜） 更新数据...............:   ", tuple);
            SoaringDayConsumeRewardModel.instance.updateInfo(tuple);
        }

        private GetConsumeRewardFSRewardReply(tuple: Protocols.GetConsumeRewardFSRewardReply): void {
            // console.log("消费赠礼 （封神榜） 领取返回...............:   ", tuple);
            if (tuple[GetConsumeRewardFSRewardReplyFields.result] == 0) {
                SystemNoticeManager.instance.addNotice("领取成功", false);
            } else {
                CommonUtil.noticeError(tuple[GetConsumeRewardFSRewardReplyFields.result]);
            }
        }
    }
}
