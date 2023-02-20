/** 竞技场挑战记录单元项*/


namespace modules.arena {
    import ChallengeRecord = Protocols.ChallengeRecord;
    import ArenaRecordsItemUI = ui.ArenaRecordsItemUI;
    import ChallengeRecordFields = Protocols.ChallengeRecordFields;

    export class ArenaRecordsItem extends ArenaRecordsItemUI {
        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.contentTxt.color = "#344c6f";
            this.contentTxt.style.fontSize = 24;
            this.contentTxt.style.fontFamily = "SimHei";
            this.contentTxt.mouseEnabled = false;
        }

        protected setData(value: any): void {
            super.setData(value);
            let record: ChallengeRecord = value;
            let win: boolean = record[ChallengeRecordFields.win];
            let arr: Array<string> = [];
            let isChallenged: boolean = record[ChallengeRecordFields.enemyChallenger]; // 是否被挑战
            if (isChallenged) {      //被挑战 敌方是挑战者
                arr[0] = `${record[ChallengeRecordFields.name]}挑战您`;
            } else {
                arr[0] = `您挑战${record[ChallengeRecordFields.name]}`;
            }
            arr[1] = `${win !== isChallenged ? "成功" : "失败"}，`;
            let rankChange: number = record[ChallengeRecordFields.afterRank] - record[ChallengeRecordFields.beforeRank];
            if (rankChange < 0) rankChange = -rankChange;
            arr[2] = rankChange === 0 ? "排名不变。" : win ? `排名上升<span color="#168a17">${rankChange}</span>。` : `排名下降<span color="#ff3e3e">${rankChange}</span>。`;
            this.contentTxt.innerHTML = arr.join("");
            this.timeTxt.text = CommonUtil.timeStampToDate(record[ChallengeRecordFields.time]);
            this.resultImg.skin = win ? "arena/image_qxjj_s.png" : "arena/image_qxjj_f.png";
            this.upImg.skin = rankChange === 0 ? "common/zs_tongyong_16.png" : win ? "common/zs_tongyong_3.png" : "common/zs_tongyong_5.png";
            this.rankTxt.text = `${record[ChallengeRecordFields.beforeRank]}`;
        }
    }
}
