/**单人boss数据*/


namespace modules.single_boss {
    import SingleBossCopy = Protocols.SingleBossCopy;
    import Dictionary = Laya.Dictionary;
    import SingleBossCopyFields = Protocols.SingleBossCopyFields;
    import PlayerModel = modules.player.PlayerModel;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import SceneCopySingleBossCfg = modules.config.SceneCopySingleBossCfg;
    import scene_copy_single_bossFields = Configuration.scene_copy_single_bossFields;
    import UserFeatureOpcode = Protocols.UserFeatureOpcode;

    export class SingleBossModel {
        private static _instance: SingleBossModel;
        public _redDot: boolean;

        public static get instance(): SingleBossModel {
            return this._instance = this._instance || new SingleBossModel();
        }

        private _singleBossArr: Array<SingleBossCopy>;
        private _updatesingleBossArr: Array<any>;
        private _singledic: Dictionary;

        private constructor() {
            this._singledic = new Dictionary();
        }


        public get SingleBossCopy(): Array<SingleBossCopy> {
            return this._singleBossArr;
        }

        public set SingleBossCopy(value: Array<SingleBossCopy>) {
            this._singleBossArr = value;
            let minCD:number = 0;
            for (let i = 0; i < this._singleBossArr.length; i++) {
                this._singledic.set(this._singleBossArr[i][SingleBossCopyFields.level], this._singleBossArr[i]);
                let cd:number = this._singleBossArr[i][SingleBossCopyFields.reviveTime] - GlobalData.serverTime;
                if(cd > 0){
                    minCD = minCD === 0 ? cd : cd < minCD ? cd : minCD;
                }
            }
            minCD > 0 && Laya.timer.once(minCD, this, this.refreshData);
            this.setDotDic();
            GlobalData.dispatcher.event(CommonEventType.GET_SINGLE_BOSS);
        }

        private refreshData():void{
            Channel.instance.publish(UserFeatureOpcode.GetSingleBossCopy, null);
        }

        public get UpdateSingleBossCopy(): Array<SingleBossCopy> {
            return this._updatesingleBossArr;
        }

        public set UpdateSingleBossCopy(value: Array<SingleBossCopy>) {
            this._updatesingleBossArr = value;
            for (let i = 0; i < this._updatesingleBossArr.length; i++) {
                let singleBoss: SingleBossCopy = this._updatesingleBossArr[i];
                // let singleBoss:SingleBossCopy=this._singledic.get(this._updatesingleBossArr[i][SingleBossCopyFields.level]);
                this._singledic.set(singleBoss[SingleBossCopyFields.level], singleBoss);
            }
            this.setDotDic();
            GlobalData.dispatcher.event(CommonEventType.UPDATE_SINGLE_BOSS);
        }

        public getSingleBossDic() {
            if (this._singledic != null) {
                return this._singledic;
            }
        }

        private setDotDic(): void {
            let num: number = 0;
            let singleBossArr: Array<SingleBossCopy> = this._singleBossArr;
            if (!singleBossArr) {
                return;
            }
            let singelDic = this._singledic;
            for (let i = 0; i < singleBossArr.length; i++) {
                let singleBossCfg = singelDic.get(singleBossArr[i][SingleBossCopyFields.level]);
                let count: number = singleBossCfg[SingleBossCopyFields.level];
                let bossCfg = SceneCopySingleBossCfg.instance.getCfgByLv(count - 1);
                let needEraLv = bossCfg[scene_copy_single_bossFields.eraLevel];
                let needLv = bossCfg[scene_copy_single_bossFields.actorLevel];
                if (PlayerModel.instance.eraLevel >= needEraLv && PlayerModel.instance.level >= needLv && singleBossCfg[SingleBossCopyFields.remainTimes] > 0) {
                    if (GlobalData.serverTime - singleBossCfg[SingleBossCopyFields.reviveTime] > 0) {
                        num++;
                    }
                }
            }
            this._redDot = num > 0;
            RedPointCtrl.instance.setRPProperty("singleBossRP", this._redDot);
        }
    }
}