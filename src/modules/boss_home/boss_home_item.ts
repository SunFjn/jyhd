/** boss之家选择单元项*/


namespace modules.bossHome {
    import BossHomeItemUI = ui.BossHomeItemUI;
    import BossState = Protocols.BossState;
    import BossStateFields = Protocols.BossStateFields;
    import MonsterRes = Configuration.MonsterRes;
    import MonsterResFields = Configuration.MonsterResFields;
    import scene_home_boss = Configuration.scene_home_boss;
    import scene_home_bossFields = Configuration.scene_home_bossFields;
    import FollowBoss = Protocols.FollowBoss;
    import DungeonModel = modules.dungeon.DungeonModel;
    import FollowBossFields = Protocols.FollowBossFields;
    import BossInfo = Protocols.BossInfo;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import MonsterResCfg = modules.config.MonsterResCfg;

    export class BossHomeItem extends BossHomeItemUI {

        private _bossId: number;
        private _reviveTime: number;
        private _bossInfo: scene_home_boss;
        private _isDead: boolean;
        private _nowIndex: number = 0;

        protected initialize(): void {
            super.initialize();
            this._reviveTime = 0;
        }

        protected setSelected(value: boolean): void {
            super.setSelected(value);
            this.selectShow();
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_BOSS_UPDATE, this, this.updateTime);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MULTI_BOSS_FOLLOWS_UPDATE, this, this.followsUpdateHandler);
        }

        protected removeListeners(): void {
            Laya.timer.clear(this, this.loopHandler);
            super.removeListeners();
        }

        public close(): void {
            super.close();
            this.rpImg.visible = false;
        }
        public set nowIndex(value: number) {
            this._nowIndex = value
            this.image_bg.skin = `boss_home/image_boss_info${value + 1}.png`
        }

        protected setData(value: any): void {
            super.setData(value);
            this._bossInfo = value as scene_home_boss;
            this._bossId = this._bossInfo[scene_home_bossFields.occ];
            let cfg: MonsterRes = BossHomeModel.instance.getCfgByid(this._bossId);
            let skinName = cfg[MonsterResFields.icon];

            let monsterCfg = MonsterResCfg.instance.getCfgById(this._bossId);
            let skInfo = ExteriorSKCfg.instance.getCfgById(monsterCfg[MonsterResFields.res])

            if (skinName) {
                this.bossIconImg.skin = "assets/icon/bossImage/" + skInfo[ExteriorSKFields.portrayal] + ".png"; //设置boss头像
            } else {
                this.bossIconImg.skin = `assets/icon/monster/310001.png`;
            }
            this.bossName.text = cfg[MonsterResFields.name];
            // this.stageNum.text = "觉醒" + parseInt(this._bossInfo[scene_home_bossFields.equipTips]).toString() + "阶"; //设置boss装备阶数
            this._isDead = false;
            this.timeToRevive.visible = false;
            this.resurgence_bg.visible = false;
            this.resurgence_kunag.visible = false;
            this.resurgence_text.visible = false;
            // this.bossName.visible = true;
            this.updateTime();
            this.selectShow();
        }

        private updateTime(): void {
            Laya.timer.clear(this, this.loopHandler);
            let bossstate: Protocols.BossInfo = BossHomeModel.instance.getBossSeversInfoById(this._bossId);
            if (bossstate) {
                let info: BossState = bossstate[Protocols.BossInfoFields.bossState];
                if (info[BossStateFields.dead] && !this._isDead) {
                    this._reviveTime = info[BossStateFields.reviveTime];
                    let time = this._reviveTime - GlobalData.serverTime;
                    if (time <= 0) {
                        this.timeToRevive.visible = false;
                        this.resurgence_bg.visible = false;
                        this.resurgence_kunag.visible = false;
                        this.resurgence_text.visible = false;
                        // this.bossName.visible = true;
                        this.setResurgenceUI(false)
                        return;
                    }
                    this.setTime(time);
                    this._isDead = true;
                    this.timeToRevive.visible = true;
                    this.resurgence_bg.visible = true;
                    this.resurgence_kunag.visible = true;
                    this.resurgence_text.visible = true;
                    //this.bossName.visible = false;
                    Laya.timer.loop(1000, this, this.loopHandler);

                    this.setResurgenceUI(true)
                } else if (!info[BossStateFields.dead] && this._isDead) {
                    this._isDead = false;
                    this.timeToRevive.visible = false;
                    this.resurgence_bg.visible = false;
                    this.resurgence_kunag.visible = false;
                    this.resurgence_text.visible = false;
                    // this.bossName.visible = true;

                    this.setResurgenceUI(false)
                }
                this.checkRP();
            }
        }
        private setResurgenceUI(isShow: boolean) {
            this.resurgence_bg.visible = isShow;
            this.resurgence_kunag.visible = isShow;
            this.resurgence_text.visible = isShow;
        }

        private followsUpdateHandler(): void {
            this.checkRP();
        }

        private checkRP(): void {
            let flag: boolean = false;
            if (this._bossId && !this._isDead) {
                let bossInfo: BossInfo = DungeonModel.instance.getBossInfoById(this._bossId);
                if (bossInfo) {
                    let follow: FollowBoss = DungeonModel.instance.getFollowBossById(this._bossId);
                    if (follow && follow[FollowBossFields.follow]) {
                        flag = true;
                    }
                }
            }
            this.rpImg.visible = flag;
        }

        private selectShow(): void {
            if (this.selected) {
                this.unselectBtn.visible = false;
                this.selectBtn.visible = true;
            } else {
                this.unselectBtn.visible = true;
                this.selectBtn.visible = false;
            }
        }
        protected clickHandler(): void {
            BossHomeModel.instance.bossSeletIndex = this._nowIndex
            GlobalData.dispatcher.event(CommonEventType.BOSS_HOME_SELECT);
        }
        private setTime(time: number): void {
            let hour = Math.floor(time / (60 * 60 * 1000));
            let miuter = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
            let sec = Math.floor((time % (60 * 1000)) / 1000);
            this.timeToRevive.text = this.formateData(hour) + ":" + this.formateData(miuter) + ":" + this.formateData(sec);
        }

        private loopHandler(): void {
            let time = this._reviveTime - GlobalData.serverTime;
            if (time <= 0) {
                Laya.timer.clear(this, this.loopHandler);
                this.timeToRevive.visible = false;
                this.resurgence_bg.visible = false;
                this.resurgence_kunag.visible = false;
                this.resurgence_text.visible = false;
                // this.bossName.visible = true;
                return;
            }
            this.timeToRevive.visible = true;
            this.resurgence_bg.visible = true;
            this.resurgence_kunag.visible = true;
            this.resurgence_text.visible = true;
            // this.bossName.visible = false;
            this.setTime(time);
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