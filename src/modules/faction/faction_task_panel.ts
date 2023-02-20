///<reference path="../config/faction_boss_award_cfg.ts"/>
/** 仙盟任务面板 */
namespace modules.faction {
    import FactionTaskViewUI = ui.FactionTaskViewUI;
    import CustomList = modules.common.CustomList;
    import FactionBossAwardCfg = modules.config.FactionBossAwardCfg;
    import faction_boss_award = Configuration.faction_boss_award;
    import faction_boss_awardFields = Configuration.faction_boss_awardFields;

    export class FactionTaskPanel extends FactionTaskViewUI {

        private _list: CustomList;

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;

            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.x = 46;
            this._list.y = 120;
            this._list.width = 625;
            this._list.height = 900;
            this._list.hCount = 1;
            this._list.itemRender = FactionTaskItem;
            this._list.spaceY = 5;
            this.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.FACTION_HURT_INFO, this, this.updateView);
        }

        public onOpened(): void {
            super.onOpened();
            FactionCtrl.instance.getHurtAwardList();

            this.updateView();
        }

        private updateView(): void {
            //可领取>未达成>已领取
            let indexs: Array<number> = FactionModel.instance.hurtAwardList;  //已经领取的奖励
            if (!indexs) return;
            let damageValue: number = FactionModel.instance.hurt;
            let lv: number = FactionModel.instance.lv;
            let cfg: faction_boss_award = FactionBossAwardCfg.instance.getCfgBylv(lv);
            if (!cfg) return;
            let values: number[] = cfg[faction_boss_awardFields.value];
            let len: number = values.length;
            let thisIndexs: [number, operaState][] = [];
            for (let i: int = 0; i < len; i++) {
                let state: operaState;
                if (indexs.indexOf(i) == -1 && damageValue >= values[i]) { //未领取并且可以领
                    state = operaState.can;
                } else if (indexs.indexOf(i) == -1 && damageValue < values[i]) { //未领取不可以领
                    state = operaState.cant;
                } else if (indexs.indexOf(i) != -1) {
                    state = operaState.gone;
                }
                thisIndexs.push([i, state]);
            }
            thisIndexs = thisIndexs.sort(this.sortFunc.bind(this));
            this._list.datas = thisIndexs;

            let hurt: string = CommonUtil.bigNumToString(damageValue);
            this.txt.text = `今日累计挑战伤害:${hurt}`;
        }

        private sortFunc(a: [number, operaState], b: [number, operaState]): number {
            let aValue:number = a[0];
            let bValue:number = b[0];
            let aState:operaState = a[1];
            let bState:operaState = b[1];
            if(aState>bState){
                return -1;
            }else if(aState<bState){
                return 1;
            }else{
                return aValue < bValue ? -1:1;
            }
        }

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            super.destroy(destroyChild);
        }
    }
}