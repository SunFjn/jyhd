namespace modules.onlineGift {
    import Dictionary = laya.utils.Dictionary;
    import OnlineReward = Protocols.OnlineReward;
    import OnlineRewardFields = Protocols.OnlineRewardFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class OnlineGiftModel {
        private static _instance: OnlineGiftModel;
        private _redDot: boolean;

        public static get instance(): OnlineGiftModel {
            return this._instance = this._instance || new OnlineGiftModel();
        }

        private updateRewardReply: Array<OnlineReward>;
        private updateRewardReply1: Array<OnlineReward>;
        private awardReply: number;
        private _onlineDic: Dictionary;

        constructor() {
            this._onlineDic = new Dictionary();
        }

        public set AwardReply(value: number) {
            this.awardReply = value;
            GlobalData.dispatcher.event(CommonEventType.AWARD_REPLY);
        }

        public get AwardReply(): number {
            return this.awardReply;
        }

        public set UpdateRewardReply(value: Array<OnlineReward>) {
            this.updateRewardReply = value;
            this.updateRewardReply1 = value;
            for (let i = 0; i < this.updateRewardReply.length; i++) {
                let onlineReward: OnlineReward = this.updateRewardReply[i];
                // var timestamp = new Date().getTime();
                onlineReward[OnlineRewardFields.time] += GlobalData.serverTime;
                this._onlineDic.set(onlineReward[OnlineRewardFields.id], onlineReward);
            }
            this.setDotDic();
            GlobalData.dispatcher.event(CommonEventType.UPDATE_ONLINE_REWARD_REPLY);
        }

        public get UpdateRewardReply(): Array<OnlineReward> {
            return this.updateRewardReply;
        }

        public getOnlineRewardDic() {
            if (this._onlineDic != null) {
                return this._onlineDic;
            }
        }

        private setDotDic(): void {
            for (let i = 0; i < this.updateRewardReply.length; i++) {
                let reward: OnlineReward = this.updateRewardReply[i];
                if (reward[OnlineRewardFields.state] == 1) {
                    this._redDot = true;
                    break;
                } else {
                    this._redDot = false;
                }
            }
            RedPointCtrl.instance.setRPProperty("onlineGiftRP", this._redDot);

        }

        /**
         * ??????????????????????????????
         */
        public isOver(): boolean {
            if (this.updateRewardReply1) {
                for (let index = 0; index < this.updateRewardReply1.length; index++) {
                    let element = this.updateRewardReply1[index];
                    if (element) {
                        let state = element[OnlineRewardFields.state];
                        if (state == 0 || state == 1) {
                            return false;
                        }
                    }
                }
                return true;//
            }
            return true;//
        }

        /**
         * ?????????????????????????????????????????? ?????????????????????????????????>???????????????
         */
        public getTruerReward(): OnlineReward {
            if (this.updateRewardReply1) {
                for (var index = 0; index < 2; index++) {
                    let stateNum = 1;
                    if (index == 0) {//?????? ?????? ????????????
                        stateNum = 1;
                    } else if (index == 1) {// ????????????????????????????????? ????????? ????????????
                        stateNum = 0;
                    }
                    for (let index = 0; index < this.updateRewardReply1.length; index++) {
                        let element = this.updateRewardReply1[index];
                        if (element) {
                            if (element[OnlineRewardFields.state] == stateNum) {
                                return element;
                            }
                        }
                    }
                }
                return null;//???????????????  ??????????????????
            }
        }
    }
}