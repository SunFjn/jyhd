///<reference path="../config/consume_rank_cfg.ts"/>
namespace modules.payRank {
    import BaseCtrl = modules.core.BaseCtrl;
    import GetConsumeRankReplyFields = Protocols.GetConsumeRankReplyFields;
    import GetConsumeCountReplyFields = Protocols.GetConsumeCountReplyFields;
    import GetConsumeCount = Protocols.GetConsumeCount;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetConsumeRankReply = Protocols.GetConsumeRankReply;
    import GetConsumeCountReply = Protocols.GetConsumeCountReply;
    import UserCrossOpcode = Protocols.UserCrossOpcode;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import ConsumeRankCfg = modules.config.ConsumeRankCfg;
    import Unit = utils.Unit;

    export class PayRankCtrl extends BaseCtrl {
        private static _instance: PayRankCtrl;

        public static get instance(): PayRankCtrl {
            return PayRankCtrl._instance = PayRankCtrl._instance || new PayRankCtrl();
        }

        constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetConsumeRankReply, this, this.getConsumeRankReply);
            Channel.instance.subscribe(SystemClientOpcode.GetConsumeCountReply, this, this.getConsumeCountReply);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);
            this.requsetAllData();
        }
        public requsetAllData() {
            this.getConsumeCount();
            this.getConsumeRank();
            FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.consumeRank, UserFeatureOpcode.GetConsumeCount);
            FuncOpenCtrl.instance.registeFuncReq(ActionOpenId.consumeRank, UserCrossOpcode.GetConsumeRank);
        }

        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.consumeRank) {
                    // console.log("funOpenSetSprintType 开启状态更新： " + FuncOpenModel.instance.getFuncStateById(ActionOpenId.consumeRank));
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.consumeRank)) {
                        PayRankModel.Instance.setActionOpen();
                    }
                    return;
                }
            }
        }

        private getConsumeRankReply(tuple: GetConsumeRankReply): void {
            PayRankModel.Instance.activityTime = tuple[GetConsumeRankReplyFields.time];
            PayRankModel.Instance.rankList = tuple[GetConsumeRankReplyFields.rankList];
            // console.log("getConsumeRankReply 消费排行数据返回 或更新  ", tuple);

            PayRankModel.Instance.setActionOpen();

            // 过了12点之后重新请求
            let offsetTime: number = new Date().getTimezoneOffset() * utils.Unit.minute;
            let overSec: number = (tuple[GetConsumeRankReplyFields.time] - offsetTime) % utils.Unit.day;
            let delay: number = Math.floor(Math.random() * 1000) + 500;
            if (overSec !== 0) {      // 非整点计算时间差
                delay += utils.Unit.day - overSec;
            }
            Laya.timer.once(delay, this, this.getConsumeRank);
        }

        private getConsumeCountReply(tuple: GetConsumeCountReply): void {
            PayRankModel.Instance.totalPay = tuple[GetConsumeCountReplyFields.count];
        }

        public getConsumeCount() {
            Channel.instance.publish(UserFeatureOpcode.GetConsumeCount, null);
        }

        public getConsumeRank(): void {
            Channel.instance.publish(UserCrossOpcode.GetConsumeRank, null);
        }

        private refresh(): void {
            this.getConsumeRank();
        }

    }
}