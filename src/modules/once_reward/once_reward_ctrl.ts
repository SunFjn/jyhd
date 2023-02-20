/** 单次奖励*/


namespace modules.onceReward{
    import GetOnceRewardReply = Protocols.GetOnceRewardReply;
    import DrawOnceRewardReply = Protocols.DrawOnceRewardReply;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;
    import GetOnceRewardReplyFields = Protocols.GetOnceRewardReplyFields;
    import DrawOnceRewardReplyFields = Protocols.DrawOnceRewardReplyFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import SetOnceRewardDataReply = Protocols.SetOnceRewardDataReply;
    import SetOnceRewardDataReplyFields = Protocols.SetOnceRewardDataReplyFields;
    import OnceRewardData = Protocols.OnceRewardData;
    import OnceRewardDataFields = Protocols.OnceRewardDataFields;

    export class OnceRewardCtrl extends BaseCtrl{
        private static _instance:OnceRewardCtrl;
        public static get instance():OnceRewardCtrl{
            return this._instance = this._instance || new OnceRewardCtrl();
        }

        constructor(){
            super();
        }

        setup(): void {
            // 获取单次奖励返回
            Channel.instance.subscribe(SystemClientOpcode.GetOnceRewardReply, this, this.getOnceRewardReply);
            // 领取单次奖励返回
            Channel.instance.subscribe(SystemClientOpcode.DrawOnceRewardReply, this, this.drawOnceRewardReply);
            // 设置单次奖励数据返回
            Channel.instance.subscribe(SystemClientOpcode.SetOnceRewardDataReply, this, this.setOnceRewardDataReply);

            this.requsetAllData();
        }
        public requsetAllData() {
            this.getOnceReward();
        }

        // 获取单次奖励状态
        public getOnceReward():void{
            Channel.instance.publish(UserFeatureOpcode.GetOnceReward, null);
        }
        // 获取单次奖励返回
        private getOnceRewardReply(value:GetOnceRewardReply):void{
            OnceRewardModel.instance.gotAwardIds = value[GetOnceRewardReplyFields.id];
            OnceRewardModel.instance.datas = value[GetOnceRewardReplyFields.data];
        }

        // 领取单次奖励
        public drawOnceReward(id:number):void{
            Channel.instance.publish(UserFeatureOpcode.DrawOnceReward, [id]);
        }
        // 领取单次奖励返回
        private drawOnceRewardReply(value:DrawOnceRewardReply):void{
            let result:number = value[DrawOnceRewardReplyFields.result];
            if(result === 0) {
                let id:number = value[DrawOnceRewardReplyFields.id];
                OnceRewardModel.instance.drawOnceRewardReply(id);
                if(id === 46001){       // 实名认证
                    SystemNoticeManager.instance.addNotice("领取成功");
                    WindowManager.instance.close(WindowEnum.REAL_NAME_ALERT);
                }else if(id === 46002){         // 关注公众号
                    SystemNoticeManager.instance.addNotice("领取成功");
                    WindowManager.instance.close(WindowEnum.OFFICIAL_ACCOUNT_ALERT);
                }
                else if(id === 46003){         // 登录欢迎页
                    SystemNoticeManager.instance.addNotice("领取成功");
                    //WindowManager.instance.close(WindowEnum.OFFICIAL_ACCOUNT_ALERT);
                }
            }else{
                CommonUtil.noticeError(result);
            }
        }

        // 设置单次奖励数据
        public setOnceRewardData(id:number, data:string):void{
            Channel.instance.publish(UserFeatureOpcode.SetOnceRewardData, [data, id]);
        }
        // 设置单次奖励数据返回
        private setOnceRewardDataReply(value:SetOnceRewardDataReply):void{
            let code:number = value[SetOnceRewardDataReplyFields.result];
            if(code === ErrorCode.Success){
                OnceRewardModel.instance.setOnceRewardDataReply(value[SetOnceRewardDataReplyFields.id], value[SetOnceRewardDataReplyFields.data]);
            }else{

            }
        }
    }
}