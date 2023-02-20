/** 连充豪礼 */
namespace modules.continue_pay {
    import UpdateContinuepayInfo = Protocols.UpdateContinuepayInfo;
    import ContinuepayReward = Protocols.ContinuepayReward;
    import UpdateContinuepayInfoFields = Protocols.UpdateContinuepayInfoFields;
    import ContinuepayProgress = Protocols.ContinuepayProgress;
    import ContinuepayRewardFields = Protocols.ContinuepayRewardFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class ContinuePayModel {
        private static _instance: ContinuePayModel;
        public static get instance(): ContinuePayModel {
            return this._instance = this._instance || new ContinuePayModel();
        }

        /*首充通道开启状态(0未开启 1预备 2开启)*/
        private _giveState: number;
        // 活动结束时间
        private _endTime: number;
        //充值金额
        private _totalMoney: number;
        //每档进度
        private _progressList: Array<ContinuepayProgress>;
        private _rewardArr: Array<ContinuepayReward>;
        // 档位对应数组
        private _gradeRewardArray: Array<Array<ContinuepayReward>>;

        constructor() {
            this._giveState = -1;
            this._endTime = 0;
            this._totalMoney = -1;
            this._rewardArr = [];
            this._gradeRewardArray = new Array<Array<ContinuepayReward>>();
        }

        public updateInfo(tuple: UpdateContinuepayInfo): void {
            this._giveState = tuple[UpdateContinuepayInfoFields.state];
            this._totalMoney = tuple[UpdateContinuepayInfoFields.totalMoney];
            this._rewardArr = tuple[UpdateContinuepayInfoFields.rewardList];
            let gradeRP1: boolean = false;
            let gradeRP2: boolean = false;
            let gradeRP3: boolean = false;
            for (let i: int = 0, len: int = this._rewardArr.length; i < len; i++) {
                let reward: ContinuepayReward = this._rewardArr[i];
                let grade: number = reward[ContinuepayRewardFields.grade];
                if (this._gradeRewardArray[grade] == null) {
                    this._gradeRewardArray[grade] = [];
                }
                this._gradeRewardArray[grade][reward[ContinuepayRewardFields.day]] = reward;
                if (reward[ContinuepayRewardFields.state] === 1) {
                    if (grade === 0) {
                        gradeRP1 = true;
                    } else if (grade === 1) {
                        gradeRP2 = true;
                    } else if (grade === 2) {
                        gradeRP3 = true;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("continuePayRP", gradeRP1 || gradeRP2 || gradeRP3);
            RedPointCtrl.instance.setRPProperty("continuePayGrade1RP", gradeRP1);
            RedPointCtrl.instance.setRPProperty("continuePayGrade2RP", gradeRP2);
            RedPointCtrl.instance.setRPProperty("continuePayGrade3RP", gradeRP3);
            this._endTime = tuple[UpdateContinuepayInfoFields.endTime];
            this._progressList = tuple[UpdateContinuepayInfoFields.progressList];
            GlobalData.dispatcher.event(CommonEventType.CONTINUE_PAY_UPDATE);
        }

        public get getgiveState(): number {
            return this._giveState;
        }

        public get totalMoney(): number {
            return this._totalMoney;
        }

        // 获取第一个可以领取的档次
        public getOneTrue(): number {
            let dangciNum = 0;
            for (var index = 0; index < this._gradeRewardArray.length; index++) {
                var element = this._gradeRewardArray[index];
                for (var index1 = 0; index1 < element.length; index1++) {
                    var element1 = element[index1];
                    if (element1[ContinuepayRewardFields.state] == 1) {
                        return index;
                    }
                }
            }
            return dangciNum;
        }

        // 根据档位获取奖励数组
        public getRewardsByGrade(grade: int): Array<ContinuepayReward> {
            return this._gradeRewardArray[grade];
        }

        // 根据档位和天数获取奖励
        public getRewardByGradeAndDay(grade: int, day: int): ContinuepayReward {
            return this._gradeRewardArray[grade] ? this._gradeRewardArray[grade][day] : null;
        }

        public get endTime(): number {
            return this._endTime;
        }

        public get progressList(): Array<ContinuepayProgress> {
            return this._progressList;
        }
    }
}