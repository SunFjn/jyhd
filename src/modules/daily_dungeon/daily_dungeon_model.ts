/** 日常副本*/
namespace modules.dailyDungeon {

    import blendFields = Configuration.blendFields;
    export class DailyDungeonModel {
        private static _instance: DailyDungeonModel;
        public static get instance(): DailyDungeonModel {
            return this._instance = this._instance || new DailyDungeonModel();
        }
        public _awardAee: Array<Array<number>>;
        constructor() {
            this._awardAee = new Array<Array<number>>();
            let num1 = modules.config.BlendCfg.instance.getCfgById(10311)[blendFields.intParam];
            let num2 = modules.config.BlendCfg.instance.getCfgById(10312)[blendFields.intParam];
            let num3 = modules.config.BlendCfg.instance.getCfgById(10313)[blendFields.intParam];
            let num4 = modules.config.BlendCfg.instance.getCfgById(10314)[blendFields.intParam];
            let num5 = modules.config.BlendCfg.instance.getCfgById(10319)[blendFields.intParam];
            let num6 = modules.config.BlendCfg.instance.getCfgById(10320)[blendFields.intParam];
            let num7 = modules.config.BlendCfg.instance.getCfgById(10321)[blendFields.intParam];
            let num8 = modules.config.BlendCfg.instance.getCfgById(10322)[blendFields.intParam];
            let num9 = modules.config.BlendCfg.instance.getCfgById(10323)[blendFields.intParam];
            this._awardAee[SCENE_ID.scene_copper_copy] = num1;
            this._awardAee[SCENE_ID.scene_zq_copy] = num2;
            this._awardAee[SCENE_ID.scene_xianqi_copy] = num4;
            this._awardAee[SCENE_ID.scene_pet_copy] = num3;
            this._awardAee[SCENE_ID.scene_shenbing_copy] = num5;
            this._awardAee[SCENE_ID.scene_wing_copy] = num6;
            this._awardAee[SCENE_ID.scene_fashion_copy] = num7;
            this._awardAee[SCENE_ID.scene_tianzhu_copy] = num8;
            this._awardAee[SCENE_ID.scene_xilian_copy] = num9;
        }
        public getNum(type: number, yiSaoDangNum: number, sweepTotalTimes: number): Array<number> {
            let nowNum = 50;//下一次扫荡需要多少钱
            let zongNum = 0;//剩余扫荡总共需要多少钱
            let element = this._awardAee[type];
            if (element) {
                yiSaoDangNum = yiSaoDangNum ? yiSaoDangNum : 0;
                nowNum = element[yiSaoDangNum + 1];
                if (!nowNum) {
                    nowNum = element[element.length - 1];
                }
                //算出剩余 需要消耗的代币券     
                for (let dex = yiSaoDangNum + 1; dex <= sweepTotalTimes; dex++) {
                    let cionNum = element[dex];
                    if (!cionNum) {
                        cionNum = element[element.length - 1];
                    }
                    zongNum += cionNum;
                }
                return [nowNum, zongNum];
            }
            return [nowNum, zongNum];
        }
    }
}