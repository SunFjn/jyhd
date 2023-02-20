///<reference path="login_reward_model.ts"/>
///<reference path="../../main.ts"/>
///<reference path="../../../libs/generate/protocols.d.ts"/>
/////<reference path="../$.ts"/>
/** 登录豪礼 */
namespace modules.login_reward {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetLoginRewardInfoReply = Protocols.GetLoginRewardInfoReply;
    import UpdateLoginRewardInfo = Protocols.UpdateLoginRewardInfo;
    import GetLoginRewardRewardReply = Protocols.GetLoginRewardRewardReply;
    import GetLoginRewardRewardReplyFields = Protocols.GetLoginRewardRewardReplyFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class LoginRewardCtrl extends BaseCtrl {


        private static _instance: LoginRewardCtrl;


        public static get instance(): LoginRewardCtrl {
            return this._instance = this._instance || new LoginRewardCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            /*返回数据*/
            Channel.instance.subscribe(SystemClientOpcode.GetLoginRewardInfoReply, this, this.getLoginRewardInfoReply);
            /*更新数据*/
            Channel.instance.subscribe(SystemClientOpcode.UpdateLoginRewardInfo, this, this.updateLoginRewardInfo);
            /*领取返回*/
            Channel.instance.subscribe(SystemClientOpcode.GetLoginRewardRewardReply, this, this.getLoginRewardRewardReply);

            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);

            this.requsetAllData();
        }
        public requsetAllData() {
            this.getLoginRewad();
        }
        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.loginReward) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.loginReward)) {
                        LoginRewardModel.instance.setFuncState();
                        LoginRewardModel.instance.setPayRewardRP();
                        return;
                    }
                }
            }
        }

        //返回数据
        private getLoginRewardInfoReply(tuple: GetLoginRewardInfoReply) {
            LoginRewardModel.instance.updateInfo(tuple);
            LoginRewardModel.instance.setFuncState();
            LoginRewardModel.instance.setPayRewardRP();
        }

        //更新数据
        private updateLoginRewardInfo(tuple: UpdateLoginRewardInfo) {
            LoginRewardModel.instance.updateInfo(tuple);
            LoginRewardModel.instance.setFuncState();
            LoginRewardModel.instance.setPayRewardRP();
        }

        //领取返回
        private getLoginRewardRewardReply(tuple: GetLoginRewardRewardReply) {
            CommonUtil.noticeError(tuple[GetLoginRewardRewardReplyFields.result]);
        }

        //获取数据
        public getLoginRewad(): void {
            Channel.instance.publish(UserFeatureOpcode.GetLoginRewardInfo, null);
        }

        // 领取奖励
        public getLoginRewardReward(itemId: number): void {
            Channel.instance.publish(UserFeatureOpcode.GetLoginRewardReward, [itemId]);
        }

    }
}