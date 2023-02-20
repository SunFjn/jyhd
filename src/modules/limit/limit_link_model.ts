/**
 * 连充活动 - 数据
 */
namespace modules.limit {
    import GetLimitLinkInfoReply = Protocols.GetLimitLinkInfoReply;
    import GetLimitLinkInfoReply_reward = Protocols.GetLimitLinkInfoReply_reward;
    import GetLimitLinkInfoReplyFields = Protocols.GetLimitLinkInfoReplyFields;
    import ContinuepayProgress = Protocols.ContinuepayProgress;
    import GetFishLinkInfoReply_rewardFields = Protocols.GetLimitLinkInfoReply_rewardFields;
    export class LimitLinkModel {
        private static _instance: LimitLinkModel;
        public static get instance(): LimitLinkModel {
            return this._instance = this._instance || new LimitLinkModel();
        }

        // 活动结束时间
        private _activityTime: number[];
        //充值金额
        private _totalMoney: number[];
        //每档进度
        private _progressList: Array<Array<ContinuepayProgress>>;
        private _rewardArr: Array<GetLimitLinkInfoReply_reward>;
        // 档位对应数组
        private _gradeRewardArray: Array<Array<Array<GetLimitLinkInfoReply_reward>>>;
        // 打开tab
        private _openindex: number[];

        constructor() {
            this._rewardArr = [];
            this._gradeRewardArray = new Array<Array<Array<GetLimitLinkInfoReply_reward>>>();
            this._progressList = [];

            this._activityTime = new Array<number>();
            this._totalMoney = new Array<number>();
            this._openindex = new Array<number>();

            // 新加活动时这里记得赋初始值
            // 钓鱼
            this._activityTime[LimitBigType.fish] = 0;
            this._totalMoney[LimitBigType.fish] = -1;
            this._openindex[LimitBigType.fish] = 0;
            this._gradeRewardArray[LimitBigType.fish] = new Array<Array<GetLimitLinkInfoReply_reward>>();
            // 地鼠
            this._activityTime[LimitBigType.dishu] = 0;
            this._totalMoney[LimitBigType.dishu] = -1;
            this._openindex[LimitBigType.dishu] = 0;
            this._gradeRewardArray[LimitBigType.dishu] = new Array<Array<GetLimitLinkInfoReply_reward>>();
            // 新年
            this._activityTime[LimitBigType.year] = 0;
            this._totalMoney[LimitBigType.year] = -1;
            this._openindex[LimitBigType.year] = 0;
            this._gradeRewardArray[LimitBigType.year] = new Array<Array<GetLimitLinkInfoReply_reward>>();
        }

        public updateInfo(tuple: GetLimitLinkInfoReply): void {

            // console.log('vtz:updateInfo', tuple);
            let bigType: number = tuple[GetLimitLinkInfoReplyFields.bigType];
            this._totalMoney[bigType] = tuple[GetLimitLinkInfoReplyFields.totalMoney];
            this._rewardArr = tuple[GetLimitLinkInfoReplyFields.rewardList];
            let p_rp = false;
            let g_rp_1 = false;
            let g_rp_2 = false;
            let g_rp_3 = false;
            let _openindex_change = false;
            for (let i: int = 0, len: int = this._rewardArr.length; i < len; i++) {
                let reward: GetLimitLinkInfoReply_reward = this._rewardArr[i];
                let grade: number = reward[GetFishLinkInfoReply_rewardFields.grade];
                if (this._gradeRewardArray[bigType][grade] == null) {
                    this._gradeRewardArray[bigType][grade] = [];
                }
                this._gradeRewardArray[bigType][grade][reward[GetFishLinkInfoReply_rewardFields.day]] = reward;
                if (reward[GetFishLinkInfoReply_rewardFields.state] === 1) {
                    p_rp = true;
                    if (!_openindex_change) {
                        _openindex_change = true;
                        this._openindex[bigType] = reward[GetFishLinkInfoReply_rewardFields.grade];
                    }
                    switch (reward[GetFishLinkInfoReply_rewardFields.grade]) {
                        case 0:
                            g_rp_1 = true;
                            break;
                        case 1:
                            g_rp_2 = true;
                            break;
                        case 2:
                            g_rp_3 = true;
                            break;
                    }
                }
            }
            switch (bigType) {

                case LimitBigType.fish: redPoint.RedPointCtrl.instance.setRPProperty("fishLinkRP", p_rp);
                    break;

                case LimitBigType.year: redPoint.RedPointCtrl.instance.setRPProperty("YearLinkRP", p_rp);
                    break;
            }
            redPoint.RedPointCtrl.instance.setRPProperty("fishLinkRP_grade_1", g_rp_1);
            redPoint.RedPointCtrl.instance.setRPProperty("fishLinkRP_grade_2", g_rp_2);
            redPoint.RedPointCtrl.instance.setRPProperty("fishLinkRP_grade_3", g_rp_3);
            this._activityTime[bigType] = tuple[GetLimitLinkInfoReplyFields.endTime];
            this._progressList[bigType] = tuple[GetLimitLinkInfoReplyFields.progressList];
            GlobalData.dispatcher.event(CommonEventType.LIMIT_LINK_UPDATE);
        }

        public openindex(bigType: number): number {
            return this._openindex[bigType];
        }

        public totalMoney(bigType: number): number {
            return this._totalMoney[bigType];
        }

        // 获取第一个可以领取的档次
        public getOneTrue(bigType: number): number {
            let dangciNum = 0;
            for (var index = 0; index < this._gradeRewardArray[bigType].length; index++) {
                // console.log('vtz:this._gradeRewardArray[bigType]',this._gradeRewardArray[bigType]);
                var element = this._gradeRewardArray[bigType][index];
                for (var index1 = 0; index1 < element.length; index1++) {
                    // console.log('vtz:element', element);
                    var element1 = element[index1];
                    // console.log('vtz:element1', element1);
                    if (element1[GetFishLinkInfoReply_rewardFields.state] == 1) {
                        return index;
                    }
                }
            }
            return dangciNum;
        }

        // 根据档位获取奖励数组
        public getRewardsByGrade(bigType: number, grade: int): Array<GetLimitLinkInfoReply_reward> {
            return this._gradeRewardArray[bigType][grade];
        }

        // 根据档位和天数获取奖励
        public getRewardByGradeAndDay(bigType: number, grade: int, day: int): GetLimitLinkInfoReply_reward {
            return this._gradeRewardArray[bigType][grade] ? this._gradeRewardArray[bigType][grade][day] : null;
        }

        public activityTime(bigType: number): number {
            return this._activityTime[bigType];
        }

        public progressList(bigType: number): Array<ContinuepayProgress> {
            // console.log('vtz:this._progressList', this._progressList);
            return this._progressList[bigType];
        }
    }
}