 namespace modules.officialAccount{
    import OnceRewardModel = modules.onceReward.OnceRewardModel;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import OnceRewardCtrl = modules.onceReward.OnceRewardCtrl;
    import OnceRewardId = ui.OnceRewardId;

    export class OfficialAccountCtrl extends BaseCtrl{
        private static _instance:OfficialAccountCtrl;
        public static get instance():OfficialAccountCtrl{
            return this._instance = this._instance || new OfficialAccountCtrl();
        }

        constructor(){
            super();
        }

        public setup():void{
            GlobalData.dispatcher.on(CommonEventType.ONCE_REWARD_UPDATE, this, this.onceRewardUpdate);
            this.requsetAllData();
        }

         /**
         * 向服务器请求数据
         */
        public requsetAllData(): void {
            
        }

        // 关注公众号
        public focusOfficialAccount():void{
            PlatParams.playerFollow(this.focusOfficialAccountBack.bind(this));
        }

        // 关注公众号返回
        private focusOfficialAccountBack(status:number, data:any):void{
            console.log("关注公众号返回................" + status);

            if(status === 0){       // 成功
                OnceRewardCtrl.instance.setOnceRewardData(OnceRewardId.officialAccount, "1");
            }else{

            }
        }

        // 领取奖励
        public getAward():void{
            OnceRewardCtrl.instance.drawOnceReward(OnceRewardId.officialAccount);
        }

        // 单次奖励更新
        private onceRewardUpdate():void{
            OfficialAccountModel.instance.status = OnceRewardModel.instance.getDataById(OnceRewardId.officialAccount) === "1" ? 0 : 1;
            this.checkFuncOpen();
        }

        private checkFuncOpen():void{
            let arr:Array<number> = OnceRewardModel.instance.gotAwardIds;
            if(arr && arr.indexOf(OnceRewardId.officialAccount) !== -1){
                // if(OfficialAccountModel.instance.status === 0){    // 已领取且已认证
                    FuncOpenModel.instance.setActionOpen(ActionOpenId.officialAccount, ActionOpenState.close);
                // }
            }
        }
    }
}