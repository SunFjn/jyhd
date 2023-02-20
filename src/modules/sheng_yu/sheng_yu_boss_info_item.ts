/**圣域boss头像Item*/


///<reference path="../config/scene_copy_single_boss_cfg.ts"/>
///<reference path="../config/scene_temple_boss_cfg.ts"/>
///<reference path="../config/monster_res_cfg.ts"/>

namespace modules.sheng_yu {
    import CommonUtil = modules.common.CommonUtil;
    import CustomClip = modules.common.CustomClip;
    import scene_temple_boss = Configuration.scene_temple_boss;
    import scene_temple_bossFields = Configuration.scene_temple_bossFields;
    import MonsterResCfg = modules.config.MonsterResCfg;
    import MonsterResFields = Configuration.MonsterResFields;
    import BossState = Protocols.BossState;
    import BossStateFields = Protocols.BossStateFields;
    import DungeonModel = modules.dungeon.DungeonModel;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    export class ShengYuBossInfoItem extends ui.ShengYuBossInfoItemUI {
        private _challengeClip: CustomClip;
        private _restTm: number;
        private _datas: scene_temple_boss;
        private _isDead: boolean;
        private _skeleton: Laya.Skeleton;


        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this._restTm = 0;
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_BOSS_UPDATE, this, this.updateState);

        }

        protected removeListeners(): void {
            super.removeListeners();
        }
        protected setData(value: scene_temple_boss): void {
            super.setData(value);
            if (!value) {
                return;
            }
            this._isDead = false;
            this._datas = value;
            this.showUI();
            this.updateState();
        }
        protected onOpened(): void {
            super.onOpened();

        }
        public showUI() {
            let occ = this._datas[scene_temple_bossFields.occ];//限制的 觉醒等级 
            let monsterCfg = MonsterResCfg.instance.getCfgById(occ);
            let skInfo = ExteriorSKCfg.instance.getCfgById(monsterCfg[MonsterResFields.res])
            this.bossHead.skin = "assets/icon/bossImage/" + skInfo[ExteriorSKFields.portrayal] + ".png";
            let temp=this._datas[scene_temple_bossFields.eraTips];
            if(temp=="未觉醒"){
                this.level.text=`未觉醒`
            }else{
                this.level.text=`觉醒${this._datas[scene_temple_bossFields.eraTips]}`
            }
            
        }
        public updateState() {
            this.fuHuoTimeBgImg.visible = this.fuHuoTimeText.visible = false;
            let occ = this._datas[scene_temple_bossFields.occ];//限制的 觉醒等级 
            let bossstate: Protocols.BossInfo = DungeonModel.instance.getBossInfoById(occ);
            if (bossstate) {
                let info: BossState = bossstate[Protocols.BossInfoFields.bossState];
                if (info[BossStateFields.dead] && !this._isDead) {
                    let time = info[BossStateFields.reviveTime];
                    if (time <= 0) {
                        return;
                    }
                    this._restTm = time;
                    this._isDead = true;
                } else if (!info[BossStateFields.dead] && this._isDead) {
                    this._isDead = false;
                }
                this.setActivitiTime();
            }
        }
        private setActivitiTime(): void {
            Laya.timer.clear(this, this.activityHandler);
            if (this._restTm >= GlobalData.serverTime && this._isDead) {
                this.fuHuoTimeBgImg.visible = this.fuHuoTimeText.visible = true;
                this.activityHandler();
                Laya.timer.loop(1000, this, this.activityHandler);
            } else {
                this.fuHuoTimeBgImg.visible = this.fuHuoTimeText.visible = false;
            }
        }

        private activityHandler(): void {
            this.fuHuoTimeText.text = `${CommonUtil.timeStampToMMSS(this._restTm)}`;
            if (this._restTm < GlobalData.serverTime) {
                this.fuHuoTimeBgImg.visible = this.fuHuoTimeText.visible = false;
                Laya.timer.clear(this, this.activityHandler);
            }
        }
        public close(): void {
            super.close();
            Laya.timer.clear(this, this.activityHandler);
        }


        private challengeHandler(): void {

        }
    }
}