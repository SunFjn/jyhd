/////<reference path="../$.ts"/>
/** 开服冲榜 */
namespace modules.soaring_rank {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserCrossOpcode = Protocols.UserCrossOpcode;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import GetFeishengRankTaskRewardReplyFields = Protocols.GetFeishengRankTaskRewardReplyFields;

    export class SoaringRankCtrl extends BaseCtrl {
        private static _instance: SoaringRankCtrl;
        public static get instance(): SoaringRankCtrl {
            return this._instance = this._instance || new SoaringRankCtrl();
        }

        private constructor() {
            super();

        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetFeishengRankAllInfoReply, this, this.getFeishengRankAllInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.GetFeishengRankBaseInfoReply, this, this.getFeishengRankBaseInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateFeishengRankBaseInfo, this, this.updateFeishengRankBaseInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetFeishengRankTaskInfoReply, this, this.getFeishengRankTaskInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateFeishengRankTaskInfo, this, this.updateFeishengRankTaskInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetFeishengRankTaskRewardReply, this, this.getFeishengRankTaskRewardReply);

            Channel.instance.subscribe(SystemClientOpcode.UpdateFeishengRankState, this, this.UpdateFeishengRankState);
            Channel.instance.subscribe(SystemClientOpcode.GetFeishengRankBeforeReply, this, this.GetFeishengRankBeforeReply);

            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_ASSIGN_REPLY, this, this.funOpenSetSprintTypeRely);

