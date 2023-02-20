/////<reference path="../$.ts"/>
/** 开服冲榜 */
namespace modules.sprint_rank {
    import BaseCtrl = modules.core.BaseCtrl;
    import UserCenterOpcode = Protocols.UserCenterOpcode;
    import GetSprintRankAllInfoReply = Protocols.GetSprintRankAllInfoReply;
    import UpdateSprintRankBaseInfo = Protocols.UpdateSprintRankBaseInfo;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class SprintRankCtrl extends BaseCtrl {
        private static _instance: SprintRankCtrl;
        public static get instance(): SprintRankCtrl {
            return this._instance = this._instance || new SprintRankCtrl();
        }

        private constructor() {
            super();
        }

        public setup(): void {
            Channel.instance.subscribe(SystemClientOpcode.GetSprintRankAllInfoReply, this, this.getdateSprintRankInfoReply);
            Channel.instance.subscribe(SystemClientOpcode.UpdateSprintRankBaseInfo, this, this.updateSprintRankInfo);
            Channel.instance.subscribe(SystemClientOpcode.GetSprintRankBaseInfoReply, this, this.updateSprintRankInfo);
            Channel.instance.subscribe(SystemClientOpcode.UpdateSprintRankState, this, this.UpdateSprintRankState);
            Channel.instance.subscribe(SystemClientOpcode.GetSprintRankBeforeReply, this, this.GetSprintRankBeforeReply);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_UPDATE, this, this.funOpenSetSprintType);
            GlobalData.dispatcher.on(CommonEventType.FUNC_OPEN_ASSIGN_REPLY, this, this.funOpenSetSprintTypeRely);

           
            this.requsetAllData();
        }
        public requsetAllData() {
            Channel.instance.publish(UserCenterOpcode.GetSprintRankAllInfo, null);
            Channel.instance.publish(UserCenterOpcode.GetSprintRankBaseInfo, null);
            this.GetFeishengRankBefore();
        }
        public funOpenSetSprintType(ID: Array<number>) {
            for (var index = 0; index < ID.length; index++) {
                var element = ID[index];
                if (element == ActionOpenId.sprintRank) {
                    if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.sprintRank)) {
                        SprintRankModel.instance.setSprintType(SprintRankModel.instance.curType);
                        return;
                    }
                }
            }
        }
        public funOpenSetSprintTypeRely() {
            if (FuncOpenModel.instance.getFuncIsOpen(ActionOpenId.sprintRank)) {
                this.GetFeishengRankBefore();
                return;
            }
        }
        //开服冲榜获取信息返回
        private getdateSprintRankInfoReply(tuple: GetSprintRankAllInfoReply) {
            SprintRankModel.instance.getInfo(tuple);
        }

        //更新信息
        private updateSprintRankInfo(tuple: UpdateSprintRankBaseInfo) {
            SprintRankModel.instance.updateInfo(tuple);
        }

        public getSprintRankAllInfo() {
            Channel.instance.publish(UserCenterOpcode.GetSprintRankAllInfo, null);
        }

        public getSprintRankBaseInfo() {
            Channel.instance.publish(UserCenterOpcode.GetSprintRankBaseInfo, null);
        }
        public panDuan() {
            let localShuJu = localStorage.getItem(localStorageStrKey.SprintRankModel);
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
                    localStorage.setItem(localStorageStrKey.SprintRankModel, ``);
                }
            }
        }
        /*获取历史排名*/
        public GetFeishengRankBefore(): void {
            let isTan = false;
            let localShuJu = localStorage.getItem(localStorageStrKey.SprintRankModel);
            let state: number = SprintRankModel.instance.openState; /*开启状态(0未开启 1开启 2开启后关闭)*/
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
            let isOPen = FuncOpenModel.instance.getFuncStateById(ActionOpenId.sprintRank) === ActionOpenState.open;

            if (isOPen && !isTan) {
                // console.log("开服 获取历史排名 请求...............:   ");
                Channel.instance.publish(UserCenterOpcode.GetSprintRankBefore, null);
            }
            else {
                // console.log("开服 未开启 或者已开  不发送 获取历史排名 请求............... isTan:   ", isTan);
            }
        }
        private GetSprintRankBeforeReply(tuple: Protocols.GetSprintRankBeforeReply): void {
            // console.log("开服 历史记录返回数据...............:   ", tuple);
            SprintRankModel.instance.GetSprintRankBeforeReply(tuple);
        }
        private UpdateSprintRankState(): void {
            // console.log("开服 活动结束推送...............:   ");
            localStorage.setItem(localStorageStrKey.SprintRankModel, ``);
            this.GetFeishengRankBefore();
        }

    }
}