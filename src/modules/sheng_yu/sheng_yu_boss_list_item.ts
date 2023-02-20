/**单人boss单元项*/
///<reference path="../config/monster_res_cfg.ts"/>
///<reference path="../config/scene_temple_boss_cfg.ts"/>
namespace modules.sheng_yu {
    import BossState = Protocols.BossState;
    import BossStateFields = Protocols.BossStateFields;
    import MonsterRes = Configuration.MonsterRes;
    import MonsterResFields = Configuration.MonsterResFields;
    import scene_temple_bossFields = Configuration.scene_temple_bossFields;
    import MonsterResCfg = modules.config.MonsterResCfg;
    export class ShengYuBossListItemItem extends ui.BossListItemUI {
        constructor() {
            super();
        }
        protected initialize(): void {
            super.initialize();
            this.updateState();
        }
        private _bossId: number;
        private _reviveTime: number;
        private _isDead: boolean;

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_BOSS_UPDATE, this, this.updateInfo);
        }

        protected removeListeners(): void {
            super.removeListeners();
            Laya.timer.clear(this, this.loopHandler);
        }
        protected setData(value: any): void {
            super.setData(value);
            if (!value) {
                return;
            }
            let occ = value[scene_temple_bossFields.occ];//限制的 觉醒等级 
            this._bossId = occ;
            this._reviveTime = 0;
            // this.selectShow();
            if (this.selected) {
                this.isSelect.visible = true;
            } else {
                this.isSelect.visible = false;
            }
            let cfg: MonsterRes = MonsterResCfg.instance.getCfgById(this._bossId);
            this.bossName.text = cfg[MonsterResFields.name];//读数据
            this.bossLevel.text = `Lv.${cfg[MonsterResFields.level]}`;
            this.hasRefreshTxt.visible = true;
            this.remainTime.visible = false;
            this._isDead = false;
            this.updateState();
        }
        protected setSelected(value: boolean): void {
            if (DungeonModel.instance.bossIsLive(this._bossId)) {
                return;
            }
            super.setSelected(value);
            this.selectShow();
        }
        private selectShow(): void {
            if (this.selected) {
                this.isSelect.visible = true;
                if (this._bossId) {
                    ShengYuBossModel.instance.setSelectTarget(this._bossId, true);
                    // WindowManager.instance.open(WindowEnum.BELONG_PANEL);
                }
            } else {
                this.isSelect.visible = false;
            }
        }
        private updateInfo(): void {
            this.updateState();
        }
        private updateState(): void {
            let bossstate: Protocols.BossInfo = DungeonModel.instance.getBossInfoById(this._bossId);
            if (bossstate) {
                let info: BossState = bossstate[Protocols.BossInfoFields.bossState];
                if (info[BossStateFields.dead] && !this._isDead) {
                    Laya.timer.clear(this, this.loopHandler);
                    this._reviveTime = info[BossStateFields.reviveTime];
                    let time = this._reviveTime - GlobalData.serverTime;
                    if (time <= 0) {
                        return;
                    }
                    this.setTime(time);
                    this._isDead = true;
                    this.hasRefreshTxt.visible = false;
                    this.remainTime.visible = true;
                    Laya.timer.loop(1000, this, this.loopHandler);
                } else if (!info[BossStateFields.dead] && this._isDead) {
                    this._isDead = false;
                    this.hasRefreshTxt.visible = true;
                    this.remainTime.visible = false;
                }
            }
        }

        private loopHandler(): void {
            let time = this._reviveTime - GlobalData.serverTime;
            if (time <= 0) {
                this.remainTime.visible = false;
                this.hasRefreshTxt.visible = true;
                Laya.timer.clear(this, this.loopHandler);
                return;
            }
            this.setTime(time);
        }

        private setTime(time: number): void {
            let hour = Math.floor(time / (60 * 60 * 1000));
            let miuter = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
            let sec = Math.floor((time % (60 * 1000)) / 1000);
            this.remainTime.text = this.formateData(hour) + ":" + this.formateData(miuter) + ":" + this.formateData(sec);
        }

        private formateData(input: number): string {
            let str: string = "";
            let t = input.toString();
            if (t.length < 2) {
                str = "0" + t;
                return str;
            }
            return t;
        }
    }
}