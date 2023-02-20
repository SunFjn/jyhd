///<reference path="../once_reward/once_reward_model.ts"/>
///<reference path="../once_reward/once_reward_ctrl.ts"/>


/** 实名认证*/


namespace modules.realName{
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import OnceRewardModel = modules.onceReward.OnceRewardModel;
    import OnceRewardCtrl = modules.onceReward.OnceRewardCtrl;
    import OnceRewardId = ui.OnceRewardId;

    export class RealNameCtrl extends BaseCtrl{
        private static _instance:RealNameCtrl;
        public static get instance():RealNameCtrl{
            return this._instance = this._instance || new RealNameCtrl();
        }

        constructor(){
            super();
        }

        setup(): void {
            GlobalData.dispatcher.on(CommonEventType.ONCE_REWARD_UPDATE, this, this.onceRewardUpdate);
        }

        // 实名认证
        public realName():void{
            PlatParams.playerRealName(this.realNameBack.bind(this));
        }

        // 实名认证回调
        private realNameBack(status:number, data:any):void{
            // console.log("实名认证回调................." + status + "   " + data);
            if(status === 0){       // 成功
                // 实名认证成功之后向服务器保存状态
                OnceRewardCtrl.instance.setOnceRewardData(OnceRewardId.realName, "1");
            }else{

            }
        }

        // 领取奖励
        public getAward():void{
            OnceRewardCtrl.instance.drawOnceReward(OnceRewardId.realName);
        }

        // 单次奖励更新
        private onceRewardUpdate():void{
            RealNameModel.instance.status = OnceRewardModel.instance.getDataById(OnceRewardId.realName) === "1" ? 0 : 1;
            this.checkFuncOpen();
        }

        // 检测功能开启状态
        private checkFuncOpen():void{
            let arr:Array<number> = OnceRewardModel.instance.gotAwardIds;
            if(arr && arr.indexOf(OnceRewardId.realName) !== -1){
                FuncOpenModel.instance.setActionOpen(ActionOpenId.realName, ActionOpenState.close);
            }
        }
    }
}