///<reference path="../common/common_util.ts"/>
///<reference path="../common_alert/equip_wear_alert.ts"/>
///<reference path="../common_alert/prop_use_alert.ts"/>
///<reference path="../config/scene_copy_dahuang_cfg.ts"/>

//大荒塔数据
namespace modules.bigTower {
    import LevelCopyData = Protocols.LevelCopyData;
    import LevelCopyDataFields = Protocols.LevelCopyDataFields;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import scene_copy_dahuang = Configuration.scene_copy_dahuang;
    import SceneCopyDahuangCfg = modules.config.SceneCopyDahuangCfg;
    import scene_copy_dahuangFields = Configuration.scene_copy_dahuangFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;

    export class BigTowerModel {
        private static _instance: BigTowerModel;
        public static get instance(): BigTowerModel {
            return this._instance = this._instance || new BigTowerModel();
        }

        public copyData: LevelCopyData;
        private _finishLevel: number = 0;    //完成层数

        public getCopyDahuangReply(copyDataDaHuang: LevelCopyData): void {
            this.copyData = copyDataDaHuang;
            this._finishLevel = copyDataDaHuang[LevelCopyDataFields.finishLevel];

            GlobalData.dispatcher.event(CommonEventType.GET_COPY_DAHUANG);
            this.checkRP();
        }

        public checkRP(): void {
            let flag: boolean = false;
            let cfg: scene_copy_dahuang = SceneCopyDahuangCfg.instance.getCfgByLv(this._finishLevel + 1)
            if (cfg) {
                let needFight: number = cfg[scene_copy_dahuangFields.recommendFighting];
                let fight: int = PlayerModel.instance.fight;
                let per: number = BlendCfg.instance.getCfgById(33002)[blendFields.intParam][0];
                if (per <= fight / needFight) {
                    flag = true;
                }
            }
            if (!flag) {
                if(this.copyData){
                    if (this.copyData[LevelCopyDataFields.award].length > 0 || this.copyData[LevelCopyDataFields.bigAward].length > 0) {
                        flag = true;
                    }
                }
            }
            RedPointCtrl.instance.setRPProperty("bigTowerRP", flag);
        }

        //返回已完成层数
        public get finishLevel(): number {
            return this._finishLevel;
        }
    }

}