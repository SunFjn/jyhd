namespace modules.dailyDemon {
    import updateXiangyaoDataReply = Protocols.updateXiangyaoDataReply;
    import updateXiangyaoDataReplyFields = Protocols.updateXiangyaoDataReplyFields;
    import xiangyao = Configuration.xiangyao;
    import xiangyaoFields = Configuration.xiangyaoFields;
    import DailyDemonCfg = modules.config.DailyDemonCfg;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;

    export class DailyDemonModel {
        private static _instance: DailyDemonModel;
        public static get instance(): DailyDemonModel {
            return this._instance = this._instance || new DailyDemonModel();
        }

        /** 参数0 为小怪 1 为Boss */
        private _killNumber: [number, number]; //击杀数量
        private _grade: [number, number];      //档次
        private _receivedTimes: [number, number];  //领取次数
        private _maxReceivedTimes: [number, number]; //最大领取次数
        private _bornLv: number; //觉醒等级

        constructor() {
            this._killNumber = [0, 0];
            this._grade = [1, 1];
            this._receivedTimes = [0, 0];
        }

        public saveData(tuple: updateXiangyaoDataReply): void {
            this._killNumber = [tuple[updateXiangyaoDataReplyFields.killedMonsterNumber], tuple[updateXiangyaoDataReplyFields.killedBossNumber]];
            this._grade = [tuple[updateXiangyaoDataReplyFields.receiveMonsterTimes] + 1, tuple[updateXiangyaoDataReplyFields.receiveBossTimes] + 1];
            this._receivedTimes = [tuple[updateXiangyaoDataReplyFields.receiveMonsterTimes], tuple[updateXiangyaoDataReplyFields.receiveBossTimes]];
            this._maxReceivedTimes = [tuple[updateXiangyaoDataReplyFields.monsterMaxTimes], tuple[updateXiangyaoDataReplyFields.bossMaxTimes]];
            this._bornLv = tuple[updateXiangyaoDataReplyFields.eraLevel];

            this.checkRP();
            GlobalData.dispatcher.event(CommonEventType.DAILY_DEMON_UPDATE);
        }

        public get bornLv(): number {
            return this._bornLv;
        }

        public checkRP(): void {

            let earLv: number = this._bornLv;
            let currkillNum: number = this._killNumber[XiangyaoType.monster];
            let grade: number = this._grade[XiangyaoType.monster];
            let cfg: xiangyao = DailyDemonCfg.instance.getLittleCfgByEraLvAndGrade(earLv, grade);
            let nextCfg: xiangyao = DailyDemonCfg.instance.getLittleCfgByEraLvAndGrade(earLv, grade + 1);
            let maxNum: number;

            let currTime: number = DailyDemonModel.instance.receivedTimes[XiangyaoType.monster];
            let maxTime: number = DailyDemonModel.instance.maxReceivedTimes[XiangyaoType.monster];
            let currTimeboss: number = DailyDemonModel.instance.receivedTimes[XiangyaoType.boss];
            let maxTimeboss: number = DailyDemonModel.instance.maxReceivedTimes[XiangyaoType.boss];
            if (currTime < maxTime) {
                if (nextCfg) {   //有下一档次 且 杀怪封顶
                    maxNum = cfg[xiangyaoFields.param];
                    if (currkillNum >= maxNum) {
                        RedPointCtrl.instance.setRPProperty("dailyDemonRP", true);
                        return;
                    }
                }
            }
            if (currTimeboss < maxTimeboss) {
                currkillNum = this._killNumber[XiangyaoType.boss];
                grade = this._grade[XiangyaoType.boss];
                cfg = DailyDemonCfg.instance.getBossCfgByEraLvAndGrade(earLv, grade);
                nextCfg = DailyDemonCfg.instance.getBossCfgByEraLvAndGrade(earLv, grade + 1);
                if (nextCfg) {
                    maxNum = cfg[xiangyaoFields.param];
                    if (currkillNum >= maxNum) {
                        RedPointCtrl.instance.setRPProperty("dailyDemonRP", true);
                        return;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("dailyDemonRP", false);
        }

        public get killNumber(): [number, number] {
            return this._killNumber;
        }

        public get grade(): [number, number] {
            return this._grade;
        }

        public get receivedTimes(): [number, number] {
            return this._receivedTimes;
        }

        public get maxReceivedTimes(): [number, number] {
            return this._maxReceivedTimes;
        }
    }
}