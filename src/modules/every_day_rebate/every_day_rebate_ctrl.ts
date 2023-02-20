/////<reference path="../$.ts"/>
/**
 * 天天返利 （封神榜）
 */
namespace modules.every_day_rebate {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class EveryDayRebateCtrl extends BaseCtrl {
        private static _instance: EveryDayRebateCtrl;
        public static get instance(): EveryDayRebateCtrl {
            return this._instance = this._instance || new EveryDayRebateCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetEverydayRebateInfoReply, this, this.GetEverydayRebateInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateEverydayRebateInfo, this, this.UpdateEverydayRebateInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetEverydayRebateRewardReply, this, this.GetEverydayRebateRewardReply);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);
            this.requsetAllData();
        }
        public requsetAllData() {
            this.GetEverydayRebateInfo();
        }
        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.everydayRebate) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.everydayRebate)) {
                        EveryDayRebateModel.instance.setRP();
                        return;
                    }
                }
            }
        }

        /**
         *领取奖励 请求
         */
        public GetEverydayRebateReward(id: number): void {
            // console.log(" 天天返利 领取奖励 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.GetEverydayRebateReward, [id]);
        }

        /**
         *获取数据 请求
         */
        public GetEverydayRebateInfo(): void {
            // console.log(" 天天返利 获取数据 请求...............:   ");
            Channel.instance.publish(UserFeatureOpcode.GetEverydayRebateInfo, null);
        }

        private GetEverydayRebateInfoReply(tuple: Protocols.GetEverydayRebateInfoReply): void {
            // console.log(" 天天返利 返回数据...............:   ", tuple);
            EveryDayRebateModel.instance.getInfo(tuple);
        }

        private UpdateEverydayRebateInfo(tuple: Protocols.UpdateEverydayRebateInfo): void {
            // console.log(" 天天返利 更新数据...............:   ", tuple);
            EveryDayRebateModel.instance.updateInfo(tuple);
        }

        private GetEverydayRebateRewardReply(tuple: Protocols.GetEverydayRebateRewardReply): void {
            // console.log("天天返利 领取返回...............:   ", tuple);
            if (tuple[Protocols.GetEverydayRebateRewardReplyFields.result] == 0) {
                SystemNoticeManager.instance.addNotice("领取成功", false);
            } else {
                CommonUtil.noticeError(tuple[Protocols.GetEverydayRebateRewardReplyFields.result]);
            }
        }

    }
}
