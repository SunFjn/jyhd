/** 逐鹿首领战boss伤害奖励 */
///<reference path="../config/teamFightFor_boss_award_cfg.ts"/>
///<reference path="../common/custom_list.ts"/>

namespace modules.zhulu {
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import ZhuLuHeaderDamageAwardAlertUI = ui.ZhuLuHeaderDamageAwardAlertUI;
    import CustomList = modules.common.CustomList;
    import zhuluHeaderDamageAwardShow = Protocols.zhuluHeaderDamageAwardShow;

    import fightTeam_score_award = Configuration.fightTeam_score_award;
    import fightTeam_score_awardFields = Configuration.fightTeam_score_awardFields;

    import teamFightForScoreAwardCfg = modules.config.teamFightForScoreAwardCfg;
    import Items = Configuration.Items;

    export class ZhuLuHeaderScoreAwardAlert extends ZhuLuHeaderDamageAwardAlertUI {
        private _list: CustomList;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 45;
            this._list.y = 103;
            this._list.width = 582;
            this._list.height = 688;
            this._list.hCount = 1;
            this._list.itemRender = ZhuLuHeaderScoreAwardItem;
            this._list.spaceY = 0;
            this.addChild(this._list);
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZHULU_UPDATE_HWDAMAGE_LIST, this, this.updateView);
        }

        onOpened(): void {
            super.onOpened();
            this.nameTxt.text = '积分奖励'
            //请求数据
            ZhuLuCtrl.instance.GetTeamChiefScoreAwardList();
        }


        private updateView(): void {
            //可领取>未达成>已领取
            let indexs: Array<number> = ZhuLuModel.instance.scoreAwardList;  //已经领取的奖励
            if (!indexs) return;
            let scoreValue: number = ZhuLuModel.instance.score;
            let cfg: Array<fightTeam_score_award> = teamFightForScoreAwardCfg.instance.getAllCfg();
            if (!cfg) return;
            let len = cfg.length
            let thisIndexs: [number, operaState][] = [];
            for (let i: int = 0; i < len; i++) {
                let taskId = cfg[i][fightTeam_score_awardFields.taskId]
                let state: operaState;
                if (indexs.indexOf(taskId) == -1 && scoreValue >= cfg[i][fightTeam_score_awardFields.condition]) { //未领取并且可以领
                    state = operaState.can;
                } else if (indexs.indexOf(taskId) == -1 && scoreValue < cfg[i][fightTeam_score_awardFields.condition]) { //未领取不可以领
                    state = operaState.cant;
                } else if (indexs.indexOf(taskId) != -1) {
                    state = operaState.gone;
                }
                thisIndexs.push([i, state]);
            }
            thisIndexs = thisIndexs.sort(this.sortFunc.bind(this));
            this._list.datas = thisIndexs;
        }

        private sortFunc(a: [number, operaState], b: [number, operaState]): number {
            let aValue: number = a[0];
            let bValue: number = b[0];
            let aState: operaState = a[1];
            let bState: operaState = b[1];
            if (aState > bState) {
                return -1;
            } else if (aState < bState) {
                return 1;
            } else {
                return aValue < bValue ? -1 : 1;
            }
        }

    }
}