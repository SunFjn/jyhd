///<reference path="../notice/tips_notice_manager.ts"/>

/** 七日活动 */
namespace modules.seven_activity {
    import SevenActivityGetAwardReply = Protocols.SevenActivityGetAwardReply;
    import SevenActivityGetAwardReplyFields = Protocols.SevenActivityGetAwardReplyFields;
    import SevenActivityBaseDatasReply = Protocols.SevenActivityBaseDatasReply;
    import GetSevenActivityAward = Protocols.GetSevenActivityAward;

    export class SevenActivityCtrl extends BaseCtrl {
        private static _instance: SevenActivityCtrl;
        public static get instance(): SevenActivityCtrl {
            return this._instance = this._instance || new SevenActivityCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.SevenActivityAwdWeeklyTasksReply, this, this.sevenActivityAwdWeeklyTasksReply);
            Channel.instance.subscribe(SystemClientOpcode.SevenActivityBaseDatasReply, this, this.sevenActivityBaseDatasReply);

            // Channel.instance.subscribe(SystemClientOpcode.SpecifySearchObjReply, this, this.reqSearchObjReply);
           this.requsetAllData();
        }

        /**
         * 向服务器请求数据
        */
        public requsetAllData(): void {
            this.getBaseData();    
        }

        // 获取七日数据
        public getBaseData(): void {
            Channel.instance.publish(UserFeatureOpcode.GetSevenActivityDatas, null);
        }

        // 领取奖励请求
        public getAward(data: GetSevenActivityAward): void {
            Channel.instance.publish(UserFeatureOpcode.GetSevenActivityAward, data);
        }


        // 领取奖励返回
        private sevenActivityAwdWeeklyTasksReply(data: SevenActivityGetAwardReply): void {
            let code: number = data[SevenActivityGetAwardReplyFields.code];
            CommonUtil.codeDispose(code, `领取成功`);
            if (code == 0) {
                // 刷新数据
                this.getBaseData();
            }
        }

        // 基础信息数据获取返回
        private sevenActivityBaseDatasReply(data: SevenActivityBaseDatasReply): void {
            SevenActivityModel.instance.setBaseInfo(data);
        }

    }
}