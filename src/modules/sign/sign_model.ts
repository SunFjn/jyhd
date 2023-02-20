///<reference path="../config/sign_reward_cfg.ts"/>
/** 签到数据*/


///<reference path="../player/player_model.ts"/>
///<reference path="../config/sign_reward_cfg.ts"/>


namespace modules.sign {
    import sign_rewardFields = Configuration.sign_rewardFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import SignRewardCfg = modules.config.SignRewardCfg;
    import GetSignReply = Protocols.GetSignReply;
    import GetSignReplyFields = Protocols.GetSignReplyFields;


    export class SignModel {
        private static _instance: SignModel;
        public static get instance(): SignModel {
            return this._instance = this._instance || new SignModel();
        }

        //当前觉醒等级
        private _eraLevel: int;
        // 当前签到次数
        private _signCount: int;
        // 累计可领次数
        private _addCount: Array<number>;
        //签到状态
        private _signBool: boolean;
        private _signReply: number;
        //当月天数
        private _dayNumber: int;
        private _redDot: boolean;

        constructor() {
        }

        //签到状态
        public get signBool(): boolean {
            return this._signBool;
        }

        public set signBool(value: boolean) {
            this._signBool = value;
        }

        // 当前签到次数
        public get signCount(): int {
            return this._signCount;
        }

        public set signCount(value: int) {
            this._signCount = value;

        }

        //本月天数
        public get dayNumber(): int {
            return this._dayNumber;
        }

        public set dayNumber(value: int) {
            this._dayNumber = value;
        }

        // 当前累计可领奖次数
        public get addCount(): Array<number> {
            return this._addCount;
        }

        public set addCount(value: Array<number>) {
            this._addCount = value;
        }

        //觉醒等级
        public set eraLevel(value: int) {
            this._eraLevel = value;
        }

        public get eraLevel(): int {
            return this._eraLevel;
        }

        public get SignReply(): number {
            return this._signReply;
        }

        public set SignReply(value: number) {
            this._signReply = value;
        }

        public getSign(tuple: GetSignReply): void {
            this.dayNumber = tuple[GetSignReplyFields.dayNumber];
            this.signCount = tuple[GetSignReplyFields.theNumber];
            this.signBool = tuple[GetSignReplyFields.signTag];
            this.addCount = tuple[GetSignReplyFields.accIndex];
            this.eraLevel = tuple[GetSignReplyFields.eraLevel];
            this.setDotDic();

        }

        private setDotDic(): void {
            let addCountArr: Array<Configuration.sign_reward>;
            addCountArr = SignRewardCfg.instance.getCfgByReward(this.eraLevel);
            let state: number;//0未签，1可签，2已签
            for (let i = 0; i < 5; i++) {
                let needNum = addCountArr[i][sign_rewardFields.count];
                if (this.signCount >= needNum) {
                    if (i + 1 > this.addCount.length || this.addCount.length == 0) {
                        state = 1;
                    }
                }
            }
            let signNumber = SignModel.instance.signCount;
            let dayNumber = SignModel.instance.dayNumber;
            if (SignModel.instance.signBool == true || signNumber == 0 || state == 1) {
                this._redDot = true;
            } else {
                this._redDot = false;
            }


            RedPointCtrl.instance.setRPProperty("signRP", this._redDot);
        }
    }
}