            this.requsetAllData();
        }
        public requsetAllData() {
            this.getFeishengRankAllInfo();
            this.getFeishengRankBaseInfo();//登录 在主界面只需要请求简单的数据就好
            this.getFeishengRankTaskInfo();
            this.GetFeishengRankBefore();
        }


        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.soaringRank) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.soaringRank)) {
                        SoaringRankModel.instance.setRP();
                        // this.GetFeishengRankBefore();
                        return;
                    }
                }
            }
        }
        public funOpenSetSprintTypeRely() {
            if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.soaringRank)) {
                this.GetFeishengRankBefore();
                return;
            }
        }
        public panDuan() {
            let localShuJu = localStorage.getItem(localStorageStrKey.SoaringRankModel);
            if (localShuJu) {
                let timeNum: number = parseInt(localShuJu);
                //储存的时间
                let date: Date = new Date(timeNum);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                //现在的时间
                let dateGlobalData: Date = new Date(GlobalData.serverTime);
                let yearGlobalData = dateGlobalData.getFullYear();
                let monthGlobalData = dateGlobalData.getMonth() + 1;
                let dayGlobalData = dateGlobalData.getDate();

                let bollll = yearGlobalData == year && monthGlobalData == month && day == dayGlobalData;
                if (!bollll) {
                    localStorage.setItem(localStorageStrKey.SoaringRankModel, ``);
                }
            }
        }
        /*获取历史排名*/
        public GetFeishengRankBefore(): void {
            let isTan = false;
            let localShuJu = localStorage.getItem(localStorageStrKey.SoaringRankModel);
            if (localShuJu) {
                let lacalTime = parseInt(localShuJu)
                if (lacalTime) {
                    let dateLocal: Date = new Date(lacalTime);
                    let _time = GlobalData.serverTime;
                    let date: Date = new Date(_time);
                    date.setHours(23);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    date.setMilliseconds(0);
                    let nowTime = date.getTime();

                    let jinTian = nowTime;
                    let zuoTian = nowTime - 24 * utils.Unit.hour;
                    let mingTian = nowTime + 24 * utils.Unit.hour;


                    let booool1 = GlobalData.serverTime <= jinTian;
                    let booool2 = GlobalData.serverTime > zuoTian;
                    let newBoll1 = booool1 && booool2;//昨天23点<=今天的时间<今天23点

                    let newBoll2 = GlobalData.serverTime > jinTian && GlobalData.serverTime <= mingTian;//今天23点<=今天的时间<=明天23点

                    let zuoBoll1 = lacalTime <= jinTian && lacalTime > zuoTian;//昨天23点<=上次的时间<今天23点

                    let zuoBoll2 = lacalTime > jinTian && lacalTime <= mingTian;//今天23点<=上次的时间<=明天23点


                    if (newBoll1 && !zuoBoll1) {
                        isTan = false;
                    }
                    else if (newBoll2 && zuoBoll1) {
                        isTan = false;
                    }
                    else {
                        isTan = true;
                    }
                }
                else {
                    isTan = true;
                }
            }
            let isOPen = FuncOpenModel.instance.getFuncStateById(ActionOpenId.soaringRank) === ActionOpenState.open;
            if (isOPen && !isTan) {
                // console.log("封神榜 获取历史排名 请求...............:   ");
                Channel.instance.publish(UserCrossOpcode.GetFeishengRankBefore, null);
            }
            else {
                // console.log("封神榜 未开启 或者已开  不发送 获取历史排名 请求............... isTan:   ", isTan);
            }
        }
        /**
         * 封神榜 获取数据 请求
         */
        public getFeishengRankAllInfo(): void {
            // console.log("封神榜 获取数据 请求...............:   ");
            Channel.instance.publish(UserCrossOpcode.GetFeishengRankAllInfo, null);
        }

        /**
         *封神榜 获取基本数据(标签) 请求
         */
        public getFeishengRankBaseInfo(): void {
            // console.log("封神榜 获取基本数据(标签) 请求...............:   ");
            Channel.instance.publish(UserCrossOpcode.GetFeishengRankBaseInfo, null);
        }

        /**
         *封神榜 获取积分数据 请求
         */
        public getFeishengRankTaskInfo(): void {
            // console.log("封神榜 获取积分数据 请求...............:   ");
            Channel.instance.publish(UserCrossOpcode.GetFeishengRankTaskInfo, null);
        }

        /**
         *封神榜 获取积分奖励 请求
         */
        public getFeishengRankTaskReward(): void {
            // console.log("封神榜 获取积分奖励 请求...............:   ");
            Channel.instance.publish(UserCrossOpcode.GetFeishengRankTaskReward, null);
        }

        private getFeishengRankAllInfoReply(tuple: Protocols.GetFeishengRankAllInfoReply): void {
            // console.log("封神榜 返回数据...............:   ", tuple);
            SoaringRankModel.instance.getInfo(tuple);
        }

        private getFeishengRankBaseInfoReply(tuple: Protocols.GetFeishengRankBaseInfoReply): void {
            // console.log("封神榜 返回标签数据...............:   ", tuple);
            SoaringRankModel.instance.getInfo2(tuple);
        }

        private updateFeishengRankBaseInfo(tuple: Protocols.UpdateFeishengRankBaseInfo): void {
            // console.log("封神榜 更新基本数据(只更新简单信息)...............:   ", tuple);
            SoaringRankModel.instance.updateInfo(tuple);
        }

        private getFeishengRankTaskInfoReply(tuple: Protocols.GetFeishengRankTaskInfoReply): void {
            // console.log("封神榜 返回积分数据...............:   ", tuple);
            SoaringRankModel.instance.getInfoIntegral(tuple);
        }

        private updateFeishengRankTaskInfo(tuple: Protocols.UpdateFeishengRankTaskInfo): void {
            // console.log("封神榜 更新积分数据...............:   ", tuple);
            SoaringRankModel.instance.updateInfoIntegral(tuple);
        }

        private getFeishengRankTaskRewardReply(tuple: Protocols.GetFeishengRankTaskRewardReply): void {
            // console.log("封神榜 领取返回...............:   ", tuple);
            if (tuple[GetFeishengRankTaskRewardReplyFields.result] == 0) {
                SystemNoticeManager.instance.addNotice("领取成功", false);
            } else {
                CommonUtil.noticeError(tuple[GetFeishengRankTaskRewardReplyFields.result]);
            }
        }
        private GetFeishengRankBeforeReply(tuple: Protocols.GetFeishengRankBeforeReply): void {
            console.log("封神榜 历史记录返回数据...............:   ", tuple);
            SoaringRankModel.instance.GetFeishengRankBeforeReply(tuple);
        }
        private UpdateFeishengRankState(): void {
            console.log("封神榜 活动结束推送...............:   ");
            localStorage.setItem(localStorageStrKey.SoaringRankModel, ``);
            this.GetFeishengRankBefore();

            modules.soaring_cumulatePay.SoaringCumulatePayCtrl.instance.getCumulatepayFSInfo();
            modules.soaring_dayConsumeReward.SoaringDayConsumeRewardCtrl.instance.GetConsumeRewardFSInfo();
            modules.soaring_panicBuyingGift.SoaringPanicBuyingGiftCtrl.instance.GetRushBuyFSInfo();
            modules.soaring_singlePay.SoaringSinglePayCtrl.instance.GetPaySingleFSInfo();
            modules.soaring_specialGift.SoaringSpecialGiftCtrl.instance.GetDiscountGiftFSInfo();
        }
    }
}
