namespace modules.year {
    import limit_xunbao_cumulative_task_cfg = Configuration.limit_xunbao_cumulative_task_cfg;
    import limit_xunbao_cumulative_task_cfgField = Configuration.limit_xunbao_cumulative_task_cfgField;
    import CelebrationHuntScoreRewardShow = Protocols.CelebrationHuntScoreRewardShow;
    import FishModel = modules.fish.FishModel;
    export class YearScoreAlert extends modules.ceremony_geocaching.CeremonyGeocachingScoreAwardAlert {

        protected get tasksmalltype(): LimitTaskSmallType {
            return LimitTaskSmallType.cjjf;
        }

        protected get weighttype(): LimitWeightType {
            return LimitWeightType.year;
        }

        protected updateView() {
            let arr: limit_xunbao_cumulative_task_cfg[] = LimitReapCfg.instance.getDataBySmallType(this.tasksmalltype);
            let data: CelebrationHuntScoreRewardShow[] = new Array();
            for (let key in arr) {
                let color: string = FishModel.instance.getScoreByType(this.weighttype) >= arr[key][limit_xunbao_cumulative_task_cfgField.taskCondition] ? "#168a17" : "red";
                data.push([arr[key][limit_xunbao_cumulative_task_cfgField.id], `<div style="width:500px;height:25px; fontSize:21; color:black"><span>积分达到</span><span style="color:#168a17;">${arr[key][limit_xunbao_cumulative_task_cfgField.taskCondition]}</span><span>可领取</span><span style="color:${color};">(${FishModel.instance.getScoreByType(this.weighttype)}/${arr[key][limit_xunbao_cumulative_task_cfgField.taskCondition]})</span></div>`, arr[key][limit_xunbao_cumulative_task_cfgField.rewards][0]])
            }
            this._list.datas = data;
        }

    }
}