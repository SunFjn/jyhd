/** 逐鹿首领战boss伤害奖励 */
///<reference path="../config/teamFightFor_boss_award_cfg.ts"/>
///<reference path="../common/custom_list.ts"/>

namespace modules.zhulu {
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import ZhuLuHeaderDamageAwardAlertUI = ui.ZhuLuHeaderDamageAwardAlertUI;
    import CustomList = modules.common.CustomList;
    import zhuluHeaderDamageAwardShow = Protocols.zhuluHeaderDamageAwardShow;

    import fightTeam_boss_awardFields = Configuration.fightTeam_boss_awardFields;
    import fightTeam_boss_award = Configuration.fightTeam_boss_award;
    import teamFightForBossAwardCfg = modules.config.teamFightForBossAwardCfg;
    import Items = Configuration.Items;

    export class ZhuLuHeaderDamageAwardAlert extends ZhuLuHeaderDamageAwardAlertUI {
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
            this._list.itemRender = ZhuLuHeaderDamageAwardItem;
            this._list.spaceY = 0;
            this.addChild(this._list);
        }


        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ZHULU_UPDATE_HWDAMAGE_LIST, this, this.updateView);
        }

        onOpened(): void {
            super.onOpened();
            this.nameTxt.text = '伤害奖励'
            //请求数据
            ZhuLuCtrl.instance.GetTeamChiefHurtAwardList();
        }


        private updateView(): void {
            //可领取>未达成>已领取
            let indexs: Array<number> = ZhuLuModel.instance.hurtAwardList;  //已经领取的奖励
            if (!indexs) {
                console.log('研发测试_chy:返回', 1);
                return;
            }
            let damageValue: number = ZhuLuModel.instance.hurt;
            let cfg: Array<fightTeam_boss_award> = teamFightForBossAwardCfg.instance.getAllCfg();
            if (!cfg) {
                console.log('研发测试_chy:返回', 2);
                return;
            }
            let len = cfg.length
            let thisIndexs: [number, operaState][] = [];
            for (let i: int = 0; i < len; i++) {
                let taskId = cfg[i][fightTeam_boss_awardFields.taskId]
                let state: operaState;
                if (indexs.indexOf(taskId) == -1 && damageValue >= cfg[i][fightTeam_boss_awardFields.condition]) { //未领取并且可以领
                    state = operaState.can;
                } else if (indexs.indexOf(taskId) == -1 && damageValue < cfg[i][fightTeam_boss_awardFields.condition]) { //未领取不可以领
                    state = operaState.cant;
                } else if (indexs.indexOf(taskId) != -1) {
                    state = operaState.gone;
                }
                thisIndexs.push([i, state]);
            }
            thisIndexs = thisIndexs.sort(this.sortFunc.bind(this));
            this._list.datas = thisIndexs;

            // let hurt: string = CommonUtil.bigNumToString(damageValue);
            // this.txt.text = `今日累计诛仙伤害:${hurt}`;
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