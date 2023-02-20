/** 连充豪礼 */
namespace modules.ceremony_cash {
    import GetCeremonyContinuepayInfoReply = Protocols.GetCeremonyContinuepayInfoReply;
    import CeremonyContinuepayReward = Protocols.CeremonyContinuepayReward;
    import GetCeremonyContinuepayInfoReplyFields = Protocols.GetCeremonyContinuepayInfoReplyFields;
    import ContinuepayProgress = Protocols.ContinuepayProgress;
    import CeremonyContinuepayRewardFields = Protocols.CeremonyContinuepayRewardFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class CeremonyContinuePayModel {
        private static _instance: CeremonyContinuePayModel;
        public static get instance(): CeremonyContinuePayModel {
            return this._instance = this._instance || new CeremonyContinuePayModel();
        }

        // 活动结束时间
        private _endTime: number;
        //充值金额
        private _totalMoney: number;
        //每档进度
        private _progressList: Array<ContinuepayProgress>;
        private _rewardArr: Array<CeremonyContinuepayReward>;
        // 档位对应数组
        private _gradeRewardArray: Array<Array<CeremonyContinuepayReward>>;

        constructor() {
            this._endTime = 0;
            this._totalMoney = -1;
            this._rewardArr = [];
            this._gradeRewardArray = new Array<Array<CeremonyContinuepayReward>>();
        }

        public updateInfo(tuple: GetCeremonyContinuepayInfoReply): void {
            // console.log('vtz:updateInfo', tuple);
            this._totalMoney = tuple[GetCeremonyContinuepayInfoReplyFields.totalMoney];
            this._rewardArr = tuple[GetCeremonyContinuepayInfoReplyFields.rewardList];
            let gradeRP0: boolean = false;
            let gradeRP1: boolean = false;
            let gradeRP2: boolean = false;
            // let gradeRP3: boolean = false;
            // let gradeRP4: boolean = false;
            // let gradeRP5: boolean = false;
            for (let i: int = 0, len: int = this._rewardArr.length; i < len; i++) {
                let reward: CeremonyContinuepayReward = this._rewardArr[i];
                let grade: number = reward[CeremonyContinuepayRewardFields.grade];
                if (this._gradeRewardArray[grade] == null) {
                    this._gradeRewardArray[grade] = [];
                }
                this._gradeRewardArray[grade][reward[CeremonyContinuepayRewardFields.day]] = reward;
                if (reward[CeremonyContinuepayRewardFields.state] === 1) {
                    if (grade === 0) {
                        gradeRP0 = true;
                    } else if (grade === 1) {
                        gradeRP1 = true;
                    } else if (grade === 2) {
                        gradeRP2 = true;
                    }
                    // else if (grade === 3) {
                    //     gradeRP3 = true;
                    // } else if (grade === 4) {
                    //     gradeRP4 = true;
                    // } else if (grade === 5) {
                    //     gradeRP5 = true;
                    // }
                }
            }
            // || gradeRP3 ||gradeRP4 || gradeRP5
            RedPointCtrl.instance.setRPProperty("ceremonyContinuePayRP", gradeRP0 || gradeRP1 || gradeRP2);
            RedPointCtrl.instance.setRPProperty("ceremonyContinuePayGrade0RP", gradeRP0);
            RedPointCtrl.instance.setRPProperty("ceremonyContinuePayGrade1RP", gradeRP1);
            RedPointCtrl.instance.setRPProperty("ceremonyContinuePayGrade2RP", gradeRP2);
            // RedPointCtrl.instance.setRPProperty("ceremonyContinuePayGrade3RP", gradeRP3);
            // RedPointCtrl.instance.setRPProperty("ceremonyContinuePayGrade4RP", gradeRP4);
            // RedPointCtrl.instance.setRPProperty("ceremonyContinuePayGrade5RP", gradeRP5);
            this._endTime = tuple[GetCeremonyContinuepayInfoReplyFields.endTime] + GlobalData.serverTime;
            this._progressList = tuple[GetCeremonyContinuepayInfoReplyFields.progressList];
            GlobalData.dispatcher.event(CommonEventType.CEREMONY_CONTINUE_PAY_UPDATE);
        }

        public get totalMoney(): number {
            return this._totalMoney;
        }

        // 获取第一个可以领取的档次
        public getOneTrue(): number {
            let dangciNum = 0;
            for (var index = 0; index < this._gradeRewardArray.length; index++) {
                // console.log('vtz:this._gradeRewardArray',this._gradeRewardArray);
                var element = this._gradeRewardArray[index];
                for (var index1 = 0; index1 < element.length; index1++) {
                    // console.log('vtz:element', element);
                    var element1 = element[index1];
                    // console.log('vtz:element1', element1);
                    if (element1[CeremonyContinuepayRewardFields.state] == 1) {
                        return index;
                    }
                }
            }
            return dangciNum;
        }

        // 根据档位获取奖励数组
        public getRewardsByGrade(grade: int): Array<CeremonyContinuepayReward> {
            return this._gradeRewardArray[grade];
        }

        // 根据档位和天数获取奖励
        public getRewardByGradeAndDay(grade: int, day: int): CeremonyContinuepayReward {
            return this._gradeRewardArray[grade] ? this._gradeRewardArray[grade][day] : null;
        }

        public get endTime(): number {
            return this._endTime;
        }

        public get progressList(): Array<ContinuepayProgress> {
            // console.log('vtz:this._progressList', this._progressList);
            return this._progressList;
        }
    }
}