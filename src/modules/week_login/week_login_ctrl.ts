/**登录豪礼(周末狂欢)*/

namespace modules.week_login {

    import BaseCtrl = modules.core.BaseCtrl;
    import GetWeekLoginReply = Protocols.GetWeekLoginReply;
    import GetWeekLoginAward = Protocols.GetWeekLoginAward;
    import GetWeekLoginReplyFields = Protocols.GetWeekLoginReplyFields;
    import GetWeekLoginAwardReply = Protocols.GetWeekLoginAwardReply;
    import GetWeekLoginAwardReplyFields = Protocols.GetWeekLoginAwardReplyFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    export class WeekLoginCtrl extends BaseCtrl {
        private static _instance: WeekLoginCtrl;
        public static get instance(): WeekLoginCtrl {
            return this._instance = this._instance || new WeekLoginCtrl();
        }
        private constructor() {
            super();
        }
        public setup(): void {
            //登录返回
            Channel.instance.subscribe(SystemClientOpcode.GetWeekLoginReply, this, this.getWeekLoginReply);
            //领取返回
            Channel.instance.subscribe(SystemClientOpcode.GetWeekLoginAwardReply, this, this.getWeekLoginAwardReply);

            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.setFuncState);

            this.requsetAllData();
        }

        public requsetAllData() {
            this.getWeekLogin();
        }

        //登录返回
        private getWeekLoginReply(tuple: GetWeekLoginReply) {
            WeekLoginModel.instance.updateInfo(tuple);

            WeekLoginModel.instance.setPayRewardRP();
            //console.log("-------------tuple = " + tuple);
        }
        //领取返回
        private getWeekLoginAwardReply(tuple: GetWeekLoginAwardReply) {
            CommonUtil.noticeError(tuple[GetWeekLoginAwardReplyFields.result]);
        }
        //获取数据
        public getWeekLogin(): void {
            Channel.instance.publish(UserFeatureOpcode.GetWeekLogin, null);
        }
        // 领取奖励
        public getWeekLoginReward(itemId: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetWeekLoginAward, [itemId]);
        }

        public setFuncState(ids: Array<number>) {
            for (let id of ids) {
                if (id === ActionOpenId.weekSinglePay) {
                    WeekLoginModel.instance.setFuncState();
                    return;
                }
            }
        }
    }
}